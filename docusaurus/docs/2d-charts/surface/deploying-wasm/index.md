---
sidebar_position: 4
---

# Deploying Wasm (WebAssembly) with your app

SciChart.js runs its chart engine in WebAssembly, so those binaries must be served by your app alongside your JavaScript bundle.

In v6 there is **one wasm payload: the `_wasm` directory**. The separate 2D and 3D binaries of v5 (`scichart2d.wasm`, `scichart3d.wasm`) no longer exist — a single module carries both engines, and it is split into a core plus side modules that are fetched at runtime. Everything servable lives in `node_modules/scichart/_wasm/`, so deployment is one directory copy that never needs updating when a variant or module is added.

| Files | Role |
|---|---|
| `scichart.wasm`, `scichart-nosimd.wasm`, `scichart-64.wasm` | The engine cores. Exactly one is fetched, chosen by browser capability |
| `scichart-data{,-nosimd,-64}.wasm` | The `data` module — the native data-series layer, loaded with every chart |
| `scichart-charting3d{,-nosimd,-64}.wasm` | The `charting3d` module — the 3D engine, fetched lazily at the first `SciChart3DSurface` |

The SIMD files carry no suffix, `-nosimd` is the fallback for browsers without wasm SIMD, and `-64` is the optional [64-bit (Memory64) build](/2d-charts/surface/larger-datasets-with-wasm64/). Serve the whole directory and none of the variants can be missing.

If you receive an error message when running your app, you may not have deployed the Wasm files correctly. Below are some steps on how to resolve that.

:::warning
**Error**: Could not load SciChart WebAssembly module. Check your build process and ensure that your "scichart.wasm" and "scichart.js" files are from the same version.
:::

:::warning
**Error**: SciChart: could not fetch the "charting3d" wasm module from *&lt;url&gt;*

A side module is missing from what you serve. Because `charting3d` is fetched lazily, this can surface arbitrarily far into a session — at the first 3D chart. Copy the whole `_wasm` directory rather than individual files and this cannot happen.
:::

### Option 1: Package Wasm Files with Webpack (or similar) 

In our tutorials and boilerplate examples we show you how to package the Wasm files to load them in a variety of JavaScript frameworks including React, Angular, Vue, Vite, Electron, Tauri, Svelte, Blazor, Next, Nuxt and more.
Find the links to setting up a JavaScript project below:

| JS Project Framework                         | Boilerplate Project or Setup Instructions |
|----------------------------------------------|-------------------------------------------|
| npm / webpack                                | [Tutorial - Setting up a project with Webpack](/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js/) |
| Vanilla Javascript CDN (no npm, webpack)     | [Tutorial - Including index.min.js and wasm files using CDN](/get-started/tutorials-cdn/tutorial-01-using-cdn/) |
| Vanilla Javascript offline (no npm, webpack) | [Tutorial - Including index.min.js and wasm files offline](/get-started/tutorials-cdn/tutorial-02-offline/) |
| React (scichart-react)                       | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/scichart-react) |
| vue.js                                       | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/vue) |
| svelte-vite                                  | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/svelte-vite) |
| svelte-rollup                                | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/svelte-rollup) |
| react-vite                                   | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/react-vite) |
| nextjs                                       | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/next) |
| Nuxt.js                                      | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/nuxt) |
| Angular                                      | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/angular) |
| Angular (scichart-angular)                   | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/scichart-angular) |
| blazor via JS Interop                        | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/blazor) |
| Electron                                     | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/electron) |
| Tauri React Vite                             | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/tauri-vite-react) |
| Tauri Javascript Vite                        | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/tauri-vite-vanilla) |
| Web components                               | [code sample](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates/web-components) |

**Webpack config example**

