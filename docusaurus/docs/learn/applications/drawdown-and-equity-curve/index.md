---
sidebar_position: 40
sidebar_label: Drawdown and Equity Curve
title: "Drawdown and Equity Curve: How to Read and Calculate Max Drawdown"
description: "What an equity curve and a drawdown are, how to calculate maximum drawdown and its duration, how to read an underwater chart, and what the Calmar ratio shows."
keywords:
    [
        "max drawdown",
        "maximum drawdown",
        "equity curve",
        "drawdown chart",
        "how to calculate drawdown",
        "underwater chart",
        "drawdown duration",
        "calmar ratio",
        "equity curve trading",
        "what is drawdown",
        "recovery from drawdown"
    ]
image: /img/learn/drawdown-and-equity-curve-og.png
related: [line-chart, area-chart, log-scale-graph, waterfall-chart]
datePublished: 2026-11-24
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is maximum drawdown?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Maximum drawdown (MDD) is the largest fall in an account's or investment's value from a peak to a later low, before a new peak is reached, usually given as a percentage of the peak. If an account rises to $120,000, drops to $90,000 and only then makes a new high, its maximum drawdown is 25%, or $30,000. It measures the worst loss an investor who bought at the top would have sat through." }
                },
                {
                    "@type": "Question",
                    "name": "How do you calculate drawdown?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Keep a running peak: the highest value so far. On each date, drawdown = value / running peak - 1, which is 0 at a new high and negative below it. The maximum drawdown is the most negative of those numbers. For the drawdown in currency, subtract instead: value - running peak." }
                },
                {
                    "@type": "Question",
                    "name": "What is an equity curve?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An equity curve is a line chart of an account's or strategy's value over time, or over its sequence of trades. Traders and fund managers use it to see growth, losing streaks and changes in behaviour at a glance. It is often drawn on a log scale, so equal percentage gains look the same size at any account value." }
                },
                {
                    "@type": "Question",
                    "name": "What is an underwater chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An underwater chart plots drawdown over time: how far, in percent, the account is below its previous high on each date. It sits at zero whenever the account makes a new high and drops below zero during losses, usually drawn as a shaded area. The deepest point is the maximum drawdown, and the width of each dip is how long that drawdown lasted." }
                },
                {
                    "@type": "Question",
                    "name": "What is the Calmar ratio?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Calmar ratio divides a strategy's annual return by its maximum drawdown. As defined by Terry Young in 1991 it uses the latest 36 months of monthly data; the MAR ratio uses the whole history instead. A strategy returning 12% a year with a 20% maximum drawdown has a Calmar ratio of 0.6. Higher means more return for each unit of the worst loss." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot an equity curve and drawdown chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Work out the running peak and the drawdown series in plain JavaScript in one pass over the values. In SciChart.js, draw the equity and the running peak as two FastLineRenderableSeries on a date axis, and the drawdown as a FastMountainRenderableSeries with zeroLineY set to 0 on a second chart below, linked with SciChartVerticalGroup so both share dates when zooming. scichart-react and scichart-angular wrap the same code for React and Angular apps." }
                }
            ]
        })}
    </script>
</head>

# Drawdown and Equity Curve

## What is a drawdown and an equity curve?

An **equity curve** is a line chart of an account's or strategy's value over time. A **drawdown** is a fall in that value from its highest point so far, the running peak, to a later low, measured in percent or currency. The **maximum drawdown** is the deepest of these falls: the worst loss suffered from a top.

![An equity curve and an underwater chart in a dark navy theme. The top chart shows five simulated years of a strategy, its account value rising from \$10,000 to about \$18,000, with a dashed running-peak line above it, a benchmark line, and the maximum drawdown period shaded from its peak to its recovery. The bottom chart shows drawdown as a red area below zero percent, with the deepest point at minus 24.1 percent marked](/img/learn/drawdown-and-equity-curve-og.png)

*A simulated strategy and benchmark over five years: the equity curves with the strategy's running peak (top) and the underwater chart of drawdowns (bottom), with the 24.1% maximum drawdown shaded from peak to recovery (sample data). [Try the interactive version](#how-to-create-a-drawdown-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- Drawdown is the value divided by its running peak, minus one. It is zero at a new high and negative below it.
- Maximum drawdown measures depth; drawdown duration measures how long the account stays below its old high.
- Losses and gains are not symmetrical: a 50% loss needs a 100% gain to get back.
- Plot long equity curves on a log scale, so equal percentage moves have equal height.
- The Calmar ratio divides annual return by maximum drawdown.
:::

