---
sidebar_position: 8
sidebar_label: Sparklines
title: "Sparklines and Watchlist Prices | SciTrader.js"
description: "Draw live sparklines and stream prices and 24-hour change for a crypto watchlist with SciTrader.js: SparkLineChart, WatchListDataManager, formatSymbolPair and parseInstrument, in plain TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "sparkline", "SparkLineChart", "watchlist", "WatchListDataManager", "formatSymbolPair", "parseInstrument"]
---

# Sparklines

A **sparkline** is a small, live line chart of a symbol's recent price, without axes, made to sit in a row of a list. `SparkLineChart.createSpark` draws one into any `<div>`.

**To build a watchlist.** The SDK has no watchlist component, because a watchlist's layout differs from app to app. It has the two parts that are hard to build:

- **`WatchListDataManager`** streams each symbol's last price and 24-hour change from the exchange's tickers, through `onDataUpdate`. It also fetches the candles for every symbol's sparkline over one shared stream, so a whole list makes one connection rather than one per row.
- **`SparkLineChart.createSpark`** draws a live sparkline into any element, from those candles and that stream.

Build the list itself, its rows and their layout, your own way, as the examples below do.

## TypeScript Example: A Watchlist with Sparklines

A chart with a watchlist of five Coinbase symbols beside it, in plain TypeScript. Each row has the pair, a live sparkline of the last day, the last price and the 24-hour change. `WatchListDataManager` streams the prices, and `SparkLineChart.createSpark` draws each sparkline from the manager's candles. Click a row to chart that symbol.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/components_Sparklines/vanilla" html={`<div style="display: flex; height: 100%"><div id="chart" style="flex: 1; min-width: 0"></div><div id="watchlist" style="width: 360px"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_Sparklines/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Watchlist with Sparklines

The same in React, with `SciFinanceChartView` for the chart. Each row's `Sparkline` component creates its sparkline in an effect, and deletes it when the row unmounts. Click a row to chart that symbol.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="SparklineWatchlist" name="../../_examples/components_Sparklines/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_Sparklines/react.tsx
    ```
</CodeSnippetBlock>

## WatchListDataManager: Prices, 24-Hour Change and Sparkline Data {#watchlistdatamanager}

`WatchListDataManager` is the data side of a watchlist. You give it the exchange and a list of symbols, and it gives you back, for every symbol:

- **The live price and 24-hour change**, as they change. It subscribes to the exchange's ticker stream for all the symbols at once, and calls your `onDataUpdate` with a row per symbol. Use these to fill your rows' price and change columns.
- **The candles for its sparkline, and a live stream of new ones.** It fetches them for all the symbols together, over one shared connection, and hands each symbol's share to you with `getSparklineData(symbol)`. Pass that to `SparkLineChart.createSpark`.

**Why you need it.** Without the manager, every row would fetch its own candles and open its own connection: twenty rows would make twenty requests and hold twenty connections, enough to hit an exchange's rate limits. The manager makes one of each for the whole list, and keeps the prices current without your code polling the exchange. It doesn't draw anything: your rows show its data, laid out your own way.

The usual order is: create the manager, call `createFeeds` with the symbols, render a row per symbol, and in each row draw the sparkline from `getSparklineData`. Call `delete()` when the list goes away.

```ts
import { CoinbaseExchange, TWatchListRowData, WatchListDataManager } from "scichart-scitrader";

// One manager for the whole list, bound to one exchange for its lifetime
const manager = new WatchListDataManager({
    exchangeName: CoinbaseExchange.name,
    // Called with every symbol's latest row: { id, symbol, last, change, changePC }
    onDataUpdate: (rows: TWatchListRowData[]) => render(rows),
});

// Start the price streams and the sparkline candles for these symbols
await manager.createFeeds(["BTC-USD", "ETH-USD", "SOL-USD"]);

// A symbol's sparkline candles and live stream, for SparkLineChart.createSpark
const data = await manager.getSparklineData("BTC-USD");

