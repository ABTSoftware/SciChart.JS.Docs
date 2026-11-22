---
sidebar_position: 110
sidebar_label: High-Pass Filter
title: "High-Pass Filter: Cutoff, RC Circuit and Digital Design"
description: "What a high-pass filter is and what it does: cutoff frequency, roll-off and order, the RC circuit formula with a worked example, digital IIR and FIR designs, and a live drift-removal demo."
keywords:
    [
        "high pass filter",
        "high-pass filter",
        "what is a high pass filter",
        "what does a high pass filter do",
        "high pass filter cutoff frequency",
        "rc high pass filter",
        "high pass filter circuit",
        "high pass filter transfer function",
        "high pass filter bode plot",
        "active high pass filter",
        "passive high pass filter",
        "high pass filter audio",
        "digital high pass filter",
        "high pass vs low pass filter"
    ]
image: /img/learn/high-pass-filter-og.png
related: [fourier-transform, low-pass-filter, band-pass-filter, notch-filter]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a high-pass filter do?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A high-pass filter lets fast changes through and removes slow ones. It blocks a steady DC offset, slow drift and low-frequency noise such as rumble or hum below its cutoff frequency, and keeps the higher-frequency detail above it, such as speech, vibration or the sharp parts of a heartbeat." }
                },
                {
                    "@type": "Question",
                    "name": "How do you calculate the cutoff frequency of a high-pass filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For a first-order RC high-pass filter, the cutoff frequency is fc = 1 / (2 pi R C), with R in ohms and C in farads. For example, R = 20 kilohms and C = 100 nanofarads give a cutoff of about 80 Hz. At the cutoff, the output is 3 dB down, about 71% of the input amplitude." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a high-pass and a low-pass filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A high-pass filter keeps frequencies above its cutoff and removes those below it, so it strips out offsets, drift and rumble. A low-pass filter does the opposite: it keeps frequencies below its cutoff and removes those above, so it smooths out fast noise. Subtracting a low-pass output from the original signal gives a high-pass output." }
                },
                {
                    "@type": "Question",
                    "name": "What should I set my high-pass filter to?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Set the cutoff just below the lowest frequency you need to keep. For voice recordings that is often around 75 to 100 Hz; for removing sensor drift it may be well under 1 Hz; diagnostic ECGs use about 0.05 Hz, or up to 0.67 Hz with zero-phase digital filters. Too high a cutoff removes part of the signal you wanted." }
                },
                {
                    "@type": "Question",
                    "name": "What is a high-pass filter in audio?",
                    "acceptedAnswer": { "@type": "Answer", "text": "In audio, a high-pass filter (also called a low-cut filter) removes low frequencies that add muddiness rather than music: microphone handling noise, stage and traffic rumble, wind and breath pops. It is commonly used on vocals and many instruments that have little useful low end, and in loudspeaker crossovers to keep bass out of tweeters." }
                },
                {
                    "@type": "Question",
                    "name": "How do I apply a high-pass filter in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For a quick filter, loop over your samples with the first-order recurrence y[n] = alpha * (y[n-1] + x[n] - x[n-1]), where alpha = RC / (RC + dt). For a sharper cutoff, convolve the samples with a windowed-sinc high-pass kernel. To chart the result with SciChart.js, apply it with an XyCustomFilter, whose filter function is called for each sample in order, so the filtered line updates whenever the data changes." }
                }
            ]
        })}
    </script>
</head>

# High-Pass Filter

## What is a high-pass filter?

A **high-pass filter** (HPF, also called a low-cut filter or bass-cut filter) is a filter that lets frequencies above a chosen **cutoff frequency** pass and weakens those below it. In practice it removes slow changes, such as a DC offset, drift or rumble, and keeps the faster detail.

![A drifting ECG-like trace in orange and the same trace after a high-pass filter in blue, flat on zero, with a frequency response plot below it, in a dark navy theme](/img/learn/high-pass-filter-og.png)

*An ECG-like signal with baseline drift (orange) and after a 0.5 Hz high-pass filter (blue), with the filter's frequency response below (sample data). [Try the interactive version](#how-to-apply-a-high-pass-filter-in-javascript-react-or-angular).*

