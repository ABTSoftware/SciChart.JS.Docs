---
sidebar_position: 7
sidebar_label: Volume Profile
title: "Volume Profile: Add a Volume Profile to a JavaScript or React Financial Chart | SciTrader.js"
description: "What the Volume Profile indicator is, how volume by price and the point of control are calculated, how traders read high- and low-volume nodes, and how to add a Volume Profile to a JavaScript or React financial chart with SciTrader.js."
keywords: ["volume profile", "volume profile indicator", "volume by price", "point of control", "volume profile JavaScript", "volume profile React chart", "how to calculate volume profile", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Volume Profile in a JavaScript or React Financial Chart

A **Volume Profile** shows how much volume traded at each price, as horizontal bars beside the candles. This page explains what a Volume Profile is, how it and its point of control are calculated and how traders read it, and shows how to add a Volume Profile to a JavaScript or React financial chart with SciTrader.js's `VolumeProfileStudy`, with live examples you can edit in CodePen.

:::info
Volume Profile is one of the 32 built-in technical indicators and studies in the SciTrader SDK. For the full list, with each one's options and defaults, see [Every Built-in Indicator and Study](/financial-charts/studies-and-indicators/#the-catalogue). To add and remove any of them, or build an indicator picker, see [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/).
:::

## What Is a Volume Profile?

An ordinary volume study shows volume over **time**: one bar per candle. A Volume Profile shows volume over **price**: the price range is split into buckets, and each bar's length is the volume traded in that bucket. It shows where the market has done most of its business.

- **The point of control (POC)** is the price bucket with the most volume, drawn as a horizontal line.
- **High-volume nodes** are prices where a lot traded: areas the market accepted.
- **Low-volume nodes** are prices where little traded: areas price moved through quickly.

A Volume Profile is drawn on the price pane, its bars lined up with the price axis.

## How Is a Volume Profile Calculated?

SciTrader's `VolumeProfileStudy` builds the profile from the candles' high, low and volume:

1. **The price range** runs from the lowest low to the highest high of the candles used, and is split into `binCount` equal buckets, 40 by default.
2. **Each candle's volume is spread** over the buckets its high–low range covers, in proportion to how much of the range falls in each bucket. A candle whose range covers four buckets equally gives each a quarter of its volume.
3. **Each bar** is the total volume of its bucket.
4. **The point of control** is the bucket with the largest total.

With `rangeMode: "visible"` (the default), the candles used are the ones on screen, so the profile is recalculated as you pan and zoom. With `"all"`, it uses every loaded candle.

Exact volume at each price needs every trade; spreading each candle's volume over its range is the standard way to estimate it from candles. Some platforms also mark a **value area**, the range around the point of control that holds 70% of the volume. `VolumeProfileStudy` doesn't calculate one.

## How to Read a Volume Profile

These are the common readings. They are conventions traders use, not signals that hold every time:

- **The point of control as a magnet.** Price often returns to the POC, the "fairest" price of the period, and it often acts as support or resistance.
- **High-volume nodes** slow price down: the market has traded there a lot before, so it tends to pause or range.
- **Low-volume nodes** let price move fast: little has traded there, so price tends to pass through them quickly, and they can mark breakout levels.
- **Price leaving a high-volume area** with conviction can start a trend towards the next high-volume area.

## How to Add a Volume Profile to a JavaScript Financial Chart

Add a `VolumeProfileStudy` to the chart's `studies`. The example below is a 6-hour BTC-USD chart from Coinbase over three months, with a 40-bucket Volume Profile on the right of the price pane and its point of control. Pan and zoom: the profile follows the candles on screen.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../../_examples/indicators_VolumeProfile/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/indicators_VolumeProfile/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Add a Volume Profile to a React Financial Chart

In React, pass the same `studies` in the `config` of `SciFinanceChartView`, from `scichart-scitrader-react`. Create them in a `useMemo`, once per mounted chart: a study is a live object, bound to one chart.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="VolumeProfileChart" name="../../../_examples/indicators_VolumeProfile/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/indicators_VolumeProfile/react.tsx
    ```
</CodeSnippetBlock>

## Adding and Removing a Volume Profile at Runtime

`VolumeProfileStudy` is a study like any other, so you can add it to a chart that is already showing, and remove it again:

```ts
import { EStudyType, VolumeProfileStudy, studyProvider } from "scichart-scitrader";

const chart = financeChartPanel.financeApi;

// Add one with your own settings...
const study = new VolumeProfileStudy();
await chart.attachStudy(study);

// ...or by type, with the default settings, e.g. from an indicator picker
await chart.attachStudy(studyProvider.getStudy(EStudyType.VolumeProfile));

// Remove it
chart.detachStudy(study);
```

See [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/#add-and-remove-at-runtime) for more, including a ready-made indicator picker.

## VolumeProfileStudy Options and Settings

| Option | Default | What it does |
| --- | --- | --- |
| `binCount` | 40 | The number of price buckets |
| `rangeMode` | `"visible"` | `"visible"` uses the candles on screen and follows pan and zoom; `"all"` uses every loaded candle |
| `side` | `"right"` | The edge of the price pane the bars grow from: `"left"` or `"right"` |
| `widthFraction` | 0.25 | The fraction of the pane's width the longest bar spans, from 0 to 1 |
| `showPointOfControl` | `true` | Draws a line at the point of control |
| `pointOfControlColor` | The theme's colour | The point of control line's colour |
| `renderOptions` | The theme's colour | The bars: `fill`, and `dataPointWidth` (0.8) for the gap between them |
| `paneId` | The price pane | The pane to draw in |

Users can change the same settings in the [Settings Form](/financial-charts/ui-components/study-settings-form-and-study-list/), and you can change them from code with [`applyDescriptor`](/financial-charts/studies-and-indicators/altering-study-settings/). There, `widthFraction` is `widthPercent`, a percentage:

| Study | Inputs | Styles |
| --- | --- | --- |
| `VolumeProfileStudy` | `binCount`, `rangeMode` | `fill`, `widthPercent`, `dataPointWidth`, `side`, `showPointOfControl`, `pointOfControlColor` |

<details>
<summary>The IVolumeProfileOptions interface, with its TSDoc</summary>

```ts
/** Which candles feed the volume distribution. */
type TVolumeProfileRange = "visible" | "all";
/** Which edge of the price pane the profile bars are anchored to. */
type TVolumeProfileSide = "left" | "right";
interface IVolumeProfileOptions extends IStudyOptions {
    /** Number of price buckets the profile is divided into. Default {@link DEFAULT_BIN_COUNT}. */
    binCount?: number;
    /** `"visible"` recomputes as the user pans/zooms; `"all"` bins every loaded candle. */
    rangeMode?: TVolumeProfileRange;
    /** Pane edge the bars are anchored to. Default `"right"`. */
    side?: TVolumeProfileSide;
    /** Fraction of the pane width the largest bar spans (0 < f <= 1). Default {@link DEFAULT_WIDTH_FRACTION}. */
    widthFraction?: number;
    /** Column style — `fill` / `dataPointWidth` are the meaningful fields. */
    renderOptions?: IColumnRenderableSeriesOptions;
    /** Draw a horizontal line at the highest-volume price bucket. Default `true`. */
    showPointOfControl?: boolean;
    pointOfControlColor?: string;
}
```

</details>

## Where to read next

- [Add Technical Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): the other indicators, adding and removing indicators at runtime, and an indicator picker.
- [Altering Study Settings](/financial-charts/studies-and-indicators/altering-study-settings/): change an indicator's settings from code.
- [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/): let users edit them.
