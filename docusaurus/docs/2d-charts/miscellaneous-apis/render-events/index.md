---
sidebar_position: 5
---

# Render Events

A surface instance exposes several [EventHandlers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/eventhandler.html) corresponding to different stages of the chart rendering cycle.

:::info
Before comparing render events, it's important to understand the following:

1. There are two types of charts:

- with a **shared WASM context** – Multiple charts share the same WebGL context. They render on a single WebGL canvas and are then copied sequentially to separate 2D canvases.
- with an **individual WASM context** – Each chart has its own WebGL canvas and renders independently.

2. The **SubCharts API** enables rendering multiple smaller charts simultaneously on a single canvas.

---

For more details, check out these pages:

- [SciChartSurface.create() vs. createSingle()](/2d-charts/surface/new-scichart-surface)
- [SciChart3DSurface.create() vs. createSingle()](/3d-charts/scichart-3d-basics/scichart-3d-surface-create-and-create-single)
- [SubCharts API](/2d-charts/subcharts-api/subcharts-api-overview)  
:::

## Lifecycle EventHandlers List

Below is the list of render process event handlers, in the order they occur:

- [**redrawRequested** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#redrawrequested)  
  Triggered on the main surface when an initial invalidate call occurs. Subsequent invalidate calls will not trigger this event until the chart has been rendered.  
  This event is **only** fired on the main surface and does **not** apply to sub-charts.

- [**preRenderAll** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#prerenderall)  
  Triggered on the main surface before the render loop begins.  
  Use it to apply custom configurations such as styling or changes to the visible range.  
  This event is **only** fired on the main surface and does **not** apply to sub-charts.  
  It is also currently **not** applicable to 3D charts.

- [**preRender** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#prerender)  
  Triggered on a surface or sub-surface before rendering.  
  Use it to apply logic for layout adjustments, such as modifying the visible range aspect ratio or `PointMarker` size.

- [**layoutMeasured** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#layoutmeasured)  
  Triggered during rendering when the visible range, size, and axis positions are measured.  
  Use this event to hook into the rendering process when your logic depends on coordinates or offsets.

- [**rendered** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#rendered)  
  Triggered after the render logic has executed on a surface or sub-surface.

- [**renderedToWebGL** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#renderedtowebgl)  
  Triggered on the main surface after rendering completes.  
  Use this to add custom drawing on the WebGL canvas.

- [**renderedToDestination** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurfacebase.html#renderedtodestination)  
  Triggered on the main surface after rendering completes and the image is transferred to the target canvas.  
  Use this to add custom drawing on the 2D canvas.

- [**painted** :blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#painted)  
  Triggered on the main surface after the frame has been committed by the client environment.  
  This event is useful for confirming that the chart was drawn, for example, before exporting it as an image.

:::tip
Use `preRenderAll` and `renderedToDestination` to measure chart render performance.  
See [Performance Measurement](#performance-measurement).
:::

## Helper Functions

The library provides a helper function  
[receiveNextEvent:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#receivenextevent) to promisify a single event occurrence.

Additionally, a surface exposes a [nextStateRender:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#nextstaterender) method,  
which works similarly to `receiveNextEvent`, but subscribes only to `renderedToDestination` and allows passing options to control the [Suspend Updates API](/2d-charts/miscellaneous-apis/batching-updates-or-temporary-suspending-drawing).

## Usage Examples

### Ensuring the frame was drawn

When exporting images or performing visual tests, you often need to ensure that the chart has rendered and any animations have completed.

The following example demonstrates how to guarantee that any logic invalidating the chart during the render loop has finished and the chart is stable (i.e., not requested to redraw).

<CodeSnippetBlock>
    ```ts showLineNumbers file=./ChartReadiness/demo.ts start=#region_A_start end=#region_A_end
    
    ```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./ChartReadiness/demo" />

<!-- ### Size Adjustment. Point Markers. Text. Texture -->

<!-- <LiveDocSnippet maxWidth={"100%"} name="./SizeAdjustments/demo" /> -->

<!-- ### Visible Range Fixed Aspect Ratio

// TODO -->

<!-- ### Custom Rendering on 2D Canvas

You can add custom drawing logic to the render loop.  
One of the approaches is to draw directly on the 2D canvas context.

<CodeSnippetBlock>
    ```ts showLineNumbers file=./CustomRendering/demo.ts start=#region_A_start end=#region_A_end
    
    ```
</CodeSnippetBlock>

Where the canvas texture is defined as follows:

<CodeSnippetBlock>
    ```ts showLineNumbers file=./CustomRendering/demo.ts start=#region_B_start end=#region_B_end
    
    ```
    ```js showLineNumbers file=./CustomRendering/demo.js start=#region_B_start end=#region_B_end
    
    ```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./CustomRendering/demo" /> -->

### Performance Measurement

Lifecycle events can be used to measure chart performance.  
To measure frame render time, use `preRenderAll` and `renderedToDestination`.  
Other events may also be useful.

:::note
It’s recommended to initialize a chart with `createSuspended: true` to ensure rendering doesn’t start before the `create` function completes.
:::

Here is an example demonstrating how to set up rendering performance measurement.  
It outputs results to the console.

:::note
For thorough performance analysis, consider measuring other operations (such as data append/update times).
You can also check out [Performance and Memory Usage test suites](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Tutorials/MemoryTests).
:::

<CodeSnippetBlock>
    ```ts showLineNumbers file=./PerformanceMeasurement/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```js showLineNumbers file=./PerformanceMeasurement/demo.js start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>
<LiveDocSnippet maxWidth={"100%"} name="./PerformanceMeasurement/demo" />

Additionally, this example shows an annotation displaying some rendering performance results.

The implementation:

<CodeSnippetBlock>
    ```ts showLineNumbers file=./PerformanceMeasurement/demo.ts start=#region_B_start end=#region_B_end
    ```
    ```js showLineNumbers file=./PerformanceMeasurement/demo.js start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>
