---
sidebar_position: 3
sidebar_label: Bollinger Bands
title: "Bollinger Bands: Add Bollinger Bands to a JavaScript or React Financial Chart | SciTrader.js"
description: "What Bollinger Bands are, how the middle, upper and lower bands are calculated, how to read squeezes and band touches, and how to add Bollinger Bands to a JavaScript or React financial chart with SciTrader.js."
keywords: ["Bollinger Bands", "Bollinger Bands indicator", "Bollinger Bands JavaScript", "Bollinger Bands React chart", "how to calculate Bollinger Bands", "Bollinger squeeze", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Bollinger Bands in a JavaScript or React Financial Chart

**Bollinger Bands** show a moving average of price with a band above and below it that widens and narrows with volatility. This page explains what Bollinger Bands are, how they are calculated and how traders read them, and shows how to add Bollinger Bands to a JavaScript or React financial chart with SciTrader.js's `BollingerBandsStudy`, with live examples you can edit in CodePen.

## What Are Bollinger Bands?

Bollinger Bands, developed by John Bollinger, are a **volatility indicator** drawn over the price:

- **The middle band** is a simple moving average of the close.
- **The upper and lower bands** sit a number of standard deviations above and below it.

When price swings widely, the standard deviation grows and the bands move apart; when price is quiet, they close in. Because they are prices, a chart draws Bollinger Bands on the price pane, over the candles.

## How Are Bollinger Bands Calculated?

Bollinger Bands use two settings: `period`, the number of candles (20 by default), and `stdDev`, the band width in standard deviations (2 by default). For each candle, over the last `period` closes:

$$
\begin{aligned}
\text{middle} &= \frac{1}{n} \sum_{i=1}^{n} \text{close}_i \\
\sigma &= \sqrt{\frac{1}{n} \sum_{i=1}^{n} \left(\text{close}_i - \text{middle}\right)^2} \\
\text{upper} &= \text{middle} + m\,\sigma \qquad \text{lower} = \text{middle} - m\,\sigma
\end{aligned}
$$

where $n$ is `period`, $m$ is `stdDev`, the middle band is the simple moving average of the last $n$ closes, and $\sigma$ is their standard deviation.

SciTrader divides by `period` (the population standard deviation), as Bollinger's original definition does. The bands start after `period` candles; SciTrader loads that many extra candles to the left of the visible period, so they start at the left edge.

With the default settings, if closes were normally distributed, about 95% of them would fall inside the bands. Real prices aren't normally distributed, so treat that as a rough guide.

## How to Read Bollinger Bands

These are the common readings. They are conventions traders use, not signals that hold every time:

- **The squeeze.** Narrow bands mean low volatility, which often comes before a large move. The bands don't say which way.
- **Band touches.** A close at or beyond the upper band shows strength, and at the lower band weakness. In a strong trend, price can "walk the band" for many candles, so a touch alone isn't a reversal signal.
- **The middle band.** In an uptrend, pullbacks often find support near the middle band; in a downtrend, rallies often stall there.

## How to Add Bollinger Bands to a JavaScript Financial Chart

Add a `BollingerBandsStudy` to the chart's `studies`. The example below is a BTC-USD chart from Coinbase with 20-candle, 2 standard deviation Bollinger Bands over the candles, the middle band in amber.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_BollingerBands/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_BollingerBands/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add Bollinger Bands to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="BollingerBandsChart" name="../../../_examples/indicators_BollingerBands/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_BollingerBands/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing Bollinger Bands at Runtime

`BollingerBandsStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, BollingerBandsStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new BollingerBandsStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.BBANDS));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## BollingerBandsStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `period` | 20 | Candles in the moving average and standard deviation |
| `stdDev` | 2 | How many standard deviations the bands sit from the middle band |
| `upperBandOptions`, `middleBandOptions`, `lowerBandOptions` | The theme's colours | Each band's line: `stroke`, `strokeThickness`, `strokeDashArray` |
| `bandFillOptions` | The theme's colours | The fill between the upper and lower bands |
| `paneId` | The price pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/):

| Study | Inputs | Styles |
| --- | --- | --- |
| `BollingerBandsStudy` | `period`, `stdDev` | `upperBandColor`, `lowerBandColor`, `middleBandColor`, `bandFillColor`, `strokeThickness` |

<details>
<summary>The IBollingerBandsOptions interface, with its TSDoc</summary>

```ts
interface IBollingerBandsOptions extends IStudyOptions {
    inputId?: DataSourceId;
    period?: number;
    stdDev?: number;
    upperBandOptions?: IFastLineRenderableSeriesOptions;
    lowerBandOptions?: IFastLineRenderableSeriesOptions;
    middleBandOptions?: IFastLineRenderableSeriesOptions;
    bandFillOptions?: IBaseBandRenderableSeriesOptions;
}
```

</details>

## Where to read next

- [Technical Indicators Reference](/financial-charts/studies-and-indicators/indicators/): the other indicators explained.
- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): add and remove indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
