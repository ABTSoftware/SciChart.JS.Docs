---
sidebar_position: 11
---

# ✅ Worked Example: Dynamic Multi-panel charts with SubCharts

Sub-Charts allows you to create re-usable multi-chart components that are managed by a single [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) instance.

For example, in telemetry monitoring applications, you might need to create a group of charts which are arranged vertically, and dynamically add/remove chart panes to the group. This can be done in several ways, for example we have tutorials how to do this in JavaScript ([Linking Multiple Charts](/docs/get-started/tutorials-js-npm-webpack/tutorial-09-linking-multiple-charts)). This tutorial use [SciChartSurface.create()](/docs/2d-charts/surface/new-scichart-surface), which creates a single [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) in a `<div>`, allowing you to add series, data, axis, modifiers and annotations to the chart.

However, in some browsers like Mozilla Firefox, creating multiple charts using [SciChartSurface.create()](/docs/2d-charts/surface/new-scichart-surface) results in slower performance when rendering/drawing. This is because Mozilla (and even safari) are not optimised for high performance when copying WebGL content to multiple canvases.

As a solution, SubCharts can allow you to create a single shared [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) and place multiple child charts on it (nested charts within charts).

Dynamic Multi-Pane Charts with SubCharts Example
------------------------------------------------

Let's create an example to add/remove chart panes dynamically with SubCharts, synchronizing the X-Axis so that zooming, panning operations occur across all charts.

:::info
Here's the full working example below as an embedded codepen. **Click "Add Chart" or "Remove Chart" in order to dynamically change the number of chart panes using the SubCharts API.**

In the following sections, we will explain the code and how it works.
:::

<LiveDocSnippet maxWidth={"100%"} name="./PanelDynamicAddRemove/demo" htmlPath="./PanelDynamicAddRemove/demo.html" cssPath="./PanelDynamicAddRemove/demo.css" />

### Creating the Code for a Multi-Panel Chart Group with SubCharts

#### HTML/CSS

Let's start by creating our HTML.

<CodeSnippetBlock labels={["HTML", "CSS"]}>
```html file=./PanelDynamicAddRemove/demo.html
```
```css {23} showLineNumbers file=./PanelDynamicAddRemove/demo.css
```
</CodeSnippetBlock>

The provided **HTML structure** creates a simple **user interface for managing dynamic charts** using SciChart. It consists of two main elements: a `.header` div and a `#scichart-root` div. The `.header` contains two buttons, **"Add Chart"** and **"Remove Chart"**, which allow users to dynamically modify the number of charts. Additionally, a `<span>` element (`.header-label`) provides instructions, informing users that they can add/remove charts and use drag gestures for panning. Below the header, the `#scichart-root` div acts as the container where the SciChart surfaces and sub-charts will be rendered.

The `#scichart-root` container is configured to **occupy the entire remaining viewport height** (`calc(100vh - 40px)`), ensuring the chart fully utilizes the available space without overflowing.

#### Chart Initialization Code

Next, let's create the JavaScript:

<CodeSnippetBlock labels={["createDynamicPanelChart()"]}>
```ts showLineNumbers file=./PanelDynamicAddRemove/demo.ts start=region_createDynamicPanelChart_start end=region_createDynamicPanelChart_end
```
</CodeSnippetBlock>

The `createDynamicPanelChart` function initializes a **dynamic multi-panel chart** using SciChart's `SubCharts` API, where each chart is stacked vertically and resizes automatically as new charts are added. It begins by creating a **parent** `SciChartSurface` inside the provided `divElementId`. An `AxisSynchroniser` is also initialized to ensure that all charts share the same X-axis range. The function then calls `addNewChart`, which creates the **first sub-chart occupying the full height** of the container. As more charts are added, each will dynamically resize to maintain equal height distribution across the available space.

