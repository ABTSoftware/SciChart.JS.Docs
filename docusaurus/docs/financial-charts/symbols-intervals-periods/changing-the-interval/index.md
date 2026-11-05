---
sidebar_position: 2
sidebar_label: Changing the Interval
title: "Changing the Candle Interval | SciTrader.js Trading Charts"
description: "Change the candle interval (timeframe) of a SciTrader.js candlestick chart with SciFinanceChart.changeInterval, and keep the user's time span with carryPeriodToInterval."
keywords: ["SciTrader", "SciTrader.js", "candle interval", "trading chart timeframe", "changeInterval", "CandleInterval"]
---

# Changing the Interval

The **interval** is the time each candle covers: one minute, six hours, one day, and so on. Intervals are values of the `CandleInterval` enum, e.g. `CandleInterval.SIX_HOURS`. Which intervals you can use depends on the exchange: see [Which Intervals an Exchange Supports](#which-intervals-are-available).

## SciFinanceChart.changeInterval {#changeinterval}

`changeInterval` is a method of [`SciFinanceChart`](/financial-charts/ui-components/sci-finance-chart/finance-chart-api/#the-scifinancechart-class), the chart you reach through `financeChartPanel.financeApi`. It reloads the current symbol at the new candle size, and lands on a [period](/financial-charts/symbols-intervals-periods/periods/) in the same step.

```ts
/**
 * Reload the current symbol's candles at a new interval, landing on a period in the same step.
 *
 * `period` picks what the chart shows at the new interval:
 *  - a {@link TPeriod} — that period, applied at the new interval;
 *  - `null` — no period (free pan/zoom). The view lands on the interval's default window, but
 *    nothing caps the zoom afterwards;
 *  - omitted — {@link defaultPeriodForInterval}, even when no period was active before.
 *
 * Afterwards {@link currentPeriod} describes what is on screen, so there is no need to follow
 * this with {@link setPeriod}. The fetch is sized for the target period, so a period change
 * costs no second fetch. To keep the user's period across the switch instead of snapping to
 * the default, pass `carryPeriodToInterval(chart.currentPeriod, interval)`.
 *
 * A {@link setPeriod} call made while this is loading wins: the period resolved here is then
 * not applied.
 */
changeInterval(interval: CandleInterval, period?: TPeriod | null): Promise<void>;
```

```ts
import { CandleInterval } from "scichart-scitrader";

const chart = financeChartPanel.financeApi; // SciFinanceChart

// Switch to daily candles. With no period given, the chart shows the
// interval's default period: a year, for daily candles
await chart.changeInterval(CandleInterval.ONE_DAY);

// Switch to daily candles and show the last month
await chart.changeInterval(CandleInterval.ONE_DAY, "1M");

// Switch to daily candles with no period: the user can pan and zoom freely
await chart.changeInterval(CandleInterval.ONE_DAY, null);
```

<details>
<summary>The CandleInterval enum</summary>

```ts
enum CandleInterval {
    ONE_SECOND = "1s",
    ONE_MINUTE = "1m",
    THREE_MINUTES = "3m",
    FIVE_MINUTES = "5m",
    FIFTEEN_MINUTES = "15m",
    THIRTY_MINUTES = "30m",
    ONE_HOUR = "1h",
    TWO_HOURS = "2h",
    FOUR_HOURS = "4h",
    SIX_HOURS = "6h",
    EIGHT_HOURS = "8h",
    TWELVE_HOURS = "12h",
    ONE_DAY = "1d",
    THREE_DAYS = "3d",
    ONE_WEEK = "1w",
    ONE_MONTH = "1M"
}
```

</details>

The second argument picks the period:

| `period` | What the chart shows |
| --- | --- |
| Omitted | The new interval's [default period](#defaultperiodforinterval), even if no period was set before |
| A period, e.g. `"1M"` | That period, at the new interval |
| `null` | No period. The view starts on the interval's default span, but nothing holds it there, so the user can pan and zoom freely |

Afterwards `chart.currentPeriod` reports what is on screen, so there is no need to call `setPeriod` as well.

## defaultPeriodForInterval: The Default Period for Each Interval {#defaultperiodforinterval}

Each interval has a default period: a span that shows a useful number of candles at that size. A week of 1-minute candles would be over 10,000 candles, while a week of daily candles would be just seven, so the default grows with the interval. `defaultPeriodForInterval(interval)` returns it.

`changeInterval` uses it when you don't pass a period. Call it yourself when you need to know where an interval change will land, for example to:

- **Start the chart on the same period** an interval change would give, in the chart config.
- **Tell the user what they'll see**, e.g. in an interval button's tooltip.
- **Update your own period picker** when the interval changes, so it shows the right period.

The defaults for the intervals Coinbase supports:

| Interval | Default period |
| --- | --- |
| `ONE_MINUTE` (1m) | `"1H"`, an hour |
| `FIVE_MINUTES` (5m) | `"1D"`, a day |
| `FIFTEEN_MINUTES` (15m) | `"5D"`, five days |
| `ONE_HOUR` (1h) | `"1W"`, a week |
| `SIX_HOURS` (6h) | `"3M"`, three months |
| `ONE_DAY` (1d) | `"1Y"`, a year |

```ts
import {
    CandleInterval,
    CoinbaseExchange,
    defaultPeriodForInterval,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy
} from "scichart-scitrader";

// The period changeInterval(CandleInterval.ONE_HOUR) would land on: "1W"
const period = defaultPeriodForInterval(CandleInterval.ONE_HOUR);

// Start a chart on 1h candles with that same period, so the first view
// matches what an interval change to 1h would show
const config: ISciFinanceChartPanelConfig = {
    exchangeName: CoinbaseExchange.name,
    symbol: "BTC-USD",
    interval: CandleInterval.ONE_HOUR,
    period, // "1W"
    studies: [new OHLCStudy(), new VolumeStudy()],
};

// Label an interval button with where it will land
const button = document.createElement("button");
button.textContent = "6h";
button.title = `Shows ${defaultPeriodForInterval(CandleInterval.SIX_HOURS)} of 6h candles`; // "Shows 3M of 6h candles"
```

<details>
<summary>The defaultPeriodForInterval function, with its TSDoc</summary>

```ts
/**
 * Default preset period for an interval — looked up from the static
 * {@link DEFAULT_PERIOD_FOR_INTERVAL} table.
 */
function defaultPeriodForInterval(interval: CandleInterval): TPeriod;
```

</details>

## What Happens When the Interval Changes

`changeInterval` works like a [symbol change](/financial-charts/symbols-intervals-periods/changing-the-symbol/#what-happens-when-the-symbol-changes), but keeps the symbol:

1. **The chart raises `dataLoadStarted`** and covers the old candles with its loading overlay.
2. **The candles are fetched once, sized for the period.** The request reads from the candle store first, and asks the exchange only for what is missing.
3. **The chart redraws.** Studies recalculate on the new candles, the view lands on the period, and the chart raises `dataRenderComplete` with `type: "interval-change"`.
4. **Live updates continue** at the new interval.

:::caution
Only pass an interval the exchange supports. With an interval it doesn't support, such as `CandleInterval.FOUR_HOURS` on Coinbase, the chart has no candles to load and stays on its loading overlay. Check [`getSupportedIntervals()`](#which-intervals-are-available) first. The `IntervalSelector`'s default list includes intervals some exchanges don't have, so pass it the exchange's supported intervals.
:::

## Which Intervals an Exchange Supports: getSupportedIntervals {#which-intervals-are-available}

Each exchange supports its own intervals. Coinbase, for example, offers 1m, 5m, 15m, 1h, 6h and 1d candles. Every exchange lists its own with `getSupportedIntervals()`:

```ts
import { CoinbaseExchange, defaultExchangeProvider } from "scichart-scitrader";

// Look up a registered exchange by its name, and ask which intervals it supports
const intervals = defaultExchangeProvider.getExchange(CoinbaseExchange.name).getSupportedIntervals();
// e.g. [ONE_MINUTE, FIVE_MINUTES, FIFTEEN_MINUTES, ONE_HOUR, SIX_HOURS, ONE_DAY]
```

<details>
<summary>IRemoteExchange.getSupportedIntervals, with its TSDoc</summary>

```ts
/**
 * The set of {@link CandleInterval} values the adapter supports. Drives
 * the UI's interval picker — pickers filter their hardcoded option lists
 * to this set, hiding intervals the active provider can't serve.
 *
 * Implementations typically derive the list from the shared
 * `intervalMaps` registry via `getSupportedIntervalsFor(name)`.
 */
getSupportedIntervals(): CandleInterval[];
```

</details>

To let the user pick an interval, build your buttons from this list, as the [example below](#typescript-example-changing-the-interval) does, or use the ready-made [IntervalSelector](/financial-charts/ui-components/interval-and-period-selectors/#intervalselector) and pass it these intervals.

## Keeping the User's Span with carryPeriodToInterval {#keeping-the-users-span}

Without a period, `changeInterval` jumps to the new interval's default period. To keep roughly the span the user was looking at instead, pass the result of `carryPeriodToInterval`:

```ts
import { CandleInterval, carryPeriodToInterval } from "scichart-scitrader";

// The period the user is looking at now, e.g. "1M", or null for none
const current = chart.currentPeriod;

// The closest period that suits the new interval.
// "1M" at 1h candles stays "1M"; "1W" at 1m candles is cut to "1D"
const period = carryPeriodToInterval(current, CandleInterval.ONE_HOUR);

// Change the interval and land on that period, in one load
await chart.changeInterval(CandleInterval.ONE_HOUR, period);
```

`carryPeriodToInterval(period, interval)` returns:

- **The same period**, when it suits the new interval.
- **A shorter period**, when the period is longer than the interval allows, e.g. a week of 1m candles becomes a day.
- **A longer period**, when the period would show fewer than 20 candles, e.g. a day of 1w candles becomes six months.
- **`null`** for `null`, so a chart with no period keeps none.

<details>
<summary>The carryPeriodToInterval function, with its TSDoc</summary>

```ts
/**
 * The period to keep when the interval changes, so the view stays roughly the same span instead
 * of snapping to {@link defaultPeriodForInterval}. Pass the result to
 * `SciFinanceChart.changeInterval(interval, period)`.
 *
 * - `null` (no period, free pan/zoom) stays `null`.
 * - A period longer than {@link maxAllowedPeriodForInterval} for the new interval is cut to that
 *   maximum, e.g. `1W` at `1m` candles becomes `1D`.
 * - A period that would show fewer than {@link MIN_CARRIED_PERIOD_CANDLES} candles steps up to the
 *   shortest longer preset that shows enough, e.g. `1D` at `1w` candles becomes `6M`.
 * - Otherwise the period is kept.
 *
 * `ALL` is treated as longer than every other preset, and kept when the interval allows it.
 * `YTD` is kept unless it is too short (early in the year at coarse intervals).
 *
 * @param period - the period in effect before the change, or `null`.
 * @param interval - the interval being changed to.
 * @param nowMs - the time periods are measured back from. Defaults to `Date.now()`.
 */
function carryPeriodToInterval(period: TPeriod | null, interval: CandleInterval, nowMs?: number): TPeriod | null;
```

</details>

### TypeScript Example: Keeping the Span with carryPeriodToInterval

This chart starts on 1h candles over the last month. Click an interval with **Keep the span** ticked, and the chart keeps about a month on screen, using `carryPeriodToInterval`. Untick it, and each interval jumps to its default period instead. The toolbar shows the interval and period after each change.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/changingInterval_CarryPeriod/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/changingInterval_CarryPeriod/vanilla.ts
    ```
</CodeSnippetBlock>

## TypeScript Example: Changing the Interval

This example puts the topics on this page together, in plain TypeScript:

- **The interval buttons come from `getSupportedIntervals()`**, so they offer only intervals Coinbase can serve.
- **Each button calls `changeInterval(interval)`** with no period, so the chart lands on the interval's default period.
- **Each button's tooltip uses `defaultPeriodForInterval`** to say what the user will see.
- **`dataLoadStarted` and `dataRenderComplete`** disable the buttons while the candles load, and update the status line once they're drawn.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/changingInterval_IntervalButtons/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/changingInterval_IntervalButtons/vanilla.ts
    ```
</CodeSnippetBlock>

For an interval picker alongside symbol and period controls, in plain TypeScript and React, see the examples on [Symbols, Intervals and Periods](/financial-charts/symbols-intervals-periods/#typescript-example-changing-the-symbol-interval-and-period).

#### See also

- [Changing the symbol](/financial-charts/symbols-intervals-periods/changing-the-symbol/)
- [Periods](/financial-charts/symbols-intervals-periods/periods/)
- [Toolbar controls](/financial-charts/symbols-intervals-periods/toolbar-controls/)
