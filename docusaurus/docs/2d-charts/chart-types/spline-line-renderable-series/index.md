---
sidebar_position: 60
---

# The Spline (Smoothed) Line Series Type

Spline Line or Smoothed Series can be created using the [SplineLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html) type.

:::tip
The [JavaScript Spline Line Chart Example](https://scichart.com/demo/javascript/spline-line-chart) can be found in the [SciChart.Js Examples Suite > Spline Line Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/SplineLineChart) on Github, or our live demo at [scichart.com/demo](https://scichart.com/demo/javascript/spline-line-chart)
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/spline-line-chart" 
    title="Spline Line Chart"
/>

Create a Spline Line Series 
---------------------------

To create a [Javascript Spline Line Chart](https://scichart.com/demo/javascript-spline-line-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {20,28} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,17} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

In the code above:

*   A Spline Line Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokethickness properties
*   We assign a [DataSeries](/2d-charts/chart-types/data-series-api/data-series-api-overview) - which stores the Xy data to render.
*   We set the number of [interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints) - how many points between real Xy data points will be interpolated using a Spline interpolation algorithm.

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Performance Tips in Spline Lines
--------------------------------

:::tip
When the [SplineLineRenderableSeries.interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints) property is set to zero, then this series renders and displays exactly like a FastLineRenderableSeries.
:::

:::tip
When the [interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints) property is set to another number, e.g. 10, then SciChart.js will calculate 10 points for each Xy datapoint you add to the XyDataSeries. This means you will be displaying 10x the number of datapoints.
:::

_SciChart.js can handle millions of datapoints, but this is something to be aware of. You might want to adjust down the interpolationPoints depending on amount of data on the chart, or zoom level._

Render a Gap in a Spline Line Series
------------------------------------

:::tip
It is possible to have null points or gaps in a Line Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.
:::

Add Point Markers onto a Line Series
------------------------------------

Every data point of a Spline Line Series can be marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). To add Point Markers to the Spline Line Series, see the [PointMarkers API Documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

:::tip
PointMarkers are only applied to the original data-points, not the spline interpolated points which are for display purposes only.

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).
:::

There is also a dedicated [Scatter Series type](/2d-charts/chart-types/xy-scatter-renderable-series) and a [Bubble Series type](/2d-charts/chart-types/fast-bubble-renderable-series) with some more options.

Painting Spline Line Segments with Different Colors
---------------------------------------------------

:::tip
It is possible to define the colour of line segments individually using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Line Charts](/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series) documentation page. The same technique applies to spline line charts.
:::

#### See Also

* [The Line Series Type](/2d-charts/chart-types/fast-line-renderable-series)