---
sidebar_position: 1
---

# Secondary and Multiple Axes

SciChart.js supports **unlimited, multiple X or Y axis** which can be aligned to the Right, Left, Top, Bottom sides of a chart.

<ChartFromSciChartDemo src="https://scichart.com/demo/iframe/javascript-chart-with-multiple-x-axis" title="Multiple X Axes" description="" />

How to Setup a Chart with Multiple Axes
---------------------------------------

*   Axis may be placed by setting the [AxisBase2D.axisAlignment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#axisalignment) property.
*   [Axis.Id:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#id) identifies an axis in multi-axis scenarios
*   Series, Annotations and some Modifiers have **yAxisId**, **yAxisId** properties. These are used to assign chart items to an axis in multi-axis scenarios.

When you create an axis it automatically gets a unique id, which you can use to assign to Series, Annotations and some Modifiers.

<CodeSnippetBlock labels={["TS"]}>
    ```ts
    renderableSeries.xAxisId = xAxis.id;
    renderableSeries.yAxisId = yAxis.id;
    ...
    annotation.xAxisId = xAxis.id;
    annotation.yAxisId = yAxis.id;
    ```

</CodeSnippetBlock>

There's little more to it than that. However, there are many configurations in SciChart.js which we will get into later.


Here's a worked example:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./MultiAxisDemo/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./MultiAxisDemo/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This code results in the following configuration of axis. Also seen in our [Multiple Axis Demo](https://scichart.com/demo/javascript-chart-with-multiple-x-axis).


<LiveDocSnippet maxWidth={"100%"} name="./MultiAxisDemo/demo" />

Attaching Chart Series to an Axis 
----------------------------------

Every [RenderableSeries](/2d-charts/chart-types/renderable-series-api-overview) (the chart types in SciChart.js e.g. Line, Candlestick, Column) and every [Annotation](/2d-charts/annotations-api/annotations-api-overview) (Trendlines, text or markers laid over the chart) and some [ChartModifiers](/2d-charts/chart-modifier-api/chart-modifier-api-overview) (zoom, pan behaviours) need to be attached to a particular axis.

The link between series and axis is done via [AxisCore.id:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#id), and [BaseRenderableSeries.xAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#xaxisid) and [BaseRenderableSeries.yAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#yaxisid) properties.

With a single X,Y Axis you never have to set these properties as they gets set automatically. When a series, annotation or modifier gets attached to SciChartSurface, xAxis.id and yAxis.id get values from the first X and Y axes.

However, in a multiple axis scenario, series must be attached to an axis. To do this, ensure that you set the [BaseRenderableSeries.xAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#xaxisid) and [BaseRenderableSeries.yAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#yaxisid) equal to the [YAxis.id](https://scichart.com/documentation/js/current/typedoc/classes/axiscore.html#id) or [XAxis.id](https://scichart.com/documentation/js/current/typedoc/classes/axiscore.html#id) you wish to attach to.
