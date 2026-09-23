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

**WebGPU is enabled by default on Apple Silicon Macs (auto mode).** At startup SciChart requests a high-performance WebGPU adapter and device. If any step is unavailable — no `navigator.gpu`, no adapter, or a device that fails to come up — SciChart logs a warning and falls back to WebGL 2 automatically. Existing applications need no code change.

You can override Render Mode with the `IS_WEB_GPU` localStorage key: "1" forces WebGPU on any device (the Apple check is skipped), "0" forces WebGL, anything else (or unset) is auto mode.

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

See [WebGPU and WebGL Renderers](/2d-charts/surface/webgpu-and-webgl-renderers/) for how to pin either renderer, check which one is active, and why multiple charts on one page benefit most.

## ES Module support and tree-shaking

:::info
Bundle size reduction for any application using SciChart.js
:::

The npm package is now **side-effect free and tree-shakeable**. `scichart` ships both a CommonJS build (`cjs/`) and an ES-module build (`esm/`), selected through the package's `exports` map, so bundlers can drop the chart types your app never imports.

Import strings are unchanged — `import { SciChartSurface } from "scichart"` keeps working and now shakes.

Measured savings on real webpack and other builds:

| Change | Saving |
|---|---|
| Importing `build2DChart` instead of the named `build2DChart` export | −43.2 KB gzip (−21.7%) |
| Builder API lean-by-default, per-type registration vs `registerAllTypes()` | ~155 KB vs ~360 KB gzip |
| Core no longer loading Builder registration modules | ~15 KB gzip |
| A single enum import from the barrel, on esbuild and Vite | ~230 KB → 0.4 KB gzip |

