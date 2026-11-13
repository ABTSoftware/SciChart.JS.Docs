---
sidebar_position: 2
sidebar_label: Line Chart
title: "Line Chart (Line Graph): What It Is & How to Read It (With Interactive Examples)"
description: "What a line chart (line graph) is, how to read one, the main types, and when to use a line graph instead of a bar graph, area chart or scatter plot. With a live example."
keywords:
    [
        "line chart",
        "line graph",
        "what is a line graph",
        "how to read a line graph",
        "line chart example",
        "line graph vs bar graph",
        "multiple line graph"
    ]
image: /img/learn/line-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a line graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A line graph plots a series of values as points and joins them with straight lines, in order. The x-axis is usually time and the y-axis is the value being measured, so the line shows how that value rises and falls over time." }
                },
                {
                    "@type": "Question",
                    "name": "What is a line graph used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Line graphs show trends: how a value changes over time or across another ordered sequence. Common examples are temperatures, prices, website visitors, sensor readings and sales by month. Several lines on one chart let you compare how different series change." }
                },
                {
                    "@type": "Question",
                    "name": "Is a line chart the same as a line graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. Line chart and line graph are two names for the same chart. Line plot usually means the same thing too, although in some school maths courses a line plot is a different chart that stacks marks above a number line." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a line graph and a bar graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A line graph joins points in order, so it is best for showing change and trends over time. A bar graph draws a separate bar for each value, so it is best for comparing amounts across separate categories. If the order of the x values matters, use a line graph; if it does not, use a bar graph." }
                },
                {
                    "@type": "Question",
                    "name": "Does the y-axis of a line graph have to start at zero?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. A line graph shows change, so the y-axis can start near the lowest value to make the trend easier to see. Bar and area charts are different: their length or filled area shows the size of each value, so their axis should start at zero." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a line chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface, add an x-axis such as a DateTimeNumericAxis and a NumericAxis for y, then add a FastLineRenderableSeries with an XyDataSeries holding your x and y values. Add one series per line. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Line Chart

:::info Looking for the SciChart.js API?
See the [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/) for `FastLineRenderableSeries`, point markers, gaps and per-segment colouring.
:::

A **line chart**, also called a **line graph**, shows how a value changes over time. Each **data point** is plotted against two axes, and a line joins the points in order, so the **slope** of the line shows at a glance whether the value is rising, falling or holding steady. Line charts are the most common way to show a **trend**, and several lines on one chart let you compare series side by side.

Try the interactive chart below. Scroll to zoom, drag to pan, double-click to reset, hover over a line to see its values, and use the legend to hide or show a line.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="line chart" demo="line-chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" />

## How to read a line chart

![Anatomy of a line chart: the y-axis shows the value, the x-axis shows time, and data points are joined by a line that slopes up while values rise, peaks, then slopes down as they fall](./line-chart-anatomy.svg)

- **The x-axis** (horizontal) is usually time: days, months or years, in order from left to right. It can also be any other ordered sequence, such as distance or frequency.
- **The y-axis** (vertical) is the value being measured, such as a temperature, a price or a count. Check its units and where it starts.
- **Each data point** is one x value paired with one y value. Some line charts mark the points with dots; others show only the line.
- **The slope** tells you the direction. A line going up from left to right means the value is rising; going down means it is falling; flat means little change.
- **The steepness** tells you the speed. A steep section is a fast change; a gentle one is a slow change.
- **Several lines** on one chart are told apart by colour, with a **legend** to say which is which. In the chart above, City B is warmer than City A all year, but both follow the same seasonal pattern.

### Types of line chart

| Type | What it looks like | Use it for |
| --- | --- | --- |
| Simple line chart | One line | The trend of a single value over time |
| Multiple line chart | Two or more lines on the same axes | Comparing how several series change, such as sales by region |
| Line chart with markers | A dot at each data point | Small data sets, where readers need to see each actual measurement |
| [Smoothed (spline) line chart](/2d-charts/chart-types/spline-line-renderable-series/) | A curve through the points instead of straight segments | A softer look; note that the curve between points is drawn, not measured |
| [Step line chart](/2d-charts/chart-types/fast-line-digital-renderable-series/) | Horizontal then vertical steps between points | Values that jump and then hold, such as interest rates, prices or on/off states |

## When to use a line chart

Use a line chart when your x values have a **natural order**, usually time, and the reader cares about **how the value changes** from one point to the next: the trend, the peaks and dips, and the rate of change.

| Chart | Best for |
| --- | --- |
| **Line chart** | Trends over time or another ordered sequence; comparing a few series; many data points |
| [Bar or column chart](/learn/bar-chart/) | Comparing amounts across separate categories, such as sales by product |
| [Area chart](/learn/area-chart/) | A trend where the size of the total matters, or how parts add up to a whole over time |
| [Scatter plot](/learn/scatter-plot/) | The relationship between two measured variables, where the points have no natural order |

### Line graph vs bar graph

- **A line graph shows change.** The line joining the points says "this value moved from here to here", so it suits continuous data such as time series.
- **A bar graph compares amounts.** Each bar stands alone, so it suits separate categories (products, countries, teams) whose order doesn't matter.
- **A quick test:** if you could shuffle the x values without changing the meaning, use a bar graph. If shuffling them would destroy the story, use a line graph.
- **Many points favour lines.** A year of daily values is 365 thin bars, but one clear line.

Line charts are often used with **moving averages** to smooth out noise, **annotations** to mark events, and a **second y-axis** when two series have different units.

## How to create a line chart in JavaScript, React or Angular

SciChart.js draws line charts with WebGL and WebGPU, so they stay smooth with large data sets and real-time updates. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        const { xValues, yValues } = getYourXyData();
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                stroke: "#50C7E0",
                strokeThickness: 2
            })
        );
        return { sciChartSurface };
    };

    export const LineChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-line-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class LineChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

            const { xValues, yValues } = getYourXyData();
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                    stroke: "#50C7E0",
                    strokeThickness: 2
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- An [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) holds your data: one x value and one y value per point. Set `dataSeriesName` to label the line in the legend and tooltip.
- A [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) draws the line. `stroke` sets its colour and `strokeThickness` its width. Add one series per line.
- A `DateTimeNumericAxis` formats Unix timestamps (in seconds) as dates. Use a `NumericAxis` for plain numbers.
- `LegendModifier` adds the legend, and `CursorModifier` adds the hover tooltip.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart)

