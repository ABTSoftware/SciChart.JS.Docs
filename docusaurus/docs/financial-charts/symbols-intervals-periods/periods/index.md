---
sidebar_position: 3
sidebar_label: Periods
title: "Periods: 1D, 1M, 1Y, YTD | SciTrader.js Financial Charts"
description: "Set how much time a SciTrader.js financial chart shows (1 day, 1 month, 1 year, year to date, all) with SciFinanceChart.setPeriod, and how periods drive data fetching and zoom limits."
keywords: ["SciTrader", "SciTrader.js", "chart period", "setPeriod", "TPeriod", "EPeriod", "period selector"]
---

# Periods

A **period** is how much time the chart shows: the last day, month, year, and so on. It is the "1D 5D 1M 3M 1Y" row you find above most trading charts.

## TypeScript Example: A Period Selector Above the Chart

This chart shows BTC-USD at 6-hour candles, with live Coinbase data. Above it is the SDK's `PeriodSelector`: pick a period and it calls `SciFinanceChart.setPeriod`. **Free** sets no period. `1D` is disabled because a day of 6-hour candles is only four candles; see [Periods That Suit an Interval](#periods-that-suit-an-interval).

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/periods_PeriodSelector/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/periods_PeriodSelector/vanilla.ts
    ```
</CodeSnippetBlock>

<details>
<summary>The PeriodSelector class and IPeriodSelectorOptions, with their TSDoc</summary>

```ts
/**
 * A row of period buttons ("Free", 1D, 5D, 1M … ALL), in plain DOM. Picking one selects it and
 * calls `onChange`; pass it on to the chart with `financeApi.setPeriod(period)`. Clicking the
 * selected period again clears it, like "Free".
 *
 * Give it the chart's interval (`currentInterval`) and it disables the periods that don't suit
 * it. Its look is `.st-toggle-group.st-period-selector` in `scitrader.css`.
 *
 * ```ts
 * const periods = PeriodSelector.create(toolbar, {
 *     value: "3M",
 *     currentInterval: CandleInterval.ONE_DAY,
 *     onChange: (period) => period && panel.financeApi.setPeriod(period),
 * });
 * // after an interval change:
 * periods.update({ currentInterval: interval });
 * ```
 *
 * React apps use the React `PeriodSelector`.
 */
class PeriodSelector {
    /** The control's element, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IPeriodSelectorOptions): PeriodSelector;
    /**
     * The control's HTML for these options, without behaviour: for rendering on a server. A
     * control created with the same options produces the same markup.
     */
    static toHTML(options: IPeriodSelectorOptions): string;
    /** The selected period, or `null` for none. */
    get value(): TPeriod | null;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<IPeriodSelectorOptions>): void;
    destroy(): void;
}

/** Options for {@link PeriodSelector}. */
interface IPeriodSelectorOptions {
    /** The selected period, or `null` for none (the "Free" button). */
    value: TPeriod | null;
    /** The periods to offer, in order, after "Free". Default `ALL_PERIODS`. */
    periods?: readonly TPeriod[];
    /**
     * The chart's interval. When set, periods that don't suit it are disabled, as
     * `validPeriodsForInterval` decides: at a 1d interval, for example, "1D" would show one candle.
     */
    currentInterval?: CandleInterval;
    /**
     * Called when the selection changes: with a period, or with `null` when the user picks "Free"
     * or clicks the selected period again.
     */
    onChange?: (period: TPeriod | null) => void;
    /**
     * Whether picking an option selects it straight away. Default `true`. With `false` the control
     * only calls `onChange`, and shows the new selection once you pass it back with
     * `update({ value })`; the React wrappers work this way, so the parent's state decides.
     */
    autoSelect?: boolean;
}
```

</details>

For a React version, and the `PeriodSelector` alongside an interval picker, see [Toolbar controls](/financial-charts/symbols-intervals-periods/toolbar-controls/).

## SciFinanceChart.setPeriod {#setperiod}

`setPeriod` is a method of [`SciFinanceChart`](/financial-charts/finance-chart-api/#the-scifinancechart-class), the chart you reach through `financeChartPanel.financeApi`. It changes how much time the chart shows, and fetches any older candles it needs to fill it.

```ts
setPeriod(period: TPeriod | null): Promise<void>;
```

`period` is one of the [period values](#period-values) below, such as `"3M"`, or `null` for no period.

```ts
import { EPeriod } from "scichart-scitrader";

const chart = financeChartPanel.financeApi; // SciFinanceChart

