---
sidebar_position: 3
sidebar_label: Getting Started
title: "Getting Started with SciTrader.js | JavaScript & React Trading Charts"
description: "Create your first JavaScript or React candlestick trading chart with SciTrader.js: register a data source, then create a SciFinanceChartPanel or SciFinanceChartView."
keywords: ["SciTrader", "SciTrader.js", "SciTrader getting started", "JavaScript trading chart tutorial", "React candlestick chart", "SciFinanceChartView"]
---

# Getting started

## Before you start

Follow [Installation](/financial-charts/installation/) first: it installs the packages, imports the stylesheet, and serves SciChart's WebAssembly with your bundler.

## Register a data source

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

The second argument is the candle store. `idbPriceStore` caches downloaded candles in IndexedDB, so a reload draws straight away and fetches only what is new. See [Data sources](/financial-charts/data-sources/) for the other options, including CSV files and your own data.

## Create a chart

`SciFinanceChartPanel.create` builds a whole chart inside a DOM element. It creates the layout, the price pane, a data feed for the symbol, and a pane for each study that needs one.

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

The container needs a size. The chart fills it and follows it when it resizes. By default the user can:
- scroll to zoom, and drag to pan;
- pan left to load older candles;
- drag an axis to rescale it;
- double-click to zoom to fit.

The legend and crosshair follow the mouse.

`create` resolves with an `ISciFinanceChartPanelApi`, called `financeChartPanel` in these docs. [Finance Chart API](/financial-charts/finance-chart-api/) describes it in full:

| Member | Use |
|---|---|
| `financeApi` | The `SciFinanceChart`. It covers studies, data feeds, interval, period, candle type and events. |
| `paneGroupApi` | The layout: pane order, sizes, visibility, axis sync ([Layout](/financial-charts/layout/)). |
| `toJSON()` | The chart's state as JSON ([Saving and restoring](/financial-charts/save-and-restore/)). |
| `cleanup()` | Destroys the chart and its feeds. Call it when the element goes away. |

The chart below is live, with Coinbase data. The **Edit on CodePen** button above it opens the TS sample in CodePen.

<LiveDocSnippet maxWidth={"100%"} includeSciTrader name="../_examples/gettingStarted_CreateChart/vanilla" html={`<div id="chart" style="width: 100%; height: 100%"></div>`} />

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../_examples/gettingStarted_CreateChart/vanilla.ts
    ```
</CodeSnippetBlock>

### Configuration

The second argument to `create` is an `ISciFinanceChartPanelConfig`. Only `exchangeName`, `symbol`, `interval` and `studies` are required. The other options set the starting period, the pane layout and controls, loading states, the theme and the axes. [Chart Config object](/financial-charts/finance-chart-api/chart-config/) describes every option.

## Create a chart in React

> **SciTrader ships a React wrapper, `scichart-scitrader-react`.** It provides `<SciFinanceChartView>` and React versions of the toolbar controls, study settings, drawing toolbar and market-depth view, each wrapping the plain TypeScript SDK. Add it to an app that already has the [core packages](/financial-charts/installation/#install-the-packages):
>
> ```js
> npm install scichart-scitrader-react react react-dom
> ```

`<SciFinanceChartView>` takes the same config as `SciFinanceChartPanel.create`. It hands back the same API through `ref`, and through `onInit` when the chart is ready:

```tsx
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    VolumeStudy
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

function Chart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);

    // Create the config once per mounted chart. Studies are live objects bound to one chart.
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "ETH-USD",
            interval: CandleInterval.ONE_DAY,
            period: "1Y",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
        }),
        []
    );

    return (
        <div style={{ height: 600 }}>
            <SciFinanceChartView
                ref={chartRef}
                config={config}
                onInit={(api) => api.financeApi.attachStudy(new MACDStudy())}
            />
        </div>
    );
}
```

- **Wait for `onInit`.** `chartRef.current` is set as soon as the view mounts, but `financeApi` throws until the chart has initialised. Use `onInit`, or check `chartRef.current.isInitialized`, before touching it.
- **The view unmounts cleanly.** It cleans itself up on unmount.
- **Changing `config` doesn't rebuild the chart.** Drive changes through `financeApi` instead ([next page](/financial-charts/symbols-intervals-periods/)). To start over, remount with a new `key`.
- **The other props.** `paneControls` applies to the live chart, and `paneInfo` renders your content into each pane's control bar. `paneLoadingContent`, read once like `config`, replaces the loading skeleton. See [Layout](/financial-charts/layout/#pane-controls).

The React chart below is live, with Coinbase data. **Edit on CodePen** opens the React sample in CodePen.

<LiveDocSnippet maxWidth={"100%"} height={680} includeSciTrader reactComponent="TradingChart" name="../_examples/gettingStarted_CreateChartReact/react" />

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../_examples/gettingStarted_CreateChartReact/react.tsx
    ```
</CodeSnippetBlock>

## About the code samples

Every sample in this section is self-contained: it imports nothing but the SciTrader, SciChart and React packages. Copy one into an app that has followed [Installation](/financial-charts/installation/) to try it.

- **TS** samples are plain TypeScript modules. They use top-level `await`, and look up the elements they need by id. A comment at the top shows the HTML each one expects, e.g. `<div id="chart" style="height: 600px">`.
- **React** samples export a function component. Render it anywhere in your app.
- **Data** is live from Binance: no API key is needed. Each sample registers `BinanceExchange` at the top. In your app, do that once at startup, rather than in every module. The [Data sources](/financial-charts/data-sources/) samples show CSV files and your own data instead.