## What is an equity curve?

An equity curve shows how much an account, fund or trading strategy is worth at each point in time, so its shape shows growth and losses together.

- The value can be in currency (\$10,000 growing to \$18,000), or as cumulative return from a starting value of 100 or 1. Starting every curve at the same value makes curves comparable.
- The horizontal axis is usually calendar time: daily, weekly or monthly values. A backtest report often plots it against trade number instead, one point per closed trade, which hides how long each trade took.
- Live accounts include deposits and withdrawals, which move the curve without any gain or loss. Use returns, or a unitised value like a fund's price per share, so cash moves don't look like performance.
- A benchmark, such as a stock index or a simple buy-and-hold position, is often drawn on the same chart for comparison.

### Linear or log scale for an equity curve?

A log scale is the better choice for an equity curve that spans several years or a large change in value. On a linear axis a move from \$10,000 to \$20,000 takes the same height as a move from \$100,000 to \$110,000, so early gains and losses look tiny and recent ones look huge. On a log axis, equal heights mean equal percentage changes: doubling from \$10,000 to \$20,000 is as tall as doubling from \$20,000 to \$40,000. Compounding growth at a steady rate becomes a straight line, and a drawdown of 20% looks the same size wherever it happens. The [log scale graph guide](/learn/axes-and-scales/log-scale-graph/) explains how log axes work and when to use them.

## What is drawdown?

Drawdown is how far an account is below its highest value so far, measured from that peak.

To find it, keep a **running peak**, the highest value reached up to each date. Then, on every date:

$$
\text{Drawdown}_t = \frac{V_t}{\text{Peak}_t} - 1 \qquad \text{Peak}_t = \max_{s \le t} V_s
$$

where $V_t$ is the value on date $t$. The result is 0 on a day the account makes a new high and negative below it, so −0.25 means 25% below the peak. In currency, the drawdown is $V_t - \text{Peak}_t$.

![An annotated equity curve over ten months, from \$100,000 in January to \$135,000 in October, with its running peak dashed. The first drawdown falls from a \$120,000 peak in February to a \$90,000 trough in March, a 25% or \$30,000 maximum drawdown, and recovers in May, three months after the peak. A second drawdown, 13.8% deep, lasts five months from May to October. An underwater chart below shows both drawdowns as a red area below zero, with the minus 25% maximum marked](./drawdown-anatomy.svg)

A drawdown has three points and three lengths:

| Term | Meaning |
| --- | --- |
| Peak | The high the drawdown is measured from |
| Trough | The lowest value before the account gets back to the peak |
| Recovery | The first date the value is back at or above the peak |
| Decline (peak to trough) | How long the fall took |
| Recovery time (trough to recovery) | How long it took to make the loss back |
| Duration (peak to recovery) | The whole time spent below the old high, also called time underwater |

Many reports say "drawdown" when they mean the maximum drawdown. A current drawdown is the one the account is in today; it may get deeper before it ends.

## How to calculate maximum drawdown

Maximum drawdown is the most negative drawdown over the whole period:

$$
\text{MDD} = \min_t \left( \frac{V_t}{\text{Peak}_t} - 1 \right)
$$

It is usually quoted as a positive percentage ("a 25% maximum drawdown"), though some software returns it as a negative number. The steps are:

1. Walk through the values in date order, updating the running peak.
2. On each date, divide the value by the running peak and subtract 1.
3. The smallest (most negative) result is the maximum drawdown. Note the peak it was measured from and the date of the trough.
4. Search forward from the trough for the first value at or above that peak: that is the recovery date. If there is none, the drawdown hasn't recovered yet.

### Worked example: ten months of account values

| Month | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Account value (\$) | 100,000 | 120,000 | 90,000 | 110,000 | 130,000 | 117,000 | 112,000 | 125,000 | 128,000 | 135,000 |
| Running peak (\$) | 100,000 | 120,000 | 120,000 | 120,000 | 130,000 | 130,000 | 130,000 | 130,000 | 130,000 | 135,000 |
| Drawdown (\$) | 0 | 0 | −30,000 | −10,000 | 0 | −13,000 | −18,000 | −5,000 | −2,000 | 0 |
| Drawdown (%) | 0 | 0 | −25.0 | −8.3 | 0 | −10.0 | −13.8 | −3.8 | −1.5 | 0 |

