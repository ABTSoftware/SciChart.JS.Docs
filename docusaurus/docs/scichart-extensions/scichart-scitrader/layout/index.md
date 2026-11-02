---
sidebar_position: 9
sidebar_label: Layout, Panes and PaneGroup
title: "Multi-Pane Layout, Pane Controls and PaneGroup | SciTrader.js"
description: "Lay out SciTrader.js trading charts in vertical or horizontal panes with synchronised axes, pane control bars, touch layouts and loading states."
keywords: ["SciTrader", "SciTrader.js", "multi-pane financial chart", "synchronised chart panes", "trading chart layout"]
---

# Layout: panes, controls and PaneGroup

`SciFinanceChart` doesn't create any DOM itself. It asks a **layout** for chart panes through the `IChartPaneLayoutApi` interface. `SciFinanceChartPanel` and `<SciFinanceChartView>` create one for you, `SciChartPaneSplitter`, and pass its options through: this page covers those options, and the layout underneath for when you want to build your own.

The layout has three layers, from highest to lowest:

| Layer | API | Role |
|---|---|---|
| Layout component | `SciChartPaneSplitter` (React: inside `<SciFinanceChartView>`) | The DOM: panes, drag dividers, per-pane control bars, the strip that restores hidden panes, loading placeholders |
| **PaneGroup** | `financeChartPanel.paneGroupApi`, or `SciChartPaneApi.createPaneManager()` | Headless pane state: order, sizes, visibility, direction, maximise |
| DashboardApi | internal | SciChart surfaces: creation, axis sync, vertical and horizontal groups |

## Multi-chart and sub-chart modes

Every layout supports two modes, selected by `useSubCharts`:

- **Sub-chart** (`true`, the default): all panes are sub-surfaces of a single `SciChartSurface`. There is one WebGL context and one render loop, which is the fastest option with many panes.
- **Multi-chart** (`false`): each pane is an independent `SciChartSurface`.

To switch modes, rebuild: in plain TypeScript, `cleanup()` and create again; in React, change the `key`. Save the state first to keep the studies and layout ([Saving and restoring](/scichart-extensions/scichart-scitrader/save-and-restore/)).

The **Multi-Pane Layout** example below switches between sub-chart and multi-chart modes, stacked and side by side, toggles axis sync, adds a custom pane, and switches the touch layout and control bar.

## Pane controls

Each pane has a **control bar**, shown while the pointer is over the pane. Its buttons:
- **Lock size** keeps the pane at its current size while others are resized.
- **Y-axis autorange** turns the pane's automatic vertical scaling on or off.
- **Move** up and down (left and right when side by side).
- **Maximise** the pane, or restore the others.
- **Hide** the pane. It comes back from the **restore strip** below the panes, where each hidden pane is a pill named after its studies, such as "RSI".
- **Close** the pane, detaching its studies.

**Dividers** between panes resize them by dragging, with the mouse or by touch. A drag skips locked panes, and carries on into the next pane once its neighbour reaches the minimum size (100 px).

`paneControls` sets up the control bar and dividers:

```ts
const financeChartPanel = await SciFinanceChartPanel.create(container, {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.ONE_DAY,
    period: "6M",
    lockPeriodWidth: false,
    useSubCharts: true,
    direction: "column",
    paneSizing: { [PaneId.DEFAULT.value]: { grow: 4 } },
    paneControls: { touch: false }, // the touch layout, for phones and tablets
    studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy(), new MACDStudy(), new StochasticStudy()],
});

// Later, e.g. when the page switches to its phone layout:
financeChartPanel.setPaneControls({ touch: true });
```

| Option (`IPaneControlOptions`) | Default | Meaning |
|---|---|---|
| `visible` | `true` | Show each pane's control bar. |
| `touch` | `false` | The layout for phones and tablets. Each control bar sits in a drawer at the pane's right edge, opened by tapping or swiping its handle, because touch screens have no hover. Dividers get a wider hit area with grip dots. |
| `buttons` | all on | Buttons to leave out, e.g. `{ close: false }`: `lockSize`, `yAxisAutoRange`, `move`, `maximize`, `hide`, `close`, `axisSync`, `verticalGroup`, `horizontalGroup`. |

