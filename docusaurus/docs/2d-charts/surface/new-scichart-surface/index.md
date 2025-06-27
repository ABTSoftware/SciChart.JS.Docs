---
sidebar_position: 2
---

# ✅ Creating a new SciChartSurface and loading Wasm

Instantiating a new SciChartSurface (a new Chart) is accomplished with the [SciChartSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create) function. We have some variations on this function which can be used in different scenarios. We'll go through these as well as WebAssembly (wasm) file loading below.

SciChartSurface.create()
------------------------

The first function to create a chart in SciChart.js is simply [SciChartSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create). This is an **asynchronous static function** which places a SciChartSurface (a single chart with X, Y axis and one to many series) into the HTML Dom. It will also load WebAssembly files and initialise our 2D/3D WebGL engine for the first chart load.

```ts
import {SciChartSurface} from "scichart";
async function initSciChart1() {
    // Assumes a div in your HTML <div id="scichart-div-1"></div>
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");
    // Now manipulate the SciChartSurface, adding axis, series and more
    // When you exit the page and no longer want the chart to draw, call .delete() to free memory
    sciChartSurface.delete();
}
```

[**SciChartSurface.create()**:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create) **uses a single, shared WebGL context for all chart surfaces on the screen**. This bypasses the maximum number of WebGL contexts and you can have 10, 20, 30 or even 100 charts on an HTML page. The only limit is performance of the browser in rendering the chart surfaces. **For a higher performance solution which uses one WebGL context per chart, see** [**SciChartSurface.createSingle()**:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#createsingle)

:::tip
**Ensure that you await SciChartSurface.create().** The return type is an object containing SciChartSurface and its wasmContext (WebAssembly Context) which must be passed to other chart parts on this SciChartSurface.
:::

SciChartSurface.createSingle()
------------------------------

[SciChartSurface.createSingle():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#createsingle) is also an asynchronous static function which places a SciChartSurface into the DOM. However, this variation forces one WebGL context per chart. This can improve performance in multi-chart scenarios but you must obey the WebGL Context Limits per browser. More on this in our [Performance Tips](/docs/2d-charts/performance-tips/performance-tips-and-tricks) article.


```ts
import {SciChartSurface} from "scichart";
async function initSciChart1() {
    // Assumes a div in your HTML <div id="scichart-div-1"></div>
    const { sciChartSurface, wasmContext } = await SciChartSurface.createSingle("scichart-div-id");
    // Now manipulate the SciChartSurface, adding axis, series and more
    // When you exit the page and no longer want the chart to draw, call .delete() to free memory
    sciChartSurface.delete();
}
```

### Resolving Wasm errors on load

If you get an error when loading a SciChartSurface as follows:

:::warning
**Error**: Could not load SciChart WebAssembly module. Check your build process and ensure that your scichart2d.wasm, scichart2d.data and scichart2d.js files are from the same version
:::

Please see our related article [Deploying Wasm or WebAssembly Data Files with your app](/docs/2d-charts/surface/deploying-wasm)

#### See Also

* [Setting a Runtime License on a SciChartSurface](/docs/2d-charts/surface/runtime-license)
* [The SciChartSurface Type](/docs/2d-charts/surface/scichart-surface-type-overview)

#### JS Webpack npm Tutorials

[Tutorial 01 - Setting up a npm Project with SciChart.js](/docs/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js)
