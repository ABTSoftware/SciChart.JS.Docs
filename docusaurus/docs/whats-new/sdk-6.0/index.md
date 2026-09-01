---
sidebar_position: 0
---

# What's New in SciChart.js SDK v6.0

SciChart.js v6.0 adds a **WebGPU rendering backend**, unifies the 2D and 3D engines into a **single WebAssembly module**, and makes the npm package **tree-shakeable** so apps ship only the chart code they use.

For a complete migration guide see [Breaking Changes in SciChart.js v6.0 from v5.2](/whats-new/breaking-changes-v5.2-v6.0/).

## WebGPU Rendering

:::info
Huge improvement in performance when rendering multiple charts on one page
:::

SciChart.js now renders through **WebGPU**, the successor to WebGL, with automatic fallback to WebGL 2.

**WebGPU is enabled by default.** At startup SciChart requests a high-performance WebGPU adapter and device. If any step is unavailable — no `navigator.gpu`, no adapter, or a device that fails to come up — SciChart logs a warning and falls back to WebGL 2 automatically. Existing applications need no code change.

Where the adapter supports them, SciChart opts into the `float32-filterable` and `texture-compression-bc` device features.

### Checking and controlling the renderer

`WebGpuHelper` is exported from the package root:

```typescript
import { WebGpuHelper } from "scichart";

// Which backend will be used?
const usingWebGpu = WebGpuHelper.getWebGpuSupported();

// Force WebGL 2, before creating any SciChartSurface
WebGpuHelper.setWebGpuSupported(false);
```

WebGPU can also be turned off without touching code, by setting `IS_WEB_GPU` to `"0"` in the browser's local storage. This is useful for comparing the two backends against the same page:

```javascript
localStorage.setItem("IS_WEB_GPU", "0"); // then reload
```

:::note
One rendering behaviour differs between backends. In WebGL mode, multiple charts on a page share a master canvas and each surface is copied to its own destination canvas. In WebGPU mode there is no copy step — every surface renders directly to its destination canvas.
:::

## Smaller bundles: tree-shaking and dual CJS + ESM builds

:::info
Bundle size reduction for any application using SciChart.js
:::

The npm package is now **side-effect free and tree-shakeable**. `scichart` ships both a CommonJS build (`cjs/`) and an ES-module build (`esm/`), selected through the package's `exports` map, so bundlers can drop the chart types your app never imports.

Import strings are unchanged — `import { SciChartSurface } from "scichart"` keeps working and now shakes.

Measured savings on real webpack and other builds:

| Change | Saving |
|---|---|
| Importing `build2DChart` instead of the whole `chartBuilder` object | −43.2 KB gzip (−21.7%) |
| Builder API lean-by-default, per-type registration vs `registerAllTypes()` | ~155 KB vs ~360 KB gzip |
| Core no longer loading Builder registration modules | ~15 KB gzip |
| A single enum import from the barrel, on esbuild and Vite | ~230 KB → 0.4 KB gzip |

