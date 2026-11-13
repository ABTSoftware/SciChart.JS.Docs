---
sidebar_position: 3
sidebar_label: Area Chart
title: "Area Chart & Stacked Area Chart: What They Are & How to Read Them (With Interactive Examples)"
description: "What an area chart (area graph) is, how to read a stacked area chart, the main types, and when to use an area chart instead of a line or bar chart. With live examples."
keywords:
    [
        "area chart",
        "area graph",
        "stacked area chart",
        "100% stacked area chart",
        "how to read a stacked area chart",
        "area chart vs line chart",
        "mountain chart"
    ]
image: /img/learn/area-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is an area chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An area chart is a line chart with the space between the line and a baseline, usually zero, filled with colour. Like a line chart it shows how a value changes over time; the filled area also makes the size of the value easy to see." }
                },
                {
                    "@type": "Question",
                    "name": "What is a stacked area chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A stacked area chart draws several series on top of each other, so each band starts where the one below it ends. The thickness of each band is that series' value, and the top edge of the stack is the total of all series." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a stacked area chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Read the top edge for the total, and the thickness of each band for that series' value. Only the bottom band sits on the zero line, so you can read its values straight off the y-axis; for the bands above it, measure the band's thickness, not the height of its top edge." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between an area chart and a line chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both show how a value changes over time. A line chart draws only the line, so it is clearer for comparing several series and its y-axis can start anywhere. An area chart fills below the line, which emphasises the size of each value and lets you stack series to show how parts add up to a total, but its y-axis should start at zero." }
                },
                {
                    "@type": "Question",
                    "name": "What is a 100% stacked area chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A 100% stacked area chart scales every point in time so the stack always reaches 100%. Each band then shows that series' share of the total rather than its actual value, which makes it easy to see how the mix changes over time." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make an area chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with an x-axis and a y-axis, then add a FastMountainRenderableSeries with an XyDataSeries holding your x and y values. For a stacked area chart, add several StackedMountainRenderableSeries to a StackedMountainCollection. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Area Chart

:::info Looking for the SciChart.js API?
In SciChart.js an area chart is called a **mountain chart**. See the [SciChart.js area chart documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/) for `FastMountainRenderableSeries`, gradient fills and gaps, and the [stacked mountain chart documentation](/2d-charts/chart-types/stacked-mountain-renderable-series/) for stacked and 100% stacked area charts.
:::

An **area chart**, or **area graph**, is a line chart with the space underneath filled in. A line shows how a value changes over time, and the colour between the line and a **baseline** (usually zero) shows how big the value is at each point. A **stacked area chart** piles several series on top of each other, so you can see both each part and the **total** they add up to.

Try the interactive chart below. Scroll to zoom, drag to pan, double-click to reset, and hover to see the values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="area chart" demo="mountain-chart" docs="/2d-charts/chart-types/fast-mountain-area-renderable-series/" />

## How to read an area chart

![Anatomy of an area chart and a stacked area chart: on the left, a line with the area down to a zero baseline filled; on the right, three stacked bands whose thicknesses are each series' value and whose top edge is the total](./area-chart-anatomy.svg)

- **The x-axis** is usually time, in order from left to right.
- **The line along the top** of the filled area is the value at each point, just as in a [line chart](/learn/line-chart/).
- **The filled area** runs down to the **baseline**. Its height at any point is the size of the value, which is why an area chart's y-axis should start at zero: a cut-off axis would make the area misleading.
- **In a stacked area chart,** each band sits on top of the one below. The **thickness** of a band is that series' value, and the **top edge** of the whole stack is the total.
- **Only the bottom band** of a stack sits on the zero line. For every band above it, read the thickness, not the height of its top edge.

### Types of area chart

| Type | What it looks like | Use it for |
| --- | --- | --- |
| Area chart | One filled area under a line | The trend and size of a single value over time |
| Overlapping area chart | Two or more semi-transparent areas, each from zero | Comparing two or three series; more than that becomes hard to read |
| [Stacked area chart](/2d-charts/chart-types/stacked-mountain-renderable-series/) | Areas piled on top of each other | How parts add up to a total over time, such as visitors by device |
| [100% stacked area chart](/2d-charts/chart-types/stacked-mountain-renderable-series/) | A stack scaled so the top is always 100% | How each part's share of the total changes over time |
| [Smoothed (spline) area chart](/2d-charts/chart-types/spline-mountain-renderable-series/) | A curve instead of straight segments | A softer look; the curve between points is drawn, not measured |
| [Band chart](/2d-charts/chart-types/fast-band-renderable-series/) | The area between two lines filled | A range, such as a forecast's upper and lower bounds, or the gap between two series |

### Stacked area chart example

The chart below stacks website visitors by device. The top edge shows total visitors; the bands show how many came from desktop, mobile and tablet. Hover to see each layer's values, and use the legend to identify the layers.

<LiveDocSnippet maxWidth={'100%'} name="./Stacked/demo" />

Stacked area charts work best with a **small number of series** (about two to five) whose values **genuinely add up** to a meaningful total. Put the most stable or most important series at the bottom, where it sits on the zero line and is easiest to read.

## When to use an area chart

Use an area chart when your data is a **trend over time** and the **size** of the value, or how **parts add up to a total**, matters as much as its direction.

| Chart | Best for |
| --- | --- |
| **Area chart** | One trend over time, where the volume or total matters |
| **Stacked area chart** | How several parts make up a changing total over time |
| [Line chart](/learn/line-chart/) | Comparing the trends of several series precisely, or when the y-axis shouldn't start at zero |
| [Stacked column chart](/2d-charts/chart-types/stacked-column-renderable-series/) | Parts of a total for a few separate periods or categories, such as quarters or regions |

Avoid area charts when the series cross each other often, or when readers need exact values for the middle layers of a stack: a line chart is clearer for both.

## How to create an area chart in JavaScript, React or Angular

SciChart.js draws area charts with WebGL and WebGPU, so they stay smooth with large data sets and real-time updates. Here is the code for the first chart on this page:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        FastMountainRenderableSeries,
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
            new FastMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                stroke: "#50C7E0",
                strokeThickness: 2,
                fill: "rgba(80, 199, 224, 0.5)",
                zeroLineY: 0
            })
        );
        return { sciChartSurface };
    };

    export const AreaChart = () => (
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
        FastMountainRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-area-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class AreaChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

            const { xValues, yValues } = getYourXyData();
            sciChartSurface.renderableSeries.add(
                new FastMountainRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                    stroke: "#50C7E0",
                    strokeThickness: 2,
                    fill: "rgba(80, 199, 224, 0.5)",
                    zeroLineY: 0
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- An [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) holds your data: one x value and one y value per point.
- A [FastMountainRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html) draws the area. `stroke` sets the line colour, `fill` a solid fill and `fillLinearGradient` a gradient fill.
- `zeroLineY` sets the baseline the area is filled down to. Start the y-axis at zero, as the JavaScript code above does with `visibleRange`, so the area is in proportion.
- For a **stacked area chart**, create one [StackedMountainRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountainrenderableseries.html) per layer, add them to a `StackedMountainCollection`, and add the collection to the chart. Set `isOneHundredPercent: true` on the collection for a 100% stacked area chart:

```ts showLineNumbers file=./Stacked/demo.ts start=#region_A_start end=#region_A_end
```

**See it in the demo app:** [JavaScript area chart](https://www.scichart.com/demo/javascript/mountain-chart) · [React area chart](https://www.scichart.com/demo/react/mountain-chart) · [Angular area chart](https://www.scichart.com/demo/angular/mountain-chart)

**Stacked:** [JavaScript stacked area chart](https://www.scichart.com/demo/javascript/stacked-mountain-chart) · [React stacked area chart](https://www.scichart.com/demo/react/stacked-mountain-chart) · [Angular stacked area chart](https://www.scichart.com/demo/angular/stacked-mountain-chart)

**Go deeper:** [SciChart.js area chart documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/), including gradient fills and gaps, and the [SciChart.js stacked area chart documentation](/2d-charts/chart-types/stacked-mountain-renderable-series/), including 100% stacking.

## Frequently asked questions

### What is an area chart?

An area chart is a line chart with the space between the line and a baseline, usually zero, filled with colour. Like a line chart it shows how a value changes over time; the filled area also makes the size of the value easy to see.

### What is a stacked area chart?

A stacked area chart draws several series on top of each other, so each band starts where the one below it ends. The thickness of each band is that series' value, and the top edge of the stack is the total of all series.

### How do you read a stacked area chart?

Read the top edge for the total, and the thickness of each band for that series' value. Only the bottom band sits on the zero line, so you can read its values straight off the y-axis; for the bands above it, measure the band's thickness, not the height of its top edge.

### What is the difference between an area chart and a line chart?

Both show how a value changes over time. A line chart draws only the line, so it is clearer for comparing several series and its y-axis can start anywhere. An area chart fills below the line, which emphasises the size of each value and lets you stack series to show how parts add up to a total, but its y-axis should start at zero.

### What is a 100% stacked area chart?

A 100% stacked area chart scales every point in time so the stack always reaches 100%. Each band then shows that series' share of the total rather than its actual value, which makes it easy to see how the mix changes over time.

### How do I make an area chart in JavaScript?

With SciChart.js, create a `SciChartSurface` with an x-axis and a y-axis, then add a `FastMountainRenderableSeries` with an `XyDataSeries` holding your x and y values. For a stacked area chart, add several `StackedMountainRenderableSeries` to a `StackedMountainCollection`. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

<LearnCta position="bottom" chart="area chart" demo="mountain-chart" docs="/2d-charts/chart-types/fast-mountain-area-renderable-series/" />
