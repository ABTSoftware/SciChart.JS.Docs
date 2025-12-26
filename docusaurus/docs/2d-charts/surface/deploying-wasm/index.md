---
sidebar_position: 4
---

# Deploying Wasm (WebAssembly) with your app

In v5 SIMD support has been introduced which requires serving two wasm files for 2D (`scichart2d.wasm`, `scichart2d-nosimd.wasm`) and two for 3D (`scichart3d.wasm`, `scichart3d-nosimd.wasm`). [Read more about SIMD here](/2d-charts/surface/deploying-wasm/#simd-support).

If you receive an error message when running your app, you may not have deployed the Wasm (WebAssembly) or data files correctly. Below are some steps on how to resolve that.

:::warning
**Error**: Could not load SciChart WebAssembly module. Check your build process and ensure that your scichart2d.wasm, scichart2d-nosimd.wasm and scichart2d.js are from the same version
:::

### Option 1: Package Wasm Files with Webpack (or similar) 

In our tutorials and boilerplate examples we show you how to package the Wasm files to load them in a variety of JavaScript frameworks including React, Angular, Vue, Vite, Electron, Tauri, Svelte, Blazor, Next, Nuxt and more.
Find the links to setting up a JavaScript project below:

| JS Project Framework                         | Boilerplate Project or Setup Instructions |
|----------------------------------------------|-------------------------------------------|
| npm / webpack                                | [Tutorial - Setting up a project with Webpack](/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js/) |
| Vanilla Javascript CDN (no npm, webpack)     | [Tutorial - Including index.min.js and wasm files using CDN](/get-started/tutorials-cdn/tutorial-01-using-cdn/) |
| Vanilla Javascript offline (no npm, webpack) | [Tutorial - Including index.min.js and wasm files offline](/get-started/tutorials-cdn/tutorial-02-offline/) |
| React (scichart-react)                       | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/scichart-react) |
| vue.js                                       | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/vue) |
| svelte-vite                                  | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/svelte-vite) |
| svelte-rollup                                | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/svelte-rollup) |
| react-vite                                   | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/react-vite) |
| nextjs                                       | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/next) |
| Nuxt.js                                      | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/nuxt) |
| Angular                                      | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/angular) |
| Angular (scichart-angular)                   | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/scichart-angular) |
| blazor via JS Interop                        | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/blazor) |
| Electron                                     | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/electron) |
| Tauri React Vite                             | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/tauri-vite-react) |
| Tauri Javascript Vite                        | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/tauri-vite-vanilla) |
| Web components                               | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates/web-components) |

:::info
The above projects have been updated for SciChart.js v5, which has only a *.wasm files to serve.
SciChart.js v3.x had *.wasm and *.data files. For version 3.x see the boilerplates folder in the [dev_v3.5](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v3.5/BoilerPlates) branch, for version 4.x in the [dev_v4.0](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v4.0/BoilerPlates)
:::
:::tip
See more boilerplate examples for JavaScript frameworks at our Github repository: [github.com/abtsoftware/scichart.js.examples](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/Sandbox) under the Boilerplates folder  
:::

### Option 2: Load Wasm from URL with SciChartSurface.configure() or useWasmFromCDN()

The easiest way for SciChart.js to load WebAssembly files is to load them from our CDN (see [jsdelivr.com/package/npm/scichart](https://www.jsdelivr.com/package/npm/scichart)). This method is particularly useful in projects or frameworks that don't have a package manager or module bundler.

To do load SciChart's Wasm files from CDN, call [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#configure) once before any SciChartSurface is shown:

**Configure Wasm File URLs**

```ts
import { SciChartSurface, libraryVersion } from "scichart";
// Load Wasm from URL
// This URL can be anything, but for example purposes we are loading from JSDelivr CDN
SciChartSurface.configure({
   wasmUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d.wasm`,
   wasmNoSimdUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d-nosimd.wasm`
});
```

:::tip
If wasmNoSimdUrl is not specified it will search scichart2d-nosimd.wasm next to scichart2d.wasm
:::

We've packaged a helpful function that automatically loads the latest & correct version of SciChart's Wasm files from CDN. To use this, instead of calling [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#configure) passing in a URL, call [SciChartSurface.useWasmFromCDN():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#usewasmfromcdn).

**Load Wasm from CDN**

```ts
import { SciChartSurface } from "scichart";

export async function initSciChart() {
    // Call this once before any SciChartSurface is shown.
    // This is equivalent to calling SciChartSurface.configure() with the CDN URL (JSDelivr)
    SciChartSurface.useWasmFromCDN();
}
```

Loading Wasm files offline
--------------------------

If your application must load wasm files offline (does not have an internet connection), you can download the files and serve them and use [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#configure) to fetch the local file.

To find out how to do this, see [Tutorial 02 - Including index.min.js and WebAssembly Files offline](/get-started/tutorials-cdn/tutorial-02-offline/).

Loading Wasm for 3D Charts
--------------------------

The process for loading Wasm files for 3D Charts is exactly the same, except you must configure SciChart.js to load scichart3d.wasm.

This can be done via Webpack/npm or a bundlers, or by calling [SciChart3DSurface.useWasmFromCDN():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichart3dsurface.html#usewasmfromcdn) or [SciChart3DSurface.configure():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichart3dsurface.html#configure) as before.

**Configure Wasm File URLs**

```ts
import { SciChartSurface } from "scichart";

// Call this once before any SciChart3DSurface is shown to load wasm from CDN
SciChart3DSurface.useWasmFromCDN();
// Alternatively, if you want to host wasm files and serve them locally
// 1.) Ensure you are serving your wasm files
// 2.) Call to SciChart3DSurface.configure specifying the relative URL of the files
SciChart3DSurface.configure({
   wasmUrl: `relative/path/to/scichart3d.wasm`,
   wasmNoSimdUrl: `relative/path/to/scichart3d-nosimd.wasm`,
});
```


## SIMD support

:::info
In version 5 we introduced SIMD (Single Instruction, Multiple Data) support. 
SIMD is a parallel processing technique where a single instruction operates on multiple data elements simultaneously. It's a form of data-level parallelism used to accelerate computations in applications like multimedia processing, scientific computing, and machine learning.
:::

In order to support this feature it is required to copy 2 wasm files one with SIMD support `scichart2d.wasm` and another without it `scichart2d-nosimd.wasm`, and similar for 3D `scichart3d.wasm` and `scichart3d-nosimd.wasm`.

**Webpack config example**

```js
const config: Configuration = {
    entry: "./src/index.tsx",
    mode: "production",
    ...
    plugins: [
        ...
        new CopyPlugin({
            patterns: [
                { from: "src/static/", to: "" },
                { from: "../src/_wasm/scichart2d.wasm", to: "" },
                { from: "../src/_wasm/scichart2d-nosimd.wasm", to: "" },
                { from: "../src/_wasm/scichart3d.wasm", to: "" },
                { from: "../src/_wasm/scichart3d-nosimd.wasm", to: "" }
            ]
        })
    ]
};
```

**SIMD settings**

It is also possible to use only one file SIMD or NO-SIMD, in this case updating `SciChartDefaults.useWasmSimd` setting is required.

`SciChartDefaults.useWasmSimd` defines how WebAssembly SIMD should be used by SciChart. Defaults to Auto.
- Always: Always use SIMD-enabled binaries (you must serve scichart2d.wasm, scichart3d.wasm)
- Never: Never use SIMD, always use fallback binaries (you must serve scichart2d-nosimd.wasm, scichart3d-nosimd.wasm)
- Auto: Automatically detect SIMD support and choose appropriate binary (you must serve both variants)
