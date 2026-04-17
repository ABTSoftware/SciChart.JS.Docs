---
sidebar_position: 2
---

# 3D Waterfall / Point-Line Chart

The 3D Waterfall Chart renders spectral or time-series data as stacked line slices in a 3D world, giving a sense of depth and evolution over time. Each slice is a [PointLineRenderableSeries3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/pointlinerenderableseries3d.html) whose points share the same Z value, spreading the series along the Z axis to form the waterfall stack.

:::tip
The [JavaScript 3D Point-Line Chart Example](https://www.scichart.com/demo/react/3d-point-line-chart) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts3D/Basic3DChartTypes/PointLine3DChart) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/3d-point-line-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/3d-point-line-chart"
    title="3D Waterfall / Point-Line Chart"
/>

## Create a 3D Waterfall Chart

The waterfall depth effect is achieved by assigning every point in a slice the **same Z value** while incrementing that value for each successive slice. The X axis represents frequency (or whatever dimension varies within a slice) and the Y axis represents magnitude.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```
```html showLineNumbers file=./Basic/demo.html
```
```css showLineNumbers file=./Basic/demo.css
```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" htmlPath="./Basic/demo.html" cssPath="./Basic/demo.css" />

In the code above:

- **`SciChart3DSurface.create()`** creates a 3D chart surface. `worldDimensions` sets the physical size of the 3D world in X, Y, Z units; `cameraOptions` positions the viewpoint.
- **`sciChart3DSurface.xAxis / yAxis / zAxis`** — 3D charts use single-axis assignment (not `.add()`) for each of the three axes.
- **`zValues.push(sliceIndex * 6)`** — all points in one slice share the same Z, and successive slices are spaced 6 units apart along Z, stacking them into the waterfall.
- **`PointLineRenderableSeries3D`** with an **`XyzDataSeries3D`** renders each slice as a colored line in 3D space.
- **`metadata[i].vertexColor`** — per-point color in UInt ARGB format, mapped from the Y (power) value through a heat gradient via `uintArgbColorLerp`.
- **`OrbitModifier3D`** / **`MouseWheelZoomModifier3D`** / **`ResetCamera3DModifier`** — 3D-specific modifiers for orbit rotation, zoom, and camera reset.

## The 3D API vs the 2D API

| Concept | 2D | 3D |
|---|---|---|
| Surface | `SciChartSurface` | `SciChart3DSurface` |
| Axis | `NumericAxis` added via `.xAxes.add()` | `NumericAxis3D` assigned to `.xAxis` / `.yAxis` / `.zAxis` |
| Data series | `XyDataSeries` | `XyzDataSeries3D` |
| Renderable series | `FastLineRenderableSeries` | `PointLineRenderableSeries3D` |
| Zoom/pan | `ZoomPanModifier`, `MouseWheelZoomModifier` | `OrbitModifier3D`, `MouseWheelZoomModifier3D` |
| Per-point color | `PaletteProvider` | `metadata[i].vertexColor` (UInt ARGB) |

## Point Markers

`PointLineRenderableSeries3D` supports optional 3D point markers at each data point. Choose from:

| Marker type | Class |
|---|---|
| Sphere | [SpherePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/spherepointmarker3d.html) |
| Cube | [CubePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/cubepointmarker3d.html) |
| Pyramid | [PyramidPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/pyramidpointmarker3d.html) |
| Cylinder | [CylinderPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/cylinderpointmarker3d.html) |
| Ellipse (flat, camera-facing) | [EllipsePointMarker3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/ellipsepointmarker3d.html) |
| Pixel | [PixelPointMarker3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/pixelpointmarker3d.html) |

Pass a marker instance to the `pointMarker` constructor option:

```ts
new PointLineRenderableSeries3D(wasmContext, {
    dataSeries: ...,
    strokeThickness: 2,
    pointMarker: new EllipsePointMarker3D(wasmContext, { size: 3 }),
})
```

## Per-Point Coloring with Metadata

Color each point individually by supplying a `metadata` array on `XyzDataSeries3D`. The `vertexColor` property controls the point color as a UInt ARGB value. Use `parseColorToUIntArgb()` and `uintArgbColorLerp()` to map values to a gradient:

```ts
const metadata = yValues.map((y) => ({
    vertexColor: valueToColor(y, low, high), // UInt ARGB
    pointScale: 1,
}));

new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues, metadata })
```

:::tip
Colors must be in UInt ARGB format where `0xFFFF0000` is opaque red. Use [parseColorToUIntArgb:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/index.html#parsecolortouintargb) to convert from CSS hex strings, and [uintArgbColorLerp:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/index.html#uintargbcolorlerp) to blend between two colors.
:::

## See Also

- [The Lines 3D Chart Type](/3d-charts/chart-types/lines-3d-chart/) — full reference for `PointLineRenderableSeries3D` including all marker types and per-segment coloring
- [The Waterfall Chart Type](/2d-charts/chart-types/waterfall-renderable-series/) — 2D financial waterfall built with Rectangle Series
- [Interactive Waterfall (Spectral) Chart](/2d-charts/chart-types/waterfall-renderable-series/interactive-waterfall-chart/) — 2D stacked spectral waterfall using offset axes
- [3D Chart Types Overview](/3d-charts/chart-types/)
