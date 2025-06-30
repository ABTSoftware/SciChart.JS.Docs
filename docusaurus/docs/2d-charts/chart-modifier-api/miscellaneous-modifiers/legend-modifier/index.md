---
sidebar_position: 1
---

# ✅ Legend Modifier

**SciChart.js** features a rich, customisable legend API which is based on our powerful [ChartModifier API](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview). To add a Legend to a chart use **LegendModifier**.

SciChart legends support the following:

*   Placement of the Legend inside the chart top-left, top-right, bottom-left or bottom-right aligned
*   Horizontal or Vertical orientation of the Legend
*   Showing data series name, line color/marker, visibility checkboxes
*   Allowing full customization of the Legend using auto-generated classes **scichart\_\_legend**, **scichart\_\_legend-item**
*   Placing the Legend anywhere outside the chart

Showing a Legend
----------------

In order to show a legend add the **LegendModifier** to the chart.

`sciChartSurface.chartModifiers.add(new LegendModifier());`

 The full example code you will find below.

<CodeSnippetBlock labels={["TypeScript", "JavaScript"]}>
    ```ts {42} showLineNumbers file=./basic/demo.ts
    ```
    ```ts {28} showLineNumbers file=./basic/demo.js
    ```
</CodeSnippetBlock>

 This gives us the line chart with the legend placed in the left top corner.

<CenteredImageWrapper
    src="/images/LegendModifier_1.png"
    alt="Legend Modifier Example"
/>

Showing visibility checkboxes
-----------------------------

In order to show visibility checkboxes pass [showCheckboxes](https://www.scichart.com/documentation/js/current/typedoc/classes/legendmodifier.html#showcheckboxes) option into the **LegendModifier** constructor.

```ts {3} showLineNumbers
sciChartSurface.chartModifiers.add(
    new LegendModifier({ 
        showCheckboxes: true 
    })
);
```

This will draw the legend with checkboxes.

Now check/uncheck the checkboxes to show/hide renderable series. 

<CenteredImageWrapper
    src="/images/LegendModifier_2.png"
    alt="Legend Modifier with Checkboxes Example"
/>

Note: the Checkbox is bound to [BaseRenderableSeries.isVisible:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisible). You can subscribe to [BaseRenderableSeries.isVisibleChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisiblechanged) by following steps in this [documentation page](/docs/2d-charts/chart-types/common-series-apis/is-visible).

Subscribing to Checkbox Checked Changed
---------------------------------------

As well as subscribing to [BaseRenderableSeries.isVisibleChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisiblechanged), you can now subscribe to [LegendModifier.isCheckedChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/legendmodifier.html#ischeckedchanged) event. This can be done either in the constructor options to LegendModifier or after creation.

<CodeSnippetBlock labels={["TypeScript", "JavaScript"]}>
    ```ts {6,11} showLineNumbers
    const legend = new LegendModifier({
        showCheckboxes: true,
        showSeriesMarkers: true,
        showLegend: true,
        // Subscribe to checked changed here
        isCheckedChangedCallback: (series: IRenderableSeries, isChecked: boolean) => {
            console.log(`Option 1: Legend item ${series.type} isChecked=${isChecked}`);   
        }
    });
    // Or here after instantiation
    legend.isCheckedChanged.subscribe((args: TCheckedChangedArgs) => {
        console.log(`Option 2: Legend item ${args.series.type} isChecked=${args.isChecked}`);
    });
    // Add the legend to the chart
    sciChartSurface.chartModifiers.add(legend);
    ```
    ```ts {6,11} showLineNumbers
    const legend = new LegendModifier({
        showCheckboxes: true,
        showSeriesMarkers: true,
        showLegend: true,
        // Subscribe to checked changed here
        isCheckedChangedCallback: (series, isChecked) => {
            console.log(`Option 1: Legend item ${series.type} isChecked=${isChecked}`);   
        }
    });
    // Or here after instantiation
    legend.isCheckedChanged.subscribe((args) => {
        console.log(`Option 2: Legend item ${args.series.type} isChecked=${args.isChecked}`);
    });
    // Add the legend to the chart
    sciChartSurface.chartModifiers.add(legend);
    ```
</CodeSnippetBlock>

Placing the Legend outside the chart
------------------------------------

It is possible to place the **Legend** anywhere on the HTML page. In order to do that create a div element with some **Id**, the **Id** will be used to find this div element and to append the Legend. When creating the Legend pass **placementDivId** property into the constructor.

```ts
sciChartSurface.chartModifiers.add(new LegendModifier({ placementDivId: "legend-div-id" }));
```

The full example code.

<CodeSnippetBlock labels={["html"]}>
    ```html {3} showLineNumbers file=./callback/index.html
    ```
</CodeSnippetBlock>
<CodeSnippetBlock labels={["TypeScript", "JavaScript"]}>
    ```ts {43} showLineNumbers file=./callback/demo.ts
    ```
    ```ts {29} showLineNumbers file=./callback/demo.js
    ```
</CodeSnippetBlock>

 The result will be.

<LiveDocSnippet 
    name="./callback/demo" 
    htmlPath="./callback/index.html"
/>

#### See Also

* [Common ChartModifiers Features](/docs/2d-charts/chart-modifier-api/common-features/)
* [What is the ChartModifier API](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview)
* [Start Here - RenderableSeries Overview](/docs/2d-charts/chart-types/renderable-series-api-overview)
* [Common RenderableSeries Properties](/docs/2d-charts/chart-types/common-series-apis/drawing-point-markers)