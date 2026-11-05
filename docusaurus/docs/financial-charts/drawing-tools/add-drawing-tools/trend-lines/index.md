---
sidebar_position: 2
sidebar_label: Trend Lines
title: "Trend Lines: Draw Trend Lines on a JavaScript or React Financial Chart | SciTrader.js"
description: "What trend lines are, how to draw support and resistance trend lines and horizontal lines, how traders use them, and how to add trend lines to a JavaScript or React financial chart with SciTrader.js, by point and click or in code."
keywords: ["trend line", "trendline", "how to draw trend lines", "support and resistance lines", "trend line JavaScript", "trend line React chart", "horizontal line chart", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Trend Lines in a JavaScript or React Financial Chart

**Trend lines** are the most used drawing on a trading chart: a line through two or more highs or lows that shows the direction of the trend, and where support or resistance may be. This page explains what trend lines are, how they work and how traders use them, and shows how to draw trend lines and horizontal lines on a JavaScript or React financial chart with SciTrader.js, by point and click or in code, with live examples you can edit in CodePen.

:::info
The trend line tools are three of the 34 drawing tools in the SciTrader SDK. For the full list, with each tool's id, annotation class and number of points, see [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue). To add drawing tools with point and click or in code, see [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/).
:::

## What Is a Trend Line?

A trend line connects two or more price points to show the trend:

- **A rising trend line** (support) connects higher lows. Price above it is in an uptrend.
- **A falling trend line** (resistance) connects lower highs. Price below it is in a downtrend.
- **A horizontal line** marks one price, such as an earlier high or low, where price has turned before.

SciTrader's line tools, in the **Lines** group:

| Tool | Annotation class | Points | Use it for |
| --- | --- | --- | --- |
| Extended Line | `ExtendedLineAnnotation` | 2 | A trend line, optionally extended past its points to project it forward |
| Horizontal Line | `HorizontalTrendLineAnnotation` | 1 | A support or resistance level |
| Poly Line | `PolyLineAnnotation` | 2 or more | A line segment between two points, or a path through several |
| Vertical Line | `VerticalTrendLineAnnotation` | 1 | Marking a time, such as an event |
| Cross Line | `CrossLineAnnotation` | 1 | Marking a price and a time together |
| Angle Line | `AngleLineAnnotation` | 2 | A line with its angle shown |

## How Is a Trend Line Drawn?

A trend line through the points $(t_1, p_1)$ and $(t_2, p_2)$, where $t$ is a candle's time and $p$ a price, is at price

$$
p(t) = p_1 + (p_2 - p_1) \times \frac{t - t_1}{t_2 - t_1}
$$

at time $t$. Extending it, with `extendEnd: true`, continues it past the second point using the same slope, so it shows where the trend line will be in future candles.

Traders draw a trend line through **swing points**: clear lows for a rising line, clear highs for a falling one. The more times price touches a line without breaking it, the more significant it is taken to be.

## How to Use Trend Lines

These are the common uses. They are conventions traders use, not signals that hold every time:

- **Trend direction.** A rising trend line under the lows confirms an uptrend; a falling one over the highs, a downtrend.
- **Support and resistance.** Price often bounces off a trend line or horizontal line it has touched before.
- **Breakouts.** A close through a trend line, especially on high volume, is read as the trend weakening or reversing.
- **Role reversal.** Once broken, a support line often becomes resistance, and resistance becomes support.
- **Channels.** A parallel line on the other side of the price forms a channel; see the **Channel** tools.

## Drawing Trend Lines with Point and Click

Start the tool with `selectTool`, from a button or the [Drawing Toolbar](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/). For a trend line the user clicks two points; for a horizontal line, one:

```ts
import { ETradingAnnotationType } from "scichart-financial-tools";

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
drawing.selectTool(ETradingAnnotationType.ExtendedLineAnnotation); // a trend line
drawing.selectTool(ETradingAnnotationType.HorizontalTrendLineAnnotation); // a horizontal line
```

## Adding Trend Lines in Code {#in-code}

Create the annotation with its points, as (time in seconds, price), and add it to the price pane:

```ts
import { Point } from "scichart";
import { ExtendedLineAnnotation, HorizontalTrendLineAnnotation } from "scichart-financial-tools";
import { PaneId, registerDrawingTools } from "scichart-scitrader";

registerDrawingTools(); // once, at startup: so the chart lists and saves them

const pricePane = financeChartPanel.financeApi.chartPanes.get(PaneId.DEFAULT).surface;
pricePane.annotations.add(
    // A support trend line through two lows, extended to the right
    new ExtendedLineAnnotation({
        points: [new Point(firstLowTime, firstLow), new Point(secondLowTime, secondLow)],
        extendEnd: true,
        stroke: "#26a69a",
        isEditable: true,
    }),
    // A resistance level: one point sets its price
    new HorizontalTrendLineAnnotation({ points: [new Point(highTime, high)], stroke: "#ef5350", isEditable: true })
);
```

## How to Draw Trend Lines on a JavaScript Financial Chart

An ETH-USD chart from Coinbase with a trend line through the lowest lows of the two halves of the last 90 candles, extended to the right, and a horizontal line at their highest high, both added in code. The buttons start the trend line and horizontal line tools.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../../_examples/drawing_TrendLines/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/drawing_TrendLines/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Draw Trend Lines on a React Financial Chart

The same chart in React. The drawing is added in `onInit`, once the chart has loaded its candles, and `useDrawingTools` gives the buttons their controller.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="TrendLinesChart" name="../../../_examples/drawing_TrendLines/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/drawing_TrendLines/react.tsx
    ```
</CodeSnippetBlock>

## Trend Line Options: ExtendedLineAnnotation and HorizontalTrendLineAnnotation

| Option | What it does |
| --- | --- |
| `points` | Two points for an extended line or poly line; one for a horizontal, vertical or cross line |
| `stroke`, `strokeThickness`, `strokeDashArray` | The line's colour, thickness and dash pattern. Without a `stroke`, the line takes the theme's drawing colour |
| `extendStart`, `extendEnd` | Extend the line past its first or last point. On a horizontal line, to the left or right of its point |
| `isEditable` | Whether the user can select, drag and edit it |

<details>
<summary>The ExtendedLineAnnotation, HorizontalTrendLineAnnotation and AxisAlignedTrendLineAnnotationBase classes, with their TSDoc</summary>

````ts
/**
 * @summary The {@link ExtendedLineAnnotation} provides a {@link MultiPointAnnotationBase | multi-point annotation}
 * which draws a two-point trend line over the {@link SciChartSurface}.
 * @description
 * To add an {@link ExtendedLineAnnotation} to a {@link SciChartSurface}, use the following code:
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * const extendedLineAnnotation = new ExtendedLineAnnotation({
 *     points: [
 *          new Point(0, 5),  // can also be written as "{ x: 0, y: 5 }"
 *          new Point(10, 7)
 *     ],
 *     stroke: "#3B82F6",
 *     strokeThickness: 2,
 *     strokeDashArray: [4, 2],
 *     extendStart: false,
 *     extendEnd: true
 * });
 * sciChartSurface.annotations.add(extendedLineAnnotation);
 * ```
 * Use `extendStart` and `extendEnd` to project the line beyond its endpoints.
 */
class ExtendedLineAnnotation extends MultiPointAnnotationBase {
    /** @inheritDoc */
    readonly type: EAnnotationType;
    /** @inheritDoc */
    readonly surfaceTypes: ESurfaceType[];
    constructor(options?: IExtendedLineAnnotationOptions);
    /** Gets or sets stroke color. */
    get stroke(): string;
    set stroke(value: string);
    /** Gets or sets stroke thickness. */
    get strokeThickness(): number;
    set strokeThickness(value: number);
    /** Gets or sets stroke dash array. */
    get strokeDashArray(): number[];
    set strokeDashArray(value: number[]);
    /** Gets or sets whether line extends before the first point. */
    get extendStart(): boolean;
    set extendStart(value: boolean);
    /** Gets or sets whether line extends after the second point. */
    get extendEnd(): boolean;
    set extendEnd(value: boolean);
    /** @inheritDoc */
    delete(): void;
    /** @inheritDoc */
    onAttach(scs: SciChartSurface): void;
    /** @inheritDoc */
    drawWithContext(renderContext: IRenderContext2D, xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, seriesViewRect: Rect, surfaceViewRect: Rect, chartViewRect: Rect): void;
    /** @inheritDoc */
    onDpiChanged(args: TDpiChangedEventArgs): void;
    /** @inheritDoc */
    svgStringAdornerTemplate(): string;
    /** @inheritDoc */
    toJSON(): {
        type: EAnnotationType;
        options: Required<Omit<IAnnotationBaseOptions, never>>;
    };
}

/**
 * Draws a horizontal trend line anchored at a single movable point.
 */
class HorizontalTrendLineAnnotation extends AxisAlignedTrendLineAnnotationBase {
    /** @inheritDoc */
    readonly type: EAnnotationType;
    /** @inheritDoc */
    readonly surfaceTypes: ESurfaceType[];
    constructor(options?: IHorizontalTrendLineAnnotationOptions);
}

/**
 * Shared class for 1-point axis-aligned trend lines.
 */
abstract class AxisAlignedTrendLineAnnotationBase extends MultiPointAnnotationBase {
    /** Gets or sets the stroke color. */
    get stroke(): string;
    set stroke(value: string);
    /** Gets or sets the stroke thickness. */
    get strokeThickness(): number;
    set strokeThickness(value: number);
    /** Gets or sets the dash pattern for the trend line. */
    get strokeDashArray(): number[];
    set strokeDashArray(value: number[]);
    /** Gets or sets whether the line extends before the anchor point. */
    get extendStart(): boolean;
    set extendStart(value: boolean);
    /** Gets or sets whether the line extends after the anchor point. */
    get extendEnd(): boolean;
    set extendEnd(value: boolean);
    /** @inheritDoc */
    delete(): void;
    /** @inheritDoc */
    onAttach(scs: SciChartSurface): void;
    /** @inheritDoc */
    drawWithContext(renderContext: IRenderContext2D, xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, seriesViewRect: Rect, surfaceViewRect: Rect, chartViewRect: Rect): void;
    /** @inheritDoc */
    svgStringAdornerTemplate(): string;
    /** @inheritDoc */
    toJSON(): {
        type: EAnnotationType;
        options: Required<Omit<IAnnotationBaseOptions, never>>;
    };
}
````

</details>

<details>
<summary>The IExtendedLineAnnotationOptions, IAxisAlignedTrendLineAnnotationBaseOptions and IPolyLineAnnotationOptions interfaces, with their TSDoc</summary>

```ts
/** Options for {@link ExtendedLineAnnotation}. */
interface IExtendedLineAnnotationOptions extends IMultiPointAnnotationBaseOptions {
    /** Stroke color. */
    stroke?: string;
    /** Stroke thickness. */
    strokeThickness?: number;
    /** Optional dash array. */
    strokeDashArray?: number[];
    /** Extend backwards past the first grip point. */
    extendStart?: boolean;
    /** Extend forwards past the second grip point. */
    extendEnd?: boolean;
}

/** Common options for axis-aligned trend lines. */
interface IAxisAlignedTrendLineAnnotationBaseOptions extends IMultiPointAnnotationBaseOptions {
    /** Stroke color. */
    stroke?: string;
    /** Stroke thickness. */
    strokeThickness?: number;
    /** Optional dash array. */
    strokeDashArray?: number[];
    /** Extend before the anchor point in axis direction. */
    extendStart?: boolean;
    /** Extend after the anchor point in axis direction. */
    extendEnd?: boolean;
}

/** Options for {@link PolyLineAnnotation}. */
interface IPolyLineAnnotationOptions extends IMultiPointAnnotationBaseOptions {
    /**
     * Number of points required when using {@link MultiPointAnnotationPlacementModifier}.
     * Default `2`.
     */
    placementPointCount?: number;
    /** Stroke color. */
    stroke?: string;
    /** Stroke thickness of the line annotation.
     * Default `2`
    */
    strokeThickness?: number;
    /**
     * The strokeDashArray for the {@link LineAnnotation}
     */
    strokeDashArray?: number[];
    /**
     * The primitive triangle fill as an HTML color string.
     * Default `null` -> triangles do NOT draw at all.
    */
    fill?: string | null;
}
```

</details>

## Where to read next

- [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/): the other drawing tools, point-and-click drawing and drawings in code.
- [Editing Drawings](/financial-charts/drawing-tools/editing-drawings/): the quick-edit toolbar, the full editor and edit events.
- [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/): ready-made tools and list for users.