- The maximum drawdown is 25%, or \$30,000: from the February peak of \$120,000 to the March trough of \$90,000.
- That drawdown recovered in May, when the account reached \$130,000, above its old peak. Its duration was three months: one month falling and two recovering.
- The second drawdown was shallower, 13.8% at its July low, but it lasted five months, from the May peak to the October recovery. It is the longest drawdown in the series, though not the deepest.
- Over the ten months the account gained 35%.

Choose the data frequency with care. The March low of \$90,000 is a month-end value; daily data could show a deeper intramonth low. Maximum drawdown measured from monthly data is never deeper than the same series measured daily.

## Drawdown duration and recovery time

Drawdown duration is the time from a peak until the account first gets back to it, and it matters as much as depth.

A shallow drawdown can last for years, and a long spell without a new high tests an investor's patience and a fund's clients. Report the longest duration alongside the maximum drawdown, and say whether the current drawdown has recovered yet. A drawdown still open at the end of the data has an unknown duration: count it up to the last date and mark it as unrecovered.

Two other measures are common:

- Time to recovery (trough to recovery) shows how quickly the strategy makes losses back.
- Time underwater is the share of all dates spent below a previous high. The simulated strategy in the demo ends five years 80% up, yet closes below its previous high on 93% of trading days, because most of those days are small dips just under a recent high.

## Underwater chart: drawdown over time

An underwater chart plots the drawdown on every date as a negative area below a zero line, so you can see every loss at a glance and compare it with the others.

It is the bottom panel of the diagram above and of the live demo further down. The zero line is the "surface": the account is at a new high when the chart touches it, and "underwater" whenever it's below. To read one:

- The deepest point is the maximum drawdown. A horizontal line at that level makes it easy to see how close other drawdowns came.
- The width of each dip is that drawdown's duration. Wide, shallow dips are long flat spells; narrow, deep ones are sharp losses that recovered quickly.
- The number of dips shows how often the strategy gives back gains.
- Two strategies' underwater charts on the same axes show which had the deeper losses and whether they lost money at the same time.

An underwater chart is an [area chart](/learn/chart-types/cartesian/area-chart/) whose baseline is at the top. It shows drawdowns more clearly than the equity curve, especially after years of growth when a 20% fall is a small wiggle on a linear axis.

## Why losses need larger gains to recover

After a loss of $L$, the gain needed to get back to the peak is $L / (1 - L)$, which grows much faster than the loss.

A 50% loss halves the account, and doubling what is left (a 100% gain) is needed to recover. The table also shows how many years recovery takes at a steady 8% or 10% a year, calculated as $\ln(1 / (1 - L)) / \ln(1 + r)$:

| Loss from peak | Gain needed to recover | Years to recover at 8% a year | Years to recover at 10% a year |
| --- | --- | --- | --- |
| 10% | 11.1% | 1.4 | 1.1 |
| 20% | 25.0% | 2.9 | 2.3 |
| 25% | 33.3% | 3.7 | 3.0 |
| 30% | 42.9% | 4.6 | 3.7 |
| 40% | 66.7% | 6.6 | 5.4 |
| 50% | 100% | 9.0 | 7.3 |
| 60% | 150% | 11.9 | 9.6 |
| 75% | 300% | 18.0 | 14.5 |
| 90% | 900% | 29.9 | 24.2 |

Because of this asymmetry, risk limits are often set on drawdown, with position sizes cut once a loss reaches a set level. Turn on the crash in the demo to see it: with a 30% market fall added in year two, the strategy's maximum drawdown deepens from 24.1% to 44.1%, and it takes over four years (1,028 trading days) to get back to its old high.

## Drawdown ratios: Calmar, Sharpe and Sortino

Risk-adjusted ratios divide return by a measure of risk; the Calmar ratio uses maximum drawdown as that measure.

$$
\text{Calmar ratio} = \frac{\text{annual return}}{\left| \text{maximum drawdown} \right|}
$$

