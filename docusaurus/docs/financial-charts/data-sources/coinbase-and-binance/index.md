---
sidebar_position: 1
sidebar_label: Coinbase and Binance
title: "Coinbase API and Binance API Data in a JavaScript or React Financial Chart | SciTrader.js"
description: "Chart live crypto market data from the Coinbase API and Binance API in a JavaScript or React financial chart with SciTrader.js: the built-in CoinbaseExchange and BinanceExchange, their symbols, intervals, limits and live streams."
keywords: ["Coinbase API", "Binance API", "Coinbase API chart", "Binance API chart", "real-time crypto chart", "crypto candlestick chart JavaScript", "React crypto chart", "SciTrader.js"]
---

# Coinbase and Binance: Live Crypto Data from the Coinbase API and Binance API

SciTrader has two live exchanges built in, `CoinbaseExchange` and `BinanceExchange`. Both read the exchange's **public** market data API, so they need no API key: historical candles back to when a market listed, and live candles, trades and tickers over WebSocket. Register one and a chart charts it by name.

```ts
import { BinanceExchange, CoinbaseExchange, defaultExchangeProvider, idbPriceStore } from "scichart-scitrader";

defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
```

## Coinbase and Binance Compared

| | `CoinbaseExchange` | `BinanceExchange` |
| --- | --- | --- |
| Exchange name | `"Coinbase"` | `"Binance"` |
| Symbol format | `BTC-USD` (BASE-QUOTE) | `BTCUSDT` (BASE and QUOTE together) |
| Intervals | 1m, 5m, 15m, 1h, 6h, 1d | Every SciTrader interval, 1s to 1M |
| Candles per request (`candleLimit`) | 300 | 1,000 |
| Live data | Candles, trades and tickers | Candles, trades and tickers |
| Watchlist sparklines | A dedicated candle stream (`getSparklineCandleStream`), fixed at 5 minutes | Candles and the candle stream |
| Order book | None built in; see [Order Book Data](/financial-charts/data-sources/order-book-data/) | None built in |
| Endpoints | `api.exchange.coinbase.com`, `ws-feed.exchange.coinbase.com` | `api.binance.com`, `stream.binance.com` |

**Intervals.** A chart's interval pickers offer only the intervals the exchange serves, from `getSupportedIntervals()`. Coinbase has no 4h, for example.

**Symbols.** Each exchange uses its own symbol format. `mapSymbol(symbol, from, to)` converts between them, e.g. `mapSymbol("BTCUSDT", "Binance", "Coinbase")` is `"BTC-USD"`; see [Changing the Symbol](/financial-charts/symbols-intervals-periods/changing-the-symbol/).

:::warning[Binance is geo-blocked in some countries]
`api.binance.com` refuses requests from the United States and some other countries, including India, so a chart on Binance shows nothing for users there. Use Coinbase, or your own data, for an audience in those countries. For that reason this page has no live Binance example; the code is the same as for Coinbase, with Binance's name and symbols.
:::

:::note[The first chart takes a moment]
The first time a chart loads a symbol and interval, the exchange finds where its history starts, the **listing date**, so panning back stops there. On Coinbase this takes a few requests, which delays the first draw by about a second. The answer is stored with the candles, so later loads skip it.
:::

## Charting the Coinbase API

```ts
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: CoinbaseExchange.name, // "Coinbase"
    symbol: "BTC-USD",
    interval: CandleInterval.ONE_HOUR,
    period: "1W",
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

## TypeScript Example: A Live Coinbase API Chart

BTC-USD from Coinbase, updating live. The buttons change the symbol with `setSymbol` and the interval with `changeInterval`, offering only the intervals Coinbase serves. The price on the right is the exchange client's live ticker stream.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/dataSources_Coinbase/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_Coinbase/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Live Coinbase API Chart

The same chart in React. The ticker subscription lives in an effect, which resubscribes when the symbol changes.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="CoinbaseChart" name="../../_examples/dataSources_Coinbase/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/dataSources_Coinbase/react.tsx
    ```
</CodeSnippetBlock>

## Charting the Binance API

Binance is the same, with Binance's name and symbols. It also serves intervals Coinbase doesn't, such as 4h and 1w:

```ts
import { BinanceExchange, CandleInterval, defaultExchangeProvider, idbPriceStore, OHLCStudy, SciFinanceChartPanel, VolumeStudy } from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // "Binance"
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    period: "3M",
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

**Fewer, larger requests.** `BinanceExchange.candleLimit` sets the candles per request, 1,000 by default, Binance's maximum. Set it before the first chart is created; the client reads it once.

## CoinbaseExchange and BinanceExchange API

Both are `IRemoteExchange` objects; [Building a Custom Exchange](/financial-charts/data-sources/custom-exchange/#iremoteexchange) documents every member.

<details>
<summary>CoinbaseExchange and BinanceExchange, with their TSDoc</summary>

```ts
const CoinbaseExchange: IRemoteExchange;

const BinanceExchange: IRemoteExchange;
```

</details>

## Where to read next

- [Candle Stores and Caching](/financial-charts/data-sources/candle-stores-and-caching/): what `idbPriceStore` keeps, and how to clear it.
- [Building a Custom Exchange](/financial-charts/data-sources/custom-exchange/): connect another exchange, such as Kraken.
- [Order Book Data](/financial-charts/data-sources/order-book-data/): a live Coinbase order book for the Market Depth panel.
