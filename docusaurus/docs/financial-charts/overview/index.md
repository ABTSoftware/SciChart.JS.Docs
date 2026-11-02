---
sidebar_position: 1
sidebar_label: Overview
title: "SciTrader.js: JavaScript & React Financial Trading Charts SDK"
description: "SciTrader.js is a high-performance JavaScript and React financial charts SDK for building trading charts: real-time candlestick charts, 30+ technical indicators, drawing tools, multi-pane layouts and live Binance & Coinbase data."
keywords:
    [
        "SciTrader",
        "SciTrader.js",
        "Financial Charts",
        "Trading Charts",
        "Candlestick Charts",
        "React Financial Charts",
        "JavaScript Financial Charts",
        "React Trading Charts",
        "JavaScript Candlestick Chart",
        "Stock Charts",
        "Crypto Charts",
        "Technical Analysis Charts",
        "scichart-scitrader",
        "scichart-scitrader-react"
    ]
image: /img/Default-Social-Image.jpg
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SciTrader.js",
            "alternateName": ["SciTrader", "scichart-scitrader"],
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web browser",
            "description": "JavaScript and React financial charts SDK for building high-performance trading charts and candlestick charts, built on SciChart.js.",
            "url": "https://www.scichart.com/documentation/js/current/financial-charts/overview/",
            "publisher": { "@type": "Organization", "name": "SciChart", "url": "https://www.scichart.com" }
        })}
    </script>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is SciTrader.js?",
                    "acceptedAnswer": { "@type": "Answer", "text": "SciTrader.js is a trading-chart SDK for JavaScript, TypeScript and React, built on SciChart.js. It draws GPU-accelerated candlestick charts with multiple panes, technical indicators, drawing tools and live market data." }
                },
                {
                    "@type": "Question",
                    "name": "Does SciTrader.js support React financial charts?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. The scichart-scitrader-react package provides React components such as SciFinanceChartView, MarketDepthView, toolbar controls, study settings and a drawing toolbar, each wrapping the framework-agnostic SDK." }
                },
                {
                    "@type": "Question",
                    "name": "Which data sources can SciTrader.js trading charts use?",
                    "acceptedAnswer": { "@type": "Answer", "text": "SciTrader.js ships live connectors for Binance and Coinbase, a CSV connector for your own files, and an interface for plugging in any other market data feed." }
                }
            ]
        })}
    </script>
</head>

# SciTrader.js: JavaScript & React Financial Trading Charts

**SciTrader.js** (`scichart-scitrader`) is a high-performance **financial charts** SDK for JavaScript, TypeScript and React. Use it to build professional **trading charts**: real-time **candlestick charts** with multiple panes, 30+ technical indicators, trading drawing tools, order-book visualisations and live market data, in a few lines of code.

SciTrader is built on [SciChart.js](/intro/), so every chart is drawn by SciChart's GPU-accelerated WebGL / WebGPU and WebAssembly engine. That means smooth zooming and panning through long price histories, live updates without frame drops, and many charts on one page. It is the engine behind the SciTrader app, packaged for your own trading platforms, crypto exchanges, brokerage dashboards and fintech apps.

<CenteredImageWrapper src={require("../_examples/gettingStarted_CreateChart/screenshot.png").default} title="SciTrader.js candlestick trading chart with volume, indicators and drawing tools" />

```js
# JavaScript / TypeScript
npm install scichart-scitrader scichart scichart-financial-tools rxjs

# React financial charts: add these as well
npm install scichart-scitrader-react react react-dom
```

## Packages

SciTrader ships as two npm packages:

| Package | Contents | Peer dependencies |
| --- | --- | --- |
| `scichart-scitrader` | The framework-agnostic SDK: charts, studies, data feeds, exchange connectors, layouts, drawing tools, themes, UI components in plain DOM, and a plain-CSS stylesheet | `scichart`, `scichart-financial-tools`, `rxjs` 7.5.5+ |
| `scichart-scitrader-react` | React bindings: `SciFinanceChartView`, `MarketDepthView`, the toolbar controls, the study settings, the drawing toolbar and list, `PaneProgressDots`, `CandleCounter`, `SciTraderIcon`, `useDrawingTools`, `SciTraderThemeProvider`. Each mounts the SDK's vanilla equivalent | `scichart-scitrader`, `react`, `react-dom` |

Every code sample in this section is self-contained and shown in TypeScript and React, with live Binance data.

## What you can build with SciTrader.js