manager.delete(); // when the list goes away: closes the streams
```

| Member | What it does |
| --- | --- |
| `new WatchListDataManager({ exchangeName, onDataUpdate, … })` | Creates the manager for one exchange. `withSparklines: false` skips the sparkline data, for a list with prices only |
| `createFeeds(symbols)` | Starts the price streams and fetches the sparkline candles for these symbols. Call it again to change the list |
| `getSparklineData(symbol)` | The symbol's candles and live candle stream, once they've arrived; `undefined` if the symbol wasn't in `createFeeds` |
| `ensureSparklines(symbols)` | With `lazySparklines: true`, fetches sparkline data only for these symbols, e.g. the rows a long, virtualized list shows |
| `delete()` | Stops every stream |

`onDataUpdate` receives a `TWatchListRowData` per symbol: `last` is the last price, `change` the 24-hour change in price, and `changePC` the 24-hour change in percent.

<details>
<summary>The WatchListDataManager class and its types, with their TSDoc</summary>

```ts
class WatchListDataManager {
    readonly subscriptions: Subscription[];
    instruments: string[];
    constructor(props: IWatchListDataManager);
    createFeeds(instruments: string[]): Promise<void>;
    /**
     * Prefetch sparkline candles for the given symbols (the visible window + overscan from a
     * virtualized list), skipping any already fetched. Used in {@link lazySparklines} mode so
     * the watchlist only hits the candles endpoint for rows the user can actually see — the
     * combined burst stays small and within {@link sparklineCandleLimiter} + the exchange's
     * 429 backoff. A symbol whose prior fetch failed is left in `sparklineData` with empty
     * seed candles, so it is not retried on every scroll.
     */
    ensureSparklines(symbols: string[]): void;
    /**
     * The prefetched sparkline candles + filtered live stream for `symbol`, waiting only on
     * THAT symbol's seed. Returns `undefined` when the symbol was never prefetched — the
     * caller then seeds itself.
     */
    getSparklineData(symbol: string): Promise<TSparklineData | undefined>;
    delete(): void;
}

type IWatchListDataManager = {
    onDataUpdate(newData: TWatchListRowData[]): void;
    eventBus?: WatchlistEventBus;
    /**
     * When `false`, skip the historical-candle prefetch and the shared
     * multi-symbol candle WebSocket. Use this for consumers that only need
     * ticker data (last price + change %) and don't render sparklines —
     * e.g. the mobile populated/edit views. Default: `true`.
     */
    withSparklines?: boolean;
    /**
     * When `true`, `createFeeds` does NOT bulk-prefetch sparkline candles for the full
     * instrument set. Instead the caller drives prefetching incrementally via
     * {@link WatchListDataManager.ensureSparklines} — used by the virtualized desktop
     * watchlist so only visible (+ overscan) rows hit the candles endpoint. Default `false`
     * (eager prefetch-all), which the non-virtualized mobile lists still rely on.
     */
    lazySparklines?: boolean;
    /**
     * Optional. Defaults to `defaultExchangeProvider`, the shared registry
     * populated by the host app's bootstrap. Pass a dedicated provider for
     * test isolation or multi-tenant scenarios.
     */
    provider?: IExchangeProvider;
    /**
     * Exchange adapter name — drives every REST + WebSocket call this
     * manager makes (ticker stream, sparkline historicals, shared candle
     * stream). The manager is bound to one exchange for its lifetime; to
     * swap, the owning component must destroy and recreate it.
     */
    exchangeName: string;
};

type TWatchListRowData = {
    id: string;
    symbol: string;
    last: number;
    change: number;
    changePC: number;
};

/** Pre-fetched sparkline data for one watchlist symbol. */
type TSparklineData = {
    /** Historical candles (already loaded; row should NOT issue another REST call). */
    candles: ExchangeRestCandle[];
    /** Per-symbol live update stream filtered from the shared multi-symbol candle stream. */
    candleStream$: Observable<SciTraderCandle>;
};
```

</details>

## SparkLineChart.createSpark: Drawing a Sparkline {#sparklinechart}

A sparkline is a tiny SciChart chart: a single line of a symbol's closing prices over a recent window, with a fill beneath it, and no axes, gridlines, legend or zoom. `SparkLineChart.createSpark` creates it in the `<div>` you give it, sized to fill that `<div>`. It draws the candles it is given, then keeps the line moving as new candles arrive from the live stream. The line is green when its window ends higher than it started, and red when lower.

Pass it the manager's data, so it makes no request or connection of its own:

```ts
import {
    CoinbaseExchange,
    SPARKLINE_INTERVAL,
    SPARKLINE_WINDOW_CANDLES,
    SparkLineChart
} from "scichart-scitrader";

