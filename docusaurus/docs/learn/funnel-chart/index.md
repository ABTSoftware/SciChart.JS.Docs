---
sidebar_position: 15.7
sidebar_label: Funnel Chart
title: "Funnel Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a funnel chart is, how to read stage counts and conversion rates, how to work out drop-off between steps, when a bar chart is the better choice, and the mistakes to avoid."
keywords:
    [
        "funnel chart",
        "funnel graph",
        "sales funnel chart",
        "conversion funnel chart",
        "what is a funnel chart",
        "how to read a funnel chart",
        "funnel conversion rate",
        "funnel chart vs bar chart"
    ]
image: /img/learn/funnel-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a funnel chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A funnel chart is used to show how many people or items get through each step of a process, and where they drop out. Typical uses are sales pipelines, website sign-up and checkout journeys, recruitment, and marketing campaigns, where every stage is a subset of the one before it." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a funnel chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Read it from top to bottom. Each bar is one stage, and its width is the number that reached that stage. Compare each bar with the one above to get the step conversion rate, and with the top bar to get the overall conversion rate. The step with the lowest conversion rate is where the process loses the largest share of people." }
                },
                {
                    "@type": "Question",
                    "name": "When should you use a funnel chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a funnel chart when your stages happen in a fixed order and each stage contains only people or items that passed through the stage before, so the numbers can only stay the same or fall. If the categories have no order, or a later stage can be bigger than an earlier one, use a bar chart instead." }
                },
                {
                    "@type": "Question",
                    "name": "How do you calculate conversion rates in a funnel?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Divide each stage by the stage before it to get its step conversion rate, and by the first stage to get its overall conversion rate. The drop-off rate is 100% minus the step conversion rate. Multiplying all the step rates together gives the overall rate for the last stage." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a funnel chart and a bar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A funnel chart is a bar chart with its bars centred and in process order, usually with tapered shapes or conversion rates between them. A bar chart lines its bars up on a common baseline, which makes values easier to compare exactly, and it works for categories in any order. Funnels suit sequential stages; bar charts suit everything else." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a funnel chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, draw each stage as a centred rectangle with a FastRectangleRenderableSeries and an XyxyDataSeries, spanning minus half to plus half of the stage's count, one row per stage. Draw the tapered connectors between stages with a FastTriangleRenderableSeries, and add the counts and conversion rates as TextAnnotations. The same code works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Funnel Chart

## What is a funnel chart?

A **funnel chart** (also called a funnel graph or conversion funnel) shows how many people or items reach each step of a process, from the first step to the last. Each step is a bar, centred and stacked from top to bottom, and each bar is narrower than the one above. The gaps show where the process loses people.

![A funnel chart of a free-trial sign-up: five centred bars narrow from 12,000 site visitors to 5,400 who viewed pricing, 1,620 who started a trial, 1,140 who activated and 456 paying customers, with the 30% step from pricing to trial highlighted in pink as the weakest](/img/learn/funnel-chart-og.png)

*A sign-up funnel for one month, from first visit to paying customer (sample data). The pink taper marks the step with the lowest conversion rate. [Try the interactive version](#how-to-create-a-funnel-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A funnel chart shows **stages of a process in order**, with each bar as wide as the number that reached that stage.
- Read **two rates** at every stage: the **step conversion** (from the stage above) and the **overall conversion** (from the first stage).
- The stages must be **sequential and nested**: everyone in a stage passed through the stage before.
- The **step with the lowest conversion rate** is where the process loses the biggest share of people.
- A tapered funnel is easy to recognise but hard to read exactly. A **bar chart** of the same numbers is easier to compare.
:::

## How to read a funnel chart

![The parts of a funnel chart, drawn for a sales pipeline of 800 leads, 320 qualified, 120 proposals sent and 36 won. Numbered markers show the stage bar, the count with its share of the first stage, the step conversion between two stages, the drop-off between them and the final outcome of 4.5%](./funnel-chart-anatomy.svg)

1. **Start at the top.** The top bar is everyone who entered the process: visitors, leads, applicants or orders. Check what is being counted (people, sessions or deals) and over what period.
2. **Follow the stages down.** Each bar is one step, in the order people go through them. Its width is the number who reached it.
3. **Compare each bar with the one above.** That ratio is the **step conversion rate**: how many of the people at one stage made it to the next. In the diagram, 120 of the 320 qualified leads got a proposal: 37.5%.
4. **Compare each bar with the top bar.** That ratio is the **overall conversion rate**. The bottom bar's overall rate is the funnel's headline number: 36 of 800 leads were won, 4.5%.
5. **Find the weakest step.** The step with the lowest conversion rate loses the biggest share of the people who reach it. The biggest drop in absolute numbers is usually at the top, simply because that is where most people are.

## Funnel conversion rates: a worked example

Every funnel number comes from three simple calculations. Here they are for the sign-up funnel at the top of the page:

- **Step conversion** = this stage ÷ the stage above × 100.
- **Overall conversion** = this stage ÷ the first stage × 100.
- **Drop-off rate** = 100% − step conversion. **People lost** = the stage above − this stage.

| Stage | People | Step conversion | Drop-off rate | People lost | Overall conversion |
| --- | --- | --- | --- | --- | --- |
| Visited site | 12,000 | | | | 100% |
| Viewed pricing | 5,400 | 45.0% | 55.0% | 6,600 | 45.0% |
| Started trial | 1,620 | **30.0%** | **70.0%** | 3,780 | 13.5% |
| Activated | 1,140 | 70.4% | 29.6% | 480 | 9.5% |
| Paying customer | 456 | 40.0% | 60.0% | 684 | 3.8% |

Two things this table shows that the picture alone doesn't:

- **The weakest step and the biggest loss are different.** Most people (6,600) leave between the first visit and the pricing page, but the lowest rate (30%) is from pricing to trial. Losing many people at the top is normal; a low rate in the middle of the funnel, among people who have already shown interest, usually deserves a closer look.
- **The overall rate is the step rates multiplied together.** 45% × 30% × 70.4% × 40% = 3.8%, the same as 456 ÷ 12,000. So a **relative improvement at any step lifts the end result by the same proportion**. Raising the weakest step from 30% to 40% (a third more) gives 608 customers instead of 456. Raising the first step from 45% to 60% (also a third more) gives the same 608. Fix the step where an improvement is cheapest, not only the step with the lowest rate.

### How to describe a funnel chart

Use this template when you report a funnel:

> Of **[number at the first stage]** **[what entered]**, **[number at the last stage]** (**[overall %]**) reached **[last stage]** in **[period]**. The weakest step was **[stage] to [stage]**, where **[step %]** continued.

**Worked example:** "Of 12,000 site visitors, 456 (3.8%) became paying customers this month. The weakest step was from viewing pricing to starting a trial, where 30% continued."

## Types of funnel chart

| Type | What it looks like | Good for |
| --- | --- | --- |
| **Bar funnel** | Centred bars, one per stage, each as wide as its value, often joined by faint tapered connectors | Reading values accurately; the chart on this page |
| **Tapered funnel** | Trapezoids joined edge to edge, like a kitchen funnel | A familiar shape for presentations, as long as each stage is labelled with its number |
| **Horizontal funnel** | The same bars running from left to right, with stages along the bottom | Wide screens and dashboards with little height |
| **Open or closed funnel** | Looks the same; differs in who is counted. A **closed** funnel counts only people who entered at the first stage. An **open** funnel lets people join at any stage | Analytics funnels, where people can arrive mid-way (for example from a link straight to the pricing page) |
| **Segmented funnels** | Two or more funnels side by side, one per channel, device or month | Comparing step rates between groups. Compare the rates, not the widths: the groups usually start at different sizes |

## Why a funnel chart can mislead

A funnel's shape is part of its appeal, and part of its problem. Three things to watch for:

![The same three numbers, 1,000 visitors, 500 sign-ups and 50 buyers, drawn three ways. A decorative funnel with a fixed taper makes buyers look almost half the size of the top band, though they are 5% of it. A funnel tapered by value gives sign-ups 37% of the top band's area for 50% of the people. Centred bars show lengths of 100%, 50% and 5%](./funnel-shape-vs-value.svg)

- **Decorative shapes ignore the data.** Many slide and infographic templates use a funnel with a fixed taper and put the numbers on as labels. The shape then says nothing: in the left-hand drawing, a stage that holds 5% of the people looks almost half as big as the top.
- **Area isn't value.** In a tapered funnel, each band runs from one stage's width to the next, so its area mixes two stages. People judge lengths on a common scale more accurately than they judge areas, so the eye picks up the area and misjudges the ratio.
- **Centred bars have no common baseline.** Even in a bar funnel, the bars don't start from the same edge, so comparing two similar stages by eye is harder than in an ordinary bar chart. Label every stage with its number and conversion rate.

**The honest alternative is a bar chart.** Put the stages in process order and the bars on a common baseline, and add the step conversion rates as labels. A funnel is fine for a quick overview of a single process; use a [bar chart](/learn/bar-chart/) when readers must compare stages or funnels accurately.

## When to use a funnel chart

Use a funnel chart when the stages are **sequential** (they happen in a fixed order) and **nested** (everyone at a stage also passed through the stage before), so each number is the same as or smaller than the one above. Typical uses:

- **sales pipelines:** leads, qualified leads, proposals, deals won;
- **website and app journeys:** visits, product views, basket, checkout, purchase;
- **sign-ups and onboarding:** sign-up, email confirmed, first project, paying customer;
- **recruitment:** applications, screened, interviewed, offered, hired;
- **marketing campaigns:** emails sent, delivered, opened, clicked, converted.

| Chart | Best for |
| --- | --- |
| **Funnel chart** | One process with ordered, nested stages, showing where people drop out |
| [Bar chart](/learn/bar-chart/) | Comparing stages, or several funnels, accurately on a common baseline; any categories without an order |
| [Sankey diagram](/learn/sankey-diagram/) | Flows that branch or merge, such as where people go when they leave each stage |
| [Waterfall chart](/learn/waterfall-chart/) | How a total is built up or reduced by positive and negative changes, such as revenue to profit |
| [Pareto chart](/learn/pareto-chart/) | Ranking the reasons people drop out, to see which few account for most of the losses |

## Common funnel chart mistakes

- **Stages that aren't nested.** If a later stage counts things the earlier one didn't (page views instead of people, or people who skipped a step), a step conversion can go over 100%. Count the same unit at every stage, and decide whether the funnel is open or closed.
- **Mixing time windows.** Counting each stage over the same calendar month mixes people who started last month with people who started this month. For processes that take days or weeks, follow one group (a **cohort**) from the first stage to the last.
- **A shape that doesn't match the numbers.** A template funnel with a fixed taper looks precise but isn't. Draw widths from the data, or use bars.
- **Showing only percentages, or only counts.** Readers need both: the count shows scale, and the rate shows performance. Label each stage with its number, and each step with its conversion rate.
- **Too many stages.** A long funnel squeezes the lower stages into slivers too thin to read. Combine minor steps, or switch to a bar chart.
- **Using a funnel for categories without an order.** Sales by region, or product categories, aren't stages. Use a bar chart.
- **Comparing funnels by width.** Two funnels with different starting sizes can't be compared by eye. Compare their step conversion rates in a table or a grouped bar chart.

## How to create a funnel chart in JavaScript, React or Angular

SciChart.js has no funnel series: you build one from a rectangle series for the stages and a triangle series for the tapered connectors, with text annotations for the numbers. Because SciChart.js draws with WebGL and WebGPU, the chart stays smooth to zoom and pan. Try the chart below: hover over a stage to see its counts and conversion rates, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="funnel chart" demo="population-pyramid" docs="/2d-charts/chart-types/fast-rectangle-renderable-series/" />

Here is the code for this chart. The `buildFunnel` helper turns a list of stages into the bar rectangles, the connector triangles and the conversion rates, so you can reuse it with your own data:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastRectangleRenderableSeries,
        FastTriangleRenderableSeries,
        XyxyDataSeries,
        XyDataSeries,
        EColumnMode,
        EColumnYMode,
        ETriangleSeriesDrawMode,
        TextLabelProvider,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme
    } from "scichart";
    // buildFunnel: copy the helper from the JavaScript tab into its own file and export it
    import { buildFunnel } from "./buildFunnel";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // Your stages, in process order: [{ stage: "Visited site", count: 12000 }, ...]
        const funnel = buildFunnel(getYourFunnelData());
        const { rows } = funnel;

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.05, 0.75) }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Left,
                flippedCoordinates: true,
                labelProvider: new TextLabelProvider({ labels: rows.map((r) => r.stage) }),
                autoTicks: false,
                majorDelta: 1,
                drawMajorGridLines: false,
                drawMinorGridLines: false,
                growBy: new NumberRange(0.06, 0.12)
            })
        );

        sciChartSurface.renderableSeries.add(
            new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, funnel.connectors),
                drawMode: ETriangleSeriesDrawMode.List,
                fill: "#50C7E033"
            }),
            new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, funnel.weakestConnector),
                drawMode: ETriangleSeriesDrawMode.List,
                fill: "#E8336D88"
            }),
            new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, funnel.bars),
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                fill: "#50C7E0CC",
                stroke: "#50C7E0",
                strokeThickness: 2
            })
        );

        rows.forEach((r) => {
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    x1: r.count / 2 + rows[0].count * 0.03,
                    y1: r.row,
                    text: `${r.count.toLocaleString()}  (${r.ofStart.toFixed(1)}%)`,
                    fontSize: 17,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center
                })
            );
            if (r.row > 0) {
                sciChartSurface.annotations.add(
                    new TextAnnotation({
                        x1: 0,
                        y1: r.row - 0.5,
                        text: `${r.ofPrevious.toFixed(1)}% continue`,
                        fontSize: 15,
                        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                        verticalAnchorPoint: EVerticalAnchorPoint.Center
                    })
                );
            }
        });
        return { sciChartSurface };
    };

    export const FunnelChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastRectangleRenderableSeries,
        FastTriangleRenderableSeries,
        XyxyDataSeries,
        XyDataSeries,
        EColumnMode,
        EColumnYMode,
        ETriangleSeriesDrawMode,
        TextLabelProvider,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme
    } from "scichart";
    // buildFunnel: copy the helper from the JavaScript tab into its own file and export it
    import { buildFunnel } from "./buildFunnel";

    @Component({
        selector: "app-funnel-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class FunnelChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // Your stages, in process order: [{ stage: "Visited site", count: 12000 }, ...]
            const funnel = buildFunnel(getYourFunnelData());
            const { rows } = funnel;

            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.05, 0.75) }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Left,
                    flippedCoordinates: true,
                    labelProvider: new TextLabelProvider({ labels: rows.map((r) => r.stage) }),
                    autoTicks: false,
                    majorDelta: 1,
                    drawMajorGridLines: false,
                    drawMinorGridLines: false,
                    growBy: new NumberRange(0.06, 0.12)
                })
            );

            sciChartSurface.renderableSeries.add(
                new FastTriangleRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, funnel.connectors),
                    drawMode: ETriangleSeriesDrawMode.List,
                    fill: "#50C7E033"
                }),
                new FastTriangleRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, funnel.weakestConnector),
                    drawMode: ETriangleSeriesDrawMode.List,
                    fill: "#E8336D88"
                }),
                new FastRectangleRenderableSeries(wasmContext, {
                    dataSeries: new XyxyDataSeries(wasmContext, funnel.bars),
                    columnXMode: EColumnMode.StartEnd,
                    columnYMode: EColumnYMode.TopBottom,
                    fill: "#50C7E0CC",
                    stroke: "#50C7E0",
                    strokeThickness: 2
                })
            );

            rows.forEach((r) => {
                sciChartSurface.annotations.add(
                    new TextAnnotation({
                        x1: r.count / 2 + rows[0].count * 0.03,
                        y1: r.row,
                        text: `${r.count.toLocaleString()}  (${r.ofStart.toFixed(1)}%)`,
                        fontSize: 17,
                        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                        verticalAnchorPoint: EVerticalAnchorPoint.Center
                    })
                );
                if (r.row > 0) {
                    sciChartSurface.annotations.add(
                        new TextAnnotation({
                            x1: 0,
                            y1: r.row - 0.5,
                            text: `${r.ofPrevious.toFixed(1)}% continue`,
                            fontSize: 15,
                            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                            verticalAnchorPoint: EVerticalAnchorPoint.Center
                        })
                    );
                }
            });
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each stage is one rectangle in a [FastRectangleRenderableSeries](/2d-charts/chart-types/fast-rectangle-renderable-series/) with an [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html). With `columnXMode: EColumnMode.StartEnd`, `x` and `x1` are the bar's two ends, so `-count / 2` and `+count / 2` centre it on zero. With `columnYMode: EColumnYMode.TopBottom`, `y` and `y1` give the bar its row.
- The connectors are a [FastTriangleRenderableSeries](/2d-charts/chart-types/fast-triangle-renderable-series/) in `ETriangleSeriesDrawMode.List` mode: every three points make one triangle, and two triangles make each trapezoid. The weakest step is a second series in a highlight colour, so the colour has one meaning.
- The stage axis is a `NumericAxis` on the left with a [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) for the stage names and `flippedCoordinates: true`, so the first stage is at the top. The value axis is hidden: centred bars have no baseline to read it against, so the numbers go on the chart as [TextAnnotations](/2d-charts/annotations-api/text-annotation/).
- The tooltip comes from a `CursorModifier` with a `tooltipDataTemplate`. The rectangle series' hit-test sets `isHit` when the mouse is inside a bar, and `dataSeriesIndex` tells you which stage it is.

