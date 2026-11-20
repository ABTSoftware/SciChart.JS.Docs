---
sidebar_position: 40
sidebar_label: Bode Plot
title: "Bode Plot: How to Read and Draw a Frequency Response (With Interactive Examples)"
description: "What a Bode plot and frequency response are, how to read and sketch one with the straight-line rules, gain and phase margin, and Bode vs Nyquist plots. Live demo."
keywords:
    [
        "bode plot",
        "frequency response",
        "what is a bode plot",
        "how to read a bode plot",
        "how to draw a bode plot",
        "bode plot rules",
        "bode plot generator",
        "bode plot phase margin",
        "frequency response function",
        "impulse response",
        "nyquist plot",
        "bode plot vs nyquist plot"
    ]
image: /img/learn/bode-plot-og.png
related: [low-pass-filter, high-pass-filter, band-pass-filter, notch-filter]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a Bode plot used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Bode plot shows how a system treats each frequency: how much it amplifies or attenuates it, and how far it shifts it in time (the phase). Engineers use it to see a filter's cutoff and roll-off, an amplifier's bandwidth, a loudspeaker's or sensor's useful range, and how close a feedback control loop is to instability (its gain and phase margins)." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a Bode plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Read across the log frequency axis, where each gridline is ten times the last. The top panel gives the gain in decibels: 0 dB means unchanged, −20 dB means one tenth of the amplitude. The bottom panel gives the phase in degrees: negative means the output lags the input. Corners are where the slope changes; the slope tells you how many poles or zeros are acting, at 20 dB per decade each." }
                },
                {
                    "@type": "Question",
                    "name": "What does −20 dB per decade mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It means the gain falls by 20 dB, a factor of ten in amplitude, every time the frequency rises tenfold. It is the slope of one pole, such as a first-order RC low-pass filter above its cutoff. It is the same as about −6 dB per octave (each doubling of frequency). Two poles give −40 dB per decade, three give −60, and so on." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a Bode plot and a Nyquist plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both show the same frequency response. A Bode plot uses two charts, gain in dB and phase in degrees, each against log frequency, so frequency is easy to read and the shape can be sketched by hand. A Nyquist plot draws the response as one curve in the complex plane, real part against imaginary part, with frequency hidden along the curve. Its loops around the point −1 tell you whether a feedback loop is stable." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between impulse response and frequency response?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They describe the same linear system in two domains. The impulse response is the output over time when the input is a single, very short pulse. The frequency response is the gain and phase the system applies to a sine wave at each frequency. The Fourier transform of the impulse response is the frequency response, and the inverse transform takes you back." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a Bode plot in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute the magnitude in dB and the phase in degrees of your transfer function at a few hundred frequencies spaced evenly on a log scale, then plot them on two charts that share a logarithmic frequency axis. In SciChart.js, use a LogarithmicAxis for frequency on both charts, keep their visible ranges in step with visibleRangeChanged, and line them up with a SciChartVerticalGroup." }
                }
            ]
        })}
    </script>
</head>

# Bode Plot

## What is a Bode plot?

A **Bode plot** (pronounced "boh-dee") is a pair of charts that shows a system's **frequency response**: its gain in decibels on top and its phase shift in degrees below, both against frequency on a logarithmic axis. Engineers use it to read a filter's cutoff, an amplifier's bandwidth and how close a control loop is to oscillating.

![A Bode plot in a dark navy theme: the magnitude in dB of a second-order low-pass system on top, with a resonant peak just before the corner and a dashed straight-line approximation, and its phase falling from 0 to -180 degrees below, both on a logarithmic frequency axis from 1 Hz to 1 MHz](/img/learn/bode-plot-og.png)