const data = await manager.getSparklineData("BTC-USD");

// Draw a live sparkline into a <div>. The <div> needs a size, e.g. 40px high
const { sciChartSurface } = await SparkLineChart.createSpark(element, {
    exchangeName: CoinbaseExchange.name,
    instrument: "BTC-USD",
    interval: SPARKLINE_INTERVAL, // the SDK's sparkline candle size
    candles: SPARKLINE_WINDOW_CANDLES, // how many candles it shows
    prefetchedCandles: data?.candles, // the manager's candles: no request of its own
    candleStream$: data?.candleStream$, // the manager's live stream: no connection of its own
});

sciChartSurface.delete(); // when the row goes away
```

| Option | What it does |
| --- | --- |
| `exchangeName`, `instrument` | The exchange and the symbol |
| `interval`, `candles` | The candle size, and how many candles the sparkline spans. `SPARKLINE_INTERVAL` and `SPARKLINE_WINDOW_CANDLES` are the SDK's defaults, and what the manager fetches |
| `prefetchedCandles` | Candles to draw, e.g. from `getSparklineData`. Left out, the sparkline fetches its own |
| `candleStream$` | Live candles, e.g. from `getSparklineData`. Left out, the sparkline opens its own connection; `null` draws a still snapshot |

`createSpark` resolves with the sparkline's SciChart surface: call `sciChartSurface.delete()` when the row goes away, to free it. SciChart tracks surfaces by their element's `id`. `createSpark` gives an element without one a unique id; if you set ids yourself, keep them unique.

A sparkline works without the manager too: give `createSpark` only the exchange, symbol, interval and candle count, and it fetches its own candles and opens its own stream. For more than a few, use the manager, so they share one connection.

<details>
<summary>SparkLineChart.createSpark, ISparklineChartOptions, SPARKLINE_INTERVAL and SPARKLINE_WINDOW_CANDLES, with their TSDoc</summary>

```ts
class SparkLineChart extends SciFinanceChart {
    /**
     * Sets up sparkline data and study on an existing SciChartSurface.
     * Designed to be called from a SciChartReact initChart function.
     */
    static createSpark(rootElement: string | HTMLDivElement, options: ISparklineChartOptions): Promise<{
        sciChartSurface: SciChartSurface;
    }>;
    applyXAxisLabels(): void;
}

/** Options for creating a sparkline chart */
interface ISparklineChartOptions extends IStudyOptions {
    exchangeName: string;
    instrument: string;
    interval: CandleInterval;
    candles: number;
    /** If set, the sparkline skips its own REST `getCandles` call and renders these directly. */
    prefetchedCandles?: ExchangeRestCandle[];
    /**
     * Controls live candle updates.
     * - `Observable`: skip opening a per-symbol WS, consume this stream instead.
     * - `null`: explicit opt-out — no WS at all (snapshot-only sparkline).
     * - `undefined` (default): a per-symbol candle WebSocket is opened internally.
     */
    candleStream$?: Observable<SciTraderCandle> | null;
}

/**
 * Preferred granularity: 96 x 15m spans the window, which draws a smoother line than the hourly
 * bars that would cover it in 24 points, at a few tens of KB across a full watchlist.
 *
 * Only a preference. A streaming source may ignore it — Coinbase's Advanced Trade `candles`
 * channel is fixed at 5 minutes — which is why seeds are trimmed by timestamp rather than kept
 * by count.
 */
const SPARKLINE_INTERVAL: CandleInterval;

/**
 * Candles to request for a full window at {@link SPARKLINE_INTERVAL}.
 *
 * 97 at 15m, which is still inside Binance's <=100 weight-1 tier for `klines`; a coarser
 * interval would be needed before the window could push a request into the expensive tier.
 */
