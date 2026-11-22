---
sidebar_position: 60
sidebar_label: Envelope Detector Circuit
title: "Envelope Detector Circuit: How It Works and How to Choose R and C"
description: "How a diode envelope detector circuit demodulates AM, how to choose R and C between carrier ripple and diagonal clipping, a worked example, precision detectors, and a live simulator."
keywords:
    [
        "envelope detector",
        "envelope detector circuit",
        "envelope detector circuit diagram",
        "diode envelope detector",
        "what is an envelope detector",
        "rf envelope detector",
        "simulation envelope detector",
        "envelope detector rc time constant",
        "diagonal clipping",
        "am diode detector",
        "precision envelope detector",
        "envelope detector vs synchronous detector"
    ]
image: /img/learn/envelope-detector-circuit-og.png
related: [hilbert-transform, low-pass-filter, band-pass-filter, audio-spectrum-analyzer]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is an envelope detector?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An envelope detector is a circuit that follows the slowly changing peak amplitude of a fast oscillating signal and outputs that outline, the envelope, without the oscillation. The simplest one is a diode followed by a capacitor and a resistor in parallel. It demodulates AM radio and measures the level of RF, audio and ultrasound signals." }
                },
                {
                    "@type": "Question",
                    "name": "How does a diode envelope detector work?",
                    "acceptedAnswer": { "@type": "Answer", "text": "On each positive peak of the carrier, the diode conducts and charges the capacitor to the peak voltage. Between peaks the diode is off and the capacitor discharges slowly through the resistor. If the RC time constant is long compared with a carrier cycle but short compared with the message, the capacitor voltage follows the peaks, which is the envelope." }
                },
                {
                    "@type": "Question",
                    "name": "How do you choose R and C for an envelope detector?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Choose the time constant RC between two limits: much longer than one carrier period, 1/fc, so the carrier ripple is small, and short enough that the capacitor can discharge as fast as the envelope falls. For a sine message of frequency W and modulation depth m, that upper limit is RC <= sqrt(1 - m^2) / (2 pi W m). For a 1 MHz carrier, 5 kHz audio and 80% modulation, the limit is about 24 microseconds, and 10 kilohms with 2.2 nanofarads (22 microseconds) works." }
                },
                {
                    "@type": "Question",
                    "name": "What is diagonal clipping in an envelope detector?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Diagonal clipping happens when the detector's RC time constant is too long: the capacitor cannot discharge as fast as the envelope falls, so the output cuts across the troughs of the envelope in a straight-looking exponential slope instead of following them. It gets worse with deeper modulation and higher message frequencies, and is cured by a smaller RC." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between an envelope detector and a synchronous detector?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An envelope detector only follows the peaks of the signal, so it needs no reference and costs a diode, a resistor and a capacitor. A synchronous (product) detector multiplies the signal by a locally generated copy of the carrier and low-pass filters the result. It needs that carrier to be recovered in frequency and phase, but it also demodulates overmodulated AM, DSB-SC and SSB, and works better in noise." }
                },
                {
                    "@type": "Question",
                    "name": "How do I simulate an envelope detector in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Step through the input samples with a time step dt. At each step, let the capacitor voltage decay by a factor exp(-dt / RC); if the input minus the diode drop is higher than that, the diode conducts and the capacitor voltage becomes the input minus the drop. The resulting array is the detector output. With SciChart.js, draw the input, the output and the true envelope as FastLineRenderableSeries." }
                }
            ]
        })}
    </script>
</head>

# Envelope Detector Circuit

## What is an envelope detector?

An **envelope detector** is a circuit that follows the slowly changing peak amplitude of a fast oscillation and outputs that outline, the **envelope**, without the oscillation itself. The simplest one is a diode followed by a capacitor and a resistor in parallel. It recovers audio from AM radio and measures RF, audio and ultrasound levels.

![A diode envelope detector simulation in a dark navy theme: an amplitude-modulated carrier in blue with the detector output in orange tracing its upper edge and the true envelope dashed, and below it a chart of the output minus the true envelope showing a small sawtooth ripple](/img/learn/envelope-detector-circuit-og.png)

*A 1 MHz carrier modulated 80% by a 5 kHz tone (blue), the true envelope (dashed) and the output of a diode detector with R = 10 kΩ and C = 2.2 nF (orange); below, the output minus the envelope in millivolts (simulated). [Try the interactive version](#how-to-simulate-an-envelope-detector-in-javascript-react-or-angular) and change R, C, the diode and the signal.*

:::tip Key takeaways
- A diode envelope detector rectifies the carrier, holds each peak on a capacitor and lets it leak away through a resistor.
- The time constant must sit between two limits: $1/f_c \ll RC \ll 1/W$, with $f_c$ the carrier frequency and $W$ the highest message frequency.
- Too short an RC leaves carrier ripple; too long an RC gives diagonal clipping, which starts above $RC = \sqrt{1-m^2}/(2\pi W m)$.
- A diode's forward drop loses weak signals and makes clipping worse; a precision (op-amp) detector removes it.
- An envelope detector can't demodulate overmodulated AM, DSB-SC or SSB; those need a synchronous detector.
:::

## How a diode envelope detector works

The classic circuit has three parts: a diode, a capacitor and a resistor. The input is an amplitude-modulated (AM) signal, a fast **carrier** whose size follows a slower **message** such as audio.

![A diode envelope detector circuit: an AM input source feeds a diode D; after the diode a capacitor C and a resistor R in parallel go to ground, and the voltage across them is the envelope output. A note gives the rule 1/fc much less than RC much less than 1/W, where fc is the carrier frequency and W the message bandwidth. Below, three simulated outputs for one AM input: RC too short drops back every carrier cycle and leaves a large sawtooth ripple; RC about right follows the envelope with a small ripple; RC too long can't fall fast enough and cuts across the troughs of the envelope](./diode-envelope-detector-circuit.svg)

1. The diode rectifies. On each positive peak of the carrier, the input rises above the capacitor voltage, the diode conducts, and the capacitor charges up to the peak (less the diode's forward drop).
2. The capacitor holds the peak. Once the carrier falls past its peak, the diode is reverse-biased and switches off. The capacitor holds its charge.
3. The resistor discharges it. Between peaks, the capacitor discharges through the resistor, falling by the factor $e^{-t/RC}$. On the next peak the diode tops it up again.

The output is a sawtooth that rides along the tops of the carrier peaks. If the discharge between two carrier peaks is small, and the capacitor can still fall as fast as the message does, the sawtooth is a close copy of the envelope. Without the resistor, the circuit is a **peak detector**: it holds the highest peak it has ever seen and never comes down.

In software, the same circuit is a few lines. At each time step, the held voltage decays by $e^{-\Delta t/RC}$, and if the input minus the diode drop is higher, the output jumps to that value. This model is what the [simulator below](#how-to-simulate-an-envelope-detector-in-javascript-react-or-angular) runs.

## Choosing R and C: carrier ripple vs diagonal clipping

Only the product $RC$, the **time constant**, sets how fast the capacitor discharges. It has to satisfy two opposing limits:

$$
\frac{1}{f_c} \ll RC \ll \frac{1}{W}
$$

where $f_c$ is the carrier frequency and $W$ the highest frequency in the message (the envelope's bandwidth).

### The lower limit: carrier ripple

Between two carrier peaks, a time $1/f_c$ apart, the output droops by the fraction

$$
1 - e^{-1/(f_c RC)} \approx \frac{1}{f_c RC}
$$

An $RC$ of 10 carrier periods leaves about 10% ripple, 20 periods about 5%, 100 periods about 1%. The ripple is a sawtooth at the carrier frequency, far above the audio band, so a small low-pass filter after the detector removes most of what is left.

### The upper limit: diagonal clipping

When the envelope falls, the capacitor can only follow it by discharging through $R$. If $RC$ is too long, the envelope drops faster than the capacitor, the diode stays off for many carrier cycles, and the output slides down an exponential curve that cuts across the troughs. This is **diagonal clipping**.

For a sine message, the envelope is $A(1 + m\cos 2\pi W t)$, with modulation depth $m$ between 0 and 1. Its steepest fall, compared with the voltage the capacitor holds at that moment, sets the limit:

$$
RC \le \frac{\sqrt{1 - m^2}}{2\pi W m}
$$

Deeper modulation and higher message frequencies both tighten it. At $m = 0.5$ the limit is about $0.28/W$; at $m = 0.8$ it is $0.12/W$; at 100% modulation it is zero, so some clipping of the deepest troughs is unavoidable. The simulator on this page agrees with the formula. With a 1 MHz carrier, a 5 kHz message and 80% modulation, it measures no clipping at 22 µs, 0.2 mV at 24 µs and 10 mV at 26 µs, against a predicted limit of 23.9 µs.

## Worked example: an AM radio detector

A 1 MHz carrier carries audio up to $W = 5$ kHz, at up to 80% modulation.

| Step | Calculation | Result |
| --- | --- | --- |
| Carrier period | $1/f_c = 1/(1\ \text{MHz})$ | 1 µs |
| Message period | $1/W = 1/(5\ \text{kHz})$ | 200 µs |
| Diagonal-clipping limit at $m = 0.8$ | $\sqrt{1 - 0.64}\,/\,(2\pi \times 5000 \times 0.8)$ | 23.9 µs |
| Choose standard parts | $R = 10$ kΩ, $C = 2.2$ nF | $RC = 22$ µs |
| Ripple between carrier peaks | $1 - e^{-1/22}$ | 4.4% of the level |

At 22 µs the time constant is 22 carrier periods long and just inside the clipping limit. With a 1 V carrier, the simulator measures a ripple of 76 mV peak to peak at the top of the envelope (1.8 V) and no clipping. Raise $C$ to 3.3 nF ($RC = 33$ µs) and the output misses the troughs by about 67 mV.

A real diode changes the answer. With a 0.3 V Schottky diode and a 5 V carrier, the output is the envelope minus 0.3 V, so the modulation the capacitor has to follow is deeper: $m$ becomes $0.8 \times 5 / (5 - 0.3) = 0.85$, and the limit falls to 19.6 µs. The 22 µs design now clips slightly; $C = 1.8$ nF (18 µs) fixes it at the cost of a little more ripple.

In a superheterodyne radio the detector usually works at the **intermediate frequency** (IF), 455 kHz for AM broadcast receivers, rather than at the station's own frequency. The carrier period is then 2.2 µs, so the same 22 µs leaves about 9% ripple, and the post-detector filter matters more.

## Ripple and distortion in a diode detector

Besides ripple and diagonal clipping, a diode detector has four other faults to design around:

- Diode drop: a silicon diode needs about 0.6 to 0.7 V before it conducts, a Schottky or germanium diode about 0.2 to 0.3 V. The output is the envelope minus that drop, troughs smaller than the drop vanish, and weak signals are lost entirely. Keep the carrier at the detector several volts high, use a low-drop diode, or use a precision detector.
- Square-law behaviour at low level: for inputs of a few tens of millivolts, well below the drop, a diode doesn't switch on and off; it bends. The output is then proportional to the input's power (the square of its amplitude), not its amplitude. RF power detectors use this on purpose; an AM detector driven this weakly distorts the audio.
- Negative-peak clipping: in a radio, the audio usually leaves the detector through a coupling capacitor into the next stage's input resistance $R_L$. At audio frequencies the detector then sees $R$ in parallel with $R_L$, a lower load than $R$ alone, and troughs deeper than $m = (R \parallel R_L)/R$ are flattened. With $R = 10$ kΩ and $R_L = 47$ kΩ, that is $m = 0.82$. Make $R_L$ much larger than $R$.
- Loading the source: a diode detector draws current only in short pulses at the carrier peaks. Balancing the power it takes from the source, $V^2/(2R_\text{in})$ for a peak voltage $V$, against the power dissipated in $R$, $V^2/R$, gives an input resistance of about $R/2$. A 10 kΩ detector loads the IF stage with about 5 kΩ.

The capacitor voltage also has a DC component proportional to the carrier's average strength. Radios separate it with a low-pass filter and use it for **automatic gain control** (AGC), turning the IF gain down for strong stations.

## Precision and full-wave envelope detectors

A **precision envelope detector** puts the diode inside an op-amp's feedback loop. The op-amp compares the output with the input and drives the diode until they match, so the diode drop at the output is divided by the op-amp's open-loop gain at the carrier frequency. It follows signals of a few millivolts that a plain diode would ignore, at the cost of an op-amp fast enough for the carrier.

![A precision envelope detector: the AM input goes to the non-inverting input of an op-amp, the op-amp output drives a diode D into a capacitor C and resistor R in parallel, and the output node feeds back to the inverting input. Below, two simulated outputs for a weak AM input with a 1 V carrier and 50% modulation: a plain silicon diode with a 0.6 V drop sits well below the envelope and loses the troughs, while the precision detector follows the envelope](./precision-envelope-detector.svg)

A **full-wave envelope detector** charges the capacitor on both the positive and negative half-cycles, using a diode bridge, a centre-tapped transformer or a precision full-wave rectifier (two op-amps). The capacitor is topped up twice per carrier cycle, so for the same $RC$ the ripple roughly halves and moves to $2f_c$, further from the message. Equivalently, you can halve $RC$ for the same ripple and gain more room below the diagonal-clipping limit.

Many audio and measurement circuits replace the RC discharge with separate charge and discharge time constants, set by two resistors, so the detector can rise quickly and fall slowly. Audio engineers call these the attack and release times.

## Envelope detector vs synchronous detector vs Hilbert transform

A diode detector is the simplest way to recover an envelope; a synchronous detector or a Hilbert transform copes with signals a diode can't.

| Method | How it works | Needs | Handles | Best for |
| --- | --- | --- | --- | --- |
| Diode envelope detector | Rectify, hold on C, discharge through R | A diode, a resistor and a capacitor | AM with $m < 1$ and a strong carrier | AM radio, RF level detection, simple hardware |
| Precision envelope detector | The same, with the diode in an op-amp loop | An op-amp fast enough for the carrier | Weak signals down to millivolts | Instrumentation, audio level detection |
| Synchronous (product) detector | Multiply by a local copy of the carrier, then low-pass | A carrier recovered in frequency and phase, for example with a phase-locked loop | Overmodulated AM, DSB-SC, SSB, weak signals in noise | Communications receivers, lock-in amplifiers |
| [Hilbert transform](/learn/signal-processing/hilbert-transform/) magnitude | $\sqrt{x^2 + \mathcal{H}\{x\}^2}$ on sampled data | Digitised samples and an FFT or FIR filter | Any narrowband signal, with no carrier ripple and no lag | Software radio, vibration analysis, ultrasound, offline analysis |

The envelope detector's weaknesses are those of following peaks blindly. When AM is **overmodulated** ($m > 1$), the true envelope $A(1 + m\cos 2\pi W t)$ goes negative, but a peak follower can only report its size, so the output is the folded shape $A\lvert 1 + m\cos 2\pi W t\rvert$ and the audio distorts. In noise, it also has a **threshold**: below a certain carrier-to-noise ratio the noise, not the carrier, sets the peaks and the message is lost, while a synchronous detector degrades gradually. In software, the [Hilbert transform guide](/learn/signal-processing/hilbert-transform/) compares the rectify-and-low-pass envelope (the digital diode detector) with the Hilbert envelope, with measured delays.

## What envelope detectors are used for

Envelope detectors are used wherever the level of a fast oscillation matters more than the oscillation itself.

- AM broadcast and shortwave receivers, from crystal sets, which are a tuned circuit and a diode detector with no amplifier, to superheterodyne radios with a detector at the IF.
- RF power and level detectors: Schottky diode detectors in their square-law region measure transmitted power and drive the power-control loops of transmitters.
- On-off keying (OOK) and amplitude-shift keying (ASK) receivers, such as RFID tags, remote key fobs and low-power wake-up radios, where an envelope detector is cheaper and lower power than a full receiver.
- Audio level detection in compressors, limiters, noise gates and level meters, usually with separate attack and release times.
- Ultrasound imaging: each echo is a burst of a few megahertz, and a B-mode scanner displays its envelope as brightness (today mostly computed digitally).
- Radar and sonar, where the envelope of each returned pulse gives its arrival time and strength.

## Common envelope detector mistakes

Most detector problems come from an RC chosen for only one of its two limits, or from ignoring the diode's forward drop.

- **Choosing RC from the carrier alone.** A long RC kills the ripple but clips the troughs. Check the upper limit at your deepest modulation and highest message frequency.
- **Ignoring the diode drop.** A silicon diode on a 1 V signal loses the troughs and most of the signal. Raise the level, use a Schottky diode, or use a precision detector.
- **Forgetting the drop in the clipping limit.** The drop makes the modulation at the capacitor deeper ($mA/(A - V_D)$), so a design that just passes with an ideal diode can clip with a real one.
- **Loading the detector.** A volume control or amplifier input of similar size to $R$ causes negative-peak clipping. Keep the AC load well above $R$.
- **Expecting it to demodulate SSB or DSB-SC.** Those signals have no carrier to follow; the envelope detector outputs the wrong waveform. Use a synchronous detector.
- **Testing with a single tone at low modulation.** A design that works at 30% modulation and 1 kHz can clip at 80% and 5 kHz. Test at the deepest modulation and the highest message frequency you need.

## How to simulate an envelope detector in JavaScript, React or Angular

The simulator steps the diode, capacitor and resistor through two cycles of the message tone, 40 time steps per carrier cycle, and re-runs on every control change. In the simulator below, the top chart shows the AM input (blue), the true envelope (dashed) and the diode detector's output (orange). The bottom chart shows the output minus the true envelope, so ripple appears as a sawtooth below zero and diagonal clipping as humps above it.

Choose the **carrier** frequency, the **message frequency**, the **modulation depth** and the carrier **amplitude**, then set **R** and **C** from standard component values. **Diode** switches between an ideal diode and a 0.3 V or 0.7 V forward drop, and **Noise** adds random noise (off by default). The readout gives RC against its two limits, the measured ripple and clipping, and a verdict. Scroll to zoom in on individual carrier cycles and see the ripple; drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="envelope detector simulator" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Things to try:

- Start from the worked example (1 MHz, 5 kHz, 80%, 10 kΩ, 2.2 nF), then move **C** up to 3.3 nF and watch the troughs clip.
- Drop C to 220 pF ($RC = 2.2$ µs): the output loses about a third of its value between carrier peaks.
- Set **Diode** to 0.7 V with a 1 V amplitude: the troughs drop out. Raise the amplitude to 5 V and the troughs return, but the drop now deepens the modulation enough to clip at 22 µs.
- Set the carrier to 455 kHz with the same R and C, and compare the ripple.

Here is the code for this simulator. The circuit model is plain JavaScript; the charts are ordinary SciChart.js line series.

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
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // A diode envelope detector, one time step at a time: charge to (input - drop) when the diode conducts,
    // otherwise discharge through R by exp(-dt / RC)
    const diodeDetector = (input: number[], dt: number, rc: number, diodeDrop: number) => {
        const decay = Math.exp(-dt / rc);
        let v = 0;
        return input.map((x) => (v = Math.max(v * decay, x - diodeDrop)));
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (µs)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Voltage (V)" }));

        const { xValues, yValues, dt } = getYourAmSignal(); // evenly spaced samples, dt seconds apart
        const output = diodeDetector(yValues, dt, 10e3 * 2.2e-9, 0.3); // R = 10 kΩ, C = 2.2 nF, Schottky diode

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "AM input" }),
                stroke: "#50C7E0",
                strokeThickness: 1
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: output, dataSeriesName: "Detector output" }),
                stroke: "#F48420",
                strokeThickness: 2.5
            })
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

    export const EnvelopeDetectorChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // A diode envelope detector, one time step at a time: charge to (input - drop) when the diode conducts,
    // otherwise discharge through R by exp(-dt / RC)
    const diodeDetector = (input: number[], dt: number, rc: number, diodeDrop: number) => {
        const decay = Math.exp(-dt / rc);
        let v = 0;
        return input.map((x) => (v = Math.max(v * decay, x - diodeDrop)));
    };

    @Component({
        selector: "app-envelope-detector-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class EnvelopeDetectorChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (µs)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Voltage (V)" }));

            const { xValues, yValues, dt } = getYourAmSignal(); // evenly spaced samples, dt seconds apart
            const output = diodeDetector(yValues, dt, 10e3 * 2.2e-9, 0.3); // R = 10 kΩ, C = 2.2 nF, Schottky diode

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "AM input" }),
                    stroke: "#50C7E0",
                    strokeThickness: 1
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: output, dataSeriesName: "Detector output" }),
                    stroke: "#F48420",
                    strokeThickness: 2.5
                })
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