*The Bode plot of a second-order low-pass system: exact curves and the straight-line asymptotes you would draw by hand. [Try the interactive Bode plot generator](#how-to-make-a-bode-plot-in-javascript-react-or-angular).*

:::tip Key takeaways
- A Bode plot is two charts on one log frequency axis: magnitude in dB (top) and phase in degrees (bottom).
- Each pole bends the magnitude down by 20 dB per decade and the phase by up to −90°; each zero does the opposite.
- At a single pole's corner frequency, the gain is −3 dB and the phase is −45°.
- You can sketch one by hand from straight lines, then correct by 3 dB at each corner (more near a resonance).
- In a feedback loop, the Bode plot gives the gain margin and phase margin: how far the loop is from oscillating.
:::

## What is frequency response?

Feed a sine wave into a linear, time-invariant system (a filter, an amplifier, a mass on a spring) and, once any start-up transient has died away, a sine wave comes out at the same frequency. Only two things can change: its size and its timing. The ratio of output amplitude to input amplitude is the **gain** (or magnitude), and the shift in timing, measured as a fraction of a cycle, is the **phase**.

The frequency response is that pair of numbers for every frequency. Mathematically it is one complex number per frequency, $H(j\omega)$, where $\omega = 2\pi f$ is the angular frequency in radians per second:

$$
H(j\omega) = |H(j\omega)| \, e^{\,j \varphi(\omega)}
$$

The magnitude $|H|$ is the gain and the angle $\varphi$ is the phase. If you know a system's **transfer function** $H(s)$ (its output-to-input ratio written with the Laplace variable $s$), you get the frequency response by putting $s = j\omega$. For a resistor-capacitor (RC) low-pass filter, $H(s) = 1/(1 + sRC)$ becomes $H(j\omega) = 1/(1 + j\omega RC)$.

In mechanical testing the same idea is called a **frequency response function (FRF)**: the ratio of a structure's measured vibration to the force applied, frequency by frequency. In audio, a "frequency response" is often just the magnitude half, shown as a curve of level against frequency for a loudspeaker, microphone or pair of headphones.

Describing a signal or system by what it does to each frequency is working in the **frequency domain**, as opposed to the time domain of waveforms and samples. The [Fourier transform](/learn/signal-processing/fourier-transform/) moves between the two.

## How to read a Bode plot

A **pole** is a factor such as $1/(1 + s/\omega_c)$ in the transfer function's denominator: above its corner frequency $\omega_c$ it bends the magnitude down by 20 dB per decade and moves the phase by up to −90°. A **zero** is the same kind of factor in the numerator, and does the opposite. The Bode plot below is for a system with a gain of 100 and two poles, at 100 Hz and 10 kHz. The solid line is the exact response; the dashed lines are the straight-line approximation explained in the next section.

![A worked example Bode plot. Top: the magnitude is flat at 40 dB, 3 dB down at the 100 Hz corner, falls at 20 dB per decade to 0 dB at 10 kHz, then falls at 40 dB per decade. Bottom: the phase passes -45 degrees at 100 Hz, -90 degrees between the corners and -135 degrees at 10 kHz, heading for -180 degrees](./bode-plot-worked-example.svg)

- The frequency axis is logarithmic. Each major gridline is ten times the one before (a **decade**), so 1 Hz to 1 MHz fits in six equal steps. A doubling of frequency is an **octave**. The axis never reaches zero.
- The top panel is magnitude in decibels: $20 \log_{10} |H|$. 0 dB means the amplitude passes unchanged, positive values mean amplification and negative values attenuation.
- The bottom panel is phase in degrees. Negative phase means the output lags the input; positive means it leads.
- Look for the corners. A corner (or break) frequency is where the slope changes. Here, the magnitude is flat up to 100 Hz, then falls at 20 dB per decade, then at 40 dB per decade above 10 kHz.
- Read the slope as a count. Every pole adds −20 dB per decade of slope and every zero adds +20, so a 40 dB per decade fall means two more poles than zeros are acting.
- Read the bandwidth at −3 dB. The frequency where the gain is 3 dB below its passband level is the usual definition of a filter's cutoff and an amplifier's bandwidth.

Decibels turn multiplication into addition, which is why the two panels can be built up piece by piece. Common values to know:

| Gain in dB | Amplitude ratio | Power ratio |
| --- | --- | --- |
| +20 dB | 10 | 100 |
| +6 dB | about 2 | about 4 |
| 0 dB | 1 | 1 |
| −3 dB | 0.707 | 0.5 (half power) |
| −6 dB | about 0.5 | about 0.25 |
| −20 dB | 0.1 | 0.01 |
| −40 dB | 0.01 | 0.0001 |

## How to draw a Bode plot by hand

Hendrik Bode's insight, set out in his 1945 book on feedback amplifiers, is that a transfer function written as a product of simple factors becomes a sum on a Bode plot, and each factor has an easy straight-line shape. To draw one:

1. Factor the transfer function into a constant gain, powers of $s$, and terms of the form $(1 + s/\omega_c)$ for real poles and zeros, or a quadratic for complex pairs.
2. Find each corner frequency $\omega_c$ (or $f_c = \omega_c / 2\pi$) and mark it on the log axis.
3. Start at the low-frequency end with the constant gain in dB, $20 \log_{10} K$, plus the slope of any $s$ or $1/s$ terms.
4. Walk to the right, changing the slope at each corner by the amount in the table below.
5. Draw the phase the same way, then correct the magnitude near each corner using the exact values.

| Factor | Magnitude asymptote | Phase asymptote | Exact value at the corner |
| --- | --- | --- | --- |
| Constant $K$ | Flat at $20 \log_{10} K$ | 0° (or ±180° if $K$ is negative) | n/a |
| Zero at the origin, $s$ | +20 dB/decade, through 0 dB at $\omega = 1$ | +90° | n/a |
| Pole at the origin, $1/s$ (integrator) | −20 dB/decade | −90° | n/a |
| Real pole, $1/(1 + s/\omega_c)$ | 0 dB, then −20 dB/decade above $\omega_c$ | 0° to −90°, a straight ramp from $0.1\,\omega_c$ to $10\,\omega_c$ | −3 dB, −45° |
| Real zero, $(1 + s/\omega_c)$ | 0 dB, then +20 dB/decade above $\omega_c$ | 0° to +90° over the same two decades | +3 dB, +45° |
| Complex pole pair, damping ratio $\zeta$ | 0 dB, then −40 dB/decade above $\omega_n$ | 0° to −180°, steeper as $\zeta$ falls | $-20 \log_{10}(2\zeta)$ dB above the asymptote, −90° |

### Worked example: two real poles

Take the system plotted above:

$$
H(f) = \frac{100}{\left(1 + j\dfrac{f}{100\ \text{Hz}}\right)\left(1 + j\dfrac{f}{10\ \text{kHz}}\right)}
$$

- Low frequencies: the gain of 100 is $20 \log_{10} 100 = 40$ dB, and the phase is 0°.
- First corner, 100 Hz: the line bends to −20 dB per decade. Over the two decades to 10 kHz it falls by 40 dB, reaching 0 dB.
- Second corner, 10 kHz: a second pole joins in, so the slope becomes −40 dB per decade. At 100 kHz the line is at −40 dB.
- Phase: each pole ramps by −90° over the two decades around its corner. The first ramp runs from 10 Hz to 1 kHz, the second from 1 kHz to 100 kHz, so the phase is −45° at 100 Hz, −90° at 1 kHz, −135° at 10 kHz and −180° from 100 kHz on.

Exact values from the formula:

| Frequency | Asymptote | Exact magnitude | Asymptote phase | Exact phase |
| --- | --- | --- | --- | --- |
| 10 Hz | 40 dB | 39.96 dB | 0° | −5.8° |
| 100 Hz | 40 dB | 36.99 dB | −45° | −45.6° |
| 1 kHz | 20 dB | 19.91 dB | −90° | −90.0° |
| 10 kHz | 0 dB | −3.01 dB | −135° | −134.4° |
| 100 kHz | −40 dB | −40.04 dB | −180° | −174.2° |

The straight lines are within about 3 dB everywhere, and 3 dB out at the corners, so the rule "subtract 3 dB at each real pole's corner" turns a quick sketch into a good one. When two corners are close together, their corrections add up.

### Second-order systems: resonance, Q and the damping ratio

A pair of complex poles, as in a mass on a spring, an RLC circuit or a second-order active filter, has the standard form

$$
H(s) = \frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}
$$

