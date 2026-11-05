---
sidebar_position: 1
sidebar_label: Fibonacci Retracement
title: "Fibonacci Retracement: Draw Fibonacci Levels on a JavaScript or React Chart | SciTrader.js"
description: "What a Fibonacci retracement is, how its levels are calculated, how traders use them, and how to draw a Fibonacci retracement on a JavaScript or React financial chart with SciTrader.js, by point and click or in code."
keywords: ["Fibonacci retracement", "Fibonacci retracement levels", "Fibonacci retracement JavaScript", "Fibonacci React chart", "how to calculate Fibonacci retracement", "Fibonacci extension", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Fibonacci Retracement in a JavaScript or React Financial Chart

A **Fibonacci retracement** draws horizontal levels at Fibonacci ratios of a price move, where traders watch for a pullback to pause or reverse. This page explains what a Fibonacci retracement is, how its levels are calculated and how traders use them, and shows how to draw one on a JavaScript or React financial chart with SciTrader.js, by point and click or in code, with live examples you can edit in CodePen.

:::info
The Fibonacci retracement is one of the 34 drawing tools in the SciTrader SDK. For the full list, with each tool's id, annotation class and number of points, see [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue). To add drawing tools with point and click or in code, see [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/).
:::

## What Is a Fibonacci Retracement?

After a strong move, price often pulls back part of the way before continuing. A Fibonacci retracement marks how far: it divides the move into levels at ratios from the Fibonacci sequence, chiefly **23.6%, 38.2%, 50%, 61.8% and 78.6%**. 50% is not a Fibonacci ratio, but traders watch it too.

:::tip
Draw it from the start of a move to its end: from a swing low to a swing high for an up-move, or from a high to a low for a down-move. The levels then sit between the two, with 0 at the end of the move.
:::

## How Are Fibonacci Retracement Levels Calculated?

With the first point at price $P_1$ and the second at $P_2$, the level for ratio $r$ is

$$
\text{level}(r) = P_2 + (P_1 - P_2) \times r
$$

So 0 sits at the second point, the end of the move, and 1 (100%) at the first point, its start. Ratios above 1, such as 1.618 and 2.618, project past the start, as **extension** levels.

For a move up from 60,000 to 70,000, the 61.8% retracement is at $70{,}000 + (60{,}000 - 70{,}000) \times 0.618 = 63{,}820$.

`FibonacciRetracementAnnotation` draws these levels for the ratios in its `thresholds` option, which defaults to 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618 and 2.618, and shades the region between each pair. With `verticalOnly: false`, it takes a third point and draws its levels parallel to the line between the first two, for a skewed retracement.

## How to Use Fibonacci Retracements

These are the common uses. They are conventions traders use, not signals that hold every time:

- **Pullback targets.** In a trend, a pullback that pauses at the 38.2%, 50% or 61.8% level and turns back is read as the trend resuming. The 61.8% level, the "golden ratio", is watched most.
- **Support and resistance.** A level that lines up with an earlier high or low, or a moving average, is read as a stronger zone.
- **A broken trend.** A pullback through the 78.6% level, or the whole move, suggests the trend has ended.
- **Targets past the move.** The 1.618 and 2.618 levels, or the separate **Fibonacci Extension** tool, project how far the next move might go.

## Drawing a Fibonacci Retracement with Point and Click

Start the tool with `selectTool`, from a button or the [Drawing Toolbar](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/). The user clicks the start of the move, then its end:

```ts
import { ETradingAnnotationType } from "scichart-financial-tools";

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
drawing.selectTool(ETradingAnnotationType.FibonacciRetracementAnnotation);
```

## Adding a Fibonacci Retracement in Code {#in-code}

Create a `FibonacciRetracementAnnotation` with its two points, the start and end of the move, as (time in seconds, price), and add it to the price pane:

```ts
import { Point } from "scichart";
import { FibonacciRetracementAnnotation } from "scichart-financial-tools";
import { PaneId, registerDrawingTools } from "scichart-scitrader";

registerDrawingTools(); // once, at startup: so the chart lists and saves it

financeChartPanel.financeApi.chartPanes.get(PaneId.DEFAULT).surface.annotations.add(
    new FibonacciRetracementAnnotation({
        points: [new Point(swingLowTime, swingLow), new Point(swingHighTime, swingHigh)],
        thresholds: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1], // leave out the extension levels
        isEditable: true, // the user can select, drag and edit it
    })
);
```

## How to Draw a Fibonacci Retracement on a JavaScript Financial Chart

A BTC-USD chart from Coinbase with a Fibonacci retracement added in code, from the low to the high of the last 90 candles, in time order, with the levels up to 1. The buttons start the Fibonacci retracement and extension tools: click the chart to place their points.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../../_examples/drawing_FibonacciRetracement/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/drawing_FibonacciRetracement/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Draw a Fibonacci Retracement on a React Financial Chart

The same chart in React. The drawing is added in `onInit`, once the chart has loaded its candles, and `useDrawingTools` gives the buttons their controller.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="FibonacciRetracementChart" name="../../../_examples/drawing_FibonacciRetracement/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/drawing_FibonacciRetracement/react.tsx
    ```
</CodeSnippetBlock>

## FibonacciRetracementAnnotation Options

| Option | What it does |
| --- | --- |
| `points` | Two points: the start and end of the move. Three with `verticalOnly: false` |
| `thresholds` | The levels, as ratios. Default 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618, 2.618 |
| `regionColors`, `fillOpacity` | The colours of the regions between levels, which also colour the level lines, and their opacity |
| `strokeThickness`, `strokeDashArray` | The level lines |
| `extendStart`, `extendEnd` | Extend the level lines to the left or right |
| `showConnectorLine`, `connectorLineStroke`, `connectorLineStrokeDashArray` | The line between the points |
| `fibonacciLabelPlacement` | Where the level labels go: `EFibonacciLabelPlacement.Left`, `Top` or `Inside` |
| `fibonacciLabelColorMode`, `fibonacciLabelColor`, `fibonacciLabelFontSize` | The labels' colours, one per level or one for all, and size |
| `formatFibonacciLabel` | A function to write each label's text yourself |
| `verticalOnly` | `true` (default): horizontal levels from two points. `false`: skewed levels from three |
| `isEditable` | Whether the user can select, drag and edit it |

<details>
<summary>The FibonacciRetracementAnnotation class and its base class FibonacciAnnotationBase, with their TSDoc</summary>

```ts
/**
 * Draws Fibonacci retracement levels from two or three placement points.
 * @remarks
 * In vertical-only mode, point 1 and point 2 define the price move and horizontal retracement levels are drawn between them.
 *
 * In skewed mode, points 1 and 2 define the baseline and point 3 defines the retracement direction for parallel levels.
 */
class FibonacciRetracementAnnotation extends FibonacciAnnotationBase {
    /** @inheritDoc */
    readonly surfaceTypes: ESurfaceType[];
    /** @inheritDoc */
    readonly type: EAnnotationType;
    /** Creates a {@link FibonacciRetracementAnnotation}. */
    constructor(options?: IFibonacciRetracementAnnotationOptions);
    /** Gets or sets non-skewed mode (horizontal levels + vertical connector). */
    get verticalOnly(): boolean;
    set verticalOnly(value: boolean);
    /** @inheritDoc */
    drawWithContext(renderContext: IRenderContext2D, xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, seriesViewRect: Rect, surfaceViewRect: Rect, chartViewRect: Rect): void;
    /** @inheritDoc */
    toJSON(): {
        type: EAnnotationType;
        options: Required<Omit<IAnnotationBaseOptions, never>>;
    };
}

/**
 * Base class for Fibonacci annotations.
 * @remarks
 * Provides shared threshold, region fill, connector line and level-label behaviour for
 * line-based Fibonacci annotations and arc-based Fibonacci annotations.
 */
abstract class FibonacciAnnotationBase extends MultiPointAnnotationBase {
    /** Gets or sets stroke thickness for Fibonacci level lines or arcs. */
    get strokeThickness(): number;
    set strokeThickness(value: number);
    /** Gets or sets the dash pattern for Fibonacci level lines or arcs. */
    get strokeDashArray(): number[];
    set strokeDashArray(value: number[]);
    /** Gets or sets whether level lines extend before their first point. */
    get extendStart(): boolean;
    set extendStart(value: boolean);
    /** Gets or sets whether level lines extend after their second point. */
    get extendEnd(): boolean;
    set extendEnd(value: boolean);
    /** Gets or sets threshold values used to calculate Fibonacci levels and labels. */
    get thresholds(): number[];
    set thresholds(value: number[]);
    /** Gets or sets region colors used for bands between consecutive thresholds. */
    get regionColors(): string[];
    set regionColors(value: string[]);
    /** Gets or sets fill opacity for Fibonacci regions. */
    get fillOpacity(): number;
    set fillOpacity(value: number);
    /** Gets or sets whether connector lines between placement points are visible. */
    get showConnectorLine(): boolean;
    set showConnectorLine(value: boolean);
    /** Gets or sets the connector line stroke color. */
    get connectorLineStroke(): string;
    set connectorLineStroke(value: string);
    /** Gets or sets the connector line dash pattern. */
    get connectorLineStrokeDashArray(): number[];
    set connectorLineStrokeDashArray(value: number[]);
    /** Gets or sets where Fibonacci level labels are placed. */
    get fibonacciLabelPlacement(): EFibonacciLabelPlacement;
    set fibonacciLabelPlacement(value: EFibonacciLabelPlacement);
    /** Gets or sets whether labels use per-level colors or a single color. */
    get fibonacciLabelColorMode(): EFibonacciLabelColorMode;
    set fibonacciLabelColorMode(value: EFibonacciLabelColorMode);
    /** Gets or sets the label color used in `SingleColor` mode. */
    get fibonacciLabelColor(): string;
    set fibonacciLabelColor(value: string);
    /** Gets or sets Fibonacci label font size in CSS pixels. */
    get fibonacciLabelFontSize(): number | undefined;
    set fibonacciLabelFontSize(value: number | undefined);
    /** Gets or sets extra spacing between Fibonacci labels and their level geometry. */
    get fibonacciLabelLinePadding(): number;
    set fibonacciLabelLinePadding(value: number);
    /** Gets or sets the custom formatter used for Fibonacci level labels. */
    get formatFibonacciLabel(): TFibonacciLevelLabelFormatter | undefined;
    set formatFibonacciLabel(value: TFibonacciLevelLabelFormatter | string | undefined);
    delete(): void;
    onAttach(scs: SciChartSurface): void;
    onDpiChanged(args: TDpiChangedEventArgs): void;
    toJSON(): {
        type: EAnnotationType;
        options: Required<Omit<IAnnotationBaseOptions, never>>;
    };
}
```

</details>

<details>
<summary>The IFibonacciRetracementAnnotationOptions and IFibonacciAnnotationBaseOptions interfaces, with their TSDoc</summary>

```ts
/** Options for {@link FibonacciRetracementAnnotation}. */
interface IFibonacciRetracementAnnotationOptions extends IFibonacciAnnotationBaseOptions {
    /**
     * When `true`, uses two points to draw non-skewed horizontal levels.
     * Default `true`.
     */
    verticalOnly?: boolean;
}

/** Common options shared by Fibonacci annotations. */
interface IFibonacciAnnotationBaseOptions extends IMultiPointAnnotationBaseOptions {
    /** Stroke thickness for Fibonacci level lines. */
    strokeThickness?: number;
    /** Dash array for Fibonacci level lines or arcs.
     *
     * @note Use {@link connectorLineStrokeDashArray} to control the connecting line's dash */
    strokeDashArray?: number[];
    /** Extend level lines backwards past their first point. */
    extendStart?: boolean;
    /** Extend level lines forwards past their second point. */
    extendEnd?: boolean;
    /**
     * Threshold values used for level calculation and labels.
     * Regions are drawn between each pair of consecutive thresholds.
     */
    thresholds?: number[];
    /**
     * Colors used for Fibonacci regions.
     * Level stroke colors are derived from region colors.
     */
    regionColors?: string[];
    /** Fill opacity for Fibonacci regions. */
    fillOpacity?: number;
    /** Whether to show connector line(s) between defining points. */
    showConnectorLine?: boolean;
    /** Connector line stroke color. Defaults to the resolved grip stroke color. */
    connectorLineStroke?: string;
    /** Dash array for optional connector line(s). */
    connectorLineStrokeDashArray?: number[];
    /** Position of Fibonacci labels relative to each level. */
    fibonacciLabelPlacement?: EFibonacciLabelPlacement;
    /** Fibonacci label color mode. */
    fibonacciLabelColorMode?: EFibonacciLabelColorMode;
    /** Label color used when `fibonacciLabelColorMode` is `SingleColor`. */
    fibonacciLabelColor?: string;
    /** Fibonacci label font size in px. If not set, uses current yAxis label font size. */
    fibonacciLabelFontSize?: number;
    /** Extra spacing between Fibonacci labels and their level line/arc. */
    fibonacciLabelLinePadding?: number;
    /** Optional custom formatter for Fibonacci label text. */
    formatFibonacciLabel?: TFibonacciLevelLabelFormatter | string;
}

/** Positioning mode for Fibonacci level labels. */
enum EFibonacciLabelPlacement {
    /** Places labels to the left of the level geometry. */
    Left = "Left",
    /** Places labels above the level geometry. */
    Top = "Top",
    /** Places labels inside the level geometry, near the level line or arc. */
    Inside = "Inside"
}

/** Color mode for Fibonacci level labels. */
enum EFibonacciLabelColorMode {
    /** Uses the resolved level color for each label. */
    MultiColor = "MultiColor",
    /** Uses `fibonacciLabelColor` for all labels. */
    SingleColor = "SingleColor"
}
```

</details>

## Where to read next

- [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/): the other drawing tools, point-and-click drawing and drawings in code.
- [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/): the quick-edit toolbar, the full editor and edit events.
- [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/): ready-made tools and list for users.
- [FibonacciRetracementAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/retracement/): every property and option, in the `scichart-financial-tools` docs.
