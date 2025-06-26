---
sidebar_position: 4
---

# ✅ Drawing PointMarkers on Series (Scatter markers)

Every data point of a Scatter, Line, Bubble, Mountain, Spline, Error or Column Series may be marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). So, not just limited to scatter series, you can apply a pointmarker to line series, or error bars to display a repeated marker at the X,Y point.

:::info
Simply set [BaseRenderableSeries.pointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker) = new [EllipsePointMarker():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointmarker.html) to apply a scatter point to most series types.
:::

Several different types of PointMarker are available in SciChart.js:

*   [EllipsePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html) - Renders a circle at each point
*   [SquarePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/squarepointmarker.html) - Renders a square at each point
*   [TrianglePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/trianglepointmarker.html) - Renders a triangle at each point
*   [CrossPointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/crosspointmarker.html) - Renders a plus sign '+' at each point
*   [XPointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xpointmarker.html) - Renders an 'x' at each point
*   [SpritePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/spritepointmarker.html) - Allows an image to be used at each point to create custom pointmarkers

Below we're going to show some options how to use different types of PointMarker in SciChart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet />

IsLastPointOnly mode for Pointmarkers
-------------------------------------

The PointMarker type has a property [isLastPointOnly:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointmarker.html#lastpointonly). When true, only the last point of a scatter series is drawn. This can be useful to highlight a point in say a sweeping ECG chart.

Additional Tips for PointMarkers
--------------------------------

Custom markers can be created using the [SpritePointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/spritepointmarker.html) type, which allows loading a custom image as a marker. This uses the helper function [createImageAsync:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#createimageasync) which allows loading of a PNG file either from URL, or locally hosted / imported image.

:::tip
For a TypeScript / npm & webpack example you can see the [JavaScript Custom PointMarkers Chart](https://demo.scichart.com/javascript-chart-custom-pointmarkers) example in the SciChart.js demo.
:::
