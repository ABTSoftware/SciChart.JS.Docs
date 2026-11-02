---
sidebar_position: 4
sidebar_label: Overview
title: "Symbols, Intervals and Periods | SciTrader.js Financial Charts"
description: "Change the symbol, candle interval and visible period of a SciTrader.js financial chart at runtime with SciFinanceChart.setSymbol, changeInterval and setPeriod."
keywords: ["SciTrader", "SciTrader.js", "trading chart timeframe", "candle interval", "SciTrader symbol", "SciFinanceChart"]
---

# Symbols, Intervals and Periods

A trading chart shows one **symbol** (e.g. `BTCUSDT`), at one candle **interval** (e.g. 4 hours), over a **period** of time (e.g. the last month). All three can change while the chart is running. The chart keeps its studies, panes and drawings when they do: every study recalculates on the new data.

## Where these methods live

Every method on these pages is on **`SciFinanceChart`**, the chart itself. You reach it through the **`financeApi`** property of the API object that creating a chart returns:

| You created the chart with | You get | The chart is |
| --- | --- | --- |
| `SciFinanceChartPanel.create(element, config)` (plain TypeScript) | `Promise<ISciFinanceChartPanelApi>` | `financeChartPanel.financeApi` |
| `<SciFinanceChartView config={…} />` (React) | `ISciFinanceChartPanelApi`, through `ref` and `onInit` | `chartRef.current.financeApi` |

```ts
import {
    ISciFinanceChartPanelApi,
    SciFinanceChart,
    SciFinanceChartPanel
} from "scichart-scitrader";

// financeChartPanel: ISciFinanceChartPanelApi — the chart and its layout
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), config);

// chart: SciFinanceChart — studies, data feeds, symbol, interval, period, events
const chart: SciFinanceChart = financeChartPanel.financeApi;

await chart.setSymbol("ETHUSDT");
```

```tsx
// React: the same API, once the chart has initialised
<SciFinanceChartView
    config={config}
    onInit={(financeChartPanel: ISciFinanceChartPanelApi) => financeChartPanel.financeApi.setSymbol("ETHUSDT")}
/>
```

`ISciFinanceChartPanelApi` also has `paneGroupApi` (the [layout](/financial-charts/layout/)), `toJSON()` and `cleanup()`. `financeApi` throws until the chart has initialised; in React, wait for `onInit` or check `isInitialized`. See [Finance Chart API](/financial-charts/finance-chart-api/).

## API at a glance

| Member of `SciFinanceChart` | Does |
| --- | --- |
| `setSymbol(symbol: string, exchangeName?: string, options?: { period?: TPeriod \| null }): Promise<IDataFeed \| undefined>` | [Changes the symbol](/financial-charts/symbols-intervals-periods/changing-the-symbol/), and optionally the exchange |
| `createDataFeed(feedType: EDataFeedType, exchangeName: string, symbol: string, interval: CandleInterval, isDefault: boolean, period?: TPeriod \| null): Promise<IDataFeed \| undefined>` | [Creates a data feed](/financial-charts/symbols-intervals-periods/changing-the-symbol/#changing-symbol-and-interval-together); with `isDefault: true`, replaces what the chart shows |
| `changeInterval(interval: CandleInterval, period?: TPeriod \| null): Promise<void>` | [Changes the candle interval](/financial-charts/symbols-intervals-periods/changing-the-interval/) |
| `setPeriod(period: TPeriod \| null): Promise<void>` | [Changes the visible period](/financial-charts/symbols-intervals-periods/periods/) |
| `currentPeriod: TPeriod \| null` | The period on screen, or `null` for none |
| `dataFeeds: Map<string, IDataFeed>` | The chart's data feeds. The default one (`isDefault: true`) has the current `exchangeName`, `symbol` and `interval` |
| `dataLoadStarted: EventHandler<void>` | Raised when a symbol or interval change starts loading |
| `dataRenderComplete: EventHandler<IDataRenderCompleteArgs>` | Raised when the new data is drawn. `args.type` is `"init"`, `"symbol-change"`, `"interval-change"`, `"historical"` or `"stale-recovery"` |

Events are SciChart `EventHandler`s:

```ts
chart.dataLoadStarted.subscribe(() => showSpinner());
chart.dataRenderComplete.subscribe((args) => {
    if (args.type === "symbol-change" || args.type === "interval-change") {
        hideSpinner();
    }
});
```

## Pages in this section

1. [Changing the symbol](/financial-charts/symbols-intervals-periods/changing-the-symbol/): `setSymbol`, where the data comes from, and `createDataFeed`.
2. [Changing the interval](/financial-charts/symbols-intervals-periods/changing-the-interval/): `changeInterval` and keeping the user's span with `carryPeriodToInterval`.
3. [Periods](/financial-charts/symbols-intervals-periods/periods/): `setPeriod`, the period values, and how they fetch data.
4. [Toolbar controls](/financial-charts/symbols-intervals-periods/toolbar-controls/): ready-made interval and period pickers, in plain TypeScript and React.

## Example

The chart below starts on `BTCUSDT` at 4 hours over one month. Its toolbar changes symbol, interval and period with the three calls above.

<CenteredImageWrapper src={require("../_examples/gettingStarted_SymbolInterval/screenshot.png").default} title="Symbol, Interval and Period" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/gettingStarted_SymbolInterval/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/gettingStarted_SymbolInterval/react.tsx
    ```
</CodeSnippetBlock>