:::tip Key takeaways
- A high-pass filter keeps fast changes and removes slow ones: offsets, drift, baseline wander, rumble and hum below the cutoff.
- The cutoff frequency is usually where the output is 3 dB down (half the power, about 71% of the amplitude). Below it the gain rolls off at 20 dB per decade for each order of the filter.
- An RC high-pass filter has a cutoff of $f_c = 1/(2\pi RC)$.
- In code, use a first-order IIR (a DC blocker) for speed, or a windowed-sinc FIR for a sharp cutoff with no phase distortion.
- Set the cutoff just below the lowest frequency you need. Too high, and the filter removes part of the signal and adds ringing.
:::

Anything steady or slowly wandering counts as low frequency, so the filter pulls it to zero. Anything that changes fast, such as a voice, a vibration or the sharp peak of a heartbeat, passes through.

Common uses:

| Field | What the high-pass filter removes | Typical cutoff |
| --- | --- | --- |
| Audio recording and mixing | Microphone handling noise, rumble from floors, traffic and air conditioning, wind and breath pops | Often 75 to 100 Hz on vocals |
| Loudspeakers | Bass that would damage a tweeter (one half of a crossover) | A few kHz |
| ECG and other biosignals | Baseline wander from breathing and electrode movement | 0.05 Hz for diagnosis, up to 0.67 Hz with zero-phase filters |
| Sensors and measurement | Temperature drift, a DC offset, or gravity in an accelerometer when you want only the motion | Well under 1 Hz |
| Electronics | DC bias between amplifier stages (a coupling capacitor is a high-pass filter) | Below the lowest signal frequency |
| Images | Smooth areas, keeping edges and fine texture (the basis of sharpening and edge detection) | Set by the kernel size |

The image case works on space rather than time: a high-pass filter applied across the pixels keeps sharp changes in brightness, which are the edges. Photo editors' "high pass" sharpening is the same idea.

## How a high-pass filter works

A high-pass filter is described by its **frequency response**: how much it scales each frequency, usually shown as a [Bode plot](/learn/signal-processing/bode-plot/) of gain in decibels (dB) against frequency on a log scale.

![On the left, a first-order RC high-pass circuit: a capacitor C in series from input to output and a resistor R from output to ground, with fc = 1 / (2 pi R C). On the right, its frequency response: the gain rises at 20 dB per decade up to the cutoff, is 3 dB down at the cutoff, and is flat at 0 dB above it](./rc-high-pass-filter-response.svg)

Three properties describe it:

- Cutoff frequency ($f_c$). The boundary between the frequencies the filter blocks (the **stopband**) and those it passes (the **passband**). For most analogue and IIR filters it's the **−3 dB point**, where the output power is half the input power and the amplitude is $1/\sqrt{2}$, about 71%. Windowed-sinc FIR filters are usually specified at the −6 dB point (half amplitude) instead.
- Roll-off. How fast the gain falls below the cutoff. A first-order filter falls by 20 dB per decade (6 dB per octave): every tenfold drop in frequency cuts the amplitude tenfold.
- Order. Each extra order adds another 20 dB per decade. A second-order filter falls at 40 dB per decade, a fourth-order at 80. Higher orders give a sharper boundary, at the cost of more components or computation and more ringing.

| Order | Roll-off below the cutoff | Gain one decade below the cutoff (ideal) | Built with |
| --- | --- | --- | --- |
| 1st | 20 dB per decade | −20 dB (10% amplitude) | One capacitor and one resistor |
| 2nd | 40 dB per decade | −40 dB (1%) | RLC circuit, or an op-amp stage such as Sallen–Key |
| 4th | 80 dB per decade | −80 dB (0.01%) | Two second-order stages in a row |

### High-pass filter transfer function

For a first-order high-pass filter with cutoff angular frequency $\omega_c = 2\pi f_c = 1/RC$:

$$
H(s) = \frac{s}{s + \omega_c}, \qquad |H(f)| = \frac{f/f_c}{\sqrt{1 + (f/f_c)^2}}
$$

At $f = f_c$ the gain is $1/\sqrt{2}$ (−3 dB). Far below the cutoff, $|H| \approx f/f_c$, which is the 20 dB per decade slope. Far above it, $|H| \approx 1$.

