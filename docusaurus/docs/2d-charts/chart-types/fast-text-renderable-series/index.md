---
sidebar_position: 64
---

# The Text Series Type

There are several ways to add text to a SciChart.js chart. These include the TextAnnotation, series DataLabels and also the FastTextRenderableSeries (Text Series).

Text Series should be used when you want to render a lot of text, not necessarily at X,Y positions of other chart series.

:::tip
The [JavaScript Text / Word Cloud Chart Example](https://www.scichart.com/demo/javascript-text-chart) can be found in the [SciChart.Js Examples Suite > Text Series Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/TextSeriesChart) on Github, or our live demo at [scichart.com/demo](https://www.scichart.com/demo/javascript-line-chart)
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/text-chart" 
    title="Text Series Chart"
/>

Creating a Text Series
----------------------

To create a chart using [FastTextRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttextrenderableseries.html) use the following code. 

**Note** that it is required to set `style: { fontSize: X }` and `color` in the dataLabels property in order for text to be drawn. 

FastTextRenderableSeries uses the special [XyTextDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xytextdataseries.html) which allows you to supply text values directly on the dataSeries, rather than having to use metadata. 

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {19,21-23,28-29,31} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,11-13,18-19,21} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet name="./Basic/demo" />

Customising the Text Series 
----------------------------

[FastTextRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttextrenderableseries.html) uses [TextDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textdatalabelprovider.html) for the generation and drawing of text, which has a slightly reduced api compared with the full DataLabels api. 

It has [getPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textdatalabelprovider.html#getposition) and [getColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textdatalabelprovider.html#getcolor) functions, but text is always taken from the **XyTextDataSeries**, and there is no label skipping - all labels are drawn even if they overlap. 

There is however an [onAfterGenerate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textdatalabelprovider.html#onaftergenerate) function that is called with the dataLabels before they are drawn which you can use to perform additional adjustments.  If you need to rely on the label sizes in this function, make sure to set **calculateTextBounds: true** in dataLabels.

[FastTextRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttextrenderableseries.html) supports pointmarkers and also [horizontalTextPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textdatalabelprovider.html#horizontaltextposition) and [verticalTextPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textdatalabelprovider.html#verticaltextposition) dataLabels options.

:::warning
Text is drawn using Native Text rendering, so to use any font other than Arial you will need ensure that font is available on your server (as fontname.ttf), or registered using **sciChartSurface.registerFont(...)** if coming from a remote url. 
:::

<CodeSnippetBlock labels={["TS"]}>
```ts {2-5,18,23-24,26,31,39} showLineNumbers file=./Customisation/demo.ts start=#region_A_start end=#region_A_end
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Customisation/demo" />

#### See Also

* [Adding DataLabels to a Chart Series](/2d-charts/chart-types/data-point-labels/data-labels-api-overview)