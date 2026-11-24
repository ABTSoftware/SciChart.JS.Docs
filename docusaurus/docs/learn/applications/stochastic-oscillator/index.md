---
sidebar_position: 190
sidebar_label: Stochastic Oscillator
title: "Stochastic Oscillator: %K, %D Formula and How to Read It"
description: "What the stochastic oscillator measures, how %K and %D are calculated, fast vs slow vs full settings, and how to read 80/20 zones, crossovers and divergence."
keywords:
    [
        "stochastic oscillator",
        "stochastic indicator",
        "stochastic oscillator formula",
        "%K and %D",
        "fast vs slow stochastic",
        "full stochastic",
        "stochastic 14 3 3",
        "stochastic overbought oversold",
        "stochastic divergence",
        "stochastic vs RSI",
        "stochastic RSI",
        "how to read the stochastic oscillator"
    ]
image: /img/learn/stochastic-oscillator-og.png
related: [vwap, candlestick-chart, ohlc-chart, tick-chart]
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
                    "name": "What is the stochastic oscillator?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The stochastic oscillator is a momentum indicator that measures where the latest close sits within the high-low range of the last N bars, on a scale from 0 to 100. A reading of 100 means the close is at the highest high of the period and 0 means it is at the lowest low. It is drawn as two lines, %K and its moving average %D, in a pane below the price chart." }
                },
                {
                    "@type": "Question",
                    "name": "How is the stochastic oscillator calculated?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Find the highest high and lowest low of the last N bars, usually 14, including the current bar. Raw %K = 100 x (close - lowest low) / (highest high - lowest low). %D is a simple moving average of %K, usually over 3 bars. The slow and full versions also average raw %K before %D is worked out." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between the fast, slow and full stochastic?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The fast stochastic plots raw %K and a 3-bar average of it as %D. The slow stochastic averages raw %K over 3 bars first, so its %K is the fast %D, and its %D is a 3-bar average of that. The full stochastic lets you set the look-back, the %K smoothing and the %D smoothing separately; full 14,3,3 gives the same lines as slow 14,3." }
                },
                {
                    "@type": "Question",
                    "name": "What do the stochastic settings 14,3,3 mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "14,3,3 means a 14-bar look-back for the high-low range, a 3-bar average to smooth raw %K, and a 3-bar average of the smoothed %K to make %D. The bars are whatever the chart uses, so on a daily chart 14 means 14 trading days and on a 5-minute chart it means 70 minutes. It is a common default today; nothing about the numbers makes them better than nearby settings." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between the stochastic oscillator and RSI?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The stochastic compares the close with the high-low range of recent bars, so it reacts as soon as the close moves within that range. RSI compares the size of recent up closes with recent down closes, using closes only, and reaches its extremes less often. Stochastic RSI applies the stochastic formula to RSI values instead of prices, which makes it more sensitive than either." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a stochastic oscillator in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Work out raw %K, %K and %D from your candles' highs, lows and closes in plain JavaScript, using NaN for the warm-up bars. Draw the candles on one SciChart.js surface and the two lines as FastLineRenderableSeries on a second surface below it with a fixed 0 to 100 axis, shade the zones with BoxAnnotation, and link the two x axes so they zoom together. The same function works in React through scichart-react and in Angular through scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Stochastic Oscillator

## What is the stochastic oscillator?

The **stochastic oscillator** (also called stochastics) is a momentum indicator that measures where the latest close sits within the high–low range of the last N bars, on a scale from 0 to 100. Its main line, **%K**, is 100 at the top of that range and 0 at the bottom; **%D** is a moving average of %K.

![A dark navy two-pane chart: about a year of simulated daily candles on top, moving through a sideways range, a steady uptrend, a downtrend and a second range, and below it the stochastic oscillator's %K and %D lines on a 0 to 100 scale, with the zone above 80 shaded red and the zone below 20 shaded green. The lines stay mostly above 80 during the uptrend and mostly below 20 during the downtrend. A yellow box on the price chart marks the high-low range of the last 14 bars.](/img/learn/stochastic-oscillator-og.png)

*Simulated daily candles with a slow 14,3,3 stochastic oscillator below them: %K and %D swing across the 0 to 100 scale in the ranges and stay near one end in the trends. [Try the interactive version](#how-to-plot-a-stochastic-oscillator-in-javascript-react-or-angular).*

:::tip Key takeaways
- %K measures where the close sits in the N-bar range: 100 at the highest high, 0 at the lowest low.
- %D is a moving average of %K. Fast, slow and full stochastics differ only in how much they smooth.
- 14,3,3 is a 14-bar look-back with two 3-bar averages, and it is a common default.
- Above 80 and below 20 are conventional zones. In a strong trend the oscillator can stay in one of them for weeks.
- Crossovers and divergence are ways traders read the lines, not rules that hold every time.
:::

This page explains how the stochastic oscillator is calculated, read and drawn. It is not investment advice.

## What does the stochastic oscillator measure?

It measures the close's position inside the recent trading range, as a percentage of that range.

Take a 14-day range from a low of 90 to a high of 110. A close of 108 is 18 points above the low in a 20-point range, so %K is 90: the market finished near the top of where it has traded for two weeks. A close of 92 gives a %K of 10, near the bottom.

The idea behind it is that in a rising market, closes tend to land near the top of each bar's range, and in a falling market near the bottom. When closes start to slip away from the extreme while the price is still trending, momentum may be fading. The oscillator turns that position into a number that can be compared over time and across instruments, because it is always between 0 and 100 whatever the price.

It uses three inputs from every bar: the high, the low and the close. The open and volume play no part.

The indicator is usually credited to George Lane, a US technical analyst and educator, in the 1950s; he described %K and %D in his article "Lane's Stochastics" (1984). Despite its name, it is a fixed calculation on past prices and has no link with stochastic processes in probability theory.

## How to calculate the stochastic oscillator

Raw %K places the close in the N-bar high–low range, and %D is a short moving average of %K.

With $n$ as the look-back (14 by default), $H_n$ the highest high and $L_n$ the lowest low over the last $n$ bars including the current one, and $C$ the current close:

$$
\%K_{\text{raw}} = 100 \times \frac{C - L_n}{H_n - L_n}
$$

$$
\%K = \text{SMA}_{k}\left(\%K_{\text{raw}}\right) \qquad \%D = \text{SMA}_{d}\left(\%K\right)
$$

where $\text{SMA}_m$ is the simple moving average of the last $m$ values. With $k = 1$, %K is the raw value; that is the fast stochastic. The steps on each bar are:

1. Look back over the last $n$ bars, including this one, and find the highest high and the lowest low.
2. Subtract the lowest low from the close, divide by the range and multiply by 100. That is raw %K.
3. Average the last $k$ raw values to get %K, then the last $d$ values of %K to get %D.

A few details vary between charting packages:

- Flat range. If every bar in the window has the same high and low, the range is zero and the formula divides by zero. Software returns 0, 50 or the previous value. The demo on this page uses 50, the middle of the scale.
- Warm-up. Raw %K needs $n$ bars, %K needs $k - 1$ more and %D another $d - 1$. With 14,3,3, the first %D value is on bar 18.
- Kind of average. Most packages use a simple moving average for both steps; some offer an exponential one, which changes the values.

### Worked example: 12 bars with a 5-bar look-back

A 5-bar look-back keeps the table short; the steps are the same for 14. Fast %K is raw %K, its 3-bar average is the fast %D (which is also the slow %K), and the 3-bar average of that is the slow %D.

| Bar | High | Low | Close | 5-bar highest high | 5-bar lowest low | Fast %K | Fast %D = slow %K | Slow %D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 51.0 | 50.0 | 50.6 | – | – | – | – | – |
| 2 | 51.6 | 50.6 | 51.4 | – | – | – | – | – |
| 3 | 52.4 | 51.2 | 51.9 | – | – | – | – | – |
| 4 | 52.0 | 50.9 | 51.3 | – | – | – | – | – |
| 5 | 53.1 | 51.9 | 52.9 | 53.1 | 50.0 | 93.5 | – | – |
| 6 | 53.8 | 52.6 | 53.4 | 53.8 | 50.6 | 87.5 | – | – |
| 7 | 53.5 | 52.4 | 52.6 | 53.8 | 50.9 | 58.6 | 79.9 | – |
| 8 | 52.6 | 51.3 | 51.6 | 53.8 | 50.9 | 24.1 | 56.8 | – |
| 9 | 51.9 | 50.8 | 51.1 | 53.8 | 50.8 | 10.0 | 30.9 | 55.9 |
| 10 | 51.2 | 50.2 | 50.6 | 53.8 | 50.2 | 11.1 | 15.1 | 34.3 |
| 11 | 51.8 | 50.6 | 51.6 | 53.5 | 50.2 | 42.4 | 21.2 | 22.4 |
| 12 | 52.9 | 51.5 | 52.7 | 52.9 | 50.2 | 92.6 | 48.7 | 28.3 |

- On bar 12 the window is bars 8 to 12. The highest high is 52.9 (bar 12) and the lowest low 50.2 (bar 10), a range of 2.7. The close of 52.7 is 2.5 above the low, so fast %K = 100 × 2.5 ÷ 2.7 = 92.6.
- On bar 9 the close of 51.1 is only 0.3 above a 50.8 low in a 3.0 range, so fast %K is 10.0, in the oversold zone below 20.
- Fast %D on bar 7 is (93.5 + 87.5 + 58.6) ÷ 3 = 79.9.
- Fast %K is below fast %D on bar 10 (11.1 against 15.1) and above it on bar 11 (42.4 against 21.2): a bullish crossover.
- The slow %D lags well behind: on bar 12 it is still 28.3 while fast %K is back above 90.

The numbers come from the same function the live demo uses, so the demo set to look-back 5, %K smoothing 1 and %D smoothing 3 on these bars would give the same values.

## Fast, slow and full stochastic

The three versions use the same raw %K and differ only in how many times it is averaged before it is plotted.

| Version | Usual settings | Plotted %K | Plotted %D | Smoothing |
| --- | --- | --- | --- | --- |
| Fast | 14,3 | Raw %K | 3-bar average of raw %K | None on %K |
| Slow | 14,3 | 3-bar average of raw %K (the fast %D) | 3-bar average of slow %K | Fixed: 3 on %K, then 3 on %D |
| Full | 14,3,3 | $k$-bar average of raw %K | $d$-bar average of full %K | Both set by the user |

- The fast stochastic reacts first and crosses most often. Raw %K can jump from near 0 to near 100 in a single bar when one bar closes at the other end of the range.
- The slow stochastic smooths out the fast version's whipsaws. Its %K is the fast %D, so the lines turn about a bar later and cross less often.
- The full stochastic is the general form. Full 14,1,3 is the fast stochastic and full 14,3,3 is the slow one, so the full version gives more settings without a new calculation.

Names vary between texts and packages. Older texts describe three lines, %K, %D and a further average of %D called "%D-slow"; the slow stochastic plots the last two and calls them slow %K and slow %D. Some packages label the fast stochastic simply "Stochastic", others mean the slow one by the same word, and the second number in "14,3" can be the %D length or the %K smoothing. Check which lines a chart draws before comparing its values with another's.

In the demo's simulated year, the fast 14,3 lines cross each other 104 times and the slow 14,3 lines 62 times.

### Where does 14,3,3 come from?

The 14-bar look-back with two 3-bar averages is a common default in charting software today; it is a convention, and nothing in the maths singles out 14. Published examples use other look-backs too, and 5, 9 and 14 bars are all common. The look-back is counted in bars of the chart's own timeframe, so 14 is about three weeks on a daily chart and 70 minutes on a 5-minute chart.

A shorter look-back makes the range narrower, so the close reaches the extremes more often and the oscillator swings harder. A longer one gives a wider range and fewer readings near 0 or 100. In the demo, raising the look-back from 5 to 30 with slow smoothing cuts the share of bars in the first range with %K above 80 or below 20 only a little, but it lifts the share of uptrend bars above 80 from 49% to 73%.

## How to read the stochastic oscillator

Read the level first, then the crossovers, then any divergence from price, and treat each as a description of momentum so far.

![Anatomy of the stochastic oscillator. Top: twelve price bars, each a vertical high-low line with a tick for the close; a dashed box marks the 5-bar window from bar 8 to bar 12, from a lowest low of 50.20 to a highest high of 52.90, and a bracket shows the close of 52.70 sitting 2.50 above the low, so %K equals 2.50 divided by 2.70 times 100, or 92.6. Bottom: fast %K and its 3-bar average %D on a 0 to 100 scale, with the overbought zone above 80 shaded red and the oversold zone below 20 shaded green; %K is 93.5 on bar 5, falls to 10.0 on bar 9, and crosses above %D between bars 10 and 11.](./stochastic-anatomy.svg)

### Overbought and oversold: the 80 and 20 levels

Above 80 is conventionally called overbought and below 20 oversold. The words describe position: a reading of 90 says the close is near the top of the recent range, and nothing about whether the price is too high. Some traders use 70 and 30 to get more readings in the zones, or 90 and 10 to get fewer. A common reading is to wait for the oscillator to leave a zone (fall back below 80, or rise back above 20) rather than act while it is inside it.

### %K and %D crossovers

%K crossing above %D means the latest readings have moved above their recent average: the close is climbing within its range. %K crossing below %D is the opposite. Crossovers happen often, so traders tend to give more weight to those that happen inside a zone, such as a cross upwards below 20. The worked example has one on bar 11.

### Divergence between price and the oscillator

A bullish divergence is a lower low in price with a higher low in the oscillator: the price reached a new low, but the close finished higher in its range than at the previous low. A bearish divergence is a higher high in price with a lower high in the oscillator. Both suggest the move is losing momentum. They can last a long time before the price turns, and many never lead to a reversal, so they are usually read alongside the trend and support or resistance levels.

## Why the stochastic stays near 100 in a strong trend

In a steady trend each new bar tends to close near the edge of a range that keeps moving with it, so %K stays near 100 in an uptrend and near 0 in a downtrend.

In an uptrend, the 14-bar highest high is usually a recent bar, and closes land near it day after day. %K stays high and "overbought" can last for weeks while the price keeps rising. Selling every time %K crosses 80 in that market would mean selling all the way up. The same happens in reverse in a downtrend.

The simulated data in the demo shows this. With the slow 14,3,3 setting and 80/20 zones:

| Phase in the demo | Bars | %K above 80 | %K below 20 |
| --- | --- | --- | --- |
| First range | 100 | 14% | 19% |
| Uptrend | 70 | 69% | 0% |
| Downtrend | 50 | 0% | 74% |
| Second range | 40 | 10% | 5% |

The oscillator is in a zone on about a third of the bars in the first range, swinging between them, and on most bars of each trend, stuck at one end. The usual zone readings assume a range-bound market. In a trend, a reading at the extreme tells you the trend is still running; a fall from 100 that fails to reach 20 before turning back up is how a pullback within an uptrend often looks.

## Stochastic vs RSI vs Stochastic RSI

All three are bounded momentum oscillators, but they measure different things and suit different jobs.

| | Stochastic oscillator | RSI (relative strength index) | Stochastic RSI |
| --- | --- | --- | --- |
| What it measures | Close's position in the N-bar high–low range | Average size of up closes against down closes over N bars | RSI's position in its own N-bar range |
| Inputs | High, low and close | Close only | Close only, through RSI |
| Scale and usual zones | 0 to 100; 80 and 20 | 0 to 100; 70 and 30 | 0 to 1 (or 0 to 100); 0.8 and 0.2 |
| Introduced by | George Lane (usually credited, 1950s; article 1984) | J. Welles Wilder Jr. (1978) | Tushar Chande and Stanley Kroll (1994) |
| Behaviour | Quick; reaches both ends often | Smoother; extremes are rarer | Most sensitive; often sits at 0 or 1 |
| Choose it when | You care where price closes within its bars' range, including the wicks | You want the strength of closing moves, less affected by single-bar spikes | You want RSI turns to show sooner, and accept many more signals |

Stochastic RSI uses the same formula as raw %K with RSI values in place of highs, lows and closes: (RSI − lowest RSI) ÷ (highest RSI − lowest RSI) over the look-back. Because RSI often moves within a narrow band, stretching that band to fill 0 to 1 makes the result swing hard. A long wick changes the stochastic but not RSI, since RSI ignores highs and lows.

## Common stochastic oscillator mistakes

Most mistakes come from using the zones as signals in the wrong market, or comparing lines that were calculated differently.

- **Selling every reading above 80.** In a trend the oscillator stays in the zone (see the table above). Check the trend first.
- **Comparing two charts with different versions.** A fast and a slow stochastic with the "same" 14,3 settings plot different lines. So do packages that use different averages or handle a flat range differently.
- **Reading the current bar as final.** Until a bar closes, its high, low and close keep changing, so %K for the latest bar moves around and can cross %D and back again.
- **Feeding it closes only.** Without real highs and lows, the range is built from closes and every reading changes. Data with no intraday range, such as a daily close-only series, needs a different indicator or must say what it used.
- **Ignoring the warm-up.** The first values need $n + k + d - 2$ bars of history. Start the calculation earlier than the chart's first visible bar, or the left edge shows nothing or a misleading value.
- **Tuning the settings until a backtest looks good.** Trying many look-backs and zone levels on past data finds one that fits by chance. Park and Irwin's review of 95 studies of technical trading rules found that most reported profits, at least until the early 1990s, but that most also had problems in how they were tested, such as data snooping, choosing rules after the fact, and difficulty estimating risk and trading costs.
- **Treating divergence as a timing signal.** A divergence can persist through several further highs or lows before anything happens, or never resolve.

## How to plot a stochastic oscillator in JavaScript, React or Angular

The demo below simulates 260 daily candles in four phases (a 100-bar range, a 70-bar uptrend, a 50-bar downtrend and a 40-bar range) and recomputes raw %K, %K, %D, the shaded zones and the readout each time you change a setting. SciChart.js draws the candles and both oscillator lines with WebGL and WebGPU; the stochastic maths is plain JavaScript.

Set **Look-back N**, **%K smoothing** and **%D smoothing** to build any full stochastic, or press a preset: **Fast 14,3** turns the %K smoothing off, and **Slow 14,3** and **Full 14,3,3** both select 14,3,3 and light up together because they are the same lines. **Zones** moves the shaded levels between 80/20, 70/30 and 90/10, and the readout gives the share of each phase's bars in each zone. With **Show the N-bar high–low range** ticked, hover over any bar to see the window behind its %K drawn on the price chart, with its highest high and lowest low; the readout shows that bar's close, range, raw %K, %K and %D. Scroll to zoom, drag to pan, and double-click to reset; both charts move together.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="stochastic oscillator" demo="sync-multi-chart" demoLabel="synchronised multi-chart" docs="/financial-charts/studies-and-indicators/add-indicators/stochastic-oscillator/" docsLabel="SciTrader.js stochastic oscillator documentation" />

Here is the code for this demo. The stochastic calculation and the time-in-zone shares are plain JavaScript; SciChart.js draws the candles, the two lines, the zones and the hover window. The React and Angular versions below draw the oscillator pane from your own candles.

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
        ECoordinateMode,
        XyDataSeries,
        FastLineRenderableSeries,
        BoxAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // Simple moving average of the last m values; NaN until there are m values
    const sma = (values: number[], m: number) =>
        values.map((_, i) => (i < m - 1 ? NaN : values.slice(i - m + 1, i + 1).reduce((a, b) => a + b, 0) / m));

    // Full stochastic: n-bar look-back, %K smoothed over kSmoothing bars, %D over dSmoothing bars
    const stochastic = (high: number[], low: number[], close: number[], n = 14, kSmoothing = 3, dSmoothing = 3) => {
        const rawK = close.map((c, i) => {
            if (i < n - 1) return NaN;
            const hh = Math.max(...high.slice(i - n + 1, i + 1));
            const ll = Math.min(...low.slice(i - n + 1, i + 1));
            return hh > ll ? (100 * (c - ll)) / (hh - ll) : 50;
        });
        const k = sma(rawK, kSmoothing);
        return { k, d: sma(k, dSmoothing) };
    };

    // initChart builds the oscillator pane; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Bar" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Stochastic", autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, 100) })
        );

        const { xValues, high, low, close } = getYourCandles();
        const { k, d } = stochastic(high, low, close);
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: k, dataSeriesName: "%K", containsNaN: true }),
                stroke: "#50C7E0",
                strokeThickness: 2
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: d, dataSeriesName: "%D", containsNaN: true }),
                stroke: "#F48420",
                strokeThickness: 2
            })
        );
        // Shade the zones across the full width: above 80 and below 20
        sciChartSurface.annotations.add(
            new BoxAnnotation({ xCoordinateMode: ECoordinateMode.Relative, x1: 0, x2: 1, y1: 80, y2: 100, fill: "#EF535033", strokeThickness: 0 }),
            new BoxAnnotation({ xCoordinateMode: ECoordinateMode.Relative, x1: 0, x2: 1, y1: 0, y2: 20, fill: "#26A69A33", strokeThickness: 0 })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier(),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { sciChartSurface };
    };

    export const StochasticOscillatorChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 250 }} />
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
        ECoordinateMode,
        XyDataSeries,
        FastLineRenderableSeries,
        BoxAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // Simple moving average of the last m values; NaN until there are m values
    const sma = (values: number[], m: number) =>
        values.map((_, i) => (i < m - 1 ? NaN : values.slice(i - m + 1, i + 1).reduce((a, b) => a + b, 0) / m));

    // Full stochastic: n-bar look-back, %K smoothed over kSmoothing bars, %D over dSmoothing bars
    const stochastic = (high: number[], low: number[], close: number[], n = 14, kSmoothing = 3, dSmoothing = 3) => {
        const rawK = close.map((c, i) => {
            if (i < n - 1) return NaN;
            const hh = Math.max(...high.slice(i - n + 1, i + 1));
            const ll = Math.min(...low.slice(i - n + 1, i + 1));
            return hh > ll ? (100 * (c - ll)) / (hh - ll) : 50;
        });
        const k = sma(rawK, kSmoothing);
        return { k, d: sma(k, dSmoothing) };
    };

    @Component({
        selector: "app-stochastic-oscillator-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 250px"></scichart-angular>`
    })
    export class StochasticOscillatorChartComponent {
        // initChart builds the oscillator pane; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Bar" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { axisTitle: "Stochastic", autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, 100) })
            );

            const { xValues, high, low, close } = getYourCandles();
            const { k, d } = stochastic(high, low, close);
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: k, dataSeriesName: "%K", containsNaN: true }),
                    stroke: "#50C7E0",
                    strokeThickness: 2
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: d, dataSeriesName: "%D", containsNaN: true }),
                    stroke: "#F48420",
                    strokeThickness: 2
                })
            );
            // Shade the zones across the full width: above 80 and below 20
            sciChartSurface.annotations.add(
                new BoxAnnotation({ xCoordinateMode: ECoordinateMode.Relative, x1: 0, x2: 1, y1: 80, y2: 100, fill: "#EF535033", strokeThickness: 0 }),
                new BoxAnnotation({ xCoordinateMode: ECoordinateMode.Relative, x1: 0, x2: 1, y1: 0, y2: 20, fill: "#26A69A33", strokeThickness: 0 })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier(),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The price pane is a [FastCandlestickRenderableSeries](/2d-charts/chart-types/fast-candlestick-renderable-series/) over an `OhlcDataSeries`, with the bar number on the x axis so weekends leave no gaps; `labelProvider.formatLabel` turns each bar number back into its date.
- %K and %D are two [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series/) over `XyDataSeries` created with `containsNaN: true`, so the warm-up bars are left blank. The oscillator's y axis has `autoRange: EAutoRange.Never` and a fixed range, so 80 and 20 stay in the same place as you zoom.
- The zones are `BoxAnnotation`s with `xCoordinateMode: ECoordinateMode.Relative`, so they span the full width; the hover window on the price pane is another `BoxAnnotation` in data coordinates, moved by a small `CustomChartModifier2D` that turns the mouse position into a bar number.
- `SciChartVerticalGroup` lines up the two panes' y axes, and each x axis's `visibleRangeChanged` event sets the other's range, so zooming one pane zooms both (see [synchronising vertical charts](/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/)).

**See it in the demo app:** [JavaScript synchronised multi-chart](https://www.scichart.com/demo/javascript/sync-multi-chart) · [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart) · [Angular synchronised multi-chart](https://www.scichart.com/demo/angular/sync-multi-chart). Related techniques: the [React line chart](https://www.scichart.com/demo/react/line-chart) and [React chart annotations](https://www.scichart.com/demo/react/chart-annotations).

**Go deeper:** [SciTrader.js stochastic oscillator documentation](/financial-charts/studies-and-indicators/add-indicators/stochastic-oscillator/), the [candlestick series documentation](/2d-charts/chart-types/fast-candlestick-renderable-series/), [synchronising vertical charts](/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/), and the learning center guides to the [candlestick chart](/learn/chart-types/cartesian/candlestick-chart/), the [OHLC chart](/learn/chart-types/cartesian/ohlc-chart/) and the [line chart](/learn/chart-types/cartesian/line-chart/). For how trading software uses SciChart, see [SciChart for financial and stock trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/).

## Building a full trading app?

[SciTrader.js](/financial-charts/overview/), SciChart's financial charts SDK, has the stochastic oscillator built in. Its [stochastic oscillator study](/financial-charts/studies-and-indicators/add-indicators/stochastic-oscillator/) adds %K and %D in their own pane under a live price chart as a single study object; it draws the fast stochastic, with a 14-bar look-back and a 3-bar %D by default. The [RSI study](/financial-charts/studies-and-indicators/add-indicators/rsi-relative-strength-index/) and the other [built-in indicators](/financial-charts/studies-and-indicators/add-indicators/) sit alongside it, with drawing tools, multiple panes and live exchange feeds. See what SciChart can do for trading apps on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What is the stochastic oscillator?

The stochastic oscillator is a momentum indicator that measures where the latest close sits within the high-low range of the last N bars, on a scale from 0 to 100. A reading of 100 means the close is at the highest high of the period and 0 means it is at the lowest low. It is drawn as two lines, %K and its moving average %D, in a pane below the price chart.

### How is the stochastic oscillator calculated?

Find the highest high and lowest low of the last N bars, usually 14, including the current bar. Raw %K = 100 x (close - lowest low) / (highest high - lowest low). %D is a simple moving average of %K, usually over 3 bars. The slow and full versions also average raw %K before %D is worked out.

### What is the difference between the fast, slow and full stochastic?

The fast stochastic plots raw %K and a 3-bar average of it as %D. The slow stochastic averages raw %K over 3 bars first, so its %K is the fast %D, and its %D is a 3-bar average of that. The full stochastic lets you set the look-back, the %K smoothing and the %D smoothing separately; full 14,3,3 gives the same lines as slow 14,3.

### What do the stochastic settings 14,3,3 mean?

14,3,3 means a 14-bar look-back for the high-low range, a 3-bar average to smooth raw %K, and a 3-bar average of the smoothed %K to make %D. The bars are whatever the chart uses, so on a daily chart 14 means 14 trading days and on a 5-minute chart it means 70 minutes. It is a common default today; nothing about the numbers makes them better than nearby settings.

### What is the difference between the stochastic oscillator and RSI?

The stochastic compares the close with the high-low range of recent bars, so it reacts as soon as the close moves within that range. RSI compares the size of recent up closes with recent down closes, using closes only, and reaches its extremes less often. Stochastic RSI applies the stochastic formula to RSI values instead of prices, which makes it more sensitive than either.

### How do I plot a stochastic oscillator in JavaScript?

Work out raw %K, %K and %D from your candles' highs, lows and closes in plain JavaScript, using NaN for the warm-up bars. Draw the candles on one SciChart.js surface and the two lines as FastLineRenderableSeries on a second surface below it with a fixed 0 to 100 axis, shade the zones with BoxAnnotation, and link the two x axes so they zoom together. The same function works in React through scichart-react and in Angular through scichart-angular.

## Sources

- Lane, G. C. (1984), "Lane's Stochastics", *Technical Analysis of Stocks & Commodities*, 2(3), 87–90. Lane's own description of %K, %D and how he read them.
- Murphy, J. J. (1999), *Technical Analysis of the Financial Markets*, New York Institute of Finance. The standard textbook treatment of oscillators, including stochastics, overbought and oversold zones, and divergence.
- Wilder, J. W., Jr. (1978), *New Concepts in Technical Trading Systems*, Trend Research. Introduces the relative strength index (RSI).
- Chande, T. S. and Kroll, S. (1994), *The New Technical Trader*, Wiley. Introduces the stochastic RSI.
- Park, C.-H. and Irwin, S. H. (2007), [What do we know about the profitability of technical analysis?](https://doi.org/10.1111/j.1467-6419.2007.00519.x), *Journal of Economic Surveys*, 21(4), 786–826. A review of 95 studies of technical trading rules and the problems in how they were tested.

<LearnCta position="bottom" chart="stochastic oscillator" demo="sync-multi-chart" demoLabel="synchronised multi-chart" docs="/financial-charts/studies-and-indicators/add-indicators/stochastic-oscillator/" docsLabel="SciTrader.js stochastic oscillator documentation" />
