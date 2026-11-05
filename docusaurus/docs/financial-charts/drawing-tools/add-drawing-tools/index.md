---
sidebar_position: 1
sidebar_label: Add Drawing Tools
title: "Add Drawing Tools to a JavaScript or React Financial Chart | SciTrader.js"
description: "Add trading drawing tools such as trend lines and Fibonacci retracements to a JavaScript or React financial chart with SciTrader.js: point-and-click drawing with DrawingToolsController, drawings added in code, and listing and removing them."
keywords: ["SciTrader", "SciTrader.js", "chart drawing tools JavaScript", "add trend line to chart", "point and click drawing", "DrawingToolsController", "React financial chart drawing tools", "chart annotations JavaScript"]
---

# Add Drawing Tools to a Financial Chart

There are two ways to add drawings to a SciTrader chart, and you can use both on one chart:

1. [**Point and click**](#point-and-click): enable drawing, give the user the tools, and they click the chart to place each drawing's points.
2. [**In code**](#in-code): create a drawing's annotation with its points and add it to a pane, e.g. to show your own analysis or a saved trade.

Then you can [list, select and remove drawings](#listing). Each way has TypeScript and React examples with live CodePens.

:::info
The SciTrader SDK has 34 drawing tools. For the full list, with each tool's id, annotation class and number of points, see [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue). The most popular tools have a page of their own, listed under this page in the sidebar: what the tool is for, how it works, and how to draw it on a JavaScript or React financial chart.
:::

## Enabling Point-and-Click Drawing with DrawingToolsController {#point-and-click}

`DrawingToolsController` turns a chart into a drawing surface. Attach one to the chart, then start a tool with `selectTool`:

```ts
import { ETradingAnnotationType } from "scichart-financial-tools";
import { DrawingToolsController } from "scichart-scitrader";

// Enable drawing: adds the drawing modifiers to every pane, including panes added later
const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);

// Start a tool: the user clicks the chart to place its points
drawing.selectTool(ETradingAnnotationType.FibonacciRetracementAnnotation);

drawing.stop(); // cancel the active tool, discarding a drawing in progress
drawing.detach(); // turn drawing off; the drawings stay on the chart
```

The controller has no UI of its own, so any button, menu or keyboard shortcut can call `selectTool`. For a ready-made one, use the [Drawing Toolbar](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/). The controller:

- **adds the drawing modifiers** to every pane, including panes added later, e.g. when a study adds one;
- **suspends pan, x-axis drag and zoom-to-extents** while a tool is active, so a drag draws instead of panning, and resumes them when it finishes;
- **shows the quick-edit toolbar** on a selected drawing (see [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/));
- **registers the drawing types** (`registerDrawingTools()`), so drawings are saved with the chart.

**When a tool finishes.** A click-to-place tool finishes when its last point is placed, and a freehand tool when the stroke ends; `activeTool` then returns to `null`. The **eraser** stays on until `stop()` or another tool is selected, and removes only user drawings, never a study's annotations.

**Touch screens** need the `touch` option; see [Keyboard and Touch](/financial-charts/drawing-tools/keyboard-and-touch/#touch).

In React, `useDrawingTools(chart)` from `scichart-scitrader-react` attaches a controller once the chart is ready, and detaches it on unmount. It returns the `controller`, and the `activeTool` and `drawings` as React state:

```tsx
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

const [chartApi, setChartApi] = React.useState<ISciFinanceChartPanelApi>();
const { controller, activeTool, drawings } = useDrawingTools(chartApi);

<DrawingToolbar controller={controller} />
<SciFinanceChartView config={config} onInit={setChartApi} />
```

### DrawingToolsController Events {#events}

| Event | Raised when | Payload |
| --- | --- | --- |
| `activeToolChanged` | A tool is selected, finishes, or is stopped | The active tool's id, or `null` |
| `drawingsChanged` | A drawing is added or removed, by the user, your code or the eraser | Every drawing, as `IDrawingItem[]` |

```ts
drawing.activeToolChanged.subscribe((tool) => console.log("active tool:", tool)); // null once placed
drawing.drawingsChanged.subscribe((items) => console.log(items.length, "drawings"));
```

Other events come from elsewhere:

- **A drawing is selected, deselected, moved or clicked:** its annotation's own events, `selectedChanged`, `dragEnded`, `clicked` and more. See [Selection and Edit Events](/financial-charts/drawing-tools/editing-drawings/#events).
- **A row of the drawing list is clicked, edited or deleted:** the list's `onSelect`, `onEdit`, `onDelete` and `onClearAll`. See [Drawing List Callbacks](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/#drawing-list-callbacks).
- **A key selects a drawing, or asks to draw:** the keyboard modifier's `onSelectionChanged`, `onAddAnnotation` and `onCancelPlacement`. See [Keyboard and Touch](/financial-charts/drawing-tools/keyboard-and-touch/).

### TypeScript Example: Point-and-Click Drawing with DrawingToolsController

A BTC-USD chart from Coinbase with the drawing-tools rail on the left. Pick a tool, then click the chart to place its points; the line above follows `activeToolChanged` and `drawingsChanged`. The rail's last button opens every tool.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/drawing_PointAndClick/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="status"></div><div style="display: flex; flex: 1; min-height: 0"><div id="tools"></div><div id="chart" style="flex: 1; min-width: 0"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/drawing_PointAndClick/vanilla.ts
    ```
</CodeSnippetBlock>

### React Example: Point-and-Click Drawing with useDrawingTools

The same chart in React. `useDrawingTools` attaches the controller and returns the active tool and drawings as state, and the React `DrawingToolbar` is the same rail.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="PointAndClickDrawingChart" name="../../_examples/drawing_PointAndClick/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/drawing_PointAndClick/react.tsx
    ```
</CodeSnippetBlock>

## Adding Drawings Programmatically {#in-code}

A drawing is an annotation from `scichart-financial-tools`. To add one in code:

1. **Register the drawing types**, once at startup, with `registerDrawingTools()`, so the chart treats your annotations as user drawings: listed, saved and themed. `DrawingToolsController.attach` also does this.
2. **Create the annotation** with its `points`, in data coordinates: **x is a candle's time in seconds** (Unix time), and **y is a price**. The [catalogue](/financial-charts/drawing-tools/#the-catalogue) lists each tool's class and how many points it takes.
3. **Add it to a pane's surface**: `chart.chartPanes.get(PaneId.DEFAULT)` is the price pane. A study's pane is `chart.chartPanes.get(study.chartPaneId)`.

```ts
import { Point } from "scichart";
import { FibonacciRetracementAnnotation } from "scichart-financial-tools";
import { PaneId, registerDrawingTools } from "scichart-scitrader";

registerDrawingTools(); // once, at startup

const chart = financeChartPanel.financeApi;
const pricePane = chart.chartPanes.get(PaneId.DEFAULT).surface;

pricePane.annotations.add(
    new FibonacciRetracementAnnotation({
        points: [new Point(1767225600, 75600), new Point(1768435200, 84850)], // (time in seconds, price)
        isEditable: true, // the user can select, drag and edit it
    })
);
```

**Where to put a drawing.** To place drawings on the chart's own data, read the loaded candles from `chart.dataManager`: `xValues` are the candles' times, and `getValues(getSourceIdByName(DEFAULT_FEED_ID, EDataSourceStringId.HIGH))` their highs, likewise `LOW`, `OPEN` and `CLOSE`. The examples below find the high and low of the last 90 candles this way.

**Changing a drawing later.** Keep the annotation, or find it in `drawing.drawings`, and set its properties: `annotation.points = [...]` moves it, and its own options, such as `stroke` or a Fibonacci's `thresholds`, restyle it. See [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/#in-code).

**Patterns** (Elliott waves and XABCD) are poly lines with a label at each point. The SDK's own pattern helpers aren't exported, so build the labels yourself; see [Elliott Wave](/financial-charts/drawing-tools/add-drawing-tools/elliott-wave/#in-code). The label text is what identifies the pattern, e.g. in the drawing list.

### TypeScript Example: Adding Drawings in Code

A BTC-USD chart from Coinbase with three drawings added in code: a Fibonacci retracement of the last 90 candles' move, a trend line through two lows, and a horizontal line at the latest close. The list on the right follows the controller. The buttons add the drawings again, remove the Fibonacci retracements by type, or remove everything.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/drawing_Programmatic/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div id="drawings" style="width: 280px; overflow-y: auto"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/drawing_Programmatic/vanilla.ts
    ```
</CodeSnippetBlock>

### React Example: Adding Drawings in Code

The same chart in React. The drawings are added in `onInit`, once the chart has loaded its candles.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="ProgrammaticDrawingChart" name="../../_examples/drawing_Programmatic/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/drawing_Programmatic/react.tsx
    ```
</CodeSnippetBlock>

## Listing, Selecting and Removing Drawings {#listing}

The controller keeps the list of the user's drawings, whether drawn with point and click, added in code, or restored from a saved chart:

| Member | What it does |
| --- | --- |
| `drawings` | The drawings, oldest first, as `IDrawingItem`: its `annotation`, its `type`, and the `toolId` that made it |
| `select(item)` | Selects a drawing, as a click on it would |
| `clearSelection()` | Deselects every drawing |
| `remove(item)` | Removes one drawing; `remove()` with no drawing removes every one |
| `openEditor(item)` | Selects a drawing and opens the full editor for it; see [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/) |

```ts
// Remove every Fibonacci retracement
drawing.drawings
    .filter((item) => item.type === ETradingAnnotationType.FibonacciRetracementAnnotation)
    .forEach((item) => drawing.remove(item));
```

The [Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/) shows the drawings to the user, with buttons to select, edit and delete them.

## Saving and Restoring Drawings

Drawings are saved with the chart: `financeChartPanel.toJSON()` includes every drawing on every pane, under `finance.annotations`, and `SciFinanceChartPanel.fromJSON()` restores them. Call `registerDrawingTools()` before restoring without a controller, and `SciFinanceChart.registerDrawingType(name)` for annotation types of your own. See [Save and Restore](/financial-charts/save-and-restore/).

## DrawingToolsController API

| Member | What it does |
| --- | --- |
| `DrawingToolsController.attach(chart, options)` | Enables drawing on a chart, `financeChartPanel.financeApi` |
| `selectTool(id)` | Starts a tool |
| `stop()` | Stops the active tool, discarding a drawing in progress |
| `activeTool` | The active tool's id, or `null` |
| `lastUsedTool` | The last tool selected, for a "draw again" shortcut |
| `drawings`, `select`, `clearSelection`, `remove`, `openEditor` | See [Listing, Selecting and Removing Drawings](#listing) |
| `activeToolChanged`, `drawingsChanged` | See [DrawingToolsController Events](#events) |
| `detach()` | Turns drawing off. The drawings stay on the chart |

| Option (`IDrawingToolsControllerOptions`) | What it does |
| --- | --- |
| `editorContainer`, `editorRootClassName`, `editorPanelClassName`, `onOpenFullEditor` | Where and how the full editor opens; see [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/#full-editor) |
| `touch`, `selectFinishedDrawing`, `resumeGestures` | Touch layouts; see [Keyboard and Touch](/financial-charts/drawing-tools/keyboard-and-touch/#touch) |

<details>
<summary>The DrawingToolsController class, with its TSDoc</summary>

````ts
/**
 * Drawing tools for a chart, independent of any UI framework: attach one to a
 * {@link SciFinanceChart}, then call {@link selectTool} from whatever toolbar you build. The SDK's
 * vanilla `DrawingToolbar` and the React `DrawingToolbar` both drive one of these.
 *
 * It adds the drawing modifiers to every pane, including panes added later: placement,
 * freehand, eraser, and the floating quick-edit toolbar shown when a drawing is selected. It
 * suspends pan, x-axis drag and zoom-to-extents while a tool is active, so a drag draws instead
 * of panning. And it returns to "no tool" when a drawing is finished. Placed drawings are saved
 * with the chart (`toJSON`), because the tools' annotation types are registered as user drawings.
 *
 * For a touch layout, see the `touch`, `selectFinishedDrawing` and `resumeGestures` options.
 *
 * ```ts
 * const drawing = DrawingToolsController.attach(panel.financeApi);
 * drawing.selectTool(ETradingAnnotationType.FibonacciRetracementAnnotation);
 * drawing.activeToolChanged.subscribe((tool) => …);   // null once the drawing is placed
 * ```
 */
class DrawingToolsController {
    /** Raised when a tool is selected, finished or stopped, with the active tool or `null`. */
    readonly activeToolChanged: EventHandler<TDrawingToolId>;
    /** Raised when drawings are added or removed, with the full list. */
    readonly drawingsChanged: EventHandler<readonly IDrawingItem[]>;
    /** Attach drawing tools to a chart. Call {@link detach} before deleting the chart, or leave it to the chart's teardown. */
    static attach(chart: SciFinanceChart, options?: IDrawingToolsControllerOptions): DrawingToolsController;
    /** The tool being used, or `null`. */
    get activeTool(): TDrawingToolId | null;
    /** The last tool selected: for a "draw again" shortcut. */
    get lastUsedTool(): TDrawingToolId | null;
    /** The user's drawings on the chart, oldest first. */
    get drawings(): readonly IDrawingItem[];
    /**
     * Start a tool. Click-to-place tools finish when their last point is placed, freehand tools
     * when the stroke ends; either way {@link activeTool} returns to `null`. The eraser stays on
     * until {@link stop} or another tool is selected, and removes only user drawings.
     */
    selectTool(id: TDrawingToolId): void;
    /** Stop the active tool, discarding a drawing in progress. */
    stop(): void;
    /** Remove one drawing, or all of them. */
    remove(item?: IDrawingItem): void;
    /** Select a drawing, as a click on it would. */
    select(item: IDrawingItem): void;
    /**
     * Select a drawing and open the full editor for it, as the quick-edit toolbar's "more" button
     * does. Calls {@link IDrawingToolsControllerOptions.onOpenFullEditor}. Needs an `editorContainer`.
     */
    openEditor(item: IDrawingItem): void;
    /** Deselect every drawing, closing the quick-edit toolbar and the full editor. */
    clearSelection(): void;
    /** Remove the modifiers from every pane. The drawings stay on the chart. */
    detach(): void;
}
````

</details>

<details>
<summary>The IDrawingToolsControllerOptions and IDrawingItem interfaces, with their TSDoc</summary>

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

/** One user drawing on the chart, as listed by {@link DrawingToolsController.drawings}. */
interface IDrawingItem {
    /** The annotation's `id`. */
    id: string;
    /** The annotation type, an `ETradingAnnotationType` value. */
    type: string;
    /** The tool that makes this kind of drawing (tells a pattern from a plain polyline). */
    toolId?: TDrawingToolId;
    /** The annotation itself, for selecting or deleting it. */
    annotation: IAnnotation;
}
```

</details>

<details>
<summary>The React useDrawingTools hook, from scichart-scitrader-react, with its TSDoc</summary>

````ts
interface IUseDrawingToolsResult {
    /** Available once the chart has initialised. */
    controller: DrawingToolsController | undefined;
    activeTool: TDrawingToolId | null;
    drawings: readonly IDrawingItem[];
}
/**
 * Drawing tools for a React chart: attaches a {@link DrawingToolsController} to the chart once it
 * is ready, detaches it on unmount, and returns the active tool and drawings as state.
 *
 * ```tsx
 * const [chart, setChart] = React.useState<ISciFinanceChartViewApi>();
 * const { controller, activeTool, drawings } = useDrawingTools(chart);
 *
 * <DrawingToolbar controller={controller} />
 * <SciFinanceChartView config={config} onInit={setChart} />
 * ```
 */
function useDrawingTools(chart: ISciFinanceChartPanelApi | undefined, options?: IDrawingToolsControllerOptions): IUseDrawingToolsResult;
````

</details>

## Where to read next

- [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue): each tool's id, class and points.
- [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/): ready-made tools and list for users.
- [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/): the quick-edit toolbar, the full editor and edit events.
