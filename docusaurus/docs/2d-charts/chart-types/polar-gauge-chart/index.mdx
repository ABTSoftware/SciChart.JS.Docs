---
sidebar_position: 99
---

import ChartPreviewWrapper from "@site/src/components/ChartPreviewWrapper";
import usingArc from "!!raw-loader!./UsingArc/demo.js";
import usingColumn from "!!raw-loader!./UsingColumn/demo.js";
import complexArc from "!!raw-loader!./ComplexArc/demo.js";

# ✅ The Polar Gauge Chart Type

## Overview

The Polar Gauge Chart is used to visualize data in a polar coordinate system as a circular gauge or meter, where values are represented by angular position and radial distance. This chart type is ideal for displaying progress indicators, performance metrics, or any data that benefits from a circular visualization.

In SciChart.js, gauge charts are not specific renderable series, and can be created using either [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) for simple arc-based gauges or [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) for column-based gauges. Both approaches offer different advantages depending on your specific use case.

<iframe src="http://stagingdemo2.scichart.com/demo/iframe/polar-gauge-chart" width="100%" height="600px" frameborder="0"></iframe>

<div style={{textAlign: "center"}}>
    Above: The JavaScript [Polar Gauge Chart](http://stagingdemo2.scichart.com/demo/react/polar-gauge-chart) example from the [SciChart.js Demo](https://www.scichart.com/demo/react).
</div>

## Properties

Polar gauge charts typically consist of:

- **Angular Axis** - a [PolarNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) or [PolarCategoryAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcategoryaxis.html) with [EPolarAxisMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html) with [polarAxisMode.Angular:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html#angular) Controls the sweep angle and range of the gauge
- **Radial Axis** - a [PolarNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) or [PolarCategoryAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcategoryaxis.html) with [EPolarAxisMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html) with [polarAxisMode.Radial:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html#radial) Defines the radial scale and range
- **Background Elements** - Arcs / Columns for optional visual indicators showing the full range as a gradient
- **Value Elements** - The actual data representation (arc or column)
- **Annotations** - Additional elements like pointers, centered dataLabels

## Examples

### Basic Gauge using PolarArcAnnotation

The [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) approach is ideal for simple gauges with smooth arc representations:

```ts showLineNumbers {51-61} file=./UsingArc/demo.ts start=region_A_start end=region_A_end
```
<ChartPreviewWrapper jsContent={usingArc} />

In the code above:
- We configure the angular axis's [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html#totalangle) property to define the gauge's sweep angle.
- Also calculate the [startAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html#startangle) property to set the starting point of the gauge.
- Both axes have [isVisible:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html#isvisible) set to `false` to hide gridlines, ticks, and labels for a clean gauge appearance
- An optional gray **background arc** shows the full potential range of the gauge
- The **value arc** represents the current data value as such:
[PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html)'s `x1`, `x2` properties to set the start / end angle, and `y1`, `y2` properties to set the outer and inner radius (manipulating the arc thickness)

### Basic Gauge using PolarColumnRenderableSeries

The [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) approach offers more flexibility for data-driven gauges and gradient fills:

```ts showLineNumbers {18-21,23,27-34} file=./UsingColumn/demo.ts start=region_A_start end=region_A_end
```
<ChartPreviewWrapper jsContent={usingColumn} />

In the code above:
- We use [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxydataseries.html) to define both the radial dimensions (`yValues`, `y1Values`) and angular range (`xValues`, `x1Values`)
- The [columnXMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#columnxmode) is set to [EColumnMode.StartEnd:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startend) for precise control over the gauge arc
- This approach is better suited for gauges that need to display multiple data points or dynamic updates

### Advanced Multi-Threshold Gauge

For more complex gauge requirements with multiple thresholds, indicators, and styling:

```ts showLineNumbers {9-17,33-42,66,80} file=./ComplexArc/demo.ts start=region_A_start end=region_A_end
```
<ChartPreviewWrapper jsContent={complexArc} />

In the code above:
- **Multiple threshold [arcs:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html)** are created using different colors to represent various performance zones
- **Smart color selection** automatically chooses the appropriate color based on the current value and thresholds
- A [PolarPointerAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpointerannotation.html) provides a precise indicator of the current value
- Optional [TextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/textannotation.html) or [PolarPointerAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpointerannotation.html) can further highlight the numeric value in the center

## Choosing the Right Approach

**Use [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) when:**
- Creating simple, static gauges
- The gauge represents a single value
- Minimal code complexity is preferred

**Use [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) when:**
- You need data-driven gauges
- Multiple data points need to be displayed
- Dynamic updates are required
- You want to leverage series-level features like [fillLinearGradient:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#filllineargradient), [paletteProviders:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#paletteproviders) or [animation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#animation)

Both approaches can be combined in the same chart to create sophisticated gauge visualizations with multiple indicators, thresholds, and interactive elements.