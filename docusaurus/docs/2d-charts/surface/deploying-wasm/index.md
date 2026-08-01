---
sidebar_position: 4
---

# Deploying Wasm (WebAssembly) with your app

SciChart.js renders using a WebAssembly engine, so your app has to **serve the `.wasm` files as well
as your JavaScript**. Getting this wrong is the single most common setup problem, and it always shows
up the same way: the page loads, then the chart fails to appear.

From v6 there is **one wasm binary for both 2D and 3D charts**. You deploy two files:

| File | When it is used |
|---|---|
| `scichart.wasm` | The normal case. Built with SIMD. |
| `scichart-nosimd.wasm` | Fallback, fetched only on a browser without WebAssembly SIMD. |

Both come from `node_modules/scichart/_wasm/`. There is no separate 2D and 3D binary to think
about — the same file serves a `SciChartSurface` and a `SciChart3DSurface`.

:::warning
**Error**: Could not load SciChart WebAssembly module.
Check your build process and ensure that your "scichart.wasm" and "scichart.js" files are from the same version.
:::

That message means the browser could not fetch the binary, or fetched one built from a different
release than your installed `scichart` package. Check the Network tab for a 404 on `scichart.wasm`
first — a missing copy step is far more common than a version mismatch.

:::info Upgrading from v4 or v5?
Earlier versions shipped a **pair** of binaries, `scichart2d.wasm` and `scichart3d.wasm` (plus their
`-nosimd` variants). Those files no longer exist, so any copy configuration naming them will fail.
The [`scichart-migrate` tool](/whats-new/scichart-migrate/) rewrites copy configurations across every
bundler we support, and reports anything it will not change on its own.
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
The boilerplate links above are on the `dev_v5.x` branch, so their copy configurations still name the
v5 pair of binaries. The *technique* each one demonstrates is unchanged — only the filenames differ.
SciChart.js v3.x also had `*.data` files alongside the wasm; those were merged into the wasm in v4.
For version 3.x see the [dev_v3.5](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v3.5/BoilerPlates) branch, for version 4.x [dev_v4.0](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v4.0/BoilerPlates).
:::
:::tip
See more boilerplate examples for JavaScript frameworks at our Github repository: [github.com/abtsoftware/scichart.js.examples](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/Sandbox) under the Boilerplates folder
:::

### Option 2: Load Wasm from URL with SciChartSurface.configure() or loadWasmFromCDN()

