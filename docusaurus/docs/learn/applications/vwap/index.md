---
sidebar_position: 340
sidebar_label: VWAP
title: "VWAP Indicator: Formula, Calculation and How to Read It"
description: "What VWAP is, the formula with a worked example, session vs anchored VWAP, standard deviation bands, VWAP as an execution benchmark and VWAP vs moving averages."
keywords:
    [
        "vwap",
        "vwap indicator",
        "volume weighted average price",
        "what is vwap",
        "vwap formula",
        "how to calculate vwap",
        "how to read vwap",
        "anchored vwap",
        "session vwap",
        "vwap bands",
        "vwap standard deviation bands",
        "vwap vs moving average",
        "vwap benchmark",
        "typical price"
    ]
image: /img/learn/vwap-og.png
related: [volume-profile, market-depth, candlestick-chart, stochastic-oscillator]
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
                    "name": "What is VWAP?",
                    "acceptedAnswer": { "@type": "Answer", "text": "VWAP (volume weighted average price) is the average price a security has traded at since a starting point, usually the session open, with each price weighted by the volume traded at it. It answers the question: what has the average share cost today? Traders draw it as a line over an intraday price chart, and institutions use it to judge how well a large order was executed." }
                },
                {
                    "@type": "Question",
                    "name": "How is VWAP calculated?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For each bar, take the typical price, (high + low + close) / 3, and multiply it by the bar's volume. Add these products up from the first bar of the session, and divide by the total volume over the same bars. Repeat on every new bar, so VWAP is a running total, not a fixed-length average. Calculated from individual trades instead of bars, it is the sum of each trade's price times its size, divided by the total size." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between VWAP and anchored VWAP?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The formula is the same; only the starting bar differs. Standard (session) VWAP restarts at each session open. Anchored VWAP starts at a bar the trader chooses, such as an earnings release, a gap or a swing high or low, and runs on across sessions from there, so it shows the average price paid by everyone who traded since that event." }
                },
                {
                    "@type": "Question",
                    "name": "What are VWAP bands?",
                    "acceptedAnswer": { "@type": "Answer", "text": "VWAP bands are lines drawn a set number of standard deviations above and below VWAP, most often 1 and 2, sometimes 3. The standard deviation is usually the volume-weighted spread of typical prices around VWAP since the same anchor. They show how far price has moved from the average in units of that day's own spread. Some charts use fixed percentage bands instead." }
                },
                {
                    "@type": "Question",
                    "name": "Is VWAP better than a moving average?",
                    "acceptedAnswer": { "@type": "Answer", "text": "VWAP weights prices by volume and runs from a fixed anchor, so it describes the average price paid within one session and suits intraday charts and execution benchmarks. A simple or exponential moving average weights a fixed number of recent bars without volume, so it works on any timeframe and keeps reacting at the same speed, while session VWAP slows down as the day goes on." }
                },
                {
                    "@type": "Question",
                    "name": "How do I add a VWAP line to a chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Loop over your bars once, keeping running sums of typical price times volume, typical price squared times volume, and volume. VWAP is the first sum divided by the volume sum, and the band width comes from the second. Reset the sums at each session open or at your anchor. With SciChart.js, draw the candles with FastCandlestickRenderableSeries, the VWAP with a FastLineRenderableSeries, and each band with a FastBandRenderableSeries over an XyyDataSeries; the same code runs in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# VWAP (Volume Weighted Average Price)

## What is VWAP?

**VWAP** (volume weighted average price) is the average price a security has traded at since a starting point, usually the session open, with each price weighted by the volume traded at it. On an intraday chart it is a single line over the candles that shows what the average share has cost so far today.

![A dark navy intraday chart of three simulated trading days of five-minute candles with a yellow VWAP line that restarts each morning, shaded blue standard deviation bands around it, a purple equal-weight average for comparison, and green and red volume columns underneath that are tallest at each open and close](/img/learn/vwap-og.png)

*Three simulated trading days of five-minute candles with session VWAP, ±1σ and ±2σ bands and volume. [Try the interactive version](#how-to-create-a-vwap-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- VWAP is the running total of price × volume divided by the running total of volume, counted from an anchor bar.
- Session VWAP restarts at each open; anchored VWAP starts at a bar you choose and carries on across days.
- Bands at 1 and 2 standard deviations show how far price is from the average in units of the session's own spread.
- It began as a benchmark for judging trade execution, and is also read as an intraday fair-value line.
- It needs real volume and an anchor, and it moves less and less as a session goes on.
:::

This page explains how VWAP is calculated, read and drawn. It is not investment advice.

## How to calculate VWAP

VWAP is the sum of price times volume divided by the sum of volume, over every bar (or trade) from the anchor up to now.

On a bar chart, each bar's price is usually its **typical price**, the average of its high, low and close:

$$
P_i = \frac{H_i + L_i + C_i}{3}
\qquad
\text{VWAP}_t = \frac{\sum_{i=a}^{t} P_i \, V_i}{\sum_{i=a}^{t} V_i}
$$

where $V_i$ is the bar's volume and $a$ is the anchor bar. The sums keep growing, so VWAP has no length setting and no warm-up: it has a value from the first bar.

Exchanges and trading desks calculate it from individual trades instead, as the sum of each trade's price times its size divided by the total size. That is the exact figure. The typical-price version is an approximation for when you only have bars, and it gets closer to the trade-based figure as bars get shorter.

### Worked example: the first 30 minutes

Here are six five-minute bars from a session open, with the running sums. Prices are in dollars and volumes in shares.

| Bar | High | Low | Close | Volume | Typical price | P × V | Cumulative P × V | Cumulative volume | VWAP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 09:30 | 100.80 | 99.90 | 100.50 | 4,200 | 100.40 | 421,680 | 421,680 | 4,200 | 100.40 |
| 09:35 | 100.90 | 100.30 | 100.60 | 2,600 | 100.60 | 261,560 | 683,240 | 6,800 | 100.48 |
| 09:40 | 101.20 | 100.60 | 101.20 | 2,100 | 101.00 | 212,100 | 895,340 | 8,900 | 100.60 |
| 09:45 | 101.30 | 100.80 | 100.90 | 1,500 | 101.00 | 151,500 | 1,046,840 | 10,400 | 100.66 |
| 09:50 | 101.00 | 100.40 | 100.70 | 1,800 | 100.70 | 181,260 | 1,228,100 | 12,200 | 100.66 |
| 09:55 | 100.70 | 100.00 | 100.20 | 2,400 | 100.30 | 240,720 | 1,468,820 | 14,600 | 100.60 |

- At 09:55, VWAP = 1,468,820 ÷ 14,600 = 100.604, or 100.60.
- The plain average of the six typical prices is 604.00 ÷ 6 = 100.67. VWAP is lower because the heaviest bar, the 4,200-share opening bar, traded at the lowest typical price apart from the last bar.
- The last close, 100.20, is 0.40 below VWAP, or −0.40%.
- The first bar's VWAP is its own typical price, because there is nothing else to average yet.

## Session VWAP vs anchored VWAP

Session VWAP and anchored VWAP use the same formula and differ only in where the sums start.

| | Session VWAP | Anchored VWAP |
| --- | --- | --- |
| Starts at | The first bar of each session | A bar you choose |
| Resets | Every session | Never; it runs on until you move the anchor |
| Typical anchors | The regular-hours open | An earnings release, a gap, a swing high or low, the start of a week or year |
| Answers | What has the average share cost today? | What has the average share cost since that event? |

Session VWAP is the default on most intraday charts. Conventions differ on what a session is: some charts start at the regular open (09:30 New York time for US shares), some include pre-market trading, and markets that trade nearly 24 hours, such as many futures, or around the clock, such as cryptocurrencies, need a chosen reset time, such as the exchange's daily settlement or midnight UTC. Two charts of the same instrument can therefore show different VWAPs.

Anchored VWAP is the same running average started somewhere meaningful. Anchored at a sharp low, it shows the average price paid by everyone who has bought or sold since that low. Some charting software anchors at the first bar it has loaded, which makes the line depend on how much history is on screen.

## VWAP standard deviation bands

VWAP bands are lines a set number of standard deviations (σ) above and below VWAP, so they widen when prices since the anchor have been spread out and narrow when they have been tight.

The usual σ is the volume-weighted standard deviation of typical price around VWAP, over the same bars:

$$
\sigma_t = \sqrt{\frac{\sum_{i=a}^{t} V_i \,(P_i - \text{VWAP}_t)^2}{\sum_{i=a}^{t} V_i}}
= \sqrt{\frac{\sum_{i=a}^{t} P_i^2 V_i}{\sum_{i=a}^{t} V_i} - \text{VWAP}_t^2}
$$

The second form needs only one more running sum, so the bands update as cheaply as VWAP itself. Bands are commonly drawn at ±1σ and ±2σ, sometimes ±3σ.

In the worked example, σ at 09:55 is 0.259. The ±1σ band runs from 100.35 to 100.86 and the ±2σ band from 100.09 to 101.12, so the close of 100.20 sits between the lower two lines, 1.6σ below VWAP.

Conventions vary. Some charts use the close instead of the typical price, some take σ without volume weights, and some draw bands a fixed percentage away from VWAP. The numbers on two charts will differ unless they use the same method.

Standard deviation bands assume nothing about where price will go. A close beyond 2σ is unusual for that session's spread so far; it doesn't mean the price must come back.

## How to read VWAP

Read VWAP as the session's average price paid: where price sits against it, which way the line slopes and how far price has stretched from it.

![Diagram of a simulated trading day of 39 ten-minute candles with a VWAP line starting at the first bar, shaded one and two standard deviation bands that widen through the morning, labels for the anchor, a morning stretch above VWAP, a midday pullback to VWAP, a close beyond the upper two-sigma band and the flat afternoon VWAP, and volume columns underneath that are tallest at the open and close](./how-to-read-vwap.svg)

These are the conventions traders use. None of them is a reliable signal on its own.

- Above or below. Price above session VWAP means the latest trades are higher than the average paid today, so the average buyer is in profit for now; below it, the average seller is. Many traders read a session spent mostly above VWAP as an up day and mostly below as a down day.
- Slope. A rising VWAP means trading has been happening at higher prices as the day goes on. A flat VWAP with price crossing it often marks a range-bound day.
- Pullbacks to VWAP. On a trending day, price often comes back to VWAP before carrying on. Traders who watch VWAP may buy or sell there, which can make it act as support or resistance, but price also passes straight through it.
- Stretch from VWAP. Distance from VWAP, in per cent or in σ, shows how far price has run from the session's average. Mean-reversion traders look for moves back towards VWAP from beyond the outer band; trend traders read a close outside the band as strength.
- Late in the session. By the afternoon, the day's cumulative volume is large and each new bar adds a small share of it, so VWAP barely moves. A sharp move late in the day can leave price far from a nearly flat VWAP.

## VWAP as an execution benchmark

VWAP started as a yardstick for how well a large order was traded: buying below the day's VWAP, or selling above it, counts as a better-than-average result.

Berkowitz, Logue and Noser (1988) proposed measuring the cost of institutional trades against the day's volume weighted average price, because it reflects all the trading that day rather than one moment's quote. The idea spread across buy-side desks, and brokers built VWAP algorithms that split a large order into small pieces timed to follow the day's expected volume pattern.

For a buy order, the shortfall against VWAP in basis points (hundredths of a per cent) is:

$$
\text{slippage (bp)} = \frac{\bar{p}_{\text{fill}} - \text{VWAP}}{\text{VWAP}} \times 10{,}000
$$

where $\bar{p}_{\text{fill}}$ is the order's average fill price; a positive number means the buyer paid more than the market average. For a sell order the sign flips. A buy of 10,000 shares filled at an average of 100.65 on the example's 09:55 VWAP of 100.604 is 4.6 bp worse than VWAP.

The benchmark has known weaknesses:

- A large order moves its own benchmark. If an order is a big share of the day's volume, its own trades pull VWAP towards its fill price, so it looks better against VWAP than it was.
- It rewards trading with the crowd. An order spread evenly through the day will finish close to VWAP whether or not trading at all was a good idea.
- Volume must be forecast. A VWAP algorithm has to guess how much will trade in each part of the day. Białkowski, Darolles and Le Fol (2008) showed that forecasting intraday volume more accurately brings execution prices closer to VWAP.

Trading volume through the day typically follows a U shape: heavy at the open and close and lighter around midday, a pattern documented in US shares by Jain and Joh (1988). That shape is one reason session VWAP moves quickly in the first hour and slowly after lunch.

## VWAP vs moving averages

VWAP weights prices by volume and runs from a fixed anchor; a simple or exponential moving average weights a fixed number of recent bars and ignores volume.

| | VWAP | Simple moving average (SMA) | Exponential moving average (EMA) |
| --- | --- | --- | --- |
| Weights | Each bar by its volume | Each bar equally | Recent bars more, falling off geometrically |
| Window | From the anchor to now, growing | The last n bars | All past bars, effectively the last few n |
| Needs volume | Yes | No | No |
| Speed of response | Fast after the anchor, slow late in the session | Constant | Constant, faster than an SMA of the same n |
| Typical use | Intraday average price, execution benchmark | Trend direction on any timeframe | Trend direction where faster reaction is wanted |
| Timeframes | Intraday (session) or from an event (anchored) | Any | Any |

Use VWAP when the question is "what has the average trade cost since the open, or since this event?". Use a moving average when you want a smoothed price that reacts at the same pace all day and on daily or weekly charts. In the demo, switch the comparison between an equal-weight average from the same anchor, which isolates the effect of the volume weights, and a 20-bar SMA, which shows the different window as well.

## Limitations of VWAP

VWAP describes what has already traded, so it lags, it depends on its anchor, and it is only as good as the volume behind it.

- It is intraday by nature. Session VWAP restarts every day, so a daily-bar chart can't show it, and on multi-day charts the line jumps at each reset.
- It flattens. The longer a session runs, the less each new bar can move the cumulative average.
- It needs volume. Without volume, VWAP becomes an equal-weight average. Spot currency (FX) trading is spread across many dealers and venues with no single consolidated volume figure, so FX charts usually weight by a single venue's volume or by tick count, the number of price changes, which is a stand-in for volume.
- It depends on the data. Bar-based VWAP differs from trade-based VWAP, and charts that include pre-market or after-hours trades, or use a different session time, will show a different line.
- It describes past trades. VWAP summarises what has already traded and says nothing about where price will go next.

## Common VWAP mistakes

Most VWAP mistakes come from forgetting that it is a running average from a particular anchor.

- **Using session VWAP on daily bars.** One bar per day gives one point per session; the indicator has nothing to average.
- **Comparing VWAPs with different sessions.** A chart that starts at the pre-market open and one that starts at the regular open give different lines for the same stock.
- **Treating VWAP as a price floor or ceiling.** Many traders watch it, but price crosses it every day.
- **Reading the bands as probabilities.** Intraday prices are not normally distributed and the bands are built from a handful of bars early in the session, so "95% of prices inside ±2σ" does not hold.
- **Forgetting the anchor.** An anchored VWAP from the wrong bar, or one anchored at whatever history happens to be loaded, answers a different question from the one you meant to ask.
- **Weighting by the wrong volume.** On instruments without consolidated volume, check what the volume column actually counts before trusting the weights.

## How to create a VWAP chart in JavaScript, React or Angular

The demo below simulates three trading days of 78 five-minute bars with a U-shaped volume pattern and recomputes the VWAP, both bands, the comparison line and the readout from all 234 bars every time you change a control. SciChart.js draws the candles, volume columns, bands and lines with WebGL and WebGPU; the VWAP maths is plain JavaScript.

Choose **Anchor** to switch between a session VWAP that resets each morning and an anchored VWAP. When anchored, move the **Anchor bar** slider or drag the dashed anchor line along the chart; it snaps to the nearest bar. **Band multiplier** sets the inner band (the outer band is twice as wide), and 0 hides both. **Compare with** adds an equal-weight average from the same anchor or a 20-bar simple moving average. **New simulated days** draws a fresh three days of data. The readout gives the latest VWAP, the distance of the last close from it in per cent and in σ, and the volume since the anchor. Scroll to zoom, drag to pan, double-click to reset and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="VWAP indicator" demo="multi-pane-stock-charts" demoLabel="multi-pane stock chart" docs="/financial-charts/studies-and-indicators/add-indicators/vwap-volume-weighted-average-price/" docsLabel="SciTrader.js VWAP indicator documentation" />

Here is the code for this demo. The simulation and the VWAP maths are plain JavaScript; SciChart.js draws the candles, the volume, the bands and the lines, and handles the draggable anchor. The React and Angular versions below draw a session VWAP with ±1σ and ±2σ bands over your own bars.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        OhlcDataSeries,
        XyDataSeries,
        XyyDataSeries,
        FastCandlestickRenderableSeries,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Bar = { x: number; open: number; high: number; low: number; close: number; volume: number };

    // Running sums from the first bar: VWAP and the volume-weighted standard deviation of typical price
    const vwapAndSigma = (bars: Bar[]) => {
        let pv = 0, p2v = 0, v = 0;
        return bars.map((b) => {
            const p = (b.high + b.low + b.close) / 3;
            pv += p * b.volume;
            p2v += p * p * b.volume;
            v += b.volume;
            const vwap = pv / v;
            return { vwap, sigma: Math.sqrt(Math.max(0, p2v / v - vwap * vwap)) };
        });
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 2 }));

        const bars = getYourSessionBars(); // one session, oldest first
        const x = bars.map((b) => b.x);
        const stats = vwapAndSigma(bars);
        const band = (k: number, fill: string) =>
            new FastBandRenderableSeries(wasmContext, {
                dataSeries: new XyyDataSeries(wasmContext, {
                    xValues: x,
                    yValues: stats.map((s) => s.vwap + k * s.sigma),
                    y1Values: stats.map((s) => s.vwap - k * s.sigma),
                    dataSeriesName: `VWAP ±${k}σ`
                }),
                fill,
                fillY1: fill,
                stroke: "#50C7E0",
                strokeY1: "#50C7E0"
            });
        sciChartSurface.renderableSeries.add(
            band(2, "#50C7E00D"),
            band(1, "#50C7E01F"),
            new FastCandlestickRenderableSeries(wasmContext, {
                dataSeries: new OhlcDataSeries(wasmContext, {
                    xValues: x,
                    openValues: bars.map((b) => b.open),
                    highValues: bars.map((b) => b.high),
                    lowValues: bars.map((b) => b.low),
                    closeValues: bars.map((b) => b.close),
                    dataSeriesName: "Price"
                }),
                brushUp: "#26A69A",
                strokeUp: "#26A69A",
                brushDown: "#EF5350",
                strokeDown: "#EF5350"
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: stats.map((s) => s.vwap), dataSeriesName: "VWAP" }),
                stroke: "#F6E05E",
                strokeThickness: 2.5
            })
        );
        sciChartSurface.chartModifiers.add(new CursorModifier(), new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const VwapChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        OhlcDataSeries,
        XyDataSeries,
        XyyDataSeries,
        FastCandlestickRenderableSeries,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Bar = { x: number; open: number; high: number; low: number; close: number; volume: number };

    // Running sums from the first bar: VWAP and the volume-weighted standard deviation of typical price
    const vwapAndSigma = (bars: Bar[]) => {
        let pv = 0, p2v = 0, v = 0;
        return bars.map((b) => {
            const p = (b.high + b.low + b.close) / 3;
            pv += p * b.volume;
            p2v += p * p * b.volume;
            v += b.volume;
            const vwap = pv / v;
            return { vwap, sigma: Math.sqrt(Math.max(0, p2v / v - vwap * vwap)) };
        });
    };

    @Component({
        selector: "app-vwap-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class VwapChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 2 }));

            const bars = getYourSessionBars(); // one session, oldest first
            const x = bars.map((b) => b.x);
            const stats = vwapAndSigma(bars);
            const band = (k: number, fill: string) =>
                new FastBandRenderableSeries(wasmContext, {
                    dataSeries: new XyyDataSeries(wasmContext, {
                        xValues: x,
                        yValues: stats.map((s) => s.vwap + k * s.sigma),
                        y1Values: stats.map((s) => s.vwap - k * s.sigma),
                        dataSeriesName: `VWAP ±${k}σ`
                    }),
                    fill,
                    fillY1: fill,
                    stroke: "#50C7E0",
                    strokeY1: "#50C7E0"
                });
            sciChartSurface.renderableSeries.add(
                band(2, "#50C7E00D"),
                band(1, "#50C7E01F"),
                new FastCandlestickRenderableSeries(wasmContext, {
                    dataSeries: new OhlcDataSeries(wasmContext, {
                        xValues: x,
                        openValues: bars.map((b) => b.open),
                        highValues: bars.map((b) => b.high),
                        lowValues: bars.map((b) => b.low),
                        closeValues: bars.map((b) => b.close),
                        dataSeriesName: "Price"
                    }),
                    brushUp: "#26A69A",
                    strokeUp: "#26A69A",
                    brushDown: "#EF5350",
                    strokeDown: "#EF5350"
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: x, yValues: stats.map((s) => s.vwap), dataSeriesName: "VWAP" }),
                    stroke: "#F6E05E",
                    strokeThickness: 2.5
                })
            );
            sciChartSurface.chartModifiers.add(new CursorModifier(), new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- VWAP, σ and the equal-weight average come from one pass over the bars with four running sums (`vwapWithBands` in the demo). Resetting the sums at each session's first bar gives session VWAP; starting them at the anchor bar gives anchored VWAP.
- Each band is a [FastBandRenderableSeries](/2d-charts/chart-types/fast-band-renderable-series/) over an `XyyDataSeries`, with the upper line as y and the lower as y1. The candles are a [FastCandlestickRenderableSeries](/2d-charts/chart-types/fast-candlestick-renderable-series/) and the volume two [FastColumnRenderableSeries](/2d-charts/chart-types/fast-column-renderable-series/column-series-type/), one for up bars and one for down bars.
- The x axis is a bar number with a three-slot gap between days. A NaN in each gap, with `containsNaN: true` on the data series, stops a session VWAP from joining one day's close to the next day's open.
- The anchor is a [VerticalLineAnnotation](/2d-charts/annotations-api/vertical-line-annotation/) with `isEditable: true`; its `dragEnded` event snaps it to a bar and recalculates (see [editable annotations](/2d-charts/annotations-api/editable-annotations/)). `SciChartVerticalGroup` lines up the price and volume panes, and each x-axis's `visibleRangeChanged` event keeps them on the same bars.

**See it in the demo app:** [JavaScript multi-pane stock chart](https://www.scichart.com/demo/javascript/multi-pane-stock-charts) · [React multi-pane stock chart](https://www.scichart.com/demo/react/multi-pane-stock-charts) · [Angular multi-pane stock chart](https://www.scichart.com/demo/angular/multi-pane-stock-charts). Related techniques: the [React line chart](https://www.scichart.com/demo/react/line-chart), [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart) and [React chart annotations](https://www.scichart.com/demo/react/chart-annotations).

**Go deeper:** [SciTrader.js VWAP indicator documentation](/financial-charts/studies-and-indicators/add-indicators/vwap-volume-weighted-average-price/), the [candlestick series documentation](/2d-charts/chart-types/fast-candlestick-renderable-series/), the [band series documentation](/2d-charts/chart-types/fast-band-renderable-series/), and the learning center guides to the [candlestick chart](/learn/chart-types/cartesian/candlestick-chart/), [footprint chart](/learn/chart-types/cartesian/footprint-chart/) and [market depth](/learn/applications/market-depth/). For the industry, see SciChart for [financial and trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/).

## Building a full trading app?

[SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, has VWAP built in as one of its technical indicators. Its [VWAP indicator page](/financial-charts/studies-and-indicators/add-indicators/vwap-volume-weighted-average-price/) shows how to add it to a candlestick chart in JavaScript or React, and explains how it is anchored: at the first loaded candle rather than at each session open. Beside it you get the other indicators, drawing tools, multiple panes and live data feeds; see [add technical indicators](/financial-charts/studies-and-indicators/add-indicators/) for the full set. See what it can do on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What is VWAP?

VWAP (volume weighted average price) is the average price a security has traded at since a starting point, usually the session open, with each price weighted by the volume traded at it. It answers the question: what has the average share cost today? Traders draw it as a line over an intraday price chart, and institutions use it to judge how well a large order was executed.

### How is VWAP calculated?

For each bar, take the typical price, (high + low + close) / 3, and multiply it by the bar's volume. Add these products up from the first bar of the session, and divide by the total volume over the same bars. Repeat on every new bar, so VWAP is a running total, not a fixed-length average. Calculated from individual trades instead of bars, it is the sum of each trade's price times its size, divided by the total size.

### What is the difference between VWAP and anchored VWAP?

The formula is the same; only the starting bar differs. Standard (session) VWAP restarts at each session open. Anchored VWAP starts at a bar the trader chooses, such as an earnings release, a gap or a swing high or low, and runs on across sessions from there, so it shows the average price paid by everyone who traded since that event.

### What are VWAP bands?

VWAP bands are lines drawn a set number of standard deviations above and below VWAP, most often 1 and 2, sometimes 3. The standard deviation is usually the volume-weighted spread of typical prices around VWAP since the same anchor. They show how far price has moved from the average in units of that day's own spread. Some charts use fixed percentage bands instead.

### Is VWAP better than a moving average?

VWAP weights prices by volume and runs from a fixed anchor, so it describes the average price paid within one session and suits intraday charts and execution benchmarks. A simple or exponential moving average weights a fixed number of recent bars without volume, so it works on any timeframe and keeps reacting at the same speed, while session VWAP slows down as the day goes on.

### How do I add a VWAP line to a chart in JavaScript?

Loop over your bars once, keeping running sums of typical price times volume, typical price squared times volume, and volume. VWAP is the first sum divided by the volume sum, and the band width comes from the second. Reset the sums at each session open or at your anchor. With SciChart.js, draw the candles with `FastCandlestickRenderableSeries`, the VWAP with a `FastLineRenderableSeries`, and each band with a `FastBandRenderableSeries` over an `XyyDataSeries`; the same code runs in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Berkowitz, S. A., Logue, D. E. and Noser, E. A. (1988), [The total cost of transactions on the NYSE](https://doi.org/10.1111/j.1540-6261.1988.tb02591.x). *The Journal of Finance*, 43(1), 97–112. Proposes the day's volume weighted average price as the benchmark for measuring the cost of institutional trades.
- Harris, L. (2003), *Trading and Exchanges: Market Microstructure for Practitioners*. Oxford University Press. Trading costs, execution benchmarks and order-splitting strategies.
- Białkowski, J., Darolles, S. and Le Fol, G. (2008), [Improving VWAP strategies: a dynamic volume approach](https://doi.org/10.1016/j.jbankfin.2007.09.023). *Journal of Banking & Finance*, 32(9), 1709–1722. How intraday volume forecasts affect VWAP execution.
- Jain, P. C. and Joh, G.-H. (1988), [The dependence between hourly prices and trading volume](https://doi.org/10.2307/2331067). *Journal of Financial and Quantitative Analysis*, 23(3), 269–283. Documents the higher trading volume near the open and close of the US trading day.
- U.S. Securities and Exchange Commission, Investor.gov, [Volume-weighted average price (VWAP)](https://www.investor.gov/introduction-investing/investing-basics/glossary/volume-weighted-average-price-vwap).

<LearnCta position="bottom" chart="VWAP indicator" demo="multi-pane-stock-charts" demoLabel="multi-pane stock chart" docs="/financial-charts/studies-and-indicators/add-indicators/vwap-volume-weighted-average-price/" docsLabel="SciTrader.js VWAP indicator documentation" />