// Show the last three months. The promise resolves once the candles are loaded and drawn
await chart.setPeriod("3M");

// The same, by name: EPeriod.ThreeMonths is "3M"
await chart.setPeriod(EPeriod.ThreeMonths);

// Show everything since 1 January
await chart.setPeriod("YTD");

// No period: the view stays where it is, and the user can pan and zoom freely
await chart.setPeriod(null);
```

To start the chart on a period, set the [`period` option](/financial-charts/finance-chart-api/chart-config/#period) of the chart config instead.

<details>
<summary>SciFinanceChart.setPeriod, with its TSDoc</summary>

```ts
/**
 * Apply a preset period — single-shot fetch of exactly the right candle count.
 *
 * Replaces the old iterative `loadPreviousData` orchestration with a predictive
 * flow:
 *   1. Compute an `IFetchPlan` from `(currentInterval, period, now, bufferRatio)`.
 *   2. Disable `xAxis.autoRange` and set the *target* visible range up-front,
 *      using the index space we know the new fetch will produce.
 *   3. Configure the default feed to fetch exactly `plan.totalCandles` and
 *      reload via `feed.change(symbol, interval)`.
 *   4. By the time data arrives the visible range is already correct — no
 *      auto-fit override, no flash, no second range adjustment.
 *
 * `"ALL"` (and degenerate plans) fall back to `applyFitAllRange` — an
 * explicit `[0, n-1]` set, *not* SciChart's `zoomExtents`, since the chart
 * is configured `EAutoRange.Never` everywhere. Cancellation: a counter
 * token (`setPeriodToken`) discards stale results when the user picks a
 * different period mid-flight.
 *
 * **Data-feed cancellation note:** `IExchangeClient.getCandles` does not
 * accept an `AbortSignal` today, and `DataFeedManager` does not debounce
 * overlapping calls. A superseded `setPeriod`'s REST request still
 * completes and writes data; the cancellation token only prevents us from
 * applying the *visible-range* update on a stale call. Adding abort
 * support is a separate follow-up.
 */
setPeriod(period: TPeriod | null): Promise<void>;
```

</details>

## TPeriod and EPeriod: The Period Values {#period-values}

A period is a `TPeriod`: one of these strings, from shortest to longest.

`"1m"` `"1H"` `"1D"` `"5D"` `"1W"` `"1M"` `"3M"` `"6M"` `"YTD"` `"1Y"` `"10Y"` `"ALL"`

The letter says the unit: `m` is minutes, `H` hours, `D` days, `W` weeks, `M` months and `Y` years, so `"1m"` is one minute and `"1M"` is one month. `"YTD"` is year to date, since 1 January, and `"ALL"` is all the data the exchange has.

`EPeriod` has the same values by name, e.g. `EPeriod.OneMonth` is `"1M"`, so you don't have to remember the case. The two are interchangeable everywhere a period is taken.

<details>
<summary>The TPeriod type and EPeriod constants, with their TSDoc</summary>

```ts
/**
 * Named accessors for the preset periods. Use these in new code
 * (`EPeriod.OneMonth`) instead of magic strings. String values match
 * the URL / JSON serialization tokens so existing `?period=1Y` URLs
 * and persisted JSON blobs stay readable.
 *
 * Implemented as an `as const` object (not a TS `enum`) so values stay
 * structurally compatible with raw string literals — `"1M"` and
 * `EPeriod.OneMonth` are the same type and interchangeable.
 */
const EPeriod: {
    readonly OneMinute: "1m";
    readonly OneHour: "1H";
    readonly OneDay: "1D";
    readonly FiveDays: "5D";
    readonly OneWeek: "1W";
    readonly OneMonth: "1M";
    readonly ThreeMonths: "3M";
    readonly SixMonths: "6M";
    readonly YearToDate: "YTD";
    readonly OneYear: "1Y";
    readonly TenYears: "10Y";
    readonly All: "ALL";
};

/**
 * String-literal union of {@link EPeriod}'s values. Structurally
 * compatible with both `EPeriod.OneMonth` and raw string literals
 * like `"1M"` — both are accepted everywhere `TPeriod` is.
 */
