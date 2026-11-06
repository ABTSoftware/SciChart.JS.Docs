---
sidebar_position: 7
sidebar_label: Drawing Tools
title: "Trading Chart Drawing Tools: Trend Lines, Fibonacci, Patterns | SciTrader.js"
description: "Every drawing tool in SciTrader.js trading charts: trend lines, channels, pitchforks, Fibonacci retracements, Elliott wave and harmonic patterns, measure and risk tools, for JavaScript and React financial charts."
keywords: ["SciTrader", "SciTrader.js", "trading chart drawing tools", "chart drawing tools JavaScript", "trend line JavaScript chart", "Fibonacci retracement chart", "Elliott wave chart", "React financial chart drawing tools"]
---

# Drawing Tools

SciTrader has 34 drawing tools for marking up a trading chart: trend lines, channels, pitchforks, Fibonacci tools, Elliott wave and harmonic patterns, measure and risk tools, and a freehand pen. Each drawing is an annotation from `scichart-financial-tools`, drawn on a pane of the chart.

- **Add them with point and click.** `DrawingToolsController` turns the chart into a drawing surface: select a tool, then click the chart to place its points. The ready-made [Drawing Toolbar](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/) gives users the tools.
- **Or add them in code**, by creating the annotation with its points and adding it to a pane.
- **Edit them.** A selected drawing gets a quick-edit toolbar, and the full editor has every option.
- **Keep them.** Drawings are [saved and restored with the chart](/financial-charts/save-and-restore/), and follow its [theme](/financial-charts/styling-and-themes/).

This section covers:

| Page | What it covers |
| --- | --- |
| [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/) | Enabling point-and-click drawing, adding drawings in code, and listing, selecting and removing drawings. Under it, a page for each of the most popular drawing tools |
| [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/) | The quick-edit toolbar, the full editor, editing drawings in code, and selection and edit events |
| [Keyboard and Touch](/financial-charts/drawing-tools/keyboard-and-touch/) | Keyboard shortcuts, touch gestures and on-chart buttons, through optional modifiers |
| [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/) | The ready-made toolbar and list of drawings, in UI Components |

## Every Drawing Tool {#the-catalogue}

The tables below list every drawing tool, grouped by `EDrawingToolGroup`, the groups the toolbar uses. For each one:

- **Tool id** is the `TDrawingToolId` to pass to `selectTool` to start it, e.g. `drawing.selectTool(ETradingAnnotationType.FibonacciRetracementAnnotation)`.
- **The annotation class**, to create the drawing in code, has the same name as the tool id after the dot, from `scichart-financial-tools`: e.g. `new FibonacciRetracementAnnotation({ points })`. Where it differs, for the patterns and the highlighter, the table names it; the eraser has none.
- **Points** is how many points the user clicks to place it, and how many its `points` take.

Tools with a page of their own link to it.

### Lines Drawing Tools {#lines}

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **[Poly Line](/financial-charts/drawing-tools/add-drawing-tools/trend-lines/)**<br />Straight line segments through its points | `ETradingAnnotationType.`<br />`PolyLineAnnotation` | 2 |
| **[Extended Line](/financial-charts/drawing-tools/add-drawing-tools/trend-lines/)**<br />A two-point trend line that can extend past either end | `ETradingAnnotationType.`<br />`ExtendedLineAnnotation` | 2 |
| **[Horizontal Line](/financial-charts/drawing-tools/add-drawing-tools/trend-lines/)**<br />A line at one price, across the pane | `ETradingAnnotationType.`<br />`HorizontalTrendLineAnnotation` | 1 |
| **Vertical Line**<br />A line at one time, down the pane | `ETradingAnnotationType.`<br />`VerticalTrendLineAnnotation` | 1 |
| **Cross Line**<br />A horizontal and a vertical line, crossing at one point | `ETradingAnnotationType.`<br />`CrossLineAnnotation` | 1 |
| **Angle Line**<br />A line from point 1 to point 2, with its angle measured on an arc | `ETradingAnnotationType.`<br />`AngleLineAnnotation` | 2 |

