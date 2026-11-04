---
sidebar_position: 4
sidebar_label: Moving Averages (SMA, EMA, WMA)
title: "Moving Averages (SMA, EMA, WMA): Add to a JavaScript or React Financial Chart | SciTrader.js"
description: "What simple, exponential and weighted moving averages (SMA, EMA, WMA) are, how each is calculated, how traders use crossovers, and how to add moving averages to a JavaScript or React financial chart with SciTrader.js."
keywords: ["moving average indicator", "SMA", "EMA", "WMA", "simple moving average", "exponential moving average", "weighted moving average", "moving average JavaScript", "moving average React chart", "how to calculate EMA", "golden cross", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Moving Averages (SMA, EMA, WMA) in a JavaScript or React Financial Chart

**Moving averages** smooth price into a line, so the trend is easier to see. SciTrader.js has three: the **SMA** (simple), the **EMA** (exponential) and the **WMA** (weighted). This page explains what each is, how each is calculated and how traders use them, and shows how to add moving averages to a JavaScript or React financial chart with SciTrader.js, with live examples you can edit in CodePen.

## What Is a Moving Average?

A moving average is the average close over the last `length` candles, recalculated at every candle, so it "moves" along the chart. It follows price with a lag: the longer the length, the smoother the line and the later it turns.

The three differ in how they weight the candles in the window:

| Moving average | Class | Weights | Reacts to new prices |
| --- | --- | --- | --- |
| SMA: Simple Moving Average | `SMAStudy` | Every candle equally | Slowest |
| WMA: Weighted Moving Average | `WMAStudy` | Linearly: the newest most, the oldest least | Faster |
| EMA: Exponential Moving Average | `EMAStudy` | Exponentially, with older candles never quite dropping out | Faster than the SMA, smooth |

Moving averages are prices, so a chart draws them on the price pane, over the candles.

## How Are Moving Averages Calculated?

Each uses the last $n$ closes, where $n$ is `length`, 14 by default; $\text{close}_n$ is the newest.

**SMA: Simple Moving Average.** The plain average:

$$
\text{SMA} = \frac{\text{close}_1 + \text{close}_2 + \dots + \text{close}_n}{n}
$$

**WMA: Weighted Moving Average.** Weights $1, 2, \dots, n$, from the oldest close to the newest, divided by the sum of the weights:

$$
\text{WMA} = \frac{1 \cdot \text{close}_1 + 2 \cdot \text{close}_2 + \dots + n \cdot \text{close}_n}{n(n + 1)/2}
$$

**EMA: Exponential Moving Average.** Each value moves part of the way from the previous EMA towards the latest close. The first value is the SMA of the first $n$ closes:

$$
k = \frac{2}{n + 1} \qquad \text{EMA}_t = (\text{close}_t - \text{EMA}_{t-1}) \times k + \text{EMA}_{t-1}
$$

With $n = 20$, $k$ is about 0.095: each new close moves the EMA about 9.5% of the way towards it.

Each line starts after `length` candles. SciTrader loads that many extra candles to the left of the visible period, so the lines start at the left edge.

## How to Use Moving Averages

These are the common uses. They are conventions traders use, not signals that hold every time:

- **Trend direction.** Price above a rising moving average suggests an uptrend; below a falling one, a downtrend.
- **Crossovers.** A faster average crossing above a slower one is read as bullish, and below as bearish. With the 50- and 200-candle SMAs on a daily chart, these are known as the **golden cross** and **death cross**.
- **Support and resistance.** In a trend, pullbacks often stall near a well-watched average, such as the 20 EMA or the 50 SMA.
- **Choosing one.** The EMA and WMA turn sooner, but give more false signals in choppy markets; the SMA is steadier, but later.

## How to Add Moving Averages to a JavaScript Financial Chart

Add `SMAStudy`, `EMAStudy` and `WMAStudy` to the chart's `studies`, one for each line. The example below is a daily BTC-USD chart from Coinbase over a year, with a 50-day SMA in amber, a 20-day EMA in teal and a 10-day WMA in purple.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_MovingAverages/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_MovingAverages/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add Moving Averages to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="MovingAveragesChart" name="../../../_examples/indicators_MovingAverages/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_MovingAverages/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing Moving Averages at Runtime

`SMAStudy`, `EMAStudy` and `WMAStudy` are studies like any other, so you can add them to a chart that is already showing, and remove them again:

```ts
import { EMAStudy, EStudyType, SMAStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add a 200-day SMA, e.g. for a golden cross with the 50-day SMA
const sma200 = new SMAStudy({ length: 200, renderOptions: { stroke: "#ef5350" } });
await chart.attachStudy(sma200);

// Add an EMA by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.EMA));

// Remove the 200-day SMA
chart.detachStudy(sma200);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## SMAStudy, EMAStudy and WMAStudy Options and Settings

The three take the same options:

| Option | Default | What it does |
| --- | --- | --- |
| `length` | 14 | The number of candles averaged |
| `renderOptions` | The theme's colours | The line: `stroke`, `strokeThickness`, `strokeDashArray` |
| `paneId` | The price pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, `length` is named `period`:

| Study | Inputs | Styles |
| --- | --- | --- |
| `SMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `EMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |
| `WMAStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |

<details>
<summary>The ISMAOptions, IEMAOptions and IWMAOptions interfaces, with their TSDoc</summary>

```ts
interface ISMAOptions extends IStudyOptions {
    inputId?: DataSourceId;
    length?: number;
    renderOptions?: IFastLineRenderableSeriesOptions;
}

interface IEMAOptions extends IStudyOptions {
    inputId?: DataSourceId;
    length?: number;
    renderOptions?: IFastLineRenderableSeriesOptions;
}

interface IWMAOptions extends IStudyOptions {
    inputId?: DataSourceId;
    length?: number;
    renderOptions?: IFastLineRenderableSeriesOptions;
}
```

</details>

## Where to read next

- [Technical Indicators Reference](/financial-charts/studies-and-indicators/indicators/): the other indicators explained.
- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): add and remove indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
