---
sidebar_position: 6
sidebar_label: Data Sources
title: "Data Sources: Binance, Coinbase, CSV & Custom Feeds | SciTrader.js"
description: "Connect SciTrader.js trading charts to live Binance and Coinbase market data, CSV files, order-book data or your own custom data feed."
keywords: ["SciTrader", "SciTrader.js", "Binance chart JavaScript", "Coinbase chart", "real-time trading chart data", "custom market data feed"]
---

# Data sources

A chart asks for data by **exchange name**, for example `exchangeName: "Binance"`. An **exchange** is any object implementing `IRemoteExchange`. You register it once, with an `IExchangeProvider`, under its `name`.

The SDK wraps each registered exchange in its own client. The client provides:

-   an in-memory candle cache, plus optional persistent caching;
-   paging back through history in chunks;
-   stopping at the first candle ever listed.

An exchange only has to answer simple requests.

| Source               | Class                                                    | Live updates      | Order book             |
| -------------------- | -------------------------------------------------------- | ----------------- | ---------------------- |
| Binance              | `BinanceExchange`                                        | yes               | no                     |
| Coinbase             | `CoinbaseExchange`                                       | yes               | no                     |
| CSV files            | `CSVExchange`                                            | no                | no                     |
| Your own             | implement `IRemoteExchange`                              | if you provide it | via `IOrderBookSource` |

## Registering an exchange

```ts
import { defaultExchangeProvider, idbPriceStore } from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
```

`defaultExchangeProvider` is the registry that charts, the watchlist and the symbol picker use unless told otherwise. It starts empty.

The second argument is the **candle store**, which decides what is cached between sessions:

-   `idbPriceStore` persists candles in IndexedDB. A reload draws from the cache and fetches only newer candles. Use it for real market data.
-   `nullCandleStore` persists nothing, so every page load starts cold (the in-session memory cache still works). Use it for data that isn't stable between sessions, such as generated data, or CSV data shifted to the current date.

### Keeping an exchange private to a chart

To use an exchange in one chart without registering it globally, give the chart its own services:

```ts
import { createExchangeProvider, DataFeedManager } from "scichart-scitrader";

const provider = createExchangeProvider();
provider.registerExchange(myExchange, nullCandleStore);

await SciFinanceChartPanel.create(container, {
    exchangeName: myExchange.name,
    // …
    services: { dataFeedManager: new DataFeedManager(provider) },
});
```

The symbol picker (`getSymbolCatalog`) always reads `defaultExchangeProvider`, so a privately registered exchange won't appear in it.

## Binance and Coinbase

```ts
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

await SciFinanceChartPanel.create(container, {
    exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
    symbol: "BTC-USD", // Binance: "BTCUSDT"
    interval: CandleInterval.ONE_MINUTE,
    period: "1H",
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

-   **How data arrives:** history over REST, then the latest candle updated over the exchange's websocket.
-   **Keys:** neither connector needs an API key.
-   **Region:** Binance refuses connections from some regions, including the US (HTTP 451).
-   **Symbol formats:** each exchange writes symbols differently. `mapSymbol("BTCUSDT", "Binance", "Coinbase")` returns `"BTC-USD"`.
-   **Intervals:** Coinbase supports fewer intervals than Binance; see `getSupportedIntervals()`.

<CenteredImageWrapper src={require("../_examples/dataSources_LiveExchanges/screenshot.png").default} title="Binance and Coinbase (live)" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/dataSources_LiveExchanges/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/dataSources_LiveExchanges/react.tsx
    ```
</CodeSnippetBlock>

## CSV data

`CSVExchange` charts candles from CSV text: your own historical data, demo data, test fixtures.

