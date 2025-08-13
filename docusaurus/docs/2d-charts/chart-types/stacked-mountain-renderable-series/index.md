---
sidebar_position: 41
---

# The Stacked Mountain Series Type

Stacked Mountain Charts can be created by a combination of the [StackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountainrenderableseries.html) and [StackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html) types. [StackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountainrenderableseries.html) share many properties with the added feature that columns automatically stack vertically or side by side.

:::tip
The [JavaScript Stacked Mountain Chart Example](https://www.scichart.com/demo/javascript/stacked-mountain-chart) can be found in the [SciChart.Js Examples Suite > Stacked Mountain Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/StackedMountainChart) on Github
::: 

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/stacked-mountain-chart"
    title="Stacked Mountain Chart"
/>

Create a Stacked Mountain Series
--------------------------------

To create a [JavaScript Stacked Mountain Series](https://www.scichart.com/demo/javascript/stacked-mountain-chart), use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {28,36,44,52,60,69-70,73} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {18,21,26,31,36,41} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Above:

*   We created 5 [StackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountainrenderableseries.html) and added them to a [StackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html)
*   The StackedMountainCollection itself is added to [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection, not the individual mountain series.

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Creating 100% Stacked Mountain Charts
-------------------------------------

SciChart.js also supports a [JavaScript 100% Stacked Mountain chart](https://www.scichart.com/demo/javascript/stacked-mountain-chart), which can be enabled by setting a single flag: [StackedMountainCollection.isOneHundredPercent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html#isonehundredpercent).

<CodeSnippetBlock labels={["TS"]}>
```ts {13} showLineNumbers file=./GroupingOptions/demo.ts start=#region_A_start end=#region_A_end
```
</CodeSnippetBlock>

Setting this flag results in the following output.

<LiveDocSnippet name="./GroupingOptions/demo" />

_**Above:** a [JavaScript 100% Stacked Mountain chart](https://www.scichart.com/demo/javascript/stacked-mountain-chart) when [StackedMountainCollection.isOneHundredPercent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html#isonehundredpercent) is true_