A high-pass filter also shifts the phase (timing) of each frequency. A first-order filter moves the phase forward by $90^\circ - \arctan(f/f_c)$: nearly 90° far below the cutoff, 45° at the cutoff, and close to zero far above it. That shift changes the shape of a waveform even where its amplitude passes almost untouched (see [common mistakes](#common-high-pass-filter-mistakes)).

## RC high-pass filter circuit

The simplest **passive high-pass filter** is a capacitor in series with the signal and a resistor to ground, as in the diagram above. A capacitor blocks a steady voltage completely but lets a changing one through, more easily the faster it changes (its impedance is $1/(2\pi f C)$). So the faster the input changes, the more of it reaches the resistor and the output.

$$
f_c = \frac{1}{2\pi RC}
$$

The product $RC$ is the **time constant** $\tau$, in seconds. After a sudden step at the input, the output jumps with it, then decays back to zero, falling to about 37% after one time constant.

### Worked example: an 80 Hz high-pass filter for a voice microphone

You want to remove rumble below about 80 Hz, and you have a 100 nF capacitor.

1. Rearrange the formula for R: $R = 1/(2\pi f_c C) = 1/(2\pi \times 80 \times 100 \times 10^{-9}) \approx 19{,}900\ \Omega$.
2. The nearest standard value is 20 kΩ, which gives $f_c = 1/(2\pi \times 20{,}000 \times 100 \times 10^{-9}) \approx 79.6$ Hz.
3. The time constant is $\tau = RC = 2$ ms.

How much of each frequency gets through:

| Frequency | Ratio $f/f_c$ | Gain | Amplitude passed | Phase lead |
| --- | --- | --- | --- | --- |
| 8 Hz (rumble) | 0.1 | −20.0 dB | 10% | 84° |
| 20 Hz | 0.25 | −12.3 dB | 24% | 76° |
| 40 Hz | 0.5 | −7.0 dB | 45% | 63° |
| 80 Hz (cutoff) | 1 | −3.0 dB | 71% | 45° |
| 160 Hz | 2 | −1.0 dB | 89% | 26° |
| 1,000 Hz (voice) | 12.6 | −0.03 dB | 99.7% | 4.5° |

40 Hz still gets through at 45%. For a sharper cut, use a higher-order filter.

### Active, RL and higher-order high-pass filters

- Active high-pass filter. Adds an op-amp to the RC network, so the filter can have gain, drive a load without changing its cutoff, and be cascaded. The Sallen–Key circuit is a common second-order active design, and choosing its components for a Butterworth response gives the flattest possible passband.
- RL high-pass filter. A resistor in series and an inductor to ground, with $f_c = R/(2\pi L)$. Inductors are bulky at low frequencies, so RL and LC high-pass filters appear mainly in radio-frequency circuits and loudspeaker crossovers.
- Second-order RLC or LC high-pass filter. Combines a capacitor and an inductor for 40 dB per decade. Near the cutoff, its response can peak, depending on the damping.

## Digital high-pass filters

In software, a filter is a rule for computing each output sample from input samples. There are three common ways to build a digital high-pass filter (for how FIR and IIR designs compare in general, see [FIR vs IIR filters](/learn/signal-processing/fir-vs-iir-filters/)). The [live demo below](#how-to-apply-a-high-pass-filter-in-javascript-react-or-angular) runs the first-order IIR and the windowed-sinc FIR, and its code includes both.

### First-order IIR high-pass filter (DC blocker)

This is the digital version of the RC circuit. Each output depends on the previous output, which makes it an **infinite impulse response (IIR)** filter:

$$
y[n] = \alpha\,\big(y[n-1] + x[n] - x[n-1]\big), \qquad \alpha = \frac{RC}{RC + \Delta t}, \quad RC = \frac{1}{2\pi f_c}
$$

where $\Delta t$ is the time between samples. Written this way, it takes one multiplication per sample and almost no memory, so it runs on any microcontroller and in real time. With $\alpha$ close to 1, it's the classic **DC blocker** used in audio code. Its trade-offs are the gentle 20 dB per decade roll-off and the phase shift near the cutoff. Its cutoff is accurate when $f_c$ is well below the sample rate.

### Subtracting a low-pass filter from the original

Whatever a [low-pass filter](/learn/signal-processing/low-pass-filter/) keeps, the original signal minus it is the rest: $\text{high-pass} = x - \text{low-pass}(x)$. Subtracting a moving average is the simplest example, and a quick way to remove drift from a sensor log. It works exactly when the low-pass filter doesn't delay the signal; otherwise, line the two up first.

### Windowed-sinc FIR high-pass filter (spectral inversion)

A **finite impulse response (FIR)** filter is a list of weights, its **kernel**, that you slide along the signal with [convolution](/learn/signal-processing/convolution/). To make a high-pass kernel:

1. Design a low-pass kernel: a sinc function, $\sin(2\pi f_c k)/(\pi k)$, shaped by a window such as Blackman.
2. Scale it so its taps add up to 1 (a gain of 1 at 0 Hz).
3. Spectral inversion: negate every tap, then add 1 to the centre tap. The new kernel is "an impulse minus the low-pass", which is the subtraction method written as one kernel.

A symmetric FIR kernel has **linear phase**: every frequency is delayed by the same amount, so waveform shapes are kept. Applied centred on each sample, offline, it has no delay at all. The cost is length: the transition from stopband to passband is roughly $4/N$ of the sample rate wide for a Blackman window of $N$ taps, so a sharp cutoff at a very low frequency needs a very long kernel. For speed on long kernels, do the convolution with an [FFT](/learn/signal-processing/fast-fourier-transform/).

| Method | Roll-off | Phase | Cost per sample | Good for |
| --- | --- | --- | --- | --- |
| First-order IIR (DC blocker) | 20 dB per decade | Shifts near the cutoff | 1 multiplication | Real time, removing DC and slow drift |
| Original minus low-pass | Depends on the low-pass | Zero if the low-pass has no delay | That of the low-pass | Quick drift removal, sensor logs |
| Windowed-sinc FIR | Sharp, set by the kernel length | Linear (zero when centred) | One multiplication per tap | Precise cutoffs, keeping waveform shape |
| Higher-order IIR (e.g. Butterworth) | 20 dB per decade per order | Shifts more with each order | A few multiplications per stage | Sharp cutoffs on a small budget |

To check any of these, look at its frequency response, or take the FFT of the signal before and after: the energy below the cutoff should be gone.

## High-pass vs low-pass vs band-pass vs band-stop filters

The four basic filter types differ only in which frequencies they keep:

| Filter | Keeps | Removes | Use it when you want to… | Example |
| --- | --- | --- | --- | --- |
| High-pass | Above the cutoff | Below the cutoff | Remove offset, drift, rumble or slow trends | ECG baseline wander, vocal low cut |
| [Low-pass](/learn/signal-processing/low-pass-filter/) | Below the cutoff | Above the cutoff | Smooth out fast noise, or stop aliasing before sampling | Sensor smoothing, anti-aliasing |
| [Band-pass](/learn/signal-processing/band-pass-filter/) | Between two cutoffs | Below and above the band | Keep one range of frequencies | A radio channel, or one band of a vibration signal |
| [Band-stop (notch)](/learn/signal-processing/notch-filter/) | Below and above the band | Between two cutoffs | Remove one narrow interference | 50 or 60 Hz mains hum |

A band-pass filter is a high-pass and a low-pass in a row. A band-stop filter is the original minus a band-pass. A **high-shelf** or **low-shelf** EQ turns the frequencies above or below a set point up or down by a fixed amount instead of removing them.

## Common high-pass filter mistakes

A high-pass filter goes wrong most often through a cutoff set too high, or through side effects that look like real features.

- **Setting the cutoff too high.** The filter removes part of the signal you need. On an ECG, a cutoff of a few hertz flattens and distorts the slow ST segment and T wave; on a voice, it thins out the sound. Set the cutoff just below the lowest frequency you care about.
- **Ignoring phase shift.** An IIR high-pass filter shifts frequencies near the cutoff by different amounts, so pulses and slow waves change shape even when their size is kept. ECG standards therefore allow a higher cutoff only for zero-phase (linear-phase) digital filters. Use a centred FIR filter, or run an IIR filter forwards then backwards, when shape matters.
- **Mistaking ringing and undershoot for real events.** A high-pass filter turns a step into a spike that decays, and a sharp filter adds ripples (ringing) on either side of fast edges. A flat-topped pulse sags, then dips below zero after it ends.
- **Ignoring start-up and edge transients.** If the signal starts far from zero, an IIR filter's output jumps at the start and takes several time constants to settle, and an FIR filter needs data beyond the ends. Start the filter from the first sample's value, or extend the ends, and discard the settling period.
- **Using a short FIR kernel for a very low cutoff.** A kernel that is short compared with one period of the cutoff can't separate frequencies that close to zero. Use a longer kernel, an IIR filter, or downsample first.
- **Choosing the cutoff without knowing the sample rate.** Digital cutoffs are relative to the sample rate. The same coefficients give a different cutoff at a different rate, and the cutoff must be well below half the sample rate (the Nyquist frequency).
- **Filtering unevenly spaced data as if it were even.** These formulas assume a fixed time between samples. Resample first, or use $\Delta t$ for each step in the IIR filter.

## How to apply a high-pass filter in JavaScript, React or Angular

Each time you move a control, the demo filters 8 seconds of signal at 250 samples per second (2,000 samples) with either a one-line IIR filter or a 1,001-tap FIR kernel, and redraws both charts. In the demo below, the orange line is an ECG-like signal with baseline drift, and the blue line is the high-pass filtered copy; the bottom chart is the filter's frequency response, with the cutoff marked. Move the **cutoff** slider, or switch between the **first-order IIR** and the **windowed-sinc FIR** filter. Try a cutoff above 2 Hz to see the filter start to distort the beats. Hover to compare the two lines at any moment; scroll, drag and double-click to zoom, pan and reset.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="high-pass filter" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />

Here is the code for this chart. The filter design helpers are plain JavaScript, and SciChart.js applies the filter to the chart's data with an `XyCustomFilter`.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal" }));

        const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
        const raw = new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Raw" });

        // First-order IIR high-pass, 0.5 Hz cutoff: y[n] = alpha * (y[n-1] + x[n] - x[n-1])
        const rc = 1 / (2 * Math.PI * 0.5);
        const alpha = rc / (rc + 1 / sampleRate);
        let previousOutput = 0;
        // Called for each sample in index order: from 0 on a full recompute, and from the first new index on append
        const highPassAt = (index: number, value: number) => {
            previousOutput = index === 0 ? 0 : alpha * (previousOutput + value - raw.getNativeYValues().get(index - 1));
            return previousOutput;
        };
        const highPassed = new XyCustomFilter(raw, { dataSeriesName: "High-pass filtered", filterFunction: highPassAt });

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: raw, stroke: "#F48420" }),
            new FastLineRenderableSeries(wasmContext, { dataSeries: highPassed, stroke: "#50C7E0", strokeThickness: 2 })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new LegendModifier(),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const HighPassFilterChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-high-pass-filter-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class HighPassFilterChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal" }));

            const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
            const raw = new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Raw" });

            // First-order IIR high-pass, 0.5 Hz cutoff: y[n] = alpha * (y[n-1] + x[n] - x[n-1])
            const rc = 1 / (2 * Math.PI * 0.5);
            const alpha = rc / (rc + 1 / sampleRate);
            let previousOutput = 0;
            // Called for each sample in index order: from 0 on a full recompute, and from the first new index on append
            const highPassAt = (index: number, value: number) => {
                previousOutput = index === 0 ? 0 : alpha * (previousOutput + value - raw.getNativeYValues().get(index - 1));
                return previousOutput;
            };
            const highPassed = new XyCustomFilter(raw, { dataSeriesName: "High-pass filtered", filterFunction: highPassAt });

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries: raw, stroke: "#F48420" }),
                new FastLineRenderableSeries(wasmContext, { dataSeries: highPassed, stroke: "#50C7E0", strokeThickness: 2 })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new LegendModifier(),
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