- The circuit is the `diodeDetector()` function: one loop over the samples, with one multiplication and one comparison per step. The time step must be much shorter than a carrier period (the simulator uses 40 steps per cycle) so the charging happens close to each peak.
- The model treats the diode as a switch with a fixed forward drop and charges the capacitor instantly. A real diode and source have some resistance, so the capacitor charges a little below the peak; add a series resistance to the model if that matters.
- The input, the envelope and the output are three `FastLineRenderableSeries` on one chart; the error is a fourth series on a second chart. On every control change the simulator calls `clear()` then `appendRange()` on each `XyDataSeries` and SciChart.js redraws on the next frame.
- On a 1 MHz carrier, two cycles of a 500 Hz message are 160,000 samples per series, and the whole simulation and redraw still follow the sliders.

**See it in the demo app:** the demo app has no envelope detector, so the closest is the [JavaScript audio spectrum analyzer chart](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio spectrum analyzer chart](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio spectrum analyzer chart](https://www.scichart.com/demo/angular/audio-analyzer-fft-example), which charts live microphone audio as a waveform, a spectrum and a spectrogram.

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), and the [Hilbert transform guide](/learn/signal-processing/hilbert-transform/) for envelope detection in software.

## Frequently asked questions

### What is an envelope detector?

An envelope detector is a circuit that follows the slowly changing peak amplitude of a fast oscillating signal and outputs that outline, the envelope, without the oscillation. The simplest one is a diode followed by a capacitor and a resistor in parallel. It demodulates AM radio and measures the level of RF, audio and ultrasound signals.

