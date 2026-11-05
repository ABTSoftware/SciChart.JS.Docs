---
sidebar_position: 4
sidebar_label: Creating Custom Studies
title: "Creating Custom Studies: Write Your Own Indicator | SciTrader.js"
description: "Create a custom technical indicator for SciTrader.js trading charts, step by step: extend StudyBase, calculate from candle data, draw it, keep it live, give it a settings form, and register it so it can be added by type and saved."
keywords: ["SciTrader", "SciTrader.js", "custom indicator", "custom study", "StudyBase", "write a technical indicator JavaScript", "React custom indicator", "studyProvider.registerStudy", "Z-Score indicator"]
---

# Creating Custom Studies

A custom study is an indicator of your own, which a SciTrader chart treats like the built-in ones. Once written, you can:

- add it to a chart from code, or by type from a study picker;
- edit its settings in the [Settings Form and Study List](/financial-charts/studies-and-indicators/altering-study-settings/);
- [save and restore](/financial-charts/save-and-restore/) it with the chart.

This page walks through a complete custom study, a **Z-Score** oscillator, which SciTrader doesn't have built in. The z-score is how many standard deviations the close is from its mean over the last `period` candles. Above +2, price is stretched high; below −2, stretched low. It draws in a pane of its own, with guide lines at +2, 0 and −2.

