---
sidebar_position: 14
---

# The Digital (Step) Mountain Series Type

A Digital (Step) Mountain or area Series can be created using the [FastMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html) type.

:::tip
The [JavaScript Digital Mountain Chart Example](https://scichart.com/demo/javascript/digital-mountain-chart) can be found in the [SciChart.Js Examples Suite > Mountain Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/DigitalMountainChart) on Github, or our live demo at [scichart.com/demo](https://scichart.com/demo/javascript/digital-mountain-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/digital-mountain-chart"
    title="Digital Mountain Series Chart"
/>

## Create a Digital Mountain Series

To create a [Javascript Digital Mountain Chart](https://scichart.com/demo/javascript-digital-mountain-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {32,48} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {20,38} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

In the code above:

*   A Mountain Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokethickness and fill properties
*   ZeroLineY defines where the zero crossing is. The default is `0.0`
*   We assign a [DataSeries](/2d-charts/chart-types/data-series-api/data-series-api-overview) - which stores the Xy data to render.

## Render a Gap in a Digital Mountain Series

:::tip
It is possible to have null points or gaps in a Digital Mountain Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.
:::

## Add Point Markers onto a Digital Mountain Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Digital Mountain via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

:::tip
To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

There is also a dedicated [Scatter Series](/2d-charts/chart-types/xy-scatter-renderable-series) type and a [Bubble Series](/2d-charts/chart-types/fast-bubble-renderable-series) type with some more options.
:::

## Painting Mountain Segments with Different Colors

:::tip
It is possible to define the colour of line segments as well as mountain fills individually using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Mountain Charts](/2d-charts/chart-types/palette-provider-api/fast-mountain-renderable-series) documentation page.
:::