A strategy returning 12% a year with a 20% maximum drawdown has a Calmar ratio of 0.12 / 0.20 = 0.6. Terry Young, who introduced it in 1991, used the latest 36 months of monthly data; the MAR ratio is the same calculation over the whole history. The live demo on this page uses the whole five years and the compound annual growth rate (CAGR), so strictly its figure is the MAR form.

The Sharpe ratio divides the average return above a risk-free rate by the standard deviation of returns, so it treats rises and falls alike. The Sortino ratio replaces the standard deviation with downside deviation, which counts only returns below a target, so a strategy is not penalised for large gains. Neither looks at the order of returns. The same daily returns shuffled into a different order give the same Sharpe and Sortino ratios but a different maximum drawdown, so drawdown figures are usually reported alongside them.

| Measure | Return part | Risk part | What it misses |
| --- | --- | --- | --- |
| Calmar ratio | Annual return (36 months) | Maximum drawdown | All drawdowns except the worst one |
| MAR ratio | CAGR since inception | Maximum drawdown since inception | Same, and it falls as the history lengthens |
| Sharpe ratio | Mean return above the risk-free rate | Standard deviation of returns | The order of returns, and the difference between gains and losses |
| Sortino ratio | Mean return above a target | Downside deviation | The order of returns |

Maximum drawdown tends to get deeper the longer a strategy runs, because a longer history has more chances for a bad stretch (Magdon-Ismail and colleagues give the expected maximum drawdown of a random walk as a function of time). Compare drawdowns and Calmar ratios only over periods of the same length.

## How to read an equity curve

Read an equity curve for its slope, its smoothness and its changes in behaviour, not just where it ends.

1. Check the scale. On a linear axis, recent moves look bigger than early ones. Switch to a log scale before judging long-run growth.
2. Read the slope as the growth rate. On a log axis, a steady slope is steady compound growth; a flattening slope is a fading return.
3. Look at the dips below the running peak. Their depth is drawdown, their width is duration. The underwater chart shows the same thing more clearly.
4. Look for regime changes: a point after which the curve's slope or roughness changes. In the demo, the strategy's edge fades in year four (no drift and 40% more volatility), and the curve goes flat and jagged. A real regime change might be a change in the market, in costs, or in the strategy's capacity.
5. Compare with the benchmark over the same dates. A strategy that rises with the market and falls with it may simply be holding the market.
6. Count the data behind it. A smooth curve from twenty trades says much less than one from two thousand.

This page explains how equity curves and drawdown charts are read and built. It is not investment advice.

### Why a backtest that looks too good is a warning

A backtest equity curve that rises in a near-straight line with tiny drawdowns is often a sign of a flawed test.

- Overfitting (backtest overfitting): trying many parameter settings or rules and keeping the best makes the winner fit past noise, so it does worse on new data. Bailey, Borwein, López de Prado and Zhu show that with enough trials a high in-sample Sharpe ratio is easy to find by chance.
- Look-ahead bias: the test uses information that was not available at the time, such as a day's closing price to trade at that day's open, or figures that were revised after publication.
- Survivorship bias: the test universe includes only assets that still exist, leaving out companies or funds that failed, which inflates past returns.
- Missing costs: commissions, spreads, slippage and financing are left out or underestimated, which matters most for strategies that trade often.

Test on data the rules never saw, record how many variations were tried, and expect live drawdowns to be deeper than the backtest's.

## Comparing two strategies

Compare equity curves over the same dates, from the same starting value, on a log scale, and look at drawdown as well as return.

With the demo's default settings, over the same five simulated years:

| Measure | Strategy | Benchmark |
| --- | --- | --- |
| Total return | 80.2% | 46.8% |
| CAGR | 12.5% | 8.0% |
| Maximum drawdown | 24.1% | 19.0% |
| Longest drawdown (trading days) | 467 | 309 |
| Calmar ratio (whole period) | 0.52 | 0.42 |

The strategy grew faster but fell further and stayed below its old high for longer. Its Calmar ratio is a little higher, so it earned more return for each point of worst-case loss. Whether it is the better choice depends on whether its holders could sit through 467 trading days without a new high. With the crash turned on, both curves change a lot: the benchmark's return drops to 2.8% and the strategy's maximum drawdown to 44.1%, which shows how much these figures depend on one event.

