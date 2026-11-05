---
sidebar_position: 3
sidebar_label: Mobile and Desktop Modes
title: "Touch and Mouse Modes for Mobile and Desktop Trading Charts | SciTrader.js"
description: "Make a SciTrader.js trading chart work on phones and tablets: the touch layout for pane controls and drawing tools, the crosshair on touch screens, and how your app chooses touch or mouse mode, in JavaScript and React."
keywords: ["mobile trading chart", "touch chart JavaScript", "responsive financial chart", "mobile candlestick chart", "React mobile chart", "touch drawing tools", "SciFinanceChart touch", "SciTrader.js"]
---

# Mobile and Desktop Modes

A chart works by touch out of the box: pinch to zoom, drag to pan, double-tap to fit. But some parts are laid out for a mouse, around hover and small targets. For phones and tablets, each has a **touch mode**, which your app turns on.

**The chart doesn't detect touch screens: your app decides.** This is by design. Your app already chooses between its phone and desktop layouts, e.g. with a breakpoint hook, and the chart should match it: a tablet with a keyboard and trackpad may want either. So decide once, in your app, and pass the result to the chart.

## What Changes in Touch Mode {#differences}

| | Mouse (desktop) | Touch (phones and tablets) | Set with |
| --- | --- | --- | --- |
| **Zoom and pan** | Wheel zooms, drag pans, double-click fits | Pinch zooms, drag pans, double-tap fits | Nothing: both always work |
| **Pane control bars** | Appear over a pane on hover | In a drawer at the pane's right edge: tap or swipe its handle | `paneControls: { touch }` |
| **Dividers between panes** | Thin | A wider grip, with dots | `paneControls: { touch }` |
| **Selecting a drawing** | Click it | Long-press it | Drawing tools' `touch` |
| **Placing a drawing** | Click each point | Drag a cursor to aim, tap to place each point | Drawing tools' `touch` |
| **A finished drawing** | Stays selected, with its quick-edit toolbar | Not selected, so its editor doesn't cover the chart | `selectFinishedDrawing` |
| **Crosshair and legend** | On: they follow the mouse | Off by default; while on, a drag moves the crosshair instead of panning | [Your crosshair button](#crosshair) |
| **On-chart zoom buttons** | Optional | Leave them out: small targets that fight the pan gesture | [`OnChartButtonsModifier`](/financial-charts/drawing-tools/keyboard-and-touch/#on-chart-buttons) |

## Choosing Touch or Mouse in Your App {#choosing}

A media query is the simplest test: `(pointer: coarse)` matches when the main pointer is a finger.

```ts
const touch = matchMedia("(pointer: coarse)").matches;
```

The SciTrader app uses a breakpoint hook, `useBreakpoint`, which gives `"desktop"` only for a fine pointer (a mouse or trackpad) **and** a window at least 1024 px wide. Everything else gets the touch layout, tablets in landscape included:

```tsx
// "desktop" needs a mouse or trackpad and room; phones and tablets get the touch layout
function useTouchLayout(): boolean {
    const query = "(pointer: fine) and (min-width: 1024px)";
    const isDesktop = React.useSyncExternalStore(
        (onChange) => {
            const media = matchMedia(query);
            media.addEventListener("change", onChange);
            return () => media.removeEventListener("change", onChange);
        },
        () => matchMedia(query).matches,
        () => true // server render: assume desktop
    );
    return !isDesktop;
}
```

**Server rendering.** The server can't know the device, so it renders one layout, here desktop, and the browser corrects it after hydration. Create the chart after that, so it starts in the right mode: the SciTrader app waits one effect before mounting the chart.

## Creating a Chart in Touch or Mouse Mode {#creating}

Pass the mode to each part that has one:

```ts
const financeChartPanel = await SciFinanceChartPanel.create(element, {
    exchangeName: CoinbaseExchange.name,
    symbol: "BTC-USD",
    interval: CandleInterval.ONE_HOUR,
    studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    paneControls: { touch }, // control bars in drawers, wider dividers
});

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi, {
    touch, // long press selects; placement with a cursor
    selectFinishedDrawing: !touch, // on a phone, an open editor would cover the drawing
});
```

In React, pass `paneControls={{ touch }}` to `<SciFinanceChartView>`, and the same options to `useDrawingTools`.

## Switching Mode {#switching}

- **The pane controls switch live:** `financeChartPanel.setPaneControls({ touch })`, or a new `paneControls` prop in React.
- **The drawing tools' options are read when they attach.** To switch them, create the chart again in the new mode: in React, give `<SciFinanceChartView>` a `key` that changes with the mode. Save the chart with `toJSON()` first if you want to keep its studies and drawings; see [Saving and Restoring](/financial-charts/save-and-restore/).

A switch is rare, e.g. a tablet's keyboard and trackpad being attached. The SciTrader app avoids switching a live chart: it waits until it knows its layout before creating the chart, so the chart starts in the right mode.

## The Crosshair on Touch Screens {#crosshair}

With a mouse, hovering moves the crosshair and dragging pans, so both work at once. A finger can't hover: one drag has to do one or the other. So on touch, the SciTrader app:

1. **starts with the crosshair and legend off,** so a drag pans;
2. **has a crosshair button.** While the crosshair is on, a drag moves it, and pan, X-axis drag and double-tap zoom-to-fit are off.

`FinChartLegendModifier` draws the crosshair and the legend, and `setCursorEnabled` turns both on or off. Turning the pan modifiers off is up to you:

```ts
import { XAxisDragModifier, ZoomPanModifier } from "scichart";
import { FinChartLegendModifier, FinChartZoomExtentsModifier, SciFinanceChart } from "scichart-scitrader";

function setCrosshair(chart: SciFinanceChart, on: boolean, touch: boolean) {
    chart.finChartModifiers
        .asArray()
        .find((m): m is FinChartLegendModifier => m instanceof FinChartLegendModifier)
        ?.setCursorEnabled(on);
    if (touch) setPanAndZoom(chart, !on); // on touch, the crosshair takes the drag
}

function setPanAndZoom(chart: SciFinanceChart, enabled: boolean) {
    chart.chartPanes.forEach(({ surface }) =>
        surface.chartModifiers.asArray().forEach((m) => {
            if (m instanceof ZoomPanModifier || m instanceof XAxisDragModifier || m instanceof FinChartZoomExtentsModifier) {
                m.isEnabled = enabled;
            }
        })
    );
}
```

The drawing tools turn panning off while a tool is in use, and back on when it finishes. With the crosshair on, it should stay off, so pass `resumeGestures` to the drawing tools: `resumeGestures: () => setPanAndZoom(chart, !(touch && crosshairOn))`.

## TypeScript Example: Touch and Mouse Modes

BTC-USD from Coinbase, with the drawing tools rail. **Auto** picks touch from `(pointer: coarse)`; **Touch** and **Mouse** override it, so you can try touch mode with a mouse. In touch mode, each pane’s control bar is behind the handle at its right edge, the divider has a grip, the crosshair starts off, and drawing tools place points with a cursor. Turn the crosshair on, and a drag moves it instead of panning. A mode change creates the chart again.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader name="../../../_examples/uiComponents_TouchMode/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="tools"></div><div id="chart" style="flex: 1; min-width: 0"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/uiComponents_TouchMode/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Touch and Mouse Modes

The same in React. A `useSyncExternalStore` hook follows the media query, and the chart’s `key` changes with the mode, so React creates it again.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader reactComponent="TouchModeChart" name="../../../_examples/uiComponents_TouchMode/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/uiComponents_TouchMode/react.tsx
    ```
</CodeSnippetBlock>

## Touch Mode API

<details>
<summary>The IPaneControlOptions interface, used by paneControls, with its TSDoc</summary>

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
```

</details>

<details>
<summary>The IDrawingToolsControllerOptions interface, with its TSDoc</summary>

```ts
interface IDrawingToolsControllerOptions {
    /**
     * Where the full annotation editor (every option of the selected drawing) is mounted when
     * the user opens it from the floating quick-edit toolbar. Omit to offer the quick-edit
     * toolbar only.
     */
    editorContainer?: HTMLElement;
    /**
     * Called when the full editor opens, from the quick-edit toolbar or {@link DrawingToolsController.openEditor},
     * e.g. to show the panel that holds it.
     */
    onOpenFullEditor?: (annotation: IAnnotation) => void;
    /** Class added to the full editor's root element in {@link editorContainer}. */
    editorRootClassName?: string;
    /** Class added to the full editor's panel. */
    editorPanelClassName?: string;
    /**
     * For a touch layout: a long press on a drawing selects it, as a click does with a mouse, and
     * placement uses a movable cursor: drag to aim, tap to commit each point. The cursor applies
     * to a mouse too, so turn this on for touch devices only, e.g. from `(pointer: coarse)`.
     * `true` uses the default selection timings; pass options to change them.
     */
    touch?: boolean | IAnnotationTouchSelectionModifierOptions;
    /**
     * Whether a drawing stays selected, showing the quick-edit toolbar, once it is placed.
     * Default `true`. Turn it off where an open editor would cover the chart, as on a phone.
     */
    selectFinishedDrawing?: boolean;
    /**
     * Restores chart gestures when a tool finishes or is stopped. The controller suspends pan,
     * x-axis drag and zoom-to-extents while a tool is active, so a drag draws instead of panning.
     * By default it turns them back on. Pass this if your app sometimes keeps them off, such as a
     * touch "cursor mode" where a drag moves the crosshair instead.
     */
    resumeGestures?: () => void;
}
```

</details>

<details>
<summary>The crosshair members of FinChartLegendModifier, with their TSDoc</summary>

```ts
class FinChartLegendModifier {
    /**
     * Master on/off for the cursor readout. When `enabled` is `false`, the
     * per-pane legend and the crosshair are hidden completely and pointer moves
     * are ignored — the chart shows no cursor/legend. When `true`, the legend
     * renders again (latest value at rest, hovered value on pointer-move) and
     * the crosshair tracks the pointer.
     *
     * This modifier — not SciChart's built-in `CursorModifier` (never
     * instantiated here) — owns both the crosshair and the legend, so the
     * cursor-toggle button routes through this method.
     */
    setCursorEnabled(enabled: boolean): void;
    /** Whether the cursor readout (crosshair + legend) is currently shown. See {@link setCursorEnabled}. */
    get cursorEnabled(): boolean;
}
```

</details>

## Where to read next

- [Keyboard and Touch](/financial-charts/drawing-tools/keyboard-and-touch/): the drawing tools' touch option in detail, keyboard shortcuts, and on-chart zoom buttons.
- [Layout, Panes and PaneGroup](/financial-charts/ui-components/sci-finance-chart/layout/#pane-controls): the pane control bars.
- [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/): the drawing tools rail.
