---
sidebar_position: 240
sidebar_label: Volume Profile
title: "Volume Profile: Point of Control, Value Area and How to Read It"
description: "What a volume profile is, how the point of control and the 70% value area are calculated, and how to read high- and low-volume nodes, with a live example."
keywords:
    [
        "volume profile",
        "what is volume profile",
        "how to read volume profile",
        "volume profile indicator",
        "point of control",
        "value area",
        "value area high",
        "value area low",
        "high volume node",
        "low volume node",
        "fixed range volume profile",
        "session volume profile",
        "visible range volume profile",
        "volume by price",
        "volume profile vs market profile"
    ]
image: /img/learn/volume-profile-og.png
related: [footprint-chart, market-depth, vwap, candlestick-chart]
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
                    "name": "What is a volume profile?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A volume profile is a histogram of how much volume traded at each price over a chosen range of time, drawn as horizontal bars beside the price axis of a chart. It shows which prices the market traded at most and least, rather than when it traded." }
                },
                {
                    "@type": "Question",
                    "name": "What is the point of control in a volume profile?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The point of control (POC) is the price row with the most traded volume in the profile's range: the longest bar. It marks where the most business was done. Its exact price depends on the row size and the data, so two charts of the same market can show different POCs." }
                },
                {
                    "@type": "Question",
                    "name": "How is the value area calculated?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Start at the point of control and add neighbouring price rows until the rows you have hold a set share of the total volume, usually 70%. The classic method compares the next two rows above with the next two rows below and adds the busier pair each time; many tools compare one row on each side instead. The top of the value area is the value area high (VAH) and the bottom is the value area low (VAL)." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between volume profile and Market Profile?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both show activity by price. A volume profile counts how many contracts or shares traded at each price. Market Profile, developed by J. Peter Steidlmayer at the Chicago Board of Trade, counts time: one letter for each 30-minute period in which a price traded, called a time price opportunity (TPO). The two can put the point of control and value area at different prices." }
                },
                {
                    "@type": "Question",
                    "name": "What are high-volume and low-volume nodes?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A high-volume node (HVN) is a peak in the profile, a price area where a lot traded. A low-volume node (LVN) is a trough, a price area where little traded, usually because the price moved through it quickly. Traders often mark both as reference levels, but neither guarantees how the price will behave on a return." }
                },
                {
                    "@type": "Question",
                    "name": "How do I draw a volume profile in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Add up the size of every trade into price rows, find the busiest row and grow the value area from it in plain JavaScript. Then draw the rows as horizontal rectangles on a second, hidden x axis that shares the chart's price axis, with the bars growing from the right edge. In SciChart.js that is a FastRectangleRenderableSeries over an XyxyDataSeries next to a FastCandlestickRenderableSeries, with horizontal line annotations for the POC, VAH and VAL. The same code runs inside scichart-react or scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Volume Profile

## What is a volume profile?

A **volume profile** (also called volume at price, or volume by price) is a chart of how much volume traded at each price over a chosen range of time, drawn as horizontal bars beside the price axis. The longest bar is the point of control, and the band around it holding about 70% of the volume is the value area.

![A dark navy candlestick chart of three simulated trading sessions with a volume profile on the right: horizontal bars of volume at each price, the value area rows in bright blue between dashed value area high and low lines, the point of control row and line in yellow, and the last session's candles shaded as the profile's range](/img/learn/volume-profile-og.png)

*Five-minute candles over three simulated sessions with the last session's volume profile, point of control and value area. [Try the interactive version](#how-to-create-a-volume-profile-in-javascript-react-or-angular).*

:::tip Key takeaways
- A volume profile turns volume on its side: one bar per price row, its length the volume traded there over the chosen range.
- The point of control (POC) is the busiest row; the value area runs from the value area low (VAL) to the value area high (VAH) and holds about 70% of the volume.
- Peaks are high-volume nodes, where the market traded a lot; troughs are low-volume nodes, where the price moved through quickly.
- A profile built from every trade is exact. One estimated from candles spreads each candle's volume over its range and can move the POC by several ticks.
- The range, the row size, the value area share and the method all change the result, so compare profiles only with the same settings.
:::

This page explains how a volume profile is read and built, and is not investment advice.

## How to read a volume profile

Read a volume profile from its longest bar outwards: the point of control, then the value area around it, then the peaks and troughs beyond.

![Anatomy of a volume profile: candles of one session rising from about 101 to 105 on the left, and on the right horizontal bars of volume at each price, with the point of control at 104.50 as the longest bar, the value area from 103.50 to 105.50 shaded and holding 72% of the volume, a high-volume node near 101.25 in the lower part and a low-volume node near 102.75 in the thin gap between the two busy areas](./volume-profile-anatomy.svg)

1. Check the range. A profile covers a stretch of time: one session, several, a range you picked or the bars on screen. The same chart can carry several profiles, one per session.
2. Check the row size. Each bar is one price row: one tick (the smallest price step) or several ticks merged. Bigger rows smooth the shape and can move the POC.
3. Find the point of control, the longest bar, usually marked with a line across the chart.
4. Find the value area, usually shaded or bounded by two lines. Its top is the VAH and its bottom the VAL.
5. Look at the shape. One rounded hump means the range traded around one price; two humps with a thin waist mean it traded in two places and moved quickly between them.
6. Compare with the current price. Traders note whether the price is inside the value area, above it or below it, and whether it is near a peak or a trough.

## How a volume profile is calculated

A volume profile adds up the size of every trade into price rows; everything else on the chart is read from those sums.

Split the price range into rows of equal height, $\Delta$ ticks each. The volume of row $r$ is the total size $q_i$ of every trade $i$ whose price $p_i$ falls in that row, over the bars in the range:

$$
V_r = \sum_{i \,:\, p_i \in \text{row } r} q_i
$$

The point of control is the row with the largest $V_r$. The value area is a run of rows from $L$ up to $H$ that contains the POC and holds at least a share $s$ of the total, with $s = 0.70$ by convention:

$$
\sum_{r=L}^{H} V_r \;\ge\; s \sum_{r} V_r
$$

The algorithm in the value area section below decides which rows from $L$ to $H$ are chosen. With $\Delta = 1$, each row is one tradable price; with $\Delta = 4$ on a market with a 0.25 tick, each row covers a whole point.

## Point of control (POC)

The point of control is the price row with the most volume in the range, the place where the most contracts or shares changed hands.

The idea comes from Market Profile, the charting method J. Peter Steidlmayer developed as a trader at the Chicago Board of Trade (CBOT), which published it as CBOT Market Profile in 1985. In Market Profile, the POC is the price traded in the most time periods; in a volume profile, it is the price with the most volume.

Some details change where the POC lands:

- Ties. When two rows have the same volume, tools pick differently. The demo on this page picks the one nearest the middle of the range.
- Row size. Merging ticks into larger rows can move the POC to another part of the range, because the busiest single tick doesn't always sit in the busiest group of ticks.
- Developing POC. Many charts redraw the POC as the session goes on, so it can jump from one area to another during the day. The final POC is only known at the end of the range.

## Value area: VAH, VAL and the 70% convention

The value area is the band of prices around the POC that holds a set share of the range's volume, by convention 70%; its upper edge is the value area high (VAH) and its lower edge the value area low (VAL).

The 70% figure comes from Market Profile. About 68% of a normal distribution lies within one standard deviation of its mean, and Steidlmayer's work treated the central 70% of the day's activity as the range the market regarded as value. The figure is a convention, and many tools let you set anything from 60% to 80%.

The value area is built outwards from the POC:

1. Start with the POC row. Note the target: 70% of the total volume.
2. Compare the volume just above the rows you have with the volume just below them.
3. Add the busier side, then compare again.
4. Stop when the rows you have hold at least 70% of the volume.

Tools differ in step 2. The method in Dalton, Jones and Dalton's *Mind Over Markets*, from Market Profile practice, compares the next two rows above with the next two below and adds the busier pair. Many charting tools compare one row on each side and add one row at a time. Both stop once the target is reached, so each can overshoot it, and they can end on different rows.

### Worked example: finding the POC and value area

Here is one session's profile in nine one-tick rows of 0.25, with 1,000 contracts in total. The target for a 70% value area is 700.

| Price | Volume | One row at a time | Two rows at a time |
| --- | --- | --- | --- |
| 4,802.00 | 20 | | |
| 4,801.75 | 60 | | |
| 4,801.50 | 160 | Added 5th: total 850 | Added 1st, with 4,801.25: total 470 |
| 4,801.25 | 90 | Added 4th: total 690 | Added 1st |
| 4,801.00 | 220 | POC: 220 | POC: 220 |
| 4,800.75 | 130 | Added 1st: total 350 | Added 2nd, with 4,800.50: total 710 |
| 4,800.50 | 110 | Added 2nd: total 460 | Added 2nd |
| 4,800.25 | 140 | Added 3rd: total 600 | |
| 4,800.00 | 70 | | |

- POC: 4,801.00, with 220 contracts.
- One row at a time: 90 above against 130 below, so add 4,800.75 (350). Then 90 against 110, add 4,800.50 (460); 90 against 140, add 4,800.25 (600); 90 against 70, add 4,801.25 (690); 160 against 70, add 4,801.50 (850). The value area runs from 4,800.25 to 4,801.50 and holds 85% of the volume.
- Two rows at a time: the pair above (90 + 160 = 250) beats the pair below (130 + 110 = 240), so add both rows above (470). Next, the pair above (60 + 20 = 80) loses to the pair below (240): add both (710). The value area runs from 4,800.50 to 4,801.50 and holds 71%.

The two methods put the VAL one tick apart on the same data. At 60% the gap widens: one row at a time stops at 4,800.25 to 4,801.00 (600), while two rows at a time still needs its first pair and returns 4,800.50 to 4,801.50 (710).

## High-volume nodes and low-volume nodes

A high-volume node (HVN) is a peak in the profile, where a lot traded; a low-volume node (LVN) is a trough, where little traded because the price passed through quickly.

- An HVN shows a price area where buyers and sellers kept trading with each other for a long time. The POC is the largest HVN, but a profile can have several.
- An LVN often sits between two HVNs, where the price moved from one busy area to another without stopping. In the demo, session 2 moves up about 25 points in half an hour, and its profile shows two humps with an almost empty stretch between them.

Traders commonly mark HVNs as areas where the price may slow down or range again, and LVNs as areas the price may cross quickly on a return. A node only records where trading happened, and the price can go straight through either kind.

## Volume profile shapes

The overall shape of a session's profile summarises how the session traded, and traders give the common shapes names.

| Shape | What it looks like | What it describes |
| --- | --- | --- |
| Balanced (D-shaped) | One rounded hump, POC near the middle | A session that traded around one price area |
| P-shaped | A wide hump at the top, a thin tail below | Trading concentrated near the high after a move up from lower prices |
| b-shaped | A wide hump at the bottom, a thin tail above | Trading concentrated near the low after a move down |
| Double distribution | Two humps with an LVN between them | Trading in one area, a quick move, then trading in another |
| Thin and elongated | No clear hump, volume spread along a long range | A session that kept moving in one direction |

The shapes describe what happened; whether a P shape is followed by higher prices is a separate question that the shape itself doesn't answer. The day types behind several of these names, such as the normal day, the trend day and the double-distribution trend day, are set out in *Mind Over Markets*.

## Session, fixed range and visible range profiles

The range of time a profile covers is a setting, and the common choices answer different questions.

| Range | What it covers | Use it to |
| --- | --- | --- |
| Session | One trading session; often one profile per session drawn side by side | Compare where each day traded and how value moved from day to day |
| Fixed range (anchored) | From one bar you choose to another, such as from a swing low to now | Study one move or one consolidation |
| Visible range | The bars on screen, recomputed as you pan and zoom | Get a quick view of whatever you are looking at |
| Composite | Many sessions merged into one profile | Find price areas that stayed busy over weeks or months |

A visible range profile changes every time you zoom, so its POC is not a fixed level. In the demo, choose Visible bars and zoom with the mouse wheel to see it move.

## Exact volume vs volume estimated from candles

A volume profile built from every trade is exact; one built from candles has to guess where inside each candle the volume traded, and the guess can move the POC and value area.

A candle records open, high, low, close and total volume, but not how the volume was spread across its range. A common estimate, and the one SciTrader.js's [volume profile study](/financial-charts/studies-and-indicators/add-indicators/volume-profile/) uses, spreads each candle's volume evenly over its high–low range. Here is one five-minute candle with a low of 4,800.00, a high of 4,801.00 and 1,000 contracts:

| Price | Traded there | Estimated from the candle |
| --- | --- | --- |
| 4,801.00 | 380 | 200 |
| 4,800.75 | 420 | 200 |
| 4,800.50 | 130 | 200 |
| 4,800.25 | 50 | 200 |
| 4,800.00 | 20 | 200 |

The estimate gives the lowest price ten times the volume that traded there, and flattens the busiest price from 420 to 200. Over many candles these errors partly cancel out, but not completely. In the demo's session 2, with one-tick rows, the POC from candles is 4,824.00, 11 ticks (2.75 points) below the exact POC of 4,826.75.

The estimate gets better as the candles get shorter, because each one covers a narrower range. Use one-minute candles rather than hourly ones when trades aren't available, and treat a POC from long candles as approximate.

## Volume profile vs Market Profile vs footprint chart

Use a volume profile for where a whole range traded, Market Profile for how long the market spent at each price, and a footprint chart for volume and aggressor side inside each bar.

| If the reader needs to… | Use |
| --- | --- |
| See which prices a session or range traded most, by volume | Volume profile |
| See how much time the market spent at each price, with a letter for each 30-minute period (TPOs) | Market Profile (TPO chart) |
| See volume at each price inside every bar, split into trades at the bid and at the ask | [Footprint chart](/learn/chart-types/cartesian/footprint-chart/) |
| See resting orders waiting in the book, not trades | [Market depth chart](/learn/applications/market-depth/) |
| See open, high, low and close over time | [Candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) |
| See any value by colour on a grid of two variables, such as volume by price and time | [Heatmap](/learn/chart-types/cartesian/heatmap/) |

Market Profile counts a time price opportunity (TPO) for each period in which a price traded, so a price that traded briefly in heavy volume scores low there and high in a volume profile. "Volume by price" is an older name for the same idea; on many charts it covers the whole visible range and splits each bar into volume on up and down candles.

## Common volume profile mistakes

Most mistakes come from comparing profiles built with different settings or data, or reading a level as a promise.

- **Comparing different ranges.** A session profile, a visible range profile and a composite of the same market have different POCs. Say which one you mean.
- **Ignoring the row size.** One-tick rows and one-point rows give different shapes and can put the POC in a different place.
- **Trusting a profile from long candles.** Spreading hourly or daily volume evenly over each candle blurs the shape and can move the POC by several ticks.
- **Treating 70% as a fact.** The value area share is a convention, and the method (one row or two at a time) moves its edges by a row or more.
- **Reading thin markets.** With little volume, a few large trades decide the POC. Wait for more data, or use larger rows.
- **Forgetting the developing POC.** During a session the POC can move. A level drawn at 11:00 may not be the POC at the close.
- **Reading a level as a prediction.** A POC, HVN or LVN records where trading happened. The profile can't tell you whether the price will react there next time.

## How to create a volume profile in JavaScript, React or Angular

The demo below simulates 23,627 trades over three sessions of 78 five-minute candles, and recomputes the volume at each price, the POC and the value area from those trades, or from the candles, each time you change a control. SciChart.js draws the candles and the profile rows with WebGL and WebGPU; the profile maths is plain JavaScript.

**Range** picks the bars the profile covers: all three sessions, session 2, session 3, or the bars on screen (scroll to zoom and drag to pan, and the profile follows). **Row size** merges ticks into rows of 0.50, 1.00 or 2.00. The **Value area** slider sets the share from 60% to 80%, and **Built by** switches between two rows and one row at a time. **Volume from** switches between every trade and the estimate from candles; the readout always reports how far the candle-based POC is from the exact one. Hover for values and double-click to reset the zoom.

<LiveDocSnippet maxWidth={'100%'} height={680} name="./Basic/demo" />

<LearnCta position="top" chart="volume profile" demo="candlestick-chart" demoLabel="candlestick chart" docs="/financial-charts/studies-and-indicators/add-indicators/volume-profile/" docsLabel="SciTrader.js volume profile documentation" />

Here is the code for this demo. The rows, the POC and both value area methods are plain JavaScript functions you can use with any data source; SciChart.js draws the candles, the profile bars and the lines. The React and Angular versions draw a profile from your own trades.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        EAutoRange,
        OhlcDataSeries,
        FastCandlestickRenderableSeries,
        XyxyDataSeries,
        FastRectangleRenderableSeries,
        EColumnMode,
        EColumnYMode,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Volume at each price row: rows are rowSize tall, keyed by their lowest price
    const volumeAtPrice = (trades: { price: number; size: number }[], rowSize: number) => {
        const rows = new Map<number, number>();
        for (const t of trades) {
            const row = Math.floor(t.price / rowSize + 1e-9) * rowSize;
            rows.set(row, (rows.get(row) ?? 0) + t.size);
        }
        return [...rows].sort((a, b) => a[0] - b[0]);
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, { growBy: new NumberRange(0.01, 0.5) }),
            // hidden, flipped volume axis: the profile grows leftwards from the right edge
            new NumericAxis(wasmContext, { id: "volume", isVisible: false, flippedCoordinates: true, autoRange: EAutoRange.Always, growBy: new NumberRange(0, 2.3) })
        );
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Right, labelPrecision: 2 }));

        const { candles, trades, rowSize } = getYourTradesAndCandles(); // candles: { x, open, high, low, close }[]
        const ohlc = new OhlcDataSeries(wasmContext);
        for (const c of candles) ohlc.append(c.x, c.open, c.high, c.low, c.close);
        const rows = volumeAtPrice(trades, rowSize);
        const profile = new XyxyDataSeries(wasmContext, { dataIsSortedInX: false });
        for (const [price, volume] of rows) profile.append(0, price + rowSize * 0.9, volume, price); // x, top, x1, bottom
        const poc = rows.reduce((best, row) => (row[1] > best[1] ? row : best));

        sciChartSurface.renderableSeries.add(
            new FastCandlestickRenderableSeries(wasmContext, { dataSeries: ohlc }),
            new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: profile,
                xAxisId: "volume",
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                fill: "#50C7E0CC",
                strokeThickness: 0
            })
        );
        sciChartSurface.annotations.add(new HorizontalLineAnnotation({ y1: poc[0] + rowSize / 2, stroke: "#FFD54A", showLabel: true, labelValue: "POC" }));
        const timeOnly = { excludedXAxisIds: ["volume"] };
        sciChartSurface.chartModifiers.add(
            new CursorModifier(timeOnly),
            new MouseWheelZoomModifier(timeOnly),
            new ZoomPanModifier(timeOnly),
            new ZoomExtentsModifier(timeOnly)
        );
        return { sciChartSurface };
    };

    export const VolumeProfileChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        EAutoRange,
        OhlcDataSeries,
        FastCandlestickRenderableSeries,
        XyxyDataSeries,
        FastRectangleRenderableSeries,
        EColumnMode,
        EColumnYMode,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Volume at each price row: rows are rowSize tall, keyed by their lowest price
    const volumeAtPrice = (trades: { price: number; size: number }[], rowSize: number) => {
        const rows = new Map<number, number>();
        for (const t of trades) {
            const row = Math.floor(t.price / rowSize + 1e-9) * rowSize;
            rows.set(row, (rows.get(row) ?? 0) + t.size);
        }
        return [...rows].sort((a, b) => a[0] - b[0]);
    };

    @Component({
        selector: "app-volume-profile-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class VolumeProfileChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, { growBy: new NumberRange(0.01, 0.5) }),
                // hidden, flipped volume axis: the profile grows leftwards from the right edge
                new NumericAxis(wasmContext, { id: "volume", isVisible: false, flippedCoordinates: true, autoRange: EAutoRange.Always, growBy: new NumberRange(0, 2.3) })
            );
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Right, labelPrecision: 2 }));

            const { candles, trades, rowSize } = getYourTradesAndCandles(); // candles: { x, open, high, low, close }[]
            const ohlc = new OhlcDataSeries(wasmContext);
            for (const c of candles) ohlc.append(c.x, c.open, c.high, c.low, c.close);
            const rows = volumeAtPrice(trades, rowSize);
            const profile = new XyxyDataSeries(wasmContext, { dataIsSortedInX: false });
            for (const [price, volume] of rows) profile.append(0, price + rowSize * 0.9, volume, price); // x, top, x1, bottom
            const poc = rows.reduce((best, row) => (row[1] > best[1] ? row : best));

            sciChartSurface.renderableSeries.add(
                new FastCandlestickRenderableSeries(wasmContext, { dataSeries: ohlc }),
                new FastRectangleRenderableSeries(wasmContext, {
                    dataSeries: profile,
                    xAxisId: "volume",
                    columnXMode: EColumnMode.StartEnd,
                    columnYMode: EColumnYMode.TopBottom,
                    fill: "#50C7E0CC",
                    strokeThickness: 0
                })
            );
            sciChartSurface.annotations.add(new HorizontalLineAnnotation({ y1: poc[0] + rowSize / 2, stroke: "#FFD54A", showLabel: true, labelValue: "POC" }));
            const timeOnly = { excludedXAxisIds: ["volume"] };
            sciChartSurface.chartModifiers.add(
                new CursorModifier(timeOnly),
                new MouseWheelZoomModifier(timeOnly),
                new ZoomPanModifier(timeOnly),
                new ZoomExtentsModifier(timeOnly)
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The profile is a [FastRectangleRenderableSeries](/2d-charts/chart-types/fast-rectangle-renderable-series/) over an `XyxyDataSeries`: each row is one rectangle from x = 0 to x = its volume, and from the top to the bottom of its price row (`EColumnMode.StartEnd`, `EColumnYMode.TopBottom`). The demo uses three of them, for rows outside the value area, inside it and the POC.
- The rectangles use a second x axis with `id: "volume"`, hidden and with `flippedCoordinates`, so 0 is at the right edge and the bars grow leftwards. `autoRange: EAutoRange.Always` with `growBy` keeps the longest bar at about 30% of the width (see [secondary and multiple axes](/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview/)).
- Both x axes share the one price axis with the [FastCandlestickRenderableSeries](/2d-charts/chart-types/fast-candlestick-renderable-series/), so the rows line up with the candles. The zoom and pan modifiers take `excludedXAxisIds: ["volume"]`, so zooming in time never stretches the profile.
- The POC, VAH and VAL are [HorizontalLineAnnotation](/2d-charts/annotations-api/horizontal-line-annotation/)s with their labels on the price axis; the value area band and the shaded range are `BoxAnnotation`s. In Visible bars mode, the demo recomputes on the time axis's `visibleRangeChanged` event.

**See it in the demo app:** [JavaScript candlestick chart](https://www.scichart.com/demo/javascript/candlestick-chart) · [React candlestick chart](https://www.scichart.com/demo/react/candlestick-chart) · [Angular candlestick chart](https://www.scichart.com/demo/angular/candlestick-chart). Related techniques: [React chart annotations](https://www.scichart.com/demo/react/chart-annotations).

**Go deeper:** [SciTrader.js volume profile documentation](/financial-charts/studies-and-indicators/add-indicators/volume-profile/), the [SciChart.js rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/), the blog post [How to create a volume profile in a JavaScript financial chart](https://www.scichart.com/blog/how-to-create-a-volume-profile-in-a-javascript-financial-chart/), and the learning center guides to the [footprint chart](/learn/chart-types/cartesian/footprint-chart/) and the [candlestick chart](/learn/chart-types/cartesian/candlestick-chart/). For the industry, see SciChart for [financial and trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/).

## Building a full trading app?

[SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, has a volume profile built in. Its [volume profile study](/financial-charts/studies-and-indicators/add-indicators/volume-profile/) adds the bars and the point of control to the price pane, for the visible candles or all loaded candles, with settings users can change at run time. It estimates volume at each price from candles, as described in [Exact volume vs volume estimated from candles](#exact-volume-vs-volume-estimated-from-candles), so build your own from trades, as on this page, when you need the exact profile or a value area. See what it can do on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What is a volume profile?

A volume profile is a histogram of how much volume traded at each price over a chosen range of time, drawn as horizontal bars beside the price axis of a chart. It shows which prices the market traded at most and least, rather than when it traded.

### What is the point of control in a volume profile?

The point of control (POC) is the price row with the most traded volume in the profile's range: the longest bar. It marks where the most business was done. Its exact price depends on the row size and the data, so two charts of the same market can show different POCs.

### How is the value area calculated?

Start at the point of control and add neighbouring price rows until the rows you have hold a set share of the total volume, usually 70%. The classic method compares the next two rows above with the next two rows below and adds the busier pair each time; many tools compare one row on each side instead. The top of the value area is the value area high (VAH) and the bottom is the value area low (VAL).

### What is the difference between volume profile and Market Profile?

Both show activity by price. A volume profile counts how many contracts or shares traded at each price. Market Profile, developed by J. Peter Steidlmayer at the Chicago Board of Trade, counts time: one letter for each 30-minute period in which a price traded, called a time price opportunity (TPO). The two can put the point of control and value area at different prices.

### What are high-volume and low-volume nodes?

A high-volume node (HVN) is a peak in the profile, a price area where a lot traded. A low-volume node (LVN) is a trough, a price area where little traded, usually because the price moved through it quickly. Traders often mark both as reference levels, but neither guarantees how the price will behave on a return.

### How do I draw a volume profile in JavaScript?

Add up the size of every trade into price rows, find the busiest row and grow the value area from it in plain JavaScript. Then draw the rows as horizontal rectangles on a second, hidden x axis that shares the chart's price axis, with the bars growing from the right edge. In SciChart.js that is a `FastRectangleRenderableSeries` over an `XyxyDataSeries` next to a `FastCandlestickRenderableSeries`, with horizontal line annotations for the POC, VAH and VAL. The same code runs inside `scichart-react` or `scichart-angular`.

## Sources

- Steidlmayer, J. P. and Koy, K. (1986), *Markets and Market Logic*. Porcupine Press. The first book-length account of Market Profile, the point of control and value.
- Steidlmayer, J. P. (1989), *Steidlmayer on Markets: A New Approach to Trading*. Wiley.
- Chicago Board of Trade (1985, revised 1991), *CBOT Market Profile* manual. The exchange's own guide to Market Profile.
- Dalton, J. F., Jones, E. T. and Dalton, R. B. (2013), *Mind Over Markets: Power Trading with Market Generated Information*, updated edition. Wiley. Day types, and the appendix on calculating the value area two prices at a time until 70% of the volume is reached.
- Harris, L. (2003), *Trading and Exchanges: Market Microstructure for Practitioners*. Oxford University Press. Trades, tick sizes and how exchanges report them.

<LearnCta position="bottom" chart="volume profile" demo="candlestick-chart" demoLabel="candlestick chart" docs="/financial-charts/studies-and-indicators/add-indicators/volume-profile/" docsLabel="SciTrader.js volume profile documentation" />