const SPARKLINE_WINDOW_CANDLES: number;
```

</details>

## Showing Symbols as Pairs: formatSymbolPair and parseInstrument {#symbol-pairs}

Each exchange writes symbols its own way: `BTCUSDT` on Binance, `BTC-USD` on Coinbase. For display, a watchlist usually shows them the same way for every exchange, as a pair: `BTC/USDT`. Two functions from `scichart-scitrader` help.

### formatSymbolPair {#formatsymbolpair}

:::info
A symbol as a pair, for display: `BTCUSDT` or `BTC-USD` becomes `BTC/USDT` or `BTC/USD`. A symbol that isn't recognisably a pair is returned unchanged.
:::

Pass the exchange's name too, so the exchange's own symbol format is used:

```ts
import { formatSymbolPair } from "scichart-scitrader";

// formatSymbolPair(symbol: string, exchangeName?: string): string
formatSymbolPair("BTC-USD", "Coinbase"); // "BTC/USD"
formatSymbolPair("BTCUSDT", "Binance");  // "BTC/USDT"
formatSymbolPair("XYZ");                 // "XYZ": not a pair, so unchanged
```

The examples above use it for each row's name.

### parseInstrument {#parseinstrument}

`parseInstrument` splits a symbol into its two assets instead: the **base**, the asset being traded, and the **quote**, the currency it's priced in. Use it when you need them apart, for example to show a coin icon for the base:

```ts
import { IInstrumentParts, parseInstrument } from "scichart-scitrader";

// parseInstrument(symbol: string, exchangeName?: string): IInstrumentParts
const { base, quote } = parseInstrument("BTC-USD", "Coinbase"); // base "BTC", quote "USD"

parseInstrument("ETHBTC"); // { base: "ETH", quote: "BTC" }
parseInstrument("XYZ");    // { base: "XYZ", quote: null }: not a pair
```

**How the symbol is read.** With an exchange name, the exchange's own symbol parser decides. Without one, or if it doesn't recognise the symbol: a `-` or `/` separator, then a common quote at the end (`USDT`, `USD`, `BTC`, …). That last step is a guess, which suits display text. To convert a symbol from one exchange's format to another's, use [`mapSymbol`](/financial-charts/symbols-intervals-periods/changing-the-symbol/#mapsymbol).

<details>
<summary>formatSymbolPair, parseInstrument and IInstrumentParts, with their TSDoc</summary>

```ts
/**
 * A symbol as a pair for display: `BTCUSDT` or `BTC-USD` → `BTC/USDT`, `BTC/USD`. Returns the
 * symbol unchanged when it isn't recognisably a pair. See {@link parseInstrument}.
 */
function formatSymbolPair(symbol: string, exchangeName?: string): string;

/**
 * Split a symbol into base and quote assets for display, e.g. to show `BTC/USDT` or a coin icon.
 *
 * With `exchangeName`, the exchange's own normalizer decides (see {@link symbolNormalizers}).
 * Otherwise, or if it doesn't recognise the symbol: a `-` or `/` separator, then a common quote
 * at the end (`USDT`, `USD`, `BTC`, …). That last step is a guess, which suits display text; when
 * a wrong answer matters, use the normalizer alone.
 *
 * ```ts
 * parseInstrument("BTC-USD");            // { base: "BTC", quote: "USD" }
 * parseInstrument("ETHBTC");             // { base: "ETH", quote: "BTC" }
 * parseInstrument("XYZ");                // { base: "XYZ", quote: null }
 * ```
 */
function parseInstrument(symbol: string, exchangeName?: string): IInstrumentParts;

/** A symbol's base and quote assets, for display. */
interface IInstrumentParts {
    /** Base asset, e.g. `BTC` from `BTCUSDT` or `BTC-USD`. */
    base: string;
    /** Quote asset, e.g. `USDT` from `BTCUSDT`, or `null` if the symbol isn't recognisably a pair. */
    quote: string | null;
}
```

</details>

#### See also

- [Changing the Symbol: mapSymbol](/financial-charts/symbols-intervals-periods/changing-the-symbol/#mapsymbol)
- [Data sources](/financial-charts/data-sources/)