- **The chart doesn't detect touch screens.** Your page decides, usually from its own breakpoint, and switches a live chart with `setPaneControls`, which changes only the options given.
- **Axis sync and the V-/H-group toggles are off.** A finance chart keeps every pane's X axis in step itself, so it leaves those three buttons out. Turn them on with `buttons: { axisSync: true, … }`.
- **React.** `<SciFinanceChartView paneControls={…}>` applies changes to the live chart, unlike `config`.

<CenteredImageWrapper src={require("../_examples/layoutState_MultiPane/screenshot.png").default} title="Multi-Pane Layout" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/layoutState_MultiPane/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/layoutState_MultiPane/react.tsx
    ```
</CodeSnippetBlock>

### Your own content in the control bar

The control bar starts with an info area for your content, such as the SDK's [candle counter](/scichart-extensions/scichart-scitrader/ui-components/#candle-counter). It is hidden while empty. In plain TypeScript, `financeChartPanel.getPaneInfoElement(paneId)` returns the element to fill; in React, `paneInfo` renders into it:

```tsx
<SciFinanceChartView
    config={config}
    paneInfo={(paneId) =>
        paneId === PaneId.DEFAULT.value && chart ? <CandleCounter chart={chart.financeApi} /> : null
    }
/>
```

`PaneId.DEFAULT` is the price pane. Return `null` to leave a pane's area empty.

## Loading states

A pane shows what is happening while its data loads:
- **Until its chart is ready,** each pane shows a shimmering skeleton (`.st-pane-skeleton`), or content of your own.
- **While a symbol or interval switch loads,** each chart pane is covered by a translucent shimmer that also blocks input (`.st-pane-loading-overlay`).

`loading` (`IPaneLoadingOptions`) changes them:

| Option | Default | Meaning |
|---|---|---|
| `placeholder` | `true` | `true` for the skeleton, `false` for nothing, or a function `(paneId) => HTMLElement` for your own content. |
| `onPlaceholderRemoved` | none | Called with each placeholder when its pane's chart is ready, to clean up what you put in it. |
| `overlay` | `true` | Whether to show the switch overlay. |

**Progress dots.** The SDK has a placeholder that follows a pane's loading phases: three dots and a caption ("Initialising surface", "Configuring chart", "Loading data"). The chart reports the phases to a `PaneProgressEmitter` passed as `services.progress`. In React, give `<SciFinanceChartView>` a `paneLoadingContent`:

```tsx
// One emitter per mounted chart: the chart reports each pane's loading phases to it.
const progress = React.useMemo(() => new PaneProgressEmitter(), [mount]);

const config = React.useMemo<ISciFinanceChartPanelConfig>(
    () => ({ /* … */ services: { progress } }),
    [progress]
);

<SciFinanceChartView
    key={mount}
    config={config}
    paneLoadingContent={(paneId) => <PaneProgressDots emitter={progress} paneId={paneId} />}
/>
```

In plain TypeScript, `loading: paneProgressDotsLoading(progress)` does the same, and `createPaneProgressDots(emitter, paneId)` gives one pane's dots for a placeholder of your own.

<CenteredImageWrapper src={require("../_examples/layoutState_Loading/screenshot.png").default} title="Loading States and Pane Info" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/layoutState_Loading/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/layoutState_Loading/react.tsx
    ```
</CodeSnippetBlock>

## IChartPaneLayoutApi

This is what a layout implements to host a `SciFinanceChart`:

| Method | Called when |
|---|---|
| `createChartPane(config)` → `Promise<SciChartSurface>` | A study needs a new pane |
| `removeChartPane(id)` | A pane's last study is detached |
| `setExpanded(id \| null)` / `isExpanded(id)` | Maximising a pane, or restoring all with `null` |
| `syncAxis(id, config?)` / `unsyncAxis(id)` | Keeping X-axes in step across panes |
| `addToVerticalGroup(id, groupId?)` / `removeFromVerticalGroup(id)` | Aligning Y-axis widths so the plot areas line up |
| `addToHorizontalGroup(id, groupId?)` / `removeFromHorizontalGroup(id)` | Aligning panes placed side by side |
| `setAxisLabelsVisible(id, visible)` | Showing X-axis labels only on the bottom pane |

`SciChartPaneSplitter` implements it. To host the chart in a different layout, implement it yourself, then use `SciFinanceChart.createWithStudies(yourLayoutApi, options)` directly.

