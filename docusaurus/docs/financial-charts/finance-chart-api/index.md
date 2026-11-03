---
sidebar_position: 1
sidebar_label: ISciFinanceChartPanelApi
title: "Finance Chart API: ISciFinanceChartPanelApi | SciTrader.js Financial Charts"
description: "The API object returned by SciFinanceChartPanel.create and SciFinanceChartView in SciTrader.js: ISciFinanceChartPanelApi, its financeApi (SciFinanceChart), paneGroupApi, serialization and cleanup."
keywords: ["SciTrader", "SciTrader.js", "ISciFinanceChartPanelApi", "SciFinanceChartPanel", "SciFinanceChart", "financeApi", "React financial charts API", "trading chart API"]
---

# Finance Chart API

Creating a SciTrader chart gives you back one object: an **`ISciFinanceChartPanelApi`**. Everything you do to the chart afterwards goes through it. These docs call it **`financeChartPanel`**.

```ts
import { ISciFinanceChartPanelApi, SciFinanceChartPanel } from "scichart-scitrader";

// SciFinanceChartPanel.create(container: HTMLElement, config: ISciFinanceChartPanelConfig)
//     : Promise<ISciFinanceChartPanelApi<HTMLElement>>
const financeChartPanel: ISciFinanceChartPanelApi<HTMLElement> = await SciFinanceChartPanel.create(
    document.getElementById("chart"),
    config
);
```

`config` is an `ISciFinanceChartPanelConfig`: the data, studies and layout the chart starts with. [Chart configuration](/financial-charts/finance-chart-api/chart-config/) describes every option.

The same object comes from each way of making a chart:

| Created with | Returns | Type |
| --- | --- | --- |
| `SciFinanceChartPanel.create(container, config)` | `Promise<ISciFinanceChartPanelApi<HTMLElement>>` | Resolves once the chart has loaded and drawn |
| `SciFinanceChartPanel.fromJSON(container, state, options?)` | `Promise<ISciFinanceChartPanelApi<HTMLElement>>` | The same, for a [restored chart](/financial-charts/save-and-restore/) |
| `<SciFinanceChartView ref={…} onInit={…} />` (React) | `ISciFinanceChartViewApi`, an alias of `ISciFinanceChartPanelApi<React.ReactNode>` | Through `ref` as soon as the view mounts, and `onInit` once the chart is ready |

