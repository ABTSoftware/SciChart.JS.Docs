---
sidebar_position: 1
sidebar_label: Chart Types Guide
title: "Types of Charts: A Guide to Every Chart Type (With Interactive Examples)"
description: "A guide to the main types of charts: what each chart shows, how to read it and when to use it, with a live, interactive example of every chart."
keywords: ["types of charts", "chart types", "types of graphs", "chart examples", "which chart to use"]
---

# Chart Types Guide

Which chart should you use, and how do you read it? Each guide explains one chart type in plain language: what it shows, how to read it and when to use it. Each one comes with a live, interactive example and the code to build it in **JavaScript, React or Angular** with SciChart.js.

## Trends and comparisons

| Chart | What it shows |
| --- | --- |
| [Line chart](/learn/line-chart/) | How a value changes over time, as points joined by a line |
| [Sparkline](/learn/sparkline/) | A word-sized line chart with no axes, showing the recent trend of a value beside the value itself, often one per row of a table |
| [Area chart](/learn/area-chart/) | A line chart with the area below it filled, often stacked to show parts of a total |
| [Bar chart](/learn/bar-chart/) | Values compared across categories as bars or columns. Covers the main [types of bar graph](/learn/bar-chart/#types-of-bar-chart): column, horizontal, clustered, stacked and diverging |
| [Pareto chart](/learn/pareto-chart/) | Categories ranked from largest to smallest, with a cumulative percentage line showing which few make up most of the total |
| [Combo chart](/learn/combo-chart/) | Two related measures on one chart, usually columns and a line, often with a second y-axis for the line (a dual axis chart) |
| [Lollipop chart](/learn/lollipop-chart/) | Values compared across many categories as thin stems with a dot at the end: a bar chart with less ink, best when the values are close |

## Parts of a whole

| Chart | What it shows |
| --- | --- |
| [Pie chart](/learn/pie-chart/) | How a total splits into parts, as slices of a circle |
| [Donut chart](/learn/donut-chart/) | A pie chart with a hole in the middle, often used to show the total |
| [Sunburst chart](/learn/sunburst-chart/) | A total broken down over several levels, as rings around a centre: each ring is one level, and each segment's angle is its share |
| [Sankey diagram](/learn/sankey-diagram/) | How a total flows from sources through stages to where it ends up, with each band as wide as its value |
| [Treemap](/learn/treemap/) | How a total splits into parts and groups, as nested rectangles with each area matching its value |

## Stacked charts

A **stacked chart** shows a total and the parts that make it up, by drawing each part on top of the one before. The top edge is the total; each band or segment is one part.

| Chart | What it shows |
| --- | --- |
| [Stacked bar chart](/learn/bar-chart/#stacked-bar-chart) | Totals compared across categories, with each bar split into its parts; drawn upright, it's a stacked column chart |
| [100% stacked bar chart](/learn/bar-chart/#100-stacked-bar-chart) | Every bar the same length, so you compare each category's mix of parts rather than its total |
| [Stacked area chart](/learn/area-chart/#how-to-read-a-stacked-area-chart) | How a total and its parts change over time, as bands stacked on top of each other |
| [100% stacked area chart](/learn/area-chart/#stacked-vs-100-stacked-area-chart) | How the share of each part changes over time |

## Relationships and distributions

| Chart | What it shows |
| --- | --- |
| [Scatter plot](/learn/scatter-plot/) | The relationship between two values, one dot per data point |
| [Bubble chart](/learn/bubble-chart/) | A scatter plot where bubble size shows a third value |
| [Parallel coordinates plot](/learn/parallel-coordinates-plot/) | Many records compared across many variables: one vertical axis per variable, one line per record |
| [Histogram](/learn/histogram/) | How values are distributed, counted into ranges (bins) |
| [Population pyramid](/learn/population-pyramid/) | How a population splits by age and sex, as back-to-back bars: males on one side, females on the other, youngest at the bottom |
| [Box plot](/learn/box-plot/) | The spread of a dataset: median, quartiles, range and outliers |
| [Error bars](/learn/error-bars/) | The uncertainty or spread around a value, usually a mean: standard deviation, standard error or a confidence interval |

## Scientific and engineering charts

| Chart | What it shows |
| --- | --- |
| [Heatmap](/learn/heatmap/) | A grid of values shown as colours |
| [Contour plot](/learn/contour-plot/) | Lines of equal value across two dimensions, showing peaks, saddles and steep areas |
| [3D surface plot](/learn/3d-surface-plot/) | A value drawn as height over two dimensions, showing peaks, valleys and slopes as a 3D landscape |
| [Spectrogram](/learn/spectrogram/) | How the frequencies in a signal change over time, with colour showing strength |
| [Radar chart](/learn/radar-chart/) | Several variables on axes radiating from a centre, joined into a shape |

## Dashboards and KPIs

| Chart | What it shows |
| --- | --- |
| [Gauge chart](/learn/gauge-chart/) | One value on a dial between a minimum and a maximum, with a needle and coloured bands showing whether it's good, borderline or bad |
| [Bullet chart](/learn/bullet-chart/) | One measure as a dark bar against a short target line and grey bands for poor, satisfactory and good, compact enough to stack many on one dashboard |
| [Funnel chart](/learn/funnel-chart/) | How many people or items reach each step of a process, as centred bars that narrow from stage to stage, with the conversion rate between steps |

## Financial charts

| Chart | What it shows |
| --- | --- |
| [Candlestick chart](/learn/candlestick-chart/) | Open, high, low and close prices per period, with colour showing whether the price rose or fell |
| [OHLC chart](/learn/ohlc-chart/) | Open, high, low and close prices per period as thin bars, with a left tick for the open and a right tick for the close |
| [Waterfall chart](/learn/waterfall-chart/) | How a starting total becomes an end total through a series of gains and losses, with subtotals along the way |

## Chart examples

Each guide includes a live, interactive chart you can zoom, pan and hover over. For charts from real-world settings, such as sports rankings, market share, patient monitors and climate data, see the [bar graph examples](/learn/bar-chart/#bar-graph-examples), [pie chart examples](/learn/pie-chart/#pie-chart-examples) and [line chart examples](/learn/line-chart/#line-chart-examples).

For the full gallery, browse the [JavaScript chart examples](https://www.scichart.com/demo/) in the SciChart.js demo app. Each example shows the code behind it, with versions for JavaScript, React and Angular.

<LearnCta position="bottom" />
