---
sidebar_position: 2
sidebar_label: Pane Sizes and Pane State
title: "Pane Sizes, Maximise, Hide and Autorange in Code | SciFinanceChart | SciTrader.js"
description: "Set the sizes of a SciTrader.js trading chart's panes, and maximise, hide, close and autorange them in code, with the same state the pane control bars change. TypeScript and React examples."
keywords: ["SciFinanceChart panes", "chart pane size", "maximise chart pane", "hide indicator pane", "y-axis autorange", "paneSizing", "paneGroupApi", "multi-pane trading chart", "SciTrader.js"]
---

# Pane Sizes and Pane State

A chart has a price pane, and a pane for each study that needs one, such as RSI or MACD. Each pane's control bar lets the user resize it, turn its Y-axis autorange on or off, maximise it, hide it and close it. Your code can read and set all of these too, through the same state, so the control bars and your own UI always agree.

| To | Use |
| --- | --- |
| Size the panes when the chart is created | [`paneSizing`](#sizes-when-creating) in the config |
| Size the panes later | [`paneGroupApi.setPaneSizes`, `lockPaneSize`](#changing-sizes) |
| Turn a pane's Y-axis autorange on or off | [`financeApi.getYAxisAutoRangeController(paneId)`](#y-axis-autorange) |
| Maximise a pane, and restore the others | [`paneGroupApi.setExpanded`](#maximise) |
| Hide and show a pane | [`paneGroupApi.setVisible`](#hide) |
| Close a pane | [`paneGroupApi.removePane`](#close) |
| Follow changes, from the control bars too | [`paneGroupApi.stateChanged`](#following-changes) |

## Pane Ids {#pane-ids}

Every pane has an id. The price pane's is `PaneId.DEFAULT` (`"default"`). A study's pane gets a new id each time unless you give it one, so to find a pane later, give it an id when you create its study:

```ts
import { PaneId, RSIStudy } from "scichart-scitrader";

const RSI_PANE = new PaneId("rsi");
const rsi = new RSIStudy({ paneId: RSI_PANE });
```

The id comes in two forms:

- **`paneGroupApi` takes the string,** `RSI_PANE.value`: `"rsi"`.
- **`financeApi` takes the `PaneId` object** that the study was given. It looks panes up by the object, so `getYAxisAutoRangeController(new PaneId("rsi"))` finds nothing: keep the object, or get it from the study (`rsi.chartPaneId`) or from `financeApi.chartPanes.keys()`.

`paneGroupApi.getAllPanes()` lists the panes in order, each with its id, size, and whether it is hidden or maximised.

## Setting Pane Sizes When Creating a Chart {#sizes-when-creating}

`paneSizing` sets each pane's size by pane id, with one of:

- **`grow`:** the pane's share of the height left over, against the other panes' shares. The default is `1`, so panes without a size share the height equally.
- **`size`:** a fixed height in pixels. The pane starts locked at that size, as with its control bar's **Lock size** button: it keeps its size when the others change, until the user drags its divider.

```ts
const financeChartPanel = await SciFinanceChartPanel.create(element, {
    exchangeName: CoinbaseExchange.name,
    symbol: "BTC-USD",
    interval: CandleInterval.SIX_HOURS,
    studies: [
        new OHLCStudy(),
        new VolumeStudy(),
        new RSIStudy({ paneId: RSI_PANE }),
        new MACDStudy({ paneId: MACD_PANE }),
    ],
    paneSizing: {
        [PaneId.DEFAULT.value]: { grow: 3 }, // the price pane takes 3 shares
        [RSI_PANE.value]: { size: 110 }, // the RSI pane is 110 px high
        [MACD_PANE.value]: { grow: 1 }, // the MACD pane takes 1 share
    },
});
```

In a 620 px chart, this gives the RSI pane 110 px, and shares the rest 3 : 1: about 380 px for the price pane and 127 px for MACD. Panes side by side (`direction: "row"`) are sized across instead of down.

Without `paneSizing`, each study's own default applies, then `grow: 1`.

## Changing Pane Sizes in Code {#changing-sizes}

```ts
const group = financeChartPanel.paneGroupApi;

// Proportions: give every pane a size, and they are scaled to fill the chart
group.setPaneSizes([
    { id: PaneId.DEFAULT.value, size: 4 },
    { id: RSI_PANE.value, size: 1 },
    { id: MACD_PANE.value, size: 1 },
]);

// An exact size: lock one pane at 80 px, and the others share the rest
group.lockPaneSize(RSI_PANE.value, 80);
group.unlockPaneSize(RSI_PANE.value); // it shares the height again
```

- **`setPaneSizes` sizes are proportions.** They are scaled to fill the chart, so `4, 1, 1` and `400, 100, 100` do the same. Give a size for every pane: a pane you leave out keeps its old share, on a different scale, and may end up much bigger or smaller than you meant.
- **`lockPaneSize` is exact.** The pane stays that many pixels high while the chart or the other panes resize. `isSizeLocked(id)` says whether a pane is locked.
- **`setPaneSize(id, px)`** changes one pane's share, so its size in pixels depends on the others. Use `lockPaneSize` for an exact size.

## Y-Axis Autorange {#y-axis-autorange}

With autorange on, a pane's Y axis fits the candles or values in view as the user zooms and pans. It is on by default. Dragging a pane's Y axis to rescale it turns it off, and the control bar's **Y-axis autorange** button turns it back on.

Each pane has an autorange controller, found by the pane's `PaneId`:

```ts
const autoRange = financeChartPanel.financeApi.getYAxisAutoRangeController(RSI_PANE);

autoRange.isYAxisAutoRangeEnabled; // read it
autoRange.isYAxisAutoRangeEnabled = false; // the Y axis stays where it is
autoRange.yAxisAutoRangeChanged.subscribe(({ isYAxisAutoRangeEnabled }) => updateButton(isYAxisAutoRangeEnabled));
```

`yAxisAutoRangeChanged` fires for every change: from your code, an axis drag, or the control bar. `financeApi.autoRange` is the same setting for the price pane.

## Maximising a Pane {#maximise}

```ts
group.setExpanded(RSI_PANE.value); // the RSI pane fills the chart; the others are hidden
group.setExpanded(null); // restore every pane
group.toggleExpanded(RSI_PANE.value);

group.getExpandedId(); // the maximised pane's id, or null
group.isExpanded(RSI_PANE.value);
```

One pane at a time can be maximised. `expandedChanged` fires with the new id, or `null`.

## Hiding and Showing a Pane {#hide}

```ts
group.setVisible(RSI_PANE.value, false); // hide it
group.setVisible(RSI_PANE.value, true); // show it again
group.toggleVisible(RSI_PANE.value);

group.isVisible(RSI_PANE.value);
```

A hidden pane keeps its studies, and the other panes share its space. The user brings it back from the **restore strip** below the panes, where each hidden pane is a pill named after its studies. `visibilityChanged` fires with `{ id, visible }`.

## Closing a Pane {#close}

```ts
group.removePane(RSI_PANE.value); // the pane goes, and its studies are detached
```

Closing a pane, from code or its control bar's **Close** button, detaches its studies and removes it for good. To have it back, attach its studies again. Detaching a pane's last study with `financeApi.detachStudy(study)` closes the pane too.

Keep the price pane: the chart's candles are drawn there. A chart's last pane can't be closed: its **Close** button is disabled.

## Following Changes {#following-changes}

The user changes the same state from the control bars and dividers. To keep your own UI in step, subscribe to `stateChanged`, which fires after every change to the panes with a snapshot of them all, and to each pane's `yAxisAutoRangeChanged`:

```ts
group.stateChanged.subscribe((snapshot) => {
    for (const pane of snapshot.slots) {
        console.log(pane.id, pane.isVisible ? "shown" : "hidden", pane.isExpanded ? "maximised" : "");
    }
});
```

`paneAdded`, `paneRemoved`, `expandedChanged`, `visibilityChanged`, `sizeChanged` and `orderChanged` fire for one kind of change each.

## TypeScript Example: Pane Sizes and Pane State

BTC-USD from Coinbase, with RSI and MACD panes sized by `paneSizing`. The buttons above the chart call the methods on this page for each pane. Hover a pane and use its control bar, or drag a divider: the buttons follow, because they redraw on `stateChanged`.

<LiveDocSnippet maxWidth={"100%"} height={760} includeSciTrader name="../../../_examples/uiComponents_PaneState/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/uiComponents_PaneState/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Pane Sizes and Pane State

The same in React. The toolbar re-renders when `stateChanged` or a pane’s `yAxisAutoRangeChanged` fires.

<LiveDocSnippet maxWidth={"100%"} height={760} includeSciTrader reactComponent="PaneStateChart" name="../../../_examples/uiComponents_PaneState/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/uiComponents_PaneState/react.tsx
    ```
</CodeSnippetBlock>

## Pane State API

<details>
<summary>PaneId, and the paneGroupApi interfaces IPaneVisibility, IPaneSizing and IPaneGetters, with their TSDoc</summary>

```ts
class PaneId {
    static DEFAULT: PaneId;
    static createUnique: (prefix?: string) => PaneId;
    value: string;
    name: string;
    constructor(id: string);
    toString(): string;
}

/** Payload for {@link IPaneApi.visibilityChanged}. */
interface IPaneVisibilityChangedArgs {
    /** The pane whose visibility changed. */
    id: LayoutPaneId;
    /** The new visibility state. */
    visible: boolean;
}

/** Pane sizing. */
interface IPaneSizing {
    /** Set a single pane's size in absolute pixels along the layout axis. Also converts sizeConfig to grow-based. */
    setPaneSize(id: LayoutPaneId, sizeInPixels: number): void;
    /** Set multiple pane sizes in one call. Also converts sizeConfig to grow-based. */
    setPaneSizes(sizes: Array<{
        id: LayoutPaneId;
        size: number;
    }>): void;
    /** Lock a pane to a fixed pixel size. The pane won't flex until dragged or unlocked. */
    lockPaneSize(id: LayoutPaneId, sizeInPixels: number): void;
    /** Unlock a pane — converts its absolute size to a grow weight so it participates in flex layout. */
    unlockPaneSize(id: LayoutPaneId): void;
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
```

</details>

<details>
<summary>getYAxisAutoRangeController, and the autorange members of FinChartYAxisDragModifier, with their TSDoc</summary>

```ts
// financeChartPanel.financeApi
class SciFinanceChart {
    /**
     * Returns the per-pane Y-axis autoRange controller (the {@link FinChartYAxisDragModifier}
     * instance attached to the pane's surface), or undefined if the pane is unknown.
     * Read `isYAxisAutoRangeEnabled` to query state, write it to toggle, and subscribe to
     * `yAxisAutoRangeChanged` to observe flips (from drag, wheel, or external setter calls).
     */
    getYAxisAutoRangeController(paneId: PaneId): FinChartYAxisDragModifier | undefined;
}

class FinChartYAxisDragModifier {
    /** Fires when this pane's Y-axis autoRange flips (by drag, wheel-delegation, or button). */
    yAxisAutoRangeChanged: EventHandler<YAxisAutoRangeChangedArgs>;
    /**
     * Pane-level Y-axis autoRange state. Setting flips every Y axis on the pane
     * uniformly between EAutoRange.Always and EAutoRange.Never, keeps the
     * DEFAULT-pane global flag (`SciFinanceChart.autoRange`) in sync, and raises
     * {@link yAxisAutoRangeChanged}. Single emitter for the per-pane state —
     * the wheel modifier delegates here.
     */
    get isYAxisAutoRangeEnabled(): boolean;
    set isYAxisAutoRangeEnabled(value: boolean);
}
```

</details>

<details>
<summary>The IPaneSizeConfig interface, used by paneSizing, with its TSDoc</summary>

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

## Where to read next

- [Layout, Panes and PaneGroup](/financial-charts/ui-components/sci-finance-chart/layout/): the pane control bars, the restore strip, and the rest of `paneGroupApi`.
- [Mobile and Desktop Modes](/financial-charts/ui-components/sci-finance-chart/mobile-and-desktop-modes/): the touch layout of the control bars.
- [Saving and Restoring](/financial-charts/save-and-restore/): pane sizes and order are saved with the chart.
