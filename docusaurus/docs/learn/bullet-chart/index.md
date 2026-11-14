---
sidebar_position: 15.6
sidebar_label: Bullet Chart
title: "Bullet Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a bullet chart (bullet graph) is, how to read its bar, target line and shaded ranges, the design rules, common variants and when to use one instead of a gauge."
keywords:
    [
        "bullet chart",
        "bullet graph",
        "what is a bullet chart",
        "how to read a bullet chart",
        "bullet chart example",
        "bullet chart vs gauge chart",
        "kpi chart"
    ]
image: /img/learn/bullet-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a bullet chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A bullet chart is used to show how one measure is doing against a target and against agreed limits for poor, satisfactory and good results. It is common on dashboards and in reports for sales against quota, budgets, service levels, quality measures and other KPIs, where several measures are stacked so they can be scanned in one glance." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a bullet chart and a gauge chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both show one value against qualitative ranges and a target. A gauge draws the scale as an arc with a needle; a bullet chart draws it as a straight bar, with a short line for the target and grey bands for the ranges. The bullet chart needs far less space, is read along a straight scale rather than by angle, and can be stacked so several measures are compared at once." }
                },
                {
                    "@type": "Question",
                    "name": "Is a bullet graph the same as a bullet chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. Bullet graph is the name its designer, Stephen Few, used, and bullet chart is the name most charting tools use. Both mean the same thing: a bar for the actual value, a short line for the target and shaded bands for the qualitative ranges." }
                },
                {
                    "@type": "Question",
                    "name": "Who invented the bullet chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The bullet chart was invented by Stephen Few, a data visualisation consultant who ran Perceptual Edge. He designed it to replace the gauges and meters used on dashboards, and published a bullet graph design specification, last revised in 2013, that sets out its parts and default styling." }
                },
                {
                    "@type": "Question",
                    "name": "What do the shaded bands in a bullet chart mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The shaded bands are the qualitative ranges: they mark which results count as poor, satisfactory or good. They are shades of one colour, usually grey, with the darkest shade for the worst range. The band the bar ends in tells you the result's status, and how far the bar reaches into that band tells you how good or bad it is within it." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a bullet chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, draw every part as a rectangle with FastRectangleRenderableSeries and an XyxyDataSeries: one series for each shaded range, a thinner one for the actual values and a narrow one for the targets. Put the row axis on the left and the value axis along the bottom so the bullets run horizontally, one row per measure. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Bullet Chart

## What is a bullet chart?

A **bullet chart** (also called a bullet graph) is a compact bar chart that shows one measure against a target and against shaded ranges for poor, satisfactory and good. A dark bar shows the actual value, a short line across it marks the target, and the grey bands behind it give the result its meaning.

![Five horizontal bullet charts for quarterly sales by region on a shared $0k to $600k scale. Each row has three grey bands labelled poor, satisfactory and good, a dark bar for actual sales and a short vertical line for the target. North and Online pass their targets; South, East and West fall short, with West's bar ending in the darkest, poor band](/img/learn/bullet-chart-og.png)

*Bullet charts for one quarter's sales in five regions (sample data). [Try the interactive version](#how-to-create-a-bullet-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A bullet chart has three layers: **grey bands** for the qualitative ranges, a **dark bar** for the actual value and a **short line** for the target.
- **Darker grey means worse.** The band the bar ends in is the result's status.
- **The target and the bands are separate.** A result can miss its target and still be in the good range.
- Bullet charts were designed by **Stephen Few** to **replace dashboard gauges**: they say the same thing in a fraction of the space.
- **Stack them** to compare several measures. Measures in the same units can share one scale, so the bars compare directly.
:::

## How to read a bullet chart

![The parts of a bullet chart: a horizontal bullet for monthly sign-ups on a scale from 0 to 10 thousand, with grey bands for poor (0 to 5), satisfactory (5 to 7.5) and good (7.5 to 10), a dark bar ending at 6.8 thousand and a short target line at 8 thousand. Numbered callouts name the qualitative ranges, text label, quantitative scale, featured measure and comparative measure](./bullet-chart-anatomy.svg)

1. **Read the label and the scale.** The label says what is measured and in what units. The scale runs along the bottom, normally from zero.
2. **Find the end of the bar.** The dark bar is the **featured measure**: the actual result so far, such as this month's sign-ups (6.8 thousand in the diagram).
3. **Check which band the bar ends in.** The bands are the **qualitative ranges**. Darker grey is worse, so a bar ending in the darkest band is a poor result. Here the bar ends in the satisfactory band.
4. **Note how far into the band it reaches.** A bar just inside the good band is less comfortable than one that runs almost to the end of it.
5. **Compare the bar with the target line.** The short line across the bar is the **comparative measure**, usually a target and sometimes last year's figure. A bar that stops short of the line has missed it; one that passes it has beaten it. Here the bar is 1.2 thousand short of the 8 thousand target.

## Bullet chart example: sales by region

The chart at the top of the page stacks five bullets, one per sales region, on a shared scale. Each region has its own target and its own limits for poor and satisfactory, set from its size and history. Reading each row the same way gives:

| Region | Actual | Target | Against target | Band | What it tells you |
| --- | --- | --- | --- | --- | --- |
| North | $470k | $450k | +$20k | Good (from $420k) | Target beaten, comfortably in the good range |
| South | $285k | $380k | −$95k | Satisfactory ($250k–$350k) | A long way short, though not yet poor |
| East | $395k | $400k | −$5k | Good (from $380k) | Just missed the target, but still a good result |
| West | $210k | $300k | −$90k | Poor (below $220k) | The only region in the poor range: the one to look at first |
| Online | $540k | $480k | +$60k | Good (from $460k) | The largest result and the biggest margin over target |

East shows why a bullet chart has both a target and bands. On the target alone, East and South both "missed". The bands show that East's miss is minor and South's is not.

### How to describe a bullet chart

Use this template to put a bullet chart into words:

> **[Measure]** was **[actual value]**, **[above or below]** its target of **[target]** by **[gap]**, in the **[band]** range (**[band limits]**).

**Worked example:** "East's sales this quarter were $395k, below the $400k target by $5k, but in the good range, which starts at $380k. West, at $210k, is the only region in the poor range."

## Bullet chart design rules

Stephen Few, who designed the bullet chart (he called it the **bullet graph**), published a design specification for it. These are its main defaults:

| Part | Few's default |
| --- | --- |
| **Text label** | To the left of a horizontal bullet, above a vertical one |
| **Quantitative scale** | Along the bottom (horizontal) or left (vertical), starting at zero, with light grey tick marks |
| **Featured measure** | A dark, almost black bar about a third as thick as the bullet, with no border |
| **Comparative measure** | A short line across the bar, clearly visible but less heavy than the bar. A second one, such as last year, can be added in a lighter shade |
| **Qualitative ranges** | Two to five bands, ideally three, as rectangles of one hue with no borders |

### Why grey bands, not red, amber and green?

Few's specification uses **shades of one colour**, darkest for the worst range, rather than separate hues. Red and green are the pair people with the most common type of colour vision deficiency find hardest to tell apart, and a row of red, amber and green bands also competes with the bar for attention. Grey keeps the bands in the background and leaves colour free to highlight something, such as a measure that needs action.

The specification gives these shades, as percentages of black:

| Number of ranges | Shades, from worst to best |
| --- | --- |
| 2 | 35%, 10% |
| 3 | 40%, 25%, 10% |
| 4 | 50%, 35%, 20%, 10% |
| 5 | 50%, 35%, 20%, 10%, 3% |

The live chart on this page uses the three-range set: `#999999`, `#BFBFBF` and `#E6E6E6`.

## Bullet chart variants

![Four bullet chart variants. Standard: orders shipped on time, 82% against a 78% target, dark band on the left. Lower is better: defects per 1,000 units, 4.2 against 3.5, with the dark band on the right. With a projection: revenue quarter to date, a dark bar to $52k and a lighter segment to a projected $94k against a $100k target. Scale not from zero: an average rating of 4.1 shown as a dot on a 3 to 5 scale, against a target of 4.4](./bullet-chart-variants.svg)

- **Standard:** higher is better, so the darkest band is on the left, near zero.
- **Lower is better:** for costs, defects or response times, reverse the bands so the darkest is on the right. Mixing both kinds in one stack without reversing confuses readers.
- **With a projection:** early in a period, the bar alone can't say whether you'll reach the target. A lighter segment after the bar shows where the period is likely to end at the current rate.
- **Scale not starting at zero:** a bar's length would exaggerate the differences, so show the value as a dot or a cross instead.
- **Negative values:** for a measure such as profit, which can fall below zero, the scale extends past zero so a loss can be shown too.
- **Vertical:** bullets can also stand upright, side by side, like columns, with the label above each one.
- **Two comparative measures:** for example a target and last year's result, with the second line in a lighter shade.

## When to use a bullet chart

Use a bullet chart when you have **a few key numbers, each with a target or known limits**, and readers need to see at a glance which are on track. Typical uses:

- **sales and revenue** against quota or budget, per region or per person;
- **service levels** such as response time, uptime or on-time delivery;
- **quality and operations** measures such as defect rates or machine output;
- **dashboards** where many KPIs must fit on one screen.

| Chart | Best for |
| --- | --- |
| **Bullet chart** | Several measures, each against its own target and ranges, in a small space |
| [Gauge chart](/learn/gauge-chart/) | One headline reading, especially a live one, where a familiar dial matters more than space |
| [Bar chart](/learn/bar-chart/) | Comparing values across categories, with no target or ranges |
| [Line chart](/learn/line-chart/) | How a measure changes over time. A bullet chart shows only the current value |

## Common bullet chart mistakes

- **Too many bands.** Few recommends three ranges and no more than five; beyond that, readers can't take in the status at a glance. If you need more detail, the measure probably needs its own chart.
- **Traffic-light colours for the bands.** Red, amber and green bands are hard for colour-blind readers to tell apart and pull attention away from the bar. Use shades of one colour.
- **A target line as heavy as the bar.** The bar is the main message. Keep the target line short and thinner, so the two don't merge.
- **A bar on a scale that doesn't start at zero.** The bar's length then misleads. Start at zero, or switch to a dot.
- **Forgetting to reverse "lower is better" measures.** If costs and revenue sit in one stack, reverse the bands for costs so dark always means bad.
- **Hiding different scales.** Bullets in a stack that measure different things need their own scales, clearly labelled. Only share a scale when the units are the same.
- **No key for readers new to the chart.** Someone who hasn't met a bullet chart before won't know what the shades mean. Label the bands once, as the chart at the top of this page does, or add a one-line note on how to read it.

## How to create a bullet chart in JavaScript, React or Angular

SciChart.js has no separate bullet series: you draw every part as a rectangle with a rectangle series, on a chart turned on its side so the bullets run horizontally. Because SciChart.js draws with WebGL and WebGPU, the same approach stays fast for dashboards with many bullets that update live. Try the chart below: hover over a row to see its values, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="bullet chart" demo="linear-gauges" docs="/2d-charts/chart-types/linear-gauge-chart/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
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

        // One row per measure: { label, actual, target, poorTo, satisfactoryTo }
        const rows = getYourBulletData();
        const scaleMax = 600;

        // Rows down the left, values along the bottom: each bullet runs horizontally
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Left,
                labelProvider: new TextLabelProvider({ labels: rows.map((row) => row.label), useNativeText: false }),
                autoTicks: false,
                majorDelta: 1,
                drawMajorGridLines: false,
                drawMinorGridLines: false,
                growBy: new NumberRange(0.1, 0.2)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Bottom,
                flippedCoordinates: true,
                visibleRange: new NumberRange(0, scaleMax),
                drawMajorGridLines: false,
                drawMinorGridLines: false
            })
        );

        // One rectangle per row, halfHeight either side of the row's centre, from `from` to `to` on the scale
        const rectangles = (halfHeight, from, to, fill) =>
            new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues: rows.map((_, index) => index - halfHeight),
                    x1Values: rows.map((_, index) => index + halfHeight),
                    yValues: rows.map(from),
                    y1Values: rows.map(to)
                }),
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                fill,
                strokeThickness: 0
            });

        sciChartSurface.renderableSeries.add(
            rectangles(0.38, () => 0, (row) => row.poorTo, "#999999"),
            rectangles(0.38, (row) => row.poorTo, (row) => row.satisfactoryTo, "#BFBFBF"),
            rectangles(0.38, (row) => row.satisfactoryTo, () => scaleMax, "#E6E6E6"),
            rectangles(0.13, () => 0, (row) => row.actual, "#0B1A33"),
            rectangles(0.28, (row) => row.target - 2, (row) => row.target + 2, "#0B1A33")
        );
        return { sciChartSurface };
    };

    export const BulletChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-bullet-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class BulletChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // One row per measure: { label, actual, target, poorTo, satisfactoryTo }
            const rows = getYourBulletData();
            const scaleMax = 600;

            // Rows down the left, values along the bottom: each bullet runs horizontally
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Left,
                    labelProvider: new TextLabelProvider({ labels: rows.map((row) => row.label), useNativeText: false }),
                    autoTicks: false,
                    majorDelta: 1,
                    drawMajorGridLines: false,
                    drawMinorGridLines: false,
                    growBy: new NumberRange(0.1, 0.2)
                })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Bottom,
                    flippedCoordinates: true,
                    visibleRange: new NumberRange(0, scaleMax),
                    drawMajorGridLines: false,
                    drawMinorGridLines: false
                })
            );

            // One rectangle per row, halfHeight either side of the row's centre, from `from` to `to` on the scale
            const rectangles = (halfHeight, from, to, fill) =>
                new FastRectangleRenderableSeries(wasmContext, {
                    dataSeries: new XyxyDataSeries(wasmContext, {
                        xValues: rows.map((_, index) => index - halfHeight),
                        x1Values: rows.map((_, index) => index + halfHeight),
                        yValues: rows.map(from),
                        y1Values: rows.map(to)
                    }),
                    columnXMode: EColumnMode.StartEnd,
                    columnYMode: EColumnYMode.TopBottom,
                    fill,
                    strokeThickness: 0
                });

            sciChartSurface.renderableSeries.add(
                rectangles(0.38, () => 0, (row) => row.poorTo, "#999999"),
                rectangles(0.38, (row) => row.poorTo, (row) => row.satisfactoryTo, "#BFBFBF"),
                rectangles(0.38, (row) => row.satisfactoryTo, () => scaleMax, "#E6E6E6"),
                rectangles(0.13, () => 0, (row) => row.actual, "#0B1A33"),
                rectangles(0.28, (row) => row.target - 2, (row) => row.target + 2, "#0B1A33")
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Every part is a [FastRectangleRenderableSeries](/2d-charts/chart-types/fast-rectangle-renderable-series/) with an [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html), one rectangle per row. `EColumnMode.StartEnd` and `EColumnYMode.TopBottom` make `x`/`x1` the two edges of the row and `y`/`y1` the start and end on the scale.
- The series are drawn in the order you add them: the three bands first, then the bar, then the target, so the target line sits on top.
- Setting the row axis to `EAxisAlignment.Left` and the value axis to `EAxisAlignment.Bottom` turns the chart on its side, so the bullets run horizontally. `flippedCoordinates: true` on the value axis makes the bars grow from left to right. Leave the axes in their usual places for vertical bullets.
- A `CursorModifier` with a `tooltipDataTemplate` shows the row's actual value, band, target and gap, and `TextAnnotation`s name the three bands once, above the first row.

**See it in the demo app:** [JavaScript linear gauges](https://www.scichart.com/demo/javascript/linear-gauges) · [React linear gauges](https://www.scichart.com/demo/react/linear-gauges) · [Angular linear gauges](https://www.scichart.com/demo/angular/linear-gauges)

**Go deeper:** [SciChart.js linear gauge chart documentation](/2d-charts/chart-types/linear-gauge-chart/), which builds banded gauges from the same rectangle series, and the [SciChart.js rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/).

## Frequently asked questions

### What is a bullet chart used for?

A bullet chart is used to show how one measure is doing against a target and against agreed limits for poor, satisfactory and good results. It is common on dashboards and in reports for sales against quota, budgets, service levels, quality measures and other KPIs, where several measures are stacked so they can be scanned in one glance.

### What is the difference between a bullet chart and a gauge chart?

Both show one value against qualitative ranges and a target. A gauge draws the scale as an arc with a needle; a bullet chart draws it as a straight bar, with a short line for the target and grey bands for the ranges. The bullet chart needs far less space, is read along a straight scale rather than by angle, and can be stacked so several measures are compared at once.

### Is a bullet graph the same as a bullet chart?

Yes. Bullet graph is the name its designer, Stephen Few, used, and bullet chart is the name most charting tools use. Both mean the same thing: a bar for the actual value, a short line for the target and shaded bands for the qualitative ranges.

### Who invented the bullet chart?

The bullet chart was invented by Stephen Few, a data visualisation consultant who ran Perceptual Edge. He designed it to replace the gauges and meters used on dashboards, and published a bullet graph design specification, last revised in 2013, that sets out its parts and default styling.

### What do the shaded bands in a bullet chart mean?

The shaded bands are the qualitative ranges: they mark which results count as poor, satisfactory or good. They are shades of one colour, usually grey, with the darkest shade for the worst range. The band the bar ends in tells you the result's status, and how far the bar reaches into that band tells you how good or bad it is within it.

### How do I make a bullet chart in JavaScript?

With SciChart.js, draw every part as a rectangle with `FastRectangleRenderableSeries` and an `XyxyDataSeries`: one series for each shaded range, a thinner one for the actual values and a narrow one for the targets. Put the row axis on the left and the value axis along the bottom so the bullets run horizontally, one row per measure. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Few, S. (2013), [Bullet graph design specification](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf). Perceptual Edge. The parts of a bullet graph, its default styling, the grey shades for two to five ranges, and the variants for negative values, "lower is better" measures and projections.
- Perceptual Edge, [About](https://www.perceptualedge.com/about.php). Stephen Few as the inventor of the bullet graph.
- National Eye Institute, [Color blindness](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness). Red and green are the colours the most common type of colour vision deficiency makes hard to tell apart.

<LearnCta position="bottom" chart="bullet chart" demo="linear-gauges" docs="/2d-charts/chart-types/linear-gauge-chart/" />
