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

This is the interface as it is declared in `scichart-scitrader`, with its TSDoc comments:

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
}```

## Data

### exchangeName, symbol, interval

```ts
exchangeName: string;
symbol: string;
interval: CandleInterval;
```

What to chart. `exchangeName` is the name an exchange was registered under, e.g. `"Binance"` for `BinanceExchange`. Register it before you create the chart, or the chart has nowhere to load candles from. See [Register a data source](/financial-charts/getting-started/#register-a-data-source).

`symbol` is in the exchange's own format (`"BTCUSDT"` on Binance, `"BTC-USD"` on Coinbase). `interval` is the candle size, e.g. `CandleInterval.FOUR_HOURS`.

**Later:** [`financeApi.setSymbol`](/financial-charts/symbols-intervals-periods/changing-the-symbol/) and [`financeApi.changeInterval`](/financial-charts/symbols-intervals-periods/changing-the-interval/).

### services

```ts
services?: ISciFinanceChartServices;

interface ISciFinanceChartServices {
    dataManager?: IDataManager;
    dataFeedManager?: IDataFeedManager;
    progress?: PaneProgressEmitter;
}
```

The services the chart loads data through. Leave this out and the chart creates its own, using the globally registered exchanges. Most apps never set it.

Set it for two reasons:

- **To keep an exchange private to one chart**, rather than registering it globally. See [Keeping an exchange private to a chart](/financial-charts/data-sources/#keeping-an-exchange-private-to-a-chart).
- **To follow loading progress from the start.** Each pane reports `"surface"`, then `"configured"`, then `"data"` as it loads. Those events fire before `create` resolves, so subscribe to your own `PaneProgressEmitter` and pass it in as `progress`. Otherwise the chart creates one, which you can reach afterwards as `financeApi.progress`. See [Loading states](/financial-charts/layout/#loading-states).

## Studies

### studies

```ts
studies: IStudy[];
```

What to draw, in order. Include `OHLCStudy` for the price candles. Overlays such as moving averages and volume share the price pane; oscillators such as RSI and MACD each get a pane of their own.

Each study object belongs to one chart. Create new ones for every chart, and in React create them inside `useMemo`, so a re-render doesn't hand the chart new objects.

**Later:** `financeApi.attachStudy(study)` and `financeApi.detachStudy(study)`. See [Studies and indicators](/financial-charts/studies-and-indicators/).

### maxPanes

```ts
maxPanes?: number; // default 6
```

The most panes the chart may have, counting the price pane. Once it is reached, studies that need a pane of their own are refused, and `financeApi.paneLimitReached` is raised so you can tell the user. Overlays such as EMA, VWAP and Volume share an existing pane and are never refused.

**Later:** set `financeApi.maxPanes`.

## Period and zoom

### period

```ts
period?: TPeriod;
```

How much time to show at first, e.g. `"3M"` for three months. Once the first candles are loaded, the chart zooms to the period and fetches any older candles it needs. Leave it out to show the data feed's natural range.

**Later:** [`financeApi.setPeriod`](/financial-charts/symbols-intervals-periods/periods/).

### periodBufferRatio

```ts
periodBufferRatio?: number; // default 0.2
```

Extra candles to fetch beyond the period, as a fraction of it: `0.2` fetches 20% more. They sit just off the left edge, so a small pan back doesn't need another fetch. Negative values count as `0`.

### lockPeriodWidth

```ts
lockPeriodWidth?: boolean; // default true
```

Whether the period is also the widest the user can zoom out to. Set `false` to treat the period as the starting view only, with zoom unrestricted afterwards.

### liveTipMode

```ts
liveTipMode?: "follow" | "anchored"; // default "follow"
```

What the view does as new candles arrive, while a period is set:

- `"follow"`: the view slides right with each new candle, so the latest one stays in view.
- `"anchored"`: the view stays where it is, and new candles appear off-screen to the right.

**Later:** set `financeApi.liveTipMode`, or use the `LiveTipToggle` control ([UI components](/financial-charts/ui-components/#toolbar-controls)).

### forwardHeadroomSec

```ts
forwardHeadroomSec?: number | null; // default null
```

How far, in seconds, the user can pan or zoom past the latest candle. `null` sets no limit.

## Layout

### useSubCharts

```ts
useSubCharts?: boolean; // default true
```

Whether all panes are drawn on one shared SciChart surface (`true`, sub-chart mode) or each pane has its own surface (`false`). One surface uses less memory and fewer WebGL contexts. See [Multi-chart and sub-chart modes](/financial-charts/layout/#multi-chart-and-sub-chart-modes).

### direction

```ts
direction?: "column" | "row"; // default "column"
```

Stack panes vertically (`"column"`), or side by side (`"row"`).

**Later:** `financeChartPanel.paneGroupApi.setDirection(direction)`.

### paneSizing

```ts
paneSizing?: Record<string, IPaneSizeConfig>;

