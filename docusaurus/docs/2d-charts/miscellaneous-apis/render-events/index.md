---
sidebar_position: 5
---

# ✅ Render Events

A surface instance exposes several [EventHandlers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/eventhandler.html) that correspond to different stages in the chart rendering cycle.

:::info
Before comparing render events, it's important to understand the following:

1. There are two types of charts:

- with a **shared WASM context** – Multiple charts share the same WebGL context. They are rendered on a single WebGL canvas and then copied sequentially to separate 2D canvases.
- with an **individual WASM context** – Each chart has its own WebGL canvas and is rendered independently.

2. The **SubCharts API** allows rendering multiple smaller charts on a single canvas simultaneously.

---

For more information, check out these pages:

- [SciChartSurface.create() vs. createSingle()](/docs/2d-charts/surface/new-scichart-surface)
- [SciChart3DSurface.create() vs. createSingle()](/docs/3d-charts/scichart-3d-basics/scichart-3d-surface-create-and-create-single)
- [SubCharts API](/docs/2d-charts/subcharts-api/subcharts-api-overview)  
  :::

Below is a list of render process event handlers, in the order they occur:

- [**preRenderAll** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#prerenderall)  
  Triggered on the main surface before the render loop begins.  
  Use it to apply custom configurations, such as styling or visible range changes.  
  This event is **only** called on the main surface and does **not** apply to sub-charts.

- [**preRender** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#prerender)  
  Triggered on a surface or sub-surface before rendering.  
  Use it to apply logic for layout adjustments, such as the visible range aspect ratio or `PointMarker` size.

- [**layoutMeasured** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#layoutmeasured)  
  Triggered during rendering when the visible range, size, and axis positions are measured.  
  Use this event to hook into the rendering process when logic depends on coordinates or offsets.

- [**rendered** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#rendered)  
  Triggered after the render logic has been executed on a surface or sub-surface.

- [**renderedToWebGL** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#renderedtowebgl)  
  Triggered on the main surface after rendering is completed.  
  Use this to apply custom WebGL canvas drawing.

- [**renderedToDestination** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#renderedtodestination)  
  Triggered on the main surface after rendering is completed and the image is transferred to the target canvas.  
  Use this to apply custom drawing on the 2D canvas.

- [**painted** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#painted)  
  Triggered on the main surface after the frame has been committed by the client environment.  
  This event is useful for confirming the chart was drawn, for example, before exporting it as an image.

:::tip
Use `preRenderAll` and `renderedToDestination` to measure chart render performance.
:::

<!-- TODO: Add usage examples -->
