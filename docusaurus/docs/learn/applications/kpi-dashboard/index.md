---
sidebar_position: 100
sidebar_label: KPI Dashboard
title: "KPI Dashboard: What to Put on One and How to Design It, With Examples"
description: "What a KPI dashboard is, how to choose KPIs, which chart suits each one, how to show targets and lay it out, with examples by team and a live sales dashboard to try."
keywords:
    [
        "kpi dashboard",
        "sales dashboard",
        "what is a kpi dashboard",
        "kpi dashboard examples",
        "how to create a kpi dashboard",
        "kpi dashboard design",
        "kpi vs metric",
        "leading and lagging indicators",
        "sales kpi dashboard",
        "executive dashboard",
        "operational dashboard",
        "oee dashboard",
        "kpi tile",
        "bullet chart vs gauge"
    ]
image: /img/learn/kpi-dashboard-og.png
related: [real-time-dashboard, bullet-chart, gauge-chart, sparkline]
datePublished: 2026-11-20
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What should be on a KPI dashboard?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A KPI dashboard should show the few measures that tell you whether a goal is being met, each with its current value, the period it covers, a comparison with a target or an earlier period, and a short trend. Below those headline numbers, add a trend chart and a breakdown that explains what is driving them. Leave out anything nobody would act on." }
                },
                {
                    "@type": "Question",
                    "name": "How many KPIs should a dashboard have?",
                    "acceptedAnswer": { "@type": "Answer", "text": "As few as answer the dashboard's question, and no more than fit on one screen without scrolling. In practice that usually means a handful of headline KPIs, often four to eight, with supporting charts beneath them. If a dashboard needs twenty headline numbers, it is usually trying to serve several audiences and should be split." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a KPI and a metric?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A metric is any number you measure, such as page views, calls made or units shipped. A KPI (key performance indicator) is one of the few metrics chosen because it shows progress towards a specific goal, has a target and an owner, and leads to action when it moves. Every KPI is a metric, but most metrics are not KPIs." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a KPI dashboard and a KPI report?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A KPI dashboard is a screen that is kept up to date and read at a glance, usually interactive, so people can filter and drill down. A KPI report is a fixed snapshot for one period, often a document or slide pack, with more commentary explaining the numbers. Many teams use the dashboard day to day and a report for monthly or quarterly reviews." }
                },
                {
                    "@type": "Question",
                    "name": "What is a sales dashboard?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A sales dashboard is a KPI dashboard for a sales team. It typically shows revenue or bookings against quota, the pipeline by stage, win rate, average deal size and sales cycle length, broken down by region, product or salesperson. Sales leaders use it to forecast the period and see where to coach or add effort." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a KPI dashboard in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute each KPI and its comparison from your data in plain JavaScript, then lay out HTML tiles for the headline numbers and a grid of charts underneath. With SciChart.js, draw the tile sparklines as sub-charts of one surface, the trend as a column series with target lines, the bullet chart and waterfall with rectangle series, and use palette providers to colour off-target values. Re-run the calculation when a filter changes." }
                }
            ]
        })}
    </script>
</head>

# KPI Dashboard

## What is a KPI dashboard?

A **KPI dashboard** is a single screen that shows an organisation's key performance indicators (the few measures that show whether a goal is being met), each against a target or an earlier period, so people can see at a glance what is on track and what needs attention. Sales, finance, operations and support teams each use their own.

![A sales KPI dashboard on a dark navy background: four tiles for revenue, gross margin, orders and average order value, each with its change against target and a 12-month sparkline, gross margin flagged as off target; below them monthly revenue columns with dashed target and last-year lines, a bullet chart of revenue by region against target, and a waterfall of the revenue gap by region](/img/learn/kpi-dashboard-og.png)

