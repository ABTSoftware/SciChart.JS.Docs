---
sidebar_position: 8
sidebar_label: Box Plot
title: "Box Plot (Box and Whisker Plot): What It Is & How to Read It (With Interactive Examples)"
description: "What a box plot (box and whisker plot) shows, how to read the median, quartiles, whiskers and outliers, and when to use one instead of a histogram. With a live example."
keywords:
    [
        "box plot",
        "box and whisker plot",
        "whisker plot",
        "what is a box and whisker plot",
        "how to read a box plot",
        "box plot explained",
        "interquartile range",
        "box plot vs histogram"
    ]
image: /img/learn/box-plot-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a box and whisker plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A box and whisker plot, or box plot, summarises a set of numbers with five values: the minimum, the first quartile (Q1), the median, the third quartile (Q3) and the maximum. A box spans Q1 to Q3 with a line at the median, and whiskers reach out towards the minimum and maximum." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a box plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The line inside the box is the median, the middle value. The box holds the middle half of the data, from Q1 to Q3, so a tall box means the values are spread out. The whiskers show the range of the rest of the data, and any dots beyond them are outliers. To compare groups, compare their medians first, then the size of their boxes." }
                },
                {
                    "@type": "Question",
                    "name": "How do you find the IQR on a box plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The interquartile range (IQR) is the length of the box: subtract the first quartile (the bottom or left edge of the box) from the third quartile (the top or right edge). For example, if Q1 is 55 and Q3 is 70, the IQR is 15." }
                },
                {
                    "@type": "Question",
                    "name": "What do the whiskers on a box plot show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It depends on the convention, so check the chart's notes. In the simplest form the whiskers reach the minimum and maximum values. In the most common form, Tukey's, they stop at the furthest value within 1.5 times the IQR of the box, and any value beyond that is drawn as a separate dot and treated as an outlier." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a box plot in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with two NumericAxis axes, then add a FastBoxPlotRenderableSeries with a BoxPlotDataSeries holding an x value plus the minimum, lower quartile, median, upper quartile and maximum for each box. Draw outliers with an XyScatterRenderableSeries. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                },
                {
                    "@type": "Question",
                    "name": "Should I use a box plot or a histogram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a histogram to see the full shape of one dataset, including whether it has more than one peak. Use a box plot to compare the median, spread and outliers of several groups side by side, where several histograms would take too much space." }
                }
            ]
        })}
    </script>
</head>

# Box Plot (Box and Whisker Plot)

:::info Looking for the SciChart.js API?
See the [SciChart.js box plot documentation](/2d-charts/chart-types/fast-box-plot-renderable-series/) for `FastBoxPlotRenderableSeries`, `BoxPlotDataSeries` and styling the box, whiskers, caps and median line.
:::

A **box plot**, also called a **box and whisker plot**, summarises how a set of numbers is spread out. It draws a **box** around the middle half of the values, a line at the **median**, and **whiskers** reaching out to the lowest and highest values. Dots beyond the whiskers mark **outliers**. Because each box is narrow, you can line up several groups side by side and compare them at a glance.

Try the interactive chart below. It compares exam scores for five classes. Scroll to zoom, drag to pan, double-click to reset, and hover over a box to see its values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="box plot" demo="box-plot-chart" docs="/2d-charts/chart-types/fast-box-plot-renderable-series/" />

## How to read a box plot

![Anatomy of a box plot: the minimum, first quartile (Q1), median, third quartile (Q3) and maximum, with the interquartile range, the whiskers and an outlier labelled](./box-plot-anatomy.svg)

A box plot is built from the **five-number summary** of the data:

- **Minimum:** the lowest value, at the end of the lower whisker. When outliers are drawn separately, it is the lowest value that isn't an outlier.
- **First quartile (Q1):** a quarter of the values fall below it. It is the bottom (or left) edge of the box.
- **Median:** the middle value, so half the values are above it and half below. It is the line inside the box.
- **Third quartile (Q3):** three-quarters of the values fall below it. It is the top (or right) edge of the box.
- **Maximum:** the highest value, at the end of the upper whisker (again, leaving out outliers when they are drawn separately).

