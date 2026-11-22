---
sidebar_position: 30
sidebar_label: Band-Pass Filter
title: "Band-Pass Filter: How It Works, Bandwidth and Q (Interactive Example)"
description: "What a band-pass filter is, how to work out its centre frequency, bandwidth and Q, passive, RLC and active circuits, the transfer function and digital designs. Live demo."
keywords:
    [
        "band pass filter",
        "band-pass filter",
        "bandpass filter",
        "what is a band pass filter",
        "band pass filter circuit",
        "active band pass filter",
        "passive band pass filter",
        "rlc band pass filter",
        "butterworth bandpass filter",
        "band pass filter transfer function",
        "band pass filter bode plot",
        "band pass filter equation",
        "narrow band pass filter",
        "band pass vs band stop filter"
    ]
image: /img/learn/band-pass-filter-og.png
related: [low-pass-filter, high-pass-filter, notch-filter, fir-vs-iir-filters]
datePublished: 2026-11-19
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a band-pass filter do?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A band-pass filter keeps one range of frequencies and reduces everything below and above it. Frequencies between its lower and upper cutoffs pass with little change; slower changes, such as drift, and faster ones, such as hiss, are made smaller. It is used to pick out one radio channel, one band of a brain or vibration signal, or one tone in a noisy recording." }
                },
                {
                    "@type": "Question",
                    "name": "How do you calculate the centre frequency and bandwidth of a band-pass filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Take the two -3 dB cutoff frequencies, fL and fH. The bandwidth is their difference, fH - fL. The centre frequency is their geometric mean, the square root of fL × fH, not their average. For a band from 8 Hz to 13 Hz, the bandwidth is 5 Hz and the centre frequency is the square root of 104, about 10.2 Hz." }
                },
                {
                    "@type": "Question",
                    "name": "What is Q in a band-pass filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Q, the quality factor, is the centre frequency divided by the bandwidth: Q = f0 / (fH - fL). A high Q means a narrow band relative to its centre, a low Q a wide one. A filter centred on 1 kHz with a 100 Hz bandwidth has Q = 10. The higher the Q, the longer the filter rings after a sudden change in its input." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a band-pass and a band-stop filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A band-pass filter keeps the frequencies between its two cutoffs and removes the rest. A band-stop filter does the opposite: it removes the band between its cutoffs and keeps everything else. A narrow band-stop filter is called a notch filter and is used to remove a single interfering frequency, such as 50 or 60 Hz mains hum." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between an active and a passive band-pass filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A passive band-pass filter uses only resistors, capacitors and inductors. It needs no power but cannot amplify, and whatever it drives changes its response. An active band-pass filter adds an op-amp, so it can have gain, a high Q without an inductor, and an output that does not change with the load. Active filters suit audio and sensor frequencies; passive LC filters dominate at radio frequencies." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a band-pass filter in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Design a second-order band-pass biquad from the centre frequency, Q and sample rate, using the Audio EQ Cookbook formulas, then run each sample through its difference equation. For a steeper filter, chain a Butterworth high-pass and low-pass, or convolve the samples with a windowed-sinc band-pass kernel. In SciChart.js, wrap the raw XyDataSeries in an XyCustomFilter whose filter function runs the filter, and chart both." }
                }
            ]
        })}
    </script>
</head>

# Band-Pass Filter

## What is a band-pass filter?

A **band-pass filter** (BPF, also written bandpass) is a filter that lets through one band of frequencies and reduces those below and above it. The band runs between a lower cutoff, $f_L$, and an upper cutoff, $f_H$. Its width is the **bandwidth**, its middle is the **centre frequency**, and their ratio is the **Q**.

