---
sidebar_position: 5
sidebar_label: Candle Stores and Caching
title: "Caching Candles in IndexedDB: Candle Stores for Financial Charts | SciTrader.js"
description: "How SciTrader.js caches market data: candles kept in memory and in IndexedDB with idbPriceStore, per-interval caps, clearing the cache, nullCandleStore, and writing your own candle store, e.g. backed by your server."
keywords: ["IndexedDB cache", "candle cache", "market data cache", "IndexedDB JavaScript chart", "offline chart data", "candle store", "SciTrader.js"]
---

# Candle Stores and Caching

Market data APIs are slow and rate-limited, so SciTrader caches candles at two levels:

- **In memory, for the session.** Each registered exchange's client keeps the candles it has loaded for each symbol and interval, as ranges. Panning back over loaded history, or switching back to an interval, needs no request.
- **In a candle store, between sessions.** The store you register the exchange with, `registerExchange(exchange, store)`, keeps candles across page loads. `idbPriceStore` keeps them in the browser's IndexedDB, so a reload draws from the cache and fetches only newer candles.

## How a Load Uses the Cache

When a chart needs candles for a range, the client:

1. **reads the store** for the candles it has in that range;
2. **fetches the gaps** from the exchange, in requests of up to its `candleLimit` candles, padded to whole requests, since exchanges charge per request, not per candle;
3. **writes what it fetched** to the store;
4. **remembers where history starts.** When an exchange returns fewer candles than asked for, its history starts there. The store keeps this **listing-date floor**, so a later load doesn't ask for older candles that don't exist;
5. **remembers empty ranges,** such as a halted market, so it doesn't ask for them again.

The example below logs each of these as they happen.

## The IndexedDB Store: idbPriceStore

`idbPriceStore` is the built-in store, an `IdbCandleStore`. It stores candles in compact binary chunks, keyed by exchange, symbol and interval, so two exchanges that use the same symbol never share candles.

| Member | What it does |
| --- | --- |
| `clearAll()` | Deletes every cached candle, e.g. for a "Clear cache" button. The next load fetches again |
| `getIntervalCap(interval)` | The most candles kept for an interval |
| `setIntervalCap(interval, cap)` | Changes it, and saves the choice in `localStorage`. `Number.POSITIVE_INFINITY` for no cap |
| `resetIntervalCaps()` | Back to the default caps |
| `subscribeToEvictions(callback)` | Called after old candles are deleted to keep the store's size down |
| `cleanInterval` | How often old candles are deleted, in ms. Default: 24 hours |

**How much is kept.** By default, up to 50,000 candles per symbol at intervals from 1m to 30m, and every candle at 1h and longer. Older candles beyond the cap are deleted, at most once a day (`cleanInterval`).

**When the cache is cleared for you.** The cache is versioned with the SDK: after you update the SDK, the old cache is deleted on the first load.

:::warning[Two pages of one site open at once]
IndexedDB is shared by every page of a site. If two pages that use the cache, such as two docs pages or two tabs of your app, are open at once, opening the cache can fail in one of them, and its chart stays empty. A fix that falls back to no cache is planned. Until then, if your app opens charts in several tabs, use `nullCandleStore` in all but one.
:::

## Not Caching: nullCandleStore

`nullCandleStore` stores nothing: every page load starts cold, though the in-memory cache still works within a session. Use it for:

- **data that changes between loads,** such as CSV data moved to the current date, or generated data. `registerCSVExchange` uses it;
- **finding a caching problem:** if a chart shows wrong or missing candles, switch to `nullCandleStore` to see whether the cache is the cause.

`isCandleCacheEnabled()` reads the page's URL: `?cache=0` turns the cache off for that page load. The SciTrader app chooses its store this way:

```ts
import { idbPriceStore, isCandleCacheEnabled, nullCandleStore } from "scichart-scitrader";

const store = isCandleCacheEnabled() ? idbPriceStore : nullCandleStore; // ?cache=0 turns it off
defaultExchangeProvider.registerExchange(CoinbaseExchange, store);
```

## Writing Your Own Candle Store: ICandleStore

A store is any object that implements `ICandleStore`, so you can cache candles anywhere, e.g. on your server, so users share a cache, or in memory only. Every call says which exchange, symbol and interval it is for; times are in milliseconds.

| ICandleStore member | Required | What it does |
| --- | --- | --- |
| `getCandles(exchange, symbol, interval, start, end)` | Yes | The stored candles with `start <= openTime <= end`, oldest first |
| `insertCandles(exchange, symbol, interval, candles)` | Yes | Stores candles, merging with any already stored |
| `getEarliestCandleTime`, `setEarliestCandleTime` | Yes | The listing-date floor: where the exchange's history starts |
| `getKnownEmptyRanges`, `setKnownEmptyRanges` | No | Time ranges with no candles, so they aren't asked for again |
| `subscribeToEvictions(callback)` | No | Lets the in-memory cache know when stored candles are deleted |

