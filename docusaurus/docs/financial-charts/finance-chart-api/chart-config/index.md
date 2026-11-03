---
sidebar_position: 2
sidebar_label: Chart Config object
title: "Chart Configuration: ISciFinanceChartPanelConfig | SciTrader.js Financial Charts"
description: "Every option of ISciFinanceChartPanelConfig, the config passed to SciFinanceChartPanel.create and SciFinanceChartView in SciTrader.js: data, studies, periods, layout, pane controls, loading, theme and axes."
keywords: ["SciTrader", "SciTrader.js", "ISciFinanceChartPanelConfig", "SciFinanceChartPanel config", "SciFinanceChartView config", "trading chart options", "candlestick chart configuration"]
---

# Chart Configuration

**`ISciFinanceChartPanelConfig`** describes the chart you want: what data to show, which studies to draw, and how the panes are laid out. You pass it once, when the chart is created:

```ts
// Plain TypeScript
SciFinanceChartPanel.create(container: HTMLElement, config: ISciFinanceChartPanelConfig)
    : Promise<ISciFinanceChartPanelApi<HTMLElement>>
```

```tsx
// React
<SciFinanceChartView config={config} />
```

Only four options are required: `exchangeName`, `symbol`, `interval` and `studies`. Everything else has a default.

```ts
import {
    BinanceExchange,
    CandleInterval,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy
} from "scichart-scitrader";

const config: ISciFinanceChartPanelConfig = {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    studies: [new OHLCStudy(), new VolumeStudy()],
};
```

**The config is read once.** Changing it afterwards does nothing, including passing a new `config` prop to `<SciFinanceChartView>`. To change a live chart, use the [Finance Chart API](/financial-charts/finance-chart-api/). The section for each option below names the call that changes it later.

## The ISciFinanceChartPanelConfig Interface