:::warning
A TypeScript project compiling with `"module": "commonjs"` will **not** tree-shake, because TypeScript rewrites your `import` to `require()` before the bundler sees it. See [Enabling tree-shaking in a TypeScript project](/whats-new/breaking-changes-v5.2-v6.0/#enabling-tree-shaking-in-a-typescript-project) for the `tsconfig.json` settings you need.
:::

## One wasm module for 2D and 3D

:::info
Huge win when combining both 2D and 3D charts as you do not need to load the shared code twice.
:::

The 2D and 3D engines have been unified. Where v5 shipped `scichart2d.wasm` and `scichart3d.wasm` as separate binaries with separate bootstrap APIs, v6 ships a **single wasm module carrying both engines**, configured through the `SciChartSurface` statics for 2D and 3D alike:

```typescript
// configures the shared module for both 2D and 3D charts
SciChartSurface.configure({ wasmUrl: "/scichart.wasm" });
```

The `SciChart3DSurface` wasm-loading statics still exist as deprecated forwards, so existing code keeps working — but calling both `SciChartSurface.configure()` and `SciChart3DSurface.configure()` now means the second call overwrites the first. See [the migration notes](/whats-new/breaking-changes-v5.2-v6.0/#watch-for-the-two-call-configure-pattern).

### Modular wasm

:::info
Smaller load time as modules are fetched lazily
:::

The unified binary is **modular**: a smaller core plus side modules fetched at runtime. There are two today — `data` (the native data-series layer) and `charting3d` (the whole 3D engine, fetched lazily at the first 3D chart, so 2D-only pages never download it).

Deployment is now a single directory copy:

```js
new CopyPlugin({
    patterns: [{ from: "node_modules/scichart/_wasm/", to: "" }]
});
```

See [Deploying Wasm (WebAssembly) with your app](/2d-charts/surface/deploying-wasm/).

### wasm64 (Memory64) builds

:::info
Expends wasm memory limit to 16 Gb
:::

v6 adds an optional **64-bit WebAssembly build** (`-sMEMORY64=1`), raising the maximum heap from the wasm32 4 GB ceiling to 16 GB for very large datasets. The wasm64 binaries (`scichart-64.wasm` and its side modules) ship alongside the 32-bit ones and are selected by browser capability; `FeatureDetectionHelper` reports both SIMD and wasm64 support.

Memory64 is currently a Chromium-first feature, so the wasm32 build remains the default path everywhere else.

## Builder API: modular registration

:::info
Builder API smaller bundle size
:::

The Builder API no longer registers every built-in chart type as an import side effect. Register only what your definitions name as strings, and keep the rest out of the bundle:

```typescript
import { build2DChart, registerLineSeries, registerXyDataSeries, registerNumericAxis } from "scichart";

registerLineSeries();
registerXyDataSeries();
registerNumericAxis();
```

`registerAllTypes()` restores the old register-everything behaviour in one line. Unknown types now throw an actionable error naming the register function to call, instead of being silently skipped — and **custom series definitions now work**, where previously they type-checked but produced nothing.

See [Builder API Overview](/2d-charts/builder-api/builder-api-overview/).

## New chart types and features

* **[Parallel Coordinate Plot](/2d-charts/chart-types/parallel-coordinate-plot/)** — a new chart type for exploring high-dimensional data, with a demo and full documentation (SCJS-524, SCJS-1045)
* **Logarithmic axis for 3D charts** — `LogarithmicAxis3D` (SCJS-2528)
* **Immediate Mesh 3D** — mesh geometry expressed in data space as a renderable series, with a new example (SCJS-2649)
* **Slug text rendering** — full support for slug text across data labels and annotations, as an additional render path alongside Canvas and Native text (SCJS-2457)
* **Better contour labels** and **individual colouring for contour lines** (SCJS-2592, SCJS-2600)
* **Heatmap `linearTextureFilteringIntensity`** — control the strength of linear texture filtering on uniform and non-uniform heatmaps (SCJS-2694)
* **Stacked columns with individual Y axes** — each `StackedGroupId` can now bind to its own Y axis (SCJS-2597)
* **OHLC support for AutoSimplify**, including `SimplifyOpenThresholdPx` and `SimplifyCloseThresholdPx` (SCJS-2574)
* **Arbitrary contour line values** for `UniformContoursRenderableSeries` (SCJS-2513)

## TableDataSeries and native string columns

`XyNDataSeries` is now **`TableDataSeries`** — the old name remains as a deprecated alias. The type holds string, date and currency columns alongside numeric Y values, which the old name no longer described.

Dictionary-encoded **string columns are now a `BaseDataSeries` capability**, so *any* data series can carry text. Declare one with the `stringColumns` option and read it with `getTextAt(name, index)`. `DataLabelProvider` gained a `textColumn` option that takes label text straight from a named string column.

`XyTextDataSeries` was reimplemented on top of this, which fixes six long-standing FIFO defects where text and points came apart. See the [migration notes](/whats-new/breaking-changes-v5.2-v6.0/#xytextdataseries-text-is-now-stored-in-a-dictionary-encoded-string-column) — they list one case where you must **keep** an existing workaround.

## SciChart Financial Tools improvements

* Fibonacci annotation improvements. Improved line style, added extendStart, extendEnd props (SCJS-2689)
* `StrokeDashArray` added to more financial tools annotations (SCJS-2635)
* Improved line annotation text render quality (SCJS-2634)
* `BoxAnnotation` `strokeThickness` rounding fixed (SCJS-2632)
* Fixed arc-based financial tools behaving as if the Y axis were flipped (SCJS-2698)

## Improvements and bug fixes

Selected fixes from the v6.0 cycle.

* SCJS-2543: Shadow/Glow effect on a line series resulted in no draw
* SCJS-2596: Thin charts showed gaps on thin lines
* SCJS-2602: Resampling for OHLC with NaNs was incorrect
* SCJS-2630: `PolarArcZoomModifier` did not work on a vertical chart

**3D charts**

* SCJS-2577: Some 3D labels were hidden when there was enough space
* SCJS-2598: `StrokeDashArray` for `Point3DLines`

**Miscellaneous**

* SCJS-2707: Allow canvas focus when not following a Ctrl+A
* SCJS-2576: Immutable pens and brushes refactor
* SCJS-2460: Circular dependencies refactor