where $\omega_n$ is the **natural frequency** and $\zeta$ (zeta) is the **damping ratio**. Filter designers often use the **quality factor** instead, $Q = 1/(2\zeta)$. Its straight-line magnitude is flat, then falls at 40 dB per decade from $\omega_n$. The exact curve depends strongly on $\zeta$:

![Second-order low-pass magnitude and phase for damping ratios 0.1, 0.3, 0.707 and 1. Lower damping gives a taller peak at the natural frequency (+14 dB for 0.1, +4.4 dB for 0.3) and a sharper phase drop; every curve passes -90 degrees at the natural frequency](./second-order-damping.svg)

- At $\omega_n$ the gain is exactly $1/(2\zeta) = Q$, or $-20 \log_{10}(2\zeta)$ dB, and the phase is −90° whatever the damping.
- Below $\zeta \approx 0.707$ the response peaks before falling. With $\zeta = 0.1$ the peak is about +14 dB, five times the input amplitude. This peak is a **resonance**.
- $\zeta = 1/\sqrt{2} \approx 0.707$ ($Q \approx 0.707$) is the 2nd-order Butterworth response: the flattest response with no peak, and −3 dB exactly at $\omega_n$.
- At $\zeta = 1$ and above the pair becomes two real poles, and the straight-line rules for real poles apply.