| Option | Type | Default |
| --- | --- | --- |
| [`exchangeName`](#exchangename-symbol-interval) | `string` | Required |
| [`symbol`](#exchangename-symbol-interval) | `string` | Required |
| [`interval`](#exchangename-symbol-interval) | `CandleInterval` | Required |
| [`services`](#services) | `ISciFinanceChartServices` | Created for you |
| [`studies`](#studies) | `IStudy[]` | Required |
| [`maxPanes`](#maxpanes) | `number` | `6` |
| [`period`](#period) | `TPeriod` | None: the feed's natural range |
| [`periodBufferRatio`](#periodbufferratio) | `number` | `0.2` |
| [`lockPeriodWidth`](#lockperiodwidth) | `boolean` | `true` |
| [`liveTipMode`](#livetipmode) | `"follow" \| "anchored"` | `"follow"` |
| [`forwardHeadroomSec`](#forwardheadroomsec) | `number \| null` | `null` |
| [`useSubCharts`](#usesubcharts) | `boolean` | `true` |
| [`direction`](#direction) | `LayoutDirection` | `"column"` |
| [`paneSizing`](#panesizing) | `Record<string, IPaneSizeConfig>` | Each study's own size |
| [`paneControls`](#panecontrols) | `IPaneControlOptions` | Bar shown, mouse layout |
| [`loading`](#loading) | `IPaneLoadingOptions` | Skeleton and overlay |
| [`theme`](#theme) | `ISciTraderTheme` | `SCITRADER_DARK_THEME` |
| [`axisDefaults`](#axisdefaults) | `IChartAxisDefaults` | None |
| [`surfaceConfig`](#surfaceconfig) | `TSurfaceConfigurationFunction` | None |

<details>
<summary>The ISciFinanceChartPanelConfig interface, with its TSDoc</summary>

```ts
/**
 * Configuration for creating a {@link SciFinanceChartPanel} or {@link SciFinanceChartView}.
 *
 * Defines the data feed, initial studies, and layout options. Passed to the
 * static `create` factory or as React props.
 */
interface ISciFinanceChartPanelConfig {
    /** Exchange name for the data feed (e.g. "Binance"). */
    exchangeName: string;
    /** Trading symbol (e.g. "BTCUSDT"). */
    symbol: string;
    /** Candle interval (e.g. ONE_DAY). */
    interval: CandleInterval;
    /**
     * Initial preset period (e.g. `"3M"`). When set, the chart applies
     * `setPeriod(period)` after initial data load to zoom the visible range
     * and load any missing historical candles. When omitted, the chart shows
     * whatever the data feed's natural visible range is.
     */
    period?: TPeriod;
    /**
     * Extra candles to fetch beyond the period window, as a fraction of the
     * period's candle count (e.g. `0.2` = +20%). The buffer sits just off
     * the left edge of the visible window so a small pan-back doesn't trigger
     * a fresh fetch. Negative values clamp to 0. Default: `0.2`.
     */
    periodBufferRatio?: number;
    /**
     * Live-tip behaviour while a period is active:
     *   - `"follow"` — visible range slides right with each new candle.
     *   - `"anchored"` — visible range stays pinned where the period
     *     was applied; new candles appear off-screen.
     * Default: `"follow"` (matches TradingView).
     */
    liveTipMode?: "follow" | "anchored";
    /**
     * Whether {@link period} also imposes a hard zoom-out cap. Default `true`
     * — `setPeriod` clamps `xAxis.visibleRangeSizeLimit` so users can't zoom
     * wider than the period. Set `false` to treat `period` as an
     * initial-view hint only — pan/zoom stays unrestricted afterwards.
     */
    lockPeriodWidth?: boolean;
    /**
     * Forward pan/zoom headroom past the latest candle, in seconds, or
     * `null` (default) for no forward limit. Forwarded to
     * {@link ISciFinanceChartPredefinedStudiesOptions.forwardHeadroomSec}.
     */
    forwardHeadroomSec?: number | null;
    /** Initial studies to attach (OHLC, Volume, RSI, MACD, etc.). */
    studies: IStudy[];
    /** Use sub-chart mode (shared parent surface). Default: `true` ({@link DEFAULT_USE_SUB_CHARTS}). */
    useSubCharts?: boolean;
    /** Layout direction. Default: `"column"`. */
    direction?: LayoutDirection;
    /** Optional pre-configured services (data manager, data feed manager). When provided, bypasses default creation. */
    services?: ISciFinanceChartServices;
    /** Optional surface configuration applied to the default pane and study panes that don't specify their own (e.g. navy theme + transparent background). */
    surfaceConfig?: TSurfaceConfigurationFunction;
    /**
     * Default options applied to every X and Y axis the finance chart creates,
     * including the X axes in `addXAxis` and every study's Y axis. Each axis
     * spreads these first, then its study-specific options — so studies can
     * still override per-axis. See {@link IChartAxisDefaults}.
     */
    axisDefaults?: IChartAxisDefaults;
    /**
     * Colours for the whole chart: surfaces, axes, legend, crosshair and every study's
     * defaults. Default `SCITRADER_DARK_THEME`. Switch later with `financeApi.setTheme(theme)`.
     */
    theme?: ISciTraderTheme;
    /**
     * Per-pane size hints keyed by paneId. Overrides each pane's primary
     * study's `paneSizeConfig` default. Use to tune the layout from the
     * host without modifying study classes.
     *
     * Resolution: `paneSizing[paneId]` > primary study's `paneSizeConfig` >
     * layout renderer's default (`grow: 1`).
     *
     * @example
     * paneSizing: {
     *   [PaneId.DEFAULT.value]: { grow: 4 }, // bigger price pane
     *   "RSIPane": { size: 100 },             // fixed-height RSI
     * }
     */
    paneSizing?: Record<string, IPaneSizeConfig>;
    /**
     * Maximum total chart panes (price pane + indicator panes). Studies that
     * would create a new pane (oscillators) are refused once the chart is at
     * this limit — the chart raises `paneLimitReached` so the host can toast.
     * Overlay studies (EMA/WMA/VWAP/PSAR/Volume) share an existing pane and are
     * never affected. Default 6.
     */
    maxPanes?: number;
    /**
     * Each pane's control bar and the dividers between panes: whether the bar shows, which
     * buttons it has, and the touch layout for phones and tablets. The finance chart leaves out
     * the axis-sync and V-/H-group toggles unless `buttons` turns them on. Change later with
     * {@link ISciFinanceChartPanelApi.setPaneControls}.
     */
    paneControls?: IPaneControlOptions;
    /**
     * What each pane shows while it loads: a skeleton until its chart is ready (or your own
     * placeholder), and a shimmer overlay while a symbol or interval switch loads.
     */
    loading?: IPaneLoadingOptions;
}
```

</details>

## ISciFinanceChartPanelConfig Data Source Options

### ISciFinanceChartPanelConfig.exchangeName, .symbol, .interval {#exchangename-symbol-interval}

```ts
/** Exchange name for the data feed (e.g. "Binance"). */
exchangeName: string;
/** Trading symbol (e.g. "BTCUSDT"). */
symbol: string;
/** Candle interval (e.g. ONE_DAY). */
interval: CandleInterval;
```

What to chart. `exchangeName` is the name an exchange was registered under, e.g. `"Binance"` for `BinanceExchange`. Register it before you create the chart, or the chart has nowhere to load candles from. See [Register a data source](/financial-charts/getting-started/#register-a-data-source).

`symbol` is in the exchange's own format (`"BTCUSDT"` on Binance, `"BTC-USD"` on Coinbase). `interval` is the candle size, e.g. `CandleInterval.FOUR_HOURS`.

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

**Later:** [`financeApi.setSymbol`](/financial-charts/symbols-intervals-periods/changing-the-symbol/) and [`financeApi.changeInterval`](/financial-charts/symbols-intervals-periods/changing-the-interval/).

### ISciFinanceChartPanelConfig.services {#services}

```ts
/** Optional pre-configured services (data manager, data feed manager). When provided, bypasses default creation. */
services?: ISciFinanceChartServices;
```

The services the chart loads data through. Leave this out and the chart creates its own, using the globally registered exchanges. Most apps never set it.

Set it for two reasons:

- **To keep an exchange private to one chart**, rather than registering it globally. See [Keeping an exchange private to a chart](/financial-charts/data-sources/#keeping-an-exchange-private-to-a-chart).
- **To follow loading progress from the start.** Each pane reports `"surface"`, then `"configured"`, then `"data"` as it loads. Those events fire before `create` resolves, so subscribe to your own `PaneProgressEmitter` and pass it in as `progress`. Otherwise the chart creates one, which you can reach afterwards as `financeApi.progress`. See [Loading states](/financial-charts/layout/#loading-states).

<details>
<summary>The ISciFinanceChartServices interface, with its TSDoc</summary>

```ts
/** Services shared across all panes in a SciFinanceChart. */
interface ISciFinanceChartServices {
    dataManager?: IDataManager;
    dataFeedManager?: IDataFeedManager;
    /**
     * Per-pane init-phase emitter (`"surface"` → `"configured"` → `"data"`).
     * Pass an emitter when callers need to subscribe *during* init — events on
     * the returned `SciFinanceChart` only become subscribable after
     * `createWithStudies` resolves, by which point all init-time phase advances
     * have already fired. When omitted, the chart default-creates one,
     * accessible via {@link SciFinanceChart.progress}.
     */
    progress?: PaneProgressEmitter;
}
```

</details>

## ISciFinanceChartPanelConfig Studies and Indicators Options

### ISciFinanceChartPanelConfig.studies {#studies}

```ts
/** Initial studies to attach (OHLC, Volume, RSI, MACD, etc.). */
studies: IStudy[];
```

What to draw, in order. Include `OHLCStudy` for the price candles. Overlays such as moving averages and volume share the price pane; oscillators such as RSI and MACD each get a pane of their own.

Each study object belongs to one chart. Create new ones for every chart, and in React create them inside `useMemo`, so a re-render doesn't hand the chart new objects.

**Later:** `financeApi.attachStudy(study)` and `financeApi.detachStudy(study)`. See [Studies and indicators](/financial-charts/studies-and-indicators/).

<details>
<summary>The IStudy interface, with its TSDoc</summary>

```ts
interface IStudy {
    readonly type: EStudyType;
    readonly chartPaneId: PaneId;
    readonly id: string;
    readonly studyId: StudyId;
    readonly parentSurface: SciChartSurface;
    readonly yAxes: ObservableArray<AxisBase2D>;
    /**
     * Sizing hint for this study's pane when this study is the primary occupant.
     * Caller's `ISciFinanceChartPanelConfig.paneSizing[paneId]` overrides this.
     * If neither is set, the pane uses the layout renderer's default (`grow: 1`).
     *
     * Use `{ grow: N }` for a flex weight relative to other grow-based panes,
     * or `{ size: Npx }` for a fixed pixel height/width along the layout axis.
     */
    readonly paneSizeConfig?: IPaneSizeConfig;
    /**
     * A feed this study cannot work without, created on its behalf before it attaches.
     *
     * Studies normally read a source the default OHLCV feed already publishes, so they need no
     * such declaration. The order-book heatmap is the first that does not: its data arrives on a
     * separate feed that nothing else on the chart would ever ask for, and `onAttach` resolves
     * its input synchronously — so unless the feed exists by then, the study binds to the candle
     * close instead and silently draws nothing.
     *
     * Best-effort. A feed that cannot be built (no book source for this venue) is not an error:
     * the study still attaches and draws nothing, which is the documented empty path.
     */
    readonly requiredFeedType?: EDataFeedType;
    /**
     * Optional — the chart has switched symbol or exchange, and the {@link requiredFeedType}
     * feed now follows the new instrument. For studies that fetch from that feed on viewport
     * changes rather than through their inputs: without it they keep drawing the old instrument
     * until the next pan.
     */
    onInstrumentChanged?(): void;
    readonly inputIds: DataSourceId[];
    readonly outputIds: DataSourceId[];
    /**
     * A line for the legend when the study has something to say that is not a value — "not
     * recorded for this instrument", "1m tier". Shown for studies with no outputs, which would
     * otherwise have no legend row at all. The legend re-reads it on every redraw.
     */
    readonly legendStatus?: string;
    /**
     * Optional — a legend line for what is under the mouse, for studies whose reading depends on
     * the cursor's price as well as its candle (the order-book heatmap). Called only while the
     * mouse is over this study's own pane; `undefined` falls back to {@link legendStatus}.
     *
     * @param at the cursor in DEVICE pixels within the pane's series area — the space the pane's
     *   coordinate calculators take — so a study reads it through its own axes.
     */
    getLegendReadout?(at: {
        x: number;
        y: number;
    }): string | undefined;
    readonly renderableSeries: ObservableArray<IRenderableSeries>;
    readonly options: IStudyOptions;
    /** Fires whenever the study's input data updates — fired after `onDataChanged` processes the update. */
    readonly dataChanged: EventHandler<TDataUpdate<any>>;
    /**
     * Fires after {@link applyDescriptor} has mutated the live study (whether
     * invoked by the form's debounced apply, the per-study "Reset to defaults"
     * button, or the batch "Reset all study styles" helper). The form
     * subscribes so it can re-sync its local draft state when an external
     * applyDescriptor lands — without this, the form keeps showing stale
     * values while the chart already reflects the new descriptor.
     */
    readonly descriptorApplied: EventHandler<TStudyDescriptor>;
    onAttach(parentFinanceChart: SciFinanceChart, parentChartPane: ChartPane, wasmContext: TSciChart, dataManager: IDataManager): void;
    onDetach(): void;
    /**
     * Optional — supply the X axis for this study's pane. When a study returns an
     * axis here, {@link SciFinanceChart} uses it instead of the default time-based
     * `DiscontinuousDateAxis`, marks the pane **non-time-domain** (excluded from
     * axis-sync and from the shared time-label routing in `applyXAxisLabels`), and
     * skips the base-values / live-tip machinery for that pane.
     *
     * Used by studies whose data is not indexed in the time domain — e.g. Renko
     * (evenly-spaced bricks) and Point & Figure (columns) both return a
     * `CategoryAxis` so points are positioned by index, not by timestamp.
     *
     * Return `undefined` (the default — omit the method) to keep the standard
     * time axis. Studies that share their pane's existing axis need not implement it.
     *
     * `axisDefaults` is passed in because this runs during pane configuration —
     * BEFORE `onAttach`, so `parentFinanceChart` is not yet set. Spread it onto the
     * axis to inherit the chart's theme (label style, strip background, etc.).
     */
    createXAxis?(wasmContext: TSciChart, axisDefaults: IChartAxisDefaults): AxisBase2D | undefined;
    getDescriptor(): TStudyDescriptor;
    /**
     * Returns the descriptor a freshly-constructed instance of this study
     * type would expose — i.e. constructor defaults, no user customisation.
     * Powers the per-study "Reset to defaults" form button and the batch
     * "Reset all study styles" header / More-tab actions. Does NOT mutate
     * this instance — callers are expected to feed the returned descriptor
     * into {@link applyDescriptor} (or hand it to the form draft, which
     * will fire its debounced apply for them).
     */
    getDefaultDescriptor(): TStudyDescriptor;
    addDescriptor(section: EDescriptorSectionName, descriptor: IuiDescriptor): void;
    setDescriptor(descriptor: TStudyDescriptor): void;
    /**
     * Apply edits from an in-form descriptor onto this live study instance.
     * Concrete studies that override {@link IStudy.supportsLiveApply} to
     * return `true` mutate their renderable series / data series in place
     * (instant for style edits, recompute for input edits) — no detach,
     * no re-attach, no flash.
     *
     * Studies that haven't implemented live apply leave
     * {@link supportsLiveApply} as `false` (the default); callers detect that
     * and fall back to the legacy `detachStudy + getStudy(new) + attachStudy`
     * pipeline.
     */
    applyDescriptor(descriptor: TStudyDescriptor): void;
    /**
     * Whether {@link applyDescriptor} performs a real in-place update. When
     * `false`, the caller (e.g. the SDK's `StudyList`) falls back
     * to detach + re-instantiate. Default `false` on {@link StudyBase}; each
     * study opts in by overriding to return `true`.
     */
    readonly supportsLiveApply: boolean;
    /**
     * Number of input candles the study needs to consume before producing its
     * first valid output. Used by `SciFinanceChart` to size the fetch buffer
     * so every candle in the visible range has every indicator's output.
     *
     * Raw-display studies (OHLC, Volume) return 0. Computed indicators
     * (RSI, SMA, MACD, Bollinger Bands) return their period — possibly the
     * sum of cascaded periods (MACD = slow + signal).
     *
     * Default impl in `StudyBase` returns 0.
     */
    getRequiredWarmup(): number;
    /**
     * Colour to paint this output's VALUE with in the legend, so a reader can tell
     * which row belongs to which line. Only the number is coloured — the label stays
     * in the legend's muted text colour, otherwise the row is all one colour and the
     * label competes with the value it is labelling.
     *
     * Implementations read the LIVE renderable series rather than the study's stored
     * `renderOptions`, so a colour drag in the study form shows up in the legend on the
     * next cursor move with no extra plumbing. Where SciChart auto-picked the colour,
     * the stored options never held it in the first place.
     *
     * `xIndex` is the candle under the cursor (`undefined` = the latest), for outputs
     * whose colour is a function of the data rather than a fixed stroke: OHLC and Volume
     * are red or green per candle, and the MACD histogram flips about zero.
     *
     * Return `undefined` to leave the value in the legend's default colour — correct
     * for an output with no single colour of its own.
     */
    getLegendColor(outputId: DataSourceId, xIndex?: number): string | undefined;
    /**
     * Move the study's theme-following colours from one theme to another. Optional so a
     * hand-written `IStudy` still type-checks; `StudyBase` implements it for every built-in study.
     */
    applyThemeChange?(from: ISciTraderTheme, to: ISciTraderTheme): void;
}
```

</details>

### ISciFinanceChartPanelConfig.maxPanes {#maxpanes}

```ts
/**
 * Maximum total chart panes (price pane + indicator panes). Studies that
 * would create a new pane (oscillators) are refused once the chart is at
 * this limit — the chart raises `paneLimitReached` so the host can toast.
 * Overlay studies (EMA/WMA/VWAP/PSAR/Volume) share an existing pane and are
 * never affected. Default 6.
 */
maxPanes?: number;
```

The most panes the chart may have, counting the price pane. Once it is reached, studies that need a pane of their own are refused, and `financeApi.paneLimitReached` is raised so you can tell the user. Overlays such as EMA, VWAP and Volume share an existing pane and are never refused.

**Later:** set `financeApi.maxPanes`.

## ISciFinanceChartPanelConfig Period and Zoom Options

### ISciFinanceChartPanelConfig.period {#period}

```ts
/**
 * Initial preset period (e.g. `"3M"`). When set, the chart applies
 * `setPeriod(period)` after initial data load to zoom the visible range
 * and load any missing historical candles. When omitted, the chart shows
 * whatever the data feed's natural visible range is.
 */
period?: TPeriod;
```

How much time to show at first, e.g. `"3M"` for three months. Once the first candles are loaded, the chart zooms to the period and fetches any older candles it needs. Leave it out to show the data feed's natural range.

**Later:** [`financeApi.setPeriod`](/financial-charts/symbols-intervals-periods/periods/).

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
declare const EPeriod: {
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

### ISciFinanceChartPanelConfig.periodBufferRatio {#periodbufferratio}

```ts
/**
 * Extra candles to fetch beyond the period window, as a fraction of the
 * period's candle count (e.g. `0.2` = +20%). The buffer sits just off
 * the left edge of the visible window so a small pan-back doesn't trigger
 * a fresh fetch. Negative values clamp to 0. Default: `0.2`.
 */
periodBufferRatio?: number;
```

Extra candles to fetch beyond the period, as a fraction of it: `0.2` fetches 20% more. They sit just off the left edge, so a small pan back doesn't need another fetch. Negative values count as `0`.

### ISciFinanceChartPanelConfig.lockPeriodWidth {#lockperiodwidth}

```ts
/**
 * Whether {@link period} also imposes a hard zoom-out cap. Default `true`
 * — `setPeriod` clamps `xAxis.visibleRangeSizeLimit` so users can't zoom
 * wider than the period. Set `false` to treat `period` as an
 * initial-view hint only — pan/zoom stays unrestricted afterwards.
 */
lockPeriodWidth?: boolean;
```

Whether the period is also the widest the user can zoom out to. Set `false` to treat the period as the starting view only, with zoom unrestricted afterwards.

### ISciFinanceChartPanelConfig.liveTipMode {#livetipmode}

```ts
/**
 * Live-tip behaviour while a period is active:
 *   - `"follow"` — visible range slides right with each new candle.
 *   - `"anchored"` — visible range stays pinned where the period
 *     was applied; new candles appear off-screen.
 * Default: `"follow"` (matches TradingView).
 */
liveTipMode?: "follow" | "anchored";
```

What the view does as new candles arrive, while a period is set:

- `"follow"`: the view slides right with each new candle, so the latest one stays in view.
- `"anchored"`: the view stays where it is, and new candles appear off-screen to the right.

**Later:** set `financeApi.liveTipMode`, or use the `LiveTipToggle` control ([Live Tip Toggle](/financial-charts/ui-components/live-tip-toggle/)).

### ISciFinanceChartPanelConfig.forwardHeadroomSec {#forwardheadroomsec}

```ts
/**
 * Forward pan/zoom headroom past the latest candle, in seconds, or
 * `null` (default) for no forward limit. Forwarded to
 * {@link ISciFinanceChartPredefinedStudiesOptions.forwardHeadroomSec}.
 */
forwardHeadroomSec?: number | null;
```

How far, in seconds, the user can pan or zoom past the latest candle. `null` sets no limit.

## ISciFinanceChartPanelConfig Pane Layout Options

### ISciFinanceChartPanelConfig.useSubCharts {#usesubcharts}

```ts
/** Use sub-chart mode (shared parent surface). Default: `true` ({@link DEFAULT_USE_SUB_CHARTS}). */
useSubCharts?: boolean;
```

Whether all panes are drawn on one shared SciChart surface (`true`, sub-chart mode) or each pane has its own surface (`false`). One surface uses less memory and fewer WebGL contexts. See [Multi-chart and sub-chart modes](/financial-charts/layout/#multi-chart-and-sub-chart-modes).

### ISciFinanceChartPanelConfig.direction {#direction}

```ts
/** Layout direction. Default: `"column"`. */
direction?: LayoutDirection;
```

Stack panes vertically (`"column"`), or side by side (`"row"`).

**Later:** `financeChartPanel.paneGroupApi.setDirection(direction)`.

### ISciFinanceChartPanelConfig.paneSizing {#panesizing}

```ts
/**
 * Per-pane size hints keyed by paneId. Overrides each pane's primary
 * study's `paneSizeConfig` default. Use to tune the layout from the
 * host without modifying study classes.
 *
 * Resolution: `paneSizing[paneId]` > primary study's `paneSizeConfig` >
 * layout renderer's default (`grow: 1`).
 *
 * @example
 * paneSizing: {
 *   [PaneId.DEFAULT.value]: { grow: 4 }, // bigger price pane
 *   "RSIPane": { size: 100 },             // fixed-height RSI
 * }
 */
paneSizing?: Record<string, IPaneSizeConfig>;
```

Size hints for each pane, keyed by pane id. A hint here wins over the pane's study's own default. Set either `grow`, the pane's share of the free space relative to the other panes (default `1`), or `size`, a fixed size in pixels.

```ts
import { PaneId } from "scichart-scitrader";

paneSizing: {
    [PaneId.DEFAULT.value]: { grow: 4 }, // a bigger price pane
    RSIPane: { size: 100 },              // a fixed-height RSI pane
}
```

<details>
<summary>The IPaneSizeConfig interface, with its TSDoc</summary>

```ts
/**
 * Sizing hint for a pane. Mutually exclusive: set `grow` OR `size`, not both.
 *
 * - `grow` — flex-grow weight relative to other grow-based panes (default: 1).
 * - `size` — fixed pixel size along the layout axis. The pane won't flex-grow.
 *
 * When a divider is dragged, any `size` is converted to a `grow` weight.
 */
interface IPaneSizeConfig {
    /** Flex-grow weight relative to other grow-based panes. Default: 1. */
    grow?: number;
    /** Fixed pixel size along the layout axis. Pane won't flex-grow. */
    size?: number;
}
```

</details>

### ISciFinanceChartPanelConfig.paneControls {#panecontrols}

```ts
/**
 * Each pane's control bar and the dividers between panes: whether the bar shows, which
 * buttons it has, and the touch layout for phones and tablets. The finance chart leaves out
 * the axis-sync and V-/H-group toggles unless `buttons` turns them on. Change later with
 * {@link ISciFinanceChartPanelApi.setPaneControls}.
 */
paneControls?: IPaneControlOptions;
```

Each pane's control bar, and the dividers between panes.

- **`touch`**: the control bar moves into a drawer at each pane's right edge, opened by a tap or swipe, rather than appearing on hover. The dividers get a wider hit area. You decide when to turn it on, e.g. from the viewport size.
- **`buttons`**: `move`, `maximize`, `hide`, `close`, `lockSize` and `yAxisAutoRange` are shown by default. `axisSync`, `verticalGroup` and `horizontalGroup` are hidden on a finance chart, because it keeps every pane's X axis in step already; set them to `true` to show them.

**Later:** [`financeChartPanel.setPaneControls(options)`](/financial-charts/finance-chart-api/#setpanecontrols). See [Pane controls](/financial-charts/layout/#pane-controls).

<details>
<summary>The IPaneControlOptions and IPaneControlBarButtons interfaces, with their TSDoc</summary>

```ts
/**
 * The per-pane controls: the control bar and the dividers between panes.
 */
interface IPaneControlOptions {
    /** Show each pane's control bar. Default: `true`. */
    visible?: boolean;
    /**
     * Touch layout, for phones and tablets: the control bar sits in a drawer at each pane's right
     * edge (tap or swipe its handle) instead of appearing on hover, and the dividers have a wider
     * hit area with grip dots. The host decides when to use it, e.g. from the viewport size.
     * Default: `false`.
     */
    touch?: boolean;
    /** Buttons to leave out of the control bar, e.g. `{ axisSync: false }`. Default: all shown. */
    buttons?: IPaneControlBarButtons;
}

/**
 * Which buttons the per-pane control bar shows. Every button is shown unless set to `false`;
 * the chart-only ones appear on chart panes only, and the Y-axis auto-range toggle only on
 * panes that have one (see {@link IPaneSplitterApi.setYAxisAutoRange}).
 */
interface IPaneControlBarButtons {
    /** Sync this pane's X axis with the other panes. */
    axisSync?: boolean;
    /** Join or leave the vertical axis group. */
    verticalGroup?: boolean;
    /** Join or leave the horizontal axis group. */
    horizontalGroup?: boolean;
    /** Lock the pane at its current size. */
    lockSize?: boolean;
    /** Turn Y-axis auto-ranging on or off. */
    yAxisAutoRange?: boolean;
    /** Move the pane up/down (left/right in a row layout). */
    move?: boolean;
    /** Maximize the pane, or restore it. */
    maximize?: boolean;
    /** Hide the pane; it comes back from the restore strip. */
    hide?: boolean;
    /** Remove the pane. */
    close?: boolean;
}
```

</details>

### ISciFinanceChartPanelConfig.loading {#loading}

```ts
/**
 * What each pane shows while it loads: a skeleton until its chart is ready (or your own
 * placeholder), and a shimmer overlay while a symbol or interval switch loads.
 */
loading?: IPaneLoadingOptions;
```

What each pane shows while it loads.

- **`placeholder`**: shown in each pane until its chart is ready. `true` is a shimmering skeleton, `false` shows nothing, and a function returns your own element for a pane. `onPlaceholderRemoved` is called when it is taken out, so you can clean up anything inside it.
- **`overlay`**: while a symbol or interval change loads, covers each pane with a translucent shimmer that also blocks input.

See [Loading states](/financial-charts/layout/#loading-states).

<details>
<summary>The IPaneLoadingOptions interface, with its TSDoc</summary>

```ts
/**
 * What a chart pane shows while it loads.
 */
interface IPaneLoadingOptions {
    /**
     * Shown in each chart pane until its chart is ready. `true` (default) is a shimmering
     * skeleton (`.st-pane-skeleton`), `false` shows nothing, and a function returns your own
     * element for a pane, e.g. progress dots driven by `SciFinanceChart.progress`. It is removed
     * when the pane's chart is ready; see {@link onPlaceholderRemoved}.
     */
    placeholder?: boolean | ((paneId: LayoutPaneId) => HTMLElement);
    /** Called when a pane's placeholder is taken out, so content in it can be cleaned up. */
    onPlaceholderRemoved?: (paneId: LayoutPaneId, element: HTMLElement) => void;
    /**
     * While the layout's container has the `data-chart-loading` attribute, cover each chart pane
     * with a translucent shimmer (`.st-pane-loading-overlay`) that also blocks input, so a
     * symbol or interval switch shows it is working. `SciFinanceChartPanel` sets the attribute.
     * Default: `true`.
     */
    overlay?: boolean;
}
```

</details>

## ISciFinanceChartPanelConfig Styling and Theme Options

### ISciFinanceChartPanelConfig.theme {#theme}

```ts
/**
 * Colours for the whole chart: surfaces, axes, legend, crosshair and every study's
 * defaults. Default `SCITRADER_DARK_THEME`. Switch later with `financeApi.setTheme(theme)`.
 */
theme?: ISciTraderTheme;
```

Every colour the chart draws with: surfaces, axes, legend, crosshair, and each study's defaults. `SCITRADER_LIGHT_THEME` is the built-in alternative.

**Later:** `financeApi.setTheme(theme)`. See [Styling and themes](/financial-charts/styling-and-themes/).

<details>
<summary>The ISciTraderTheme interface, with its TSDoc</summary>

```ts
/**
 * A SciTrader theme: every colour the SDK and its React components draw with, in one object.
 *
 * - **Charts** take a theme as the `theme` option (`SciFinanceChartPanel.create`,
 *   `SciFinanceChart.createWithStudies`, `<SciFinanceChartView config>`), and switch a live chart with
 *   `SciFinanceChart.setTheme`. WebGL can't read CSS, so the chart applies the colours itself.
 * - **HTML and CSS** (the vanilla SDK toolbars and overlays, and the React components) read the theme
 *   as CSS custom properties. `SciTraderThemeProvider`, and each chart view on its own container,
 *   writes them. Every colour in the `chart`, `candles`, `market` and `ui` groups becomes one variable,
 *   named `--st-<group>-<property in kebab case>`: `ui.textMuted` is `--st-ui-text-muted`. Study colours
 *   are not written as variables.
 *
 * The SDK ships three themes, `SCITRADER_DARK_THEME` (the default), `SCITRADER_LIGHT_THEME` and
 * `SCITRADER_OCEAN_THEME`, listed in picker order by `SCITRADER_THEMES`. Build a
 * custom theme with `createSciTraderTheme(base, overrides)` rather than from scratch, so colours added
 * to the SDK later still have a value.
 *
 * **Colour values** are CSS colour strings: `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb(…)` / `rgba(…)` or a
 * colour name. Values drawn by WebGL (everything in `chart`, `candles` and `studies`) must be a form
 * SciChart parses: hex, `rgb(…)`, `rgba(…)` or a colour name. `var(…)`, `color-mix(…)` and gradients
 * work only in the groups that are applied as CSS (`ui`, and `market` where noted).
 *
 * **Explicit settings win over the theme.** A theme supplies defaults. A colour passed explicitly (in
 * `axisDefaults`, `surfaceConfig`, a study's constructor options, or edited in a study's settings
 * form) is kept, including across `setTheme`.
 */
interface ISciTraderTheme {
    /**
     * Display name, e.g. `"SciTrader Dark"`. Used to label the theme in pickers, and written to the
     * `data-scitrader-theme` attribute of `SciTraderThemeProvider`'s element for CSS selectors and
     * tests. Give each theme a distinct name.
     */
    name: string;
    /**
     * `true` for a theme with a dark background. `createMuiThemeFromSciTrader` reads it to set MUI's
     * palette `mode`, which decides MUI's own light or dark defaults for colours this theme does
     * not set. Make it agree with the colours: {@link ISciTraderUiColors.overlayRgb} in particular
     * should be white on a dark theme and black on a light one.
     */
    isDark: boolean;
    /**
     * CSS `font-family` for HTML text. It is set on `SciTraderThemeProvider`'s element (so the React
     * components inherit it), written as `--st-font-family` (read by the vanilla drawing-tools flyout),
     * and passed to MUI's typography by `createMuiThemeFromSciTrader`. The chart legend and crosshair
     * labels use their own font and do not read it. Axis tick labels are drawn by WebGL and do not
     * use it either. To change their font, register one with SciChart
     * (`sciChartSurface.registerFont`) and set `labelStyle.fontFamily` in `axisDefaults`.
     */
    fontFamily: string;
    /** The chart itself: surface, axes, gridlines, crosshair, legend and in-chart overlays. */
    chart: ISciTraderChartColors;
    /** Price-series colours that are not settings-form controls: line and mountain types, point & figure. */
    candles: ISciTraderCandleColors;
    /** Order-book colours: bid and ask, for the market-depth panel and order-book studies. */
    market: ISciTraderMarketColors;
    /**
     * The default colours of each study, keyed by `EStudyType`, then by the study's own colour-control
     * name. The keys are exactly the controls the study's settings form shows, so a theme sets what
     * the form would. See {@link ISciTraderStudyColors}.
     */
    studies: ISciTraderStudyColors;
    /** Application chrome: panels, text, buttons, toolbars, menus, scrollbars, for HTML components. */
    ui: ISciTraderUiColors;
    /**
     * Default colours of the drawing tools: lines, fills, labels, grips and the selection outline,
     * for any drawing whose tool doesn't give it a colour of its own. The built-in themes derive
     * them from their text, selection and background colours (see `deriveDrawingColors`), and
     * `createSciTraderTheme` re-derives them when an override changes those.
     */
    drawing: ISciTraderDrawingColors;
}
```

</details>

### ISciFinanceChartPanelConfig.axisDefaults {#axisdefaults}

```ts
/**
 * Default options applied to every X and Y axis the finance chart creates,
 * including the X axes in `addXAxis` and every study's Y axis. Each axis
 * spreads these first, then its study-specific options — so studies can
 * still override per-axis. See {@link IChartAxisDefaults}.
 */
axisDefaults?: IChartAxisDefaults;
```

SciChart axis options applied to every X and Y axis the chart creates, on top of the theme's. A study's own axis options still win over these.

```ts
axisDefaults: { labelStyle: { fontSize: 11 }, drawMinorGridLines: false }
```

**Later:** `financeApi.applyAxisStyle(partial)`. See [Axes](/financial-charts/styling-and-themes/#axes).

<details>
<summary>The IChartAxisDefaults type, with its TSDoc</summary>

```ts
/**
 * Default options applied to every X and Y axis created by the finance chart
 * and its studies. Each axis spreads these BEFORE its own (data-bound)
 * options so studies can still override on a per-axis basis.
 *
 * Intentionally a wide `Partial<IAxisBase2dOptions>` so callers can reach any
 * SciChart axis property — including 2D-specific ones like `backgroundColor`
 * (axis-strip fill) on top of the core toggles `drawMinorGridLines`,
 * `drawMajorBands`, `drawMajorTickLines`, etc.
 *
 * Threaded from `SciFinanceChartView` props → `ISciFinanceChartPanelConfig`
 * → `SciFinanceChart.createWithStudies` → stored on the chart instance →
 * read by `addXAxis()` for X axes and by each study's `onAttach` for Y axes.
 */
type IChartAxisDefaults = Partial<IAxisBase2dOptions>;
```

</details>

### ISciFinanceChartPanelConfig.surfaceConfig {#surfaceconfig}

```ts
/** Optional surface configuration applied to the default pane and study panes that don't specify their own (e.g. navy theme + transparent background). */
surfaceConfig?: TSurfaceConfigurationFunction;
```

A function run on each pane's `SciChartSurface` as it is created, for anything the other options don't cover. `chart.sciChartSurface` is the surface. Return the same `chart` when you're done.

```ts
surfaceConfig: async (chart) => {
    chart.sciChartSurface.background = "Transparent";
    return chart;
}
```

<details>
<summary>The TSurfaceConfigurationFunction type and IChart interface, with their TSDoc</summary>

```ts
/** Imperative configuration function: receives a created chart surface and applies user configuration to it. */
type TSurfaceConfigurationFunction = (chart: IChart) => Promise<IChart>;

/** Wraps a `ISciChartSurface` instance returned from a chart init function. */
interface IChart {
    /** Stable unique identity assigned at creation time (GUID). */
    id: string;
    sciChartSurface: ISciChartSurface;
}
```

</details>

## ISciFinanceChartPanelConfig in React

`<SciFinanceChartView>` takes the same config as its `config` prop. Because it is only read once, create it inside `useMemo`, and to start the chart over, remount the view with a new `key`:

```tsx
const config = React.useMemo<ISciFinanceChartPanelConfig>(
    () => ({
        exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
        symbol: "ETHUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        studies: [new OHLCStudy(), new VolumeStudy()],
    }),
    []
);

return <SciFinanceChartView key={chartKey} config={config} />;
```

#### See also

- [Finance Chart API](/financial-charts/finance-chart-api/): the object `create` returns
- [Getting started](/financial-charts/getting-started/)
- [Layout](/financial-charts/layout/)
- [Styling and themes](/financial-charts/styling-and-themes/)
