---
sidebar_position: 1
sidebar_label: Changing the Symbol
title: "Changing the Symbol | SciTrader.js Financial Charts"
description: "Switch a SciTrader.js trading chart to another symbol or exchange with SciFinanceChart.setSymbol, and learn how the chart fetches candles from the exchange, the cache and the live stream."
keywords: ["SciTrader", "SciTrader.js", "change symbol trading chart", "setSymbol", "createDataFeed", "IRemoteExchange"]
---

# Changing the Symbol

## SciFinanceChart.setSymbol {#setsymbol}

`setSymbol` switches the chart to another symbol, and optionally another exchange. It keeps the current interval and, unless you pass one, the current [period](/financial-charts/symbols-intervals-periods/periods/). Studies, panes and drawings stay, and every study recalculates on the new data.

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
```

```ts
import { BinanceExchange } from "scichart-scitrader";

const chart = financeChartPanel.financeApi; // SciFinanceChart

// Switch to another symbol on the same exchange.
// The interval, period, studies and drawings stay the same
await chart.setSymbol("ETH-USD");

// Switch to another exchange too. The exchange must already be registered with
// defaultExchangeProvider.registerExchange, and the symbol is in that exchange's own format
await chart.setSymbol("ETHUSDT", BinanceExchange.name);

// Switch symbol, and show the last month once the new candles are loaded.
// Pass undefined as the exchange to keep the current one
await chart.setSymbol("SOL-USD", undefined, { period: "1M" });
```

The promise resolves with the chart's new default data feed once the new candles are drawn.

### Converting Symbols Between Exchanges with mapSymbol {#mapsymbol}

Each exchange writes symbols its own way: Binance uses `BTCUSDT`, Coinbase uses `BTC-USD`. When you switch exchange, `mapSymbol` converts the symbol the chart is showing into the new exchange's format, so the user stays on the same market:

```ts
import { CoinbaseExchange, mapSymbol } from "scichart-scitrader";

// mapSymbol(symbol, from, to) converts a symbol from one exchange's format to another's.
// "from" and "to" are exchange names, as registered: here, the built-in Binance and Coinbase
mapSymbol("BTCUSDT", "Binance", "Coinbase"); // "BTC-USD"
mapSymbol("BTC-USD", "Coinbase", "Binance"); // "BTCUSDT"

// It returns null when it can't convert: an exchange it doesn't know, or a symbol it can't read
mapSymbol("BTCXYZ", "Binance", "Coinbase"); // null

// Example: move the chart from Binance to Coinbase, keeping the same market
const coinbaseSymbol = mapSymbol("BTCUSDT", "Binance", "Coinbase");
if (coinbaseSymbol) {
    await chart.setSymbol(coinbaseSymbol, CoinbaseExchange.name);
}
```

The match is approximate for stablecoin and fiat quotes: Binance's `BTCUSDT` (priced in the USDT stablecoin) maps to Coinbase's `BTC-USD` (priced in US dollars). They trade close to 1:1, but they are different markets. `mapSymbol` knows the built-in `Binance` and `Coinbase` exchanges; for your own exchange, add an `ISymbolNormalizer` to `symbolNormalizers`.

<details>
<summary>The mapSymbol function, with its TSDoc</summary>

```ts
/**
 * Convert a symbol from one provider's native format to another's.
 *
 * Equivalence is approximate for stablecoin/fiat pairs (USDT on Binance maps
 * to USD on Coinbase — those are different instruments that trade close to
 * 1:1). Returns `null` when the source provider isn't registered, the target
 * provider isn't registered, or no quote equivalent exists.
 *
 * @example
 * mapSymbol("BTCUSDT", "Binance", "Coinbase")   // "BTC-USD"
 * mapSymbol("BTC-USD", "Coinbase", "Binance")   // "BTCUSDT"
 * mapSymbol("BTCXYZ", "Binance", "Coinbase")    // null (unparseable)
 */
function mapSymbol(symbol: string, from: string, to: string): string | null;
```

</details>

## What happens when the symbol changes

The chart doesn't hold candles itself. It draws its **default data feed**: an object that knows one exchange, one symbol and one interval, and keeps the chart's data up to date from them. `setSymbol` replaces that feed with a new one. In practice:

1. **The chart raises `dataLoadStarted`.** A `SciFinanceChartView` covers the old candles with its loading overlay.
2. **The old feed stops.** Its live subscription is closed, and a load it still has in flight is cancelled, so late data for the old symbol can't reach the chart.
3. **The exchange is looked up by name.** `exchangeName` is the name the exchange was registered under with `defaultExchangeProvider.registerExchange(...)` (see [Data sources](/financial-charts/data-sources/#registering-an-exchange)). Every exchange, built in or your own, is an `IRemoteExchange`.
4. **History is fetched.** The new feed asks for enough candles to fill the period, plus a buffer and whatever warm-up the chart's indicators need. The request goes through the exchange's **candle store** first: with `idbPriceStore`, candles already cached in IndexedDB are read locally, and only the missing ranges are requested from the exchange with `IRemoteExchange.getCandles(symbol, interval, start, end, limit)`. Large ranges are split into requests of at most the exchange's `candleLimit` candles.
5. **The chart redraws.** Studies recalculate, the view lands on the period, and the chart raises `dataRenderComplete` with `type: "symbol-change"`.
6. **Live updates start.** The feed subscribes to `IRemoteExchange.getCandleStream(symbol, interval)`, an RxJS `Observable` of the current candle, and updates the last candle (or appends a new one) as it changes. Exchanges without live data return `EMPTY`.
7. **Older data loads on demand.** When the user pans left past the loaded data, the chart fetches the next page of older candles the same way, from the cache first, then the exchange.

So the same `setSymbol` call works whether the data comes from Binance, a CSV file or your own server: what changes is the `IRemoteExchange` registered under `exchangeName`. To connect your own source, see [A custom data source](/financial-charts/data-sources/#a-custom-data-source).

To find out what the chart is currently showing, read the default feed:

```ts
// chart.dataFeeds is a Map of every data feed on the chart, keyed by feed id.
// The default feed is the one the price candles are drawn from
const feed = [...chart.dataFeeds.values()].find((f) => f.isDefault);

