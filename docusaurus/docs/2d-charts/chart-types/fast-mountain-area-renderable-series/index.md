---
sidebar_position: 13
---

# ✅ The Mountain (Area) Series Type

Mountain (or Area) Series can be created using the [FastMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html) type.

The [JavaScript Mountain Chart Example](https://demo.scichart.com/javascript-mountain-chart) can be found in the [SciChart.Js Examples Suite > Mountain Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/MountainChart) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-mountain-chart)

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/mountain-chart" 
    title="Mountain Series Chart" 
/>

## Create a Mountain Series

To create a [Javascript Mountain Chart](https://demo.scichart.com/javascript-mountain-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)", "JS", "jS"]}>
    ```ts {31} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {19} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

In the code above:

*   A Mountain Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokethickness and fill properties
*   ZeroLineY defines where the zero crossing is. The default is `0.0`
*   We assign a [DataSeries](../data-series-api/) - which stores the Xy data to render.

## Render a Gap in a Mountain Series

:::tip
It is possible to have null points or gaps in a Mountain Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](../common-series-apis/drawing-gaps/) article for more details.
:::

## Add Point Markers onto a Mountain Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Mountain Series via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](../common-series-apis/drawing-point-markers/).

:::tip
To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](../common-series-apis/drawing-point-markers/).

There is also a dedicated [Scatter Series](../xy-scatter-renderable-series/) type and a [Bubble Series](../fast-bubble-renderable-series/) type with some more options.
:::

## Painting Mountain Segments with Different Colors

:::tip
It is possible to define the colour of line segments as well as mountain fills individually using the [PaletteProvider API](../palette-provider-api/palette-provider-api-overview/).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Mountain Charts](../palette-provider-api/fast-mountain-renderable-series/) documentation page.
:::

#### See Also

* [Start Here - RenderableSeries Overview](../renderable-series-api-overview/)

* [Common RenderableSeries Properties](../common-series-apis/is-visible/)