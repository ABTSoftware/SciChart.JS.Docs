---
sidebar_position: 11
sidebar_label: Radar Chart
title: "Radar Chart (Spider Chart): What It Is & How to Read It (With Interactive Examples)"
description: "What a radar chart (spider chart) is, how to read and describe one, when to use it instead of a bar chart, and why axis order and area can mislead. With a live example."
keywords:
    [
        "radar chart",
        "spider chart",
        "what is a radar chart",
        "radar graph",
        "radar plot",
        "spider plot",
        "spider web diagram",
        "radial chart",
        "star plot",
        "how to read a radar chart",
        "what is a radar chart used for",
        "radar chart vs bar chart"
    ]
image: /img/learn/radar-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a radar chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A radar chart compares a few items across several variables measured on the same scale, such as products across features, players across skills or candidates across criteria. Each item becomes a shape, so you can see its strengths and weaknesses, and how it differs from the others, at a glance." }
                },
                {
                    "@type": "Question",
                    "name": "Is a spider chart the same as a radar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. Radar chart, radar plot, spider chart, spider plot, spider web diagram, web chart, star plot and Kiviat diagram are all names for the same chart: values on axes that radiate from a centre, joined into a polygon. The spider names come from the web-like look of the spokes and scale rings. A radar chart is also one kind of radial chart, the wider family of charts laid out around a centre." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a radar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Each spoke is one variable, with low values at the centre and high values at the edge. Find where an item's shape crosses a spoke to read its value for that variable. Points far from the centre are strengths, points near it are weaknesses, and where two shapes cross between spokes, the items swap places from one variable to the next." }
                },
                {
                    "@type": "Question",
                    "name": "When should you not use a radar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Avoid a radar chart when you have more than three or four items, when the variables use different units or scales, when the variables have a natural order such as months, or when readers need to compare exact values. A grouped bar chart is usually easier to read in those cases." }
                },
                {
                    "@type": "Question",
                    "name": "Who invented the radar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The German statistician Georg von Mayr is credited with the first radar chart, or star plot, in 1877. Star plots later became a standard technique of exploratory data analysis for showing many variables per item." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a radar chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartPolarSurface, add a PolarCategoryAxis as the angular axis with one label per variable, and a PolarNumericAxis as the radial axis with gridlineMode set to EPolarGridlineMode.Polygons. Then add a PolarMountainRenderableSeries or PolarLineRenderableSeries for each item, repeating the first point at the end to close the shape. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Radar Chart (Spider Chart)

## What is a radar chart?

A **radar chart** (also called a spider chart, radar plot, spider plot or star plot) compares items across three or more variables. Each variable gets its own axis, radiating from a centre like spokes. An item's values are marked on those axes and joined into a polygon, so its shape shows where it is strong and where it is weak.

![A radar chart comparing two phones on six features scored out of 10: a blue shape for Phone A reaches furthest on battery life and value for money, an orange shape for Phone B reaches furthest on camera, screen, performance and storage](/img/learn/radar-chart-og.png)

*A radar chart comparing two phones on six features, each scored out of 10 (sample data). [Try the interactive version](#how-to-create-a-radar-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A radar chart shows **one item as one shape**, across several variables that share a scale.
- **Far from the centre is high, near the centre is low.** Spikes are strengths; dents are weaknesses.
- Describe one in a sentence: "*Phone A* leads on *battery life* and *value for money*; *Phone B* leads on the other *four* features."
- **Spoke order and polygon area can mislead.** Reordering the spokes changes the shape, and area exaggerates differences.
- With more than three or four items, or when exact values matter, a **grouped bar chart** is usually clearer.
:::

## How to read a radar chart

![Anatomy of a radar chart: five axes radiating from a centre at zero, pentagon-shaped scale rings, one item's scores plotted on each axis and joined into a filled polygon](./radar-chart-anatomy.svg)

1. **Find the variables.** Each spoke (axis) is one variable, named at its outer end. Most radar charts have between 4 and 10 spokes.
2. **Check the scale.** The centre is the lowest value and the rim the highest. The rings (gridlines) join the same value on every spoke and form the "web" that gives the chart its other names, spider chart and spider web diagram. Check that every spoke uses the same scale, and that higher means better on all of them.
3. **Read one shape at a time.** Where an item's polygon crosses a spoke is its value for that variable. Points out near the rim are its strengths; points pulled in towards the centre are its weaknesses.
4. **Judge the overall shape.** A large, round shape is an all-rounder that scores well everywhere. A small round shape is consistently weak. A spiky or lopsided shape means the item is a specialist.
5. **Compare shapes spoke by spoke.** Where one shape sits outside another, that item leads. Where two outlines cross, the lead switches from one item to the other.

Because its axes radiate from a centre, a radar chart is one of the **radial charts**, a family that also includes radial bar charts, polar area charts and pie charts. What sets the radar chart apart is that each spoke is a different variable, and the values are joined into a shape.

## How to describe a radar chart

A radar chart is a comparison, so describe it as one. This template works for reports, exam answers and slide notes:

> **[Item A]** leads on **[variables]**, and **[Item B]** leads on **[variables]**. **[Item A]**'s shape is **[balanced / lopsided]**, with its weakest score on **[variable]**.

**Worked example,** using the phone chart above (scores out of 10):

| Feature | Phone A | Phone B | Leader |
| --- | --- | --- | --- |
| Battery life | 9 | 5 | A |
| Camera | 6 | 9 | B |
| Screen | 7 | 9 | B |
| Performance | 5 | 9 | B |
| Storage | 6 | 8 | B |
| Value for money | 8 | 3 | A |
| **Average** | **6.8** | **7.2** | |

"Phone A leads on battery life and value for money, and Phone B leads on the other four features. Phone A's shape is fairly balanced, never dropping below 5. Phone B's is lopsided: it has the higher average score (7.2 against 6.8), but it scores only 3 for value for money."

Notice what the description doesn't say: "Phone B is better". Which phone is better depends on which features matter to the reader, and the chart deliberately leaves that judgement to them.

## When to use a radar chart

Use a radar chart to **compare the overall profile of no more than three or four items** across several variables on one scale. Typical uses:

- **products and suppliers:** comparing features, or scoring bids against selection criteria;
- **sport:** a player's skills against another player or a league average;
- **people and teams:** skills assessments and performance reviews against a target profile;
- **engineering and quality:** a design measured against several requirements at once.

Choose the chart by what the reader needs to do:

| If the reader needs to… | Use |
| --- | --- |
| See the overall profile of no more than 3 or 4 items across 4 to 10 variables on one scale | **Radar chart** |
| Compare exact values, or more than 3 items | [Grouped bar chart](/learn/bar-chart/) |
| Compare dozens of items across variables with different units | [Parallel coordinate plot](/2d-charts/chart-types/parallel-coordinate-plot/) |
| Follow a variable with a natural order, such as months | [Line chart](/learn/line-chart/): a radar chart would wrongly join the last month back to the first |
| Compare many items' profiles | One small radar chart per item, side by side, all on the same scale |

## Radar chart mistakes to avoid

| Mistake | Why it matters | What to do |
| --- | --- | --- |
| **Spoke order chosen at random** | The same data makes a different shape when you reorder the spokes, so a shape can suggest a pattern that isn't there | Put related variables next to each other, and keep the same order in every chart you compare |
| **Judging by area** | Area grows with the square of the values: doubling every score makes the shape four times as big | Compare values spoke by spoke, not the size of the shapes |
| **Too many items** | Filled polygons hide each other when there are more than three or four items | Show no more than three or four items per chart, use semi-transparent fills, or draw one small chart per item |
| **Mixed scales or directions** | If one spoke runs 0 to 10 and another 0 to 1,000, or "lower is better" on some spokes, the shape means nothing | Put every variable on the same scale (for example, a score out of 10) and make higher mean better on every spoke, such as "value for money" rather than "price" |
| **No values to check** | Each value sits on its own angled axis, so readers can't line values up against a shared baseline | Add tooltips, value labels or a table when exact values matter |
| **A centre that isn't zero** | If the scale starts above zero, small differences look large and low scores vanish into the middle | Start every spoke at zero, unless you say clearly that it doesn't |

### Worked example: how area and spoke order mislead

Take the phones above. Phone B's scores add up to 43 and Phone A's to 41, so Phone B is about **5% higher** in total. But in the chart above, Phone B's shape covers about **13% more area** than Phone A's, because area rewards high scores on neighbouring spokes.

Now keep the data the same and only change the order of the six spokes. Depending on the order, Phone B's area changes by about **10%** between its smallest and largest arrangement. The order in the chart above happens to be the one that gives Phone B its largest shape. Nothing about the phones has changed; only the drawing has.

The lesson: read the values on the spokes, and treat the size of a shape as a rough impression only.

## How to create a radar chart in JavaScript, React or Angular

SciChart.js draws radar charts on a polar chart surface, with the same WebGL and WebGPU rendering, tooltips and zooming as its other charts. Try the chart below: hover over a spoke to see both phones' scores, scroll to zoom, double-click to reset, and use the legend to show or hide a phone.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="radar chart" demo="polar-radar-chart" docs="/2d-charts/chart-types/polar-radar-chart/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartPolarSurface,
        PolarCategoryAxis,
        PolarNumericAxis,
        PolarMountainRenderableSeries,
        XyDataSeries,
        NumberRange,
        EPolarAxisMode,
        EPolarGridlineMode,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        const { variables, items } = getYourRadarData(); // e.g. ["Speed", ...] and [{ name, scores }]
        sciChartSurface.xAxes.add(
            new PolarCategoryAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Angular,
                labels: variables,
                startAngle: Math.PI / 2,
                flippedCoordinates: true
            })
        );
        sciChartSurface.yAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Radial,
                gridlineMode: EPolarGridlineMode.Polygons,
                visibleRange: new NumberRange(0, 10),
                startAngle: Math.PI / 2
            })
        );

        for (const item of items) {
            sciChartSurface.renderableSeries.add(
                new PolarMountainRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: [...variables.map((_, i) => i), variables.length],
                        yValues: [...item.scores, item.scores[0]], // repeat the first point to close the shape
                        dataSeriesName: item.name
                    }),
                    stroke: "#50C7E0",
                    fill: "#50C7E044",
                    strokeThickness: 3
                })
            );
        }
        return { sciChartSurface };
    };

    export const RadarChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartPolarSurface,
        PolarCategoryAxis,
        PolarNumericAxis,
        PolarMountainRenderableSeries,
        XyDataSeries,
        NumberRange,
        EPolarAxisMode,
        EPolarGridlineMode,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-radar-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class RadarChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            const { variables, items } = getYourRadarData(); // e.g. ["Speed", ...] and [{ name, scores }]
            sciChartSurface.xAxes.add(
                new PolarCategoryAxis(wasmContext, {
                    polarAxisMode: EPolarAxisMode.Angular,
                    labels: variables,
                    startAngle: Math.PI / 2,
                    flippedCoordinates: true
                })
            );
            sciChartSurface.yAxes.add(
                new PolarNumericAxis(wasmContext, {
                    polarAxisMode: EPolarAxisMode.Radial,
                    gridlineMode: EPolarGridlineMode.Polygons,
                    visibleRange: new NumberRange(0, 10),
                    startAngle: Math.PI / 2
                })
            );

            for (const item of items) {
                sciChartSurface.renderableSeries.add(
                    new PolarMountainRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, {
                            xValues: [...variables.map((_, i) => i), variables.length],
                            yValues: [...item.scores, item.scores[0]], // repeat the first point to close the shape
                            dataSeriesName: item.name
                        }),
                        stroke: "#50C7E0",
                        fill: "#50C7E044",
                        strokeThickness: 3
                    })
                );
            }
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A radar chart is a polar chart. [SciChartPolarSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpolarsurface.html) replaces `SciChartSurface`, with an angular axis around the edge and a radial axis from the centre outwards.
- A [PolarCategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/polarcategoryaxis.html) with `labels` gives one spoke per variable. `startAngle: Math.PI / 2` puts the first spoke at 12 o'clock and `flippedCoordinates: true` runs the spokes clockwise.
- `gridlineMode: EPolarGridlineMode.Polygons` on the radial `PolarNumericAxis` draws straight-sided rings: the radar or spider-web look. Without it you get circles.
- Each item is a [PolarMountainRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/polarmountainrenderableseries.html) (filled) or a `PolarLineRenderableSeries` (outline only). Repeat the first value at the end so the polygon closes. The tooltip comes from `PolarCursorModifier`; polar charts have their own zoom and legend modifiers too.