*A sales KPI dashboard for one quarter, with off-target values in orange (simulated data). [Try the interactive version](#how-to-build-a-kpi-dashboard-in-javascript-react-or-angular) and change the period, comparison and region.*

:::tip Key takeaways
- A KPI is a metric with a goal, a target, an owner and a clear action when it moves. Most metrics are not KPIs.
- Every number on a KPI dashboard needs a comparison: against target, the previous period or a forecast.
- Pick the chart by the question: a big number with a sparkline for status and trend, a bullet chart for progress to target, a waterfall for why a number changed.
- Put the most important KPI top-left, group related measures, and never rely on red and green alone.
- Match the refresh rate to how fast people can act: daily or hourly for most business KPIs.
:::

## KPI vs metric

Every KPI is a metric, but few metrics deserve to be KPIs. A **metric** is anything you can count or measure: website visits, calls made, tickets closed. A **key performance indicator (KPI)** is a metric chosen because it tracks progress towards a specific goal. To earn the name, it should have:

- a goal it serves ("grow recurring revenue 20% this year");
- a target for each period, so a value can be judged good or bad;
- an owner, who is expected to act when it moves;
- a clear definition: what is counted, from which system, over which period.

"Website visits" is a metric. "Qualified leads per month, target 400, owned by the marketing lead" is a KPI.

### Leading vs lagging indicators

| | Lagging indicator | Leading indicator |
| --- | --- | --- |
| What it measures | An outcome that has already happened | An activity or condition that tends to come before the outcome |
| Examples | Revenue, profit, customer churn, on-time delivery | Pipeline value, demos booked, trial sign-ups, machine downtime alarms |
| Strength | Easy to measure, hard to argue with | Gives time to act before the outcome is fixed |
| Weakness | Arrives too late to change this period | Its link to the outcome is a prediction, which can fail |

A good KPI dashboard pairs the two: revenue (lagging) next to the pipeline that will become next quarter's revenue (leading). Kaplan and Norton's balanced scorecard is built on the same idea, balancing financial results with customer, internal-process, and innovation and learning measures (later renamed learning and growth) that drive future results.

## How to choose KPIs for a dashboard

Choose KPIs by starting from the decisions the dashboard's readers make, and keep only the measures that would trigger one of them.

1. Write down the goal and who reads the dashboard. A board, a sales manager and a shift supervisor need different screens.
2. List the decisions those readers make, such as "move sales effort to a weaker region" or "call in maintenance".
3. For each decision, find the measure that would trigger it. That measure is a KPI candidate.
4. Test each candidate. Is it specific and measurable from data you trust? Can the owner influence it? Does it have a time frame and a realistic target? These are the SMART criteria (specific, measurable, assignable, realistic, time-related) from Doran's 1981 paper on setting objectives; later versions often read "achievable" for "assignable".
5. Keep one or two leading indicators for each lagging one.
6. Cut the list to what fits on one screen. Move the rest to a detail page.
7. Write each KPI's definition and target down, and review them every quarter.

## Types of KPI dashboard

Dashboards are usually grouped by who uses them and how often, following Stephen Few's split into strategic, analytical and operational dashboards.

| Type | Who reads it | How often | What it shows | Typical charts |
| --- | --- | --- | --- | --- |
| Strategic (executive) | Leadership, board | Weekly to quarterly | A few company-level KPIs against annual targets | Big numbers with sparklines, bullet charts, a trend per KPI |
| Operational | Team leads, supervisors, support desks | Live to daily | Activity and status that need action today | Big numbers, gauges, current-value bars, alert lists |
| Analytical | Analysts, managers | Ad hoc | Causes and patterns behind the KPIs, with filters and drill-down | Line and bar charts, waterfalls, scatter plots, heatmaps |

Some guides add a tactical dashboard between strategic and operational, used by department managers to track monthly progress on a plan. Most real dashboards blend types: a sales dashboard is strategic in its top row and analytical underneath.

## Which chart to use for each KPI

Choose the chart by the question the reader asks of that number.

| Question | Chart | Why it works |
| --- | --- | --- |
| Where are we now, and which way is it heading? | Big number with a [sparkline](/learn/chart-types/cartesian/sparkline/) | The value is read at a glance; the sparkline shows the trend in the space of a line of text |
| How close are we to target? | [Bullet chart](/learn/chart-types/cartesian/bullet-chart/) | Value, target and good/poor bands in one compact bar, easy to stack and compare |
| Is one live value inside its limits? | [Gauge](/learn/chart-types/radial/gauge-chart/) | Familiar, with coloured zones; best kept for one or two values that are watched live |
| How has it changed over time, against plan? | [Line chart](/learn/chart-types/cartesian/line-chart/) or columns, with target and last-year lines | Shows trend, seasonality and the gap to plan month by month |
| How do regions, products or people compare? | [Bar chart](/learn/chart-types/cartesian/bar-chart/), sorted | Lengths on a common baseline are the easiest thing to compare |
| Why did the number change? | [Waterfall chart](/learn/chart-types/cartesian/waterfall-chart/) (variance bridge) | Splits the gap between plan and actual into the parts that caused it |
| Where do we lose people in a process? | [Funnel chart](/learn/chart-types/complex/funnel-chart/) | Shows how many reach each stage of a sales or sign-up process |
| Which days, hours or sites stand out? | Calendar [heatmap](/learn/chart-types/cartesian/heatmap/) | Colour shows patterns over many days or many sites at once |

### Bullet chart vs gauge

Both show a value against a target and bands. A gauge needs a large circle to show one number, its arc is harder to read precisely than a straight bar, and several gauges side by side are hard to compare. A bullet chart, designed by Stephen Few for dashboards, shows the same information in a thin bar, and five of them stack in the space of one gauge on a shared scale. Use bullet charts for a list of KPIs against targets. Keep gauges for the one or two values an operator watches live, where the dial shape is quicker to recognise.

## Comparisons and targets

A number on its own tells you little. "\$4.00M revenue" could be a record quarter or a bad one. Every KPI on the dashboard needs at least one comparison.

| Compare with | Answers | Watch out for |
| --- | --- | --- |
| Target or budget | Are we on plan? | Targets set too low or too high make every value look good or bad |
| The previous period | Are we improving? | Seasonality: December is usually busier than November for a retailer |
| The same period last year | Are we growing, allowing for the season? | Calendar effects such as extra trading days or a moved holiday |
| Forecast | Where will we land if things continue? | A forecast is an estimate; label it and show its range if you can |
| Peers or benchmarks | How do we compare with others? | Definitions often differ between teams and companies |

Show the comparison as a difference with a direction, such as "▲ +1.2% vs target", rather than as a colour alone.

### Worked example: percent vs percentage points

In the [interactive dashboard](#how-to-build-a-kpi-dashboard-in-javascript-react-or-angular), the fourth quarter for all regions shows:

| KPI | Actual | Target | Last year | vs target | vs last year |
| --- | --- | --- | --- | --- | --- |
| Revenue | \$4.00M | \$3.96M | \$3.67M | +1.2% | +9.1% |
| Gross margin | 46.1% | 47.4% | 45.8% | −1.3 points | +0.3 points |

Revenue is on target and well up on last year. Gross margin is 1.3 percentage points below target, which is a 2.7% shortfall in relative terms (1.3 ÷ 47.4). Write the change of a rate in points ("pts") so readers don't confuse the two. "Margin down 1.3%" would suggest a much smaller miss than the 2.7% it really is.

## KPI dashboard design

A good KPI dashboard puts the most important number top-left, shows every KPI against a target or earlier period, and keeps detail lower down the screen.

![A wireframe of a KPI dashboard in four zones: headline KPI tiles across the top, with the most important one top-left; a trend against target below; a breakdown and a variance chart side by side at the bottom; and a dashed scan path running across the top and then down the left. Beside it, one KPI tile enlarged, labelled with its name and period, value, comparison with a symbol, status in words, target line and 12-month sparkline](./kpi-dashboard-layout.svg)

- Most important top-left. Readers of left-to-right languages tend to start at the top-left; on pages they scan rather than read, the Nielsen Norman Group found an F-shaped pattern across the top and down the left side. Put the KPI that matters most there.
- Overview, then detail. Headline tiles first, the trend below, then breakdowns and variance. Each row should explain the row above it.
- Group related KPIs. Keep revenue next to the pipeline that feeds it, and output next to downtime. Use space and alignment to show the groups, not heavy borders.
- One period everywhere. Every number on the screen should cover the same period unless it says otherwise, and the period should be visible ("Q4", "last 30 days").
- Consistent scales and units. Use the same currency format, decimal places and axis ranges across similar charts, and start bar axes at zero.
- Colour with care. Use a calm palette for normal values and keep one strong colour for exceptions. About 1 in 12 men and 1 in 200 women have a colour vision deficiency, most often affecting red and green, so pair colour with a symbol (▲▼) or a word ("Off target"), as the WCAG "use of colour" rule asks. Blue and orange, as in the demo, stay distinct for most of them.
- Show freshness. Label when the data was last updated, so nobody acts on yesterday's numbers by mistake.

## KPI dashboard examples

Each team's dashboard has its own headline KPIs, and each KPI suits a particular kind of chart.

| Team | Headline KPIs | Charts that suit it |
| --- | --- | --- |
| Sales | Revenue or bookings vs quota, pipeline value and coverage, win rate, average deal size, sales cycle length | Bullet charts by rep or region, pipeline funnel, revenue trend vs target |
| Marketing | Qualified leads, cost per lead, conversion rate by stage, customer acquisition cost, return on ad spend | Funnel, trend lines by channel, bars by campaign |
| Operations | On-time delivery, order cycle time, backlog, utilisation | Big numbers with sparklines, control limits on a line chart, current-value bars |
| Finance | Revenue, gross and operating margin, cash runway, days sales outstanding, budget variance | Waterfall (variance bridge), trend vs budget, bullet charts by cost centre |
| Manufacturing | Overall equipment effectiveness (OEE = availability × performance × quality), scrap rate, downtime by cause, output vs plan | Bullets or gauges for OEE, a Pareto chart of downtime causes, a live [HMI screen](/learn/applications/hmi-scada/) for output |
| IT and service desk | Uptime, incident count, mean time to resolve, tickets breaching service levels, customer satisfaction | Big numbers, heatmaps by hour and service, trend lines |

### What goes on a sales dashboard?

A sales dashboard answers three questions: will we hit the number this period, where is the gap, and what will next period look like? The top row shows revenue (or bookings) against quota, with how much of the period has passed. Beneath it, a bullet chart compares each region or salesperson with their own target, a waterfall shows which ones explain the gap, and the pipeline by stage shows whether next quarter is covered. Activity measures such as calls and demos are leading indicators; keep them, but below the outcomes.

## How often should a KPI dashboard refresh?

As often as someone can act on the change, and no faster. Most strategic KPIs move monthly, so a daily refresh is plenty. Sales and operations dashboards are often refreshed hourly or every few minutes. Where people act within seconds (a production line, a network, a trading desk), the dashboard needs streaming data and charts built for it. Our [real-time dashboard guide](/learn/real-time/real-time-dashboard/) covers update rates, data paths and which charts work live.

## Common KPI dashboard mistakes

Most KPI dashboards fail by showing too much, or by showing numbers that can't be judged or acted on.

- **Too many KPIs.** When thirty numbers are all labelled key, readers can't tell which one to act on first, and the screen needs scrolling.
- **Vanity metrics.** Followers, page views and total sign-ups since launch only go up and rarely lead to a decision. Prefer rates and measures with a target.
- **No targets or comparisons.** A value without a target or an earlier period can't be judged, so readers guess.
- **Gauges everywhere.** A wall of dials wastes space and makes comparison hard.
- **Mixed periods.** Month-to-date revenue beside a year-to-date margin and a rolling 30-day churn invites wrong conclusions. Use one period, or label each clearly.
- **Colour as the only signal.** Red and green alone fail for many colour-blind readers, and on poor screens and greyscale prints.
- **Truncated or inconsistent axes.** A bar axis that starts at 95% makes a 2% miss look like a collapse.
- **Targets that become the goal.** When a measure becomes a target, people learn to move the number rather than the outcome (Goodhart's law). Pair each KPI with a check on quality, such as revenue with margin or tickets closed with satisfaction.

## How to build a KPI dashboard in JavaScript, React or Angular

The example below is a sales dashboard for a made-up company with four regions and three product lines. Every time you change a filter it recalculates four KPI tiles with sparklines, a revenue trend against target, a bullet chart by region and a variance waterfall from a year of simulated monthly data.

Use **Period** to show December, the fourth quarter or the whole year, and **Compare to** to judge every KPI against the target or last year. **Region** filters the tiles, trend and waterfall to one region; the waterfall then splits the gap by product line instead. **Highlight off-target KPIs** turns the orange flags (more than 2% below the comparison) on and off, so you can compare how clearly the problems stand out with and without them. Hover the charts for values, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={800} name="./Basic/demo" />

<LearnCta position="top" chart="KPI dashboard" demo="multiple-chart-dashboard-performance-demo" demoLabel="multi-chart dashboard" docs="/2d-charts/chart-types/fast-column-renderable-series/column-series-type/" docsLabel="SciChart.js column series documentation" />

Here is the code for this dashboard. The KPI calculations and the controls are plain JavaScript; SciChart.js draws the sparklines, the trend, the bullet chart and the waterfall. The React and Angular versions show the core of it: the monthly revenue trend against target, with off-target months coloured.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EFillPaletteMode,
        EStrokePaletteMode,
        FastColumnRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const xAxis = new NumericAxis(wasmContext, { autoTicks: false, majorDelta: 1, visibleRange: new NumberRange(-0.6, 11.6) });
        xAxis.labelProvider.formatLabel = (x) => MONTHS[Math.round(x)] ?? "";
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0, 0.1), labelPrefix: "$", labelPostfix: "k" })
        );

        // Monthly revenue, target and last year, in $ thousands, from your own data
        const { actual, target, lastYear } = getYourMonthlyRevenue();
        const x = MONTHS.map((_, i) => i);

        // Colour a month orange when it is more than 2% below target
        const offTarget = (index: number) => actual[index] < 0.98 * target[index];
        const paletteProvider = {
            fillPaletteMode: EFillPaletteMode.SOLID,
            strokePaletteMode: EStrokePaletteMode.SOLID,
            onAttached() {},
            onDetached() {},
            overrideFillArgb: (_x: number, _y: number, index: number) => (offTarget(index) ? parseColorToUIntArgb("#FF8A3DCC") : undefined),
            overrideStrokeArgb: (_x: number, _y: number, index: number) => (offTarget(index) ? parseColorToUIntArgb("#FF8A3D") : undefined)
        };
        sciChartSurface.renderableSeries.add(
            new FastColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: actual, dataSeriesName: "Revenue" }),
                fill: "#50C7E0CC",
                stroke: "#50C7E0",
                cornerRadius: 8,
                dataPointWidth: 0.6,
                paletteProvider
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: target, dataSeriesName: "Target" }),
                stroke: "#F6E05E",
                strokeThickness: 2,
                strokeDashArray: [6, 4]
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: lastYear, dataSeriesName: "Last year" }),
                stroke: "#A7B3C9",
                strokeThickness: 2
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new LegendModifier({ showCheckboxes: false }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const RevenueTrendChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EFillPaletteMode,
        EStrokePaletteMode,
        FastColumnRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    @Component({
        selector: "app-revenue-trend-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class RevenueTrendChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            const xAxis = new NumericAxis(wasmContext, { autoTicks: false, majorDelta: 1, visibleRange: new NumberRange(-0.6, 11.6) });
            xAxis.labelProvider.formatLabel = (x) => MONTHS[Math.round(x)] ?? "";
            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0, 0.1), labelPrefix: "$", labelPostfix: "k" })
            );

            // Monthly revenue, target and last year, in $ thousands, from your own data
            const { actual, target, lastYear } = getYourMonthlyRevenue();
            const x = MONTHS.map((_, i) => i);

            // Colour a month orange when it is more than 2% below target
            const offTarget = (index: number) => actual[index] < 0.98 * target[index];
            const paletteProvider = {
                fillPaletteMode: EFillPaletteMode.SOLID,
                strokePaletteMode: EStrokePaletteMode.SOLID,
                onAttached() {},
                onDetached() {},
                overrideFillArgb: (_x: number, _y: number, index: number) => (offTarget(index) ? parseColorToUIntArgb("#FF8A3DCC") : undefined),
                overrideStrokeArgb: (_x: number, _y: number, index: number) => (offTarget(index) ? parseColorToUIntArgb("#FF8A3D") : undefined)
            };
            sciChartSurface.renderableSeries.add(
                new FastColumnRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: actual, dataSeriesName: "Revenue" }),
                    fill: "#50C7E0CC",
                    stroke: "#50C7E0",
                    cornerRadius: 8,
                    dataPointWidth: 0.6,
                    paletteProvider
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: target, dataSeriesName: "Target" }),
                    stroke: "#F6E05E",
                    strokeThickness: 2,
                    strokeDashArray: [6, 4]
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: lastYear, dataSeriesName: "Last year" }),
                    stroke: "#A7B3C9",
                    strokeThickness: 2
                })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new LegendModifier({ showCheckboxes: false }),
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The four tiles are HTML text laid over one `SciChartSurface` with four `SciChartSubSurface`s, one per tile. Each sub-chart draws its tile's background and a sparkline with hidden axes.
- The trend is a `FastColumnRenderableSeries` with two `FastLineRenderableSeries` for target and last year. A palette provider colours each month's column from its index, so changing the comparison or the highlight only needs a redraw.
- The bullet chart and the waterfall are both `FastRectangleRenderableSeries` over an `XyxyDataSeries`, where each rectangle has explicit start and end values: the bands, bar and target marker for a bullet, and the floating steps for the waterfall.
- Every filter change recomputes the totals in plain JavaScript and replaces each series' data with `clear()` and `appendRange()`, so the charts are created once and only their data changes.

