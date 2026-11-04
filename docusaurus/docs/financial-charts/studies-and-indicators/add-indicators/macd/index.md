---
sidebar_position: 2
sidebar_label: MACD
title: "MACD Indicator: Add MACD to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the MACD (Moving Average Convergence/Divergence) indicator is, how MACD, its signal line and histogram are calculated, how to read crossovers, and how to add a MACD indicator to a JavaScript or React financial chart with SciTrader.js."
keywords: ["MACD indicator", "moving average convergence divergence", "MACD JavaScript", "MACD React chart", "how to calculate MACD", "MACD signal line", "MACD histogram", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# MACD Indicator: Moving Average Convergence/Divergence in a JavaScript or React Financial Chart

The **MACD (Moving Average Convergence/Divergence)** indicator shows the trend and momentum of price in one pane. This page explains what MACD is, how its line, signal line and histogram are calculated and how traders read them, and shows how to add a MACD indicator to a JavaScript or React financial chart with SciTrader.js's `MACDStudy`, with live examples you can edit in CodePen.

## What Is the MACD Indicator?

MACD, developed by Gerald Appel, tracks the gap between a fast and a slow moving average of the close. It has three parts:

- **The MACD line**: the fast average minus the slow average. It is above zero when the recent trend is up, and below zero when it is down.
- **The signal line**: a moving average of the MACD line, which smooths it.
- **The histogram**: the MACD line minus the signal line, drawn as columns. It shows when the two lines are converging or diverging.

Because its values are differences in price, not prices, a chart draws MACD in a pane of its own below the price chart.

## How Is MACD Calculated?

MACD uses exponential moving averages (EMAs) of the close, with three lengths: `fast` (12 by default), `slow` (26) and `signal` (9):

$$
\begin{aligned}
\text{MACD line} &= \text{EMA}_{\text{fast}}(\text{close}) - \text{EMA}_{\text{slow}}(\text{close}) \\
\text{signal line} &= \text{EMA}_{\text{signal}}(\text{MACD line}) \\
\text{histogram} &= \text{MACD line} - \text{signal line}
\end{aligned}
$$

An EMA weights recent candles more than older ones. Each value moves part of the way towards the latest close:

$$
k = \frac{2}{n + 1} \qquad \text{EMA}_t = (\text{close}_t - \text{EMA}_{t-1}) \times k + \text{EMA}_{t-1}
$$

where $n$ is the EMA's length. The first EMA value is the simple average of the first `length` closes. See [Moving Averages](/financial-charts/studies-and-indicators/add-indicators/moving-averages-sma-ema-wma/) for more.

The MACD line starts after `slow` candles, and the signal line and histogram after `slow + signal`, about 35 candles with the defaults. SciTrader loads that many extra candles to the left of the visible period, so the lines start at the left edge.

## How to Read MACD

These are the common readings. They are conventions traders use, not signals that hold every time:

- **Signal line crossovers.** The MACD line crossing above its signal line is commonly read as bullish, and crossing below as bearish. The histogram changes sign at the same moment.
- **Zero line crossovers.** The MACD line crossing zero means the fast average has crossed the slow one: a change in the trend.
- **The histogram.** Growing columns mean momentum is building; shrinking columns mean it is fading, often before a crossover.
- **Divergence.** Price making a new high while MACD makes a lower high suggests the move is losing strength.

## How to Add a MACD Indicator to a JavaScript Financial Chart

Add a `MACDStudy` to the chart's `studies`. The example below is an ETH-USD chart from Coinbase with a 12, 26, 9 MACD in its own pane: the MACD line in teal, the signal line in amber, and the histogram green above zero and red below.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_MACD/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_MACD/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add a MACD Indicator to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="MacdChart" name="../../../_examples/indicators_MACD/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_MACD/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing the MACD Indicator at Runtime

`MACDStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, MACDStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new MACDStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.MACD));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## MACDStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `fast` | 12 | Length of the fast EMA |
| `slow` | 26 | Length of the slow EMA |
| `signal` | 9 | Length of the signal line's EMA |
| `bandOptions` | The theme's colours | The MACD and signal lines: `stroke` is the MACD line, `strokeY1` the signal line, and `fill` / `fillY1` shade between them |
| `columnOptions` | (none) | The histogram's columns, e.g. `dataPointWidth` |
| `histogramAboveZero`, `histogramBelowZero` | The theme's colours | The histogram's colours above and below zero |
| `paneId` | A new pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, the MACD line colour is `bandMacdColor` and the signal line colour `bandSignalColor`:

| Study | Inputs | Styles |
| --- | --- | --- |
| `MACDStudy` | `fast`, `slow`, `signal` | `histogramAboveZero`, `histogramBelowZero`, `bandMacdColor`, `bandSignalColor`, `fillMacdAboveSignal`, `fillMacdBelowSignal`, `strokeThickness` |

<details>
<summary>The IMACDOptions interface, with its TSDoc</summary>

```ts
interface IMACDOptions extends IStudyOptions {
    inputId?: DataSourceId;
    fast?: number;
    slow?: number;
    signal?: number;
    bandOptions?: IBandRenderableSeriesOptions;
    columnOptions?: IColumnRenderableSeriesOptions;
    /** Histogram fill for bars above zero. Defaults to {@link DEFAULT_HISTOGRAM_ABOVE_ZERO}. */
    histogramAboveZero?: string;
    /** Histogram fill for bars below zero. Defaults to {@link DEFAULT_HISTOGRAM_BELOW_ZERO}. */
    histogramBelowZero?: string;
}
```

</details>

## Where to read next

- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): the other indicators, adding and removing indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
