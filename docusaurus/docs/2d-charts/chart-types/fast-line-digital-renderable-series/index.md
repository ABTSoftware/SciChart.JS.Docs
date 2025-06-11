---
sidebar_position: 11
---

# The Digital (Step) Line Series

## Overview

Digital, or Step Line Series can be created using the [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) type, and setting the [isDigitalLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html#isdigitalline) flag to `true`.

:::tip
The [JavaScript Digital Line Chart Example](https://demo.scichart.com/javascript-digital-line-chart) can be found in the [SciChart.Js Examples Suite > Digital Line Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/DigitalLineChart) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-digital-line-chart)
:::

<iframe src="https://demo.scichart.com/iframe/javascript-digital-line-chart" width="100%" height="600px" frameborder="0"></iframe>

<div style={{textAlign: "center"}}> 
Above: The JavaScript [Digital Line Chart](https://demo.scichart.com/javascript-digital-line-chart) example from the [SciChart.js Demo](https://www.scichart.com/demo/react).
</div>

## Create a Digital (Step) Line Series

To create a [JavaScript Digital Line Chart](https://demo.scichart.com/javascript-digital-line-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {32} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {25} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet maxWidth={600} name="./Basic/demo.js" />

In the code above:

*   A Line Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokeThickness properties
*   We set the [isDigitalLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html#isdigitalline) property to `true` to enable a digital (step) line mode.
*   We assign a [DataSeries](The DataSeries API.html) - which stores the Xy data to render.

## Render a Gap in a Digital (Step) Line Series

It is possible to have null points or gaps in a Digital Line Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](DrawingGapsInSeries.html) article for more details.

## Add Point Markers onto a Digital (Step) Line Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Digital Line via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](DrawingPointMarkersOnSeries.html).

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](DrawingPointMarkersOnSeries.html).

There is also a dedicated [Scatter Series type](The Scatter Series Type.html) and a [Bubble Series type](The Bubble Series Type.html) with some more options.

## Painting Digital Line Segments with Different Colors

It is possible to define the colour of line segments individually using the [PaletteProvider API](The PaletteProvider API.html).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Line Charts](Per-point Colouring of Line Segments.html) documentation page.