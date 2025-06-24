---
sidebar_position: 6
---

# ✅ XAxisDragModifier

SciChart.js provides an zooming / panning behavior when dragging the Axis via the [XAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xaxisdragmodifier.html), available out of the box.

Besides common features which are inherited from the [ChartModifierBase](../../common-features/) class, the [XAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xaxisdragmodifier.html) allows you to choose panning or scaling via the [dragMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html#dragmode) property.

Adding a XAxisDragModifier to a Chart
-------------------------------------

A [XAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xaxisdragmodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable scaling or panning behavior. For example:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {5} showLineNumbers
    import { XAxisDragModifier, EDragMode } from "scichart";

    // Add XAxis Drag behavior
    sciChartSurface.chartModifiers.add(
        new XAxisDragModifier({
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

* [What is the ChartModifier API](../../chart-modifier-api-overview/)
* [Common ChartModifiers Features](../../common-features/)