interface IPaneSizeConfig {
    grow?: number; // share of the free space, relative to other panes. Default 1
    size?: number; // fixed size in pixels; the pane doesn't grow
}
```

Size hints for each pane, keyed by pane id. A hint here wins over the pane's study's own default.

```ts
import { PaneId } from "scichart-scitrader";

paneSizing: {
    [PaneId.DEFAULT.value]: { grow: 4 }, // a bigger price pane
    RSIPane: { size: 100 },              // a fixed-height RSI pane
}
```

### paneControls

```ts
paneControls?: IPaneControlOptions;

interface IPaneControlOptions {
    visible?: boolean;                // show each pane's control bar. Default true
    touch?: boolean;                  // phone and tablet layout. Default false
    buttons?: IPaneControlBarButtons; // buttons to leave out, e.g. { close: false }
}
```

Each pane's control bar, and the dividers between panes.

- **`touch`**: the control bar moves into a drawer at each pane's right edge, opened by a tap or swipe, rather than appearing on hover. The dividers get a wider hit area. You decide when to turn it on, e.g. from the viewport size.
- **`buttons`**: `move`, `maximize`, `hide`, `close`, `lockSize` and `yAxisAutoRange` are shown by default. `axisSync`, `verticalGroup` and `horizontalGroup` are hidden on a finance chart, because it keeps every pane's X axis in step already; set them to `true` to show them.

**Later:** [`financeChartPanel.setPaneControls(options)`](/financial-charts/finance-chart-api/#setpanecontrols). See [Pane controls](/financial-charts/layout/#pane-controls).

### loading

```ts
loading?: IPaneLoadingOptions;

interface IPaneLoadingOptions {
    placeholder?: boolean | ((paneId: string) => HTMLElement); // default true
    onPlaceholderRemoved?: (paneId: string, element: HTMLElement) => void;
    overlay?: boolean;                                         // default true
}
```

What each pane shows while it loads.

- **`placeholder`**: shown in each pane until its chart is ready. `true` is a shimmering skeleton, `false` shows nothing, and a function returns your own element for a pane. `onPlaceholderRemoved` is called when it is taken out, so you can clean up anything inside it.
- **`overlay`**: while a symbol or interval change loads, covers each pane with a translucent shimmer that also blocks input.

See [Loading states](/financial-charts/layout/#loading-states).

## Look

### theme

```ts
theme?: ISciTraderTheme; // default SCITRADER_DARK_THEME
```

Every colour the chart draws with: surfaces, axes, legend, crosshair, and each study's defaults. `SCITRADER_LIGHT_THEME` is the built-in alternative.

**Later:** `financeApi.setTheme(theme)`. See [Styling and themes](/financial-charts/styling-and-themes/).

### axisDefaults

```ts
axisDefaults?: IChartAxisDefaults; // Partial<IAxisBase2dOptions>
```

SciChart axis options applied to every X and Y axis the chart creates, on top of the theme's. A study's own axis options still win over these.

```ts
axisDefaults: { labelStyle: { fontSize: 11 }, drawMinorGridLines: false }
```

**Later:** `financeApi.applyAxisStyle(partial)`. See [Axes](/financial-charts/styling-and-themes/#axes).

### surfaceConfig

```ts
surfaceConfig?: TSurfaceConfigurationFunction;

type TSurfaceConfigurationFunction = (chart: IChart) => Promise<IChart>;
```

A function run on each pane's `SciChartSurface` as it is created, for anything the other options don't cover. `chart.sciChartSurface` is the surface. Return the same `chart` when you're done.

```ts
surfaceConfig: async (chart) => {
    chart.sciChartSurface.background = "Transparent";
    return chart;
}
```

## React

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
