---
sidebar_position: 2
sidebar_label: CSV Data
title: "Load OHLCV Data from CSV into a JavaScript Candlestick Chart | SciTrader.js"
description: "Chart your own OHLCV data from CSV files or CSV text in a JavaScript or React candlestick chart with SciTrader.js's CSVExchange: file format, column mapping, resampling to every interval, and dates moved to now."
keywords: ["OHLCV data", "CSV candlestick chart", "CSV to candlestick chart JavaScript", "OHLC data CSV", "historical price data chart", "React candlestick chart CSV", "CSVExchange", "SciTrader.js"]
---

# CSV Data: Load OHLCV Data from CSV into a Candlestick Chart

`CSVExchange` charts candles from CSV: your own historical OHLCV data, demo data, or test fixtures. Give it one or more CSV files or strings, and it serves them like any exchange, at every interval the data can make.

```ts
import { CandleInterval, CSVExchange, defaultExchangeProvider, registerCSVExchange } from "scichart-scitrader";

const exchange = await CSVExchange.fromUrl("https://example.com/btcusdt-1h.csv", { name: "MyData" });
registerCSVExchange(defaultExchangeProvider, exchange);

await SciFinanceChartPanel.create(container, {
    exchangeName: exchange.name, // "MyData"
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS, // made from the file's hourly rows
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

## Loading CSV: from a URL, from Text, or Several Files

| To load | Use |
| --- | --- |
| A file from a URL | `await CSVExchange.fromUrl(url, options)` |
| Several files | `await CSVExchange.fromUrl([url1, url2], options)`, e.g. hourly and daily data together |
| A file with no symbol column | `CSVExchange.fromUrl({ url, symbol: "AAPL" }, options)` |
| CSV text you already have | `new CSVExchange(text, options)`, or `new CSVExchange({ csv: text, symbol, interval }, options)` |

`fromUrl` fetches the files, then builds the exchange. Build it before registering it: charts ask an exchange for its intervals straight away.

Then make it available to charts, in one of two ways:

- **`registerCSVExchange(defaultExchangeProvider, exchange)`** registers it for every chart, by its `name`, with `nullCandleStore`, and lets the symbol picker list its symbols.
- **`createCSVServices(exchange)`** returns chart `services` with a provider of its own, for one chart: `services`, `provider` and `exchange`. Pass `services` in the chart's config. The examples below do this.

## CSV File Format {#file-format}

One row per candle. The header names the columns, in any order:

```text
symbol,time,open,high,low,close,volume
BTCUSDT,2026-07-01 12:00,58622.02,58676,58326,58538.01,1716.61
```

**Columns**

- **Found automatically** by their usual names:
  - time: `time`, `timestamp`, `date`, `datetime`, `open_time`, `openTime`
  - prices and volume: `open`, `high`, `low`, `close`, `volume`; single letters `o`, `h`, `l`, `c`, `v` also work
  - optional: `trades`, `symbol`
- **Mapped by hand** for anything else, by header name or column index: `columns: { time: "Date", close: 4 }`.
- **Files without a header:** pass `hasHeader: false`. The columns are then read as `time, open, high, low, close, volume`.

**Symbols**

- A `symbol` column lets one file hold several symbols.
- Otherwise, give each file's symbol: `{ url, symbol: "AAPL" }`, or the `symbol` option for all of them.

**Time**

- Epoch seconds, epoch milliseconds, or date strings.
- Dates without a timezone are read as **UTC**.
- Set `timeUnit` (`"s"`, `"ms"` or `"iso"`) if the automatic detection guesses wrong.

**Rows**

- Other delimiters: `delimiter: ";"`.
- Quoted fields, and numbers with thousands separators (`"1,234.5"`), are handled.
- Rows that can't be parsed, such as blank prices or a trailing summary line, are skipped.

## Every Interval from One File {#intervals}

The exchange works out a file's interval from its row spacing; pass `interval` if it can't. It serves that interval **and every coarser interval made of whole candles**, combined on first request: an hourly file also serves 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w and 1M.

Weeks start on Monday, and months are calendar months. When several files cover one symbol, each interval comes from an exact match if there is one; otherwise it is combined from the coarsest file that divides it. So an hourly file and a daily file together give detailed intraday charts and long daily history.

## Dates Move to Now: alignToNow {#dates-move-to-now}

The chart loads the candles leading up to _now_, so a file that ended last year would show nothing. By default `CSVExchange` moves each series forward so its last candle is the current one. It moves by whole candles, so every candle stays on its interval boundary; prices are untouched.

- Pass `alignToNow: false` for data that is already current.
- Pass a timestamp to align to a fixed moment, for repeatable screenshots and tests.

:::warning
Because the dates change with every load, register CSV data with `nullCandleStore`, never `idbPriceStore`: a persistent cache would keep candles from earlier loads at their old dates. `registerCSVExchange` and `createCSVServices` do this for you.
:::

## CSVExchange Limits {#limits}

- **No live updates.** The candle and trade streams are empty. The ticker stream emits one 24-hour summary per symbol, computed from the data, so a watchlist has prices to show.
- **Gaps.** The SDK's calendar runs 24/7, so weekends and holidays in equity data show as gaps.
- **`candleLimit`.** A range longer than `candleLimit` (default 10,000) is loaded in pages, and paging stops at the first gap. Keep it at least as long as your longest series.

## The Sample Price History {#sample-data}

The examples on these pages use real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, which you can use too:

| File | Contents |
| --- | --- |
| [`crypto-1h.csv`](pathname:///financial-charts/data/crypto-1h.csv) | 90 days of hourly candles, 3 symbols: `symbol,time,open,high,low,close,volume` |
| [`crypto-1d.csv`](pathname:///financial-charts/data/crypto-1d.csv) | 4 years of daily candles, 3 symbols |
| [`btcusdt-1d.json`](pathname:///financial-charts/data/btcusdt-1d.json) | BTCUSDT's daily candles as JSON; see [JSON Data](/financial-charts/data-sources/json-data/) |

## TypeScript Example: A Candlestick Chart from CSV Files

The two sample files, loaded into one exchange with `CSVExchange.fromUrl` and charted with `createCSVServices`. The buttons list the symbols and intervals the data serves, from `getInstruments()` and `getSupportedIntervals()`: 1h to 12h from the hourly file, 1d to 1M from the daily one.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/dataSources_CSV/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_CSV/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Candlestick Chart from CSV Files

The same chart in React. The files load once, at module level; the chart renders once they have.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="CsvDataChart" name="../../_examples/dataSources_CSV/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/dataSources_CSV/react.tsx
    ```
