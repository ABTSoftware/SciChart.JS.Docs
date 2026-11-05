---
sidebar_position: 4
sidebar_label: Building a Custom Exchange
title: "Build a Custom Data Feed: a Kraken API Exchange Adapter for a JavaScript Chart | SciTrader.js"
description: "Connect any market data API to a SciTrader.js JavaScript or React financial chart by implementing IRemoteExchange, step by step, with a complete Kraken API adapter: historical candles over REST, and live candles, trades and tickers over WebSocket."
keywords: ["Kraken API", "custom data feed", "market data API chart", "exchange adapter", "IRemoteExchange", "WebSocket chart", "real-time candlestick chart JavaScript", "React financial chart data", "SciTrader.js"]
---

# Building a Custom Exchange: a Kraken API Adapter

To chart data from any market data API, write an **exchange**: an object that implements `IRemoteExchange`. It answers the SDK's requests, such as "the 1h candles for BTC/USD between these times", and streams live data. Register it, and charts, watchlists and the symbol picker use it like the built-in exchanges, with the same caching and paging back through history.

This page builds a complete adapter for the [Kraken API](https://docs.kraken.com/api/), Kraken's public market data, which needs no API key. It gets historical candles over REST and live candles, trades and tickers over WebSocket. The [examples](#kraken-example) run it live.

:::note
Kraken's public API is free and needs no key, but has rate limits and terms of use. Read [Kraken's API terms](https://www.kraken.com/legal/api-terms-of-use) before using it in production.
:::

## What an Exchange Implements {#iremoteexchange}

| `IRemoteExchange` member | Required | What it does |
| --- | --- | --- |
| `name` | Yes | The name charts ask for (`exchangeName`) |
| `candleLimit` | Yes | The most candles one request returns. The SDK pages long ranges in requests this size |
| `getSupportedIntervals()` | Yes | The intervals it serves, which the interval pickers offer |
| `getInstruments()` | Yes | Every symbol it trades |
| `getCandles(symbol, interval, start, end, limit, signal)` | Yes | Historical candles |
| `getListingDate(symbol, interval, signal)` | Yes | Where its history starts, or `null` if unknown |
| `getCandleStream(symbol, interval)` | Yes | Live candles |
| `getTrades`, `getTradeStream` | Yes | Recent and live trades. Return `[]` and an empty stream if the API has none |
| `getTickerStream`, `getAllTickerStream` | Yes | Live 24-hour tickers, for watchlists |
| `hasCompleteCandleStream` | No | `true` if the live candle stream sends the whole forming candle, so the chart needn't build it from trades |
| `getSparklineCandleStream` | No | A dedicated stream of candles for many symbols at once, for watchlist sparklines |

Streams are RxJS `Observable`s: the SDK subscribes, and unsubscribes when it no longer needs the data, which should close the connection.

## Step by Step: the Kraken Adapter

### Step 1: The Intervals

List the intervals the API serves, and how it names them. Kraken names an interval by its length in minutes:

```ts
const KRAKEN_MINUTES: Partial<Record<CandleInterval, number>> = {
    [CandleInterval.ONE_MINUTE]: 1,
    [CandleInterval.FIVE_MINUTES]: 5,
    [CandleInterval.FIFTEEN_MINUTES]: 15,
    [CandleInterval.THIRTY_MINUTES]: 30,
    [CandleInterval.ONE_HOUR]: 60,
    [CandleInterval.FOUR_HOURS]: 240,
    [CandleInterval.ONE_DAY]: 1440,
    [CandleInterval.ONE_WEEK]: 10080,
};
```

### Step 2: The Exchange's Name and Limits

The name is what charts ask for. `candleLimit` is the most candles one request returns: Kraken's OHLC endpoint returns only the **latest 720 candles** of each interval.

`hasCompleteCandleStream: true` says the live candle stream sends the whole forming candle on every update. Without it, the SDK builds the forming candle from the trade stream, which suits exchanges whose candle stream only updates every few seconds.

```ts
class KrakenExchange implements IRemoteExchange {
    // Step 2. The name charts ask for (exchangeName), and the most candles one request returns.
    // Kraken's OHLC endpoint returns only the latest 720 candles of each interval
    readonly name = "Kraken";
    candleLimit = 720;
    // Kraken's live OHLC channel sends the whole forming candle on every trade, so the chart
    // can draw it as it is, instead of rebuilding it from the trade stream
    readonly hasCompleteCandleStream = true;

    getSupportedIntervals(): CandleInterval[] {
        return Object.keys(KRAKEN_MINUTES) as CandleInterval[];
    }

    // Symbols in Kraken's WebSocket form, BASE/QUOTE. The REST API accepts the same names
    async getInstruments(): Promise<string[]> {
        return ["BTC/USD", "ETH/USD", "SOL/USD"];
    }
    // …
}
```

### Step 3: Historical Candles: getCandles {#getcandles}

Return the candles with `start <= openTime <= end`, oldest first, at most `limit` of them. Fetch with the `signal`, so the SDK can cancel a request it no longer needs.

```ts
async getCandles(
    symbol: string,
    interval: CandleInterval,
    start: number,
    end: number,
    limit: number,
    signal?: AbortSignal
): Promise<ExchangeRestCandle[]> {
    const minutes = KRAKEN_MINUTES[interval];
    if (!minutes) return []; // an interval Kraken doesn't serve
    const url = `https://api.kraken.com/0/public/OHLC?pair=${encodeURIComponent(symbol)}&interval=${minutes}`;
    const json = await (await fetch(url, { signal })).json();
    if (json.error?.length) throw new Error(`Kraken: ${json.error.join(", ")}`);
    // The result is keyed by pair name, next to a "last" cursor. Each row is
    // [time, open, high, low, close, vwap, volume, count]
    const pairKey = Object.keys(json.result).find((key) => key !== "last");
    const rows: Array<[number, string, string, string, string, string, string, number]> = json.result[pairKey] ?? [];
    return rows
        .map(([time, open, high, low, close, , volume, count]) => ({
            openTime: time * 1000,
            closeTime: time * 1000 + minutes * 60_000 - 1, // the last millisecond of the candle
            open,
            high,
            low,
            close,
            volume,
            trades: count,
        }))
        .filter((candle) => candle.openTime >= start && candle.openTime <= end)
        .slice(0, limit);
}
```

:::warning[Times in milliseconds; prices as strings]
`ExchangeRestCandle` times are in **milliseconds**, and prices and volume are **strings**, as most exchanges send them. Kraken sends times in seconds, so multiply by 1,000. `closeTime` is the last millisecond of the candle, the next candle's open time minus 1.
:::

### Step 4: Where History Starts: getListingDate

The chart stops panning back at the listing date. Return the open time of the oldest candle the API has, or `null` if it can't tell. If finding it fetched candles, return them as `surplusCandles`, and the SDK caches them.

```ts
async getListingDate(symbol: string, interval: CandleInterval, signal?: AbortSignal): Promise<IListingDateResult | null> {
    const candles = await this.getCandles(symbol, interval, 0, Date.now(), this.candleLimit, signal);
    return candles.length ? { openTime: candles[0].openTime, surplusCandles: candles } : null;
}
```

### Step 5: Live Candles: getCandleStream

Emit a `SciTraderCandle` for every update to the forming candle. Unlike `ExchangeRestCandle`, its prices are **numbers**.

```ts
getCandleStream(symbol: string | string[], interval: CandleInterval): Observable<SciTraderCandle> {
    const minutes = KRAKEN_MINUTES[interval];
    return krakenChannel<SciTraderCandle>("ohlc", { symbol: [symbol].flat(), interval: minutes, snapshot: false }, (bar) => {
        const startTime = Date.parse(bar.interval_begin);
        return {
            eventTime: Date.parse(bar.timestamp),
            symbol: bar.symbol,
            startTime,
            closeTime: startTime + minutes * 60_000 - 1,
            open: bar.open,
            high: bar.high,
            low: bar.low,
            close: bar.close,
            volume: bar.volume,
            trades: bar.trades,
            interval,
            buyVolume: 0, // not in Kraken's OHLC data
        };
    });
}
```

:::warning[Echo the symbol you were asked for]
Each candle's `symbol` must be **exactly the string the SDK asked for**, because the SDK matches candles to charts by it. Kraken's WebSocket names symbols `BTC/USD`, as this adapter does, so it echoes them as they are. An adapter whose API names symbols differently from its own `getInstruments()` must map them back, and an adapter that shares one connection between subscriptions must route each update to the subscription that asked for its symbol.
:::

### Step 6: Live Trades and Tickers

Trades feed the large-trade studies, and tickers feed watchlists and price readouts. A helper turns one Kraken WebSocket subscription into an `Observable`, which closes the connection on unsubscribe:

```ts
// One Kraken WebSocket v2 subscription as an Observable: connect, subscribe to `channel`, and emit
// each item of each update. Unsubscribing closes the connection
function krakenChannel<T>(channel: string, params: object, toItem: (data: any) => T): Observable<T> {
    return new Observable<T>((subscriber) => {
        const socket = new WebSocket("wss://ws.kraken.com/v2");
        socket.onopen = () => socket.send(JSON.stringify({ method: "subscribe", params: { channel, ...params } }));
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.channel === channel && (message.type === "update" || message.type === "snapshot")) {
                message.data.forEach((item: any) => subscriber.next(toItem(item)));
            }
        };
        socket.onerror = () => subscriber.error(new Error(`Kraken ${channel} connection failed`));
        return () => socket.close();
    });
}
```

```ts
getTradeStream(symbol: string): Observable<SciTraderTrade> {
    return krakenChannel<SciTraderTrade>("trade", { symbol: [symbol], snapshot: false }, (trade) => ({
        eventTime: Date.parse(trade.timestamp),
        symbol: trade.symbol,
        price: trade.price,
        quantity: trade.qty,
        maker: false,
        isBuyerMaker: trade.side === "sell", // Kraken reports the taker's side
        tradeId: trade.trade_id,
    }));
}
```

### Step 7: Registering the Exchange

Register it like a built-in exchange. With `idbPriceStore`, the candles are kept in IndexedDB, so history builds up past Kraken's 720 candles as users come back:

```ts
const kraken = new KrakenExchange();
defaultExchangeProvider.registerExchange(kraken, idbPriceStore);
```

## TypeScript Example: A Live Chart from the Kraken API {#kraken-example}

BTC/USD from Kraken through the adapter above, updating live. The buttons change the symbol and the interval, from the adapter's `getInstruments()` and `getSupportedIntervals()`, and the price on the right is its ticker stream. History goes back 720 candles: 30 days at 1h, 12 hours at 1m.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/dataSources_KrakenExchange/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_KrakenExchange/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Live Chart from the Kraken API

The same adapter, charted in React. The adapter is plain TypeScript, the same as above.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="KrakenChart" name="../../_examples/dataSources_KrakenExchange/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/dataSources_KrakenExchange/react.tsx
    ```
