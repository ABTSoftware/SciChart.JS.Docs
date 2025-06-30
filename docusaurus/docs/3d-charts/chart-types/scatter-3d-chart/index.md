---
sidebar_position: 1
---

# ✅ The Scatter 3D Chart Type

:::info
Examples for the Scatter 3D Chart can be found in the SciChart.js Demo app which can be viewed on our website, or downloaged from SciChart.Js.Examples Github Repository

*   [SciChart.js Demo app](https://demo.scichart.com/javascript-3d-bubble-chart)
*   [All examples on Github](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v4.0)
:::

3D Scatter Charts are provided by the [ScatterRenderableSeries3D](https://www.scichart.com/documentation/js/current/typedoc/classes/scatterrenderableseries3d.html) type. This draws a single PointMarker at an X,Y,Z location in the 3D world. Charts can be static or dynamic, and updated in real-time if required.

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/javascript-3d-bubble-chart" title="3D Bubble Chart" description="showing how to create a Scatter/Bubble 3D chart with variable size and color of points." />

The [ScatterRenderableSeries3D](https://www.scichart.com/documentation/js/current/typedoc/classes/scatterrenderableseries3d.html) supports multiple pointmarkers, including:

### 3D Marker Types

*   [SpherePointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/spherepointmarker3d.html) - a 3D Sphere at each point
*   [CubePointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/cubepointmarker3d.html) - 3D Cube at each point
*   [PyramidPointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/pyramidpointmarker3d.html) - a 3D Pyramid at each point
*   [CylinderPointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/cylinderpointmarker3d.html) - a 3D Cylinder at each point

### Fast 2D Marker types

*   [PixelPointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/pixelpointmarker3d.html) - a single pixel at each point
*   [QuadPointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/quadpointmarker.html) - a Quad (flat square) facing the camera at each point
*   [EllipsePointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker3d.html) - a flat ellipse facing the camera at each point
*   [TrianglePointMarker3D](https://www.scichart.com/documentation/js/current/typedoc/classes/trianglepointmarker3d.html) - a flat triangle facing the camera at each point


Declaring a 3D Scatter Series
-----------------------------

To declare a 3D Scatter Series with PointMarker use the following code:

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {36-86} showLineNumbers file=./Basic/demo.ts
```
```html showLineNumbers file=./Basic/demo.html
```
```css showLineNumbers file=./Basic/demo.css
```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" htmlPath="./Basic/demo.html" cssPath="./Basic/demo.css" />

Coloring Individual Scatter Points
----------------------------------

Scatter points may be colored or scaled individually using the PointMetadata3D API. To do this, set a [PointMetadata3D](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata3d.html) instance with property **vertexColor** at each data-point in the XyzDataSeries3D.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {11,21} showLineNumbers file=./Coloring/demo.ts start=region_A_start end=region_A_end
```
```html showLineNumbers file=./Coloring/demo.html
```
```css showLineNumbers file=./Coloring/demo.css
```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet maxWidth={"100%"} name="./Coloring/demo" htmlPath="./Coloring/demo.html" cssPath="./Coloring/demo.css" />

:::info
[IPointMetadata3D](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata3d.html) can be any javascript object but the property **vertexColor** is used to determine scatter 3D datapoint colour. This is in hex format Alpha, Red, Green, Blue, so 0xFFFF0000 would correspond to red. The helper function [parseColorToUIntArgb](https://www.scichart.com/documentation/js/current/typedoc/index.html#parseColorToUIntArgb) can convert Javascript Hex codes to this format.
:::