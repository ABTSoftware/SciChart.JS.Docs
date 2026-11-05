---
sidebar_position: 10
sidebar_label: Stochastic Oscillator
title: "Stochastic Oscillator: Add a Stochastic Indicator to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the Stochastic Oscillator indicator is, how %K and %D are calculated, how to read overbought, oversold and crossovers, and how to add a Stochastic indicator to a JavaScript or React financial chart with SciTrader.js."
keywords: ["stochastic oscillator", "stochastic indicator", "stochastic %K %D", "stochastic JavaScript", "stochastic React chart", "how to calculate stochastic oscillator", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Stochastic Oscillator in a JavaScript or React Financial Chart

The **Stochastic Oscillator** shows where the latest close sits within the recent high–low range. This page explains what the Stochastic indicator is, how its %K and %D lines are calculated and how traders read them, and shows how to add a Stochastic Oscillator to a JavaScript or React financial chart with SciTrader.js's `StochasticStudy`, with live examples you can edit in CodePen.

:::info
The Stochastic Oscillator is one of the 32 built-in technical indicators and studies in the SciTrader SDK. For the full list, with each one's options and defaults, see [Every Built-in Indicator and Study](/financial-charts/studies-and-indicators/#the-catalogue). To add and remove any of them, or build an indicator picker, see [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/).
:::

## What Is the Stochastic Oscillator?

The Stochastic Oscillator, developed by George Lane, is a **momentum oscillator** on a scale from 0 to 100. It is drawn as two lines:

- **%K** is where the close sits in the range of the last `length` candles: 100 at the top of the range, 0 at the bottom.
- **%D** is a moving average of %K, a slower signal line.

The idea is that in an uptrend, closes tend to be near the top of the range, and in a downtrend near the bottom. It has its own 0–100 scale, so a chart draws it in a pane of its own below the price chart.

## How Is the Stochastic Oscillator Calculated?

With $n$ = `length` (14 by default) and $m$ = `signalPeriod` (3 by default):

$$
\%K = 100 \times \frac{\text{close} - \text{lowest low}_n}{\text{highest high}_n - \text{lowest low}_n}
\qquad
\%D = \text{SMA}_m(\%K)
$$

where the highest high and lowest low are over the last $n$ candles, including the latest, and $\text{SMA}_m$ is a simple moving average of the last $m$ %K values. If the range is zero, because every candle has the same price, %K is 0.

This is the **fast stochastic**: %K is used as it is. Many platforms default to the **slow stochastic**, which smooths %K with a 3-candle average first, so its lines are smoother than `StochasticStudy`'s.

%K starts after $n$ candles and %D after $n + m - 1$. SciTrader loads `length + signalPeriod` extra candles to the left of the visible period, so the lines start at the left edge.

## How to Read the Stochastic Oscillator

These are the common readings. They are conventions traders use, not signals that hold every time:

- **Overbought and oversold.** Above 80 is commonly read as overbought, and below 20 as oversold. In a strong trend, the Stochastic can stay there for a long time. `StochasticStudy` doesn't draw these levels; read them from the axis.
- **%K/%D crossovers.** %K crossing above %D is read as bullish, and below as bearish, especially in the oversold or overbought zones.
- **Divergence.** Price making a new low while the Stochastic makes a higher low suggests selling pressure is fading. The same applies to highs.

## How to Add a Stochastic Oscillator to a JavaScript Financial Chart

Add a `StochasticStudy` to the chart's `studies`. The example below is a 6-hour BTC-USD chart from Coinbase with a 14, 3 Stochastic Oscillator in its own pane: %K in teal and %D in amber.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_Stochastic/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_Stochastic/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add a Stochastic Oscillator to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="StochasticChart" name="../../../_examples/indicators_Stochastic/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_Stochastic/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing the Stochastic Oscillator at Runtime

`StochasticStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, StochasticStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new StochasticStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.Stochastic));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## StochasticStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `length` | 14 | Candles in the high–low range %K is measured against |
| `signalPeriod` | 3 | The length of %D, the moving average of %K |
| `strokeK` | The theme's colour | The %K line |
| `strokeD` | The theme's colour | The %D line |
| `strokeThickness` | 2 | The thickness of both lines |
| `paneId` | A new pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, `length` is named `period`:

| Study | Inputs | Styles |
| --- | --- | --- |
| `StochasticStudy` | `period`, `signalPeriod` | `strokeK`, `strokeD`, `strokeThickness` |

<details>
<summary>The StochasticStudy class, with its TSDoc</summary>

```ts
/**
 * Stochastic Oscillator — %K and %D lines (0–100) on their own pane. HLC input.
 * Two outputs, so the output ids are created with distinct names (mirroring
 * MACD) — the {@link StudyBase.createOutputSourceId} helper is single-output
 * only (it would collide both ids on the same key).
 */
class StochasticStudy extends StudyBase<number> {
    /** Indicator pane — small relative weight (price pane defaults to 3×). */
    readonly paneSizeConfig: {
        grow: number;
    };
    length: number;
    signalPeriod: number;
    strokeK: string;
    strokeD: string;
    strokeThickness: number;
    getRequiredWarmup(): number;
    constructor(options?: IStochasticOptions);
    static getOptionsFromDescriptor(descriptor: TStudyDescriptor): IStochasticOptions;
    get supportsLiveApply(): boolean;
    createInputOutputIds(): void;
    createDataSeries(): void;
    createAxes(): AxisBase2D[];
    /** @inheritDoc */
    getLegendColor(outputId: DataSourceId): string | undefined;
    createRenderableSeries(): IRenderableSeries[];
}
```

</details>

<details>
<summary>The IStochasticOptions interface, with its TSDoc</summary>

```ts
interface IStochasticOptions extends IStudyOptions {
    length?: number;
    signalPeriod?: number;
    strokeK?: string;
    strokeD?: string;
    strokeThickness?: number;
}
```

</details>

## Where to read next

- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): the other indicators, adding and removing indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