- `XyCustomFilter` is a data series computed from another series by a `filterFunction(index, y)`. SciChart.js calls it for each sample in index order: from index 0 when the filter is created or its function is set, and from the first new index when data is appended. So the filtered line stays in step with live data.
- Because the function gets the index, it can read neighbouring samples from the source series (the FIR's convolution) and carry state between calls (the IIR's previous output, reset at index 0).
- Setting `filterFunction` again reruns the filter over all the data; the demo does this whenever a control moves.
- The frequency response chart uses a `LogarithmicAxis` for frequency, as a Bode plot does, with a `VerticalLineAnnotation` at the cutoff and a `HorizontalLineAnnotation` at −3 dB.

**See it in the demo app:** [JavaScript trendline and moving average filters](https://www.scichart.com/demo/javascript/trend-ma-ratio) · [React trendline and moving average filters](https://www.scichart.com/demo/react/trend-ma-ratio) · [Angular trendline and moving average filters](https://www.scichart.com/demo/angular/trend-ma-ratio), where the moving average is the low-pass you would subtract to remove a trend. For a biosignal example, see the [JavaScript vital signs ECG/EKG medical demo](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example).

**Go deeper:** [SciChart.js custom filter documentation](/2d-charts/chart-types/data-filters-api/custom-filter/), and the [Filters API overview](/2d-charts/chart-types/data-filters-api/data-filters-api-overview/), including the built-in [moving average filter](/2d-charts/chart-types/data-filters-api/moving-average-filter/), a simple low-pass you can subtract from the original.

## Frequently asked questions

### What does a high-pass filter do?

A high-pass filter lets fast changes through and removes slow ones. It blocks a steady DC offset, slow drift and low-frequency noise such as rumble or hum below its cutoff frequency, and keeps the higher-frequency detail above it, such as speech, vibration or the sharp parts of a heartbeat.

### How do you calculate the cutoff frequency of a high-pass filter?

For a first-order RC high-pass filter, the cutoff frequency is fc = 1 / (2 pi R C), with R in ohms and C in farads. For example, R = 20 kilohms and C = 100 nanofarads give a cutoff of about 80 Hz. At the cutoff, the output is 3 dB down, about 71% of the input amplitude.

### What is the difference between a high-pass and a low-pass filter?

A high-pass filter keeps frequencies above its cutoff and removes those below it, so it strips out offsets, drift and rumble. A low-pass filter does the opposite: it keeps frequencies below its cutoff and removes those above, so it smooths out fast noise. Subtracting a low-pass output from the original signal gives a high-pass output.

### What should I set my high-pass filter to?

Set the cutoff just below the lowest frequency you need to keep. For voice recordings that is often around 75 to 100 Hz; for removing sensor drift it may be well under 1 Hz; diagnostic ECGs use about 0.05 Hz, or up to 0.67 Hz with zero-phase digital filters. Too high a cutoff removes part of the signal you wanted.

### What is a high-pass filter in audio?

In audio, a high-pass filter (also called a low-cut filter) removes low frequencies that add muddiness rather than music: microphone handling noise, stage and traffic rumble, wind and breath pops. It is commonly used on vocals and many instruments that have little useful low end, and in loudspeaker crossovers to keep bass out of tweeters.

### How do I apply a high-pass filter in JavaScript?

For a quick filter, loop over your samples with the first-order recurrence y[n] = alpha * (y[n-1] + x[n] - x[n-1]), where alpha = RC / (RC + dt). For a sharper cutoff, convolve the samples with a windowed-sinc high-pass kernel. To chart the result with SciChart.js, apply it with an XyCustomFilter, whose filter function is called for each sample in order, so the filtered line updates whenever the data changes.

## Sources

- Smith, S. W., *The Scientist and Engineer's Guide to Digital Signal Processing*: [chapter 14, Introduction to Digital Filters](https://www.dspguide.com/ch14.htm) (high-pass by spectral inversion), [chapter 16, Windowed-Sinc Filters](https://www.dspguide.com/ch16.htm) and [chapter 19, Recursive Filters](https://www.dspguide.com/ch19.htm) (single-pole high-pass).
- Smith, J. O., [Introduction to Digital Filters: the DC Blocker](https://ccrma.stanford.edu/~jos/filters/DC_Blocker.html). Center for Computer Research in Music and Acoustics, Stanford University.
- Oppenheim, A. V. and Schafer, R. W. (2010), *Discrete-Time Signal Processing*, 3rd edition, Pearson. FIR and IIR filter design, linear phase.
- Kligfield, P. et al. (2007), [Recommendations for the Standardization and Interpretation of the Electrocardiogram, Part I](https://doi.org/10.1161/CIRCULATIONAHA.106.180200). *Circulation*, 115(10). The 0.05 Hz and 0.67 Hz low-frequency cutoffs for diagnostic ECGs.
- MIT OpenCourseWare, [6.003 Signals and Systems](https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/). Frequency response, Bode plots and first-order systems.

<LearnCta position="bottom" chart="high-pass filter" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />
