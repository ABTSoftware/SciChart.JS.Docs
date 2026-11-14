---
sidebar_position: 2.5
sidebar_label: Sparkline
title: "Sparkline: What It Is & How to Read It (With Interactive Examples)"
description: "What a sparkline is, how to read one, the main types, whether rows should share a scale, and the mistakes to avoid. With a live table of 40 sparklines."
keywords:
    [
        "sparkline",
        "sparklines",
        "sparkline chart",
        "what is a sparkline",
        "sparkline graph",
        "spark chart",
        "how to read a sparkline",
        "types of sparklines",
        "sparkline vs line chart"
    ]
image: /img/learn/sparkline-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a sparkline used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A sparkline is used to show the recent history of a number right next to the number itself, in the space of a word. Typical uses are a column of trends in a table of stocks, KPIs or sensor channels, a trend inside a dashboard tile, and a small trend inside a sentence of a report. It shows direction, swings and unusual values at a glance, not exact readings." }
                },
                {
                    "@type": "Question",
                    "name": "What are the three types of sparklines?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The three common types are line sparklines, which show how a value moves over time; column sparklines, which show the size of each period's value as a small bar; and win/loss sparklines, which show only whether each result was positive or negative. Some tools add area sparklines, a line with the space below it filled." }
                },
                {
                    "@type": "Question",
                    "name": "Who invented the sparkline?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The statistician and information designer Edward Tufte named and defined the sparkline in his 2006 book Beautiful Evidence, describing sparklines as data-intense, design-simple, word-sized graphics. Small charts set inside text had appeared before, but Tufte gave them their name and set out how to design them." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a sparkline and a line chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A sparkline is a line chart shrunk to the size of a word, with the axes, gridlines, labels and legend taken away. A full line chart has axes you can read exact values from and room for several series. A sparkline shows only the shape of one series, and sits next to its label and latest value in a table, a tile or a sentence." }
                },
                {
                    "@type": "Question",
                    "name": "Should sparklines in a table share the same scale?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It depends on the question. Give each row its own vertical scale to show the shape of each series, such as when it peaked or whether it is rising. Use one shared scale when the rows are in the same unit and readers need to compare how much each one changed. Say which you chose, because the same data looks very different each way." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a sparkline in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, a sparkline is a FastLineRenderableSeries on a chart whose x- and y-axes have isVisible set to false, with no chart modifiers. Add XyScatterRenderableSeries with EllipsePointMarker for the lowest, highest and latest points, and a BoxAnnotation for a normal-range band. For a table of many sparklines, create one SciChartSurface and add each cell with SciChartSubSurface.createSubSurface, so all of them share one WebGL context. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Sparkline

## What is a sparkline?

A **sparkline** (also called a sparkline chart or spark line) is a tiny line chart, about the size of a word, drawn without axes, gridlines or labels. It shows the recent shape of one value over time, such as a share price or a temperature, and sits beside that value in a sentence, table cell or dashboard tile.

![A table of 40 live sparklines for simulated plant sensors in two columns: each row shows a channel name such as Temp 01 or Pressure 02, a small line of its last 300 readings over a grey normal-range band with blue dots at the lowest and highest readings and a red dot at the latest one, and the latest value, shown in amber with a HIGH or LOW flag when it is outside the normal range](/img/learn/sparkline-og.png)

*A table of 40 sparklines, one per sensor channel, each showing its last 300 readings (simulated data). [Try the live version](#how-to-create-sparklines-in-javascript-react-or-angular).*

:::tip Key takeaways
- A sparkline is a **word-sized line chart with no axes**. You read its **shape**, then the **number** printed beside it.
- The name comes from **Edward Tufte**, who described sparklines as "data-intense, design-simple, word-sized graphics" in *Beautiful Evidence* (2006).
- Small extras do most of the work: a **dot and number for the latest value**, dots for the **lowest and highest**, and a **grey band for the normal range**.
- In a table, decide whether each row gets **its own scale** (to show each shape) or **one shared scale** (to compare sizes of change), and say which.
- Sparklines are at their best **in quantity**: dozens of rows read at a glance, where full charts wouldn't fit.
:::

## How to read a sparkline

![The parts of a sparkline: an enlarged line of a tank's temperature over 24 hours, with the label Tank 3 temp on the left and the latest value, 71.8 °C, in red on the right. A grey band marks the normal range of 62 to 74 °C, blue dots mark the lowest and highest readings, and a red dot marks the latest reading. Below, the same sparkline at actual size inside a sentence](./sparkline-anatomy.svg)

1. **Start with the label.** It tells you what is measured, and often the period: the last 24 hours, the last 12 months.
2. **Read the line from left to right.** The oldest reading is on the left and the newest on the right. Look for the overall direction, the size of the swings and any spike or sudden change.
3. **Read the number, not the height.** There is no axis, so you can't read exact values off the line. The latest value is printed beside it, often in the same colour as the dot at the end of the line.
4. **Check the markers.** Dots at the lowest and highest points show where the extremes fell in time. Without them, a reader can't tell a 1% wobble from a 50% swing.
5. **Compare with the band.** A grey band, where there is one, marks the normal or target range. A line that leaves the band is the thing to look at. Tufte's first example was a patient's glucose readings, with a grey band showing the normal range.
6. **Check the scale before comparing rows.** In a table, each row usually has its own vertical scale, so two lines of the same height may show very different amounts of change (see [Own scale or shared scale?](#sparklines-in-a-table-own-scale-or-shared-scale) below).

### How to describe a sparkline

Use this template when you report what a sparkline shows:

> **[What is measured]** is **[latest value]**, **[up / down / flat]** over **[period]**, and **[inside / above / below]** its normal range. It ranged from **[lowest]** to **[highest]**.

**Worked example** (the diagram above): "Tank 3's temperature is 71.8 °C, rising over the last few hours and back inside its normal range of 62 to 74 °C. Over 24 hours it ranged from about 63 °C to 78 °C, with one short spike above the range."

## Where sparklines come from

The statistician and information designer **Edward Tufte** named and defined the sparkline in his book *Beautiful Evidence* (2006), in a chapter that describes sparklines as "data-intense, design-simple, word-sized graphics". His idea was that a chart doesn't need to be a big, separate figure with a caption and a frame: it can sit wherever a word or a number can, at the resolution of type.

His examples set out most of what sparklines still look like today:

- a patient's glucose readings with a **grey band for the normal range**, so readings outside it stand out;
- tables of exchange rates with a sparkline in every row, using **red for the first and last values and blue for the low and high**;
- advice on shape: sparklines should look **"lumpy", not spiky and not flat**, following William Cleveland's method of choosing a chart's width-to-height ratio so that slopes average about 45°.

Small charts embedded in text existed before 2006, but the name and the design rules come from Tufte. Spreadsheet apps such as Excel and Google Sheets now have sparklines built in; their help pages cover the menus and formulas.

## Types of sparkline

| Type | What it shows | Use it for |
| --- | --- | --- |
| **Line sparkline** | How a value moves over time, as a thin line | Prices, temperatures, traffic, sensor readings: anything continuous |
| **Area sparkline** | A line sparkline with the space below it filled | The same data as a line, with more visual weight in a dashboard tile |
| **Column (bar) sparkline** | Each period's value as a small bar | Counts per day, week or month, where each period stands on its own |
| **Win/loss sparkline** | Only whether each result was positive or negative, as bars above or below a centre line | Results, targets met or missed, up or down days |

Spreadsheet apps offer the **line, column and win/loss** types, which is why they're often called "the three types of sparklines". The rest of this page is about line sparklines, the original and most common kind.

## Sparklines in a table: own scale or shared scale?

When sparklines sit in a table, each row can have **its own vertical scale**, stretched to fit that row's data, or every row can use **one shared scale**. The choice changes what the table says:

![The same three pumps' flow rates drawn twice. On the left, each row has its own scale: Pump A, which rose by 4 L/min, looks the same as Pump B, which rose by 40, and Pump C's small random wobble looks like a dramatic zigzag. On the right, all rows share one scale: Pump B's rise stands out and Pumps A and C are almost flat](./sparkline-own-vs-shared-scale.svg)

- **Own scale per row** shows the **shape** of each series clearly: when it peaked, whether it's rising or falling, whether it's steady. But it makes small changes look as big as large ones, and it blows up random noise into what looks like a trend (Pump C above).
- **One shared scale** shows **how much** each series changed, so rows can be compared. But it only works when every row has the same unit and a similar size, and quiet rows flatten into straight lines.

Most sparkline tables use their own scale per row, because their rows have different units or sizes (as in the sensor table at the top of this page). If you do that, print the latest value beside each line, mark the lowest and highest points, and consider a band for the normal range, so the reader isn't left judging change from the height of the line.

## When to use a sparkline

Use a sparkline when you have **many series** and want to show **the recent trend of each one next to its current value**, in less space than a chart would need. Typical uses:

- **watchlists and tables:** a column of trends beside prices, KPIs or account balances;
- **monitoring:** dozens or hundreds of sensor channels, servers or patients, each with a normal range, where the job is to spot the ones that move outside it;
- **dashboard tiles:** a big number with a small trend line under it;
- **text:** a trend set inside a sentence of a report.

| Chart | Best for |
| --- | --- |
| **Sparkline** | The shape of many series at a glance, each next to its label and latest value |
| [Line chart](/learn/line-chart/) | One or a few series in detail, with axes for reading values and dates |
| [Small multiples](/2d-charts/subcharts-api/subcharts-api-overview/) | A grid of small charts, each with its own axes, for comparing several series more precisely |
| A single number | When only the current value matters, and its history doesn't |

## Common sparkline mistakes

- **No number beside the line.** A sparkline has no axis, so readers can't get a value from it. Print the latest value next to the line.
- **Comparing rows on different scales without saying so.** If every row has its own scale, readers can't compare the heights of the lines. Say so in the column header, or use one scale.
- **Mistaking noise for a trend.** A row on its own scale stretches any wobble to the full height. Mark the lowest and highest values, or add a normal-range band, so small wobbles look small.
- **Too few points.** A line through 4 or 5 values says little. Show the numbers, or use a column sparkline.
- **The wrong shape.** A tall, narrow sparkline makes every change look spiky, and a long, flat one hides changes. Aim for a ribbon wider than it is tall, with slopes around 45° where you can.
- **Decoration.** Axes, gridlines, heavy cell borders, shadows and many colours compete with a line a few pixels high. Keep one line colour and use colour only for markers that mean something.
- **Different periods on different rows.** Every row in a table should cover the same time window, or the shapes can't be compared.

## How to create sparklines in JavaScript, React or Angular

SciChart.js has no separate sparkline series: a sparkline is a line series on a chart with its axes hidden. The interesting part is having **many** of them. Instead of one chart per table cell, the table below is **one** SciChart.js chart, and each sparkline is a sub-chart drawn with the same WebGL context. Each of its 40 sparklines shows a simulated sensor's last 300 readings and gets a new reading every 50 milliseconds. There is nothing to click: watch the lines scroll, and the values turn amber with a HIGH or LOW flag when a channel leaves its grey normal range.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="sparkline" demo="multiple-chart-dashboard-performance-demo" docs="/2d-charts/subcharts-api/subcharts-api-overview/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        SciChartSubSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        BoxAnnotation,
        ECoordinateMode,
        Rect,
        Thickness,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            padding: Thickness.fromNumber(0)
        });

        // One sparkline per row: { xValues, yValues, low, high } for each series
        const rows = getYourSparklineData();
        const rowHeight = 1 / rows.length;

        rows.forEach((row, index) => {
            // Each sparkline is a sub-chart of the one parent chart
            const cell = SciChartSubSurface.createSubSurface(sciChartSurface, {
                position: new Rect(0, index * rowHeight, 1, rowHeight),
                padding: Thickness.fromNumber(4)
            });
            cell.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
            cell.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

            // Normal range band
            cell.annotations.add(
                new BoxAnnotation({ x1: 0, x2: 1, xCoordinateMode: ECoordinateMode.Relative, y1: row.low, y2: row.high, fill: "#FFFFFF1F", strokeThickness: 0 })
            );

            const last = row.xValues.length - 1;
            cell.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: row.xValues, yValues: row.yValues }),
                    stroke: "#C8D3E0",
                    strokeThickness: 1.5
                }),
                // A red dot on the latest value
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: [row.xValues[last]], yValues: [row.yValues[last]] }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#EF5350", strokeThickness: 0 })
                })
            );
        });
        return { sciChartSurface };
    };

    export const SparklineTable = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        SciChartSubSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        BoxAnnotation,
        ECoordinateMode,
        Rect,
        Thickness,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-sparkline-table",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class SparklineTableComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme(),
                padding: Thickness.fromNumber(0)
            });

            // One sparkline per row: { xValues, yValues, low, high } for each series
            const rows = getYourSparklineData();
            const rowHeight = 1 / rows.length;

            rows.forEach((row, index) => {
                // Each sparkline is a sub-chart of the one parent chart
                const cell = SciChartSubSurface.createSubSurface(sciChartSurface, {
                    position: new Rect(0, index * rowHeight, 1, rowHeight),
                    padding: Thickness.fromNumber(4)
                });
                cell.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
                cell.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

                // Normal range band
                cell.annotations.add(
                    new BoxAnnotation({ x1: 0, x2: 1, xCoordinateMode: ECoordinateMode.Relative, y1: row.low, y2: row.high, fill: "#FFFFFF1F", strokeThickness: 0 })
                );

                const last = row.xValues.length - 1;
                cell.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, { xValues: row.xValues, yValues: row.yValues }),
                        stroke: "#C8D3E0",
                        strokeThickness: 1.5
                    }),
                    // A red dot on the latest value
                    new XyScatterRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, { xValues: [row.xValues[last]], yValues: [row.yValues[last]] }),
                        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#EF5350", strokeThickness: 0 })
                    })
                );
            });
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each sparkline is a [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series/) on a chart whose two `NumericAxis` have `isVisible: false`, so there are no ticks, labels or gridlines. There are no chart modifiers: a sparkline is too small to zoom.
- `SciChartSubSurface.createSubSurface()` adds each cell to one parent `SciChartSurface`, positioned with a `Rect` as fractions of the parent's width and height. All the sub-charts share one WebGL context, which is what keeps dozens of live charts fast. See the [SubCharts API](/2d-charts/subcharts-api/subcharts-api-overview/) and the [worked example of a large dashboard](/2d-charts/subcharts-api/example-using-sub-charts-to-create-large-dashboard/).
- The markers are `XyScatterRenderableSeries` with an `EllipsePointMarker`, and the normal range is a [BoxAnnotation](/2d-charts/annotations-api/box-annotation/) with `xCoordinateMode: ECoordinateMode.Relative`, so it always spans the full width. The labels and values are [NativeTextAnnotation](/2d-charts/annotations-api/native-text-annotation/)s on the parent chart, drawn by WebGL too.
- For live data, create each `XyDataSeries` with `fifoCapacity` and call `append()`: the oldest point drops off as each new one arrives. See [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/).