The example wraps `idbPriceStore` in a store that logs every call:

```ts
// A candle store that logs what the SDK asks of it, and passes each call to idbPriceStore, the
// built-in IndexedDB store. Every ICandleStore call says which exchange, symbol and interval it is for
class LoggingCandleStore implements ICandleStore {
    constructor(private readonly log: (line: string) => void) {}

    // The cache asks the store first: candles it has for the requested range
    async getCandles(exchange: string, symbol: string, interval: CandleInterval, start?: number, end?: number) {
        const candles = await idbPriceStore.getCandles(exchange, symbol, interval, start, end);
        this.log(`read   ${symbol} ${interval}: ${candles.length} cached candles`);
        return candles;
    }

    // Then it fetches what was missing from the exchange, and stores it here
    async insertCandles(exchange: string, symbol: string, interval: CandleInterval, candles: ExchangeRestCandle[]) {
        this.log(`write  ${symbol} ${interval}: ${candles.length} candles from ${exchange}`);
        return idbPriceStore.insertCandles(exchange, symbol, interval, candles);
    }

    // Where the exchange's history starts, once found, so it isn't asked for again
    getEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval) {
        return idbPriceStore.getEarliestCandleTime(exchange, symbol, interval);
    }
    setEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval, time: number) {
        this.log(`floor  ${symbol} ${interval}: history starts ${new Date(time).toISOString().slice(0, 10)}`);
        return idbPriceStore.setEarliestCandleTime(exchange, symbol, interval, time);
    }

    // Optional: time spans with no candles, so they aren't asked for again
    getKnownEmptyRanges(exchange: string, symbol: string, interval: CandleInterval) {
        return idbPriceStore.getKnownEmptyRanges(exchange, symbol, interval);
    }
    setKnownEmptyRanges(exchange: string, symbol: string, interval: CandleInterval, ranges: Array<{ start: number; end: number }>) {
        return idbPriceStore.setKnownEmptyRanges(exchange, symbol, interval, ranges);
    }

    // Optional: tells the cache when old candles are deleted to keep the store's size down
    subscribeToEvictions(callback: () => void) {
        return idbPriceStore.subscribeToEvictions(callback);
    }
}
```

## TypeScript Example: Watching the Candle Cache

BTC-USD from Coinbase, registered with the logging store, in a provider of the chart's own. The log on the right shows each store call. Switch to 6h and back to 1h: the second time, the 1h candles come from the store, with no request. **Clear the cache** calls `idbPriceStore.clearAll()`. Reload the page, and the candles come from IndexedDB.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/dataSources_CandleStore/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><pre id="store-log" style="width: 340px"></pre></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_CandleStore/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Watching the Candle Cache

The same chart in React. The log is React state.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="CandleStoreChart" name="../../_examples/dataSources_CandleStore/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/dataSources_CandleStore/react.tsx
    ```
</CodeSnippetBlock>

<details>
<summary>The ICandleStore interface, with its TSDoc</summary>

```ts
/**
 * A local candle cache, addressed by `(exchange, symbol, interval)`.
 *
 * ### Why `exchange` is part of every key
 *
 * One store can be shared by every exchange registered with it (see `registerExchange`).
 * With the exchange in every key, two exchanges that use the same symbol string never share
 * candles.
 */
