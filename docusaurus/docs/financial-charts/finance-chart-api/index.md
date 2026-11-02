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

This is the interface as it is declared in `scichart-scitrader`, with its TSDoc comments:

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

The three properties are getters, so they always return the live objects. Hold on to `financeChartPanel` rather than copying its properties.

## Properties

### isInitialized

```ts
readonly isInitialized: boolean
```

Whether the chart has finished loading, so `financeApi` can be read.

- **Plain TypeScript:** always `true`. `create` and `fromJSON` only resolve once the chart is ready.
- **React:** the `ref` is set as soon as `<SciFinanceChartView>` mounts, before the chart has loaded. Having the ref doesn't mean the chart is ready. Check `isInitialized`, or wait for `onInit`, before touching `financeApi`. This matters for UI that renders straight away and can be clicked while the chart loads, such as a toolbar.

```tsx
const onAddRsi = () => {
    const financeChartPanel = chartRef.current;
    if (financeChartPanel?.isInitialized) {
        financeChartPanel.financeApi.attachStudy(new RSIStudy());
    }
};
```

### financeApi

```ts
readonly financeApi: SciFinanceChart
```

The finance chart itself, and where most of the API lives. It **throws** while `isInitialized` is `false`.

The most used members of `SciFinanceChart`:

| Area | Members | See |
| --- | --- | --- |
| Symbol, interval, period | `setSymbol`, `changeInterval`, `setPeriod`, `currentPeriod`, `createDataFeed`, `removeDataFeed`, `dataFeeds` | [Symbols, intervals and periods](/financial-charts/symbols-intervals-periods/) |
| Studies | `attachStudy(study): Promise<void>`, `detachStudy(study)`, `studies`, `studiesChanged` | [Studies and indicators](/financial-charts/studies-and-indicators/) |
| Candle type | `setCandleType(type)`, `getCandleType()`, `candleTypeChanged` | [Candle types](/financial-charts/studies-and-indicators/#candle-types) |
| Theme and axes | `setTheme(theme)`, `theme`, `themeChanged`, `applyAxisStyle(partial)`, `axisDefaults` | [Styling and themes](/financial-charts/styling-and-themes/) |
| Live tip | `liveTipMode` (`"follow"` or `"anchored"`), `liveTipModeChanged` | [UI components](/financial-charts/ui-components/#toolbar-controls) |
| Panes | `maxPanes`, `paneLimitReached`, `chartPanes`, `toggleChartPane(paneId)`, `getDefaultSurface()` | [Layout](/financial-charts/layout/) |
| Drawings | `clearAllDrawings()`, `finChartModifiers` | [Drawing tools](/financial-charts/drawing-tools/) |
| Loading events | `dataLoadStarted`, `dataRenderComplete`, `historicalLoadStarted`, `historicalLoadComplete` | [Events](/financial-charts/symbols-intervals-periods/#api-at-a-glance) |
| State | `toJSON(): ISciFinanceChartState` (the finance part only) | [Saving and restoring](/financial-charts/save-and-restore/) |

```ts
const chart = financeChartPanel.financeApi; // SciFinanceChart

await chart.attachStudy(new MACDStudy());
await chart.changeInterval(CandleInterval.ONE_DAY, "1Y");
chart.dataRenderComplete.subscribe((args) => console.log("drawn:", args.type));
```

### paneGroupApi

```ts
readonly paneGroupApi: IPaneApi
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

See [PaneGroup](/financial-charts/layout/#panegroup) for its members.

## Methods

### addCustomPane

```ts
addCustomPane(content?: TPaneContent): void
```

Adds a pane that isn't a chart, such as an order list or news feed, beside the chart's panes. It is laid out, resized and reordered like the others. Pass an `HTMLElement` in plain TypeScript, or a `ReactNode` in React, and it is placed inside the new pane.

```ts
const news = document.createElement("div");
news.textContent = "Market news";
financeChartPanel.addCustomPane(news);
```

### setPaneControls

```ts
setPaneControls(options: IPaneControlOptions): void
```

Changes each pane's control bar and the dividers between panes, on a live chart. Only the options you pass change. For example, switch to the touch layout when the page goes to its phone layout:

```ts
financeChartPanel.setPaneControls({ touch: true });
```

The options are the same as the [`paneControls` config option](/financial-charts/finance-chart-api/chart-config/#panecontrols). See [Pane controls](/financial-charts/layout/#pane-controls).

### getPaneInfoElement

```ts
getPaneInfoElement(paneId: string): HTMLElement | undefined
```

Returns the info area at the start of a pane's control bar, for your own content. It is hidden while empty, and stays the same element for as long as the pane exists. Returns `undefined` if there is no such pane.

```ts
import { CandleCounter, PaneId } from "scichart-scitrader";

CandleCounter.create(financeChartPanel.getPaneInfoElement(PaneId.DEFAULT.value), {
    chart: financeChartPanel.financeApi,
});
```

In React, use the `paneInfo` prop of `<SciFinanceChartView>` instead. See [Your own content in the control bar](/financial-charts/layout/#your-own-content-in-the-control-bar).

### toJSON

```ts
toJSON(): ISciFinanceChartPanelState
```

Returns the whole chart's state, ready for `JSON.stringify`:

```ts
interface ISciFinanceChartPanelState {
    /** Data feed, studies, and each pane's visible range and drawings. */
    finance: ISciFinanceChartState;
    /** Pane order, sizes and coordination. */
    layout: IPaneApiState;
    /** Whether the chart used sub-charts when saved. */
    useSubCharts?: boolean;
}
```

Pass it to `SciFinanceChartPanel.fromJSON` to restore the chart. See [Saving and restoring](/financial-charts/save-and-restore/).

### cleanup

```ts
cleanup(): void
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