- **Financial charts and candlestick charts.** Candlesticks, OHLC bars, line, mountain, Heikin-Ashi, Renko and Point & Figure. Price, volume and indicator panes pan and zoom together. See [Studies and indicators](/financial-charts/studies-and-indicators/#candle-types).
- **30+ technical indicators.** Moving averages, Bollinger Bands and channels, Ichimoku, and oscillators such as RSI, MACD, Stochastic and ADX. There are also volume profile, order-book heatmap and book-imbalance studies. Every setting can be edited at runtime, and you can write your own studies. See [Studies and indicators](/financial-charts/studies-and-indicators/).
- **Real-time trading charts from any data source.**
    - Built-in live connectors for Binance and Coinbase.
    - A CSV connector for your own files.
    - An interface for plugging in any other market data feed.

    See [Data sources](/financial-charts/data-sources/).
- **Trading drawing tools.** Trend lines, Fibonacci, pitchforks, channels and more, with toolbars for plain TypeScript and React, plus keyboard and touch support. See [Drawing tools](/financial-charts/drawing-tools/).
- **Multi-pane layouts.** Vertical or horizontal split panes with resize, maximise, hide and reorder, from per-pane control bars that also work by touch. Axes are synchronised across panes. See [Layout](/financial-charts/layout/).
- **UI around the chart.** Interval, period, candle-type and live-tip pickers; study settings forms; a drawings list; a market-depth ladder; watchlist sparklines. All plain DOM, with React wrappers, restyled through CSS. See [UI components](/financial-charts/ui-components/).
- **Themes.** One theme object for every colour, switchable on a live chart. See [Styling and themes](/financial-charts/styling-and-themes/).
- **State.** Save a chart to JSON and restore it later, with its studies, layout and drawings. See [Saving and restoring](/financial-charts/save-and-restore/).

## A trading chart in a few lines

### JavaScript / TypeScript

```ts
import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy
} from "scichart-scitrader";

// Register a live data source once, at startup
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// Create a candlestick chart with volume in a <div id="chart">
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    studies: [new OHLCStudy(), new VolumeStudy()]
});
```

### React financial charts

```tsx
import {
    BinanceExchange,
    CandleInterval,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    RSIStudy,
    VolumeStudy
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

function TradingChart() {
    // Create the config once per mounted chart. Studies are live objects bound to one chart.
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "ETHUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "1Y",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()]
        }),
        []
    );
    return (
        <div style={{ height: 600 }}>
            <SciFinanceChartView config={config} />
        </div>
    );
}
```

[Getting started](/financial-charts/getting-started/) walks through both in detail.

## Core concepts

A chart is a **`SciFinanceChart`** hosted by a **layout**, `SciChartPaneSplitter`. It shows one **default data feed** (an exchange, a symbol and an interval), and draws it through **studies**. `OHLCStudy` draws price, `VolumeStudy` draws volume, and every indicator is a study too. Studies that need their own scale open a new **pane**. Data comes from **exchanges** registered by name with an `IExchangeProvider`. The wrappers `SciFinanceChartPanel` (plain TypeScript) and `<SciFinanceChartView>` (React) create the layout, the chart and the feed in one call, and are where most apps start.

## SciTrader.js, SciChart.js and scichart-financial-tools

| | Use it for |
| --- | --- |
| [scichart](https://www.npmjs.com/package/scichart) | General-purpose high-performance charts, including [candlestick](/2d-charts/chart-types/fast-candlestick-renderable-series/) and [OHLC](/2d-charts/chart-types/fast-ohlc-renderable-series/) series you assemble yourself. See the [SciChart.js docs](/intro/) |
| [scichart-financial-tools](https://www.npmjs.com/package/scichart-financial-tools) | Trading annotations, drawing modifiers and OHLC data filters on top of your own SciChart.js surfaces. See the [scichart-financial-tools docs](/scichart-extensions/scichart-financial-tools/overview/) |
| [scichart-scitrader](https://www.npmjs.com/package/scichart-scitrader) | **SciTrader.js:** a complete, ready-made trading chart with data feeds, indicators, panes, drawing tools and UI, built on both of the above |

## Documentation

1. [Installation](/financial-charts/installation/): the packages to install, the stylesheet, and serving SciChart's WebAssembly with webpack, Vite, esbuild, Rollup or Parcel.
2. [Getting started](/financial-charts/getting-started/): your first chart, in plain TypeScript and in React.
3. [Finance Chart API](/financial-charts/finance-chart-api/): the `ISciFinanceChartPanelApi` that creating a chart returns, and what is in it.
4. [Symbols, intervals and periods](/financial-charts/symbols-intervals-periods/): changing what the chart shows.
5. [Studies and indicators](/financial-charts/studies-and-indicators/): adding, configuring and removing indicators; candle types.
6. [Data sources](/financial-charts/data-sources/): exchanges, CSV data, live connectors, custom sources.
7. [Drawing tools](/financial-charts/drawing-tools/): the drawing controller, toolbars for plain TypeScript and React, keyboard and touch.
8. [Saving and restoring](/financial-charts/save-and-restore/): chart state as JSON.
9. [Layout: panes, controls and PaneGroup](/financial-charts/layout/): pane control bars, touch layout, loading states, and the layout layer under the chart.
10. [UI components](/financial-charts/ui-components/): toolbar controls, colour picker, candle counter, icons, watchlist.
11. [Styling and themes](/financial-charts/styling-and-themes/): one theme object for every colour; switch a live chart with `setTheme`.

## FAQ

### What is SciTrader.js?

SciTrader.js is a trading-chart SDK for JavaScript, TypeScript and React, built on SciChart.js. It draws GPU-accelerated candlestick charts with multiple panes, technical indicators, drawing tools and live market data.

### Does SciTrader.js support React financial charts?

Yes. `scichart-scitrader-react` provides React components such as `<SciFinanceChartView>`, `<MarketDepthView>`, toolbar controls, study settings and a drawing toolbar. Each wraps the framework-agnostic SDK, so React and plain TypeScript apps get the same charts.

### Which data sources can SciTrader.js trading charts use?

Live Binance and Coinbase connectors are built in, along with a CSV connector. Any other feed (stocks, FX, futures or your own backend) plugs in by implementing `IRemoteExchange`. See [A custom data source](/financial-charts/data-sources/#a-custom-data-source).

### Which bundlers does SciTrader.js work with?

Any bundler that understands `node_modules`. [Installation](/financial-charts/installation/) has examples for webpack, Vite, esbuild, Rollup and Parcel.
