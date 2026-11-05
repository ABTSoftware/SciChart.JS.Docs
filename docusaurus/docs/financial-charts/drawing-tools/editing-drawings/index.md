---
sidebar_position: 2
sidebar_label: Editing Drawings
title: "Editing Drawings: Quick-Edit Toolbar, Editor and Events | SciTrader.js"
description: "Edit drawings on SciTrader.js trading charts: the quick-edit toolbar and full editor for users, editing drawings in code, selection and drag events, and drawing colours and themes, in JavaScript and React."
keywords: ["SciTrader", "SciTrader.js", "edit chart drawings", "annotation editor", "drawing tools events", "annotation selectedChanged", "chart annotations JavaScript", "React financial chart drawing tools"]
---

# Editing Drawings

Users edit a drawing by selecting it: they can drag it, or its points, and change its look in the **quick-edit toolbar** and the **full editor**. Your code can edit drawings too, and follow what users do through each drawing's **events**. This page covers all of these.

## Selecting and Moving Drawings

A drawing with `isEditable: true` can be selected: drawings made with the drawing tools always are, and set it on drawings you add in code. Click a drawing to select it, or call `drawing.select(item)`. A selected drawing shows its points as handles:

- **drag a handle** to move that point;
- **drag the drawing** to move it all;
- **click elsewhere**, or call `drawing.clearSelection()`, to deselect it.

