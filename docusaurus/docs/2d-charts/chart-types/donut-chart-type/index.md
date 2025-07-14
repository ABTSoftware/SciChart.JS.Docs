---
sidebar_position: 51
---

# The Donut Chart Type

In SciChart.js, the JavaScript Donut Chart type is represented by the [SciChartPieSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html) type.

:::tip
The [JavaScript Donut Chart Example](https://scichart.com/demo/javascript/donut-chart) can be found in the [SciChart.Js Examples Suite > Pie Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/DonutChart) on Github, or our live demo at [demo.scichart.com](https://scichart.com/demo/javascript/donut-chart).
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/donut-chart" 
    title="Donut Chart" 
/>

The Donut Chart represents data in a form of circle divided into segments called PieSegments. A [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) represents a percentage that corresponds to a particular value. This value appears drawn on every segment and can be set in code. A [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) can be selected by clicking either on it or on the corresponding item in the Legend. This action provides a visual feedback on the chart and the Legend.

Create a Donut Chart
--------------------

To create a Donut Chart, you have to create a number of [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) instances and add them to the [SciChartPieSurface.pieSegments:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#piesegments) collection. Set the property [sciChartPieSurface.pieType = EPieType.Donut:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#pietype) to enable a donut chart. Then the property [sciChartPieSurface.holeRadius:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html#holeradius) is obeyed to create the donut.

Each  [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) has properties for [value:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#value), [text:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#text) and [color:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#color), or alternatively [colorLinearGradient:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#colorlineargradient) if you wish to specify a gradient fill. The property [isSelected:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html#isselected) denotes whether the [PieSegment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) is in the selected state or not.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {16,18,19,31,40,48,57,66} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {6,10,11,22,25,26} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Styling Donut Chart Segments & Formatting Labels
------------------------------------------------

Detailed documentation on how to style pie / donut chart segments and format labels can be found at the [Pie Chart Documentation page](/2d-charts/chart-types/pie-chart-type).