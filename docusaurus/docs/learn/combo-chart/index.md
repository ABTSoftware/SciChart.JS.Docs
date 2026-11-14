---
sidebar_position: 4.6
sidebar_label: Combo Chart
title: "Combo Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a combo chart is, how to read columns and a line on one or two y-axes, when a dual axis chart helps or misleads, and the mistakes to avoid. With a live, interactive example."
keywords:
    [
        "combo chart",
        "combination chart",
        "bar and line chart",
        "dual axis chart",
        "what is a combo chart",
        "how to read a combo chart",
        "secondary axis chart",
        "combo chart vs dual axis chart"
    ]
image: /img/learn/combo-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a combo chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A combo chart is used to show two related measures for the same periods or categories in one view, so readers can see how they move together. Common pairs are a volume and a rate (orders and delivery time), an actual and a target, or a measured value and a trend line. The different chart forms tell readers the series are different kinds of measure." }
                },
                {
                    "@type": "Question",
                    "name": "What is a combo bar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A combo bar chart is a bar or column chart with at least one more series drawn as a line, area or markers on the same plot. The bars usually show amounts, such as units sold, and the line shows a related measure, such as a rate, an average or a target. If the line uses different units, it is read against a second y-axis." }
                },
                {
                    "@type": "Question",
                    "name": "Can you give an example of a combo chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A warehouse report might show shipments per month as columns against a left axis, and the average time from order to dispatch as a line against a right axis in hours. Reading the two together shows that dispatch time stayed flat until volume passed about 4,000 a month, then rose sharply from October to December." }
                },
                {
                    "@type": "Question",
                    "name": "Is a combo chart the same as a dual axis chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. A combo chart mixes chart forms, such as columns and a line, while a dual axis chart has two y-axes, one on each side, with different scales. They often appear together, but not always: a combo chart of actual and target sales needs only one axis, and a dual axis chart can show two lines. Use the second axis only when the series have different units." }
                },
                {
                    "@type": "Question",
                    "name": "Where does the primary axis go on a combo chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The primary y-axis usually goes on the left and belongs to the main series, often the columns. The secondary y-axis goes on the right and belongs to the line. Label both axes with their units, and colour each axis to match its series so readers can tell which scale to read." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a combo chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, add more than one series to the same SciChartSurface: for example a FastColumnRenderableSeries and a FastLineRenderableSeries that share the x-axis. For a dual axis chart, add a second NumericAxis with axisAlignment set to EAxisAlignment.Right and an id, and set the line series' yAxisId to that id. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Combo Chart

## What is a combo chart?

A **combo chart** (also called a combination chart or bar and line chart) draws two or more series in different forms, usually columns and a line, over one shared x-axis. It compares related measures, such as order volume and delivery time, across the same periods. When the measures use different units, the line gets its own y-axis on the right.

![A combo chart of a warehouse's year: twelve cyan columns show shipments per month against a left axis, rising from about 3,100 in January to 6,130 in December, and an orange line shows average dispatch time against a right axis in hours, flat near 18 to 19 hours until August and climbing to 33 hours in December](/img/learn/combo-chart-og.png)

*A combo chart of one warehouse's shipments (columns, left axis) and average dispatch time (line, right axis) over a year (sample data). [Try the interactive version](#how-to-create-a-combo-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A combo chart puts **two kinds of mark on one plot**, most often **columns for amounts** and **a line for a rate, average or target**, sharing one x-axis.
- If both series use the **same units**, keep **one y-axis**. If they use **different units**, give the line a **second y-axis** on the right: a **dual axis chart**.
- On a dual axis chart, compare the **shapes and timing** of the two series, not their heights. **Where the line crosses the columns means nothing.**
- The range chosen for the right-hand axis can make a change look small or dramatic. **Start the column axis at zero**, and choose the line's range for a reason.
- If readers need to compare the two series directly, **index both to a common starting value** or use two charts stacked on the same x-axis.
:::

## How to read a combo chart

![The parts of a combo chart: monthly shipment columns read against a left axis that starts at zero, an orange dispatch-time line read against a right axis in hours, a shared month axis, a legend naming which axis each series uses, and a circled point where the line meets a column, marked as having no meaning](./combo-chart-anatomy.svg)

1. **Start with the shared x-axis.** Both series are measured over the same months, dates or categories. Each column and the line point above it belong to the same period.
2. **Match each series to its axis.** The legend, the axis titles and the colours tell you which scale belongs to which series. In the diagram, cyan labels on the left go with the columns, and orange labels on the right go with the line.
3. **Read the columns against the left axis.** Compare column heights with each other, just as in a [bar chart](/learn/bar-chart/). This axis should start at zero.
4. **Read the line against the right axis.** Follow its slope to see whether the measure is rising, falling or flat.
5. **Compare the patterns, not the heights.** Ask whether the two series rise and fall together, whether one leads the other, and where they diverge. In the diagram, dispatch time barely moves while shipments vary between 3,000 and 3,700, then climbs once volume passes about 4,000.
6. **Ignore where the line crosses the columns.** With two independent scales, the line sitting above or below a column says nothing about which value is bigger. Move either axis range and the crossing moves too.

## Types of combo chart

Columns plus a line is the most common combo chart, but any mix of series that share an x-axis counts.

| Combination | What each part shows | Axes | Typical example |
| --- | --- | --- | --- |
| **Columns and a line, one axis** | Columns for actual values, a line for a target or an average | One: same units | Monthly sales against the sales target |
| **Columns and a line, two axes** | Columns for an amount, a line for a rate or a different measure | Two: different units | Shipments per month and dispatch time in hours |
| **Stacked columns and a line** | Columns split into parts, a line for the total or a goal | Usually one | Energy use by source, with a line for the monthly limit |
| **Area and a line** | A shaded range or baseline behind a measured value | One | A patient's heart rate against the normal range |
| **Markers and a line** | Measured points, with a fitted trend or model as a line | One | Lab measurements and the curve a model predicts |
| [**Pareto chart**](/learn/pareto-chart/) | Columns sorted from largest to smallest, a line for the cumulative percentage | Two: count and % | Support tickets by cause, with the running share of the total |

A **Pareto chart** is a special combo chart with fixed rules: sorted columns, a cumulative percentage line and a right-hand axis from 0% to 100%. See the [Pareto chart guide](/learn/pareto-chart/) for how to read and build one.

## One axis or two? Reading a dual axis chart honestly

A **dual axis chart** (also called a secondary axis chart) has two y-axes: one on the left and one on the right, each with its own scale. A combo chart only needs one when its series have **different units**, such as a count and a number of hours. Two series in the same units, such as actual and target sales, belong on **one axis**, so readers can compare them directly.

A second axis solves one problem and creates another. The two scales are set independently, so **the chart's maker decides how the line sits against the columns.** The same data can tell different stories:

![The same shipment and dispatch-time data drawn three ways. A: with the right axis from 0 to 40 hours, the line rises gently. B: with the right axis from 16 to 34 hours, the same line starts near the bottom, runs through the columns and climbs steeply. C: with both series indexed to January equals 100 on one axis, shipments end at 196 and dispatch time at 179](./combo-chart-axis-scales.svg)

- **Chart A** starts both axes at zero. Dispatch time grows from 18.5 to 33.1 hours, about 79%, and because the axis starts at zero, the line ends 79% higher than it starts.
- **Chart B** uses identical data, but the right axis runs from 16 to 34 hours. The flat months now sit low inside the columns, the line then shoots above them, and the year-end rise looks about twice as steep.
- **Chart C** drops the second axis. Each value is divided by its January value and multiplied by 100 (an **index**), so both series share one scale. Now the comparison is fair: shipments grew 96% and dispatch time 79%, and where the lines meet does mean something.

To keep a dual axis chart honest:

- **Start the column axis at zero.** A column's height is its value. Cutting the axis exaggerates differences between columns.
- **Choose the right-hand range for a reason,** such as starting at zero or a fixed range like 0% to 100%. Don't stretch it to make the line fill the plot.
- **Colour each axis like its series,** and put the units in both axis titles.
- **Draw grid lines from one axis only.** Two sets of grid lines that don't line up are hard to read.
- **Don't read meaning into crossings or gaps** between the line and the columns, and don't let your readers do so: say what the chart shows in a caption.
- **Consider an alternative** when the comparison matters more than the compact layout: an indexed chart like C, or two charts stacked on the same x-axis.

## How to describe a combo chart

Describe each series against its own axis, then the relationship between them:

> Over **[period]**, **[column measure]** **[rose / fell / stayed flat]** from **[start]** to **[end]**, while **[line measure]** **[changed]** from **[start]** to **[end]**. The two **[moved together / diverged]** **[when or where]**.

**Worked example:** "Over the year, monthly shipments almost doubled, from 3,120 in January to 6,130 in December, while average dispatch time rose from 18.5 to 33.1 hours. Dispatch time stayed under 21 hours until September, then climbed steeply once volume passed 4,000 a month in October."

Avoid sentences like "in December, dispatch time was below shipments". The two use different units, so they can't be compared that way.

## When to use a combo chart

Use a combo chart when **two related measures share the same periods or categories**, and the question is how one moves with the other. Typical uses:

- **operations:** volume against a time or a rate, such as orders and delivery time, or calls and average wait;
- **performance against a goal:** actual values as columns, a target or budget as a line;
- **science and engineering:** measurements as markers and a fitted model as a line, or a signal against its normal range;
- **finance:** price as a line or candles, with trading volume as columns (often on a separate pane below).

| Chart | Best for |
| --- | --- |
| **Combo chart** | Two related measures over the same periods or categories, where different chart forms help tell them apart |
| [Line chart](/learn/line-chart/) | One or more measures in the same units over time; index different measures to a common start to compare them on one axis |
| [Bar chart](/learn/bar-chart/#types-of-bar-chart) | Comparing amounts in the same units across categories, side by side as clustered bars |
| [Scatter plot](/learn/scatter-plot/) | Whether two measures are related, one dot per period or item, without the time order |
| [Pareto chart](/learn/pareto-chart/) | Ranking categories to find the few that make up most of a total |

## Common combo chart mistakes

- **A second axis for the same units.** If both series are in dollars or both are counts, put them on one axis. Two axes in the same units hide the real difference in size.
- **A column axis that doesn't start at zero.** Columns are read by their height, so a cut axis makes small differences look large.
- **A stretched right-hand axis.** Setting the line's range to fill the plot exaggerates its changes (chart B above). Pick the range for a reason and keep it fixed when you compare charts.
- **Reading crossings and gaps.** On a dual axis chart, the line being above a column means nothing.
- **Unlabelled axes or units.** Readers can't tell which scale belongs to which series. Colour and title each axis to match its series.
- **Too many series.** Two or three series are readable. Beyond that, use separate charts that share an x-axis.
- **Two lines on two axes, styled the same.** If the series look alike, readers assume they share a scale. A different form (columns and a line) or a different colour per series makes the split clear.
- **Taking a shared pattern as cause and effect.** Two series rising together over the same months doesn't prove one drives the other.

## How to create a combo chart in JavaScript, React or Angular

SciChart.js has no special combo series: you add more than one series to the same chart, and give the line its own y-axis when its units differ. Because SciChart.js draws with WebGL and WebGPU, the chart stays smooth to zoom and pan as your data grows or updates live. Try the chart below: scroll to zoom, drag to pan, double-click to reset, hover to see both values for a month, and use the legend's checkboxes to hide a series.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="combo chart" demo="chart-with-secondary-y-axis" docs="/2d-charts/chart-types/renderable-series-api-overview/" />

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
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        EAutoRange,
        NumberRange,
        LegendModifier,
        CursorModifier,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // One label per period, plus a value for each series
        const { labels, columnValues, lineValues } = getYourComboData();
        const xValues = labels.map((_, index) => index);

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                labelProvider: new TextLabelProvider({ labels }),
                autoTicks: false,
                majorDelta: 1
            })
        );
        // Left axis for the columns, starting at zero
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Shipments",
                labelStyle: { color: "#50C7E0" },
                growBy: new NumberRange(0, 0.1)
            })
        );
        // Right axis for the line, with a fixed range
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                id: "lineAxis",
                axisAlignment: EAxisAlignment.Right,
                axisTitle: "Hours",
                labelStyle: { color: "#F48420" },
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(0, 40),
                drawMajorGridLines: false,
                drawMinorGridLines: false
            })
        );

        sciChartSurface.renderableSeries.add(
            new FastColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: columnValues, dataSeriesName: "Shipments" }),
                fill: "#50C7E0CC",
                stroke: "#50C7E0",
                cornerRadius: 8
            }),
            new FastLineRenderableSeries(wasmContext, {
                yAxisId: "lineAxis",
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: lineValues, dataSeriesName: "Dispatch time (h)" }),
                stroke: "#F48420",
                strokeThickness: 3,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, stroke: "#F48420", fill: "#14233C" })
            })
        );
        sciChartSurface.chartModifiers.add(new LegendModifier(), new CursorModifier({ showTooltip: true }));
        return { sciChartSurface };
    };

    export const ComboChart = () => (
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
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        EAutoRange,
        NumberRange,
        LegendModifier,
        CursorModifier,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-combo-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class ComboChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // One label per period, plus a value for each series
            const { labels, columnValues, lineValues } = getYourComboData();
            const xValues = labels.map((_, index) => index);

            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    labelProvider: new TextLabelProvider({ labels }),
                    autoTicks: false,
                    majorDelta: 1
                })
            );
            // Left axis for the columns, starting at zero
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Shipments",
                    labelStyle: { color: "#50C7E0" },
                    growBy: new NumberRange(0, 0.1)
                })
            );
            // Right axis for the line, with a fixed range
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    id: "lineAxis",
                    axisAlignment: EAxisAlignment.Right,
                    axisTitle: "Hours",
                    labelStyle: { color: "#F48420" },
                    autoRange: EAutoRange.Never,
                    visibleRange: new NumberRange(0, 40),
                    drawMajorGridLines: false,
                    drawMinorGridLines: false
                })
            );

            sciChartSurface.renderableSeries.add(
                new FastColumnRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: columnValues, dataSeriesName: "Shipments" }),
                    fill: "#50C7E0CC",
                    stroke: "#50C7E0",
                    cornerRadius: 8
                }),
                new FastLineRenderableSeries(wasmContext, {
                    yAxisId: "lineAxis",
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: lineValues, dataSeriesName: "Dispatch time (h)" }),
                    stroke: "#F48420",
                    strokeThickness: 3,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, stroke: "#F48420", fill: "#14233C" })
                })
            );
            sciChartSurface.chartModifiers.add(new LegendModifier(), new CursorModifier({ showTooltip: true }));
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Every series you add to `sciChartSurface.renderableSeries` draws on the same chart, so a combo chart is just a [FastColumnRenderableSeries](/2d-charts/chart-types/fast-column-renderable-series/column-series-type/) plus a [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series/). Series draw in the order you add them, so add the line last to keep it on top. Any other [series type](/2d-charts/chart-types/renderable-series-api-overview/), such as a mountain (area), scatter or stacked column series, can be mixed in the same way.
- For a dual axis chart, add a second `NumericAxis` with `axisAlignment: EAxisAlignment.Right` and an `id`, and set the line's `yAxisId` to the same value. `autoRange: EAutoRange.Never` with a fixed `visibleRange` stops the axis rescaling to fill the plot. See [secondary and multiple axes](/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview/).
- `labelStyle` and `axisTitleStyle` colour each axis to match its series, and `drawMajorGridLines: false` on the right axis leaves one set of grid lines.
- A [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) shows a month or category name at each x value (0, 1, 2, …). The `LegendModifier` names each series and lets readers hide one; the `CursorModifier` tooltip shows both values for the period under the mouse.

**See it in the demo app:** [JavaScript chart with a secondary y-axis](https://www.scichart.com/demo/javascript/chart-with-secondary-y-axis) · [React chart with a secondary y-axis](https://www.scichart.com/demo/react/chart-with-secondary-y-axis) · [Angular chart with a secondary y-axis](https://www.scichart.com/demo/angular/chart-with-secondary-y-axis)

**Columns and a line in one chart:** [JavaScript chart with multi-style series](https://www.scichart.com/demo/javascript/multi-style-series) · [React chart with multi-style series](https://www.scichart.com/demo/react/multi-style-series) · [Angular chart with multi-style series](https://www.scichart.com/demo/angular/multi-style-series)

**Go deeper:** [SciChart.js chart types documentation](/2d-charts/chart-types/renderable-series-api-overview/), listing every series type you can combine, and the [SciChart.js secondary and multiple axes documentation](/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview/).

## Frequently asked questions

### What is a combo chart used for?

A combo chart is used to show two related measures for the same periods or categories in one view, so readers can see how they move together. Common pairs are a volume and a rate (orders and delivery time), an actual and a target, or a measured value and a trend line. The different chart forms tell readers the series are different kinds of measure.

### What is a combo bar chart?

A combo bar chart is a bar or column chart with at least one more series drawn as a line, area or markers on the same plot. The bars usually show amounts, such as units sold, and the line shows a related measure, such as a rate, an average or a target. If the line uses different units, it is read against a second y-axis.

### Can you give an example of a combo chart?

A warehouse report might show shipments per month as columns against a left axis, and the average time from order to dispatch as a line against a right axis in hours. Reading the two together shows that dispatch time stayed flat until volume passed about 4,000 a month, then rose sharply from October to December.

### Is a combo chart the same as a dual axis chart?

No. A combo chart mixes chart forms, such as columns and a line, while a dual axis chart has two y-axes, one on each side, with different scales. They often appear together, but not always: a combo chart of actual and target sales needs only one axis, and a dual axis chart can show two lines. Use the second axis only when the series have different units.

### Where does the primary axis go on a combo chart?

The primary y-axis usually goes on the left and belongs to the main series, often the columns. The secondary y-axis goes on the right and belongs to the line. Label both axes with their units, and colour each axis to match its series so readers can tell which scale to read.

### How do I make a combo chart in JavaScript?

With SciChart.js, add more than one series to the same SciChartSurface: for example a FastColumnRenderableSeries and a FastLineRenderableSeries that share the x-axis. For a dual axis chart, add a second NumericAxis with axisAlignment set to EAxisAlignment.Right and an id, and set the line series' yAxisId to that id. The same chart works in React with scichart-react and in Angular with scichart-angular.

## Sources

- Few, S. (2008), [Dual-Scaled Axes in Graphs: Are They Ever the Best Solution?](https://www.perceptualedge.com/articles/visual_business_intelligence/dual-scaled_axes.pdf) *Visual Business Intelligence Newsletter*, Perceptual Edge. Why crossings between series on independent scales mean nothing, and indexing and separate charts as alternatives.
- Cleveland, W. S. and McGill, R. (1984), [Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods](https://doi.org/10.1080/01621459.1984.10478080). *Journal of the American Statistical Association*, 79(387), 531–554. Experiments ranking how accurately people judge values shown in different ways, with position along a common scale the most accurate.

<LearnCta position="bottom" chart="combo chart" demo="chart-with-secondary-y-axis" docs="/2d-charts/chart-types/renderable-series-api-overview/" />
