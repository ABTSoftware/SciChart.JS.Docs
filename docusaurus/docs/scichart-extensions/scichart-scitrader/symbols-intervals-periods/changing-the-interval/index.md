---
sidebar_position: 2
sidebar_label: Changing the Interval
title: "Changing the Candle Interval | SciTrader.js Trading Charts"
description: "Change the candle interval (timeframe) of a SciTrader.js candlestick chart with SciFinanceChart.changeInterval, and keep the user's time span with carryPeriodToInterval."
keywords: ["SciTrader", "SciTrader.js", "candle interval", "trading chart timeframe", "changeInterval", "CandleInterval"]
---

# Changing the Interval

The **interval** is the time each candle covers: one minute, four hours, one day, and so on. Intervals are values of `CandleInterval`, e.g. `CandleInterval.FOUR_HOURS`.

## changeInterval

```ts
SciFinanceChart.changeInterval(interval: CandleInterval, period?: TPeriod | null): Promise<void>
```

```ts
const chart = financeChartPanel.financeApi; // SciFinanceChart

await chart.changeInterval(CandleInterval.ONE_DAY);       // the interval's default period
await chart.changeInterval(CandleInterval.ONE_DAY, "1M"); // show the last month
await chart.changeInterval(CandleInterval.ONE_DAY, null); // no period
```

`changeInterval` reloads the current symbol at the new candle size and lands on a [period](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/periods/) in the same step, with one fetch sized for it. Like a [symbol change](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/changing-the-symbol/#what-happens-when-the-symbol-changes), it reads from the candle store first and asks the exchange only for what is missing. It raises `dataLoadStarted`, then `dataRenderComplete` with `type: "interval-change"`.

The second argument picks the period:

- **Omitted**: the new interval's default period, `defaultPeriodForInterval(interval: CandleInterval): TPeriod` (a week at 1h, a month at 4h, a year at 1d, and so on), even if no period was set before.
- **A period**: that period, at the new interval.
- **`null`**: no period. The view starts on the interval's default span, but nothing holds it there. Pass `null` to keep a chart without a period.

Afterwards `chart.currentPeriod` reports what is on screen, so there is no need to call `setPeriod` as well.

## Keeping the user's span

To keep roughly the span the user had instead of jumping to the default, pass the result of `carryPeriodToInterval`:

```ts
carryPeriodToInterval(period: TPeriod | null, interval: CandleInterval): TPeriod | null
```

It keeps the period, but cuts it to the longest that suits the interval (a week of 1m candles becomes a day) or steps it up when it would show fewer than 20 candles (a day of 1w candles becomes six months). It returns `null` for `null`:

```ts
import { CandleInterval, carryPeriodToInterval } from "scichart-scitrader";

const period = carryPeriodToInterval(chart.currentPeriod, CandleInterval.ONE_DAY);
await chart.changeInterval(CandleInterval.ONE_DAY, period);
```

## Which intervals are available

That depends on the exchange: each `IRemoteExchange` lists its own with `getSupportedIntervals(): CandleInterval[]`.

```ts
import { defaultExchangeProvider } from "scichart-scitrader";

const intervals = defaultExchangeProvider.getExchange("Binance").getSupportedIntervals();
```

To let the user pick an interval, use the ready-made [IntervalSelector](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/toolbar-controls/).

#### See also

- [Periods](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/periods/)
- [Toolbar controls](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/toolbar-controls/)
