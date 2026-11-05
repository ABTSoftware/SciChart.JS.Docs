---
sidebar_position: 3
sidebar_label: Elliott Wave
title: "Elliott Wave: Draw Elliott Wave Patterns on a JavaScript or React Chart | SciTrader.js"
description: "What Elliott wave theory is, the rules of impulse and corrective waves, how traders use them, and how to draw Elliott wave patterns on a JavaScript or React financial chart with SciTrader.js, by point and click or in code."
keywords: ["Elliott wave", "Elliott wave theory", "Elliott wave pattern", "Elliott impulse wave", "Elliott wave JavaScript", "Elliott wave React chart", "ABC correction", "JavaScript financial chart", "React financial chart", "SciTrader.js"]
---

# Elliott Wave Patterns in a JavaScript or React Financial Chart

**Elliott wave theory** describes market moves as repeating patterns of waves: five waves with the trend, then three against it. This page explains what Elliott waves are, the rules traders count them by and how they use them, and shows how to draw Elliott wave patterns on a JavaScript or React financial chart with SciTrader.js, by point and click or in code, with live examples you can edit in CodePen.

:::info
The Elliott wave patterns are five of the 34 drawing tools in the SciTrader SDK. For the full list, with each tool's id, annotation class and number of points, see [Every Drawing Tool](/financial-charts/drawing-tools/#the-catalogue). To add drawing tools with point and click or in code, see [Add Drawing Tools to a Financial Chart](/financial-charts/drawing-tools/add-drawing-tools/).
:::

## What Is Elliott Wave Theory?

Ralph Nelson Elliott proposed in the 1930s that crowd psychology moves markets in recognisable patterns of waves:

- **An impulse** is five waves in the direction of the trend, labelled 1 to 5. Waves 1, 3 and 5 move with the trend; waves 2 and 4 correct against it.
- **A correction** is three waves against the trend, labelled A, B and C.
- **Patterns nest:** each wave is itself made of smaller waves, so the same shapes appear on every interval.

SciTrader has an Elliott wave tool for each of the common patterns. Each is a poly line with a label at each point, in the **Patterns** group:

| Tool | Tool id | Points (labels) | Pattern |
| --- | --- | --- | --- |
| Elliott Impulse Wave (12345) | `EDrawingToolVariantId.`<br />`PatternElliottImpulse` | 6: (0) to (5) | Five waves with the trend |
| Elliott Correction Wave (ABC) | `EDrawingToolVariantId.`<br />`PatternElliottCorrection` | 4: 0, A, B, C | A three-wave zigzag correction |
| Elliott Triangle Wave (ABCDE) | `EDrawingToolVariantId.`<br />`PatternElliottTriangle` | 6: (0), (A) to (E) | A five-wave contracting or expanding triangle |
| Elliott Double Combo (WXY) | `EDrawingToolVariantId.`<br />`PatternElliottDoubleCombo` | 4: (0), (W), (X), (Y) | Two corrections joined by an X wave |
| Elliott Triple Combo (WXYXZ) | `EDrawingToolVariantId.`<br />`PatternElliottTripleCombo` | 6: (0), (W), (X), (Y), (X), (Z) | Three corrections joined by X waves |

The first point, (0), is where the pattern starts.

## The Rules of an Elliott Wave Count

An Elliott wave pattern is drawn by the trader, not calculated. A valid **impulse** has to follow three rules:

1. **Wave 2 never retraces all of wave 1.** It doesn't go below wave 1's start, in an up-move.
2. **Wave 3 is never the shortest** of waves 1, 3 and 5. It is often the longest.
3. **Wave 4 doesn't overlap wave 1's price range**, except in special patterns such as diagonals.

Traders also use Fibonacci ratios as guidelines: wave 2 often retraces 50% to 61.8% of wave 1, wave 3 often reaches 1.618 times wave 1, and wave 4 often retraces 38.2% of wave 3. Draw a [Fibonacci Retracement](/financial-charts/drawing-tools/add-drawing-tools/fibonacci-retracement/) over a wave to check.

## How to Use Elliott Waves

These are the common uses. They are conventions traders use, not signals that hold every time:

- **Where the trend is.** In wave 3 of an impulse, the trend has room to run; after wave 5, a correction is expected.
- **Corrections as entries.** The end of wave 2 or wave 4, or of an ABC correction, is where trend traders look to join the trend.
- **Invalidation.** A count that breaks a rule is wrong; the price that would break it is a natural stop-loss level.
- **More than one count.** Waves are open to interpretation, so traders often keep a main count and an alternative.

## Drawing Elliott Waves with Point and Click

Start a pattern tool with `selectTool`, from a button or the [Drawing Toolbar](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/). The user clicks each point in turn, (0) first, and the labels follow:

```ts
import { DrawingToolsController, EDrawingToolVariantId } from "scichart-scitrader";

const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
drawing.selectTool(EDrawingToolVariantId.PatternElliottImpulse); // (0) to (5)
drawing.selectTool(EDrawingToolVariantId.PatternElliottCorrection); // 0, A, B, C
```

## Adding an Elliott Wave in Code {#in-code}

An Elliott wave pattern is a `PolyLineAnnotation` with a label at each point. The SDK's own pattern helpers aren't exported, so build the same options yourself:

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
    pattern([p0, p1, p2, p3, p4, p5], ["(0)", "(1)", "(2)", "(3)", "(4)", "(5)"], "#7C3AED", "#7C3AED33")
);
```

The label text identifies the pattern: with the same labels, the drawing list and `resolveToolIdForAnnotation` name it as the pattern tool's drawing, not a plain poly line.

## How to Draw Elliott Waves on a JavaScript Financial Chart

A daily BTC-USD chart from Coinbase with an Elliott impulse wave added in code, on a zigzag of alternating lows and highs over the last 180 candles. It shows how to draw one; it is not a wave count of this market. The buttons start the impulse and correction tools: click the chart to place each point.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../../_examples/drawing_ElliottWave/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../../_examples/drawing_ElliottWave/vanilla.ts
    ```
</CodeSnippetBlock>

## How to Draw Elliott Waves on a React Financial Chart

The same chart in React. The drawing is added in `onInit`, once the chart has loaded its candles, and `useDrawingTools` gives the buttons their controller.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="ElliottWaveChart" name="../../../_examples/drawing_ElliottWave/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../../_examples/drawing_ElliottWave/react.tsx
    ```
</CodeSnippetBlock>

## Elliott Wave Options: PolyLineAnnotation

| Option | What it does |
| --- | --- |
| `points` | One point per label: 6 for an impulse, 4 for an ABC correction |
| `labels` | The text at each point, and where it sits: `anchorMode`, `pointIndex`, `verticalTextPosition`, `yOffset`, `text` |
| `pointLabelVisibility` | When the labels show. `EAnnotationVisibilityMode.Always` for patterns |
| `formatLabelStyle` | `"SciTraderPatternLabelStyle"` flips each label above its point at a peak. Registered by `registerDrawingTools()` |
| `stroke`, `strokeThickness`, `strokeDashArray` | The line |
| `fill` | Shades the triangle between each pair of legs. `null` for none |
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
