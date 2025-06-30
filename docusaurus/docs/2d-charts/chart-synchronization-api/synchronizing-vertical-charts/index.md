---
sidebar_position: 2
---

# ✅ Synchronizing Vertical Charts

In SciChart.js v3.4, you can now synchronize Vertical Charts, enabling grouped zooming, panning, cursors and tooltips as well as synchronized axis sizes when charts are arranged vertically.

:::tip
Before reading this topic, it's worth to familiarize yourself with [What is a Vertical Chart](/docs/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis/index.md) as well as the topic on Synchronizing Multiple Charts
:::

### Recap on Vertical Charts

Vertical Charts are when a 2D cartesian chart is rotated 90 degrees, or transposed, so that series render from top to bottom as opposed to left to right.

In SciChart, vertical charts are implemented by setting the axis.axisAlignment, e.g.

```ts showLineNumbers
xAxis.axisAlignment = EAxisAlignment.Top; // or Bottom
yAxis.axisAlignment = EAxisAlignemnt.Left; // or Right
```

This transposes the entire chart including series rendering, tooltips and annotations and resulting in a vertical chart which renders top to bottom.

:::tip
Read more about creating [Vertical Charts here](/docs/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis).
:::

### Recap on Synchronizing Multiple Charts

In SciChart.js, multiple charts may be synchronized to ensure that zooming/panning operations, tooltips or cursors and even axis sizes are synchronized. This allows you to create multi chart pane applications, or complex dashboards which zoom and pan or allow tooltips/cursors in unison.

The method to synchronize multiple charts involves several steps, which are laid out in the page [Synchronizing Multiple Charts](/docs/2d-charts/chart-synchronization-api/synchronizing-multiple-charts)

Creating a pair of Vertical Charts
----------------------------------

We've created an example showing how to sync vertical charts below. First we will start off with the codepen, then share the code and walk through how it works.

<LiveDocSnippet name="./demo" htmlPath="./demo.html" />

:::tip
Zoom and Pan the above chart to get a feel for how synchronized vertical charts work in a group!
:::

First of all some HTML is required to create two vertical charts. For simplicity this has been included with inline styles showing how to arrange the two divs vertically.

<CodeSnippetBlock labels={["html"]}>
```html showLineNumbers
<div id="scichart-root" style="display: flex">
    <div id="chart0Div" style="width: 50%; height: 100%; flex: 1"></div>
    <div id="chart1Div" style="width: 50%; height: 100%; flex: 1"></div>
</div>
```
</CodeSnippetBlock>

After that, some code to initialize the two charts can look like this:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

This code initializes a SciChartSurface, creates xAxis and yAxis in the configuration to allow a vertical chart, and adds some data and a line series.

The function [createSciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/modules.html#createscichartsurface) creates a single chart, so this is called twice passing in a different `<div>` ID in order to create the two vertical charts.

Synchronizing Zooming, Panning and Tooltips on Vertical Charts
--------------------------------------------------------------

To synchronize the two charts, we have to carry out the following steps:

1.  Synchronize [xAxis.visibleRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerange) on the two charts by using a [AxisCore.visibleRangeChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerangechanged) callback
2.  Synchronize chart axis heights using a [SciChartHorizontalGroup:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scicharthorizontalgroup.html)
3.  Finally, optionally synchronize chart modifiers (Cursor, Tooltips) using a [modifierGroup:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html#modifiergroup)

<CodeSnippetBlock labels={["Synchronizing Vertical Charts"]}>
    ```ts showLineNumbers file=./demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

Some Notes on Chart Synchronization with Vertical Charts
--------------------------------------------------------

Adding a [modifierGroup:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html#modifiergroup) to specific chart modifiers will ensure that mouse events from one chart are passed to the other and vice versa. This will actually cause zooming, panning, mousewheel and tooltip/cursor behaviour to occur on all charts (when one chart is interacted with).

However, from an axis range point of view it is far more accurate to synchronize [xAxis.visibleRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerange) on the two charts by using a [AxisCore.visibleRangeChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#visiblerangechanged) callback. Mouse events are only accurate to a pixel and some inconsistencies can be built up with synchronized charts unless you also have the visibleRange synchronization.

Adding a [SciChartHorizontalGroup:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scicharthorizontalgroup.html) ensures that the yAxis sizes on the two charts are exactly the same. This step is optional but in case of differing sizes of the axis it will give a more consistent look. For horizontal chart groups you can use the [SciChartVerticalGroup:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartverticalgroup.html) helper class.