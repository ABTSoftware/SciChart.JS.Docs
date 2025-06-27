---
sidebar_position: 50
---

# ✅ The Pie Chart Type

In SciChart.js, the [JavaScript Pie Chart](https://demo.scichart.com/javascript-pie-chart) type is represented by the [SciChartPieSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html) type.

:::tip
The [JavaScript Pie Chart Example](https://demo.scichart.com/javascript-pie-chart) can be found in the [SciChart.Js Examples Suite > Pie Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/PieChart) on Github
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/pie-chart" 
    title="Pie Chart" 
/>

The Pie Chart represents data in a form of circle divided into triangular wedges called segments. A [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) represents a percentage that corresponds to a particular value. This value appears drawn on every segment and can be set in code. A [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) can be selected by clicking either on it or on the corresponding item in the Legend. This action provides a visual feedback on the chart and the Legend.

Create a Pie Chart
------------------

To create a Pie Chart, you have to create a number of [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) instances and add them to the [SciChartPieSurface.pieSegments:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#piesegments) collection.

Each [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) has properties for **value**, **text** and **color**, or alternatively **colorLinearGradient** if you wish to specify a gradient fill. The property **isSelected** denotes whether the [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) is in the selected state or not.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {15,29,38,46,55,63} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {5-6,9-13,18,20-24} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet name="./Basic/demo" />

Dynamically Updating a Pie Chart
--------------------------------

Pie Charts can be dynamically updated by setting the PieSegment.value property. When SciChartPieSurface.animate is true, updates to the pie chart will be animated.

Try this code below:

<CodeSnippetBlock labels={["TS"]}>
```ts {5,6,32-38,40} showLineNumbers file=./DynamicUpdates/demo.ts start=#region_A_start end=#region_A_end
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./DynamicUpdates/demo" />

Formatting Pie Chart Labels
---------------------------

Several options for formatting Pie Chart labels are possible with SciChart.js.

*   Set [SciChartPieSurface.seriesSpacing:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#seriesspacing) to put a padding in between pie segments.
*   Set [SciChartPieSurface.labelStyle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#labelstyle) to set a global label font size, color and family
*   Override [SciChartPieSurface.labelProvider.getSegmentText:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#labelprovider) to set a general label text override
*   Set [PieSegment.labelOffset:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#labeloffset) to move labels further away from the pie segment.
*   Set [PieSegment.labelStyle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#labelstyle) to set individual pie segment font and color
*   Set [PieSegment.radiusAdjustment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#radiusadjustment) to make the pie segment larger or smaller.
*   LabelProviders are also available on individual [PieSegment.labelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#labelprovider) property

Below, an example combines several of these techniques:

<CodeSnippetBlock labels={["TS"]}>
```ts {5,10,13,16-19,25-26,29,36-37,47-49,58} showLineNumbers file=./FormatOptions/demo.ts start=#region_A_start end=#region_A_end
```
</CodeSnippetBlock>

Resulting in:

<LiveDocSnippet name="./FormatOptions/demo" />

#### See Also

* [Donut Chart](/docs/2d-charts/chart-types/donut-chart-type)
* [Polar Pie Chart](/docs/2d-charts/chart-types/polar-pie-chart)