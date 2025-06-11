---
sidebar_position: 1
---

# ✅ RenderableSeries Overview

The RenderableSeries in SciChart are visual representations of **X,Y Numeric** or **Date** data. Other libraries call them 'Chart Types'.

Some RenderableSeries render simple X,Y values (2D points in space), while some render additional information (such as X,Y0,Y1 values, or X,Y,Z values).

Chart Types in SciChart.js
------------------------------

SciChart.js supports a number of 2D & 3D Chart types. These include:

![](img/1.jpg)

|  |  |
|---|---|
| [Line Series](/docs/2d-charts/chart-types/fast-line-renderable-series/index.md) | [Uniform Heatmap Series](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/index.md) |
| [Digital (Step) Line Series](/docs/2d-charts/chart-types/fast-line-digital-renderable-series/index.md) | [Non-Uniform Heatmap Series](/docs/2d-charts/chart-types/non-uniform-heatmap-renderable-series/index.md) |
| [Spline Line Series](/docs/2d-charts/chart-types/spline-line-renderable-series/index.md) | [Heatmap Contours Series](/docs/2d-charts/chart-types/uniform-contours-renderable-series/index.md) |
| [Mountain (Area) Series](/docs/2d-charts/chart-types/fast-mountain-area-renderable-series/index.md) | [Candlestick Series](/docs/2d-charts/chart-types/fast-candlestick-renderable-series/index.md) |
| [Digital (Step) Mountain Series](/docs/2d-charts/chart-types/fast-mountain-area-digital-renderable-series/index.md) | [OHLC Series](/docs/2d-charts/chart-types/fast-ohlc-renderable-series/index.md) |
| [Spline Mountain Series](/docs/2d-charts/chart-types/spline-mountain-renderable-series/index.md) | [Lollipop (Impulse or Stem) Series](/docs/2d-charts/chart-types/fast-impulse-renderable-series/index.md) |
| [Column Series](/docs/2d-charts/chart-types/fast-column-renderable-series/column-series-type/index.md) | [Error Bars Series](/docs/2d-charts/chart-types/fast-error-bars-renderable-series/index.md) |
| [Stacked (Grouped) Column Series](/docs/2d-charts/chart-types/stacked-column-renderable-series/index.mdx) | [Fan Charts](/docs/2d-charts/chart-types/fan-charts-type/index.md) |
| [100% Stacked Column Series](/docs/2d-charts/chart-types/stacked-column-renderable-series/index.mdx)  | [Pie Charts](/docs/2d-charts/chart-types/pie-chart-type/index.md) |
| [Stacked Mountain Series](/docs/2d-charts/chart-types/stacked-mountain-renderable-series/index.md) | [Donut Charts](/docs/2d-charts/chart-types/donut-chart-type/index.md) |
| [100% Stacked Mountain Series](/docs/2d-charts/chart-types/stacked-mountain-renderable-series/index.md) | [Band (High-Low Fill) Series](/docs/2d-charts/chart-types/fast-band-renderable-series/index.md) |
| [Smooth Stacked Mountain Series](/docs/2d-charts/chart-types/smooth-stacked-mountain-renderable-series/index.md) | [Digital (Step) Band (High-Low Fill) Series](/docs/2d-charts/chart-types/fast-band-digital-renderable-series/index.md) |
| [Scatter Series](/docs/2d-charts/chart-types/xy-scatter-renderable-series/index.md) | [Text Series](/docs/2d-charts/chart-types/fast-text-renderable-series/index.md) |
| [Bubble Series](/docs/2d-charts/chart-types/fast-bubble-renderable-series/index.md) | [Triangle series](/docs/2d-charts/chart-types/triangle-renderable-series/index.mdx) |
| [Rectangle series](/docs/2d-charts/chart-types/fast-rectangle-renderable-series/index.mdx) | [Treemap chart](/docs/2d-charts/chart-types/tree-map-type/index.md) |
| [Box plot series](/docs/2d-charts/chart-types/fast-box-plot-renderable-series/index.md) | [Line Segment Series](/docs/2d-charts/chart-types/line-segment-renderable-series/index.mdx) |
| [Polar Partial Chart](/docs/2d-charts/chart-types/polar-partial-chart-type/index.md) | [Polar Line Series](/docs/2d-charts/chart-types/polar-line-renderable-series/index.mdx) |
| [Polar Band Series](/docs/2d-charts/chart-types/polar-band-renderable-series/index.mdx) | [Polar Column (Area) Series](/docs/2d-charts/chart-types/polar-column-renderable-series/index.mdx) |
| [Polar Heatmap Series](/docs/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/index.mdx) | [Polar Mountain Series](/docs/2d-charts/chart-types/polar-mountain-renderable-series/README.mdx) |
| [Polar Pie Chart](/docs/2d-charts/chart-types/polar-pie-chart/index.mdx) | [Polar Scatter Series](/docs/2d-charts/chart-types/polar-xy-scatter-renderable-series/index.mdx) |
| [Polar Stacked Column Series](/docs/2d-charts/chart-types/polar-stacked-column-renderable-series/index.mdx) | [Polar Stacked Mountain Series](/docs/2d-charts/chart-types/polar-stacked-mountain-renderable-series/index.mdx) |
| [Polar Gauge Chart](/docs/2d-charts/chart-types/polar-gauge-chart/index.mdx) | |

