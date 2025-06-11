---
sidebar_position: 10
---

# The Line Series Type

## Overview

import ChartPreviewWrapper from "@site/src/components/ChartPreviewWrapper";
import simpleLineChart from "!!raw-loader!./Basic/demo.js";

Line Series can be created using the [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) type.

:::tip
The [JavaScript Line Chart Example](https://demo.scichart.com/javascript-line-chart) can be found in the [SciChart.Js Examples Suite > Line Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/LineChart) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-line-chart)
:::

<iframe src="https://demo.scichart.com/iframe/javascript-line-chart" width="100%" height="600px" frameborder="0"></iframe>

<div style={{textAlign: "center"}}> 
Above: The JavaScript [Line Chart](https://demo.scichart.com/javascript-line-chart) example from the [SciChart.js Demo](https://www.scichart.com/demo/react).
</div>

## Create a Line Series

To create a [Javascript Line Chart](https://demo.scichart.com/javascript-line-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
```ts {27-34} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```
```ts {8-18} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet maxWidth={600} name="./Basic/demo" />

In the code above:

*   A [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokeThickness properties
*   We assign an [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) as our line's `dataSeries` - which stores the Xy data to render.

## Render a Gap in a Line Series

It is possible to have null points or gaps in a Line Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](DrawingGapsInSeries.html) article for more details.

## Add Point Markers onto a Line Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Line Series via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](../common-series-apis/).

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](../common-series-apis/drawing-point-markers/).

There is also a dedicated [Scatter Series type](The Scatter Series Type.html) and a [Bubble Series type](The Bubble Series Type.html) with some more options.

## Painting Line Segments with Different Colors

It is possible to define the colour of line segments individually using the [PaletteProvider API](../palette-provider-api/palette-provider-api-overview/).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Line Charts](Per-point Colouring of Line Segments.html) documentation page.

## See Also
[Per-point Colouring of Line Segments](../palette-provider-api/fast-line-renderable-series/)

[The PaletteProvider API](../palette-provider-api/palette-provider-api-overview/)