**See it in the demo app:** [JavaScript radar chart](https://www.scichart.com/demo/javascript/polar-radar-chart) · [React radar chart](https://www.scichart.com/demo/react/polar-radar-chart) · [Angular radar chart](https://www.scichart.com/demo/angular/polar-radar-chart)

**Go deeper:** [SciChart.js radar chart documentation](/2d-charts/chart-types/polar-radar-chart/), and the polar series it builds on: [polar line](/2d-charts/chart-types/polar-line-renderable-series/) and [polar mountain](/2d-charts/chart-types/polar-mountain-renderable-series/).

## Frequently asked questions

### What is a radar chart used for?

A radar chart compares a few items across several variables measured on the same scale, such as products across features, players across skills or candidates across criteria. Each item becomes a shape, so you can see its strengths and weaknesses, and how it differs from the others, at a glance.

### Is a spider chart the same as a radar chart?

Yes. Radar chart, radar plot, spider chart, spider plot, spider web diagram, web chart, star plot and Kiviat diagram are all names for the same chart: values on axes that radiate from a centre, joined into a polygon. The spider names come from the web-like look of the spokes and scale rings. A radar chart is also one kind of radial chart, the wider family of charts laid out around a centre.

### How do you read a radar chart?

Each spoke is one variable, with low values at the centre and high values at the edge. Find where an item's shape crosses a spoke to read its value for that variable. Points far from the centre are strengths, points near it are weaknesses, and where two shapes cross between spokes, the items swap places from one variable to the next.

### When should you not use a radar chart?

Avoid a radar chart when you have more than three or four items, when the variables use different units or scales, when the variables have a natural order such as months, or when readers need to compare exact values. A grouped bar chart is usually easier to read in those cases.

### Who invented the radar chart?

The German statistician Georg von Mayr is credited with the first radar chart, or star plot, in 1877. Star plots later became a standard technique of exploratory data analysis for showing many variables per item.

### How do I make a radar chart in JavaScript?

With SciChart.js, create a `SciChartPolarSurface`, add a `PolarCategoryAxis` as the angular axis with one label per variable, and a `PolarNumericAxis` as the radial axis with `gridlineMode` set to `EPolarGridlineMode.Polygons`. Then add a `PolarMountainRenderableSeries` or `PolarLineRenderableSeries` for each item, repeating the first point at the end to close the shape. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- NIST/SEMATECH, [e-Handbook of Statistical Methods: Star Plot](https://www.itl.nist.gov/div898/handbook/eda/section3/starplot.htm). How star plots (radar charts) are used to compare items across many variables.
- Wikipedia, [Radar chart](https://en.wikipedia.org/wiki/Radar_chart). Other names for the chart, its history from Georg von Mayr (1877), and its limitations.
- Holtz, Y. and Healy, C., [The Radar chart and its caveats](https://www.data-to-viz.com/caveat/spider.html), data-to-viz.com. Why spoke order, scales and overplotting make radar charts hard to read, with alternatives.

<LearnCta position="bottom" chart="radar chart" demo="polar-radar-chart" docs="/2d-charts/chart-types/polar-radar-chart/" />