:::tip
Click on the links above to see documentation and live embedded code snippets for each of the chart types in SciChart.js
:::

Common 2D Chart Features
----------------------------

As well as just render 2D Data, a number of chart types support additional properties and features.

For example, most 2D Chart types in SciChart.js support:

| SciChart.js Feature | Description |
|---------------------|-------------|
| **Dynamic Data Updates** | All SciChart.js chart types support dynamic updates to data out of the box. Insert, append, update, delete - modify data and the chart updates FAST. See the [DataSeries API documentation](/docs/2d-charts/chart-types/data-series-api/data-series-api-overview/index.md) for more details. |
| **Per-point coloring** | SciChart.js chart types support per-point coloring based on a rule. Xy values over/under a threshold, values with a property can be colored individually. See the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/index.md) for more details. |
| **Data-point markers** | SciChart.js chart types support adding a pointmarker (circle, square, triangle, cross marker) at data-points. See the [PointMarkers documentation](/docs/2d-charts/chart-types/common-series-apis/drawing-point-markers/index.md) for more details. |
| **Data-point Text Labels** | SciChart.js supports fast, WebGL based text labels at datapoints, which can be customised. See the [DataLabels API](/docs/2d-charts/chart-types/data-point-labels/data-labels-api-overview/index.mdx) for more details. |
| **Render Data Transforms** | Allows transforming data right before rendering. Used, for example, to add or remove data points just before rendering. See the [RenderDataTransforms API](/docs/2d-charts/chart-types/render-data-transforms-api/index.md) |
| **Showing / hiding series** | You can show/hide series in SciChart.js as well as be notified when a series is hidden. See the [isVisibleChanged documentation](/docs/2d-charts/chart-types/common-series-apis/is-visible/index.md) for more details. |
| **Select series** | Using a ChartModifier (an attached behaviour) you can add Series Selection, Hover callbacks and styling into SciChart.js. See the [SeriesSelectionModifier documentation](/docs/2d-charts/chart-modifier-api/selection/series-selection/index.md) for more details. |
| **Select data-points** | Using a ChartModifier (attached behaviour), you can add data-point selection detection, callbacks and styling into SciChart.js. See the [DataPointSelectionModifier](/docs/2d-charts/chart-modifier-api/selection/data-point-selection/index.md) docs for more details. |
| **Tooltips and Cursors** | Of course, SciChart.js supports customisable tooltips and cursors using ChartModifiers (attached behaviour). See the [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview/index.md) or [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier/index.md) docs for more details. |
| **Nulls (Gaps) in Data** | For line charts, mountain charts and 2D cartesian chart types you can draw nulls (gaps) in data, or even change style in the line using a technique we have. See the [Drawing Gaps in Series](/docs/2d-charts/chart-types/common-series-apis/drawing-gaps/index.md) documentation for more details. |

:::tip
We are continually improving and adding features to SciChart.js. Some of the things on the roadmap are: more chart types, more interactions & even allowing custom drawing.
:::

The RenderableSeries Class
------------------------------

