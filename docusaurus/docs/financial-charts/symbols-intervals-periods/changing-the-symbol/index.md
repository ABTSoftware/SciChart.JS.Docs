---
sidebar_position: 1
sidebar_label: Changing the Symbol
title: "Changing the Symbol | SciTrader.js Financial Charts"
description: "Switch a SciTrader.js trading chart to another symbol or exchange with SciFinanceChart.setSymbol, and learn how the chart fetches candles from the exchange, the cache and the live stream."
keywords: ["SciTrader", "SciTrader.js", "change symbol trading chart", "setSymbol", "createDataFeed", "IRemoteExchange"]
---

# Changing the Symbol

## setSymbol

```ts
SciFinanceChart.setSymbol(
    symbol: string,
    exchangeName?: string,                    // default: the current exchange
    options?: { period?: TPeriod | null }     // default: the current period
): Promise<IDataFeed | undefined>
```

```ts
const chart = financeChartPanel.financeApi; // SciFinanceChart

await chart.setSymbol("ETHUSDT");                         // same exchange, interval and period
await chart.setSymbol("ETH-USD", "Coinbase");             // another exchange
await chart.setSymbol("ETHUSDT", undefined, { period: "1M" }); // show the last month once loaded
```

`setSymbol` keeps the current interval and, unless you pass one, the current [period](/financial-charts/symbols-intervals-periods/periods/). Studies, panes and drawings stay, and every study recalculates on the new data. The promise resolves with the chart's new default data feed once the new candles are drawn.

`symbol` is in the exchange's own format: Binance uses `BTCUSDT`, Coinbase uses `BTC-USD`. `mapSymbol(symbol: string, from: string, to: string): string | null` converts between them, and returns `null` when it can't:

```ts
import { mapSymbol } from "scichart-scitrader";

mapSymbol("BTCUSDT", "Binance", "Coinbase"); // "BTC-USD"
```

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
const feed = [...chart.dataFeeds.values()].find((f) => f.isDefault);
console.log(feed.exchangeName, feed.symbol, feed.interval);
```

## Changing symbol and interval together

`setSymbol` is shorthand for `createDataFeed` with the current interval. To change the symbol and the interval in one step, with one fetch, call `createDataFeed` yourself:

```ts
SciFinanceChart.createDataFeed(
    feedType: EDataFeedType,
    exchangeName: string,
    symbol: string,
    interval: CandleInterval,
    isDefault: boolean,
    period?: TPeriod | null
): Promise<IDataFeed | undefined>
```

```ts
import { CandleInterval, EDataFeedType, IDataFeed } from "scichart-scitrader";

const feed: IDataFeed = await chart.createDataFeed(
    EDataFeedType.OHLCVRealtime, // candles, with live updates
    "Binance",                   // exchange, as registered
    "ETHUSDT",                   // symbol
    CandleInterval.ONE_DAY,      // interval
    true,                        // make this the default feed: the chart switches to it
    "1Y"                         // optional: the period to show once loaded
);
```

It creates a feed, loads its initial data, subscribes it to live updates, and resolves with it. The returned `IDataFeed` has the feed's `id`, `exchangeName`, `symbol`, `interval` and `isDefault`; pass `id` to `chart.removeDataFeed(id)` to remove a feed that isn't the default.

- **`isDefault: true`** replaces the chart's default feed. That is what `setSymbol` does, with the same events.
- **`isDefault: false`** adds an extra feed alongside it, for studies that need other data, such as order-book studies. The chart must already have a default feed.
- **`EDataFeedType.OrderBook`** resolves with `undefined` when the exchange has no order-book source. See [Order-book data](/financial-charts/data-sources/#order-book-data).

#### See also

- [Changing the interval](/financial-charts/symbols-intervals-periods/changing-the-interval/)
- [Data sources](/financial-charts/data-sources/)
