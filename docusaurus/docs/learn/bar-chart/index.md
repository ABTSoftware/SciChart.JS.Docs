---
sidebar_position: 4
sidebar_label: Bar Chart
title: "Bar Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a bar chart is, how to read and describe one, column vs bar, stacked and grouped bars, which type to choose and the mistakes to avoid. With a live, interactive example."
keywords:
    [
        "bar chart",
        "what is a bar chart",
        "bar graph",
        "column chart",
        "stacked bar chart",
        "segmented bar chart",
        "horizontal bar chart",
        "how to describe a bar chart",
        "bar chart vs column chart"
    ]
image: /img/learn/bar-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a bar chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A bar chart is used to compare one value across separate categories, such as sales by product, votes by party or survey answers by option. Because every bar starts from the same baseline, readers can rank the categories and judge how much bigger one is than another at a glance." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a bar chart and a column chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Only the direction of the bars. A column chart has vertical bars, with categories along the bottom. Many tools call horizontal bars a bar chart and vertical bars a column chart, but in everyday use \"bar chart\" covers both. Horizontal bars suit long category names; vertical columns suit ordered categories such as months." }
                },
                {
                    "@type": "Question",
                    "name": "What is a stacked bar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A stacked bar chart, also called a segmented bar chart, splits each bar into segments placed end to end, one for each part. The whole bar shows the category's total and each segment shows one part of it. In a 100% stacked bar chart every bar is the same length, so you compare shares instead of totals." }
                },
                {
                    "@type": "Question",
                    "name": "Is a histogram a bar graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No, although they look alike. In a bar graph each bar is a separate category, so the bars have gaps and can go in any order. In a histogram each bar is a range of one numeric variable, so the bars touch and must stay in numeric order." }
                },
                {
                    "@type": "Question",
                    "name": "Does a bar chart have to start at zero?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes, the value axis of a bar chart should start at zero. Readers judge a bar by its length, so cutting off the bottom of the axis makes small differences look large. If the differences that matter are small compared with the values, use a dot plot or a line chart instead." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a bar chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with two NumericAxis objects, then add a FastColumnRenderableSeries with an XyDataSeries holding one x value per category and one y value per bar. A TextLabelProvider shows the category names. For horizontal bars, put the X axis on the left. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Bar Chart

## What is a bar chart?

A **bar chart** (also called a bar graph, or a column chart when the bars stand upright) is a chart that compares a value across separate categories using rectangular bars. Each bar is one category and its length is the value, so the longest bar is the largest. Bars can run sideways or upwards, or be split into stacked parts.

![A horizontal bar chart of units sold by product, sorted from largest to smallest: laptops 482, phones 415, monitors 338, tablets 296, headphones 241, keyboards 187, webcams 132 and speakers 96](/img/learn/bar-chart-og.png)

*A horizontal bar chart of units sold for eight products (sample data), ranked from most to fewest. [Try the interactive version](#how-to-create-a-bar-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A bar chart **compares one value across categories**; the bar's **length** carries the value.
- **Bar or column** is only the direction: sideways bars suit long labels, upright columns suit ordered categories such as months.
- **Stacked** bars show totals and their parts; **grouped** bars compare the parts more accurately.
- The value axis should **start at zero**, and unordered categories read best **sorted by size**.
- Describe one in a sentence: the **largest**, the **smallest**, and the **gap or pattern** between them.
:::

## How to read a bar chart

![Four small charts: a bar chart with horizontal bars, a column chart with vertical bars, a stacked column chart whose bands add up to a total, and a grouped column chart with parts side by side](./bar-vs-column-chart.svg)

1. **Find the category axis and the value axis.** One axis lists the categories, such as products, regions or survey answers. The other has the numbers, with their units.
2. **Compare the lengths.** Every bar starts from the same baseline, so the longer bar is the bigger value. Read the exact figure from the value axis or a label at the end of the bar.
3. **Check the baseline.** The value axis should start at zero. If it starts higher, the bars' lengths are no longer in proportion and the differences look bigger than they are.
4. **Note the order.** Categories with no natural order are usually sorted by size, so the ranking is the first thing you see. Months, age groups and scores keep their own order.
5. **Read the segments, if there are any.** In a stacked bar, the whole bar is the total and each coloured band is one part. In a grouped chart, the bars side by side are the parts.

The **gaps between bars** are a clue: they show that each bar is a separate category. Bars that touch usually mean a [histogram](/learn/histogram/), where each bar is a range of numbers.

## Types of bar chart

| Type | What it looks like | The question it answers |
| --- | --- | --- |
| Simple bar or column chart | One bar per category | Which category is biggest, and by how much? |
| Grouped (clustered) bar chart | Several bars side by side in each category, one per series | How do the parts compare, within and across categories? |
| Stacked (segmented) bar chart | Each bar split into bands, one per part, end to end | How big is each total, and roughly what is it made of? |
| 100% stacked bar chart | Every bar the same length, split by percentage | How does the mix of parts differ between categories? |
| Diverging bar chart | Bars going left and right from a centre line | How far above or below a target, or zero, is each category? |

### Bar chart vs column chart

A **column chart** is a bar chart with vertical bars. Spreadsheet tools often use "bar chart" for horizontal bars and "column chart" for vertical ones, but in everyday use "bar chart" covers both. The choice is about readability.

| | Horizontal bar chart | Column chart (vertical) |
| --- | --- | --- |
| **Categories** | Down the side | Along the bottom |
| **Values** | Along the bottom or top | Up the side |
| **Best when** | Labels are long, or there are many categories | Categories have a natural order, such as months or years |
| **Reads like** | A ranked list, top to bottom | A sequence, left to right |

### Reading a stacked bar chart: a worked example

Two shops each sell £80,000 a month, split across three product lines (example figures):

| | Food | Drinks | Other | Total |
| --- | --- | --- | --- | --- |
| Shop A | £40k | £25k | £15k | £80k |
| Shop B | £30k | £27k | £23k | £80k |

Drawn as stacked bars, both bars are the same length, so the totals are easy to compare. **Food** sits on the baseline, so Shop A's lead is easy to see too. **Drinks** is the hard one: its band starts at £40k in Shop A and at £30k in Shop B, so the eye has to compare two lengths that start at different points. Shop B sells slightly more drinks, but most readers can't tell from the chart. When the middle parts matter, use a grouped chart, or label each band with its value.

## How to describe a bar chart

Reports, exam answers and dashboard captions describe a bar chart in the same few moves. Use this template:

> **[Category]** has the highest **[value]**, at **[number]**, followed by **[category]** at **[number]**. **[Category]** has the lowest, at **[number]**. **[One sentence on the pattern: a big gap, a cluster of similar bars, or the share of the total held by the top few.]**

**Worked example,** using the units-sold chart above: "Laptops sold the most units, 482, followed by phones at 415. Speakers sold the fewest, 96, about a fifth as many as laptops. The top three products (laptops, phones and monitors) account for 1,235 of the 2,187 units sold, about 56%."

For a stacked or grouped chart, add one sentence about the parts: which part is largest overall, and which category has an unusual mix.

## When to use a bar chart

Use a bar chart when you want to **compare one value across separate categories**, and the reader cares about which is bigger and by how much. It's one of the most accurate charts for comparing amounts, because readers judge lengths from a common baseline well.

| Chart | Best for |
| --- | --- |
| **Bar or column chart** | Comparing values across categories, ranking them, or showing each total's parts with stacked bars |
| [Line chart](/learn/line-chart/) | How a value changes over time, especially with many time points or more than one series |
| [Histogram](/learn/histogram/) | How one numeric variable is distributed, with its values counted into ranges (bins) |
| [Pie chart](/learn/pie-chart/) | One whole split into a few parts; with more than five parts, or parts of similar size, a bar chart is easier to read |

## Common bar chart mistakes

Check a bar chart against this list before you publish it:

- **The value axis starts at zero.** A cut-off axis can make a 5% difference look like a doubling. If the small differences are the story, use a dot plot or a line chart instead.
- **Unordered categories are sorted by size.** Alphabetical or random order makes the reader hunt for the ranking. Keep the natural order only for things like months, age groups or ratings.
- **One colour, unless colour means something.** A different colour for every bar suggests the colours carry meaning. Use one colour, and a second only to highlight the bar you're talking about.
- **No 3D bars or shadows.** Perspective changes how long the bars look, and the front face hides where each bar really ends.
- **No long, tilted labels.** If the category names don't fit under the columns, turn the chart into horizontal bars rather than rotating the text.
- **No comparing middle segments of stacked bars.** Only the bottom band and the total share a baseline. Use a grouped chart, or label the bands, when the parts matter.
- **Bars aren't standing in for a line.** Many time points, or several series over time, read better as a [line chart](/learn/line-chart/). A range of numbers (ages 20 to 29, 30 to 39…) with counts is a [histogram](/learn/histogram/).
- **The gaps are narrower than the bars.** Wide gaps make the bars hard to compare; no gaps make it look like a histogram.

## How to create a bar chart in JavaScript, React or Angular

SciChart.js draws bar and column charts with WebGL and WebGPU, so they stay smooth with large datasets and live updates. It has no separate horizontal bar series: you draw a column series and put the X (category) axis on the left. Try the chart below: scroll to zoom, drag to pan, double-click to reset, and hover over a bar to see its value.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="bar chart" demo="column-chart" docs="/2d-charts/chart-types/fast-column-renderable-series/column-series-type/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        const { categories, values } = getYourCategoryData();

        // Category axis on the left gives horizontal bars; leave out axisAlignment for vertical columns
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Left,
                labelProvider: new TextLabelProvider({ labels: categories }),
                autoTicks: false,
                majorDelta: 1,
                growBy: new NumberRange(0.05, 0.05)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top, flippedCoordinates: true })
        );

        sciChartSurface.renderableSeries.add(
            new FastColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: categories.map((_, index) => index),
                    yValues: values
                }),
                fill: "#29aade",
                dataPointWidth: 0.7
            })
        );
        return { sciChartSurface };
    };

    export const BarChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-bar-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class BarChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            const { categories, values } = getYourCategoryData();

            // Category axis on the left gives horizontal bars; leave out axisAlignment for vertical columns
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Left,
                    labelProvider: new TextLabelProvider({ labels: categories }),
                    autoTicks: false,
                    majorDelta: 1,
                    growBy: new NumberRange(0.05, 0.05)
                })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top, flippedCoordinates: true })
            );

            sciChartSurface.renderableSeries.add(
                new FastColumnRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: categories.map((_, index) => index),
                        yValues: values
                    }),
                    fill: "#29aade",
                    dataPointWidth: 0.7
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [FastColumnRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html) draws the bars. Its [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) holds one x value per category (0, 1, 2, …) and one y value per bar. `dataPointWidth` sets how much of each slot a bar fills.
- A [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) on a `NumericAxis` shows a category name at each x value.
- For **horizontal bars**, set the X axis `axisAlignment` to `Left` and the Y axis to `Top`, and set `flippedCoordinates` on the Y axis so values grow from left to right. See [vertical charts](/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis/). Leave both out for an ordinary column chart.
- For **stacked or grouped bars**, add [StackedColumnRenderableSeries](/2d-charts/chart-types/stacked-column-renderable-series/) to a `StackedColumnCollection`. Series with the same `stackedGroupId` stack; series with different ids sit side by side. Set `isOneHundredPercent` on the collection for a 100% stacked chart.

**See it in the demo app:** [JavaScript column chart](https://www.scichart.com/demo/javascript/column-chart) · [React column chart](https://www.scichart.com/demo/react/column-chart) · [Angular column chart](https://www.scichart.com/demo/angular/column-chart)

**Stacked bars:** [JavaScript stacked column chart](https://www.scichart.com/demo/javascript/stacked-column-chart) · [React stacked column chart](https://www.scichart.com/demo/react/stacked-column-chart) · [Angular stacked column chart](https://www.scichart.com/demo/angular/stacked-column-chart)

**Go deeper:** [SciChart.js bar chart documentation](/2d-charts/chart-types/fast-column-renderable-series/column-series-type/), including gaps, data labels and colouring individual bars, and the [SciChart.js stacked column chart documentation](/2d-charts/chart-types/stacked-column-renderable-series/).

## Frequently asked questions

### What is a bar chart used for?

A bar chart is used to compare one value across separate categories, such as sales by product, votes by party or survey answers by option. Because every bar starts from the same baseline, readers can rank the categories and judge how much bigger one is than another at a glance.

### What is the difference between a bar chart and a column chart?

Only the direction of the bars. A column chart has vertical bars, with categories along the bottom. Many tools call horizontal bars a bar chart and vertical bars a column chart, but in everyday use "bar chart" covers both. Horizontal bars suit long category names; vertical columns suit ordered categories such as months.

### What is a stacked bar chart?

A stacked bar chart, also called a segmented bar chart, splits each bar into segments placed end to end, one for each part. The whole bar shows the category's total and each segment shows one part of it. In a 100% stacked bar chart every bar is the same length, so you compare shares instead of totals.

### Is a histogram a bar graph?

No, although they look alike. In a bar graph each bar is a separate category, so the bars have gaps and can go in any order. In a histogram each bar is a range of one numeric variable, so the bars touch and must stay in numeric order.

### Does a bar chart have to start at zero?

Yes, the value axis of a bar chart should start at zero. Readers judge a bar by its length, so cutting off the bottom of the axis makes small differences look large. If the differences that matter are small compared with the values, use a dot plot or a line chart instead.

### How do I make a bar chart in JavaScript?

With SciChart.js, create a `SciChartSurface` with two `NumericAxis` objects, then add a `FastColumnRenderableSeries` with an `XyDataSeries` holding one x value per category and one y value per bar. A `TextLabelProvider` shows the category names. For horizontal bars, put the X axis on the left. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

## Sources

- Government Analysis Function (UK), [Data visualisation: charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/). Official guidance on bar, stacked and clustered bar charts, including ranking bars and starting the axis at zero.
- Cleveland, W. S. and McGill, R. (1984), [Graphical perception: theory, experimentation, and application to the development of graphical methods](https://doi.org/10.1080/01621459.1984.10478080). *Journal of the American Statistical Association*, 79(387). The experiments showing that people compare positions and lengths on a common scale more accurately than angles or areas.

<LearnCta position="bottom" chart="bar chart" demo="column-chart" docs="/2d-charts/chart-types/fast-column-renderable-series/column-series-type/" />
