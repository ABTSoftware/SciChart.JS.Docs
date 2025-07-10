---
sidebar_position: 1
---

# Axis API Overview

SciChart.js has a rich and configurable axis API. We believe you won't find a JavaScript Chart in the world with as many options for axis as SciChart!

This page we're going to give you an overview of what the Axis APIs can do and then show you where to look next for more detail.

What can SciChart.js Do with Axis?
==================================

Heres a quick list of what SciChart.js can do with axis configuration, and where to go next.

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/javascript-chart-axis-layout-options" title="Axis Layout Options" description="showing a variety of axis configurations in SciChart.js." />

Many Axis Types
-------------------

There are several axis types in SciChart.js. Although they all differ in types of data values that can be rendered, the most fundamental difference is in their behavior.

By that, the axes can be divided into two groups, Category and Value axis types.

The axis types provided by SciChart.js are listed below:

Here's the content formatted as a two-column Markdown table:

| Axis Type | Description |
|-----------|-------------|
| **[NumericAxis](/docs/2d-charts/axis-api/axis-types/numeric-axis)** | Value Axis / Numeric Types |
| **[PolarNumericAxis](/docs/2d-charts/axis-api/axis-types/polar-numeric-axis)** | Value Axis / Numeric Types for [Polar Charts](/docs/2d-charts/surface/scichart-polar-surface-type) |
| **[DateTimeNumericAxis](/docs/2d-charts/axis-api/axis-types/date-time-numeric-axis)** | Value Axis with additional features for Dates and Time formatting |
| **[CategoryAxis](/docs/2d-charts/axis-api/axis-types/category-axis)** | Category Axis - measures using index - Numeric Types or Dates |
| **[PolarCategoryAxis](/docs/2d-charts/axis-api/axis-types/polar-category-axis)** | Category Axis for [Polar Charts](/docs/2d-charts/surface/scichart-polar-surface-type) - measures using index - Numeric Types or Dates |
| **[LogarithmicAxis](/docs/2d-charts/axis-api/axis-types/logarithmic-axis)** | Logarithmic Axis supporting Base2, BaseE, Base10 with or without scientific notation |
| **[Text / String Axis](/docs/2d-charts/axis-api/axis-types/text-string-axis)** | Use LabelProviders to format axis labels as text |

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/javascript-axis-types" title="Axis Types" description="" />

To learn more about the axis types, click one of the article links in the table above.

Axis Layout (Multiple Axis, Axis Alignment)
-----------------------------------------------

Many axis configurations are possible, including:

*   [Aligning Axis](/docs/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview) on the Left, Right
*   [Adding a Secondary Axis](/docs/get-started/tutorials-js-npm-webpack/tutorial-08-adding-multiple-axis)
*   [Adding Multiple X and Y Axis](/docs/get-started/tutorials-js-npm-webpack/tutorial-08-adding-multiple-axis)
*   [Rotating a chart 90 degrees](/docs/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis) (Vertical charts)
*   [Drawing Series behind axis](/docs/2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout)
*   [Placing axis in the centre of a chart](/docs/2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout), or inside a chart surface
*   [Vertically Stacking Axis](/docs/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout) - to create complex layouts
*   [Horizontally Stacking Axis](/docs/2d-charts/axis-api/multi-axis-and-layout/horizontally-stacked-axis-layout) - more complex layouts

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/javascript-chart-with-multiple-x-axis" title="Multiple X Axis" description="" />

To learn more about the axis layout options see the pages in the list above.

Axis Label Configuration
----------------------------

SciChart.js has a number of label APIs, including:

*   [Formatting labels the easy way](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview) (using built-in flags)
*   [Formatting labels - using custom code](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview) (fine grained label format)
*   [Having a text axis](/docs/2d-charts/axis-api/axis-types/text-string-axis) e.g. "Apples" "Pears" "Oranges" not 1, 2, 3
*   [Turning native (WebGL) text labels on or off](/docs/2d-charts/axis-api/axis-labels/performance-considerations-native-text-axis-abels)
*   [Spacing gridlines and labels](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval) the easy way
*   [Spacing gridlines and labels - using custom code](/docs/2d-charts/axis-api/axis-tick-label-interval/tick-provider-api) (fine grained control)
*   [Rotating Labels](/docs/2d-charts/axis-api/axis-labels/rotating-axis-labels) / [Multiline Labels](/docs/2d-charts/axis-api/axis-labels/text-and-multi-line-labels) / [Image Labels](/docs/2d-charts/axis-api/axis-labels/image-labels)
*   [Label Style, Alignment, Positioning](/docs/2d-charts/axis-api/axis-labels/label-style-alignment-and-positioning)

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/javascript-multiline-labels" title="Multiline Axis Labels" description="" />

To learn more about the axis labelling options see [Axis Label Formatting](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/) and related pages

Axis Ranging and Scaling
----------------------------

It's possible to programmatically control axis ranging, scaling and auto-fitting of data.

*   [AutoRange](/docs/2d-charts/axis-api/ranging-scaling/auto-range) (auto fitting of data)
*   [Setting/Getting range programatically](/docs/2d-charts/axis-api/ranging-scaling/set-range-zoom-to-fit)
*   [Listening to axis range changes](/docs/2d-charts/axis-api/ranging-scaling/listen-to-visible-range-changes) (callbacks on zoom)

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/zoom-pan-multiple-modifiers" title="Multiple zoom, pan behaviours" description="" />

To learn more about the axis labelling options see [Axis Label Formatting](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview) and related pages

Zooming and panning of Axis (such as mouse-drag, or mousewheel zoom) is handled by the ChartModifiers. See sections in the [ChartModifier API](/docs/2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier) for more details.

Axis Styling
----------------

Finally, SciChart.js supports Axis styling, including:

*   [Styling of Gridlines, Labels, Titles and Bands](/docs/2d-charts/axis-api/axis-styling/title-labels-gridlines-axis-band-style)
*   [Styling of Axis Borders and Background](/docs/2d-charts/axis-api/axis-styling/axis-borders-and-background)
*   [Showing or Hiding of Axis parts](/docs/2d-charts/axis-api/axis-styling/visibility-of-axis-elements)
*   [Styling of Polar Axes](/docs/2d-charts/axis-api/axis-styling/polar-axis-styling)

<ChartFromSciChartDemo src="https://demo.scichart.com/iframe/chart-styling-theming-in-code" title="Chart with custom style applied in code" description="" />

To learn more about the axis styling options see [Axis Styling](/docs/2d-charts/axis-api/axis-styling/title-labels-gridlines-axis-band-style) and related pages
