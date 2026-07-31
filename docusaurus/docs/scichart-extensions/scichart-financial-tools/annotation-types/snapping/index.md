---
sidebar_position: 2.1
sidebar_label: Annotation point snapping
---

# Annotation Point Snapping

Most multi-point annotations can snap placement and edits to a series. Use the button in this example to switch between every [ESnapMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/esnapmode.html), then drag a vertex to see how the selected mode constrains it. Drag a line segment to move the complete annotation.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" htmlPath="./demo.html" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {53} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use [ESnapMode.DataPoint:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/esnapmode.html#datapoint) when both X and Y should snap to the nearest point. Use [ESnapMode.XSlice:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/esnapmode.html#xslice) when only X should snap and the annotation's Y value should remain unchanged.

:::info Snapping details
- `ESnapMode.None` allows free placement and movement.
- `ESnapMode.DataPoint` snaps only when a data point is hit within `snapToDataPointRadius`.
- `ESnapMode.XSlice` snaps X while preserving Y. `snapToDataPointRadius` does not control this mode; setting the radius to `0` does not enable XSlice.
- `snapToSeriesId` selects the target series. `snapToDataPointOnInit` can snap the initial points once after the annotation is attached.
:::

:::tip
We recommend using `XSlice` for most annotations that are meant to be drawn on top of a price series, as it allows the user to place the annotation at any Y value while still snapping to the nearest X value in the series.
:::

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/polyline-annotation/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