The type parameter `TPaneContent` is the only difference between them. It is what [`addCustomPane`](#addcustompane) accepts: an `HTMLElement` in plain TypeScript, and a `ReactNode` in React.

## The ISciFinanceChartPanelApi Interface

| Member | Type | What it does |
| --- | --- | --- |
| [`isInitialized`](#isinitialized) | `readonly boolean` | Whether the chart has loaded, so `financeApi` is safe to read |
| [`financeApi`](#financeapi) | `readonly SciFinanceChart` | The finance chart: studies, data feeds, symbol, interval and period |
| [`paneGroupApi`](#panegroupapi) | `readonly IPaneApi` | The pane group: pane order, visibility, sizes, axis sync and events |
| [`addCustomPane(content?)`](#addcustompane) | `void` | Adds a pane with your own content beside the chart panes |
| [`setPaneControls(options)`](#setpanecontrols) | `void` | Changes the panes' control bar and dividers |
| [`getPaneInfoElement(paneId)`](#getpaneinfoelement) | `HTMLElement \| undefined` | The info area in a pane's control bar, for your own content |
| [`toJSON()`](#tojson) | `ISciFinanceChartPanelState` | Saves the whole chart's state |
| [`cleanup()`](#cleanup) | `void` | Destroys the chart and frees its resources |

<details>
<summary>The ISciFinanceChartPanelApi interface, with its TSDoc</summary>

```ts
/**
 * API exposed by {@link SciFinanceChartPanel} (vanilla) and
 * {@link SciFinanceChartView} (React, via ref).
 *
 * Provides access to the underlying finance and pane group APIs,
 * plus combined serialization and cleanup. Sub-chart mode is a layout
 * concern — controlled by the caller via config, not this API.
 *
 * `TPaneContent` is what {@link addCustomPane} accepts: a `ReactNode` for the React wrapper.
 * The SDK itself has no UI framework, so it defaults to `unknown`.
 */
interface ISciFinanceChartPanelApi<TPaneContent = unknown> {
    /**
     * Whether chart initialization has completed and {@link financeApi} is safe to read.
     *
     * The React view hands out its API handle as soon as it mounts, but `financeApi`
     * THROWS until init finishes — so handle presence is not readiness. UI that can be
     * clicked while the chart is still loading (e.g. the drawing-tools rail, which
     * renders immediately) must check this before touching `financeApi`.
     */
    readonly isInitialized: boolean;
    /** Finance chart API — studies, data feeds, intervals. Throws while {@link isInitialized} is false. */
    readonly financeApi: SciFinanceChart;
    /** Pane group API — pane management, coordination, visibility, sizing, events. */
    readonly paneGroupApi: IPaneApi;
    /**
     * Add a custom (non-chart) pane alongside the finance chart panes, with `content` inside it
     * when given: an `HTMLElement` for the vanilla `SciFinanceChartPanel`, a `ReactNode` for the
     * React `SciFinanceChartView`.
     */
    addCustomPane(content?: TPaneContent): void;
    /**
     * Change the panes' control bar and dividers; only the options given change. For example,
     * `setPaneControls({ touch: true })` when the page switches to its phone layout.
     */
    setPaneControls(options: IPaneControlOptions): void;
    /**
     * The info area at the start of a pane's control bar, for the host's own content, such as a
     * candle counter on the price pane (`PaneId.DEFAULT.value`). Hidden while empty. The same
     * element is kept while the pane exists. `undefined` if there is no such pane.
     */
    getPaneInfoElement(paneId: string): HTMLElement | undefined;
    /** Serialize the full panel state — finance + layout. */
    toJSON(): ISciFinanceChartPanelState;
    /** Teardown and clean up all resources. */
    cleanup(): void;
}
```

</details>

The three properties are getters, so they always return the live objects. Hold on to `financeChartPanel` rather than copying its properties.

## ISciFinanceChartPanelApi Properties {#properties}

### ISciFinanceChartPanelApi.isInitialized {#isinitialized}

```ts
/**
 * Whether chart initialization has completed and {@link financeApi} is safe to read.
 *
 * The React view hands out its API handle as soon as it mounts, but `financeApi`
 * THROWS until init finishes — so handle presence is not readiness. UI that can be
 * clicked while the chart is still loading (e.g. the drawing-tools rail, which
 * renders immediately) must check this before touching `financeApi`.
 */
readonly isInitialized: boolean;
```

Whether the chart has finished loading, so `financeApi` can be read.

- **Plain TypeScript:** always `true`. `create` and `fromJSON` only resolve once the chart is ready.
- **React:** the `ref` is set as soon as `<SciFinanceChartView>` mounts, before the chart has loaded. Having the ref doesn't mean the chart is ready. Check `isInitialized`, or wait for `onInit`, before touching `financeApi`. This matters for UI that renders straight away and can be clicked while the chart loads, such as a toolbar.

For example, a toolbar button that adds an RSI study. It can be clicked before the chart has loaded, so it checks `isInitialized` first:

```tsx
// Example: the click handler of an "Add RSI" button, in a component that holds the chart's ref
const onAddRsi = () => {
    const financeChartPanel = chartRef.current;
    if (financeChartPanel?.isInitialized) {
        financeChartPanel.financeApi.attachStudy(new RSIStudy());
    }
};
```

### ISciFinanceChartPanelApi.financeApi {#financeapi}

```ts
/** Finance chart API — studies, data feeds, intervals. Throws while {@link isInitialized} is false. */
readonly financeApi: SciFinanceChart;
```

The finance chart itself, and where most of the API lives. It **throws** while `isInitialized` is `false`.

#### The SciFinanceChart Class

`financeApi` is a `SciFinanceChart`. Its most used members:

| Area | Members | See |
| --- | --- | --- |
| Symbol, interval, period | `setSymbol`, `changeInterval`, `setPeriod`, `currentPeriod`, `createDataFeed`, `removeDataFeed`, `dataFeeds` | [Symbols, intervals and periods](/financial-charts/symbols-intervals-periods/) |
| Studies | `attachStudy(study): Promise<void>`, `detachStudy(study)`, `studies`, `studiesChanged` | [Studies and indicators](/financial-charts/studies-and-indicators/) |
| Candle type | `setCandleType(type)`, `getCandleType()`, `candleTypeChanged` | [Candle types](/financial-charts/studies-and-indicators/#candle-types) |
| Theme and axes | `setTheme(theme)`, `theme`, `themeChanged`, `applyAxisStyle(partial)`, `axisDefaults` | [Styling and themes](/financial-charts/styling-and-themes/) |
| Live tip | `liveTipMode` (`"follow"` or `"anchored"`), `liveTipModeChanged` | [UI components](/financial-charts/ui-components/#toolbar-controls) |
| Panes | `maxPanes`, `paneLimitReached`, `chartPanes`, `toggleChartPane(paneId)`, `getDefaultSurface()` | [Layout](/financial-charts/layout/) |
| Drawings | `clearAllDrawings()`, `finChartModifiers` | [Drawing tools](/financial-charts/drawing-tools/) |
| Loading events | `dataLoadStarted`, `dataRenderComplete`, `historicalLoadStarted`, `historicalLoadComplete` | [Loading events](/financial-charts/symbols-intervals-periods/#loading-events) |
| State | `toJSON(): ISciFinanceChartState` (the finance part only) | [Saving and restoring](/financial-charts/save-and-restore/) |

```ts
const chart = financeChartPanel.financeApi; // SciFinanceChart

await chart.attachStudy(new MACDStudy());
await chart.changeInterval(CandleInterval.ONE_DAY, "1Y");
chart.dataRenderComplete.subscribe((args) => console.log("drawn:", args.type));
```

<details>
<summary>The SciFinanceChart class's public API, with its TSDoc</summary>

The public members of `SciFinanceChart`, from the declaration in `scichart-scitrader` (private and protected members left out):

```ts
/**
 * Primary API for the finance charting system.
 *
 * Manages multiple chart panes (OHLC, indicators), data feeds, x-axis synchronization,
 * and study attachment/detachment. Layout is delegated to an {@link IChartPaneLayoutApi}
 * (e.g. `SciChartPaneSplitter`).
 */
declare class SciFinanceChart implements IDeletable {
    get studies(): readonly IStudy[];
    get dataFeeds(): Map<string, IDataFeed>;
    /**
     * Change the price series rendering style (candlestick, OHLC bars, line,
     * mountain, Heikin-Ashi, Renko, point & figure). Delegates to the default-pane
     * OHLC study, which swaps its renderable series in place (preserving data /
     * zoom / pan). No-op if there is no price study. Raises {@link candleTypeChanged}.
     */
    setCandleType(type: ECandleType): void;
    /** The current price rendering style. Defaults to candlestick when no price study exists. */
    getCandleType(): ECandleType;
    /**
     * Create a SciFinanceChart with a single default pane.
     *
     * @param layoutApi — Layout component API (e.g. `SciChartPaneSplitter`).
     * @param services — Optional shared data manager and feed manager.
     */
    static create(layoutApi: IChartPaneLayoutApi, services?: ISciFinanceChartServices): Promise<SciFinanceChart>;
    /**
     * Create a SciFinanceChart with predefined studies and a real-time data feed.
     *
     * @param layoutApi — Layout component API (e.g. `SciChartPaneSplitter`).
     * @param options — Studies, data feed config, and optional services.
     */
    static createWithStudies(layoutApi: IChartPaneLayoutApi, options: ISciFinanceChartPredefinedStudiesOptions): Promise<SciFinanceChart>;
    /**
     * Returns `true` once the leftmost loaded candle reaches the symbol's
     * listing-date floor — i.e., no more historical data can be fetched.
     * Returns `false` if the listing-date probe hasn't resolved yet, the
     * data manager is empty, or the default feed isn't available.
     *
     * Used by zoom-extents to skip the `dataLoadThreshold + 1` carve-out
     * when there's no risk of triggering another backward-load cascade.
     */
    isAtListingDateFloor(): boolean;
    readonly dataManager: IDataManager;
    readonly dataFeedManager: IDataFeedManager;
    /**
     * The currently-selected preset period, set by the most recent successful
     * {@link setPeriod} call. `null` means no period is active — the chart shows
     * whatever the data feed's natural visible range is.
     */
    currentPeriod: TPeriod | null;
    /**
     * Width of the active period in seconds, or `null` when no period is set
     * or the active period has a non-fixed width (`ALL`, `YTD`). When non-null,
     * `applyPeriodWidthLimit` mirrors this to each pane's
     * `xAxis.visibleRangeSizeLimit.max` so SciChart's own scale / zoom /
     * `setVisibleRangeWithLimits` paths clamp the visible-range width to the
     * period — no per-modifier opt-in required. Wheel and double-click
     * modifiers additionally check this value to convert "would-be wider"
     * gestures into time-shift pans (UX continuation past the cap).
     */
    get periodWidthSec(): number | null;
    /**
     * Pan-back ratio applied to `periodCandles` when sizing the off-screen
     * buffer. See `IFetchPlan`. Configurable via
     * `ISciFinanceChartPredefinedStudiesOptions.periodBufferRatio`.
     */
    periodBufferRatio: number;
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
    /**
     * Forward pan/zoom headroom past the latest candle, in seconds, or
     * `null` for no forward limit (default). Mirrored to each pane's
     * `xAxis.visibleRangeLimit.max` by {@link applyVisibleRangeLimit}.
     *
     * Configurable via
     * `ISciFinanceChartPredefinedStudiesOptions.forwardHeadroomSec`.
     */
    forwardHeadroomSec: number | null;
    /**
     * Multiplier on the largest attached study's `getRequiredWarmup()` value
     * when sizing the off-screen warmup buffer. `1` = exactly enough; `2` =
     * double for safety margin; `0` = no warmup contribution. Configurable
     * via `ISciFinanceChartPredefinedStudiesOptions.warmupMultiplier`.
     */
    warmupMultiplier: number;
    /**
     * Default options applied to every X and Y axis the chart creates,
     * including study panes. Spread by `addXAxis` (X axes) and by each
     * study's `onAttach` (Y axes) BEFORE study-specific options, so studies
     * can still override per-axis.
     *
     * Reads as the theme's axis style with the caller's own defaults over it; assigning sets the
     * caller's part only, so a later {@link setTheme} still restyles whatever the caller left to
     * the theme. Configurable via `ISciFinanceChartPredefinedStudiesOptions.axisDefaults`.
     */
    get axisDefaults(): IChartAxisDefaults;
    set axisDefaults(value: IChartAxisDefaults);
    /**
     * Live-updates axis styling on every attached pane's X+Y axes. Merges
     * `partial` into `axisDefaults` so future panes pick up the new values,
     * then mutates each existing axis's reactive style properties so the
     * chart redraws immediately — no remount needed.
     *
     * Only the properties present in `partial` are touched; everything else
     * on the axis is left alone. Whole-object reassignment is used for
     * nested style records (`majorGridLineStyle`, `labelStyle`) because
     * SciChart's reactivity fires on top-level setter assignment, not on
     * nested-property mutation. Values set here override the theme's.
     */
    applyAxisStyle(partial: IChartAxisDefaults): void;
    /** The theme the chart draws with. Set at creation with the `theme` option; change it with {@link setTheme}. */
    get theme(): ISciTraderTheme;
    /** Raised after {@link setTheme} has restyled the chart, with the new theme. */
    themeChanged: EventHandler<ISciTraderTheme>;
    /**
     * Switch the chart to another theme, in place: axes, surface backgrounds, legend, crosshair
     * and every study are restyled with no reload.
     *
     * Anything set explicitly keeps its value: axis options from `axisDefaults` or
     * {@link applyAxisStyle}, a background set by `surfaceConfig`, and study colours passed to a
     * constructor or edited in a study's settings form. Everything left to the theme moves to
     * the new one.
     */
    setTheme(theme: ISciTraderTheme): void;
    /**
     * Give a pane the theme's background. In sub-chart mode the panes are drawn on one parent
     * surface, and its background is the one that shows. A background that is not the previous
     * theme's (set by `surfaceConfig`, say) is left as it is.
     *
     * @param previous — the theme being replaced; omit for a pane that has just been created.
     */
    applySurfaceTheme(surface: SciChartSurface, previous?: ISciTraderTheme): void;
    /**
     * Per-pane size hints keyed by paneId. Overrides each pane's primary
     * study's `paneSizeConfig` default when resolving the `sizeConfig` to
     * pass to `layoutApi.createChartPane`. Configurable via
     * `ISciFinanceChartPredefinedStudiesOptions.paneSizing`. Default `{}`.
     */
    paneSizing: Record<string, IPaneSizeConfig>;
    /**
     * Maximum total number of chart panes (price pane + indicator panes).
     * {@link attachStudy} refuses a study that would create a NEW pane once
     * `chartPanes.size` has reached this value, raising {@link paneLimitReached}.
     * Overlay studies that share an existing pane are never affected.
     * Configurable via `ISciFinanceChartPredefinedStudiesOptions.maxPanes`.
     */
    maxPanes: number;
    /**
     * Fires when {@link attachStudy} refuses a study because adding it would
     * exceed {@link maxPanes}. Hosts subscribe to surface a "max panes reached"
     * notification. Carries the cap and the refused study's type.
     */
    paneLimitReached: EventHandler<{
        max: number;
        studyType: EStudyType;
    }>;
    /** Fires when {@link liveTipMode} changes via the setter. */
    liveTipModeChanged: EventHandler<"follow" | "anchored">;
    get liveTipMode(): "follow" | "anchored";
    set liveTipMode(value: "follow" | "anchored");
    readonly chartPanes: Map<PaneId, ChartPane>;
    readonly finChartModifiers: ObservableArray<FinChartModifierBase>;
    autoRangeChanged: EventHandler<AutoRangeChangedArgs>;
    /**
     * Fires when a FOREGROUND data load begins — full-chart dataset
     * replacements (initial load via `createWithStudies`, symbol/interval
     * swap via `changeInterval` / `createDataFeed`). These are paired
     * with a `data-chart-loading` overlay in `SciFinanceChartView`.
     *
     * **Not raised for coordinator-driven background loads** (pan-back
     * cascade, warmup-after-init, forward-edge fills). Earlier prototyping
     * raised it from `handleLoadStart` and produced a "disappear for a
     * few seconds then reappear" flash when the warmup fired right after
     * init — see the comment at `handleLoadStart`. For background-load
     * notification, subscribe to {@link historicalLoadStarted} /
     * {@link historicalLoadComplete} instead.
     */
    dataLoadStarted: EventHandler<void>;
    /** Fires after a FOREGROUND data load has been loaded and fully rendered. */
    dataRenderComplete: EventHandler<IDataRenderCompleteArgs>;
    /**
     * Plan D9 — fires ONCE when a backward `HistoricalLoadCoordinator`
     * chain begins (the first `onLoadStart` after the prior chain
     * settled). Cascade hops within the same chain do NOT re-fire this
     * event. Semantically distinct from {@link dataLoadStarted}: this is
     * the background path (chart already has data visible), so consumers
     * should render a subtle indicator (corner spinner / progress dots),
     * NOT the full-chart skeleton overlay.
     *
     * Forward-direction loads are deliberately silent (Plan D5).
     */
    historicalLoadStarted: EventHandler<void>;
    /**
     * Plan D9 — fires ONCE when the current backward `HistoricalLoadCoordinator`
     * chain settles (the hop whose `onLoadComplete` arrived with
     * `isCascading=false`). Payload `count` is the cumulative candle
     * count across every hop in the chain.
     */
    historicalLoadComplete: EventHandler<{
        count: number;
    }>;
    /**
     * Fires once after the default data feed's initial fetch has resolved — data is in the
     * data manager, but studies have not yet attached and panes have not yet rendered.
     * Useful for telemetry / staged-loading UI that wants to distinguish "fetched" from "rendered".
     */
    defaultFeedLoaded: EventHandler<void>;
    /**
     * Fires once per chart pane when its SciChartSurface (or SciChartSubSurface) has been
     * created and themed — i.e., the surface object exists and is registered with the
     * finance chart. Earliest per-pane signal, useful for "initialising surface" UIs.
     */
    paneSurfaceReady: EventHandler<{
        paneId: PaneId;
    }>;
    /**
     * Fires once per chart pane after its first study has been wired up — X axis added,
     * axis sync applied, study `onAttach` finished, modifiers attached. Fires before any
     * data has arrived for the pane.
     */
    paneConfigured: EventHandler<{
        paneId: PaneId;
    }>;
    /**
     * Fires once per chart pane the first time that pane's historical data has been
     * delivered (the pane's first study `dataChanged` event has fired). Use
     * {@link paneDataReadyPromise} when the consumer is a Promise-awaiter (e.g. a chart
     * pane's `initFn`); use direct subscription for diagnostic / observability consumers.
     */
    paneDataReady: EventHandler<{
        paneId: PaneId;
    }>;
    /**
     * Fires whenever a study is attached or detached. Consumers (e.g. the studies-management
     * drawer panel) subscribe to refresh their derived list. Carries no payload — subscribers
     * read {@link studies} directly.
     */
    studiesChanged: EventHandler<void>;
    /**
     * Fires when the price series rendering style changes via {@link setCandleType}.
     * Carries the new {@link ECandleType} so UI controls can reflect external changes.
     */
    candleTypeChanged: EventHandler<ECandleType>;
    /**
     * Minimum candle-count buffer before the viewport's left edge that triggers a historical
     * prefetch. Acts as a floor: the effective threshold is scaled up automatically when the
     * viewport is zoomed out (see {@link computeLoadThreshold}). Increase this value if
     * prefetching fires too late on high-interval charts; decrease to reduce eager loading.
     */
    dataLoadThreshold: number;
    /**
     * Optional soft cap on the total number of historical candles the chart will accumulate.
     * Plan B *declares* this field for consumer opt-in but does not yet enforce it — a future
     * plan (D2) will use {@link IntervalCapacity.maxPeriodForInterval} to clamp the visible
     * range via `xAxis.visibleRangeLimit` so a user cannot pan past what the cap allows.
     *
     * When set, future work (D1) will also use it to drive LRU eviction in `DataManager`,
     * preventing long sessions on small intervals from accumulating hundreds of MB.
     *
     * `undefined` by default — opt-in via direct assignment or chart construction options.
     */
    maxCandles?: number;
    /**
     * Whether to render the historical-load overlay (see {@link addLoadAnnotations})
     * during pan-back fetches. Default `false` — production apps prefer no overlay.
     * Sandbox / debug consumers can flip to `true` after construction (or via the
     * ref handle in `SciFinanceChartView`) to demonstrate the loading UX.
     */
    historicalLoadAnnotationsEnabled: boolean;
    /**
     * Delay before the historical-load overlay is added during a historical fetch.
     * Only applies when {@link historicalLoadAnnotationsEnabled} is `true`. Fast feeds
     * (cached responses, mock data) typically resolve before this fires, avoiding a
     * visible flash. Set to `0` to show immediately.
     */
    historicalLoadAnnotationDelayMs: number;
    /**
     * Public accessor for the cached {@link intervalSec}. Read by host UIs
     * that need to convert between candle counts and wall-clock seconds
     * without re-running `intervalToTimeSpan` themselves (e.g. the
     * candle-counter panel-control overlay).
     */
    get intervalSeconds(): number;
    /**
     * Register an annotation type as a user-drawing kind. Once registered, any
     * annotation of this type added to a chart pane's surface will be tracked
     * for serialization. Idempotent.
     */
    static registerDrawingType(name: string): void;
    /**
     * Barrier that all per-pane initFns awaited by `createWithStudies` block on
     * before resolving. {@link createWithStudies} resolves it once the global
     * resume + 2-cycle render + paint sequence has completed, so the layout
     * fallback (e.g. the pane splitter's per-pane skeleton)
     * stays mounted until the canvas has actually painted settled content —
     * no flinch as the loader hides over an in-flight render.
     *
     * Constructor-resolved as a no-op for any consumer that doesn't go through
     * `createWithStudies`; that path overrides with a fresh deferred barrier.
     */
    firstRenderBarrier: Promise<void>;
    /** Resolve {@link firstRenderBarrier}. Idempotent — safe to call repeatedly. */
    markFirstRenderComplete(): void;
    /**
     * Per-pane init-phase emitter. Owned by this chart — `firePane*` lifecycle
     * helpers write directly via `progress.setPhase(paneId, phase)`. Consumers
     * read it via `progress.subscribe(...)` / `progress.getStats(...)`. Inject
     * a pre-created emitter through {@link ISciFinanceChartServices.progress}
     * to subscribe ahead of init.
     */
    readonly progress: PaneProgressEmitter;
    getDefaultSurface(): SciChartSurface;
    getPaneId(scs: SciChartSurface): PaneId;
    /**
     * Returns the per-pane Y-axis autoRange controller (the {@link FinChartYAxisDragModifier}
     * instance attached to the pane's surface), or undefined if the pane is unknown.
     * Read `isYAxisAutoRangeEnabled` to query state, write it to toggle, and subscribe to
     * `yAxisAutoRangeChanged` to observe flips (from drag, wheel, or external setter calls).
     */
    getYAxisAutoRangeController(paneId: PaneId): FinChartYAxisDragModifier | undefined;
    get autoRange(): boolean;
    set autoRange(value: boolean);
    /**
     * Returns a promise that resolves when {@link paneDataReady} has fired for the given pane.
     * Resolves immediately if the event has already fired for that pane.
     */
    paneDataReadyPromise(paneId: PaneId): Promise<void>;
    /** Pane ids that have already fired {@link paneSurfaceReady}. Read by late subscribers to seed state. */
    get surfaceReadyPaneIds(): ReadonlySet<string>;
    /** Pane ids that have already fired {@link paneConfigured}. Read by late subscribers to seed state. */
    get configuredPaneIds(): ReadonlySet<string>;
    /**
     * `true` once the pane's surface has both an x and a y axis, so annotations on it can draw.
     *
     * FinChart modifiers check this before attaching to every pane on `onAttach`. The first
     * study attached is often not the default pane's, and `chartPanes` already holds the bare
     * default surface from the constructor, so attaching it then put the legend and crosshair
     * annotations on a surface with no axes (OrderBookImbalanceStudy's gauge waits for the
     * same reason; see its `addGauge`). SciChart's parent draw loop draws
     * sub-surfaces without checking `isSuspended`, so the next frame logged "Cannot draw
     * annotations before axes have been configured" once per annotation. Panes skipped here
     * are attached by {@link configureChartPane} after their axes are added.
     *
     * Not the same as {@link configuredPaneIds}: the default pane fires `paneConfigured` early,
     * before its axes exist.
     */
    paneHasAxes(paneId: PaneId): boolean;
    /** Pane ids that have already fired {@link paneDataReady}. Read by late subscribers to seed state. */
    get dataReadyPaneIds(): ReadonlySet<string>;
    addDefaultFeed(exchangeName: string, symbol: string, interval: CandleInterval): Promise<IDataFeed>;
    createDataFeed(feedType: EDataFeedType, exchangeName: string, symbol: string, interval: CandleInterval, isDefault: boolean, period?: TPeriod | null): Promise<IDataFeed>;
    /**
     * Switches the chart to another symbol, optionally on another exchange, keeping the current
     * interval and period. Studies, panes and drawings stay; every study recalculates on the new
     * data. Raises {@link dataLoadStarted}, then `dataRenderComplete({ type: "symbol-change" })`.
     *
     * Shorthand for `createDataFeed(EDataFeedType.OHLCVRealtime, exchangeName, symbol,
     * <current interval>, true, <current period>)`.
     *
     * @param symbol The symbol in the exchange's own format (`BTCUSDT` on Binance, `BTC-USD` on
     * Coinbase; `mapSymbol` converts between them).
     * @param exchangeName The exchange to load from. Defaults to the current one.
     * @param options.period The period to show once loaded, instead of the current one. `null`
     * shows all loaded data with no period.
     */
    setSymbol(symbol: string, exchangeName?: string, options?: {
        period?: TPeriod | null;
    }): Promise<IDataFeed>;
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
    /**
     * Time span of the default pane's current visible range, in milliseconds.
     *
     * Reads `xValues` (seconds-since-epoch) at the floor/ceil of the visible
     * range's index bounds and converts to ms. Useful for callers that want to
     * react to the *actual* zoom regardless of whether a preset period is
     * active — e.g. interval-change handlers deciding whether the new grain's
     * minimum-period rule is satisfied. Returns `null` when there's no data,
     * no default surface, or the bounds collapse to a single index.
     */
    getVisibleTimeSpanMs(): number | null;
    /**
     * Returns `true` if either the backward or forward historical-load
     * coordinator has a spawn in flight. The chart's own
     * `dataLoadStarted`/`dataRenderComplete` event pair is deliberately
     * silent for coordinator-driven loads (see `handleLoadStart`), so a
     * consumer that wants to detect "is anything being fetched" must consult
     * the coordinators directly. Used by the `/finance-react` debug harness'
     * `waitForQuiescence` to gate scenario transitions on real load
     * settlement.
     */
    hasInFlightHistoricalLoad(): boolean;
    removeDataFeed(feedId: string): void;
    delete(): void;
    /** Serialize the finance chart state — data feed config + study list + per-pane chart state. */
    toJSON(): ISciFinanceChartState;
    /**
     * Apply previously-captured visible ranges to each pane's x-axis.
     * Must be called AFTER `autoRange:Once` has fired (i.e. after data load and
     * the createWithStudies render cycle completes), otherwise auto-range
     * overwrites the restored range.
     */
    applyVisibleRanges(ranges: Record<string, IVisibleRangeState>): void;
    /**
     * Reconstruct annotations on each pane from a previously-captured map. Uses
     * SciChart's typed-serialization registry — the type identifiers must already
     * be registered (see {@link registerDrawingTools}) or `createType` returns null.
     *
     * After adding annotations each paint-bearing surface is forced through a
     * render cycle (`invalidateElement` + `await nextStateRender`). In sub-chart
     * mode the pane's own surface is a {@link SciChartSubSurface} whose render
     * loop is dormant — the parent {@link SciChartSurface} owns the canvas and
     * the active paint cycle, so invalidating the sub-surface is silently lost.
     * The same paint-bearer indirection is used by `createWithStudies` to commit
     * the initial paint (see comment near line 350).
     *
     * Without this, `surface.annotations.add(...)` attaches the annotation but
     * the canvas never repaints, so restored drawings stay invisible until some
     * unrelated mutation (zoom, pan, resize) forces the next render.
     */
    applyAnnotations(annotations: Record<string, ISerializedAnnotation[]>): Promise<void>;
    /**
     * Remove every user-drawn annotation from every pane. Study-internal
     * annotations (RSI overbought/oversold lines, OHLC current-price line,
     * MACD palette boxes, the historical-load overlay, etc.) are left
     * intact — only annotations tracked in {@link drawingAnnotations}
     * are removed, which is the same set that {@link collectAnnotations}
     * serialises and the drawing-tools list renders.
     *
     * Used by the "Clear all drawings" reset button in the Drawing Tools
     * drawer.
     */
    clearAllDrawings(): void;
    /**
     * Restore a SciFinanceChart from serialized state.
     *
     * Re-creates the data feed and attaches studies via StudyProvider.
     * Layout state (pane sizes, coordination) is NOT included — that's
     * owned by PaneGroup and restored separately by the layout component.
     */
    static fromJSON(layoutApi: IChartPaneLayoutApi, state: ISciFinanceChartState, services?: ISciFinanceChartServices, extra?: Pick<ISciFinanceChartPredefinedStudiesOptions, "surfaceConfig" | "axisDefaults" | "paneSizing" | "maxPanes" | "theme">): Promise<SciFinanceChart>;
    /**
     * Suspends rendering on every pane surface (and, in sub-chart mode, the parent
     * paint-bearer). Reference-counted — nested calls only cycle the underlying
     * surfaces on the outermost suspend/resume pair.
     *
     * Pairs with {@link resumeAll}. SciChart's `ISuspendable` is a counter on the
     * surface itself: `suspendUpdates()` increments, `resumeUpdates()` decrements.
     * No suspender token is captured.
     */
    suspendAll(): void;
    /** Resumes the surfaces snapshotted by the matching {@link suspendAll}. */
    resumeAll(): void;
    /**
     * Set every pane's xAxis to show the full extent of currently-loaded data
     * (`[0, xValues.length - 1]`) — explicit replacement for SciChart's
     * `zoomExtents`. The chart's axes are configured `EAutoRange.Never`, so
     * range writes are always our responsibility.
     */
    applyFitAllRange(): void;
    /**
     * Plan instant-paint-on-interval-switch — synchronously update the
     * chart's axis state for an upcoming `(interval, period)` while
     * hiding the visible content. Renderable series and annotations
     * stay attached but get flipped invisible, so a `setBaseXValues`
     * swap and `visibleRange` write don't have to wait for the data
     * refetch. When the real data lands and
     * {@link revealAfterIntervalSwitch} runs, candles + indicators
     * appear in the already-correct axis grid.
     *
     * Called by {@link changeInterval} inside its existing
     * `suspendAll/resumeAll` bracket, with the period the switch lands
     * on (the interval's default in free mode).
     *
     * Returns `true` when prepaint applied (caller skips the legacy
     * `restoreTimeRanges` fallback), `false` for non-paintable inputs
     * (ALL period, degenerate fetch plan) where the caller falls back
     * to the legacy snapshot/restore path.
     *
     * @see docs/plans/data-loading-revisit/plan-instant-paint-on-interval-switch.md
     */
    prepaintForIntervalSwitch(interval: CandleInterval, period: TPeriod, nowMs?: number): boolean;
    /**
     * Plan instant-paint-on-interval-switch — restore visibility of
     * every renderable series and annotation hidden by the matching
     * {@link prepaintForIntervalSwitch}. Should be called inside a
     * `suspendAll/resumeAll` bracket so the reveal lands in one frame.
     *
     * Reads the prior values from `prepaintRsSnapshot` /
     * `prepaintAnnSnapshot`, so a renderable series or annotation that
     * the USER had set hidden before the switch stays hidden after.
     * Items that were ADDED to the surface during the prepaint window
     * (e.g. a study's late attach) default to visible — they had no
     * snapshot entry, so the fallback is "show."
     *
     * Idempotent — calling it without a matching prepaint is a no-op
     * because the snapshot maps are empty.
     */
    revealAfterIntervalSwitch(): void;
    detachStudy(study: IStudy): void;
    attachStudy(study: IStudy): Promise<void>;
    /**
     * Inside a non-default pane's surfaceConfig: build the ChartPane, register it in
     * `chartPanes`, join the vertical group, fire `onPaneAdd`, then attachStudy each of
     * the pane's studies (which will hit the existing-pane branch since the pane is now
     * registered). Holding this open inside the surfaceConfig keeps SciChartReact's
     * initFn — and therefore ChartGroupLoader's fallback — gated on data + render.
     */
    registerPaneAndAttachStudies(paneId: PaneId, chart: IChart, paneStudies: IStudy[]): Promise<void>;
    toggleChartPane(paneId: PaneId): void;
    /** Show x-axis labels only on the last pane. Called after addXAxis since applyLabelRules may fire before axes exist. */
    applyXAxisLabels(): void;
    /**
     * The HTML element rendered inside the chart-settings {@link HtmlCustomAnnotation}.
     * Available once {@link applyChartSettingsButton} has run (after `createWithStudies` completes).
     * Consumers use this as a React `createPortal` container to render a settings button.
     */
    get chartSettingsButtonElement(): HTMLElement | undefined;
    /**
     * Number of panes currently alive on the chart. A pane closed via the
     * layout's control bar deletes its SciChartSurface (`removeChart` →
     * `surface.delete()` → `isDeleted`) but does not always remove the
     * `chartPanes` entry, so `chartPanes.size` can over-count. Filtering by
     * live surfaces gives the true pane count the `maxPanes` cap should use.
     */
    livePaneCount(): number;
}
```

</details>

### ISciFinanceChartPanelApi.paneGroupApi {#panegroupapi}

```ts
/** Pane group API — pane management, coordination, visibility, sizing, events. */
readonly paneGroupApi: IPaneApi;
```

The pane group: headless state for the chart's panes, and the coordination between their SciChart surfaces. It doesn't draw anything itself.

- **Layout:** pane order, direction, reordering and swapping.
- **Visibility:** showing, hiding and maximising panes.
- **Sizing:** pane sizes.
- **Chart coordination:** axis sync and pane groups.
- **Events:** `orderChanged`, `visibilityChanged`, `expandedChanged`, `sizeChanged`, `directionChanged`, `axisSyncChanged` and more.

```ts
const group = financeChartPanel.paneGroupApi; // IPaneApi
group.orderChanged.subscribe((slots) => saveLayout(slots));
```

#### The IPaneApi Interface

`IPaneApi` is the pane group's interface. It is made of smaller interfaces, one per area:

| Interface | What it covers |
| --- | --- |
| `IPaneLifecycle` | Adding and removing panes |
| `IPaneLayout` | Pane order and layout direction |
| `IPaneVisibility` | Showing, hiding and maximising panes |
| `IPaneSizing` | Pane sizes, and locking a pane to a fixed size |
| `IPaneChartCoordination` | Axis sync, vertical and horizontal groups, axis label visibility |
| `IPaneGetters` | Reading the current state of a pane or the whole group |
| `IPaneStatePersistence` | Snapshots, and the layout part of `toJSON` |
| `IPaneEvents` | Events for every change |

On a finance chart, the chart creates and initialises the pane group, and `financeChartPanel.cleanup()` disposes it. Don't call `init`, `getChartInitializer`, `fromJSON` or `cleanup` on `paneGroupApi` yourself. To add a pane, use [`financeChartPanel.addCustomPane`](#addcustompane) for your own content, or attach a study for a chart pane.

<details>
<summary>The IPaneApi interface and its member interfaces, with their TSDoc</summary>

```ts
/**
 * Headless, framework-agnostic pane state manager with SciChart coordination.
 *
 * Tracks logical pane state (order, visibility, expanded, sizes) and coordinates
 * SciChart surfaces (axis sync, grouping, label visibility). Does not create DOM
 * or UI - the layout component drives `IPaneApi` imperatively.
 *
 * Created via {@link SciChartPaneApi.createPaneManager} or {@link SciChartPaneApi.createSubChartPaneManager}.
 */
interface IPaneApi extends
    IPaneLifecycle,
    IPaneLayout,
    IPaneVisibility,
    IPaneSizing,
    IPaneChartCoordination,
    IPaneGetters,
    IPaneStatePersistence,
    IPaneEvents {}
```

```ts
/** Pane creation and destruction. */
interface IPaneLifecycle {
    /** Initialize with pane configs. Must be called exactly once after creation. */
    init(config: IPaneInitConfig): TPaneInitEntry[];

    /** Add a custom (non-chart) pane to the layout. Returns an init entry (no `initFn`). */
    addCustomPane(config: ICustomPaneConfig, options?: { at?: number }): TCustomPaneInitEntry;

    /**
     * Create an initializer entry for a new chart pane. The pane is **not** registered
     * until `initFn` is called - it will not appear in {@link IPaneApi.getAllPanes} until then.
     *
     * - **Multi-chart mode**: pass `entry.initFn` to `SciChartReact.initChart`.
     * - **Sub-chart mode**: call directly (`await entry.initFn(rootElement)`) to create the sub-surface.
     */
    getChartInitializer(config: IChartPaneConfig, options?: { at?: number }): IChartInitEntry;

    /** Dispatch to {@link getChartInitializer} or {@link addCustomPane} based on config type. */
    getPaneInitializer(config: IPaneConfig, options?: { at?: number }): TPaneInitEntry;

    /** Permanently remove a pane by id. Fires {@link IPaneApi.paneRemoved} before removal. */
    removePane(id: LayoutPaneId): void;

    /**
     * Terminal disposal — fires {@link IPaneApi.paneRemoved} for each pane, disposes all
     * chart surfaces via {@link IChartLifecycle.cleanup}, clears internal state, and
     * unsubscribes all event listeners. Safe to call multiple times.
     * After cleanup, call {@link init} to re-initialize.
     */
    cleanup(): void;
}

/** Pane ordering and layout direction. */
interface IPaneLayout {
    /** Move a pane to a target visual index. */
    reorderPane(id: LayoutPaneId, toIndex: number): void;
    /** Swap the visual positions of two panes. */
    swapPanes(idA: LayoutPaneId, idB: LayoutPaneId): void;
    /** Change the layout direction (column = vertical stack, row = horizontal). */
    setDirection(direction: LayoutDirection): void;
}

/** Pane visibility and expand/collapse. */
interface IPaneVisibility {
    /** Show or hide a pane. Hidden panes remain in the snapshot with `isVisible: false`. */
    setVisible(id: LayoutPaneId, visible: boolean): void;
    /** Toggle a pane's visibility. */
    toggleVisible(id: LayoutPaneId): void;
    /** Expand a single pane to focus mode, or pass `null` to restore all. */
    setExpanded(id: LayoutPaneId | null): void;
    /** Toggle expanded state for a pane. */
    toggleExpanded(id: LayoutPaneId): void;
}

/** Pane sizing. */
interface IPaneSizing {
    /** Set a single pane's size in absolute pixels along the layout axis. Also converts sizeConfig to grow-based. */
    setPaneSize(id: LayoutPaneId, sizeInPixels: number): void;
    /** Set multiple pane sizes in one call. Also converts sizeConfig to grow-based. */
    setPaneSizes(sizes: Array<{ id: LayoutPaneId; size: number }>): void;
    /** Lock a pane to a fixed pixel size. The pane won't flex until dragged or unlocked. */
    lockPaneSize(id: LayoutPaneId, sizeInPixels: number): void;
    /** Unlock a pane — converts its absolute size to a grow weight so it participates in flex layout. */
    unlockPaneSize(id: LayoutPaneId): void;
}

/**
 * Chart coordination - axis sync, grouping, label visibility.
 * When `id` is omitted, applies to all chart panes.
 */
interface IPaneChartCoordination {
    /** Enable or disable automatic axis synchronization on layout mutations. */
    toggleAxisSync(enable: boolean): void;
    /** Add axis to a sync group. Omit `id` to sync all chart panes. */
    syncAxis(id?: LayoutPaneId, config?: IAxisSyncConfig): void;
    /** Remove axis from its sync group. Omit `id` to unsync all chart panes. */
    unsyncAxis(id?: LayoutPaneId, options?: IAxisSyncConfig): void;
    /** Add to a vertical group (aligns x-axis widths). Omit `id` to add all chart panes. */
    addToVerticalGroup(id?: LayoutPaneId, groupId?: string): void;
    /** Remove from vertical group. Omit `id` to remove all chart panes. */
    removeFromVerticalGroup(id?: LayoutPaneId): void;
    /** Add to a horizontal group (aligns y-axis heights). Omit `id` to add all chart panes. */
    addToHorizontalGroup(id?: LayoutPaneId, groupId?: string): void;
    /** Remove from horizontal group. Omit `id` to remove all chart panes. */
    removeFromHorizontalGroup(id?: LayoutPaneId): void;
    /** Show or hide axis labels. Omit `id` to set for all chart panes. */
    setAxisLabelsVisible(id: LayoutPaneId | undefined, visible: boolean, axisId?: string): void;
}

/** Read-only pane getters. */
interface IPaneGetters {
    /** Whether the pane is currently visible. Returns `false` if the pane does not exist. */
    isVisible(id: LayoutPaneId): boolean;
    /** Whether the pane is currently expanded. Returns `false` if the pane does not exist. */
    isExpanded(id: LayoutPaneId): boolean;
    /** Visual index of the pane in the current order. Returns `-1` if the pane does not exist. */
    getPaneOrder(id: LayoutPaneId): number;
    /** Pixel size of the pane, or `undefined` if not explicitly set or pane does not exist. */
    getPaneSize(id: LayoutPaneId): number | undefined;
    /** Whether a pane is currently locked to an absolute pixel size. */
    isSizeLocked(id: LayoutPaneId): boolean;
    /** Current layout direction. */
    getDirection(): LayoutDirection;
    /** Total number of panes, including hidden ones. */
    getPaneCount(): number;
    /** The id of the currently expanded pane, or `null` if none. */
    getExpandedId(): LayoutPaneId | null;
    /** Returns the pane slot with the given id, or `undefined` if not found. */
    getPane(id: LayoutPaneId): PaneSlot | undefined;
    /** All pane slots in visual order. Equivalent to `snapshot().slots`. */
    getAllPanes(): readonly PaneSlot[];
    /** Returns the chart instance for the given pane, or `undefined` if not a chart pane or not yet initialized. */
    getChart(id: LayoutPaneId): IChart | undefined;
    /** All chart instances managed by the underlying DashboardApi. */
    getAllCharts(): IChart[];
    /** Whether the given pane's axis is currently in a sync group. */
    isAxisSynced(id: LayoutPaneId, axisId?: string): boolean;
    /** Whether the given pane's axis labels are currently visible. */
    isAxisLabelsVisible(id: LayoutPaneId, axisId?: string): boolean;
    /** Returns the vertical group id for the given pane, or `undefined` if not in a group. */
    getVerticalGroupId(id: LayoutPaneId): string | undefined;
    /** Returns the horizontal group id for the given pane, or `undefined` if not in a group. */
    getHorizontalGroupId(id: LayoutPaneId): string | undefined;
}

/** State snapshot and persistence. */
interface IPaneStatePersistence {
    /** Return an immutable point-in-time snapshot of all pane state. */
    snapshot(): LayoutSnapshot;
    /** Serialize state to a plain object suitable for `JSON.stringify`. */
    toJSON(options?: IPaneApiSerializationOptions): IPaneApiState;
    /**
     * Restore state from a previously serialized {@link IPaneApiState}.
     * Must call {@link cleanup} first if already initialized.
     * Returns chart init entries when `chartCoordination` is present, so consumers
     * can mount surfaces into DOM elements.
     */
    fromJSON(data: IPaneApiState): IChartInitEntry[];
}

/** Layout and chart coordination events. */
interface IPaneEvents {
    /** Fires synchronously after every mutation with a fresh {@link LayoutSnapshot}. */
    stateChanged: EventHandler<LayoutSnapshot>;
    /** Fires after a pane is added via {@link IPaneLifecycle.init}, {@link IPaneLifecycle.addCustomPane}, or when a {@link IPaneLifecycle.getChartInitializer} `initFn` executes. */
    paneAdded: EventHandler<PaneSlot>;
    /** Fires before a pane is removed via {@link IPaneLifecycle.removePane} or {@link IPaneLifecycle.cleanup} (slot is still valid). */
    paneRemoved: EventHandler<PaneSlot>;
    /** Fires after expand state changes via {@link IPaneVisibility.setExpanded} or {@link IPaneVisibility.toggleExpanded}. */
    expandedChanged: EventHandler<LayoutPaneId | null>;
    /** Fires after pane order changes via {@link IPaneLayout.reorderPane} or {@link IPaneLayout.swapPanes}. */
    orderChanged: EventHandler<readonly PaneSlot[]>;
    /** Fires after a pane's visibility changes via {@link IPaneVisibility.setVisible} or {@link IPaneVisibility.toggleVisible}. */
    visibilityChanged: EventHandler<IPaneVisibilityChangedArgs>;
    /** Fires after layout direction changes via {@link IPaneLayout.setDirection}. */
    directionChanged: EventHandler<LayoutDirection>;
    /** Fires after a pane's size changes via {@link IPaneSizing.setPaneSize} or {@link IPaneSizing.setPaneSizes}. */
    sizeChanged: EventHandler<IPaneSizeChangedArgs>;
    /** Fires once all init functions returned by {@link IPaneLifecycle.init} have been executed. */
    allPanesInitialized: EventHandler<void>;
    /** Fires after a chart pane's axis sync state changes. */
    axisSyncChanged: EventHandler<IAxisSyncChangedArgs>;
    /** Fires after a chart pane is added to or removed from a horizontal group. */
    horizontalGroupChanged: EventHandler<IGroupChangedArgs>;
    /** Fires after a chart pane is added to or removed from a vertical group. */
    verticalGroupChanged: EventHandler<IGroupChangedArgs>;
}

/** Snapshot of a single pane slot's state within a {@link LayoutSnapshot}. */
type PaneSlot = {
    id: LayoutPaneId;
    /** The pane's config as provided to {@link IPaneApi.init} or {@link IPaneApi.addCustomPane}. */
    config: IPaneConfig;
    isVisible: boolean;
    isExpanded: boolean;
    /** Absolute pixels along the layout axis. Populated by {@link IPaneApi.setPaneSize}. */
    size?: number;
    /** Configured sizing hint. Hoisted from `config.sizeConfig` for renderer convenience. */
    sizeConfig?: IPaneSizeConfig;
};

/** Point-in-time snapshot of the full pane layout state emitted by {@link IPaneApi.stateChanged}. */
type LayoutSnapshot = {
    direction: LayoutDirection;
    /** Panes in visual order. Hidden panes included with `isVisible: false`. */
    slots: readonly PaneSlot[];
    /** The id of the currently expanded (maximized) pane, or `null` if none. */
    expandedId: LayoutPaneId | null;
};
```

</details>

See [PaneGroup](/financial-charts/layout/#panegroup) for how the layout uses it.

## ISciFinanceChartPanelApi Methods {#methods}

### ISciFinanceChartPanelApi.addCustomPane {#addcustompane}

```ts
/**
 * Add a custom (non-chart) pane alongside the finance chart panes, with `content` inside it
 * when given: an `HTMLElement` for the vanilla `SciFinanceChartPanel`, a `ReactNode` for the
 * React `SciFinanceChartView`.
 */
addCustomPane(content?: TPaneContent): void;
```

Adds a pane that isn't a chart, such as an order list or news feed, beside the chart's panes. It is laid out, resized and reordered like the others. Pass an `HTMLElement` in plain TypeScript, or a `ReactNode` in React, and it is placed inside the new pane.

```ts
const news = document.createElement("div");
news.textContent = "Market news";
financeChartPanel.addCustomPane(news);
```

### ISciFinanceChartPanelApi.setPaneControls {#setpanecontrols}

```ts
/**
 * Change the panes' control bar and dividers; only the options given change. For example,
 * `setPaneControls({ touch: true })` when the page switches to its phone layout.
 */
setPaneControls(options: IPaneControlOptions): void;
```

Changes each pane's control bar and the dividers between panes, on a live chart. Only the options you pass change. For example, switch to the touch layout when the page goes to its phone layout:

```ts
financeChartPanel.setPaneControls({ touch: true });
```

The options are the same as the [`paneControls` config option](/financial-charts/finance-chart-api/chart-config/#panecontrols). See [Pane controls](/financial-charts/layout/#pane-controls).

#### The IPaneControlOptions Interface

| Option | Type | What it does |
| --- | --- | --- |
| `visible` | `boolean` | Show each pane's control bar. Default: `true` |
| `touch` | `boolean` | The touch layout for phones and tablets: the control bar sits in a drawer at each pane's edge, and the dividers are easier to grab. Default: `false` |
| `buttons` | `IPaneControlBarButtons` | Buttons to leave out of the control bar, e.g. `{ axisSync: false }`. Default: all shown |

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

### ISciFinanceChartPanelApi.getPaneInfoElement {#getpaneinfoelement}

```ts
/**
 * The info area at the start of a pane's control bar, for the host's own content, such as a
 * candle counter on the price pane (`PaneId.DEFAULT.value`). Hidden while empty. The same
 * element is kept while the pane exists. `undefined` if there is no such pane.
 */
getPaneInfoElement(paneId: string): HTMLElement | undefined;
```

Returns the info area at the start of a pane's control bar, for your own content. It is hidden while empty, and stays the same element for as long as the pane exists. Returns `undefined` if there is no such pane.

```ts
import { CandleCounter, PaneId } from "scichart-scitrader";

CandleCounter.create(financeChartPanel.getPaneInfoElement(PaneId.DEFAULT.value), {
    chart: financeChartPanel.financeApi,
});
```

In React, use the `paneInfo` prop of `<SciFinanceChartView>` instead. See [Your own content in the control bar](/financial-charts/layout/#your-own-content-in-the-control-bar).

### ISciFinanceChartPanelApi.toJSON {#tojson}

```ts
/** Serialize the full panel state — finance + layout. */
toJSON(): ISciFinanceChartPanelState;
```

Returns the whole chart's state, ready for `JSON.stringify`.

#### The ISciFinanceChartPanelState Interface

The state is an `ISciFinanceChartPanelState`:

| Field | Type | What it holds |
| --- | --- | --- |
| `finance` | `ISciFinanceChartState` | Exchange, symbol, interval, period, studies, drawings and live-tip mode |
| `layout` | `IPaneApiState` | Pane order, sizes, visibility, the maximised pane and axis sync |
| `useSubCharts` | `boolean` (optional) | Whether the chart used sub-charts when it was saved |

The zoom and pan position is saved in `finance.visibleRanges` but isn't restored. See [What is not restored](/financial-charts/save-and-restore/#what-is-not-restored).

<details>
<summary>The ISciFinanceChartPanelState, ISciFinanceChartState and IPaneApiState interfaces, with their TSDoc</summary>

```ts
/**
 * Combined serialized state — finance chart + pane layout + session UI state.
 *
 * Returned by `toJSON()` on both vanilla and React wrappers.
 * Pass to `fromJSON()` to restore the full panel state.
 *
 * **Captured + restored on Import:**
 * - Data feed config (exchange, symbol, interval) and study list (per-pane).
 * - Pane layout: direction, global axis sync, expanded pane, per-pane sizes,
 *   visibility, per-pane axis-sync override, per-pane V-/H-group membership.
 * - User-drawn annotations (lines, fibs, channels, etc.) — round-tripped via
 *   SciChart's typed-serialization protocol; study-internal annotations are
 *   filtered out by {@link SciFinanceChart.drawingTypeNames}.
 * - Sub-chart layout mode and the page's currently-selected drawing tool.
 *
 * **Captured but NOT applied**:
 * - {@link ISciFinanceChartState.visibleRanges} — pan/zoom position is
 *   captured in absolute CategoryAxis indices, but those indices shift as
 *   historical data loads, so a range captured in session A may land on
 *   non-existent indices in session B. Restoration is deliberately disabled
 *   pending a data-aware redesign (relative-to-end offsets or timestamps).
 *   The chart's own `autoRange:Once` shows recent data on Import, which
 *   matches user expectation in most cases.
 */
interface ISciFinanceChartPanelState {
    /** Serialized finance chart state — feed config + study list + per-pane chart state (visible range, annotations). */
    finance: ISciFinanceChartState;
    /** Serialized pane layout state — pane order, sizes, coordination. */
    layout: IPaneApiState;
    /**
     * Sub-chart layout mode at export time. When restored on Import, the host page
     * should adopt this mode (in addition to passing the rest of the state through
     * `restoreState`) so the imported file's layout matches the user's original.
     */
    useSubCharts?: boolean;
}
```

```ts
/** Serialized state of a SciFinanceChart — data feed config + attached studies + chart UI state. */
interface ISciFinanceChartState {
    /** Exchange name (e.g. "Binance"). */
    exchangeName: string;
    /** Trading symbol (e.g. "BTCUSDT"). */
    symbol: string;
    /** Candle interval (e.g. "1d"). */
    interval: CandleInterval;
    /**
     * Currently-selected preset period (e.g. `"3M"`). Optional — when present,
     * `fromJSON` calls `setPeriod(period)` after restoring the rest of the state,
     * so the visible range matches what the user had selected at export time.
     * Older serialized state without this field restores as if no period was set.
     */
    period?: TPeriod;
    /** Attached studies in order. */
    studies: IStudyState[];
    /**
     * Per-pane x-axis visible range, keyed by `paneId.value`. Captures pan/zoom state
     * so reloads or imports can land the user back where they were looking.
     * Restored after `createWithStudies` completes (autoRange:Once has fired by then).
     */
    visibleRanges?: Record<string, IVisibleRangeState>;
    /**
     * Per-pane drawing annotations, keyed by `paneId.value`. Each annotation is captured
     * via SciChart's typed-serialization framework (`type` registered in `registerType`,
     * options captured by `annotation.toJSON()`). Restored via `createType`.
     */
    annotations?: Record<string, ISerializedAnnotation[]>;
    /**
     * Live-tip slide policy in effect when the state was serialized. Optional —
     * older exports omit it and `fromJSON` falls back to the chart's default
     * (`"follow"`). Restored before `setPeriod` so any chained pan/zoom math
     * sees the right mode.
     */
    liveTipMode?: "follow" | "anchored";
}

/** Serialized pane state produced by {@link IPaneApi.toJSON} and consumed by {@link IPaneApi.fromJSON}. */
interface IPaneApiState {
    direction: LayoutDirection;
    axisSyncEnabled: boolean;
    expandedId: LayoutPaneId | null;
    panes: Array<{
        id: LayoutPaneId;
        config: IPaneConfig;
        isVisible: boolean;
        size?: number;
    } & IPaneCoordinationIntent>;
    /** Live chart coordination state from DashboardApi. When present, fromJSON restores full chart state. */
    chartCoordination?: IChartDashboardConfig;
}
```

</details>

Pass it to `SciFinanceChartPanel.fromJSON` to restore the chart. See [Saving and restoring](/financial-charts/save-and-restore/).

### ISciFinanceChartPanelApi.cleanup {#cleanup}

```ts
/** Teardown and clean up all resources. */
cleanup(): void;
```

Destroys the chart: it stops its data feeds, unsubscribes its events, and deletes its SciChart surfaces and panes. Call it when the chart's container goes away, so the WebGL and WebAssembly resources are freed. Don't use `financeChartPanel` afterwards.

`<SciFinanceChartView>` calls it for you when it unmounts.

```ts
financeChartPanel.cleanup();
```

## Loading state on the container

While `create` or `fromJSON` runs, the container has a `data-chart-loading` attribute. When the chart is ready it is replaced by `data-chart-ready`. Use them to style the container while it loads, e.g. `#chart[data-chart-loading] { opacity: 0.5; }`.

#### See also

- [Chart configuration](/financial-charts/finance-chart-api/chart-config/)
- [Getting started](/financial-charts/getting-started/)
- [Symbols, intervals and periods](/financial-charts/symbols-intervals-periods/)
- [Layout](/financial-charts/layout/)
- [Saving and restoring](/financial-charts/save-and-restore/)
