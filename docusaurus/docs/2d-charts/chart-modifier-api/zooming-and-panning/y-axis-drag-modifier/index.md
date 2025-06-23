---
sidebar_position: 5
---

# YAxisDragModifier

SciChart.js provides an zooming / panning behavior when dragging the Axis via the [YAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html), available out of the box.

Besides common features which are inherited from the [ChartModifierBase](Common ChartModifiers Features.html) class, the [YAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html) allows you to choose panning or scaling via the [dragMode property:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html#dragmode).

Adding a YAxisDragModifier to a Chart
-------------------------------------

A [YAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable scaling or panning behavior. For example:

Copy Code

```ts
// Create a SciChartSurface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

// Add YAxis Drag behavior
sciChartSurface.chartModifiers.add(new YAxisDragModifier({
    dragMode: EDragMode.Scaling,
}));
```

This results in the following behavior:

![](/images/ChartModifiers_YAxis_XAxisDragModifier.gif)

See Also

#### ChartModifier APIs

[What is the ChartModifier API](What is the ChartModifier API.html)

[Common ChartModifiers Features](Common ChartModifiers Features.html)