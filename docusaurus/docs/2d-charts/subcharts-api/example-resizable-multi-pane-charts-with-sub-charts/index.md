---
sidebar_position: 12
---

# ✅ Worked Example: Resizable Multi Pane Charts with SubCharts

In the previous worked example, we showed you how to [create Dynamic Multi-Panel Charts with the SubCharts API](/docs/2d-charts/subcharts-api/exampe-dynamic-multi-panel-charts-with-sub-charts/index.md). By following this tutorial, we showed you how to have a single [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) instance with 1...N Sub-Charts, each acting as a linked panel in a vertical chart group. All zooming, panning operations are linked, and you can dynamically add and remove chart panes programmatically, or by clicking a button.

In this worked example, we're going to extend the multi-panel subchart group by adding Grid-Splitters, allowing you to dynamically resize chart panes in the group. In addition, we will add a Close button and Maximise button to allow you to manipulate the chart group.

Resizable Chart Panels with SubCharts
-------------------------------------

Let's extend the [previous example](/docs/2d-charts/subcharts-api/exampe-dynamic-multi-panel-charts-with-sub-charts/index.md) to allow resizing of dynamic chart panes using the SubCharts API.

Here's the full working example below as an embedded CodePen.

<LiveDocSnippet maxWidth={"100%"} name="./PanelDynamicAddRemoveResizable/demo" htmlPath="./PanelDynamicAddRemoveResizable/demo.html" cssPath="./PanelDynamicAddRemoveResizable/demo.css" />

*   **Click "Add Chart" or "Remove Chart"** in order to dynamically change the number of chart panes using the SubCharts API.
*   Resize the chart panes by **dragging the grid splitter.**
*   **Click the close button** once you've added some charts to remove a panel.

In the following sections, we will explain the code and how it works.


### Extending the Code to include Resizable Grid-Splitters

The HTML hasn't changed and is still quite simple. However we've added some new classes to the CSS.

Here they are below:

<CodeSnippetBlock labels={["HTML", "CSS"]}>
```html file=./PanelDynamicAddRemoveResizable/demo.html
```
```css {} showLineNumbers file=./PanelDynamicAddRemoveResizable/demo.css
```
</CodeSnippetBlock>

### The Chart Initialization Code

The Chart Initialization code has been updated in order to add grid splitter and close button elements to the DOM. Have a look at the updated `createDynamicPanelChart()` function below.

<CodeSnippetBlock labels={["createDynamicPanelChart()"]}>
```ts {8-12} showLineNumbers file=./PanelDynamicAddRemoveResizable/demo.ts start=region_createDynamicPanelChart_start end=region_createDynamicPanelChart_end
```
</CodeSnippetBlock>

This works as before, creating a single parent [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) to occupy the `<div>` with `Id="scichart-root"`. To populate the chart with two chart-panes, `addNewChart()` is called twice. Functions to `addChart()` and `removeChart()` are returned from `createDynamicPanelChart()` to allow you to further customize the chart group programmatically after creation.


### Updated addNewChart() Code

So how does `addNewChart()` work? This function has been extended to handle creation and management of grid splitters and close buttons. You can find the code below:

<CodeSnippetBlock labels={["addNewChart()"]}>
```ts {21-26,38-39,32} showLineNumbers file=./PanelDynamicAddRemoveResizable/demo.ts start=region_addNewChart_start end=region_addNewChart_end
```
</CodeSnippetBlock>

Similar to before, we call [SciChartSubSurface.createSubSurface()](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html) to add a SubChart to the parent surface. This needs to be added at a specific position, and later in `addNewChart()` we call `updateChartPositions()` and `updateSplitterPositions()` to reposition everything.

The helper function `createSplitter()` is called to add a grid splitter into the DOM. `setupSplitterEvents()` subscribes to pointer-down, pointer-move and pointer-up so that you can capture drag events by the user.

### Updated removeChart() Code

`removeChart()` has also been updated to allow removal of a specific chart at index. This is wired into the close button event handler so you can click to remove a specific chart.Here's the code below:

<CodeSnippetBlock labels={["removeChart()"]}>
```ts {13-30} showLineNumbers file=./PanelDynamicAddRemoveResizable/demo.ts start=region_removeChart_start end=region_removeChart_end
```
</CodeSnippetBlock>

Conclusion
----------

Using the SubCharts API it's possible to create a multi-pane synchronized chart group in SciChart. This places one or more child chart surfaces on a parent chart, which all share the same WebGL canvas, context and drawing loop. The single unified nature of drawing with SubCharts ensures high performance on all browsers, and allows you to create dynamic linked multi-chart applications such as financial apps, telemetry monitoring apps and more using SciChart.js.

:::tip
You can see the full source-code for this example by clicking "Edit on CodePen" button in the embedded example at the top of the page.
:::