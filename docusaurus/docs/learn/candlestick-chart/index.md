---
sidebar_position: 2
sidebar_label: Candlestick Chart
title: "Candlestick Chart: What It Is, How to Read It & JavaScript Examples"
description: "What a candlestick chart is, how to read open, high, low and close, when to use one, and how to build an interactive candlestick chart in JavaScript, React or Angular with SciChart.js."
keywords:
    [
        "candlestick chart",
        "candlestick",
        "candle chart",
        "how to read a candlestick chart",
        "candlestick vs ohlc chart",
        "javascript candlestick chart",
        "react candlestick chart",
        "angular candlestick chart"
    ]
image: /img/learn/candlestick-chart-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a candlestick chart show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Each candle shows four prices for one time period: the open, the high, the low and the close. The body spans the open and close; the thin wicks above and below reach the high and the low." }
                },
                {
                    "@type": "Question",
                    "name": "What do green and red candles mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A green (bullish) candle closed higher than it opened, so the price rose during the period. A red (bearish) candle closed lower than it opened, so the price fell." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a candlestick chart and an OHLC chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both show open, high, low and close. An OHLC chart draws each period as a vertical bar with a tick to the left for the open and a tick to the right for the close. A candlestick chart fills the range between open and close as a coloured body, which makes rising and falling periods easier to see at a glance." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a candlestick chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface, add a CategoryAxis and a NumericAxis, then add a FastCandlestickRenderableSeries with an OhlcDataSeries holding your x, open, high, low and close values. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                },
                {
                    "@type": "Question",
                    "name": "What is a doji candle?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A doji is a candle whose open and close are almost equal, so its body is a thin line. It shows that buyers and sellers ended the period roughly balanced." }
                }
            ]
        })}
    </script>
</head>

# Candlestick Chart

A **candlestick chart** shows how a price moved over time. Each candle covers one period, such as a minute, a day or a week, and shows four prices: where the price **opened**, its **high**, its **low** and where it **closed**. Traders use candlestick charts for stocks, forex, crypto and commodities because one glance shows both the direction and the range of each period.

Try the interactive chart below. Scroll to zoom, drag to pan, double-click to reset, and hover over a candle to see its values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="candlestick chart" demo="candlestick-chart" />

## How to read a candlestick chart

![Anatomy of a candlestick: a green bullish candle and a red bearish candle, with the open, high, low, close, body and wicks labelled](./candlestick-anatomy.svg)

- **The body** is the thick part. It spans the opening and closing price.
- **The colour** tells you the direction. A **green** (bullish) candle closed higher than it opened, so the price rose. A **red** (bearish) candle closed lower than it opened, so the price fell. Some charts use hollow and filled candles instead.
- **The wicks** (also called shadows) are the thin lines above and below the body. The top of the upper wick is the period's **high**; the bottom of the lower wick is its **low**.
- **The length** matters. A long body means a strong move in one direction. Long wicks mean the price moved a long way but was pushed back before the period ended.

### Common candlestick patterns

| Pattern | What it looks like | What traders read into it |
| --- | --- | --- |
| Doji | Open and close almost equal, so the body is a thin line | Buyers and sellers ended the period roughly balanced; can signal indecision |
| Hammer | Small body near the top, long lower wick | Sellers pushed the price down, buyers pushed it back up; can signal a reversal after a fall |
| Shooting star | Small body near the bottom, long upper wick | The opposite of a hammer; can signal a reversal after a rise |
| Bullish engulfing | A green body that completely covers the previous red body | Buyers took over from sellers |
| Bearish engulfing | A red body that completely covers the previous green body | Sellers took over from buyers |

## When to use a candlestick chart

Use a candlestick chart when your data has an **open, high, low and close for each period**, and the reader cares about how the price moved within each period, not just where it ended.

