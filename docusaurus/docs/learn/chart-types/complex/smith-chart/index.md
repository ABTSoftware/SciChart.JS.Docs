---
sidebar_position: 60
sidebar_label: Smith Chart
title: "Smith Chart: How to Read It and Use It for Impedance Matching (With an Interactive Example)"
description: "What a Smith chart is, how to read resistance circles and reactance arcs, VSWR circles, return loss and line length, and how to match a load, with a live interactive Smith chart."
keywords:
    [
        "smith chart",
        "the smith chart",
        "what is a smith chart",
        "smith chart tutorial",
        "smith chart tutorials",
        "smith chart explained",
        "how to read a smith chart",
        "smith chart impedance matching",
        "vswr circle",
        "admittance smith chart",
        "reflection coefficient",
        "smith chart vs polar plot"
    ]
image: /img/learn/smith-chart-og.png
related: [radar-chart, polar-area-chart, bode-plot, network-graph]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a Smith chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Smith chart is used to see and change how well a load, such as an antenna or an amplifier input, matches the transmission line feeding it. RF engineers use it to read impedance and reflection from a network analyser, to work out what a length of cable does to an impedance, and to design matching networks of capacitors, inductors or stubs that bring the load to the centre of the chart." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a Smith chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Divide the impedance by the line's characteristic impedance (usually 50 ohms) to get z = r + jx. Find the circle labelled with r and the arc labelled with x: the point is where they cross. Points in the upper half are inductive, points in the lower half capacitive. The distance from the centre is the size of the reflection coefficient, and the angle is its phase." }
                },
                {
                    "@type": "Question",
                    "name": "What does the centre of a Smith chart mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The centre is a perfect match: the load equals the line's characteristic impedance, so the reflection coefficient is zero, the VSWR is 1 and no power is reflected. The goal of impedance matching is to move a load's point to the centre. The far left of the chart is a short circuit and the far right an open circuit." }
                },
                {
                    "@type": "Question",
                    "name": "What is a VSWR circle on a Smith chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A VSWR circle is a circle centred on the middle of the Smith chart and passing through the load's point. Every point on it has the same size of reflection coefficient, and so the same VSWR and return loss. Adding lossless line moves the point around this circle, which is why a length of cable changes the impedance but not the VSWR." }
                },
                {
                    "@type": "Question",
                    "name": "Why does a transmission line rotate the point on a Smith chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The reflected wave travels to the load and back, so moving a distance d along a lossless line changes the reflection coefficient's phase by 4 pi d divided by the wavelength, without changing its size. On the chart that is a rotation about the centre: clockwise when moving toward the generator, anticlockwise toward the load, with one full turn every half wavelength." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a Smith chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Convert each impedance to a reflection coefficient, gamma = (z - 1) / (z + 1), and plot gamma's real and imaginary parts on a square chart with equal x and y ranges from about -1.2 to 1.2. Draw the grid by mapping lines of constant resistance and constant reactance the same way. With SciChart.js, use line series with NaN gaps for the grid, a scatter series for points and text annotations for labels." }
                }
            ]
        })}
    </script>
</head>

# Smith Chart

## What is a Smith chart?

A **Smith chart** is a circular chart for radio-frequency (RF) work that plots the impedance of a load, such as an antenna, as a point inside a unit circle. It overlays circles of constant resistance and arcs of constant reactance on the plane of the **reflection coefficient**, so one point gives impedance, reflection and VSWR together.

![An interactive Smith chart in a dark navy theme: the impedance grid of resistance circles and reactance arcs, a load at 25 + j50 ohms marked in red, its dashed yellow VSWR circle, and a green L-network matching path from the load to the centre](/img/learn/smith-chart-og.png)

