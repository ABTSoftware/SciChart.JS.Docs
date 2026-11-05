---
sidebar_position: 6
sidebar_label: Data Manager and Data Feeds
title: "How Chart Data Flows: the Data Manager and Data Feeds | SciTrader.js"
description: "How a SciTrader.js financial chart holds and updates its market data: data feeds, the data manager's columns, DataSourceId, update types for live ticks and history, and how studies read them."
keywords: ["SciTrader", "SciTrader.js", "chart data model", "real-time chart data", "OHLCV columns", "DataManager", "data feed", "live tick updates"]
---

# Data Manager and Data Feeds

A chart's candles arrive through **data feeds**, and are held in its **data manager**, where studies read them. This page describes that flow, for when you read a chart's data yourself or [write a study](/financial-charts/studies-and-indicators/creating-custom-studies/).

## Data Feeds: Where the Candles Come From

A **data feed** loads one stream of data for a chart from its exchange: the candles for its symbol, interval and period, then live updates. Every chart has a **default feed**, `DEFAULT_FEED_ID` (`"Default"`), with its OHLCV candles; studies that need other data add feeds of their own:

| Feed type (`EDataFeedType`) | What it carries | Added by |
| --- | --- | --- |
| `OHLCVRealtime` | Candles: history, then live updates | Every chart: the default feed |
| `Trade` | Individual trades | `LargeTradeStudy` |
| `OrderBook` | The order book over time | The order book studies; see [Order Book Data](/financial-charts/data-sources/order-book-data/) |

`setSymbol`, `changeInterval` and `createDataFeed` replace the default feed; see [Changing the Symbol](/financial-charts/symbols-intervals-periods/changing-the-symbol/).

## The Data Manager: One Column per Value

The data manager holds the chart's data as **columns**, all index-aligned with the candles: `xValues` holds each candle's time, in seconds, and each other column one value per candle.

- **The default feed's columns** are Open, High, Low, Close and Volume (`EDataSourceStringId`).
- **Each study adds output columns,** e.g. the SMA's values, which the legend reads.
- **Each column is named by a `DataSourceId`**: find the feed's columns by name, and a study's in its `outputIds`.

```ts
import { DEFAULT_FEED_ID, EDataSourceStringId } from "scichart-scitrader";

const dataManager = financeChartPanel.financeApi.dataManager;

const close = dataManager.getSourceIdByName(DEFAULT_FEED_ID, EDataSourceStringId.CLOSE);
const closes = dataManager.getValues<number>(close); // one per candle
const times = dataManager.xValues; // each candle's time, in seconds

const rsiValues = dataManager.getValues<number>(rsiStudy.outputIds[0]); // a study's output
```

## Following Changes: observeChanges and EDataUpdateType {#update-types}

`observeChanges(ids)` emits every change to the given columns, as an `EDataUpdateType`:

| `EDataUpdateType` | When |
| --- | --- |
| `Replace` | A whole new series: the first load, and a new symbol, interval or period |
| `Append` | A new candle opens |
| `Update` | A live tick changes the forming candle |
| `Insert` | Older candles, loaded as the user pans back |
| `Evict` | Candles dropped from either end to save memory |

```ts
const subscription = dataManager.observeChanges<number>([close]).subscribe((update) => {
    const { updateType, values, startIndex } = update[close.id];
    console.log(EDataUpdateType[updateType], values.length, "values from index", startIndex);
});
subscription.unsubscribe(); // when done
```

**Studies** follow their input columns the same way, and recalculate for each update type; see [Creating Custom Studies](/financial-charts/studies-and-indicators/creating-custom-studies/).

:::note
Most changes are `Update`: on a busy market, the forming candle changes many times a second. Keep the work you do for each one small.
:::

## How History Loads

1. **The first load** fetches the candles for the chart's period, plus a buffer to pan back into, plus the **warm-up** the studies need before their first value: an SMA of 50 needs 50 earlier candles. See [Periods](/financial-charts/symbols-intervals-periods/periods/).
2. **Panning back** loads older candles as the user nears the start, in pages, until the exchange's history begins (`Insert`).
3. **Live updates** extend the series (`Append`, `Update`).
4. **The memory cap.** On a long session, or after panning far back, candles far from the view are dropped (`Evict`), and loaded again if needed.

## TypeScript Example: Inside the Data Manager

