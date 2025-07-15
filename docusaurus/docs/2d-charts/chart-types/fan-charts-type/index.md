---
sidebar_position: 26
---

# The Fan Charts Type

Fan Charts are provided by using multiple [Band Series](/2d-charts/chart-types/fast-band-renderable-series) on the same chart.

:::tip
The [JavaScript Fan Chart Example](https://scichart.com/demo/javascript-fan-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [scichart.com/demo](https://scichart.com/demo/)
:::

<ChartFromSciChartDemo
    src="https://scichart.com/demo/iframe/fan-chart"
    title="Fan Chart"
/>

## Create a Fan Chart

There is no Fan Chart type out of the box in SciChart.js, but it is easy to create one using multiple Band series. Start with the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {25-30,37-38,49-50,61-62} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    
    ```ts {22-28,31,40,49} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

In the example above:

*   Some variance data is first created and returned as an array of objects.
*   A Line series is created to display the actual X,Y value
*   Several Band Series are created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection to render the variance bands.
*   We set the stroke, fill properties and opacity of each series (more info over at [FastBandRenderableSeries in TypeDoc:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html)).
*   We assign a [DataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basedataseries.html) - in this case an [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) which stores X, Y1, Y2 data for bands, and [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) for lines.