### How does a diode envelope detector work?

On each positive peak of the carrier, the diode conducts and charges the capacitor to the peak voltage. Between peaks the diode is off and the capacitor discharges slowly through the resistor. If the RC time constant is long compared with a carrier cycle but short compared with the message, the capacitor voltage follows the peaks, which is the envelope.

### How do you choose R and C for an envelope detector?

Choose the time constant RC between two limits: much longer than one carrier period, 1/fc, so the carrier ripple is small, and short enough that the capacitor can discharge as fast as the envelope falls. For a sine message of frequency W and modulation depth m, that upper limit is RC &lt;= sqrt(1 - m^2) / (2 pi W m). For a 1 MHz carrier, 5 kHz audio and 80% modulation, the limit is about 24 microseconds, and 10 kilohms with 2.2 nanofarads (22 microseconds) works.

### What is diagonal clipping in an envelope detector?

Diagonal clipping happens when the detector's RC time constant is too long: the capacitor cannot discharge as fast as the envelope falls, so the output cuts across the troughs of the envelope in a straight-looking exponential slope instead of following them. It gets worse with deeper modulation and higher message frequencies, and is cured by a smaller RC.

### What is the difference between an envelope detector and a synchronous detector?

An envelope detector only follows the peaks of the signal, so it needs no reference and costs a diode, a resistor and a capacitor. A synchronous (product) detector multiplies the signal by a locally generated copy of the carrier and low-pass filters the result. It needs that carrier to be recovered in frequency and phase, but it also demodulates overmodulated AM, DSB-SC and SSB, and works better in noise.

