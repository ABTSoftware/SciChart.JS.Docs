---
sidebar_position: 230
sidebar_label: Volatility Surface
title: "Volatility Surface: Implied Volatility Smile, Skew and Term Structure"
description: "What a volatility surface is, how to read the implied volatility smile, skew and term structure, and how a surface is built from option prices. Live 3D example."
keywords:
    [
        "volatility surface",
        "implied volatility surface",
        "vol surface",
        "implied volatility",
        "volatility smile",
        "volatility skew",
        "term structure of volatility",
        "volatility term structure",
        "how to read a volatility surface",
        "svi volatility surface",
        "volatility smile vs skew",
        "how to calculate implied volatility"
    ]
image: /img/learn/volatility-surface-og.png
related: [options-payoff-diagram, 3d-surface-plot, heatmap, contour-plot]
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
                    "name": "What is a volatility surface?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A volatility surface is a 3D chart of the implied volatilities of options on one asset, against strike price and time to expiry. Each point is the volatility that makes the Black–Scholes model match one option's market price. A flat surface would mean the model's single constant volatility is right; real surfaces show a smile or skew across strikes and a term structure across expiries."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is implied volatility?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Implied volatility is the volatility that, put into an option pricing model such as Black–Scholes, gives back the option's market price. It is found by root finding, for example with Newton's method, because the model can't be solved for volatility directly. It is quoted as an annualised percentage and reflects the move the market is pricing, not a forecast."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between volatility smile and volatility skew?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Both describe how implied volatility changes with strike at one expiry. A smile rises on both sides of the at-the-money strike, as in currency options. A skew slopes mainly one way: equity index options have much higher implied volatility for low-strike puts than for high-strike calls, a pattern that has persisted since the 1987 crash."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What does an inverted volatility term structure mean?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An inverted term structure means short-dated options have higher implied volatility than longer-dated ones. It usually appears during market stress, when traders expect turbulence now but calmer markets later. The normal shape slopes upward. A bump at one expiry often marks a known event, such as an earnings release, that falls before that expiry."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How is a volatility surface constructed?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Take mid-prices of out-of-the-money options at each strike and expiry, solve each for implied volatility, and fit a smooth curve per expiry, often with the SVI parameterisation. Then interpolate between expiries in total variance (volatility squared times time) and check that call prices are convex in strike and total variance rises with expiry, so the surface has no arbitrage."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a volatility surface in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Put the implied volatilities on a regular grid of strikes and expiries, then draw the grid as a 3D surface mesh with volatility as the height and colour. Add the smile and term structure as linked 2D line charts. In SciChart.js, a SurfaceMeshRenderableSeries3D over a UniformGridDataSeries3D draws the surface, and scichart-react or scichart-angular host the same code in React or Angular."
                    }
                }
            ]
        })}
    </script>
</head>

# Volatility Surface

## What is a volatility surface?

A **volatility surface** (also called an implied volatility surface or vol surface) is a three-dimensional chart of the implied volatility of options on one asset, plotted against strike price and time to expiry. If one volatility priced every option, the surface would be flat. Real surfaces tilt and curve across strikes and rise or fall with expiry.

![A simulated implied volatility surface in a dark navy theme: a 3D surface of implied volatility against strike and days to expiry, highest for low strikes and short expiries, with an orange smile slice and a magenta term-structure slice drawn on it, and two linked 2D charts of the smile and the term structure with market quotes as white dots](/img/learn/volatility-surface-og.png)

