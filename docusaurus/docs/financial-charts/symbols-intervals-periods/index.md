---
sidebar_position: 4
sidebar_label: Overview
title: "Symbols, Intervals and Periods | SciTrader.js Financial Charts"
description: "Change the symbol, candle interval and visible period of a SciTrader.js financial chart at runtime with SciFinanceChart.setSymbol, changeInterval and setPeriod."
keywords: ["SciTrader", "SciTrader.js", "trading chart timeframe", "candle interval", "SciTrader symbol", "SciFinanceChart"]
---

# Symbols, Intervals and Periods

A trading chart shows one **symbol** (e.g. `BTCUSDT`), at one candle **interval** (e.g. 4 hours), over a **period** of time (e.g. the last month). All three can change while the chart is running. The chart keeps its studies, panes and drawings when they do: every study recalculates on the new data.

## Where SciFinanceChart Comes From

Every method on these pages is a member of [`SciFinanceChart`](/financial-charts/finance-chart-api/#the-scifinancechart-class), the chart itself. You reach it through the [`financeApi`](/financial-charts/finance-chart-api/#financeapi) property of the `ISciFinanceChartPanelApi` that `SciFinanceChartPanel.create` returns. In React, `<SciFinanceChartView>` hands you the same object through `ref` and `onInit`.

```ts
import { SciFinanceChart, SciFinanceChartPanel } from "scichart-scitrader";

// financeChartPanel: ISciFinanceChartPanelApi, the chart and its layout
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), config);

// chart: SciFinanceChart, with the symbol, interval and period methods
const chart: SciFinanceChart = financeChartPanel.financeApi;

await chart.setSymbol("ETHUSDT");
```

## SciFinanceChart Symbol, Interval and Period Methods {#methods}

| Member | What it does | See |
| --- | --- | --- |
| `setSymbol(symbol, exchangeName?, options?)` | Changes the symbol, and optionally the exchange, keeping the interval and period | [Changing the symbol](/financial-charts/symbols-intervals-periods/changing-the-symbol/) |
| `createDataFeed(feedType, exchangeName, symbol, interval, isDefault, period?)` | Changes symbol and interval in one step. With `isDefault: true`, it replaces what the chart shows | [Symbol and interval together](/financial-charts/symbols-intervals-periods/changing-the-symbol/#changing-symbol-and-interval-together) |
| `changeInterval(interval, period?)` | Reloads the current symbol at another candle interval | [Changing the interval](/financial-charts/symbols-intervals-periods/changing-the-interval/) |
| `setPeriod(period)` | Shows another period of time, fetching any older candles it needs | [Periods](/financial-charts/symbols-intervals-periods/periods/) |
| `currentPeriod` | The period on screen, or `null` for none | |
| `dataFeeds` | The chart's data feeds. The default one has the current `exchangeName`, `symbol` and `interval` | |

All four methods are async. `await` them before you read `currentPeriod` or `dataFeeds`.

<details>
<summary>The SciFinanceChart symbol, interval and period members, with their TSDoc</summary>

```ts
/**
 * Switches the chart to another symbol, optionally on another exchange, keeping the current
 * interval and period. Studies, panes and drawings stay; every study recalculates on the new
 * data. Raises {@link dataLoadStarted}, then `dataRenderComplete({ type: "symbol-change" })`.
 *
 * Shorthand for `createDataFeed(EDataFeedType.OHLCVRealtime, exchangeName, symbol,
 * <current interval>, true, <current period>)`.
 *
 * @param symbol The symbol in the exchange's own format (`BTCUSDT` on Binance, `BTC-USD` on
 * Coinbase; `mapSymbol` converts between them).
 * @param exchangeName The exchange to load from. Defaults to the current one.
 * @param options.period The period to show once loaded, instead of the current one. `null`
 * shows all loaded data with no period.
 */
setSymbol(symbol: string, exchangeName?: string, options?: {
    period?: TPeriod | null;
}): Promise<IDataFeed>;

createDataFeed(feedType: EDataFeedType, exchangeName: string, symbol: string, interval: CandleInterval, isDefault: boolean, period?: TPeriod | null): Promise<IDataFeed>;

/**
 * Reload the current symbol's candles at a new interval, landing on a period in the same step.
 *
 * `period` picks what the chart shows at the new interval:
 *  - a {@link TPeriod} — that period, applied at the new interval;
 *  - `null` — no period (free pan/zoom). The view lands on the interval's default window, but
 *    nothing caps the zoom afterwards;
 *  - omitted — {@link defaultPeriodForInterval}, even when no period was active before.
 *
 * Afterwards {@link currentPeriod} describes what is on screen, so there is no need to follow
 * this with {@link setPeriod}. The fetch is sized for the target period, so a period change
 * costs no second fetch. To keep the user's period across the switch instead of snapping to
 * the default, pass `carryPeriodToInterval(chart.currentPeriod, interval)`.
 *
 * A {@link setPeriod} call made while this is loading wins: the period resolved here is then
 * not applied.
 */
changeInterval(interval: CandleInterval, period?: TPeriod | null): Promise<void>;

/**
 * Apply a preset period — single-shot fetch of exactly the right candle count.
 *
 * Replaces the old iterative `loadPreviousData` orchestration with a predictive
 * flow:
 *   1. Compute an `IFetchPlan` from `(currentInterval, period, now, bufferRatio)`.
 *   2. Disable `xAxis.autoRange` and set the *target* visible range up-front,
 *      using the index space we know the new fetch will produce.
 *   3. Configure the default feed to fetch exactly `plan.totalCandles` and
 *      reload via `feed.change(symbol, interval)`.
 *   4. By the time data arrives the visible range is already correct — no
 *      auto-fit override, no flash, no second range adjustment.
 *
 * `"ALL"` (and degenerate plans) fall back to `applyFitAllRange` — an
 * explicit `[0, n-1]` set, *not* SciChart's `zoomExtents`, since the chart
 * is configured `EAutoRange.Never` everywhere. Cancellation: a counter
 * token (`setPeriodToken`) discards stale results when the user picks a
 * different period mid-flight.
 *
 * **Data-feed cancellation note:** `IExchangeClient.getCandles` does not
 * accept an `AbortSignal` today, and `DataFeedManager` does not debounce
 * overlapping calls. A superseded `setPeriod`'s REST request still
 * completes and writes data; the cancellation token only prevents us from
 * applying the *visible-range* update on a stale call. Adding abort
 * support is a separate follow-up.
 */
setPeriod(period: TPeriod | null): Promise<void>;

/**
 * The currently-selected preset period, set by the most recent successful
 * {@link setPeriod} call. `null` means no period is active — the chart shows
 * whatever the data feed's natural visible range is.
 */
currentPeriod: TPeriod | null;

get dataFeeds(): Map<string, IDataFeed>;
```

</details>

## SciFinanceChart Loading Events {#loading-events}

A symbol or interval change loads new candles, which takes a moment. The chart shows its own loading overlay while it does (the `loading` option of the chart config). Two events let your own UI follow along too, e.g. a status line or a toolbar that disables itself:

| Event | Raised when |
| --- | --- |
| `dataLoadStarted` | A symbol or interval change starts loading. Not raised while older candles load in the background as the user pans back |
| `dataRenderComplete` | The new data has loaded and been drawn. `args.type` says why: `"init"`, `"symbol-change"`, `"interval-change"`, `"historical"` or `"stale-recovery"` |

Both are SciChart `EventHandler`s. This example shows a status line in an element of your own page:

```ts
// Your own status element, e.g. <span id="status"></span> in your toolbar. It isn't part of SciTrader.
const status = document.getElementById("status");

// dataLoadStarted: raised when a symbol or interval change (setSymbol, changeInterval,
// createDataFeed) starts loading new candles
chart.dataLoadStarted.subscribe(() => {
    status.textContent = "Loading…";
});

// dataRenderComplete: raised when the loaded candles have been drawn.
// args.type is the reason for the load: here, the symbol or interval change has finished
chart.dataRenderComplete.subscribe((args) => {
    if (args.type === "symbol-change" || args.type === "interval-change") {
        status.textContent = "";
    }
});
```

<details>
<summary>The SciFinanceChart loading events, with their TSDoc</summary>

```ts
/**
 * Fires when a FOREGROUND data load begins — full-chart dataset
 * replacements (initial load via `createWithStudies`, symbol/interval
 * swap via `changeInterval` / `createDataFeed`). These are paired
 * with a `data-chart-loading` overlay in `SciFinanceChartView`.
 *
 * **Not raised for coordinator-driven background loads** (pan-back
 * cascade, warmup-after-init, forward-edge fills). Earlier prototyping
 * raised it from `handleLoadStart` and produced a "disappear for a
 * few seconds then reappear" flash when the warmup fired right after
 * init — see the comment at `handleLoadStart`. For background-load
 * notification, subscribe to {@link historicalLoadStarted} /
 * {@link historicalLoadComplete} instead.
 */
dataLoadStarted: EventHandler<void>;

/** Fires after a FOREGROUND data load has been loaded and fully rendered. */
dataRenderComplete: EventHandler<IDataRenderCompleteArgs>;

/** Arguments passed to the {@link SciFinanceChart.dataRenderComplete} event. */
interface IDataRenderCompleteArgs {
    /**
     * - "init" — first load and render after chart creation.
     * - "historical" — scroll-left-triggered prefetch of older candles.
     * - "interval-change" — user switched candle interval (e.g. 15m → 1H);
     *   the data feed was reloaded with new candles.
     * - "stale-recovery" — wake-from-sleep catch-up finished: missed candles
     *   were back-filled to now and the live stream re-seeded.
     */
    type: "init" | "historical" | "interval-change" | "symbol-change" | "stale-recovery";
}
```

</details>

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
