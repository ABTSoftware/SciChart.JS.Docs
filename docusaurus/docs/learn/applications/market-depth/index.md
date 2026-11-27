---
sidebar_position: 140
sidebar_label: Market Depth and Order Book
title: "Market Depth Chart: How to Read the Order Book (Interactive Example)"
description: "What market depth is, how to read a depth chart and an order book heatmap, top of book vs depth, spread, mid price and slippage, with a live simulated order book."
keywords:
    [
        "market depth",
        "depth of market",
        "market depth chart",
        "how to read market depth",
        "depth chart",
        "order book",
        "order book depth",
        "limit order book",
        "level 2 market data",
        "top of book vs market depth",
        "market by price vs market by order",
        "bid ask spread",
        "mid price",
        "slippage",
        "order book heatmap",
        "liquidity heatmap"
    ]
image: /img/learn/market-depth-og.png
related: [footprint-chart, volume-profile, heatmap, tick-chart]
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
                    "name": "What is market depth?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Market depth is the quantity of buy and sell orders waiting in an order book at each price, not just at the best bid and ask. A deep market has plenty of size close to the current price, so a large order moves the price only a little; a thin market has little, so the same order moves it further." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a market depth chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Start in the middle, at the gap between the green bid curve and the red ask curve: its edges are the best bid and best ask, and its width is the spread. Moving outwards, the height of each curve is the total size you could sell (bids, to the left) or buy (asks, to the right) down or up to that price. Steep curves mean deep liquidity, flat curves mean thin liquidity, and a sudden vertical jump is a large order, often called a wall." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between top of book and market depth?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Top of book (level 1) is only the best bid and best ask, with the size at each. Market depth (level 2, or market by price) adds the total size at further price levels on both sides. Market by order goes one step further and lists every individual order in the queue at each price." }
                },
                {
                    "@type": "Question",
                    "name": "What is an order book heatmap?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An order book heatmap shows market depth over time. Time runs along the x axis, price up the y axis, and the colour of each cell is the resting size at that price at that moment. Bright horizontal lines are large orders that stayed in the book; a line that stops before the price reaches it is usually an order that was cancelled or moved (or, on a feed limited to a few levels, a price that moved out of view)." }
                },
                {
                    "@type": "Question",
                    "name": "Why does liquidity disappear from the order book?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Most resting orders are cancelled rather than filled: market makers and other traders move their quotes as prices and risk change, so displayed size comes and goes. Some size is never displayed at all, such as iceberg or hidden orders. Deliberately placing orders with the intent to cancel them before execution is called spoofing, and it is illegal in US futures markets under the Commodity Exchange Act." }
                },
                {
                    "@type": "Question",
                    "name": "How do I build a market depth chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Sort the bids from the best price down and the asks from the best price up, add up the sizes as you go, and give each price level two points so the curve steps instead of sloping. Plot the two cumulative series as filled mountain (area) series on a price axis. With SciChart.js that is two FastMountainRenderableSeries over XyDataSeries; for an order book heatmap, add a UniformHeatmapRenderableSeries whose columns you shift as new snapshots arrive. In React or Angular, the same function runs inside scichart-react or scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Market Depth Chart and Order Book

## What is market depth?

**Market depth** (also called depth of market, DOM or order book depth) is the quantity of buy and sell orders waiting in a market's order book at each price, beyond the best bid and ask. A **market depth chart** plots it as two step curves: the running total of bids below the current price and of asks above it.

![A dark navy market depth chart on top, with a green cumulative bid area rising to the left and a red cumulative ask area rising to the right of a narrow gap at the mid price, and underneath an order book heatmap of 40 seconds in which bright horizontal lines mark large resting orders and a pink line traces the mid price](/img/learn/market-depth-og.png)

*A market depth chart and an order book heatmap from the same simulated order book: cumulative bids and asks around the mid price, and resting size by price over the last 40 seconds. [Try the interactive version](#how-to-create-a-market-depth-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- An order book lists resting limit orders by price: bids (buy orders) below the market, asks (sell orders) above it.
- Top of book is the best bid and ask; market depth adds the size waiting at the price levels behind them.
- A depth chart adds the sizes up outwards from the spread, so the height at any price is how much you could trade before reaching it.
- A market order walks the book: it fills at the best price, then the next, so a large order pays more than the best ask. That extra is slippage.
- Displayed depth changes constantly. Orders are cancelled far more often than they are filled, and some size is never shown.
:::

This page explains how market depth charts and order books are read and built, and is not investment advice.

## What is an order book?

An order book is the exchange's list of resting limit orders for one instrument, grouped by price, with buy orders (bids) on one side and sell orders (asks or offers) on the other.

A **limit order** says "buy 500 at 100.00 or better". If no one is selling at 100.00 or less, it waits in the book; it is now resting liquidity. A **market order** says "buy 500 now at whatever price is available". It never rests: it trades straight away against orders already in the book.

At any moment the book looks something like this:

| Bid size | Bid | Ask | Ask size |
| --- | --- | --- | --- |
| | | 100.05 | 1,200 |
| | | 100.04 | 800 |
| | | 100.03 | 500 |
| | | 100.02 | 300 |
| 400 | 100.00 | | |
| 600 | 99.99 | | |
| 900 | 99.98 | | |
| 1,500 | 99.97 | | |

The highest bid (100.00) is the **best bid**; the lowest ask (100.02) is the **best ask**. Together they make the inside quote. Bids are always below asks: an order that would cross them trades instead of resting.

Within a price level, most exchanges fill orders in time order, first come, first served. This is called price-time priority, and it's why traders care about their place in the queue as well as their price. Some futures markets share fills at a price in proportion to order size (pro rata) instead. The smallest step between prices is the tick size, 0.01 in this example.

## Top of book vs market depth

Top of book is just the best bid and ask with their sizes; market depth is every price level behind them, and market by order is every individual order at every level.

| Name | What it shows | Example from the book above |
| --- | --- | --- |
| Level 1 (top of book) | Best bid and best ask, the size at each, and usually the last trade | 400 at 100.00 bid, 300 at 100.02 offered |
| Level 2 (market by price, MBP) | Total size and often the number of orders at each of several price levels on each side | The whole table above |
| Market by order (MBO) | Each order separately, in queue order, at every price | The 400 at 100.00 shown as, say, orders of 100, 250 and 50 |

The names vary by market and data vendor. Some call market by order "level 3"; others use level 3 for something else. Feeds also differ in how deep they go: CME Group's market-by-price feed sends a fixed number of levels set for each instrument, while its market-by-order feed carries every order at every price.

Top of book tells you the price for a small trade. Depth tells you what happens to a large one, and how quickly the price could move if one side were used up.

## Spread and mid price

The spread is the best ask minus the best bid, and the mid price is halfway between them.

- **Spread** = best ask − best bid = 100.02 − 100.00 = 0.02. As a share of the mid, that is 0.02 ÷ 100.01 = 2.0 basis points (a basis point is 0.01%). Narrow spreads go with liquid markets.
- **Mid price** = (best bid + best ask) ÷ 2 = 100.01. Charts often plot the mid as "the price" between trades, but nobody can trade at it: buyers pay the ask and sellers receive the bid.
- **Size-weighted mid** (also called the weighted mid) leans the mid towards the side with less size, because that side is more likely to be used up first: (100.00 × 300 + 100.02 × 400) ÷ (300 + 400) = 100.0114, a little above the plain mid because more size is bid than offered at the top. A refinement of it, the micro-price, adjusts the mid for imbalance and spread together (Stoikov, 2018).

## How to read a market depth chart

Read a depth chart from the middle outwards: the gap is the spread, the left curve is cumulative bids, the right curve is cumulative asks, and steep jumps are large orders.

![Anatomy of a market depth chart for a small order book: green bid steps rising to the left of the best bid at 100.00, red ask steps rising to the right of the best ask at 100.02, the 0.02 spread between them, a dashed line at the mid price of 100.01, an ask wall of 2,600 at 100.06, and an orange band from 100.02 to 100.04 showing the levels a market buy of 1,200 fills through](./depth-chart-anatomy.svg)

1. Find the gap in the middle. Its left edge is the best bid, its right edge the best ask, and its width the spread. A dashed line or label usually marks the mid price.
2. Read the ask curve to the right. Its height at any price is the total size offered at or below that price: how much you could buy before the price reached it. At 100.04 in the diagram that's 300 + 500 + 800 = 1,600.
3. Read the bid curve to the left the same way. Its height is the total bid at or above that price: how much you could sell before the price fell to it.
4. Look at the slope. A steep curve means a lot of size within a few ticks (deep); a flat curve means little (thin). Compare the two sides at the same distance from the mid.
5. Look for walls. A tall vertical step, such as the 2,600 at 100.06, is one large order or several orders at the same price.
6. Check the axes. The x range is a window around the price, often a few per cent either side, and the y axis rescales to the largest total in that window. Widen the window and a distant wall can flatten everything near the spread.

### Imbalance: comparing the two sides

Order book **imbalance** compares resting bid size with resting ask size near the price, usually as (bids − asks) ÷ (bids + asks). It runs from −1 (only asks) to +1 (only bids). For the top two levels of the book above it's (1,000 − 800) ÷ 1,800 = +0.11; over all four levels each side, (3,400 − 2,800) ÷ 6,200 = +0.10. The live demo computes it over every level within 1% of the mid.

A positive imbalance means more size waiting to buy than to sell. Cont, Kukanov and Stoikov (2014) found that short-term price changes track order flow imbalance at the best bid and ask (size added on the bid side minus size added on the ask side, net of cancellations and trades) over short intervals. The link is statistical, and displayed size can be withdrawn at any time (see [why liquidity vanishes](#why-displayed-liquidity-can-vanish)).

## How a market order walks the book: a worked example

A market order fills at the best price first, then at each worse price in turn until it's complete, so its average price is worse than the best quote; the difference is slippage.

Take the book above and send a market buy of 1,200:

| Ask level | Size there | Filled | Cost | Still to fill |
| --- | --- | --- | --- | --- |
| 100.02 | 300 | 300 | 30,006.00 | 900 |
| 100.03 | 500 | 500 | 50,015.00 | 400 |
| 100.04 | 800 | 400 | 40,016.00 | 0 |
| Total | | 1,200 | 120,037.00 | |

- Average fill price: 120,037 ÷ 1,200 = 100.0308.
- Slippage against the best ask: 100.0308 − 100.02 = 0.0108 per share, or 1.1 basis points. On 1,200 shares that's \$13 more than if all of them had filled at 100.02.
- Against the mid price (100.01) the buyer paid 0.0208 per share more, 2.1 basis points: half the spread plus the slippage.
- After the trade, 400 remain at 100.04, which is now the best ask. The spread has widened from 0.02 to 0.04 and the mid has moved up to 100.02, until new orders fill the gap.

A buy of 300 would have filled entirely at 100.02, with no slippage. A buy of 2,800 would have cleared all four levels for an average of 100.0404. To read the same answer off the depth chart, go across from the order size on the y axis to the ask curve; the price where you meet it is the last price you'll pay. The orange band in the diagram is this order.

## Order book heatmap: depth over time

An order book heatmap stacks snapshots of the book side by side, with time along the x axis, price up the y axis and colour showing the resting size at each price.

A depth chart is one moment. The heatmap keeps the history, so you can see how liquidity was placed, moved and removed:

- Bright horizontal lines are large orders that stayed at one price. The longer the line, the longer they rested.
- A line that ends where the price line meets it was traded through: the size was filled (or cancelled as the price arrived; the heatmap alone can't tell which).
- A line that ends while the price is still far away was cancelled.
- Short bright dashes are orders that appeared for a moment and were withdrawn.
- Dark bands near the price line are thin areas, where a market order would move the price further.
- The price (or mid) line runs through the gap between the bid side below and the ask side above.

What the heatmap can show depends on the data behind it. A feed that sends a snapshot once a second can miss an order that rests for half a second entirely, and a feed limited to ten levels a side shows nothing beyond them. In the live demo, setting the feed to one update a second turns the short dashes into blocks or hides them.

## Why displayed liquidity can vanish

Resting orders are cancelled much more often than they are filled, so the size shown in the book can change before anyone trades against it.

There are ordinary reasons for this. Market makers quote both sides and update their prices every time something changes, cancelling and replacing orders as they go. Other traders pull orders when news arrives or the price approaches. Algorithms split a large order into small pieces and move them around.

Some liquidity is never displayed. Many exchanges accept iceberg (reserve) orders, which show only part of their size and refill the displayed part as it trades, and some venues accept fully hidden orders. A depth chart built from displayed orders can therefore understate how much would actually trade at a price.

Placing orders with no intention of letting them trade is a different matter. In US futures and swaps markets, the Commodity Exchange Act, as amended by the Dodd-Frank Act, makes "spoofing (bidding or offering with the intent to cancel the bid or offer before execution)" unlawful, and the CFTC has published guidance on how it applies the rule. A large order that appears and then disappears is not proof of spoofing: the offence turns on intent, which the book alone can't show. The demo includes large orders that appear and are later cancelled, so you can see how they look in both charts.

## Market depth in crypto vs exchange-traded markets

Cryptocurrency exchanges, futures exchanges and share markets all use order books, but their data differs in where the book lives, how deep it goes and when it trades.

| | Crypto exchanges | Futures | US shares |
| --- | --- | --- | --- |
| Where the book is | Each exchange runs its own book for each pair | One exchange per contract | Many exchanges and other venues for the same stock |
| Trading hours | Usually around the clock, every day | Close to 24 hours on weekdays for many contracts, with breaks | Set sessions, with pre- and post-market trading |
| Depth commonly available | Often deep books (hundreds or thousands of levels) through public data feeds | A set number of price levels (market by price) or full market by order, from the exchange | Each venue's own depth; the best prices across venues are combined into the national best bid and offer (NBBO) |
| Size units | Coins or contracts; check whether size is in the base or quote currency | Contracts | Shares |

Because the same share or coin trades in many places, a depth chart from one venue shows only part of the liquidity. Consolidated views add venues together, but each venue's book still has its own queue and fees.

## Depth chart vs order book ladder vs heatmap vs footprint

Use a depth chart for liquidity on both sides at one moment, an order book ladder for exact prices and sizes, a heatmap for how depth changed over time, and a footprint for what actually traded.

| If the reader needs to… | Use |
| --- | --- |
| See at a glance how much size sits on each side of the price, and where the large orders are | Market depth chart |
| Read the exact size at each price to place or manage an order | Order book ladder (a DOM, or price ladder): a table of prices with bid and ask sizes, updated in place |
| See how resting liquidity built up, moved and disappeared over minutes or hours | Order book heatmap |
| See how much traded at each price inside each bar, and which side started the trades | [Footprint chart](/learn/chart-types/cartesian/footprint-chart/) |
| See open, high, low and close over time | [Candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) |
| See any value on a grid of two variables by colour, outside trading | [Heatmap](/learn/chart-types/cartesian/heatmap/) |

The depth chart and heatmap show resting orders, the passive side; the footprint and candlestick show trades. They are often used together: a heatmap with candles or a mid line over it, or a depth chart beside a price chart. For bars built from trade counts rather than time, see the [tick chart](/learn/chart-types/cartesian/tick-chart/).

## Common market depth chart mistakes

Most mistakes with depth charts come from treating a snapshot of displayed orders as a fixed amount of liquidity.

- **Treating a wall as a floor or ceiling.** A large order can be cancelled, filled or moved in a moment. It shows where size is now, not where the price will stop.
- **Forgetting the size you can't see.** Iceberg and hidden orders, other venues and levels beyond the feed's depth are all missing from the chart.
- **Reading cumulative height as size at one price.** The curve's height at a price is the total of every level up to it. The size at one level is the height of its step.
- **Comparing charts with different ranges.** The y axis rescales to whatever is in the x window, so a ±2% view and a ±10% view of the same book look very different.
- **Ignoring price grouping.** Many depth displays merge ticks into larger price steps, such as 0.05 or 1.00, to make the chart readable. Grouping moves where walls appear and hides gaps, so check the step before comparing two charts.
- **Trusting a slow or partial feed.** A conflated feed (one that sends the latest state at intervals) or a ten-level feed can hide short-lived orders and anything further out.
- **Mixing units.** On crypto venues, size may be quoted in the coin or in the currency it's priced in. Check before adding books together.

## How to create a market depth chart in JavaScript, React or Angular

The demo below simulates a limit order book with a 0.01 tick near 100.00 and advances it every 0.1 s of market time. Each feed update redraws the cumulative depth chart, and every 0.1 s adds a column to a heatmap of 801 price rows by 400 columns (40 seconds), with the mid price drawn over it. SciChart.js draws the depth curves and the heatmap with WebGL and WebGPU; the order book simulation is plain JavaScript.

Use **Liquidity** to switch the book between a balanced, a bid-heavy and a thin profile, and watch the imbalance in the readout. **Feed updates per second** slows the feed from 10 to 5 or 1: the heatmap then repeats each update until the next one, and short-lived orders disappear. Pick a size in **Market buy of** and press **Send market buy**: the order walks up the ask side of the live book, the readout gives the average fill price and the slippage, and the swept prices are marked on both charts. In the thin book, a buy of 20,000 can use up every ask level the simulation holds, and the readout reports what was left unfilled. **Pause** freezes the book; while paused, scroll to zoom, drag to pan, double-click to reset and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="market depth chart" demo="depth-chart" docs="/2d-charts/chart-types/fast-mountain-area-renderable-series/" docsLabel="SciChart.js mountain chart documentation" />

Here is the code for this demo. The order book, the cumulative depth, the imbalance and the market order are plain JavaScript; SciChart.js draws the two mountain series, the heatmap, the mid line and the annotations. The React and Angular versions below draw a depth chart from your own book.

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
        XyDataSeries,
        FastMountainRenderableSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Cumulative size as a step outline: two points per price level, so the curve steps instead of sloping
    const steps = (levels: { price: number; size: number }[]) => {
        const x: number[] = [];
        const y: number[] = [];
        let total = 0;
        for (const level of levels) {
            x.push(level.price, level.price);
            y.push(total, (total += level.size));
        }
        return { x, y };
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Price", labelPrecision: 2 }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Cumulative size", autoRange: EAutoRange.Always, growBy: new NumberRange(0, 0.1) })
        );

        // bids: best (highest) price first; asks: best (lowest) price first
        const { bids, asks } = getYourOrderBook();
        const bidSteps = steps(bids);
        const askSteps = steps(asks);
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                // x must increase, so reverse the bid side
                dataSeries: new XyDataSeries(wasmContext, { xValues: bidSteps.x.reverse(), yValues: bidSteps.y.reverse(), dataSeriesName: "Bids" }),
                stroke: "#26a69a",
                fill: "#26a69a66"
            }),
            new FastMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: askSteps.x, yValues: askSteps.y, dataSeriesName: "Asks" }),
                stroke: "#ef5350",
                fill: "#ef535066"
            })
        );
        sciChartSurface.chartModifiers.add(new CursorModifier(), new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const MarketDepthChart = () => (
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
        XyDataSeries,
        FastMountainRenderableSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Cumulative size as a step outline: two points per price level, so the curve steps instead of sloping
    const steps = (levels: { price: number; size: number }[]) => {
        const x: number[] = [];
        const y: number[] = [];
        let total = 0;
        for (const level of levels) {
            x.push(level.price, level.price);
            y.push(total, (total += level.size));
        }
        return { x, y };
    };

    @Component({
        selector: "app-market-depth-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class MarketDepthChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Price", labelPrecision: 2 }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { axisTitle: "Cumulative size", autoRange: EAutoRange.Always, growBy: new NumberRange(0, 0.1) })
            );

            // bids: best (highest) price first; asks: best (lowest) price first
            const { bids, asks } = getYourOrderBook();
            const bidSteps = steps(bids);
            const askSteps = steps(asks);
            sciChartSurface.renderableSeries.add(
                new FastMountainRenderableSeries(wasmContext, {
                    // x must increase, so reverse the bid side
                    dataSeries: new XyDataSeries(wasmContext, { xValues: bidSteps.x.reverse(), yValues: bidSteps.y.reverse(), dataSeriesName: "Bids" }),
                    stroke: "#26a69a",
                    fill: "#26a69a66"
                }),
                new FastMountainRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: askSteps.x, yValues: askSteps.y, dataSeriesName: "Asks" }),
                    stroke: "#ef5350",
                    fill: "#ef535066"
                })
            );
            sciChartSurface.chartModifiers.add(new CursorModifier(), new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each side of the depth chart is a [FastMountainRenderableSeries](/2d-charts/chart-types/fast-mountain-area-renderable-series/) over an `XyDataSeries`. Every price level gets two points at the same x (the total before and after its size), which draws exact steps on both sides. The [digital (step) mountain series](/2d-charts/chart-types/fast-mountain-area-digital-renderable-series/) also draws steps, but it holds each value to the right, which suits the ask side and not the bid side.
- The heatmap is a [UniformHeatmapRenderableSeries](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) over a `UniformHeatmapDataSeries`: `zValues[row][column]`, one row per tick and one column per 0.1 s. Each step shifts every row left, appends the newest column, moves `xStart` on and calls `setZValues` (see [updating a heatmap in real time](/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/)). A `HeatmapColorMap` turns size into colour.
- The mid price line is a `FastLineRenderableSeries` over an `XyDataSeries` with `fifoCapacity` set to the heatmap's 400 columns, so old points drop off as new ones arrive.
- The mid line is a `VerticalLineAnnotation`, and the market buy's sweep is a `BoxAnnotation` in data coordinates with `yCoordinateMode: ECoordinateMode.Relative`, so it spans the chart's full height. The imbalance in the readout is computed over every level within 1% of the mid, wider than the ±0.60 shown.

**See it in the demo app:** [JavaScript market depth chart](https://www.scichart.com/demo/javascript/depth-chart) · [React market depth chart](https://www.scichart.com/demo/react/depth-chart) · [Angular market depth chart](https://www.scichart.com/demo/angular/depth-chart), and over time, [JavaScript order book heatmap](https://www.scichart.com/demo/javascript/order-book-heatmap) · [React order book heatmap](https://www.scichart.com/demo/react/order-book-heatmap) · [Angular order book heatmap](https://www.scichart.com/demo/angular/order-book-heatmap).

**Go deeper:** [SciChart.js mountain chart documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/), the [heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) and the [heatmap guide](/learn/chart-types/cartesian/heatmap/). For how trading software uses SciChart, see [SciChart for financial and stock trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/).

## Building a full trading app?

[SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, has market depth built in. Its [market depth panel](/financial-charts/ui-components/market-depth/) shows a live order book as a price ladder beside a trading chart, with a running total and a depth bar on each rung, and shows what sweeping the book to any rung would cost. Its order book heatmap and imbalance studies draw the book's history behind the candles. Both read from an order book source you implement for your exchange or server; see [order book data](/financial-charts/data-sources/order-book-data/). See what it can do on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What is market depth?

Market depth is the quantity of buy and sell orders waiting in an order book at each price, not just at the best bid and ask. A deep market has plenty of size close to the current price, so a large order moves the price only a little; a thin market has little, so the same order moves it further.

### How do you read a market depth chart?

Start in the middle, at the gap between the green bid curve and the red ask curve: its edges are the best bid and best ask, and its width is the spread. Moving outwards, the height of each curve is the total size you could sell (bids, to the left) or buy (asks, to the right) down or up to that price. Steep curves mean deep liquidity, flat curves mean thin liquidity, and a sudden vertical jump is a large order, often called a wall.

### What is the difference between top of book and market depth?

Top of book (level 1) is only the best bid and best ask, with the size at each. Market depth (level 2, or market by price) adds the total size at further price levels on both sides. Market by order goes one step further and lists every individual order in the queue at each price.

### What is an order book heatmap?

An order book heatmap shows market depth over time. Time runs along the x axis, price up the y axis, and the colour of each cell is the resting size at that price at that moment. Bright horizontal lines are large orders that stayed in the book; a line that stops before the price reaches it is usually an order that was cancelled or moved (or, on a feed limited to a few levels, a price that moved out of view).

### Why does liquidity disappear from the order book?

Most resting orders are cancelled rather than filled: market makers and other traders move their quotes as prices and risk change, so displayed size comes and goes. Some size is never displayed at all, such as iceberg or hidden orders. Deliberately placing orders with the intent to cancel them before execution is called spoofing, and it is illegal in US futures markets under the Commodity Exchange Act.

### How do I build a market depth chart in JavaScript?

Sort the bids from the best price down and the asks from the best price up, add up the sizes as you go, and give each price level two points so the curve steps instead of sloping. Plot the two cumulative series as filled mountain (area) series on a price axis. With SciChart.js that is two `FastMountainRenderableSeries` over `XyDataSeries`; for an order book heatmap, add a `UniformHeatmapRenderableSeries` whose columns you shift as new snapshots arrive. In React or Angular, the same function runs inside `scichart-react` or `scichart-angular`.

## Sources

- Harris, L. (2003), *Trading and Exchanges: Market Microstructure for Practitioners*. Oxford University Press. The standard text on order books, order types, priority rules, liquidity and hidden orders.
- Gould, M. D., Porter, M. A., Williams, S., McDonald, M., Fenn, D. J. and Howison, S. D. (2013), [Limit order books](https://doi.org/10.1080/14697688.2013.803148). *Quantitative Finance*, 13(11), 1709–1742. A review of how limit order books work and what studies of them have found, including how many orders are cancelled rather than filled.
- Cont, R., Kukanov, A. and Stoikov, S. (2014), [The price impact of order book events](https://doi.org/10.1093/jjfinec/nbt003). *Journal of Financial Econometrics*, 12(1), 47–88. Links short-term price changes to the imbalance of order flow at the best bid and ask.
- CME Group, [Market by Order (MBO)](https://www.cmegroup.com/education/market-by-order-mbo.html) and [MDP 3.0: Market by Price, multiple depth book](https://cmegroupclientsite.atlassian.net/wiki/spaces/EPICSANDBOX/pages/457574047/MDP+3.0+-+Market+by+Price+-+Multiple+Depth+Book). How an exchange publishes depth by price level and by individual order.
- Stoikov, S. (2018), [The micro-price: a high-frequency estimator of future prices](https://doi.org/10.1080/14697688.2018.1489139). *Quantitative Finance*, 18(12), 1959–1966. Defines the micro-price, an estimate of the mid that takes account of order book imbalance and the spread.
- Commodity Futures Trading Commission (2013), [Antidisruptive Practices Authority](https://www.cftc.gov/LawRegulation/FederalRegister/finalrules/2013-12365.html), 78 FR 31890. Interpretive guidance on the spoofing prohibition in section 4c(a)(5)(C) of the Commodity Exchange Act.
- U.S. Securities and Exchange Commission, Investor.gov, [National best bid and offer (NBBO)](https://www.investor.gov/introduction-investing/investing-basics/glossary/national-best-bid-and-offer-nbbo).

<LearnCta position="bottom" chart="market depth chart" demo="depth-chart" docs="/2d-charts/chart-types/fast-mountain-area-renderable-series/" docsLabel="SciChart.js mountain chart documentation" />
