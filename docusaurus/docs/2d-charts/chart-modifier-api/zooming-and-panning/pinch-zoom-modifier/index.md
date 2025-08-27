---
sidebar_position: 3
---

# PinchZoomModifier

SciChart.js provides Pinch zooming on touch devices via the [PinchZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/pinchzoommodifier.html) type.

:::tip
As of SciChart.js v3.2, **ZoomPanModifier** now inherits **PinchZoomModifier**, allowing you to configure zooming, panning and touch-to-zoom interaction via a single modifier.
:::

Adding a PinchZoomModifier to a Chart
-------------------------------------

A **PinchZoomModifier** may be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#chartmodifiers) colletion to enable pinch to zoom behaviour. For example:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {11} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
    ```ts {8} showLineNumbers file=./demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet name="demo" />

Additional Properties
---------------------

### Adjust Zooming / Scale Factor

Horizontal and vertical zoom scale factor can be adjusted via the following properties:
- [PinchZoomModifier.horizontalGrowFactor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pinchzoommodifier.html#horizontalgrowfactor)
- [PinchZoomModifier.verticalGrowFactor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pinchzoommodifier.html#verticalgrowfactor)

The default value for both is set to `0.005`.

### Allow Pinch Zoom in only one direction

If you want to enable pinch zooming in only one direction, e.g. horizontal only, modify the **PinchZoomModifier.verticalGrowFactor** to equal `0`.

### Include/Exclude Certain Axis from Pinch Zoom

The PinchZoomModifier allows you to include or exclude certain axis by axis.id from the zoom operation.

By default all axis are included, to exclude one or more X or Y axis, set the following property:

<CodeSnippetBlock labels={["Exclude Axis"]}>
    ```ts showLineNumbers
    // Exclude a specific axis from the pinch zoom operation
    pinchZoomModifier.includeXAxis(axisXInstance, false);
    pinchZoomModifier.includeYAxis(axisYInstance, false);

    // Include specific axis from the pinch zoom operation
    pinchZoomModifier.includeXAxis(axisXInstance, true);
    pinchZoomModifier.includeYAxis(axisYInstance, true);

    // Reset flags
    pinchZoomModifier.includeAllAxes();
    ```
</CodeSnippetBlock>

### Allow Pinch Zoom in only one direction

If you want to enable pinch zooming in only one direction, e.g. horizontal only, modify the **PinchZoomModifier.verticalGrowFactor** to equal `0`.