### Channels Drawing Tools {#channels}

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **Channel**<br />A parallel price channel: a trend line, and a parallel line through the third point | `ETradingAnnotationType.`<br />`ChannelAnnotation` | 3 |
| **Flat Bottom Channel**<br />A channel whose bottom edge is always horizontal | `ETradingAnnotationType.`<br />`FlatBottomChannelAnnotation` | 3 |
| **Disjoint Channel**<br />A channel whose second side is constrained by the first | `ETradingAnnotationType.`<br />`DisjointChannelAnnotation` | 3 |

### Pitchforks Drawing Tools {#pitchforks}

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **Pitchfork**<br />Andrews' pitchfork: a median line from the first point through the midpoint of the other two, with parallel lines through them | `ETradingAnnotationType.`<br />`PitchforkAnnotation` | 3 |
| **Inside Pitchfork**<br />A pitchfork whose median line starts at the midpoint of the first two points | `ETradingAnnotationType.`<br />`InsidePitchforkAnnotation` | 3 |
| **Schiff Pitchfork**<br />A pitchfork whose start moves halfway towards the second point in price | `ETradingAnnotationType.`<br />`SchiffPitchforkAnnotation` | 3 |
| **Modified Schiff Pitchfork**<br />A pitchfork whose start moves to the midpoint of the first two points, in time and price | `ETradingAnnotationType.`<br />`ModifiedSchiffPitchforkAnnotation` | 3 |

### Fibonacci Drawing Tools {#fibonacci}

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **[Fibonacci Retracement](/financial-charts/drawing-tools/add-drawing-tools/fibonacci-retracement/)**<br />Levels at Fibonacci ratios of a price move | `ETradingAnnotationType.`<br />`FibonacciRetracementAnnotation` | 2 (3 when skewed) |
| **[Fibonacci Extension](/financial-charts/drawing-tools/add-drawing-tools/fibonacci-retracement/)**<br />Levels projecting a move from a third point | `ETradingAnnotationType.`<br />`FibonacciExtensionAnnotation` | 3 |
| **Fibonacci Time Zone**<br />Vertical lines at Fibonacci intervals of time | `ETradingAnnotationType.`<br />`FibonacciTimeZoneAnnotation` | 2 |
| **Fib Speed Resistance Arcs**<br />Concentric arcs at Fibonacci ratios | `ETradingAnnotationType.`<br />`FibonacciSpeedResistanceArcsAnnotation` | 2 |
| **Fibonacci Circles**<br />Circles or ovals at Fibonacci ratios | `ETradingAnnotationType.`<br />`FibonacciCirclesAnnotation` | 2 |
| **Fibonacci Wedge**<br />Fibonacci arcs inside a wedge | `ETradingAnnotationType.`<br />`FibonacciWedgeAnnotation` | 3 |
| **Pitchfan**<br />Fan lines projected from a pitchfork's points | `ETradingAnnotationType.`<br />`PitchfanAnnotation` | 3 |

### Cycles and Time Drawing Tools {#cycles-and-time}

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **Cyclic Line**<br />Vertical lines repeated at the interval between the two points | `ETradingAnnotationType.`<br />`CyclicLineAnnotation` | 2 |
| **Cyclic Arc**<br />Half-circle arcs repeated at the interval between the two points | `ETradingAnnotationType.`<br />`CyclicArcAnnotation` | 2 |
| **Sector**<br />A sector-shaped Fibonacci wedge, without labels by default | `ETradingAnnotationType.`<br />`SectorAnnotation` | 3 |

### Patterns Drawing Tools {#patterns}