interface ICandleStore {
    getCandles(exchange: string, symbol: string, interval: CandleInterval, start?: number, end?: number): Promise<ExchangeRestCandle[]>;
    insertCandles(exchange: string, symbol: string, interval: CandleInterval, prices: ExchangeRestCandle[]): Promise<void>;
    /**
     * Open time (ms) of the oldest candle the remote exchange has ever returned
     * for this (exchange, symbol, interval), or `undefined` if no listing-date floor has
     * been observed yet. Persisted across sessions so subsequent cold loads
     * that target dates below the floor can short-circuit without a wasted
     * REST round-trip.
     */
    getEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval): Promise<number | undefined>;
    /**
     * Persist a discovered listing-date floor. Called by the cache when
     * a remote fetch returns fewer candles than requested — the partial result
     * implies the remote has no data older than its earliest returned candle.
     */
    setEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval, time: number): Promise<void>;
    /**
     * Time spans the remote has confirmed it has no candles for — halts, outages, buckets in
     * which the instrument simply did not trade.
     *
     * Without them, a cache that stores only candles can't tell a range it never fetched from
     * a range with no candles, and asks the exchange again for every gap.
     *
     * Optional: a store that omits these works, at the cost of those extra requests.
     */
    getKnownEmptyRanges?(exchange: string, symbol: string, interval: CandleInterval): Promise<Array<{
        start: number;
        end: number;
    }>>;
    setKnownEmptyRanges?(exchange: string, symbol: string, interval: CandleInterval, ranges: Array<{
        start: number;
        end: number;
    }>): Promise<void>;
    /**
     * Register a callback fired after the store deletes candles, e.g. to
     * keep its size down. Optional: stores that never delete candles omit it.
     */
    subscribeToEvictions?(callback: () => void): () => void;
}
```

</details>

<details>
<summary>The IdbCandleStore class, with its TSDoc</summary>

```ts
declare class IdbCandleStore implements ICandleStore {
    /** How often old candles are deleted, in ms. Default: 24 hours. */
    cleanInterval: number;
    /**
     * Register a callback to fire after each successful `cleanCacheAll`.
     * Returns an unsubscribe function. The callback is invoked even when
     * no candles were deleted, so keep it cheap.
     */
    subscribeToEvictions(cb: TEvictionSubscriber): () => void;
    /**
     * The candle cap for an interval with no default cap of its own. The
     * default caps: 50,000 candles from 1m to 30m, unlimited from 1h.
     */
    maxCandles: number;
    minDensity: number;
    constructor();
    /**
     * Returns the active candle cap for `interval`: the override set with
     * {@link setIntervalCap} if there is one, otherwise the default.
     */
    getIntervalCap(interval: CandleInterval): number;
    /**
     * Set a per-interval cap override and persist it. Pass a non-negative
     * finite number (use `Number.POSITIVE_INFINITY` for "no cap"), or call
     * {@link resetIntervalCaps} to drop all overrides.
     */
    setIntervalCap(interval: CandleInterval, cap: number): void;
    /** Drop every per-interval cap override; future caps fall back to defaults. */
    resetIntervalCaps(): void;
    /**
     * Wipe the entire IndexedDB database. The next load fetches candles
     * from the exchange again.
     *
     * Fires the eviction subscribers, so the in-memory cache drops its
     * candles too.
     *
     * Interval-cap overrides survive — they're a UI preference, not
     * cached data.
     */
    clearAll(): Promise<void>;
    /**
     * Writes candles as binary chunks, merging into whatever each chunk already holds.
     *
     * Read-modify-write per touched chunk rather than a blind put, because a fetch almost never
     * lines up with a chunk boundary: appending the live bar or back-filling a gap lands inside
     * a chunk that already has candles, and a blind put would drop them.
     */
    insertCandles(exchange: string, symbol: string, interval: CandleInterval, candles: ExchangeRestCandle[]): Promise<void>;
    getEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval): Promise<number | undefined>;
    setEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval, time: number): Promise<void>;
    /**
     * Known-empty spans for this series, or `[]` when none have been recorded.
     */
    getKnownEmptyRanges(exchange: string, symbol: string, interval: CandleInterval): Promise<Array<{
        start: number;
        end: number;
    }>>;
    setKnownEmptyRanges(exchange: string, symbol: string, interval: CandleInterval, ranges: Array<{
        start: number;
        end: number;
    }>): Promise<void>;
    getCandles(exchange: string, symbol: string, interval: CandleInterval, start?: number, end?: number): Promise<ExchangeRestCandle[]>;
    /** Delete candles beyond each interval's cap now, rather than waiting for `cleanInterval`. */
    cleanCacheAll(): Promise<void>;
}
```

</details>

<details>
<summary>The NullCandleStore class, isCandleCacheEnabled, idbPriceStore and nullCandleStore, with their TSDoc</summary>

```ts
declare class NullCandleStore implements ICandleStore {
    /** Always a miss, so `DataCacheLayer` treats the whole requested range as a gap. */
    getCandles(): Promise<ExchangeRestCandle[]>;
    /** Discards. */
    insertCandles(): Promise<void>;
    /**
     * Always `undefined` — with nothing persisted there is no observed listing-date floor, so
     * the cache layer probes the remote exactly as it would on a cold first-ever load.
     */
    getEarliestCandleTime(): Promise<number | undefined>;
    /** Discards. */
    setEarliestCandleTime(): Promise<void>;
}

/**
 * Whether the IndexedDB candle cache should be used.
 *
 * `?cache=0` (or `?cache=off`) disables it for that page load only — nothing is persisted, so
 * removing the parameter restores normal behaviour with the previous cache contents intact.
 */
function isCandleCacheEnabled(search?: string): boolean;

const idbPriceStore: IdbCandleStore;
const nullCandleStore: NullCandleStore;
```

</details>

## Where to read next

- [Building a Custom Exchange](/financial-charts/data-sources/custom-exchange/): the exchange the store caches for.
- [Data Manager and Data Feeds](/financial-charts/data-sources/data-manager-and-data-feeds/): what the chart does with the candles.
- [Data Sources](/financial-charts/data-sources/): registering exchanges.
