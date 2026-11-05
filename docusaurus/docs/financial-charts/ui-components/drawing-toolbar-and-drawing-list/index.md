---
sidebar_position: 5.7
sidebar_label: Drawing Toolbar and Drawing List
title: "Drawing Toolbar and Drawing List UI Components | SciTrader.js"
description: "Ready-made UI components for drawing tools in SciTrader.js trading charts: DrawingToolbar, a rail of drawing tools, and DrawingList, the chart's drawings with select, edit and delete callbacks, in TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "drawing toolbar", "DrawingToolbar", "DrawingList", "chart drawing tools UI", "React drawing toolbar", "trading chart toolbar"]
---

# Drawing Toolbar and Drawing List

Two ready-made UI components give users the [drawing tools](/financial-charts/drawing-tools/):

| Component | Plain TypeScript | React | What it is |
| --- | --- | --- | --- |
| [Drawing toolbar](#drawing-toolbar) | `DrawingToolbar` | `<DrawingToolbar>` | A rail of drawing tools: click one to start it |
| [Drawing list](#drawing-list) | `DrawingList` | `<DrawingList>` | The drawings on the chart, with buttons to select, edit and delete them |

Both drive a `DrawingToolsController`, which [enables point-and-click drawing](/financial-charts/drawing-tools/add-drawing-tools/#point-and-click). Like the other [UI components](/financial-charts/ui-components/#how-they-work), each is plain DOM in `scichart-scitrader`, and `scichart-scitrader-react` wraps it for React. They take the SciTrader theme's colours, so they follow `setTheme`.

## DrawingToolbar: A Rail of Drawing Tools {#drawing-toolbar}

`DrawingToolbar` shows a button per tool, with a divider between tool groups. Click a tool to start it, then click the chart to place its points:

- **the tool's button lights up** while it is in use, and clicking it again cancels it;
- **a Stop drawing button** appears while any tool is in use;
- **All drawing tools**, the last button, opens every tool, grouped and labelled. A tool started there joins the rail while it is in use.

```ts
// Plain TypeScript
import { DrawingToolbar, DrawingToolsController } from "scichart-scitrader";

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
const toolbar = DrawingToolbar.create(document.getElementById("tools"), drawing, {
    tools: [ETradingAnnotationType.ExtendedLineAnnotation, ETradingAnnotationType.FibonacciRetracementAnnotation], // the rail's tools
    orientation: "horizontal", // or "vertical", the default
    showAllTools: true, // the button that opens every tool. Default true
});
toolbar.setTools([...]); // change the tools on the rail
toolbar.destroy(); // remove it
```

```tsx
// React: the props are the same options, and the controller comes from useDrawingTools
import { DrawingToolbar, useDrawingTools } from "scichart-scitrader-react";

const { controller } = useDrawingTools(chartApi);
<DrawingToolbar controller={controller} tools={tools} orientation="horizontal" />
```

Without `tools`, the rail shows `DEFAULT_DRAWING_TOOLBAR_TOOLS`, one of each common family: Poly Line, Extended Line, Horizontal Line, Channel, Pitchfork, Fibonacci Retracement, Measure, Stop Loss / Take Profit, Freehand and Eraser. Any [tool id](/financial-charts/drawing-tools/#the-catalogue) can go on the rail.

| Option | Default | What it does |
| --- | --- | --- |
| `tools` | `DEFAULT_DRAWING_TOOLBAR_TOOLS` | The tools on the rail, in order |
| `orientation` | `"vertical"` | `"vertical"` (top to bottom) or `"horizontal"` (left to right) |
| `showAllTools` | `true` | Adds the button that opens every tool |

In React, changing `tools` updates the rail in place; changing `orientation` or `showAllTools` rebuilds it.

## DrawingList: The Chart's Drawings {#drawing-list}

`DrawingList` lists the drawings on the chart, each with its tool's icon and name. Given a `controller`, it follows the chart's drawings by itself, and:

- **clicking a row** selects that drawing on the chart;
- **each row's delete button** removes it;
- **Clear all**, in the header, removes every drawing, after asking in a small built-in dialog.

```ts
// Plain TypeScript
import { DrawingList } from "scichart-scitrader";

const list = DrawingList.create(document.getElementById("drawings"), { controller: drawing, title: "Drawings" });
list.update({ title: "My drawings" }); // change options later
list.destroy(); // remove it
```

```tsx
// React
import { DrawingList } from "scichart-scitrader-react";

<DrawingList controller={controller} title="Drawings" />
```

### Drawing List Callbacks: onSelect, onEdit, onDelete and onClearAll {#drawing-list-callbacks}

Each callback you pass replaces the controller's own action for it, so you can log, confirm or change what happens. To keep the action as well, do it in the callback, as the examples below do:

| Callback | Called when | Default, with a `controller` |
| --- | --- | --- |
| `onSelect(id)` | A row is clicked | Select that drawing: `controller.select(item)` |
| `onEdit(id)` | A row's edit button is clicked. Passing it adds the button | No edit button. Open your own editor, or `controller.openEditor(item)` |
| `onDelete(id)` | A row's delete button is clicked | Remove that drawing: `controller.remove(item)` |
| `onClearAll()` | Clear all is confirmed | Remove every drawing: `controller.remove()` |
| `confirmClearAll(proceed)` | Clear all is clicked, before `onClearAll` | The built-in dialog. Ask your own way, and call `proceed()` if the user agrees |

Each callback gets the drawing's `id`, its annotation's id. Find the drawing with `controller.drawings.find((d) => d.id === id)`.

```ts
const find = (id: string) => drawing.drawings.find((d) => d.id === id);

DrawingList.create(container, {
    controller: drawing,
    onSelect: (id) => drawing.select(find(id)), // the default, made explicit
    onEdit: (id) => drawing.openEditor(find(id)), // adds an edit button: open the full editor
    onDelete: (id) => {
        analytics.track("drawing deleted"); // your own code
        drawing.remove(find(id)); // then the default action
    },
    confirmClearAll: (proceed) => myConfirmDialog("Remove every drawing?").then((yes) => yes && proceed()),
});
```

**Driving the list yourself.** Without a `controller`, pass `items`, the drawings to show, and the callbacks, and update `items` as your state changes: `list.update({ items })`, or new props in React. Each item has the drawing's `id`, its annotation `type`, and the `toolId` that made it, which tells an Elliott wave from a plain poly line.

| Option | Default | What it does |
| --- | --- | --- |
| `controller` | | The drawing tools to follow |
| `items` | | The drawings to show, without a `controller` |
| `onSelect`, `onEdit`, `onDelete`, `onClearAll`, `confirmClearAll` | | See [the callbacks](#drawing-list-callbacks) |
| `title` | `"Drawing Tools"` | The heading |
| `emptyMessage` | `"No drawing tools added yet"` | Shown when there are no drawings |

## TypeScript Example: A Drawing Toolbar and a Drawing List with Callbacks

A BTC-USD chart from Coinbase with a horizontal rail of six tools, chosen with `tools`, and the All drawing tools button. Draw a few things: they appear in the list on the right. Click a row, its edit or delete button, or Clear all, and the line at the bottom shows the callback. Clear all asks for confirmation in that line, through `confirmClearAll`, instead of the built-in dialog.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader name="../../_examples/components_DrawingToolbarList/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="tools"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div id="drawings" style="width: 280px; overflow-y: auto"></div></div><div id="log"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_DrawingToolbarList/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: A Drawing Toolbar and a Drawing List with Callbacks

The same in React. The confirmation is React state: `confirmClearAll` stores the `proceed` callback, and Remove all calls it.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader reactComponent="DrawingToolbarAndListChart" name="../../_examples/components_DrawingToolbarList/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_DrawingToolbarList/react.tsx
    ```
</CodeSnippetBlock>

## Styling the Drawing Toolbar and Drawing List

Both are styled by `scitrader.css`, with these classes:

| Class | Element |
| --- | --- |
| `.st-drawing-toolbar`, `.st-drawing-toolbar--vertical`, `.st-drawing-toolbar--horizontal` | The rail, in each orientation |
| `.st-drawing-toolbar__button` | A tool's button. `aria-pressed="true"` while its tool is in use |
| `.st-drawing-toolbar__divider` | A divider between tool groups, and before the All drawing tools button |
| `.st-drawing-toolbar__flyout`, `.st-drawing-toolbar__heading`, `.st-drawing-toolbar__item` | The All drawing tools panel, its group headings and its items |
| `.st-drawing-list`, `.st-drawing-list__header`, `.st-drawing-list__title` | The list, its header and heading |
| `.st-drawing-list__clear` | The Clear all button |
| `.st-drawing-list__items`, `.st-drawing-list__row` | The rows, and one row |
| `.st-drawing-list__icon`, `.st-drawing-list__label` | A row's tool icon and name |
| `.st-drawing-list__button`, `.st-drawing-list__edit`, `.st-drawing-list__delete` | A row's buttons |
| `.st-drawing-list__empty` | The message when there are no drawings |
| `.st-confirm-dialog`, `.st-confirm-dialog__panel`, `.st-confirm-dialog__title`, `.st-confirm-dialog__text`, `.st-confirm-dialog__actions`, `.st-confirm-dialog__cancel`, `.st-confirm-dialog__confirm` | The built-in Clear all dialog |

Colours come from the `--st-ui-*` CSS variables, so a [theme](/financial-charts/styling-and-themes/) restyles them. To change one thing, override its rule after importing `scitrader.css`:

```css
/* Bigger tool buttons on the rail */
.st-drawing-toolbar__button { width: 40px; height: 40px; }

/* Show the Clear all button in red */
.st-drawing-list__clear { color: #ef5350; }
```

<details>
<summary>The default drawing toolbar CSS (.st-drawing-toolbar), from scitrader.css</summary>

```css
.st-drawing-toolbar {
    gap: 2px;
    background: var(--st-ui-menu-background, rgba(20,20,30,0.95));
}

.st-drawing-toolbar--vertical {
    padding: 6px 4px;
    border-right: 1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-drawing-toolbar--horizontal {
    padding: 4px 6px;
    border-bottom: 1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-drawing-toolbar__button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.12);
    border-radius: 6px;
    background: transparent;
    color: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.55);
    cursor: pointer;
    transition: background 100ms, border-color 100ms, color 100ms;
}

.st-drawing-toolbar__button:hover:not([aria-pressed="true"]) {
    color: var(--st-ui-text, #ffffff);
}

.st-drawing-toolbar__button[aria-pressed="true"] {
    border-color: var(--st-ui-selection, #60A5FA);
    background: color-mix(in srgb, var(--st-ui-selection, #60A5FA) 15%, transparent);
    color: var(--st-ui-selection, #60A5FA);
}

.st-drawing-toolbar__divider {
    flex-shrink: 0;
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.1);
}

.st-drawing-toolbar--vertical .st-drawing-toolbar__divider {
    width: 24px;
    height: 1px;
    margin: 3px 0;
}

.st-drawing-toolbar--horizontal .st-drawing-toolbar__divider {
    width: 1px;
    height: 24px;
    margin: 0 3px;
}

.st-drawing-toolbar__flyout {
    padding: 6px;
    background: var(--st-ui-menu-background, rgba(20,20,30,0.95));
    border: 1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.12);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    font-family: var(--st-font-family, sans-serif);
    font-size: 13px;
}

.st-drawing-toolbar__heading {
    padding: 8px 6px 4px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--st-ui-text-muted, #9da2bc);
}

.st-drawing-toolbar__item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 6px 8px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--st-ui-text, #ffffff);
    cursor: pointer;
    text-align: left;
    font: inherit;
}

.st-drawing-toolbar__item:hover,
.st-drawing-toolbar__item[aria-pressed="true"] {
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-drawing-toolbar__item[aria-pressed="true"] {
    color: var(--st-ui-selection, #60A5FA);
}
```

</details>

<details>
<summary>The default drawing list CSS (.st-drawing-list), from scitrader.css</summary>

```css
.st-drawing-list {
    --bg: var(--st-ui-background, #2b2839);
    height: 100%;
    overflow: hidden;
    background: var(--st-ui-background, #2b2839);
    color: var(--st-ui-text-secondary, #c8cbdf);
    font-family: var(--st-font-family, "DM Sans", sans-serif);
}

.st-drawing-list__header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 8px;
    padding: 20px 24px 16px;
}

.st-drawing-list__title {
    flex: 1;
    color: var(--st-ui-text, #ffffff);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
}

.st-drawing-list__items {
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--st-ui-scrollbar-thumb, #4a4560) var(--st-ui-scrollbar-track, #1e1b2e);
}

.st-drawing-list__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-bottom: 1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.05);
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    outline: none;
}

.st-drawing-list__row:hover,
.st-drawing-list__row:focus-visible {
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.05);
}

.st-drawing-list__icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    color: var(--st-ui-text-muted, #9da2bc);
}

.st-drawing-list__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.st-drawing-list__empty {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    color: #5a5f7a;
    font-size: 13px;
    text-align: center;
}

.st-drawing-list__button {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--st-ui-text-muted, #9da2bc);
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease;
}

.st-drawing-list__clear {
    width: 36px;
    height: 36px;
}

.st-drawing-list__button:hover:not(:disabled) {
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-drawing-list__edit:hover {
    color: var(--st-ui-text, #ffffff);
}

.st-drawing-list__delete:hover,
.st-drawing-list__clear:hover:not(:disabled) {
    color: #ff6b6b;
}

.st-drawing-list__button:disabled {
    color: rgba(157, 162, 188, 0.35);
    cursor: default;
}

.st-drawing-list__button:focus-visible {
    outline: 2px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.45);
    outline-offset: -2px;
}
```

</details>

<details>
<summary>The default confirm dialog CSS (.st-confirm-dialog), from scitrader.css</summary>

```css
.st-confirm-dialog {
    background: rgba(0, 0, 0, 0.5);
}

.st-confirm-dialog__panel {
    box-sizing: border-box;
    width: calc(100% - 64px);
    max-width: 440px;
    margin: 32px;
    border-radius: 6px;
    background: var(--st-ui-background, #2b2839);
    color: var(--st-ui-text, #ffffff);
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14),
        0 9px 46px 8px rgba(0, 0, 0, 0.12);
    font-family: var(--st-font-family, "DM Sans", sans-serif);
}

.st-confirm-dialog__title {
    margin: 0;
    padding: 16px 24px;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.6;
}

.st-confirm-dialog__text {
    margin: 0;
    padding: 0 24px 20px;
    color: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.85);
    font-size: 13px;
}

.st-confirm-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px;
}

.st-confirm-dialog__cancel,
.st-confirm-dialog__confirm {
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
}

.st-confirm-dialog__cancel {
    color: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.7);
}

.st-confirm-dialog__confirm {
    color: #ff6b6b;
    font-weight: 600;
}

.st-confirm-dialog__cancel:hover {
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-confirm-dialog__confirm:hover {
    background: rgba(255, 107, 107, 0.08);
}
```

</details>

## DrawingToolbar API

<details>
<summary>The DrawingToolbar class, IDrawingToolbarOptions and DEFAULT_DRAWING_TOOLBAR_TOOLS, with their TSDoc</summary>

````ts
/**
 * The tools a toolbar shows when none are specified: one of each common family rather than the
 * whole catalogue. The rest are one click away in the "All drawing tools" panel.
 */
const DEFAULT_DRAWING_TOOLBAR_TOOLS: readonly TDrawingToolId[];

interface IDrawingToolbarOptions {
    /** Tools on the rail, in order. Default {@link DEFAULT_DRAWING_TOOLBAR_TOOLS}. */
    tools?: readonly TDrawingToolId[];
    /** Lay the rail out top to bottom (default) or left to right. */
    orientation?: "vertical" | "horizontal";
    /** Show the button that opens every tool, grouped and labelled. Default `true`. */
    showAllTools?: boolean;
}

/**
 * A drawing-tools rail in plain DOM, for any framework or none. It drives a
 * {@link DrawingToolsController}: click a tool to start it, click it again (or Stop) to cancel,
 * and the button lights up while the tool is in use. Its look is `.st-drawing-toolbar` in
 * `scitrader.css`, coloured by the SciTrader theme's CSS variables, so it follows `setTheme` on
 * the chart it sits beside.
 *
 * ```ts
 * const drawing = DrawingToolsController.attach(panel.financeApi);
 * const toolbar = DrawingToolbar.create(document.getElementById("tools"), drawing);
 * // later: toolbar.destroy(); drawing.detach();
 * ```
 *
 * React apps use the React `DrawingToolbar`.
 */
class DrawingToolbar {
    /** The rail element, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, controller: DrawingToolsController, options?: IDrawingToolbarOptions): DrawingToolbar;
    /** Change the tools on the rail. */
    setTools(tools: readonly TDrawingToolId[]): void;
    destroy(): void;
}
````

</details>

## DrawingList API

<details>
<summary>The DrawingList class and the IDrawingListOptions and IDrawingListItem interfaces, with their TSDoc</summary>

````ts
/** One drawing in a {@link DrawingList}. */
interface IDrawingListItem {
    /** The annotation's `id`. */
    id: string;
    /** The annotation type, an `ETradingAnnotationType` value. Names the row when `toolId` is absent. */
    type: string;
    /** The tool that made it, which tells presets apart (a pattern from a plain polyline). */
    toolId?: string;
}

/** Options for {@link DrawingList}. */
interface IDrawingListOptions {
    /**
     * The drawing tools to follow. The list shows `controller.drawings` as they change; clicking a
     * row selects that drawing, its delete button removes it, and "Clear all" removes them all.
     * Pass `items` and the callbacks instead to drive the list yourself.
     */
    controller?: DrawingToolsController;
    /** The drawings to show, when not following a `controller`. */
    items?: readonly IDrawingListItem[];
    /** Called when a row is clicked. Default with a `controller`: select that drawing. */
    onSelect?: (id: string) => void;
    /** When set, each row gets an edit button that calls this. */
    onEdit?: (id: string) => void;
    /** When set (or with a `controller`), each row gets a delete button. */
    onDelete?: (id: string) => void;
    /**
     * When set (or with a `controller`), the header gets a "Clear all" button. It asks for
     * confirmation first (see {@link confirmClearAll}), then calls this.
     */
    onClearAll?: () => void;
    /**
     * Ask for confirmation your own way before clearing: call `proceed` if the user agrees. Default:
     * a small built-in dialog (`.st-confirm-dialog`).
     */
    confirmClearAll?: (proceed: () => void) => void;
    /** The heading. Default `"Drawing Tools"`. */
    title?: string;
    /** Shown when there are no drawings. Default `"No drawing tools added yet"`. */
    emptyMessage?: string;
}

/**
 * The drawings on a chart as a list, in plain DOM, to go beside the {@link DrawingToolbar}: each
 * row shows the tool's icon and name, and clicking it selects the drawing. Optional row buttons
 * edit or delete a drawing, and a header button clears them all after a confirmation.
 *
 * Give it a {@link DrawingToolsController} and it follows the chart's drawings by itself; or pass
 * `items` and the callbacks to drive it from your own state. Its look is `.st-drawing-list` in
 * `scitrader.css`.
 *
 * ```ts
 * const drawing = DrawingToolsController.attach(panel.financeApi);
 * DrawingList.create(sidePanel, { controller: drawing });
 * ```
 *
 * React apps use the React `DrawingList`.
 */
class DrawingList {
    /** The list, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IDrawingListOptions): DrawingList;
    /** The drawings shown. */
    get items(): readonly IDrawingListItem[];
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<IDrawingListOptions>): void;
    destroy(): void;
}
````

</details>

## DrawingToolbar and DrawingList in React

The React components take the same options as props, plus `className` and `style` for their `<div>`. `DrawingToolbar` renders once its `controller` is set.

<details>
<summary>The React DrawingToolbar and DrawingList components and their props, from scichart-scitrader-react, with their TSDoc</summary>

````ts
/** Props for {@link DrawingToolbar}. */
interface IDrawingToolbarProps extends IDrawingToolbarOptions {
    /** The chart's drawing tools, from {@link useDrawingTools}. The rail renders once it is set. */
    controller: DrawingToolsController | undefined;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * The SDK's drawing-tools rail in React: the vanilla `DrawingToolbar`, mounted into a `<div>`.
 * Changing `tools` updates the rail in place; changing `orientation` or `showAllTools` rebuilds it.
 *
 * ```tsx
 * const { controller } = useDrawingTools(chart);
 *
 * <DrawingToolbar controller={controller} />
 * <SciFinanceChartView config={config} onInit={setChart} />
 * ```
 */
function DrawingToolbar({ controller, tools, orientation, showAllTools, className, style, }: IDrawingToolbarProps): JSX.Element;

/** Props for {@link DrawingList}. */
interface IDrawingListProps {
    /** The drawing tools to follow, from {@link useDrawingTools}. Or pass `items` and the callbacks. */
    controller?: DrawingToolsController;
    /** The drawings to show, when not following a `controller`. */
    items?: readonly IDrawingListItem[];
    /** Called when a row is clicked. Default with a `controller`: select that drawing. */
    onSelect?: (id: string) => void;
    /** When set, each row gets an edit button. */
    onEdit?: (id: string) => void;
    /** When set (or with a `controller`), each row gets a delete button. */
    onDelete?: (id: string) => void;
    /** When set (or with a `controller`), the header gets a "Clear all" button. */
    onClearAll?: () => void;
    /** Ask for confirmation your own way: call `proceed` if the user agrees. Default: a built-in dialog. */
    confirmClearAll?: (proceed: () => void) => void;
    title?: string;
    emptyMessage?: string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * The SDK's list of drawings in React: the vanilla `DrawingList` in a `<div>`. With a
 * `controller` it follows the chart's drawings by itself:
 *
 * ```tsx
 * const { controller } = useDrawingTools(chart);
 *
 * <DrawingToolbar controller={controller} />
 * <DrawingList controller={controller} />
 * ```
 */
function DrawingList({ className, style, ...options }: IDrawingListProps): JSX.Element;
````

</details>

## Where to read next

- [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/): the controller the toolbar and list drive.
- [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue): the tool ids for the rail.
- [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/): the full editor that `openEditor` opens.
