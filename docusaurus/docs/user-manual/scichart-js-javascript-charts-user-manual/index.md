---
id: SciChartjs-JavaScript-Charts-User-Manual
sidebar_position: 1
---

# ✅ SciChart.js JavaScript Charts User Manual

:::tip
Are you new to SciChart? Check out our most popular pages to get started below:

* [Tutorials (JavaScript APIs / npm / webpack)](/docs/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js/index.md)
* [The SciChartSurface Type](/docs/2d-charts/surface/scichart-surface-type-overview/index.md)        
* [Series or Chart Types](/docs/2d-charts/chart-types/renderable-series-api-overview/index.md)
* [Axis Types and Configuration](/docs/2d-charts/axis-api/axis-api-overview/index.md)
* [Zooming & Panning](/docs/2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier/index.md)
* [Tooltips](/docs/2d-charts/chart-modifier-api/rollover-modifier/index.md)
* [Annotations and Markers](/docs/2d-charts/annotations-api/annotations-api-overview/index.md)
* [Styling and Themeing](/docs/2d-charts/styling-and-theming/theme-manager-api/index.md)
* [Chart Synchronization APIs](/docs/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/index.md)
* [3D charts Basics](/docs/3d-charts/scichart-3d-basics/scichart-3d-basics-overview/index.md)
:::

# What is SciChart.js?

