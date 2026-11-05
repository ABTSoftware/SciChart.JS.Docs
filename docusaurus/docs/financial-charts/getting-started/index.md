---
sidebar_position: 3
sidebar_label: Getting Started
title: "Getting Started with SciTrader.js | JavaScript & React Trading Charts"
description: "Create your first JavaScript candlestick trading chart with SciTrader.js: register a data source, create a chart, then add indicators, drawing tools, your own data and a theme."
keywords: ["SciTrader", "SciTrader.js", "SciTrader getting started", "JavaScript trading chart tutorial", "React candlestick chart", "SciFinanceChartView"]
---

# Getting Started

## Before You Start

Follow [Installation](/financial-charts/installation/) first: it installs the packages, imports the stylesheet, and serves SciChart's WebAssembly with your bundler.

## Register a Data Source

Charts get their candles from an **exchange**, looked up by name. The SDK registers none by default. Register the ones your app uses once at startup, before any chart is created:

```ts
import {
    BinanceExchange,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
```

The second argument is the candle store. `idbPriceStore` caches downloaded candles in IndexedDB, so a reload draws straight away and fetches only what is new.

## Create a Chart

`SciFinanceChartPanel.create` builds a whole chart inside a DOM element: the price pane, a pane for each study that needs one, and a data feed for the symbol.

```ts
import {
    CandleInterval,
    CoinbaseExchange,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy
} from "scichart-scitrader";

const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
    symbol: "BTC-USD",
    interval: CandleInterval.ONE_HOUR,
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

The element needs a size: the chart fills it, and follows it when it resizes. Out of the box, the user can zoom with the wheel or a pinch, pan by dragging, load older candles by panning left, rescale an axis by dragging it, and double-click to fit. The legend and crosshair follow the mouse.

`create` resolves with the chart's API, called `financeChartPanel` in these docs. Its `financeApi` is the chart, with the methods in the sections below; `cleanup()` removes it.

The chart below is live, with Coinbase data. **Edit on CodePen** opens the code in CodePen.

<LiveDocSnippet maxWidth={"100%"} includeSciTrader name="../_examples/gettingStarted_CreateChart/vanilla" html={`<div id="chart" style="width: 100%; height: 100%"></div>`} />

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../_examples/gettingStarted_CreateChart/vanilla.ts
    ```
</CodeSnippetBlock>

**Using React?** `<SciFinanceChartView config={config} />`, from `scichart-scitrader-react`, takes the same config. [SciFinanceChart](/financial-charts/sci-finance-chart/) has a live React example.

## Next: the SciFinanceChart Component

[SciFinanceChart](/financial-charts/sci-finance-chart/) is the chart you just created, in full: in TypeScript and React, the pane sizes, maximising, hiding and autoranging panes in code, touch and mouse modes, its API and every config option.

## What Else You Can Do

Each section below is a short taste. `chart` is `financeChartPanel.financeApi`.

### Symbols, Intervals and Periods

Change what the chart shows: the symbol, the candle interval, and the period in view.

```ts
await chart.setSymbol("ETH-USD");
await chart.changeInterval(CandleInterval.ONE_DAY);
await chart.setPeriod("1Y");
```

See [Symbols, Intervals and Periods](/financial-charts/symbols-intervals-periods/).

### Studies and Indicators

Add technical indicators such as RSI, MACD, moving averages and Bollinger Bands, in the price pane or a pane of their own, and change the candle type.

```ts
const rsi = new RSIStudy();
await chart.attachStudy(rsi); // in a pane of its own, below the price
chart.detachStudy(rsi);
```

See [Studies and Indicators](/financial-charts/studies-and-indicators/), with a page for each indicator.

### Drawing Tools

Let users draw trend lines, Fibonacci retracements, channels and patterns, from a toolbar.

```ts
const drawing = DrawingToolsController.attach(chart);
DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "vertical" });
```

See [Drawing Tools](/financial-charts/drawing-tools/).

### Data Sources

Besides Coinbase and Binance, chart CSV files, JSON, or any market data API through an exchange of your own.

```ts
const exchange = await CSVExchange.fromUrl("/data/btc-1h.csv", { name: "MyData" });
registerCSVExchange(defaultExchangeProvider, exchange); // charts can now use exchangeName: "MyData"
```

See [Data Sources](/financial-charts/data-sources/).

### UI Components

The controls a trading app puts around the chart: interval and period pickers, a candle-type menu, study settings, a drawing list, a market-depth ladder and watchlist sparklines, in plain DOM and React.

```ts
IntervalSelector.create(document.getElementById("intervals"), {
    value: CandleInterval.ONE_HOUR,
    onChange: (interval) => chart.changeInterval(interval),
});
```

See [UI Components](/financial-charts/ui-components/).

### Saving and Restoring

Save a chart's symbol, studies, drawings and layout as JSON, and restore it later.

```ts
const state = financeChartPanel.toJSON();

// Later, e.g. on the next visit
financeChartPanel.cleanup();
const restored = await SciFinanceChartPanel.fromJSON(element, state);
```

See [Saving and Restoring](/financial-charts/save-and-restore/).

### Styling and Themes

Choose a built-in theme, dark, light or ocean, or make your own, and switch a live chart.

```ts
const financeChartPanel = await SciFinanceChartPanel.create(element, { /* … */ theme: SCITRADER_LIGHT_THEME });
financeChartPanel.financeApi.setTheme(SCITRADER_OCEAN_THEME);
```

See [Styling and Themes](/financial-charts/styling-and-themes/).