type TPeriod = (typeof EPeriod)[keyof typeof EPeriod];
```

</details>

## How a Period Loads Data

When the period needs more candles than the chart has, `setPeriod` fetches them in one request, sized for the period. It reads the candle store first, and asks the exchange only for what is missing (see [What happens when the symbol changes](/financial-charts/symbols-intervals-periods/changing-the-symbol/#what-happens-when-the-symbol-changes)). It fetches enough candles to fill the period, plus two extras off the left edge of the view:

- **A pan-back buffer**, so a little panning doesn't need another fetch. Its size is `periodBufferRatio`, a fraction of the period's candles: the default `0.2` adds 20%.
- **A warm-up for the indicators**, so e.g. a 200-candle moving average is already valid at the left edge. Its size is the largest warm-up any attached study needs, times `warmupMultiplier`.

`setPeriod(null)` never fetches: it keeps the candles already loaded.

`periodBufferRatio` is declared in two places:

- **When you create the chart:** the [`periodBufferRatio` option](/financial-charts/finance-chart-api/chart-config/#periodbufferratio) of `ISciFinanceChartPanelConfig`.
- **Later:** the `SciFinanceChart.periodBufferRatio` property, e.g. `financeChartPanel.financeApi.periodBufferRatio = 0.5`. It applies from the next fetch.

```ts
const financeChartPanel = await SciFinanceChartPanel.create(element, {
    // ...exchangeName, symbol, interval, studies
    period: "1M",
    periodBufferRatio: 0.5, // fetch 50% more than the period, for more panning without a fetch
});
```

<details>
<summary>periodBufferRatio and warmupMultiplier, with their TSDoc</summary>

```ts
// ISciFinanceChartPanelConfig
/**
 * Extra candles to fetch beyond the period window, as a fraction of the
 * period's candle count (e.g. `0.2` = +20%). The buffer sits just off
 * the left edge of the visible window so a small pan-back doesn't trigger
 * a fresh fetch. Negative values clamp to 0. Default: `0.2`.
 */
periodBufferRatio?: number;

// SciFinanceChart
/**
 * Pan-back ratio applied to `periodCandles` when sizing the off-screen
 * buffer. See `IFetchPlan`. Configurable via
 * `ISciFinanceChartPredefinedStudiesOptions.periodBufferRatio`.
 */
periodBufferRatio: number;

/**
 * Multiplier on the largest attached study's `getRequiredWarmup()` value
 * when sizing the off-screen warmup buffer. `1` = exactly enough; `2` =
 * double for safety margin; `0` = no warmup contribution. Configurable
 * via `ISciFinanceChartPredefinedStudiesOptions.warmupMultiplier`.
 */
warmupMultiplier: number;
```

</details>

## Periods and Zoom: currentPeriod and lockPeriodWidth {#periods-and-zoom}

**`SciFinanceChart.currentPeriod`** is the period the chart is showing, or `null` for none. Read it from `financeChartPanel.financeApi`. It changes when you call `setPeriod`, `changeInterval` or `setSymbol` with a period. It doesn't change when the user pans or zooms, so a period stays set while the user moves around. To change it, call `setPeriod` rather than setting the property.

```ts
const chart = financeChartPanel.financeApi;

console.log(chart.currentPeriod); // e.g. "1M", or null when no period is set
```

**`lockPeriodWidth`** decides whether the period is also the widest the user can zoom out to. With `true`, the default, the user can zoom in and pan, but not zoom out past the period. Set it to `false` to treat the period as the starting view only. `YTD` and `ALL` don't lock the width, because their length varies.

It is declared in two places, like `periodBufferRatio`:

- **When you create the chart:** the [`lockPeriodWidth` option](/financial-charts/finance-chart-api/chart-config/#lockperiodwidth) of `ISciFinanceChartPanelConfig`.
- **Later:** the `SciFinanceChart.lockPeriodWidth` property. It applies from the next `setPeriod` call.

```ts
const financeChartPanel = await SciFinanceChartPanel.create(element, {
    // ...exchangeName, symbol, interval, studies
    period: "3M",
    lockPeriodWidth: false, // start on three months, then let the user zoom out freely
});

// Later: lock the period width again, from the next setPeriod call
financeChartPanel.financeApi.lockPeriodWidth = true;
await financeChartPanel.financeApi.setPeriod("3M");
```

<details>
<summary>currentPeriod and lockPeriodWidth, with their TSDoc</summary>

```ts
// SciFinanceChart
/**
 * The currently-selected preset period, set by the most recent successful
 * {@link setPeriod} call. `null` means no period is active — the chart shows
 * whatever the data feed's natural visible range is.
 */
currentPeriod: TPeriod | null;

/**
 * When `true` (default), {@link setPeriod} both sets the initial visible
 * range AND caps `xAxis.visibleRangeSizeLimit` so the user can't zoom
 * out past the period width. When `false`, only the initial visible
 * range is set — pan/zoom stays unrestricted afterwards.
 *
 * Configurable via
 * `ISciFinanceChartPredefinedStudiesOptions.lockPeriodWidth`.
 */
