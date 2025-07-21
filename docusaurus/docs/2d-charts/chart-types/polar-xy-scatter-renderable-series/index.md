---
sidebar_position: 100
---

# The Polar Scatter Chart Type

The [PolarXyScatterRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarxyscatterrenderableseries.html) visualizes discrete points in a polar (circular) coordinate system, using customizable point markers. Each `(x, y)` data point is mapped as an "angle" (theta, usually in degrees or radians) and a "radius" (distance from center), making this chart type ideal for:

- Visualizing measurement data around a circle (e.g., wind direction/speed)
- Radar, sonar, and astronomy applications
- Medical/engineering polar data, and more

<ChartFromSciChartDemo 
    src="https://stagingdemo2.scichart.com/demo/iframe/polar-scatter-chart"
    title="Polar Xy Scatter Series Chart"
/>

## Properties

Key options for [IPolarXyScatterRenderableSeriesOptions:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarxyscatterrenderableseriesoptions.html):

- [dataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarxyscatterrenderableseriesoptions.html#dataseries): The [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) containing your X and Y arrays (angle & radius, respectively)
- [pointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarxyscatterrenderableseriesoptions.html#pointmarker): Type, shape, and color of marker ([EllipsePointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/ellipsepointmarker.html), [TrianglePointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/trianglepointmarker.html), etc.)
- [paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarxyscatterrenderableseriesoptions.html#paletteprovider): Optional for dynamic/color-by-value marker coloring
- [clipToTotalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarxyscatterrenderableseries.html#cliptototalangle): If set, clips points outside the angular axis' total angle
- [dataLabels:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarxyscatterrenderableseriesoptions.html#datalabels): Optionally show and style labels for individual points

## Examples

### Basic Polar Scatter Series

```ts showLineNumbers {37,41,46-52} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

In the code above:
- The [PolarXyScatterRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarxyscatterrenderableseries.html) is created and linked to an [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html).
- [TrianglePointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/trianglepointmarker.html) is used to draw each point, but you can substitute with any point marker class.
- Angular axis is configured to have a visible range from `0` to `360` and this coincides with the default [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html#totalangledegrees) of `360 degrees`, thus we added the [labelPostfix:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html#labelpostfix) as `°` to further clarify the angle unit.
- The radial axis is used for "distance from center"; here labels are hidden for a minimalist look.

### Polar Scatter with the BuilderAPI schema

The Scatter series's [pointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarxyscatterrenderableseriesoptions.html#pointmarker) property can be configured using a json type - options schema, great for dynamically assigning point marker types for a large dataset.

```ts showLineNumbers {7-13} file=./BuilderAPI/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./BuilderAPI/demo" />

## Point Marker Types & Customization

Any pointmarker type available in SciChart.js can be used for polar scatter charts:
- [EllipsePointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/ellipsepointmarker.html)
- [SquarePointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/squarepointmarker.html)
- [TrianglePointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/trianglepointmarker.html)
- [CrossPointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/crosspointmarker.html)
- [XPointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xpointmarker.html)
- [SpritePointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/spritepointmarker.html) for custom image markers
- Styles such as `fill`, `stroke`, `size`, and `strokeThickness` are all customizable.