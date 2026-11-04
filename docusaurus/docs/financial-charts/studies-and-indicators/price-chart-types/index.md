---
sidebar_position: 1.5
sidebar_label: Price Chart Types
title: "Candlestick, Heikin-Ashi, Renko & Point and Figure Charts | SciTrader.js"
description: "Draw a JavaScript or React trading chart as candlesticks, OHLC bars, a line, a mountain or Heikin-Ashi candles, switch between them at runtime, and add Renko and Point & Figure charts with SciTrader.js."
keywords: ["SciTrader", "SciTrader.js", "candlestick chart JavaScript", "Heikin-Ashi chart", "Renko chart JavaScript", "Point and Figure chart", "OHLC bar chart", "React candlestick chart", "setCandleType"]
---

# Price Chart Types: Candlestick, Heikin-Ashi, Renko and Point & Figure

A SciTrader chart can draw prices in seven ways. Five are **candle types**: styles of the price series itself, which you can switch at any time. Two, **Renko** and **Point & Figure**, plot price moves rather than time, so they are studies, each with a pane of its own.

| Price chart | How to get it | Plots |
| --- | --- | --- |
| Candlestick | `ECandleType.Candlestick` (the default) | Time: one candle per interval |
| OHLC bars | `ECandleType.OhlcBars` | Time: one bar per interval |
| Line | `ECandleType.Line` | Time: the close of each interval |
| Mountain | `ECandleType.Mountain` | Time: the close, filled to the axis |
| Heikin-Ashi | `ECandleType.HeikinAshi` | Time: smoothed candles |
| Renko | `new RenkoStudy()` | Price: a brick for each move of a set size |
| Point & Figure | `new PointAndFigureStudy()` | Price: columns of X (rising) and O (falling) boxes |

## Candle Types: Candlestick, OHLC Bars, Line, Mountain and Heikin-Ashi {#candle-types}

The price study, `OHLCStudy`, draws the price series in any of the five candle types (`ECandleType`). **Heikin-Ashi** candles average each candle with the one before, which smooths out noise so trends are easier to see. Set the starting type on the study, and change it later with `setCandleType`:

```ts
import { ECandleType, OHLCStudy } from "scichart-scitrader";

new OHLCStudy({ candleType: ECandleType.HeikinAshi }); // the starting type
financeChartPanel.financeApi.setCandleType(ECandleType.OhlcBars); // change it later
```

`setCandleType` swaps the price series in place: data, zoom and studies are untouched. It raises `candleTypeChanged`, so a picker can follow changes made elsewhere. `CANDLE_TYPE_MENU_ITEMS` lists the types with their labels, and the ready-made [Candle Type Selector](/financial-charts/ui-components/candle-type-selector/) is a picker for them.

The candle type is also a setting of the price study, so users can change it in the [Settings Form](/financial-charts/studies-and-indicators/altering-study-settings/), and it is [saved with the chart](/financial-charts/save-and-restore/).

## Renko and Point & Figure Charts {#renko-and-point-and-figure}

Renko and Point & Figure charts ignore time. A new brick or column appears only when price moves far enough, however long that takes, which filters out small moves. So they are studies, not candle types: each draws in a pane of its own, below the price pane, with a category (index) axis.

```ts
import { PointAndFigureStudy, RenkoStudy } from "scichart-scitrader";

await financeChartPanel.financeApi.attachStudy(new RenkoStudy({ reversalAmount: 2 }));
await financeChartPanel.financeApi.attachStudy(new PointAndFigureStudy({ boxSize: 5, reversalAmount: 3 }));
```

| Study | Option | Default | What it does |
| --- | --- | --- | --- |
| `RenkoStudy` | `brickSize` | Sized from the price range | The price move each brick stands for |
| `RenkoStudy` | `reversalAmount` | 2 | Bricks of opposite move needed to reverse direction |
| `PointAndFigureStudy` | `boxSize` | Sized from the price range | The price move each X or O box stands for |
| `PointAndFigureStudy` | `reversalAmount` | 3 | Boxes of opposite move needed to start a new column |

Add them like any other study, when the chart is created or at runtime; see [Add Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/).

## TypeScript Example: Heikin-Ashi, Renko and Point & Figure Charts

An ETH-USD daily chart from Coinbase, drawn with Heikin-Ashi candles and a Renko pane below. The selector changes the candle type, and the buttons swap the Renko pane for a Point & Figure pane, or remove it.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/studies_PriceChartTypes/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/studies_PriceChartTypes/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Heikin-Ashi, Renko and Point & Figure Charts

The same chart in React, with the React `CandleTypeSelector` from `scichart-scitrader-react`.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="PriceChartTypes" name="../../_examples/studies_PriceChartTypes/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/studies_PriceChartTypes/react.tsx
    ```
</CodeSnippetBlock>

## SciFinanceChart Candle Type API

| Member | What it does |
| --- | --- |
| `setCandleType(type)` | Changes the price series' candle type in place |
| `getCandleType()` | The current candle type |
| `candleTypeChanged` | Fires after the candle type changes, with the new type |

<details>
<summary>SciFinanceChart.setCandleType, getCandleType and candleTypeChanged, and the ECandleType enum, with their TSDoc</summary>

```ts
/**
 * Change the price series rendering style (candlestick, OHLC bars, line,
 * mountain or Heikin-Ashi). Delegates to the default-pane
 * OHLC study, which swaps its renderable series in place (preserving data /
 * zoom / pan). No-op if there is no price study. Raises {@link candleTypeChanged}.
 */
setCandleType(type: ECandleType): void;

/** The current price rendering style. Defaults to candlestick when no price study exists. */
getCandleType(): ECandleType;

/**
 * Fires when the price series rendering style changes via {@link setCandleType}.
 * Carries the new {@link ECandleType} so UI controls can reflect external changes.
 */
candleTypeChanged: EventHandler<ECandleType>;

/**
 * The rendering style for the main price series of a finance chart.
 *
 * Candlestick / OhlcBars / Line / Mountain bind directly to the raw
 * {@link OhlcDataSeries}; HeikinAshi is derived via a `scichart-financial-tools`
 * filter (see {@link createPriceSeries}). All are **time-domain** — one mark per
 * time slot, on the price pane's shared time axis.
 *
 * Renko and Point & Figure are NOT candle types — they remap X off the time
 * domain (price-driven bricks / columns) and ship as their own studies
 * (`RenkoStudy` / `PointAndFigureStudy`) on dedicated `CategoryAxis` panes.
 *
 * String values (not numeric) so the choice round-trips cleanly through the
 * study descriptor / `toJSON` serialization and the `?candleType=` URL param.
 */
enum ECandleType {
    Candlestick = "Candlestick",
    OhlcBars = "OhlcBars",
    Line = "Line",
    Mountain = "Mountain",
    HeikinAshi = "HeikinAshi"
}
```

</details>

## Where to read next

- [Candle Type Selector](/financial-charts/ui-components/candle-type-selector/): a ready-made candle type picker.
- [Technical Indicators and Studies](/financial-charts/studies-and-indicators/): every indicator you can add to the chart.
- [Add Indicators to a Financial Chart](/financial-charts/studies-and-indicators/add-indicators/): add Renko, Point & Figure and indicators at runtime.
