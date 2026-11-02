---
sidebar_position: 7
sidebar_label: Drawing Tools
title: "Drawing Tools | SciTrader.js Trading Charts"
description: "Add trend lines, Fibonacci, pitchforks and other trading drawing tools to SciTrader.js charts, with toolbars for plain TypeScript and React plus keyboard and touch support."
keywords: ["SciTrader", "SciTrader.js", "trading drawing tools", "Fibonacci retracement chart", "trend line JavaScript chart"]
---

# Drawing tools

SciTrader has about 35 drawing tools. Each is an entry in `DRAWING_TOOLS`, grouped by `EDrawingToolGroup`:
- **Lines:** poly line, extended line, horizontal and vertical lines, cross line, angle line.
- **Channels:** channel, flat-bottom channel, disjoint channel.
- **Pitchforks:** pitchfork, inside, Schiff and modified Schiff pitchforks.
- **Fibonacci:** retracement, extension, time zones, speed-resistance arcs, circles and wedge; also pitchfan.
- **Cycles & time:** cyclic line, cyclic arc, sector.
- **Patterns:** XABCD and Elliott waves.
- **Measure & risk:** measure, stop-loss / take-profit.
- **Freehand:** freehand pen and highlighter.
- **Eraser.**

Drawings are saved with the chart ([Saving and restoring](/scichart-extensions/scichart-scitrader/save-and-restore/)).

## The controller

`DrawingToolsController` does the work and has no UI of its own:
- it adds the drawing modifiers to every pane, including panes added later;
- it shows a floating edit toolbar on the selected drawing;
- it suspends panning, x-axis drag and zoom-to-extents while a tool is in use;
- it reports when a drawing is finished.

Any toolbar, menu or keyboard shortcut can drive it.

```ts
import { DrawingToolsController } from "scichart-scitrader";
import { ETradingAnnotationType } from "scichart-financial-tools";

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);

drawing.selectTool(ETradingAnnotationType.FibonacciRetracementAnnotation);
drawing.activeToolChanged.subscribe((tool) => console.log("active tool:", tool)); // null once placed
drawing.drawingsChanged.subscribe((items) => console.log(items.length, "drawings"));

drawing.stop();      // cancel the active tool
drawing.remove();    // delete every drawing (or pass one item)
drawing.detach();    // remove the modifiers; drawings stay
```

- **When a tool finishes.** Click-to-place tools finish when their last point is placed, and freehand tools when the stroke ends. `activeTool` then returns to `null`.
- **The eraser** stays on until `stop()`, and removes only user drawings, never study annotations.
- **`drawings`** lists the user's drawings. Each item has an `annotation`, a `type`, and the `toolId` that made it.

Pass `editorContainer` to `attach` to offer the full annotation editor, with every option of the selected drawing, from the floating toolbar. `openEditor(item)` opens it for a drawing, as an Edit button in a list would, and `clearSelection()` deselects every drawing.

### Options for touch layouts

Three more `attach` options suit a phone or tablet:

- **`touch`**: a long press selects a drawing; a tap doesn't, as it may start a pan. Placement uses a movable cursor: drag to aim, then tap to commit each point. Lifting after a drag only moves the cursor; it does not place a point. Pass `true`, or the options of `AnnotationTouchSelectionModifier` (hold time, hit slop) to tune selection. The cursor applies to every pointer, a mouse included, so turn `touch` on for touch devices only, for example with `matchMedia("(pointer: coarse)").matches`. Without it, each click places a point.
- **`selectFinishedDrawing`**: `false` leaves a new drawing unselected, so its editor doesn't cover the chart. The default, `true`, shows the floating edit toolbar on a drawing as soon as it is placed.
- **`resumeGestures`**: by default the controller turns pan, x-axis drag and zoom-to-extents back on when a tool finishes or is stopped. Pass this when your app sometimes keeps them off, for example a touch "cursor mode" in which a drag moves the crosshair.

## Toolbar (plain TypeScript)

