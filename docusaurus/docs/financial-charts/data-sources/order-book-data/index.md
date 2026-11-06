---
sidebar_position: 7
sidebar_label: Order Book Data
title: "Order Book Data: Level 2 Order Books in a JavaScript Trading Chart | SciTrader.js"
description: "Connect level 2 order book data to SciTrader.js JavaScript and React trading charts: the IOrderBookSource interface, a live Coinbase order book, the Market Depth panel, and the order book heatmap and imbalance studies."
keywords: ["order book data", "level 2 order book", "order book JavaScript", "market depth chart", "order book heatmap", "IOrderBookSource", "Coinbase order book", "SciTrader.js"]
---

# Order Book Data

Order books come from an **order book source**, an `IOrderBookSource`, one per exchange, separate from the exchange's candles. A source gives two kinds of data:

| Data | `IOrderBookSource` members | Used by |
| --- | --- | --- |
| **The live book:** the best bids and asks now (level 2) | `getBookSnapshot`, `getBookStream` | The [Market Depth](/financial-charts/ui-components/market-depth/) panel, and your own readouts |
| **The book over time:** recorded heatmap tiles, at several resolutions | `getHeatmapAvailability`, `getHeatmapTile`, `getDepthStream` | The `OrderBookHeatmapStudy` and `OrderBookImbalanceStudy` |

The built-in Coinbase and Binance exchanges don't have order book sources. A live book is easy to add from an exchange's WebSocket, as below. The book over time needs the order book **recorded**, on a server, so its history can be drawn; a source without it answers `{ enabled: false }`, and those studies draw nothing.

## Registering an Order Book Source

Register sources by exchange name, once at startup. Studies and panels find the source for the chart's exchange with `getOrderBookSource`:

```ts
import { getOrderBookSource, setOrderBookSources } from "scichart-scitrader";

setOrderBookSources(new Map([["Coinbase", new CoinbaseOrderBookSource()]]));

const source = getOrderBookSource("Coinbase"); // undefined for an exchange with none
```

`setOrderBookSources` replaces every registered source. `hasOrderBookSources()` says whether any are registered, e.g. to hide order book studies from a picker.

## The Live Book: getBookStream

`getBookStream(symbol, depth)` emits the best `depth` levels of each side: bids highest first, asks lowest first, each `{ price, qty }`. Each update replaces the ladder (`isSnapshot: true`), or changes some levels.

```ts
// The top of the book: the best bid and ask
getOrderBookSource("Coinbase")
    .getBookStream("BTC-USD", 1)
    .subscribe(({ bids, asks }) => console.log("bid", bids[0].price, "ask", asks[0].price));
```

:::tip
Send updates a few times a second, not on every exchange message. The depth panel redraws a few times a second, and a busy book changes hundreds of times a second.
:::

## A Live Coinbase Order Book Source

Coinbase's public `level2_batch` WebSocket channel needs no API key. It sends the whole book once, then batches of changes. This source keeps the book in memory, and sends the top levels four times a second:

