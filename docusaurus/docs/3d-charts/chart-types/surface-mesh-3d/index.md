---
sidebar_position: 3
---

# ✅ The SurfaceMesh 3D Chart Type

:::tip
Examples for the Surface Mesh 3D Chart can be found in the SciChart.js Demo app which can be viewed on our website, or downloaded from SciChart.Js.Examples Github Repository

*   [SciChart.js Demo app](https://demo.scichart.com/javascript-3d-surface-mesh-chart)
*   [All examples on Github](https://github.com/abtsoftware/scichart.js.examples)
:::

3D Surface (topology, grid) Mesh Charts are provided by the [SurfaceMeshRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html) type. The surface mesh renders a two-dimensional array as a heightmap. This allows a number of configurable chart types in SciChart.js 3D, including:

*   Dynamic, updating Surfaces (terrains or height maps)
*   Texturing of surfaces or terrains or height maps
*   Contour mapping or wireframe on terrain or height maps

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/javascript-3d-surface-mesh-chart" title="3D Surface Mesh" description="" />

:::tip
Background reading: it may be helpful to read the [2D Heatmap documentation](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/index.md). Heatmaps share a lot of similarities with 3D Surface Mesh charts as both use 2-dimensional `number[][]` arrays, and both use colorMaps to map cell values to cell color.
:::

Declaring a Surface Mesh with Uniform Data
------------------------------------------

To declare a Surface Mesh with uniform data, use the following code:

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts showLineNumbers file=./UniformData/demo.ts start=region_A_start end=region_A_end
```
```html showLineNumbers file=./UniformData/demo.html
```
```css showLineNumbers file=./UniformData/demo.css
```
</CodeSnippetBlock>

this results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./UniformData/demo" htmlPath="./UniformData/demo.html" cssPath="./UniformData/demo.css" />

Breaking this down:

1.  We create a 2-dimensional array of numbers to store the heights (yValues). This is in the format `number[][]` and contains double precision values.
2.  Height values are applied to a [UniformGridDataSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformgriddataseries3d.html). The dataSeries is set on the dataSeries property of a [SurfaceMeshRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html)
3.  Data-values are mapped to colours using a [MeshColorPalette:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/meshcolorpalette.html). In this example we use [GradientColorPalette:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientcolorpalette.html) to map heights to a list of gradient stops.
4.  Other properties are set to control wireframe, X,Y,Z axis and drawing.

The dimensions of the yValues height 2D array are `[zIndex][xIndex]`.

Applying Color Palettes (Heightmaps) to Surfaces
------------------------------------------------

[yValues:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformgriddataseries3d.html#setyvalues) in the UniformGridDataSeries3D are a 2-dimensional array of type `number[][]`. These are mapped to heights in the 3D world, and are also mapped to colors using the [SurfaceMeshRenderableSeries3D.meshColorPalette:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#meshcolorpalette) property.

The mapping is similar to the method used by the [2D Heatmap Series](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type). Let's explain by digging into a simple example below.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {14,19} showLineNumbers file=./ColorPalettes/demo.ts start=region_A_start end=region_A_end
```
```html showLineNumbers file=./ColorPalettes/demo.html
```
```css showLineNumbers file=./ColorPalettes/demo.css
```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./ColorPalettes/demo" htmlPath="./ColorPalettes/demo.html" cssPath="./ColorPalettes/demo.css" />


What this means:

*   The GradientStop at Offset = 0 with corresponds to the [SurfaceMeshRenderableSeries3D.minimum:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#minimum) value of 0
*   The GradientStop at Offset = 1 corresponds to [SurfaceMeshRenderableSeries3D.maximum:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#maximum) value of 14.
*   Data within this range will be blended according to the gradient stops between 0 and 1
*   Data outside this range will be clamped to the minimum or maximum colors in the [GradientColorPalette:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientcolorpalette.html)

Overlaying a Heightmap Legend on the Surface
--------------------------------------------

Adding a Legend to a 3D Surface Mesh can be done with the HeatmapLegend control. See the [Surface Mesh Demo](https://demo.scichart.com/javascript-3d-surface-mesh-chart) at demo.scichart.com for a code sample showing how.

Configuring the Wireframe on the Surface
----------------------------------------

The wireframe on the Surface Mesh can be configured with the following properties:

| Property | Description |
|----------|-------------|
| [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#stroke) | The stroke color of the wireframe. |
| [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#strokethickness) | The strokethickness of the wireframe. |
| [drawMeshAs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#drawmeshas) | Enumeration defines whether the wireframe is drawn or not. Set to [EDrawMeshAs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edrawmeshas.html). **WIREFRAME**, **SOLID_WIREFRAME** or **SOLID_WIREFRAME_WITH_CONTOURS** to enable mesh wireframe drawing. |

Configuring Contours on the Surface
-----------------------------------

Contours may be configured on the mesh by setting additional properties.

| Property | Description |
|----------|-------------|
| [contourStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#contourstroke) | The stroke color of contours. |
| [contourStrokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#contourstrokethickness) | The strokethickness of contours. |
| [contourOffset:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#contouroffset) | A constant offset of where to start calculating contours from. |
| [contourInterval:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#contourinterval) | A factor defining the interval of Y-value between contours. |
| [drawMeshAs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#drawmeshas) | Enumeration defines whether the contours are drawn or not. Set to [EDrawMeshAs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edrawmeshas.html): **CONTOURS**, **SOLID_WITH_CONTOURS**, or **SOLID_WIREFRAME_WITH_CONTOURS** to enable mesh wireframe drawing. |

Additional Surface Mesh Properties
----------------------------------

Additional properties can be set to control surface mesh rendering and appearance. These are found below.

| Property | Description |
|----------|-------------|
| [meshPaletteMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#meshpalettemode) | Defines how cells are filled by palettes. E.g. interpolated, or solid cells, or textured. |
| [drawSkirt:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#drawskirt) | When true, draws a wall to zero around the edges of the surface mesh. |
| [heightScaleFactor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#heightscalefactor) | Scaling factor for heights. Default = 1. When between 0..1, this is a multiplier on the final height of the mesh. |
| [lightingFactor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#lightingfactor) | Setting from 0..1 which affects surface mesh rendering shininess or lighting. |
| [yOffset:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html#yoffset) | A constant offset applied to a surface mesh in the Y-direction (height). |
