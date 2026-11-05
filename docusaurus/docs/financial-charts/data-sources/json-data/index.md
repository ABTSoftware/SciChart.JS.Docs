---
sidebar_position: 3
sidebar_label: JSON Data
title: "Load OHLCV Data from JSON or a JavaScript Object into a Candlestick Chart | SciTrader.js"
description: "Chart OHLCV candles from JSON, a JavaScript array or your own REST API in a JavaScript or React candlestick chart with SciTrader.js, including time formats and every coarser interval."
keywords: ["OHLCV data", "JSON candlestick chart", "load JSON data into chart", "JavaScript array candlestick chart", "chart JSON data", "React candlestick chart JSON", "SciTrader.js"]
---

# JSON Data: Load OHLCV Data from JSON or a JavaScript Object

Candles often come as JSON: from your own REST API, a file, or a JavaScript array. This page shows how to chart them in a SciTrader chart.

:::note
The SDK doesn't yet have an exchange that takes JavaScript objects directly. Until it does, turn the candles into CSV text for `CSVExchange`, as below: a few lines of code, and you keep all of `CSVExchange`'s features, such as every coarser interval and dates moved to now. For live data, write an exchange of your own instead; see [Building a Custom Exchange](/financial-charts/data-sources/custom-exchange/).
:::

## Loading JSON Candles in Three Steps

**1. Get the candles**, from a file, your API or anywhere else. Any shape works, as long as each candle has a time, prices and volume:

```ts
// One candle as your JSON has it. Here: time in milliseconds, prices and volume as numbers
type TJsonCandle = { time: number; open: number; high: number; low: number; close: number; volume: number };

const candles: TJsonCandle[] = await (await fetch("https://example.com/api/candles?symbol=BTCUSDT&interval=1d")).json();
```

**2. Turn them into an exchange.** Write them as CSV rows, and give `CSVExchange` the symbol, the interval and how `time` is written:

```ts
// CSVExchange reads CSV text, so write the candles as CSV rows: a header, then one row per candle.
// The header names are the ones CSVExchange looks for; use the `columns` option for other names
function candlesToCsv(candles: TJsonCandle[]): string {
    const rows = candles.map((c) => `${c.time},${c.open},${c.high},${c.low},${c.close},${c.volume}`);
    return ["time,open,high,low,close,volume", ...rows].join("\n");
}
```

```ts
const exchange = new CSVExchange(
    { csv: candlesToCsv(candles), symbol: "BTCUSDT", interval: CandleInterval.ONE_DAY },
    { name: "MyData", timeUnit: "ms" } // "s" for seconds, "iso" for date strings
);
```

**3. Chart it**, with `createCSVServices` for one chart, or `registerCSVExchange(defaultExchangeProvider, exchange)` for every chart:

```ts
const { services } = createCSVServices(exchange);
await SciFinanceChartPanel.create(container, {
    exchangeName: exchange.name,
    symbol: "BTCUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "1Y",
    services,
    studies: [new OHLCStudy(), new VolumeStudy()],
});
```

## JSON Shapes and Times

| Your JSON has | Do this |
| --- | --- |
| Times in milliseconds | `timeUnit: "ms"` |
| Times in seconds (Unix time) | `timeUnit: "s"` |
| ISO date strings, e.g. `"2026-07-01T12:00:00Z"` | `timeUnit: "iso"`. Dates without a timezone are read as UTC |
| Prices as strings | Write them as they are: the CSV is text |
| Other field names, e.g. `{ t, o, h, l, c, v }` | Read them in `candlesToCsv`, e.g. `${c.t},${c.o},…` |
| Several symbols | One `{ csv, symbol }` source per symbol, in an array: `new CSVExchange([source1, source2], options)` |
| Several intervals of one symbol | One source per interval: each interval is then served from the best match |
| Arrays instead of objects, e.g. `[time, open, high, low, close, volume]` | `rows.map((r) => r.join(","))` |

The data is moved to end now, like any CSV data; pass `alignToNow: false` if it is already current. See [CSV Data](/financial-charts/data-sources/csv-data/#dates-move-to-now).

## TypeScript Example: A Candlestick Chart from JSON Data

Four years of BTCUSDT daily candles, fetched as JSON, turned into an exchange and charted with Volume and MACD.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/dataSources_JSON/vanilla" html={`<div id="chart" style="height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/dataSources_JSON/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Candlestick Chart from JSON Data

The same chart in React: the candles are fetched in an effect, and the chart renders once they are in.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="JsonDataChart" name="../../_examples/dataSources_JSON/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/dataSources_JSON/react.tsx
    ```
</CodeSnippetBlock>

## Where to read next

- [CSV Data](/financial-charts/data-sources/csv-data/): every `CSVExchange` option.
- [Building a Custom Exchange](/financial-charts/data-sources/custom-exchange/): your API as a live exchange.
- [Data Sources](/financial-charts/data-sources/): every data source.