// Its exchange, symbol and interval are what the chart is showing
console.log(feed.exchangeName, feed.symbol, feed.interval); // e.g. "Coinbase" "BTC-USD" "6h"
```

## SciFinanceChart.createDataFeed: Changing Symbol and Interval Together {#changing-symbol-and-interval-together}

`setSymbol` changes the symbol, and `changeInterval` changes the interval. Calling one after the other works, but the chart loads candles twice: once for the new symbol at the old interval, then again at the new interval. `createDataFeed` does both in one step, with one load.

It does this by creating a new **data feed**: the object that loads one exchange's candles for one symbol at one interval, and keeps them up to date. The chart draws its candles from its **default** feed, so making the new feed the default switches the chart to it. `setSymbol` does exactly this, with the current interval.

```ts
createDataFeed(
    feedType: EDataFeedType,   // what kind of data: candles, or order-book data
    exchangeName: string,      // the exchange's registered name, e.g. CoinbaseExchange.name
    symbol: string,            // in that exchange's own format, e.g. "ETH-USD"
    interval: CandleInterval,  // the candle size
    isDefault: boolean,        // true: replace what the chart shows; false: add an extra feed
    period?: TPeriod | null    // the period to show once loaded; null for none
): Promise<IDataFeed>
```

| Parameter | What to pass |
| --- | --- |
| `feedType` | `EDataFeedType.OHLCVRealtime` for the chart's price candles, with live updates. `EDataFeedType.OrderBook` for order-book data, which order-book studies use |
| `exchangeName` | The name the exchange was registered under. Use the exchange's `name`, e.g. `CoinbaseExchange.name` |
| `symbol` | The symbol in that exchange's own format. See [mapSymbol](#mapsymbol) |
| `interval` | The candle interval, e.g. `CandleInterval.ONE_DAY` |
| `isDefault` | `true` to switch the chart to this feed, as `setSymbol` does. `false` to add a feed beside the default one, for studies that need other data. The chart must already have a default feed |
| `period` | Optional. The period to show once the candles are loaded, e.g. `"1Y"`. The first load fetches just enough candles for it |

```ts
import { CandleInterval, CoinbaseExchange, EDataFeedType, IDataFeed } from "scichart-scitrader";

// Switch the chart to ETH-USD daily candles over the last year, in one load.
// The chart raises dataLoadStarted now, and dataRenderComplete({ type: "symbol-change" })
// once the new candles are drawn
const feed: IDataFeed = await chart.createDataFeed(
    EDataFeedType.OHLCVRealtime, // candles, with live updates
    CoinbaseExchange.name,       // the exchange, as registered
    "ETH-USD",                   // the symbol, in Coinbase's format
    CandleInterval.ONE_DAY,      // the new interval
    true,                        // make this the default feed: the chart switches to it
    "1Y"                         // optional: show the last year once loaded
);