</CodeSnippetBlock>

## Reading CSV Yourself: the CSV Parsing Functions

The functions `CSVExchange` uses are exported, for your own data handling:

| Function | What it does |
| --- | --- |
| `parseCandleCsv(text, options)` | Parses CSV into candles, grouped by symbol |
| `inferInterval(candles)` | The interval a series was sampled at |
| `resampleCandles(candles, interval)` | Combines candles into a coarser interval |
| `canResample(base, target)` | Whether `base` candles make whole `target` candles |
| `withCloseTimes(candles, interval)` | Fills in each candle's close time |
| `bucketStart(time, interval)`, `bucketEnd(start, interval)` | The interval bucket a time falls in |

<details>
<summary>The CSV parsing functions, with their TSDoc</summary>

```ts
/**
 * Parse OHLCV text into candles, oldest first, grouped by symbol.
 *
 * Rows that fail to parse (blank price, unreadable date) are skipped rather than failing the file:
 * exported data often carries a trailing summary line or a holiday row with no prices. Duplicate
 * timestamps keep the last row. `closeTime` is left unset (0) — it depends on the interval, which
 * {@link inferInterval} works out once the whole series is known — so pass the result through
 * {@link withCloseTimes}.
 */
function parseCandleCsv(text: string, options?: ICSVParseOptions): TParsedCSVCandles;

/**
 * Work out which {@link CandleInterval} a series was sampled at, from the smallest gap between
 * consecutive candles. Gaps (weekends, halts) only ever make a spacing larger, so the smallest one
 * is the sampling interval. Returns `undefined` when the series is too short or the spacing is not
 * a supported interval (a 90-second series, say).
 */
function inferInterval(candles: ExchangeRestCandle[]): CandleInterval | undefined;

/** Fill in `closeTime` for a series sampled at `interval`, following the exchange convention of `nextOpen - 1`. */
function withCloseTimes(candles: ExchangeRestCandle[], interval: CandleInterval): ExchangeRestCandle[];

/**
 * Whether candles at `base` can be combined into candles at `target`: the target must be coarser
 * and every target bucket must be made of whole base buckets. For fixed-length intervals that is
 * exact divisibility of spans (1h makes 4h and 1w; 3d does not make 1w). Months vary in length, so
 * only intervals of a day or less make a month.
 */
function canResample(base: CandleInterval, target: CandleInterval): boolean;

/**
 * Combine a series into coarser candles: first open, highest high, lowest low, last close, summed
 * volume and trades. Buckets follow the exchange conventions, so resampled candles line up with
 * what Binance would serve for the same interval — sub-day and multi-day buckets align to the
 * epoch, weeks start on Monday 00:00 UTC, and months are calendar months.
 *
 * `candles` must be oldest first, carry their own `closeTime`, and be sampled at an interval for
 * which {@link canResample} holds.
 */
function resampleCandles(candles: ExchangeRestCandle[], target: CandleInterval): ExchangeRestCandle[];

/** Start (ms) of the `interval` bucket containing `time`. */
function bucketStart(time: number, interval: CandleInterval): number;

/** Start (ms) of the bucket after the one starting at `start`. */
function bucketEnd(start: number, interval: CandleInterval): number;
```