```ts
import { CSVExchange, registerCSVExchange } from "scichart-scitrader";

const csv = await CSVExchange.fromUrl("data/crypto-1h.csv", { name: "MyCSV" });
registerCSVExchange(defaultExchangeProvider, csv);

await SciFinanceChartPanel.create(container, {
    exchangeName: csv.name, // name="MyCSV", set by fromUrl above
    symbol: "SOLUSDT",
    interval: CandleInterval.FOUR_HOURS, // resampled from the file's hourly rows
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

### File format

One row per candle. The header names the columns, in any order:

```
symbol,time,open,high,low,close,volume
BTCUSDT,2026-07-01 12:00,58622.02,58676,58326,58538.01,1716.61
```

**Columns**

-   **Found automatically** by their usual names:
    -   time: `time`, `timestamp`, `date`, `datetime`, `open_time`
    -   prices and volume: `open`, `high`, `low`, `close` (or `adj close`), `volume`; single letters `o`, `h`, `l`, `c`, `v` also work
    -   optional: `trades`, `symbol`
-   **Mapped by hand** for anything else, by header name or column index: `columns: { time: "Date", close: 4 }`.
-   **Headerless files**: pass `hasHeader: false`. The columns are then read as `time, open, high, low, close, volume`.

**Symbols**

-   A `symbol` column lets one file hold several symbols.
-   Otherwise, give each file's symbol explicitly: `{ url, symbol: "AAPL" }`.

**Time**

-   Epoch seconds, epoch milliseconds or date strings.
-   Dates without a timezone are read as **UTC**.
-   Set `timeUnit` if the automatic detection guesses wrong.

**Rows**

-   Other delimiters: `delimiter: ";"`.
-   Quoted fields, and numbers with thousands separators (`"1,234.5"`), are handled.
-   Rows that can't be parsed (blank prices, a trailing summary line) are skipped.

### Intervals

The exchange works out a file's interval from its row spacing; pass `interval` if it can't. It serves that interval **and every coarser interval made of whole candles**, resampled on first request. An hourly file also serves 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w and 1M.

Buckets follow exchange conventions: weeks start on Monday, and months are calendar months. When several files cover one symbol, each interval comes from an exact match if there is one. Otherwise it is resampled from the coarsest file that divides it. For example, an hourly file and a daily file together give detailed intraday charts and long daily history.

### Dates move to now

The chart loads the candles leading up to _now_, so a file that ended last year would show nothing. By default `CSVExchange` moves each series forward so its last candle is the current one. It moves by whole candles, so every candle stays on its interval boundary; prices are untouched.

-   Pass `alignToNow: false` for data that is already current.
-   Pass a timestamp to align to a fixed moment, for repeatable screenshots and tests.

Because the dates change with every load, register CSV data with `nullCandleStore`, never `idbPriceStore`. `registerCSVExchange` does this for you. It also registers a symbol normalizer, so the symbol picker can list the file's symbols.

### Limits

-   **No live updates.** The candle stream is empty. The ticker stream emits one 24-hour summary per symbol, computed from the data, so a watchlist has prices to show.
-   **Gaps.** The SDK's calendar runs 24/7, so weekends and holidays in equity data show as gaps.
-   **`candleLimit`.** A range longer than `candleLimit` (default 10,000) is loaded in pages, and paging stops at the first gap. Keep it at least as long as your longest series.

<CenteredImageWrapper src={require("../_examples/dataSources_CSV/screenshot.png").default} title="CSV Data" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/dataSources_CSV/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/dataSources_CSV/react.tsx
    ```
</CodeSnippetBlock>

## A custom data source

Implement `IRemoteExchange`:

```ts
import { EMPTY, Observable } from "rxjs";
import { IRemoteExchange } from "scichart-scitrader";

class MyExchange implements IRemoteExchange {
    readonly name = "MyExchange";
    candleLimit = 1000; // most candles per getCandles call
    readonly hasCompleteCandleStream = true;

    async getInstruments() {
        return ["ALPHA", "BETA"];
    }
    getSupportedIntervals() {
        return [CandleInterval.ONE_MINUTE, CandleInterval.ONE_HOUR, CandleInterval.ONE_DAY];
    }
    async getListingDate() {
        return { openTime: Date.UTC(2024, 0, 1) };
    }

    // History: candles with start <= openTime <= end, oldest first, at most `limit` from `start`.
    async getCandles(symbol, interval, start, end, limit) {
        /* … */
    }

    // Live: emit the whole current candle whenever it changes. EMPTY for historical-only sources.
    getCandleStream(symbol, interval): Observable<SciTraderCandle> {
        /* … */
    }

    // Trades and tickers feed the trade studies and the watchlist. Return empty if you have none.
    async getTrades() {
        return [];
    }
    getTradeStream() {
        return EMPTY;
    }
    getTickerStream() {
        return EMPTY;
    }
    getAllTickerStream() {
        return EMPTY;
    }
}

defaultExchangeProvider.registerExchange(new MyExchange(), idbPriceStore);
```

-   **Candles.** `getCandles` returns `ExchangeRestCandle`s:

    -   timestamps (`openTime`, `closeTime`) are epoch **milliseconds**, with `closeTime = openTime + interval - 1`;
    -   prices and volume are **strings**.

    It is the only method a historical chart needs. The SDK pages through long ranges itself, in chunks of `candleLimit`.

-   **The live stream.** `getCandleStream` emits `SciTraderCandle`s for the forming candle. Echo each `symbol` exactly as it was requested. Set `hasCompleteCandleStream = true` when each emission is the full candle. Otherwise, the SDK rebuilds the live candle from `getTradeStream`.
-   **The listing floor.** `getListingDate` gives the first candle, so the chart stops loading when the user pans back to it. Return `null` if you don't know it.
-   **rxjs.** Build Observables with the app's single copy of rxjs (7.5.5 or later), the one the SDK uses as its peer dependency. Two copies of rxjs in one app do not interoperate.
-   **Other exchanges' helpers.** Registries keyed by exchange name, such as `intervalMaps` and `symbolNormalizers`, only know the built-in exchanges. A custom exchange doesn't need them, but the symbol picker needs a `symbolNormalizers[name]` entry to list its instruments.