| Chart | Best for |
| --- | --- |
| **Candlestick chart** | Price action per period: direction, range and patterns, for trading and technical analysis |
| [OHLC chart](/2d-charts/chart-types/fast-ohlc-renderable-series/) | The same four prices drawn as bars with ticks; more compact when you show many periods |
| Line chart | Only the closing price over time; best for long-term trends and comparing several series |

Candlestick charts are often shown with **volume bars** underneath and with **technical indicators** such as moving averages, Bollinger Bands or RSI.

## How to create a candlestick chart in JavaScript, React or Angular

SciChart.js draws candlestick charts with WebGL and WebGPU, so they stay smooth with years of data and live, tick-by-tick updates. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        CategoryAxis,
        NumericAxis,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new CategoryAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrefix: "$", labelPrecision: 2 }));

        const { xValues, openValues, highValues, lowValues, closeValues } = getYourOhlcData();
        sciChartSurface.renderableSeries.add(
            new FastCandlestickRenderableSeries(wasmContext, {
                dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
                brushUp: "#26a69a",
                strokeUp: "#26a69a",
                brushDown: "#ef5350",
                strokeDown: "#ef5350"
            })
        );
        return { sciChartSurface };
    };

    export const CandlestickChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        CategoryAxis,
        NumericAxis,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-candlestick-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class CandlestickChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new CategoryAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrefix: "$", labelPrecision: 2 }));

            const { xValues, openValues, highValues, lowValues, closeValues } = getYourOhlcData();
            sciChartSurface.renderableSeries.add(
                new FastCandlestickRenderableSeries(wasmContext, {
                    dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
                    brushUp: "#26a69a",
                    strokeUp: "#26a69a",
                    brushDown: "#ef5350",
                    strokeDown: "#ef5350"
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- An [OhlcDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcdataseries.html) holds your data: one x value (a Unix timestamp in seconds) plus open, high, low and close values per candle.
- A [CategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) spaces candles evenly and closes gaps for weekends and holidays. For 24/7 markets such as crypto, a `DateTimeNumericAxis` works too.
- `brushUp`, `brushDown`, `strokeUp` and `strokeDown` set the bullish and bearish colours.

**See it in the demo app:** [JavaScript candlestick chart](https://www.scichart.com/demo/javascript/candlestick-chart) · [React candlestick chart](https://www.scichart.com/demo/react/candlestick-chart) · [Angular candlestick chart](https://www.scichart.com/demo/angular/candlestick-chart)

**Go deeper:** [Candlestick series documentation](/2d-charts/chart-types/fast-candlestick-renderable-series/), including volume bars and colouring individual candles.

## Building a full trading chart?

[SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, gives you a ready-made trading chart built around candlesticks: live Binance and Coinbase feeds, 30+ technical indicators, drawing tools and multiple panes, in JavaScript, TypeScript and React. See what it can do on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What does a candlestick chart show?

Each candle shows four prices for one time period: the open, the high, the low and the close. The body spans the open and close; the thin wicks above and below reach the high and the low.

### What do green and red candles mean?

A green (bullish) candle closed higher than it opened, so the price rose during the period. A red (bearish) candle closed lower than it opened, so the price fell.

### What is the difference between a candlestick chart and an OHLC chart?

Both show open, high, low and close. An OHLC chart draws each period as a vertical bar with a tick to the left for the open and a tick to the right for the close. A candlestick chart fills the range between open and close as a coloured body, which makes rising and falling periods easier to see at a glance.

### How do I make a candlestick chart in JavaScript?

With SciChart.js, create a `SciChartSurface`, add a `CategoryAxis` and a `NumericAxis`, then add a `FastCandlestickRenderableSeries` with an `OhlcDataSeries` holding your x, open, high, low and close values. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

### What is a doji candle?

A doji is a candle whose open and close are almost equal, so its body is a thin line. It shows that buyers and sellers ended the period roughly balanced.

<LearnCta position="bottom" chart="candlestick chart" demo="candlestick-chart" />