**Go deeper:** [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/), including point markers, gaps in the line and colouring individual segments.

## Frequently asked questions

### What is a line graph?

A line graph plots a series of values as points and joins them with straight lines, in order. The x-axis is usually time and the y-axis is the value being measured, so the line shows how that value rises and falls over time.

### What is a line graph used for?

Line graphs show trends: how a value changes over time or across another ordered sequence. Common examples are temperatures, prices, website visitors, sensor readings and sales by month. Several lines on one chart let you compare how different series change.

### Is a line chart the same as a line graph?

Yes. Line chart and line graph are two names for the same chart. Line plot usually means the same thing too, although in some school maths courses a line plot is a different chart that stacks marks above a number line.

### What is the difference between a line graph and a bar graph?

A line graph joins points in order, so it is best for showing change and trends over time. A bar graph draws a separate bar for each value, so it is best for comparing amounts across separate categories. If the order of the x values matters, use a line graph; if it does not, use a bar graph.

### Does the y-axis of a line graph have to start at zero?

No. A line graph shows change, so the y-axis can start near the lowest value to make the trend easier to see. Bar and area charts are different: their length or filled area shows the size of each value, so their axis should start at zero.

### How do I make a line chart in JavaScript?

With SciChart.js, create a `SciChartSurface`, add an x-axis such as a `DateTimeNumericAxis` and a `NumericAxis` for y, then add a `FastLineRenderableSeries` with an `XyDataSeries` holding your x and y values. Add one series per line. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

<LearnCta position="bottom" chart="line chart" demo="line-chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" />
