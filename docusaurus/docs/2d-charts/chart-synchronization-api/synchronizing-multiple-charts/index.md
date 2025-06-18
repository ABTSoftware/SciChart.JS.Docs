---
sidebar_position: 1
---

# ✅ Synchronizing Multiple Charts

SciChart.js features a rich set of APIs to synchronize multiple charts. With these APIs you can create dynamic dashboards and chart groups, for example:

*   Group charts together with linked behaviours
*   Sync chart sizes and axis sizes across chart groups
*   Sync tooltips, zooming or panning across chart groups
*   Dynamically add or remove chart panes to groups

The [JavaScript Sync Multi Chart Example](https://demo.scichart.com/javascript/sync-multi-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com)

How to create a Chart Group
---------------------------

We've created an example showing how create a synchonrized chart group below. First we will start off with the codepen, then share the code and walk through how it works.

<LiveDocSnippet maxWidth={"100%"} name="./VerticalGroup/demo" htmlPath="./VerticalGroup/demo.html" cssPath="./VerticalGroup/demo.css" />

Zoom and Pan the above chart to get a feel for how synchronized charts work in a group!

First of all some HTML is required to create two vertical charts. For simplicity this has been included with inline styles showing how to layout the two charts.

<CodeSnippetBlock labels={["HTML"]}>
    ```ts file=./VerticalGroup/demo.html
    ```
</CodeSnippetBlock>

After that, some code to initialize the two charts can look like this:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./VerticalGroup/demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

This code initializes a SciChartSurface, creates xAxis and yAxis and adds some data and a line series.

The function _createSciChartSurface_ creates a single chart, so this is called twice passing in a different `<div>` ID in order to create the two vertical charts.

Synchronizing Zooming, Panning and Tooltips on two charts
---------------------------------------------------------

To Synchronize the two charts, we have to carry out the following steps:

1.  Synchronize [xAxis.visibleRange](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerange) on the two charts by using a [AxisCore.visibleRangeChanged](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerangechanged) callback
2.  Synchronize chart widths using a [SciChartVerticalGroup](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartverticalgroup.html)
3.  Finally, optionally synchronize chart modifiers (Cursor, Tooltips) using a [modifierGroup](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html#modifiergroup)

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./VerticalGroup/demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

Some Notes on Chart Synchronization
-----------------------------------

Adding a [modifierGroup](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html#modifiergroup) to specific chart modifiers will ensure that mouse events from one chart are passed to the other and vice versa. This will actually cause zooming, panning, mousewheel and tooltip/cursor behaviour to occur on all charts (when one chart is interacted with).

However, from an axis range point of view it is far more accurate to synchronize [xAxis.visibleRange](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerange) on the two charts by using a [AxisCore.visibleRangeChanged](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerangechanged) callback. Mouse events are only accurate to a pixel and some inconsistencies can be built up with synchronized charts unless you also have the visibleRange synchronization.

Adding a [SciChartVerticalGroup](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartverticalgroup.html) ensures that the yAxis sizes on the two charts are exactly the same. This step is optional but in case of differing sizes of the axis it will give a more consistent look. For vertical chart groups you can use the [SciChartHorizontalGroup](https://www.scichart.com/documentation/js/current/typedoc/classes/scicharthorizontalgroup.html) helper class.
