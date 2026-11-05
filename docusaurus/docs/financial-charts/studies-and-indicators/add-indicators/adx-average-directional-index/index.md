---
sidebar_position: 8
sidebar_label: ADX (Average Directional Index)
title: "ADX Indicator: Add ADX to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the ADX (Average Directional Index) indicator is, how ADX, +DI and -DI are calculated, how to read trend strength, and how to add an ADX indicator to a JavaScript or React financial chart with SciTrader.js."
keywords: ["ADX indicator", "average directional index", "ADX +DI -DI", "directional movement index", "ADX JavaScript", "ADX React chart", "how to calculate ADX", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# ADX Indicator: Average Directional Index in a JavaScript or React Financial Chart

The **ADX (Average Directional Index)** measures how strong a trend is, whichever way it is going. This page explains what the ADX indicator is, how ADX and its +DI and −DI lines are calculated and how traders read them, and shows how to add an ADX indicator to a JavaScript or React financial chart with SciTrader.js's `ADXStudy`, with live examples you can edit in CodePen.

:::info
The ADX is one of the 32 built-in technical indicators and studies in the SciTrader SDK. For the full list, with each one's options and defaults, see [Every Built-in Indicator and Study](/financial-charts/studies-and-indicators/#the-catalogue). To add and remove any of them, or build an indicator picker, see [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/).
:::

## What Is the ADX Indicator?

The ADX, developed by J. Welles Wilder Jr. as part of his Directional Movement System, is drawn with two companion lines:

- **ADX** measures **trend strength**, from 0 to 100. It rises in a strong trend, up or down, and falls when the market is moving sideways.
- **+DI** (the positive directional indicator) measures upward movement.
- **−DI** (the negative directional indicator) measures downward movement.

So ADX says *how strong* the trend is, and +DI and −DI say *which way* it is going. They have their own scale, so a chart draws them in a pane of their own below the price chart.

## How Is the ADX Calculated?

The ADX is built in four steps, over `length` candles, 14 by default:

1. **Directional movement.** Compare each candle with the one before. Only the larger of the up move and the down move counts, and only if it is positive:

    $$
    \begin{aligned}
    \text{up} &= \text{high}_t - \text{high}_{t-1} \qquad \text{down} = \text{low}_{t-1} - \text{low}_t \\
    {+}\text{DM} &= \begin{cases} \text{up} & \text{if up} > \text{down and up} > 0 \\ 0 & \text{otherwise} \end{cases}
    \qquad
    {-}\text{DM} = \begin{cases} \text{down} & \text{if down} > \text{up and down} > 0 \\ 0 & \text{otherwise} \end{cases}
    \end{aligned}
    $$

2. **True range.** The candle's range, including any gap from the previous close; see [ATR](/financial-charts/studies-and-indicators/add-indicators/atr-average-true-range/).
3. **Wilder smoothing.** +DM, −DM and TR are each smoothed with Wilder's running sum, $S$. Its first value is the sum of the first $n$ values; each later one is

    $$
    S_t = S_{t-1} - \frac{S_{t-1}}{n} + x_t
    $$

    where $n$ is `length` and $x_t$ the latest value. Then

    $$
    {+}\text{DI} = 100 \times \frac{S({+}\text{DM})}{S(\text{TR})}
    \qquad
    {-}\text{DI} = 100 \times \frac{S({-}\text{DM})}{S(\text{TR})}
    \qquad
    \text{DX} = 100 \times \frac{\left|{+}\text{DI} - {-}\text{DI}\right|}{{+}\text{DI} + {-}\text{DI}}
    $$

4. **ADX** is the Wilder average of DX: the first value is the simple average of the first $n$ DX values, and each later one moves $1/n$ of the way towards the latest DX.

Because DX is smoothed again, the first ADX value needs about twice `length` candles. SciTrader loads extra candles to the left of the visible period, so the lines start at the left edge.

## How to Read the ADX

These are the common readings. They are conventions traders use, not signals that hold every time:

- **Trend strength.** ADX above 25 is commonly read as a trending market, and below 20 as weak or no trend. `ADXStudy` doesn't draw these levels; read them from the axis.
- **Rising or falling ADX.** A rising ADX means the trend is strengthening, whichever way it points; a falling ADX means it is weakening.
- **DI crossovers.** +DI crossing above −DI is read as bullish, and −DI crossing above +DI as bearish. Many traders act on them only when ADX shows a trend.
- **Choosing a strategy.** A high ADX favours trend-following; a low ADX favours range trading.

## How to Add an ADX Indicator to a JavaScript Financial Chart

Add an `ADXStudy` to the chart's `studies`. The example below is a 6-hour BTC-USD chart from Coinbase with a 14-candle ADX in its own pane: ADX in amber, +DI in green and −DI in red.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_ADX/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_ADX/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add an ADX Indicator to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="AdxChart" name="../../../_examples/indicators_ADX/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_ADX/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing the ADX Indicator at Runtime

`ADXStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, ADXStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new ADXStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.ADX));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## ADXStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `length` | 14 | The smoothing length of +DI, −DI and ADX |
| `adxColor` | The theme's colour | The ADX line |
| `pdiColor` | The theme's colour | The +DI line |
| `mdiColor` | The theme's colour | The −DI line |
| `strokeThickness` | 2 | The thickness of all three lines |
| `paneId` | A new pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, `length` is named `period`:

| Study | Inputs | Styles |
| --- | --- | --- |
| `ADXStudy` | `period` | `adxColor`, `pdiColor`, `mdiColor`, `strokeThickness` |

<details>
<summary>The IADXOptions interface, with its TSDoc</summary>

```ts
interface IADXOptions extends IStudyOptions {
    length?: number;
    adxColor?: string;
    pdiColor?: string;
    mdiColor?: string;
    strokeThickness?: number;
}
```

</details>

## Where to read next

- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): the other indicators, adding and removing indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
