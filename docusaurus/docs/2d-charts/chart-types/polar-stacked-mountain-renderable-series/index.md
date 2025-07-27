---
sidebar_position: 100
---

# The Polar Stacked Mountain Chart Type

The Polar Stacked Mountain Chart Type is created using a [PolarStackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedmountaincollection.html) to manage multiple series of [PolarStackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedmountainrenderableseries.html), which represent the individual stacked mountains in the chart.

:::tip
The [JavaScript Polar Stacked Mountain Chart](https://stagingdemo2.scichart.com/demo/javascript/polar-stacked-mountain-chart) can be found in the [SciChart.Js Examples Suite > Polar Stacked Mountain Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/release_v4.0/Examples/src/components/Examples/Charts2D/PolarCharts/PolarStackedMountainChart) on Github, or our live demo at [scichart.com/demo](https://stagingdemo2.scichart.com/demo/react/polar-stacked-mountain-chart).
:::

<ChartFromSciChartDemo 
    src="https://stagingdemo2.scichart.com/demo/iframe/polar-stacked-mountain-chart"
    title="Polar Stacked Mountain Series Chart"
/>

## Create a Basic Polar Stacked Mountain Series 

To create a Javascript [Polar Stacked Mountain Series:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedmountainrenderableseries.html) with SciChart.js, use the following code:


<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
```ts showLineNumbers {33,39,49,60} file=./Basic/demo.ts start=region_A_start end=region_A_end
```
```ts showLineNumbers {13,37,49} file=./Basic/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

Above:

We created 2 [PolarStackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedmountainrenderableseries.html) and added them to a [PolarStackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedmountaincollection.html). Each [PolarStackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedmountainrenderableseries.html) represents a single mountain in the chart, and they are stacked on top of each other.
The StackedMountainCollection itself is added to [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#renderableseries) collection, not the individual mountain series.

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

#### See Also

* [Polar Mountain Series](/2d-charts/chart-types/polar-mountain-renderable-series)
* [Stacked Mountain Series](/2d-charts/chart-types/stacked-mountain-renderable-series)