<CenteredImageWrapper src={require("../_examples/dataSources_CustomExchange/screenshot.png").default} title="Custom Data Source" />

The **Custom Data Source** example is a complete exchange that generates prices from a formula, with live updates twice a second.

<CodeSnippetBlock labels={["TS", "React", "SyntheticExchange.ts"]}>
    ```ts showLineNumbers file=../_examples/dataSources_CustomExchange/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/dataSources_CustomExchange/react.tsx
    ```
    ```ts showLineNumbers file=../_examples/dataSources_CustomExchange/SyntheticExchange.ts
    ```
</CodeSnippetBlock>

## Order-book data

The order-book studies (`OrderBookHeatmapStudy`, `OrderBookImbalanceStudy`) and the market-depth components read an `IOrderBookSource`, registered per exchange name:

```ts
import { setOrderBookSources } from "scichart-scitrader";

setOrderBookSources(new Map([["MyExchange", myOrderBookSource]]));
```

The source provides these, all keyed by symbol:

-   snapshots and a live stream of the book, for the market-depth panel;
-   the heatmap's tiers and tiles: resting size per price row, per time bucket;
-   a live depth column for the forming bucket.

<CenteredImageWrapper src={require("../_examples/dataSources_OrderBook/screenshot.png").default} title="Order Book (dummy data)" />

The **Order Book (dummy data)** example uses a randomised source (`DummyOrderBookSource`, in the `DummyDataExchange.ts` tab below), a template for adapting a real one.

<CodeSnippetBlock labels={["TS", "React", "DummyDataExchange.ts"]}>
    ```ts showLineNumbers file=../_examples/dataSources_OrderBook/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/dataSources_OrderBook/react.tsx
    ```
    ```ts showLineNumbers file=../_examples/dataSources_OrderBook/DummyDataExchange.ts
    ```
</CodeSnippetBlock>

### Market depth

`MarketDepthPanel` shows the live book as a price ladder: asks above the spread, bids below, each rung with its amount and the running total, and a depth bar behind it. It is drawn with SciChart, so it keeps up with a fast book. The header has the symbol and a ± stepper for the price grouping, and pointing at a rung shows what sweeping the book to that price would cost (see [Slippage readout](#slippage-readout)).

```ts
import { getOrderBookSource, MarketDepthPanel } from "scichart-scitrader";

const panel = MarketDepthPanel.create(document.getElementById("depth"), {
    source: getOrderBookSource("Binance"),
    symbol: "BTCUSDT",
    settings: loadSavedSettings(), // optional; DEFAULT_MARKET_DEPTH_SETTINGS otherwise
    onSettingsChange: saveSettings, // the stepper changed the grouping
});

panel.setSymbol("ETHUSDT"); // re-points the book; nothing is rebuilt
panel.setTheme(SCITRADER_LIGHT_THEME);
panel.destroy();
```

In React, `MarketDepthView` from `scichart-scitrader-react` mounts it, with the same options as props and the theme from `SciTraderThemeProvider`:

```tsx
<MarketDepthView source={source} symbol={symbol} settings={settings} onSettingsChange={setSettings} />
```

-   **Settings** (`TMarketDepthSettings`) cover the refresh rate, the pulled-wall rule, the grouping, the row height, fonts, flash duration and colours. Model settings apply to the running book; a change to how the ladder is drawn rebuilds its surface. Settings are theme-neutral, so they are safe to persist; see [Styling → Market depth](/financial-charts/styling-and-themes/#market-depth).
-   **No settings dialog ships.** Pass `onSettingsClick` and the header shows a cog that calls it. The SciTrader app opens its own dialog there, reading `panel.themedSettings` and `panel.availableGroupings()`, with a `ColorPicker` for each colour. The **Order Book (dummy data)** demo recolours the bid and ask prices the same way ([UI components](/financial-charts/ui-components/#colour-picker)).
-   **Rows.** By default the row count follows the panel's height and the row height. Pass `rows` for a fixed count.
-   **Slippage readout.** <a id="slippage-readout"></a>On by default; turn it off with `sweepReadout: false` or `panel.setSweepReadout(false)`. It follows the input device, so the page doesn't need to detect phones or tablets:
    -   **Mouse or pen:** hovering a rung shows it, and it goes when the pointer leaves the ladder.
    -   **Touch:** hold a finger on a rung for 450 ms. The device vibrates briefly where the browser supports it (not iOS). Drag to move between rungs, and lift the finger to hide it. A finger that moves more than 10 px before the hold completes is treated as a scroll or swipe, and a second finger cancels it.
    -   **Placement:** beside the panel on its left when there is room; otherwise, as on a phone, inside the panel on the half away from the finger, and kept on screen.
    -   The ladder sets `touch-action: none` and turns off the iOS long-press text selection and callout, so the hold isn't taken by the browser.
-   **`MarketDepthLadder`** is the headless model underneath, for a host that wants to render the rows itself: `subscribe` delivers `IDepthLadder` (bids, asks, mid, spread, grouping) on every book update.