lockPeriodWidth: boolean;

// ISciFinanceChartPanelConfig
/**
 * Whether {@link period} also imposes a hard zoom-out cap. Default `true`
 * — `setPeriod` clamps `xAxis.visibleRangeSizeLimit` so users can't zoom
 * wider than the period. Set `false` to treat `period` as an
 * initial-view hint only — pan/zoom stays unrestricted afterwards.
 */
lockPeriodWidth?: boolean;
```

</details>

## Periods That Suit an Interval: validPeriodsForInterval {#periods-that-suit-an-interval}

Not every period suits every interval. A day of daily candles is a single candle, which isn't a chart. `validPeriodsForInterval(interval)` lists the periods that show at least about five candles at an interval. Import it from `scichart-scitrader`:

```ts
import { CandleInterval, isCompatible, minPeriodForInterval, validPeriodsForInterval } from "scichart-scitrader";

// The periods that suit 6-hour candles, shortest first
validPeriodsForInterval(CandleInterval.SIX_HOURS);
// ["5D", "1W", "1M", "3M", "6M", "YTD", "1Y", "10Y", "ALL"]

// Check one combination
isCompatible(CandleInterval.ONE_DAY, "1D"); // false: a day of daily candles is one candle
isCompatible(CandleInterval.ONE_DAY, "1M"); // true

// The shortest period that suits an interval
minPeriodForInterval(CandleInterval.FIFTEEN_MINUTES); // "1D"
```

The results for the intervals Coinbase supports:

| Interval | `validPeriodsForInterval(interval)` |
| --- | --- |
| `ONE_MINUTE`, `FIVE_MINUTES` | `1H` and longer |
| `FIFTEEN_MINUTES`, `ONE_HOUR` | `1D` and longer |
| `SIX_HOURS`, `ONE_DAY` | `5D` and longer |

`YTD` is always allowed, whatever the interval. There is no upper limit here: `validPeriodsForInterval` allows ten years of one-minute candles, which would be millions of candles. To keep a period to a sensible size, use [carryPeriodToInterval](/financial-charts/symbols-intervals-periods/changing-the-interval/#keeping-the-users-span) when the interval changes, which cuts a period to `maxAllowedPeriodForInterval(interval)`, or offer only the periods you want with the `PeriodSelector`'s `periods` option, as the [example above](#typescript-example-a-period-selector-above-the-chart) does.

The [PeriodSelector](/financial-charts/symbols-intervals-periods/toolbar-controls/) uses `validPeriodsForInterval` to disable the periods that don't suit its `currentInterval`.

<details>
<summary>validPeriodsForInterval, isCompatible, minPeriodForInterval and maxAllowedPeriodForInterval, with their TSDoc</summary>

```ts
/**
 * The list of preset periods that are valid to combine with `interval`, in
 * display order. A period `p` is valid when it's at least as long as
 * `INTERVAL_MIN_PERIOD[interval]` — or when it's `YTD` (always allowed).
 */
function validPeriodsForInterval(interval: CandleInterval): readonly TPeriod[];

/**
 * `true` iff `(interval, period)` is a valid combination — convenience around
 * {@link validPeriodsForInterval}. Cross-disable is one-way: only the period
 * selector greys out invalid options, the interval selector always allows
 * every value, so there's no `validIntervalsForPeriod` companion query.
 */
function isCompatible(interval: CandleInterval, period: TPeriod): boolean;

/**
 * The shortest preset period that pairs sensibly with `interval` per the
 * min-period rule — i.e. `INTERVAL_MIN_PERIOD[interval]`.
 *
 * Useful when an interval change leaves the chart's visible range too narrow
 * for any preset and the caller wants to auto-snap to the smallest valid
 * window. Always returns a real period — every interval has at least one
 * compatible non-`"ALL"` entry in the table.
 */
function minPeriodForInterval(interval: CandleInterval): TPeriod;

/**
 * Largest preset period the URL parser will accept for `interval` —
 * looked up from the static {@link MAX_PERIOD_FOR_INTERVAL} table.
 */
function maxAllowedPeriodForInterval(interval: CandleInterval): TPeriod;
```

</details>

#### See also

- [Changing the interval](/financial-charts/symbols-intervals-periods/changing-the-interval/)
- [Toolbar controls](/financial-charts/symbols-intervals-periods/toolbar-controls/)
