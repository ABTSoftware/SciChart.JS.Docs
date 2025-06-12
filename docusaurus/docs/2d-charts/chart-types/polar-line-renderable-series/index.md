---
sidebar_position: 100
---

import ChartPreviewWrapper from "@site/src/components/ChartPreviewWrapper";

# ✅ The Polar Line Chart Type

import PolarLineChart from "!!raw-loader!./Basic/demo.js";
import PolarLinePaletteProvider from "!!raw-loader!./PaletteProvider/demo.js";

The [PolarLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) creates lines in a polar coordinate system, connecting data points with either straight line segments or interpolated arcs. This chart type is ideal for visualizing cyclical data, radar charts, or any data that benefits from a circular representation.

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
<ChartPreviewWrapper jsContent={PolarLineChart} />

In the code above:

- A [PolarLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) instance is created and added to the `sciChartSurface.renderableSeries` collection
- The [clipToTotalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html#cliptototalangle) is kept as `false` to allow wrapping

### PaletteProvider for Dynamic Line Coloring

By extending [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html) you can create custom coloring for your Polar Line Series, achieving dynamic styling based on data values:

```ts showLineNumbers {38-54,64-67} file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
```
<ChartPreviewWrapper jsContent={PolarLinePaletteProvider} />

In the code above:
- We create a `ThresholdLinePaletteProvider` class that extends [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html)
- The [strokePaletteMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#strokepalettemode) is set to [SOLID:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/estrokepalettemode.html#solid) since we want abrupt color changes based on a condition, not a [GRADIENT:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/estrokepalettemode.html#gradient)
- We override [overrideStrokeArgb:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#overridestrokeargb) to return another stroke color when our rule is met: `Math.floor(xValue / 3) % 2 === 0`
- When the method returns `undefined`, the default stroke color is used; otherwise, the custom color is applied
- The [interpolateLine:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html#interpolateline) is set to `true` to create smooth curved segments that follow the polar coordinate system