</details>

## CSVExchange API

| Member | What it does |
| --- | --- |
| `CSVExchange.fromUrl(sources, options)` | Fetches the files, then builds the exchange |
| `new CSVExchange(sources, options)` | Builds it from CSV text |
| `name` | The exchange name charts ask for. Default `"CSV"` |
| `getSupportedIntervals()`, `getInstruments()` | The intervals and symbols the data serves |
| `registerCSVExchange(provider, exchange)` | Registers it, with `nullCandleStore` |
| `createCSVServices(exchange)` | Chart services with a provider of its own |

| Option (`ICSVExchangeOptions`) | Default | What it does |
| --- | --- | --- |
| `name` | `"CSV"` | The exchange name |
| `symbol` | `"CSV"` | The symbol for files with no symbol column |
| `alignToNow` | `true` | Moves the data so it ends now; `false`, or a timestamp |
| `candleLimit` | 10,000 | The most candles per request |
| `delimiter`, `hasHeader`, `columns`, `timeUnit` | | How the CSV is read: see [CSV File Format](#file-format) |

<details>
<summary>The CSVExchange class, with its TSDoc</summary>

````ts
/**
 * An exchange that serves historical candles from CSV files — for demos, tests, and charting your
 * own data without writing an adapter.
 *
 * Give it one or more files of OHLCV rows. Each file holds one symbol at one interval, or several
 * symbols if it has a symbol column. The exchange then serves:
 *
 * - **every interval the data can make**, not only the one it was sampled at. Candles are resampled
 *   up to any coarser interval made of whole source candles — a 1h file also serves 2h, 4h, 1d, 1w
 *   and 1M. When several files cover the same symbol, each interval comes from an exact match if
 *   there is one, otherwise from the coarsest file that divides it.
 * - **candles up to the present**. See {@link ICSVExchangeOptions.alignToNow}.
 *
 * It has no live data: the realtime, trade and order-book streams are empty, and the ticker stream
 * emits one 24-hour summary per symbol, computed from the data, so a watchlist has prices to show.
 *
 * Register it like any other exchange. Use {@link registerCSVExchange}, which pairs it with a
 * candle store that persists nothing (shifted timestamps change with every page load, so caching
 * them in IndexedDB would mix candles from different days), or {@link createCSVServices} for a
 * chart that should not touch the shared registry:
 *
 * ```ts
 * const csv = await CSVExchange.fromUrl({ url: "/data/btcusdt-1h.csv", symbol: "BTCUSDT" });
 * registerCSVExchange(defaultExchangeProvider, csv);
 *
 * await SciFinanceChartPanel.create(container, {
 *     exchangeName: csv.name,
 *     symbol: "BTCUSDT",
 *     interval: CandleInterval.FOUR_HOURS,
 *     studies: [new OHLCStudy(), new VolumeStudy()],
 * });
 * ```
 *
 * Timestamps are UTC. The SDK's calendar is 24/7, so gaps in the data (weekends and holidays for
 * equities) show as gaps on the chart.
 */
class CSVExchange implements IRemoteExchange {
    readonly name: string;
    candleLimit: number;
    /** No trades to rebuild a live bar from, so take the (empty) candle stream as it is. */
    readonly hasCompleteCandleStream = true;
    /**
     * Fetch the files, then construct. Build the exchange before registering it: the SDK asks an
     * exchange for its intervals synchronously, so they must be known up front.
     */
    static fromUrl(sources: string | ICSVUrlSource | Array<string | ICSVUrlSource>, options?: ICSVExchangeOptions): Promise<CSVExchange>;
    /** @param sources CSV text, or one or more {@link ICSVSource}s. */
    constructor(sources: string | ICSVSource | ICSVSource[], options?: ICSVExchangeOptions);
    getSupportedIntervals(): CandleInterval[];
    getInstruments(): Promise<string[]>;
    /**
     * Candles with `start <= openTime <= end`, oldest first, at most `limit` of them counted from
     * `start` — the same contract as Binance's klines endpoint. Unknown symbols and intervals give
     * an empty array.
     */
    getCandles(symbol: string, interval: CandleInterval, start: number, end: number, limit: number): Promise<ExchangeRestCandle[]>;
    /** The first candle, so the chart stops panning back where the data starts. */
    getListingDate(symbol: string, interval: CandleInterval): Promise<IListingDateResult | null>;
    getCandleStream(): Observable<SciTraderCandle>;
    getTrades(): Promise<SciTraderTrade[]>;
    getTradeStream(): Observable<SciTraderTrade>;
    getTickerStream(symbol: string | string[]): Observable<SciTraderTicker>;
    getAllTickerStream(productIds?: string[]): Observable<SciTraderTicker[]>;
}
````

</details>

<details>
<summary>The ICSVSource, ICSVUrlSource, ICSVExchangeOptions and ICSVParseOptions interfaces, with their TSDoc</summary>

```ts
/** One CSV file: its text, plus what the file itself cannot say. */
interface ICSVSource {
    /** The file contents. */
    csv: string;
    /**
     * Symbol for every row. Required unless the file has a symbol column, in which case each row's
     * own symbol is used and this is ignored. Falls back to {@link ICSVExchangeOptions.symbol}.
     */
    symbol?: string;
    /** The interval the rows were sampled at. Inferred from the row spacing when omitted. */
    interval?: CandleInterval;
}

/** {@link ICSVSource} fetched from a URL by {@link CSVExchange.fromUrl}. */
interface ICSVUrlSource extends Omit<ICSVSource, "csv"> {
    url: string;
}

interface ICSVExchangeOptions extends ICSVParseOptions {
    /**
     * The exchange name — the key it is registered under, and the `exchangeName` charts ask for.
     * Default `"CSV"`. Give each instance its own name to register more than one.
     */
    name?: string;
    /** Symbol for files with no symbol column and no {@link ICSVSource.symbol}. Default `"CSV"`. */
    symbol?: string;
    /**
     * Move the data forward in time so its newest candle is the current one. Default `true`.
     *
     * The chart asks for the candles leading up to *now* — its initial load ends at `Date.now()`,
     * and nothing later than now is ever requested — so a file that ended last year would render an
     * empty chart. Each series is shifted by a whole number of its own candles, which keeps every
     * candle on its interval boundary; prices and volumes are untouched.
     *
     * Pass a timestamp (ms) to align to a fixed "now" instead, for reproducible screenshots and
     * tests. Pass `false` for data that is already current.
     */
    alignToNow?: boolean | number;
    /**
     * Largest number of candles returned per request. Default 10,000.
     *
     * Keep it at least as long as the longest series where you can. The SDK pages through a long
     * range in `candleLimit` chunks and stops at the first gap in the data, so a large limit lets
     * data with weekend or holiday gaps load in one request.
     */
    candleLimit?: number;
}

interface ICSVParseOptions {
    /** Field delimiter. Default `","`. */
    delimiter?: string;
    /**
     * Whether the first non-empty line is a header row. Default `true`. Without a header every
     * column in {@link columns} must be an index.
     */
    hasHeader?: boolean;
    /**
     * Column mapping. Any field left out is found by its usual header names — `time` matches
     * `time`, `timestamp`, `date`, `datetime`, `open_time` or `openTime`; the price fields match
     * their own names or their first letter (`o`, `h`, `l`, `c`, `v`). Without a header, the
     * default is `time,open,high,low,close,volume` in that order.
     */
    columns?: Partial<Record<TCSVCandleField, TCSVColumnRef>>;
    /** See {@link TCSVTimeUnit}. Default `"auto"`. */
    timeUnit?: TCSVTimeUnit;
}

/** The candle fields a CSV column can be mapped to. */
type TCSVCandleField = "time" | "open" | "high" | "low" | "close" | "volume" | "trades" | "symbol";

/** A column reference: the header name (matched case-insensitively) or a zero-based index. */
type TCSVColumnRef = string | number;

/**
 * How the `time` column is encoded.
 *
 * - `"ms"` / `"s"` — epoch milliseconds / seconds.
 * - `"iso"` — a date string. Strings without a zone (`2024-01-31`, `2024-01-31 09:30:00`) are read
 *   as UTC, not local time, so the same file charts identically in every timezone.
 * - `"auto"` (default) — numeric values below 1e11 are seconds, larger ones milliseconds, anything
 *   non-numeric is a date string.
 */
type TCSVTimeUnit = "auto" | "ms" | "s" | "iso";
```

</details>

<details>
<summary>registerCSVExchange, createCSVServices and ICSVServicesHandle, with their TSDoc</summary>

```ts
/**
 * Register a {@link CSVExchange} with a provider, and give it a symbol normalizer if it has none so
 * the symbol picker can list its instruments.
 *
 * It is paired with a candle store that persists nothing. Aligned timestamps move with every page
 * load, and a persisted cache would keep candles from earlier loads at their old times.
 */
function registerCSVExchange(provider: IExchangeProvider, exchange: CSVExchange): void;

/** What {@link createCSVServices} returns. */
interface ICSVServicesHandle {
    /** Pass as `services` in a chart config (`ISciFinanceChartPanelConfig`, `SciFinanceChartView`). */
    services: ISciFinanceChartServices;
    /** A provider holding only this exchange — pass it to a watchlist (`WatchListDataManager`). */
    provider: IExchangeProvider;
    exchange: CSVExchange;
}

/**
 * Chart services backed by a {@link CSVExchange}, in a provider of their own, so a demo page can
 * chart CSV data without registering anything in `defaultExchangeProvider`. Charts using these
 * services must set `exchangeName` to `exchange.name`.
 */
function createCSVServices(exchange: CSVExchange): ICSVServicesHandle;
```

</details>

## Where to read next

- [JSON Data](/financial-charts/data-sources/json-data/): the same, from JavaScript objects.
- [Building a Custom Exchange](/financial-charts/data-sources/custom-exchange/): for live data.
- [Saving and Restoring](/financial-charts/save-and-restore/): saving a chart of your data.
