---
sidebar_position: 10
---

# Polar Axis Labels

The [Polar Axis Labels:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#polarlabelmode) API in SciChart.js provides functionality for customizing the appearance and behavior of labels on polar axes. This includes options for angular and radial axes, allowing developers to control label visibility, alignment, and formatting.

<iframe src="http://stagingdemo2.scichart.com/demo/iframe/polar-label-modes" width="100%" height="600px" frameborder="0"></iframe>

<div style={{textAlign: "center"}}>
Above: The JavaScript [Polar Column Chart](http://stagingdemo2.scichart.com/demo/react/polar-label-modes) example from the [SciChart.js Demo](https://www.scichart.com/demo/react).
</div>

## Key Properties

:::tip
All of these properties are available on both the [PolarNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) and [PolarCategoryAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcategoryaxis.html) classes.
:::

### 1. The [PolarAxisBase.polarLabelMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#polarlabelmode)
> Defines how labels are displayed on the polar axis. The available modes are:

    - **[EPolarLabelMode.Horizontal:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolarlabelmode.html#horizontal)**: Labels are displayed horizontally, no matter the rotation, each label will be upright. This is useful for angular axes where you want labels to be readable regardless of their position.
    - **[EPolarLabelMode.Parallel:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolarlabelmode.html#parallel)**: Labels are displayed parallel to the axis, which means they will follow the curvature of the axis along their width.
    - **[EPolarLabelMode.Perpendicular:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolarlabelmode.html#perpendicular)**: Labels are displayed perpendicular to the axis, following the curvature of the axis along their height. This is useful for radial axes where you want labels to be oriented outward from the center.

### 2. The [PolarAxisBase.isInnerAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#isinneraxis)
> Indicates whether the axis labels are drawn on the other side of the axis. For each type of [polarAxisMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html), this property achieves:

- For the **Angular** axis this is a lot more important, as it determines where the labels are drawn in relation to the last angular axis gridline (the biggest circle).
  - `false`: Labels are drawn **outside** the last angular axis gridline (biggest circle), further from the center.
  - `true`: Labels are drawn **inside** the last angular axis gridline, closer to the center.

- The **Radial** axis just draws the labels on the other side of the first radial gridline, but does not entail this much control over the layout.

### 3. The [PolarAxisBase.labelProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#labelprovider): 
> Provides the ability to modify / customize when and how the axis labels are formatted. 

For the Polar Axes, we have created a special label provider, available out of the box, called [RadianLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html), which formats the labels in radians. Make sure to read the [TSDoc indications:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html) before using it, and observe how the [errorTolerance:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html#errortolerance) and [maxDenominator:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html#maxdenominator) pair with [AxisBase.autoTicks:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/axisbase.html#autoticks) and [AxisBase.majorDelta:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/axisbase.html#majordelta) to determine the label values.

## Other Base Properties that are of interest for Polar Axes:

- [labelPostfix:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/axisbase.html#labelpostfix): A string that is appended to each label value. 
  - For angular axes, this is often set to `°` to indicate degrees.
  - For radial axes, it can be set to `m`, `km`, or any other unit of measurement.

- [drawMinorGridLines:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/axisbase.html#drawminorgirdlines): A boolean that determines whether minor grid lines are drawn on the axis. 
  - For smaller polar charts, setting this to `false` can help improve readability by only keeping the major grid lines

- [labelPrecision:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/axisbase.html#labelprecision): A number that specifies the number of decimal places to display in the labels. 
  - By default, this is set to `1`, but if you work with degrees or just larger datasets, you may want to set it to `0` to avoid showing decimal places in the labels.

