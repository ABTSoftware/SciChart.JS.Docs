---
sidebar_position: 5
sidebar_label: Scatter Plot
title: "Scatter Plot: What It Is & How to Read It (With Interactive Examples)"
description: "What a scatter plot is, how to read correlation, outliers, clusters and trend lines, and when to use a scatter chart instead of a line or bubble chart. With a live, interactive example."
keywords:
    [
        "scatter plot",
        "scatter chart",
        "scatter graph",
        "scatter diagram",
        "how to read a scatter plot",
        "correlation",
        "positive and negative correlation",
        "scatter plot vs line graph"
    ]
image: /img/learn/scatter-plot-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a scatter plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A scatter plot is a chart that shows the relationship between two numeric values. Each data point is drawn as a dot, placed by its x value along the horizontal axis and its y value up the vertical axis. It is also called a scatter chart, scatter graph or scatter diagram." }
                },
                {
                    "@type": "Question",
                    "name": "What does a scatter plot show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It shows whether two values move together. If the dots rise from left to right, the values have a positive correlation; if they fall, a negative correlation; if they form a shapeless cloud, there is no clear correlation. It also shows outliers and clusters." }
                },
                {
                    "@type": "Question",
                    "name": "How do you describe a scatter plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Describe its direction (positive, negative or none), its form (a straight line or a curve), its strength (how tightly the dots follow the pattern), and any outliers or clusters. For example: a strong, positive, linear relationship with one outlier." }
                },
                {
                    "@type": "Question",
                    "name": "Does correlation mean causation?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. A scatter plot can show that two values move together, but not why. One may cause the other, both may be driven by a third factor, or the pattern may be a coincidence. Showing cause needs a controlled experiment or other evidence." }
                },
                {
                    "@type": "Question",
                    "name": "When should you use a scatter plot instead of a line chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a scatter plot when both axes are measured values and you want to see how they relate, and the order of the points does not matter. Use a line chart when the x axis is time or another sequence and joining the points in order shows a trend." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a scatter plot in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with two NumericAxis objects, then add an XyScatterRenderableSeries with an XyDataSeries holding your x and y values and a point marker such as EllipsePointMarker. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Scatter Plot

:::info Looking for the SciChart.js API?
See the [SciChart.js scatter plot documentation](/2d-charts/chart-types/xy-scatter-renderable-series/) for `XyScatterRenderableSeries`, point markers and per-point colouring.
:::

A **scatter plot** (also called a **scatter chart** or **scatter graph**) shows the relationship between two numeric values. Each data point is drawn as a dot, placed by its **x value** along the horizontal axis and its **y value** up the vertical axis. The pattern the dots make shows whether the two values are related, how strongly, and which points don't fit.

Try the interactive chart below. It plots the height and weight of 200 people (generated sample data). Scroll to zoom, drag to pan, double-click to reset, and hover over a dot to see its values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="scatter plot" demo="scatter-chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" />

## How to read a scatter plot

![Three scatter plots: dots rising from left to right show a positive correlation, with one outlier; dots falling from left to right show a negative correlation; a shapeless cloud of dots shows no correlation](./scatter-plot-correlation.svg)

- **Each dot is one item** you measured, such as one person, one product or one experiment. Its position gives its two values.
- **The direction** shows the type of **correlation**, the tendency of two values to move together:
  - **Positive correlation:** the dots rise from left to right. As x goes up, y tends to go up, like height and weight.
  - **Negative correlation:** the dots fall from left to right. As x goes up, y tends to go down, like a car's age and its resale price.
  - **No correlation:** the dots form a shapeless cloud. Knowing x tells you little about y.
- **The strength** is how tightly the dots follow the pattern. Dots close to a line mean a **strong** relationship; a loose, wide band means a **weak** one.
- **The form** can be a straight line (**linear**) or a curve (**non-linear**), such as values that rise quickly and then level off.
- **Outliers** are points far from the overall pattern. They may be measurement errors, or the most interesting items in the data, so check them before removing them.
- **Clusters** are separate groups of dots. They often mean the data mixes different kinds of item, such as two product lines or two species.

### Trend lines

A **trend line** (or **line of best fit**) is a straight line drawn through the middle of the dots, usually calculated by the **least-squares** method (linear regression). Its slope shows the direction and size of the relationship: in the chart above, the dashed orange line shows how much weight tends to increase per centimetre of height. A trend line summarises the pattern; it doesn't make the relationship any stronger than the dots show.

The strength of a straight-line relationship is often given as a **correlation coefficient** (r), a number from −1 to +1. Values near +1 or −1 mean the dots lie close to a line; values near 0 mean no straight-line relationship.

### Correlation is not causation

A scatter plot shows that two values move together, not **why**. Ice-cream sales and sunburn cases rise together, but ice cream doesn't cause sunburn: hot, sunny weather drives both. When you see a correlation, ask whether a third factor could explain it, whether the cause could run the other way, or whether it could be chance. Proving cause needs a controlled experiment or other evidence.

| Pattern | What it looks like | What it suggests |
| --- | --- | --- |
| Strong positive | Dots close to a rising line | The values rise together, fairly predictably |
| Weak negative | A loose band falling from left to right | y tends to fall as x rises, with many exceptions |
| No correlation | A shapeless cloud | No straight-line relationship between the values |
| Non-linear | Dots follow a curve | A relationship exists, but a straight trend line will misdescribe it |
| Clusters | Two or more separate groups | The data may contain different kinds of item; consider colouring by group |

## When to use a scatter plot

Use a scatter plot when you have **two measured values for each item** and want to see whether, and how, they are related. It is the standard chart for spotting correlation, outliers and clusters, and works well from a few dozen points to very large datasets.

| Chart | Best for |
| --- | --- |
| **Scatter plot** | The relationship between two numeric values, one dot per item; order doesn't matter |
| [Line chart](/learn/line-chart/) | How one value changes over time or another sequence, with points joined in order |
| [Bubble chart](/learn/bubble-chart/) | A scatter plot with a third value shown as the size of each bubble |
| [Heatmap](/learn/heatmap/) | Very dense data, where dots overlap so much that colour showing density is clearer |

With many points, dots start to hide each other (**overplotting**). Smaller, semi-transparent dots help, as does zooming in on a region.

## How to create a scatter plot in JavaScript, React or Angular

SciChart.js draws scatter plots with WebGL and WebGPU, so they stay smooth to zoom and pan with large numbers of points and live updates. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Height (cm)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Weight (kg)" }));

        const { xValues, yValues } = getYourXyData();
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 9,
                    height: 9,
                    strokeThickness: 1,
                    fill: "#50C7E0AA",
                    stroke: "#50C7E0"
                })
            })
        );
        return { sciChartSurface };
    };

    export const ScatterPlot = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-scatter-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class ScatterPlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Height (cm)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Weight (kg)" }));

            const { xValues, yValues } = getYourXyData();
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                    pointMarker: new EllipsePointMarker(wasmContext, {
                        width: 9,
                        height: 9,
                        strokeThickness: 1,
                        fill: "#50C7E0AA",
                        stroke: "#50C7E0"
                    })
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- An [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) holds your data: one x value and one y value per point. Unlike a line chart, the x values don't need to be sorted.
- An [XyScatterRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html) draws a marker at each point and no line between them.
- The `pointMarker` sets the dot's shape and colour. `EllipsePointMarker` draws circles; square, triangle, cross and custom image markers are also available (see [point markers](/2d-charts/chart-types/common-series-apis/drawing-point-markers/)).
- The trend line in the demo is a `FastLineRenderableSeries` with two points, calculated with a simple least-squares fit.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart)

