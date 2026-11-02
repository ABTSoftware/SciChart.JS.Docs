---
sidebar_position: 3
sidebar_label: Periods
title: "Periods: 1D, 1M, 1Y, YTD | SciTrader.js Financial Charts"
description: "Set how much time a SciTrader.js financial chart shows (1 day, 1 month, 1 year, year to date, all) with SciFinanceChart.setPeriod, and how periods drive data fetching and zoom limits."
keywords: ["SciTrader", "SciTrader.js", "chart period", "setPeriod", "TPeriod", "EPeriod", "period selector"]
---

# Periods

A **period** is how much time the chart shows: the last hour, day, month, year, and so on. It is the "1D 5D 1M 3M 1Y" row you find above most trading charts.

<CenteredImageWrapper src={require("../../_examples/gettingStarted_SymbolInterval/period-toolbar.png").default} title="The period toolbar: PeriodSelector above a SciTrader.js chart" />

## setPeriod

```ts
SciFinanceChart.setPeriod(period: TPeriod | null): Promise<void>
SciFinanceChart.currentPeriod: TPeriod | null
```

```ts
const chart = financeChartPanel.financeApi; // SciFinanceChart

await chart.setPeriod("3M"); // the last three months
await chart.setPeriod(null); // no period: leave the view where it is
```

You can also set the first period when you create the chart, with the `period` option of `SciFinanceChartPanel.create` or `<SciFinanceChartView config>`.

## Period values

`TPeriod` is one of these strings. They are also available by name on `EPeriod`, e.g. `EPeriod.ThreeMonths`; the two are interchangeable.

| Value | `EPeriod` | Span |
|---|---|---|
| `"1m"` | `OneMinute` | 1 minute |
| `"1H"` | `OneHour` | 1 hour |
| `"1D"` | `OneDay` | 1 day |
| `"5D"` | `FiveDays` | 5 days |
| `"1W"` | `OneWeek` | 1 week |
| `"1M"` | `OneMonth` | 1 month |
| `"3M"` | `ThreeMonths` | 3 months |
| `"6M"` | `SixMonths` | 6 months |
| `"YTD"` | `YearToDate` | Year to date |
| `"1Y"` | `OneYear` | 1 year |
| `"10Y"` | `TenYears` | 10 years |
| `"ALL"` | `All` | All data |

## How a period loads data

When the period needs more candles than the chart has, `setPeriod` fetches them, from the candle store first and then the exchange (see [what happens when the symbol changes](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/changing-the-symbol/#what-happens-when-the-symbol-changes)). It fetches enough candles to fill the period, plus two extras:

- a buffer, `periodBufferRatio` (default 20%), so a little panning doesn't need another fetch;
- whatever warm-up the attached indicators need, so a 200-period moving average is already valid at the left edge.

`setPeriod(null)` never fetches: it keeps the candles already loaded.

## Periods and zoom

A period stays set while the user pans: `currentPeriod` keeps reporting it until `setPeriod` is called again.

With `lockPeriodWidth: true` (the default), the period is also the widest the user can zoom out to. Set `lockPeriodWidth: false` in the chart config to treat the period as the starting view only.

## Periods that suit an interval

Not every period suits every interval: a year of one-minute candles is far too many to fetch, and a day of daily candles is a single candle.

```ts
validPeriodsForInterval(interval: CandleInterval): readonly TPeriod[]
```

lists the sensible ones. The [PeriodSelector](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/toolbar-controls/) control uses it to grey out the others. When the interval changes, [carryPeriodToInterval](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/changing-the-interval/#keeping-the-users-span) moves a period to one that suits the new interval.

#### See also

- [Changing the interval](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/changing-the-interval/)
- [Toolbar controls](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/toolbar-controls/)
