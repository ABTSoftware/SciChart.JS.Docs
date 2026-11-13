---
sidebar_position: 6
sidebar_label: Bubble Chart
title: "Bubble Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a bubble chart is, how to read its x, y and bubble size, how to size bubbles honestly, and when to use a bubble chart instead of a scatter plot. With a live, interactive example."
keywords:
    [
        "bubble chart",
        "bubble graph",
        "bubble chart example",
        "bubble plot",
        "how to read a bubble chart",
        "bubble chart vs scatter plot"
    ]
image: /img/learn/bubble-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a bubble chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A bubble chart is a scatter plot that shows three values for each item. The bubble's position along the x axis and up the y axis shows two values, and the size of the bubble shows the third. Colour can add a fourth, such as a group or category." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a bubble chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Read each bubble's position first, as on a scatter plot: further right means a larger x value, higher up means a larger y value. Then compare sizes: a bigger bubble means a larger third value. Look for patterns such as whether big bubbles sit in one part of the chart." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a bubble chart and a scatter plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A scatter plot shows two values per item, with every dot the same size. A bubble chart adds a third value by changing the size of each dot, so it is a scatter plot with one extra variable." }
                },
                {
                    "@type": "Question",
                    "name": "Should bubble size show area or diameter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Area. People judge a circle by its area, so a value twice as large should have twice the area. If you scale the diameter instead, a value twice as large looks four times as big. To scale by area, make the diameter proportional to the square root of the value." }
                },
                {
                    "@type": "Question",
                    "name": "When should you use a bubble chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a bubble chart when each item has three numeric values and you want to see how two of them relate while also comparing the third, for example spend, sales and number of customers per store. Keep the number of bubbles modest, as large bubbles overlap and hide each other." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a bubble chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with two NumericAxis objects, then add a FastBubbleRenderableSeries with an XyzDataSeries holding your x, y and z values, where z sets each bubble's size in pixels, and a point marker such as EllipsePointMarker. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Bubble Chart

:::info Looking for the SciChart.js API?
See the [SciChart.js bubble chart documentation](/2d-charts/chart-types/fast-bubble-renderable-series/) for `FastBubbleRenderableSeries`, `XyzDataSeries` and bubble sizing.
:::

A **bubble chart** (or **bubble graph**) is a [scatter plot](/learn/scatter-plot/) that shows **three values** for each item. The bubble's position along the **x axis** and up the **y axis** shows two of them, and the **size** of the bubble shows the third. Colour can add a fourth, such as a group or category.

Try the interactive chart below. It shows 36 stores in three regions (generated sample data): advertising spend across, sales up, and number of customers as bubble size. Scroll to zoom, drag to pan, double-click to reset, and hover over a bubble to see its values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="bubble chart" demo="bubble-chart" docs="/2d-charts/chart-types/fast-bubble-renderable-series/" />

## How to read a bubble chart

![Anatomy of a bubble chart: horizontal position shows the first value, vertical position the second, bubble size the third, and colour an optional group. An inset shows that a value four times as large has four times the area but only twice the width](./bubble-chart-anatomy.svg)

- **Position first.** Read each bubble as you would a dot on a scatter plot: further right means a larger x value, higher up means a larger y value. The overall pattern shows whether x and y are **correlated**.
- **Then size.** A bigger bubble means a larger third value. Compare sizes to find the items that matter most, and check whether big bubbles collect in one part of the chart.
- **Colour, if used,** groups the bubbles, such as by region, product line or country. In the chart above, each region is one colour.
- **Read sizes as rough comparisons.** People judge areas less precisely than positions, so a bubble chart is good for "much bigger" or "about the same", not exact values. Use the tooltip or a table for exact numbers.

### Sizing bubbles honestly

The eye compares a circle by its **area**, not its width. So a value twice as large should get a bubble with **twice the area**. If you make the **diameter** proportional to the value instead, a value twice as large looks four times as big, and the chart exaggerates the differences.

To scale by area, make each bubble's diameter proportional to the **square root** of its value. The demo above does this.

| Mistake | Why it misleads | Fix |
| --- | --- | --- |
| Diameter proportional to the value | Large values look far bigger than they are | Diameter proportional to the square root of the value |
| Too many bubbles | Bubbles overlap and hide each other | Fewer items, semi-transparent fills, or zoom |
| Negative or zero values as size | A bubble can't have a negative size | Show the sign with colour, or use a different chart |
| No key for size | Readers can't tell what a bubble's size means | Say what size shows in the title, legend or tooltip |

## When to use a bubble chart

Use a bubble chart when each item has **three numeric values** and you want to see how two of them relate while also comparing the third. Common examples are spend, sales and number of customers per store; or income, life expectancy and population per country.

| Chart | Best for |
| --- | --- |
| **Bubble chart** | Three values per item: two as position, one as size, for a few dozen items |
| [Scatter plot](/learn/scatter-plot/) | Two values per item, especially with many points; dots are easier to read precisely than bubble sizes |
| [Bar chart](/learn/bar-chart/) | Comparing one value across categories exactly, when the relationship between values doesn't matter |

If the third value isn't important, a scatter plot is clearer. If you only need to compare the third value, a bar chart is more precise.

## How to create a bubble chart in JavaScript, React or Angular

SciChart.js draws bubble charts with WebGL and WebGPU, so they stay smooth to zoom and pan with large datasets and live updates. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        XyzDataSeries,
        FastBubbleRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Advertising spend ($k)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Sales ($k)" }));

        const { xValues, yValues, sizeValues } = getYourXyzData();
        // z is the bubble's diameter in pixels: use the square root so area matches the value
        const zValues = sizeValues.map((value) => Math.sqrt(value) * 0.9);
        sciChartSurface.renderableSeries.add(
            new FastBubbleRenderableSeries(wasmContext, {
                dataSeries: new XyzDataSeries(wasmContext, { xValues, yValues, zValues }),
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 64,
                    height: 64,
                    strokeThickness: 0,
                    fill: "#50C7E099"
                })
            })
        );
        return { sciChartSurface };
    };

    export const BubbleChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        XyzDataSeries,
        FastBubbleRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-bubble-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class BubbleChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Advertising spend ($k)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Sales ($k)" }));

            const { xValues, yValues, sizeValues } = getYourXyzData();
            // z is the bubble's diameter in pixels: use the square root so area matches the value
            const zValues = sizeValues.map((value) => Math.sqrt(value) * 0.9);
            sciChartSurface.renderableSeries.add(
                new FastBubbleRenderableSeries(wasmContext, {
                    dataSeries: new XyzDataSeries(wasmContext, { xValues, yValues, zValues }),
                    pointMarker: new EllipsePointMarker(wasmContext, {
                        width: 64,
                        height: 64,
                        strokeThickness: 0,
                        fill: "#50C7E099"
                    })
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- An [XyzDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries.html) holds your data: an x value, a y value and a z value per bubble.
- A [FastBubbleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbubblerenderableseries.html) uses the z value as each bubble's **diameter in pixels**. Its `zMultiplier` property scales every bubble at once.
- The `pointMarker` sets the bubble's shape and colour. Draw it large (here 64 × 64) with no stroke: SciChart scales it to each bubble, and a stroke would be scaled too.
- For several groups, add one series per group, each with its own colour, as the demo does.

**See it in the demo app:** [JavaScript bubble chart](https://www.scichart.com/demo/javascript/bubble-chart) · [React bubble chart](https://www.scichart.com/demo/react/bubble-chart) · [Angular bubble chart](https://www.scichart.com/demo/angular/bubble-chart)

**Go deeper:** [SciChart.js bubble chart documentation](/2d-charts/chart-types/fast-bubble-renderable-series/), including scaling bubbles with zoom and colouring individual bubbles.

## Frequently asked questions

### What is a bubble chart?

A bubble chart is a scatter plot that shows three values for each item. The bubble's position along the x axis and up the y axis shows two values, and the size of the bubble shows the third. Colour can add a fourth, such as a group or category.

### How do you read a bubble chart?

Read each bubble's position first, as on a scatter plot: further right means a larger x value, higher up means a larger y value. Then compare sizes: a bigger bubble means a larger third value. Look for patterns such as whether big bubbles sit in one part of the chart.

### What is the difference between a bubble chart and a scatter plot?

A scatter plot shows two values per item, with every dot the same size. A bubble chart adds a third value by changing the size of each dot, so it is a scatter plot with one extra variable.

### Should bubble size show area or diameter?

Area. People judge a circle by its area, so a value twice as large should have twice the area. If you scale the diameter instead, a value twice as large looks four times as big. To scale by area, make the diameter proportional to the square root of the value.

### When should you use a bubble chart?

Use a bubble chart when each item has three numeric values and you want to see how two of them relate while also comparing the third, for example spend, sales and number of customers per store. Keep the number of bubbles modest, as large bubbles overlap and hide each other.

### How do I make a bubble chart in JavaScript?

With SciChart.js, create a `SciChartSurface` with two `NumericAxis` objects, then add a `FastBubbleRenderableSeries` with an `XyzDataSeries` holding your x, y and z values, where z sets each bubble's size in pixels, and a point marker such as `EllipsePointMarker`. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

<LearnCta position="bottom" chart="bubble chart" demo="bubble-chart" docs="/2d-charts/chart-types/fast-bubble-renderable-series/" />
