---
sidebar_position: 3
sidebar_label: Getting Started
title: "Getting Started with SciTrader.js | JavaScript & React Trading Charts"
description: "Create your first JavaScript or React candlestick trading chart with SciTrader.js: register a data source, then create a SciFinanceChartPanel or SciFinanceChartView."
keywords: ["SciTrader", "SciTrader.js", "SciTrader getting started", "JavaScript trading chart tutorial", "React candlestick chart", "SciFinanceChartView"]
---

# Getting started

## Before you start

Install the packages, import the stylesheet and serve SciChart's WebAssembly: [Installation](/scichart-extensions/scichart-scitrader/installation/) has the commands, and an example for each common bundler. In short:

```js
npm install scichart-scitrader scichart scichart-financial-tools rxjs
npm install scichart-scitrader-react react react-dom   # for React
```

```ts
import "scichart-scitrader/scitrader.css";
```

## Register a data source

Charts get their candles from an **exchange**, looked up by name. The SDK registers none by default. Register the ones your app uses once at startup, before any chart is created:

```ts
import { BinanceExchange, CoinbaseExchange, defaultExchangeProvider, idbPriceStore } from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
```

The second argument is the candle store. `idbPriceStore` caches downloaded candles in IndexedDB, so a reload draws straight away and fetches only what is new. See [Data sources](/scichart-extensions/scichart-scitrader/data-sources/) for the other options, including CSV files, which the examples below use.

## Create a chart

`SciFinanceChartPanel.create` builds a whole chart inside a DOM element. It creates the layout, the price pane, a data feed for the symbol, and a pane for each study that needs one.

```ts
import { CandleInterval, OHLCStudy, SciFinanceChartPanel, VolumeStudy } from "scichart-scitrader";

const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: "Binance",
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

The container needs a size. The chart fills it and follows it when it resizes. By default the user can:
- scroll to zoom, and drag to pan;
- pan left to load older candles;
- drag an axis to rescale it;
- double-click to zoom to fit.

The legend and crosshair follow the mouse.

`create` resolves with an `ISciFinanceChartPanelApi`, called `financeChartPanel` in these docs. [Finance Chart API](/scichart-extensions/scichart-scitrader/finance-chart-api/) describes it in full:

| Member | Use |
|---|---|
| `financeApi` | The `SciFinanceChart`. It covers studies, data feeds, interval, period, candle type and events. |
| `paneGroupApi` | The layout: pane order, sizes, visibility, axis sync ([Layout](/scichart-extensions/scichart-scitrader/layout/)). |
| `toJSON()` | The chart's state as JSON ([Saving and restoring](/scichart-extensions/scichart-scitrader/save-and-restore/)). |
| `cleanup()` | Destroys the chart and its feeds. Call it when the element goes away. |

<CenteredImageWrapper src={require("../_examples/gettingStarted_CreateChart/screenshot.png").default} title="Create a Financial Chart" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/gettingStarted_CreateChart/drawExample.ts
    ```
    ```tsx showLineNumbers file=../_examples/gettingStarted_CreateChart/index.tsx
    ```
</CodeSnippetBlock>

### Configuration

`ISciFinanceChartPanelConfig` (every option, with its type and examples, is in [Chart configuration](/scichart-extensions/scichart-scitrader/finance-chart-api/chart-config/)):

