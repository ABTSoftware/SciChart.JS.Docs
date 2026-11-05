---
sidebar_position: 6
sidebar_label: Ichimoku Cloud
title: "Ichimoku Cloud: Add Ichimoku to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the Ichimoku Cloud (Ichimoku Kinko Hyo) indicator is, how its five lines and cloud are calculated, how to read it, and how to add an Ichimoku Cloud to a JavaScript or React financial chart with SciTrader.js."
keywords: ["Ichimoku Cloud", "Ichimoku indicator", "Ichimoku Kinko Hyo", "Ichimoku JavaScript", "Ichimoku React chart", "how to calculate Ichimoku", "Tenkan-sen Kijun-sen", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Ichimoku Cloud in a JavaScript or React Financial Chart

The **Ichimoku Cloud** (Ichimoku Kinko Hyo, "one-glance equilibrium chart") shows trend, momentum, and support and resistance in one overlay. This page explains what the Ichimoku Cloud is, how its five lines and cloud are calculated and how traders read them, and shows how to add an Ichimoku Cloud to a JavaScript or React financial chart with SciTrader.js's `IchimokuCloudStudy`, with live examples you can edit in CodePen.

:::info
The Ichimoku Cloud is one of the 32 built-in technical indicators and studies in the SciTrader SDK. For the full list, with each one's options and defaults, see [Every Built-in Indicator and Study](/financial-charts/studies-and-indicators/#the-catalogue). To add and remove any of them, or build an indicator picker, see [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/).
:::

## What Is the Ichimoku Cloud?

Ichimoku, developed by Goichi Hosoda, is drawn over the price as five lines, two of which bound a shaded **cloud** (kumo):

| Line | Japanese name | What it is |
| --- | --- | --- |
| Conversion line | Tenkan-sen | A fast midpoint of the recent range |
| Base line | Kijun-sen | A slower midpoint of the range |
| Leading span A | Senkou Span A | The average of the two lines above, shifted **forward** |
| Leading span B | Senkou Span B | A slow midpoint of the range, shifted **forward** |
| Lagging span | Chikou Span | The close, shifted **back** |

The cloud is the area between the two leading spans. Because they are shifted forward, the cloud extends past the latest candle: it projects where support and resistance may be.

Every line is a price, so a chart draws Ichimoku on the price pane, over the candles.

## How Is the Ichimoku Cloud Calculated?

Unlike most indicators, Ichimoku uses the **midpoint** of the range, (highest high + lowest low) / 2, not an average of closes. With the default periods of 9, 26 and 52 and a displacement of 26:

$$
\begin{aligned}
\text{Tenkan-sen} &= \frac{\text{highest high}_{9} + \text{lowest low}_{9}}{2} \\
\text{Kijun-sen} &= \frac{\text{highest high}_{26} + \text{lowest low}_{26}}{2} \\
\text{Senkou Span A} &= \frac{\text{Tenkan-sen} + \text{Kijun-sen}}{2} \quad \text{plotted 26 candles ahead} \\
\text{Senkou Span B} &= \frac{\text{highest high}_{52} + \text{lowest low}_{52}}{2} \quad \text{plotted 26 candles ahead} \\
\text{Chikou Span} &= \text{close} \quad \text{plotted 26 candles back}
\end{aligned}
$$

The three lookbacks are `conversionPeriod` (9), `basePeriod` (26) and `spanPeriod` (52); the shift is `displacement` (26). Senkou Span B needs 52 candles and is then shifted 26 ahead, so SciTrader loads `spanPeriod + displacement` (78) extra candles to the left of the visible period, so the cloud starts at the left edge.

:::tip
The cloud reaches 26 candles past the latest one, which is off the right of the chart when it opens. Pan or zoom out to the right to see it.
:::

## How to Read the Ichimoku Cloud

These are the common readings. They are conventions traders use, not signals that hold every time:

- **Price and the cloud.** Price above the cloud suggests an uptrend, below it a downtrend, and inside it no clear trend.
- **The cloud's colour.** Senkou Span A above Span B (a bullish cloud) suggests upward momentum ahead; B above A, downward.
- **The cloud's thickness.** A thick cloud is strong support or resistance; a thin one is easier to break through.
- **Tenkan/Kijun cross.** The conversion line crossing above the base line is read as bullish, and below as bearish. It counts for more when it happens above the cloud, or below it for a bearish cross.
- **The lagging span.** The Chikou Span above the price of 26 candles ago confirms an uptrend; below it, a downtrend.

On crypto markets, which trade every day, some traders use longer periods, such as 20, 60 and 120, in place of the original 9, 26 and 52, which were set for a six-day trading week.

## How to Add an Ichimoku Cloud to a JavaScript Financial Chart

Add an `IchimokuCloudStudy` to the chart's `studies`. The example below is a daily ETH-USD chart from Coinbase over a year, with the Ichimoku Cloud's five lines and cloud over the candles.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_IchimokuCloud/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_IchimokuCloud/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add an Ichimoku Cloud to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="IchimokuCloudChart" name="../../../_examples/indicators_IchimokuCloud/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_IchimokuCloud/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing the Ichimoku Cloud at Runtime

`IchimokuCloudStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, IchimokuCloudStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new IchimokuCloudStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.Ichimoku));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## IchimokuCloudStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `conversionPeriod` | 9 | Lookback of the Tenkan-sen (conversion line) |
| `basePeriod` | 26 | Lookback of the Kijun-sen (base line) |
| `spanPeriod` | 52 | Lookback of Senkou Span B |
| `displacement` | 26 | Candles the cloud is shifted forward, and the Chikou Span back |
| `tenkanOptions`, `kijunOptions`, `senkouAOptions`, `senkouBOptions`, `chikouOptions` | The theme's colours, 1px | Each line: `stroke`, `strokeThickness`, `strokeDashArray` |
| `cloudFillOptions` | The theme's colours | The cloud's fill |
| `paneId` | The price pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, the cloud's two colours are `cloudBullishColor` and `cloudBearishColor`:

| Study | Inputs | Styles |
| --- | --- | --- |
| `IchimokuCloudStudy` | `conversionPeriod`, `basePeriod`, `spanPeriod`, `displacement` | `tenkanColor`, `kijunColor`, `senkouAColor`, `senkouBColor`, `chikouColor`, `cloudBullishColor`, `cloudBearishColor`, `strokeThickness` |

<details>
<summary>The IchimokuCloudStudy class, with its TSDoc</summary>

```ts
/**
 * Ichimoku Cloud — full price-pane overlay. Five lines + a shaded cloud:
 *   • Tenkan-sen (conversion)  • Kijun-sen (base)  — plotted at the candle.
 *   • Senkou Span A/B + cloud  — plotted `displacement` bars INTO THE FUTURE.
 *   • Chikou (lagging close)   — plotted `displacement` bars INTO THE PAST.
 *
 * Component values are computed candle-aligned and stored in the DataManager;
 * displacement is applied to the render series' x-values. Forward x-slots beyond
 * the last candle are synthesised (`lastX + k·span`) — the price pane's CategoryAxis
 * aligns series by x-value and reserves forward space via `forwardHeadroomSec`.
 */
class IchimokuCloudStudy extends StudyBase<number> {
    conversionPeriod: number;
    basePeriod: number;
    spanPeriod: number;
    displacement: number;
    readonly tenkanOptions: IFastLineRenderableSeriesOptions;
    readonly kijunOptions: IFastLineRenderableSeriesOptions;
    readonly senkouAOptions: IFastLineRenderableSeriesOptions;
    readonly senkouBOptions: IFastLineRenderableSeriesOptions;
    readonly chikouOptions: IFastLineRenderableSeriesOptions;
    /**
     * Cloud shading. `fill` paints where y < y1 and `fillY1` where y1 < y — verified on
     * the chart, and what `IBaseBandRenderableSeriesOptions` documents. (Its sibling
     * `applyTheme` calls them up/down band colours, which reads the other way round.)
     * The series is filled `(x, senkouA, senkouB)`, so:
     *
     *   `fill`   → Senkou A BELOW B → bearish
     *   `fillY1` → Senkou A ABOVE B → bullish
     *
     * These two started out teal-on-`fill` / red-on-`fillY1`, which painted the bearish
     * half green and the bullish half red — inverted since the study was written.
     *
     * `stroke` / `strokeY1` are pinned transparent because an unset band stroke is not
     * "no line": SciChart's constructor defaults it to a theme colour, and the cloud
     * would then draw two edge lines directly under Senkou A and Senkou B that no
     * descriptor control can reach.
     */
    readonly cloudFillOptions: IBaseBandRenderableSeriesOptions;
    getRequiredWarmup(): number;
    constructor(options?: IIchimokuCloudOptions);
    static getOptionsFromDescriptor(descriptor: TStudyDescriptor): IIchimokuCloudOptions;
    get supportsLiveApply(): boolean;
    createInputOutputIds(): void;
    createDataSeries(): void;
    createAxes(): AxisBase2D[];
    /**
     * @inheritDoc
     *
     * Chikou has a line but no output column, and the cloud fill has neither, so
     * both are simply absent here.
     */
    getLegendColor(outputId: DataSourceId): string | undefined;
    createRenderableSeries(): IRenderableSeries[];
}
```

</details>

<details>
<summary>The IIchimokuCloudOptions interface, with its TSDoc</summary>

```ts
interface IIchimokuCloudOptions extends IStudyOptions {
    conversionPeriod?: number;
    basePeriod?: number;
    spanPeriod?: number;
    displacement?: number;
    tenkanOptions?: IFastLineRenderableSeriesOptions;
    kijunOptions?: IFastLineRenderableSeriesOptions;
    senkouAOptions?: IFastLineRenderableSeriesOptions;
    senkouBOptions?: IFastLineRenderableSeriesOptions;
    chikouOptions?: IFastLineRenderableSeriesOptions;
    cloudFillOptions?: IBaseBandRenderableSeriesOptions;
}
```

</details>

## Where to read next

- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): the other indicators, adding and removing indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
