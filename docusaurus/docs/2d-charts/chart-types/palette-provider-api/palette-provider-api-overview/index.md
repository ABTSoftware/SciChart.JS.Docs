---
sidebar_position: 1
---

# ✅ PaletteProvider API Overview

SciChart.js features the ability to change color of series on a point-by-point basis, using the PaletteProvider feature.

Many series types support PaletteProvider, including:

*   Line Series ([FastLineRenderableSeries](/docs/2d-charts/chart-types/fast-line-renderable-series/index.mdx))
*   Mountain Series ([FastMountainRenderableSeriers](/docs/2d-charts/chart-types/fast-mountain-area-renderable-series/index.md))
*   Band Series ([FastBandRenderableSeries](/docs/2d-charts/chart-types/fast-band-renderable-series/index.md))
*   Bubble Series ([FastBubbleRenderableSeries](/docs/2d-charts/chart-types/fast-bubble-renderable-series/index.md))
*   Candlestick Series ([FastCandlestickRenderableSeries](/docs/2d-charts/chart-types/fast-candlestick-renderable-series/index.md))
*   OHLC Series ([FastOhlcRenderableSeries](/docs/2d-charts/chart-types/fast-ohlc-renderable-series/index.md))
*   Column Series ([FastColumnRenderableSeries](/docs/2d-charts/chart-types/fast-column-renderable-series/column-series-type/index.md))
*   Scatter Series ([XyScatterRenderableSeries](/docs/2d-charts/chart-types/xy-scatter-renderable-series/index.md))
*   Polar Band Series ([PolarBandRenderableSeries](/docs/2d-charts/chart-types/polar-band-renderable-series/index.mdx))
*   Polar Column Series ([PolarColumnRenderableSeries](/docs/2d-charts/chart-types/polar-column-renderable-series/index.mdx))
*   Polar Line Series ([PolarLineRenderableSeries](/docs/2d-charts/chart-types/polar-line-renderable-series/index.mdx))
*   Polar Mountain Series ([PolarMountainRenderableSeries](/docs/2d-charts/chart-types/polar-mountain-renderable-series/README.mdx))
*   Polar Scatter Series ([PolarXyScatterRenderableSeries](/docs/2d-charts/chart-types/polar-xy-scatter-renderable-series/index.mdx))

What is the PaletteProvider API?
--------------------------------

The PaletteProvider API allows you to achieve per data-point colouring or styling. Here is a quick example below. The following pages have further worked examples for each series type.

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/chart-color-points-individually-with-paletteprovider" title="Coloring Series per-point using PaletteProvider" description="showing how to color data-points based on a rule." />

<br/>
The PaletteProvider API is a powerful extension in SciChart.js which allows you to colour line segments, scatter points, candles/columns or mountain chart segments based on a programatic rule.

Some common Use-cases for the PaletteProvider
---------------------------------------------

Some common use-cases for the PaletteProvider API include:

*   Changing colour of a line series when value exceeds a threshold.
*   Colouring candlesticks based on volume
*   Changing the Fill of a time-based Histogram based on day of the week
*   Highlighting important Scatter or Bubble points based on additional data.

:::tip
Use this API any time you want to change the colour, fill or scatter-point colours programmatically on a per-datapoint basis.
:::

Enabling the PaletteProvider
----------------------------

To enable the paletting feature, you need to create a class which conforms to the [IStrokePaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html), [IFillPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) or [IPointMarkerPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmarkerpaletteprovider.html) interfaces and assign a new instance of the class to the [IRenderableSeries.paletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/irenderableseries.html#paletteprovider) property.

The following articles in this section show you how to do this for each series type:

* [Per-point Colouring of Line Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series/index.md)
* [Per-point Colouring of Mountain Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-mountain-renderable-series/index.md)
* [Per-Point Colouring of Band Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series/index.md)
* [Per-Point Colouring of Bubble Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-bubble-renderable-series/index.md)
* [Per-Point Colouring of Candlestick / OHLC Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-candlestick-ohlc-renderable-series/index.md)
* [Per-Point Colouring of Scatter Charts (or PointMarkers)](/docs/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series/index.md)
* [Per-Point Colouring of Column Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series/index.md)
* [Per-Point Colouring of Impulse Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-impulse-renderable-series/index.md)
* [Per-Point Coloring for Rectangle Series](/docs/2d-charts/chart-types/palette-provider-api/fast-rectangle-renderable-series/index.md)
* [Per-Point Coloring for Line Segment Series](/docs/2d-charts/chart-types/palette-provider-api/line-segment-renderable-series/index.md)
* [Per-Point Coloring for Triangle Series](/docs/2d-charts/chart-types/palette-provider-api/triangle-renderable-series/index.md)
* [Per-Point Coloring for Polar Band Series](/docs/2d-charts/chart-types/palette-provider-api/polar-band-renderable-series/index.md)
* [Per-Point Coloring for Polar Column Series](/docs/2d-charts/chart-types/palette-provider-api/polar-column-renderable-series/index.md)
* [Per-Point Coloring for Polar Line Series](/docs/2d-charts/chart-types/palette-provider-api/polar-line-renderable-series/index.md)
* [Per-Point Coloring for Polar Mountain Series](/docs/2d-charts/chart-types/palette-provider-api/polar-mountain-renderable-series/index.md)
* [Per-Point Coloring for Polar Stacked Column Series](/docs/2d-charts/chart-types/palette-provider-api/polar-stacked-column-renderable-series/index.md)
* [Per-Point Coloring for Polar Stacked Mountain Series](/docs/2d-charts/chart-types/palette-provider-api/polar-stacked-mountain-renderable-series/index.md)
* [Per-Point Coloring for Polar Scatter Series](/docs/2d-charts/chart-types/palette-provider-api/polar-xy-scatter-renderable-series/index.md)