*A simulated equity index surface with its smile at one expiry and its term structure at one strike (sample data). [Try the interactive version](#how-to-create-a-volatility-surface-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- Implied volatility is the volatility that makes an option pricing model, usually Black–Scholes, return the option's market price.
- A volatility surface plots it against strike (or moneyness, or delta) and expiry. A cut at one expiry is the smile; a cut at one strike is the term structure.
- Equity index surfaces slope down from low strikes to high ones, a skew that has persisted since the 1987 crash.
- Surfaces are built by solving each quote for its implied volatility, fitting a smooth curve per expiry (for example SVI), and checking for arbitrage.
- Cheap far-from-the-money quotes are the least reliable part of a surface: one cent can move them by more than half a volatility point.
:::

This page explains how a volatility surface is read and built, and is not investment advice.

## What is implied volatility?

Implied volatility is the volatility you have to put into an option pricing model to get back the price the option trades at. A model such as Black–Scholes takes the stock price, strike, time to expiry, interest rate and volatility, and returns a price. Every input except volatility can be observed, so the market price fixes the volatility, and that value is the volatility the price implies.

It is quoted as an annualised standard deviation of returns, in percent. An implied volatility of 20% on an 84-day option corresponds to a one-standard-deviation move of about 20% × √(84/365) ≈ 9.6% over the option's life.

### The Black–Scholes formula

Black and Scholes (1973) priced a European call option, one that can only be exercised at expiry, on a stock paying no dividends as

$$
C = S\,N(d_1) - K e^{-rT} N(d_2), \qquad d_1 = \frac{\ln(S/K) + (r + \sigma^2/2)\,T}{\sigma\sqrt{T}}, \qquad d_2 = d_1 - \sigma\sqrt{T}
$$

where $S$ is the stock price, $K$ the strike, $T$ the time to expiry in years, $r$ the risk-free rate, $\sigma$ the volatility and $N$ the standard normal cumulative distribution function. The put price follows from put–call parity, $P = C - S + K e^{-rT}$. The model assumes one constant volatility for the life of the option and for every strike, which is why a chart of implied volatilities is a test of that assumption. If the market agreed with it, every option on the same stock would show the same implied volatility.

### Implied volatility vs historical volatility

Historical (or realised) volatility is measured from past price changes of the underlying. Implied volatility is read from option prices, so it looks forward and reflects what buyers and sellers of options will pay, including any premium for insurance against large moves. The two are often compared. For S&P 500 index options, implied variance has on average been higher than the variance later realised, a gap known as the variance risk premium (Carr and Wu, 2009).

## How to read a volatility surface

Read a volatility surface by its overall height, then by its two slices: across strikes at one expiry (the smile) and across expiries at one strike (the term structure).

![A grid of implied volatility by strike, 70% to 130% of spot, and days to expiry, 14 to 728, coloured from dark blue for low volatility to green and yellow for high. The 84-day row is outlined in orange and drawn on the right as a smile curve, highest for low-strike puts and lowest just above the money. The 90% strike column is outlined in magenta and drawn as a term structure that dips over the first few months and then rises slowly](./volatility-surface-slices.svg)

- Axes. One horizontal axis is the strike, often as moneyness: strike divided by spot or by the forward price, or its logarithm. Currency markets use the option's delta instead. The other horizontal axis is time to expiry, in days or years. Height, and usually colour, is implied volatility.
- Level. The general height of the surface is how much movement the market is pricing. At-the-money volatility, read at a fixed horizon such as 30 days, is the usual one-number summary.
- The smile. Slice the surface at one expiry and you get implied volatility against strike. Its slope near the money is the skew, and how much it bends is the curvature.
- The term structure. Slice it at one strike, usually at the money, and you get implied volatility against expiry.
- From above. Looked at from directly overhead, a surface becomes a heatmap: colour for volatility, strike and expiry as the axes. Contour lines join strikes and expiries with equal implied volatility.

A template sentence for describing one: "At the 84-day expiry, implied volatility runs from 37% at the 70% strike down to 12% near the 110% strike, a steep put skew, while at-the-money volatility rises from 16% at two weeks to 23% at two years." Those are the values of the default surface in the demo on this page, shown in the grid above.

## Volatility smile and volatility skew

A volatility smile is a curve of implied volatility against strike that rises on both sides of the at-the-money strike; a volatility skew (or smirk) is one that slopes mostly one way.

![Left: three curves of implied volatility against strike at one expiry. A flat dashed line is the single volatility that Black–Scholes assumes, a symmetric smile rises on both sides of the money, and an equity index skew falls from 39% at the 70% strike to about 14% above the money. Right: at-the-money implied volatility against days to expiry for three regimes: normal, rising slowly with expiry; inverted, falling from about 38% at two weeks; and an event bump, a jump just after an event at 30 days that fades for longer expiries](./smile-skew-term-shapes.svg)

| Shape | What it looks like | Where it is typical |
| --- | --- | --- |
| Flat | One implied volatility at every strike | Only in the Black–Scholes model |
| Smile | Both wings above the at-the-money level | Currency options in the major pairs |
| Skew (put skew) | Low strikes well above high strikes | Equity index options, many single stocks |

### Why do index options have a skew?

Before October 1987, implied volatilities of S&P 500 index options were close to flat across strikes. After the crash, low-strike puts kept trading at much higher implied volatilities than high-strike calls, and that skew has stayed (Rubinstein, 1994). Two explanations are usually given, and both point the same way:

- Crash risk. Index returns have a fatter left tail than the lognormal model behind Black–Scholes, and investors pay up for puts that protect portfolios against a fall.
- Leverage. When a company's share price falls, its debt is a larger part of its value, so its equity becomes riskier and more volatile.

Currency options have no natural "down" direction, so smiles in the major pairs are closer to symmetric, though many pairs show a lasting skew towards one currency. Traders quote them by delta: the 25-delta risk reversal, the call's implied volatility minus the put's, measures the skew, and the 25-delta butterfly measures the curvature.

## Term structure of volatility

The term structure of volatility is how implied volatility changes with time to expiry at one strike, usually at the money.

- Normal (upward sloping). In calm markets, short-dated implied volatility is low and longer expiries are higher. This shape is sometimes called contango, borrowing the futures term.
- Inverted (downward sloping). In a sell-off, short-dated volatility jumps above longer-dated volatility, because traders expect the turbulence to calm down over time. Hull notes that volatility tends to rise with maturity when short-dated volatility is historically low and fall with maturity when it is historically high.
- Event bump. A known event, such as an earnings release or a central bank decision, adds one expected jump. Every expiry after the event includes it, so the bump is largest for the first expiry after the event and is diluted for longer ones.

A worked event example: an event 30 days away with an expected move of 6% adds 0.06² = 0.0036 to the total variance, σ²T, of every later expiry. For a 56-day option with a base volatility of 16.3%, the implied volatility becomes √(0.163² + 0.0036 ÷ (56/365)) = 22.4%. The same move adds less than one point to a two-year option.

## How a volatility surface is built from option prices

A volatility surface is built by turning each option quote into an implied volatility, fitting a smooth smile to each expiry, and joining the expiries without creating arbitrage.

1. Collect quotes. Take the mid-price between bid and ask for each strike and expiry. Use out-of-the-money options (puts below the forward, calls above it), because they trade more and have tighter spreads.
2. Find the forward. Work out the forward price for each expiry, from put–call parity on near-the-money strikes or from interest rates and dividends. The smile is centred on the forward, not the spot.
3. Solve for implied volatility. Black–Scholes can't be inverted in closed form, so each price is solved by root finding.
4. Fit each expiry. Fit a smooth curve in log-moneyness through each expiry's implied volatilities, often weighted towards the tighter quotes.
5. Join the expiries. Interpolate between expiries in total variance, σ²T, not in volatility, and check the result for arbitrage.

### Worked example: from an option price to implied volatility

A 3-month (T = 0.25) at-the-money call on a \$100 stock, strike \$100, rate 4%, trades at \$4.49. Newton's method finds the volatility that reprices it in two steps. The first guess comes from the Brenner–Subrahmanyam approximation for at-the-money options, σ ≈ √(2π/T) × C/S = 5.013 × 0.0449 = 22.5%. Each step subtracts the pricing error divided by vega, the change in price per unit of volatility.

| Step | Volatility tried | Black–Scholes price | Error | Vega | Next volatility |
| --- | --- | --- | --- | --- | --- |
| 0 | 22.51% | \$4.9804 | +\$0.4904 | 19.74 | 22.51% − 0.4904 ÷ 19.74 = 20.03% |
| 1 | 20.03% | \$4.4902 | +\$0.0002 | 19.72 | 20.02% |
| 2 | 20.02% | \$4.4900 | \$0.0000 | | done |

So the implied volatility is 20.02%. Repricing at exactly 20% gives \$4.4852, which rounds to \$4.49. Far from the money, vega is small and Newton's method can overshoot, so solvers keep a bracket and fall back to bisection when a step leaves it, as the demo on this page does.

### SVI: fitting a smile to each expiry

The **SVI** (stochastic volatility inspired) parameterisation, devised at Merrill Lynch in 1999 and published by Jim Gatheral in 2004, writes the total implied variance $w = \sigma^2 T$ at log-moneyness $k = \ln(K/F)$ as

$$
w(k) = a + b\left(\rho\,(k - m) + \sqrt{(k - m)^2 + s^2}\right)
$$

with five parameters per expiry: $a$ sets the level, $b$ the steepness of the wings, $\rho$ tilts the smile (the skew), $m$ shifts it sideways and $s$ rounds off its bottom. Its wings grow linearly in $k$, which matches the theoretical limit on how fast implied variance can grow at extreme strikes (Lee, 2004). Surface SVI (SSVI), from Gatheral and Jacquier (2014), ties the expiries together with the at-the-money total variance $\theta_T$, a correlation $\rho$ and a curvature function, and gives conditions under which the whole surface is free of arbitrage. The demo uses an SSVI surface.

### No-arbitrage constraints

A surface that is fitted point by point can imply prices that allow a riskless profit, so two constraints are checked. Across strikes, call prices must fall as the strike rises, or a call spread would pay off for nothing, and must be convex in strike, or a butterfly spread (long one low and one high strike, short two in the middle) would cost less than nothing and the probability density implied by the smile would go negative somewhere. Across expiries, total implied variance at the same log-moneyness must not fall as expiry gets longer; if it does, a calendar spread is an arbitrage. Gatheral and Jacquier give Durrleman's condition, g(k) ≥ 0, as a direct test of the butterfly condition on a smile, and the demo applies both tests to every expiry.

## 3D surface vs heatmap vs slices

A 3D surface shows the whole shape at once, a heatmap makes values easy to compare and read, and 2D slices are the most precise; most volatility tools show a surface or heatmap with linked slices.

| View | Best for | Weak at | Guide |
| --- | --- | --- | --- |
| 3D surface | Seeing the overall shape: skew, term structure and where they interact | Reading exact values; parts can hide behind ridges | [3D surface plot](/learn/chart-types/3d/3d-surface-plot/) |
| Heatmap (from above) | Comparing many strikes and expiries at once, and spotting outliers | Small differences in colour are hard to judge | [Heatmap](/learn/chart-types/cartesian/heatmap/) |
| Contour plot | Lines of equal implied volatility, for example how the 20% level moves | Values between contours | [Contour plot](/learn/chart-types/cartesian/contour-plot/) |
| Smile slice (2D line) | Exact values across strikes, quotes against the fit | Only one expiry at a time | Line chart of IV against strike |
| Term-structure slice (2D line) | Events and regime changes across expiries | Only one strike at a time | Line chart of IV against expiry |

To compare a surface with an earlier one, chart the difference between the two as a heatmap, or overlay the smile slices from both dates.

## Common volatility surface mistakes

Most volatility surface errors come from bad input quotes and from interpolating the wrong quantity.

- **Trusting cheap wing quotes.** Prices are quoted in cents, and a cheap option has a small vega. In the demo's default 84-day smile, one cent on the 115% call moves its implied volatility by 0.64 points (from \$0.02 to \$0.03), while one cent on the at-the-money put moves it by 0.05. Filter out quotes with no bid or very wide spreads before fitting.
- **Ignoring the forward.** Centring the smile on the spot price instead of the forward, or getting dividends wrong, tilts the fitted skew and makes puts and calls at the same strike disagree.
- **Interpolating volatility across expiries.** Interpolate in total variance, σ²T, and check that it rises with expiry. A straight line in volatility between two expiries can break the calendar constraint.
- **Extrapolating the wings freely.** A polynomial fitted to the quoted strikes can curl up or go negative beyond them. Keep total variance growing at most linearly in log-moneyness.
- **Comparing surfaces on different axes.** A surface by strike, by moneyness and by delta can look quite different. Use the same axis, and the same colour scale, for every snapshot you compare.
- **Reading the surface as a forecast.** Implied volatility is a price. It includes what investors pay for protection, so it isn't an unbiased prediction of the volatility that will be realised.

## How to create a volatility surface chart in JavaScript, React or Angular

The demo below rebuilds a grid of 61 strikes by 52 expiries from an SSVI model, prices 104 out-of-the-money option quotes from it with noise, rounds them to the cent, solves each one back to implied volatility with Newton's method, and runs both arbitrage checks every time you change a setting. SciChart.js draws the surface and quotes with its WebGL and WebGPU 3D engine, and the two slices as 2D line charts.

Move **Skew (ρ)** to tilt every smile, and **Smile curvature (η)** to bend it; at the default skew the butterfly check fails from 2.8, and with a skew of −0.95 from 2.2. Switch **Term structure** between normal, flat, inverted and an event in 30 days, or pick **Inverted too steeply** to see the calendar check fail. Choose an **Expiry** and a **Strike** to move the orange smile slice and the magenta term-structure slice, toggle **Show quotes**, and set **3D view** to from above to read the surface as a heatmap. The readout under the controls shows the selected quote's price and the implied volatility solved from it. Drag to rotate the 3D surface, scroll to zoom, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={900} name="./Basic/demo" />

<LearnCta position="top" chart="volatility surface" demo="realtime-3d-surface-mesh-chart" demoLabel="3D surface mesh chart" docs="/3d-charts/chart-types/surface-mesh-3d/" docsLabel="SciChart.js 3D surface mesh documentation" />

Here is the code for this demo. The Black–Scholes pricer, the implied volatility solver, the SSVI surface and the arbitrage checks are plain JavaScript; SciChart.js draws the 3D surface, the quote spheres and the two slices. The React and Angular versions below draw a surface from your own grid of implied volatilities.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } from "scichart";

    // ivGrid[expiryIndex][strikeIndex] in % volatility, on evenly spaced strikes and expiries
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            worldDimensions: new Vector3(300, 160, 300),
            cameraOptions: { position: new Vector3(-330, 260, -330), target: new Vector3(0, 40, 0) }
        });
        const { ivGrid, strikeStart, strikeStep, daysStart, daysStep } = await getYourVolSurface();

        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Strike (% of spot)" });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Implied volatility (%)" });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Days to expiry" });
        sciChart3DSurface.renderableSeries.add(
            new SurfaceMeshRenderableSeries3D(wasmContext, {
                dataSeries: new UniformGridDataSeries3D(wasmContext, {
                    yValues: ivGrid,
                    xStart: strikeStart,
                    xStep: strikeStep,
                    zStart: daysStart,
                    zStep: daysStep
                }),
                meshColorPalette: new GradientColorPalette(wasmContext, {
                    gradientStops: [
                        { offset: 0, color: "#14233C" },
                        { offset: 0.4, color: "#2FB8D9" },
                        { offset: 0.8, color: "#F5E663" },
                        { offset: 1, color: "#FF4D4D" }
                    ]
                }),
                minimum: 10, // keep the colour scale fixed, so snapshots compare
                maximum: 70,
                drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
                contourInterval: 5
            })
        );
        sciChart3DSurface.chartModifiers.add(
            new OrbitModifier3D(),
            new MouseWheelZoomModifier3D(),
            new ResetCamera3DModifier(),
            new TooltipModifier3D()
        );
        return { sciChartSurface: sciChart3DSurface };
    };

    // SciChartReact creates the chart, sizes it to its parent and disposes of it on unmount
    export const VolatilitySurface = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } from "scichart";

    // ivGrid[expiryIndex][strikeIndex] in % volatility, on evenly spaced strikes and expiries
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            worldDimensions: new Vector3(300, 160, 300),
            cameraOptions: { position: new Vector3(-330, 260, -330), target: new Vector3(0, 40, 0) }
        });
        const { ivGrid, strikeStart, strikeStep, daysStart, daysStep } = await getYourVolSurface();

        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Strike (% of spot)" });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Implied volatility (%)" });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Days to expiry" });
        sciChart3DSurface.renderableSeries.add(
            new SurfaceMeshRenderableSeries3D(wasmContext, {
                dataSeries: new UniformGridDataSeries3D(wasmContext, {
                    yValues: ivGrid,
                    xStart: strikeStart,
                    xStep: strikeStep,
                    zStart: daysStart,
                    zStep: daysStep
                }),
                meshColorPalette: new GradientColorPalette(wasmContext, {
                    gradientStops: [
                        { offset: 0, color: "#14233C" },
                        { offset: 0.4, color: "#2FB8D9" },
                        { offset: 0.8, color: "#F5E663" },
                        { offset: 1, color: "#FF4D4D" }
                    ]
                }),
                minimum: 10,
                maximum: 70,
                drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
                contourInterval: 5
            })
        );
        sciChart3DSurface.chartModifiers.add(
            new OrbitModifier3D(),
            new MouseWheelZoomModifier3D(),
            new ResetCamera3DModifier(),
            new TooltipModifier3D()
        );
        return { sciChartSurface: sciChart3DSurface };
    };

    @Component({
        selector: "app-volatility-surface",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and disposes of it with the component
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class VolatilitySurfaceComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- The surface is a `SurfaceMeshRenderableSeries3D` over a `UniformGridDataSeries3D`: a 2D array of implied volatilities on evenly spaced strikes (x) and expiries (z), with volatility as the height (y). `setYValues` replaces the grid when the model changes.
- Fixed `minimum` and `maximum` on the series keep each colour tied to the same volatility, and `EDrawMeshAs.SOLID_WITH_CONTOURS` adds a contour every 5 points.
- The quotes are a `ScatterRenderableSeries3D` with a `SpherePointMarker3D`, and the slices drawn on the surface are `PointLineRenderableSeries3D`s over `XyzDataSeries3D`s.
- The smile and term structure are ordinary 2D charts: a `FastLineRenderableSeries` for the fit, an `XyScatterRenderableSeries` for the quotes and a `VerticalLineAnnotation` for the selected strike or expiry. Setting the 3D camera's `position` and `target` gives the view from above.

**See it in the demo app:** [JavaScript 3D surface mesh chart](https://www.scichart.com/demo/javascript/realtime-3d-surface-mesh-chart) · [React 3D surface mesh chart](https://www.scichart.com/demo/react/realtime-3d-surface-mesh-chart) · [Angular 3D surface mesh chart](https://www.scichart.com/demo/angular/realtime-3d-surface-mesh-chart). Related techniques: the [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart), [React line chart](https://www.scichart.com/demo/react/line-chart) and [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart).

**Go deeper:** [SciChart.js 3D surface mesh documentation](/3d-charts/chart-types/surface-mesh-3d/), the [3D scatter chart](/3d-charts/chart-types/scatter-3d-chart/) and [3D line chart](/3d-charts/chart-types/lines-3d-chart/) documentation, and the learning center guides to the [3D surface plot](/learn/chart-types/3d/3d-surface-plot/), the [heatmap](/learn/chart-types/cartesian/heatmap/), the [contour plot](/learn/chart-types/cartesian/contour-plot/) and the [options payoff diagram](/learn/applications/options-payoff-diagram/). For the industry, see SciChart for [financial and trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/).

## Charting the underlying as well

A volatility surface sits next to the price chart of the underlying in most trading tools, and SciTrader.js, SciChart's financial charts SDK, covers that side. Its [Bollinger Bands](/financial-charts/studies-and-indicators/add-indicators/bollinger-bands/) and [Average True Range](/financial-charts/studies-and-indicators/add-indicators/atr-average-true-range/) studies measure the historical volatility of the price, the number traders compare with implied volatility, on [candlestick charts](/learn/chart-types/cartesian/candlestick-chart/). It has no volatility surface series of its own; build the surface with SciChart.js 3D as in the demo above. See what it can do on the [JavaScript stock charts](https://www.scichart.com/javascript-stock-charts/) page.

## Frequently asked questions

### What is a volatility surface?

A volatility surface is a 3D chart of the implied volatilities of options on one asset, against strike price and time to expiry. Each point is the volatility that makes the Black–Scholes model match one option's market price. A flat surface would mean the model's single constant volatility is right; real surfaces show a smile or skew across strikes and a term structure across expiries.

### What is implied volatility?

Implied volatility is the volatility that, put into an option pricing model such as Black–Scholes, gives back the option's market price. It is found by root finding, for example with Newton's method, because the model can't be solved for volatility directly. It is quoted as an annualised percentage and reflects the move the market is pricing, not a forecast.

### What is the difference between volatility smile and volatility skew?

Both describe how implied volatility changes with strike at one expiry. A smile rises on both sides of the at-the-money strike, as in currency options. A skew slopes mainly one way: equity index options have much higher implied volatility for low-strike puts than for high-strike calls, a pattern that has persisted since the 1987 crash.

### What does an inverted volatility term structure mean?

An inverted term structure means short-dated options have higher implied volatility than longer-dated ones. It usually appears during market stress, when traders expect turbulence now but calmer markets later. The normal shape slopes upward. A bump at one expiry often marks a known event, such as an earnings release, that falls before that expiry.

### How is a volatility surface constructed?

Take mid-prices of out-of-the-money options at each strike and expiry, solve each for implied volatility, and fit a smooth curve per expiry, often with the SVI parameterisation. Then interpolate between expiries in total variance (volatility squared times time) and check that call prices are convex in strike and total variance rises with expiry, so the surface has no arbitrage.

### How do I plot a volatility surface in JavaScript?

Put the implied volatilities on a regular grid of strikes and expiries, then draw the grid as a 3D surface mesh with volatility as the height and colour. Add the smile and term structure as linked 2D line charts. In SciChart.js, a SurfaceMeshRenderableSeries3D over a UniformGridDataSeries3D draws the surface, and scichart-react or scichart-angular host the same code in React or Angular.

## Sources

- Black, F. and Scholes, M. (1973), [The Pricing of Options and Corporate Liabilities](https://doi.org/10.1086/260062). Journal of Political Economy, 81(3), 637–654. The option pricing model and formula.
- Hull, J. C. (2022), *Options, Futures, and Other Derivatives*, 11th edition. Pearson. The chapter on volatility smiles and surfaces: equity skew and its explanations, currency smiles, term structure, and implied vs historical volatility.
- Rubinstein, M. (1994), [Implied Binomial Trees](https://doi.org/10.1111/j.1540-6261.1994.tb00079.x). Journal of Finance, 49(3), 771–818. The S&P 500 index option smile before and after October 1987.
- Gatheral, J. (2006), [The Volatility Surface: A Practitioner's Guide](https://doi.org/10.1002/9781119202073). Wiley. SVI, surface dynamics and no-arbitrage conditions.
- Gatheral, J. and Jacquier, A. (2014), [Arbitrage-free SVI volatility surfaces](https://doi.org/10.1080/14697688.2013.819986). Quantitative Finance, 14(1), 59–71. SSVI, Durrleman's condition, butterfly and calendar arbitrage.
- Lee, R. W. (2004), [The moment formula for implied volatility at extreme strikes](https://doi.org/10.1111/j.0960-1627.2004.00200.x). Mathematical Finance, 14(3), 469–480. The limit on how fast implied variance can grow in the wings.
- Brenner, M. and Subrahmanyam, M. G. (1988), [A Simple Formula to Compute the Implied Standard Deviation](https://doi.org/10.2469/faj.v44.n5.80). Financial Analysts Journal, 44(5), 80–83. The at-the-money starting guess for the implied volatility solver.
- Carr, P. and Wu, L. (2009), [Variance Risk Premiums](https://doi.org/10.1093/rfs/hhn038). Review of Financial Studies, 22(3), 1311–1341. Implied variance above realised variance for index options.
- Clark, I. J. (2011), *Foreign Exchange Option Pricing: A Practitioner's Guide*. Wiley. Delta quoting, risk reversals and butterflies for currency smiles.

<LearnCta position="bottom" chart="volatility surface" demo="realtime-3d-surface-mesh-chart" demoLabel="3D surface mesh chart" docs="/3d-charts/chart-types/surface-mesh-3d/" docsLabel="SciChart.js 3D surface mesh documentation" />
