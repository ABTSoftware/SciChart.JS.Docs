---
sidebar_position: 5
sidebar_label: Harmonic Patterns (XABCD)
title: "Harmonic Patterns: Draw XABCD and ABCD Patterns on a JavaScript or React Chart | SciTrader.js"
description: "What harmonic patterns such as the Gartley, Bat and Butterfly are, the Fibonacci ratios that define XABCD and ABCD patterns, and how to draw an XABCD pattern on a JavaScript or React financial chart with SciTrader.js."
keywords: ["harmonic patterns", "XABCD pattern", "ABCD pattern", "Gartley pattern", "harmonic patterns JavaScript", "XABCD React chart", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Harmonic Patterns (XABCD) in a JavaScript or React Financial Chart

**Harmonic patterns** are price patterns whose legs are in particular Fibonacci ratios, such as the Gartley, Bat and Butterfly. Most are drawn as five points, X, A, B, C and D. This page explains what harmonic patterns are, the ratios that define them and how traders use them, and shows how to draw an XABCD pattern on a JavaScript or React financial chart with SciTrader.js, with live examples you can edit in CodePen.

:::info
The XABCD Pattern tool is one of the 34 drawing tools in the SciTrader SDK. For the full list, with each tool's id, annotation class and number of points, see [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue). To add drawing tools with point and click or in code, see [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/).
:::

## What Are Harmonic Patterns?

A harmonic pattern is a zigzag of four legs between five points, X, A, B, C and D:

- **XA** is the first move.
- **AB** retraces part of XA, and **BC** retraces part of AB.
- **CD** is the final leg, which ends at **D**, the point where the pattern "completes" and traders expect a reversal.

What makes a pattern harmonic is the **ratio** of each leg to the one before, from the Fibonacci sequence. The **ABCD pattern** is the same idea with only the last three legs.

SciTrader's **XABCD Pattern** tool, in the **Patterns** group, places six points, labelled 0, X, A, B, C and D: the leg into X, then the pattern's legs. It draws the legs and shades the triangles between them.

## How Are Harmonic Pattern Ratios Calculated?

Each ratio compares the length of a leg, in price, with the leg before it:

$$
\frac{AB}{XA} = \frac{|B - A|}{|A - X|}
\qquad
\frac{BC}{AB} = \frac{|C - B|}{|B - A|}
\qquad
\frac{CD}{BC} = \frac{|D - C|}{|C - B|}
$$

and the depth of D is measured as a retracement of XA. The common patterns' ratios:

| Pattern | AB / XA | BC / AB | CD / BC | D, as a retracement of XA |
| --- | --- | --- | --- | --- |
| Gartley | 0.618 | 0.382 to 0.886 | 1.27 to 1.618 | 0.786 |
| Bat | 0.382 to 0.5 | 0.382 to 0.886 | 1.618 to 2.618 | 0.886 |
| Butterfly | 0.786 | 0.382 to 0.886 | 1.618 to 2.24 | 1.27 to 1.618 |
| Crab | 0.382 to 0.618 | 0.382 to 0.886 | 2.24 to 3.618 | 1.618 |

These ratios are the usual published guidelines; sources differ slightly. The tool draws the pattern but doesn't measure its ratios: draw a [Fibonacci Retracement](/financial-charts/drawing-tools/add-drawing-tools/fibonacci-retracement/) over a leg to check one.

## How to Use Harmonic Patterns

These are the common uses. They are conventions traders use, not signals that hold every time:

- **A reversal zone at D.** When the legs match a pattern's ratios, the area around D is where traders look for price to turn.
- **Bullish and bearish.** A pattern whose D is a low (an M shape) is bullish; one whose D is a high (a W shape) is bearish.
- **Stops past D.** A move well past D invalidates the pattern, so stops usually go just beyond it.
- **Targets back up the legs.** Common targets are the 38.2% and 61.8% retracements of the CD leg, or point A.

## Drawing an XABCD Pattern with Point and Click

Start the tool with `selectTool`, from a button or the [Drawing Toolbar](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/). The user clicks each of the six points in turn, and the labels follow:

```ts
import { DrawingToolsController, EDrawingToolVariantId } from "scichart-scitrader";

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
drawing.selectTool(EDrawingToolVariantId.PatternXabcd);
```

## Adding an XABCD Pattern in Code {#in-code}

An XABCD pattern is a `PolyLineAnnotation` with a label at each point. The SDK's own pattern helpers aren't exported, so build the same options yourself:

```ts
import { Point } from "scichart";
import { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, PolyLineAnnotation } from "scichart-financial-tools";
import { EVerticalTextPosition } from "scichart";
import { PaneId, registerDrawingTools } from "scichart-scitrader";

registerDrawingTools(); // once, at startup: also registers the label style the patterns use

// The options the SDK's pattern tools use: a poly line with a label at each point
const pattern = (points: Point[], labels: string[], stroke: string, fill: string) =>
    new PolyLineAnnotation({
        points,
        stroke,
        fill, // shades the triangles between consecutive legs
        strokeThickness: 3,
        isEditable: true,
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        labels: labels.map((text, pointIndex) => ({
            anchorMode: EMultiPointLabelAnchorMode.Point,
            pointIndex,
            verticalTextPosition: EVerticalTextPosition.Below,
            yOffset: 10,
            text,
        })),
        formatLabelStyle: "SciTraderPatternLabelStyle", // puts each label above its point at a peak
    });

financeChartPanel.financeApi.chartPanes.get(PaneId.DEFAULT).surface.annotations.add(
    pattern([p0, x, a, b, c, d], ["0", "X", "A", "B", "C", "D"], "#0F766E", "#0F766E15")
);
```

The label text identifies the pattern: with the same labels, the drawing list and `resolveToolIdForAnnotation` name it as the pattern tool's drawing, not a plain poly line.

## How to Draw an XABCD Pattern on a JavaScript Financial Chart

A daily ETH-USD chart from Coinbase with an XABCD pattern added in code, on a zigzag of alternating lows and highs over the last 150 candles. It shows how to draw one; it is not a harmonic pattern found in this market. The button starts the XABCD tool: click the chart to place each of its six points.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../../_examples/drawing_HarmonicPatterns/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/drawing_HarmonicPatterns/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Draw an XABCD Pattern on a React Financial Chart

The same chart in React. The drawing is added in `onInit`, once the chart has loaded its candles, and `useDrawingTools` gives the buttons their controller.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="HarmonicPatternChart" name="../../../_examples/drawing_HarmonicPatterns/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/drawing_HarmonicPatterns/react.tsx
    ```
</CodeSnippetBlock>

## XABCD Pattern Options: PolyLineAnnotation

| Option | What it does |
| --- | --- |
| `points` | Six points: 0, X, A, B, C and D |
| `labels` | The text at each point, and where it sits |
| `formatLabelStyle` | `"SciTraderPatternLabelStyle"` flips each label above its point at a peak. Registered by `registerDrawingTools()` |
| `stroke`, `strokeThickness`, `fill` | The line, and the shading between the legs |
| `isEditable` | Whether the user can select, drag and edit it |

<details>
<summary>The PolyLineAnnotation class, with its TSDoc</summary>

```ts
/**
 * Native WebGL polyline annotation defined by two or more points.
 *
 * `PolyLineAnnotation` is the simplest concrete {@link MultiPointAnnotationBase}
 * implementation. It renders straight segments through its `points` array and
 * inherits the shared multi-point behavior: editable vertex grips, whole-shape
 * dragging, data-point snapping, point/segment/axis labels, label formatters and
 * placement-modifier support. Set `fill` to draw the closed polygon as a triangle
 * strip; leave it `null` for line-only drawing.
 */
class PolyLineAnnotation extends MultiPointAnnotationBase {
    /** @inheritDoc */
    readonly type: EAnnotationType;
    /** @inheritDoc */
    readonly surfaceTypes: ESurfaceType[];
    constructor(options?: IPolyLineAnnotationOptions);
    /** Gets or sets stroke color. */
    get stroke(): string;
    set stroke(value: string);
    /** Gets or sets stroke thickness. */
    get strokeThickness(): number;
    set strokeThickness(value: number);
    /** Gets or sets stroke dash array. */
    get strokeDashArray(): number[];
    set strokeDashArray(value: number[]);
    /** Gets or sets fill color. */
    get fill(): string | null;
    set fill(value: string | null);
    /** Gets or sets the number of points required during placement. */
    get placementPointCount(): number;
    set placementPointCount(value: number);
    /** @inheritDoc */
    delete(): void;
    /** @inheritDoc */
    onAttach(scs: SciChartSurface): void;
    /** @inheritDoc */
    drawWithContext(renderContext: IRenderContext2D, xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, seriesViewRect: Rect, surfaceViewRect: Rect, chartViewRect: Rect): void;
    /** @inheritDoc */
    onDpiChanged(args: TDpiChangedEventArgs): void;
    /** @inheritDoc */
    toJSON(): {
        type: EAnnotationType;
        options: Required<Omit<IAnnotationBaseOptions, never>>;
    };
}
```

</details>

<details>
<summary>The IPolyLineAnnotationOptions interface, with its TSDoc</summary>

```ts
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