Patterns are poly lines (`PolyLineAnnotation`) with a letter at each point. Their tool ids are `EDrawingToolVariantId` values, because several share one annotation type.

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **[XABCD Pattern](/financial-charts/drawing-tools/add-drawing-tools/harmonic-patterns-xabcd/)**<br />A harmonic pattern's legs | `EDrawingToolVariantId.`<br />`PatternXabcd`<br />Class: `PolyLineAnnotation` | 6: 0, X, A, B, C, D |
| **[Elliott Impulse Wave (12345)](/financial-charts/drawing-tools/add-drawing-tools/elliott-wave/)**<br />A five-wave Elliott impulse | `EDrawingToolVariantId.`<br />`PatternElliottImpulse`<br />Class: `PolyLineAnnotation` | 6: (0) to (5) |
| **[Elliott Correction Wave (ABC)](/financial-charts/drawing-tools/add-drawing-tools/elliott-wave/)**<br />A three-wave Elliott correction | `EDrawingToolVariantId.`<br />`PatternElliottCorrection`<br />Class: `PolyLineAnnotation` | 4: 0, A, B, C |
| **[Elliott Triangle Wave (ABCDE)](/financial-charts/drawing-tools/add-drawing-tools/elliott-wave/)**<br />An Elliott triangle | `EDrawingToolVariantId.`<br />`PatternElliottTriangle`<br />Class: `PolyLineAnnotation` | 6: (0), (A) to (E) |
| **[Elliott Double Combo (WXY)](/financial-charts/drawing-tools/add-drawing-tools/elliott-wave/)**<br />An Elliott double combination | `EDrawingToolVariantId.`<br />`PatternElliottDoubleCombo`<br />Class: `PolyLineAnnotation` | 4: (0), (W), (X), (Y) |
| **[Elliott Triple Combo (WXYXZ)](/financial-charts/drawing-tools/add-drawing-tools/elliott-wave/)**<br />An Elliott triple combination | `EDrawingToolVariantId.`<br />`PatternElliottTripleCombo`<br />Class: `PolyLineAnnotation` | 6: (0), (W), (X), (Y), (X), (Z) |

### Measure and Risk Drawing Tools {#measure-and-risk}

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **Measure**<br />The price change, percentage change and number of candles between two points | `ETradingAnnotationType.`<br />`MeasureAnnotation` | 2 |
| **[Stop Loss / Take Profit](/financial-charts/drawing-tools/add-drawing-tools/stop-loss-take-profit/)**<br />A take-profit or stop-loss zone from an entry point | `ETradingAnnotationType.`<br />`StopLossTakeProfitAnnotation` | 2 |

### Freehand and Eraser Drawing Tools {#freehand-and-eraser}

These are drawn by dragging, not by placing points.

| Tool | Tool id (`TDrawingToolId`) | Points |
| --- | --- | --- |
| **Freehand**<br />A pen stroke | `ETradingAnnotationType.`<br />`FreehandDrawingAnnotation` | Drag |
| **Highlighter**<br />A wide, translucent pen stroke | `EDrawingToolVariantId.`<br />`Highlighter`<br />Class: `FreehandDrawingAnnotation` | Drag |
| **Eraser**<br />Removes the drawings you click, until stopped. It never removes a study's annotations | `EDrawingToolVariantId.`<br />`Eraser`<br />No annotation | Click |

## How Drawings Work

```mermaid
flowchart TB
    Toolbar["DrawingToolbar<br/>or your own buttons"] -- "selectTool(id)" --> Controller["DrawingToolsController"]
    List["DrawingList"] -- "select, remove, openEditor" --> Controller
    Controller -- "activeToolChanged, drawingsChanged" --> List
    Controller -- "adds the drawing modifiers" --> Panes["Each pane's surface"]
    Code["Your code"] -- "annotations.add(annotation)" --> Panes
    Panes -- "drawings are annotations" --> Chart["SciFinanceChart<br/>lists, saves and themes them"]
```

A drawing is an annotation on one of the chart's panes, from `scichart-financial-tools`, which builds on SciChart's annotations. What makes it a drawing, rather than one of a study's own annotations such as the RSI's level lines, is its type: `registerDrawingTools()` registers every tool's annotation type with the chart. Then the chart:

- tracks it as a user drawing, so the drawing tools list it and the eraser can remove it;
- saves it with `toJSON()` and restores it with `fromJSON()`;
- colours it with the chart's [theme](/financial-charts/styling-and-themes/), wherever the drawing has no colour of its own.