The function also wires up **event handlers** for buttons (`addChartBtn` and `removeChartBtn`) that allow users to add or remove sub-charts interactively. Clicking the "Add Chart" button calls `addNewChart`, which resizes existing charts and inserts a new one at the bottom, while clicking "Remove Chart" triggers `removeChart`, which deletes the last sub-chart and resizes the remaining ones. Finally, `createDynamicPanelChart` returns an object containing the `sciChartSurface` and functions for adding or removing charts, making it easy to manipulate the chart layout programmatically. The function is immediately invoked with `"scichart-root"` as the container, ensuring that the chart initializes when the script runs.

#### Adding and Removing Chart Panes from the SubChart Group

<CodeSnippetBlock labels={["addNewChart()"]}>
```ts showLineNumbers file=./PanelDynamicAddRemove/demo.ts start=region_addNewChart_start end=region_addNewChart_end
```
</CodeSnippetBlock>

The `addNewChart()` function calls [SciChartSubSurface.createSubSurface():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html) to dynamically add a **new sub-chart** to an existing `SciChartSurface` while ensuring that all sub-charts within the parent surface are resized to **equal heights**.

The function then **adds numeric X and Y axes** to the new chart, with the X-axis being **synchronized** across all charts using `axisSynchronizer`. Several interactive modifiers—`ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier`—are attached, enabling **zooming, panning, and scaling** for better usability.

Finally, the function returns the newly created sub-chart (`sciChartSurface`) along with `wasmContext`, allowing the caller to further customize the chart or add data series. This approach makes it easy to **dynamically expand a multi-chart layout**, ensuring a consistent and interactive user experience.

<CodeSnippetBlock labels={["removeChart()"]}>
```ts showLineNumbers file=./PanelDynamicAddRemove/demo.ts start=region_removeChart_start end=region_removeChart_end
```
</CodeSnippetBlock>

The `removeChart` function is responsible for dynamically **removing the last sub-chart** from a parent `SciChartSurface`, ensuring that at least one chart remains visible. It first determines the current number of sub-charts via [SciChartSurface.subCharts.length:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#subcharts) and exits early if there is only one left.

If multiple charts exist, the function selects the last sub-chart and **removes its X-axis from the** `axisSynchronizer` to prevent synchronization issues. This ensures that when the chart is deleted, its axis does not affect the remaining ones. Once the axis is removed, the function **removes the sub-chart** from the `SciChartSurface` by calling [SciChartSurface.removeSubChart():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#removesubchart), reducing the number of displayed charts by one.

After removing the chart, the function **resizes and repositions the remaining sub-charts**  by calling [SciChatSubSurface.subPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#subposition) to maintain an equal height distribution. It calculates the new height for each chart and updates their positions by calling . This ensures a consistent layout, where the remaining charts automatically expand to fill the available space.

:::info
Note that [subPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#subposition) is updated with a Rect which contains relative sizing (for more info see [SubCharts Positioning](/docs/2d-charts/subcharts-api/sub-charts-positioning))
:::

#### Synchronizing Zooming, Panning across the SubCharts 

<CodeSnippetBlock labels={["AxisSynchroniser"]}>
```ts showLineNumbers file=./PanelDynamicAddRemove/demo.ts start=region_AxisSynchroniser_start end=region_AxisSynchroniser_end
```
</CodeSnippetBlock>

The `AxisSynchroniser` class ensures that multiple **axes in different sub-charts stay synchronized** by maintaining a shared `visibleRange`. It initializes with an optional `initialRange` and a list of axes, subscribing them to a `visibleRangeChanged` event. The `publishChange` method updates the stored `visibleRange` and propagates the change to all registered axes, keeping them in sync. The `addAxis` method registers a new axis, ensuring it adopts the shared `visibleRange` and subscribes to changes, while `removeAxis` removes an axis and unsubscribes it from updates. This class is essential for multi-chart setups where zooming or panning in one chart should update all others.

:::tip
You can see the full source-code for this example by clicking "Edit on CodePen" button in the embedded example at the top of the page.
:::