```ts
// An IOrderBookSource for Coinbase's public order book, which the depth panel reads.
// Coinbase's "level2_batch" WebSocket channel needs no API key. It sends the whole book once, then
// batches of changes. This source keeps the book in memory and sends the panel the top levels four
// times a second, as the IOrderBookSource contract asks: the panel has no use for every change
class CoinbaseOrderBookSource implements IOrderBookSource {
    readonly exchangeName = CoinbaseExchange.name;

    getBookStream(symbol: string, depth = 50): Observable<IBookUpdate> {
        return new Observable<IBookUpdate>((subscriber) => {
            // price -> quantity, for each side of the book
            const bids = new Map<number, number>();
            const asks = new Map<number, number>();
            const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

            socket.onopen = () =>
                socket.send(JSON.stringify({ type: "subscribe", product_ids: [symbol], channels: ["level2_batch"] }));

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "snapshot") {
                    // The whole book: [price, size] pairs as strings
                    for (const [price, size] of message.bids) bids.set(Number(price), Number(size));
                    for (const [price, size] of message.asks) asks.set(Number(price), Number(size));
                } else if (message.type === "l2update") {
                    // Changes: [side, price, size]. A size of 0 removes the level
                    for (const [side, price, size] of message.changes) {
                        const book = side === "buy" ? bids : asks;
                        if (Number(size) === 0) book.delete(Number(price));
                        else book.set(Number(price), Number(size));
                    }
                }
            };
            socket.onerror = () => subscriber.error(new Error("Coinbase order-book connection failed"));

            // Four times a second, send the top of the book. isSnapshot: true replaces the ladder
            const timer = setInterval(() => {
                if (bids.size === 0 || asks.size === 0) return;
                subscriber.next({
                    symbol,
                    timestamp: Date.now(),
                    isSnapshot: true,
                    bids: topLevels(bids, depth, (a, b) => b - a), // highest bid first
                    asks: topLevels(asks, depth, (a, b) => a - b), // lowest ask first
                });
            }, 250);

            // Called when the panel unsubscribes: stop the timer and close the connection
            return () => {
                clearInterval(timer);
                socket.close();
            };
        });
    }

    // The current top of the book: the stream's first frame
    getBookSnapshot(symbol: string, depth?: number): Promise<IBookSnapshot | null> {
        return firstValueFrom(this.getBookStream(symbol, depth));
    }

    // No liquidity heatmap here: the depth panel only needs the book
    async getHeatmapAvailability(): Promise<IHeatmapAvailability> {
        return { enabled: false, tileColumns: 0, tiers: [] };
    }
    async getHeatmapTile(): Promise<IHeatmapTile | null> {
        return null;
    }
    getDepthStream(): Observable<IDepthColumn> {
        return EMPTY;
    }
}

// The best `depth` levels of one side of the book, as { price, qty }
function topLevels(book: Map<number, number>, depth: number, order: (a: number, b: number) => number) {
    return [...book.keys()]
        .sort(order)
        .slice(0, depth)
        .map((price) => ({ price, qty: book.get(price) }));
}
```

## TypeScript Example: A Live Level 2 Order Book

BTC-USD from Coinbase, with the Coinbase order book source registered for the chart's exchange. The Market Depth panel on the right gets the source with `getOrderBookSource`, and the line at the top reads the top of the book from the same source.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/dataSources_OrderBook/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div id="depth" style="width: 340px"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_OrderBook/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Live Level 2 Order Book

The same in React, with the React `MarketDepthView`.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="OrderBookChart" name="../../_examples/dataSources_OrderBook/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/dataSources_OrderBook/react.tsx
    ```
</CodeSnippetBlock>

## The Book over Time: Heatmap Tiers

The order book heatmap and imbalance studies draw the book behind each candle, so they need its history. A source with recorded history serves it in **tiers**, one per resolution, e.g. 1-second, 1-minute and 1-hour buckets, each split into tiles of a fixed number of buckets:

- **`getHeatmapAvailability(symbol)`** lists the tiers recorded for a symbol, and from when.
- **`getHeatmapTile(symbol, bucket, tile)`** returns one tile: each column is the book over one bucket, by price.
- **`getDepthStream(symbol, bucket)`** streams the newest columns as they close.

A browser can't record history on its own, so this needs a server that records the exchange's book. Without one, answer `{ enabled: false, tileColumns: 0, tiers: [] }`, as the Coinbase source does.

## IOrderBookSource API

<details>
<summary>The IOrderBookSource interface, with its TSDoc</summary>

```ts
interface IOrderBookSource {
    readonly exchangeName: string;
    /** Current top-N, or null when no synced book exists for the instrument. */
    getBookSnapshot(symbol: string, depth?: number): Promise<IBookSnapshot | null>;
    /**
     * Live ladder: one snapshot, then merges. Throttled by the source — the depth panel redraws
     * at a few hertz and has no use for raw exchange cadence.
     */
    getBookStream(symbol: string, depth?: number): Observable<IBookUpdate>;
    /**
     * Which heatmap tiers exist for an instrument, and from when. A source with no heatmap
     * answers `{ enabled: false }`, which the study shows as such rather than as an empty chart.
     */
    getHeatmapAvailability(symbol: string): Promise<IHeatmapAvailability>;
    /**
     * One tile of one tier. Null when that tier is not recorded for the instrument, or the
     * heatmap is switched off, which the study draws as nothing rather than as an error.
     */
    getHeatmapTile(symbol: string, bucket: string, tile: number): Promise<IHeatmapTile | null>;
    /** New columns at one tier: each bucket as it closes, and the open one as it fills. */
    getDepthStream(symbol: string, bucket: string): Observable<IDepthColumn>;
}
```

</details>

<details>
<summary>The IBookLevel, IBookSnapshot and IBookUpdate interfaces, with their TSDoc</summary>

```ts
interface IBookLevel {
    price: number;
    /** Zero means the level is gone. Never a level of size zero. */
    qty: number;
}

/** Top-N of both sides at a moment in time. Bids descend, asks ascend. */
interface IBookSnapshot {
    symbol: string;
    timestamp: number;
    bids: IBookLevel[];
    asks: IBookLevel[];
}

/**
 * An incremental ladder change. Levels with `qty === 0` are removals — including levels that
 * merely fell out of the requested depth, which from a ladder's point of view is the same event.
 */
interface IBookUpdate extends IBookSnapshot {
    /** True when this frame replaces the ladder rather than merging into it. */
    isSnapshot: boolean;
}
```

</details>

<details>
<summary>The heatmap tier interfaces: IHeatmapAvailability, IHeatmapTierInfo, IHeatmapTile and IDepthColumn, with their TSDoc</summary>

```ts
/** What a source can draw for one instrument. */
interface IHeatmapAvailability {
    /** False when the source records no heatmap at all — switched off, not merely empty. */
    enabled: boolean;
    /** Columns per tile, at every tier. */
    tileColumns: number;
    /** Finest first. Empty when this instrument is not recorded. */
    tiers: IHeatmapTierInfo[];
}

/** One stored heatmap resolution for one instrument. */
interface IHeatmapTierInfo {
    /** The tier's code, e.g. `1s`, `1m`, `4h`. */
    bucket: string;
    bucketMs: number;
    /** First bucket stored, or null while the tier is recording but has closed nothing yet. */
    from: number | null;
    /** End of the last bucket stored. */
    to: number | null;
}

/**
 * One tile: a fixed block of `columns` buckets from one tier, epoch-aligned so tile `n` covers
 * buckets `[n·columns, (n+1)·columns)`, with the price rows its own cells span.
 *
 * Cells are sparse parallel arrays; anything not listed held nothing and draws as empty.
 */
interface IHeatmapTile {
    bucket: string;
    bucketMs: number;
    tile: number;
    /** First column's bucket start, ms. */
    start: number;
    columns: number;
    /** No bucket in the tile is still open, so it will never change. */
    complete: boolean;
    /** Row 0's low edge. Row `r` covers `[priceMin + r·step, priceMin + (r+1)·step)`. */
    priceMin: number;
    step: number;
    rows: number;
    col: number[];
    row: number[];
    /** Mean resting bid size in each cell. */
    bid: number[];
    /** Mean resting ask size in each cell. */
    ask: number[];
}

/**
 * One heatmap column as it streams: a bucket, closed or as it stands so far. Prices are
 * absolute bucket low edges, since the source does not know which tile a subscriber holds.
 */
interface IDepthColumn {
    /** The instrument, where the source knows it. */
    symbol?: string;
    /** The tier's code, repeated under the name the socket's subscription guard reads. */
    interval?: string;
    bucket: string;
    bucketStart: number;
    /** Still open; a later column for the same bucket replaces it. */
    provisional: boolean;
    step: number;
    price: number[];
    bid: number[];
    ask: number[];
}
```

</details>

<details>
<summary>setOrderBookSources, getOrderBookSource and hasOrderBookSources, with their TSDoc</summary>

```ts
/**
 * Replaces the registry contents with `next`, keyed by exchange name.
 *
 * Replaces rather than merges so that re-registering (an exchange switch, a reconnect) cannot
 * leave a stale source behind for a venue the server has stopped serving.
 */
function setOrderBookSources(next: ReadonlyMap<string, IOrderBookSource>): void;

/** The source for `exchange`, or undefined when the venue has no book (or the server is off). */
function getOrderBookSource(exchange: string): IOrderBookSource | undefined;

/** True when any venue has a book source — i.e. whether to offer the depth surfaces at all. */
function hasOrderBookSources(): boolean;
```

</details>

## Where to read next

- [Market Depth](/financial-charts/ui-components/market-depth/): the depth panel, and its slippage readout.
- [Technical Indicators and Studies](/financial-charts/studies-and-indicators/#order-book-studies): the order book studies.
- [Building a Custom Exchange](/financial-charts/data-sources/custom-exchange/): an exchange's candles, alongside its book.