On a touch screen, a long press selects a drawing; see [Keyboard and Touch](/financial-charts/drawing-tools/keyboard-and-touch/#touch). With the keyboard, `N` and `P` step through the drawings, and the arrow keys nudge the selected one.

## The Quick-Edit Toolbar

A selected drawing gets a floating toolbar on the chart, following it as the chart pans and zooms. `DrawingToolsController` adds it. From left to right, it has:

- **a drag handle**, to move the toolbar out of the way;
- **a colour picker**, for drawings with one stroke colour;
- **a thickness stepper**, − and +;
- **delete**, which removes the drawing;
- **⋯**, which opens the full editor. It appears only when the controller has an `editorContainer`.

Its look is `.st-inline-toolbar` in `scitrader.css`.

## The Full Editor {#full-editor}

The full editor shows every option of the selected drawing: its colours, thicknesses, label settings, Fibonacci levels and so on, each applied as it is changed. To offer it, pass an element to mount it in as `editorContainer`:

```ts
const drawing = DrawingToolsController.attach(financeChartPanel.financeApi, {
    editorContainer: document.getElementById("editor"), // where the full editor is mounted
    // Called as the full editor opens, from the quick-edit toolbar's ⋯ or openEditor: e.g. to show its panel
    onOpenFullEditor: (annotation) => editorPanel.classList.add("open"),
    editorRootClassName: "docked-editor", // a class for the editor's root element
    editorPanelClassName: "docked-editor-panel", // a class for its panel
});

drawing.openEditor(item); // select a drawing and open the full editor for it, e.g. from an Edit button
```

**Docking the editor.** The editor sets its own position and look inline, as a floating panel near the top right of the page. To dock it in its container instead, give it classes with `editorRootClassName` and `editorPanelClassName`, and override its position with `!important`:

```css
/* The editor's root: fill its container rather than float */
.docked-editor {
    position: static !important;
    inset: auto !important;
    width: 100% !important;
    height: 100% !important;
    overflow-y: auto;
}
/* The editor's panel: full width, without the floating panel's corners and shadow */
.docked-editor-panel {
    width: 100% !important;
    max-height: 100% !important;
    box-sizing: border-box;
    border-radius: 0 !important;
    box-shadow: none !important;
}
```

The [examples](#editing-example) below do this, with the editor in a side panel under the [Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/), whose Edit buttons call `openEditor`.

## Editing Drawings in Code {#in-code}

A drawing is an annotation, so you edit it by setting its properties. Find it in `drawing.drawings`, or keep the annotation you created:

```ts
import { Point } from "scichart";
import { FibonacciRetracementAnnotation } from "scichart-financial-tools";

const fib = drawing.drawings.find((item) => item.type === "FibonacciRetracementAnnotation")
    ?.annotation as FibonacciRetracementAnnotation;

fib.points = [new Point(startTime, startPrice), new Point(endTime, endPrice)]; // move its points
fib.thresholds = [0, 0.382, 0.5, 0.618, 1]; // its own options: here, its levels
fib.isEditable = false; // lock it: the user can no longer select or move it
fib.isHidden = true; // hide it, without removing it
```

Each tool's options are listed on its page under [Add Drawing Tools](/financial-charts/drawing-tools/add-drawing-tools/), and the [catalogue](/financial-charts/drawing-tools/#the-catalogue) gives every tool's annotation class.

## Selection and Edit Events {#events}

`DrawingToolsController` raises an event when a drawing is added or removed (`drawingsChanged`). Selection and edits are raised by **each drawing's annotation**: SciChart's annotation events.

| Event | Raised when | Payload |
| --- | --- | --- |
| `selectedChanged` | The drawing is selected or deselected | `true` when selected |
| `dragStarted` | The user starts dragging the drawing or one of its points | |
| `dragDelta` | During the drag | The movement, as `AnnotationDragDeltaEventArgs` |
| `dragEnded` | The user has moved the drawing or one of its points | |
| `clicked` | The drawing is clicked, whether or not it is editable | `AnnotationClickEventArgs` |
| `hovered` | The mouse moves over the drawing | `AnnotationHoverEventArgs` |

To follow every drawing, subscribe to each new one as `drawingsChanged` reports it. `IDrawingItem.annotation` is typed as SciChart's `IAnnotation`, which doesn't declare the events; they are on `AnnotationBase`, which every drawing extends:

```ts
import { AnnotationBase, IAnnotation } from "scichart";

const watched = new Set<IAnnotation>();
drawing.drawingsChanged.subscribe((items) =>
    items
        .filter((item) => !watched.has(item.annotation))
        .forEach(({ annotation }) => {
            watched.add(annotation);
            const events = annotation as AnnotationBase;
            events.selectedChanged.subscribe((selected) => console.log(annotation.type, selected ? "selected" : "deselected"));
            events.dragEnded.subscribe(() => console.log(annotation.type, "moved"));
        })
);
```

For a drawing you create in code, you can pass the same as callbacks in its options instead: `onDragStarted`, `onDrag`, `onDragEnded`, `onClick` and `onHover`.

Edits made in the quick-edit toolbar or the full editor, such as a new colour, change the annotation's properties without raising an event.

<details>
<summary>The annotation events and callback options, from scichart's AnnotationBase, with their TSDoc</summary>

```ts
// On every drawing's annotation (SciChart's AnnotationBase)
selectedChanged: EventHandler<boolean>;
dragStarted: EventHandler<void>;
dragDelta: EventHandler<AnnotationDragDeltaEventArgs>;
dragEnded: EventHandler<void>;
clicked: EventHandler<AnnotationClickEventArgs>;
hovered: EventHandler<AnnotationHoverEventArgs>;

// The same as callbacks, in the options of an annotation you create (IAnnotationBaseOptions)
/**
 * Callback function called when drag has started. Only applicable if {@link isEditable} is true
 */
onDragStarted?: (() => void) | string;
/**
 * Callback function called when drag has ended. Only applicable if {@link isEditable} is true
 */
onDragEnded?: (() => void) | string;
/**
 * Callback function called when drag operation is in progress. Only applicable if {@link isEditable} is true
 */
onDrag?: ((args: AnnotationDragDeltaEventArgs) => void) | string;
/**
 * Callback function called when the annotation is clicked.  Fires even for non Editable annotations
 */
onClick?: ((args: AnnotationClickEventArgs) => void) | string;
/**
 * Callback function called when the annotation is hovered. Fires even for non Editable annotations
 */
onHover?: ((args: AnnotationHoverEventArgs) => void) | string;
```

</details>

## TypeScript Example: Editing Drawings with the Full Editor and Events {#editing-example}

A BTC-USD chart from Coinbase with a Fibonacci retracement to edit. Click it to select it: the quick-edit toolbar appears on it, and the line at the bottom follows its `selectedChanged` and `dragEnded` events. Drag it or its points. Press the pencil in the list on the right to open the full editor below the list. Draw more with the rail at the top.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader name="../../_examples/drawing_Editing/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="tools"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div style="display: flex; flex-direction: column; width: 320px"><div id="drawings" style="max-height: 40%; overflow-y: auto"></div><div id="editor" style="flex: 1; min-height: 0; overflow-y: auto"></div></div></div><div id="log"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/drawing_Editing/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Editing Drawings with the Full Editor and Events

The same chart in React. The editor's element is rendered with the component, and the events are subscribed in an effect, which unsubscribes when the drawings change.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader reactComponent="EditingDrawingsChart" name="../../_examples/drawing_Editing/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/drawing_Editing/react.tsx
    ```
</CodeSnippetBlock>

## Drawing Colours and Themes

Drawings follow the chart's [theme](/financial-charts/styling-and-themes/) wherever they have no colour of their own: a line drawn with a tool that sets no colour takes the theme's drawing line colour, and changes with `setTheme`. A colour set by the tool, in your code, or in the editor is kept. The chart does this with `applyDrawingTheme`, as drawings are placed or restored and on every theme change. The theme's drawing colours are listed under [How Drawings Work](/financial-charts/drawing-tools/#how-drawings-work).

<details>
<summary>The applyDrawingTheme function, with its TSDoc</summary>

```ts
/**
 * Give a drawing `to`'s colours wherever it still has a default colour: one its tool left unset,
 * or one some theme put there (a built-in theme's, or `from`'s, the theme being replaced). Colours
 * set in the drawing's editor, and the colours tools choose for themselves, are left alone.
 *
 * `SciFinanceChart` calls this as drawings are placed or restored, and for every drawing on
 * `setTheme`.
 */
function applyDrawingTheme(drawing: unknown, to: ISciTraderDrawingColors, from?: ISciTraderDrawingColors): void;
```

</details>

## Styling the Quick-Edit Toolbar

| Class | Element |
| --- | --- |
| `.st-inline-toolbar` | The toolbar |
| `.st-inline-toolbar__handle` | The drag handle |
| `.st-inline-toolbar__swatch` | The colour picker's swatch |
| `.st-inline-toolbar__value` | The thickness value |
| `.st-inline-toolbar__button` | The thickness, delete and ⋯ buttons |
| `.st-inline-toolbar__separator` | The dividers between groups |

```css
/* A larger, square quick-edit toolbar */
.st-inline-toolbar { border-radius: 0; padding: 6px; } /* square corners, more space */
.st-inline-toolbar__button { width: 32px; height: 32px; } /* bigger buttons */
```

<details>
<summary>The default quick-edit toolbar CSS (.st-inline-toolbar), from scitrader.css</summary>

```css
.st-inline-toolbar {
    gap: 4px;
    padding: 6px 8px;
    border-radius: 6px;
    background: var(--st-ui-menu-background, rgba(20,20,30,0.95));
    border: 1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.st-inline-toolbar__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--st-ui-icon, #e5e7eb);
    cursor: pointer;
}

.st-inline-toolbar__button:hover {
    color: var(--st-ui-text, #ffffff);
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}

.st-inline-toolbar__handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 22px;
    color: rgba(229, 231, 235, 0.55);
    cursor: grab;
}

.st-inline-toolbar__handle:hover {
    color: var(--st-ui-text, #ffffff);
}

.st-inline-toolbar__separator {
    width: 1px;
    height: 18px;
    margin: 0 4px;
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.12);
}

.st-inline-toolbar__swatch {
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.25);
    border-radius: 4px;
    cursor: pointer;
}

.st-inline-toolbar__swatch:hover {
    border-color: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.45);
}

.st-inline-toolbar__value {
    min-width: 24px;
    font-size: 12px;
    text-align: center;
    color: var(--st-ui-icon, #e5e7eb);
}
```

</details>

<details>
<summary>The InlineAnnotationToolbar class, with its TSDoc</summary>

```ts
/**
 * TradingView-style quick-edit strip rendered as a floating toolbar over the
 * chart. Color picker (native), thickness stepper, delete, and a "⋯" (Tune)
 * button that opens the full editor. Appends itself to `container` on
 * construction; {@link destroy} removes it.
 */
class InlineAnnotationToolbar {
    constructor(container: HTMLElement, options: IInlineAnnotationToolbarOptions);
    /** Remove the toolbar from the DOM. */
    destroy(): void;
}
```

</details>

## Where to read next

- [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/): point-and-click drawing, and drawings in code.
- [Keyboard and Touch](/financial-charts/drawing-tools/keyboard-and-touch/): selecting, deleting and nudging drawings with the keyboard.
- [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/): the list's Edit and Delete buttons.
