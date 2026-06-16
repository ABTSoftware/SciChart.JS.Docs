---
sidebar_position: 1
---

# What's New in SciChart.js SDK v5.0

## SciChart.js v5.0 Release Overview

SciChart.js v5 delivers transformative performance via [Wasm SIMD](https://v8.dev/features/simd) for 2x–50x speedups across charts and features, 45% smaller bundles, new axes for non‑linear/gapped data, expanded Float64Array support, 4 GB memory limits and numerous bug fixes.

## Key Highlights

- **Wasm SIMD integration**: 2x–4x faster big‑data charts (resampling, AutoRange) via on‑chip parallelization on Intel SSE/ARM NEON, auto‑detected with non‑SIMD fallback.
- **File size reductions**: 45% smaller wasm files (1 MB each for 2D/3D), JS bundle down ~150 KB for faster loads.
- **Chart init speedup**: Up to 300 ms faster first‑chart initialization (~250 ms empty cache).
- **Specific chart gains vs. v4**:
    - 3.9x faster FIFO scrolling lines (telemetry/ECGs).
    - 2.4x faster real‑time append lines.
    - 10.3x faster real‑time 3D surface meshes.
    - 50x faster Error Bars.
- **Memory**: 40% less for 1M‑point scatters; 4 GB Wasm limit (up from 2 GB).
- **SVG‑only tooltips**: Dramatic speedup over large static datasets without full redraws.
- **Axes**: [BaseValueAxis](/2d-charts/axis-api/axis-types/base-value-axis/) (non‑linear scales), [DiscontinuousDateAxis](/2d-charts/axis-api/axis-types/discontinuous-date-axis/) (gapped financial data).
- **Data support**: `Float64Array` for heatmaps/3D series; heatmaps up to 16K×16K.
- **3D axes**: Multiline labels, auto‑rotation, plane options from WPF.
- **Manual rendering**: [Manual Render Control](/2d-charts/miscellaneous-apis/manual-render/)

## Performance Improvements

### Built for Wasm SIMD

SciChart.js v5 and above is now compiled with [wasm-simd](https://v8.dev/features/simd). This enables the graphics engine to use 128‑bit SIMD registers (SSE/NEON) on Intel, AMD and ARM hardware across Windows, macOS, iOS, Android and Linux, allowing on‑chip parallelization for performance‑critical algorithms and maths functions. Wasm‑simd is portable and works on all modern browsers that support WebAssembly SIMD (see [caniuse.com](https://caniuse.com/wasm-simd)), including Chrome, Edge, Safari, Firefox, Opera, Chrome for Android, Safari iOS, Samsung Internet, Android Browser and Firefox for Android. SciChart.js auto‑detects wasm‑simd support in your browser and falls back to a non‑SIMD build for rare cases without support.

:::info
Adding wasm‑simd support results in a >2x–4x performance boost for big‑data charts in SciChart.js v5, as key algorithms such as resampling and AutoRange (axis autofitting) benefit from on‑chip parallelization. This applies automatically with no code changes required in your app, and configuring the non‑SIMD fallback is minimal (see [SIMD documentation:blue_book:](https://www.scichart.com/documentation/js/v5/2d-charts/surface/deploying-wasm/#simd-support) in the SciChart docs).
:::

### Bundle and library size reductions

Redundancies in the bundled WebAssembly modules were removed, reducing the size of `scichart2d.wasm` and `scichart3d.wasm` by 1 MB each. SciChart.js v5 now ships with approximately 45% smaller wasm files, improving download, compilation and initialization times. The JavaScript bundle was also reduced by about 150 KB, making `index.min.js` roughly 1.9 MB, with further reductions planned via better bundling and code stripping.

### Chart initialization improvements

By stripping unnecessary C++ → WebAssembly code, chart initialization has been streamlined. Initializing the first SciChart.js v5 chart is now up to 300 ms faster, covering the one‑time setup of the 2D/3D engine and text rendering subsystems. Subsequent charts still initialize in under 10 ms, and first‑chart render can be as low as ~250 ms on an “empty cache hard reload,” depending on configuration. See the “Performance tips and tricks” section in the SciChart documentation for further optimization guidance.

### JavaScript chart and feature performance

We regularly carry out a suite of performance tests on SciChart.js vs. earlier versions and competitors. Download this test suite for yourself from [this github repo](https://github.com/ABTSoftware/javascript-chart-performance-test-suite). You can see some details in the post: [JavaScript Chart Performance Comparisons](https://www.scichart.com/blog/scichart-is-the-fastest-js-chart-library-available-and-why-that-matters-in-todays-world/).

Internal performance tests show significant gains versus SciChart.js v4.

- Up to 1.8x faster: Stacked Column, Stacked Mountain charts.
- Up to 1.6x faster: static line charts with N series × M points.
- Up to 2x faster: Triangle Series (arbitrary polygon) 2D charts.
- Up to 2.2x faster: unsorted data scatter charts.
- Up to 1.7x faster: unsorted data line charts.
- Up to 3.9x faster: FIFO scrolling line charts (telemetry, time‑series monitoring, ECGs).
- Up to 2.4x faster: series‑append line charts (big‑data real‑time charts).
- Up to 2.3x faster: multi‑chart layouts with up to 128 charts on screen.
- Up to 2x faster: real‑time 2D heatmap charts.
- Up to 4.6x faster: Spline/Bezier transform.
- Up to 5.5x faster: PaletteProvider (per‑point coloring).
- Up to 3.5x faster: Data Filters.
- Up to 8.6x faster: real‑time 3D point clouds.
- Up to 10.3x faster: real‑time 3D surface mesh plots.
- Up to 15x faster: Box Plot 2D chart.
- Up to 50x faster: Error Bars chart.

### Micro‑optimizations throughout the library

Using `vectorToArrayView` helpers introduced in v4.0, micro‑optimizations were applied across the library. This benefits extensions and features commonly used in complex dashboards, including PaletteProviders (per‑point coloring), DataLabels, Serialization, data‑point selection, series animations, Rectangle/Triangle series, and hit‑testing used by tooltips and selection modifiers.

Additional optimizations were made in DataSeries types for faster manipulation of XY, XYZ, and 2D/3D data formats. Heatmaps, 3D surface plots and 3D point cloud charts now support `Float64Array`, and 3D metadata handling has been optimized. For example, creating, appending and inserting points into `XyzDataSeries3D` is now up to 50x faster, and rendering 3D scatter or point‑cloud charts with per‑point metadata coloring is up to 10x faster. The shader pipeline was also simplified, improving rendering performance on lower‑powered GPUs such as those found in SBCs for industrial, embedded or IoT deployments.

### Memory footprint and maximum memory

SciChart.js v5 reduces memory usage and improves stability by cutting allocations/deallocations while rendering and fixing a memory leak. For example, a scatter series with 1M points now uses about 40% less memory compared to v4. The WebAssembly engine is compiled with `-s MAXIMUM_MEMORY=4GB`, increasing the upper memory reservation limit from 2 GB to 4 GB and enabling extremely large data sets while bypassing Chrome’s former ~2 GB ceiling.

---

## New Features

### SVG‑only mode for tooltips and annotations

When updates affect only SVG‑drawn chart elements, they are now applied without redrawing the rest of the chart. Rollover, Cursor and VerticalSlice modifiers were updated to be pure SVG, dramatically improving tooltip performance over large static datasets.

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/performance-1m-points-svg-cursor"
    title="High Performance SVG Cursor & Rollover"
/>

### BaseValueAxis type

A new [BaseValueAxis](/2d-charts/axis-api/axis-types/base-value-axis/) type uses a configurable set of base values, potentially independent of series data, to determine axis scale. This enables non‑linear axis configurations such as log‑linear or dynamic zoom behaviors.

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/basevalue-axes"
    title="React Chart with BaseValue Axes"
/>

### DiscontinuousDateAxis type

[DiscontinuousDateAxis](/2d-charts/axis-api/axis-types/discontinuous-date-axis/) extends [BaseValueAxis](/2d-charts/axis-api/axis-types/base-value-axis/)  and is tailored for financial data with gaps (for example, weekends when markets are closed). It collapses these gaps like a category axis while still plotting by x‑value, supporting varying point counts per series and duplicate x‑values.

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/chart-axis-comparison"
    title="DiscontinuousDateAxis Comparison"
/>

### High‑precision date formatting

`SmartDateLabelProvider` now supports formatting from years down to nanoseconds and offers improved APIs for overriding formats or plugging in external formatting libraries. A new demo showcases the achievable range and precision due to SciChart’s retained 64‑bit precision in coordinate calculations.

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/zoom-high-precision"
    title="High Precision Date Axis"
/>

### Additional feature updates

- Stacked Column charts now support [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/palette-provider-api/palette-provider-stacked-columns/) and per‑point coloring.
- A `layoutMeasured` event was added; it fires mid‑render after axes are measured but before drawing, allowing modifiers to hit‑test and reposition annotations within the same frame to avoid extra renders.
- Added `onResize` event to `SciChartSurface` ([Render Events documentation](https://scichart.com/documentation/js/v5/2d-charts/miscellaneous-apis/render-events/)).
- `HeatmapDataSeries` and `UniformGridDataSeries3D` now support `Float64Array[]` as well as 2D `number[][]`.
- `XyzDataSeries3D` now supports `Float64Array` as well as `number[]`.
- 3D `SeriesInfo` types now expose `pointMetadata` ([3D Chart Styling Documentation:blue_book:](https://www.scichart.com/documentation/js/v5/3d-charts/axis-3d-api/chart-styling-3d/)).
- Uniform heatmaps can bypass the former 4000×4000 limit, supporting textures up to the WebGL max (for example, 16384×16384, depending on hardware).
- Multiple 3D axis improvements from WPF were ported: multiline labels/titles, auto‑rotation for perpendicular labels, `labelOffset`/`titleOffset`, axis planes (`xyAxisPlane`, `zyAxisPlane`, `zxAxisPlane`) with visibility/label placement options, and functioning `axisPlaneBackgroundFill`.

### Optional manual render control

A new `disableEngineLoop` option on `SciChartSurface.create()` and `SciChart3DSurface.create()` allows disabling SciChart’s internal rendering loop when you manage rendering from an external loop. See the [Manual Render Control](/2d-charts/miscellaneous-apis/manual-render/) section in the documentation for usage patterns and examples.

---

## Bug Fixes

- SCJS‑2324: Tooltips did not update when the hit‑test result did not change.
- SCJS‑2325: Hit‑test incorrect for `XyNDataSeries`.
- SCJS‑1530: Line series with `NaN` rendered with artifacts on Mac M1/M.
- SCJS‑2295, SCJS‑2312: 3D charts leaked memory after `.delete()`, especially when adding 2D charts on the same page.
- SCJS‑1387: 4000×4000 heatmaps caused a memory‑access‑out‑of‑bounds exception.
- SCJS‑1621: `axis.getMaximumRange` behaved incorrectly on `StackedColumnCollection`.
- SCJS‑1888: 3D chart crashed if a `renderableSeries` was created without a `dataSeries`.
- SCJS‑2333: Superscripts 0, 4, 5, 6, 7, 8, 9 now work when `useNativeText: true`.
- SCJS‑2252: Silent `RuntimeError: Aborted()` in WebAssembly when hitting memory limits.
- SCJS‑2354: Rounded columns rendered incorrect fills when `strokeThickness` was set to 0.

---

## Breaking Changes

SciChart.js v5 is largely a drop‑in replacement for v4 but introduces a few breaking changes, hence the major version bump.

- WebGL 1 fallback removed; SciChart.js v5 now requires WebGL 2.
- Default font changed to open‑source `Arimo.ttf`.
- SIMD support requires copying `nosimd` wasm files to enable fallback builds.
- Return types changed for `DataLabelState.xValues`, `yValues`, `yFinalValues` and `PolarColumnDataLabelState.x1Values`.
- Accepting `Float64Array` in `UniformGridDataSeries3D`, `UniformHeatmapDataSeries`, and `XyzDataSeries3D` may cause TypeScript compile errors that require type updates.
- SVG‑only rendering and tooltip changes may require moving some annotation synchronization logic from `preRender` to `layoutMeasured`.
