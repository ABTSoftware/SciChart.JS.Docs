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

`config` is an `ISciFinanceChartPanelConfig`: the data, studies and layout the chart starts with. [Chart configuration](/scichart-extensions/scichart-scitrader/finance-chart-api/chart-config/) describes every option.

The same object comes from each way of making a chart:

| Created with | Returns | Type |
| --- | --- | --- |
| `SciFinanceChartPanel.create(container, config)` | `Promise<ISciFinanceChartPanelApi<HTMLElement>>` | Resolves once the chart has loaded and drawn |
| `SciFinanceChartPanel.fromJSON(container, state, options?)` | `Promise<ISciFinanceChartPanelApi<HTMLElement>>` | The same, for a [restored chart](/scichart-extensions/scichart-scitrader/save-and-restore/) |
| `<SciFinanceChartView ref={…} onInit={…} />` (React) | `ISciFinanceChartViewApi`, an alias of `ISciFinanceChartPanelApi<React.ReactNode>` | Through `ref` as soon as the view mounts, and `onInit` once the chart is ready |

The type parameter `TPaneContent` is the only difference between them. It is what [`addCustomPane`](#addcustompane) accepts: an `HTMLElement` in plain TypeScript, and a `ReactNode` in React.

## The interface

```ts
interface ISciFinanceChartPanelApi<TPaneContent = unknown> {
    /** Whether the chart has finished initialising, and financeApi is safe to read. */
    readonly isInitialized: boolean;
    /** The finance chart: studies, data feeds, symbol, interval, period, theme, events. Throws until isInitialized. */
    readonly financeApi: SciFinanceChart;
    /** The pane group: pane order, sizes, visibility, axis sync and layout events. */
    readonly paneGroupApi: IPaneApi;

    /** Add a custom (non-chart) pane beside the chart panes, with content inside it. */
    addCustomPane(content?: TPaneContent): void;
    /** Change the panes' control bars and dividers. Only the options given change. */
    setPaneControls(options: IPaneControlOptions): void;
    /** The info area at the start of a pane's control bar, for your own content. */
    getPaneInfoElement(paneId: string): HTMLElement | undefined;
    /** The whole chart's state, finance and layout, as JSON. */
    toJSON(): ISciFinanceChartPanelState;
    /** Destroy the chart and free its resources. */
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
| Symbol, interval, period | `setSymbol`, `changeInterval`, `setPeriod`, `currentPeriod`, `createDataFeed`, `removeDataFeed`, `dataFeeds` | [Symbols, intervals and periods](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/) |
| Studies | `attachStudy(study): Promise<void>`, `detachStudy(study)`, `studies`, `studiesChanged` | [Studies and indicators](/scichart-extensions/scichart-scitrader/studies-and-indicators/) |
| Candle type | `setCandleType(type)`, `getCandleType()`, `candleTypeChanged` | [Candle types](/scichart-extensions/scichart-scitrader/studies-and-indicators/#candle-types) |
| Theme and axes | `setTheme(theme)`, `theme`, `themeChanged`, `applyAxisStyle(partial)`, `axisDefaults` | [Styling and themes](/scichart-extensions/scichart-scitrader/styling-and-themes/) |
| Live tip | `liveTipMode` (`"follow"` or `"anchored"`), `liveTipModeChanged` | [UI components](/scichart-extensions/scichart-scitrader/ui-components/#toolbar-controls) |
| Panes | `maxPanes`, `paneLimitReached`, `chartPanes`, `toggleChartPane(paneId)`, `getDefaultSurface()` | [Layout](/scichart-extensions/scichart-scitrader/layout/) |
| Drawings | `clearAllDrawings()`, `finChartModifiers` | [Drawing tools](/scichart-extensions/scichart-scitrader/drawing-tools/) |
| Loading events | `dataLoadStarted`, `dataRenderComplete`, `historicalLoadStarted`, `historicalLoadComplete` | [Events](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/#api-at-a-glance) |
| State | `toJSON(): ISciFinanceChartState` (the finance part only) | [Saving and restoring](/scichart-extensions/scichart-scitrader/save-and-restore/) |

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

See [PaneGroup](/scichart-extensions/scichart-scitrader/layout/#panegroup) for its members.

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

The options are the same as the [`paneControls` config option](/scichart-extensions/scichart-scitrader/finance-chart-api/chart-config/#panecontrols). See [Pane controls](/scichart-extensions/scichart-scitrader/layout/#pane-controls).

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

In React, use the `paneInfo` prop of `<SciFinanceChartView>` instead. See [Your own content in the control bar](/scichart-extensions/scichart-scitrader/layout/#your-own-content-in-the-control-bar).

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

Pass it to `SciFinanceChartPanel.fromJSON` to restore the chart. See [Saving and restoring](/scichart-extensions/scichart-scitrader/save-and-restore/).

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

- [Chart configuration](/scichart-extensions/scichart-scitrader/finance-chart-api/chart-config/)
- [Getting started](/scichart-extensions/scichart-scitrader/getting-started/)
- [Symbols, intervals and periods](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/)
- [Layout](/scichart-extensions/scichart-scitrader/layout/)
- [Saving and restoring](/scichart-extensions/scichart-scitrader/save-and-restore/)
