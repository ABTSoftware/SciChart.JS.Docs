---
sidebar_position: 24
---

# The Digital (Step) Band Series Type

A Digital Band Series, or High-Low Fill between two Digital or Step lines can be created using the [FastBandRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) type.

:::tip
The [JavaScript Digital Band Chart Example](https://www.scichart.com/demo/react/digital-band-chart) can be found in the [SciChart.Js Examples Suite > Band Series](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart) on Github, or our live demo at [scichart.com/demo](https://scichart.com/demo/javascript/digital-band-chart).
:::

<ChartFromSciChartDemo
    src="https://scichart.com/demo/iframe/digital-band-chart"
    title="Digital Band Chart"
/>

## Create a Digital Band Series

To create a [Javascript Digital Band Chart](https://scichart.com/demo/javascript-digital-band-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {30,42} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {20,33} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

In the code above:

*   A Band Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, fill properties for when Y > Y1 and vice versa (more info over at [FastBandRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) in TypeDoc).
*   We set the **isDigitalLine** property to true.
*   We assign a [DataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#dataseries) - in this case an [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) which stores X, Y, Y1 data.

## Render a Gap in a Digital Band Series

:::tip
It is possible to have null points or gaps in a Digital Band Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.
:::

## Add Point Markers onto a Band Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Band Series via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

:::tip
To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

There is also a dedicated [Scatter Series](/2d-charts/chart-types/xy-scatter-renderable-series) type and a [Bubble Series](/2d-charts/chart-types/fast-bubble-renderable-series) type with some more options.
:::

## Painting Band Segments with Different Colors

:::tip
It is possible to define the colour of band segments individually using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Band Charts](/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series) documentation page.
:::

#### See Also

* [The Band Series type](/2d-charts/chart-types/fast-band-renderable-series)