Those five values split the data into four sections, each holding about a quarter of the values. Then:

- **The box length is the interquartile range (IQR),** Q3 − Q1. It holds the middle 50% of the values. A short box means the values are tightly grouped; a long box means they are spread out.
- **The whiskers show the rest of the range.** Conventions vary. In the simplest form they reach the true minimum and maximum. In the most common form, popularised by the statistician John Tukey, they stop at the furthest value within **1.5 × IQR** of the box. The chart above uses this rule.
- **Outliers** are values beyond the whiskers, drawn as separate dots. They are worth checking: they may be errors, or the most interesting points in the data.

Quartiles can be calculated in slightly different ways, so two tools may draw slightly different boxes from the same data. With large datasets the difference is small.

### What the shape of a box plot tells you

| What you see | What it means | In the chart above |
| --- | --- | --- |
| Median roughly in the middle of the box, whiskers about equal | The values are roughly **symmetric** | Class E |
| Median near the bottom of the box, long upper whisker | **Right-skewed** (positively skewed): most values are low, with a tail of high ones | Class D |
| Median near the top of the box, long lower whisker | **Left-skewed** (negatively skewed): most values are high, with a tail of low ones | |
| One box much higher than another | That group's values are generally higher | Class E against Class C |
| One box much longer than another | That group's values are more spread out | Class C against Class E |
| Dots beyond the whiskers | **Outliers**: unusually high or low values | Classes A, B, C and E |

When you **compare groups**, look at the medians first, then the boxes. If one group's median sits outside another group's box, the difference between them is usually worth a closer look. A box plot alone does not tell you whether a difference is statistically significant.

## When to use a box plot

Use a box plot when you want to **compare the distribution of a value across several groups**: test scores by class, response times by server, measurements by batch, salaries by department.

| Chart | Best for |
| --- | --- |
| **Box plot** | Comparing the median, spread and outliers of several groups side by side |
| [Histogram](/learn/histogram/) | The full shape of one dataset, including gaps and more than one peak, which a box plot hides |
| [Bar chart](/learn/bar-chart/) | One summary number per group, such as an average or a total, when the spread doesn't matter |
| [Scatter plot](/learn/scatter-plot/) | Every individual value, when there are few enough points to see them all |

A box plot works best with **at least a few dozen values per group**. With only a handful, the quartiles are not very meaningful, so plot the individual points instead or alongside.

## How to create a box plot in JavaScript, React or Angular

