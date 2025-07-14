---
sidebar_position: 25
---

# The Bubble Series Type

Bubble Series can be created using the [FastBubbleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbubblerenderableseries.html) type.

:::tip
The [JavaScript Bubble Chart Example](https://scichart.com/demo/javascript-bubble-chart) can be found in the [SciChart.Js Examples Suite > Bubble Series](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/BubbleChart) on Github, or our live demo at [demo.scichart.com](https://scichart.com/demo/javascript/bubble-chart).
:::

<ChartFromSciChartDemo
    src="http://demo.scichart.com/iframe/bubble-chart"
    title="Bubble Series Chart"
/>

## Create a Bubble Series

To create a [Javascript Bubble Chart](https://scichart.com/demo/javascript-bubble-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {27-31,33-42} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {17-36} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

In the code above:

*   A Bubble Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointmarker.html) with a width, height = 64. Note that this pointmarker will be scaled up or down relative to bubble size. Having a [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointmarker.html#strokethickness) of 0 can create a better visual.
*   We assign a [DataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basedataseries.html) - which stores the Xyz data to render, where X,Y is position and Z is scale factor.

This results in the following output:


<LiveDocSnippet name="./Basic/demo" />

:::tip
Because the Bubble Series renders a single point-market but scales for each point, **it is advisable not to use a Stroke on the PointMarker**, as this could get pixellated when the bubble is scaled up or down. This approach of ours results in extremely high performance charts - hundreds of thousands of data-points are possible with SciChart.js.
:::

## Scaling Bubble sizes per-point

:::tip
The Bubble chart sizes are scaled using the zValue on the [XyzDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries.html). By default, the z-value is pixels.

You can scale up/down the entire bubble series by setting the [FastBubbleRenderableSeries.zMultiplier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbubblerenderableseries.html#zmultiplier) property. Default value=1.

You can modify or edit sizes by adjusting the zValues via [xyzDataSeries.updateXyz():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries.html#updatexyz) or similar. See the [DataSeries Documentation](/2d-charts/chart-types/data-series-api/data-series-api-overview) pages for more info about data updates.
:::

Bubble sizes can be scaled using the DataSeries zValue, or the zMultiplier property (see above). What if you wanted to scale a bubble series depending on the zoom level of the viewport? Here's a quick worked example:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {12-22,44-46} showLineNumbers file=./ScaleBasedOnZoom/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./ScaleBasedOnZoom/demo" />

## Render a Gap in a Bubble Series

:::tip
It is possible to have null points or gaps in a Bubble Series by passing a data point with a **NaN** value as the **Y** value. Or, by simply skipping a point if using a value-axis. Please refer to the [Common Series Features - Draw Gaps in Series](/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.
:::

## Different Point-Markers on a Bubble Series

Every data point of a Bubble Series is marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointmarker.html). Several different types of PointMarker are available in SciChart.js:

*   [EllipsePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html) - Renders a circle at each point
*   [SquarePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/squarepointmarker.html) - Renders a square at each point
*   [TrianglePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/trianglepointmarker.html) - Renders a triangle at each point
*   [CrossPointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/crosspointmarker.html) - Renders a plus sign '+' at each point
*   [XPointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xpointmarker.html) - Renders an 'x' at each point
*   [SpritePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/spritepointmarker.html) - Allows an image to be used at each point to create custom pointmarkers

Any of these can be used to create a bubble chart.

:::tip
To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

There is also a TypeScript example of custom pointmarkers in the [SciChart.js Demo.](https://scichart.com/demo/javascript-chart-custom-pointmarkers)
:::

## Painting Bubbles with Different Colors

:::tip
It is possible to define the colour of PointMarkers individually using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Scatter Charts](/2d-charts/chart-types/palette-provider-api/fast-bubble-renderable-series) documentation page.
:::