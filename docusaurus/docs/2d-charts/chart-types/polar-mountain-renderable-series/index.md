---
sidebar_position: 100
---

# ✅ The Polar Mountain Chart Type

The [PolarMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html) is a type of renderable series that displays data in a polar mountain format.

:::tip
The [JavaScript Polar Mountain Chart](http://stagingdemo2.scichart.com/demo/javascript/polar-mountain-chart) can be found in the [SciChart.Js Examples Suite > Polar Mountain Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/release_v4.0/Examples/src/components/Examples/Charts2D/PolarCharts/PolarMountainChart) on Github, or our live demo at [demo.scichart.com](http://stagingdemo2.scichart.com/demo/react/polar-mountain-chart).
:::

<ChartFromSciChartDemo 
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-mountain-chart"
    title="Polar Mountain Series Chart"
/>

## Create a Basic Polar Mountain Series

To create a Javascript [Polar Mountain Series:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["Creating a Polar Mountain Series"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./Basic/demo" />

In the code above:
- We create a [PolarMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html) instance and append it to the renderableSeries collection.
- Add an [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) to the series, which stores the Xy data to render.
- Note that the line wraps for 1 and a half turns around the angular axis, since it calculates xValues as `xVal % visibleRange.max` and visible range is fixed to (0, 8)