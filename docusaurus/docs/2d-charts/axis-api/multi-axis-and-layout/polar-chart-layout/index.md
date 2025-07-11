---
sidebar_position: 8
---

# Polar Chart Layout

Polar charts - charts created with [SciChartPolarSurface.create():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html#create), have a different axis layout compared to Cartesian charts. In polar charts, the axes are arranged in a circular manner, which allows for `radial` and `angular` measurements.

The easiest way of thinking about polar axes is this:
- **Radial Axis**: Measures distance from the center of the chart up until the border of it, **like a radius**, and is typically used in the same logic an `Y Axis` is used in 2D Cartesian charts.
- **Angular Axis**: Measures the angle around the center of the chart, **like a circle**, and is typically used in the same logic an `X Axis` is used in 2D Cartesian charts.

:::note
This is just a suggestion, and in the same way you can have [Vertical Charts](/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis/) on Cartesian surfaces, (where the traditional X and Y axes are interchanged).
:::

### Regular vs Vertical Polar Charts

Notice the following 2 examples, where the first one is a regular, horizontal polar chart, using the `Angular` axis as an x-axis, representing the separate columns of the chart and the `Radial` axis as a y-axis representing the height of each column in the chart, while the second chart is a vertical polar chart, where the roles are reversed.

<div style={{ display: 'flex', width: '100%', aspectRatio: '2' }}>
    <iframe src="http://stagingdemo2.scichart.com/demo/iframe/polar-column-chart" title="Polar Column Chart Example" style={{ flex: 1, height: 500 }}></iframe>
    <iframe src="http://stagingdemo2.scichart.com/demo/iframe/polar-radial-column-chart" title="Polar Radial Column Chart Example" style={{ flex: 1, height: 500 }}></iframe>
</div>

### Creating the 2 axes of a Polar surface in SciChart.js can be done like so:

<CodeSnippetBlock labels={["Creating the Radial and Angular Axes"]}>
    ```ts {1,8,14} showLineNumbers
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "Polar Chart Layout Example"
    });

    // Add polar axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 360) // 0 to 360 degrees
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10) // 0 to 10 units of height
    });
    sciChartSurface.yAxes.add(radialYAxis);
    ```
</CodeSnippetBlock>

This will result in the following layout:

<LiveDocSnippet name="./demo" />

### Advanced Polar Chart Layout

For the Polar Axes, we have created a special label provider, available out of the box, called [RadianLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html), which formats the labels in radians. Make sure to read the [TSDoc indications:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html) before using it, and observe how the [errorTolerance:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html#errortolerance) and [maxDenominator:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html#maxdenominator) pair with [AxisBase.autoTicks:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#autoticks) and [AxisBase.majorDelta:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#majordelta) to determine the label values.

<CodeSnippetBlock labels={["Advanced Polar Chart Layout"]}>
    ```ts {20-25} showLineNumbers file=./demo-advanced.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

And this is how it looks like:

<LiveDocSnippet name="./demo-advanced" />

### Partial Polar Chart Layout

By changing the [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#totalAngle) property on your angular axis, you can control the sweeping angle of your polar surface, e.g. you can have half-circles, quarter-circles, etc. 
It expects values in between `0` and `Math.PI * 2`

:::tip
There is also a [totalAngleDegrees:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#totalAngleDegrees) property available for convenience, with values in between `0` and `360`
::::

<CodeSnippetBlock labels={["Partial Polar Layout"]}>
    ```ts {27-28,30-31,44} showLineNumbers file=./demo-partial.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

Resulting in the following layout:

<LiveDocSnippet name="./demo-partial" />

### More Tips:

:::tip
If using [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) on a polar chart, you will likely want to set [zoomExtentsToInitialRange:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#zoomextentstoinitialrange) to `true`, so that the zoom extents modifier will not try and squash the first and last data points together.
:::

:::tip
If the gridlines are too often for your liking, you can either:
1. Set [drawMinorGridLines:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#drawminorgirdlines): `false` on any axis
2. Or set [minorsPerMajor:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#minorsPerMajor) to something lower than `5` (the default). Use `2` for a minimal look.

- You can also customize the `color`, `thickness` and `strokeDashArray` of both major and minor gridlines via [MajorGridLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#majorgridlinestyle) and [MinorGridLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#minorgridlinestyle), both having the [TGridLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tgridlinestyle) type.
:::