:::warning
`DrawingToolsController.attach` calls `registerDrawingTools()` for you. Without a controller, call it yourself, once at startup, before you add drawings in code or restore a saved chart: otherwise the chart doesn't list, save or theme them, and pattern drawings fail to create. For an annotation type of your own, call `SciFinanceChart.registerDrawingType(name)`.
:::

| Theme colour (`ISciTraderDrawingColors`) | CSS variable | Used for |
| --- | --- | --- |
| `line` | `--st-drawing-line` | Lines of drawings whose tool sets no colour, such as the poly line and extended line |
| `fill` | `--st-drawing-fill` | Neutral area fills, such as the cyclic arc's |
| `text` | `--st-drawing-text` | Label text with no colour of its own, such as Fibonacci labels in single-colour mode |
| `gripStroke`, `gripFill` | `--st-drawing-grip-stroke`, `--st-drawing-grip-fill` | The drag handles of a selected drawing, or one being placed |
| `selection` | `--st-drawing-selection` | The outline around a selected drawing |

<details>
<summary>The ISciTraderDrawingColors interface, with its TSDoc</summary>

```ts
/**
 * Colours for user drawings (trend lines, channels, Fibonacci tools, patterns…).
 *
 * Tools with a colour of their own keep it: the orange horizontal line, the cyan Schiff pitchfork,
 * the coloured pattern presets. These are the neutral defaults: what a drawing uses when its tool
 * leaves a colour unset, and what `scichart-financial-tools` would otherwise hard-code (white lines
 * and grips, which disappear on a light chart). The chart applies them as drawings are placed or
 * restored, and moves them on `setTheme`. A colour the user set in a drawing's editor is kept.
 *
 * Drawings are SVG, so any SVG colour works, but prefer hex or `rgba(…)`.
 */
interface ISciTraderDrawingColors {
    /**
     * Lines of drawings whose tool sets no colour: the channel's edges, poly line, extended line,
     * angle line. Their labels follow the line. Derived from `ui.text`. CSS: `--st-drawing-line`.
     */
    line: string;
    /**
     * Neutral area fill, e.g. the cyclic arc's. Use a low alpha. Derived from `ui.selection` at 20%.
     * CSS: `--st-drawing-fill`.
     */
    fill: string;
    /**
     * Label text with no colour of its own, e.g. Fibonacci level labels in single-colour mode.
     * Derived from `chart.axisLabel`. CSS: `--st-drawing-text`.
     */
    text: string;
    /** Outline of the drag handles on a selected or placing drawing. Derived from `ui.text`. CSS: `--st-drawing-grip-stroke`. */
    gripStroke: string;
    /**
     * Fill of the drag handles, so they read as holes in the line. Derived from `chart.background`
     * (`ui.background` when that is transparent). CSS: `--st-drawing-grip-fill`.
     */
    gripFill: string;
    /** Outline drawn around a selected drawing. Derived from `ui.selection`. CSS: `--st-drawing-selection`. */
    selection: string;
}
```

</details>

<details>
<summary>registerDrawingTools and SciFinanceChart.registerDrawingType, with their TSDoc</summary>

```ts
/**
 * Tell `SciFinanceChart` which annotation types count as user drawings (vs. internal
 * study annotations like RSI overbought/oversold lines or MACD palette boxes). This
 * drives the `collection-changed` filter so user drawings round-trip through `toJSON()`
 * but study annotations are filtered out.
 *
 * The type list is derived from the shared drawing-tool registry, so adding a tool
 * there automatically makes its annotations tracked and persisted.
 *
 * Idempotent — call once at app startup.
 */
function registerDrawingTools(): void;

/**
 * Register an annotation type as a user-drawing kind. Once registered, any
 * annotation of this type added to a chart pane's surface will be tracked
 * for serialization. Idempotent.
 */
static registerDrawingType(name: string): void;
```

</details>

## Drawing Annotation Class Hierarchy {#class-hierarchy}

Every drawing tool makes an annotation from `scichart-financial-tools`. They all extend `MultiPointAnnotationBase`, which extends SciChart's `AnnotationBase` (through `RenderContextAnnotationBase`), so every drawing has `points`, point labels, snapping, and SciChart's annotation events and options. Tools of a family share a base class with their options. The diagram shows the main families:

