---
sidebar_position: 20
sidebar_label: Log Scale Graph
title: "Log Scale Graph: What It Is & How to Read It (Interactive Example)"
description: "What a log scale graph is, how to read its gridlines, semi-log vs log-log graphs, when to use a logarithmic scale and the mistakes to avoid. With a live, interactive example."
keywords:
    [
        "log scale graph",
        "logarithmic graph",
        "log chart",
        "logarithmic scale",
        "semi-log graph",
        "log-log plot",
        "how to read a log scale",
        "linear vs logarithmic scale"
    ]
image: /img/learn/log-scale-graph-og.png
related: [cartesian-graph, line-chart, well-log, scatter-plot]
datePublished: 2026-11-16
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How do you read a log scale graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "First find the labelled gridlines: on a base-10 axis they go up in powers of ten, such as 1, 10, 100 and 1,000. Each step between them multiplies the value by 10. The unlabelled lines between them are 2, 3, 4 and so on up to 9 times the gridline below, and they get closer together towards the next power of ten. Read a point by finding the gridline below it and counting minor lines: two lines above 100 is 300." }
                },
                {
                    "@type": "Question",
                    "name": "What is a half log (semi-log) graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A half log graph, usually called a semi-log graph, has a logarithmic scale on one axis and an ordinary linear scale on the other. Most often the y-axis is logarithmic and the x-axis is time. On a semi-log graph, anything that grows by the same percentage each period, such as compound interest or an early-stage epidemic, plots as a straight line." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a linear and a log scale?",
                    "acceptedAnswer": { "@type": "Answer", "text": "On a linear scale, equal distances along the axis add the same amount: 0, 10, 20, 30. On a log scale, equal distances multiply by the same factor: 1, 10, 100, 1,000. A linear scale shows absolute differences; a log scale shows relative change, so a rise from 10 to 20 looks the same as a rise from 1,000 to 2,000." }
                },
                {
                    "@type": "Question",
                    "name": "How do you interpret a log-log graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "On a log-log graph both axes are logarithmic. A straight line means a power law: y is proportional to x raised to some power, and the slope of the line is that power. Measure the slope in decades: if the line rises 3 decades on the y-axis for every 1 decade on the x-axis, y grows with the cube of x." }
                },
                {
                    "@type": "Question",
                    "name": "Why use a log scale?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a log scale when your data spans several orders of magnitude, when you care about percentage change rather than absolute change, or when you want to check whether growth is exponential or follows a power law. It lets small and large values share one chart, and it turns steady percentage growth into a straight line." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a log scale graph in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, add a LogarithmicAxis to the chart instead of a NumericAxis, on the x-axis, the y-axis or both. Set logBase (10 by default) and a labelFormat such as ENumericFormat.Engineering or ENumericFormat.Scientific, then add your series as usual. Every value on a log axis must be greater than zero. The same axis setup runs in React through scichart-react and in Angular through scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Log Scale Graph

## What is a log scale graph?

A **log scale graph** (also called a logarithmic graph or log chart) is a chart where at least one axis uses a logarithmic scale: equal distances along the axis stand for equal ratios, not equal amounts. On a base-10 axis, 1, 10, 100 and 1,000 are evenly spaced, so data spanning many orders of magnitude fits on one chart.

![A semi-log graph with a logarithmic y-axis from 1 to 10 million and a linear x-axis from 0 to 100 time steps. A cyan exponential curve, growing 15% per step, is a straight line; an orange power-law curve rises steeply at first then bends over, and the two cross near step 3 and again near step 77](/img/learn/log-scale-graph-og.png)

*Two growth curves on a semi-log graph: the exponential (cyan) is a straight line, the power law (orange) bends over (illustrative data). [Try the interactive version](#how-to-create-a-log-scale-graph-in-javascript-react-or-angular) and switch either axis between linear and log.*

:::tip Key takeaways
- On a log scale, each step along the axis multiplies the value by the same factor (×10 on a base-10 axis), instead of adding the same amount.
- It fits small and large values on one chart and shows percentage change: a rise from 10 to 20 looks the same as a rise from 1,000 to 2,000.
- A semi-log graph (one log axis) turns steady percentage growth into a straight line. A log-log graph (both axes log) turns a power law into a straight line.
- A log axis has no zero and no negative values. Plan for them before you switch.
- Label log axes clearly: readers used to linear charts misread slopes and gaps on them.
:::

## How to read a log scale graph

On a log scale, each equal step along the axis multiplies the value by the same amount, so read the axis by its powers of ten and the tick marks between them.

![An annotated base-10 logarithmic axis from 1 to 1,000. The major ticks 1, 10, 100 and 1,000 are equally spaced, and each gap is marked ×10. Minor ticks for 2 to 9 times each power of ten get closer together towards the next power. Arrows from 2 to 4 and from 50 to 100 are the same length, both ×2. A point halfway between 10 and 100 reads about 32, and a point on the second minor tick after 100 reads 300](./log-axis-anatomy.svg)

1. Check which axes are logarithmic. Look at the labels: if they go up by multiplying (1, 10, 100, 1K) rather than adding (0, 20, 40, 60), that axis is a log scale. It may be one axis or both.
2. Find the major gridlines. On a base-10 axis, each labelled line is ten times the one before. The gap between two of them is one **decade** (an order of magnitude), and every decade is the same width.
3. Read the minor gridlines. Between 10 and 100, the unlabelled lines are 20, 30, 40 and so on up to 90. They bunch up towards the top of each decade, because 90 to 100 is a much smaller ratio than 10 to 20.
4. Read a point's value. Find the major line below it, then count minor lines: the second line above 100 is 300. Between lines, estimate in ratios, not distances. The point halfway between 10 and 100 is about 32 (the square root of 10 × 100), not 55.
5. Compare points by ratio. The same vertical distance means the same ratio anywhere on the chart. A gap of one decade between two lines means one is ten times the other, whether they sit at 1 and 10 or at 100,000 and 1,000,000.
6. Read the slope as a rate. On a log y-axis, a steeper line means faster percentage growth, not a bigger increase in amount. A straight line means the rate is constant.

## Linear vs log scale

A **linear scale** adds the same amount at each step (0, 25,000, 50,000). A **log scale** multiplies by the same factor (100, 1,000, 10,000). The data is the same; only the spacing of the axis changes. Here is a value that starts at 100 and doubles every week:

![The same data drawn twice: a value that starts at 100 and doubles every week for 10 weeks. On a linear y-axis (left) the first six weeks lie flat along the bottom and the line shoots up after week 7. On a logarithmic y-axis (right) the same eleven points form a straight line from 100 to 102,400](./linear-vs-log-scale.svg)

| | Linear scale | Log scale |
| --- | --- | --- |
| Equal distances mean | The same difference (+25,000) | The same ratio (×10) |
| Steady percentage growth looks like | A curve that bends sharply upwards | A straight line |
| Small values next to large ones | Squashed flat against zero | Spread out and readable |
| Zero and negative values | Shown as normal | Can't be shown |
| Best question it answers | "How much more?" | "How many times more?" or "How fast is it growing?" |

Neither scale is more honest than the other. They answer different questions. The linear chart shows that most of the total arrives in the last few weeks. The log chart shows that the growth rate never changed.

## Semi-log vs log-log graphs

A **semi-log graph** (sometimes called a **half log** graph) has one logarithmic axis and one linear axis. A **log-log graph** (or log-log plot) has both axes logarithmic. Each one turns a different kind of relationship into a straight line, which is often the easiest way to tell them apart.

| Graph | Log axis | A straight line means | Slope tells you | Typical uses |
| --- | --- | --- | --- | --- |
| Semi-log (log y) | Y only | Exponential change: the same percentage each step | The growth (or decay) rate per step | Compound growth, epidemics in their early stage, radioactive decay, long-term price charts |
| Semi-log (log x) | X only | A logarithmic relationship: equal gains for each tenfold increase in x | The gain per decade of x | Frequency sweeps, dose-response curves, learning curves |
| Log-log | Both | A power law: y is proportional to x to some power | The power (exponent) | Physics and engineering scaling laws, city sizes, frequency response (Bode plots) |

### Example: exponential and power-law growth on log axes

The chart at the top of the page shows both kinds of curve (try it in the [live demo](#how-to-create-a-log-scale-graph-in-javascript-react-or-angular)):

- On the semi-log graph, the cyan curve is a straight line, so its growth rate is constant. It goes from about 164 at step 20 to about 2,680 at step 40: roughly ×16 every 20 steps, which is 15% per step.
- Switch the x-axis to log as well, and the cyan line bends but the orange curve becomes straight. It goes from 1,000 at step 10 to 1,000,000 at step 100: three decades up for one decade across, so its slope is 3 and it follows the cube of the step number.
- On a linear y-axis, both curves hug the bottom for the first 60 steps, and you can't tell which kind of growth either one is.

### How to describe a log scale graph

When you report a chart with a log axis, say so, and give the change as a ratio or rate:

> On a [log / semi-log / log-log] scale, [what was measured] rose from [start value] to [end value] over [period]: about [×factor or % per period], [steady / speeding up / slowing down].

For example: "On a semi-log scale, the value rose from about 164 at step 20 to about 43,800 at step 60: roughly ×16 every 20 steps (15% per step), at a steady rate."

## When to use a log scale

Use a log scale when one of these is true:

- The values span several orders of magnitude, for example from 10 to 10 million. On a linear axis, everything below the largest values is squashed against zero.
- You care about percentage change, not absolute change. Prices, populations, sales growth and infection counts are often compared this way. A 10% rise looks the same at any level.
- You suspect exponential growth or decay. On a semi-log graph it becomes a straight line, and a change in the rate shows up as a bend.
- You're testing for a power law. On a log-log graph a power law is a straight line, and its slope is the exponent.
- The measurement is already logarithmic, or engineers expect it to be. Frequency response charts (Bode plots) use a log frequency axis with gain in **decibels**, itself a log unit (every +10 dB is ten times the power). Earthquake magnitudes and pH work the same way: each whole step on the magnitude scale is a tenfold increase in the wave amplitude recorded on a seismogram, and each pH unit is a tenfold change in acidity.

Stay with a linear scale when the audience needs to compare amounts (which month sold the most), when the data includes zero or negative values, or when the range is small (say, 40 to 90), where a log axis looks almost linear and only adds confusion.

| Chart | Best for |
| --- | --- |
| Log scale graph | Values across several orders of magnitude, percentage change, exponential growth and power laws |
| [Line chart](/learn/chart-types/cartesian/line-chart/) with a linear axis | How a value changes over time when you care about the actual amounts and the range is modest |
| [Scatter plot](/learn/chart-types/cartesian/scatter-plot/) on log-log axes | The relationship between two measured variables that both span wide ranges |
| [Spectrogram](/learn/chart-types/cartesian/spectrogram/) | How the frequencies in a signal change over time, often with a log frequency axis and colour in decibels |

## Log base: 10, 2 or e?

The **base** is the factor between one major gridline and the next.

- Base 10 (the common logarithm) is the default for most charts, because its gridlines land on round numbers: 1, 10, 100, 1,000.
- Base 2 suits data that doubles: memory sizes (1, 2, 4, 8 GB), cell counts, or any chart where "how many doublings?" is the question.
- Base e (about 2.718, the natural logarithm) appears in maths and science, but its gridlines fall on awkward numbers, so charts rarely use it for labels.

The base changes only the labels and gridlines. The shape of the data is identical in any base, so a straight line in base 10 is a straight line in base 2.

## Common log scale mistakes

Most log scale mistakes come from data a log axis can't show, or from reading it as if it were linear.

- **Zero or negative values.** The log of zero or of a negative number doesn't exist, so those points can't be drawn. Don't quietly drop them or replace them with a tiny number. Choose instead: plot only the positive values and say so; add a constant to every value (such as plotting x + 1) and label the axis to match; plot the negative values on a separate, mirrored axis; or use a linear axis.
- **Reading slopes as amounts.** A steep line on a log axis means fast percentage growth, not a large increase. A line that flattens on a log axis can still be adding more each step than ever before.
- **Bars on a log axis.** A bar's length depends on where the axis happens to start, so on a log axis bar lengths mean nothing. Use points or lines, or a linear axis for bars.
- **An unlabelled log axis.** Readers assume linear unless told otherwise. Put "log scale" in the axis title, and label the gridlines with real values (100, 1K, 10K), not just exponents, for a general audience.
- **Small differences made to look large, or large ones small.** Log scales compress big values. Two lines that look close near the top of a log chart can differ by millions. Quote the actual numbers next to the chart when they matter.
- **Too few decades.** If the data spans less than about one order of magnitude, a log axis barely changes the picture and has few labelled gridlines. Use a linear axis.

Studies with both members of the public and scientists have found that log-scale charts are easy to misread (see [Sources](#sources)). When in doubt, show both versions.

## How to create a log scale graph in JavaScript, React or Angular

In SciChart.js, a log scale is a property of the axis, not of the series: replace a `NumericAxis` with a `LogarithmicAxis` on X, Y or both, and the same series draws on the new scale. The demo below plots 100 steps of exponential growth (+15% a step) against a power law (step³), so you can watch each curve straighten or bend as you switch the axes. Try it: switch each axis between **Linear** and **Log**, scroll to zoom, drag to pan, double-click to reset, and hover to read values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="log scale graph" demo="chart-logarithmic-axis" demoLabel="chart with logarithmic axis" docs="/2d-charts/axis-api/axis-types/logarithmic-axis/" docsLabel="SciChart.js logarithmic axis documentation" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { useRef } from "react";
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        ENumericFormat,
        SciChartJsNavyTheme,
        TSciChart
    } from "scichart";

    // A linear or a logarithmic axis, with the same labels
    const makeAxis = (wasmContext: TSciChart, isLog: boolean, axisTitle: string) =>
        isLog
            ? new LogarithmicAxis(wasmContext, {
                  axisTitle,
                  logBase: 10,
                  labelFormat: ENumericFormat.Engineering,
                  autoTicks: false,
                  majorDelta: 1, // a labelled gridline at every power of ten
                  minorDelta: 1 // minor gridlines at 2 to 9 times each one
              })
            : new NumericAxis(wasmContext, { axisTitle, labelFormat: ENumericFormat.Engineering, labelPrecision: 1 });

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(makeAxis(wasmContext, false, "Time"));
        sciChartSurface.yAxes.add(makeAxis(wasmContext, true, "Value (log scale)"));

        const { xValues, yValues } = getYourGrowthData(); // every y value must be greater than zero
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                stroke: "#50C7E0",
                strokeThickness: 3
            })
        );
        return { sciChartSurface, wasmContext };
    };

    export const LogScaleGraph = () => {
        const chart = useRef<{ sciChartSurface: SciChartSurface; wasmContext: TSciChart }>();

        // Swap the y-axis for a linear or a log one; the series keeps its data
        const setYScale = (isLog: boolean) => {
            if (!chart.current) return;
            const { sciChartSurface, wasmContext } = chart.current;
            sciChartSurface.yAxes.remove(sciChartSurface.yAxes.get(0), true);
            const yAxis = makeAxis(wasmContext, isLog, isLog ? "Value (log scale)" : "Value");
            sciChartSurface.yAxes.add(yAxis);
            yAxis.visibleRange = yAxis.getMaximumRange();
        };

        return (
            <>
                <button onClick={() => setYScale(false)}>Linear</button>
                <button onClick={() => setYScale(true)}>Log</button>
                <SciChartReact
                    initChart={initChart}
                    onInit={(result) => (chart.current = result)}
                    style={{ width: "100%", height: 400 }}
                />
            </>
        );
    };
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        ENumericFormat,
        SciChartJsNavyTheme,
        TSciChart
    } from "scichart";

    // A linear or a logarithmic axis, with the same labels
    const makeAxis = (wasmContext: TSciChart, isLog: boolean, axisTitle: string) =>
        isLog
            ? new LogarithmicAxis(wasmContext, {
                  axisTitle,
                  logBase: 10,
                  labelFormat: ENumericFormat.Engineering,
                  autoTicks: false,
                  majorDelta: 1, // a labelled gridline at every power of ten
                  minorDelta: 1 // minor gridlines at 2 to 9 times each one
              })
            : new NumericAxis(wasmContext, { axisTitle, labelFormat: ENumericFormat.Engineering, labelPrecision: 1 });

    @Component({
        selector: "app-log-scale-graph",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <button (click)="setYScale(false)">Linear</button>
            <button (click)="setYScale(true)">Log</button>
            <scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>
        `
    })
    export class LogScaleGraphComponent {
        private sciChartSurface?: SciChartSurface;
        private wasmContext?: TSciChart;

        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(makeAxis(wasmContext, false, "Time"));
            sciChartSurface.yAxes.add(makeAxis(wasmContext, true, "Value (log scale)"));

            const { xValues, yValues } = getYourGrowthData(); // every y value must be greater than zero
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                    stroke: "#50C7E0",
                    strokeThickness: 3
                })
            );
            this.sciChartSurface = sciChartSurface;
            this.wasmContext = wasmContext;
            return { sciChartSurface };
        };

        // Swap the y-axis for a linear or a log one; the series keeps its data
        setYScale(isLog: boolean) {
            if (!this.sciChartSurface || !this.wasmContext) return;
            this.sciChartSurface.yAxes.remove(this.sciChartSurface.yAxes.get(0), true);
            const yAxis = makeAxis(this.wasmContext, isLog, isLog ? "Value (log scale)" : "Value");
            this.sciChartSurface.yAxes.add(yAxis);
            yAxis.visibleRange = yAxis.getMaximumRange();
        }
    }
    ```
</CodeSnippetBlock>

Key points:

- A [LogarithmicAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/logarithmicaxis.html) takes the same options as a `NumericAxis`, plus `logBase` (10 by default; 2 for doubling data). Use it on the x-axis, the y-axis or both for a semi-log or log-log graph.
- `autoTicks: false` with `majorDelta: 1` puts a labelled gridline at every power of the base, and `minorDelta: 1` adds minor gridlines at 2, 3 … 9 times each one, like log graph paper. With `autoTicks` left on, the axis chooses its own spacing, and `majorTickMode` and `minorTickMode` give round-number or logarithmic ticks for narrow or very wide ranges.
- `labelFormat` sets how values read: `ENumericFormat.Engineering` gives 1K, 10K, 1M; `ENumericFormat.Scientific` gives powers of the axis' base, such as 1×10³; `ENumericFormat.SignificantFigures` keeps precision for very small values.
- Every value on a log axis must be greater than zero. For data that is all negative, set `isNegative: true`; for both signs, split the data across two [vertically stacked axes](/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/).

**See it in the demo app:** [JavaScript chart with logarithmic axis](https://www.scichart.com/demo/javascript/chart-logarithmic-axis) · [React chart with logarithmic axis](https://www.scichart.com/demo/react/chart-logarithmic-axis) · [Angular chart with logarithmic axis](https://www.scichart.com/demo/angular/chart-logarithmic-axis)

In 3D: [JavaScript 3D log-log scatter chart](https://www.scichart.com/demo/javascript/3d-log-log-scatter-chart) · [React 3D log-log scatter chart](https://www.scichart.com/demo/react/3d-log-log-scatter-chart) · [Angular 3D log-log scatter chart](https://www.scichart.com/demo/angular/3d-log-log-scatter-chart)

**Go deeper:** [SciChart.js logarithmic axis documentation](/2d-charts/axis-api/axis-types/logarithmic-axis/), including base-2 axes for financial charts and the tick modes, and [gridline and label spacing](/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval/).

## Frequently asked questions

### How do you read a log scale graph?

First find the labelled gridlines: on a base-10 axis they go up in powers of ten, such as 1, 10, 100 and 1,000. Each step between them multiplies the value by 10. The unlabelled lines between them are 2, 3, 4 and so on up to 9 times the gridline below, and they get closer together towards the next power of ten. Read a point by finding the gridline below it and counting minor lines: two lines above 100 is 300.

### What is a half log (semi-log) graph?

A half log graph, usually called a semi-log graph, has a logarithmic scale on one axis and an ordinary linear scale on the other. Most often the y-axis is logarithmic and the x-axis is time. On a semi-log graph, anything that grows by the same percentage each period, such as compound interest or an early-stage epidemic, plots as a straight line.

### What is the difference between a linear and a log scale?

On a linear scale, equal distances along the axis add the same amount: 0, 10, 20, 30. On a log scale, equal distances multiply by the same factor: 1, 10, 100, 1,000. A linear scale shows absolute differences; a log scale shows relative change, so a rise from 10 to 20 looks the same as a rise from 1,000 to 2,000.

### How do you interpret a log-log graph?

On a log-log graph both axes are logarithmic. A straight line means a power law: y is proportional to x raised to some power, and the slope of the line is that power. Measure the slope in decades: if the line rises 3 decades on the y-axis for every 1 decade on the x-axis, y grows with the cube of x.

### Why use a log scale?

Use a log scale when your data spans several orders of magnitude, when you care about percentage change rather than absolute change, or when you want to check whether growth is exponential or follows a power law. It lets small and large values share one chart, and it turns steady percentage growth into a straight line.

### How do I make a log scale graph in JavaScript?

With SciChart.js, add a `LogarithmicAxis` to the chart instead of a `NumericAxis`, on the x-axis, the y-axis or both. Set `logBase` (10 by default) and a `labelFormat` such as `ENumericFormat.Engineering` or `ENumericFormat.Scientific`, then add your series as usual. Every value on a log axis must be greater than zero. The same axis setup runs in React through `scichart-react` and in Angular through `scichart-angular`.

## Sources

- U.S. Geological Survey, [Earthquake Magnitude, Energy Release, and Shaking Intensity](https://www.usgs.gov/programs/earthquake-hazards/earthquake-magnitude-energy-release-and-shaking-intensity). Each whole-number step in magnitude is a tenfold increase in measured amplitude.
- U.S. Geological Survey, [pH and Water](https://www.usgs.gov/special-topics/water-science-school/science/ph-and-water). pH is reported in logarithmic units: each number is a tenfold change in acidity.
- Romano, A., Sotis, C., Dominioni, G. and Guidi, S. (2020), [The scale of COVID-19 graphs affects understanding, attitudes, and policy preferences](https://doi.org/10.1002/hec.4143). *Health Economics*, 29(11), 1482–1494. Members of the public read the same data differently on log and linear scales.
- Menge, D. N. L., MacPherson, A. C., Bytnerowicz, T. A. et al. (2018), [Logarithmic scales in ecological data presentation may cause misinterpretation](https://doi.org/10.1038/s41559-018-0610-7). *Nature Ecology & Evolution*, 2, 1393–1402. Log-scaled graphs can lead scientists to misinterpret data.

<LearnCta position="bottom" chart="log scale graph" demo="chart-logarithmic-axis" demoLabel="chart with logarithmic axis" docs="/2d-charts/axis-api/axis-types/logarithmic-axis/" docsLabel="SciChart.js logarithmic axis documentation" />
