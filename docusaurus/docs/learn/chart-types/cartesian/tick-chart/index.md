---
sidebar_position: 260
sidebar_label: Tick Chart
title: "Tick Chart: What Tick Bars Are & How They Compare With Time Charts"
description: "What a tick chart is, how trades become tick bars, why tick bars speed up when the market is busy, how to choose the number of ticks, and when to use a time, volume or range chart instead."
keywords:
    [
        "tick chart",
        "what is a tick chart",
        "tick chart trading",
        "tick bars",
        "tick charts vs time charts",
        "233 tick chart",
        "tick by tick chart",
        "how to read a tick chart",
        "tick bars vs volume bars",
        "best tick chart settings"
    ]
image: /img/learn/tick-chart-og.png
related: [candlestick-chart, renko-chart, footprint-chart, time-series-data-formats]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a tick chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A tick chart is a price chart in which each bar closes after a fixed number of trades, such as 233 or 1,000, rather than after a fixed amount of time. Each bar shows the open, high, low and close of its trades. When trading is busy, bars form quickly; when it is quiet, a single bar can take many minutes." }
                },
                {
                    "@type": "Question",
                    "name": "What does a 233 tick chart mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "On a 233 tick chart, every bar holds 233 trades. The first trade sets the bar's open, the 233rd its close, and the highest and lowest trade prices in between set its high and low. Then a new bar starts. 233 is a Fibonacci number, chosen by habit; it has no special mathematical property, and 200 or 250 would behave almost the same." }
                },
                {
                    "@type": "Question",
                    "name": "Are tick charts better than time charts?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Neither is better in general. Tick charts give more detail when the market is busy and fewer, less noisy bars when it is quiet, which suits short-term trading in liquid markets. Time charts keep a regular clock, line up with other instruments and with news times, and are easier to compare across days. Many traders use a tick chart for timing alongside a time chart for context." }
                },
                {
                    "@type": "Question",
                    "name": "How many ticks per bar should I use?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Divide the number of trades in a typical session by the number of bars you want to see. If an instrument trades about 80,000 times in a 390-minute session and you want bars that last about a minute on average, use roughly 200 ticks. Busy instruments need larger numbers than quiet ones, so a setting copied from another market rarely fits." }
                },
                {
                    "@type": "Question",
                    "name": "What is a tick-by-tick chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A tick-by-tick chart plots every individual trade or price update as its own point, usually joined by a line, with no grouping into bars. It shows the full detail of the market, including each bounce between neighbouring prices, but a busy instrument produces tens of thousands of points a day, so it needs a charting library that can draw large datasets quickly." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a tick chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Group your trades into bars of N trades each, recording the first, highest, lowest and last price of each group. With SciChart.js, put those values in an OhlcDataSeries, plot it with a FastCandlestickRenderableSeries on an axis of bar numbers, and label each bar with its start time. React and Angular projects use the same code through scichart-react and scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Tick Chart

## What is a tick chart?

A **tick chart** (also called a tick bar chart or trade-count chart) is a price chart in which each bar closes after a fixed number of trades, such as 233 or 1,000, instead of a fixed time. Bars form fast in busy markets and slowly in quiet ones, so the chart gives more detail where the trading is.

![Two candlestick charts of one simulated trading day in a dark navy theme. The top chart has one-minute candles at even spacing across the day; the bottom chart has 233-trade candles, with the hour after a 14:00 news release taking up a wide shaded band of candles and the quiet lunchtime hour a narrow band](/img/learn/tick-chart-og.png)

*The same simulated day of trades drawn as one-minute bars (top) and 233-tick bars (bottom). The busy hour after the news fills four times as many tick bars as the quiet lunchtime hour. [Try the interactive version](#how-to-create-a-tick-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A tick chart starts a new bar every N trades. A time chart starts one every N minutes.
- Each tick bar holds the same amount of trading, so bars bunch up when the market is busy and spread out when it is quiet.
- The horizontal axis counts bars, not time, so bars next to each other can be seconds or many minutes apart.
- Choose N from the instrument's trading rate: trades in a typical session divided by the bars you want to see.
- "Tick chart" can also mean a tick-by-tick chart, which plots every single trade with no bars at all.
:::

## What is a tick in trading?

The word tick has two meanings in trading, and they are easy to mix up.

- On a tick chart, a tick is one market event. For stocks and futures it is usually one reported trade. In currency markets, where there is no single exchange reporting trades, a tick is usually one change in the quoted price from your data provider.
- The **tick size** is the smallest step a price can move by, set by the exchange. A futures contract with a tick size of 0.25 can trade at 5000.00 or 5000.25, but not in between. "The price moved four ticks" means it moved four of these steps.

This page is about the first meaning. The two are unrelated. A 233 tick chart counts 233 trades, however far the price moves during them.

Data feeds also differ in what they count as one trade. One large order filled against several smaller ones may be reported as one trade or as several, so the same setting can draw slightly different bars on two feeds.

## How a tick chart works: from trades to bars

A trade stream is a list of trades in the order they happened, each with a time and a price (and usually a size). To build tick bars, walk down the list and close a bar every N trades:

- open: the price of the bar's first trade;
- high: the highest price among its trades;
- low: the lowest price among its trades;
- close: the price of its last trade.

A time bar uses the same four rules, but it closes when the clock reaches the end of its interval instead of when it has counted N trades. Each bar is drawn as a candlestick or an OHLC bar, exactly as on a time chart; see [how to read a candlestick chart](/learn/chart-types/cartesian/candlestick-chart/#how-to-read-a-candlestick-chart).

![Six minutes of trades drawn as dots on a timeline: steady at first, a dense burst in the fourth minute, then steady again. Above the timeline, six one-minute time bars of equal width hold between 4 and 17 trades each. Below it, five-trade tick bars hold the same number of trades but vary in width: each lasts 3 to 4 seconds during the burst and 27 to 81 seconds outside it. The last tick bar is still forming](./tick-vs-time-bars.svg)

### Worked example: 12 trades as 5-tick bars and 1-minute bars

Here are twelve trades, with a quiet start, a burst of five trades in eight seconds, and a quiet finish.

| Trade | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Time | 09:30:02 | 09:30:15 | 09:30:41 | 09:30:58 | 09:31:20 | 09:31:22 | 09:31:23 | 09:31:25 | 09:31:27 | 09:31:30 | 09:32:45 | 09:33:50 |
| Price | 100.00 | 100.25 | 100.50 | 100.25 | 100.50 | 100.75 | 101.00 | 100.75 | 101.25 | 101.00 | 101.00 | 100.75 |

As 5-tick bars:

| Bar | Trades | From | To | Open | High | Low | Close |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1–5 | 09:30:02 | 09:31:20 (78 s) | 100.00 | 100.50 | 100.00 | 100.50 |
| 2 | 6–10 | 09:31:22 | 09:31:30 (8 s) | 100.75 | 101.25 | 100.75 | 101.00 |
| 3 (forming) | 11–12 | 09:32:45 | not yet closed | 101.00 | 101.00 | 100.75 | 100.75 |

As 1-minute bars:

| Bar | Trades | Open | High | Low | Close |
| --- | --- | --- | --- | --- | --- |
| 09:30 | 1–4 | 100.00 | 100.50 | 100.00 | 100.25 |
| 09:31 | 5–10 | 100.50 | 101.25 | 100.50 | 101.00 |
| 09:32 | 11 | 101.00 | 101.00 | 101.00 | 101.00 |
| 09:33 | 12 | 100.75 | 100.75 | 100.75 | 100.75 |

The eight-second burst gets a bar of its own on the tick chart. On the time chart it is folded into the 09:31 bar with the trade before it. Later, two lone trades make two flat one-trade bars on the time chart, while the tick chart is still waiting to fill its third bar. The third tick bar is still forming: its close will change until trade 15 arrives.

## How to read a tick chart

Read a tick chart like a candlestick chart, except that each bar is a fixed number of trades, so bar width and spacing say nothing about time.

1. Check N. The chart's settings or title give the number of trades per bar, such as "233T" or "1000 tick". Without it, you can't compare bar sizes.
2. Read each bar as a candlestick or OHLC bar. Body, wicks and colour mean the same as on a time chart.
3. Read the spacing as activity. Bars are evenly spaced on screen but not in time. A stretch of many narrow bars is a busy period; a few bars covering a long time is a quiet one. Hover over bars, or read the time labels, to see when each one started.
4. Compare bar heights. Because each bar holds the same number of trades, bar heights are more even than on a time chart. A bar much taller than its neighbours means the price moved unusually far for that amount of trading.
5. Watch the last bar. It is still collecting trades, so its close and range will keep changing until it is full.

## Why tick bars adapt to market activity

Trading is uneven. It is usually heavy after the open and before the close, light over lunch, and it can surge after a news release. A one-minute chart gives every minute one bar. In the simulated day used on this page, the quietest lunchtime minute has 49 trades and the minute after the news has 1,557, yet each gets one bar.

A tick chart spends its bars where the trades are. Over the whole simulated day (78,740 trades from 09:30 to 16:00):

| Measure | Quiet hour (12:00–13:00) | Busy hour (14:00–15:00, after news) |
| --- | --- | --- |
| Trades | 4,977 | 21,576 |
| 1-minute bars | 60 | 60 |
| Median high-to-low range of a 1-minute bar | 2.50 | 4.25 |
| 233-tick bars | 21 | 92 |
| Median range of a 233-tick bar | 4.25 | 4.50 |

The time bars split both hours into 60 bars, so the busy hour's bars are taller and the quiet hour's bars are mostly noise. The tick bars give the busy hour more than four times as many bars, and their typical height barely changes between the two hours.

In 1973 Peter Clark suggested that prices move in step with trading activity rather than with the clock, which explains why returns measured over fixed time intervals have fatter tails than a normal distribution. Ané and Geman later found that stock returns measured over a fixed number of trades were close to normally distributed. More recently, Easley, López de Prado and O'Hara argued that high-frequency markets run on a "volume clock", and López de Prado recommends tick, volume or dollar bars over time bars when preparing market data for statistical models. The simulated data on this page is built the same way: every trade moves the price by at most one tick, so the price moves more in an hour with more trades.

## How to choose the number of ticks per bar

The right N depends on the instrument and on what you want to see. A simple starting point:

$$
N \approx \frac{\text{trades in a typical session}}{\text{bars you want per session}}
$$

The simulated session on this page has 78,740 trades over 390 minutes, about 200 a minute. For bars that last about a minute on average, N is about 200, and the 233-tick setting gives 338 bars with a median length of 67 seconds. In the busiest minutes after the news, a 233-tick bar closes in 8 seconds; at the quietest, one takes almost 4 minutes.

- Busy instruments need a larger N, quiet ones a smaller one. A setting that works on a heavily traded index future would draw only a few bars a day on a thinly traded stock.
- Popular settings such as 233, 377 and 610 are Fibonacci numbers; 133 is also popular. Their appeal is tradition. Any nearby round number gives almost the same chart.
- Traders often pair two settings, such as a small N for timing entries and a larger N, or a time chart, for the trend.
- Re-check N when activity changes: after a contract roll, in a holiday week, or when you switch from regular to overnight hours.

This page explains how tick charts are built and read. It is not investment advice.

## Tick charts vs time charts, volume charts and range charts

Every bar chart of prices closes a bar on some rule. The rule decides what the bars hold.

| Bar type | A bar closes when… | Bars per hour | Good for | Watch out for |
| --- | --- | --- | --- | --- |
| Time bars (1-minute, 1-hour, daily) | A fixed time has passed | Fixed | Comparing days and instruments; lining up with news times; reports | Quiet periods fill the chart with small, noisy bars; busy periods are squeezed into a few |
| Tick bars | N trades have happened | Rises and falls with trading | Short-term trading in liquid markets; even detail through the day | A large order split into many small trades fills bars faster than one big trade; settings don't carry over between instruments |
| Volume bars | N shares or contracts have traded | Rises and falls with volume | Same as tick bars, weighting each trade by its size | Needs trade sizes; one large block trade can fill a bar on its own |
| Dollar bars | A fixed amount of money has traded | Rises and falls with traded value | Long histories where the price level changed a lot | Needs both price and size; less common in charting tools |
| Range bars | The bar's high-to-low range reaches a fixed size | Rises and falls with volatility | Filtering out small moves; seeing trends clearly | Ignores how much trading it took; bars have no fixed time or trade count |
| Renko bricks | The price has moved a fixed distance past the last brick | Rises and falls with trends | Trend following; removing noise | Drops wicks and time entirely; reversals need two bricks |
| [Candlestick](/learn/chart-types/cartesian/candlestick-chart/) or [OHLC](/learn/chart-types/cartesian/ohlc-chart/) drawing | (A way of drawing any of the bars above, not a closing rule) | | Showing open, high, low and close | Check which bar type is behind the candles |
| Tick-by-tick line | Never: every trade is its own point | All of them | Seeing every trade; checking fills; market microstructure | Large datasets; noisy at long time spans |

### Tick charts vs time charts: which to use

Use a time chart when the time of day matters: comparing sessions, matching a move to a news release at 14:00, or showing a chart to someone who expects a clock. Use a tick chart when you care about what the trading did and want each bar to stand for the same amount of it. Volume bars are the better choice when trade sizes vary widely, so that one 500-contract trade counts for more than one 1-contract trade.

## Tick-by-tick charts: plotting every trade

The second meaning of "tick chart" is a chart of every individual trade, with no bars at all: time on the horizontal axis, price on the vertical, and one point per trade, usually joined by a line. It is also called a tick-by-tick chart or a raw tick chart.

It shows things bars hide: the price bouncing between neighbouring ticks, pauses in trading, and the exact order of trades inside a burst. It's also the raw material for every other chart on this page, since time, tick, volume and range bars are all built from it.

The simulated day on this page has 78,740 trades, and a heavily traded instrument can produce far more. An SVG chart adds one page element per point, so at this size tick-by-tick charts are usually drawn with a charting library that renders on the GPU through WebGL and WebGPU, with data sent in a compact format and, for long spans, a way to reduce the points to what the screen can show.

- [Big data visualization](/learn/big-data/big-data-visualization/) compares SVG, Canvas and WebGL charts for large datasets.
- [Time series data formats](/learn/big-data/time-series-data-formats/) covers sending trade times and prices as typed arrays instead of JSON.
- [Downsampling](/learn/big-data/downsampling/) explains min-max and other methods that keep every spike visible when a day of trades has to fit into a few hundred pixels.

## Common tick chart mistakes

Most tick chart mistakes come from treating bars as units of time, or from comparing charts built with different settings or data.

- **Reading the horizontal axis as time.** Ten bars can cover ten seconds or an hour. Check the time labels before saying how long a move took.
- **Copying N from another instrument.** A 1,000-tick chart can be several bars a minute on one market and a few bars an hour on another.
- **Ignoring the forming bar.** The last bar is incomplete, and indicators that use its close will change until it fills.
- **Treating indicator periods as time.** A 20-bar moving average on a tick chart covers 20 × N trades, which is a few minutes in a busy spell and much longer in a quiet one.
- **Building tick bars from data that has already been grouped.** Tick bars need the full trade stream. Data stored as one-second or one-minute bars can't be turned back into trades.
- **Mixing feeds.** Two data providers can split or combine the same fills differently, so the same N draws different bars. Use the same feed for history and live data.
- **Comparing sessions by bar count alone.** A holiday session at the same N has far fewer bars. That shows less trading, not necessarily smaller price moves, so compare bar heights, or use a time chart to compare one day with another.

## How to create a tick chart in JavaScript, React or Angular

Tick charts are built from raw trades, often tens of thousands a day per instrument, so the bars are computed from the trade stream first and then drawn as candles.

The demo simulates one trading day of 78,740 trades and builds both charts from them in the browser. Change **Ticks per bar** to rebuild the tick bars, and **Time bar size** to rebuild the time bars. Tick **Show raw ticks** to draw every trade as a line over the time bars, then zoom in on the news burst to see each trade. The table underneath counts the bars in the quiet and busy hours and gives their median size. Scroll to zoom, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="tick chart" demo="realtime-ticking-stock-charts" demoLabel="real-time ticking stock chart" docs="/2d-charts/chart-types/fast-candlestick-renderable-series/" docsLabel="SciChart.js candlestick series documentation" />

Here is the code for this chart. Turning trades into bars is plain JavaScript; SciChart.js draws the candles, the raw trades and the shaded hours.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Group trades into bars of ticksPerBar trades: open, high, low and close of each group
    const tickBars = (times: number[], prices: number[], ticksPerBar: number) => {
        const bars = { x: [] as number[], open: [] as number[], high: [] as number[], low: [] as number[], close: [] as number[] };
        prices.forEach((price, i) => {
            if (i % ticksPerBar === 0) {
                bars.x.push(times[i]);
                bars.open.push(price);
                bars.high.push(price);
                bars.low.push(price);
                bars.close.push(price);
            } else {
                const last = bars.x.length - 1;
                bars.high[last] = Math.max(bars.high[last], price);
                bars.low[last] = Math.min(bars.low[last], price);
                bars.close[last] = price;
            }
        });
        return bars;
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const { times, prices } = getYourTrades(); // trade times (Unix seconds) and prices, in order
        const bars = tickBars(times, prices, 233);

        // x is the bar number; each label shows when that bar started
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Bar start time" });
        const startOf = (index: number) => bars.x[Math.max(0, Math.min(bars.x.length - 1, Math.round(index)))];
        xAxis.labelProvider.formatLabel = (index) =>
            new Date(startOf(index) * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 2 }));

        sciChartSurface.renderableSeries.add(
            new FastCandlestickRenderableSeries(wasmContext, {
                dataSeries: new OhlcDataSeries(wasmContext, {
                    xValues: bars.x.map((_, i) => i),
                    openValues: bars.open,
                    highValues: bars.high,
                    lowValues: bars.low,
                    closeValues: bars.close
                }),
                brushUp: "#26a69a",
                strokeUp: "#26a69a",
                brushDown: "#ef5350",
                strokeDown: "#ef5350"
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const TickChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Group trades into bars of ticksPerBar trades: open, high, low and close of each group
    const tickBars = (times: number[], prices: number[], ticksPerBar: number) => {
        const bars = { x: [] as number[], open: [] as number[], high: [] as number[], low: [] as number[], close: [] as number[] };
        prices.forEach((price, i) => {
            if (i % ticksPerBar === 0) {
                bars.x.push(times[i]);
                bars.open.push(price);
                bars.high.push(price);
                bars.low.push(price);
                bars.close.push(price);
            } else {
                const last = bars.x.length - 1;
                bars.high[last] = Math.max(bars.high[last], price);
                bars.low[last] = Math.min(bars.low[last], price);
                bars.close[last] = price;
            }
        });
        return bars;
    };

    @Component({
        selector: "app-tick-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class TickChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            const { times, prices } = getYourTrades(); // trade times (Unix seconds) and prices, in order
            const bars = tickBars(times, prices, 233);

            // x is the bar number; each label shows when that bar started
            const xAxis = new NumericAxis(wasmContext, { axisTitle: "Bar start time" });
            const startOf = (index: number) => bars.x[Math.max(0, Math.min(bars.x.length - 1, Math.round(index)))];
            xAxis.labelProvider.formatLabel = (index) =>
                new Date(startOf(index) * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 2 }));

            sciChartSurface.renderableSeries.add(
                new FastCandlestickRenderableSeries(wasmContext, {
                    dataSeries: new OhlcDataSeries(wasmContext, {
                        xValues: bars.x.map((_, i) => i),
                        openValues: bars.open,
                        highValues: bars.high,
                        lowValues: bars.low,
                        closeValues: bars.close
                    }),
                    brushUp: "#26a69a",
                    strokeUp: "#26a69a",
                    brushDown: "#ef5350",
                    strokeDown: "#ef5350"
                })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
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

- Tick bars are grouped in plain JavaScript: every N trades, start a new bar and track its open, high, low and close. Time bars use the same loop with a new bar at each interval boundary.
- An [OhlcDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcdataseries.html) holds the bars and a [FastCandlestickRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html) draws them, with `brushUp` and `brushDown` for rising and falling bars.
- Tick bars have no fixed time step, so the x-axis is the bar number. `labelProvider.formatLabel` turns each bar number into that bar's start time, and `formatCursorLabel` does the same for the tooltip.
- The raw ticks are a `FastLineRenderableSeries` of every trade. An `XyDataSeries` created with `isSorted: true` lets SciChart.js draw only the trades in view as you zoom.

**See it in the demo app:** [JavaScript realtime ticking stock chart](https://www.scichart.com/demo/javascript/realtime-ticking-stock-charts) · [React realtime ticking stock chart](https://www.scichart.com/demo/react/realtime-ticking-stock-charts) · [Angular realtime ticking stock chart](https://www.scichart.com/demo/angular/realtime-ticking-stock-charts)

**Go deeper:** [SciChart.js candlestick series documentation](/2d-charts/chart-types/fast-candlestick-renderable-series/), and the [candlestick chart guide](/learn/chart-types/cartesian/candlestick-chart/) for reading the bars themselves.

## Building a full trading chart?

Candles in [SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, use time intervals, from one second to one month (see [changing the interval](/financial-charts/symbols-intervals-periods/changing-the-interval/)), and its [price chart types](/financial-charts/studies-and-indicators/price-chart-types/) add Renko and Point & Figure. For tick bars, build them from your trade stream as in the demo above. Around the price chart, SciTrader.js adds live exchange feeds, technical indicators, drawing tools and multiple panes. See what SciChart can do for trading apps on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What is a tick chart?

A tick chart is a price chart in which each bar closes after a fixed number of trades, such as 233 or 1,000, rather than after a fixed amount of time. Each bar shows the open, high, low and close of its trades. When trading is busy, bars form quickly; when it is quiet, a single bar can take many minutes.

### What does a 233 tick chart mean?

On a 233 tick chart, every bar holds 233 trades. The first trade sets the bar's open, the 233rd its close, and the highest and lowest trade prices in between set its high and low. Then a new bar starts. 233 is a Fibonacci number, chosen by habit; it has no special mathematical property, and 200 or 250 would behave almost the same.

### Are tick charts better than time charts?

Neither is better in general. Tick charts give more detail when the market is busy and fewer, less noisy bars when it is quiet, which suits short-term trading in liquid markets. Time charts keep a regular clock, line up with other instruments and with news times, and are easier to compare across days. Many traders use a tick chart for timing alongside a time chart for context.

### How many ticks per bar should I use?

Divide the number of trades in a typical session by the number of bars you want to see. If an instrument trades about 80,000 times in a 390-minute session and you want bars that last about a minute on average, use roughly 200 ticks. Busy instruments need larger numbers than quiet ones, so a setting copied from another market rarely fits.

### What is a tick-by-tick chart?

A tick-by-tick chart plots every individual trade or price update as its own point, usually joined by a line, with no grouping into bars. It shows the full detail of the market, including each bounce between neighbouring prices, but a busy instrument produces tens of thousands of points a day, so it needs a charting library that can draw large datasets quickly.

### How do I make a tick chart in JavaScript?

Group your trades into bars of N trades each, recording the first, highest, lowest and last price of each group. With SciChart.js, put those values in an `OhlcDataSeries`, plot it with a `FastCandlestickRenderableSeries` on an axis of bar numbers, and label each bar with its start time. React and Angular projects use the same code through `scichart-react` and `scichart-angular`.

## Sources

- Clark, P. K. (1973), [A subordinated stochastic process model with finite variance for speculative prices](https://doi.org/10.2307/1913889), *Econometrica*, 41(1), 135–155. Proposes that prices evolve with trading activity rather than calendar time, explaining fat-tailed returns over fixed time intervals.
- Ané, T. and Geman, H. (2000), [Order flow, transaction clock, and normality of asset returns](https://doi.org/10.1111/0022-1082.00286), *The Journal of Finance*, 55(5), 2259–2284. Finds that stock returns measured in number of trades are close to normally distributed.
- Easley, D., López de Prado, M. M. and O'Hara, M. (2012), [The volume clock: insights into the high-frequency paradigm](https://doi.org/10.3905/jpm.2012.39.1.019), *The Journal of Portfolio Management*, 39(1), 19–29. Argues that high-frequency markets are best sampled by trading activity, not time.
- López de Prado, M. (2018), [*Advances in Financial Machine Learning*](https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086), Wiley, chapter 2, "Financial data structures". Defines time, tick, volume and dollar bars and compares their statistical properties.
- Wikipedia, [Tick size](https://en.wikipedia.org/wiki/Tick_size). The other meaning of "tick": the smallest price increment an exchange allows.

<LearnCta position="bottom" chart="tick chart" demo="realtime-ticking-stock-charts" demoLabel="real-time ticking stock chart" docs="/2d-charts/chart-types/fast-candlestick-renderable-series/" docsLabel="SciChart.js candlestick series documentation" />