Copy the directory, not individual files:

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
                { from: "node_modules/scichart/_wasm/", to: "" }
            ]
        })
    ]
};
```

:::info
The above projects have been updated for SciChart.js v6, which serves the `_wasm` directory.
SciChart.js v5 served `scichart2d.wasm` / `scichart3d.wasm` and their `-nosimd` siblings; for version 5.x see the boilerplates folder in the [dev_v5.x](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/BoilerPlates) branch. SciChart.js v3.x also had `*.data` files — see [dev_v3.5](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v3.5/BoilerPlates) and [dev_v4.0](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v4.0/BoilerPlates).
:::
:::tip
See more boilerplate examples for JavaScript frameworks at our Github repository: [github.com/abtsoftware/scichart.js.examples](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/BoilerPlates) under the Boilerplates folder  
:::

### Option 2: Load Wasm from URL with SciChartSurface.configure() or loadWasmFromCDN()

The easiest way for SciChart.js to load WebAssembly files is to load them from our CDN (see [jsdelivr.com/package/npm/scichart](https://www.jsdelivr.com/package/npm/scichart)). This method is particularly useful in projects or frameworks that don't have a package manager or module bundler.

To load SciChart's Wasm files from CDN, call [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#configure) once before any SciChartSurface is shown:

**Configure Wasm File URLs**

```ts
import { SciChartSurface, libraryVersion } from "scichart";
// Load Wasm from URL
// This URL can be anything, but for example purposes we are loading from JSDelivr CDN
SciChartSurface.configure({
   wasmUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart.wasm`,
   wasmNoSimdUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart-nosimd.wasm`
});
```

:::tip
You only need to name the core. Every other file — `scichart-nosimd.wasm`, `scichart-64.wasm` and the side modules — is resolved as a sibling of `wasmUrl` under its canonical name, which is why one directory copy is enough. Pass `modulesUrl` if you must serve the side modules from somewhere other than beside the core.
:::

We've packaged a helpful function that automatically loads the latest & correct version of SciChart's Wasm files from CDN. To use this, instead of calling [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#configure) passing in a URL, call [SciChartSurface.loadWasmFromCDN():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#loadwasmfromcdn).

**Load Wasm from CDN**

```ts
import { SciChartSurface } from "scichart";

export async function initSciChart() {
    // Call this once before any SciChartSurface is shown.
    // This is equivalent to calling SciChartSurface.configure() with the CDN URL (JSDelivr)
    SciChartSurface.loadWasmFromCDN();
}
```

:::note
`SciChartSurface.useWasmFromCDN()` still works and does the same thing, but the name breaks the eslint `react-hooks/rules-of-hooks` rule in React apps, so `loadWasmFromCDN()` is preferred.
:::

Loading Wasm files offline
--------------------------

If your application must load wasm files offline (does not have an internet connection), you can download the files and serve them and use [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#configure) to fetch the local file.

To find out how to do this, see [Tutorial 02 - Including index.min.js and WebAssembly Files offline](/get-started/tutorials-cdn/tutorial-02-offline/).

Loading Wasm for 3D Charts
--------------------------

3D charts need no separate configuration in v6. One module carries both engines, so the `SciChartSurface` call you already make configures 3D as well, and the `charting3d` side module is fetched from the same directory at the first 3D chart.

```ts
import { SciChartSurface } from "scichart";

// Configures the shared wasm module for BOTH 2D and 3D charts
SciChartSurface.configure({ wasmUrl: `relative/path/to/scichart.wasm` });
```

:::warning
Do **not** also call `SciChart3DSurface.configure()`. The 3D wasm-loading statics (`configure`, `useWasmFromCDN`, `loadWasmFromCDN`, `loadWasmLocal`) still exist as deprecated forwards onto their `SciChartSurface` equivalents, so the v5 two-call pattern still compiles — but the second call now **overwrites** the first, and your 2D charts will try to fetch the 3D URL. Delete the 3D call.
:::

```ts
// v5 pattern - in v6 the second call clobbers the first
SciChartSurface.configure({ wasmUrl: "/scichart2d.wasm" });
SciChart3DSurface.configure({ wasmUrl: "/scichart3d.wasm" }); // ← remove this
```

See [the migration notes](/whats-new/breaking-changes-v5.2-v6.0/#scichart3dsurface-wasm-engine-api-deprecated--use-the-2d-statics-for-both-engines) for the full list of deprecated 3D statics and their replacements.

## SIMD support

:::info
In version 5 we introduced SIMD (Single Instruction, Multiple Data) support. 
SIMD is a parallel processing technique where a single instruction operates on multiple data elements simultaneously. It's a form of data-level parallelism used to accelerate computations in applications like multimedia processing, scientific computing, and machine learning.
:::

Supporting this means serving a SIMD and a no-SIMD copy of the core and of every side module — `scichart.wasm` and `scichart-nosimd.wasm`, `scichart-data.wasm` and `scichart-data-nosimd.wasm`, and so on. Copying the `_wasm` directory covers all of them, which is why that is the recommended copy step above.

**SIMD settings**

It is also possible to serve only the SIMD or only the no-SIMD variant, in which case updating the `SciChartDefaults.useWasmSimd` setting is required.

`SciChartDefaults.useWasmSimd` defines how WebAssembly SIMD should be used by SciChart. Defaults to Auto.
- Always: Always use SIMD-enabled binaries (you must serve `scichart.wasm` and the unsuffixed modules)
- Never: Never use SIMD, always use fallback binaries (you must serve `scichart-nosimd.wasm` and the `-nosimd` modules)
- Auto: Automatically detect SIMD support and choose appropriate binary (you must serve both variants)

The same applies to the 64-bit build through `SciChartDefaults.useWasm64` — see [Larger Datasets with 64-bit WebAssembly](/2d-charts/surface/larger-datasets-with-wasm64/).
