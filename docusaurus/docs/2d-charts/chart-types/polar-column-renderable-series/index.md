---
sidebar_position: 100
---

# The Polar Column Chart Type

The [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) creates columns in a polar coordinate system, displaying data as vertical bars positioned at specific angles and radial distances from the center, or as angular bars drawn around the center.
This chart type is ideal for visualizing cyclic data or data with angular relationships.

:::tip
The [JavaScript Polar Column Chart](https://stagingdemo2.scichart.com/demo/javascript/polar-column-chart) can be found in the [SciChart.Js Examples Suite > Polar Column Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/release_v4.0/Examples/src/components/Examples/Charts2D/PolarCharts/PolarColumnChart) on Github, or our live demo at [scichart.com/demo](https://stagingdemo2.scichart.com/demo/react/polar-column-chart).
:::

<ChartFromSciChartDemo 
    src="https://stagingdemo2.scichart.com/demo/iframe/polar-column-chart"
    title="Polar Column Series Chart"
/>

## Properties

Some of [IPolarColumnRenderableSeriesOptions:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html)'s key properties include:

- [dataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#dataseries) - The [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html), [XyxDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxdataseries.html) or [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxydataseries.html) defining the data points of the columns.
- [fill:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#fill) - Fill color for the columns
- [stroke:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#stroke) - Stroke color for column borders
- [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#strokethickness) - Thickness of the column borders
- [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#datapointwidth) - Width of each column
- [dataPointWidthMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#datapointwidthmode) - How the `dataPointWidth` is applied, see [EDataPointWidthMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/edatapointwidthmode.html) for all options.
- [columnXMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#columnxmode) - How x values are interpreted for column positioning. See [EColumnMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html) for more info.
- [defaultY1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#defaulty1) - Sets the zero line - where the column starts at defaulting at `0`, but is only needed for [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html)
- [dataLabels:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#datalabels) - Configuration for data labels on columns
- [paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarcolumnrenderableseriesoptions.html#paletteprovider) - Custom coloring provider for dynamic styling

## Examples

### Basic Angular Polar Column Series

```ts showLineNumbers {20,28,36,44} file=./BasicAngular/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./BasicAngular/demo" />

In the code above:

- A [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) instance is created and added to the `sciChartSurface.renderableSeries` collection.
- We assign an [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) which stores X and Y value arrays.
- We set the [stroke:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#stroke), [fill:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#fill), [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#strokethickness), and [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#datapointwidth) properties.
- Optional [dataLabels:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#datalabels) are configured to display values on each column.

### Polar Radial Polar Column Series

The same renderable series can be used as radial columns by swapping the axis configurations. This creates columns that extend radially outward from the center:

```ts showLineNumbers {2-3,10-11,15} file=./BasicRadial/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./BasicRadial/demo" />

In the code above:
- The [xAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#xaxis) is configured with [EPolarAxisMode.Radial:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html#radial) to control the radial positioning.
- The [yAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#yaxis) is configured with [EPolarAxisMode.Angular:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html#angular) to control the angular positioning.
- The [axisAlignment:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#axisalignment) is also swapped.
- (optional) The angular axis now has 180 degrees (1 * PI radians), meaning a half-circle, due to the [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#totalAngle).
- (optional) The angular axis also grows clockwise, via [flippedCoordinates:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#flippedcoordinates).

### Column Mode Configuration

The [columnXMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#columnxmode) property controls how columns are positioned and sized along the X-axis:

```ts showLineNumbers {7} file=./ColumnMode/demo.ts start=region_A_start end=region_A_end
```
<LiveDocSnippet name="./ColumnMode/demo" />

In the code above:
- We use an [XyxDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxdataseries.html) with `xValues`, `x1Values`, and `yValues` arrays.
- The [columnXMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#columnxmode) is set to [EColumnMode.StartEnd:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startend) to define column start and end positions.
- Each column extends from its `xValue` to its `x1Value`, allowing for variable-width columns.

:::tip Different column modes require different data series types:
- [Start:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#start), [Mid:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#mid) - work with [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html)
- [StartEnd:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startend), [StartWidth:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startwidth), and [MidWidth:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#midwidth) - require [XyxDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxdataseries.html) or [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxydataseries.html)
:::

### PaletteProvider for Polar Column Series

By extending [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html) you can create a custom palette for your Polar Column Series, to achieve dynamic coloring based on data values. See more about this topic here [Palette Provider API - Polar Column Series](/2d-charts/chart-types/palette-provider-api/polar-column-renderable-series).