SciChart.js draws box plots with WebGL and WebGPU, so you can compare many groups, zoom in and update the data live. You calculate the five-number summary for each group, and SciChart.js draws the boxes, whiskers and outliers. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastBoxPlotRenderableSeries,
        BoxPlotDataSeries,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        // One x value per box, plus its five-number summary
        const { xValues, minimumValues, lowerQuartileValues, medianValues, upperQuartileValues, maximumValues } =
            getYourBoxPlotData();
        sciChartSurface.renderableSeries.add(
            new FastBoxPlotRenderableSeries(wasmContext, {
                dataSeries: new BoxPlotDataSeries(wasmContext, {
                    xValues,
                    minimumValues,
                    lowerQuartileValues,
                    medianValues,
                    upperQuartileValues,
                    maximumValues
                }),
                dataPointWidth: 0.5,
                fill: "#4682b4aa",
                stroke: "#c6e2ff",
                whiskers: { stroke: "#c6e2ff", strokeThickness: 2 },
                cap: { stroke: "#c6e2ff", strokeThickness: 2, dataPointWidth: 0.25 },
                medianLine: { stroke: "#ffb000", strokeThickness: 3 }
            })
        );
        return { sciChartSurface };
    };

    export const BoxPlot = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastBoxPlotRenderableSeries,
        BoxPlotDataSeries,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-box-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class BoxPlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

            // One x value per box, plus its five-number summary
            const { xValues, minimumValues, lowerQuartileValues, medianValues, upperQuartileValues, maximumValues } =
                getYourBoxPlotData();
            sciChartSurface.renderableSeries.add(
                new FastBoxPlotRenderableSeries(wasmContext, {
                    dataSeries: new BoxPlotDataSeries(wasmContext, {
                        xValues,
                        minimumValues,
                        lowerQuartileValues,
                        medianValues,
                        upperQuartileValues,
                        maximumValues
                    }),
                    dataPointWidth: 0.5,
                    fill: "#4682b4aa",
                    stroke: "#c6e2ff",
                    whiskers: { stroke: "#c6e2ff", strokeThickness: 2 },
                    cap: { stroke: "#c6e2ff", strokeThickness: 2, dataPointWidth: 0.25 },
                    medianLine: { stroke: "#ffb000", strokeThickness: 3 }
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [BoxPlotDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/boxplotdataseries.html) holds one x value per box plus its `minimumValues`, `lowerQuartileValues` (Q1), `medianValues`, `upperQuartileValues` (Q3) and `maximumValues`. You supply the summary; the full demo code shows a small helper that works it out with the 1.5 × IQR whisker rule.
- [FastBoxPlotRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastboxplotrenderableseries.html) styles each part separately: `fill` and `stroke` for the box, `whiskers`, `cap` for the whisker ends, and `medianLine`.
- Outliers are a separate `XyScatterRenderableSeries`, so you can style and hover over them on their own.
- A `TextLabelProvider` on the x-axis names each group. To draw the boxes horizontally, swap the axis alignments, as shown in the documentation.

**See it in the demo app:** [JavaScript box plot](https://www.scichart.com/demo/javascript/box-plot-chart) · [React box plot](https://www.scichart.com/demo/react/box-plot-chart) · [Angular box plot](https://www.scichart.com/demo/angular/box-plot-chart)

**Go deeper:** [SciChart.js box plot documentation](/2d-charts/chart-types/fast-box-plot-renderable-series/), including horizontal box plots and data point width modes.

## Frequently asked questions

### What is a box and whisker plot?

A box and whisker plot, or box plot, summarises a set of numbers with five values: the minimum, the first quartile (Q1), the median, the third quartile (Q3) and the maximum. A box spans Q1 to Q3 with a line at the median, and whiskers reach out towards the minimum and maximum.

### How do you read a box plot?

The line inside the box is the median, the middle value. The box holds the middle half of the data, from Q1 to Q3, so a tall box means the values are spread out. The whiskers show the range of the rest of the data, and any dots beyond them are outliers. To compare groups, compare their medians first, then the size of their boxes.

### How do you find the IQR on a box plot?

The interquartile range (IQR) is the length of the box: subtract the first quartile (the bottom or left edge of the box) from the third quartile (the top or right edge). For example, if Q1 is 55 and Q3 is 70, the IQR is 15.

### What do the whiskers on a box plot show?

It depends on the convention, so check the chart's notes. In the simplest form the whiskers reach the minimum and maximum values. In the most common form, Tukey's, they stop at the furthest value within 1.5 times the IQR of the box, and any value beyond that is drawn as a separate dot and treated as an outlier.

### How do I make a box plot in JavaScript?

With SciChart.js, create a `SciChartSurface` with two `NumericAxis` axes, then add a `FastBoxPlotRenderableSeries` with a `BoxPlotDataSeries` holding an x value plus the minimum, lower quartile, median, upper quartile and maximum for each box. Draw outliers with an `XyScatterRenderableSeries`. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

### Should I use a box plot or a histogram?

Use a histogram to see the full shape of one dataset, including whether it has more than one peak. Use a box plot to compare the median, spread and outliers of several groups side by side, where several histograms would take too much space.

<LearnCta position="bottom" chart="box plot" demo="box-plot-chart" docs="/2d-charts/chart-types/fast-box-plot-renderable-series/" />