**Similar centred bars in the demo app:** [JavaScript population pyramid](https://www.scichart.com/demo/javascript/population-pyramid) · [React population pyramid](https://www.scichart.com/demo/react/population-pyramid) · [Angular population pyramid](https://www.scichart.com/demo/angular/population-pyramid)

**Triangle series in the demo app:** [JavaScript triangle series chart](https://www.scichart.com/demo/javascript/triangle-series-chart) · [React triangle series chart](https://www.scichart.com/demo/react/triangle-series-chart) · [Angular triangle series chart](https://www.scichart.com/demo/angular/triangle-series-chart)

**Go deeper:** [SciChart.js rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/) and [SciChart.js triangle series documentation](/2d-charts/chart-types/fast-triangle-renderable-series/).

## Frequently asked questions

### What is a funnel chart used for?

A funnel chart is used to show how many people or items get through each step of a process, and where they drop out. Typical uses are sales pipelines, website sign-up and checkout journeys, recruitment, and marketing campaigns, where every stage is a subset of the one before it.

### How do you read a funnel chart?

Read it from top to bottom. Each bar is one stage, and its width is the number that reached that stage. Compare each bar with the one above to get the step conversion rate, and with the top bar to get the overall conversion rate. The step with the lowest conversion rate is where the process loses the largest share of people.

### When should you use a funnel chart?

Use a funnel chart when your stages happen in a fixed order and each stage contains only people or items that passed through the stage before, so the numbers can only stay the same or fall. If the categories have no order, or a later stage can be bigger than an earlier one, use a bar chart instead.

### How do you calculate conversion rates in a funnel?

Divide each stage by the stage before it to get its step conversion rate, and by the first stage to get its overall conversion rate. The drop-off rate is 100% minus the step conversion rate. Multiplying all the step rates together gives the overall rate for the last stage.

### What is the difference between a funnel chart and a bar chart?

A funnel chart is a bar chart with its bars centred and in process order, usually with tapered shapes or conversion rates between them. A bar chart lines its bars up on a common baseline, which makes values easier to compare exactly, and it works for categories in any order. Funnels suit sequential stages; bar charts suit everything else.

### How do I make a funnel chart in JavaScript?

With SciChart.js, draw each stage as a centred rectangle with a `FastRectangleRenderableSeries` and an `XyxyDataSeries`, spanning minus half to plus half of the stage's count, one row per stage. Draw the tapered connectors between stages with a `FastTriangleRenderableSeries`, and add the counts and conversion rates as `TextAnnotation`s. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Google, [[GA4] Funnel exploration](https://support.google.com/analytics/answer/9327974). Open and closed funnels: whether people can enter at any step or only at the first.
- Cleveland, W. S. and McGill, R. (1984), [Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods](https://doi.org/10.1080/01621459.1984.10478080). *Journal of the American Statistical Association*, 79(387), 531–554. Why positions and lengths on a common scale are judged more accurately than areas.

<LearnCta position="bottom" chart="funnel chart" demo="population-pyramid" docs="/2d-charts/chart-types/fast-rectangle-renderable-series/" />
