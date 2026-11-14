---
sidebar_position: 14.5
sidebar_label: Waterfall Chart
title: "Waterfall Chart: What It Is & How to Read It (With Interactive Examples)"
description: "What a waterfall chart is, how to read its rising and falling bars, subtotals and totals, a worked profit example, when to use one, and the mistakes to avoid. With a live, interactive example."
keywords:
    [
        "waterfall chart",
        "what is a waterfall chart",
        "waterfall diagram",
        "bridge chart",
        "cascade chart",
        "how to read a waterfall chart",
        "waterfall chart vs stacked bar chart",
        "profit and loss waterfall"
    ]
image: /img/learn/waterfall-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a waterfall chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A waterfall chart is used to explain how one number becomes another. Finance teams use it to walk from revenue to net profit, to bridge this year's profit to last year's, or to compare a budget with what was actually spent. It also works for cash balances, headcount, inventory or any total that changes through a list of additions and subtractions." }
                },
                {
                    "@type": "Question",
                    "name": "How do you interpret a waterfall chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Start with the first full bar: that is the starting amount. Move left to right. Each floating bar is one change, rising if it adds to the total and falling if it takes away, and its height is the size of the change. Full bars later on are subtotals or the final total. The biggest floating bars are the changes that mattered most." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a waterfall chart and a stacked bar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A stacked bar chart splits a total into parts that all add to it, drawn in one bar. A waterfall chart spreads the parts out along the axis, one bar per step, and allows negative steps that take away from the total. Use a stacked bar when every part adds to the total; use a waterfall when some parts subtract." }
                },
                {
                    "@type": "Question",
                    "name": "Is a waterfall chart the same as a Gantt chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. A Gantt chart is a project schedule that shows tasks as bars along a timeline. A waterfall chart shows how a value rises and falls through a series of changes. The names get mixed up because project managers also talk about the waterfall method, a step-by-step way of running projects that is often planned with a Gantt chart." }
                },
                {
                    "@type": "Question",
                    "name": "What is another name for a waterfall chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "In finance a waterfall chart is often called a bridge chart, because it bridges a starting figure and an ending figure. It is also called a cascade chart, and sometimes a flying bricks chart, after the floating bars. A profit walk or variance walk is a waterfall chart used for a profit and loss statement or a budget." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a waterfall chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, first work out the running total, so you know where each bar starts and ends. Then add a FastRectangleRenderableSeries with an XyxyDataSeries, setting each bar's bottom as y and its top as y1, and columnYMode to EColumnYMode.TopBottom. A palette provider colours rises, falls and totals. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Waterfall Chart

## What is a waterfall chart?

A **waterfall chart** (also called a bridge chart or cascade chart) shows how a starting amount turns into a final amount through a sequence of gains and losses. Each change is a floating bar that begins where the last one finished: up for a gain, down for a loss. Full-height bars mark the start, any subtotals and the end.

![A waterfall chart of one year's profit: green bars for products (+$900k) and services (+$600k) rise to a grey revenue subtotal of $1,500k, red bars for materials (−$620k), salaries (−$380k) and rent (−$100k) step down, a small green interest bar (+$40k) steps up, and tax (−$155k) leaves a grey profit total of $285k](/img/learn/waterfall-chart-og.png)

*A waterfall chart walking one company's year from sales to profit (sample data). [Try the interactive version](#how-to-create-a-waterfall-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A waterfall chart **explains the difference between two totals**, one change at a time.
- **Floating bars** are the changes: green bars go up, red bars go down. **Full bars** from zero are the start, subtotals and end total.
- The **height** of a floating bar is the size of the change, so the tallest floating bars are the ones that mattered most.
- It's the standard chart for a **profit and loss walk**, a **year-on-year bridge** and **budget against actual**.
- Keep the **value axis starting at zero** and the steps in the order the sum is worked out, or the chart misleads.
:::

## How to read a waterfall chart

![The parts of a waterfall chart, using a month of household money: a grey starting bar of $1,200, a green salary bar (+$2,400), red rent and bills bars, a grey subtotal after fixed costs ($2,340), red groceries and car repair bars, a green freelance work bar (+$300), and a grey end-of-month total of $1,840. Numbered markers point out the starting value, an increase, a decrease, a connector, the subtotal and the end total](./waterfall-chart-anatomy.svg)

1. **Start at the first full bar.** It stands on zero and shows the amount you begin with: here, $1,200 in the bank at the start of the month.
2. **Move from left to right, one step at a time.** Each floating bar is one change. A **green bar rises** from the previous total by the amount added (salary, +$2,400). A **red bar falls** by the amount taken away (rent, −$950).
3. **Follow the connector lines.** The thin dashed lines carry the running total from the end of one bar to the start of the next, so you can see that nothing is lost in between.
4. **Read the subtotals.** A full bar in the middle (after fixed costs, $2,340) is the running total at that point. It starts at zero again so you can read its value straight off the axis.
5. **Finish at the end total.** The last full bar is where everything ends up: $1,840. The difference between the first and last bars is the sum of every floating bar in between.
6. **Look for the biggest floating bars.** They are the changes that explain most of the difference. Here, salary and rent dwarf everything else.

## A worked example: from sales to profit

The chart at the top of the page walks one company's year from sales to profit, the most common use of a waterfall in finance. To draw it, work out the **running total** after every step. Each floating bar goes from the running total before the step to the running total after it. Each subtotal or total bar goes from zero to the running total.

| Step | Change ($k) | Running total ($k) | Bar drawn from → to ($k) |
| --- | --- | --- | --- |
| Products | +900 | 900 | 0 → 900 |
| Services | +600 | 1,500 | 900 → 1,500 |
| **Revenue** (subtotal) | | **1,500** | 0 → 1,500 |
| Materials | −620 | 880 | 1,500 → 880 |
| Salaries | −380 | 500 | 880 → 500 |
| Rent | −100 | 400 | 500 → 400 |
| Interest earned | +40 | 440 | 400 → 440 |
| Tax | −155 | 285 | 440 → 285 |
| **Profit** (total) | | **285** | 0 → 285 |

Two things to notice:

- **Subtotals add nothing.** The revenue bar repeats the running total as a full bar, so the reader gets a checkpoint. Only the steps change the total.
- **A falling bar is drawn from its higher end down.** Materials spans 1,500 to 880: its top is where revenue left off, and its bottom is the new running total.

### How to describe a waterfall chart

Use this template when you report a waterfall chart:

> **[What was measured]** went from **[start]** to **[end]** over **[period or steps]**. The biggest increase was **[step, amount]** and the biggest decrease was **[step, amount]**.

**Worked example:** "Revenue of $1.5 million became a profit of $285,000 this year, a margin of 19%. Product sales were the biggest contributor at $900,000, and materials were the biggest cost at $620,000."

## Types of waterfall chart

| Type | What it shows | Example |
| --- | --- | --- |
| **Profit and loss walk** | Revenue stepping down through costs to profit, with subtotals for each line of the income statement | The chart at the top of this page |
| **Bridge between two periods** | What changed between two totals, such as last year's profit and this year's | Profit 2025 → price, volume, costs → profit 2026 |
| **Budget against actual** (variance) | Starts at the budget, then each over- or underspend, ending at the actual figure | Planned spend → overruns and savings → actual spend |
| **Running balance** | A balance moving through additions and withdrawals over time | Cash at the start of the month → income and payments → cash at the end |
| **Horizontal waterfall** | The same chart with the bars running across the page | Useful when step names are long |
| **Stacked waterfall** | Each step split into coloured parts, such as regions or products | A revenue bridge split by region |

## When to use a waterfall chart

Reach for a waterfall chart when the question is **how one total became another**, and some of the steps take away from it. It answers "why did profit fall?" or "where did the budget go?" better than a list of numbers, because the reader sees each step move the total.

| Chart | Best for |
| --- | --- |
| **Waterfall chart** | Showing how a starting total becomes an end total through gains and losses, in order |
| [Bar chart](/learn/bar-chart/) | Comparing separate values side by side, when they don't add up to a running total |
| [Stacked bar chart](/learn/bar-chart/#stacked-bar-chart) | Splitting a total into parts that all add to it, with no negative parts |
| [Line chart](/learn/line-chart/) | How a total moves over many time steps, when the individual changes don't need labels |
| [Sankey diagram](/learn/sankey-diagram/) | Where a total comes from and goes to across several stages, not one running total |

A waterfall works best with roughly **5 to 15 steps**. Fewer, and a table says the same thing. More, and the bars get thin and the labels crowd: group the small steps into one "Other" step.

## Spectral waterfall charts: a different chart with the same name

In science and engineering, "waterfall chart" (or **waterfall plot**) means something else: many lines, each a spectrum or signal measured at one moment, staggered one behind the other with the newest in front. It shows how a signal's frequency content changes over time or with something like engine speed, in fields such as vibration testing, audio and radio. It is a 3D view of the same data a [spectrogram](/learn/spectrogram/) shows as colour.

If that's what you were looking for, SciChart.js draws both kinds:

- **2D interactive waterfall:** stacked spectra you can hover and click to select one slice. [SciChart.js interactive waterfall chart documentation](/2d-charts/chart-types/waterfall-renderable-series/interactive-waterfall-chart/) · [JavaScript interactive waterfall chart](https://www.scichart.com/demo/javascript/interactive-waterfall-chart)
- **3D waterfall:** slices laid out along a third axis that you can rotate. [SciChart.js 3D waterfall chart documentation](/2d-charts/chart-types/waterfall-renderable-series/waterfall-3d-chart/) · [JavaScript 3D point-line chart](https://www.scichart.com/demo/javascript/3d-point-line-chart)

The rest of this page is about the financial waterfall.

## Common waterfall chart mistakes

- **Cutting off the value axis.** Floating bars are read against the axis, and full bars are compared by height. If the axis starts above zero, the totals look smaller or larger than they are. Start it at zero.
- **Letting subtotals float.** A subtotal or total must stand on zero. If it floats like a step, readers add it to the total a second time.
- **Steps in the wrong order.** The steps must follow the order of the sum, such as sales, then costs, then tax. Sorting a profit walk by size breaks the subtotals. Only a bridge between two periods, which has no subtotals, can be sorted largest first.
- **Unclear colours or signs.** Use one colour for rises, another for falls and a neutral one for totals, and keep them the same across every chart in a report. Label falls with a minus sign as well, for readers who can't tell red from green.
- **Labels that don't add up.** Rounding each step on its own can leave the labels a little off the total. Work out the running total from the unrounded values, and check that the labels add up before you publish.
- **Too many tiny steps.** Twenty bars of a few dollars each hide the few that matter. Group small items into one "Other" step.
- **A running total that crosses zero.** If losses take the total below zero, a bar can straddle the axis. That's correct, but say so in the label or caption, because readers expect every bar to sit above the line.

## How to create a waterfall chart in JavaScript, React or Angular

SciChart.js draws a waterfall chart with its rectangle series: you give each bar an explicit bottom and top, and colour it by whether it rises, falls or is a total. Because SciChart.js draws with WebGL and WebGPU, the chart stays smooth to zoom and pan however many steps you add. Try the chart below: scroll to zoom, drag to pan, double-click to reset, and hover over a bar to see its change and the running total.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="waterfall chart" demo="waterfall-chart" docs="/2d-charts/chart-types/waterfall-renderable-series/" />

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
        EDataPointWidthMode,
        EFillPaletteMode,
        TextLabelProvider,
        NumberRange,
        parseColorToUIntArgb,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // Steps ({ label, kind: "step", value }) and totals ({ label, kind: "total" }), in order
        const items = getYourWaterfallData();
        let runningTotal = 0;
        const bars = items.map((item) => {
            if (item.kind === "total") return { ...item, from: 0, to: runningTotal, change: runningTotal };
            const from = runningTotal;
            runningTotal += item.value;
            return { ...item, from, to: runningTotal, change: item.value };
        });
        const xValues = bars.map((_, index) => index);

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                labelProvider: new TextLabelProvider({ labels: bars.map((bar) => bar.label), useNativeText: false }),
                autoTicks: false,
                majorDelta: 1,
                growBy: new NumberRange(0.12, 0.04)
            })
        );
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.12) }));

        const barColours = {
            fillPaletteMode: EFillPaletteMode.SOLID,
            onAttached() {},
            onDetached() {},
            overrideFillArgb(xValue: number, yValue: number, index: number) {
                const bar = bars[index];
                if (bar.kind === "total") return parseColorToUIntArgb("#94A3B8");
                return parseColorToUIntArgb(bar.change >= 0 ? "#26A69A" : "#EF5350");
            }
        };

        sciChartSurface.renderableSeries.add(
            new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues,
                    yValues: bars.map((bar) => Math.min(bar.from, bar.to)),
                    x1Values: xValues,
                    y1Values: bars.map((bar) => Math.max(bar.from, bar.to))
                }),
                columnXMode: EColumnMode.Mid,
                columnYMode: EColumnYMode.TopBottom,
                dataPointWidthMode: EDataPointWidthMode.Range,
                dataPointWidth: 0.7,
                strokeThickness: 0,
                paletteProvider: barColours
            })
        );
        return { sciChartSurface };
    };

    export const WaterfallChart = () => (
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
        EDataPointWidthMode,
        EFillPaletteMode,
        TextLabelProvider,
        NumberRange,
        parseColorToUIntArgb,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-waterfall-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class WaterfallChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // Steps ({ label, kind: "step", value }) and totals ({ label, kind: "total" }), in order
            const items = getYourWaterfallData();
            let runningTotal = 0;
            const bars = items.map((item) => {
                if (item.kind === "total") return { ...item, from: 0, to: runningTotal, change: runningTotal };
                const from = runningTotal;
                runningTotal += item.value;
                return { ...item, from, to: runningTotal, change: item.value };
            });
            const xValues = bars.map((_, index) => index);

            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    labelProvider: new TextLabelProvider({ labels: bars.map((bar) => bar.label), useNativeText: false }),
                    autoTicks: false,
                    majorDelta: 1,
                    growBy: new NumberRange(0.12, 0.04)
                })
            );
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.12) }));

            const barColours = {
                fillPaletteMode: EFillPaletteMode.SOLID,
                onAttached() {},
                onDetached() {},
                overrideFillArgb(xValue: number, yValue: number, index: number) {
                    const bar = bars[index];
                    if (bar.kind === "total") return parseColorToUIntArgb("#94A3B8");
                    return parseColorToUIntArgb(bar.change >= 0 ? "#26A69A" : "#EF5350");
                }
            };

            sciChartSurface.renderableSeries.add(
                new FastRectangleRenderableSeries(wasmContext, {
                    dataSeries: new XyxyDataSeries(wasmContext, {
                        xValues,
                        yValues: bars.map((bar) => Math.min(bar.from, bar.to)),
                        x1Values: xValues,
                        y1Values: bars.map((bar) => Math.max(bar.from, bar.to))
                    }),
                    columnXMode: EColumnMode.Mid,
                    columnYMode: EColumnYMode.TopBottom,
                    dataPointWidthMode: EDataPointWidthMode.Range,
                    dataPointWidth: 0.7,
                    strokeThickness: 0,
                    paletteProvider: barColours
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Work out the running total **before** you chart it. Each step's bar runs from the total before it to the total after it; each subtotal or total bar runs from zero.
- A [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with an [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) draws the bars. `columnYMode: EColumnYMode.TopBottom` makes `yValues` each bar's bottom and `y1Values` its top, and `columnXMode: EColumnMode.Mid` centres it on its x value.
- A palette provider's `overrideFillArgb` colours each bar by its index: green for a rise, red for a fall, blue-grey for a total. See the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/).
- In the live demo, [LineAnnotation](/2d-charts/annotations-api/line-annotation/)s draw the dashed connectors and [TextAnnotation](/2d-charts/annotations-api/text-annotation/)s the value labels. A [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) puts a step name under each bar; `useNativeText: false` keeps each name centred under its bar.

**See it in the demo app:** [JavaScript waterfall chart](https://www.scichart.com/demo/javascript/waterfall-chart) · [React waterfall chart](https://www.scichart.com/demo/react/waterfall-chart) · [Angular waterfall chart](https://www.scichart.com/demo/angular/waterfall-chart)

**Go deeper:** [SciChart.js waterfall chart documentation](/2d-charts/chart-types/waterfall-renderable-series/), including data labels inside each bar, and the [SciChart.js rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/).

## Frequently asked questions

### What is a waterfall chart used for?

A waterfall chart is used to explain how one number becomes another. Finance teams use it to walk from revenue to net profit, to bridge this year's profit to last year's, or to compare a budget with what was actually spent. It also works for cash balances, headcount, inventory or any total that changes through a list of additions and subtractions.

### How do you interpret a waterfall chart?

Start with the first full bar: that is the starting amount. Move left to right. Each floating bar is one change, rising if it adds to the total and falling if it takes away, and its height is the size of the change. Full bars later on are subtotals or the final total. The biggest floating bars are the changes that mattered most.

### What is the difference between a waterfall chart and a stacked bar chart?

A stacked bar chart splits a total into parts that all add to it, drawn in one bar. A waterfall chart spreads the parts out along the axis, one bar per step, and allows negative steps that take away from the total. Use a stacked bar when every part adds to the total; use a waterfall when some parts subtract.

### Is a waterfall chart the same as a Gantt chart?

No. A Gantt chart is a project schedule that shows tasks as bars along a timeline. A waterfall chart shows how a value rises and falls through a series of changes. The names get mixed up because project managers also talk about the waterfall method, a step-by-step way of running projects that is often planned with a Gantt chart.

### What is another name for a waterfall chart?

In finance a waterfall chart is often called a bridge chart, because it bridges a starting figure and an ending figure. It is also called a cascade chart, and sometimes a flying bricks chart, after the floating bars. A profit walk or variance walk is a waterfall chart used for a profit and loss statement or a budget.

### How do I make a waterfall chart in JavaScript?

With SciChart.js, first work out the running total, so you know where each bar starts and ends. Then add a `FastRectangleRenderableSeries` with an `XyxyDataSeries`, setting each bar's bottom as `y` and its top as `y1`, and `columnYMode` to `EColumnYMode.TopBottom`. A palette provider colours rises, falls and totals. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Microsoft Support, [Create a waterfall chart](https://support.microsoft.com/en-us/excel/create-a-waterfall-chart). Totals and subtotals that start on the horizontal axis, connector lines, and the name "bridge chart".
- Wikipedia, [Waterfall chart](https://en.wikipedia.org/wiki/Waterfall_chart). Other names (bridge, cascade, flying bricks) and uses in financial analysis.
- Wikipedia, [Waterfall plot](https://en.wikipedia.org/wiki/Waterfall_plot). The scientific waterfall: stacked curves showing how a spectrum changes over time.

<LearnCta position="bottom" chart="waterfall chart" demo="waterfall-chart" docs="/2d-charts/chart-types/waterfall-renderable-series/" />