The phase of a complex pair turns faster when the damping is low. A common straight-line approximation ramps it from 0° to −180° between $\omega_n / 10^{\zeta}$ and $\omega_n \times 10^{\zeta}$, which becomes a vertical step as $\zeta$ approaches 0.

## Gain margin and phase margin

Control engineers use the Bode plot to check a feedback loop before building it. Plot the **open-loop** response $L(j\omega)$, the gain all the way round the loop with the loop broken, and read two numbers:

- **Gain margin:** at the **phase crossover frequency**, where the phase reaches −180°, how far the gain is below 0 dB. It is how much more gain the loop could take before it oscillates.
- **Phase margin:** at the **gain crossover frequency**, where the gain crosses 0 dB, how far the phase is above −180°. It is how much extra lag the loop could take.

Both should be positive for a stable closed loop (for loops that are stable when opened, which covers most practical designs). A common rule of thumb in control engineering is a phase margin of 30° to 60° and a gain margin of at least 6 dB (a factor of 2). Small margins give a closed loop that rings and overshoots.

For example, take a loop of three identical poles with a gain of 4, $L = 4/(1 + j f/f_c)^3$:

- each pole contributes −60° at $f = \sqrt{3}\,f_c$, so that is the phase crossover. There the gain is $4/8$, so the gain margin is $20 \log_{10} 2 \approx 6.0$ dB;
- the gain falls to 1 (0 dB) at $f \approx 1.23\,f_c$, where the phase is −152.9°, so the phase margin is 27.1°: stable, but likely to ring.

Raise the gain from 4 to 8 and both margins reach zero; beyond that the closed loop is unstable.

## Impulse response vs frequency response

A system's **impulse response**, $h(t)$, is its output when the input is a single very short, very tall pulse (an impulse). For a linear system it tells you everything: the output for any input is the input [convolved](/learn/signal-processing/convolution/) with $h(t)$.

The impulse response and the frequency response are two views of the same thing. The [Fourier transform](/learn/signal-processing/fourier-transform/) of the impulse response is the frequency response:

$$
H(j\omega) = \int_{-\infty}^{\infty} h(t) \, e^{-j\omega t} \, dt
$$

| | Impulse response $h(t)$ | Frequency response $H(j\omega)$ |
| --- | --- | --- |
| Domain | Time | Frequency |
| Answers | How does the system ring, settle and delay after a kick? | How much does it pass, and shift, each frequency? |
| Usual chart | Amplitude against time | A Bode plot (or a Nyquist plot) |
| RC low-pass example | A decaying exponential, $\frac{1}{RC} e^{-t/RC}$ | −3 dB and −45° at $f_c = 1/(2\pi RC)$ |
| Digital filter | The FIR filter's coefficients, or the IIR filter's output for a single 1 | The Fourier transform of those samples |

