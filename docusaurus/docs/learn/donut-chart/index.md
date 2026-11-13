---
sidebar_position: 13
sidebar_label: Donut Chart
title: "Donut Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a donut (doughnut) chart is, how to read its ring and centre label, multi-ring donuts and their pitfalls, and when to use a donut chart instead of a pie or bar chart. With a live example."
keywords:
    [
        "donut chart",
        "doughnut chart",
        "donut graph",
        "how to read a donut chart",
        "donut chart vs pie chart",
        "multi-ring donut chart"
    ]
image: /img/learn/donut-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a donut chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A donut chart is a pie chart with a hole in the middle. A ring is divided into segments, each showing one category's share of a whole, and the segments add up to 100%. The hole often shows a total or a headline figure." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a donut chart and a pie chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both show parts of a whole. A pie chart is a full circle, read by the angle and area of each slice. A donut chart removes the centre, so you read each segment by the length of its arc, and the empty centre can hold a total or a label." }
                },
                {
                    "@type": "Question",
                    "name": "Is it a donut chart or a doughnut chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both names mean the same chart. \"Doughnut\" is the traditional spelling, used in British English and in Microsoft Excel; \"donut\" is the common American spelling and is used by many charting libraries." }
                },
                {
                    "@type": "Question",
                    "name": "When should I use a donut chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a donut chart for a few parts of one whole when you want to show a total or label in the centre, or when a lighter shape suits a dashboard. If readers need to compare segments of similar size, or there are many categories, use a bar chart." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a donut chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartPieSurface with pieType set to EPieType.Donut and a holeRadius such as 0.6, then add one PieSegment per segment with its value, text and colour. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Donut Chart

:::info Looking for the SciChart.js API?
See the [SciChart.js donut chart documentation](/2d-charts/chart-types/donut-chart-type/) for `SciChartPieSurface`, `EPieType.Donut` and `holeRadius`.
:::

A **donut chart** (also spelled **doughnut chart**) is a [pie chart](/learn/pie-chart/) with a **hole** in the middle. A **ring** is divided into **segments**, each showing one category's **share of a whole**, and the segments add up to **100%**. The empty centre is often used for a **total** or a headline figure.

Try the interactive chart below. Click a segment, or tick it in the legend, to pull it out from the ring.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="donut chart" demo="donut-chart" docs="/2d-charts/chart-types/donut-chart-type/" />

## How to read a donut chart

![Anatomy of a donut chart: four segments of sales by region around a ring, with the arc length, ring, hole and centre label showing the total labelled](./donut-chart-anatomy.svg)

- **The ring** is the total. Its segments together make 100%.
- **Each segment** is one category. The legend, or a label on the segment, tells you which.
- **The length of a segment's arc** shows its share. Because the centre is gone, you can't judge the angle at the middle as you would on a pie; you compare how far each segment runs round the ring. A 25% segment runs a quarter of the way round.
- **The centre label** usually gives the total ("£4.2m total sales") or the one figure that matters most, so readers get the headline and the split in one glance.
- **The labels** give the exact percentages. As with a pie chart, readers can only estimate segment sizes without them.

### Good practice for donut charts

- **Keep to a few segments,** largest first from 12 o'clock, with a grey "Other" segment last.
- **Use the hole.** A donut chart without a centre label is just a pie chart with less to read; put the total or the key figure there.
- **Don't make the ring too thin.** A thin ring makes segments hard to see and compare; a hole of about half to two-thirds of the radius is common.
- **Label the percentages** and avoid 3D, for the same reasons as a pie chart.

### Donut chart variants

| Variant | What it looks like | Watch out for |
| --- | --- | --- |
| Single-ring donut | One ring split into segments, often with a total in the centre | Too many segments, or a ring so thin the segments are hard to compare |
| Multi-ring (nested) donut | Two or more rings, one inside the other, e.g. this year outside and last year inside | Inner rings are shorter than outer ones, so the same percentage looks smaller on an inner ring; comparing rings is hard. A [bar chart](/learn/bar-chart/) or [100% stacked column chart](/2d-charts/chart-types/stacked-column-renderable-series/) usually compares groups more clearly |
| Sunburst | Nested rings where each outer ring splits the segment inside it (region, then country) | Fine for showing a hierarchy, but small outer segments get very thin. See the [sunburst chart documentation](/2d-charts/chart-types/polar-sunburst-chart/) |
| Single-value (progress) donut | One coloured segment against a grey track, e.g. "72% complete" | Shows one percentage only; a [gauge chart](/2d-charts/chart-types/polar-gauge-chart/) or a plain number may be clearer |
| Semicircle donut | Half a ring, like a dial | The half circle is 100%, so readers have to rescale what they see |

## When to use a donut chart

Use a donut chart for the same data as a pie chart, **a few parts of one whole**, when you want to **show a total or label in the centre**, or when a lighter, ring-shaped chart suits a dashboard. If readers need to **compare segments of similar size**, or there are **many categories**, use a bar chart.

| Chart | Best for |
| --- | --- |
| **Donut chart** | A few parts of one whole, with a total or headline figure in the centre |
| [Pie chart](/learn/pie-chart/) | A few parts of one whole, when you don't need the centre; slightly easier to judge one large share against the whole |
| [Bar chart](/learn/bar-chart/) | Comparing values accurately, many categories, or values that don't add up to a whole |
| [100% stacked column chart](/2d-charts/chart-types/stacked-column-renderable-series/) | Comparing how the split of a whole changes across several groups or periods, instead of a multi-ring donut |

## How to create a donut chart in JavaScript, React or Angular

In SciChart.js, a donut chart is a `SciChartPieSurface` with `pieType` set to `EPieType.Donut`, so it shares the pie chart's animated updates, legend and selectable segments. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import { SciChartPieSurface, EPieType, PieSegment, SciChartJsNavyTheme } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            pieType: EPieType.Donut,
            holeRadius: 0.6,
            animate: true
        });
        sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
            `${Math.round((100 * segment.value) / total)}%`;
        sciChartPieSurface.legend.showLegend = true;

        // getYourDonutData() returns [{ text: "Europe", value: 1680, color: "#50C7E0" }, ...]
        for (const { text, value, color } of getYourDonutData()) {
            sciChartPieSurface.pieSegments.add(new PieSegment({ text, value, color }));
        }
        return { sciChartSurface: sciChartPieSurface };
    };

    // The centre label is a normal React element laid over the chart
    export const DonutChart = () => (
        <div style={{ position: "relative", width: "100%", height: 400 }}>
            <SciChartReact initChart={initChart} style={{ width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "#fff", fontSize: 32, fontWeight: "bold" }}>
                £4.2m
            </div>
        </div>
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import { SciChartPieSurface, EPieType, PieSegment, SciChartJsNavyTheme } from "scichart";

    @Component({
        selector: "app-donut-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        // The centre label is a normal element laid over the chart
        template: `
            <div style="position: relative; width: 100%; height: 400px">
                <scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 100%"></scichart-angular>
                <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; color: #fff; font-size: 32px; font-weight: bold">
                    £4.2m
                </div>
            </div>`
    })
    export class DonutChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme(),
                pieType: EPieType.Donut,
                holeRadius: 0.6,
                animate: true
            });
            sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
                `${Math.round((100 * segment.value) / total)}%`;
            sciChartPieSurface.legend.showLegend = true;

            // getYourDonutData() returns [{ text: "Europe", value: 1680, color: "#50C7E0" }, ...]
            for (const { text, value, color } of getYourDonutData()) {
                sciChartPieSurface.pieSegments.add(new PieSegment({ text, value, color }));
            }
            return { sciChartSurface: sciChartPieSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [SciChartPieSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpiesurface.html) draws both pie and donut charts. `pieType: EPieType.Donut` turns the pie into a ring.
- `holeRadius` sets the size of the hole as a fraction of the outer radius: `0.6` leaves a ring 40% of the radius thick.
- Each segment is a [PieSegment](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html) with a `value`, `text` and `color`. You pass raw values; SciChart works out the percentages.
- The centre label is an ordinary HTML element laid over the chart: in plain JavaScript it is added to the surface's `domChartRoot`; in React and Angular it sits next to the chart component.

**See it in the demo app:** [JavaScript donut chart](https://www.scichart.com/demo/javascript/donut-chart) · [React donut chart](https://www.scichart.com/demo/react/donut-chart) · [Angular donut chart](https://www.scichart.com/demo/angular/donut-chart)

**Go deeper:** [SciChart.js donut chart documentation](/2d-charts/chart-types/donut-chart-type/), and the [pie chart documentation](/2d-charts/chart-types/pie-chart-type/) for label formatting and animated updates, which work the same way on a donut.

## Frequently asked questions

### What is a donut chart?

A donut chart is a pie chart with a hole in the middle. A ring is divided into segments, each showing one category's share of a whole, and the segments add up to 100%. The hole often shows a total or a headline figure.

### What is the difference between a donut chart and a pie chart?

Both show parts of a whole. A [pie chart](/learn/pie-chart/) is a full circle, read by the angle and area of each slice. A donut chart removes the centre, so you read each segment by the length of its arc, and the empty centre can hold a total or a label.

### Is it a donut chart or a doughnut chart?

Both names mean the same chart. "Doughnut" is the traditional spelling, used in British English and in Microsoft Excel; "donut" is the common American spelling and is used by many charting libraries.

### When should I use a donut chart?

Use a donut chart for a few parts of one whole when you want to show a total or label in the centre, or when a lighter shape suits a dashboard. If readers need to compare segments of similar size, or there are many categories, use a [bar chart](/learn/bar-chart/).

### How do I make a donut chart in JavaScript?

With SciChart.js, create a `SciChartPieSurface` with `pieType` set to `EPieType.Donut` and a `holeRadius` such as `0.6`, then add one `PieSegment` per segment with its value, text and colour. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

<LearnCta position="bottom" chart="donut chart" demo="donut-chart" docs="/2d-charts/chart-types/donut-chart-type/" />
