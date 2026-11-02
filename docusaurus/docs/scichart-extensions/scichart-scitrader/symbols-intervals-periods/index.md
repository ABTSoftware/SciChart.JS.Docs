---
sidebar_position: 4
sidebar_label: Symbols, Intervals and Periods
title: "Symbols, Intervals and Periods | SciTrader.js Financial Charts"
description: "Change the symbol, candle interval and visible period of a SciTrader.js financial chart at runtime."
keywords: ["SciTrader", "SciTrader.js", "trading chart timeframe", "candle interval", "SciTrader symbol"]
---

# Symbols, intervals and periods

A chart keeps its studies, panes and drawings when its data changes. Three calls on `financeApi` change the data.

## Change symbol

```ts
await panel.financeApi.setSymbol("ETHUSDT");
```

`setSymbol` keeps the current interval and period, and every study recalculates on the new data. While it loads, the chart raises `dataLoadStarted`; when the new data is drawn, `dataRenderComplete` with `type: "symbol-change"`.

A second argument switches exchange too:

```ts
await panel.financeApi.setSymbol("ETH-USD", "Coinbase");
```

Each exchange names symbols in its own way: Binance uses `BTCUSDT`, Coinbase uses `BTC-USD`. `mapSymbol(symbol, from, to)` converts between them. To show a different period once the new symbol loads, pass it as an option: `setSymbol("ETHUSDT", undefined, { period: "1M" })`.

Under the hood the chart draws its **default data feed**, and `setSymbol` replaces it. To change symbol and interval in one step, create the new default feed yourself:

```ts
import { EDataFeedType } from "scichart-scitrader";

await panel.financeApi.createDataFeed(
    EDataFeedType.OHLCVRealtime,
    "Binance",    // exchange
    "ETHUSDT",    // symbol
    interval,     // interval to load at
    true,         // make this the default feed
    period        // optional: the period to show once loaded
);
```

## Change interval

```ts
await panel.financeApi.changeInterval(CandleInterval.ONE_DAY);        // the interval's default period
await panel.financeApi.changeInterval(CandleInterval.ONE_DAY, "1M");  // show the last month
await panel.financeApi.changeInterval(CandleInterval.ONE_DAY, null);  // no period
```

`changeInterval` reloads the current symbol at the new candle size and lands on a [period](#periods) in the same step, with one fetch sized for it. The second argument picks the period:

- **Omitted**: the new interval's default period (`defaultPeriodForInterval`: a week at 1h, a month at 4h, a year at 1d, and so on), even if no period was set before.
- **A period**: that period, at the new interval.
- **`null`**: no period. The view starts on the interval's default span, but nothing holds it there. Pass `null` to keep a chart without a period.

Afterwards `currentPeriod` reports what is on screen, so there is no need to call `setPeriod` as well.

To keep roughly the span the user had instead, pass `carryPeriodToInterval(period, interval)`. It keeps the period, but cuts it to the longest that suits the interval (a week of 1m candles becomes a day) or steps it up when it would show fewer than 20 candles (a day of 1w candles becomes six months). It returns `null` for `null`:

```ts
import { carryPeriodToInterval } from "scichart-scitrader";

const period = carryPeriodToInterval(chart.currentPeriod, CandleInterval.ONE_DAY);
await chart.changeInterval(CandleInterval.ONE_DAY, period);
```

Which intervals are available depends on the exchange. `defaultExchangeProvider.getExchange(name).getSupportedIntervals()` lists them.

## Periods

A **period** is how much time the chart shows: the last hour, day, month, year, and so on.

```ts
await panel.financeApi.setPeriod("3M"); // last three months
await panel.financeApi.setPeriod(null); // no period: leave the view where it is
```

| Value | Span |
|---|---|
| `"1m"` | 1 minute |
| `"1H"` | 1 hour |
| `"1D"` | 1 day |
| `"5D"` | 5 days |
| `"1W"` | 1 week |
| `"1M"` | 1 month |
| `"3M"` | 3 months |
| `"6M"` | 6 months |
| `"YTD"` | Year to date |
| `"1Y"` | 1 year |
| `"10Y"` | 10 years |
| `"ALL"` | All data |

These are also available by name as `EPeriod`.

The chart fetches enough candles to fill the period, plus two extras: a buffer (`periodBufferRatio`, default 20%) and whatever warm-up the attached indicators need.

A period stays set while the user pans. `currentPeriod` keeps reporting it until `setPeriod` is called again. With `lockPeriodWidth` (the default), the period is also the widest the user can zoom out to. Set `lockPeriodWidth: false` to treat the period as the starting view only.

Not every period suits every interval: a year of one-minute candles is too many to fetch. `validPeriodsForInterval(interval)` lists the sensible ones.

## Controls

The SDK has ready-made pickers for the interval and period, and for the candle type and live-tip mode, in plain TypeScript and React. In React:

```tsx
import { IntervalSelector, PeriodSelector } from "scichart-scitrader-react";

<IntervalSelector
    value={interval}
    intervals={INTERVALS}
    onChange={(next) => {
        // Keep about the same span, adjusted to suit the new interval.
        const carried = carryPeriodToInterval(period, next);
        setInterval(next);
        setPeriod(carried);
        api && changeInterval(api, next, carried);
    }}
/>
<PeriodSelector
    value={period}
    currentInterval={interval}
    onChange={(next) => {
        setPeriod(next);
        api && changePeriod(api, next);
    }}
/>
```

`PeriodSelector` greys out periods that don't suit `currentInterval`. [UI components](/scichart-extensions/scichart-scitrader/ui-components/#toolbar-controls) covers all four controls, including their plain TypeScript versions.

<CenteredImageWrapper src={require("../_examples/gettingStarted_SymbolInterval/screenshot.png").default} title="Symbol, Interval and Period" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/gettingStarted_SymbolInterval/drawExample.ts
    ```
    ```tsx showLineNumbers file=../_examples/gettingStarted_SymbolInterval/index.tsx
    ```
</CodeSnippetBlock>