Narrow in one domain means wide in the other: a short, sharp impulse response belongs to a system with a wide bandwidth, and a long, ringing one to a narrow, resonant response. In audio, an "impulse response" is a recording of a room or a guitar cabinet's $h(t)$, which a plug-in convolves with a dry signal to make it sound as if it were played there.

## How to measure frequency response

When there is no formula, measure it. The common methods:

- Swept or stepped sine: play one sine wave at a time, measure the output's amplitude and phase against the input, and step through the frequencies. Slow, but precise and robust against noise. Frequency response analysers, and many oscilloscopes with a signal generator, draw a Bode plot this way.
- Impulse or step test and an FFT: record the response to a short pulse (or a hammer tap on a structure), then take its [FFT](/learn/signal-processing/fast-fourier-transform/). Quick, but a single pulse carries little energy, so the result can be noisy.
- Broadband noise or a chirp: drive the system with random noise or a fast frequency sweep, record input and output, and estimate $H(f)$ as the cross-spectrum of input and output divided by the input's [power spectrum](/learn/signal-processing/power-spectral-density/), averaged over many blocks. The **coherence** function shows at which frequencies the estimate can be trusted. This is the usual method for FRFs in vibration testing.
- From a model or a digital filter: if you have the transfer function or the filter's coefficients, calculate $H$ directly.

Whichever you use, plot the result on log frequency axes. The [log scale graph guide](/learn/axes-and-scales/log-scale-graph/) explains why a linear axis hides most of a response.

## Bode plot vs Nyquist plot vs Nichols chart

All three charts show the same complex frequency response; they differ in what they make easy to read. A **Nichols chart** plots the gain in dB against the phase in degrees as a single curve, with frequency marked along it.

| | Bode plot | Nyquist plot | Nichols chart |
| --- | --- | --- | --- |
| Axes | Two charts: dB and degrees, each against log frequency | Real part against imaginary part, one curve | dB against phase, one curve |
| Where frequency is | On the x axis | Hidden along the curve | Hidden along the curve |
| Good for | Reading bandwidth and slopes, sketching by hand, combining stages by adding | Stability of feedback loops, including open-loop unstable systems | Designing a loop's gain and phase together, with closed-loop contours |
| Stability check | Gain and phase margins | Encirclements of the point −1 (the Nyquist criterion) | Distance from the point (0 dB, −180°) |
| Hard to read | Stability of unusual loops | Exact frequencies; very large and very small gains | Frequencies; unfamiliar to most readers |

### What is a Nyquist plot?

A Nyquist plot draws $H(j\omega)$ as a path in the complex plane as $\omega$ runs from zero to infinity, usually with its mirror image for negative frequencies. Harry Nyquist's 1932 stability criterion counts how many times the open-loop path circles the point $-1$: for a loop that is stable when opened, the closed loop is stable if the path doesn't circle $-1$ at all. To read one, find where the curve crosses the negative real axis (that gives the gain margin) and where it crosses the unit circle (that gives the phase margin). This is a different use of Nyquist's name from the [Nyquist frequency](/learn/signal-processing/nyquist-and-aliasing/), half the sample rate in sampled data.

## Common Bode plot mistakes

- **Using a linear frequency axis.** Everything below a tenth of the top frequency gets squashed into the left edge, and the straight-line slopes turn into curves. Always use a log axis.
- **Plotting wrapped phase.** Taking the angle of the complex product with `atan2` gives values between −180° and +180°, so a smooth −200° shows as a jump to +160°. Add up the phase of each factor, or unwrap the phase (add or subtract 360° at each jump), before you read margins from it.
- **Mixing hertz and radians per second.** $\omega = 2\pi f$, so a corner at 1,000 rad/s is at 159 Hz. Many textbooks and simulation tools use rad/s; many instruments use Hz. Label the axis.
- **Using 10 log for amplitude.** Amplitude ratios (voltage, current, pressure, displacement) use $20 \log_{10}$; power ratios use $10 \log_{10}$. Applying $10 \log_{10}$ to an amplitude ratio halves every value: an amplitude ratio of 0.1 is −20 dB, not −10 dB.
- **Forgetting the correction near a resonance.** A lightly damped pole pair can sit 10 dB or more above its straight-line asymptote. Check the exact value at $\omega_n$.
- **Reading margins from the closed-loop response.** Gain and phase margins come from the open-loop Bode plot. The closed-loop plot shows bandwidth and peaking instead.
- **Trusting a measurement where the coherence is low.** In noise-driven measurements, frequencies where the output barely relates to the input give a meaningless gain and phase.

## How to make a Bode plot in JavaScript, React or Angular

SciChart.js draws both panels with WebGL and WebGPU on true logarithmic axes, so the plot redraws as fast as you move a slider. This Bode plot generator computes the response of the system you choose and draws the exact curves, the straight-line asymptotes and the key points. Pick a system, then drag the corner frequency and the damping (or the loop gain, for the control loop). Lower the damping and watch the error at the corner grow; choose **Control loop** and raise the loop gain $K$ to 8, where both margins reach zero. Hover to read values on both charts at once, scroll to zoom the frequency axis, drag to pan, and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="Bode plot" demo="chart-logarithmic-axis" docs="/2d-charts/axis-api/axis-types/logarithmic-axis/" docsLabel="SciChart.js logarithmic axis documentation" />

Here is the code for this example. The JavaScript tab includes the pole and zero helpers; the React and Angular tabs show the chart setup (two charts with a shared logarithmic frequency axis) for your own magnitude and phase data:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        ENumericFormat,
        EXyDirection,
        XyDataSeries,
        FastLineRenderableSeries,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    // One chart of the pair: a log frequency axis and a y axis
    const createPanel = async (div: HTMLDivElement, yTitle: string, showFrequencyLabels: boolean) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(div, { theme: new SciChartJsNavyTheme() });
        const xAxis = new LogarithmicAxis(wasmContext, {
            logBase: 10,
            labelFormat: ENumericFormat.Engineering,
            axisTitle: showFrequencyLabels ? "Frequency (Hz)" : undefined,
            drawLabels: showFrequencyLabels
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: yTitle, growBy: new NumberRange(0.1, 0.1) }));
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "bode", showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { wasmContext, sciChartSurface, xAxis };
    };

    // initChart builds both charts inside one element; SciChartReact sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const root = rootElement as HTMLDivElement;
        const [magnitudeDiv, phaseDiv] = [document.createElement("div"), document.createElement("div")];
        root.style.display = "flex";
        root.style.flexDirection = "column";
        magnitudeDiv.style.flex = phaseDiv.style.flex = "1";
        root.append(magnitudeDiv, phaseDiv);

        const magnitude = await createPanel(magnitudeDiv, "Magnitude (dB)", false);
        const phase = await createPanel(phaseDiv, "Phase (°)", true);

        // Your frequencies (Hz, all above 0) with the gain in dB and phase in degrees at each
        const { frequencies, gainDb, phaseDeg } = getYourFrequencyResponse();
        for (const [panel, values] of [[magnitude, gainDb], [phase, phaseDeg]] as const) {
            panel.sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(panel.wasmContext, {
                    dataSeries: new XyDataSeries(panel.wasmContext, { xValues: frequencies, yValues: values }),
                    stroke: "#50C7E0",
                    strokeThickness: 3
                })
            );
        }

        // Zoom and pan the two frequency axes together, and line the charts up
        magnitude.xAxis.visibleRangeChanged.subscribe((args) => (phase.xAxis.visibleRange = args.visibleRange));
        phase.xAxis.visibleRangeChanged.subscribe((args) => (magnitude.xAxis.visibleRange = args.visibleRange));
        const group = new SciChartVerticalGroup();
        group.addSurfaceToGroup(magnitude.sciChartSurface);
        group.addSurfaceToGroup(phase.sciChartSurface);

        magnitude.sciChartSurface.addDeletable(phase.sciChartSurface); // delete both charts together
        return { sciChartSurface: magnitude.sciChartSurface };
    };

    export const BodePlot = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 600 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        ENumericFormat,
        EXyDirection,
        XyDataSeries,
        FastLineRenderableSeries,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    // One chart of the pair: a log frequency axis and a y axis
    const createPanel = async (div: HTMLDivElement, yTitle: string, showFrequencyLabels: boolean) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(div, { theme: new SciChartJsNavyTheme() });
        const xAxis = new LogarithmicAxis(wasmContext, {
            logBase: 10,
            labelFormat: ENumericFormat.Engineering,
            axisTitle: showFrequencyLabels ? "Frequency (Hz)" : undefined,
            drawLabels: showFrequencyLabels
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: yTitle, growBy: new NumberRange(0.1, 0.1) }));
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "bode", showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { wasmContext, sciChartSurface, xAxis };
    };

    @Component({
        selector: "app-bode-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 600px"></scichart-angular>`
    })
    export class BodePlotComponent {
        // initChart builds both charts inside one element; scichart-angular sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const root = rootElement as HTMLDivElement;
            const [magnitudeDiv, phaseDiv] = [document.createElement("div"), document.createElement("div")];
            root.style.display = "flex";
            root.style.flexDirection = "column";
            magnitudeDiv.style.flex = phaseDiv.style.flex = "1";
            root.append(magnitudeDiv, phaseDiv);

            const magnitude = await createPanel(magnitudeDiv, "Magnitude (dB)", false);
            const phase = await createPanel(phaseDiv, "Phase (°)", true);

            // Your frequencies (Hz, all above 0) with the gain in dB and phase in degrees at each
            const { frequencies, gainDb, phaseDeg } = getYourFrequencyResponse();
            for (const [panel, values] of [[magnitude, gainDb], [phase, phaseDeg]] as const) {
                panel.sciChartSurface.renderableSeries.add(
                    new FastLineRenderableSeries(panel.wasmContext, {
                        dataSeries: new XyDataSeries(panel.wasmContext, { xValues: frequencies, yValues: values }),
                        stroke: "#50C7E0",
                        strokeThickness: 3
                    })
                );
            }

            // Zoom and pan the two frequency axes together, and line the charts up
            magnitude.xAxis.visibleRangeChanged.subscribe((args) => (phase.xAxis.visibleRange = args.visibleRange));
            phase.xAxis.visibleRangeChanged.subscribe((args) => (magnitude.xAxis.visibleRange = args.visibleRange));
            const group = new SciChartVerticalGroup();
            group.addSurfaceToGroup(magnitude.sciChartSurface);
            group.addSurfaceToGroup(phase.sciChartSurface);

            magnitude.sciChartSurface.addDeletable(phase.sciChartSurface); // delete both charts together
            return { sciChartSurface: magnitude.sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Logarithmic frequency axis: a [LogarithmicAxis](/2d-charts/axis-api/axis-types/logarithmic-axis/) with `logBase: 10` spaces decades equally. `ENumericFormat.Engineering` labels them 1, 10, 100, 1K, 10K; `autoTicks: false` with `majorDelta: 1` puts one labelled gridline on each decade. All x values must be above zero.
- Two synchronised charts: each chart's x axis `visibleRangeChanged` event sets the other's `visibleRange`, so zooming either one zooms both, and a [SciChartVerticalGroup](/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/) gives both charts the same y axis width so their frequencies line up. A shared `modifierGroup` on the `CursorModifier` shows the crosshair and tooltip on both charts at once.
- The maths is plain JavaScript: each factor (gain, pole, zero, complex pair) returns its dB and degrees, and the totals are sums. Adding the phases of the factors gives a continuous phase with no ±180° wrapping.
- Live updates: the demo keeps each `XyDataSeries` and calls `clear()` and `appendRange()` when a control changes. The asymptotes are a second `FastLineRenderableSeries` with a `strokeDashArray`, and the −3 dB points and crossovers are an `XyScatterRenderableSeries`.

**See it in the demo app:** [JavaScript chart with a logarithmic axis](https://www.scichart.com/demo/javascript/chart-logarithmic-axis) · [React chart with a logarithmic axis](https://www.scichart.com/demo/react/chart-logarithmic-axis) · [Angular chart with a logarithmic axis](https://www.scichart.com/demo/angular/chart-logarithmic-axis). For a live spectrum, see the [JavaScript audio analyzer](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example).

**Go deeper:** [SciChart.js logarithmic axis documentation](/2d-charts/axis-api/axis-types/logarithmic-axis/), [synchronizing multiple charts](/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/), the [log scale graph guide](/learn/axes-and-scales/log-scale-graph/), and the filter guides in this section: [low-pass filter](/learn/signal-processing/low-pass-filter/) and [high-pass filter](/learn/signal-processing/high-pass-filter/), whose live demos each draw a filter's frequency response.

## Frequently asked questions

### What is a Bode plot used for?

A Bode plot shows how a system treats each frequency: how much it amplifies or attenuates it, and how far it shifts it in time (the phase). Engineers use it to see a filter's cutoff and roll-off, an amplifier's bandwidth, a loudspeaker's or sensor's useful range, and how close a feedback control loop is to instability (its gain and phase margins).

### How do you read a Bode plot?

Read across the log frequency axis, where each gridline is ten times the last. The top panel gives the gain in decibels: 0 dB means unchanged, −20 dB means one tenth of the amplitude. The bottom panel gives the phase in degrees: negative means the output lags the input. Corners are where the slope changes; the slope tells you how many poles or zeros are acting, at 20 dB per decade each.

### What does −20 dB per decade mean? {#what-does--20-db-per-decade-mean}

It means the gain falls by 20 dB, a factor of ten in amplitude, every time the frequency rises tenfold. It is the slope of one pole, such as a first-order RC low-pass filter above its cutoff. It is the same as about −6 dB per octave (each doubling of frequency). Two poles give −40 dB per decade, three give −60, and so on.

### What is the difference between a Bode plot and a Nyquist plot?

Both show the same frequency response. A Bode plot uses two charts, gain in dB and phase in degrees, each against log frequency, so frequency is easy to read and the shape can be sketched by hand. A Nyquist plot draws the response as one curve in the complex plane, real part against imaginary part, with frequency hidden along the curve. Its loops around the point −1 tell you whether a feedback loop is stable.

### What is the difference between impulse response and frequency response?

They describe the same linear system in two domains. The impulse response is the output over time when the input is a single, very short pulse. The frequency response is the gain and phase the system applies to a sine wave at each frequency. The Fourier transform of the impulse response is the frequency response, and the inverse transform takes you back.

### How do I make a Bode plot in JavaScript?

Compute the magnitude in dB and the phase in degrees of your transfer function at a few hundred frequencies spaced evenly on a log scale, then plot them on two charts that share a logarithmic frequency axis. In SciChart.js, use a LogarithmicAxis for frequency on both charts, keep their visible ranges in step with visibleRangeChanged, and line them up with a SciChartVerticalGroup.

## Sources

- Bode, H. W. (1945), *Network Analysis and Feedback Amplifier Design*, Van Nostrand. The origin of the gain-phase plot, the straight-line approximations and the gain and phase margins.
- Nyquist, H. (1932), "Regeneration Theory", *Bell System Technical Journal*, 11(1), pp. 126–147. The Nyquist stability criterion.
- Ogata, K. (2010), *Modern Control Engineering*, 5th edition, Prentice Hall. Bode, Nyquist and Nichols plots; gain and phase margins.
- Oppenheim, A. V. and Willsky, A. S. (1997), *Signals and Systems*, 2nd edition, Prentice Hall; lectures on [MIT OpenCourseWare, RES.6-007](https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/). Frequency response, impulse response and Bode plots of first- and second-order systems.
- Bendat, J. S. and Piersol, A. G. (2010), *Random Data: Analysis and Measurement Procedures*, 4th edition, Wiley. Measuring frequency response functions from noise, and the coherence function.
- Smith, S. W. (1997), [*The Scientist and Engineer's Guide to Digital Signal Processing*](https://www.dspguide.com/pdfbook.htm), California Technical Publishing. Chapters 5 (linear systems), 6 (convolution) and 14 (introduction to digital filters, including the frequency response).

<LearnCta position="bottom" chart="Bode plot" demo="chart-logarithmic-axis" docs="/2d-charts/axis-api/axis-types/logarithmic-axis/" docsLabel="SciChart.js logarithmic axis documentation" />