Also check whether the two strategies' drawdowns happen at the same time. Two strategies whose losses don't overlap combine into a smoother curve than either alone.

## Common drawdown and equity curve mistakes

Most mistakes with drawdown come from measuring it on the wrong data or over the wrong period.

- **Measuring from the starting value.** Drawdown is measured from the running peak, not from the initial deposit. An account that rose to \$150,000 and fell to \$110,000 is in a 26.7% drawdown even though it is still above its \$100,000 start.
- **Using month-end data for a daily strategy.** Lows between month-ends are missed, so drawdowns look shallower than they were.
- **Counting deposits and withdrawals as returns.** Cash flows move the account balance; drawdown should be computed from returns or a unitised value.
- **Quoting only the maximum drawdown.** One number hides how often the account loses and for how long. Report the duration and show the underwater chart.
- **Comparing drawdowns over different lengths of history.** A ten-year record will usually show a deeper maximum drawdown than a two-year record of the same strategy.
- **Judging a long equity curve on a linear axis.** Early losses look small and recent ones large. Use a log scale.
- **Treating a backtest's maximum drawdown as the worst case.** It is the worst that happened in one sample of history; live trading can and often does go deeper.

## How to create a drawdown chart in JavaScript, React or Angular

The demo below simulates 1,261 trading days of a strategy and a benchmark and recomputes both equity curves, the running peak, both underwater series and the readout from scratch each time you change a setting.

Move **Strategy volatility** and **Drift** to change the strategy's daily returns; the random draws stay the same, so only the setting you change moves the curve. Tick **Add a crash** to put a 30% fall into year two for both curves, **Log scale** to switch the value axis, and **Compare to benchmark** to show or hide the benchmark. The maximum drawdown is shaded from its peak to its recovery, with the three points marked. Scroll to zoom, drag to pan, double-click to reset, and hover for values; the two charts stay on the same dates.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="drawdown chart" demo="mountain-chart" demoLabel="mountain chart" docs="/2d-charts/chart-types/fast-mountain-area-renderable-series/" docsLabel="SciChart.js mountain (area) series documentation" />