```mermaid
classDiagram
    direction LR
    class AnnotationBase {
        <<SciChart>>
        +isEditable
        +isSelected
        +selectedChanged
        +dragEnded
    }
    class MultiPointAnnotationBase {
        <<abstract>>
        +points
        +labels
        +snapMode
    }
    class AxisAlignedTrendLineAnnotationBase {
        <<abstract>>
    }
    class FibonacciAnnotationBase {
        <<abstract>>
        +thresholds
        +regionColors
    }
    AnnotationBase <|-- MultiPointAnnotationBase
    MultiPointAnnotationBase <|-- PolyLineAnnotation
    PolyLineAnnotation <|-- FreehandDrawingAnnotation
    MultiPointAnnotationBase <|-- ExtendedLineAnnotation
    MultiPointAnnotationBase <|-- AxisAlignedTrendLineAnnotationBase
    AxisAlignedTrendLineAnnotationBase <|-- HorizontalTrendLineAnnotation
    AxisAlignedTrendLineAnnotationBase <|-- VerticalTrendLineAnnotation
    MultiPointAnnotationBase <|-- FibonacciAnnotationBase
    FibonacciAnnotationBase <|-- FibonacciRetracementAnnotation
    FibonacciRetracementAnnotation <|-- FibonacciExtensionAnnotation
    MultiPointAnnotationBase <|-- ChannelAnnotation
    MultiPointAnnotationBase <|-- PitchforkAnnotation
    MultiPointAnnotationBase <|-- StopLossTakeProfitAnnotation
```

The pattern tools (Elliott waves and XABCD) make a `PolyLineAnnotation` with a label at each point. Every class is documented in the `scichart-financial-tools` docs:

| Family | Base class | Annotation classes |
| --- | --- | --- |
| [Poly lines and patterns](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/) | `MultiPointAnnotationBase` | `PolyLineAnnotation`, and `FreehandDrawingAnnotation` ([freehand](/scichart-extensions/scichart-financial-tools/annotation-types/freehand-drawing-annotation/)) |
| [Trend lines](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/) | `MultiPointAnnotationBase`, `AxisAlignedTrendLineAnnotationBase` | `ExtendedLineAnnotation`, `HorizontalTrendLineAnnotation`, `VerticalTrendLineAnnotation`, `CrossLineAnnotation`, `AngleLineAnnotation` |
| [Channels](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/) | `ChannelAnnotation` | `ChannelAnnotation`, `FlatBottomChannelAnnotation`, `DisjointChannelAnnotation` |
| [Pitchforks](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/) | `PitchforkAnnotation` | `PitchforkAnnotation`, `InsidePitchforkAnnotation`, `SchiffPitchforkAnnotation`, `ModifiedSchiffPitchforkAnnotation`, `PitchfanAnnotation` |
| [Fibonacci](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/) | `FibonacciAnnotationBase`, `FibonacciArcAnnotationBase` | `FibonacciRetracementAnnotation`, `FibonacciExtensionAnnotation`, `FibonacciCirclesAnnotation`, `FibonacciSpeedResistanceArcsAnnotation`, `FibonacciWedgeAnnotation`, and `SectorAnnotation` ([sector](/scichart-extensions/scichart-financial-tools/annotation-types/sector-annotation/)) |
| [Cycles and time](/scichart-extensions/scichart-financial-tools/annotation-types/repeating-cyclic-annotations/) | `RepeatedHorizontalIntervalAnnotationBase` | `CyclicLineAnnotation`, `CyclicArcAnnotation`, `FibonacciTimeZoneAnnotation` |
| [Measure](/scichart-extensions/scichart-financial-tools/annotation-types/measure-annotation/) and [stop loss / take profit](/scichart-extensions/scichart-financial-tools/annotation-types/stop-loss-take-profit/) | `MultiPointAnnotationBase` | `MeasureAnnotation`, `StopLossTakeProfitAnnotation` |

