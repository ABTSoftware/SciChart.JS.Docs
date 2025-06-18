---
sidebar_position: 61
---

# ✅ The Spline (Smoothed) Mountain Series Type

Spline Mountain or Smoothed Area Series can be created using the [SplineMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html) type.

:::tip
The [JavaScript Spline Mountain Chart Example](https://demo.scichart.com/javascript-spline-mountain-chart) can be found in the [SciChart.Js Examples Suite > Spline Mountain Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/SplineMountainChart) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript/spline-mountain-chart)
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/spline-mountain-chart" 
    title="Spline Mountain Chart"
/>

Create a Spline Mountain Series
-------------------------------

To create a [Javascript Spline Mountain Chart](https://demo.scichart.com/javascript-spline-mountain-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {29,39-42,44,46} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {16,25-32,42} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

In the code above:

*   A Spline Mountain Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html#stroke), [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html#strokethickness) properties
*   We assign a [DataSeries](../data-series-api/data-series-api-overview/) - which stores the Xy data to render.
*   We set the number of [interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints) - how many points between real Xy data points will be interpolated using a Spline interpolation algorithm.

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Performance Tips in Spline Series
---------------------------------

:::tip
When the [SplineMountainRenderableSeries.interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html#interpolationpoints) property is set to zero, then this series renders and displays exactly like a FastLineRenderableSeries.
:::

:::tip
When the [interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html#interpolationpoints) property is set to another number, e.g. 10, then SciChart.js will calculate 10 points for each Xy datapoint you add to the XyDataSeries. This means you will be displaying 10x the number of datapoints.
:::

_SciChart.js can handle millions of datapoints, but this is something to be aware of. You might want to adjust down the interpolationPoints depending on amount of data on the chart, or zoom level._

Render a Gap in a Spline Mountain Series
----------------------------------------

:::tip
It is possible to have null points or gaps in a Mountain Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](DrawingGapsInSeries.html) article for more details.
:::

Add Point Markers onto a Spline Line Series
-------------------------------------------

:::tip
Every data point of a Spline Mountain Series can be marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). To add Point Markers to the Spline Mountain Series, see the [PointMarkers API Documentation](../common-series-apis/drawing-point-markers/).

_**Note:** PointMarkers are only applied to the original data-points, not the spline interpolated points which are for display purposes only._
:::

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](../common-series-apis/drawing-point-markers/).

There is also a dedicated [Scatter Series type](../xy-scatter-renderable-series/) and a [Bubble Series type](../fast-bubble-renderable-series/) with some more options.

Painting Spline Mountain Segments with Different Colors
-------------------------------------------------------

:::tip
It is possible to define the colour of line and mountain segments individually using the [PaletteProvider API](../palette-provider-api/palette-provider-api-overview/).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Mountain Charts](../palette-provider-api/fast-mountain-renderable-series/) documentation page. The same technique applies to spline line charts.
:::

#### See Also

* [The Mountain Series Type](../fast-mountain-renderable-series/)
* [The Line Series Type](../fast-line-renderable-series/)