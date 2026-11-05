---
sidebar_position: 5
sidebar_label: VWAP (Volume Weighted Average Price)
title: "VWAP Indicator: Add VWAP to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the VWAP (Volume Weighted Average Price) indicator is, how VWAP is calculated, how traders use it, and how to add a VWAP indicator to a JavaScript or React financial chart with SciTrader.js, with live examples."
keywords: ["VWAP", "VWAP indicator", "volume weighted average price", "VWAP JavaScript", "VWAP React chart", "how to calculate VWAP", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# VWAP Indicator: Volume Weighted Average Price in a JavaScript or React Financial Chart

The **VWAP (Volume Weighted Average Price)** is the average price an asset has traded at, weighted by how much traded at each price. This page explains what the VWAP indicator is, how it is calculated and how traders use it, and shows how to add a VWAP indicator to a JavaScript or React financial chart with SciTrader.js's `VWAPStudy`, with live examples you can edit in CodePen.

:::info
VWAP is one of the 32 built-in technical indicators and studies in the SciTrader SDK. For the full list, with each one's options and defaults, see [Every Built-in Indicator and Study](/financial-charts/studies-and-indicators/#the-catalogue). To add and remove any of them, or build an indicator picker, see [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/).
:::

## What Is the VWAP Indicator?

VWAP answers the question "what has the average buyer paid?". Unlike a simple moving average, which counts every candle equally, VWAP gives more weight to candles where more volume traded, so it reflects where most of the trading actually happened.

- **Traders** use it as a fair-value line: price above VWAP suggests buyers are in control, below it sellers.
- **Institutions** use it as an execution benchmark: buying below VWAP, or selling above it, counts as a good fill.

VWAP is a price, so a chart draws it on the price pane, over the candles.

## How Is VWAP Calculated?

For each candle, take its **typical price**, the average of its high, low and close, and weight it by the candle's volume. VWAP is the running total of price × volume divided by the running total of volume:

$$
\text{typical price} = \frac{\text{high} + \text{low} + \text{close}}{3}
\qquad
\text{VWAP}_t = \frac{\sum_{i=1}^{t} \text{typical price}_i \times \text{volume}_i}{\sum_{i=1}^{t} \text{volume}_i}
$$

The sums start at the **anchor**, the candle VWAP is measured from. In SciTrader, `VWAPStudy` anchors at the **first loaded candle**:

- **It doesn't reset each session.** Many trading platforms restart VWAP at the start of each trading day (a session VWAP). SciTrader's runs on from the first candle loaded, like an anchored VWAP.
- **Loading history moves the anchor.** When older candles load as the user scrolls back, or old candles are dropped to save memory, VWAP is recalculated from the new first candle, so the whole line can shift.
- **It updates once per candle.** The latest value is recalculated when a new candle opens, not on every live tick.

VWAP has no length setting and no warm-up: it has a value from the first candle.

## How to Use VWAP

These are the common uses. They are conventions traders use, not signals that hold every time:

- **Trend bias.** Price holding above VWAP suggests an uptrend in the anchored period; below it, a downtrend.
- **Support and resistance.** Pullbacks often stall near VWAP, because many traders watch it.
- **Execution quality.** A buy below VWAP got a better-than-average price for the period; a sell above it did too.
- **Mean reversion.** Price far from VWAP may be stretched, and tends to drift back towards it in quiet markets.

VWAP suits shorter intervals best. Over long periods the cumulative sums change slowly, so the line flattens out.

## How to Add a VWAP Indicator to a JavaScript Financial Chart

Add a `VWAPStudy` to the chart's `studies`. The example below is a 5-minute BTC-USD chart from Coinbase over a day, with VWAP in amber over the candles. VWAP starts at the first loaded candle, which can be a little before the visible day, so the line may start below or above the first candles shown.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_VWAP/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_VWAP/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add a VWAP Indicator to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="VwapChart" name="../../../_examples/indicators_VWAP/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_VWAP/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing the VWAP Indicator at Runtime

`VWAPStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, VWAPStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new VWAPStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.VWAP));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## VWAPStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `renderOptions` | The theme's colour, 2px | The VWAP line: `stroke`, `strokeThickness`, `strokeDashArray` |
| `paneId` | The price pane | The pane to draw in |

VWAP has no inputs to set. Users can change its line in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change it from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/):

| Study | Inputs | Styles |
| --- | --- | --- |
| `VWAPStudy` | (none) | `strokeColor`, `strokeThickness`, `strokeStyle` |

<details>
<summary>The VWAPStudy class, with its TSDoc</summary>

```ts
/**
 * Volume Weighted Average Price — cumulative overlay on the price pane (shares
 * the OHLC y-axis). H/L/C/V input, no period; resets on Replace (a new
 * instrument starts a fresh cumulative window). Warm-up is 0.
 */
class VWAPStudy extends StudyBase<number> {
    readonly renderOptions: IFastLineRenderableSeriesOptions;
    getRequiredWarmup(): number;
    constructor(options?: IVWAPOptions);
    static getOptionsFromDescriptor(descriptor: TStudyDescriptor): IVWAPOptions;
    get supportsLiveApply(): boolean;
    createInputOutputIds(): void;
    createDataSeries(): void;
    createAxes(): AxisBase2D[];
    createRenderableSeries(): FastLineRenderableSeries[];
}
```

</details>

<details>
<summary>The IVWAPOptions interface, with its TSDoc</summary>

```ts
interface IVWAPOptions extends IStudyOptions {
    renderOptions?: IFastLineRenderableSeriesOptions;
}
```

</details>

## Where to read next

- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): the other indicators, adding and removing indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