</CodeSnippetBlock>

## Symbols: the Symbol Picker and mapSymbol

To list your exchange's symbols, the symbol picker (`getSymbolCatalog`) reads `getInstruments()` from `defaultExchangeProvider`. To split a symbol into its base and quote, e.g. for coin icons, and to convert symbols between exchanges with `mapSymbol`, register a **symbol normalizer** for your exchange's name:

```ts
import { symbolNormalizers } from "scichart-scitrader";

// Kraken's symbols are BASE/QUOTE
symbolNormalizers["Kraken"] = {
    // Throw for a symbol it can't read
    parse: (symbol) => {
        const [base, quote] = symbol.split("/");
        if (!base || !quote) throw new Error(`Not a Kraken symbol: ${symbol}`);
        return { base, quote };
    },
    format: ({ base, quote }) => `${base}/${quote}`,
};

mapSymbol("BTC/USD", "Kraken", "Coinbase"); // "BTC-USD"
```

<details>
<summary>ISymbolNormalizer, symbolNormalizers, mapSymbol and getSymbolCatalog, with their TSDoc</summary>

```ts
/** Canonical decomposition of a market symbol. */
interface ISymbolParts {
    /** Base currency, e.g. `"BTC"`. */
    base: string;
    /** Quote currency, e.g. `"USDT"` (Binance) or `"USD"` (Coinbase). */
    quote: string;
}

/** Provider-specific parse + format pair. */
interface ISymbolNormalizer {
    /** Provider-native string → `{ base, quote }`. Throws on unparseable input. */
    parse(providerSymbol: string): ISymbolParts;
    /** `{ base, quote }` → provider-native string. */
    format(parts: ISymbolParts): string;
}

/**
 * Registry of per-provider symbol normalizers, keyed by `IRemoteExchange.name`.
 *
 * Adding a new exchange: implement an `ISymbolNormalizer` and register here.
 */
const symbolNormalizers: Record<string, ISymbolNormalizer>;

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

/**
 * One tradeable symbol from the exchange: the metadata the symbol picker, the watchlist and the market tree use.
 */
interface ISymbolCatalogEntry {
    /** Trading symbol pair (e.g. `BTCUSDT` on Binance, `BTC-USD` on Coinbase). */
    symbol: string;
    /** Base asset code (e.g. `BTC`). */
    baseAsset: string;
    /** Quote asset code (e.g. `USDT` on Binance, `USD` on Coinbase). */
    quoteAsset: string;
    /** Exchange status — only `TRADING` is safe as a chart symbol. */
    status: string;
}

/**
 * Returns the symbol catalog for the given exchange (cached after first fetch).
 *
 * Subsequent calls for the same exchange return the same array reference — safe
 * to use as a `useMemo` dependency. Each exchange has its own cache slot.
 *
 * Implementation: calls `IRemoteExchange.getInstruments()` for the symbol list,
 * then parses each symbol via the registered `symbolNormalizer` to extract
 * `baseAsset` / `quoteAsset`. Symbols that fail to parse are dropped with a
 * console warn — the picker stays useful, the dropped pair surfaces in logs.
 */
function getSymbolCatalog(exchangeName: string): Promise<ISymbolCatalogEntry[]>;
```