```ts
import { DrawingToolbar } from "scichart-scitrader";

const toolbar = DrawingToolbar.create(document.getElementById("tools"), drawing, {
    tools: DEFAULT_DRAWING_TOOLBAR_TOOLS, // the rail's tools, in order
    orientation: "vertical",              // or "horizontal"
    showAllTools: true,                   // a button opening every tool, grouped and labelled
});
// later: toolbar.destroy();
```

The toolbar is plain DOM, styled by the theme's CSS variables, so it follows `setTheme`.

<CenteredImageWrapper src={require("../_examples/drawing_Vanilla/screenshot.png").default} title="Drawing Tools" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/drawing_Vanilla/drawExample.ts
    ```
    ```tsx showLineNumbers file=../_examples/drawing_Vanilla/index.tsx
    ```
</CodeSnippetBlock>

## Toolbar (React)

```tsx
import { DrawingList, DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

const [chart, setChart] = React.useState<ISciFinanceChartPanelApi>();
const { controller } = useDrawingTools(chart);

<DrawingToolbar controller={controller} />
<SciFinanceChartView config={config} onInit={setChart} />
<DrawingList controller={controller} />
```

`useDrawingTools` attaches the controller once the chart is ready and detaches it on unmount. It also returns `activeTool` and `drawings` as React state. The React `DrawingToolbar` is the vanilla rail above, mounted by React: it takes the same `tools`, `orientation` and `showAllTools` options.

<CenteredImageWrapper src={require("../_examples/drawing_React/screenshot.png").default} title="Drawing Tools (React)" />

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../_examples/drawing_React/index.tsx
    ```
</CodeSnippetBlock>

## List of drawings

`DrawingList` lists the chart's drawings, each with its tool's icon and name. Given a `controller`, it follows the drawings by itself:
- clicking a row selects that drawing on the chart;
- each row has a delete button;
- "Clear all" removes every drawing, after asking in a small built-in dialog (`.st-confirm-dialog`).

```ts
import { DrawingList } from "scichart-scitrader";

const list = DrawingList.create(document.getElementById("drawings"), { controller: drawing });
// later: list.destroy();
```

In React, `<DrawingList controller={controller} />`, as above.

| Option | Use |
|---|---|
| `items`, `onSelect`, `onDelete`, `onClearAll` | Drive the list yourself instead of from a `controller`. Each callback replaces the controller's action. |
| `onEdit` | Adds an edit button to each row, e.g. to open your own editor. |
| `confirmClearAll(proceed)` | Ask for confirmation your own way before "Clear all"; call `proceed` if the user agrees. |
| `title`, `emptyMessage` | The heading (default "Drawing Tools") and the text shown with no drawings. |

## Keyboard and touch

These modifiers are optional, added to each pane's surface:

| Modifier | Keys / gesture |
|---|---|
| `OnChartKeyboardZoomPanModifier` | Arrow keys pan, `+` / `-` zoom, `0` resets; Shift for larger steps |
| `AnnotationKeyboardSelectionModifier` | `N` / `P` step through drawings, `Delete` removes, `Esc` deselects, `A` draws again |
| `AnnotationTouchSelectionModifier` | Long-press selects a drawing on touch screens. Added for you by the controller's `touch` option |
| `OnChartButtonsModifier` | A zoom / pan / reset strip on the pane under the mouse |

```ts
chart.chartPanes.forEach(({ surface }) =>
    surface.chartModifiers.add(
        new OnChartKeyboardZoomPanModifier(),
        new AnnotationKeyboardSelectionModifier({
            onAddAnnotation: () => drawing.selectTool(drawing.lastUsedTool ?? ETradingAnnotationType.FreehandDrawingAnnotation),
            onCancelPlacement: () => drawing.stop(),
        }),
        new OnChartButtonsModifier({ visible: true })
    )
);
```

A pane has keyboard focus after it is clicked.

<CenteredImageWrapper src={require("../_examples/drawing_Interaction/screenshot.png").default} title="Keyboard, Touch, Buttons" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/drawing_Interaction/drawExample.ts
    ```
    ```tsx showLineNumbers file=../_examples/drawing_Interaction/index.tsx
    ```
</CodeSnippetBlock>