**See it in the demo app** (64 small charts with hidden axes, updating live in one SubCharts grid): [JavaScript multi-chart dashboard](https://www.scichart.com/demo/javascript/multiple-chart-dashboard-performance-demo) · [React multi-chart dashboard](https://www.scichart.com/demo/react/multiple-chart-dashboard-performance-demo) · [Angular multi-chart dashboard](https://www.scichart.com/demo/angular/multiple-chart-dashboard-performance-demo)

**One line, full size:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart)

**Go deeper:** [SciChart.js sparkline documentation](/2d-charts/subcharts-api/subcharts-api-overview/) (the SubCharts API), and the [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/).

## Frequently asked questions

### What is a sparkline used for?

A sparkline is used to show the recent history of a number right next to the number itself, in the space of a word. Typical uses are a column of trends in a table of stocks, KPIs or sensor channels, a trend inside a dashboard tile, and a small trend inside a sentence of a report. It shows direction, swings and unusual values at a glance, not exact readings.

### What are the three types of sparklines?

The three common types are line sparklines, which show how a value moves over time; column sparklines, which show the size of each period's value as a small bar; and win/loss sparklines, which show only whether each result was positive or negative. Some tools add area sparklines, a line with the space below it filled.

### Who invented the sparkline?

The statistician and information designer Edward Tufte named and defined the sparkline in his 2006 book Beautiful Evidence, describing sparklines as data-intense, design-simple, word-sized graphics. Small charts set inside text had appeared before, but Tufte gave them their name and set out how to design them.