*A load of 25 + j50 Ω on a 50 Ω line, its VSWR circle (yellow, dashed) and a two-capacitor match that moves it to the centre (green). [Try the interactive version](#how-to-make-a-smith-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- The chart is the reflection coefficient $\Gamma = (z-1)/(z+1)$ drawn in the complex plane, with $z = Z/Z_0$ the impedance divided by the line's characteristic impedance.
- The centre is a perfect match, the far left a short circuit, the far right an open circuit. The upper half is inductive, the lower half capacitive.
- Distance from the centre is $|\Gamma|$. A circle about the centre is a VSWR circle: same VSWR and return loss all round it.
- A length of lossless line rotates the point about the centre, one full turn per half wavelength, clockwise toward the generator.
- Matching means moving the point to the centre: a series element moves it along a resistance circle, a shunt element along a conductance circle.
:::

The chart was published by Phillip H. Smith, an engineer at Bell Telephone Laboratories, in the magazine *Electronics* in January 1939, as a "transmission line calculator". It was a graphical way to solve line problems that otherwise needed complex arithmetic by hand. Network analysers still show measurements on it today.

## The maths behind the Smith chart

Two quantities describe what happens where a line meets a load.

- The **normalised impedance** $z = Z/Z_0 = r + jx$ divides the load impedance $Z$ by the line's characteristic impedance $Z_0$ (usually 50 Ω in RF and test equipment, 75 Ω in video and TV cable). Its real part $r$ is the normalised resistance and its imaginary part $x$ the normalised reactance.
- The reflection coefficient $\Gamma$ is the reflected wave at the load divided by the wave arriving there, a complex number with a size and a phase:

$$
\Gamma = \frac{Z - Z_0}{Z + Z_0} = \frac{z - 1}{z + 1}, \qquad z = \frac{1 + \Gamma}{1 - \Gamma}
$$

Any passive load has $r \ge 0$, and for every such load $|\Gamma| \le 1$. So the formula folds the whole right half of the impedance plane, which runs off to infinity, into a circle of radius 1. Lines of constant $r$ and constant $x$ become circles:

| Grid line | In the $\Gamma$ plane | Example |
| --- | --- | --- |
| Constant resistance $r$ | Circle centred at $\left(\frac{r}{1+r},\ 0\right)$, radius $\frac{1}{1+r}$ | $r = 1$: centre (0.5, 0), radius 0.5, through the centre of the chart |
| Constant reactance $x$ | Arc of a circle centred at $\left(1,\ \frac{1}{x}\right)$, radius $\frac{1}{\lvert x \rvert}$, inside the unit circle | $x = +1$: centre (1, 1), radius 1, ending at the top of the rim |

Every resistance circle touches the right-hand edge at $\Gamma = 1$ (the open circuit), and so does every reactance arc. The $r = 0$ circle is the rim itself: pure reactance, with all the power reflected.

## How to read a Smith chart

![Anatomy of a Smith chart: the rim, the short circuit at the left, the open circuit at the right and the matched point at the centre; the r = 0.5 and r = 1 resistance circles in blue and the x = +1 reactance arc in red; a load z = 0.5 + j1 where the r = 0.5 circle meets the x = +1 arc, with a dashed VSWR circle of radius 0.62 through it; and an arrow round the rim showing that moving toward the generator turns clockwise](./smith-chart-anatomy.svg)

To plot or read an impedance:

1. Normalise it: divide by $Z_0$. On a 50 Ω line, 25 + j50 Ω becomes $z = 0.5 + j1$.
2. Find the resistance circle for $r$ (labelled along the horizontal line) and the reactance arc for $x$ (labelled round the rim, $+j$ above and $-j$ below).
3. The point is where they cross. Multiply back by $Z_0$ to turn a point you read off the chart into ohms.

Then read its position:

| Where on the chart | Meaning |
| --- | --- |
| Centre ($z = 1$, $\Gamma = 0$) | Matched: the load equals $Z_0$, nothing is reflected |
| Horizontal line | Pure resistance: left of centre below $Z_0$, right of centre above it |
| Upper half | Inductive: positive reactance |
| Lower half | Capacitive: negative reactance |
| Left end ($z = 0$, $\Gamma = -1$) | Short circuit |
| Right end ($z = \infty$, $\Gamma = +1$) | Open circuit |
| Rim ($\lvert\Gamma\rvert = 1$) | Pure reactance (no resistance): everything is reflected |
| Outside the rim ($\lvert\Gamma\rvert > 1$) | Negative resistance: an active device, such as an oscillator, gives out more than it receives |

### A worked example: 25 + j50 Ω on a 50 Ω line

The load in the diagram, $Z = 25 + j50$ Ω, is a small resistance in series with an inductor.

- $z = 0.5 + j1$.
- $\Gamma = (-0.5 + j1)/(1.5 + j1) = 0.077 + j0.615$, so $|\Gamma| = 0.62$ at an angle of 82.9°. The point sits 62% of the way from the centre to the rim, almost straight up.
- VSWR = $(1 + 0.62)/(1 - 0.62) = 4.27$.
- Return loss = $-20 \log_{10} 0.62 = 4.15$ dB.
- $|\Gamma|^2 = 0.385$, so 38.5% of the incident power is reflected. The power lost to the mismatch is $-10 \log_{10}(1 - |\Gamma|^2) = 2.1$ dB.

## VSWR circles and return loss on a Smith chart

The size of $\Gamma$ sets three figures that datasheets quote:

$$
\text{VSWR} = \frac{1 + |\Gamma|}{1 - |\Gamma|}, \qquad \text{return loss} = -20 \log_{10} |\Gamma| \ \text{dB}, \qquad \text{mismatch loss} = -10 \log_{10}\left(1 - |\Gamma|^2\right) \ \text{dB}
$$

The **voltage standing wave ratio** (VSWR) is the ratio of the largest to the smallest voltage along the line, where the incident and reflected waves add and cancel. All three depend only on $|\Gamma|$, so they are the same everywhere on a circle centred on the chart: the **VSWR circle**. Its radius is $|\Gamma|$, and it cuts the horizontal line to the right of the centre at $r = \text{VSWR}$. That is how VSWR used to be read off a paper chart.

| VSWR | $\lvert\Gamma\rvert$ | Return loss | Power reflected | Mismatch loss |
| --- | --- | --- | --- | --- |
| 1.1 | 0.048 | 26.4 dB | 0.2% | 0.01 dB |
| 1.2 | 0.091 | 20.8 dB | 0.8% | 0.04 dB |
| 1.5 | 0.200 | 14.0 dB | 4.0% | 0.18 dB |
| 2.0 | 0.333 | 9.5 dB | 11.1% | 0.51 dB |
| 3.0 | 0.500 | 6.0 dB | 25.0% | 1.25 dB |

A 75 Ω load on a 50 Ω line and a 50 Ω load on a 75 Ω line both have $|\Gamma| = 0.2$ and a VSWR of 1.5, but sit on opposite sides of the centre: the first at $r = 1.5$, the second at $r = 0.67$.

## Moving along a transmission line

Between the load and the instrument there is usually a cable. On a lossless line of length $d$, the reflected wave goes there and back, so the reflection coefficient seen at the input is

$$
\Gamma_{\text{in}} = \Gamma_L \, e^{-j 4 \pi d / \lambda}
$$

where $\lambda$ is the wavelength in the cable. The size stays the same and only the phase changes, so the point turns about the centre on its VSWR circle:

- clockwise when you move away from the load, toward the generator (the source);
- anticlockwise when you move toward the load;
- one full turn every half wavelength ($\lambda/2$), so the impedance repeats every $\lambda/2$.

Printed charts carry two scales round the rim for this, "wavelengths toward generator" and "wavelengths toward load", both running from 0 to 0.5 and starting at the short-circuit end.

For the example load, $z = 0.5 + j1$:

| Line length | Turn (clockwise) | Input impedance $z_\text{in}$ | In ohms (50 Ω line) |
| --- | --- | --- | --- |
| 0 | 0° | 0.5 + j1 | 25 + j50 Ω |
| 0.1 λ | 72° | 3.70 + j1.41 | 185 + j70 Ω |
| 0.125 λ | 90° | 4.0 − j1.0 | 200 − j50 Ω |
| 0.25 λ | 180° | 0.4 − j0.8 | 20 − j40 Ω |

The VSWR is 4.27 at every length. The quarter-wave line sends the point to the opposite side of the centre, and its normalised impedance is then the load's normalised admittance, $1/z$. That is the principle of the **quarter-wave transformer**.

The wavelength in a cable is shorter than in free space: $\lambda = v_f \, c / f$, where $v_f$ is the cable's velocity factor (about 0.66 for coax with a solid polyethylene dielectric). At 1 GHz, 0.125 λ of such cable is about 2.5 cm.

## The admittance Smith chart

Parallel (shunt) components add as admittances, $Y = 1/Z = G + jB$, not as impedances. Normalised, $y = Y/Y_0 = Z_0/Z = g + jb$.

Because $y = 1/z$, its reflection coefficient is $-\Gamma$. So the admittance chart is the impedance chart turned through 180°: conductance circles touch the left-hand edge, and susceptance arcs bend the other way. On the example load, $y = 1/(0.5 + j1) = 0.4 - j0.8$.

A **ZY chart** (also called an immittance chart) prints both grids, usually in two colours, so you can switch between series and shunt steps without converting. Tick **Show admittance grid** in the live demo to overlay it.

## Impedance matching with a Smith chart

Matching moves the load's point to the centre, so the source sees $Z_0$ and nothing is reflected. Each lossless component moves the point along one family of grid lines:

| Component | Moves the point | Direction |
| --- | --- | --- |
| Series inductor | Along its constant-$r$ circle | Clockwise (adds $+jx$) |
| Series capacitor | Along its constant-$r$ circle | Anticlockwise (adds $-jx$) |
| Shunt capacitor | Along its constant-$g$ circle | Clockwise (adds $+jb$) |
| Shunt inductor | Along its constant-$g$ circle | Anticlockwise (adds $-jb$) |
| Length of line | Round its VSWR circle | Clockwise toward the generator |

### L-network match: a worked example

Match $Z = 25 + j50$ Ω to 50 Ω at 1 GHz with two components, an L-network.

1. The target is the $g = 1$ circle on the admittance grid, because from there one shunt component reaches the centre.
2. A series component keeps $r = 0.5$. On that circle, the points with $g = 1$ are $z = 0.5 \pm j0.5$. The nearer one is $0.5 + j0.5$, so the series component must change $x$ from 1 to 0.5: a series reactance of $-j0.5$, which is $-j25$ Ω, a capacitor.
3. Now $y = 1/(0.5 + j0.5) = 1 - j1$. A shunt susceptance of $+j1$ cancels the $-j1$, which is $+j0.02$ S, another capacitor. The point is at the centre.
4. At 1 GHz: series $C = 1/(2\pi f \times 25) = 6.37$ pF, then shunt $C = 0.02/(2\pi f) = 3.18$ pF, nearer the source.

The other solution, $z = 0.5 - j0.5$, needs −j75 Ω in series and an inductor in shunt. Both solutions match only at 1 GHz. At other frequencies the reactances change, and the point drifts away from the centre.

A **single-stub match** follows the same idea with lines instead of components. Turn the point clockwise along a length of line until it reaches the $g = 1$ circle, then add a short- or open-circuited stub in parallel whose susceptance cancels the $jb$ left over.

## Where Smith charts are used

- Vector network analysers (VNAs). The reflection measurement ($S_{11}$) is shown on a Smith chart, as a trace across a frequency sweep.
- Antennas. Tuning a feed or matching network; a well-matched antenna's trace loops close to the centre near its working frequency.
- Amplifiers and oscillators. Input and output matching, and design circles for gain, noise and stability plotted on the same chart.
- MRI and lab instruments. Tuning and matching RF coils and probes to the 50 Ω electronics.
- Radio receivers and signals intelligence. Front ends and antennas that have to stay matched across wide bands; see SciChart's [signals intelligence (SIGINT) page](https://www.scichart.com/sigint-signals-intelligence/).

The same charts appear in RF design, emulation and test software; see SciChart's [design, emulation and test industry page](https://www.scichart.com/design-emulation-test/).

## Smith chart vs polar plot vs rectangular plots

| Chart | Shows | Use it when… |
| --- | --- | --- |
| Smith chart | $\Gamma$ in the complex plane with the impedance grid on top | You need the impedance itself: for matching, or to see whether a load is inductive or capacitive |
| Polar plot of $\Gamma$ | The same points with plain magnitude and angle rings | You only need the size and phase of the reflection, for example to compare two measurements |
| $\lvert S_{11} \rvert$ in dB, or VSWR, against frequency | Reflection size on a rectangular chart | You need bandwidth: over which frequencies the return loss beats, say, 10 dB |
| $R$ and $X$ against frequency | Resistance and reactance on a rectangular chart | You are fitting a circuit model, or want exact values at each frequency |

A [polar area chart](/learn/chart-types/radial/polar-area-chart/) or [radar chart](/learn/chart-types/radial/radar-chart/) uses the same circular layout for other data. For a filter's gain and phase against frequency, use a [Bode plot](/learn/signal-processing/bode-plot/).

## Common Smith chart mistakes

- **Not normalising, or normalising to the wrong $Z_0$.** A chart read as 50 Ω gives wrong answers on a 75 Ω system. Check what the instrument or software normalised to.
- **Turning the wrong way.** Toward the generator is clockwise; toward the load is anticlockwise. Mixing them up puts a stub on the wrong side of the load.
- **Adding a shunt part on the impedance grid.** Series parts move along resistance circles; shunt parts move along conductance circles. Switch to the admittance grid before a shunt step.
- **Using free-space wavelength for cable length.** The wavelength in coax is shorter, by the velocity factor.
- **Treating a single-frequency match as broadband.** A match is exact at one frequency. Sweep the frequency and check how far the trace strays from the centre over the band you need.
- **Expecting circles on a lossy line.** Loss reduces $|\Gamma|$ as the wave travels, so the point spirals inward instead of following its VSWR circle, and a long lossy cable can make a bad load look well matched.

## How to make a Smith chart in JavaScript, React or Angular

SciChart.js draws with WebGL, so the grid, the circles and a whole frequency sweep redraw instantly each time a control moves. The live demo below is a Smith chart built from standard line and scatter series on a square chart. Set the **line impedance $Z_0$**, the **load resistance R** and **load reactance X**, and add a **line length** to watch the point turn round its VSWR circle. **Show L-network match** draws a two-component match from the line's input to the centre and lists the parts at the chosen **design frequency**. The panel gives $\Gamma$, VSWR, return loss and mismatch loss, and reads the impedance under the mouse. Scroll to zoom, drag to pan, and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={680} name="./Basic/demo" />

<LearnCta position="top" chart="Smith chart" demo="smith-chart" docs="/2d-charts/chart-types/polar-line-renderable-series/" docsLabel="SciChart.js polar line chart documentation" />

Here is the code for this chart. The complex arithmetic, the grid and the matching maths are plain JavaScript; SciChart.js draws the result.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        ELineDrawMode,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Normalised impedance z = r + jx to reflection coefficient: gamma = (z - 1) / (z + 1)
    const toGamma = (r: number, x: number) => {
        const d = (r + 1) ** 2 + x * x;
        return [(r * r + x * x - 1) / d, (2 * x) / d];
    };

    // Resistance circles and reactance arcs as one polyline, with NaN between the curves
    const smithGrid = () => {
        const xs: number[] = [];
        const ys: number[] = [];
        const curve = (points: number[][]) => {
            points.forEach(([gx, gy]) => (xs.push(gx), ys.push(gy)));
            xs.push(NaN);
            ys.push(NaN);
        };
        const t = Array.from({ length: 399 }, (_, i) => Math.tan(Math.PI * ((i + 1) / 400 - 0.5)));
        const u = Array.from({ length: 400 }, (_, i) => Math.tan((Math.PI / 2) * (i / 400)));
        for (const r of [0, 0.2, 0.5, 1, 2, 5]) curve(t.map((x) => toGamma(r, x)));
        for (const x of [0.2, 0.5, 1, 2, 5, -0.2, -0.5, -1, -2, -5]) curve(u.map((r) => toGamma(r, x)));
        curve([[-1, 0], [1, 0]]);
        return { xs, ys };
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // Equal ranges on hidden axes; keep the chart's div square so the circles stay round
        const axis = () =>
            new NumericAxis(wasmContext, {
                visibleRange: new NumberRange(-1.2, 1.2),
                isVisible: false,
                drawMajorGridLines: false,
                drawMinorGridLines: false,
                drawMajorBands: false
            });
        sciChartSurface.xAxes.add(axis());
        sciChartSurface.yAxes.add(axis());

        const grid = smithGrid();
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: grid.xs, yValues: grid.ys, dataIsSortedInX: false }),
                stroke: "#8FA3C7",
                drawNaNAs: ELineDrawMode.DiscontinuousLine
            })
        );

        // Your measured impedances, in ohms, e.g. one per frequency from a network analyser
        const { impedances, z0 } = getYourImpedanceData(); // [{ re, im }, ...] and 50 or 75
        const points = impedances.map((z) => toGamma(z.re / z0, z.im / z0));
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: points.map((p) => p[0]),
                    yValues: points.map((p) => p[1]),
                    dataIsSortedInX: false
                }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 10, height: 10, fill: "#FF6B6B" })
            })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const SmithChart = () => <SciChartReact initChart={initChart} style={{ width: 500, height: 500 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        ELineDrawMode,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Normalised impedance z = r + jx to reflection coefficient: gamma = (z - 1) / (z + 1)
    const toGamma = (r: number, x: number) => {
        const d = (r + 1) ** 2 + x * x;
        return [(r * r + x * x - 1) / d, (2 * x) / d];
    };

    // Resistance circles and reactance arcs as one polyline, with NaN between the curves
    const smithGrid = () => {
        const xs: number[] = [];
        const ys: number[] = [];
        const curve = (points: number[][]) => {
            points.forEach(([gx, gy]) => (xs.push(gx), ys.push(gy)));
            xs.push(NaN);
            ys.push(NaN);
        };
        const t = Array.from({ length: 399 }, (_, i) => Math.tan(Math.PI * ((i + 1) / 400 - 0.5)));
        const u = Array.from({ length: 400 }, (_, i) => Math.tan((Math.PI / 2) * (i / 400)));
        for (const r of [0, 0.2, 0.5, 1, 2, 5]) curve(t.map((x) => toGamma(r, x)));
        for (const x of [0.2, 0.5, 1, 2, 5, -0.2, -0.5, -1, -2, -5]) curve(u.map((r) => toGamma(r, x)));
        curve([[-1, 0], [1, 0]]);
        return { xs, ys };
    };

    @Component({
        selector: "app-smith-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 500px; height: 500px"></scichart-angular>`
    })
    export class SmithChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            // Equal ranges on hidden axes; keep the chart's element square so the circles stay round
            const axis = () =>
                new NumericAxis(wasmContext, {
                    visibleRange: new NumberRange(-1.2, 1.2),
                    isVisible: false,
                    drawMajorGridLines: false,
                    drawMinorGridLines: false,
                    drawMajorBands: false
                });
            sciChartSurface.xAxes.add(axis());
            sciChartSurface.yAxes.add(axis());

            const grid = smithGrid();
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: grid.xs, yValues: grid.ys, dataIsSortedInX: false }),
                    stroke: "#8FA3C7",
                    drawNaNAs: ELineDrawMode.DiscontinuousLine
                })
            );

            // Your measured impedances, in ohms, e.g. one per frequency from a network analyser
            const { impedances, z0 } = getYourImpedanceData(); // [{ re, im }, ...] and 50 or 75
            const points = impedances.map((z) => toGamma(z.re / z0, z.im / z0));
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: points.map((p) => p[0]),
                        yValues: points.map((p) => p[1]),
                        dataIsSortedInX: false
                    }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 10, height: 10, fill: "#FF6B6B" })
                })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The chart is an ordinary 2D surface whose x and y axes both run over the same range of $\Gamma$, hidden, inside a square element. Equal ranges on a square plot area keep the circles round.
- The whole grid is one `FastLineRenderableSeries` with `dataIsSortedInX: false`, so points are joined in the order given, and `drawNaNAs: ELineDrawMode.DiscontinuousLine`, so a NaN between two curves lifts the pen. Each curve is a straight line of the $z$ plane mapped through $\Gamma = (z-1)/(z+1)$.
- Loads are an `XyScatterRenderableSeries`; the VSWR circle, the line-length arc and the matching path are more line series, and the labels are `TextAnnotation`s placed in $\Gamma$ coordinates.
- The live demo's mouse readout is a small custom chart modifier (a subclass of `CustomChartModifier2D`): it converts the mouse position to $\Gamma$ with the axes' coordinate calculators, then to $z$.

**See it in the demo app:** [JavaScript Smith chart](https://www.scichart.com/demo/javascript/smith-chart) · [React Smith chart](https://www.scichart.com/demo/react/smith-chart) · [Angular Smith chart](https://www.scichart.com/demo/angular/smith-chart), with impedance and admittance grids, markers, VSWR circles and matching chains.

**Go deeper:** [SciChart.js polar line chart documentation](/2d-charts/chart-types/polar-line-renderable-series/) for circular charts in general, the [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), and the [custom chart modifiers documentation](/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/).

## Frequently asked questions

### What is a Smith chart used for?

A Smith chart is used to see and change how well a load, such as an antenna or an amplifier input, matches the transmission line feeding it. RF engineers use it to read impedance and reflection from a network analyser, to work out what a length of cable does to an impedance, and to design matching networks of capacitors, inductors or stubs that bring the load to the centre of the chart.

### How do you read a Smith chart?

Divide the impedance by the line's characteristic impedance (usually 50 ohms) to get z = r + jx. Find the circle labelled with r and the arc labelled with x: the point is where they cross. Points in the upper half are inductive, points in the lower half capacitive. The distance from the centre is the size of the reflection coefficient, and the angle is its phase.

### What does the centre of a Smith chart mean?

The centre is a perfect match: the load equals the line's characteristic impedance, so the reflection coefficient is zero, the VSWR is 1 and no power is reflected. The goal of impedance matching is to move a load's point to the centre. The far left of the chart is a short circuit and the far right an open circuit.

### What is a VSWR circle on a Smith chart?

A VSWR circle is a circle centred on the middle of the Smith chart and passing through the load's point. Every point on it has the same size of reflection coefficient, and so the same VSWR and return loss. Adding lossless line moves the point around this circle, which is why a length of cable changes the impedance but not the VSWR.

### Why does a transmission line rotate the point on a Smith chart?

The reflected wave travels to the load and back, so moving a distance d along a lossless line changes the reflection coefficient's phase by 4 pi d divided by the wavelength, without changing its size. On the chart that is a rotation about the centre: clockwise when moving toward the generator, anticlockwise toward the load, with one full turn every half wavelength.

### How do I make a Smith chart in JavaScript?

Convert each impedance to a reflection coefficient, gamma = (z - 1) / (z + 1), and plot gamma's real and imaginary parts on a square chart with equal x and y ranges from about -1.2 to 1.2. Draw the grid by mapping lines of constant resistance and constant reactance the same way. With SciChart.js, use line series with NaN gaps for the grid, a scatter series for points and text annotations for labels.

## Sources

- Smith, P. H. (1939), "Transmission Line Calculator", *Electronics*, 12(1), pp. 29–31. The original Smith chart.
- Smith, P. H. (1969), *Electronic Applications of the Smith Chart*, McGraw-Hill. The chart's construction, scales and uses, by its inventor.
- Pozar, D. M. (2012), *Microwave Engineering*, 4th edition, Wiley. Section 2.4 (the Smith chart) and chapter 5 (L-section and single-stub matching); the L-network formulas used in the demo.
- MIT OpenCourseWare, [6.013 Electromagnetics and Applications](https://ocw.mit.edu/courses/6-013-electromagnetics-and-applications-spring-2009/). Transmission lines, reflection and the Smith chart.
- Orfanidis, S. J., *Electromagnetic Waves and Antennas*, Rutgers University. Free online textbook; chapters on transmission lines and impedance matching.

<LearnCta position="bottom" chart="Smith chart" demo="smith-chart" docs="/2d-charts/chart-types/polar-line-renderable-series/" docsLabel="SciChart.js polar line chart documentation" />
