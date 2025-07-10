---
sidebar_position: 5
---

# YAxisDragModifier

SciChart.js provides an zooming / panning behavior when dragging the Axis via the [YAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html), available out of the box.

Besides common features which are inherited from the [ChartModifierBase](/docs/2d-charts/chart-modifier-api/common-features) class, the [YAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html) allows you to choose panning or scaling via the [dragMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html#dragmode) property.

Adding a YAxisDragModifier to a Chart
-------------------------------------

A [YAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable scaling or panning behavior. For example:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {5} showLineNumbers
    import { YAxisDragModifier, EDragMode } from "scichart";

    // Add YAxis Drag behavior
    sciChartSurface.chartModifiers.add(
        new YAxisDragModifier({
            dragMode: EDragMode.Scaling,
        })
    );
    ```
</CodeSnippetBlock>

This results in the following behavior:

<CenteredImageWrapper
    src="/images/ChartModifiers_YAxis_XAxisDragModifier.gif"
    title="X and Y Axis Drag Modifier GIF"
/>

#### See Also

* [What is the ChartModifier API](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview)
* [Common ChartModifiers Features](/docs/2d-charts/chart-modifier-api/common-features)