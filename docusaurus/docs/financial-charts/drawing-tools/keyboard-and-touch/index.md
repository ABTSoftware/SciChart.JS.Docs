---
sidebar_position: 3
sidebar_label: Keyboard and Touch
title: "Keyboard Shortcuts and Touch Gestures for Drawing Tools | SciTrader.js"
description: "Add keyboard shortcuts, touch gestures and on-chart zoom buttons to SciTrader.js trading charts: select, delete, duplicate and nudge drawings from the keyboard, long-press drawings on touch screens, in JavaScript and React."
keywords: ["SciTrader", "SciTrader.js", "chart keyboard shortcuts", "touch chart drawing", "mobile trading chart", "AnnotationKeyboardSelectionModifier", "OnChartButtonsModifier", "React financial chart"]
---

# Keyboard and Touch

SciTrader has optional modifiers that let users work the chart and its drawings from the keyboard, and a touch mode for the drawing tools on phones and tablets:

| Modifier or option | What it adds |
| --- | --- |
| [`OnChartKeyboardZoomPanModifier`](#zoom-and-pan-keys) | Arrow keys pan, `+` and `-` zoom, `0` resets the zoom |
| [`AnnotationKeyboardSelectionModifier`](#drawing-keys) | Keys to select, delete, duplicate and nudge drawings, and to draw again |
| [`OnChartButtonsModifier`](#on-chart-buttons) | Zoom, pan and reset buttons on the pane under the mouse |
| [The controller's `touch` option](#touch) | Long press selects a drawing; placement uses a cursor you drag and tap |

The modifiers are SciChart chart modifiers: add them to each pane's surface, as [below](#adding-the-modifiers-to-every-pane).

## Keyboard Focus

A pane takes keyboard focus when it is clicked, and the keys act on that pane. The keyboard modifiers make each pane focusable with Tab too, and add the class `st-pane--focused` to the focused pane, or to the element you pass as `focusIndicatorElement`.

:::tip
`scitrader.css` doesn't style `st-pane--focused`, so a focused pane looks no different. Give it a look of your own, so keyboard users can see which pane the keys act on:
:::

```css
/* An outline on the pane with keyboard focus */
.st-pane--focused { outline: 2px solid var(--st-ui-selection, #6c63ff); outline-offset: -2px; }
```

## Zoom and Pan Keys: OnChartKeyboardZoomPanModifier {#zoom-and-pan-keys}

| Key | Action |
| --- | --- |
| `←` / `→` | Pan the time axis left or right |
| `+` or `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset the zoom to fit |
| Shift with any of these | A bigger step |

Keys with Ctrl, Alt or Cmd are left to the browser. When a drawing is selected, the arrow keys nudge it instead; see below.

## Drawing Keys: AnnotationKeyboardSelectionModifier {#drawing-keys}

| Key | Action |
| --- | --- |
| `N` / `P` | Select the next or previous drawing, across every pane |
| `Delete` or `Backspace` | Remove the selected drawing |
| `D` | Duplicate the selected drawing, offset 20 pixels down and right, and select the copy |
| Arrow keys | Nudge the selected drawing by 1 pixel, or 10 with Shift |
| `Esc` | Deselect, and call `onCancelPlacement` |
| `A` | Call `onAddAnnotation`, e.g. to draw again with the last tool |

`A` and `Esc` call back to your app, which knows which tool to start and how to cancel:

```ts
new AnnotationKeyboardSelectionModifier({
    // A: draw again with the last tool used, or freehand if none has been
    onAddAnnotation: () => drawing.selectTool(drawing.lastUsedTool ?? ETradingAnnotationType.FreehandDrawingAnnotation),
    // Esc: also cancel a drawing in progress
    onCancelPlacement: () => drawing.stop(),
    // Called when N, P, D, Delete or Esc changes the selection: the drawing, or undefined
    onSelectionChanged: (annotation) => console.log("selected by keyboard:", annotation),
});
```

`onSelectionChanged` covers keyboard selection only. For every selection, use each drawing's `selectedChanged` event; see [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/#events).

## On-Chart Buttons: OnChartButtonsModifier {#on-chart-buttons}

`OnChartButtonsModifier` adds a strip of zoom in, zoom out, pan left, pan right and reset buttons to the bottom of the pane under the mouse. On a touch screen, the strip shows on the pane last tapped. `visible: false` attaches it hidden, and `setVisible(true)` shows it later, e.g. from a setting.

Its look is `.st-on-chart-buttons` in `scitrader.css`.

## Touch Screens: the touch Option {#touch}

Pass `touch: true` to `DrawingToolsController.attach`, or to `useDrawingTools` in React, for a touch layout:

- **A long press selects a drawing**, and keeps it held so a drag moves it straight away. A tap doesn't select, because it may start a pan. The phone vibrates briefly where the browser allows.
- **Placement uses a cursor:** drag to aim, then tap to commit each point. Lifting after a drag only moves the cursor.

:::warning
The placement cursor applies to a mouse too: with `touch` on, a mouse user also drags the cursor to aim and clicks to commit each point. Selection by mouse is unchanged. Turn `touch` on for touch screens only, e.g. from `matchMedia("(pointer: coarse)")`:
:::

```ts
const drawing = DrawingToolsController.attach(financeChartPanel.financeApi, {
    touch: matchMedia("(pointer: coarse)").matches, // on for phones and tablets
    selectFinishedDrawing: false, // leave a new drawing unselected, so its editor doesn't cover the chart
});
```

| Option | What it does |
| --- | --- |
| `touch` | `true` for the touch layout. Pass `AnnotationTouchSelectionModifier` options instead to tune it: `holdDurationMs` (450), `cancelThresholdPx` (10), `hitSlopPx` (22), `hapticDurationMs` (10, or 0 for none) |
| `selectFinishedDrawing` | Whether a new drawing stays selected, showing its quick-edit toolbar. Default `true`. `false` suits a phone, where an editor would cover the chart |
| `resumeGestures` | Called to turn pan, x-axis drag and zoom-to-extents back on when a tool finishes. By default the controller turns them back on itself. Pass this if your app sometimes keeps them off, e.g. a touch "cursor mode" in which a drag moves the crosshair |

## Adding the Modifiers to Every Pane

Add the modifiers to each pane's surface, `chart.chartPanes`. A study can add a pane later, and `paneConfigured` fires as each pane is set up, so add them to new panes then:

```ts
const done = new Set<SciChartSurface>();
const addToAllPanes = () =>
    chart.chartPanes.forEach(({ surface }) => {
        if (!surface || done.has(surface)) return;
        done.add(surface);
        surface.chartModifiers.add(
            new OnChartKeyboardZoomPanModifier(),
            new AnnotationKeyboardSelectionModifier({ onAddAnnotation, onCancelPlacement }),
            new OnChartButtonsModifier({ visible: true })
        );
    });
addToAllPanes();
chart.paneConfigured.subscribe(addToAllPanes);
```

## TypeScript Example: Keyboard Shortcuts, Touch and On-Chart Buttons

A BTC-USD chart from Coinbase with an RSI pane, the drawing-tools rail, and all three modifiers on every pane. Draw something, click a pane, then try the keys listed above the chart. Hover a pane for its zoom and pan buttons. On a touch screen, `touch` is on: long-press a drawing to select it.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/drawing_KeyboardTouch/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="keys"></div><div style="display: flex; flex: 1; min-height: 0"><div id="tools"></div><div id="chart" style="flex: 1; min-width: 0"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/drawing_KeyboardTouch/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Keyboard Shortcuts, Touch and On-Chart Buttons

The same chart in React. The modifiers are added in an effect, once the chart and the controller are ready, and to panes added later.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="KeyboardAndTouchChart" name="../../_examples/drawing_KeyboardTouch/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/drawing_KeyboardTouch/react.tsx
    ```
</CodeSnippetBlock>

## Styling the On-Chart Buttons

| Class | Element |
| --- | --- |
| `.st-on-chart-buttons` | The strip |
| `.st-on-chart-buttons__button` | A button |

<details>
<summary>The default on-chart buttons CSS (.st-on-chart-buttons), from scitrader.css</summary>

```css
.st-on-chart-buttons {
    gap: 4px;
    padding: 4px;
    border-radius: 6px;
    background: var(--st-ui-toolbar-background, rgba(20,20,30,0.85));
}

.st-on-chart-buttons__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--st-ui-icon, #e5e7eb);
    cursor: pointer;
}

.st-on-chart-buttons__button:hover {
    color: var(--st-ui-text, #ffffff);
    background: rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08);
}
```

</details>

## Keyboard and Touch API

<details>
<summary>The OnChartKeyboardZoomPanModifier and AnnotationKeyboardSelectionModifier classes, their options and FOCUSED_PANE_CLASS, with their TSDoc</summary>

```ts
/**
 * Chart navigation via the keyboard. Mirrors {@link OnChartButtonsModifier}'s
 * button actions:
 *
 * - `ArrowLeft` / `ArrowRight` — pan the X axis left / right.
 * - `=` / `+` — zoom in.
 * - `-` — zoom out.
 * - `0` — reset to fit.
 * - Hold `Shift` with any of the above for a {@link SHIFT_MULTIPLIER}×
 *   step.
 *
 * Modifier keys (Ctrl/Alt/Cmd) bypass the handler — they're already
 * filtered out by {@link ChartKeyboardModifierBase.handleKeyDownBound}.
 *
 * Actions delegate to the surface's existing finance modifiers
 * ({@link RightPeggedMouseWheelModifier.panXBy} /
 * {@link RightPeggedMouseWheelModifier.zoomXBy} /
 * {@link FinChartZoomExtentsModifier.resetZoom}) so the feel matches the
 * wheel, double-click and on-chart-button paths.
 *
 * Co-exists with {@link AnnotationKeyboardSelectionModifier} (N / P / Esc)
 * — different key map, no overlap.
 */
class OnChartKeyboardZoomPanModifier extends ChartKeyboardModifierBase {
    readonly type: string;
    constructor(options?: IChartKeyboardModifierOptions);
}

/**
 * Annotation selection keyboard layer — operates across every pane in
 * the dashboard at once. The user can cycle / delete / nudge selection
 * without first clicking a specific pane.
 *
 * - `N` / `n` advances to the next annotation in z-order across ALL panes
 *   (wraps when the last pane's last annotation is reached).
 * - `P` / `p` retreats the same way.
 * - `Escape` clears the selection on every pane AND invokes the
 *   `onCancelPlacement` callback so the App can cancel any in-flight
 *   placement / freehand draw on the side.
 * - `Delete` / `Backspace` removes the currently-selected annotation
 *   (operates on `annotation.parentSurface` so the right collection is
 *   touched).
 * - `D` / `d` duplicates the selected annotation — same type and options,
 *   points offset 20 px down-right, added to the same surface, selection
 *   transferred to the duplicate.
 * - `A` / `a` invokes the `onAddAnnotation` callback (passed via options).
 *   App-side wiring re-triggers the last-used drawing tool on the
 *   currently-active pane.
 * - Arrow keys nudge the selected annotation by 1 px (10 px with Shift).
 *   When NO annotation is selected the keys are passed through and
 *   `OnChartKeyboardZoomPanModifier` pans the focused pane instead.
 *
 * Implementation:
 * - Each pane has its own modifier instance (registered in `onAttach`).
 * - Instances register themselves in {@link AnnotationKeyboardSelectionModifier.instances}.
 * - `shouldHandle` only returns true on the first instance ("leader")
 *   so a single keystroke isn't handled three times.
 * - The leader reads annotations from EVERY instance's surface, not
 *   just its own, giving cross-pane behaviour.
 */
class AnnotationKeyboardSelectionModifier extends ChartKeyboardModifierBase {
    readonly type: string;
    constructor(options?: IAnnotationKeyboardModifierOptions);
    onAttach(): void;
    onDetach(): void;
}

/** Shared options across every chart keyboard modifier (annotation + zoom/pan). */
interface IChartKeyboardModifierOptions extends IChartModifierBaseOptions {
    /**
     * Pane container element the focus indicator class should be applied to.
     * Defaults to `parentSurface.domChartRoot` if not provided.
     */
    focusIndicatorElement?: HTMLElement;
}

/** Annotation-keyboard-specific options layered on top of {@link IChartKeyboardModifierOptions}. */
interface IAnnotationKeyboardModifierOptions extends IChartKeyboardModifierOptions {
    /**
     * Optional callback invoked when the selected annotation changes by
     * keyboard. Future inline-toolbar integration subscribes here.
     */
    onSelectionChanged?: (annotation: unknown) => void;
    /**
     * Fires when the user presses `A` to add a new annotation. The
     * caller receives the currently-active sub-surface (last-clicked,
     * via {@link ChartKeyboardModifierBase.activeSurface}) so the App
     * can locate the right pane's placement modifier and re-trigger the
     * last-used drawing tool there. Undefined when no pane has been
     * clicked yet.
     */
    onAddAnnotation?: (activeSurface: unknown) => void;
    /**
     * Fires when the user presses `Escape`. The modifier always clears
     * its own selection state first; this callback gives the App a hook
     * to additionally cancel any in-flight placement / freehand drawing
     * on the side. Safe to call when nothing is in flight (no-op).
     */
    onCancelPlacement?: () => void;
}

/** CSS class applied to the focus-indicator element while the pane is focused. */
const FOCUSED_PANE_CLASS = "st-pane--focused";
```

</details>

<details>
<summary>The AnnotationTouchSelectionModifier class and its options, with their TSDoc</summary>

```ts
/** Options for {@link AnnotationTouchSelectionModifier}. */
interface IAnnotationTouchSelectionModifierOptions extends IChartModifierBaseOptions {
    /** Long-press duration in ms before selection fires. Default 450. */
    holdDurationMs?: number;
    /** Cancel-on-move threshold in px. Default 10. */
    cancelThresholdPx?: number;
    /** Hit-slop radius in px for the long-press hit test. Default 22. */
    hitSlopPx?: number;
    /**
     * Haptic feedback duration in ms (Android / Chrome Vibration API).
     * Default 10. Set to 0 to disable. iOS Safari ignores this — no
     * cross-browser haptic on iOS without a native bridge.
     */
    hapticDurationMs?: number;
}

/**
 * Touch-side selection modifier. Two responsibilities:
 *
 * 1. **Long-press to select + immediately engage drag.** On
 *    `pointerType === "touch"`, runs a hold timer and selects the first
 *    annotation under the original pointer after `holdDurationMs`. The
 *    selection path also synthesises `ModifierMouseArgs` from the stored
 *    PointerEvent and calls `annotation.onDragStarted(args)` so SciChart's
 *    `isDraggingStarted` flag flips immediately — that way if the user
 *    keeps the finger down and starts moving, SciChart's
 *    `MouseManager.modifierMouseMove` already routes pointermove to
 *    `onDragAdorner` (annotation drag) instead of `ZoomPanModifier.pan`.
 *    Pan / x-axis-drag are disabled while the drag is active and restored
 *    on pointerup. Fires a short haptic via the Vibration API on
 *    successful selection (no-op on iOS Safari).
 *
 * 2. **Suppress tap-to-select-different.** SciChart's `MouseManager`
 *    exposes an {@link isAnnotationInteractionBypassActive} hook (also
 *    used by the placement / freehand modifiers): when truthy, the
 *    surface skips `adornerLayer.selectAnnotation()` on pointerdown. We
 *    return true ONLY when the pointer is on a *different* annotation
 *    than the currently-selected one. Net effect on touch:
 *
 *      - tap empty area (no selection) → SciChart proceeds, no hit, no-op
 *      - tap empty area (selection exists) → SciChart proceeds, drags
 *        nothing, falls through to selectAnnotation → no hit → DESELECTS
 *      - tap selected annotation's body / grip → bypass off → SciChart's
 *        clip-area + onDragStarted check engages drag normally
 *      - tap a non-selected annotation → bypass on → tap-select suppressed
 *      - long-press on any annotation → select + drag engaged in one go
 *
 * Mouse / pen input is untouched — `touchInFlight` stays `false` for
 * those pointer types and the bypass getter returns `false`, so desktop
 * selection works exactly as before.
 */
class AnnotationTouchSelectionModifier extends ChartModifierBase2D {
    readonly type: string;
    constructor(options?: IAnnotationTouchSelectionModifierOptions);
    onAttach(): void;
    onDetach(): void;
    /**
     * SciChart's `MouseManager` reads this on every pointerdown. Returning
     * `true` skips `adornerLayer.selectAnnotation()` entirely. We bypass
     * ONLY when the pointer is on a non-selected annotation. In every
     * other case (empty area / on the currently-selected annotation /
     * mouse input) we let SciChart's normal flow run, which handles:
     *
     *   - tap-empty-while-selected → deselect (via selectAnnotation
     *     loop returning no hit)
     *   - tap-grip / tap-body of selected → onDragStarted engages
     *   - mouse input → standard desktop selection
     */
    get isAnnotationInteractionBypassActive(): boolean;
}
```

</details>

<details>
<summary>The OnChartButtonsModifier class and its options, with their TSDoc</summary>

```ts
/** Options for {@link OnChartButtonsModifier}. */
interface IOnChartButtonsModifierOptions extends IChartModifierBaseOptions {
    /**
     * When false the modifier still attaches but never adds the host
     * annotation.
     */
    visible?: boolean;
}

/**
 * Chart modifier that hosts the per-pane zoom / pan / reset strip as an
 * {@link HtmlCustomAnnotation} pinned to the bottom-centre of the sub-chart
 * in relative coordinates (so it doesn't drift with pan/zoom).
 *
 * Visibility: shown when the cursor is over the pane (SciChart's per-pane
 * `modifierMouseEnter` / `modifierMouseMove`), hidden only when the cursor
 * leaves the whole chart (`domChartRoot`'s `pointerleave`). Crucially, hide is
 * NOT driven by the canvas leaving — so moving the cursor from the canvas onto
 * a sibling HTML overlay (this strip, the annotation edit toolbar) does not
 * hide it. Toggling is done via the annotation's own `isHidden` property.
 *
 * Fully framework-free: the modifier builds its own vanilla button strip
 * ({@link createOnChartButtonsStrip}) into the host on attach. It exposes:
 * - {@link panLeft} / {@link panRight} / {@link zoomIn} / {@link zoomOut} /
 *   {@link reset} — operations that look up the sibling finance modifiers
 *   on the same surface ({@link RightPeggedMouseWheelModifier} for pan and
 *   zoom, {@link FinChartZoomExtentsModifier} for reset) and delegate, so
 *   the feel matches the wheel / double-click paths exactly.
 */
class OnChartButtonsModifier extends ChartModifierBase2D {
    readonly type: string;
    constructor(options?: IOnChartButtonsModifierOptions);
    /**
     * The annotation host the vanilla button strip is built into. Undefined
     * while the modifier hasn't been attached yet or `visible` was false at
     * construction time. Exposed for tests / advanced callers.
     */
    get htmlElement(): HTMLElement | undefined;
    onAttach(): void;
    onDetach(): void;
    /**
     * Live toggle for the preference. Adds or removes the host annotation
     * to honour `chartInstancePrefs.onChartButtonsVisible` flips without
     * requiring a chart re-init.
     */
    setVisible(visible: boolean): void;
    modifierMouseDown(args: ModifierMouseArgs): void;
    modifierMouseEnter(args: ModifierMouseArgs): void;
    modifierMouseMove(args: ModifierMouseArgs): void;
    modifierPointerCancel(args: ModifierMouseArgs): void;
    /**
     * Pan the chart left by `deltaPx` pixels. Delegates to the surface's
     * {@link RightPeggedMouseWheelModifier} so the motion matches the wheel
     * Pan branch (same EClipMode.None, same autoRange handling).
     */
    panLeft(deltaPx?: number): void;
    /**
     * Pan the chart right by `deltaPx` pixels.
     */
    panRight(deltaPx?: number): void;
    /**
     * Zoom in (shrink visible X range, right-edge pegged). Delegates to
     * {@link RightPeggedMouseWheelModifier.zoomXBy}.
     */
    zoomIn(fraction?: number): void;
    /**
     * Zoom out (grow visible X range, right-edge pegged).
     */
    zoomOut(fraction?: number): void;
    /**
     * Reset zoom — animates X and Y back to extents. Delegates to
     * {@link FinChartZoomExtentsModifier.resetZoom} so the double-click
     * and the on-chart "reset" button behave identically.
     */
    reset(): void;
}
```

</details>

## Where to read next

- [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/): selection and edit events.
- [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/): point-and-click drawing.
- [Layout](/financial-charts/sci-finance-chart/layout/): the panes the modifiers go on.
