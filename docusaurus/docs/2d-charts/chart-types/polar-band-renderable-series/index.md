---
sidebar_position: 100
---

import ChartPreviewWrapper from "@site/src/components/ChartPreviewWrapper";
import simpleBandChart from "!!raw-loader!./Basic/demo.js";
import gradientFillBandChart from "!!raw-loader!./GradientFill/demo.js";
import PaletteProviderExample from "!!raw-loader!./PaletteProvider/demo.js";

# ✅ The Polar Band Series Type

The [PolarBandRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html) creates a band or area between two polar curves, displaying the relationship between two sets of yValues on a polar coordinate system.

<ChartFromSciChartDemo 
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-band-chart"
    title="Polar Band Series Chart"
/>

Some of [IPolarBandRenderableSeriesOptions:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseriesoptions.html)'s key properties include:

- [dataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#dataseries) - The [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyydataseries.html) containing `xValues`, `yValues`, and `y1Values` arrays.
- [fill:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#fill) - Fill color where Y is greater than Y1
- [fillY1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#filly1) - Fill color where Y1 is greater than Y
- [stroke:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#stroke) - Stroke color for the Y line
- [strokeY1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#strokey1) - Stroke color for the Y1 line
- [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#strokethickness) - Thickness of the stroke lines
- [interpolateLine:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#interpolateline) - When true, line segments draw as arcs instead of straight lines
- [scaleGradientToYRange:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#scalegradienttoyrange) - Controls gradient scaling behavior for radial axis
- [fillLinearGradient:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#filllineargradient) - Linear gradient params where Y is greater than Y1
- [fillLinearGradientY1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#filllineargradienty1) - Linear gradient params where Y1 is greater than Y
- [paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarbandrenderableseries.html#paletteprovider) - Custom coloring provider for dynamic styling

## Examples

### Basic Polar Band Series

```ts showLineNumber {23} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<ChartPreviewWrapper jsContent={simpleBandChart} />

In the code above:

- 2 Polar Band Series instances are created and added to the `sciChartSurface.renderableSeries` collection.
- We set the [stroke:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#stroke), [strokeY1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#strokey1) for the yValues and y1Values respectively, and then [fill:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#fill) and [fillY1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#filly1), for when `Y > Y1` and vice versa.
- We assign an [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyydataseries.html) which stores X, Y and Y1 value arrays.

### Gradient Fills in Polar Band Series

To use Gradient Fills with a [PolarBandRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html), you need to set the [fillLinearGradient:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#filllineargradient) & [fillLinearGradientY1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#filllineargradienty1) properties with a [GradientParams:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/gradientparams.html) object: a type which defines gradients by a number of [TGradientStop:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/gradientparams.html#gradientstops) objects inside an array and a start and end [Point:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/gradientparams.html#startpoint).

```ts showLineNumbers {10-13,15-18} file=./GradientFill/demo.ts start=region_A_start end=region_A_end
```

<ChartPreviewWrapper jsContent={gradientFillBandChart} />

In the code above:
- We create a [GradientParams:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/gradientparams.html) object with 2 gradient stops, and set the start and end points of the gradient.
- We set [scaleGradientToYRange:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#scalegradienttoyrange) to `true` to make the gradient scale to the Y range of the data for each band segment.
- The [interpolateLine:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#interpolateline) flag is set to `true` to make the band wrap around the angular axes in a circular fashion.

### PaletteProvider for Polar Band Series

By extending [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html) you can create a custom palette for your Polar Band Series, to achieve dynamic coloring based on data values. This is useful if you want to set the color of the band based on `xValue`, `yValue` or `index`.

Here is how to do this:

```ts showLineNumbers {9-15,17-23,36} file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
```

<ChartPreviewWrapper jsContent={PaletteProviderExample} />

In the code above:
- We create a class that extends [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html) to override [overrideFillArgb:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#overridefillargb) and [overrideStrokeArgb:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#overridestrokeargb) methods by `xValue`, more specifically, the orange fill & stroke when this custom rule is met:
```ts
((xValue > 3 && xValue <= 6) || (xValue > 9 && xValue <= 12))
```