:::warning
A TypeScript project compiling with `"module": "commonjs"` will **not** tree-shake, because TypeScript rewrites your `import` to `require()` before the bundler sees it. See [Enabling tree-shaking in a TypeScript project](/whats-new/breaking-changes-v5.2-v6.0/#enabling-tree-shaking-in-a-typescript-project) for the `tsconfig.json` settings you need.
:::

### Builder API: modular registration

:::info
Builder API smaller bundle size
:::

Side-effect registration in the Builder API was the biggest single obstacle to tree-shaking: importing it registered every built-in chart type, so a bundler could never prove any of them unused — the largest saving in the table above. In v6 it registers nothing by default. Register only what your definitions name as strings, and keep the rest out of the bundle:

```typescript
import { build2DChart, registerLineSeries, registerXyDataSeries, registerNumericAxis } from "scichart";

registerLineSeries();
registerXyDataSeries();
registerNumericAxis();
```

`registerAllTypes()` restores the old register-everything behaviour in one line. Unknown types now throw an actionable error naming the register function to call, instead of being silently skipped — and **custom series definitions now work**, where previously they type-checked but produced nothing.

See [Builder API Overview](/2d-charts/builder-api/builder-api-overview/).

## Larger datasets with 64-bit WebAssembly

:::info
Extends the wasm memory limit to 16 GB
:::

v6 adds an optional **64-bit WebAssembly build** (`-sMEMORY64=1`), raising the maximum heap from the wasm32 4 GB ceiling to 16 GB for very large datasets. The wasm64 binaries (`scichart-64.wasm` and its side modules) ship alongside the 32-bit ones and are selected by browser capability; `FeatureDetectionHelper` reports both SIMD and wasm64 support.

Memory64 is currently a Chromium-first feature, so the wasm32 build remains the default path everywhere else.

See [Larger Datasets with 64-bit WebAssembly](/2d-charts/surface/larger-datasets-with-wasm64/) for how much more data this buys you, the trade-offs, how it interacts with SIMD, and every related setting.

## One modular wasm build for 2D and 3D

:::info
Shared code loads once instead of twice, and the 3D engine is fetched only when a 3D chart is created.
:::

The 2D and 3D engines have been unified. Where v5 shipped `scichart2d.wasm` and `scichart3d.wasm` as separate binaries with separate bootstrap APIs, v6 ships a **single wasm module carrying both engines**, configured through the `SciChartSurface` statics for 2D and 3D alike:

```typescript
// configures the shared module for both 2D and 3D charts
SciChartSurface.configure({ wasmUrl: "/scichart.wasm" });
```

The `SciChart3DSurface` wasm-loading statics still exist as deprecated forwards, so existing code keeps working — but calling both `SciChartSurface.configure()` and `SciChart3DSurface.configure()` now means the second call overwrites the first. See [the migration notes](/whats-new/breaking-changes-v5.2-v6.0/#watch-for-the-two-call-configure-pattern).

Unifying the binaries does not mean loading more up front, because that single build is also **modular**: a smaller core plus side modules fetched at runtime. There are two today — `data` (the native data-series layer, loaded with every chart) and `charting3d` (the whole 3D engine, fetched lazily at the first 3D chart, so 2D-only pages never download it).

Deployment gets simpler rather than harder: every servable binary lives in one directory, so the copy step is a single directory copy that never needs updating when a module is added.

```js
new CopyPlugin({
    patterns: [{ from: "node_modules/scichart/_wasm/", to: "" }]
});
```

See [Deploying Wasm (WebAssembly) with your app](/2d-charts/surface/deploying-wasm/).

## New chart types and features

* **[Parallel Coordinate Plot](/2d-charts/chart-types/parallel-coordinate-plot/)** — a new chart type for exploring high-dimensional data, with a demo and full documentation (SCJS-524, SCJS-1045)
* **Immediate Mesh 3D** — mesh geometry expressed in data space as a renderable series, with a new [3D Model Example](https://www.scichart.com/demo/react/3d-model-chart)
* **[Slug text rendering](/2d-charts/miscellaneous-apis/native-text-api/#how-native-text-is-rendered)** — all 2D native text (axis labels, axis and chart titles, data labels, `NativeTextAnnotation`) now renders through Slug GPU Bezier text, **replacing** the Signed Distance Field texture atlas. Glyphs are exact at any size, scale and rotation, and changing a font size no longer rebuilds an atlas. 3D charts still use the atlas. No public 2D api changed (SCJS-2457)
* **[Individual colouring for contour lines](/2d-charts/chart-types/uniform-contours-renderable-series/#individual-colouring-for-contour-lines)** — `UniformContoursRenderableSeries.colorMapMode` colours each contour line by its own z-value from the series `colorMap`, instead of drawing every line in one flat colour (SCJS-2600)
* **Better contour labels** — the built-in `ContoursDataLabelProvider` is unchanged in v6; see [Laying labels along the contour lines](/2d-charts/chart-types/uniform-contours-renderable-series/#laying-labels-along-the-contour-lines) for a worked recipe that subclasses it to place labels on the lines, rotated to follow them (SCJS-2592)
* **Heatmap `linearTextureFilteringIntensity`** — control the strength of linear texture filtering on uniform and non-uniform heatmaps (SCJS-2694) (TODO: update once it is fixed in v6)
* **[Stacked columns with individual Y axes](#stacked-columns-with-individual-y-axes)** — each `stackedGroupId` can now bind to its own Y axis (SCJS-2597)
* **[OHLC support for AutoSimplify](#ohlc-support-for-autosimplify)** — `autoSimplify` drops the Open and Close ticks as bars crowd together, controlled by [simplifyOpenThresholdPx:blue_book:](https://www.scichart.com/documentation/js/v6/typedoc/classes/fastohlcrenderableseries.html#simplifyopenthresholdpx) and [simplifyCloseThresholdPx:blue_book:](https://www.scichart.com/documentation/js/v6/typedoc/classes/fastohlcrenderableseries.html#simplifyclosethresholdpx) (SCJS-2574)
* **[Arbitrary contour line values](/2d-charts/chart-types/uniform-contours-renderable-series/#contours-at-arbitrary-levels)** — `UniformContoursRenderableSeries.zLevels` draws contour lines at levels you choose, instead of the uniform spacing `zStep` gives (SCJS-2513)

### Stacked columns with individual Y axes

In v5 a `StackedColumnCollection` drew against one Y axis, so groups whose values were orders of magnitude apart had to share a scale. In v6 a `StackedColumnRenderableSeries` can set its own `yAxisId`, and only falls back to the collection's when it does not. Series sharing a `stackedGroupId` must still resolve to the same Y axis — that is what makes a stack meaningful — so the axis is effectively chosen per group.

```typescript
// One axis per group, each with its own scale
sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { id: "yLeft", axisAlignment: EAxisAlignment.Left }),
    new NumericAxis(wasmContext, { id: "yRight", axisAlignment: EAxisAlignment.Right })
);

const collection = new StackedColumnCollection(wasmContext, { yAxisId: "yLeft" });
collection.add(
    // group "one" stacks vertically on the left axis
    new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: tomatoes,
        fill: "#dc443f",
        stackedGroupId: "one",
        yAxisId: "yLeft"
    }),
    new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: cucumbers,
        fill: "#aad34f",
        stackedGroupId: "one",
        yAxisId: "yLeft"
    }),
    // group "two" sits beside it, measured against the right axis
    new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: peppers,
        fill: "#8562b4",
        stackedGroupId: "two",
        yAxisId: "yRight"
    })
);

sciChartSurface.renderableSeries.add(collection);
```

Mixing axes *within* one `stackedGroupId` throws, since the stack would have no common scale to add up on. A series pointing at an axis id that does not exist only warns, and falls back to the collection's axis.

### OHLC support for AutoSimplify

Zoomed out far enough, the Open and Close ticks of an OHLC bar collapse into the stem and stop carrying information. Setting `autoSimplify` on [FastOhlcRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v6/typedoc/classes/fastohlcrenderableseries.html) drops those ticks once bars crowd past a threshold, leaving the high–low stems; they come back as you zoom in. It is `false` by default.

```typescript
const ohlcSeries = new FastOhlcRenderableSeries(wasmContext, {
    dataSeries,
    strokeThickness: 2,
    dataPointWidth: 0.8,
    autoSimplify: true,
    simplifyOpenThresholdPx: 6, // hide the Open tick below 6px of spacing per bar
    simplifyCloseThresholdPx: 4 // hide the Close tick below 4px
});

sciChartSurface.renderableSeries.add(ohlcSeries);
```

Both thresholds are measured against the **horizontal spacing per bar**, not the drawn bar width that `dataPointWidth` gives, so they behave the same whichever width you choose. `0` always draws the tick and a negative value always hides it, which makes each tick individually switchable without touching `autoSimplify`. Only OHLC bars simplify — candlesticks are unaffected.

See [Simplifying OHLC Bars When Zooming Out](/2d-charts/chart-types/fast-ohlc-renderable-series/#simplifying-ohlc-bars-when-zooming-out) for a live example, and [simplifyOpenThresholdPx:blue_book:](https://www.scichart.com/documentation/js/v6/typedoc/classes/fastohlcrenderableseries.html#simplifyopenthresholdpx) / [simplifyCloseThresholdPx:blue_book:](https://www.scichart.com/documentation/js/v6/typedoc/classes/fastohlcrenderableseries.html#simplifyclosethresholdpx) in the typedoc.

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

* SCJS-2596: Thin charts showed gaps on thin lines
* SCJS-2602: Resampling for OHLC with NaNs was incorrect
* SCJS-2630: `PolarArcZoomModifier` did not work on a vertical chart

**[Glow and Drop Shadow shader effects](/2d-charts/miscellaneous-apis/glow-and-dro-shadow-shader-effects/)**

`ShadowEffect.offset` is now applied on a different scale, so an offset tuned against v5 will look roughly three times too large. What was `new Point(10, 10)` is about `new Point(3, 3)` in v6 — see [ShadowEffect offset is applied on a different scale](/whats-new/breaking-changes-v5.2-v6.0/#shadoweffect-offset-is-applied-on-a-different-scale).

**3D charts**

* SCJS-2577: Some 3D labels were hidden when there was enough space
* SCJS-2598: `StrokeDashArray` for `Point3DLines`

**Miscellaneous**

* SCJS-2707: Allow canvas focus when not following a Ctrl+A
* SCJS-2576: Immutable pens and brushes refactor
* SCJS-2460: Circular dependencies refactor
