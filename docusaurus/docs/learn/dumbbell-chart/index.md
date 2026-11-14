---
sidebar_position: 4.8
sidebar_label: Dumbbell Chart
title: "Dumbbell Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a dumbbell chart (dumbbell plot or connected dot plot) is, how to read it, how to sort it, when to use one instead of clustered bars, and the mistakes to avoid."
keywords:
    [
        "dumbbell chart",
        "dumbbell plot",
        "connected dot plot",
        "barbell chart",
        "DNA chart",
        "gap chart",
        "what is a dumbbell chart",
        "how to read a dumbbell chart",
        "dumbbell chart vs clustered bar chart"
    ]
image: /img/learn/dumbbell-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a dumbbell chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A dumbbell chart is used to compare two values for each of several categories and to show the gap between them: before and after, last year and this year, target and actual, or two groups such as men and women. Because each gap is drawn as a line, readers can see at a glance which categories changed most, and in which direction." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a dumbbell chart and a lollipop chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A lollipop chart shows one value per category, as a stem from zero to a dot. A dumbbell chart shows two values per category, as two dots joined by a line. In a lollipop chart the stem's length is the value; in a dumbbell chart the line's length is the gap between the two values, so its value axis doesn't need to start at zero." }
                },
                {
                    "@type": "Question",
                    "name": "Dumbbell chart or clustered bar chart: which is better?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Pick the dumbbell chart when the difference between the two values matters more than the values themselves, or when there are many categories. Use a clustered bar chart when readers need to compare each value with zero, or when there are more than two values per category. A dumbbell chart also suits values that sit far from zero, because its axis can start near the data." }
                },
                {
                    "@type": "Question",
                    "name": "Does a dumbbell chart have to start at zero?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. In a dumbbell chart readers compare the positions of the dots and the length of the gap between them, not a length from zero, so the value axis can start just below the smallest value. Label the axis clearly, and keep the same scale for every row so the gaps can be compared." }
                },
                {
                    "@type": "Question",
                    "name": "What is another name for a dumbbell chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A dumbbell chart is also called a dumbbell plot, barbell chart, connected dot plot, DNA chart or gap chart. It is a form of the Cleveland dot plot with two dots per row. When an arrowhead replaces one of the dots to show direction, it is often called an arrow chart." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a dumbbell chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with two NumericAxis objects, then add a FastLineSegmentRenderableSeries for the connecting lines and two XyScatterRenderableSeries for the dots. The line segment series joins its points in pairs, so give it two points per row: the first value and the second value at the same row position. Give each scatter series its own colour and add a LegendModifier to name the two ends. Putting the X axis on the left makes the dumbbells horizontal. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Dumbbell Chart

## What is a dumbbell chart?

A **dumbbell chart** (also called a dumbbell plot, connected dot plot, barbell chart, DNA chart or gap chart) shows **two values for each category** as two dots on a shared scale, joined by a line. The line's length is the **gap** between the two values, such as before and after, or this year and last year.

![A horizontal dumbbell chart of staff survey scores for ten teams in 2024 and 2025, one row per team with a grey 2024 dot and a blue 2025 dot joined by a line. Rows are sorted by the change: Support rose most, from 48 to 71, and Facilities fell most, from 57 to 45](/img/learn/dumbbell-chart-og.png)

*A dumbbell chart of staff survey scores by team, 2024 vs 2025 (sample data). [Try the interactive version](#how-to-create-a-dumbbell-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A dumbbell chart shows **two values per category** as **two dots joined by a line**. The line's length is the **gap** between them.
- Use it when the **change or difference** matters more than the values: before and after, two years, two groups, target and actual.
- Give the two ends **two colours and a legend**, so readers know which dot is which and which way each row moved.
- **Sort the rows** by the gap, or by one of the two values, to match the question the chart answers.
- The value axis **doesn't have to start at zero**, unlike a bar chart's.
:::

## How to read a dumbbell chart

![The parts of a dumbbell chart: average hours of sleep on weekdays and at weekends for four age groups (sample data). Callouts label the grey start dot, the teal end dot, the connecting line whose length is the gap, the gap label beside each row, the legend and the value axis, which starts at 6 rather than 0](./dumbbell-chart-anatomy.svg)

1. **Find out what the two dots stand for.** Check the legend or the title: two years, before and after, two groups. Each end has its own colour.
2. **Read each value at the centre of its dot,** against the value axis. Check the axis title for the unit, and note where the axis starts: it often starts well above zero.
3. **Read the gap from the line.** A long line is a big difference; a short line, or two overlapping dots, means little or no difference.
4. **Check the direction.** If the second value's dot sits to the right of the first, the value rose (on a horizontal chart); to the left, it fell. Rows can go both ways on the same chart, as Operations, HR and Facilities do in the chart above.
5. **Look at the order.** Most dumbbell charts are sorted, by the gap or by one of the values. The sort order tells you what the chart wants you to compare first (see [how to sort a dumbbell chart](#how-to-sort-a-dumbbell-chart)).

### How to describe a dumbbell chart

Use this template when you report a dumbbell chart:

> From **[first value's label]** to **[second value's label]**, **[measure]** **[rose / fell]** in **[how many]** of **[number]** **[categories]**. The biggest change was **[category]**, from **[value]** to **[value]**, and **[category]** moved the other way, from **[value]** to **[value]**.

**Worked example,** from the chart at the top of the page: "From 2024 to 2025, staff survey scores rose in seven of ten teams. The biggest rise was in Support, from 48 to 71, while Facilities fell furthest, from 57 to 45."

## Dumbbell chart vs clustered bar chart vs slope chart

Two values per category can be drawn in three common ways. Here's the same before-and-after data each way.

![Average waiting time at four clinics in 2023 and 2025 (sample data) drawn three ways. Left: clustered bars, a grey and a teal bar per clinic, each from zero. Middle: a dumbbell chart, one row per clinic with the two values joined by a line, sorted by the change. Right: a slope chart, with a 2023 column and a 2025 column and a line per clinic between them](./dumbbell-vs-bars-vs-slope.svg)

- **Clustered bars** show each value as a length from zero, which is good for reading the values. But the change at each clinic is the difference between two bar tops, which the eye has to work out.
- **The dumbbell chart** draws that difference as a line. Clinic A's big fall and Clinic B's tiny one are obvious, and the rows can be sorted by the change.
- **A slope chart** draws each category as a line from the first value to the second, so the direction shows as a slope. It works with a handful of categories; with more, the lines cross and the labels crowd. A slope chart is a [line chart](/learn/line-chart/) with only two points in time.

| | Clustered bar chart | Dumbbell chart | Slope chart |
| --- | --- | --- | --- |
| **Shows best** | Each value, measured from zero | The gap between two values in each row | The direction of change for each category |
| **Values per category** | Two or more | Two (sometimes three) | Two |
| **Axis starts at zero** | Must | Doesn't need to | Doesn't need to |
| **Categories it handles well** | A few | Many: one row each | A few: lines cross and labels overlap |
| **Ink used** | A lot | Little | Little |

**Rule of thumb:** if the question is "how big is each value?", use a [bar chart](/learn/bar-chart/#types-of-bar-chart) with clustered bars. If it's "where did things change, and by how much?", use a dumbbell chart. If there are only a few categories and the direction is the whole story, a slope chart is also a good choice.

## How to sort a dumbbell chart

The order of the rows decides what readers notice first. Pick it to match the chart's question:

| Sort by | Readers see first | Use it when |
| --- | --- | --- |
| **The gap** (second value minus first) | The biggest rises at one end and the biggest falls at the other | The change is the story, as in the chart at the top of this page |
| **The second value** (the latest or "after" value) | Today's ranking, with where each category came from | The current position matters most, such as this year's results |
| **The first value** | Where each category started, and whether the leaders kept their lead | You want to show catching up or falling behind |
| **A natural order** | Categories in their own order: months, age groups, sizes | The categories have an order that readers expect |
| **Alphabetical** | Nothing in particular | Only for long reference charts where readers look up one row |

The live chart below is sorted by the gap, because its question is "which teams changed most?" If the question were "which teams score best now?", sorting by the 2025 value would answer it better.

## Types of dumbbell chart

| Type | What it looks like | Use it for |
| --- | --- | --- |
| **Horizontal dumbbell chart** | Rows stacked down the page, category names on the left | Most dumbbell charts: long names and many categories fit easily |
| **Vertical dumbbell chart** | Upright dumbbells, categories along the bottom | A few categories with short names |
| **Arrow chart** | An arrowhead instead of the second dot | Making the direction of change impossible to miss |
| **Dumbbell chart coloured by direction** | The line or dots in one colour for rises and another for falls | Charts where both directions are common, or where "lower is better" |
| **Dumbbell chart with three dots** | Three dots on one line, such as three years | A short sequence, if the order of the dots stays clear |
| **Range dumbbell chart** | Dots at the lowest and highest values, such as a day's minimum and maximum temperature | Showing a spread or range rather than a change |

The **lollipop chart** is the dumbbell chart's one-value cousin: one dot on a stem from zero. If you only have one value per category, see the [lollipop chart](/learn/lollipop-chart/).

## When to use a dumbbell chart

Use a dumbbell chart when you have **two values for each of several categories** and the **difference between them** is the point. Typical uses:

- **before and after:** test scores before and after a course, waiting times before and after a change;
- **two points in time:** this year against last year, at the start and end of a project;
- **two groups:** men and women, two regions, two products, with one row per measure;
- **target against actual:** planned against delivered, forecast against outcome;
- **a range:** lowest and highest values, such as a price range or a temperature range.

| Chart | Best for |
| --- | --- |
| **Dumbbell chart** | The gap between two values in each of many categories |
| [Bar chart](/learn/bar-chart/) | Each value from zero; clustered bars for two or more values per category |
| [Lollipop chart](/learn/lollipop-chart/) | One value per category, with less ink than bars |
| [Line chart](/learn/line-chart/) | A value over many points in time; a slope chart for two points with few categories |
| [Error bars](/learn/error-bars/) | The uncertainty around a value, rather than two separate values |

## Common dumbbell chart mistakes

- **No legend, or two ends in the same colour.** Readers can't tell which dot is "before" and which is "after", so they can't tell rises from falls. Use two clearly different colours and name them.
- **Unsorted rows.** An alphabetical or random order hides the pattern. Sort by the gap or by one of the values (see [how to sort](#how-to-sort-a-dumbbell-chart)).
- **Hiding the direction.** When some rows rise and some fall, readers may assume they all moved the same way. Point it out in the title or the text, colour the lines by direction, or use arrows.
- **Not saying which way is good.** A fall in waiting times is good news; a fall in sales isn't. Say so in the title, such as "Waiting times fell at three of four clinics".
- **Overlapping dots.** When the two values are almost equal, the dots cover each other and one seems to be missing. Use smaller dots, or a note such as "no change".
- **Too many values per row.** Three dots on one line can work; more turns the row into a scatter of dots. Use a [line chart](/learn/line-chart/) for longer series.
- **Using it when the values matter more than the gap.** If readers need to see how big each value is compared with zero, clustered bars are clearer.

## How to create a dumbbell chart in JavaScript, React or Angular

SciChart.js has no single dumbbell series, but it builds one from two series types: a **line segment series**, which draws a separate line between each pair of points, for the connecting lines, and two **scatter series** for the end dots. Because it renders with WebGL and WebGPU, the same approach stays smooth with hundreds of rows. Try the chart below: hover over a row to see both scores and the change, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="dumbbell chart" demo="scatter-chart" docs="/2d-charts/chart-types/fast-line-segment-renderable-series/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineSegmentRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        LegendModifier,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // Category names and the two values for each, already sorted
        const { categories, startValues, endValues } = getYourDumbbellData();
        const rowIndexes = categories.map((_, index) => index);

        // X axis on the left: one horizontal dumbbell per row
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Left,
                labelProvider: new TextLabelProvider({ labels: categories, useNativeText: false }),
                autoTicks: false,
                majorDelta: 1,
                growBy: new NumberRange(0.05, 0.3)
            })
        );
        // Y axis along the top, with values growing left to right; it doesn't need to start at zero
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Top,
                flippedCoordinates: true,
                growBy: new NumberRange(0.1, 0.1)
            })
        );

        // Connecting lines: two points per row, joined in pairs
        const connectors = new FastLineSegmentRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: rowIndexes.flatMap((index) => [index, index]),
                yValues: rowIndexes.flatMap((index) => [startValues[index], endValues[index]])
            }),
            stroke: "#8A9AB0",
            strokeThickness: 4
        });
        // One scatter series for each end, in its own colour
        const makeDots = (name: string, values: number[], color: string) =>
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: rowIndexes, yValues: values, dataSeriesName: name }),
                stroke: color,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 18, height: 18, fill: color, stroke: color })
            });
        sciChartSurface.renderableSeries.add(
            connectors,
            makeDots("Before", startValues, "#B8C2D0"),
            makeDots("After", endValues, "#50C7E0")
        );

        const legend = new LegendModifier({ showCheckboxes: false });
        sciChartSurface.chartModifiers.add(legend);
        legend.includeSeries(connectors, false);
        return { sciChartSurface };
    };

    export const DumbbellChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineSegmentRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        LegendModifier,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-dumbbell-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class DumbbellChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // Category names and the two values for each, already sorted
            const { categories, startValues, endValues } = getYourDumbbellData();
            const rowIndexes = categories.map((_, index) => index);

            // X axis on the left: one horizontal dumbbell per row
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Left,
                    labelProvider: new TextLabelProvider({ labels: categories, useNativeText: false }),
                    autoTicks: false,
                    majorDelta: 1,
                    growBy: new NumberRange(0.05, 0.3)
                })
            );
            // Y axis along the top, with values growing left to right; it doesn't need to start at zero
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Top,
                    flippedCoordinates: true,
                    growBy: new NumberRange(0.1, 0.1)
                })
            );

            // Connecting lines: two points per row, joined in pairs
            const connectors = new FastLineSegmentRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: rowIndexes.flatMap((index) => [index, index]),
                    yValues: rowIndexes.flatMap((index) => [startValues[index], endValues[index]])
                }),
                stroke: "#8A9AB0",
                strokeThickness: 4
            });
            // One scatter series for each end, in its own colour
            const makeDots = (name: string, values: number[], color: string) =>
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: rowIndexes, yValues: values, dataSeriesName: name }),
                    stroke: color,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 18, height: 18, fill: color, stroke: color })
                });
            sciChartSurface.renderableSeries.add(
                connectors,
                makeDots("Before", startValues, "#B8C2D0"),
                makeDots("After", endValues, "#50C7E0")
            );

            const legend = new LegendModifier({ showCheckboxes: false });
            sciChartSurface.chartModifiers.add(legend);
            legend.includeSeries(connectors, false);
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [FastLineSegmentRenderableSeries](/2d-charts/chart-types/fast-line-segment-renderable-series/) joins its points in pairs (the first to the second, the third to the fourth, and so on) instead of in one continuous line. Give it two points per row, both at the row's position: the first value and the second value.
- Two [XyScatterRenderableSeries](/2d-charts/chart-types/xy-scatter-renderable-series/) draw the end dots, one per end, each with its own colour and name. Add the line series first, so the dots are drawn on top. A `LegendModifier` names the two ends; calling `includeSeries(connectors, false)` on the legend and on the `CursorModifier` leaves the lines out of the legend and the tooltip.
- The X axis on the left (`axisAlignment: EAxisAlignment.Left`) turns the chart on its side, for horizontal dumbbells. A [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) shows a category name at each row (0, 1, 2, …). Sort the data before you chart it.
- Another way to build the same chart is a [FastErrorBarsRenderableSeries](/2d-charts/chart-types/fast-error-bars-renderable-series/) for the lines, with `drawWhiskers: false` so they have no end caps, plus the same two scatter series. To colour each line by direction, give the line segment series a palette provider, as shown on its documentation page.

**See it in the demo app:** there's no dumbbell chart demo yet; the closest is the scatter chart demo, which uses the same scatter series and point markers as the dumbbell ends: [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart)

**Go deeper:** [SciChart.js dumbbell chart documentation](/2d-charts/chart-types/fast-line-segment-renderable-series/): the line segment series, including colouring each end of a line, and the [SciChart.js scatter chart documentation](/2d-charts/chart-types/xy-scatter-renderable-series/) for the dots.

## Frequently asked questions

### What is a dumbbell chart used for?

A dumbbell chart is used to compare two values for each of several categories and to show the gap between them: before and after, last year and this year, target and actual, or two groups such as men and women. Because each gap is drawn as a line, readers can see at a glance which categories changed most, and in which direction.

### What is the difference between a dumbbell chart and a lollipop chart?

A lollipop chart shows one value per category, as a stem from zero to a dot. A dumbbell chart shows two values per category, as two dots joined by a line. In a lollipop chart the stem's length is the value; in a dumbbell chart the line's length is the gap between the two values, so its value axis doesn't need to start at zero.

### Dumbbell chart or clustered bar chart: which is better?

Pick the dumbbell chart when the difference between the two values matters more than the values themselves, or when there are many categories. Use a clustered bar chart when readers need to compare each value with zero, or when there are more than two values per category. A dumbbell chart also suits values that sit far from zero, because its axis can start near the data.

### Does a dumbbell chart have to start at zero?

No. In a dumbbell chart readers compare the positions of the dots and the length of the gap between them, not a length from zero, so the value axis can start just below the smallest value. Label the axis clearly, and keep the same scale for every row so the gaps can be compared.

### What is another name for a dumbbell chart?

A dumbbell chart is also called a dumbbell plot, barbell chart, connected dot plot, DNA chart or gap chart. It is a form of the Cleveland dot plot with two dots per row. When an arrowhead replaces one of the dots to show direction, it is often called an arrow chart.

### How do I make a dumbbell chart in JavaScript?

With SciChart.js, create a `SciChartSurface` with two `NumericAxis` objects, then add a `FastLineSegmentRenderableSeries` for the connecting lines and two `XyScatterRenderableSeries` for the dots. The line segment series joins its points in pairs, so give it two points per row: the first value and the second value at the same row position. Give each scatter series its own colour and add a `LegendModifier` to name the two ends. Putting the X axis on the left makes the dumbbells horizontal. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Cleveland, W. S. (1984), [Graphical methods for data presentation: full scale breaks, dot charts, and multibased logging](https://doi.org/10.1080/00031305.1984.10483224). *The American Statistician*, 38(4), 270–280. Introduces the dot chart, the design that dumbbell charts build on.
- Cleveland, W. S. and McGill, R. (1984), [Graphical perception: theory, experimentation, and application to the development of graphical methods](https://doi.org/10.1080/01621459.1984.10478080). *Journal of the American Statistical Association*, 79(387). Why positions on a common scale, as in dot and dumbbell charts, are compared accurately.

<LearnCta position="bottom" chart="dumbbell chart" demo="scatter-chart" docs="/2d-charts/chart-types/fast-line-segment-renderable-series/" />
