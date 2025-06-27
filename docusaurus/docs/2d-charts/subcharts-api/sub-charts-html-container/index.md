---
sidebar_position: 4
---

# ✅ SubCharts Html Container

Another feature of the SubCharts API is an ability to add custom HTML content around a sub-chart.

When adding a Sub Chart to a SciChartSurface with the [SciChartSubSurface.createSubSurface():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface) function, you can place extra optional HTML elements into the DOM. By specifying their IDs and classes to the SubChart, they can be positioned on top of, and around the [SciChartSubSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html).

<LiveDocSnippet maxWidth={"100%"} name="./HtmlContainers/demo" htmlPath="./HtmlContainers/demo.html" cssPath="./HtmlContainers/demo.css" />

This is achieved by composing following required HTML elements:      

*   _**scichart-root-element**_ - the element used to create the main surface.
*   _**sub-chart-container**_ - the element which will be displayed at the sub-surface position. It will have the sub-surface and custom html inside; more sub-chart containers could be added if there are many sub-charts.
*   _**chart-html-section**_ - the element which will hold the actual custom HTML content; sections are placed to the sides of a sub-surface accordingly to their class names: left-section, right-section, top-section, bottom-section.

Here is the setup required for the example: We will start from adding HTML markup which corresponds to the descriptions above. CSS is also added to give the HTML elements size and note that each have `position: absolute`.

<CodeSnippetBlock labels={["HTML", "CSS"]}>
```html {} showLineNumbers file=./HtmlContainers/demo.html
```
```css {} showLineNumbers file=./HtmlContainers/demo.css
```
</CodeSnippetBlock>


In the JavaScript, we create a SubChart as normal by calling [SciChartSubSurface.createSubSurface():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface), however we also specify [I2DSubSurfaceOptions.subChartContainerId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsubsurfaceoptions.html#subchartcontainerid). This property accepts both string (Id) or `HtmlDivElement`. We also specify class names that will identify sections of the container.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
```ts {12,15-19} showLineNumbers file=./HtmlContainers/demo.ts start=region_A_start end=region_A_end
```
```ts {19} showLineNumbers file=./HtmlContainers/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

As a result the container will be drawn with the position and sizes specified when creating the sub-surface, while the sub-surface itself will shrink accordingly to the space occupied by the custom content sections.

_**Note** left-section, right-section, top-section, bottom-section are the default values used for the class names of sections._

:::tip
The HTML Elements and CSS styles can also be added programmatically, that way extra elements around Sub-Charts can also be fully dynamic. We'll show you how in the next section.
:::

Creating a Draggable Header on SubCharts
----------------------------------------

Let's create a concrete example of using HTML Containers with SubCharts. In this updated example we will create some HTML elements and place them dynamically using JavaScript. This will give the effect of creating a draggable SubChart on a SciChartSurface.

First let's create a function to create a Sub-Chart with container HTML.

<CodeSnippetBlock labels={["createSubChartContainer()"]}>
```js showLineNumbers file=./HtmlContainersDraggableWindow/demo.ts start=region_A_start end=region_A_end
```
</CodeSnippetBlock>

This function creates a container `<div>` element with a unique Id and adds it to the DOM. It creates a topBar `<div>` and adds that to the container. CSS styles are applied to ensure `position: absolute` and the `className = "top-section"` is applied to the topBar, which helps SciChart position the element around the SubChart. We destructure the options so that the title can be set on the topBar and create the SubChart speciying the `subChartContainerId` as an HTMLElement (also supports string Id).

Next, by subscribing to `container.onpointerdown`, `onpointermove` and `onpointerup` we can reposition the SubChart by calling `SciChartSubSurface.subPosition`. Note that this accepts a `Rect` with relative coordinates, so we have to calculate that based on the parent `sciChartSurface.domChartRoot` width & height.

Note that the use of `position: absolute` and applying applying `className = "top-section"` helps SciChart position the top section above the SubChart.

The SubChart can now be added to a parent SciChartSurface as follows:

<CodeSnippetBlock labels={["Add SubChart"]}>
```js showLineNumbers file=./HtmlContainersDraggableWindow/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

This declares a SubChart with initial position, and adds some x,y axis and series.

Here's the result. You can now have a draggable SubChart window in a SciChartSurface!

<LiveDocSnippet maxWidth={"100%"} name="./HtmlContainersDraggableWindow/demo" />

#### See Also

* [Creating Re-usable Chart Groups with SubCharts](/docs/2d-charts/subcharts-api/example-reusable-chart-groups-with-sub-charts)
* [Creating Dynamic Multi-panel charts with SubCharts](/docs/2d-charts/subcharts-api/exampe-dynamic-multi-panel-charts-with-sub-charts)