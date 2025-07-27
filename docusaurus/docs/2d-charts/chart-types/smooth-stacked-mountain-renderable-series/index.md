---
sidebar_position: 63
---

# The Bezier (Smoothed) Stacked Mountain Series Type

A variation on the [Stacked Mountain Series](/2d-charts/chart-types/stacked-mountain-renderable-series) is the SmoothStackedMountainRenderableSeries. This uses a custom Bezier smoothing algorithm to create a smoothed line (spline line) to interpolate between datapoints.

Smoothed Stacked Mountain Charts can be created by a combination of the [SmoothStackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smoothstackedmountainrenderableseries.html) and [StackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html) types. 

:::tip
The [JavaScript Smooth Stacked Mountain Chart Example](https://scichart.com/demo/javascript/smooth-stacked-mountain-chart) can be found in the [SciChart.Js Examples Suite > Spline Mountain Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/SplineMountainChart) on Github
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/smooth-stacked-mountain-chart" 
    title="Smooth Stacked Mountain Chart"
/>

Create a Bezier Smoothed Stacked Mountain Series
------------------------------------------------

To create a [JavaScript Smoothed Stacked Mountain Series](https://scichart.com/demo/javascript/smooth-stacked-mountain-chart), use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {28,40,52,64,76,89-90,93} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {21,29,37,45,53} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Above:

*   We created 3 [StackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountainrenderableseries.html) and added them to a [StackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html)
*   The StackedMountainCollection itself is added to [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection, not the individual mountain series.

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Creating 100% Stacked Mountain Charts
-------------------------------------

SciChart.js also supports a JavaScript 100% Smoothed Stacked Mountain chart, which can be enabled by setting a single flag: [StackedMountainCollection.isOneHundredPercent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html#isonehundredpercent).

<CodeSnippetBlock labels={["TS"]}>
```ts {17} showLineNumbers file=./GroupingOptions/demo.ts start=#region_A_start end=#region_A_end
```
</CodeSnippetBlock>

Setting this flag results in the following output. 

<LiveDocSnippet name="./GroupingOptions/demo" />

_**Above:** a JavaScript 100% Smoothed Stacked Mountain chart when [StackedMountainCollection.isOneHundredPercent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html#isonehundredpercent) is true_

#### See Also

*   [Stacked Mountain Series](/2d-charts/chart-types/stacked-mountain-renderable-series)