The easiest way for SciChart.js to load WebAssembly files is to load them from our CDN (see [jsdelivr.com/package/npm/scichart](https://www.jsdelivr.com/package/npm/scichart)). This method is particularly useful in projects or frameworks that don't have a package manager or module bundler.

To load SciChart's Wasm files from CDN, call [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartsurface.html#configure) once before any SciChartSurface is shown:

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
If `wasmNoSimdUrl` is not specified, SciChart looks for `scichart-nosimd.wasm` next to
`scichart.wasm`. If you serve both files from the same folder you can omit it.
:::

We've packaged a helpful function that automatically loads the latest & correct version of SciChart's Wasm files from CDN. To use this, instead of calling [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartsurface.html#configure) passing in a URL, call [SciChartSurface.loadWasmFromCDN():blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartsurface.html#loadwasmfromcdn).

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
`useWasmFromCDN()` and `useWasmLocal()` still work, but are deprecated: the `use` prefix trips
eslint's [react-hooks/rules-of-hooks](https://legacy.reactjs.org/docs/hooks-rules.html) in React
projects, which reads them as hooks. Prefer `loadWasmFromCDN()` and `loadWasmLocal()`.
:::

Loading Wasm files offline
--------------------------

If your application must load wasm files offline (does not have an internet connection), you can download the files and serve them and use [SciChartSurface.configure():blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartsurface.html#configure) to fetch the local file.

To find out how to do this, see [Tutorial 02 - Including index.min.js and WebAssembly Files offline](/get-started/tutorials-cdn/tutorial-02-offline/).

Loading Wasm for 3D Charts
--------------------------

**There is nothing extra to do for 3D charts.** One binary carries both engines, so if `scichart.wasm`
is being served for your 2D charts then your 3D charts are already covered. A single
`SciChartSurface.configure()` call configures the module for both.

```ts
import { SciChartSurface } from "scichart";

// Configures the wasm module used by SciChartSurface *and* SciChart3DSurface
SciChartSurface.configure({
   wasmUrl: `relative/path/to/scichart.wasm`,
   wasmNoSimdUrl: `relative/path/to/scichart-nosimd.wasm`
});
```

:::danger Do not configure the engines separately
Up to v5, 3D had its own statics and the documented pattern was to call both:

```js
SciChartSurface.configure({ wasmUrl: "/scichart2d.wasm" });
SciChart3DSurface.configure({ wasmUrl: "/scichart3d.wasm" }); // ← clobbers the 2D URL
```

Because one module now backs both engines, a second call **overwrites** the first — so your 2D
charts would try to fetch the 3D URL and 404. `SciChart3DSurface.configure()`,
`useWasmFromCDN()`, `loadWasmFromCDN()` and `loadWasmLocal()` are **removed in v6** precisely so
that this fails to compile instead of failing silently at runtime. Call the `SciChartSurface`
version once.
:::

## SIMD support

:::info
In version 5 we introduced SIMD (Single Instruction, Multiple Data) support.
SIMD is a parallel processing technique where a single instruction operates on multiple data elements simultaneously. It's a form of data-level parallelism used to accelerate computations in applications like multimedia processing, scientific computing, and machine learning.
:::

To support both cases, deploy the SIMD binary `scichart.wasm` and the fallback `scichart-nosimd.wasm`.
SciChart picks between them at runtime based on what the browser supports.

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
                { from: "../src/_wasm/scichart.wasm", to: "" },
                { from: "../src/_wasm/scichart-nosimd.wasm", to: "" }
            ]
        })
    ]
};
```

**SIMD settings**

It is also possible to deploy only one of the two binaries, in which case you must also set
`SciChartDefaults.useWasmSimd` so SciChart does not try to fetch the one you left out.

`SciChartDefaults.useWasmSimd` defines how WebAssembly SIMD should be used by SciChart. Defaults to Auto.
- `Auto`: Detect SIMD support and choose the appropriate binary — **deploy both files**. This is the default.
- `Always`: Always use the SIMD binary — deploy `scichart.wasm`. Charts will fail on a browser without SIMD support.
- `Never`: Never use SIMD — deploy `scichart-nosimd.wasm`. Works everywhere, but slower.

## wasm64 (Memory64) — opt in {#wasm64}

A 64-bit build, `scichart-64.wasm`, is available for datasets large enough to exhaust the ~4 GB
address space of a 32-bit WebAssembly module. It is **off by default**, and enabling it is a
deployment change as well as a settings change:

```ts
import { SciChartDefaults, EUseWasm64 } from "scichart";

SciChartDefaults.useWasm64 = EUseWasm64.Auto; // use wasm64 where the browser supports it
```

:::warning
`scichart-64.wasm` is a **separate, non-interchangeable binary and is not contained within
`scichart.wasm`** — you must deploy it as an additional file, alongside its loader `scichart-64.js`.
A 404 on `scichart-64.wasm` is the most common cause of a wasm64 load failure.
:::

Three further constraints:

- **It is SIMD-only.** There is no no-SIMD wasm64 variant, so wasm64 is only used when SIMD is also
  in effect. Setting `useWasmSimd = Never` forces the 32-bit build regardless of `useWasm64`.
- **Browser support is narrower** than for wasm32: Chrome/Edge 133+ and Firefox 134+, not Safari as
  of 2025. With `EUseWasm64.Auto`, unsupported browsers fall back to `scichart.wasm` automatically.
- **64-bit pointers cost throughput.** Every heap access is wider, so wasm64 is slower than wasm32 on
  the same data. Opt in because you need the address space, not for speed.
