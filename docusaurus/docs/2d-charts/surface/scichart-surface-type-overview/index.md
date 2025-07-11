---
sidebar_position: 0
---

# The SciChartSurface Type

:::tip
Are you new to SciChart? Check out our most popular pages to get started below:
* [SciChart.js Vanilla JavaScript Tutorials](/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js)   
* [Series or Chart Types](/2d-charts/chart-types/renderable-series-api-overview)
* [Axis Types and Configuration](/2d-charts/axis-api/axis-api-overview)
* [Zooming & Panning](/2d-charts/chart-modifier-api/zooming-and-panning/overview)
* [Tooltips](/2d-charts/chart-modifier-api/rollover-modifier)
* [Annotations and Markers](/2d-charts/annotations-api/annotations-api-overview)
* [Styling and Themeing](/2d-charts/styling-and-theming/theme-manager-api)
* [Chart Synchronization APIs](/2d-charts/chart-synchronization-api/synchronizing-multiple-charts)
* [3D charts Basics](/3d-charts/scichart-3d-basics/scichart-3d-basics-overview) 
:::

## The basics of the SciChartSurface Type

The root 2D chart view is called the [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html). This is the JavaScript chart control you will be adding to your applications wherever you need a chart. You can add more than one SciChartSurface to an HTML page, you can configure them independently, and you can link them together.

The [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) has a number of properties and functions which allow you to configure and control the chart.

:::tip
Info about the properties and functions available can be found at the [TypeDoc API Documentation for SciChart:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html).
:::

## Series or Chart Types