### How do I simulate an envelope detector in JavaScript?

Step through the input samples with a time step dt. At each step, let the capacitor voltage decay by a factor exp(-dt / RC); if the input minus the diode drop is higher than that, the diode conducts and the capacitor voltage becomes the input minus the drop. The resulting array is the detector output. With SciChart.js, draw the input, the output and the true envelope as `FastLineRenderableSeries`.

## Sources

- Haykin, S. and Moher, M. (2009), *Communication Systems*, 5th edition, Wiley. Amplitude modulation, the envelope detector and its time-constant limits, and coherent (synchronous) detection.
- Horowitz, P. and Hill, W. (2015), *The Art of Electronics*, 3rd edition, Cambridge University Press. Precision rectifiers and peak detectors with op-amps.
- Analog Devices, [ADALM2000 Activity: Envelope Detector](https://www.analog.com/en/resources/analog-dialogue/studentzone/studentzone-september-2024.html), StudentZone, *Analog Dialogue*, September 2024. A bench build of diode envelope detectors.
- Smith, J. O., [Spectral Audio Signal Processing](https://ccrma.stanford.edu/~jos/sasp/), Center for Computer Research in Music and Acoustics (CCRMA), Stanford University. Analytic signals and envelope estimation in software.

<LearnCta position="bottom" chart="envelope detector simulator" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