![A noisy signal containing several tones before and after a band-pass filter: the filtered line keeps only the 10 Hz tone. Below, the filter's frequency response peaks at the centre frequency and falls away on both sides](/img/learn/band-pass-filter-og.png)

*A signal with tones at 2, 10, 22 and 50 Hz plus noise, before and after a band-pass filter set to 8–13 Hz (top), and the filter's frequency response (bottom). [Try the interactive version](#how-to-build-a-band-pass-filter-in-javascript-react-or-angular).*

:::tip Key takeaways
- A band-pass filter keeps a band between two cutoffs and removes slower and faster changes. It behaves like a high-pass and a low-pass filter in a row.
- Bandwidth is $f_H - f_L$. The centre frequency is the geometric mean, $f_0 = \sqrt{f_L f_H}$.
- Q $= f_0 / \text{bandwidth}$. A high Q means a narrow band and more ringing.
- A second-order band-pass falls at 20 dB per decade on each side. Higher orders fall faster.
- In code, the usual designs are the biquad, a Butterworth high-pass plus low-pass, and the windowed-sinc FIR.
:::

## How a band-pass filter works

Any signal can be split into sine waves of different frequencies (the idea behind the [Fourier transform](/learn/signal-processing/fourier-transform/)). A band-pass filter scales each of those waves by a different amount. Waves inside the band come through at close to their full size; waves outside it are made smaller, and the further they are from the band, the smaller they get. Plotting that scaling against frequency gives the filter's **frequency response**.

![The frequency response of band-pass filters centred on 1 kHz with Q = 1, on a log frequency axis. The -3 dB points are at 618 Hz and 1,618 Hz, a bandwidth of 1,000 Hz. The second-order curve falls at 20 dB per decade on each side, the fourth-order curve at 40 dB per decade. The lower and upper stopbands lie outside the band](./band-pass-filter-frequency-response.svg)

| Term | What it means |
| --- | --- |
| Lower cutoff ($f_L$) | The bottom edge of the band, where the gain has fallen to −3 dB (about 71% of the amplitude, half the power) |
| Upper cutoff ($f_H$) | The top edge of the band, also at −3 dB |
| Passband | The frequencies between $f_L$ and $f_H$ |
| Stopbands | The frequencies the filter is meant to block: one below the band and one above it |
| Centre frequency ($f_0$) | The middle of the band on a log scale, where a simple band-pass has its peak gain. Also called the resonant frequency |
| Bandwidth (BW) | $f_H - f_L$, in hertz |
| Q (quality factor) | $f_0 / \text{BW}$: how narrow the band is compared with its centre |
| Roll-off | How fast the gain falls outside the band, in dB per decade (each tenfold change in frequency) |

### Centre frequency, bandwidth and Q

The centre of a band-pass filter is the geometric mean of its cutoffs, because a filter's response is symmetrical on a log frequency scale, not a linear one:

$$
f_0 = \sqrt{f_L \, f_H}, \qquad \text{BW} = f_H - f_L, \qquad Q = \frac{f_0}{\text{BW}}
$$

As a worked example, take the EEG alpha band. Brain rhythms between 8 and 13 Hz are called alpha waves. A filter for that band has $\text{BW} = 13 - 8 = 5$ Hz and $f_0 = \sqrt{8 \times 13} = \sqrt{104} \approx 10.2$ Hz, so $Q \approx 10.2 / 5 = 2.04$. The average of 8 and 13 is 10.5 Hz, which is not the centre. The gap grows with the band: for 300 Hz to 3.4 kHz, the centre is about 1 kHz but the average is 1.85 kHz.

Working backwards from a centre and a Q, the cutoffs are:

$$
f_{L,H} = f_0 \left( \sqrt{1 + \frac{1}{4Q^2}} \mp \frac{1}{2Q} \right)
$$

For $f_0 = 1$ kHz and $Q = 1$, that gives 618 Hz and 1,618 Hz, as in the diagram above.

Octave bands are another example. Sound level meters and graphic equalisers split audio into standard octave or third-octave bands. An octave band's edges are $f_0/\sqrt{2}$ and $f_0\sqrt{2}$, so the 1 kHz octave band runs from about 707 Hz to 1,414 Hz, with $Q \approx 1.41$. A third-octave band is narrower: about 891 Hz to 1,122 Hz at 1 kHz, with $Q \approx 4.3$.

### Wideband and narrowband filters

There is no single boundary between the two, but they behave and are built differently:

- **Wideband (low Q).** The cutoffs are far apart, say an octave or more ($Q$ below about 1.4). The filter is usually built as a separate high-pass and low-pass, each with its own cutoff, and its passband is close to flat. A telephone voice channel, roughly 300 Hz to 3.4 kHz, is a wideband band-pass.
- **Narrowband (high Q).** The band is a small fraction of the centre frequency. The filter is built around a resonance: an inductor and capacitor, a crystal, a resonant op-amp circuit or a single digital biquad. Its response is a peak rather than a plateau. Radio receivers and tone detectors use narrowband filters.

## What band-pass filters are used for

Band-pass filters are used wherever one range of frequencies carries the information and everything else is interference.

- Radio and wireless: every receiver uses band-pass filters to select one channel and reject its neighbours. FM radios commonly filter at a 10.7 MHz intermediate frequency with a band roughly 200 kHz wide; mobile phones have band-pass filters for each frequency band they support.
- Audio: a graphic equaliser is a bank of band-pass filters on standard octave or third-octave centres; a three-way loudspeaker crossover feeds the midrange driver through a band-pass; and a synthesiser's band-pass mode gives a thin, nasal tone.
- Speech: telephone networks pass roughly 300 Hz to 3.4 kHz, enough for speech to be understood.
- Brain and body signals: EEG analysis splits brain activity into conventional bands, roughly delta (below 4 Hz), theta (4–8 Hz), alpha (8–13 Hz), beta (13–30 Hz) and gamma (above 30 Hz). ECG and EMG monitors band-pass their signals to remove both baseline drift and high-frequency noise.
- Vibration and machine monitoring: a damaged rolling bearing gives repeated small impacts that excite a high-frequency resonance of the machine. [Envelope analysis](/learn/signal-processing/hilbert-transform/) band-passes the vibration around that resonance, then looks for the impact rate in the envelope's spectrum.
- Measuring one tone: before measuring the amplitude or phase of a test tone in a noisy signal, a narrow band-pass around it removes most of the noise.

## Band-pass filter transfer function

A filter's **transfer function**, $H(s)$, is the ratio of output to input, written with the Laplace variable $s$ (at a frequency $f$, $s = j 2\pi f$). The standard **second-order band-pass** has a peak gain of 1 at $\omega_0 = 2\pi f_0$:

$$
H(s) = \frac{(\omega_0/Q)\, s}{s^2 + (\omega_0/Q)\, s + \omega_0^2}
$$

Its magnitude at a frequency $\omega$ is:

$$
|H(j\omega)| = \frac{1}{\sqrt{1 + Q^2 \left( \dfrac{\omega}{\omega_0} - \dfrac{\omega_0}{\omega} \right)^2}}
$$

- At $\omega = \omega_0$ the bracket is zero, so the gain is 1 (0 dB) and the phase shift is zero.
- The gain is −3 dB where $Q(\omega/\omega_0 - \omega_0/\omega) = \pm 1$. Those two frequencies are $f_L$ and $f_H$, and they satisfy $f_L f_H = f_0^2$ and $f_H - f_L = f_0/Q$.
- Far below $f_0$ the gain rises at +20 dB per decade, and far above it falls at −20 dB per decade. A second-order band-pass has one order on each side.
- The phase goes from +90° well below the band, through 0° at $f_0$, to −90° well above it, and the change is sharper when Q is higher.

Plotted on log axes, gain and phase against frequency make a [Bode plot](/learn/signal-processing/bode-plot/): the usual way to show a band-pass filter's response. On a Bode plot, a second-order band-pass looks like a tent, with straight sides at ±20 dB per decade meeting near the peak.

A band-pass of order $2n$ has $n$ orders on each side, so it falls at $20n$ dB per decade on each side, and its top is flatter. A **Butterworth band-pass** is designed from a Butterworth low-pass by replacing $s$ with $(s^2 + \omega_0^2)/(s \cdot \text{BW})$: it keeps the flattest possible passband, and doubles the order.

## Band-pass filter circuits

An analogue band-pass filter can be passive (resistors, capacitors and inductors only) or active (built around an op-amp).

### Passive RC band-pass filter

The simplest band-pass circuit is a [high-pass RC filter](/learn/signal-processing/high-pass-filter/) followed by a [low-pass RC filter](/learn/signal-processing/low-pass-filter/). The high-pass stage sets the lower cutoff and the low-pass stage the upper:

$$
f_L = \frac{1}{2\pi R_1 C_1}, \qquad f_H = \frac{1}{2\pi R_2 C_2}
$$

This works well when $f_L$ is much lower than $f_H$. With $f_H = 10 f_L$ and a buffer between the stages, the peak is only 0.8 dB down and the −3 dB points land within about 1% of the two cutoffs. The roll-off is 20 dB per decade on each side.

As the cutoffs move closer, the stages overlap and load each other:

- **The stages overlap.** Each stage is already 3 dB down at its own cutoff. With $f_L = f_H$ and a buffer, the peak is −6 dB (half the amplitude), and the "band" has $Q = 0.5$: a cascade of first-order stages can never be narrower than that.
- **Loading.** Without a buffer, the second stage draws current from the first and changes its response. Two identical RC stages connected directly give a peak of only 1/3 of the input (−9.5 dB) and $Q = 1/3$. Make the second stage's impedance about ten times the first's, or put an op-amp follower between them.

### RLC band-pass filter circuit

For a narrow band, use a **resonant circuit**. In a series RLC band-pass, an inductor and a capacitor in series feed a resistor, and the output is taken across the resistor. At low frequencies the capacitor blocks the current; at high frequencies the inductor does. At one frequency, their reactances are equal and opposite and cancel, so all of the input appears across $R$.

![A series RLC band-pass filter: an inductor L and a capacitor C in series from the input to the output, with a resistor R from the output to 0 V. The formulas for the centre frequency, bandwidth and Q, and a worked example: 10 millihenries, 100 nanofarads and 100 ohms give a centre frequency of about 5.03 kHz, a bandwidth of about 1.59 kHz and a Q of about 3.16](./rlc-band-pass-filter-circuit.svg)

The circuit's transfer function is exactly the second-order band-pass above, with:

$$
f_0 = \frac{1}{2\pi\sqrt{LC}}, \qquad \text{BW} = \frac{R}{2\pi L}, \qquad Q = \frac{1}{R}\sqrt{\frac{L}{C}}
$$

For example, with $L = 10$ mH, $C = 100$ nF and $R = 100\ \Omega$:

- $f_0 = 1 / \big(2\pi\sqrt{0.01 \times 10^{-7}}\big) = 1/(2\pi \times 3.162 \times 10^{-5}) \approx 5{,}033$ Hz;
- $\text{BW} = 100 / (2\pi \times 0.01) \approx 1{,}592$ Hz;
- $Q = \sqrt{0.01 / 10^{-7}} / 100 = 316.2 / 100 \approx 3.16$;
- the −3 dB edges are at about 4,300 Hz and 5,891 Hz, and $4{,}300 \times 5{,}891 \approx 5{,}033^2$.

Lower $R$ narrows the band without moving the centre. In a real circuit, the inductor's own winding resistance and the source and load resistances add to $R$, so the Q you measure is lower than the one you calculated.

### Active band-pass filters

An **active band-pass filter** adds an op-amp to a resistor-capacitor network. It needs a power supply, but it can amplify, it reaches a high Q without a bulky inductor, and its low output impedance means the next stage doesn't change its response.

- **Multiple-feedback (MFB) band-pass.** One op-amp, two capacitors and two or three resistors. It is inverting, and is the usual single-stage choice for moderate Q at audio and sensor frequencies; the resistor ratios set Q and the gain at $f_0$, and the third resistor lets you set the gain separately.
- **Sallen–Key and state-variable filters** are the other common topologies. A state-variable filter gives band-pass, low-pass and high-pass outputs at once and lets $f_0$ and Q be tuned separately.
- **Wideband active filters** are often just an active high-pass followed by an active low-pass, such as two Sallen–Key Butterworth stages.

At radio frequencies, op-amps run out of speed, so RF band-pass filters are passive: LC networks, cavity resonators, and crystal, ceramic or surface-acoustic-wave (SAW) filters.

## Digital band-pass filters

In software, a filter works on samples taken at a **sample rate**, $f_s$, and both cutoffs must be below half of it (the [Nyquist frequency](/learn/signal-processing/nyquist-and-aliasing/)). The [live demo below](#how-to-build-a-band-pass-filter-in-javascript-react-or-angular) runs all three of these designs.

### Band-pass biquad (second-order IIR)

A **biquad** is a second-order recursive section with five coefficients:

$$
y[n] = b_0 x[n] + b_1 x[n-1] + b_2 x[n-2] - a_1 y[n-1] - a_2 y[n-2]
$$

The *Audio EQ Cookbook* gives the band-pass version of the transfer function above, converted to digital with the bilinear transform. With $\omega_0 = 2\pi f_0/f_s$ and $\alpha = \sin(\omega_0)/(2Q)$:

$$
b_0 = \frac{\alpha}{1+\alpha}, \quad b_1 = 0, \quad b_2 = \frac{-\alpha}{1+\alpha}, \quad a_1 = \frac{-2\cos\omega_0}{1+\alpha}, \quad a_2 = \frac{1-\alpha}{1+\alpha}
$$

Four multiplications per sample (because $b_1 = 0$) and four stored values. It is the usual choice for a tone detector, a resonant synthesiser filter or a live data feed. Like the analogue circuit, it only falls at 20 dB per decade on each side, and when $f_0$ approaches $f_s/2$ the band is squeezed slightly by the bilinear transform's frequency warping.

### Butterworth high-pass followed by Butterworth low-pass (IIR)

For a wide band with steep sides, chain a Butterworth high-pass at $f_L$ and a Butterworth low-pass at $f_H$, each built from biquads. One biquad on each side gives 40 dB per decade per side; two give 80. This is the digital version of the RC cascade, with the same weakness: when the cutoffs are close, the two filters overlap and the peak drops below 0 dB.

### Windowed-sinc band-pass filter (FIR)

An FIR filter is a list of weights, its **kernel**, slid along the signal by [convolution](/learn/signal-processing/convolution/). For a band-pass kernel, design two windowed-sinc low-pass kernels of the same length, one at $f_H$ and one at $f_L$, and subtract the second from the first: what passes the wider low-pass but not the narrower one is the band. With a symmetric kernel, every frequency is delayed by the same time (**linear phase**), so waveform shapes survive, and the stopband can be extremely deep. The price is length: the transition at each edge is roughly $4/M$ of the sample rate wide for a Blackman window of $M + 1$ taps, so a narrow band at a low frequency needs a long kernel. A windowed-sinc's edge frequency is where the gain is −6 dB, not −3 dB.

### How the three designs compare

For the demo's alpha-band setting (8 to 13 Hz at 250 samples per second), the three designs compare like this:

| Filter, 8–13 Hz | Peak gain | Gain at 2 Hz (delta) | Gain at 22 Hz (beta) | Gain at 50 Hz (hum) |
| --- | --- | --- | --- | --- |
| 2nd-order biquad | 0 dB | −20 dB | −11 dB | −21 dB |
| Butterworth HP + LP, 8th order | −1.1 dB | −48 dB | −19 dB | −52 dB |
| Windowed-sinc, 257 taps | 0 dB | −92 dB | −93 dB | −126 dB |

The biquad lets about a tenth of the 2 Hz and 50 Hz tones through, and over a quarter of the nearby 22 Hz tone. The FIR filter removes all three, but at 250 samples per second, its 257 taps span just over a second of signal.

## Band-pass vs low-pass vs high-pass vs band-stop filters

A band-pass filter keeps one range of frequencies; the other three basic filters keep everything below a cutoff, everything above it, or everything except one band.

| Filter | Passes | How it relates to a band-pass | Typical job |
| --- | --- | --- | --- |
| Band-pass | Only the band from $f_L$ to $f_H$ | | Picking out one channel or rhythm: an FM station, the EEG alpha band |
| [Low-pass](/learn/signal-processing/low-pass-filter/) | Everything below its cutoff | Sets a band-pass's upper edge, $f_H$ | Anti-aliasing and smoothing sensor noise |
| [High-pass](/learn/signal-processing/high-pass-filter/) | Everything above its cutoff | Sets a band-pass's lower edge, $f_L$ | Removing DC offset, drift or ECG baseline wander |
| [Band-stop (notch)](/learn/signal-processing/notch-filter/) | Everything except one band | The input minus a band-pass output | Cutting 50 or 60 Hz mains hum |

Put a high-pass at $f_L$ in front of a low-pass at $f_H$ and you have a band-pass; subtract that band-pass from the input, or run a low-pass and a high-pass side by side and add them, and you have a band-stop. To check what any of them does to a real signal, compare its spectrum before and after with an [FFT](/learn/signal-processing/fast-fourier-transform/) or a [power spectral density](/learn/signal-processing/power-spectral-density/) plot.

## Common band-pass filter mistakes

Most band-pass problems come from asking a simple design for a band that is too narrow, or from ignoring what the filter does to timing.

- **Expecting a narrow band from two first-order stages.** A first-order high-pass and low-pass in a row can't have a Q above 0.5, even with a buffer; with the cutoffs close together, the peak sinks below −3 dB and the band never reaches it. For a narrow band, use a resonant design: an RLC circuit, an active band-pass, or a biquad. Try it in the demo: choose **High-pass + low-pass Butterworth** with order 2, then the **Narrow** preset.
- **Ignoring ringing at high Q.** A narrow filter stores energy, so after a sudden change it keeps oscillating at $f_0$. For a second-order band-pass, the ringing decays with a time constant of $Q/(\pi f_0)$: for $Q = 10$ at 10 Hz, that's about 0.32 s, so it takes around a second to settle. Short bursts get smeared out, and the start of the data shows a slow build-up. The demo's **Narrow** preset shows both.
- **Forgetting the delay and phase shift.** IIR band-pass filters shift the phase by ±45° at the −3 dB edges of a second-order band, and further for higher orders, so peaks in the output line up differently from peaks in the input. If timing matters, use a symmetric FIR filter, or run the IIR filter forwards and then backwards over recorded data (zero-phase filtering).
- **Setting the cutoffs at the edges of the wanted signal.** At $f_L$ and $f_H$, the gain is already −3 dB. If the whole band matters, leave some room, or use a higher order with a flatter top.
- **Placing a digital band too close to the Nyquist frequency.** Above about a quarter of the sample rate, the bilinear transform squeezes the band, and an FIR filter's upper transition runs into $f_s/2$. Raise the sample rate, or design with pre-warped frequencies.
- **Loading a passive filter.** A low-impedance load across an RC or RLC band-pass lowers its gain and Q. Buffer the output, or include the load in the design.

## How to build a band-pass filter in JavaScript, React or Angular

On every control change, this demo redesigns the filter, runs it over 6 seconds of signal sampled at 250 Hz, and redraws the output and the frequency response. The test signal has tones at 2, 10, 22 and 50 Hz plus noise; the orange line is the filter's output, and the dashed white line shows the clean tones inside the band. Choose a filter and order, move the **centre frequency** and **Q** sliders, or pick a preset band. The readout shows the design's $f_L$, $f_H$, $f_0$, bandwidth and Q, and the peak gain and −3 dB band of the filter as built. The time chart opens on the first 2 seconds: hover to read values, scroll to zoom, drag to pan, and double-click to see all 6 seconds.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="band-pass filter" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />

Here is the code for this chart. The filter design is plain JavaScript, and SciChart.js runs the filter on the chart's data with an `XyCustomFilter`. The React and Angular versions show the same pattern with a band-pass biquad:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        XyCustomFilter,
        FastLineRenderableSeries,
        LegendModifier,
        CursorModifier,
        SciChartJsNavyTheme
    } from "scichart";

    // A second-order band-pass biquad (Audio EQ Cookbook), as an XyCustomFilter filter function.
    // SciChart.js calls it for each point in index order: from 0 when it recalculates everything,
    // and only for the new points when data is appended, so it can keep its state between calls.
    const bandPassBiquad = (f0: number, q: number, sampleRate: number) => {
        const w0 = (2 * Math.PI * f0) / sampleRate;
        const alpha = Math.sin(w0) / (2 * q);
        const a0 = 1 + alpha;
        const [b0, b2, a1, a2] = [alpha / a0, -alpha / a0, (-2 * Math.cos(w0)) / a0, (1 - alpha) / a0];
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        return (index: number, x: number) => {
            if (index === 0) x1 = x2 = y1 = y2 = 0;
            const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
            [x2, x1, y2, y1] = [x1, x, y1, y];
            return y;
        };
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Amplitude" }));

        const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
        const raw = new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Raw" });
        // Keep 8 to 13 Hz: centre sqrt(8 * 13) = 10.2 Hz, Q = 10.2 / 5 = 2.04
        const bandPassed = new XyCustomFilter(raw, {
            filterFunction: bandPassBiquad(10.2, 2.04, sampleRate),
            dataSeriesName: "Band-pass 8–13 Hz"
        });

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: raw, stroke: "#50C7E077" }),
            new FastLineRenderableSeries(wasmContext, { dataSeries: bandPassed, stroke: "#F48420", strokeThickness: 2.5 })
        );
        sciChartSurface.chartModifiers.add(new LegendModifier(), new CursorModifier({ showTooltip: true }));
        return { sciChartSurface };
    };

    export const BandPassFilterChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        XyCustomFilter,
        FastLineRenderableSeries,
        LegendModifier,
        CursorModifier,
        SciChartJsNavyTheme
    } from "scichart";

    // A second-order band-pass biquad (Audio EQ Cookbook), as an XyCustomFilter filter function.
    // SciChart.js calls it for each point in index order: from 0 when it recalculates everything,
    // and only for the new points when data is appended, so it can keep its state between calls.
    const bandPassBiquad = (f0: number, q: number, sampleRate: number) => {
        const w0 = (2 * Math.PI * f0) / sampleRate;
        const alpha = Math.sin(w0) / (2 * q);
        const a0 = 1 + alpha;
        const [b0, b2, a1, a2] = [alpha / a0, -alpha / a0, (-2 * Math.cos(w0)) / a0, (1 - alpha) / a0];
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        return (index: number, x: number) => {
            if (index === 0) x1 = x2 = y1 = y2 = 0;
            const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
            [x2, x1, y2, y1] = [x1, x, y1, y];
            return y;
        };
    };

    @Component({
        selector: "app-band-pass-filter-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class BandPassFilterChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Amplitude" }));

            const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
            const raw = new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Raw" });
            // Keep 8 to 13 Hz: centre sqrt(8 * 13) = 10.2 Hz, Q = 10.2 / 5 = 2.04
            const bandPassed = new XyCustomFilter(raw, {
                filterFunction: bandPassBiquad(10.2, 2.04, sampleRate),
                dataSeriesName: "Band-pass 8–13 Hz"
            });

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries: raw, stroke: "#50C7E077" }),
                new FastLineRenderableSeries(wasmContext, { dataSeries: bandPassed, stroke: "#F48420", strokeThickness: 2.5 })
            );
            sciChartSurface.chartModifiers.add(new LegendModifier(), new CursorModifier({ showTooltip: true }));
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Every filter in the demo is a chain of sections, each a difference equation with feed-forward weights $b$ and feedback weights $a$. The biquad is one section, the Butterworth cascade is several, and the windowed-sinc filter is one long FIR section with no feedback.
- **Your own filter on chart data:** an [XyCustomFilter](/2d-charts/chart-types/data-filters-api/custom-filter/) wraps a source `XyDataSeries` and calls your `filterFunction(index, y)` for each point, in index order: from index 0 when it recalculates everything, and only for new points when data is appended. So an IIR filter can keep its memory between calls, resetting it at index 0. Setting `filterFunction` again reruns the whole series; the demo does that whenever a control moves.
- The demo's FIR filter is centred on each sample, reading neighbours from the source series, so its output isn't delayed. It suits recorded data; on live data, the newest outputs would need samples that haven't arrived yet.
- The frequency response is calculated in plain JavaScript from the coefficients and drawn against a `LogarithmicAxis`, the layout of a [Bode plot](/learn/signal-processing/bode-plot/). `VerticalLineAnnotation`s mark $f_L$, $f_0$, $f_H$ and the test tones; a `HorizontalLineAnnotation` marks −3 dB.