One-minute BTC-USD candles from Coinbase, with SMA and RSI. The panel on the right lists the data manager's columns, the feed's and the studies', and counts the updates to the close column by type, as they arrive: an `Update` for each live tick, an `Append` for each new candle.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/dataSources_DataManager/vanilla" html={`<div style="display: flex; height: 100%"><div id="chart" style="flex: 1; min-width: 0"></div><pre id="store-log" style="width: 340px"></pre></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_DataManager/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Inside the Data Manager

The same in React: the chart's data manager comes from `onInit`, and the subscription lives in an effect.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="DataManagerChart" name="../../_examples/dataSources_DataManager/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/dataSources_DataManager/react.tsx
    ```
</CodeSnippetBlock>

## Data Manager API

<details>
<summary>The IDataManager interface, with its TSDoc</summary>

```ts
interface IDataManager {
    xId: DataSourceId;
    xValues: number[];
    yEntries: {
        id: DataSourceId;
        values: any[];
    }[];
    getSources(): DataSourceId[];
    getValues<T>(id: DataSourceId): T[];
    getSourceId(id: string): DataSourceId;
    getSourceIdByName(feedId: string, name: string): DataSourceId;
    getOrCreateSourceId(id: string, builder: () => DataSourceId): DataSourceId;
    replaceValues(ids: DataSourceId[], values: any[][]): void;
    appendValues(ids: DataSourceId[], values: any[][], startIndex: number): void;
    insertValues(ids: DataSourceId[], values: any[][], startIndex: number): void;
    updateValues(ids: DataSourceId[], values: any[], startIndex: number): void;
    /**
     * Drop `leadingCount` entries from the front and `trailingCount` from
     * the back of every registered source, emitting one `Evict` update per
     * source.
     */
    evict(leadingCount: number, trailingCount: number): void;
    observeChanges<T>(ids: DataSourceId[]): Observable<TDataUpdate<T>>;
    removeSources(ids: DataSourceId[]): void;
}
```

</details>

<details>
<summary>The DataSourceId class, EDataSourceStringId, EDataFeedType and DEFAULT_FEED_ID, with their TSDoc</summary>

```ts
class DataSourceId {
    static DEFAULT_X_ID: DataSourceId;
    static create(dataManager: IDataManager, name?: string, legendName?: string, studyId?: StudyId, feedId?: string): DataSourceId;
    readonly feedId: string;
    readonly name: string;
    readonly legendName: string;
    readonly id: string;
    toString(): string;
}

enum EDataSourceStringId {
    X = "X",
    OPEN = "Open",
    HIGH = "High",
    LOW = "Low",
    CLOSE = "Close",
    VOLUME = "Volume"
}

enum EDataFeedType {
    OHLCVRealtime = "OHLCVRealtime",
    OHLCV1second = "OHLCV1second",
    Trade = "Trade",
    UserOrder = "UserOrder",
    OrderBook = "OrderBook"
}

const DEFAULT_FEED_ID = "Default";
```

</details>

<details>
<summary>The EDataUpdateType enum, IDataUpdate interface and TDataUpdate type, with their TSDoc</summary>

```ts
enum EDataUpdateType {
    Replace = 0,
    Append = 1,
    Insert = 2,
    Update = 3,
    /**
     * Candles were removed from one or both ends of the source array
     * `values` is an empty array (no new data); the
     * `eviction` field carries the per-edge drop counts. Subscribers that
     * mirror data into renderable series should shrink their copy
     * symmetrically; subscribers that recompute outputs from inputs (e.g.
     * indicator studies) can treat Evict like a Replace-shrunken — values
     * for surviving indices are unchanged, so no recomputation is needed
     * beyond keeping the output series the same length as the input.
     */
    Evict = 4
}
interface IDataUpdate<T> {
    id: DataSourceId;
    values: T[];
    updateType: EDataUpdateType;
    startIndex?: number;
    /**
     * Populated only for {@link EDataUpdateType.Evict}. Reports how many
     * elements were dropped from each edge of the source array, so
     * subscribers can mirror the eviction without recomputing indices.
     */
    eviction?: {
        leadingDrop: number;
        trailingDrop: number;
    };
}
type TDataUpdate<T> = Record<string, IDataUpdate<T>>;
```

</details>

## Where to read next

- [Creating Custom Studies](/financial-charts/studies-and-indicators/creating-custom-studies/): a study that reads and writes columns.
- [Candle Stores and Caching](/financial-charts/data-sources/candle-stores-and-caching/): where the candles come from.
- [Periods](/financial-charts/symbols-intervals-periods/periods/): how much history a chart loads.
