---
sidebar_position: 0
---

# 🔄 The SciChartSurface Type

:::tip
Are you new to SciChart? Check out our most popular pages to get started below:
* [SciChart.js Vanilla JavaScript Tutorials](/docs/get-started/tutorials-js/setting-up-npm-project-with-scichart-js/README.md)   
* [Series or Chart Types](/docs/2d-charts/chart-types/renderable-series-api-overview/README.md)
* [Axis Types and Configuration](/docs/2d-charts/axis-api/axis-api-overview/README.md)
* [Zooming & Panning](/docs/2d-charts/chart-modifier-api/zooming-and-panning/overview/README.md)
* [Tooltips](/docs/2d-charts/chart-modifier-api/rollover-modifier/README.md)
* [Annotations and Markers](/docs/2d-charts/annotations-api/annotations-api-overview/README.md)
* [Styling and Themeing](/docs/2d-charts/styling-and-theming/theme-manager-api/README.md)
* [Chart Synchronization APIs](/docs/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/README.md)
* [3D charts Basics](/docs/3d-charts/scichart-3d-basics/scichart-3d-basics-overview/README.md) 
:::

## The basics of the SciChartSurface Type

The root 2D chart view is called the [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html). This is the JavaScript chart control you will be adding to your applications wherever you need a chart. You can add more than one SciChartSurface to an HTML page, you can configure them independently, and you can link them together.

The [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) has a number of properties and functions which allow you to configure and control the chart.

:::tip
Info about the properties and functions available can be found at the [TypeDoc API Documentation for SciChart:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html).
:::

## Series or Chart Types

A [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) has collections of RenderableSeries (see [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#renderableseries)), which form the series or chart types on the chart. Each RenderableSeries must have a DataSeries (see [DataSeries types](/docusaurus/docs/2d-charts/chart-types/data-series-api/data-series-api-overview/README.md)) which defines the data for that chart type.