:::tip
Options every drawing shares, such as `points`, point labels, snapping and the selection handles, are documented in [Multi-Point Annotations](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/).
:::

## The Drawing Tool Catalogue API: DRAWING_TOOLS {#catalogue-api}

The tools' toolbar, list and menus all come from one catalogue, `DRAWING_TOOLS`, which you can use to build your own:

| Export | What it is |
| --- | --- |
| `DRAWING_TOOLS` | Every tool, as an `IDrawingToolDefinition`, in display order |
| `DRAWING_TOOL_BY_ID` | A tool's definition by its id, e.g. to show its label |
| `DRAWING_TOOL_GROUPS`, `getToolsForGroup(group)` | The groups, and the tools in one, in display order |
| `resolveToolIdForAnnotation(annotation)` | The tool that made a drawing, e.g. telling an Elliott wave from a plain poly line |
| `TOOL_ICON_SVGS`, `toolIconSvg(iconKey, size)` | Each tool's icon, as SVG markup, by its definition's `iconKey` |

```ts
import { DRAWING_TOOL_BY_ID, DRAWING_TOOL_GROUPS, getToolsForGroup, toolIconSvg } from "scichart-scitrader";

// A menu of every tool, grouped
for (const group of DRAWING_TOOL_GROUPS) {
    console.log(group, getToolsForGroup(group).map((tool) => tool.label)); // "Lines" ["Poly Line", "Extended Line", …]
}

// A tool's label and icon, from its id
const tool = DRAWING_TOOL_BY_ID.get("FibonacciRetracementAnnotation");
button.innerHTML = toolIconSvg(tool.iconKey, 20) + tool.label;
```

<details>
<summary>The drawing tool catalogue: IDrawingToolDefinition, TDrawingToolId, EDrawingToolGroup, DRAWING_TOOLS and the lookup functions, with their TSDoc</summary>