All 2D Chart types in SciChart.js are derived from the [BaseRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html) type. This is a JavaScript class which is added to the [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection and is rendered using our own proprietary WebAssembly / WebGL based rendering engine.

Each RenderableSeries is rendered to the screen, displaying the data from an associated [DataSeries](/docs/2d-charts/chart-types/data-series-api/data-series-api-overview/index.md).

### Renderable Series Properties

The properties common to the [BaseRenderableSeries class:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html) are listed below.

**BaseRenderableSeries** **property**

Here's the converted content in a two-column Markdown table with headers:

| Property | Description |
|----------|-------------|
| **[dataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#datalabelprovider)** | (New to v3.0) The dataLabelprovider allows creation of per **data-point text labels**. Please see the [Data Labels API](/docs/2d-charts/chart-types/data-point-labels/data-labels-api-overview/index.mdx) section for a complete walk-through of text labels on chart series. |
| **[dataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#dataseries)** | The DataSeries is the data-source for the RenderableSeries. Please see [DataSeries API](/docs/2d-charts/chart-types/data-series-api/data-series-api-overview/index.md) section for a complete walk-through of the DataSeries API |
| **[drawNanAs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#drawnanas)** | How to treat NAN (Not a number) values in the input dataSeries. See [ELineDrawMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/elinedrawmode.html) for a list of values. |
| **[renderDataTransform:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/baserenderableseries.html#renderdatatransform)** | (New to v3.4) A [RenderDataTransform](/docs/2d-charts/chart-types/render-data-transforms-api/index.md) may be optionally applied to a RenderableSeries to transform data immediately before drawing. Can be used to change the visual output e.g. create interpolated series, insert points into series and change styles in a series without changing the data. |
| **[pointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker)** | A [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointmarker.html) is used to draw an **optional point-marker at each data-point**. Applicable to some series types only. |
| **[stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#stroke)** | A Stroke for lines, outlines and edges of this RenderableSeries. Acceptable values include RGB format e.g. "#FF0000", RGBA format e.g. "#FF000077" and RGBA format e.g. "rgba(255,0,0,0.5)" |
| **[strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#strokethickness)** | The Stroke Thickness for lines, outlines and edges of this RenderableSeries |
| **[strokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html#strokedasharray)** | Some chart types which support lines (e.g. Line series, Spline Line series, Mountain Series) support dashed lines. This property accepts an array which defines [dot, dash] length in pixels |
| **[opacity:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#opacity)** | An Opacity factor of the Series that controls its semi-transparency level, where value 1 means the Series is opaque; 0 means transparent. |
| **[xAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#xaxisid)** | The XAxisId of the series allows you to attach a series to a specific axis. If you only have single X and Y Axis you can leave this default. |
| **[xAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/baserenderableseries.html#xaxis)** | Link to the associated X Axis |
| **[yAxisId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#yaxisid)** | The YAxisId of the series allows you to attach a series to a specific axis. If you only have single X and Y Axis you can leave this default. |
| **[yAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/baserenderableseries.html#yaxis)** | Link to the associated Y Axis |
| **[isvisible:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisible)** | When true, the series is visible. To hide a series, set IsVisible = false. |
| **[isVisibleChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisiblechanged)** | An [EventHandler:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/eventhandler.html) allowing you to subscribe to isVisible changed callbacks |
| **[effect:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#effect)** | An optional [ShaderEffect](/docs/2d-charts/miscellaneous-apis/glow-and-dro-shadow-shader-effects/index.md) for modifying the render output of a RenderableSeries. |
| **[paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#paletteprovider)** | The PaletteProvider API **allows changing the color of a series on a per-point basis**. For more details about the PaletteProvider API see the individual examples for [Line Series](/docs/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series/index.md), [Column Series](/docs/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series/index.md) etc... |
| **[hitTestProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#hittestprovider)** | The [HitTestProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ihittestprovider.html) exposes the [Hit-Test API](Hit-Test API.html), used to **determine whether a series has been clicked on, hovered** or find the nearest Xy datapoint to a mouse coordinate. |

### Constructor options on RenderableSeries

Every RenderableSeries has a set of constructor options allowing for fast initialization and setup by passing in a javascript object. Each property reflected on the series has an optional constructor option parameter.

For example this code:

**Setting properties of series**

```ts
const lineSeries = new FastLineRenderableSeries(wasmContext);
lineSeries.stroke = "Red";
lineSeries.strokeThickness = 3;
lineSeries.dataSeries = new XyDataSeries(wasmContext, {xValues, yValues});
lineSeries.isVisible = true;
lineSeries.opacity = 0.7;
```

is equivalent to this:

**Constructor parameters of series**

```ts
const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "Red",
    strokeThickness: 3,
    dataSeries: new XyDataSeries(wasmContext, {xValues, yValues}),
    isVisible: true,
    opacity: 0.7
});
```

Where Next?
---------------

To learn about a specific chart type, and to find out how to configure them, visit the following pages:

*   [The Line Series Type](/docs/2d-charts/chart-types/fast-line-renderable-series/index.md)
*   [The Scatter Series Type](/docs/2d-charts/chart-types/xy-scatter-renderable-series/index.md)
*   [The Mountain Series Type](/docs/2d-charts/chart-types/fast-mountain-area-renderable-series/index.md)
* [The Column Series Type](/docs/2d-charts/chart-types/fast-column-renderable-series/column-series-type/index.md)
* [The Candlestick Series type](/docs/2d-charts/chart-types/fast-candlestick-renderable-series/index.md)
* [The OHLC Series Type](/docs/2d-charts/chart-types/fast-ohlc-renderable-series/index.md)
* [The Uniform Heatmap Chart Type](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/index.md)
* [The Polar Column Chart Type](/docs/2d-charts/chart-types/polar-column-renderable-series/index.mdx)
