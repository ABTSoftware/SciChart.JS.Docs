---
sidebar_position: 4
---

# The Lines 3D Chart Type

:::tip
Examples for the Lines 3D Chart can be found in the SciChart.js Demo app which can be viewed on our website, or downloaded from SciChart.Js.Examples Github Repository

*   [SciChart.js Demo app](https://demo.scichart.com/javascript-3d-point-line-chart)
*   [All examples on Github](https://github.com/abtsoftware/scichart.js.examples)
:::

3D Line Charts are provided by the [PointLineRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pointlinerenderableseries3d.html) type. This draws line segments from X,Y,Z data in the 3D world, with an optional point-marker. Charts can be static or dynamic, and updated in real-time if required.

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/javascript-3d-point-line-chart" title="3D Point Lines Chart" description="showing how to draw a Waterfall chart in 3D using SciChart.js" />

The [PointLineRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pointlinerenderableseries3d.html) requires X,Y,Z data to render, stored in an [XyzDataSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html). This series supports an optional pointmarker of multiple types, including:

### 3D Marker Types

*   [SpherePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/spherepointmarker3d.html) - a 3D Sphere at each point
*   [CubePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cubepointmarker3d.html) - a 3D Cube at each point
*   [PyramidPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pyramidpointmarker3d.html) - a 3D Pyramid at each point
*   [CylinderPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cylinderpointmarker3d.html) - a 3D Cylinder at each point

### Fast 2D Marker types

*   [PixelPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pixelpointmarker3d.html) - a single pixel at each point
*   [QuadPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/quadpointmarker.html) - a Quad (flat square) facing the camera at each point
*   [EllipsePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker3d.html) - a flat ellipse facing the camera at each point
*   [TrianglePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/trianglepointmarker3d.html) - a flat triangle facing the camera at each point

Declaring a 3D Point-Line Series
--------------------------------

To declare a 3D Point-Line Series with use the following code:

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end

```
```html showLineNumbers file=./Basic/demo.html
```
```css showLineNumbers file=./Basic/demo.css
```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" htmlPath="./Basic/demo.html" cssPath="./Basic/demo.css" />

Coloring Individual Line Segments
---------------------------------

Line segments in SciChart.js 3D points may be colored or scaled individually using the PointMetada3D API. To do this, set a [PointMetadata3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata3d.html) instance with property **vertexColor** at each data-point in the [XyzDataSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html).

Colors are in UInt Argb format. For this example below we use the helper functions [parseColorToUIntArgb():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#parsecolortouintargb) to convert from a JavaScript hex code to UInt32, and [uintArgbColorLerp():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#uintargbcolorlerp) to linearly interpolate two colours.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Coloring/demo.ts start=region_A_start end=region_A_end

```
```html showLineNumbers file=./Coloring/demo.html
```
```css showLineNumbers file=./Coloring/demo.css
```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet maxWidth={"100%"} name="./Coloring/demo" htmlPath="./Coloring/demo.html" cssPath="./Coloring/demo.css" />

:::info
[IPointMetadata3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata3d.html) can be any javascript object but the property **vertexColor** is used to determine scatter 3D datapoint colour. This is in hex format Alpha, Red, Green, Blue, so 0xFFFF0000 would correspond to red. The helper function [parseColorToUIntArgb:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#parseColorToUIntArgb) can convert Javascript Hex codes to this format.
:::