| Option | Default | Meaning |
|---|---|---|
| `exchangeName`, `symbol`, `interval` | required | The data to chart. |
| `studies` | required | What to draw, in order. See [Studies](/scichart-extensions/scichart-scitrader/studies-and-indicators/). |
| `period` | none | How much time to show at first, e.g. `"1M"` or `"1Y"`. See [Periods](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/periods/). |
| `lockPeriodWidth` | `true` | Whether `period` also caps how far the user can zoom out. |
| `liveTipMode` | `"follow"` | Whether the view scrolls with new candles (`"follow"`) or stays put (`"anchored"`). |
| `useSubCharts` | `true` | Draw all panes on one surface (`true`), or give each pane its own (`false`). See [Layout](/scichart-extensions/scichart-scitrader/layout/). |
| `direction` | `"column"` | Stack panes vertically (`"column"`) or side by side (`"row"`). |
| `maxPanes` | `6` | Most panes allowed. Studies that would add more are refused, and `paneLimitReached` is raised. |
| `paneSizing` | none | Size hints per pane id, e.g. `{ default: { grow: 4 } }`. |
| `paneControls` | all controls, mouse layout | Each pane's control bar and the dividers, including the touch layout. See [Pane controls](/scichart-extensions/scichart-scitrader/layout/#pane-controls). |
| `loading` | skeleton and overlay | What panes show while they load. See [Loading states](/scichart-extensions/scichart-scitrader/layout/#loading-states). |
| `theme` | `SCITRADER_DARK_THEME` | Every colour the chart draws with. See [Styling and themes](/scichart-extensions/scichart-scitrader/styling-and-themes/). |
| `axisDefaults` | none | Options applied to every axis, over the theme's. See [Styling](/scichart-extensions/scichart-scitrader/styling-and-themes/#axes). |
| `surfaceConfig` | none | A function run on each pane's `SciChartSurface` as it is created. |
| `services` | global | The data services to use. See [Data sources](/scichart-extensions/scichart-scitrader/data-sources/#keeping-an-exchange-private-to-a-chart). |

## Create a chart in React

> **SciTrader ships a React wrapper, `scichart-scitrader-react`.** It provides `<SciFinanceChartView>` and React versions of the toolbar controls, study settings, drawing toolbar and market-depth view, each wrapping the plain TypeScript SDK. Install it alongside the core packages:
>
> ```js
> npm install scichart-scitrader scichart scichart-financial-tools rxjs
> npm install scichart-scitrader-react react react-dom
> ```

`<SciFinanceChartView>` takes the same config as `SciFinanceChartPanel.create`. It hands back the same API through `ref`, and through `onInit` when the chart is ready:

```tsx
import { ISciFinanceChartPanelApi, ISciFinanceChartPanelConfig } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

function Chart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);

    // Create the config once per mounted chart. Studies are live objects bound to one chart.
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: "Binance",
            symbol: "ETHUSDT",
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
- **Changing `config` doesn't rebuild the chart.** Drive changes through `financeApi` instead ([next page](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/)). To start over, remount with a new `key`.
- **The other props.** `paneControls` applies to the live chart, and `paneInfo` renders your content into each pane's control bar. `paneLoadingContent`, read once like `config`, replaces the loading skeleton. See [Layout](/scichart-extensions/scichart-scitrader/layout/#pane-controls).

<CenteredImageWrapper src={require("../_examples/gettingStarted_CreateChartReact/screenshot.png").default} title="Create a Chart in React" />

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../_examples/gettingStarted_CreateChartReact/index.tsx
    ```
</CodeSnippetBlock>

## About the code samples

The samples in this section come from the SciTrader demo app, and import a few small helpers from it:

- `loadSampleData()` and `SAMPLE_EXCHANGE` register a [CSV exchange](/scichart-extensions/scichart-scitrader/data-sources/#csv-data) with bundled sample candles, so the samples run without network access. Swap `exchangeName` and `symbol` for `"Binance"` and `"BTCUSDT"` to chart live data instead.
- `useVanillaExample()` mounts a plain-TypeScript `drawExample` function into a React `div`, and cleans it up on unmount.
- `ExamplePage` is the demo app's page frame (title, description, toolbar). Replace it with your own layout.

<CodeSnippetBlock labels={["sampleData.ts", "useVanillaExample.ts", "useSampleData.ts"]}>
    ```ts showLineNumbers file=../_examples/_shared/sampleData.ts
    ```
    ```ts showLineNumbers file=../_examples/_shared/useVanillaExample.ts
    ```
    ```ts showLineNumbers file=../_examples/_shared/useSampleData.ts
    ```
</CodeSnippetBlock>
