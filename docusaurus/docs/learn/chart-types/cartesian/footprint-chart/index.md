---
sidebar_position: 130
sidebar_label: Footprint Chart
title: "Footprint Chart: How to Read Order Flow, Bid/Ask Volume and Delta (With an Interactive Example)"
description: "What a footprint chart is, how to read bid and ask volume at each price, delta and cumulative delta, the point of control, value area and diagonal imbalances, and the data you need. With a live example."
keywords:
    [
        "footprint chart",
        "what is a footprint chart",
        "how to read a footprint chart",
        "footprint chart trading",
        "order flow chart",
        "bid ask footprint",
        "volume footprint",
        "delta footprint",
        "imbalance footprint",
        "stacked imbalance",
        "cluster chart",
        "footprint chart vs volume profile"
    ]
image: /img/learn/footprint-chart-og.png
related: [candlestick-chart, tick-chart, renko-chart, ohlc-chart]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a footprint chart show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A footprint chart shows how much volume traded at each price inside each bar, split into volume sold at the bid and volume bought at the ask. Where a candlestick shows only the open, high, low and close, a footprint shows where in the bar the trading happened and which side started each trade." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a footprint chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Read one bar at a time. Each row is a price; the left number is volume sold at the bid and the right number is volume bought at the ask. Find the busiest row (the point of control), read the bar's delta (ask volume minus bid volume) underneath, then look for highlighted imbalances, where one side traded several times as much as the other." }
                },
                {
                    "@type": "Question",
                    "name": "What is delta on a footprint chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Delta is the volume bought at the ask minus the volume sold at the bid. A positive delta means buyers who crossed the spread traded more contracts than sellers who did; a negative delta means the reverse. It is shown per price row, per bar and, added up from bar to bar, as cumulative delta." }
                },
                {
                    "@type": "Question",
                    "name": "What is a diagonal imbalance?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A diagonal imbalance compares the volume bought at the ask at one price with the volume sold at the bid one row lower: at any moment, those two prices are the ask and bid of a single quote. If the ask side is at least the chosen ratio, often 300%, of the bid side, the cell is highlighted as an ask imbalance; the mirror comparison gives a bid imbalance. Three or more in a row are called stacked imbalances." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a footprint chart and a volume profile?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A volume profile adds up the volume at each price over a whole session or range and draws it as one horizontal histogram. A footprint chart keeps the volume at each price separate for every bar and splits it into bid and ask, so you can see how the trading changed from bar to bar and which side was more aggressive." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a footprint chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Aggregate your trades into bid and ask volume per bar and price row, then draw each row as two rectangles and two numbers. With SciChart.js, use a FastRectangleRenderableSeries with an XyxyDataSeries for the cells, a FastTextRenderableSeries for the volumes and a FastCandlestickRenderableSeries for the candles. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Footprint Chart

## What is a footprint chart?

A **footprint chart** (also called a cluster chart, bid/ask footprint or order flow chart) is a price chart that opens up each candle to show the volume traded at every price inside it. Each row splits that volume into trades at the bid (sellers crossing the spread) and at the ask (buyers crossing it), so you can see where and how the bar was built.

![A dark navy footprint chart of six five-minute bars: each bar is a column of price rows with sell volume in red on the left and buy volume in green on the right, the busiest row outlined in yellow, bright green and red cells marking imbalances, and a pane underneath with green and red delta columns and a cumulative delta line](/img/learn/footprint-chart-og.png)

*A footprint chart of six five-minute bars, with bid × ask volume at each price, the point of control outlined and a delta pane underneath (simulated trades). [Try the interactive version](#how-to-create-a-footprint-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A footprint bar is a candle broken into price rows, with the volume sold at the bid on the left and bought at the ask on the right.
- Delta is ask volume minus bid volume: per row, per bar and, added up over time, as cumulative delta.
- The point of control is the busiest price in a bar; the value area is the band around it that holds about 70% of the bar's volume.
- Imbalances compare the ask at one price with the bid one row lower: diagonally, because those are the two sides of one quote.
- You need trade-by-trade data that records which side started each trade. Bars of open, high, low and close aren't enough.
:::

## What a footprint chart shows

Every trade has two sides, so total buying always equals total selling. What differs is who started the trade. A trader who sends a market order to buy pays the **ask**, the lowest price anyone is offering to sell at. A trader who sells at market accepts the **bid**, the highest price anyone is offering to pay. The side that crosses the spread is called the **aggressor**; the side whose order was already waiting in the order book is passive.

A footprint chart counts volume by aggressor:

- **Bid volume** (often drawn on the left, in red): contracts or shares traded at the bid, started by sellers.
- **Ask volume** (on the right, in green): contracts or shares traded at the ask, started by buyers.

It counts them separately for every price row in every bar. A row is usually one **tick**, the smallest price step the market allows (0.25 index points on some stock index futures, for example), or a few ticks merged together. A five-minute bar that traded across 12 ticks becomes a column of 12 rows with two numbers each, instead of a single candle.

Where a candlestick answers "where did the price go?", a footprint answers "at which prices did the trading happen, and which side was pushing?". The chart describes what traded; it says nothing certain about what happens next. This page explains how footprint charts are built and read, and is not investment advice.

## How to read a footprint chart

![Anatomy of one footprint bar: five price rows from 5,001.00 to 5,002.00 with bid volume on the left and ask volume on the right, the busiest row outlined as the point of control, a value area bracket, an arrow comparing 150 at the ask with 40 at the bid one row lower as a 375% ask imbalance, a thin candle beside the rows and a delta row underneath](./footprint-anatomy.svg)

1. Check the bar length and row size. The bar might cover one minute, five minutes or a fixed number of trades; each row might be one tick or several. Both change the numbers.
2. Find the bar's open, high, low and close. Most footprints draw a thin candle beside or through the rows, or colour the rows' outline.
3. Read a row from left to right. "64 × 150" at 5,001.75 means 64 contracts were sold at the bid and 150 bought at the ask at that price during the bar.
4. Find the point of control (POC), the row with the most total volume, usually outlined or shaded. It shows where the bar did most of its business.
5. Read the delta under the bar: ask volume minus bid volume for the whole bar. Compare its sign with the candle's colour.
6. Look for highlighted cells. Most charts colour a cell when one side traded several times as much as the other, measured diagonally (see [Diagonal and stacked imbalances](#diagonal-and-stacked-imbalances)).
7. Look at where volume thins out. A row at the very top or bottom of a bar with almost no volume on one side shows where trading stopped.

## A worked example: one footprint bar

Here is the bar from the diagram, five rows one tick (0.25) tall. The bar opened at 5,001.25, traded between 5,001.00 and 5,002.00, and closed at 5,001.75.

| Price | Bid (sold) | Ask (bought) | Total | Delta (ask − bid) |
| --- | --- | --- | --- | --- |
| 5,002.00 | 6 | 22 | 28 | +16 |
| 5,001.75 | 64 | 150 | 214 | +86 |
| 5,001.50 | 40 | 118 | 158 | +78 |
| 5,001.25 | 131 | 45 | 176 | −86 |
| 5,001.00 | 88 | 14 | 102 | −74 |
| Bar | 329 | 349 | 678 | +20 |

What the numbers say:

- Volume: 678 contracts in total.
- Delta: 349 − 329 = +20. Buyers and sellers who crossed the spread traded almost the same amount over the bar.
- Point of control: 5,001.75, with 214 contracts.
- Value area: start at the POC (214), add the busier neighbour, 5,001.50 (158), then the busier neighbour again, 5,001.25 (176). The three rows hold 548 of 678 contracts (81%), past the 70% mark, so the value area runs from 5,001.25 to 5,001.75.
- Imbalances at 300%: 150 at the ask at 5,001.75 against 40 at the bid at 5,001.50 is 375%, an ask imbalance. No other pair reaches 300%.

The lower two rows were dominated by selling (delta −86 and −74), the upper three by buying, and the busiest trading happened near the top. The candle and the bar delta of +20 show none of that split: on their own they look like an ordinary small rise.

### How the row size changes the picture

Merge the same trades into rows two ticks (0.50) tall and the bar has three rows: 5,001.00–5,001.25 with 219 × 59, 5,001.50–5,001.75 with 104 × 268, and 5,002.00 with 6 × 22. The ask imbalance disappears: 268 at the ask against 219 at the bid one row lower is only 122%. Bigger rows make the chart easier to read on screen and smooth out single-tick spikes, but they also hide detail. Try the Row size control in the demo below to see it happen.

## Types of footprint chart

The same bid and ask counts can be drawn in several ways. Most tools let you switch between them.

| Layout | What each row shows | Good for |
| --- | --- | --- |
| Bid × ask | Two numbers, bid volume and ask volume, often on coloured cells | Seeing both sides and finding imbalances |
| Volume (total) | One number: bid + ask | Seeing where the bar traded, without the split |
| Delta | One number: ask − bid, coloured green or red | Seeing at a glance which prices buyers or sellers drove |
| Volume profile per bar | A horizontal bar per row, its length set by volume, often split into bid and ask colours | Seeing the shape of each bar's volume, even zoomed out |
| Imbalance highlighting | Any of the above, with cells coloured when one side outweighs the other diagonally | Spotting one-sided trading quickly |

Most footprints also add a summary row under each bar (volume, delta, sometimes the lowest and highest delta reached during the bar) and a candle or outline to show the open, high, low and close.

## Delta and cumulative delta

**Delta** is ask volume minus bid volume. It can be read at three scales:

- Per row: which side was more aggressive at that price.
- Per bar: the total for the bar, usually printed underneath it or drawn as a column in a pane below.
- **Cumulative delta**: the bar deltas added up from the start of a session, drawn as a line. It shows whether aggressive buying or selling has dominated over a longer stretch.

Delta measures which side was aggressive. It isn't a measure of money flowing in or out, because every contract bought at the ask was sold by someone whose order was waiting at that price. A positive delta with a falling price is common, for example, when passive sellers with large resting orders absorb the buying. Comparing delta with what the price did is the main way delta is used, which is why the demo draws bar delta and cumulative delta in a pane aligned with the bars.

## Point of control and value area

These two ideas come from market profile analysis, which studies how volume (or time) is spread across prices.

- **Point of control (POC):** the price row with the most volume in the bar. When two rows tie, tools differ on which one they mark.
- **Value area:** the range of rows around the POC that holds a set share of the bar's volume, usually 70%. The 70% figure comes from market profile practice, where it was chosen as roughly one standard deviation of a normal distribution.

A common way to build the value area is to start at the POC and keep adding the busier neighbouring row (above or below) until the share is reached, as in the worked example. Some tools compare two rows at a time instead, or use 68% or 80%, so the edges can differ by a row or two between tools.

On a session-wide volume profile the POC and value area describe the whole day. On a footprint they are per bar, so you can follow how the busiest price moved from bar to bar.

## Diagonal and stacked imbalances

An **imbalance** is a row where one side traded several times as much as the other. The threshold is a setting, typically 150% to 400%; 300% is a common default.

The comparison is made diagonally, not across the row. At any moment the ask is one tick above the bid. A buyer who lifts the ask at 5,001.75 is trading against the same quote as a seller who hits the bid at 5,001.50. So the fair comparison for ask volume at one price is bid volume one row lower:

- **Ask imbalance** at price P: ask volume at P ≥ threshold × bid volume at P − 1 row.
- **Bid imbalance** at price P: bid volume at P ≥ threshold × ask volume at P + 1 row.

Two practical details change what gets highlighted. Most tools ignore rows with very small volumes (a 3 against a 1 is 300% but means little), and they handle the top and bottom rows differently because one side of the comparison is missing. The demo ignores cells under 10 contracts and never flags the edge rows.

A **stacked imbalance** is three or more imbalances on the same side in consecutive rows. It marks a stretch of prices where one side kept crossing the spread while the price moved through several ticks. Traders often note these price zones and watch how the price behaves when it returns to them. That describes how the chart is used; it is not evidence that the zones hold or that the price will react there.

## The data a footprint chart needs

A footprint can't be built from candles. It needs every trade, or at least volume per price per bar, with the aggressor side:

- Price, size and time of each trade.
- Aggressor side: buy or sell. Some exchange feeds publish it with each trade. CME Group's market data, for example, carries an aggressor side field on its trade summary messages.
- Where the side isn't published, it has to be inferred, usually by comparing the trade price with the bid and ask quoted just before it. The Lee and Ready algorithm is the classic method; any inference misclassifies some trades.

Volumes add up fast. A liquid market can print many thousands of trades an hour, so a day of footprints for one market is typically aggregated on a server into a compact grid (bar, price row, bid volume, ask volume) and sent to the browser in a binary or columnar format. See [time series data formats](/learn/big-data/time-series-data-formats/) for how to keep that small. Cryptocurrency exchanges' public trade feeds usually include the taker side, which plays the same role as the aggressor side.

## Footprint chart vs candlestick chart vs volume profile

| If the reader needs to… | Use |
| --- | --- |
| See open, high, low and close for each period, and the overall trend | [Candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) or [OHLC chart](/learn/chart-types/cartesian/ohlc-chart/) |
| See at which prices a whole session or range traded most | [Volume profile](/financial-charts/studies-and-indicators/add-indicators/volume-profile/): one horizontal histogram for the range |
| See volume at each price inside each bar, and which side was aggressive | Footprint chart |
| See resting orders waiting in the book, not trades | A market depth (order book) chart or an order book [heatmap](/learn/chart-types/cartesian/heatmap/) |
| See how volume is distributed in general, outside of trading | A [histogram](/learn/chart-types/cartesian/histogram/) |

A footprint is a candlestick with the volume profile moved inside each bar. It is dense, so it works best zoomed in to a handful of bars; zoomed out, it falls back to candles, as the demo does.

## Common footprint chart mistakes

- **Reading bid and ask as buyers and sellers in total.** Every trade has a buyer and a seller. Bid and ask volume tell you who crossed the spread, not who "won".
- **Mixing data sources.** Feeds for the same market can split or bundle trades differently, and only some publish the aggressor side, so footprints built from different feeds don't match row for row.
- **Ignoring the row size and bar length.** Change either and the volumes, imbalances and POC change too. Two footprints are only comparable with the same settings.
- **Trusting inferred aggressor sides blindly.** If your feed doesn't publish the side, some trades will be classified wrongly, especially in fast markets.
- **Treating tiny volumes as signals.** A 300% imbalance on 4 contracts against 1 is noise. Set a minimum volume.
- **Too many bars on screen.** With dozens of bars, the numbers become unreadable. Zoom in, use a larger row size, or switch to the volume profile or delta layout.

## How to create a footprint chart in JavaScript, React or Angular

A footprint draws hundreds of cells and numbers per screen and has to redraw them on every zoom, pan and new trade. SciChart.js draws with WebGL, so the cells, candles and text stay smooth as you zoom from a whole session of candles into single bars, and it keeps up with live, tick-by-tick updates. The demo follows the approach of SciChart's footprint chart example ([CandlestickToFootprintZoom on GitHub](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v6.x/Sandbox/CustomerExamples/CandlestickToFootprintZoom)): one chart of candles that turns into a footprint when the bars are wide enough. It simulates about 28,000 trades in the browser and aggregates them into 40 five-minute bars.

Scroll to zoom and drag to pan; the bars switch between candles and footprints by width, and the numbers appear when there's room. **Zoom out to candles** and **Zoom in to footprint** jump between the two views, and double-click resets. **Display** switches between bid × ask, a volume profile per bar and delta per row. **Imbalance** sets the diagonal threshold (or turns it off), and stacked imbalances appear as bars beside the rows. **Row size** merges ticks into larger rows. **Value area (70%)** shades each bar's value area; the yellow outline is the point of control.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="footprint chart" demo="candlestick-chart" demoLabel="candlestick chart" docs="/2d-charts/chart-types/fast-candlestick-renderable-series/" docsLabel="SciChart.js candlestick chart documentation" />

Here is the code for this chart. The order flow maths (rows, delta, POC, value area and imbalances) is plain JavaScript; SciChart.js draws the cells as rectangles, the volumes as text and the candles as a candlestick series.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        EAxisAlignment,
        OhlcDataSeries,
        FastCandlestickRenderableSeries,
        XyxyDataSeries,
        FastRectangleRenderableSeries,
        EColumnMode,
        EColumnYMode,
        XyTextDataSeries,
        FastTextRenderableSeries,
        EHorizontalTextPosition,
        EVerticalTextPosition,
        EFillPaletteMode,
        EStrokePaletteMode,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Right, labelPrecision: 2 }));

        // Each bar: x (bar index), open, high, low, close and its rows: { top, bottom, bid, ask }
        const bars = getYourFootprintData();
        const ohlc = new OhlcDataSeries(wasmContext);
        const cells = new XyxyDataSeries(wasmContext, { dataIsSortedInX: false });
        const labels = new XyTextDataSeries(wasmContext, { dataIsSortedInX: false });
        const colours: number[] = [];
        for (const bar of bars) {
            ohlc.append(bar.x, bar.open, bar.high, bar.low, bar.close);
            for (const row of bar.rows) {
                cells.append(bar.x - 0.4, row.top, bar.x, row.bottom); // bid cell, left half
                cells.append(bar.x, row.top, bar.x + 0.4, row.bottom); // ask cell, right half
                colours.push(0x80ef5350, 0x8026a69a); // ARGB: red for bid, green for ask
                labels.append(bar.x - 0.2, (row.top + row.bottom) / 2, String(row.bid));
                labels.append(bar.x + 0.2, (row.top + row.bottom) / 2, String(row.ask));
            }
        }
        const colourPerCell = {
            fillPaletteMode: EFillPaletteMode.SOLID,
            strokePaletteMode: EStrokePaletteMode.SOLID,
            isRangeIndependant: true,
            onAttached: () => {},
            onDetached: () => {},
            overrideFillArgb: (x: number, y: number, index: number) => colours[index],
            overrideStrokeArgb: (x: number, y: number, index: number) => colours[index]
        };
        sciChartSurface.renderableSeries.add(
            new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: cells,
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                paletteProvider: colourPerCell
            }),
            new FastCandlestickRenderableSeries(wasmContext, { dataSeries: ohlc, dataPointWidth: 0.03 }),
            new FastTextRenderableSeries(wasmContext, {
                dataSeries: labels,
                dataLabels: {
                    style: { fontSize: 12, fontFamily: "Arial" },
                    color: "#F2F5FA",
                    horizontalTextPosition: EHorizontalTextPosition.Center,
                    verticalTextPosition: EVerticalTextPosition.Center
                }
            })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const FootprintChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 600 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        EAxisAlignment,
        OhlcDataSeries,
        FastCandlestickRenderableSeries,
        XyxyDataSeries,
        FastRectangleRenderableSeries,
        EColumnMode,
        EColumnYMode,
        XyTextDataSeries,
        FastTextRenderableSeries,
        EHorizontalTextPosition,
        EVerticalTextPosition,
        EFillPaletteMode,
        EStrokePaletteMode,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-footprint-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 600px"></scichart-angular>`
    })
    export class FootprintChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Right, labelPrecision: 2 }));

            // Each bar: x (bar index), open, high, low, close and its rows: { top, bottom, bid, ask }
            const bars = getYourFootprintData();
            const ohlc = new OhlcDataSeries(wasmContext);
            const cells = new XyxyDataSeries(wasmContext, { dataIsSortedInX: false });
            const labels = new XyTextDataSeries(wasmContext, { dataIsSortedInX: false });
            const colours: number[] = [];
            for (const bar of bars) {
                ohlc.append(bar.x, bar.open, bar.high, bar.low, bar.close);
                for (const row of bar.rows) {
                    cells.append(bar.x - 0.4, row.top, bar.x, row.bottom); // bid cell, left half
                    cells.append(bar.x, row.top, bar.x + 0.4, row.bottom); // ask cell, right half
                    colours.push(0x80ef5350, 0x8026a69a); // ARGB: red for bid, green for ask
                    labels.append(bar.x - 0.2, (row.top + row.bottom) / 2, String(row.bid));
                    labels.append(bar.x + 0.2, (row.top + row.bottom) / 2, String(row.ask));
                }
            }
            const colourPerCell = {
                fillPaletteMode: EFillPaletteMode.SOLID,
                strokePaletteMode: EStrokePaletteMode.SOLID,
                isRangeIndependant: true,
                onAttached: () => {},
                onDetached: () => {},
                overrideFillArgb: (x: number, y: number, index: number) => colours[index],
                overrideStrokeArgb: (x: number, y: number, index: number) => colours[index]
            };
            sciChartSurface.renderableSeries.add(
                new FastRectangleRenderableSeries(wasmContext, {
                    dataSeries: cells,
                    columnXMode: EColumnMode.StartEnd,
                    columnYMode: EColumnYMode.TopBottom,
                    paletteProvider: colourPerCell
                }),
                new FastCandlestickRenderableSeries(wasmContext, { dataSeries: ohlc, dataPointWidth: 0.03 }),
                new FastTextRenderableSeries(wasmContext, {
                    dataSeries: labels,
                    dataLabels: {
                        style: { fontSize: 12, fontFamily: "Arial" },
                        color: "#F2F5FA",
                        horizontalTextPosition: EHorizontalTextPosition.Center,
                        verticalTextPosition: EVerticalTextPosition.Center
                    }
                })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each footprint cell is a rectangle in a [FastRectangleRenderableSeries](/2d-charts/chart-types/fast-rectangle-renderable-series/) over an `XyxyDataSeries`, with `columnXMode: EColumnMode.StartEnd` and `columnYMode: EColumnYMode.TopBottom`, so x to x1 is the cell's width and y to y1 its height. A palette provider gives every cell its own colour from an array, which is how volume shading and imbalance highlights are drawn.
- The volumes are a [FastTextRenderableSeries](/2d-charts/chart-types/fast-text-renderable-series/) with an `XyTextDataSeries`: one string per x and y, centred with `EHorizontalTextPosition.Center` and `EVerticalTextPosition.Center`. The demo only builds text for the bars on screen and hides it when the rows are too small to read.
- The candles are a [FastCandlestickRenderableSeries](/2d-charts/chart-types/fast-candlestick-renderable-series/). Setting `dataPointWidth` to 0.03 turns each candle into a thin line through its footprint; 0.7 gives normal candles when zoomed out.
- The delta pane is a second chart with a `FastColumnRenderableSeries` and a `FastLineRenderableSeries` on two y axes. A `SciChartVerticalGroup` lines up the two panes' axes, and each x axis's `visibleRangeChanged` event keeps them zoomed together.

**See it in the demo app:** [JavaScript candlestick chart](https://www.scichart.com/demo/javascript/candlestick-chart) · [React candlestick chart](https://www.scichart.com/demo/react/candlestick-chart) · [Angular candlestick chart](https://www.scichart.com/demo/angular/candlestick-chart), and for resting orders rather than trades, [JavaScript depth chart](https://www.scichart.com/demo/javascript/depth-chart) · [React depth chart](https://www.scichart.com/demo/react/depth-chart) · [Angular depth chart](https://www.scichart.com/demo/angular/depth-chart).

**Go deeper:** [SciChart.js candlestick chart documentation](/2d-charts/chart-types/fast-candlestick-renderable-series/), the [rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/) and [text series documentation](/2d-charts/chart-types/fast-text-renderable-series/) for the cells and numbers, and the [candlestick chart guide](/learn/chart-types/cartesian/candlestick-chart/). For how trading software uses SciChart, see [SciChart for financial and stock trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/).

## Building a full trading chart?

[SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, gives you a ready-made trading chart with candlesticks, live exchange feeds, technical indicators including a [volume profile](/financial-charts/studies-and-indicators/add-indicators/volume-profile/), drawing tools and multiple panes, in JavaScript, TypeScript and React. See what it can do on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What does a footprint chart show?

A footprint chart shows how much volume traded at each price inside each bar, split into volume sold at the bid and volume bought at the ask. Where a candlestick shows only the open, high, low and close, a footprint shows where in the bar the trading happened and which side started each trade.

### How do you read a footprint chart?

Read one bar at a time. Each row is a price; the left number is volume sold at the bid and the right number is volume bought at the ask. Find the busiest row (the point of control), read the bar's delta (ask volume minus bid volume) underneath, then look for highlighted imbalances, where one side traded several times as much as the other.

### What is delta on a footprint chart?

Delta is the volume bought at the ask minus the volume sold at the bid. A positive delta means buyers who crossed the spread traded more contracts than sellers who did; a negative delta means the reverse. It is shown per price row, per bar and, added up from bar to bar, as cumulative delta.

### What is a diagonal imbalance?

A diagonal imbalance compares the volume bought at the ask at one price with the volume sold at the bid one row lower: at any moment, those two prices are the ask and bid of a single quote. If the ask side is at least the chosen ratio, often 300%, of the bid side, the cell is highlighted as an ask imbalance; the mirror comparison gives a bid imbalance. Three or more in a row are called stacked imbalances.

### What is the difference between a footprint chart and a volume profile?

A volume profile adds up the volume at each price over a whole session or range and draws it as one horizontal histogram. A footprint chart keeps the volume at each price separate for every bar and splits it into bid and ask, so you can see how the trading changed from bar to bar and which side was more aggressive.

### How do I make a footprint chart in JavaScript?

Aggregate your trades into bid and ask volume per bar and price row, then draw each row as two rectangles and two numbers. With SciChart.js, use a `FastRectangleRenderableSeries` with an `XyxyDataSeries` for the cells, a `FastTextRenderableSeries` for the volumes and a `FastCandlestickRenderableSeries` for the candles. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- CME Group, [MDP 3.0: Trade Summary](https://cmegroupclientsite.atlassian.net/wiki/spaces/EPICSANDBOX/pages/457418925/MDP+3.0+-+Trade+Summary). The exchange's market data specification, including the aggressor side field (buy, sell or none) published with each trade.
- Lee, C. M. C. and Ready, M. J. (1991), [Inferring trade direction from intraday data](https://doi.org/10.1111/j.1540-6261.1991.tb02683.x). *The Journal of Finance*, 46(2), 733–746. The standard method for classifying trades as buyer- or seller-initiated when the feed doesn't say.
- Cont, R., Kukanov, A. and Stoikov, S. (2014), [The price impact of order book events](https://doi.org/10.1093/jjfinec/nbt003). *Journal of Financial Econometrics*, 12(1), 47–88. A study linking short-term price changes to the imbalance between buying and selling pressure at the best bid and ask.
- Wikipedia, [Market profile](https://en.wikipedia.org/wiki/Market_profile). The origin of the point of control and the 70% value area.

<LearnCta position="bottom" chart="footprint chart" demo="candlestick-chart" demoLabel="candlestick chart" docs="/2d-charts/chart-types/fast-candlestick-renderable-series/" docsLabel="SciChart.js candlestick chart documentation" />