A [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) has collections of RenderableSeries (see [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#renderableseries)), which form the series or chart types on the chart. Each RenderableSeries must have a DataSeries (see [DataSeries types](/2d-charts/chart-types/data-series-api/data-series-api-overview)) which defines the data for that chart type.

```mermaid
---
title: SciChartSurface Class Diagram
---
classDiagram
    SciChartSurface --> "many" IRenderableSeries : renderableSeries
    SciChartSurface : IRenderableSeries[] renderableSeries
    SciChartSurface : AxisBase2D[] xAxes
    SciChartSurface : AxisBase2D[] yAxes
    SciChartSurface : annotations[] IAnnotation
    SciChartSurface : chartModifiers[] IChartModifierBase
    SciChartSurface : ...
    SciChartSurface : zoomExtents()
    SciChartSurface : invalidateElement()
    SciChartSurface : ... ()
    IRenderableSeries --> IDataSeries
    IRenderableSeries : IDataSeries dataSeries
    IRenderableSeries : string stroke
    IRenderableSeries : string strokeThickness
    IRenderableSeries : AxisCore xAxis
    IRenderableSeries : AxisCore yAxis
    IRenderableSeries : boolean isVisible
    IRenderableSeries : IPaletteProvider paletteProvider
    IRenderableSeries : ...
    IRenderableSeries <|-- FastLineRenderableSeries : implements
    IRenderableSeries <|-- XyScatterRenderableSeries : implements
    IRenderableSeries <|-- PolarLineRenderableSeries : implements
    IDataSeries : count()
    IDataSeries <|-- XyDataSeries : implements
    IDataSeries <|-- OhlcDataSeries : implements
    IDataSeries <|-- XyNDataSeries : implements
```

Several RenderableSeries types are available in SciChart, including

* [Line Charts](/2d-charts/chart-types/fast-line-renderable-series)
* [Scatter Charts](/2d-charts/chart-types/xy-scatter-renderable-series)
* [Column Charts](/2d-charts/chart-types/fast-column-renderable-series/column-series-type)
* [Mountain Charts](/2d-charts/chart-types/fast-mountain-area-renderable-series)
* [Band Charts](/2d-charts/chart-types/fast-band-renderable-series)
* [Candlestick Charts](/2d-charts/chart-types/fast-candlestick-renderable-series)
* [Ohlc Charts](/2d-charts/chart-types/fast-ohlc-renderable-series)
* [Polar Line Charts](/2d-charts/chart-types/polar-line-renderable-series)
* [Polar Column Charts](/2d-charts/chart-types/polar-column-renderable-series) and more.

> For more information about chart types in SciChart, head over to the [RenderableSeries API documentation](/2d-charts/chart-types/renderable-series-api-overview) or see our [Examples](https://scichart.com/demo/react).

## Axis and Axis Types

A [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) has a collection of X-Axis and Y-Axis (see [sciChartSurface.xAxes:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#xaxes) collection). Each SciChartSurface can have unlimited, multiple X and Y Axis. SciChart is unique in that you can place axis on the left, right, top, bottom, but [you can also rotate the chart](/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis) to have an XAxis on the left and YAxis on the top. It is this configurability which gives SciChart it's edge over other charting libraries.

```mermaid
classDiagram
    SciChartSurface --> "many" AxisBase2D : xAxis or yAxis
    SciChartSurface : IRenderableSeries[] renderableSeries
    SciChartSurface : AxisBase2D[] xAxes
    SciChartSurface : AxisBase2D[] yAxes
    SciChartSurface : annotations[] IAnnotation
    SciChartSurface : chartModifiers[] IChartModifierBase
    SciChartSurface : ...
    SciChartSurface : zoomExtents()
    SciChartSurface : invalidateElement()
    SciChartSurface : ... ()
    AxisBase2D : string id
    AxisBase2D : NumberRange visibleRange
    AxisBase2D : boolean isVisible
    AxisBase2D : ...
    AxisBase2D <|-- NumericAxis : extends
    AxisBase2D <|-- CategoryAxis : extends
```

A few axis types are available in SciChart, such as [Value Axis and Category Axis](/2d-charts/axis-api/axis-types/category-axis). Axis may be configured by setting [gridline interval](/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval), gridline styling, titles, labels and more. 

> For more information about Axis types and configuration in SciChart, head over to the [Axis API documentation](/2d-charts/axis-api/axis-api-overview) or see our [Examples](https://scichart.com/demo/react).

## Annotations and Markers

A [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) has a collection of Annotations (see [sciChartSurface.annotations:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurfacebase.html#annotations) collection). Annotations are markers (text, labels, lines, custom shapes) which can be placed arbitrarily over the chart ([see types of annotation here](/2d-charts/annotations-api/annotations-api-overview)), independent of chart types (series) or data. As the chart zooms and pans, the annotations move with the chart, however there is also an [xCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/annotationbase.html#xcoordinatemode) and [yCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/annotationbase.html#ycoordinatemode) property on Annotations which allows you to place watermarks, or dock annotations to the left, right, top, bottom or centre of a chart.

```mermaid
classDiagram
    SciChartSurface --> "many" IAnnotation
    SciChartSurface : IRenderableSeries[] renderableSeries
    SciChartSurface : AxisBase2D[] xAxes
    SciChartSurface : AxisBase2D[] yAxes
    SciChartSurface : annotations[] IAnnotation
    SciChartSurface : chartModifiers[] IChartModifierBase
    SciChartSurface : ...
    SciChartSurface : zoomExtents()
    SciChartSurface : invalidateElement()
    SciChartSurface : ... ()
    IAnnotation : AxisBase2D xAxis
    IAnnotation : AxisBase2D yAxis
    IAnnotation : number x1
    IAnnotation : number x2
    IAnnotation : number y1
    IAnnotation : number y2
    IAnnotation : boolean isEditable
    IAnnotation : boolean isHidden
    IAnnotation : ...
    IAnnotation <|-- SvgAnnotationBase : implements
    IAnnotation <|-- BoxAnnotation : implements
    IAnnotation <|-- LineAnnotation : implements
    IAnnotation <|-- TextAnnotation : implements
    IAnnotation <|-- PolarArcAnnotation : implements
```

> For more information about Annotations types in SciChart, head over to the [Annotations API documentation](/2d-charts/annotations-api/annotations-api-overview) or see our [Examples](https://scichart.com/demo/react).

## Interaction - Zooming, Panning and Tooltips

Zooming, Panning, interaction such as Tooltips and Legends are provided by [ChartModifiers](/2d-charts/chart-modifier-api/chart-modifier-api-overview). Several modifiers exist out of the box such as the [ZoomPanModifier](/2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier), [RubberBandXyZoomModifier](/2d-charts/chart-modifier-api/zooming-and-panning/rubber-band-xy-zoom-modifier) and [MouseWheelZoomModifier](/2d-charts/chart-modifier-api/zooming-and-panning/mouse-wheel-zoom-modifier). Tooltips and Legends are also provided by modifiers - see the [RolloverModifier](/2d-charts/chart-modifier-api/rollover-modifier) and [LegendModifier](/2d-charts/chart-modifier-api/miscellaneous-modifiers/legend-modifier). You can also create your own modifiers and handle mouse interactions and provide custom behaviours to the chart using this powerful and flexible API.

```mermaid
classDiagram
    SciChartSurface --> "many" IChartModifierBase
    SciChartSurface : IRenderableSeries[] renderableSeries
    SciChartSurface : AxisBase2D[] xAxes
    SciChartSurface : AxisBase2D[] yAxes
    SciChartSurface : annotations[] IAnnotation
    SciChartSurface : chartModifiers[] IChartModifierBase
    SciChartSurface : ...
    SciChartSurface : zoomExtents()
    SciChartSurface : invalidateElement()
    SciChartSurface : ... ()
    IChartModifierBase : boolean isEnabled
    IChartModifierBase : modifierMouseDown()
    IChartModifierBase : modifierMouseEnter()
    IChartModifierBase : modifierMouseLeave()
    IChartModifierBase : modifierMouseMove()
    IChartModifierBase : modifierMouseUp()
    IChartModifierBase : modifierMouseWheel()
    IChartModifierBase : modifierDoubleClick()
    IChartModifierBase <|-- ZoomPanModifier : implements
    IChartModifierBase <|-- RolloverModifier : implements
    IChartModifierBase <|-- LegendModifier : implements
    IChartModifierBase <|-- PolarArcZoomModifier : implements
```

> For more information about Chart Modifier types in SciChart, head over to the [ChartModifier API documentation](/2d-charts/chart-modifier-api/chart-modifier-api-overview) or see our [Examples](https://scichart.com/demo/react).

## Declaring a SciChartSurface Instance

In [Tutorial #1 - Setting up a Project with SciChart.js](/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js), we walk you through how to setup a new project with npm, webpack and install SciChart. In particular we show you how to copy the wasm files to the build output, a step that is necessary for our WebAssembly WebGL powered charts.

If you haven't already, go and watch that tutorial quickly so that you can understand the basics of setting up a project with SciChart. The tutorial series is a great way to learn SciChart.

We also have a comprehensive [Examples Suite](https://scichart.com/demo/react) with many examples of how to use our Fast, JavaScript Charts.