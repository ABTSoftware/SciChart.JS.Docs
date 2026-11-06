---
sidebar_position: 9
sidebar_label: ATR (Average True Range)
title: "ATR Indicator: Add Average True Range to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the ATR (Average True Range) indicator is, how true range and ATR are calculated, how traders use ATR for stops and position sizing, and how to add an ATR indicator to a JavaScript or React financial chart with SciTrader.js."
keywords: ["ATR indicator", "average true range", "true range", "ATR JavaScript", "ATR React chart", "how to calculate ATR", "ATR stop loss", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# ATR Indicator: Average True Range in a JavaScript or React Financial Chart

The **ATR (Average True Range)** measures volatility: how far price typically moves in one candle. This page explains what the ATR indicator is, how true range and ATR are calculated and how traders use them, and shows how to add an ATR indicator to a JavaScript or React financial chart with SciTrader.js's `ATRStudy`, with live examples you can edit in CodePen.

:::info
The ATR is one of the 32 built-in technical indicators and studies in the SciTrader SDK. For the full list, with each one's options and defaults, see [Every Built-in Indicator and Study](/financial-charts/studies-and-indicators/#the-catalogue). To add and remove any of them, or build an indicator picker, see [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/).
:::

## What Is the ATR Indicator?

The ATR, developed by J. Welles Wilder Jr., is the average size of each candle's **true range**: the candle's high-to-low range, stretched to include any gap from the previous close.

- **ATR is in price units.** An ATR of 80 on ETH-USD means a typical candle covers about $80.
- **ATR measures volatility, not direction.** It rises when candles get bigger, whether price is rising or falling.

ATR has its own scale, so a chart draws it in a pane of its own below the price chart.

## How Is the ATR Calculated?

1. **True range.** For each candle, the largest of: its high minus its low, the distance from the previous close up to its high, and the distance from the previous close down to its low. The last two count gaps between candles:

$$
\text{TR}_t = \max\left(\text{high}_t - \text{low}_t,\ \left|\text{high}_t - \text{close}_{t-1}\right|,\ \left|\text{low}_t - \text{close}_{t-1}\right|\right)
$$

2. **The average.** The first ATR is the simple average of the first $n$ true ranges, where $n$ is `length` (14 by default). Each later value is a Wilder average, moving $1/n$ of the way towards the latest true range:

$$
\text{ATR}_t = \text{ATR}_{t-1} + \frac{\text{TR}_t - \text{ATR}_{t-1}}{n} = \frac{(n - 1)\,\text{ATR}_{t-1} + \text{TR}_t}{n}
$$

The ATR starts after `length + 1` candles, because the first true range needs a previous close. SciTrader loads extra candles to the left of the visible period, so the line starts at the left edge.

## How to Use the ATR

These are the common uses. They are conventions traders use, not signals that hold every time:

- **Stop-loss placement.** A stop a multiple of ATR away from the entry, such as 2 × ATR, sits outside normal noise, and widens automatically when the market gets more volatile.
- **Position sizing.** Dividing the amount you are willing to risk by the ATR-based stop distance gives a position size that takes the same risk in quiet and volatile markets.
- **Volatility regime.** A rising ATR means volatility is expanding, often around breakouts or sell-offs; a falling ATR means the market is quieting down.
- **Comparing over time.** Because ATR is in price units, compare it with the price: an ATR of 2% of price is calmer than one of 6%.

## How to Add an ATR Indicator to a JavaScript Financial Chart

Add an `ATRStudy` to the chart's `studies`. The example below is a daily ETH-USD chart from Coinbase over six months, with a 14-day ATR in amber in its own pane.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_ATR/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_ATR/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add an ATR Indicator to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="AtrChart" name="../../../_examples/indicators_ATR/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_ATR/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing the ATR Indicator at Runtime

`ATRStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, ATRStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new ATRStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.ATR));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## ATRStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `length` | 14 | The smoothing length |
| `renderOptions` | The theme's colour | The ATR line: `stroke`, `strokeThickness`, `strokeDashArray` |
| `paneId` | A new pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, `length` is named `period`:

| Study | Inputs | Styles |
| --- | --- | --- |
| `ATRStudy` | `period` | `strokeColor`, `strokeThickness`, `strokeStyle` |

<details>
<summary>The ATRStudy class, with its TSDoc</summary>

```ts
/**
 * Average True Range — volatility oscillator over High/Low/Close, on its own
 * pane. Canonical HLC line-study pattern: `onDataChanged` reads the update type
 * from the Close entry (guaranteed present for HLC studies).
 */
class ATRStudy extends StudyBase<number> {
    /** Indicator pane — small relative weight (price pane defaults to 3×). */
    readonly paneSizeConfig: {
        grow: number;
    };
    length: number;
    readonly renderOptions: IFastLineRenderableSeriesOptions;
    getRequiredWarmup(): number;
    constructor(options?: IATROptions);
    static getOptionsFromDescriptor(descriptor: TStudyDescriptor): IATROptions;
    get supportsLiveApply(): boolean;
    createInputOutputIds(): void;
    createDataSeries(): void;
    createAxes(): AxisBase2D[];
    createRenderableSeries(): FastLineRenderableSeries[];
}
```

</details>

<details>
<summary>The IATROptions interface, with its TSDoc</summary>

```ts
interface IATROptions extends IStudyOptions {
    length?: number;
    renderOptions?: IFastLineRenderableSeriesOptions;
}
```

</details>

## Where to read next

- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): the other indicators, adding and removing indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
