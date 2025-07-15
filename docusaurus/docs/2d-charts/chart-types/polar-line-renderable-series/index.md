---
sidebar_position: 100
---

# The Polar Line Chart Type

The [PolarLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) creates lines in a polar coordinate system, connecting data points with either straight line segments or interpolated arcs. This chart type is ideal for visualizing cyclical data, radar charts, or any data that benefits from a circular representation.

:::tip
The [JavaScript Polar Line Chart](http://stagingdemo2.scichart.com/demo/javascript/polar-line-chart) can be found in the [SciChart.Js Examples Suite > Polar Line Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/release_v4.0/Examples/src/components/Examples/Charts2D/PolarCharts/PolarLineChart) on Github, or our live demo at [scichart.com/demo](http://stagingdemo2.scichart.com/demo/react/polar-line-chart).
:::


<ChartFromSciChartDemo 
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-line-chart"
    title="Polar Line Series Chart"
/>

## Properties

Some of [IPolarLineRenderableSeriesOptions:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html)'s key properties include:

- [dataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#dataseries) - The [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) containing `xValues` and `yValues` arrays
- [stroke:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#stroke) - Stroke color for the line
- [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#strokethickness) - Thickness of the line
- [interpolateLine:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#interpolateline) - When true, line segments draw as arcs instead of straight lines
- [clipToTotalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#cliptototalangle) - When true, clips data outside the total angle range
- [pointMarker:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#pointmarker) - Optional markers to display at data points
- [paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#paletteprovider) - Custom coloring provider for dynamic styling
- [dataLabels:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#datalabels) - Configuration for optional data labels on points

## Examples

### Basic Polar Line Series

```ts showLineNumbers {35} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

In the code above:

- A [PolarLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) instance is created and added to the `sciChartSurface.renderableSeries` collection
- The [clipToTotalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html#cliptototalangle) is kept as `false` to allow wrapping

### PaletteProvider for Dynamic Line Coloring

By extending [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html) you can create custom coloring for your Polar Line Series, achieving dynamic styling based on data values:

```ts showLineNumbers {38-54,64-67} file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./PaletteProvider/demo" />

:::tip
Learn more about the [Palette Provider API - Polar Line Series](/2d-charts/chart-types/palette-provider-api/polar-line-renderable-series).
:::