**Go deeper:** [SciChart.js scatter plot documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), including point marker types and colouring individual points.

## Frequently asked questions

### What is a scatter plot?

A scatter plot is a chart that shows the relationship between two numeric values. Each data point is drawn as a dot, placed by its x value along the horizontal axis and its y value up the vertical axis. It is also called a scatter chart, scatter graph or scatter diagram.

### What does a scatter plot show?

It shows whether two values move together. If the dots rise from left to right, the values have a positive correlation; if they fall, a negative correlation; if they form a shapeless cloud, there is no clear correlation. It also shows outliers and clusters.

### How do you describe a scatter plot?

Describe its direction (positive, negative or none), its form (a straight line or a curve), its strength (how tightly the dots follow the pattern), and any outliers or clusters. For example: a strong, positive, linear relationship with one outlier.

### Does correlation mean causation?

No. A scatter plot can show that two values move together, but not why. One may cause the other, both may be driven by a third factor, or the pattern may be a coincidence. Showing cause needs a controlled experiment or other evidence.

### When should you use a scatter plot instead of a line chart?

Use a scatter plot when both axes are measured values and you want to see how they relate, and the order of the points does not matter. Use a line chart when the x axis is time or another sequence and joining the points in order shows a trend.

### How do I make a scatter plot in JavaScript?

With SciChart.js, create a `SciChartSurface` with two `NumericAxis` objects, then add an `XyScatterRenderableSeries` with an `XyDataSeries` holding your x and y values and a point marker such as `EllipsePointMarker`. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

<LearnCta position="bottom" chart="scatter plot" demo="scatter-chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" />
