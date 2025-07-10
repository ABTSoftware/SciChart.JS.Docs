---
sidebar_position: 98
---

# The Partial Polar Chart Type

:::tip
The [JavaScript Partial Polar Chart Example](http://stagingdemo2.scichart.com/demo/iframe/polar-partial-arc) can be found in the [SciChart.Js Examples Suite > Polar Partial Arc](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/release_v4.0/Examples/src/components/Examples/Charts2D/PolarCharts/PolarPartialArc) on Github, or our live demo at [demo.scichart.com](http://stagingdemo2.scichart.com/demo).
:::

<ChartFromSciChartDemo
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-partial-arc"
    title="Partial Polar Series Chart"
/>

This demo shows how a Polar plot can be used to look similar to a Cartesian plot, by setting [innerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#innerradius): to `0.998` (from the default of `0`) and [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#totalangle): to `0.001 * Math.PI` radians (from the default of 2 * Math.PI), so that it only displays a very small section of the total circle / polar system, which auto-ranges and zooms to fit in the parent div. 

The gridlines are never actually parallel, but the radius of the imaginary circle it's drawn on is so large when setting these 2 properties this way, that it looks like a Cartesian plot.

## What is a Partial Polar Chart?

The Partial Polar Chart is just a regular polar chart, but with the [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#totalangle) property of the **Angular** axis set to a value less than `2 * Math.PI` (or `360` degrees). This allows you to create a chart that only displays a portion of the polar coordinate system, which can be useful for visualizing data that is only relevant within a specific angular range.

The example above is extreme, but partial polar charts refers to all plots that span across an angle that is less than `360` degrees (or `2 * Math.PI` radians).

## Other examples of Partial Polar Charts:

### 1. Gauge Charts
> Many Gauge charts have sweeping arcs in between `180` and `270` degrees.
> Check this out for more info: [Gauge Chart Documentation](/docs/2d-charts/chart-types/polar-gauge-chart)

<ChartFromSciChartDemo
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-gauge-chart"
    title="Partial Polar Gauge Chart"
/>


### 2. Polar Column / Line / Mountain series
> They might also not need the full `360` degrees, but rather a partial arc

<div style={{display: 'flex', gap: 10, width: '100%'}}>
    <ChartFromSciChartDemo
        src="http://stagingdemo2.scichart.com/demo/iframe/polar-radial-column-chart"
        title="Polar Radial Column Chart"
        aspectRatio={1}
        width="100%"
    />

    <ChartFromSciChartDemo
        src="http://stagingdemo2.scichart.com/demo/iframe/polar-stacked-radial-column-chart"
        title="Polar Stacked Radial Column Chart"
        aspectRatio={1}
        width="100%"
    />
</div>

### 3. Polar Uniform Heatmap Chart
> A polar uniform heatmap chart can also be created by setting the [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#totalangle) property of the **Angular** axis to a value less than `2 * Math.PI` (or `360` degrees).

<ChartFromSciChartDemo
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-uniform-heatmap-chart"
    title="Polar Uniform Heatmap Chart"
/>

:::tip
For more information about polar chart layout, styling and axes, check out these documentation pages:
- [Polar Chart Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/polar-chart-layout)
- [Polar Axis Styling](/docs/2d-charts/axis-api/axis-styling/polar-axis-styling)
:::