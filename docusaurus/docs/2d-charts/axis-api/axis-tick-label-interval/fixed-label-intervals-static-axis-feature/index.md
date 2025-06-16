---
sidebar_position: 3
---

# ✅ Fixed Label Intervals - Static Axis Feature

Sometimes you want to have a fixed number of labels and major gridlines displayed on a chart, at specific values.

Consider the case where you have a chart with [xAxis.visibleRange](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerange) from 0 to 10, and you want to display labels precisely at 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Zooming and panning should not change the number or spacing of the labels. In this case, you can set the [axis.isStaticAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#isstaticaxis) property.

When in this mode, the major gridline positions / label positions and spacing are fixed. If the [axis.visibleRange](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerange) changes then the label values update, not the position or spacing.

Enabling Static Axis
--------------------

To enable the static axis mode, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./StaticAxis/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./StaticAxis/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./StaticAxis/demo" />

Varying the number of Static Axis Ticks & Labels
------------------------------------------------

When [axis.isStaticAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#isstaticaxis) is set to true, the number of major ticks (major gridlines, axis labels) are constrained by [axis.maxAutoTicks](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#maxautoticks).

For example setting [axis.maxAutoTicks](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#maxautoticks) = 5 will ensure there are always 5 labels and 5 major gridlines on the chart. These wil be at fixed spacings no matter the zoom level of the chart. Label values will update instead.

Formatting Labels and Precision (Decimal Places)
------------------------------------------------

When in static axis mode, the axis stil obeys formatting rules provided by the LabelProvider. Read the [NumericAxis Docs](/docs/2d-charts/axis-api/axis-types/numeric-axis/index.md) or the [LabelProvider API Docs](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md) for more info on how to vary label precision.