</details>

## IRemoteExchange API

<details>
<summary>The IRemoteExchange and IListingDateResult interfaces, with their TSDoc</summary>

```ts
interface IRemoteExchange {
    readonly name: string;
    candleLimit: number;
    /**
     * Whether `getCandleStream` emits the live bar on its own, complete, for every timeframe.
     *
     * Default (absent or false) means it does not, and `ExchangeClient.getRealtimeCandleStream`
     * rebuilds the live bar from the trade stream instead — seeding from one candle and folding
     * trades into it. That is the right shape for a venue whose candle socket only ticks
     * occasionally, which is what Binance's and Coinbase's do.
     *
     * It stops working below a minute. The accumulator gates on trades catching up past the
     * seed's event time, and the trade stream runs behind: measured against the data server, a
     * 1s seed sat 47 seconds ahead of the newest trade, so the gate never opened and the chart
     * never advanced a bar. A 1m bucket absorbs that lag; a 1s bucket cannot, and no threshold
     * tuning changes it — the seed is always newer than trades that arrive late.
     *
     * An adapter that publishes a complete bar per tick sets this and is consumed directly,
     * which is both simpler and more accurate: the bar comes from whatever the server
     * aggregated rather than from whichever trades this client happened to receive.
     */
    readonly hasCompleteCandleStream?: boolean;
    getCandles: (symbol: string, interval: CandleInterval, start: number, end: number, limit: number, 
    /** optional cancellation signal. Race-against-abort. */
    signal?: AbortSignal) => Promise<ExchangeRestCandle[]>;
    getInstruments: () => Promise<string[]>;
    getCandleStream: (symbol: string | string[], interval: CandleInterval) => Observable<SciTraderCandle>;
    /**
     * Optional streaming candle source delivering an initial historical snapshot plus live
     * updates over a single connection (Coinbase's Advanced Trade `candles` WS channel). When
     * present, the watchlist sources sparklines from this instead of per-symbol REST `/candles`
     * — eliminating the rate-limited request burst. Adapters without a native candle WS omit it,
     * and callers fall back to `getCandles` + `getCandleStream`. Note: Coinbase's channel is
     * fixed at 5-minute granularity.
     */
    getSparklineCandleStream?: (symbols: string[], interval: CandleInterval, 
    /**
     * How many historical candles to seed each symbol with. A source that cannot honour
     * the requested `interval` will not honour this count as a duration either, so treat
     * it as a depth hint and trim the result by timestamp — see `ICandleBatch.interval`.
     */
    snapshotCandles?: number) => Observable<ICandleBatch>;
    getTrades: (symbol: string, start?: number, end?: number, limit?: number) => Promise<SciTraderTrade[]>;
    getTradeStream: (symbol: string) => Observable<SciTraderTrade>;
    getTickerStream: (symbol: string | string[]) => Observable<SciTraderTicker>;
    /** See {@link IExchangeClient.getAllTickerStream} — Coinbase requires `productIds`, Binance ignores it. */
    getAllTickerStream: (productIds?: string[]) => Observable<SciTraderTicker[]>;
    /**
     * Resolve the earliest available candle openTime (ms) for
     * `(symbol, interval)`. Each adapter picks whichever native mechanism
     * its API supports — Binance uses `klines?startTime=0&limit=1000` and
     * returns the first 1000 candles as `surplusCandles` so the caller
     * can seed the local store; Coinbase Exchange uses the `/trades?after=2`
     * cursor trick then probes `/candles` forward (first trade ≠ first
     * candle on Coinbase), and returns no surplus candles.
     *
     * Return `null` when the adapter can't determine a floor (delisted,
     * never listed, halted). The data feed falls back to lazy discovery
     * via `loadPreviousData`'s partial-fill detection in that case.
     */
    getListingDate(symbol: string, interval: CandleInterval, signal?: AbortSignal): Promise<IListingDateResult | null>;
    /**
     * The set of {@link CandleInterval} values the adapter supports. Drives
     * the UI's interval picker — pickers filter their hardcoded option lists
     * to this set, hiding intervals the active provider can't serve.
     *
     * Implementations typically derive the list from the shared
     * `intervalMaps` registry via `getSupportedIntervalsFor(name)`.
     */
    getSupportedIntervals(): CandleInterval[];
}

/**
 * Result of a successful listing-date probe.
 *
 * `openTime` is always set — it's the open time (ms) of the oldest candle
 * the adapter can confirm exists for `(symbol, interval)`.
 *
 * `surplusCandles` is set when the adapter's probe mechanism naturally
 * returns a batch of candles alongside the floor — Binance's
 * `klines?startTime=0&limit=1000` is one round-trip that yields the floor
 * AND the first 1000 candles. The caller MAY persist them into the local
 * store so future sessions cache-hit the listing-date region. Coinbase's
 * probe uses the `/trades` endpoint and returns no candles — its
 * `surplusCandles` field is `undefined`.
 */
interface IListingDateResult {
    openTime: number;
    surplusCandles?: ExchangeRestCandle[];
}
```