```ts
/**
 * Union of all selectable drawing-tool ids. For plain annotation tools the id IS the
 * `ETradingAnnotationType` value; variant tools use {@link EDrawingToolVariantId}.
 */
type TDrawingToolId = TPlacementAnnotationType | ETradingAnnotationType.FreehandDrawingAnnotation | EDrawingToolVariantId;
/** Annotation type a tool produces (placement types + freehand). */
type TDrawingToolAnnotationType = TPlacementAnnotationType | ETradingAnnotationType.FreehandDrawingAnnotation;
/**
 * How a tool is activated by the host page:
 * - `placement` — `MultiPointAnnotationPlacementModifier.startPlacement`
 * - `freehand` — `FreehandDrawingModifier.startDrawing`
 * - `eraser` — `AnnotationEraserModifier.startErasing` (modal: stays active until cancelled)
 */
type TDrawingToolKind = "placement" | "freehand" | "eraser";
/** Display group a tool belongs to. Groups drive rail grouping, flyouts, and section headers. */
enum EDrawingToolGroup {
    Lines = "Lines",
    Channels = "Channels",
    Pitchforks = "Pitchforks",
    Fibonacci = "Fibonacci",
    CyclesAndTime = "Cycles & Time",
    Patterns = "Patterns",
    MeasureAndRisk = "Measure & Risk",
    Freehand = "Freehand",
    Eraser = "Eraser"
}
/** One entry in the drawing-tool catalogue. */
interface IDrawingToolDefinition {
    /** Unique selectable id — for annotation tools this is the `ETradingAnnotationType` value. */
    readonly id: TDrawingToolId;
    /** Activation mechanism the host page must use for this tool. */
    readonly kind: TDrawingToolKind;
    /** Human-readable label, used identically across every surface. */
    readonly label: string;
    /** Key into `TOOL_ICON_SVGS` (drawingTools/toolIcons.ts). */
    readonly iconKey: string;
    /** Display group for rail grouping and section headers. */
    readonly group: EDrawingToolGroup;
    /**
     * The annotation type this tool produces (equals `id` for plain annotation tools;
     * `FreehandDrawingAnnotation` for freehand variants; unset for the eraser). Drives
     * the user-drawing type filter in `registerDrawingTools` and the host pages.
     */
    readonly annotationType?: TDrawingToolAnnotationType;
    /**
     * `placement` tools: starts click-to-place on the given modifier with this tool's
     * default options. Defined as a per-entry closure so each `startPlacement` call is
     * checked against the package's typed options map for that annotation type.
     */
    readonly startPlacement?: (modifier: MultiPointAnnotationPlacementModifier) => void;
    /** `freehand` tools: starts drag-to-draw on the given modifier with this tool's stroke config. */
    readonly startFreehand?: (modifier: FreehandDrawingModifier) => void;
    /**
     * `eraser` tool: starts erase mode on the given modifier. `targetFilter` MUST restrict
     * erasure to user drawings — without it the eraser also deletes study annotations
     * (RSI bands, MACD boxes); hosts pass a filter built from the registry's type set.
     */
    readonly startErasing?: (modifier: AnnotationEraserModifier, targetFilter: (annotation: IAnnotation) => boolean) => void;
}
/** The full drawing-tool catalogue, in display order (grouped). */
const DRAWING_TOOLS: readonly IDrawingToolDefinition[];
/**
 * Annotation type strings produced by user drawing tools — the filter set for
 * `SciFinanceChart.registerDrawingType` and the hosts' drawing-vs-study checks.
 */
const DRAWING_ANNOTATION_TYPE_NAMES: ReadonlySet<string>;
/** Lookup by tool id (keyed as string so annotation `type` strings resolve directly). */
const DRAWING_TOOL_BY_ID: ReadonlyMap<string, IDrawingToolDefinition>;
/** Ordered list of groups that currently contain at least one tool. */
const DRAWING_TOOL_GROUPS: readonly EDrawingToolGroup[];
/** Tools of one group, in catalogue order. */
function getToolsForGroup(group: EDrawingToolGroup): readonly IDrawingToolDefinition[];
/**
 * Resolves the tool that produced a placed annotation. Plain annotation tools resolve
 * by their `type` string; pattern presets fingerprint by their unique label-text
 * sequence; Highlighter by stroke thickness (see {@link HIGHLIGHTER_MIN_STROKE_THICKNESS}).
 */
function resolveToolIdForAnnotation(annotation: {
    type?: string;
    labels?: ReadonlyArray<{
        text?: string;
    }>;
    strokeThickness?: number;
}): TDrawingToolId | undefined;
```

</details>

<details>
<summary>The EDrawingToolVariantId enum, TOOL_ICON_SVGS and toolIconSvg, with their TSDoc</summary>

```ts
/**
 * Ids for drawing tools that are NOT 1:1 with an `ETradingAnnotationType` value —
 * variants of an annotation type (Highlighter is a wide translucent freehand preset,
 * patterns are labelled PolyLine presets) or non-annotation modes (Eraser).
 *
 * Lives in its own module (not `toolRegistry`) so `patternPresets` and the registry
 * can both import it without a cycle.
 */
enum EDrawingToolVariantId {
    Highlighter = "Tool.Highlighter",
    Eraser = "Tool.Eraser",
    PatternXabcd = "Pattern.Xabcd",
    PatternElliottImpulse = "Pattern.ElliottImpulse",
    PatternElliottCorrection = "Pattern.ElliottCorrection",
    PatternElliottTriangle = "Pattern.ElliottTriangle",
    PatternElliottDoubleCombo = "Pattern.ElliottDoubleCombo",
    PatternElliottTripleCombo = "Pattern.ElliottTripleCombo"
}

/** 47 icons ported verbatim from SciChartDemo TradingAnnotations SVG_ICONS.ts */
const TOOL_ICON_SVGS: Record<string, string>;
/** An icon's markup at a given size, with `--text` bound to `currentColor`. Empty for unknown keys. */
function toolIconSvg(iconKey: string, size?: number): string;
```

</details>

## Where to read next

- [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/): point-and-click drawing, and drawings in code.
- [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/): ready-made tools and list for users.
- [Save and Restore](/financial-charts/save-and-restore/): drawings are saved with the chart.