SciChart.js is a [High-Performance Real-time 2D and 3D JavaScript Charting Library](https://www.scichart.com/javascript-chart-features).
Designed for use in scientific, financial, trading, engineering, medical and business apps where you require extreme speed, rich interactivity and depth of features and flexibility in a [JavaScript chart](https://www.scichart.com/javascript-chart-features).

![Scichart](images/scichart-home-see-new-worlds.jpg)

Across [Windows](https://www.scichart.com/wpf-chart-features), [iOS/macOS](https://www.scichart.com/ios-charts), [Android](https://www.scichart.com/android-charts) and now [JavaScript](https://scichart.com/javascript-chart-features), the SciChart Family is now in its 7th generation, and provides an extremely rich, fast and interactive JavaScript charting experience with a wide array of chart types, and the [JavaScript Charting Library](https://www.scichart.com/javascript-chart-features) is the newest edition to our portfolio, bringing high-performance, realtime charts to web browsers and JavaScript applications.

The SciChart family is used by thousands of customers in over 80 countries worldwide, in sectors ranging from Defence to Medical,
Financial and Trading to Oil & Gas, Process Management to Formula 1.

When you become a SciChart customer, you join a community of developers support by a world-class **JavaScript**, **WebGL** and **WebAssembly** graphics & visualisation team and domain-experts around scientific visualisation, performance optimisation and low-level software techniques.

We want you to enjoy using our products as much as we enjoy making them, as well as to succeed, so if you have any feedback good or bad, please get in touch as **we want to hear from you**.

The following document serves as a reference and an overview of the features in the SciChart.js JavaScript SDK. For a complete code
reference, see the [TypeDoc API Documentation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html)
and the [SciChart.js Examples Suite](https://scichart.com/demo), which contains many code samples you can run, export and modify for yourself.

# Table of Contents

The [TypeDoc documentation for SciChart.js can be found here:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html).

<!-- generate-docs-toc.js start -->
# Global Table of Contents

- **✅User Manual**
  - [✅ Licensing SciChart.js](/docs/user-manual/licensing-scichart-js)
  - [✅ Minimum Browser Requirements](/docs/user-manual/minimum-browser-requirements)
  - [✅ Online Resources and Help](/docs/user-manual/online-resources-and-help)
  - [✅ SciChart.js JavaScript Charts User Manual](/docs/user-manual/scichart-js-javascript-charts-user-manual)
- **✅ Get Started: Tutorials, Examples**
  - **✅ Tutorials (JavaScript APIs / npm / webpack)**
    - [✅ Tutorial 01 - Setting up a npm Project with SciChart.js](/docs/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js)
    - [✅ Tutorial 02 - Adding Series and Data](/docs/get-started/tutorials-js-npm-webpack/tutorial-02-adding-series-and-data)
    - [✅ Tutorial 03 - Adding Zooming, Panning Behavior](/docs/get-started/tutorials-js-npm-webpack/tutorial-03-adding-zooming-panning-behavior)
    - [✅ Tutorial 04 - Adding Realtime Updates](/docs/get-started/tutorials-js-npm-webpack/tutorial-04-adding-realtime-updates)
    - [✅ Tutorial 05 - Zoom and Pan with Realtime Updates](/docs/get-started/tutorials-js-npm-webpack/tutorial-05-zoom-and-pan-with-realtime-updates)
    - [✅ Tutorial 06 - Adding Annotations](/docs/get-started/tutorials-js-npm-webpack/tutorial-06-adding-annotations)
    - [✅ Tutorial 07 - Adding Tooltips and Legends](/docs/get-started/tutorials-js-npm-webpack/tutorial-07-adding-tooltips-and-legends)
    - [✅ Tutorial 08 - Adding Multiple Axis](/docs/get-started/tutorials-js-npm-webpack/tutorial-08-adding-multiple-axis)
    - [✅ Tutorial 09 - Linking Multiple Charts](/docs/get-started/tutorials-js-npm-webpack/tutorial-09-linking-multiple-charts)
    - [✅ Tutorial 10 - Vertical Charts](/docs/get-started/tutorials-js-npm-webpack/tutorial-10-vertical-charts)
  - **✅ Tutorials (index.min.js from CDN)**
    - [✅ Tutorial 01 - Including SciChart.js in an HTML Page using CDN](/docs/get-started/tutorials-cdn/tutorial-01-using-cdn)
    - [✅ Tutorial 02 - Including index.min.js and WebAssembly Files offline](/docs/get-started/tutorials-cdn/tutorial-02-offline)
  - [✅ Tutorial 01 - Setting up a project with scichart-react and config object](/docs/get-started/tutorials-react/tutorial-01-setting-up-project-with-scichart-react)
  - [✅ How do I? ... Worked Examples with SciChart.js](/docs/get-started/worked-examples/how-do-i-worked-examples-with-scichart-js)
  - [✅ The SciChart.js Examples Suite](/docs/get-started/scichart-js-examples-suite)
- **What's New?**
  - [✅ Breaking Changes in SciChart.js v4.x from v3.x](/docs/whats-new/breaking-changes-v3-v4)
  - [What's New in SciChart.js SDK v4.0](/docs/whats-new/sdk-4.0)
- **2D Charts API**
  - **✅ The SciChartSurface**
    - [✅ Deploying Wasm (WebAssembly) with your app](/docs/2d-charts/surface/deploying-wasm)
    - [✅ Creating a new SciChartSurface and loading Wasm](/docs/2d-charts/surface/new-scichart-surface)
    - [✅ Setting a Runtime License on a SciChartSurface](/docs/2d-charts/surface/runtime-license)
    - [✅ The SciChartPolarSurface Type](/docs/2d-charts/surface/scichart-polar-surface-type)
    - [✅ The SciChartSurface Type](/docs/2d-charts/surface/scichart-surface-type-overview)
  - **2D Chart Types**
    - **✅ Common Series APIs**
      - [✅ Drawing Gaps in Series (null data)](/docs/2d-charts/chart-types/common-series-apis/drawing-gaps)
      - [✅ Drawing PointMarkers on Series (Scatter markers)](/docs/2d-charts/chart-types/common-series-apis/drawing-point-markers)
      - [✅ Series isVisible and isVisibleChanged API](/docs/2d-charts/chart-types/common-series-apis/is-visible)
    - **DataLabels API**
      - [✅ Custom DataLabel Formatting with getText()](/docs/2d-charts/chart-types/data-point-labels/custom-data-label-formatting)
      - [✅ Data Label Coloring](/docs/2d-charts/chart-types/data-point-labels/data-label-coloring)
      - [✅ Data Label Positioning](/docs/2d-charts/chart-types/data-point-labels/data-label-positioning)
      - [✅ DataLabel SkipModes and Culling](/docs/2d-charts/chart-types/data-point-labels/data-label-skip-modes-and-culling)
      - [✅ DataLabels API Overview](/docs/2d-charts/chart-types/data-point-labels/data-labels-api-overview)
      - [✅ Getting Labels from Metadata](/docs/2d-charts/chart-types/data-point-labels/getting-labels-from-metadata)
      - [⭕ Polar Data Point Labels](/docs/2d-charts/chart-types/data-point-labels/polar-data-point-labels)
    - **PaletteProvider API**
      - [✅ Per-Point Colouring of Band Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series)
      - [✅ Per-Point Colouring of Bubble Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-bubble-renderable-series)
      - [✅ Per-Point Colouring of Candlestick / OHLC Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-candlestick-ohlc-renderable-series)
      - [✅ Per-Point Colouring of Column Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series)
      - [✅ Per-Point Colouring of Impulse Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-impulse-renderable-series)
      - [✅ Per-point Colouring for Line Series](/docs/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series)
      - [✅ Per-point Colouring of Mountain Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-mountain-renderable-series)
      - [⭕ Per-Point Coloring for Rectangle Series](/docs/2d-charts/chart-types/palette-provider-api/fast-rectangle-renderable-series)
      - [⭕ Per-Point Coloring for Line Segment Series](/docs/2d-charts/chart-types/palette-provider-api/line-segment-renderable-series)
      - [✅ The PaletteFactory Helper Class](/docs/2d-charts/chart-types/palette-provider-api/palette-factory)
      - [✅ PaletteProvider API Overview](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview)
      - [⭕ Per-Point Coloring for Polar Band Series](/docs/2d-charts/chart-types/palette-provider-api/polar-band-renderable-series)
      - [⭕ Per-Point Coloring for Polar Column Series](/docs/2d-charts/chart-types/palette-provider-api/polar-column-renderable-series)
      - [⭕ Per-Point Coloring for Polar Line Series](/docs/2d-charts/chart-types/palette-provider-api/polar-line-renderable-series)
      - [⭕ Per-Point Coloring for Polar Mountain Series](/docs/2d-charts/chart-types/palette-provider-api/polar-mountain-renderable-series)
      - [⭕ Per-Point Coloring for Polar Stacked Column Series](/docs/2d-charts/chart-types/palette-provider-api/polar-stacked-column-renderable-series)
      - [⭕ Per-Point Coloring for Polar Stacked Mountain Series](/docs/2d-charts/chart-types/palette-provider-api/polar-stacked-mountain-renderable-series)
      - [⭕ Per-Point Coloring for Polar Scatter Series](/docs/2d-charts/chart-types/palette-provider-api/polar-xy-scatter-renderable-series)
      - [⭕ Per-Point Coloring for Triangle Series](/docs/2d-charts/chart-types/palette-provider-api/triangle-renderable-series)
      - [✅ Per-Point Colouring of Scatter Charts (or PointMarkers)](/docs/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series)
    - **Hit-Test API**
      - [✅ Hit-Test API for Band Series](/docs/2d-charts/chart-types/hit-test-api/fast-band-renderable-series)
      - [✅ Hit-Test API for Bubble Series](/docs/2d-charts/chart-types/hit-test-api/fast-bubble-renderable-series)
      - [✅ Hit-Test API for Candlestick and OHLC Series](/docs/2d-charts/chart-types/hit-test-api/fast-candlestick-ohlc-renderable-series)
      - [✅ Hit-Test API for Column Series](/docs/2d-charts/chart-types/hit-test-api/fast-column-renderable-series)
      - [✅ Hit-Test API for Line Series](/docs/2d-charts/chart-types/hit-test-api/fast-line-renderable-series)
      - [✅ Hit-Test API for Mountain Series](/docs/2d-charts/chart-types/hit-test-api/fast-mountain-renderable-series)
      - [⭕ Hit-Test API for Rectangle Series](/docs/2d-charts/chart-types/hit-test-api/fast-rectangle-renderable-series)
      - [✅ Hit-Test API overview](/docs/2d-charts/chart-types/hit-test-api/hit-test-api-overview)
      - [⭕ Hit-Test API for Line Segment Series](/docs/2d-charts/chart-types/hit-test-api/line-segment-renderable-series)
      - [✅ Hit-Test API and Metadata](/docs/2d-charts/chart-types/hit-test-api/metadata)
      - [Hit-Test API for Polar Band Series](/docs/2d-charts/chart-types/hit-test-api/polar-band-renderable-series)
      - [✅ Hit-Test API for Polar Column Series](/docs/2d-charts/chart-types/hit-test-api/polar-column-renderable-series)
      - [Hit-Test API for Polar Line Series](/docs/2d-charts/chart-types/hit-test-api/polar-line-renderable-series)
      - [Hit-Test API for Polar Mountain Series](/docs/2d-charts/chart-types/hit-test-api/polar-mountain-renderable-series)
      - [Hit-Test API for Polar Stacked Column Series](/docs/2d-charts/chart-types/hit-test-api/polar-stacked-column-renderable-series)
      - [Hit-Test API for Polar Stacked Mountain Series](/docs/2d-charts/chart-types/hit-test-api/polar-stacked-mountain-renderable-series)
      - [Hit-Test API for Polar Uniform Heatmap Renderable Series](/docs/2d-charts/chart-types/hit-test-api/polar-uniform-heatmap-renderable-series)
      - [Hit-Test API for Polar XY Scatter Series](/docs/2d-charts/chart-types/hit-test-api/polar-xy-scatter-renderable-series)
      - [✅ Hit-Test API for Stacked Column Series](/docs/2d-charts/chart-types/hit-test-api/stacked-column-renderable-series)
      - [✅ Hit-Test API for Stacked Mountain Series](/docs/2d-charts/chart-types/hit-test-api/stacked-mountain-renderable-series)
      - [⭕ Hit-Test API for Triangle Series](/docs/2d-charts/chart-types/hit-test-api/triangle-renderable-series)
      - [✅ Hit-Test API for Heatmap Series](/docs/2d-charts/chart-types/hit-test-api/uniform-heatmap-renderable-series)
      - [✅ Hit-Test API for Scatter Series](/docs/2d-charts/chart-types/hit-test-api/xy-scatter-renderable-series)
    - **DataSeries (Data Updates) API**
      - [🔄 Append, Insert, Update, Remove](/docs/2d-charts/chart-types/data-series-api/append-insert-update-remove)
      - [✅ DataSeries API Overview](/docs/2d-charts/chart-types/data-series-api/data-series-api-overview)
      - [🔄 Deleting DataSeries Memory](/docs/2d-charts/chart-types/data-series-api/deleting-memory)
      - [🔄 DataSeries Get Set value at Index](/docs/2d-charts/chart-types/data-series-api/get-set-value-at-index)
      - [🔄 DataSeries Realtime Updates](/docs/2d-charts/chart-types/data-series-api/realtime-updates)
      - [🔄 DataSeries Resampling](/docs/2d-charts/chart-types/data-series-api/resampling)
    - **✅ PointMetadata API**
      - [✅ Metadata and HitTest](/docs/2d-charts/chart-types/point-metadata-api/hit-test)
      - [✅ Metadata and PaletteProviders](/docs/2d-charts/chart-types/point-metadata-api/palette-providers)
      - [✅ PointMetadata API](/docs/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview)
      - [✅ Metadata and Tooltips](/docs/2d-charts/chart-types/point-metadata-api/tooltips)
    - **✅ Data Filters (Transforms) API**
      - [✅ Creating a Custom Filter](/docs/2d-charts/chart-types/data-filters-api/custom-filter)
      - [✅ Data Filters API](/docs/2d-charts/chart-types/data-filters-api/data-filters-api-overview)
      - [✅ Linear Trendline Filter](/docs/2d-charts/chart-types/data-filters-api/linear-trendline-filter)
      - [✅ Moving Average Filter](/docs/2d-charts/chart-types/data-filters-api/moving-average-filter)
      - [✅ Ratio Filter](/docs/2d-charts/chart-types/data-filters-api/ratio-filter)
      - [✅ Scale Offset Filters](/docs/2d-charts/chart-types/data-filters-api/scale-offset-filters)
    - **Column Series**
      - [✅ The Column Series Type](/docs/2d-charts/chart-types/fast-column-renderable-series/column-series-type)
      - [✅ Column Series Data Point Width Mode](/docs/2d-charts/chart-types/fast-column-renderable-series/data-point-width-mode)
    - **Uniform Heatmap Series**
      - [✅ Heatmap ColorMaps and Legends](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends)
      - [✅ The Uniform Heatmap Chart Type](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type)
      - [✅ Updating (Realtime) Heatmaps](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime)
    - [✅ The Donut Chart Type](/docs/2d-charts/chart-types/donut-chart-type)
    - [✅ The Fan Charts Type](/docs/2d-charts/chart-types/fan-charts-type)
    - [✅ The Digital (Step) Band Series Type](/docs/2d-charts/chart-types/fast-band-digital-renderable-series)
    - [✅ The Band Series type](/docs/2d-charts/chart-types/fast-band-renderable-series)
    - [⭕ The Box Plot Series Type](/docs/2d-charts/chart-types/fast-box-plot-renderable-series)
    - [✅ The Bubble Series Type](/docs/2d-charts/chart-types/fast-bubble-renderable-series)
    - [✅ The Candlestick Series type](/docs/2d-charts/chart-types/fast-candlestick-renderable-series)
    - [✅ The Error Bars Chart Type](/docs/2d-charts/chart-types/fast-error-bars-renderable-series)
    - [✅ The Lollipop (Impulse or Stem) Chart Type](/docs/2d-charts/chart-types/fast-impulse-renderable-series)
    - [✅ The Digital (Step) Line Series](/docs/2d-charts/chart-types/fast-line-digital-renderable-series)
    - [✅ The Line Series Type](/docs/2d-charts/chart-types/fast-line-renderable-series)
    - [✅ The Digital (Step) Mountain Series Type](/docs/2d-charts/chart-types/fast-mountain-area-digital-renderable-series)
    - [✅ The Mountain (Area) Series Type](/docs/2d-charts/chart-types/fast-mountain-area-renderable-series)
    - [✅ The OHLC Series Type](/docs/2d-charts/chart-types/fast-ohlc-renderable-series)
    - [🔄 The Rectangle Series Type](/docs/2d-charts/chart-types/fast-rectangle-renderable-series)
    - [✅ The Text Series Type](/docs/2d-charts/chart-types/fast-text-renderable-series)
    - [🔄 The Line Segment Series Type](/docs/2d-charts/chart-types/line-segment-renderable-series)
    - [✅ The Non-Uniform Heatmap Chart Type](/docs/2d-charts/chart-types/non-uniform-heatmap-renderable-series)
    - [✅ The Pie Chart Type](/docs/2d-charts/chart-types/pie-chart-type)
    - [✅ The Polar Band Series Type](/docs/2d-charts/chart-types/polar-band-renderable-series)
    - [✅ The Polar Column Chart Type](/docs/2d-charts/chart-types/polar-column-renderable-series)
    - [✅ The Polar Gauge Chart Type](/docs/2d-charts/chart-types/polar-gauge-chart)
    - [✅ The Polar Line Chart Type](/docs/2d-charts/chart-types/polar-line-renderable-series)
    - [🔄 The Polar Mountain Chart Type](/docs/2d-charts/chart-types/polar-mountain-renderable-series)
    - [⭕ The Partial Polar Chart Type](/docs/2d-charts/chart-types/polar-partial-chart-type)
    - [✅ The Polar Pie Chart Type](/docs/2d-charts/chart-types/polar-pie-chart)
    - [✅ The Polar Radar Chart Type](/docs/2d-charts/chart-types/polar-radar-chart)
    - [🔄 The Polar Stacked Column Chart Type](/docs/2d-charts/chart-types/polar-stacked-column-renderable-series)
    - [🔄 The Polar Stacked Mountain Chart Type](/docs/2d-charts/chart-types/polar-stacked-mountain-renderable-series)
    - [🔄 The Polar Sunburst Chart Type](/docs/2d-charts/chart-types/polar-sunburst-chart)
    - [✅ The Polar Uniform Heatmap Chart Type](/docs/2d-charts/chart-types/polar-uniform-heatmap-renderable-series)
    - [✅ The Polar Scatter Chart Type](/docs/2d-charts/chart-types/polar-xy-scatter-renderable-series)
    - [✅ RenderDataTransforms API](/docs/2d-charts/chart-types/render-data-transforms-api)
    - [✅ RenderableSeries Overview](/docs/2d-charts/chart-types/renderable-series-api-overview)
    - [✅ The Bezier (Smoothed) Stacked Mountain Series Type](/docs/2d-charts/chart-types/smooth-stacked-mountain-renderable-series)
    - [✅ The Spline (Smoothed) Band Series Type](/docs/2d-charts/chart-types/spline-band-renderable-series)
    - [✅ The Spline (Smoothed) Line Series Type](/docs/2d-charts/chart-types/spline-line-renderable-series)
    - [✅ The Spline (Smoothed) Mountain Series Type](/docs/2d-charts/chart-types/spline-mountain-renderable-series)
    - [🔄 The Stacked Column Series Type](/docs/2d-charts/chart-types/stacked-column-renderable-series)
    - [✅ The Stacked Mountain Series Type](/docs/2d-charts/chart-types/stacked-mountain-renderable-series)
    - [⭕ The Treemap Chart Type](/docs/2d-charts/chart-types/tree-map-type)
    - [🔄 The Triangle Series Type](/docs/2d-charts/chart-types/triangle-renderable-series)
    - [✅ The Contours Series Type](/docs/2d-charts/chart-types/uniform-contours-renderable-series)
    - [✅ The Scatter Series Type](/docs/2d-charts/chart-types/xy-scatter-renderable-series)
  - **Builder (JSON Chart Definition) API**
    - [✅ Intro to the Builder API](/docs/2d-charts/builder-api/builder-api-overview)
    - [✅ Serialization and Deserialization of Charts](/docs/2d-charts/builder-api/charts-serialization-deserialization)
    - [✅ Complex Options](/docs/2d-charts/builder-api/complex-options)
    - [✅ Custom Subtypes](/docs/2d-charts/builder-api/custom-subtypes)
    - [✅ Creating a 3D Chart](/docs/2d-charts/builder-api/default-3d-chart)
    - [✅ Creating a Pie Chart](/docs/2d-charts/builder-api/pie-chart)
    - [✅ Creating a Polar Chart](/docs/2d-charts/builder-api/polar-chart)
    - [✅ Creating a Simple Chart](/docs/2d-charts/builder-api/simple-chart)
    - [✅ Working with Data](/docs/2d-charts/builder-api/working-with-data)
  - **Axis APIs**
    - **Axis Types**
      - [✅ The Category Axis](/docs/2d-charts/axis-api/axis-types/category-axis)
      - [✅ Common Axis Base Type and Options](/docs/2d-charts/axis-api/axis-types/common-axis-base-type)
      - [✅ The DateTimeNumericAxis](/docs/2d-charts/axis-api/axis-types/date-time-numeric-axis)
      - [✅ The Logarithmic Axis](/docs/2d-charts/axis-api/axis-types/logarithmic-axis)
      - [✅ The Numeric Axis](/docs/2d-charts/axis-api/axis-types/numeric-axis)
      - [✅ The Polar Category Axis](/docs/2d-charts/axis-api/axis-types/polar-category-axis)
      - [✅ The Polar Numeric Axis](/docs/2d-charts/axis-api/axis-types/polar-numeric-axis)
      - [✅ Text / String Axis](/docs/2d-charts/axis-api/axis-types/text-string-axis)
    - **✅ Axis Ranging, Scaling**
      - [✅ Axis Ranging - AutoRange](/docs/2d-charts/axis-api/ranging-scaling/auto-range)
      - [✅ Axis Ranging - How to Listen to VisibleRange Changes](/docs/2d-charts/axis-api/ranging-scaling/listen-to-visible-range-changes)
      - [✅ Axis Ranging - Set Range and Zoom to Fit](/docs/2d-charts/axis-api/ranging-scaling/set-range-zoom-to-fit)
    - **Axis Labels**
      - [✅ Custom LabelProviders: Dynamic Dates on Zoom](/docs/2d-charts/axis-api/axis-labels/custom-label-providers-dynamic-dates-on-zoom)
      - [✅ Custom LabelProviders: Readable Numbers](/docs/2d-charts/axis-api/axis-labels/custom-label-providers-readable-numbers)
      - [✅ Image Labels](/docs/2d-charts/axis-api/axis-labels/image-labels)
      - [✅ Axis LabelProvider API Overview](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview)
      - [✅ Label Style, Alignment and Positioning](/docs/2d-charts/axis-api/axis-labels/label-style-alignment-and-positioning)
      - [✅ Axis Labels - The ENumericFormat Enum](/docs/2d-charts/axis-api/axis-labels/numeric-formats)
      - [✅ Native Text Axis Labels](/docs/2d-charts/axis-api/axis-labels/performance-considerations-native-text-axis-abels)
      - [✅ Polar Axis Labels](/docs/2d-charts/axis-api/axis-labels/polar-axes-labels)
      - [✅ Rotating Axis Labels](/docs/2d-charts/axis-api/axis-labels/rotating-axis-labels)
      - [✅ Text and Multi-Line Labels](/docs/2d-charts/axis-api/axis-labels/text-and-multi-line-labels)
    - **✅ Axis Tick, Label Interval**
      - [✅ Fixed Label Intervals - Static Axis Feature](/docs/2d-charts/axis-api/axis-tick-label-interval/fixed-label-intervals-static-axis-feature)
      - [✅ Gridline and Label Spacing (Interval)](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval)
      - [✅ The TickProvider API](/docs/2d-charts/axis-api/axis-tick-label-interval/tick-provider-api)
    - **Multi Axis and Layout**
      - [✅ Advanced Options - Custom Layout Managers](/docs/2d-charts/axis-api/multi-axis-and-layout/advanced-options-custom-layout-managers)
      - [✅ Central Axis Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/central-axis-layout)
      - [✅ Horizontally Stacked Axis Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/horizontally-stacked-axis-layout)
      - [✅ Inner Axis Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout)
      - [⭕ Polar Chart Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/polar-chart-layout)
      - [✅ Secondary and Multiple Axes](/docs/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview)
      - [✅ Vertical Charts (Rotate, Transpose Axis)](/docs/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis)
      - [✅ Vertically Stacked Axis Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout)
    - **Axis Styling**
      - [✅ Axis Borders and Background](/docs/2d-charts/axis-api/axis-styling/axis-borders-and-background)
      - [⭕ Polar Axis Styling](/docs/2d-charts/axis-api/axis-styling/polar-axis-styling)
      - [✅ Title, Labels, Gridlines and Axis Band Style](/docs/2d-charts/axis-api/axis-styling/title-labels-gridlines-axis-band-style)
      - [✅ Visibility of Axis Elements](/docs/2d-charts/axis-api/axis-styling/visibility-of-axis-elements)
    - **Misc**
      - [✅ Axis APIs - Convert Pixel to Data Coordinates](/docs/2d-charts/axis-api/misc/pixel-and-data-coordinates)
      - [⭕ Axis APIs - Convert Polar Pixel to Data Coordinates](/docs/2d-charts/axis-api/misc/polar-pixel-and-data-coordinates)
    - [✅ Axis API Overview](/docs/2d-charts/axis-api/axis-api-overview)
  - **Animations API**
    - [✅ Animations API Overview](/docs/2d-charts/animations-api/aminations-api-overview)
    - [✅ Dataset Animations](/docs/2d-charts/animations-api/dataset-animations)
    - [✅ Generic Animations](/docs/2d-charts/animations-api/generic-animations)
    - [✅ Series Startup Animations](/docs/2d-charts/animations-api/series-startup-animations)
    - [✅ Style Transition Animations](/docs/2d-charts/animations-api/style-transition-animations)
  - **Annotations API**
    - **AxisMarkerAnnotation**
      - [✅ AxisMarkerAnnotation](/docs/2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview)
      - [✅ Image AxisMarkerAnnotation](/docs/2d-charts/annotations-api/axis-marker-annotation/image-axis-marker-annotation)
      - [✅ SVG Axis Marker Annotation](/docs/2d-charts/annotations-api/axis-marker-annotation/svg-axis-marker-annotation)
    - [✅ Annotation Hover](/docs/2d-charts/annotations-api/annotation-hover)
    - [✅ Annotations API Overview](/docs/2d-charts/annotations-api/annotations-api-overview)
    - [⭕ ArcAnnotation](/docs/2d-charts/annotations-api/arc-annotation)
    - [✅ BoxAnnotation](/docs/2d-charts/annotations-api/box-annotation)
    - [✅ CustomAnnotation](/docs/2d-charts/annotations-api/custom-annotation)
    - [✅ Editable Annotations](/docs/2d-charts/annotations-api/editable-annotations)
    - [✅ HorizontalLineAnnotation](/docs/2d-charts/annotations-api/horizontal-line-annotation)
    - [✅ HTML Annotations](/docs/2d-charts/annotations-api/html-annotation)
    - [✅ LineAnnotation](/docs/2d-charts/annotations-api/line-annotation)
    - [✅ LineArrowAnnotation](/docs/2d-charts/annotations-api/line-arrow-annotation)
    - [✅ NativeTextAnnotation](/docs/2d-charts/annotations-api/native-text-annotation)
    - [⭕ PolarArcAnnotation](/docs/2d-charts/annotations-api/polar-arc-annotation)
    - [✅ PolarPointerAnnotation](/docs/2d-charts/annotations-api/polar-pointer-annotation)
    - [✅ Styling Annotation Selection](/docs/2d-charts/annotations-api/styling-annotation-selection)
    - [✅ TextAnnotation](/docs/2d-charts/annotations-api/text-annotation)
    - [✅ VerticalLineAnnotation](/docs/2d-charts/annotations-api/vertical-line-annotation)
  - **ChartModifier API**
    - **Zooming and Panning**
      - [✅ MouseWheelZoomModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/mouse-wheel-zoom-modifier)
      - [✅ Easy Overview charts with SciChartOverview](/docs/2d-charts/chart-modifier-api/zooming-and-panning/overview)
      - [✅ PinchZoomModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/pinch-zoom-modifier)
      - [✅ RubberBandXyZoomModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/rubber-band-xy-zoom-modifier)
      - [✅ XAxisDragModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/x-axis-drag-modifier)
      - [✅ YAxisDragModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/y-axis-drag-modifier)
      - [✅ ZoomExtentsModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/zoom-extents-modifier)
      - [✅ ZoomPanModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier)
    - **CursorModifier**
      - [✅ Active Legends - CursorModifier output into a legend](/docs/2d-charts/chart-modifier-api/cursor-modifier/active-legends-cursor-modifier)
      - [✅ The CursorModifier Type](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview)
      - [✅ Customizing the CursorModifier Tooltip Container Appearance](/docs/2d-charts/chart-modifier-api/cursor-modifier/customizing-cursor-modifier-tooltip-container-appearance)
      - [Formatting CursorModifier Tooltip Items](/docs/2d-charts/chart-modifier-api/cursor-modifier/formatting-cursor-modifier-tooltip-items)
      - [✅ Interpolated Tooltip Values](/docs/2d-charts/chart-modifier-api/cursor-modifier/interpolated-tooltip-values)
    - **VerticalSliceModifier**
      - [Active Legends - VerticalSliceModifier output to a Legend](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/active-legends-vertical-slice-modifier)
      - [Customizing VerticalSliceModifier Tooltip Containers](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/customizing-vertical-slice-tooltip-container)
      - [Formatting VerticalSlice Tooltip Items](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/formatting-vertical-slice-tooltip-items)
      - [The VerticalSliceModifier Type](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview)
    - **Polar Chart Modifiers**
      - [✅ PolarArcZoomModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-arc-zoom-modifier)
      - [✅ PolarCursorModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-cursor-modifier)
      - [✅ PolarDataPointSelectionModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-data-point-selection-modifier)
      - [✅ PolarLegendModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-legend-modifier)
      - [✅ PolarMouseWheelZoomModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-mouse-wheel-zoom-modifier)
      - [✅ PolarPanModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-pan-modifier)
      - [✅ PolarZoomExtentsModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-zoom-extents-modifier)
    - [Legend Modifier](/docs/2d-charts/chart-modifier-api/miscellaneous-modifiers/legend-modifier)
    - **Selection**
      - [Annotation Hover](/docs/2d-charts/chart-modifier-api/selection/annotation-hover)
      - [DataPoint Selection](/docs/2d-charts/chart-modifier-api/selection/data-point-selection)
      - [Series Selection](/docs/2d-charts/chart-modifier-api/selection/series-selection)
    - **Custom Modifiers**
      - [Custom Chart Modifier API](/docs/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview)
      - [Detecting Clicks On Chart Parts with a Custom Modifier](/docs/2d-charts/chart-modifier-api/custom-modifiers/detecting-clicks-on-chart-parts)
    - [✅ What is the ChartModifier API](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview)
    - [✅ Common ChartModifiers Features](/docs/2d-charts/chart-modifier-api/common-features)
    - [Rollover Modifier](/docs/2d-charts/chart-modifier-api/rollover-modifier)
  - **✅ Subcharts API**
    - [✅ Worked Example: Dynamic Multi-panel charts with SubCharts](/docs/2d-charts/subcharts-api/exampe-dynamic-multi-panel-charts-with-sub-charts)
    - [✅ Worked Example: Resizable Multi Pane Charts with SubCharts](/docs/2d-charts/subcharts-api/example-resizable-multi-pane-charts-with-sub-charts)
    - [✅ Worked Example: Re-usable Chart Groups with SubCharts](/docs/2d-charts/subcharts-api/example-reusable-chart-groups-with-sub-charts)
    - [✅ Worked Example: Using SubCharts to create a Large Dashboard](/docs/2d-charts/subcharts-api/example-using-sub-charts-to-create-large-dashboard)
    - [✅ Combining Polar and Cartesian Charts](/docs/2d-charts/subcharts-api/polar-and-cartesian-sub-charts)
    - [✅ SubChart Sub Surface Transparency](/docs/2d-charts/subcharts-api/sub-chart-sub-surface-transparency)
    - [✅ SubCharts Html Container](/docs/2d-charts/subcharts-api/sub-charts-html-container)
    - [✅ SubCharts Positioning](/docs/2d-charts/subcharts-api/sub-charts-positioning)
    - [✅ What is the SubCharts API?](/docs/2d-charts/subcharts-api/subcharts-api-overview)
  - **Styling and Theming**
    - [✅ Chart Styling - Auto Coloring](/docs/2d-charts/styling-and-theming/auto-coloring)
    - [✅ Chart Styling - Chart Titles](/docs/2d-charts/styling-and-theming/chart-titles)
    - [✅ Chart Styling - Creating a Custom Theme](/docs/2d-charts/styling-and-theming/creating-custom-theme)
    - [✅ CSS Classes, Ids](/docs/2d-charts/styling-and-theming/css-classes-ids)
    - [✅ Series Styling - Dash Line Patterns](/docs/2d-charts/styling-and-theming/dash-line-patterns)
    - [✅ Chart Styling - Image, Transparent or Blurred Backgrounds](/docs/2d-charts/styling-and-theming/image-transparent-blurred-backgrounds)
    - [✅ Chart Styling - Margin and Padding](/docs/2d-charts/styling-and-theming/margin-and-padding)
    - [Polar Chart Styling](/docs/2d-charts/styling-and-theming/polar-chart-styling)
    - [✅ Chart Styling - Style Chart Parts in Code](/docs/2d-charts/styling-and-theming/style-chart-parts-in-code)
    - [✅ Chart Styling - ThemeManager API](/docs/2d-charts/styling-and-theming/theme-manager-api)
    - [✅ Chart Styling - Theming of Wait Loader](/docs/2d-charts/styling-and-theming/theming-of-wait-loader)
  - **Chart Synchronization APIs**
    - [✅ Synchronizing Multiple Charts](/docs/2d-charts/chart-synchronization-api/synchronizing-multiple-charts)
    - [Synchronizing Vertical Charts](/docs/2d-charts/chart-synchronization-api/synchronizing-vertical-charts)
  - **Accessibility**
    - [Color and Contrast](/docs/2d-charts/accessibility/color-and-contrast)
    - [✅ Creating Accessible Charts](/docs/2d-charts/accessibility/creating-accessible-charts)
    - [Keyboard Accessibility](/docs/2d-charts/accessibility/keyboard-accessibility)
    - [Voice Over](/docs/2d-charts/accessibility/voice-over)
  - **Miscellaneous APIs**
    - [Batching updates or Temporary Suspending Drawing](/docs/2d-charts/miscellaneous-apis/batching-updates-or-temporary-suspending-drawing)
    - [Glow and DropShadow Shader Effects](/docs/2d-charts/miscellaneous-apis/glow-and-dro-shadow-shader-effects)
    - [Native Text Api](/docs/2d-charts/miscellaneous-apis/native-text-api)
    - [✅ Ordered Rendering](/docs/2d-charts/miscellaneous-apis/ordered-rendering)
    - [✅ Retina Support and Browser Zoom](/docs/2d-charts/miscellaneous-apis/retina-support-and-browser-zoom)
  - **Performance Tips**
    - [Memory Best Practices](/docs/2d-charts/performance-tips/memory-best-practices)
    - [Memory Leak Debugging](/docs/2d-charts/performance-tips/memory-leak-debugging)
    - [✅ Performance Tips & Tricks](/docs/2d-charts/performance-tips/performance-tips-and-tricks)
- **3D Charts API**
  - **SciChart3D Basics**
    - [✅ Coordinates in 3D Space](/docs/3d-charts/scichart-3d-basics/coordinates-in-3d-space)
    - [✅ Creating your first SciChart3DSurface](/docs/3d-charts/scichart-3d-basics/scichart-3d-basics-overview)
    - [✅ SciChart3DSurface.create() vs. createSingle()](/docs/3d-charts/scichart-3d-basics/scichart-3d-surface-create-and-create-single)
    - [✅ The SciChartSurface Camera](/docs/3d-charts/scichart-3d-basics/scichart-surface-camera)
  - **Axis3D APIs**
    - [✅ Axis3D APIs Overview](/docs/3d-charts/axis-3d-api/axis-3d-api-overview)
    - [Axis3D Gridline and Label Spacing (Interval)](/docs/3d-charts/axis-3d-api/axis-3d-gridline-and-label-spacing-interval)
    - [Axis3D Text (Label) Formatting](/docs/3d-charts/axis-3d-api/axis-3d-text-label-formatting)
    - [✅ Numeric and Date Axis in SciChart3D](/docs/3d-charts/axis-3d-api/numeric-and-date-axis-in-scichart-3d)
  - **3D Chart Types**
    - [The Bubble 3D Chart Type](/docs/3d-charts/chart-types/bubble-3d-chart)
    - [The Column 3D Chart Type](/docs/3d-charts/chart-types/column-3d-chart)
    - [The Lines 3D Chart Type](/docs/3d-charts/chart-types/lines-3d-chart)
    - [The Scatter 3D Chart Type](/docs/3d-charts/chart-types/scatter-3d-chart)
    - [The SurfaceMesh 3D Chart Type](/docs/3d-charts/chart-types/surface-mesh-3d)
  - **ChartModifier 3D API**
    - **Zooming and Panning**
      - [Mouse Wheel Zoom Modifier 3D](/docs/3d-charts/chart-modifier-3d-api/zooming-and-panning/mouse-wheel-zoom-modifier-3d)
      - [Orbit Modifier 3D](/docs/3d-charts/chart-modifier-3d-api/zooming-and-panning/orbit-modifier-3d)
      - [Pinch Zoom Modifier 3D](/docs/3d-charts/chart-modifier-3d-api/zooming-and-panning/pinch-zoom-modifier-3d)
      - [Reset Camera Modifier 3D](/docs/3d-charts/chart-modifier-3d-api/zooming-and-panning/reset-camera-modifier-3d)
    - [Tooltip Modifier 3D](/docs/3d-charts/chart-modifier-3d-api/tooltip-modifier-3d)
- [API Documentation](/docs/typedoc)

<!-- generate-docs-toc.js end -->