---
sidebar_position: 1
sidebar_label: Types of Charts and Graphs
title: "Types of Charts and Graphs: A Guide to Every Chart Type (With Interactive Examples)"
description: "A guide to the main types of charts and graphs: what each chart shows, how to read it and when to use it, with a live, interactive example of every chart."
keywords: ["types of charts", "types of graphs", "types of charts and graphs", "chart types", "graph types", "chart examples", "which chart to use"]
---

# Types of Charts and Graphs

Which chart should you use, and how do you read it? This guide covers the main types of charts and graphs. Each guide explains one chart type in plain language: what it shows, how to read it and when to use it. Each one comes with a live, interactive example and the code to build it in **JavaScript, React or Angular** with SciChart.js.

## Trends and comparisons

| Chart | What it shows |
| --- | --- |
| [Line chart](/learn/chart-types/line-chart/) | How a value changes over time, as points joined by a line |
| [Sparkline](/learn/chart-types/sparkline/) | A word-sized line chart with no axes, showing the recent trend of a value beside the value itself, often one per row of a table |
| [Area chart](/learn/chart-types/area-chart/) | A line chart with the area below it filled, often stacked to show parts of a total |
| [Bar chart](/learn/chart-types/bar-chart/) | Values compared across categories as bars or columns. Covers the main [types of bar graph](/learn/chart-types/bar-chart/#types-of-bar-chart): column, horizontal, clustered, stacked and diverging |
| [Pareto chart](/learn/chart-types/pareto-chart/) | Categories ranked from largest to smallest, with a cumulative percentage line showing which few make up most of the total |
| [Combo chart](/learn/chart-types/combo-chart/) | Two related measures on one chart, usually columns and a line, often with a second y-axis for the line (a dual axis chart) |
| [Lollipop chart](/learn/chart-types/lollipop-chart/) | Values compared across many categories as thin stems with a dot at the end: a bar chart with less ink, best when the values are close |
| [Dumbbell chart](/learn/chart-types/dumbbell-chart/) | Two values per category, such as before and after, as two dots joined by a line, so the gap and its direction stand out |

## Parts of a whole

| Chart | What it shows |
| --- | --- |
| [Pie chart](/learn/chart-types/pie-chart/) | How a total splits into parts, as slices of a circle |
| [Donut chart](/learn/chart-types/donut-chart/) | A pie chart with a hole in the middle, often used to show the total |
| [Sunburst chart](/learn/chart-types/sunburst-chart/) | A total broken down over several levels, as rings around a centre: each ring is one level, and each segment's angle is its share |
| [Sankey diagram](/learn/chart-types/sankey-diagram/) | How a total flows from sources through stages to where it ends up, with each band as wide as its value |
| [Treemap](/learn/chart-types/treemap/) | How a total splits into parts and groups, as nested rectangles with each area matching its value |
| [Ternary plot](/learn/chart-types/ternary-plot/) | Mixtures of three parts that add up to 100%, such as soil texture, rock types and phase diagrams |

## Stacked charts

A **stacked chart** shows a total and the parts that make it up, by drawing each part on top of the one before. The top edge is the total; each band or segment is one part.

| Chart | What it shows |
| --- | --- |
| [Stacked bar chart](/learn/chart-types/bar-chart/#stacked-bar-chart) | Totals compared across categories, with each bar split into its parts; drawn upright, it's a stacked column chart |
| [100% stacked bar chart](/learn/chart-types/bar-chart/#100-stacked-bar-chart) | Every bar the same length, so you compare each category's mix of parts rather than its total |
| [Stacked area chart](/learn/chart-types/area-chart/#how-to-read-a-stacked-area-chart) | How a total and its parts change over time, as bands stacked on top of each other |
| [100% stacked area chart](/learn/chart-types/area-chart/#stacked-vs-100-stacked-area-chart) | How the share of each part changes over time |

## Relationships and distributions

| Chart | What it shows |
| --- | --- |
| [Scatter plot](/learn/chart-types/scatter-plot/) | The relationship between two values, one dot per data point |
| [Bubble chart](/learn/chart-types/bubble-chart/) | A scatter plot where bubble size shows a third value |
| [Parallel coordinates plot](/learn/chart-types/parallel-coordinates-plot/) | Many records compared across many variables: one vertical axis per variable, one line per record |
| [Network graph](/learn/chart-types/network-graph/) | How things are connected: items as dots (nodes) and links as lines (edges), showing hubs, clusters and the bridges between them |
| [Histogram](/learn/chart-types/histogram/) | How values are distributed, counted into ranges (bins) |
| [Density plot](/learn/chart-types/density-plot/) | The smooth shape of a distribution: peaks, spread and tails, drawn as a curve; compare groups by overlaying them or stacking them as a ridgeline |
| [Population pyramid](/learn/chart-types/population-pyramid/) | How a population splits by age and sex, as back-to-back bars: males on one side, females on the other, youngest at the bottom |
| [Box plot](/learn/chart-types/box-plot/) | The spread of a dataset: median, quartiles, range and outliers |
| [Violin plot](/learn/chart-types/violin-plot/) | The full shape of several groups side by side: a box plot plus a mirrored density curve that shows peaks, gaps and skew |
| [Error bars](/learn/chart-types/error-bars/) | The uncertainty or spread around a value, usually a mean: standard deviation, standard error or a confidence interval |

## Scientific and engineering charts

| Chart | What it shows |
| --- | --- |
| [Heatmap](/learn/chart-types/heatmap/) | A grid of values shown as colours |
| [Contour plot](/learn/chart-types/contour-plot/) | Lines of equal value across two dimensions, showing peaks, saddles and steep areas |
| [3D surface plot](/learn/chart-types/3d-surface-plot/) | A value drawn as height over two dimensions, showing peaks, valleys and slopes as a 3D landscape |
| [Spectrogram](/learn/chart-types/spectrogram/) | How the frequencies in a signal change over time, with colour showing strength |
| [Radar chart](/learn/chart-types/radar-chart/) | Several variables on axes radiating from a centre, joined into a shape |
| [Polar area chart](/learn/chart-types/polar-area-chart/) | Equal-angle wedges whose area shows each value, for cycles such as months or directions (Nightingale rose) |

## Dashboards and KPIs

| Chart | What it shows |
| --- | --- |
| [Gauge chart](/learn/chart-types/gauge-chart/) | One value on a dial between a minimum and a maximum, with a needle and coloured bands showing whether it's good, borderline or bad |
| [Bullet chart](/learn/chart-types/bullet-chart/) | One measure as a dark bar against a short target line and grey bands for poor, satisfactory and good, compact enough to stack many on one dashboard |
| [Funnel chart](/learn/chart-types/funnel-chart/) | How many people or items reach each step of a process, as centred bars that narrow from stage to stage, with the conversion rate between steps |

## Financial charts

| Chart | What it shows |
| --- | --- |
| [Candlestick chart](/learn/chart-types/candlestick-chart/) | Open, high, low and close prices per period, with colour showing whether the price rose or fell |
| [OHLC chart](/learn/chart-types/ohlc-chart/) | Open, high, low and close prices per period as thin bars, with a left tick for the open and a right tick for the close |
| [Waterfall chart](/learn/chart-types/waterfall-chart/) | How a starting total becomes an end total through a series of gains and losses, with subtotals along the way |

## Time and events

| Chart | What it shows |
| --- | --- |
| [Timeline chart](/learn/chart-types/timeline-chart/) | When events happened and how long states lasted, on a time axis: points for events, bands in lanes for states such as running, idle or fault |

## Chart examples

Each guide includes a live, interactive chart you can zoom, pan and hover over. For charts from real-world settings, such as sports rankings, market share, patient monitors and climate data, see the [bar graph examples](/learn/chart-types/bar-chart/#bar-graph-examples), [pie chart examples](/learn/chart-types/pie-chart/#pie-chart-examples) and [line chart examples](/learn/chart-types/line-chart/#line-chart-examples).

For the full gallery, browse the [JavaScript chart examples](https://www.scichart.com/demo/) in the SciChart.js demo app. Each example shows the code behind it, with versions for JavaScript, React and Angular.

<LearnCta position="bottom" />