The [TypeScript](#typescript-example-a-custom-z-score-study) and [React](#react-example-a-custom-z-score-study) examples below run it on live Coinbase data.

## What a Study Implements

A study extends `StudyBase<T>`, where `T` is the type of value it reads (`number` for prices). The chart calls its methods in this order when it is attached:

| Step | Method | What it does |
| --- | --- | --- |
| 1 | `createInputOutputIds` | Says which data it reads (`inputIds`) and writes (`outputIds`) |
| 2 | `createDataSeries` | Creates the SciChart data series that hold its values for drawing |
| 3 | `createAxes` | Returns the Y axes of its pane. An overlay returns none and uses the price axis |
| 4 | `createRenderableSeries` | Returns the series that draw it, each bound to a data series |
| 5 | `onDataChanged` | Calculates its values whenever the input data changes, from the first load on |
| 6 | `onInitComplete` | Optional: anything to add once it has drawn, such as guide lines |

The other methods are optional, and make it a full citizen of the chart:

| Method | What it adds |
| --- | --- |
| `getRequiredWarmup` | Extra candles the chart loads to the left, so the line starts at the left edge |
| `configureDescriptor`, `static getOptionsFromDescriptor` | Its settings, for the settings form and for saving |
| `supportsLiveApply`, `onDescriptorApplied` | Applying edited settings in place, with no reload |
| `onThemeChanged` | Recolouring what isn't a setting, such as guide lines, when the theme changes |

The steps below build `ZScoreStudy` one piece at a time. The complete code is in the [examples](#typescript-example-a-custom-z-score-study).

## Step 1: A Study Type

Every study has a type: the key it is registered with, created by and saved under. Built-in studies use `EStudyType`. A custom study uses a string of its own:

```ts
const Z_SCORE = "ZScore" as EStudyType;
```

## Step 2: The Study's Options

Its options are its inputs and its styles. Extend `IStudyOptions`, which carries the pane placement and the colours per theme that every study saves:

```ts
interface IZScoreOptions extends IStudyOptions {
    /** Candles in the rolling window. Default 20 */
    period?: number;
    /** Where the guide lines go, in standard deviations from the mean. Default 2 */
    threshold?: number;
    /** Line colour. Default "#26c6da" */
    stroke?: string;
    /** Line thickness in pixels. Default 2 */
    strokeThickness?: number;
    /** "solid", "dashed" or "dotted". Default "solid" */
    strokeStyle?: string;
}
```

## Step 3: The Study Class and Its Pane

Extend `StudyBase<number>` and pass the base constructor three things: the type, the pane to draw in, and the options.

- An **oscillator** passes `PaneId.createUnique(type)`, for a new pane each time one is added.
- An **overlay** passes `PaneId.DEFAULT`, the price pane.

The user can still move it with the [`paneId`](/financial-charts/studies-and-indicators/#istudyoptions) option. `paneSizeConfig` sets the pane's height relative to the others; the price pane is `{ grow: 3 }`.

```ts
/**
 * Z-Score: how many standard deviations the close is from its `period`-candle mean.
 * Above `+threshold` price is stretched high; below `-threshold`, stretched low.
 * An oscillator, so it draws in a pane of its own, with guide lines at +threshold, 0 and -threshold.
 */
class ZScoreStudy extends StudyBase<number> {
    // Pane size relative to the others (the price pane is 3)
    public readonly paneSizeConfig = { grow: 1 };

    public period = 20;
    public threshold = 2;
    public stroke = "#26c6da";
    public strokeThickness = 2;
    public strokeStyle = "solid";

    private inputId: DataSourceId; // the close prices it reads
    private outputId: DataSourceId; // the z-scores it writes, which the legend shows
    private series: XyDataSeries;
    private line: FastLineRenderableSeries;
    private guideLines: HorizontalLineAnnotation[] = [];

    constructor(options?: IZScoreOptions) {
        // PaneId.createUnique: a new pane for every Z-Score added.
        // An overlay would pass PaneId.DEFAULT to share the price pane instead
        super(Z_SCORE, PaneId.createUnique(Z_SCORE), options);
        this.period = options?.period ?? this.period;
        this.threshold = options?.threshold ?? this.threshold;
        this.stroke = options?.stroke ?? this.stroke;
        this.strokeThickness = options?.strokeThickness ?? this.strokeThickness;
        this.strokeStyle = options?.strokeStyle ?? this.strokeStyle;
    }
```

**Warm-up.** A rolling-window indicator has no value for its first `period - 1` candles. `getRequiredWarmup` tells the chart, which loads that many extra candles to the left of the visible period, so the line starts at the left edge:

```ts
public getRequiredWarmup(): number {
    return this.period;
}
```

## Step 4: Inputs and Outputs, Data Series, Axes and Series

The chart calls these four in order as the study attaches.

**Inputs and outputs.** Data on a SciTrader chart lives in its data manager, as columns of values index-aligned with the candles, each named by a `DataSourceId`. `getInputSourceId(EDataSourceStringId.CLOSE)` is the default feed's close column; `OPEN`, `HIGH`, `LOW` and `VOLUME` work the same way. `createOutputSourceId` makes a column for the study's own values, which the legend shows under the name given:

```ts
public createInputOutputIds(): void {
    this.inputId = this.getInputSourceId(EDataSourceStringId.CLOSE);
    this.inputIds.push(this.inputId);
    this.outputId = this.createOutputSourceId("Z", this.inputId); // "Z" is its legend name
    this.outputIds.push(this.outputId);
}
```

To build an indicator on another study's output, such as a moving average of the RSI, read that study's `outputIds` instead.

**The data series** holds what is drawn:

```ts
public createDataSeries(): void {
    this.series = new XyDataSeries(this.wasmContext, { dataSeriesName: `Z-Score ${this.period}` });
}
```

**The axes** of its pane. Spread the chart's `axisDefaults` first, so the axis looks like the chart's other axes and follows its theme. An overlay returns `[]`:

```ts
public createAxes(): AxisBase2D[] {
    return [
        new NumericAxis(this.wasmContext, {
            ...this.parentFinanceChart.axisDefaults,
            axisAlignment: EAxisAlignment.Right,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            labelPrecision: 1,
            maxAutoTicks: 4,
        }),
    ];
}
```

**The renderable series**, each bound to a data series. Any SciChart renderable series works: lines, bands, columns, mountains, scatter. `STROKE_STYLE_TO_DASH_ARRAY` turns a line-style setting (`"solid"`, `"dashed"` or `"dotted"`) into SciChart's `strokeDashArray`:

```ts
public createRenderableSeries(): FastLineRenderableSeries[] {
    this.line = new FastLineRenderableSeries(this.wasmContext, {
        stroke: this.stroke,
        strokeThickness: this.strokeThickness,
        strokeDashArray: STROKE_STYLE_TO_DASH_ARRAY[this.strokeStyle],
    });
    this.line.dataSeries = this.series;
    return [this.line];
}
```

## Step 5: Calculating the Values and Keeping Them Live

`onDataChanged` is called with the first load and every change after it. The update says what changed, as an `EDataUpdateType`:

| `EDataUpdateType` | When | What the Z-Score does |
| --- | --- | --- |
| `Replace` | The first load, and a new symbol, interval or period | Recalculates everything |
| `Insert` | Older candles loaded as the user scrolls back | Recalculates everything |
| `Evict` | Candles dropped from either end to save memory | Recalculates everything |
| `Append` | A new candle opens | Recalculates everything |
| `Update` | A live tick changes the latest candle | Recalculates that one value |

Recalculating everything is simplest, and fast enough for a few thousand candles; a live tick, which can arrive many times a second, updates just the last value. Write the values to both the data series, which draws them, and the output column, which the legend reads. Keep the output index-aligned with the candles, with `NaN` where there is no value yet:

```ts
// (5) Step 5: keep up with the data. Called with the first load, history loaded as the user scrolls back
// (Insert), candles dropped to save memory (Evict), each new candle (Append) and each live tick (Update)
protected onDataChanged(update: TDataUpdate<number>): void {
    const change = update[this.inputId.id];
    const closes = this.dataManager.getValues<number>(this.inputId) ?? [];
    if (change?.updateType === EDataUpdateType.Update && change.startIndex < this.series.count()) {
        // A live tick changes the last candle's close: recompute that one value only
        const i = change.startIndex;
        const z = this.zScoreAt(closes, i);
        this.series.update(i, z);
        this.dataManager.updateValues([this.outputId], [z], i);
        return;
    }
    this.recalculate(closes);
}

// Recompute every value. The output is index-aligned with the candles, with NaN for the warm-up,
// so the legend reads the value of the candle under the cursor
private recalculate(closes: number[]) {
    const zScores = closes.map((_, i) => this.zScoreAt(closes, i));
    this.series.clear();
    this.series.appendRange(this.dataManager.xValues, zScores);
    this.dataManager.replaceValues([this.outputId], [zScores]);
}

private zScoreAt(closes: number[], i: number): number {
    if (i < this.period - 1) return NaN;
    const window = closes.slice(i - this.period + 1, i + 1);
    const mean = window.reduce((sum, c) => sum + c, 0) / this.period;
    const sd = Math.sqrt(window.reduce((sum, c) => sum + (c - mean) ** 2, 0) / this.period);
    return sd === 0 ? 0 : (closes[i] - mean) / sd;
}
```

## Step 6: Guide Lines and Theme Colours

Add guide lines and other annotations in `onInitComplete`, once the pane exists, with `addReferenceAnnotation`. It removes them when the study is detached.

:::warning
Don't add a study's annotations with `parentSurface.modifierAnnotations.add` directly. An annotation left on the chart after its study is detached outlives the study's axis, and crashes the chart's render loop. `addReferenceAnnotation` removes them for you.
:::

Colours that are settings, like the line colour, move between themes by themselves. Recolour anything else in `onThemeChanged`. `this.theme` is the chart's theme, and `theme.chart.referenceLine` is its guide-line colour:

```ts
// Step 6. Guide lines, once the pane exists. addReferenceAnnotation removes them when the study
// is detached; an annotation left behind outlives its axis and breaks the chart
protected onInitComplete(): void {
    this.guideLines = [this.threshold, 0, -this.threshold].map(
        (y) =>
            new HorizontalLineAnnotation({
                y1: y,
                stroke: this.theme.chart.referenceLine, // the chart theme's guide-line colour
                strokeThickness: 1,
                strokeDashArray: [4, 4],
                showLabel: false,
            })
    );
    this.addReferenceAnnotation(...this.guideLines);
}

// Colours that aren't settings, like the guide lines, follow the theme here.
// The line colour is a setting, so StudyBase moves it between themes for you
protected onThemeChanged(theme: ISciTraderTheme): void {
    this.guideLines.forEach((line) => (line.stroke = theme.chart.referenceLine));
}
```

## Step 7: Settings: the Descriptor

A study's settings are its **descriptor** (see [Study Settings Are a Descriptor](/financial-charts/studies-and-indicators/altering-study-settings/#descriptors)). Declare them in `configureDescriptor`, one control each, in the `INPUTS` or `STYLES` section. The descriptor classes are:

| Class | Settings field |
| --- | --- |
| `NumberDescriptor(name, label, value)` | A number box |
| `TextDescriptor(name, label, value)` | A text box |
| `ColorDescriptor(name, label, value)` | A colour picker, with opacity |
| `SelectDescriptor(name, label, value, options)` | A dropdown of `{ value, label }` options |
| `StrokeTypeDescriptor(name, label, value)` | A solid, dashed or dotted line-style dropdown |
| `GradientDescriptor(name, label, stops)` | A gradient editor |

The base class calls `configureDescriptor` every time the descriptor is read, so the values are always current. `getOptionsFromDescriptor` turns settings back into options; read controls with `?.` and a default, so settings saved by an older version of the study still load:

```ts
// Step 7. The settings form. Each control has a name, a label and its current value, in an
// "inputs" (what it calculates) or "styles" (how it looks) section. StudySettingsForm and
// StudyList draw the form from these, and toJSON saves them
protected configureDescriptor(): void {
    this.addDescriptor(EDescriptorSectionName.INPUTS, new NumberDescriptor("period", "Period", this.period));
    this.addDescriptor(EDescriptorSectionName.INPUTS, new NumberDescriptor("threshold", "Threshold (σ)", this.threshold));
    this.addDescriptor(EDescriptorSectionName.STYLES, new ColorDescriptor("strokeColor", "Line colour", this.stroke));
    this.addDescriptor(EDescriptorSectionName.STYLES, new NumberDescriptor("strokeThickness", "Line thickness", this.strokeThickness));
    this.addDescriptor(EDescriptorSectionName.STYLES, new StrokeTypeDescriptor("strokeStyle", "Line style", this.strokeStyle));
}

// The settings back to options: applyDescriptor calls this, and so does the registration below
// when a saved chart is restored. Optional chaining, so settings saved by an older version still load
public static getOptionsFromDescriptor(descriptor: TStudyDescriptor): IZScoreOptions {
    const inputs = descriptor.inputs.controls;
    const styles = descriptor.styles.controls;
    return {
        period: Number(inputs.period?.default ?? 20),
        threshold: Number(inputs.threshold?.default ?? 2),
        stroke: String(styles.strokeColor?.default ?? "#26c6da"),
        strokeThickness: Number(styles.strokeThickness?.default ?? 2),
        strokeStyle: String(styles.strokeStyle?.default ?? "solid"),
    };
}
```

## Step 8: Applying Edited Settings in Place

When the user edits a setting, the form calls `applyDescriptor`. `StudyBase` turns the descriptor into options with your `getOptionsFromDescriptor` and passes them to `onDescriptorApplied`. Return `true` from `supportsLiveApply`, and update the study there: restyle for a style change, recalculate for an input change.

Without it, `StudyList` removes the study and adds a new one with the new settings, which works but redraws the pane.

```ts
    // Step 8. Apply edited settings in place, with no reload. Without this (supportsLiveApply false),
    // StudyList rebuilds the study through studyProvider instead
    public get supportsLiveApply(): boolean {
        return true;
    }

    protected onDescriptorApplied(options: IZScoreOptions): void {
        this.stroke = this.line.stroke = options.stroke;
        this.strokeThickness = this.line.strokeThickness = options.strokeThickness;
        this.strokeStyle = options.strokeStyle;
        this.line.strokeDashArray = STROKE_STYLE_TO_DASH_ARRAY[options.strokeStyle];
        if (options.threshold !== this.threshold) {
            this.threshold = options.threshold;
            [this.guideLines[0].y1, this.guideLines[2].y1] = [this.threshold, -this.threshold];
        }
        if (options.period > 1 && options.period !== this.period) {
            this.period = options.period;
            this.series.dataSeriesName = `Z-Score ${this.period}`;
            this.recalculate(this.dataManager.getValues<number>(this.inputId) ?? []);
        }
    }
}
```

## Step 9: Registering the Study

Register the study with `studyProvider`, once, at app startup. Then:

- `studyProvider.getStudy("ZScore")` creates one, e.g. for a study picker;
- `SciFinanceChartPanel.fromJSON` can restore it from a saved chart, settings included.

`createStudy` is passed the saved settings, if there are any, and the saved options:

```ts
// Step 9. Register it, once, at app startup: studyProvider.getStudy("ZScore") can then create it
// (for a study picker), and fromJSON can restore it from a saved chart
studyProvider.registerStudy(Z_SCORE, {
    type: Z_SCORE,
    name: "Z-Score",
    description: "Standard deviations from the mean",
    createStudy: (descriptor, options) =>
        new ZScoreStudy({ ...options, ...(descriptor ? ZScoreStudy.getOptionsFromDescriptor(descriptor) : {}) }),
});
```

Using it is then the same as using a built-in study:

```ts
// When the chart is created
studies: [new OHLCStudy(), new ZScoreStudy({ period: 20, threshold: 2 })],

// At runtime, by type
await financeChartPanel.financeApi.attachStudy(studyProvider.getStudy(Z_SCORE));
```

To add it to a picker built on `STUDY_MENU_ITEMS` (see [Building a Technical Indicator Picker](/financial-charts/studies-and-indicators/add-indicators/#indicator-picker)), add an item for it:

```ts
const items = [
    ...STUDY_MENU_ITEMS,
    { type: Z_SCORE, label: "Z-Score", description: "Standard deviations from the mean", category: EStudyCategory.Momentum },
];
```

## TypeScript Example: A Custom Z-Score Study

A BTC-USD chart from Coinbase with a 20-candle Z-Score pane.

- **Studies** on the right is a `StudyList`. Click **Z-Score** to edit its settings, drawn from its descriptor: change the period, threshold, colour or line style, and the pane updates in place.
- **Add a Z-Score** adds another, by type, through `studyProvider`.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/studies_CustomStudyZScore/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div id="studies" style="width: 320px; overflow-y: auto"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/studies_CustomStudyZScore/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Custom Z-Score Study

The same study in a React app. The study class is plain TypeScript, the same as above; only the chart and the study list are React components.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="CustomStudyChart" name="../../_examples/studies_CustomStudyZScore/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/studies_CustomStudyZScore/react.tsx
    ```
</CodeSnippetBlock>

## Writing an Overlay Instead of an Oscillator

An overlay, such as a moving average, draws on the price pane against the price axis. It differs from the Z-Score in two places:

```ts
constructor(options?: IMyOverlayOptions) {
    super(MY_OVERLAY, PaneId.DEFAULT, options); // the price pane
}

public createAxes(): AxisBase2D[] {
    return []; // share the price axis
}
```

## StudyBase API for Custom Studies

`StudyBase` implements `IStudy`. These are the members a custom study implements, overrides and uses:

| Member | Kind | What it is for |
| --- | --- | --- |
| `createInputOutputIds`, `createDataSeries`, `createAxes`, `createRenderableSeries`, `onDataChanged` | Abstract | The five methods every study implements |
| `onInitComplete` | Override | Runs once the study has drawn its first data |
| `getRequiredWarmup` | Override | Candles needed before the first value. Default 0 |
| `configureDescriptor`, `onDescriptorApplied`, `supportsLiveApply` | Override | Settings, and applying them in place |
| `onThemeChanged` | Override | Recolour what isn't a setting |
| `getLegendColor` | Override | The colour of an output's value in the legend. Default: the line's stroke |
| `getInputSourceId`, `createOutputSourceId` | Helper | Input and output columns |
| `addReferenceAnnotation` | Helper | Guide lines that are removed with the study |
| `nanPad`, `valueAt`, `strokeForDataSeries` | Helper | Padding output to align with candles; reading a value; finding a series' stroke |
| `wasmContext`, `dataManager`, `parentFinanceChart`, `parentSurface`, `theme` | Context | Set when the study attaches: use them from `createDataSeries` onwards |

Their TSDoc is in one place, with the class hierarchy, on Technical Indicators and Studies:

- [The StudyBase class](/financial-charts/studies-and-indicators/#studybase): its public and protected members.
- [The IStudy interface](/financial-charts/studies-and-indicators/#istudy), which `StudyBase` implements.
- [The IStudyOptions interface](/financial-charts/studies-and-indicators/#istudyoptions), which a study's options extend.
- [The StudyRegistration type](/financial-charts/studies-and-indicators/add-indicators/#the-studyprovider-registry), with `studyProvider`, on Add Technical Indicators.

## Descriptor Classes

<details>
<summary>NumberDescriptor, TextDescriptor, ColorDescriptor, SelectDescriptor, StrokeTypeDescriptor and GradientDescriptor, with their TSDoc</summary>

```ts
class BaseDescriptor implements IuiDescriptor {
    name: string;
    type: string;
    label: string;
    default: string | number;
    constructor(uiDescriptor: IuiDescriptor);
}
class TextDescriptor extends BaseDescriptor {
    constructor(name: string, label: string, defaultValue: string);
}
class NumberDescriptor extends BaseDescriptor {
    constructor(name: string, label: string, defaultValue: number);
}
class ColorDescriptor extends BaseDescriptor {
    constructor(name: string, label: string, defaultValue: string);
}
type ISelectDescriptorOption = {
    value: string;
    label: string;
};
class SelectDescriptor extends BaseDescriptor {
    options: ISelectDescriptorOption[];
    constructor(name: string, label: string, defaultValue: string, options: ISelectDescriptorOption[]);
}
/**
 * Stroke-style descriptor — renders via the form's dedicated `STROKE_TYPE`
 * case which provides solid / dashed / dotted options out of the box, so
 * concrete studies don't need to repeat the option list.
 */
class StrokeTypeDescriptor extends BaseDescriptor {
    constructor(name: string, label: string, defaultValue: string);
}
/** One stop of a colour ramp: a colour, and where it sits along the ramp as a percentage (0–100). */
interface IGradientStopValue {
    color: string;
    atPct: number;
}
/**
 * A colour ramp, edited as one control: the form draws the ramp as a bar with a handle per stop —
 * drag a handle to move its stop, select it to change its colour.
 *
 * Carried as one string, `#rrggbbaa@pct;…`, because a descriptor value is one string. A control
 * per stop colour and another per position put twelve fields in the form for six stops.
 */
class GradientDescriptor extends BaseDescriptor {
    constructor(name: string, label: string, stops: readonly IGradientStopValue[]);
}
function formatGradient(stops: readonly IGradientStopValue[]): string;
/** Reads a ramp back; `undefined` unless every stop is `colour@number`. */
function parseGradient(value: unknown): IGradientStopValue[] | undefined;

/**
 * Map a stroke-style token (`"solid"`, `"dashed"`, `"dotted"`) onto the
 * `strokeDashArray` shape SciChart expects. `undefined` for solid lets the
 * renderer skip the dash pattern entirely.
 *
 * Extracted from the inline copies that previously lived in `RSIStudy`,
 * `SMAStudy`, and `LineStudy` (the comment in `SMAStudy` flagged this as the
 * first candidate for extraction once 3+ studies shared it — the 15 new
 * indicator studies push it well past that threshold).
 */
const STROKE_STYLE_TO_DASH_ARRAY: Record<string, number[] | undefined>;
/**
 * Inverse of {@link STROKE_STYLE_TO_DASH_ARRAY} — used by `configureDescriptor`
 * to initialise the stroke-style descriptor's default from whatever
 * `renderOptions.strokeDashArray` was passed in. Anything unknown falls back
 * to `"solid"`.
 */
function dashArrayToStrokeStyle(dashArray: number[] | undefined): string;
```

</details>

## Data Updates: EDataUpdateType and IDataManager

<details>
<summary>The EDataUpdateType enum, IDataUpdate interface and TDataUpdate type, with their TSDoc</summary>

```ts
enum EDataUpdateType {
    Replace = 0,
    Append = 1,
    Insert = 2,
    Update = 3,
    /**
     * Candles were removed from one or both ends of the source array
     *. `values` is an empty array (no new data); the
     * `eviction` field carries the per-edge drop counts. Subscribers that
     * mirror data into renderable series should shrink their copy
     * symmetrically; subscribers that recompute outputs from inputs (e.g.
     * indicator studies) can treat Evict like a Replace-shrunken — values
     * for surviving indices are unchanged, so no recomputation is needed
     * beyond keeping the output series the same length as the input.
     */
    Evict = 4
}
interface IDataUpdate<T> {
    id: DataSourceId;
    values: T[];
    updateType: EDataUpdateType;
    startIndex?: number;
    /**
     * Populated only for {@link EDataUpdateType.Evict}. Reports how many
     * elements were dropped from each edge of the source array, so
     * subscribers can mirror the eviction without recomputing indices.
     */
    eviction?: {
        leadingDrop: number;
        trailingDrop: number;
    };
}
type TDataUpdate<T> = Record<string, IDataUpdate<T>>;
```

</details>

<details>
<summary>The IDataManager interface, with its TSDoc</summary>

```ts
interface IDataManager {
    xId: DataSourceId;
    xValues: number[];
    yEntries: {
        id: DataSourceId;
        values: any[];
    }[];
    getSources(): DataSourceId[];
    getValues<T>(id: DataSourceId): T[];
    getSourceId(id: string): DataSourceId;
    getSourceIdByName(feedId: string, name: string): DataSourceId;
    getOrCreateSourceId(id: string, builder: () => DataSourceId): DataSourceId;
    replaceValues(ids: DataSourceId[], values: any[][]): void;
    appendValues(ids: DataSourceId[], values: any[][], startIndex: number): void;
    insertValues(ids: DataSourceId[], values: any[][], startIndex: number): void;
    updateValues(ids: DataSourceId[], values: any[], startIndex: number): void;
    /**
     * Drop `leadingCount` entries from the front and `trailingCount` from
     * the back of every registered source, emitting one `Evict` update per
     * source. Used to cap memory.
     */
    evict(leadingCount: number, trailingCount: number): void;
    observeChanges<T>(ids: DataSourceId[]): Observable<TDataUpdate<T>>;
    removeSources(ids: DataSourceId[]): void;
}
```

</details>

## Where to read next

- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): the Settings Form and Study List your study works with.
- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): add it at runtime, and to a picker.
- [Save and Restore](/financial-charts/save-and-restore/): restoring a chart with custom studies.