## SciChartPaneSplitter

```ts
import { SciChartPaneSplitter } from "scichart-scitrader";

const splitter = await SciChartPaneSplitter.create(container, {
    panes: [],             // SciFinanceChart adds chart panes itself
    direction: "column",
    useSubCharts: true,
    createSuspended: true, // let the chart resume rendering once everything is attached
    paneControls: { touch: false },
});

const chart = await SciFinanceChart.createWithStudies(splitter, { exchangeName, symbol, interval, studies });
```

This is what `SciFinanceChartPanel.create` does. The splitter provides the dividers, the control bars, the restore strip and the loading states described above. A splitter used directly shows every control-bar button, including axis sync and the V-/H-group toggles.

`splitter.group` is its PaneGroup, and `splitter.addCustomPane()` adds a pane that isn't a chart.

## PaneGroup

PaneGroup is the single source of truth for layout state. The splitter reads `snapshot()`, renders it, and changes the layout only through PaneGroup's methods. PaneGroup then re-applies the chart rules itself, including axis labels on the bottom pane only, group membership, axis sync and chart visibility.

```ts
const group = financeChartPanel.paneGroupApi;

group.setDirection("row");
group.reorderPane(paneId, 0);
group.setPaneSizes([{ id: "default", size: 600 }]);
group.lockPaneSize(paneId, 120); // fixed height in pixels
group.toggleExpanded(paneId);   // maximise / restore
group.setVisible(paneId, false);
group.toggleAxisSync(true);     // X-axes in step across every pane

group.stateChanged.subscribe((snapshot) => render(snapshot));
```

**API surface**

| Group | Methods and events |
|---|---|
| Lifecycle | `init`, `addCustomPane`, `getChartInitializer`, `removePane`, `cleanup` |
| Order and layout | `reorderPane`, `swapPanes`, `setDirection` |
| Visibility | `setVisible`, `toggleVisible`, `setExpanded`, `toggleExpanded` |
| Sizing | `setPaneSize`, `setPaneSizes`, `lockPaneSize`, `unlockPaneSize` |
| Coordination | `toggleAxisSync`, `syncAxis`, `unsyncAxis`, `add/removeFromVerticalGroup`, `add/removeFromHorizontalGroup`, `setAxisLabelsVisible` |
| Queries | `getPane`, `getAllPanes`, `getChart`, `isAxisSynced`, `snapshot` |
| Persistence | `toJSON({ includeChartCoordination })`, `fromJSON` |
| Events | `stateChanged`, `paneAdded`, `paneRemoved`, `orderChanged`, `visibilityChanged`, `expandedChanged`, `directionChanged`, `sizeChanged`, `axisSyncChanged`, `verticalGroupChanged`, `horizontalGroupChanged`, `allPanesInitialized` |

`SciChartPaneApi.createPaneManager()` creates a multi-chart group, and `createSubChartPaneManager()` a sub-chart group. The sub-chart group adds `setContainerElement` and `recalculateSubChartPositions`.

When saving a finance chart, use `toJSON({ includeChartCoordination: false })`, which `SciFinanceChartPanel.toJSON` already does: `SciFinanceChart` rebuilds the surfaces itself. The default, `true`, also serialises SciChart surface state, for layouts of plain charts.

## Under PaneGroup

PaneGroup creates and coordinates the SciChart surfaces through an internal layer, `SciChartDashboardApi`. It handles surface creation, axis sync, and the vertical and horizontal groups that line up axes. It isn't exported: use PaneGroup, which offers the same coordination with pane state on top.

`Logger` (`Logger.enable(context)`) traces the layout and data layers when debugging.

## Notes

- **Element ids must be unique.** SciChart tracks surfaces by their element's `id`, so two surfaces in elements with the same id collide, and creating the second silently deletes the first. The SDK gives an element without an id a unique one; ids you set yourself must not repeat.
- **Sub-chart mode stacks DOM layers.** The parent surface sits behind (`z-index: 0`). The flex container of panes sits on top (`z-index: 1`) with `pointer-events: none`, so mouse and touch reach the chart.
- **Legacy classes.** `PaneLayoutManager`, `PaneManager` and `LayoutManager` are superseded by the classes on this page and are not part of the public API.