Here is the code for this demo. The drawdown maths is plain JavaScript; SciChart.js draws the equity lines, the underwater area and the annotations. The React and Angular versions below draw an equity curve and its underwater chart from your own values.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact, SciChartGroup } from "scichart-react";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        DateTimeNumericAxis,
        NumericAxis,
        FastLineRenderableSeries,
        FastMountainRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // Running peak and drawdown (0 at a new high, -0.25 = 25% below it), in one pass
    const drawdowns = (values: number[]) => {
        let peak = values[0];
        const runningPeak = values.map((v) => (peak = Math.max(peak, v)));
        return { runningPeak, drawdown: values.map((v, i) => v / runningPeak[i] - 1) };
    };

    const group = new SciChartVerticalGroup(); // lines up the two charts' y-axes
    const { dates, values } = getYourEquityData(); // dates as Unix seconds, account values

    const makeChart = (draw: (wasmContext: any, surface: SciChartSurface) => void) => async (root: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(root, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
        draw(wasmContext, sciChartSurface);
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, modifierGroup: "drawdown" }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier()
        );
        group.addSurfaceToGroup(sciChartSurface);
        return { sciChartSurface };
    };

    const { runningPeak, drawdown } = drawdowns(values);

    const equityChart = makeChart((wasmContext, surface) => {
        surface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Account value", labelPrefix: "$" }));
        surface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: dates, yValues: runningPeak, dataSeriesName: "Running peak" }),
                stroke: "#F6E05E",
                strokeDashArray: [6, 4]
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: dates, yValues: values, dataSeriesName: "Equity" }),
                stroke: "#50C7E0",
                strokeThickness: 2
            })
        );
    });

    const underwaterChart = makeChart((wasmContext, surface) => {
        surface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Drawdown", labelPostfix: "%" }));
        surface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: dates, yValues: drawdown.map((d) => d * 100) }),
                zeroLineY: 0, // fill up to 0%, so the area hangs below zero
                fill: "#EF535066",
                stroke: "#EF5350"
            })
        );
    });

    export const DrawdownChart = () => (
        <SciChartGroup>
            <SciChartReact initChart={equityChart} style={{ width: "100%", height: 320 }} />
            <SciChartReact initChart={underwaterChart} style={{ width: "100%", height: 200 }} />
        </SciChartGroup>
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        DateTimeNumericAxis,
        NumericAxis,
        FastLineRenderableSeries,
        FastMountainRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // Running peak and drawdown (0 at a new high, -0.25 = 25% below it), in one pass
    const drawdowns = (values: number[]) => {
        let peak = values[0];
        const runningPeak = values.map((v) => (peak = Math.max(peak, v)));
        return { runningPeak, drawdown: values.map((v, i) => v / runningPeak[i] - 1) };
    };

    @Component({
        selector: "app-drawdown-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <scichart-angular [initChart]="equityChart" style="display: block; width: 100%; height: 320px"></scichart-angular>
            <scichart-angular [initChart]="underwaterChart" style="display: block; width: 100%; height: 200px"></scichart-angular>
        `
    })
    export class DrawdownChartComponent {
        private group = new SciChartVerticalGroup(); // lines up the two charts' y-axes
        private data = getYourEquityData(); // dates as Unix seconds, account values
        private dd = drawdowns(this.data.values);

        private makeChart = (draw: (wasmContext: any, surface: SciChartSurface) => void) => async (root: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(root, { theme: new SciChartJsNavyTheme() });
            sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
            draw(wasmContext, sciChartSurface);
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true, modifierGroup: "drawdown" }),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier()
            );
            this.group.addSurfaceToGroup(sciChartSurface);
            return { sciChartSurface };
        };

        equityChart = this.makeChart((wasmContext, surface) => {
            surface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Account value", labelPrefix: "$" }));
            surface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: this.data.dates, yValues: this.dd.runningPeak, dataSeriesName: "Running peak" }),
                    stroke: "#F6E05E",
                    strokeDashArray: [6, 4]
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: this.data.dates, yValues: this.data.values, dataSeriesName: "Equity" }),
                    stroke: "#50C7E0",
                    strokeThickness: 2
                })
            );
        });

        underwaterChart = this.makeChart((wasmContext, surface) => {
            surface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Drawdown", labelPostfix: "%" }));
            surface.renderableSeries.add(
                new FastMountainRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: this.data.dates, yValues: this.dd.drawdown.map((d) => d * 100) }),
                    zeroLineY: 0, // fill up to 0%, so the area hangs below zero
                    fill: "#EF535066",
                    stroke: "#EF5350"
                })
            );
        });
    }
    ```
</CodeSnippetBlock>

Key points:

- The running peak, drawdown, maximum drawdown, recovery date and longest duration all come from one pass over the values in plain JavaScript (`drawdownStats` in the demo).
- The underwater chart is a [FastMountainRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html) with `zeroLineY: 0`, so the area fills from the drawdown line up to 0%. The running peak is a [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) with `strokeDashArray`.
- The log toggle swaps the value axis for a `LogarithmicAxis`; the series keep their data. `labelPrefix` and `labelPostfix` add the \$ and % to the labels.
- `SciChartVerticalGroup` lines up the two charts' y-axes, and each x-axis's `visibleRangeChanged` event sets the other's range, so zooming one chart zooms both. A `BoxAnnotation`, `TextAnnotation` and `HorizontalLineAnnotation` mark the maximum drawdown.

**See it in the demo app:** [JavaScript mountain chart](https://www.scichart.com/demo/javascript/mountain-chart) · [React mountain chart](https://www.scichart.com/demo/react/mountain-chart) · [Angular mountain chart](https://www.scichart.com/demo/angular/mountain-chart). Related techniques: the [React line chart](https://www.scichart.com/demo/react/line-chart), [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart) and [React chart annotations](https://www.scichart.com/demo/react/chart-annotations).

**Go deeper:** [SciChart.js mountain (area) series documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/), the [logarithmic axis](/2d-charts/axis-api/axis-types/logarithmic-axis/), [synchronising vertical charts](/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/), and the learning center guides to the [line chart](/learn/chart-types/cartesian/line-chart/), the [area chart](/learn/chart-types/cartesian/area-chart/) and the [log scale graph](/learn/axes-and-scales/log-scale-graph/). For the industry, see SciChart for [financial and trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/).

## Building a full trading app?

Equity curves and drawdown charts usually sit next to price charts in a trading or portfolio app. [SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, provides the price side: candlestick and other [price chart types](/financial-charts/studies-and-indicators/price-chart-types/), technical indicators, drawing tools, multiple panes and live data feeds. The performance charts on this page are built with the core SciChart.js API shown above. See what SciChart can do for trading apps on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page. For price-chart basics, read the guides to the [candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) and the [waterfall chart](/learn/chart-types/cartesian/waterfall-chart/), which breaks a change in value into its gains and losses.

## Frequently asked questions

### What is maximum drawdown?

Maximum drawdown (MDD) is the largest fall in an account's or investment's value from a peak to a later low, before a new peak is reached, usually given as a percentage of the peak. If an account rises to \$120,000, drops to \$90,000 and only then makes a new high, its maximum drawdown is 25%, or \$30,000. It measures the worst loss an investor who bought at the top would have sat through.

### How do you calculate drawdown?

Keep a running peak: the highest value so far. On each date, drawdown = value / running peak - 1, which is 0 at a new high and negative below it. The maximum drawdown is the most negative of those numbers. For the drawdown in currency, subtract instead: value - running peak.

### What is an equity curve?

An equity curve is a line chart of an account's or strategy's value over time, or over its sequence of trades. Traders and fund managers use it to see growth, losing streaks and changes in behaviour at a glance. It is often drawn on a log scale, so equal percentage gains look the same size at any account value.

### What is an underwater chart?

An underwater chart plots drawdown over time: how far, in percent, the account is below its previous high on each date. It sits at zero whenever the account makes a new high and drops below zero during losses, usually drawn as a shaded area. The deepest point is the maximum drawdown, and the width of each dip is how long that drawdown lasted.

### What is the Calmar ratio?

The Calmar ratio divides a strategy's annual return by its maximum drawdown. As defined by Terry Young in 1991 it uses the latest 36 months of monthly data; the MAR ratio uses the whole history instead. A strategy returning 12% a year with a 20% maximum drawdown has a Calmar ratio of 0.6. Higher means more return for each unit of the worst loss.

### How do I plot an equity curve and drawdown chart in JavaScript?

Work out the running peak and the drawdown series in plain JavaScript in one pass over the values. In SciChart.js, draw the equity and the running peak as two `FastLineRenderableSeries` on a date axis, and the drawdown as a `FastMountainRenderableSeries` with `zeroLineY` set to 0 on a second chart below, linked with `SciChartVerticalGroup` so both share dates when zooming. `scichart-react` and `scichart-angular` wrap the same code for React and Angular apps.

## Sources

- Magdon-Ismail, M., Atiya, A. F., Pratap, A. and Abu-Mostafa, Y. S. (2004), [On the maximum drawdown of a Brownian motion](https://doi.org/10.1239/jap/1077134674), *Journal of Applied Probability*, 41(1), 147–161. Derives the expected maximum drawdown of a random walk and how it grows with time.
- Wikipedia, [Calmar ratio](https://en.wikipedia.org/wiki/Calmar_ratio). Terry W. Young's 1991 definition over 36 months, and the related MAR and Sterling ratios.
- Sharpe, W. F. (1994), [The Sharpe ratio](https://doi.org/10.3905/jpm.1994.409501), *The Journal of Portfolio Management*, 21(1), 49–58.
- Sortino, F. A. and Price, L. N. (1994), [Performance measurement in a downside risk framework](https://doi.org/10.3905/joi.3.3.59), *The Journal of Investing*, 3(3), 59–64.
- Bailey, D. H., Borwein, J. M., López de Prado, M. and Zhu, Q. J. (2014), [Pseudo-mathematics and financial charlatanism: the effects of backtest overfitting on out-of-sample performance](https://doi.org/10.1090/noti1105), *Notices of the American Mathematical Society*, 61(5), 458–471.
- Brown, S. J., Goetzmann, W., Ibbotson, R. G. and Ross, S. A. (1992), [Survivorship bias in performance studies](https://doi.org/10.1093/rfs/5.4.553), *The Review of Financial Studies*, 5(4), 553–580.

<LearnCta position="bottom" chart="drawdown chart" demo="mountain-chart" demoLabel="mountain chart" docs="/2d-charts/chart-types/fast-mountain-area-renderable-series/" docsLabel="SciChart.js mountain (area) series documentation" />
