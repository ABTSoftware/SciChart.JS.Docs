---
sidebar_position: 6
---

# XAxisDragModifier

SciChart.js provides an zooming / panning behavior when dragging the Axis via the [XAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xaxisdragmodifier.html), available out of the box.

Besides common features which are inherited from the [ChartModifierBase](/2d-charts/chart-modifier-api/common-features) class, the [XAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xaxisdragmodifier.html) allows you to choose panning or scaling via the [dragMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html#dragmode) property.

Adding a XAxisDragModifier to a Chart
-------------------------------------

A [XAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xaxisdragmodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable scaling or panning behavior. For example:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {5} showLineNumbers
    import { XAxisDragModifier, EDragMode } from "scichart";

    // Add XAxis Drag behavior
    sciChartSurface.chartModifiers.add(
        new XAxisDragModifier({
            dragMode: EDragMode.Scaling,
        })
    );
    ```
    
    ```ts {8} showLineNumbers
    // Demonstrates how to configure the XAxisDrag Modifier in SciChart.js using the Builder API
    const { chartBuilder, EChart2DModifierType, EDragMode } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        modifiers: [
            {
                type: EChart2DModifierType.XAxisDrag,
                options: {
                    dragMode: EDragMode.Scaling,
                }
            }
        ]
    });
      ```
</CodeSnippetBlock>

This results in the following behavior:

<CenteredImageWrapper
    src="/images/ChartModifiers_YAxis_XAxisDragModifier.gif"
    title="X and Y Axis Drag Modifier GIF"
/>

#### See Also

* [What is the ChartModifier API](/2d-charts/chart-modifier-api/chart-modifier-api-overview)
* [Common ChartModifiers Features](/2d-charts/chart-modifier-api/common-features)