### What is the difference between a sparkline and a line chart?

A sparkline is a line chart shrunk to the size of a word, with the axes, gridlines, labels and legend taken away. A full line chart has axes you can read exact values from and room for several series. A sparkline shows only the shape of one series, and sits next to its label and latest value in a table, a tile or a sentence.

### Should sparklines in a table share the same scale?

It depends on the question. Give each row its own vertical scale to show the shape of each series, such as when it peaked or whether it is rising. Use one shared scale when the rows are in the same unit and readers need to compare how much each one changed. Say which you chose, because the same data looks very different each way.

### How do I make a sparkline in JavaScript?

With SciChart.js, a sparkline is a `FastLineRenderableSeries` on a chart whose x- and y-axes have `isVisible` set to `false`, with no chart modifiers. Add `XyScatterRenderableSeries` with `EllipsePointMarker` for the lowest, highest and latest points, and a `BoxAnnotation` for a normal-range band. For a table of many sparklines, create one `SciChartSurface` and add each cell with `SciChartSubSurface.createSubSurface`, so all of them share one WebGL context. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Tufte, E. (2006). *Beautiful Evidence*. Graphics Press, pages 46–63. The chapter that names and defines sparklines.
- Tufte, E., [Sparkline theory and practice](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/). Drafts of that chapter: the definition, the glucose example with a grey normal-range band, the red and blue markers, and the advice on aspect ratio.
- Cleveland, W. S. (1993). *Visualizing Data*. Hobart Press. Banking to 45°: choosing a chart's aspect ratio so that slopes average about 45°.
- Heer, J. and Agrawala, M. (2006), [Multi-Scale Banking to 45 Degrees](https://doi.org/10.1109/TVCG.2006.163). *IEEE Transactions on Visualization and Computer Graphics*, 12(5), 701–708. A method for choosing aspect ratios automatically, which Tufte points to for sparklines.

<LearnCta position="bottom" chart="sparkline" demo="multiple-chart-dashboard-performance-demo" docs="/2d-charts/subcharts-api/subcharts-api-overview/" />
