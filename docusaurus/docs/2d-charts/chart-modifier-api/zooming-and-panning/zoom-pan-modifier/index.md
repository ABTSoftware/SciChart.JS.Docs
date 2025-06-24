---
sidebar_position: 1
---

# ✅ ZoomPanModifier

SciChart.js provides an scrolling / panning behavior via the [ZoomPanModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html), available out of the box.

:::tip
As of SciChart.js v3.2, [ZoomPanModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) now inherits [PinchZoomModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pinchzoommodifier.html), allowing you to configure zooming, panning and touch-to-zoom interaction via a single modifier.

All the properties for the [PinchZoomModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pinchzoommodifier.html) may be set to control vertical/horizontal zooming, include/exclude axis from pinch zooming etc..
:::

Besides common features which are inherited from the [ChartModifierBase](../../common-features/) class, the [ZoomPanModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) allows to **restrict scrolling** to the horizontal or vertical direction only, via the [xyDirection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html#xydirection) property.

Adding a ZoomPanModifier to a Chart
-----------------------------------

A ZoomPanModifier can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable panning behavior. For example:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {5} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {11} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following behavior:

<LiveDocSnippet name="demo" />

Additional Properties
---------------------

### Allow Panning in only one direction (X or Y)

Panning can be restricted to X or Y by setting the [ZoomPanModifier.xyDirection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html#xydirection) property.

### Allow Panning on only one X/Y axis

Panning can be restricted to a single X or Y axis by setting the [ZoomPanModifier.xAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html#xaxisid) or [ZoomPanModifier.yAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html#yaxisid) properties.

### Adjust Pinch Zooming / Scale Factor

:::info
The following is inherited from **PinchZoomModifier**
::: 

Horizontal and vertical pinch zoom scale factor can be adjusted via the following properties. The default value is set to `0.005`.

*   [ZoomPanModifier.horizontalGrowFactor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html#horizontalgrowfactor)
*   [ZoomPanModifier.verticalGrowFactor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html#verticalgrowfactor)

### Include/Exclude Certain Axis from Pinch Zoom

The ZoomPanModifier allows you to include or exclude certain axis by axis.id from the pinch zoom operation.

By default all axis are included, to exclude one or more X or Y axis, set the following property:

<CodeSnippetBlock labels={["Exclude Axis"]}>
    ```ts {2-3} showLineNumbers
    // Exclude a specific axis from the pinch zoom operation
    zoomPanModifier.includeXAxis(axisXInstance, false);
    zoomPanModifier.includeYAxis(axisYInstance, false);

    // Include specific axis from the pinch zoom operation
    zoomPanModifier.includeXAxis(axisXInstance, true);
    zoomPanModifier.includeYAxis(axisYInstance, true);

    // Reset flags
    zoomPanModifier.includeAllAxes();
    ```
</CodeSnippetBlock>

### Allow Pinch Zoom in only one direction

If you want to enable pinch zooming in only one direction,  e.g. horizontal only, modify the [ZoomPanModifier.verticalGrowFactor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html#verticalgrowfactor) to equal `0`.

#### See Also

* [What is the ChartModifier API](../../chart-modifier-api-overview/)
* [Common ChartModifiers Features](../../common-features/)