**See it in the demo app:** [JavaScript trendline and moving average filters](https://www.scichart.com/demo/javascript/trend-ma-ratio) · [React trendline and moving average filters](https://www.scichart.com/demo/react/trend-ma-ratio) · [Angular trendline and moving average filters](https://www.scichart.com/demo/angular/trend-ma-ratio), which applies SciChart.js's built-in data filters to a data series as it updates. For a live signal and its spectrum, see the [JavaScript audio analyzer](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio analyzer](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio analyzer](https://www.scichart.com/demo/angular/audio-analyzer-fft-example).

**Go deeper:** [SciChart.js custom filter documentation](/2d-charts/chart-types/data-filters-api/custom-filter/), the [data filters API overview](/2d-charts/chart-types/data-filters-api/data-filters-api-overview/), the [logarithmic axis](/2d-charts/axis-api/axis-types/logarithmic-axis/) used for the frequency response, and the related guides in this section: [low-pass filter](/learn/signal-processing/low-pass-filter/), [high-pass filter](/learn/signal-processing/high-pass-filter/) and [Bode plot](/learn/signal-processing/bode-plot/).

## Frequently asked questions

### What does a band-pass filter do?

A band-pass filter keeps one range of frequencies and reduces everything below and above it. Frequencies between its lower and upper cutoffs pass with little change; slower changes, such as drift, and faster ones, such as hiss, are made smaller. It is used to pick out one radio channel, one band of a brain or vibration signal, or one tone in a noisy recording.

### How do you calculate the centre frequency and bandwidth of a band-pass filter?

Take the two -3 dB cutoff frequencies, fL and fH. The bandwidth is their difference, fH - fL. The centre frequency is their geometric mean, the square root of fL × fH, not their average. For a band from 8 Hz to 13 Hz, the bandwidth is 5 Hz and the centre frequency is the square root of 104, about 10.2 Hz.

### What is Q in a band-pass filter?

Q, the quality factor, is the centre frequency divided by the bandwidth: Q = f0 / (fH - fL). A high Q means a narrow band relative to its centre, a low Q a wide one. A filter centred on 1 kHz with a 100 Hz bandwidth has Q = 10. The higher the Q, the longer the filter rings after a sudden change in its input.

### What is the difference between a band-pass and a band-stop filter?

A band-pass filter keeps the frequencies between its two cutoffs and removes the rest. A band-stop filter does the opposite: it removes the band between its cutoffs and keeps everything else. A narrow band-stop filter is called a [notch filter](/learn/signal-processing/notch-filter/) and is used to remove a single interfering frequency, such as 50 or 60 Hz mains hum.

### What is the difference between an active and a passive band-pass filter?

A passive band-pass filter uses only resistors, capacitors and inductors. It needs no power but cannot amplify, and whatever it drives changes its response. An active band-pass filter adds an op-amp, so it can have gain, a high Q without an inductor, and an output that does not change with the load. Active filters suit audio and sensor frequencies; passive LC filters dominate at radio frequencies.

### How do I make a band-pass filter in JavaScript?

Design a second-order band-pass biquad from the centre frequency, Q and sample rate, using the Audio EQ Cookbook formulas, then run each sample through its difference equation. For a steeper filter, chain a Butterworth high-pass and low-pass, or convolve the samples with a windowed-sinc band-pass kernel. In SciChart.js, wrap the raw XyDataSeries in an XyCustomFilter whose filter function runs the filter, and chart both.

## Sources

- Smith, S. W. (1997), [*The Scientist and Engineer's Guide to Digital Signal Processing*](https://www.dspguide.com/pdfbook.htm), California Technical Publishing. [Chapter 14](https://www.dspguide.com/ch14.htm) (band-pass and band-reject filters from low-pass and high-pass), [chapter 16](https://www.dspguide.com/ch16.htm) (windowed-sinc filters) and [chapter 19](https://www.dspguide.com/ch19.htm) (recursive filters, including narrow band-pass filters).
- Bristow-Johnson, R., [*Audio EQ Cookbook*](https://www.w3.org/TR/audio-eq-cookbook/), W3C Working Group Note. The band-pass biquad coefficients and the bilinear transform with pre-warping.
- Oppenheim, A. V. and Schafer, R. W. (2010), *Discrete-Time Signal Processing*, 3rd edition, Pearson. IIR design by the bilinear transform, frequency transformations from low-pass to band-pass, and FIR design by windowing.
- Oppenheim, A. V. (2011), [*Signals and Systems*, RES.6-007](https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/), MIT OpenCourseWare. Second-order systems, resonance and Q, and Bode plots.
- Kane, N. et al. (2017), [A revised glossary of terms most commonly used by clinical electroencephalographers](https://doi.org/10.1016/j.cnp.2017.07.002), *Clinical Neurophysiology Practice*, 2, pp. 170–185. The EEG frequency bands.
- Randall, R. B. and Antoni, J. (2011), [Rolling element bearing diagnostics: a tutorial](https://doi.org/10.1016/j.ymssp.2010.07.017), *Mechanical Systems and Signal Processing*, 25(2), pp. 485–520. Band-pass filtering and envelope analysis for bearing faults.

<LearnCta position="bottom" chart="band-pass filter" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />
