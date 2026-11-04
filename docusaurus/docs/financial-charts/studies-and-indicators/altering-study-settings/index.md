---
sidebar_position: 3
sidebar_label: Altering Study Settings
title: "Altering Study Settings: Indicator Settings Form | SciTrader.js"
description: "Alter study and indicator settings in SciTrader.js trading charts, such as an RSI's period or a moving average's colour, from code or with the ready-made Settings Form and Study List, in plain TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "indicator settings", "study settings form", "StudySettingsForm", "StudyList", "applyDescriptor", "change RSI period", "React indicator settings"]
---

# Altering Study Settings

Every study's settings, such as an RSI's period and levels or a moving average's colour, can be changed while it is on the chart. This page covers altering study and indicator settings:

- **from code**, through the study's descriptor;
- **with the Settings Form** (`StudySettingsForm`), a form generated for any study, and the **Study List** (`StudyList`), which opens a form per study, in plain TypeScript and React.

Built-in studies apply the new settings in place: no data reloads, and the chart doesn't flash.

## Study Settings Are a Descriptor {#descriptors}

A study describes its settings as a **descriptor** (`TStudyDescriptor`), in two sections:

- **`inputs`**: what it calculates from, such as periods and levels;
- **`styles`**: how it looks, such as colours, line thickness and line style.

Each section is a set of named **controls**. A control has a `type` (number, colour, select…), a `label` for the form, and its current value in `default`:

```ts
const descriptor = rsi.getDescriptor();
descriptor.inputs.controls.period;
// { name: "period", type: "number", label: "Period", default: 14 }
descriptor.styles.controls.strokeColor;
// { name: "strokeColor", type: "color", label: "Stroke Color", default: "#…" }
```

| Method | What it does |
| --- | --- |
| `study.getDescriptor()` | The study's current settings |
| `study.applyDescriptor(descriptor)` | Applies settings to the live study |
| `study.getDefaultDescriptor()` | The settings the study had when first attached, for "reset to defaults" |
| `study.supportsLiveApply` | Whether `applyDescriptor` updates the study in place. `true` for every built-in study |
| `study.descriptorApplied` | Fires after `applyDescriptor`, with the settings applied |

The descriptor is also what [Save and Restore](/financial-charts/save-and-restore/) saves for each study, so edited settings are kept.

## Changing a Setting from Code with applyDescriptor

To change one setting, copy the study's descriptor with that one control's value changed, and apply the copy:

```ts
import { EDescriptorSectionName, IStudy } from "scichart-scitrader";

function setStudySetting(study: IStudy, section: EDescriptorSectionName, control: string, value: string | number) {
    const descriptor = study.getDescriptor();
    const controls = descriptor[section].controls;
    study.applyDescriptor({
        ...descriptor,
        [section]: { controls: { ...controls, [control]: { ...controls[control], default: value } } },
    });
}

setStudySetting(rsi, EDescriptorSectionName.INPUTS, "period", 7); // recalculates the RSI
setStudySetting(rsi, EDescriptorSectionName.STYLES, "strokeColor", "#ff9f1c"); // recolours its line
```

A colour edit applies to the chart's current theme only, and the study keeps the colours it was given under other themes; see [Styling and Themes](/financial-charts/styling-and-themes/).

To **reset a study to its defaults**, apply `getDefaultDescriptor()`:

```ts
for (const study of chart.studies) {
    study.applyDescriptor(study.getDefaultDescriptor());
}
```

### Settings Names of the Built-in Studies

Each study names its own controls. To see a study's, log `study.getDescriptor()`. For the built-in studies:

| Study | Inputs | Styles |
| --- | --- | --- |
| `ADXStudy` | `period` | `adxColor`, `pdiColor`, `mdiColor`, `strokeThickness` |
| `ATRStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `AwesomeOscillatorStudy` | (none) | `upColor`, `downColor` |
| `BollingerBandsStudy` | `period`, `stdDev` | `upperBandColor`, `lowerBandColor`, `middleBandColor`, `bandFillColor`, `strokeThickness` |
| `CCIStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `DonchianChannelsStudy` | `period` | `upperBandColor`, `lowerBandColor`, `channelFillColor`, `basisColor`, `strokeThickness` |
| `EMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `ForceIndexStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `IchimokuCloudStudy` | `conversionPeriod`, `basePeriod`, `spanPeriod`, `displacement` | `tenkanColor`, `kijunColor`, `senkouAColor`, `senkouBColor`, `chikouColor`, `cloudBullishColor`, `cloudBearishColor`, `strokeThickness` |
| `KeltnerChannelsStudy` | `maPeriod`, `atrPeriod`, `multiplier` | `upperBandColor`, `lowerBandColor`, `channelFillColor`, `basisColor`, `strokeThickness` |
| `LargeTradeStudy` | `threshold` | `buyColor`, `sellColor`, `strokeThickness` |
| `LineStudy` | (none) | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `MACDStudy` | `fast`, `slow`, `signal` | `histogramAboveZero`, `histogramBelowZero`, `bandMacdColor`, `bandSignalColor`, `fillMacdAboveSignal`, `fillMacdBelowSignal`, `strokeThickness` |
| `MFIStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `OBVStudy` | (none) | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `OHLCStudy` | `candleType` | `brushUp`, `brushDown`, `strokeUp`, `strokeDown`, `dataPointWidth` |
| `OrderBookHeatmapStudy` | `side` | `palette`, `scaleType`, `colorFromPct`, `colorToPct`, `opacity`, `minRowPx`, `ramp` |
| `OrderBookImbalanceStudy` | `method`, `pct` | `bidColor`, `askColor`, `fillStyle`, `fillOpacity`, `strokeThickness`, `gauge` |
| `PointAndFigureStudy` | `boxSize`, `reversalAmount` | (none) |
| `PSARStudy` | `step`, `max` | `dotColor`, `dotSize` |
| `RenkoStudy` | `brickSize`, `reversalAmount` | (none) |
| `ROCStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `RSIStudy` | `period`, `overbought`, `oversold` | `strokeColor`, `strokeThickness`, `strokeStyle`, `thresholdFills`, `overboughtFill`, `oversoldFill` |
| `SMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `StochasticStudy` | `period`, `signalPeriod` | `strokeK`, `strokeD`, `strokeThickness` |
| `TRIXStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `VolumeStudy` | (none) | `volumeUpColor`, `volumeDownColor`, `dataPointWidth` |
| `VolumeProfileStudy` | `binCount`, `rangeMode` | `fill`, `widthPercent`, `dataPointWidth`, `side`, `showPointOfControl`, `pointOfControlColor` |
| `VWAPStudy` | (none) | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `WilliamsRStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `WMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |

`strokeStyle` is `"solid"`, `"dashed"` or `"dotted"`.

## The Settings Form: StudySettingsForm {#settings-forms}

`StudySettingsForm` draws a study's descriptor as a form, with the field each control type needs:

| Control type (`EDescriptorType`) | Field |
| --- | --- |
| `NUMBER` | A number box |
| `TEXT` | A text box |
| `SELECT` | A dropdown of the control's `options` |
| `COLOR` | A [Colour Picker](/financial-charts/ui-components/colour-picker/), with opacity |
| `STROKE_TYPE` | A solid, dashed or dotted line-style dropdown |
| `GRADIENT` | A gradient editor: a colour ramp with a handle per stop |

Edits apply to the chart as they are made, `APPLY_DEBOUNCE_MS` (150 ms) after the last change, through `study.applyDescriptor`. Pass `onApply` to do something else with them. **Reset to defaults** applies `getDefaultDescriptor()`. When the study's settings change elsewhere, such as from code, the form shows the new values.

Every study gets a form this way, including [your own](/financial-charts/studies-and-indicators/creating-custom-studies/).

```ts
// Plain TypeScript
import { StudySettingsForm } from "scichart-scitrader";
const form = StudySettingsForm.create(container, { study: rsi });
form.destroy(); // when done
```

```tsx
// React
import { StudySettingsForm } from "scichart-scitrader-react";
<StudySettingsForm study={rsi} />
```

To show part of a form, pass `sectionFilter`, e.g. `[EDescriptorSectionName.INPUTS]` for the inputs only. `hideSectionLabels` leaves out the "Inputs" and "Styles" headings, for a page with tabs of its own.

## The Study List: StudyList

`StudyList` lists a chart's studies as cards. Clicking a card opens that study's settings form, one at a time, and × removes the study from the chart. The list follows `studiesChanged`, so studies added or removed elsewhere appear and disappear.

A study whose `supportsLiveApply` is `false` can't apply settings in place. For those, the list rebuilds the study with the new settings, through `studyProvider`, and swaps it in.

```ts
// Plain TypeScript
import { StudyList } from "scichart-scitrader";
const studyList = StudyList.create(sidePanel, { chart: financeChartPanel.financeApi, title: "Studies" });
studyList.expand(rsi.id); // open a study's settings from code; expand(null) closes them
```

```tsx
// React
import { StudyList } from "scichart-scitrader-react";
<StudyList chart={financeChartPanel.financeApi} title="Studies" />
```

## TypeScript Example: Altering Study Settings with StudyList and StudySettingsForm

A BTC-USD chart from Coinbase with Volume, SMA, Bollinger Bands and RSI.

- **Studies** on the right is a `StudyList`. Click a study to edit its settings; × removes it.
- **RSI inputs** below it is a `StudySettingsForm` of the RSI's inputs only.
- **RSI period 7, amber** changes two settings from code; an open form shows the new values.
- **Reset all to defaults** applies each study's `getDefaultDescriptor()`.
- **Open RSI settings** opens the RSI's card with `studyList.expand`.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader name="../../_examples/studies_StudySettings/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div style="display: flex; flex-direction: column; width: 320px"><div id="studies" style="flex: 1; min-height: 0; overflow-y: auto"></div><div id="rsi-inputs"></div></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/studies_StudySettings/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Altering Study Settings with StudyList and StudySettingsForm

The same chart in React, with the React `StudyList` and `StudySettingsForm` from `scichart-scitrader-react`. They need the chart's `financeApi`, so they render once `onInit` has stored it.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader reactComponent="StudySettingsChart" name="../../_examples/studies_StudySettings/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/studies_StudySettings/react.tsx
    ```
</CodeSnippetBlock>

## Styling the Settings Form and Study List

The form and list are plain DOM, styled by `scitrader.css` with these classes:

| Class | Element |
| --- | --- |
| `.st-study-form` | The form |
| `.st-study-form__section`, `.st-study-form__section-label` | An "Inputs" or "Styles" section, and its heading |
| `.st-study-form__footer`, `.st-study-form__reset` | The footer, and its **Reset to defaults** button |
| `.st-study-form__empty` | Shown for a study with no settings |
| `.st-study-list` | The list |
| `.st-study-list__title`, `.st-study-list__empty` | Its heading, and the message when the chart has no studies |
| `.st-study-list__items`, `.st-study-list__card` | The cards, and one card |
| `.st-study-list__header`, `.st-study-list__name`, `.st-study-list__chevron`, `.st-study-list__remove` | A card's header row: the study name, the open/close chevron and the × button |
| `.st-study-list__body` | An open card's settings form |

The fields inside a form are the SDK's shared fields: `.st-text-field` (number and text boxes), `.st-select-field` (dropdowns) and the [Colour Picker](/financial-charts/ui-components/colour-picker/)'s `.st-color-field`. Colours come from the `--st-ui-*` CSS variables, so a [theme](/financial-charts/styling-and-themes/) restyles them all. To change one thing, override its rule after importing `scitrader.css`:

```css
/* A narrower study list, with square cards */
.st-study-list__items { padding: 0 8px 8px; }
.st-study-list__card { border-radius: 0; }
```

<details>
<summary>The default settings form CSS (.st-study-form), from scitrader.css</summary>

```css
.st-study-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px;
    font-family: var(--st-font-family, "DM Sans", sans-serif);
}

.st-study-form__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.st-study-form__section-label {
    color: var(--st-ui-text-muted, #9da2bc);
    font-size: 12px;
    line-height: 1.66;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.st-study-form__empty {
    margin: 0;
    padding: 8px;
    color: var(--st-ui-text-muted, #9da2bc);
    font-size: 14px;
}

.st-study-form__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
}

.st-study-form__reset {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 5px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--st-ui-text-muted, #9da2bc);
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.75;
    cursor: pointer;
}

.st-study-form__reset:hover {
    color: var(--st-ui-text, #ffffff);
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.04);
}
```

</details>

<details>
<summary>The default study list CSS (.st-study-list), from scitrader.css</summary>

```css
.st-study-list {
    height: 100%;
    background: var(--st-ui-background, #2b2839);
    font-family: var(--st-font-family, "DM Sans", sans-serif);
}

.st-study-list__title {
    flex-shrink: 0;
    padding: 20px 24px 16px;
    color: var(--st-ui-text, #ffffff);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
}

.st-study-list__empty {
    margin: 0;
    padding: 0 24px;
    color: var(--st-ui-text-muted, #9da2bc);
    font-size: 14px;
    line-height: 1.43;
}

.st-study-list__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 16px 16px;
    scrollbar-width: thin;
    scrollbar-color: var(--st-ui-scrollbar-thumb, #4a4560) var(--st-ui-scrollbar-track, #1e1b2e);
}

.st-study-list__card {
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 6px;
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.03);
}

.st-study-list__header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    outline: none;
}

.st-study-list__header:hover,
.st-study-list__header:focus-visible {
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.04);
}

.st-study-list__chevron {
    display: inline-flex;
    color: var(--st-ui-text-muted, #9da2bc);
    transition: transform 160ms ease;
}

.st-study-list__header[aria-expanded="true"] .st-study-list__chevron {
    transform: rotate(180deg);
}

.st-study-list__name {
    flex: 1;
    margin-left: 8px;
    color: var(--st-ui-text, #ffffff);
    font-size: 14px;
}

.st-study-list__remove {
    display: inline-flex;
    padding: 5px;
    border: 0;
    border-radius: 50%;
    background: none;
    color: var(--st-ui-text-muted, #9da2bc);
    cursor: pointer;
}

.st-study-list__remove:hover {
    color: var(--st-ui-text, #ffffff);
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-study-list__body {
    padding: 8px 12px 12px;
}
```

</details>

## Study Descriptor API: IStudy Settings Members and Descriptor Types

<details>
<summary>IStudy.getDescriptor, getDefaultDescriptor, setDescriptor, applyDescriptor, supportsLiveApply and descriptorApplied, with their TSDoc</summary>

```ts
getDescriptor(): TStudyDescriptor;
/**
 * Returns the descriptor a freshly-constructed instance of this study
 * type would expose — i.e. constructor defaults, no user customisation.
 * Powers the per-study "Reset to defaults" form button and the batch
 * "Reset all study styles" header / More-tab actions. Does NOT mutate
 * this instance — callers are expected to feed the returned descriptor
 * into {@link applyDescriptor} (or hand it to the form draft, which
 * will fire its debounced apply for them).
 */
getDefaultDescriptor(): TStudyDescriptor;
setDescriptor(descriptor: TStudyDescriptor): void;
/**
 * Apply edits from an in-form descriptor onto this live study instance.
 * Concrete studies that override {@link IStudy.supportsLiveApply} to
 * return `true` mutate their renderable series / data series in place
 * (instant for style edits, recompute for input edits) — no detach,
 * no re-attach, no flash.
 *
 * Studies that haven't implemented live apply leave
 * {@link supportsLiveApply} as `false` (the default); callers detect that
 * and fall back to the legacy `detachStudy + getStudy(new) + attachStudy`
 * pipeline.
 */
applyDescriptor(descriptor: TStudyDescriptor): void;
/**
 * Whether {@link applyDescriptor} performs a real in-place update. When
 * `false`, the caller (e.g. the SDK's `StudyList`) falls back
 * to detach + re-instantiate. Default `false` on {@link StudyBase}; each
 * study opts in by overriding to return `true`.
 */
readonly supportsLiveApply: boolean;
/**
 * Fires after {@link applyDescriptor} has mutated the live study (whether
 * invoked by the form's debounced apply, the per-study "Reset to defaults"
 * button, or the batch "Reset all study styles" helper). The form
 * subscribes so it can re-sync its local draft state when an external
 * applyDescriptor lands — without this, the form keeps showing stale
 * values while the chart already reflects the new descriptor.
 */
readonly descriptorApplied: EventHandler<TStudyDescriptor>;
```

</details>

<details>
<summary>The TStudyDescriptor type, IuiDescriptor interface, and EDescriptorSectionName and EDescriptorType enums, with their TSDoc</summary>

```ts
interface IuiDescriptor {
    id?: string;
    name: string;
    type: string;
    label: string;
    default: string | number;
    options?: {
        value: string;
        label: string;
    }[];
}
interface IDescriptorControls {
    [key: string]: IuiDescriptor;
}
type TStudyDescriptor = {
    [Key in EDescriptorSectionName]: {
        controls: IDescriptorControls;
    };

enum EDescriptorSectionName {
    STYLES = "styles",
    INPUTS = "inputs"
}

enum EDescriptorType {
    TEXT = "text",
    NUMBER = "number",
    SELECT = "select",
    COLOR = "color",
    STROKE_TYPE = "stroke-type",
    /** A colour ramp: stops of colour and position, edited on a gradient bar. See {@link GradientDescriptor}. */
    GRADIENT = "gradient"
}
```

</details>

## StudySettingsForm API

| Member | What it does |
| --- | --- |
| `StudySettingsForm.create(container, options)` | Creates a form in `container` |
| `options.study` | The study whose settings it edits |
| `options.onApply` | Called with edited settings. Default: `study.applyDescriptor` |
| `options.sectionFilter` | Only these sections. Default: all |
| `options.hideSectionLabels` | Leaves out the section headings |
| `descriptor` | The settings as edited, which may not be applied yet |
| `update(options)` | Changes options; a different `study` reloads the form |
| `destroy()` | Removes the form. A change still waiting to apply is dropped |

<details>
<summary>The IStudySettingsFormOptions interface and StudySettingsForm class, with their TSDoc</summary>

````ts
/** Options for {@link StudySettingsForm}. */
interface IStudySettingsFormOptions {
    /** The study whose settings the form edits. */
    study: IStudy;
    /**
     * Called with the edited settings, {@link APPLY_DEBOUNCE_MS} after the user's last change.
     * Default: `study.applyDescriptor(descriptor)`, which updates the study in place. Pass your own
     * to do something else, e.g. rebuild a study that doesn't support in-place updates (see
     * {@link StudyList}).
     */
    onApply?: (study: IStudy, descriptor: TStudyDescriptor) => void;
    /** Only these sections (e.g. just the inputs). Default: every section the study has. */
    sectionFilter?: readonly EDescriptorSectionName[];
    /** Leave out the section headings, e.g. when the page already shows "Inputs" / "Styles" tabs. */
    hideSectionLabels?: boolean;
}

/** How long the form waits after the last change before applying it, in ms. */
const APPLY_DEBOUNCE_MS = 150;

/**
 * A study's settings form, in plain DOM, generated from its descriptor (`study.getDescriptor()`).
 * Each setting gets the field for its type: number and text boxes, dropdowns (including line
 * style), a colour picker with opacity, a gradient editor. Unknown types are skipped.
 *
 * Changes apply as you make them: {@link APPLY_DEBOUNCE_MS} after the last one, the form calls
 * `onApply` (by default `study.applyDescriptor`). "Reset to defaults" goes back to the study's
 * `getDefaultDescriptor()`. When the study's settings change from elsewhere (its
 * `descriptorApplied` event), the form shows them.
 *
 * Any study gets a form this way, including your own custom studies. The look is
 * `.st-study-form` in `scitrader.css`.
 *
 * ```ts
 * StudySettingsForm.create(panel, { study: chart.financeApi.studies[2] });
 * ```
 *
 * React apps use the React `StudySettingsForm`.
 */
class StudySettingsForm {
    /** The form, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IStudySettingsFormOptions): StudySettingsForm;
    /** The settings as edited, which may not be applied yet. */
    get descriptor(): TStudyDescriptor;
    /**
     * Change any of the options; the ones not given stay as they are. A different `study` reloads
     * the form from it.
     */
    update(options: Partial<IStudySettingsFormOptions>): void;
    /** Remove the form. A change still waiting to be applied is dropped. */
    destroy(): void;
}
````

</details>

## StudyList API

| Member | What it does |
| --- | --- |
| `StudyList.create(container, options)` | Creates a list in `container` |
| `options.chart` | The chart whose studies it lists: `financeChartPanel.financeApi` |
| `options.title` | A heading above the list |
| `options.emptyMessage` | Shown when the chart has no studies. Default `"No studies attached."` |
| `expand(studyId)` | Opens a study's settings; `expand(null)` closes them |
| `expandedStudyId` | The id of the study whose settings are open, or `null` |
| `update(options)` | Changes options |
| `destroy()` | Removes the list |

<details>
<summary>The IStudyListOptions interface and StudyList class, with their TSDoc</summary>

````ts
/** Options for {@link StudyList}. */
interface IStudyListOptions {
    /** The chart whose studies to list: `panel.financeApi`. */
    chart: SciFinanceChart;
    /** A heading above the list. Default: none. */
    title?: string;
    /** Shown when the chart has no studies. Default `"No studies attached."`. */
    emptyMessage?: string;
}

/**
 * The chart's studies as a list, in plain DOM. Click a study to open its {@link StudySettingsForm}
 * (one at a time); × removes it from the chart. The list follows the chart's `studiesChanged`, so
 * studies added or removed elsewhere appear and disappear.
 *
 * Settings apply in place when the study supports it (`supportsLiveApply`). Otherwise the study is
 * rebuilt with the new settings through `studyProvider` and swapped in. The look is
 * `.st-study-list` in `scitrader.css`.
 *
 * ```ts
 * StudyList.create(sidePanel, { chart: panel.financeApi, title: "Studies" });
 * ```
 *
 * React apps use the React `StudyList`.
 */
class StudyList {
    /** The list, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IStudyListOptions): StudyList;
    /** The id of the study whose settings are open, or `null`. */
    get expandedStudyId(): string | null;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<IStudyListOptions>): void;
    destroy(): void;
    /** Open one study's settings, or close them with `null`. */
    expand(studyId: string | null): void;
}
````

</details>

## StudySettingsForm and StudyList in React

The React components take the same options as props, plus `className` and `style` for their `<div>`. They have no `expand`; to open one study's settings in React, render its `StudySettingsForm`.

<details>
<summary>The React StudySettingsForm and StudyList components and their props, from scichart-scitrader-react, with their TSDoc</summary>

````ts
/** Props every React study-settings component takes besides its own. */
interface IHostProps {
    className?: string;
    style?: React.CSSProperties;
}

/** Props for {@link StudySettingsForm}. */
interface IStudySettingsFormProps extends IHostProps {
    /** The study whose settings the form edits. */
    study: IStudy;
    /** Called with the edited settings after a short pause. Default: `study.applyDescriptor`. */
    onApply?: (study: IStudy, descriptor: TStudyDescriptor) => void;
    /** Only these sections. Default: all. */
    sectionFilter?: readonly EDescriptorSectionName[];
    /** Leave out the section headings. */
    hideSectionLabels?: boolean;
}
/**
 * The SDK's study settings form in React: the vanilla `StudySettingsForm`, generated from the
 * study's descriptor, in a `<div>`. Edits apply to the chart as they are made.
 *
 * ```tsx
 * <StudySettingsForm study={chart.financeApi.studies[2]} />
 * ```
 */
function StudySettingsForm({ study, onApply, sectionFilter, hideSectionLabels, className, style, }: IStudySettingsFormProps): JSX.Element;

/** Props for {@link StudyList}. */
interface IStudyListProps extends IHostProps {
    /** The chart whose studies to list: `api.financeApi`. */
    chart: SciFinanceChart;
    /** A heading above the list. */
    title?: string;
    /** Shown when the chart has no studies. */
    emptyMessage?: string;
}
/**
 * The SDK's study list in React: the chart's studies, each opening its settings form, with ×
 * to remove. Follows studies added or removed elsewhere.
 *
 * ```tsx
 * <StudyList chart={api.financeApi} title="Studies" />
 * ```
 */
function StudyList({ chart, title, emptyMessage, className, style }: IStudyListProps): JSX.Element;
````

</details>

## Where to read next

- [Colour Picker](/financial-charts/ui-components/colour-picker/): the colour field the form uses, on its own.
- [Creating Custom Studies](/financial-charts/studies-and-indicators/creating-custom-studies/): give your own study a settings form.
- [Save and Restore](/financial-charts/save-and-restore/): settings are saved with the chart.
