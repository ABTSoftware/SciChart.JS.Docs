---
sidebar_position: 1
---

# The Column Series Type

Column Series can be created using the [FastColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html) type.

:::tip
The [JavaScript Column Chart Example](https://scichart.com/demo/javascript/column-chart) can be found in the [SciChart.Js Examples Suite > Column Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/ColumnChart) on Github, or our live demo at [demo.scichart.com](https://scichart.com/demo/javascript/column-chart).
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/column-chart" 
    title="Column Series Chart"
/>

## Create a Column Series

To create a [Javascript Column Chart](https://scichart.com/demo/javascript-column-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {21,27,30} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,15} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./demo" />

In the code above:

*   A Column Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokethickness and fill properties
*   We set [FastColumnRenderableSeries.dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#datapointwidth) - which defines the fraction of width to occupy
*   We assign a [FastColumnRenderableSeries.dataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#dataseries) - which stores the Xy data to render.


## Render a Gap in a Column Series

It is possible to have null points or gaps in a Column Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.

## Add Point Markers onto a Column Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Column Series via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

There is also a dedicated [Scatter Series type](/2d-charts/chart-types/xy-scatter-renderable-series) and a [Bubble Series type](/2d-charts/chart-types/fast-bubble-renderable-series) with some more options.

## Painting Columns with Different Colors

It is possible to define the colour of column stroke & fill individually using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Column Charts](/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series) documentation page.

#### See Also

* [DataPointWidthMode](/2d-charts/chart-types/fast-column-renderable-series/data-point-width-mode)
* [Start Here - RenderableSeries Overview](/2d-charts/chart-types/renderable-series-api-overview)
* [Common RenderableSeries Properties](/2d-charts/chart-types/common-series-apis/drawing-point-markers)