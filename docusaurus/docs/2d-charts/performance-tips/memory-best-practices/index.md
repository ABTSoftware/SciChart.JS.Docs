---
sidebar_position: 2
---

# Memory Best Practices

Related to [Performance Tips](/2d-charts/performance-tips/performance-tips-and-tricks/index.md), this article covers Memory Best Practices in SciChart.js.

Wasm Memory vs. JavaScript Memory Model
---------------------------------------

SciChart.js uses WebAssembly, also known as Wasm, to achieve high performance 2D/3D chart rendering in the browser. Using Wasm, we've compiled our in-house C++ codebase, tested in enterprise and embedded environments for many years on Windows and mobile into a JavaScript friendly library.

A key difference between Wasm and JavaScript is that JS has a garbage collector and Wasm does not. Any type created in WebAssembly must be expliclty deleted to reclaim memory. Below we have some guidelines on how to do that, and what to do to detect problems.

:::tip
Failure to call .delete() on a WebAssembly type can result in a memory leak. But don't worry, we have [memory debugging tools](/2d-charts/performance-tips/memory-best-practices/index.md) to help track that.
:::

### Deletable Entities in SciChart.js

A number of types in SciChart.js implement the [IDeletable:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html) interface. This has a single function: **[.delete():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html#delete)** which deletes underlying WebAssembly memory.

The following types implement IDeletable in SciChart.js:

*   **SciChartSurface**
*   **SciChart3DSurface**
*   Axis types e.g **NumericAxis**, **CategoryAxis**
*   Series types e.g. **FastLineRenderableSeries**
*   DataSeries types e.g. **XyDataSeries**
*   Annotations e.g. **LineAnnotation**
*   Miscellaneous types e.g. **EllipsePointMarker**

When calling delete on a parent, all child items are deleted so to properly clean-up an entire chart, you must only call [sciChartSurface.delete():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#delete) once. The best place to do this is component unmount in React, Vue or onDestroy in Angular.

Best Practices to call .delete()
--------------------------------

### Deleting Charts on Component Unmount

Deleting a ScIChartSurface by calling [sciChartSurface.delete():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#delete) once on component unmount will cascade down to all child objects such as DataSeries, Annotations and RenderableSeries.

:::tip
React, Vue and Angular all have component unmount or onDestroy callbacks. In our React, Vue and Angular boilerplates at [scichart.com/getting-started-scichart-js](https://www.scichart.com/getting-started/scichart-javascript/) we show you how to do this. We've also created a [Tutorial for Creating a Reusable React Component](/get-started/tutorials-react/tutorial-01-setting-up-project-with-scichart-react/index.md) showing you how to correctly delete the chart on unmount.
:::

### Deleting DataSeries memory

If you remove or re-assign a DataSeries from a chart (use case: adding or removing chart series), don't forget to call [series.delete():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html#delete). This frees WebAssembly native memory and releases it back to the browser.

For some examples of how to do this, see the article [Deleting DataSeries Memory](/2d-charts/chart-types/data-series-api/deleting-memory/index.md).

### Deleting RendeableSeries, Annotations or Modifiers

RenderableSeries, Annotations and Axis must also be deleted in the case where you remove, or reassign series on a chart. Some code examples of how to do this can also be seen in the page [Deleting DataSeries Memory](/2d-charts/chart-types/data-series-api/deleting-memory/index.md).

### Detecting Leaks by forgetting to call .delete()

Suspect a memory leak? If you forget to call .delete(), don't worry! We have a set of tools to detect memory leaks and inform you of which objects need to be properly cleaned up. See the article [Memory Leak Debugging](/2d-charts/performance-tips/memory-leak-debugging/index.md) for more info.

Other Memory Optimisations / Footnotes
--------------------------------------

### Memory Differences between create() and createSingle()

There are two factory functions to create a chart: [SciChartSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create) and [SciChartSurface.createSingle():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#createsingle).

*   When [SciChartSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create) is called, a single shared instance of our WebGL graphics engine is instantiated with a single one-time memory cost.
*   When [SciChartSurface.createSingle():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#createsingle) is called, one instance of our WebGL engine is instantiated per-chart, which uses additional RAM per chart.

Therefore,

*   Charts created with **create()** have lower memory usage but marginally slower drawing performance.
*   Charts created with **createSingle()** have higher memory usage but faster drawing performance. They are also subject to WebGL context limits [specified here](/2d-charts/performance-tips/performance-tips-and-tricks).

### Completely Releasing Memory back to the OS

When deleting charts created with [SciChartSurface.createSingle():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#createsingle), and when the last reference to sciChartSurface falls out of scope, the JavaScript Garbage Collector releases all memory held by WebAssembly and JavaScript for this chart back to the host OS.

When deleting charts created with [SciChartSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create), and when the last reference to all SciChartSurfaces fall out of scope, the JavaScript Garbage Collector will release all JS/Wasm memory only if the following flag is set.

```ts
// Set static properties to define memory cleanup behaviour after the last chart is garbage collected
SciChartSurface.autoDisposeWasmContext = true; // default false
SciChartSurface.wasmContextDisposeTimeout = 100; // default 0 mlliseconds
```

This default behaviour is there to avoid unintential garbage collection and re-instanitation of our WebGL engine on switching page in a Single Page Application. Setting [SciChartSurface.autoDisposeWasmContext:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#autodisposewasmcontext) to true and a suitable non-zero timeout gives SPA apps change to switch page before automatically cleaning up WebAssembly memory.

#### Summary of Options to Force Wasm Context disposal

The Wasm engine can be disposed in several ways to release memory back to the host OS.

*   for charts instantiated with [SciChartSurface.createSingle():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#createsingle) wasmContext is destroyed automatically upon surface deletion and nullifying all of the references to the SciChartSurface/wasmContext.
*   for charts instantiated with [SciChartSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create) wasmContext is not destroyed automatically by default; to destroy it
    *   call [SciChartSurface.disposeSharedWasmContext():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#disposesharedwasmcontext)
    *   or enable auto disposal after a specified timeout using [SciChartSurface.autoDisposeWasmContext:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#autodisposewasmcontext) flag and [SciChartSurface.wasmContextDisposeTimeout:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#wasmcontextdisposetimeout) property.

### Setting WebGL Buffer Sizes

We're into esoteric memory improvements here, but this small optimisation is worth mentioning.

If you are operating in an extremely memory constrained environment and every megabyte counts, you can trade drawing performance for lower memory by adjusting maximum WebGL buffer size. To do this, set [SciChartDefaults.wasmBufferSizesKb:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartdefaults.html#wasmbuffersizeskb) once in your app before showing a chart.

```ts
// Specifies the maximum buffer size to use PER PRIMITIVE TYPE
// If all chart types are shown in application, theoretical maximum = 8 x wasmBufferSizesKb
SciChartDefaults.wasmBufferSizesKb = 1024;

// minimum = 1024 kb
// default = 8192 kb
// maximum = 32,768 kb
```

### Debugging Memory Leaks when using SciChart.js

We've created a set of tools and a guide on how to debug and eliminate memory leaks in your application when using SciChart.js. Find out more at [Memory Leak Debugging](/2d-charts/performance-tips/memory-leak-debugging/index.md).

### Best Practies when using SciChart.js in React Components

Additional guidelines on the best practices including memory cleanup when using SciChart.js in React Components can be found at the page [Tutorial - Creating a Reusable React Component](/get-started/tutorials-react/tutorial-01-setting-up-project-with-scichart-react/index.md).
