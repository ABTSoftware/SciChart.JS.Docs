---
sidebar_position: 5
---

# ✅ The Column 3D Chart Type

JavaScript 3D Column Charts can be created using the [ColumnRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/columnrenderableseries3d.html) type. This chart type draws columns or bars from X,Y,Z data in the 3D world, with a pointmarker denoting the shape of the column. Column 3D Charts can be static or dynamic, and updated in real-time if required.

:::tip
The [JavaScript / React 3D Column Chart Example](https://demo.scichart.com/react/3d-column-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/)
:::

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/3d-column-chart" title="3D Column Chart" description="showing a variety of line options in SciChart.js." />


Create a 3D Column Chart
------------------------

To declare a 3D Column Chart in JavaScript, use the following code:

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end

```
```html showLineNumbers file=./Basic/demo.html
```
```css showLineNumbers file=./Basic/demo.css
```
</CodeSnippetBlock>

Breaking this code down:

We initialize a 3D chart by calling [SciChart3DSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#create). The [worldDimensions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#worlddimensions) and [cameraOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/icameraoptions.html) are passed to [SciChart3DSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#create) to initialize the 3D scene.

An xAxis, yAxis and zAxis are declared of type [NumericAxis3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis3d.html).

Additional code is added to generate some data which is unwrapped into 1D arrays of X,Y and ZValues. These will specify the discrete 3D points on the column chart: X-Z providing the position and Y value providing the height. Data is passed into a [XyzDataSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html) which is the data source for the 3D column chart.

A [ColumnRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/columnrenderableseries3d.html) is created and added to the [SciChart3DSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#renderableseries) collection. We set the [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/columnrenderableseries3doptions.html#datapointwidthx) properties to define the size of the 3D bar as well as the [fill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/columnrenderableseries3doptions.html#fill) and [pointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/columnrenderableseries3doptions.html#pointmarker) properties to define the colour and type (shape) of the column.

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" htmlPath="./Basic/demo.html" cssPath="./Basic/demo.css" />

Choosing a Column / Bar Type
----------------------------

The [ColumnRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/columnrenderableseries3d.html) requires X,Y,Z data to render, stored in an [XyzDataSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html). This series supports an optional pointmarker of multiple types, including:

### 3D Marker Types

*   [SpherePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/spherepointmarker3d.html) - a 3D Sphere represents each bar/column
*   [CubePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cubepointmarker3d.html) - a 3D Cube represents each bar/column
*   [PyramidPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pyramidpointmarker3d.html) - a 3D Pyramid represents each bar/column
*   [CylinderPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cylinderpointmarker3d.html) - a 3D Cylinder represents each bar/column

Changing the [ColumnRenderableSeries3D.pointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/columnrenderableseries3doptions.html#pointmarker) property will update the type / shape of object used to denote a column.

Colouring Individual Columns
----------------------------

By default, the colour of the Column series is defined by [ColumnRenderableSeries.fill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/columnrenderableseries3d.html#fill). This can be overridden on a per-column basis using the [metadata:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html#metadata) array passed to [XyzDataSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html).

Update your code sample as follows:

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Coloring/demo.ts start=region_A_start end=region_A_end

```
```html showLineNumbers file=./Coloring/demo.html
```
```css showLineNumbers file=./Coloring/demo.css
```
</CodeSnippetBlock>

This example also shows a variation in the column type to use [CylinderPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cylinderpointmarker3d.html) which must be imported.

Metadata are simply javascript objects attached to the [XyzDataSeries3D](scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html) in SciChart. The property [metadata.vertexColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata3d.html#vertexcolor) is used to determine column 3D datapoint colour.

Finally, when specifying metadata colors, the property [ColumnRenderableSeries3D.useMetadataColors:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/columnrenderableseries3d.html#usemetadatacolors) must be set to true.

Here's the updated output:

<LiveDocSnippet maxWidth={"100%"} name="./Coloring/demo" htmlPath="./Coloring/demo.html" cssPath="./Coloring/demo.css" />