</details>

<details>
<summary>The ExchangeRestCandle, SciTraderCandle, SciTraderTrade, SciTraderTicker and ICandleBatch types, with their TSDoc</summary>

```ts
type ExchangeRestCandle = {
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime: number;
    trades: number;
};

type SciTraderCandle = {
    eventTime: number;
    symbol: string;
    startTime: number;
    closeTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    trades: number;
    interval: string;
    buyVolume: number;
};

type SciTraderTrade = {
    eventTime: number;
    symbol: string;
    price: number;
    quantity: number;
    maker: boolean;
    isBuyerMaker: boolean;
    tradeId: number;
};

type SciTraderTicker = {
    eventTime: number;
    symbol: string;
    priceChange: number;
    priceChangePercent: number;
    weightedAvg: number;
    prevDayClose: number;
    curDayClose: number;
    closeTradeQuantity: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    volumeQuote: number;
    openTime: number;
    closeTime: number;
    totalTrades: number;
};

/**
 * A batch of candles for one symbol pushed by a streaming candle source (e.g. the Coinbase
 * Advanced Trade `candles` WebSocket channel). `isSnapshot` marks the initial historical
 * backfill emitted on subscribe (used to seed the chart); subsequent batches are live updates.
 */
interface ICandleBatch {
    symbol: string;
    candles: SciTraderCandle[];
    isSnapshot: boolean;
    /**
     * The timeframe these candles were actually encoded with — which is not necessarily the
     * one the subscriber asked for. A source may not honour the requested interval: Coinbase’s sparkline
     * stream is fixed at 5 minutes. So a consumer sizing a time window from a candle count needs
     * to know what it actually received.
     */
    interval: CandleInterval;
}
```

</details>

## Where to read next

- [Candle Stores and Caching](/financial-charts/data-sources/candle-stores-and-caching/): how the SDK caches your exchange's candles.
- [Order Book Data](/financial-charts/data-sources/order-book-data/): add an order book for your exchange.
- [Data Manager and Data Feeds](/financial-charts/data-sources/data-manager-and-data-feeds/): what happens to the candles next.