// The promise resolves with the new feed, once its first candles are loaded
console.log(feed.id, feed.symbol, feed.interval);
```

`createDataFeed` creates the feed, loads its first candles, subscribes it to live updates, and resolves with it.

- **`isDefault: true`** replaces the chart's default feed. The old feed stops, as described in [What happens when the symbol changes](#what-happens-when-the-symbol-changes), and the chart raises the same events as `setSymbol`.
- **`isDefault: false`** adds a feed beside the default one. To remove it later, pass its `id` to `chart.removeDataFeed(id)`.
- **`EDataFeedType.OrderBook`** resolves with `undefined` when the exchange has no order-book source. See [Order-book data](/financial-charts/data-sources/#order-book-data).

<details>
<summary>The IDataFeed interface and EDataFeedType enum, with their TSDoc</summary>

```ts
interface IDataFeed extends IDeletable {
    readonly feedType: EDataFeedType;
    readonly id: string;
    readonly exchangeName: string;
    readonly symbol: string;
    readonly interval: CandleInterval;
    readonly dataManager: IDataManager;
    readonly sourceIds: DataSourceId[];
    readonly isDefault: boolean;
    readonly subscriptions: Subscription[];
    getName(): string;
    /**
     * optional cancellation signal. When aborted the in-flight
     * `exchange.getCandles` rejects via {@link abortable} and the feed
     * returns without writing to `dataManager`. Used by `DataFeedBase.change`
     * to keep a stale response from a prior `(symbol, interval)` from
     * overwriting the new feed's data.
     */
    loadInitialData(signal?: AbortSignal): Promise<void>;
    /**
     * Load a specific historical batch by explicit range. Plan
     * parallel-backward-loads requires this shape so the coordinator can
     * compute distinct, non-overlapping ranges per concurrent spawn — the
     * old `targetStart`-only signature implicitly used `this.startDate` as
     * the right edge, which prevented concurrent calls from claiming
     * distinct slices.
     *
     * @param loadStart Start time (ms) of the batch to fetch. The feed
     *   may clamp this against its known listing-date floor.
     * @param loadEnd End time (ms) of the batch — the boundary just
     *   AFTER the newest candle the spawn is allowed to claim.
     * @param signal Cancellation token.
     * @returns A `LoadResult` describing what was actually inserted.
     */
    loadPreviousData(loadStart: number, loadEnd: number, signal?: AbortSignal): Promise<LoadResult>;
    /**
     * load candles to the RIGHT of the existing dataset. Used
     * when the live WebSocket can't keep up (parked-overnight reconnect
     * gaps, slow networks, symbol-switch subscription lag).
     *
     * @param targetEnd Optional maximum end time (ms) the caller wants
     *   covered. When omitted, fetches up to `Date.now()`. Future times
     *   are clamped — Binance returns nothing beyond now.
     * @param signal optional cancellation signal. When
     *   aborted the caller's await rejects with an AbortError; the
     *   underlying request still completes (see {@link abortable}).
     * @returns A `LoadResult` describing what was actually appended.
     *   `count: 0` is the steady-state expected return when no gap
     *   exists (`lastX` is already current).
     */
    loadNextData?(targetEnd?: number, signal?: AbortSignal): Promise<LoadResult>;
    subscribeToUpdates(): void;
    change(symbol: string, interval: CandleInterval): Promise<void>;
    /**
     * tear down the live-update subscription
     * without touching loaded data. Used by the stale-gap recovery to stop a
     * reconnected-but-stale-anchored stream from appending wrong-timestamped
     * candles while a catch-up back-fill runs. Pairs with
     * {@link resumeLiveUpdates}.
     */
    pauseLiveUpdates(): void;
    /**
     * re-open the live-update subscription
     * after {@link pauseLiveUpdates}. For the realtime feed this re-seeds the
     * trade accumulator from a fresh current candle, so post-wake ticks resume
     * at the correct wall-clock time instead of the pre-sleep anchor.
     */
    resumeLiveUpdates(): void;
    /**
     * invoked by the live-update handler when
     * an incoming candle reveals the feed has fallen behind the wall clock
     * (see {@link isStale}). The host chart wires this to its recovery routine
     * (pause live → back-fill → re-seed). When unset, the feed applies the
     * incoming candle as normal.
     *
     * Optional: only meaningful for candle feeds.
     */
    onStaleGapDetected?: () => void;
    /**
     * `true` when the newest loaded candle is
     * more than {@link LOAD_BUFFERS.staleCandleThreshold} intervals behind the
     * wall clock. Cheap O(1) check. Used by both the live-update handler and
     * the host chart's `online` backstop.
     *
     * Optional: only candle feeds implement it.
     */
    isStale?(): boolean;
    /**
     * Earliest candle openTime (ms since epoch) the feed has confirmed
     * for its current `(symbol, interval)`. Populated by an eager listing-
     * date probe in `loadInitialData`, or by D11's incremental floor
     * detection after a backward load. Returns `null` when the floor is
     * unknown (probe failed, feed type doesn't support a listing-date
     * concept, or no partial-response signal has fired yet).
     *
     * Optional: only OHLCV-style feeds with a probe path implement it.
     */
    getKnownEarliestCandle?(): number | null;
    /**
     * force any pending batched
     * backward-load chunks to commit immediately. Called by the
     * historical-load coordinator at the end of a cascade so the last
     * partial batch isn't stranded.
     *
     * Optional: only feeds that buffer commits implement it.
     */
    flushPendingCommits?(): void;
}

enum EDataFeedType {
    OHLCVRealtime = "OHLCVRealtime",
    OHLCV1second = "OHLCV1second",
    Trade = "Trade",
    UserOrder = "UserOrder",
    OrderBook = "OrderBook"
}
```

</details>

## TypeScript Example: Changing the Symbol

This is the example from [Symbols, Intervals and Periods](/financial-charts/symbols-intervals-periods/#typescript-example-changing-the-symbol-interval-and-period). Its symbol buttons call `setSymbol`. That page also has the React version.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/gettingStarted_SymbolInterval/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/gettingStarted_SymbolInterval/vanilla.ts
    ```
</CodeSnippetBlock>

#### See also

- [Changing the interval](/financial-charts/symbols-intervals-periods/changing-the-interval/)
- [Data sources](/financial-charts/data-sources/)