**See it in the demo app:** [JavaScript multi-chart dashboard](https://www.scichart.com/demo/javascript/multiple-chart-dashboard-performance-demo) · [React multi-chart dashboard](https://www.scichart.com/demo/react/multiple-chart-dashboard-performance-demo) · [Angular multi-chart dashboard](https://www.scichart.com/demo/angular/multiple-chart-dashboard-performance-demo). For gauges, see the [React linear gauges](https://www.scichart.com/demo/react/linear-gauges) and the [React polar gauge dashboard](https://www.scichart.com/demo/react/polar-gauge-fifo-dashboard); for target lines, the [React chart with a draggable threshold](https://www.scichart.com/demo/react/chart-drag-horizontal-threshold); for a full monitoring screen, the [React server traffic dashboard](https://www.scichart.com/demo/react/server-traffic-dashboard).

**Go deeper:** [SciChart.js column series documentation](/2d-charts/chart-types/fast-column-renderable-series/column-series-type/), the [line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/), [palette providers](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/) for colouring values by rule, and [sub-charts](/2d-charts/subcharts-api/subcharts-api-overview/), including [a large dashboard built with sub-charts](/2d-charts/subcharts-api/example-using-sub-charts-to-create-large-dashboard/).

## Frequently asked questions

### What should be on a KPI dashboard?

A KPI dashboard should show the few measures that tell you whether a goal is being met, each with its current value, the period it covers, a comparison with a target or an earlier period, and a short trend. Below those headline numbers, add a trend chart and a breakdown that explains what is driving them. Leave out anything nobody would act on.

### How many KPIs should a dashboard have?

As few as answer the dashboard's question, and no more than fit on one screen without scrolling. In practice that usually means a handful of headline KPIs, often four to eight, with supporting charts beneath them. If a dashboard needs twenty headline numbers, it is usually trying to serve several audiences and should be split.

### What is the difference between a KPI and a metric?

A metric is any number you measure, such as page views, calls made or units shipped. A KPI (key performance indicator) is one of the few metrics chosen because it shows progress towards a specific goal, has a target and an owner, and leads to action when it moves. Every KPI is a metric, but most metrics are not KPIs.

### What is the difference between a KPI dashboard and a KPI report?

A KPI dashboard is a screen that is kept up to date and read at a glance, usually interactive, so people can filter and drill down. A KPI report is a fixed snapshot for one period, often a document or slide pack, with more commentary explaining the numbers. Many teams use the dashboard day to day and a report for monthly or quarterly reviews.

### What is a sales dashboard?

A sales dashboard is a KPI dashboard for a sales team. It typically shows revenue or bookings against quota, the pipeline by stage, win rate, average deal size and sales cycle length, broken down by region, product or salesperson. Sales leaders use it to forecast the period and see where to coach or add effort.

### How do I make a KPI dashboard in JavaScript?

Compute each KPI and its comparison from your data in plain JavaScript, then lay out HTML tiles for the headline numbers and a grid of charts underneath. With SciChart.js, draw the tile sparklines as sub-charts of one surface, the trend as a column series with target lines, the bullet chart and waterfall with rectangle series, and use palette providers to colour off-target values. Re-run the calculation when a filter changes.

## Sources

- Kaplan, R. S. and Norton, D. P. (1992), [The Balanced Scorecard: Measures That Drive Performance](https://hbr.org/1992/01/the-balanced-scorecard-measures-that-drive-performance-2), *Harvard Business Review*, 70(1). The four perspectives and balancing results with the measures that drive them.
- Doran, G. T. (1981), "There's a S.M.A.R.T. way to write management's goals and objectives", *Management Review*, 70(11), pp. 35–36.
- Few, S. (2013), *Information Dashboard Design: Displaying Data for At-a-Glance Monitoring*, 2nd edition, Analytics Press. Strategic, analytical and operational dashboards. And Few, S. (2013), [Bullet Graph Design Specification](https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf), Perceptual Edge.
- Parmenter, D. (2019), *Key Performance Indicators: Developing, Implementing, and Using Winning KPIs*, 4th edition, Wiley. KPIs compared with other performance and result measures.
- Pernice, K. (2017), [F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant (Even on Mobile)](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/), Nielsen Norman Group.
- Colour Blind Awareness, [Colour blindness](https://www.colourblindawareness.org/colour-blindness/) (about 1 in 12 men and 1 in 200 women), and W3C, [Understanding WCAG 2.2 Success Criterion 1.4.1: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
- ISO 22400-2:2014, *Automation systems and integration: Key performance indicators (KPIs) for manufacturing operations management, Part 2: Definitions and descriptions*. Includes overall equipment effectiveness.
- Strathern, M. (1997), "Improving ratings: audit in the British University system", *European Review*, 5(3), pp. 305–321. The common wording of Goodhart's law.

<LearnCta position="bottom" chart="KPI dashboard" demo="multiple-chart-dashboard-performance-demo" demoLabel="multi-chart dashboard" docs="/2d-charts/chart-types/fast-column-renderable-series/column-series-type/" docsLabel="SciChart.js column series documentation" />
