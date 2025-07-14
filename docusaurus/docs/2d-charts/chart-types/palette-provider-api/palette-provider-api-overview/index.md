---
sidebar_position: 1
---

# PaletteProvider API Overview

SciChart.js features the ability to change color of series on a point-by-point basis, using the PaletteProvider feature.

Many series types support PaletteProvider, including:

*   Line Series ([FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series))
*   Mountain Series ([FastMountainRenderableSeriers](/2d-charts/chart-types/fast-mountain-area-renderable-series))
*   Band Series ([FastBandRenderableSeries](/2d-charts/chart-types/fast-band-renderable-series))
*   Bubble Series ([FastBubbleRenderableSeries](/2d-charts/chart-types/fast-bubble-renderable-series))
*   Candlestick Series ([FastCandlestickRenderableSeries](/2d-charts/chart-types/fast-candlestick-renderable-series))
*   OHLC Series ([FastOhlcRenderableSeries](/2d-charts/chart-types/fast-ohlc-renderable-series))
*   Column Series ([FastColumnRenderableSeries](/2d-charts/chart-types/fast-column-renderable-series/column-series-type))
*   Scatter Series ([XyScatterRenderableSeries](/2d-charts/chart-types/xy-scatter-renderable-series))
*   Polar Band Series ([PolarBandRenderableSeries](/2d-charts/chart-types/polar-band-renderable-series))
*   Polar Column Series ([PolarColumnRenderableSeries](/2d-charts/chart-types/polar-column-renderable-series))
*   Polar Line Series ([PolarLineRenderableSeries](/2d-charts/chart-types/polar-line-renderable-series))
*   Polar Mountain Series ([PolarMountainRenderableSeries](/2d-charts/chart-types/polar-mountain-renderable-series))
*   Polar Scatter Series ([PolarXyScatterRenderableSeries](/2d-charts/chart-types/polar-xy-scatter-renderable-series))

What is the PaletteProvider API?
--------------------------------

The PaletteProvider API allows you to achieve per data-point colouring or styling. Here is a quick example below. The following pages have further worked examples for each series type.

<ChartFromSciChartDemo 
    src="https://scichart.com/demo/iframe/chart-color-points-individually-with-paletteprovider" 
    title="Coloring Series per-point using PaletteProvider" 
    description="showing how to color data-points based on a rule." 
/>

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

To enable the paletting feature, you need to create a class which conforms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html), [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) or [IPointMarkerPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmarkerpaletteprovider.html) interfaces and assign a new instance of the class to the [IRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/irenderableseries.html#paletteprovider) property.

The following articles in this section show you how to do this for each series type:

* [Per-point Colouring of Line Segments](/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series)
* [Per-point Colouring of Mountain Segments](/2d-charts/chart-types/palette-provider-api/fast-mountain-renderable-series)
* [Per-Point Colouring of Band Segments](/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series)
* [Per-Point Colouring of Bubble Charts](/2d-charts/chart-types/palette-provider-api/fast-bubble-renderable-series)
* [Per-Point Colouring of Candlestick / OHLC Charts](/2d-charts/chart-types/palette-provider-api/fast-candlestick-ohlc-renderable-series)
* [Per-Point Colouring of Scatter Charts (or PointMarkers)](/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series)
* [Per-Point Colouring of Column Charts](/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series)
* [Per-Point Colouring of Impulse Charts](/2d-charts/chart-types/palette-provider-api/fast-impulse-renderable-series)
* [Per-Point Coloring for Rectangle Series](/2d-charts/chart-types/palette-provider-api/fast-rectangle-renderable-series)
* [Per-Point Coloring for Line Segment Series](/2d-charts/chart-types/palette-provider-api/fast-line-segment-renderable-series/index.md)
* [Per-Point Coloring for Triangle Series](/2d-charts/chart-types/palette-provider-api/fast-triangle-renderable-series/index.md)
* [Per-Point Coloring for Polar Band Series](/2d-charts/chart-types/palette-provider-api/polar-band-renderable-series)
* [Per-Point Coloring for Polar Column Series](/2d-charts/chart-types/palette-provider-api/polar-column-renderable-series)
* [Per-Point Coloring for Polar Line Series](/2d-charts/chart-types/palette-provider-api/polar-line-renderable-series)
<!-- * [Per-Point Coloring for Polar Mountain Series](/2d-charts/chart-types/palette-provider-api/polar-mountain-renderable-series)-->
<!-- * [Per-Point Coloring for Polar Stacked Column Series](/2d-charts/chart-types/palette-provider-api/polar-stacked-column-renderable-series) -->
<!-- * [Per-Point Coloring for Polar Stacked Mountain Series](/2d-charts/chart-types/palette-provider-api/polar-stacked-mountain-renderable-series) -->
* [Per-Point Coloring for Polar Scatter Series](/2d-charts/chart-types/palette-provider-api/polar-xy-scatter-renderable-series)
