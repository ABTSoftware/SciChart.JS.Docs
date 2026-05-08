---
sidebar_position: 2
sidebar_label: Multi-point labels deep dive
---

# Multi-Point Labels Deep Dive

Trading annotations are multi-point annotations whose shape is defined by an ordered [points:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#points) array rather than only [x1:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#x1-1), [y1:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#y1-1), [x2:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#x2) and [y2:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#y2). This page focuses on the shared label system: point labels, segment labels and axis labels.

The shared base class is [MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html) from `scichart-financial-tools`. It is used by [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html), [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) and the trading annotations from the same package. It owns the common editing model: point storage, vertex grips, whole-shape dragging, optional snapping and point / segment / axis labels.

:::note
[MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html) is not the same thing as `CompositeAnnotation`. A composite annotation is only a container that keeps other annotations positioned together. It does not provide points, label anchors, snapping or multi-point drag grips.
:::

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {17,45,105,111} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

## Label Types

Multi-point labels are defined in the [labels:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#labels) array. Each label is anchored to either a point, a segment or an axis marker position.

Point and segment labels are drawn inside the series view. Axis labels are drawn on the chart axes and can be configured to draw on the X axis, Y axis or both.

## Formatting Labels

[formatLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#formatlabel) controls label text. [formatLabelStyle:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#formatlabelstyle) can override the resolved style per label. Both callbacks receive the annotation, the original label definition, anchor values and pixel positions.

```ts
import { EMultiPointLabelAnchorMode, PolyLineAnnotation } from "scichart-financial-tools";

const annotation = new PolyLineAnnotation({
    points: [
        { x: 10, y: 105 },
        { x: 20, y: 112 }
    ],
    labels: [
        { anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 0 },
        { anchorMode: EMultiPointLabelAnchorMode.Axis, pointIndex: 1 }
    ],
    formatLabel: ({ anchorValuePoint, anchorMode }) =>
        anchorMode === EMultiPointLabelAnchorMode.Axis
            ? anchorValuePoint.y.toFixed(2)
            : `(${anchorValuePoint.x}, ${anchorValuePoint.y})`,
    formatLabelStyle: ({ labelIndex, defaultStyle }) => ({
        ...defaultStyle,
        color: labelIndex === 0 ? "#50C7E0" : "#FFFFFF",
        fontSize: 12
    })
});
```

For Builder API JSON configuration, register formatter functions by name and pass the registered name in [formatLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#formatlabel) or [formatLabelStyle:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#formatlabelstyle).

## Advanced Label Formatting Examples

### Formatter Functions by Anchor Type

This example keeps the formatter small by branching on `anchorMode`: point labels combine the default text with the live Y value, segment labels show percent change between their two points, and axis labels use a compact numeric value.

<LiveDocSnippet maxWidth={"100%"} name="./demo-label-formatting" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {67,84} showLineNumbers file=./demo-label-formatting.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

### Geometry-Aware Label Styles

This example reuses one `formatLabelStyle` callback across several annotation types. It colors stop-loss / take-profit segment labels from the active trade direction, changes trend labels when the line slopes down, and hides the channel label that is on the inactive side of the channel.

<LiveDocSnippet maxWidth={"100%"} name="./demo-conditional-labels" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {23} showLineNumbers file=./demo-conditional-labels.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

## Snapping

Multi-point annotations can snap placement and edits to a series.

```ts
import { ESnapMode, PolyLineAnnotation } from "scichart-financial-tools";

const snapped = new PolyLineAnnotation({
    points: [
        { x: 10, y: 0 },
        { x: 20, y: 0 }
    ],
    snapMode: ESnapMode.DataPoint,
    snapToDataPointRadius: 12,
    snapToSeriesId: "priceSeries",
    snapToDataPointOnInit: true,
    isEditable: true
});
```

Use [ESnapMode.DataPoint:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/esnapmode.html#datapoint) when both X and Y should snap to the nearest point. Use [ESnapMode.XSlice:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/esnapmode.html#xslice) when the X value should snap to the nearest data point while preserving the annotation's Y value.

## Label Notes

- [OnInteraction:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/eannotationvisibilitymode.html#oninteraction) labels appear while the annotation is hovered, selected or dragged.
- Axis labels can be anchored to a point or to a segment interpolation.
- Segment labels use [segmentRatio:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/interfaces/imultipointlabeldefinitionlike.html#segmentratio) from `0` to `1` to choose their anchor along the segment.
- A [formatLabelStyle:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#formatlabelstyle) callback can suppress a label by returning a style with `fontSize: 0`.
- Some trading annotations add their own specialized labels in addition to inherited multi-point labels. Fibonacci level labels and Measure labels are separate systems.

#### See Also

- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotation/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
