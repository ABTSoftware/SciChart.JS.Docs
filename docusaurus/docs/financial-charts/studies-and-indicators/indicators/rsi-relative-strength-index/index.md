---
sidebar_position: 1
sidebar_label: RSI (Relative Strength Index)
title: "RSI Indicator: Add RSI to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the RSI (Relative Strength Index) indicator is, how RSI is calculated, how to read overbought and oversold levels, and how to add an RSI indicator to a JavaScript or React financial chart with SciTrader.js, with live examples."
keywords: ["RSI indicator", "relative strength index", "RSI JavaScript", "RSI React chart", "how to calculate RSI", "RSI overbought oversold", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# RSI Indicator: Relative Strength Index in a JavaScript or React Financial Chart

The **RSI (Relative Strength Index)** is one of the most widely used technical indicators. This page explains what the RSI indicator is, how it is calculated and how traders read it, and shows how to add an RSI indicator to a JavaScript or React financial chart with SciTrader.js's `RSIStudy`, with live examples you can edit in CodePen.

## What Is the RSI Indicator?

The RSI is a **momentum oscillator**, developed by J. Welles Wilder Jr. It measures how strongly price has been rising compared to how strongly it has been falling over recent candles, on a scale from 0 to 100:

- **Near 100**, the recent rises have far outweighed the falls.
- **Near 0**, the recent falls have far outweighed the rises.
- **Around 50**, rises and falls have been about even.

Because it has its own 0–100 scale, a chart draws the RSI in a pane of its own below the price chart, usually with lines at 70 and 30.

## How Is the RSI Calculated?

The RSI compares the average gain to the average loss over `length` candles, 14 by default:

1. **Gains and losses.** For each candle, the change is its close minus the previous close. A positive change is a gain (and a loss of 0); a negative change is a loss, as a positive number (and a gain of 0).
2. **First averages.** The first average gain is the simple average of the first `length` gains, and the same for losses.
3. **Wilder smoothing.** Each later average carries most of the previous one forward:

    $$
    \begin{aligned}
    \text{averageGain}_t &= \frac{\text{averageGain}_{t-1} \times (n - 1) + \text{gain}_t}{n} \\
    \text{averageLoss}_t &= \frac{\text{averageLoss}_{t-1} \times (n - 1) + \text{loss}_t}{n}
    \end{aligned}
    $$

    where $n$ is `length`.

4. **RS and RSI.** RS is the average gain divided by the average loss, and

    $$
    RS = \frac{\text{averageGain}}{\text{averageLoss}} \qquad RSI = 100 - \frac{100}{1 + RS}
    $$

    When there have been no losses at all, RSI is 100.

So the RSI has no value for the first `length` candles. SciTrader loads that many extra candles to the left of the visible period, so the line starts at the left edge of the chart.

## How to Read the RSI

These are the common readings. They are conventions traders use, not signals that hold every time:

- **Overbought and oversold.** Above 70 is commonly read as overbought: price has risen fast and may pause or pull back. Below 30 is read as oversold. In strong trends the RSI can stay overbought or oversold for a long time.
- **The 50 line.** An RSI holding above 50 suggests upward momentum; below 50, downward momentum.
- **Divergence.** When price makes a new high but the RSI makes a lower high, momentum is fading behind the move. The same applies to lows.

Some traders use 80 and 20 for fewer, stronger readings, or a shorter `length`, such as 7, for a faster, noisier RSI.

## How to Add an RSI Indicator to a JavaScript Financial Chart

Add an `RSIStudy` to the chart's `studies`. The example below is a BTC-USD chart from Coinbase, with a 14-candle RSI in its own pane, overbought and oversold levels at 70 and 30, and the RSI filled where it crosses them.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_RSI/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_RSI/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add an RSI Indicator to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="RsiChart" name="../../../_examples/indicators_RSI/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_RSI/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing the RSI Indicator at Runtime

`RSIStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, RSIStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new RSIStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.RSI));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## RSIStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `length` | 14 | Candles in the average gain and loss |
| `overbought` | 70 | The upper level, drawn as a dashed line |
| `oversold` | 30 | The lower level, drawn as a dashed line |
| `thresholdFills` | `"show"` | `"show"` fills the RSI beyond the levels; `"hide"` doesn't |
| `overboughtFill`, `oversoldFill` | The theme's colours | The fill colours beyond each level |
| `renderOptions` | The theme's colours | The RSI line: `stroke`, `strokeThickness`, `strokeDashArray` |
| `paneId` | A new pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, `length` is named `period`:

| Study | Inputs | Styles |
| --- | --- | --- |
| `RSIStudy` | `period`, `overbought`, `oversold` | `strokeColor`, `strokeThickness`, `strokeStyle`, `thresholdFills`, `overboughtFill`, `oversoldFill` |

<details>
<summary>The IRsiOptions interface, with its TSDoc</summary>

```ts
type TRsiThresholdFills = "show" | "hide";
interface IRsiOptions extends IStudyOptions {
    inputId?: DataSourceId;
    length?: number;
    renderOptions?: IFastLineRenderableSeriesOptions;
    /** Upper reference level. Defaults to 70. */
    overbought?: number;
    /** Lower reference level. Defaults to 30. */
    oversold?: number;
    /** Fill between the level and the line where RSI is above {@link overbought}. */
    overboughtFill?: string;
    /** Fill between the level and the line where RSI is below {@link oversold}. */
    oversoldFill?: string;
    thresholdFills?: TRsiThresholdFills;
}
```

</details>

## Where to read next

- [Technical Indicators Reference](/financial-charts/studies-and-indicators/indicators/): the other indicators explained.
- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): add and remove indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
