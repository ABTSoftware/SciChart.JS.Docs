---
sidebar_position: 8.5
sidebar_label: Error Bars
title: "Error Bars: What They Mean & How to Read Them (With Interactive Examples)"
description: "What error bars show, how to read them, standard deviation vs standard error vs confidence interval bars, and what overlapping error bars do and don't mean."
keywords:
    [
        "error bars",
        "error bar graph",
        "what do error bars mean",
        "how to read error bars",
        "standard deviation vs standard error bars",
        "confidence interval error bars",
        "overlapping error bars",
        "how to calculate error bars"
    ]
image: /img/learn/error-bars-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What do error bars represent on a graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Error bars show the uncertainty or variability around a plotted value, usually a mean. Depending on how they were calculated, they show how spread out the data is (standard deviation or range), or how precisely the mean has been measured (standard error or a confidence interval). The two kinds look the same, so a chart with error bars must say which one it uses and how many measurements each value is based on." }
                },
                {
                    "@type": "Question",
                    "name": "Are error bars standard deviation or standard error?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They can be either, or a confidence interval, and there is no default. Standard deviation bars show how much individual measurements vary. Standard error bars show how precisely the mean is known, and they are smaller than standard deviation bars by a factor of the square root of the sample size. Check the caption or legend: if it doesn't say, you can't interpret the bars." }
                },
                {
                    "@type": "Question",
                    "name": "What does it mean when error bars overlap?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It depends on the type of bar. For two independent groups of about 10 or more measurements each: overlapping standard error bars mean the difference is not statistically significant (P greater than 0.05). But 95% confidence intervals can overlap by up to about half of one arm and the difference can still be significant at P about 0.05. Overlap of standard deviation bars tells you nothing about significance. For a firm answer, run a statistical test." }
                },
                {
                    "@type": "Question",
                    "name": "What are 95% error bars?",
                    "acceptedAnswer": { "@type": "Answer", "text": "95% error bars show a 95% confidence interval: a range worked out from the data that, across many repeats of the same study, would contain the true value 95% of the time. For a mean, the interval is the mean plus or minus a t value times the standard error. With 10 or more measurements it is roughly the mean plus or minus 2 standard errors. A survey's margin of error is half the width of a 95% confidence interval." }
                },
                {
                    "@type": "Question",
                    "name": "How are error bars calculated?",
                    "acceptedAnswer": { "@type": "Answer", "text": "First work out the mean of each group. For standard deviation bars, take the square root of the sum of the squared differences from the mean, divided by n minus 1. For standard error bars, divide the standard deviation by the square root of n. For 95% confidence interval bars, multiply the standard error by the t value for n minus 1 degrees of freedom (2.262 for 10 measurements). Draw each bar from the mean minus that amount to the mean plus it." }
                },
                {
                    "@type": "Question",
                    "name": "How do I add error bars to a chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, put each point's x value, its plotted value and the top and bottom of its error bar into an HlcDataSeries (x, y, high and low values), then draw it with a FastErrorBarsRenderableSeries. Add a point marker to show the mean, or draw a scatter, line or column series under the bars. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Error Bars

## What are error bars?

**Error bars** are short lines drawn through a point or bar on a chart to show how uncertain, or how variable, that value is. Each runs from a low to a high value around the plotted value, usually a mean. They can show the standard deviation, the standard error or a confidence interval, so the chart must say which.

![A chart of plant height in four fertiliser groups (Control, Low, Medium and High dose), 10 plants each: faint dots show every plant, and beside them three error bars around each group's mean show the standard deviation (widest), the standard error (narrowest) and the 95% confidence interval](/img/learn/error-bars-og.png)

*The same four groups of plants with three kinds of error bar side by side: standard deviation, standard error and 95% confidence interval (sample data). [Try the interactive version](#how-to-create-error-bars-in-javascript-react-or-angular).*

:::tip Key takeaways
- An error bar shows the **uncertainty or spread** around a plotted value, usually a **mean**.
- The three common kinds look identical but mean different things: **standard deviation (SD)** shows the spread of the data; **standard error (SE)** and **confidence intervals (CI)** show how precisely the mean is known.
- **A chart with error bars must say which kind they are, and the sample size (n).** Without that, they can't be read.
- **Overlap is not a test.** Standard error bars that don't overlap can still mean "no significant difference", and 95% confidence intervals that overlap a little can still mean "significant".
:::

## How to read error bars

![Left: the parts of one error bar, with a marker at the mean (12.03 cm), an upper and a lower arm of 1.14 cm each, and a cap at each end (13.17 and 10.89 cm), labelled as a 95% confidence interval for 10 plants. Right: two groups' 95% confidence intervals, Low dose and Medium dose, overlapping by 0.31 cm, about a third of an arm, although a t-test gives P = 0.015](./error-bars-anatomy.svg)

1. **Find out what the bars show.** Look in the caption, legend or methods for "SD", "SE" (or "SEM", the standard error of the mean), "95% CI" or "range". This changes what the bar means more than anything else on the chart.
2. **Find the sample size, n.** It's the number of independent measurements behind each value, for example 10 plants or 1,000 survey respondents. You need it to judge SE and CI bars.
3. **Read the marker.** The point, or the top of the column, is the plotted value: usually the mean of the group.
4. **Read the length of each arm.** Each arm runs from the mean to a cap. For SD or SE bars, one arm is one SD or one SE. For a confidence interval, the whole bar from cap to cap is the interval.
5. **Compare groups with care.** Longer bars mean more spread or less precision. Whether two groups really differ depends on the kind of bar, the gap or overlap between them and n: see [What does it mean when error bars overlap?](#what-does-it-mean-when-error-bars-overlap) below.

Bars don't have to be symmetrical. A confidence interval for a percentage near 0% or 100%, or for data drawn on a log scale, can have one arm longer than the other.

## Standard deviation vs standard error vs confidence interval error bars

Error bars come in two families. **Descriptive** bars (SD and range) describe the data: how spread out the individual measurements are. **Inferential** bars (SE and CI) describe the estimate: how precisely the mean, or another statistic, has been measured, and so what you can conclude from it.

| Error bar | What it shows | How it's worked out | As n grows | Use it to |
| --- | --- | --- | --- | --- |
| **Standard deviation (SD)** | The typical distance of individual measurements from the mean. For roughly bell-shaped data, about two-thirds of values fall within ±1 SD | √( Σ(x − mean)² ÷ (n − 1) ) | Stays about the same | Show how variable the data is |
| **Standard error (SE or SEM)** | How precisely the mean has been measured: the typical error of a mean from a sample this size | SD ÷ √n | Shrinks: 4 times the data halves it | Compare means, with the overlap rules below |
| **95% confidence interval (CI)** | A range that, across many repeats of the study, would contain the true mean 95% of the time | mean ± t × SE (t = 2.262 for n = 10; about 2 for n of 10 or more) | Shrinks, like SE | Show what you can conclude about the mean. Usually the best choice for comparisons |
| **Range** | The lowest and highest values | min to max | Tends to grow | Show the extremes. Rare; a [box plot](/learn/box-plot/) does it better |

In the chart at the top of the page, the three bars around each mean come from the same 10 plants. The SD bars (orange) are the widest; the SE bars (blue) are about a third as long, because √10 ≈ 3.2; the 95% CI bars (pink) are 2.262 times the SE bars.

That's why the kind of bar matters: the same data can look very precise or very noisy depending on which bar you draw.

## How to calculate error bars: a worked example

Here are the steps for the **Control** group in the chart at the top: the heights of 10 plants, in cm.

> 11.1, 11.9, 13.9, 11.4, 9.2, 10.2, 14.1, 13.3, 12.2, 13.0

| Step | Calculation | Result |
| --- | --- | --- |
| 1. Mean | 120.3 ÷ 10 | **12.03 cm** |
| 2. Sum of squared differences from the mean | (11.1 − 12.03)² + (11.9 − 12.03)² + … | 23.00 |
| 3. Standard deviation (SD) | √(23.00 ÷ 9) | **1.60 cm** |
| 4. Standard error (SE) | 1.60 ÷ √10 | **0.51 cm** |
| 5. t value for a 95% CI | two-sided, n − 1 = 9 degrees of freedom | 2.262 |
| 6. Half-width of the 95% CI | 2.262 × 0.51 | **1.14 cm** |
| 7. Draw the bars | SD: 12.03 ± 1.60 · SE: 12.03 ± 0.51 · 95% CI: 10.89 to 13.17 | |

Notes:

- Divide by **n − 1**, not n, when the data is a sample from a larger population, as it almost always is.
- 6 of the 10 plants lie within ±1 SD of the mean (10.43 to 13.63 cm), close to the two-thirds you'd expect.
- With large samples the t value approaches 1.96, so a 95% CI is often quoted as "mean ± 1.96 SE". With only 3 measurements it's 4.30, so the CI is more than four times the SE.

### How to describe error bars

Use this template in a caption or report:

> Points show the mean **[measure]** of **[n]** **[units]** per group; error bars show **[±1 SD / ±1 SE / the 95% confidence interval]**.

**Worked example:** "Points show the mean height of 10 plants per group after four weeks; error bars show the 95% confidence interval. Plants given the medium dose were 1.6 cm taller on average than those given the low dose (two-sample t-test, P = 0.015)."

## What does it mean when error bars overlap?

**Overlap is a rough guide, not a test,** and what it means depends on the kind of bar. The rules of thumb below (from Cumming, Fidler and Vaux, 2007) hold for **two independent groups** with **about 10 or more measurements each** and arms of similar length. P is the P value of a test for a difference between the two means.

| Bars shown | What you see between the two bars | Roughly means |
| --- | --- | --- |
| **SE bars** | They overlap | Not significant: P > 0.05 |
| **SE bars** | A gap about one arm wide | P ≈ 0.05 |
| **SE bars** | A gap about two arms wide | P ≈ 0.01 |
| **95% CI** | They overlap by about half an arm | P ≈ 0.05 |
| **95% CI** | Their ends just touch | P ≈ 0.01 |
| **95% CI** | A clear gap | P < 0.01 |
| **SD bars** | Anything | Nothing about significance: SD shows spread, not precision |

To judge "half an arm", use the average length of the two arms that face each other.

The data in the chart at the top shows both traps:

- **Control vs Low dose: the SE bars don't overlap, but the difference isn't significant.** The gap between them (0.34 cm) is less than one SE arm (about 0.45 cm), and a two-sample t-test gives P = 0.068.
- **Low vs Medium dose: the 95% CIs overlap, but the difference is significant.** They overlap by 0.31 cm, about a third of an average arm (0.97 cm), and the t-test gives P = 0.015. The right half of the diagram above shows this pair.
- **Medium vs High dose:** every kind of bar overlaps heavily, and P = 0.79. There's no sign of a difference.

Three cases where the rules don't apply:

- **Small samples.** With n = 3 the rules change: SE bars need a gap of about two arms for P ≈ 0.05, and 95% CIs can overlap by a whole arm at P ≈ 0.05.
- **Repeated measurements on the same subjects,** such as the same patients before and after a treatment. The bars show variation between subjects, not the change within each one, so their overlap says nothing about the change.
- **Many comparisons at once.** Rules of thumb for one pair don't allow for the extra chance of a false positive when you compare many pairs.

For a firm answer, run the right statistical test on the data. Use the bars to see the size and precision of the effect.

## When to use error bars

Use error bars when each point on a chart is an **estimate or a summary** (usually a mean) and readers need to see how much to trust it, or how much the underlying data varies. Typical uses:

- **experiments:** treatment and control groups, or the same measurement under several conditions;
- **surveys and polls:** an estimate with its margin of error, which is half the width of a 95% confidence interval;
- **measurements and calibration:** instrument readings with their measurement uncertainty, sometimes with horizontal error bars too when x is also measured;
- **model and benchmark results:** the spread of scores across repeated runs.

| Chart | Best for |
| --- | --- |
| **Error bars** on points, lines or columns | A few summary values with their uncertainty, compared across groups or over time |
| [Box plot](/learn/box-plot/) | The shape of each group's data: median, quartiles, range and outliers |
| [Scatter plot](/learn/scatter-plot/) of the raw values (a dot plot) | Small samples, where every value can be shown; often drawn with error bars on top, as in the chart at the top of this page |
| [Line chart](/learn/line-chart/) with a shaded band | Many points along a continuous x-axis, where a band (a confidence or uncertainty band) is easier to read than a bar at every point |

## Common error bar mistakes

- **Not saying what the bars are.** SD, SE and CI bars look identical. Always name the kind of bar and n in the caption or legend.
- **Choosing SE because it looks tidier.** SE bars are shorter than SD bars by a factor of √n, so they make data look less variable. Pick the bar that answers your question: SD for spread, CI (or SE) for comparing means.
- **Reading a gap between SE bars as a real difference.** For P ≈ 0.05 the gap needs to be about one SE arm, with n of 10 or more.
- **Reading overlapping 95% CIs as "no difference".** They can overlap by up to about half an arm at P ≈ 0.05.
- **Counting replicates as n.** Measuring the same sample three times isn't three independent results. n is the number of independent subjects or experiments; error bars from repeated measurements of one sample show only measurement noise.
- **Error bars with tiny samples.** With n = 3, bars are themselves very uncertain. Show the individual values instead, or as well.
- **Bars on a column chart that hide the data.** A column with an error bar shows only two numbers per group. Adding the individual points, as in the chart at the top, shows how the data is really spread.

## How to create error bars in JavaScript, React or Angular

SciChart.js has a dedicated error bars series, which draws vertical or horizontal error bars over any scatter, line or column series. Because SciChart.js draws with WebGL and WebGPU, charts stay smooth to zoom and pan with many points and live data. Try the chart below: scroll to zoom, drag to pan, double-click to reset, hover over a group to see its mean, SD, SE and 95% CI, and use the legend to show or hide each kind of bar.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="error bar chart" demo="error-bars-chart" docs="/2d-charts/chart-types/fast-error-bars-renderable-series/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastErrorBarsRenderableSeries,
        HlcDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EErrorMode,
        EDataPointWidthMode,
        NumberRange,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // One entry per group: its name, mean and the half-width of its error bar (e.g. 2.262 × SE for a 95% CI with n = 10)
        const { groups, means, halfWidths } = getYourGroupData();
        const xValues = groups.map((_, index) => index);

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                labelProvider: new TextLabelProvider({ labels: groups }),
                autoTicks: false,
                majorDelta: 1,
                growBy: new NumberRange(0.2, 0.1)
            })
        );
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Mean", growBy: new NumberRange(0.1, 0.1) }));

        sciChartSurface.renderableSeries.add(
            new FastErrorBarsRenderableSeries(wasmContext, {
                dataSeries: new HlcDataSeries(wasmContext, {
                    xValues,
                    yValues: means,
                    highValues: means.map((mean, i) => mean + halfWidths[i]),
                    lowValues: means.map((mean, i) => mean - halfWidths[i])
                }),
                stroke: "#E8336D",
                strokeThickness: 3,
                errorMode: EErrorMode.Both,
                dataPointWidth: 0.2,
                dataPointWidthMode: EDataPointWidthMode.Range,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 12, height: 12, fill: "#E8336D" })
            })
        );
        return { sciChartSurface };
    };

    export const ErrorBarsChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastErrorBarsRenderableSeries,
        HlcDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EErrorMode,
        EDataPointWidthMode,
        NumberRange,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-error-bars-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class ErrorBarsChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // One entry per group: its name, mean and the half-width of its error bar (e.g. 2.262 × SE for a 95% CI with n = 10)
            const { groups, means, halfWidths } = getYourGroupData();
            const xValues = groups.map((_, index) => index);

            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    labelProvider: new TextLabelProvider({ labels: groups }),
                    autoTicks: false,
                    majorDelta: 1,
                    growBy: new NumberRange(0.2, 0.1)
                })
            );
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Mean", growBy: new NumberRange(0.1, 0.1) }));

            sciChartSurface.renderableSeries.add(
                new FastErrorBarsRenderableSeries(wasmContext, {
                    dataSeries: new HlcDataSeries(wasmContext, {
                        xValues,
                        yValues: means,
                        highValues: means.map((mean, i) => mean + halfWidths[i]),
                        lowValues: means.map((mean, i) => mean - halfWidths[i])
                    }),
                    stroke: "#E8336D",
                    strokeThickness: 3,
                    errorMode: EErrorMode.Both,
                    dataPointWidth: 0.2,
                    dataPointWidthMode: EDataPointWidthMode.Range,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 12, height: 12, fill: "#E8336D" })
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Work out the means and the size of each bar (SD, SE or CI) **before** you chart them. The series draws the values it's given, so the statistics are your code's job.
- An [HlcDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/hlcdataseries.html) holds four values per point: `xValues`, `yValues` (the mean), and `highValues` and `lowValues` (the two ends of the bar, as absolute values, not distances from the mean). Different high and low distances give asymmetric bars.
- A [FastErrorBarsRenderableSeries](/2d-charts/chart-types/fast-error-bars-renderable-series/) draws the bars. `errorMode` draws both arms or only the upper or lower one; `errorDirection: EErrorDirection.Horizontal` draws horizontal bars for uncertainty in x; `dataPointWidth` sets the width of the caps; a `pointMarker` marks the mean.
- Several series can share one `HlcDataSeries`, so the same data can drive a line or scatter series and its error bars. Here an `XyScatterRenderableSeries` draws each plant, and a `LegendModifier` with `showCheckboxes` lets readers toggle each kind of bar.

**See it in the demo app:** [JavaScript error bar chart](https://www.scichart.com/demo/javascript/error-bars-chart) · [React error bar chart](https://www.scichart.com/demo/react/error-bars-chart) · [Angular error bar chart](https://www.scichart.com/demo/angular/error-bars-chart)

**Go deeper:** [SciChart.js error bar chart documentation](/2d-charts/chart-types/fast-error-bars-renderable-series/), including horizontal error bars, one-sided bars and dashed styles.

## Frequently asked questions

### What do error bars represent on a graph?

Error bars show the uncertainty or variability around a plotted value, usually a mean. Depending on how they were calculated, they show how spread out the data is (standard deviation or range), or how precisely the mean has been measured (standard error or a confidence interval). The two kinds look the same, so a chart with error bars must say which one it uses and how many measurements each value is based on.

### Are error bars standard deviation or standard error?

They can be either, or a confidence interval, and there is no default. Standard deviation bars show how much individual measurements vary. Standard error bars show how precisely the mean is known, and they are smaller than standard deviation bars by a factor of the square root of the sample size. Check the caption or legend: if it doesn't say, you can't interpret the bars.

### What does it mean when error bars overlap?

It depends on the type of bar. For two independent groups of about 10 or more measurements each: overlapping standard error bars mean the difference is not statistically significant (P greater than 0.05). But 95% confidence intervals can overlap by up to about half of one arm and the difference can still be significant at P about 0.05. Overlap of standard deviation bars tells you nothing about significance. For a firm answer, run a statistical test.

### What are 95% error bars?

95% error bars show a 95% confidence interval: a range worked out from the data that, across many repeats of the same study, would contain the true value 95% of the time. For a mean, the interval is the mean plus or minus a t value times the standard error. With 10 or more measurements it is roughly the mean plus or minus 2 standard errors. A survey's margin of error is half the width of a 95% confidence interval.

### How are error bars calculated?

First work out the mean of each group. For standard deviation bars, take the square root of the sum of the squared differences from the mean, divided by n minus 1. For standard error bars, divide the standard deviation by the square root of n. For 95% confidence interval bars, multiply the standard error by the t value for n minus 1 degrees of freedom (2.262 for 10 measurements). Draw each bar from the mean minus that amount to the mean plus it.

### How do I add error bars to a chart in JavaScript?

With SciChart.js, put each point's x value, its plotted value and the top and bottom of its error bar into an `HlcDataSeries` (x, y, high and low values), then draw it with a `FastErrorBarsRenderableSeries`. Add a point marker to show the mean, or draw a scatter, line or column series under the bars. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Cumming, G., Fidler, F. and Vaux, D. L. (2007), [Error bars in experimental biology](https://doi.org/10.1083/jcb.200611141). *Journal of Cell Biology*, 177(1), 7–11. Descriptive vs inferential bars, n vs replicates, and the overlap rules for SE bars and 95% CIs used on this page.
- Krzywinski, M. and Altman, N. (2013), [Error bars](https://doi.org/10.1038/nmeth.2659). *Nature Methods*, 10, 921–922 (Points of Significance). A short guide to choosing and reading SD, SE and CI bars.
- Schenker, N. and Gentleman, J. F. (2001), [On judging the significance of differences by examining the overlap between confidence intervals](https://doi.org/10.1198/000313001317097960). *The American Statistician*, 55(3), 182–186. Why "the 95% CIs overlap" is not the same as "no significant difference".
- Pew Research Center (2025), [Understanding error bars in charts](https://www.pewresearch.org/decoded/2025/09/16/understanding-error-bars-in-charts/). Error bars as a survey's margin of error, and why they show sampling error only.

<LearnCta position="bottom" chart="error bar chart" demo="error-bars-chart" docs="/2d-charts/chart-types/fast-error-bars-renderable-series/" />
