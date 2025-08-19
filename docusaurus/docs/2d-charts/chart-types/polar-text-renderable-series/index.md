---
sidebar_position: 105
---

# The Polar Text Series Type

There are several ways to add text to a SciChart.js polar chart. These include the TextAnnotation / NativeTextAnnotation, renderable series DataLabels and also the PolarTextRenderableSeries (Text Series).

Text Series should be used when you want to render a lot of text, not necessarily at X,Y positions of other chart series. The [PolarTextRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/polartextrenderableseries.html) is an extension of [FastTextRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttextrenderableseries.html), so there is some

:::tip
The [JavaScript Text / Word Cloud Chart Example](https://www.scichart.com/demo/javascript-text-chart) can be found in the [SciChart.Js Examples Suite > Text Series Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/TextSeriesChart) on Github, or our live demo at [scichart.com/demo](https://www.scichart.com/demo/javascript-line-chart)
:::

Creating a Polar Text Series
----------------------

To create a chart using [PolarTextRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/polartextrenderableseries.html) use the following code. 

**Note** that it is required to set `style: { fontSize: X }` and `color` in the dataLabels property in order for text to be drawn. 

PolarTextRenderableSeries uses the special [XyTextDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xytextdataseries.html) which allows you to supply text values directly on the dataSeries, rather than having to use metadata. 

<CodeSnippetBlock labels={["TS"]}>
    ```ts {33-37,41,43} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet name="./Basic/demo" />

#### See Also

* [(2D) Fast Text Renderable Series](docusaurus/docs/2d-charts/chart-types/fast-text-renderable-series)
* [Adding DataLabels to a Chart Series](/2d-charts/chart-types/data-point-labels/data-labels-api-overview)