---
sidebar_position: 150
sidebar_label: Oscilloscope
title: "How to Use an Oscilloscope: The Display, Triggering and Measurements"
description: "How to use and read an oscilloscope: volts and time per division, probes, coupling, triggering, measurements, bandwidth and sample rate, software oscilloscopes, and scope vs logic analyzer."
keywords:
    [
        "how to use an oscilloscope",
        "how to read an oscilloscope",
        "oscilloscope",
        "oscilloscope software",
        "software oscilloscope",
        "pc oscilloscope software",
        "usb oscilloscope software",
        "online oscilloscope",
        "oscilloscope triggering",
        "oscilloscope sampling rate",
        "oscilloscope bandwidth",
        "oscilloscope fft",
        "volts per division",
        "time per division",
        "oscilloscope vs logic analyzer",
        "what is a logic analyzer"
    ]
image: /img/learn/oscilloscope-og.png
related: [strip-chart, fast-fourier-transform, nyquist-and-aliasing, vibration-analysis]
datePublished: 2026-11-20
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How do you use an oscilloscope?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Connect a 10× probe to channel 1, set the channel to 10×, and compensate the probe on the scope's square-wave calibration output. Clip the probe's ground lead to the circuit's ground and touch the tip to the test point. Then set volts per division so the signal fills most of the screen, set time per division to show two or three cycles, and set an edge trigger with its level inside the signal so the trace stands still. Read values off the grid or use the scope's automatic measurements."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you read an oscilloscope?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An oscilloscope shows voltage on the vertical axis and time on the horizontal axis, on a grid of divisions, usually 10 across and 8 high. Count divisions and multiply by the scale: a trace 6 divisions tall at 0.5 V per division is 3 V peak to peak, and a period of 4 divisions at 0.2 ms per division is 0.8 ms, which is a frequency of 1.25 kHz."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between an oscilloscope and a logic analyzer?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An oscilloscope measures the actual voltage of a few channels, usually two or four, so it shows the shape of a signal: its levels, edges, noise and ringing. A logic analyzer records many digital channels, often 16 or more, as ones and zeros against a threshold, triggers on bit patterns and decodes buses such as I2C, SPI and UART. Use a scope for signal quality and a logic analyzer for what a digital system is doing."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is oscilloscope software?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Oscilloscope software runs on a PC or in a browser and does the display and analysis part of an oscilloscope: it draws the waveform on a grid, triggers, measures, runs an FFT and saves data. The samples come from a USB oscilloscope, a data acquisition card, a sound card or a simulation. Bench oscilloscopes also come with PC software for remote control and for saving waveforms."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What sample rate does an oscilloscope need?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "More than twice the highest frequency in the signal, or it aliases, and in practice more. Tektronix recommends at least 2.5 times the highest frequency component when the scope reconstructs the waveform with sin(x)/x interpolation, and at least 10 times with linear interpolation. Bandwidth matters too: by the 5 times rule, the scope's bandwidth should be five times the highest frequency you need to measure accurately."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a software oscilloscope in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Draw each acquisition as a line series on a chart whose axes have fixed ranges and one gridline per division. Search each record for the trigger crossing, shift the time values so the trigger is at zero, and replace the data on every update. With SciChart.js, use a FastLineRenderableSeries for the trace, extra series with falling opacity for persistence, and an editable HorizontalLineAnnotation for the trigger level. The chart code is the same in React, with scichart-react, and in Angular, with scichart-angular."
                    }
                }
            ]
        })}
    </script>
</head>

# How to Use an Oscilloscope

## What is an oscilloscope?

An **oscilloscope** (or scope) is an instrument that draws a voltage as it changes over time, with voltage on the vertical axis and time on the horizontal. It shows the shape of a signal, so you can measure its amplitude, frequency, rise time and duty cycle, and see noise, glitches and distortion that a multimeter's single number hides.

![A software oscilloscope screen in a dark navy theme: a 10 by 8 division grid with a noisy yellow pulse train triggered on a rising edge at the centre, older traces fading behind the live one, and a dashed orange trigger level line](/img/learn/oscilloscope-og.png)

*A software oscilloscope showing a noisy 1 kHz pulse train at 1 V/div and 0.2 ms/div, triggered on the rising edge, with persistence keeping the last few traces on screen (simulated signal). [Try the interactive version](#how-to-build-a-software-oscilloscope-in-javascript-react-or-angular).*

:::tip Key takeaways
- Read a scope by counting divisions: volts per division sets the vertical scale, time per division the horizontal.
- The trigger makes a repeating signal stand still by starting every sweep at the same point on the waveform. Without it, the trace drifts or jumps.
- Use a 10× probe for most work, compensate it before you measure, and clip its ground lead only to the circuit's ground.
- Bandwidth limits how fast a signal the scope can show accurately; sample rate limits how finely it records it. Too low a sample rate makes false, aliased waveforms.
- A software oscilloscope does the display, triggering and measuring on a computer, with samples from a USB scope, a sound card or a data acquisition card.
:::

Engineers use oscilloscopes to debug circuits, check power supplies, look at sensor outputs, test audio and radio equipment, and verify that digital signals have clean edges and correct timing.

## How to read an oscilloscope

The screen is a grid called the **graticule**, usually 10 divisions across and 8 divisions high. Each channel has a vertical scale, set in **volts per division** (V/div), and the whole screen has one horizontal scale, set in **time per division** (s/div, ms/div or µs/div). The scales are printed along the bottom or top of the screen.

To read a value, count divisions and multiply by the scale. The diagram works through one screen.

![An oscilloscope screen with a 10 by 8 division grid and a yellow pulse train. Labels show one division (0.2 ms wide, 0.5 V tall), the 0 V ground marker, the trigger level at 1.5 V on a rising edge, and the trigger point at the centre. The pulse is 6 divisions tall, 3 V peak to peak; rising edges are 4 divisions apart, a period of 0.8 ms and a frequency of 1.25 kHz; each pulse is high for 1 division, a duty cycle of 25%](./oscilloscope-screen-reading.svg)

- Amplitude. The pulse is 6 divisions tall at 0.5 V/div, so it is 6 × 0.5 = 3 V peak to peak.
- Period and frequency. Two rising edges are 4 divisions apart at 0.2 ms/div, so the period is 0.8 ms and the frequency is 1 ÷ 0.8 ms = 1.25 kHz.
- Duty cycle. Each pulse is high for 1 division (0.2 ms) out of 4, a duty cycle of 25%.
- Levels. The marker on the left shows where 0 V sits on the screen. The pulse goes from 0 V to 3 V.
- Trigger. The small arrow at the top marks the trigger point, the moment the signal crossed the trigger level (1.5 V) going up. Time is measured from there.

Spread the signal over most of the screen before reading it. A trace that covers 6 divisions can be read to a fraction of a division; one that covers half a division can't.

To describe a scope screen, give the scales, the trigger and what the signal does: "At 0.5 V/div and 0.2 ms/div, triggered on the rising edge at 1.5 V, channel 1 shows a 3 V, 1.25 kHz pulse train with a 25% duty cycle and no visible ringing."

## How to use an oscilloscope, step by step

Using an oscilloscope comes down to connecting and compensating the probe, scaling the screen to fit the signal, and setting a trigger so the trace stands still.

1. Connect a probe to channel 1, and set the channel's probe setting to match the probe (10× for most passive probes). Many scopes detect the probe; on others you set it by hand.
2. Compensate the probe. Touch it to the scope's calibration output, a square wave of about 1 kHz, and turn the small trimmer on the probe until the square wave has sharp corners, neither rounded nor overshooting.
3. Clip the ground lead to the circuit's ground, then touch the probe tip to the point you want to measure.
4. Press Autoset (or Auto Scale) if the scope has one. It picks scales and a trigger that show the signal.
5. Set volts per division so the signal covers most of the screen height, and move the trace with the vertical position knob.
6. Set time per division so you see two or three cycles of a repeating signal, or the whole event for a one-off.
7. Set the trigger: edge type, rising or falling, on the channel you're watching, with the level inside the signal. The trace should stand still.
8. Measure, either by counting divisions or with the scope's cursors and automatic measurements.

### Oscilloscope probes: 1× and 10×

A standard passive probe is either 1× or 10×, and many switch between the two. A **10× probe** divides the signal by ten before it reaches the scope. It loads the circuit less and has much more bandwidth than a 1× probe, so it's the general-purpose choice. A 1× probe passes the signal straight through, which helps with signals of a few millivolts but loads the circuit more and adds interference.

### AC and DC coupling

Each channel has a coupling setting. **DC coupling** shows the whole signal, including any constant (DC) part. **AC coupling** puts a capacitor in the path, which blocks the DC part and centres the signal on 0 V. Use AC coupling to look at a small ripple riding on a large DC level, such as 50 mV of noise on a 12 V supply; use DC coupling for everything else. AC coupling also makes slow square waves sag, because the capacitor blocks their flat tops too.

## Oscilloscope triggering

A scope draws the signal in sweeps across the screen, many times a second. The **trigger** decides when each sweep starts. If every sweep starts at the same point on a repeating waveform, the sweeps land on top of each other and the trace stands still. If they start at random points, each sweep shows the waveform shifted, and the display drifts sideways, jumps or smears into a blur. That moving, "rolling" picture is the classic sign of a scope that isn't triggered.

The most common trigger is the edge trigger. It has three settings:

| Setting | What it does | Typical choice |
| --- | --- | --- |
| Source | Which channel the scope watches for the trigger | The channel showing the signal, or a cleaner related signal |
| Level | The voltage the signal must cross | About halfway between the signal's low and high levels |
| Slope (edge) | Whether to trigger on the signal going up (rising) or down (falling) | Rising, unless you're studying a falling edge |

If the level is above the signal's peak or below its trough, nothing ever crosses it and the scope can't trigger. Scopes also offer trigger modes:

- Auto. Sweeps on each trigger, and sweeps anyway if no trigger comes for a short time, so you always see something. Good for finding a signal.
- Normal. Sweeps only on a trigger and otherwise keeps the last trace. Good for slow or occasional signals.
- Single. Sweeps once on the next trigger, then stops. Used to capture a one-off event, such as a power-up or a switch bounce.

Bench scopes add more trigger types for harder signals: pulse width (trigger on a pulse that's too short or too long), runt (a pulse that doesn't reach a full logic level), video, and serial-bus triggers that wait for a particular byte or address. **Holdoff** sets a time after each trigger during which new triggers are ignored. It stabilises complex signals, such as a burst of pulses, that would otherwise trigger at a different point in each burst.

## Oscilloscope measurements

Every measurement is a reading of voltage, of time, or of both. Digital scopes have cursors and automatic measurements for each of these, but they rely on the same definitions.

| Measurement | What it is | How to read it on the grid |
| --- | --- | --- |
| Peak-to-peak voltage (Vpp) | Highest minus lowest voltage | Divisions from bottom to top × V/div |
| Amplitude | Difference between the signal's high and low levels, ignoring overshoot and spikes | Divisions between the flat top and the flat bottom × V/div |
| Period | Time for one full cycle | Divisions between two matching edges × time/div |
| Frequency | Cycles per second, 1 ÷ period | Work it out from the period |
| Duty cycle | Fraction of each period the signal is high | High time ÷ period |
| Rise time | Time for an edge to go from 10% to 90% of the amplitude | Divisions between the 10% and 90% points × time/div |
| Pulse width | Time a pulse stays high, measured at 50% of the amplitude | Divisions at half height × time/div |

### Worked example: a PWM signal

A microcontroller drives a motor with a pulse-width modulated (PWM) signal. At 1 V/div and 10 µs/div, the trace goes from the 0 V marker to 3.3 divisions, so the high level is 3.3 V. Rising edges are 5 divisions apart: a period of 50 µs and a frequency of 1 ÷ 50 µs = 20 kHz. Each pulse is 3.5 divisions wide at half height, 35 µs, so the duty cycle is 35 ÷ 50 = 70%. Switching to 20 ns/div and expanding a rising edge, the edge crosses 10% (0.33 V) and 90% (2.97 V) 1.2 divisions apart, a rise time of 24 ns.

## Oscilloscope bandwidth and sample rate

**Bandwidth** is the frequency at which a sine wave shown on the scope has fallen to 70.7% of its true amplitude (the −3 dB point). Above it, amplitudes are too small and fast edges are rounded off. Tektronix's "5 times rule" is to choose a scope whose bandwidth is at least five times the highest frequency component you need to measure, which keeps the amplitude error below about 2%. For a 20 MHz signal, that's a 100 MHz scope.

Bandwidth also sets the fastest rise time the scope can show. For most scopes under 1 GHz, rise time ≈ 0.35 ÷ bandwidth, so a 100 MHz scope has a rise time of about 3.5 ns and can't show an edge faster than that.

**Sample rate** is how many samples per second a digital scope takes, in samples per second (S/s). By the [Nyquist theorem](/learn/applications/signal-processing/nyquist-and-aliasing/), it must be more than twice the highest frequency in the signal, or the signal aliases: a fast signal shows up as a slower one that isn't there. Twice isn't enough to draw a good waveform, though. Tektronix recommends at least 2.5 times the highest frequency component when the scope joins the samples with sin(x)/x interpolation, and at least 10 times with straight-line (linear) interpolation.

A scope keeps a fixed number of samples on screen, its record length, so the sample rate falls as you slow the time base. At slow time/div settings, a scope with a high headline sample rate can still alias a fast signal. The demo on this page keeps 100 samples per division, so at 50 ms/div it samples at only 2 kS/s.

## Persistence, roll mode and FFT mode

Three display modes change what the screen shows:

- **Persistence.** Instead of erasing each sweep, the scope leaves older traces on screen, fading over a set time or kept forever (infinite persistence). Noise shows as a band, jitter as smeared edges, and a rare glitch stays on screen after it happens. Digital phosphor scopes shade each pixel by how often the signal passed through it.
- **Roll mode.** At slow time bases the scope stops triggering and scrolls the trace from right to left as samples arrive, like a chart recorder or a [strip chart](/learn/real-time/strip-chart/). It suits slowly changing signals such as a battery discharging or a temperature, where waiting for a full sweep would take seconds.
- **FFT mode.** The scope runs a [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/) on the record and plots amplitude against frequency. It finds the frequency of a hum, the harmonics of a distorted sine or the switching noise of a power supply. The familiar figure of about 50 dB for an 8-bit scope (6.02 × 8 + 1.76 dB) is the ideal converter's signal-to-noise ratio, not the FFT's dynamic range. A long FFT spreads the noise over many frequency bins, so the noise floor in each bin sits lower, and the practical limit is usually the converter's distortion spurs, its spurious-free dynamic range (SFDR). Either way, a scope's FFT has much less dynamic range than a spectrum analyzer.

## Software and PC oscilloscopes

A **software oscilloscope** does on a computer what a bench scope does on its own screen: it draws the samples on a grid, triggers, measures, runs an FFT and saves waveforms. The samples come from one of these:

- A USB or PC oscilloscope: a box with the probe inputs, amplifiers and ADC, which streams samples to software on a PC. It costs less than a bench scope of the same specification, and the PC's screen and storage are bigger.
- A sound card. Its line input samples at audio rates (commonly 44.1 or 48 kHz, up to 192 kHz on some cards), so it can show signals up to around 20 kHz. Most sound-card inputs are AC-coupled, so they can't show DC levels, and they accept only small voltages: never connect them to mains or anything above line level without a proper input divider.
- A data acquisition (DAQ) card or an instrument's own data, read over a network.
- A simulation, for teaching or for testing the display software.

Bench scopes also come with PC software, for remote control, for saving and comparing waveforms, and for viewing them on a larger screen.

The display is the most demanding part of the software. It must redraw thousands to millions of points many times a second, keep the trace aligned to the trigger, layer persistence traces and stay responsive while you zoom and pan. SciChart.js does that job in the browser; see SciChart for [design, emulation and test](https://www.scichart.com/design-emulation-test/) and for [instrumentation software](https://www.scichart.com/best-instrumentation-engineering-software/) on scichart.com.

## Oscilloscope vs logic analyzer vs spectrum analyzer

A **logic analyzer** records many digital signals at once, often 16, 32 or more channels, as ones and zeros. It compares each channel to a threshold voltage, triggers on patterns and sequences of bits, and decodes buses such as I2C, SPI and UART into readable data. It doesn't show the voltage itself. A **spectrum analyzer** shows signal strength against frequency instead of time, with much more dynamic range and frequency coverage than a scope's FFT mode. A mixed-signal oscilloscope (MSO) adds logic analyzer channels to a scope.

| | Oscilloscope | Logic analyzer | Spectrum analyzer |
| --- | --- | --- | --- |
| Shows | Voltage against time | Ones and zeros against time, and decoded bus data | Power against frequency |
| Channels | Usually 2 or 4 | Often 16 to 100 or more | Usually 1 |
| Triggers on | Edges, pulse widths, runts, levels | Bit patterns, sequences, bus addresses and data | Frequency and power levels |
| Best for | Signal shape: levels, edges, noise, ringing, timing between a few signals | What a digital system is doing: protocol errors, timing across a whole bus | Radio signals, harmonics, interference, noise floors |
| Misses | Wide buses, long protocol sequences | Analogue problems such as slow edges or ringing | Time-domain shape |
| Use it when | You need to see the signal itself | You need many digital lines or decoded data | You need to see small signals near large ones in frequency |

For audio-frequency spectra in the browser, see the [audio spectrum analyzer](/learn/applications/signal-processing/audio-spectrum-analyzer/) guide.

## Common oscilloscope mistakes

The commonest oscilloscope mistakes are in the probe and its ground lead, and they can damage the circuit as well as the reading.

- **Clipping the ground lead to a live point.** On a mains-powered bench scope the probe's ground clip is connected to mains earth. Clipped anywhere other than the circuit's ground, it short-circuits that point to earth, which can destroy the circuit, the probe or the scope. Use a differential probe or an isolated scope to measure between two points that aren't ground.
- **Not compensating the probe.** An uncompensated 10× probe rounds or overshoots square edges and gets amplitudes wrong at higher frequencies. Compensate it on the calibration output each time you move it to another channel or scope.
- **A long ground lead on fast edges.** The lead's inductance makes fast edges ring that don't ring in the circuit. Use the short ground spring that comes with the probe.
- **Mismatched probe setting.** A 10× probe on a channel set to 1× reads ten times too low.
- **Leaving averaging or the bandwidth limit on.** Both filters clean up noise, and both hide the short glitches and fast edges you may be hunting for. Turn them off when you look for a fault, and check the sample rate on screen after changing the time base.
- **Trusting an untriggered trace.** A trace that drifts or blurs can't be measured. Set the trigger level inside the signal before reading anything.
- **Reading a tiny trace.** A signal using one division of the screen gives readings accurate to perhaps a tenth of its size. Change volts per division until it fills the screen.

## How to build a software oscilloscope in JavaScript, React or Angular

On every sweep, the demo below acquires a new 2,000-sample record from a simulated signal generator, searches it for the trigger, and draws the live trace over 12 fading persistence traces. Its 10 × 8 division screen, trigger, persistence and measurements work as on a bench scope.

Change the generator's **Waveform**, **Frequency**, **Amplitude** and **DC offset**. On the scope, change **Volts/div** and **Time/div**, switch **Coupling** to AC to remove the offset, untick **Trigger** to see the trace roll, choose a rising or falling **Edge**, and move the trigger **Level** with the slider or by dragging the dashed orange line. Untick **Persistence** to see only the newest trace, and press **Stop** to freeze it. The readouts above the screen measure Vpp, frequency, period, duty cycle and rise time on every sweep. To see aliasing, set a sine wave of about 2.1 kHz and a time base of 50 ms/div: the scope samples at only 2 kS/s, so it draws, and measures, a sine of around 100 Hz that isn't in the signal. The mouse wheel zooms into the trace, dragging pans it, and a double-click returns to the full screen.

<LiveDocSnippet maxWidth={'100%'} height={680} name="./Basic/demo" />

<LearnCta position="top" chart="oscilloscope display" demo="realtime-ghosted-traces-chart" demoLabel="real-time ghosted traces chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />

Here is the code for this oscilloscope. The signal generator, the trigger search, the measurements and the HTML controls are plain JavaScript; SciChart.js draws the graticule, the trace, the persistence traces and the trigger markers.

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
        ELabelPlacement,
        FastLineRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    const VOLTS_PER_DIV = 1;
    const TIME_PER_DIV = 0.2; // ms
    const TRIGGER_LEVEL = 0; // V, rising edge
    const GHOSTS = 10; // older sweeps kept on screen for persistence

    // Index of the first rising crossing of the trigger level after `from`, or -1
    const findRisingEdge = (volts: number[], level: number, from: number) => {
        for (let i = Math.max(1, from); i < volts.length; i++) {
            if (volts[i - 1] < level && volts[i] >= level) return i;
        }
        return -1;
    };

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // A 10 × 8 division graticule: fixed ranges and one gridline per division
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Time from trigger (ms)",
                autoRange: EAutoRange.Never,
                autoTicks: false,
                majorDelta: TIME_PER_DIV,
                minorDelta: TIME_PER_DIV / 5,
                visibleRange: new NumberRange(-5 * TIME_PER_DIV, 5 * TIME_PER_DIV)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Voltage (V)",
                autoRange: EAutoRange.Never,
                autoTicks: false,
                majorDelta: VOLTS_PER_DIV,
                minorDelta: VOLTS_PER_DIV / 5,
                visibleRange: new NumberRange(-4 * VOLTS_PER_DIV, 4 * VOLTS_PER_DIV)
            })
        );
        // Persistence: fading copies of the last few sweeps, under the live trace
        const ghosts = Array.from({ length: GHOSTS }, () => {
            const dataSeries = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
            const line = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#F6E05E", strokeThickness: 1 });
            sciChartSurface.renderableSeries.add(line);
            return { dataSeries, line };
        });
        const trace = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: trace, stroke: "#F6E05E", strokeThickness: 2 })
        );
        sciChartSurface.annotations.add(
            new HorizontalLineAnnotation({
                y1: TRIGGER_LEVEL,
                stroke: "#FF8A3D",
                strokeDashArray: [6, 4],
                showLabel: true,
                labelPlacement: ELabelPlacement.Axis
            })
        );
        sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));

        let sweep = 0;
        let previous: { times: number[]; volts: number[] } | undefined;
        // Each record: times (ms) and volts, longer than the screen so there's room before and after the trigger
        const unsubscribe = subscribeToYourScopeData((times: number[], volts: number[]) => {
            const trigger = findRisingEdge(volts, TRIGGER_LEVEL, Math.floor(volts.length / 4));
            if (trigger < 0) return; // normal trigger mode: keep the last sweep on screen
            const shifted = times.map((t) => t - times[trigger]); // the trigger point becomes time zero
            if (previous) {
                // The last sweep becomes the newest ghost; older ghosts fade
                const newest = sweep % GHOSTS;
                ghosts[newest].dataSeries.clear();
                ghosts[newest].dataSeries.appendRange(previous.times, previous.volts);
                ghosts.forEach((ghost, k) => (ghost.line.opacity = 0.45 * (1 - ((newest - k + GHOSTS) % GHOSTS) / GHOSTS)));
                sweep++;
            }
            previous = { times: shifted, volts };
            trace.clear();
            trace.appendRange(shifted, volts);
        });
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    // SciChartReact creates the chart, sizes it and cleans it up
    export const SoftwareOscilloscope = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 480 }} />
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
        ELabelPlacement,
        FastLineRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    const VOLTS_PER_DIV = 1;
    const TIME_PER_DIV = 0.2; // ms
    const TRIGGER_LEVEL = 0; // V, rising edge
    const GHOSTS = 10; // older sweeps kept on screen for persistence

    // Index of the first rising crossing of the trigger level after `from`, or -1
    const findRisingEdge = (volts: number[], level: number, from: number) => {
        for (let i = Math.max(1, from); i < volts.length; i++) {
            if (volts[i - 1] < level && volts[i] >= level) return i;
        }
        return -1;
    };

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // A 10 × 8 division graticule: fixed ranges and one gridline per division
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Time from trigger (ms)",
                autoRange: EAutoRange.Never,
                autoTicks: false,
                majorDelta: TIME_PER_DIV,
                minorDelta: TIME_PER_DIV / 5,
                visibleRange: new NumberRange(-5 * TIME_PER_DIV, 5 * TIME_PER_DIV)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Voltage (V)",
                autoRange: EAutoRange.Never,
                autoTicks: false,
                majorDelta: VOLTS_PER_DIV,
                minorDelta: VOLTS_PER_DIV / 5,
                visibleRange: new NumberRange(-4 * VOLTS_PER_DIV, 4 * VOLTS_PER_DIV)
            })
        );
        // Persistence: fading copies of the last few sweeps, under the live trace
        const ghosts = Array.from({ length: GHOSTS }, () => {
            const dataSeries = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
            const line = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#F6E05E", strokeThickness: 1 });
            sciChartSurface.renderableSeries.add(line);
            return { dataSeries, line };
        });
        const trace = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: trace, stroke: "#F6E05E", strokeThickness: 2 })
        );
        sciChartSurface.annotations.add(
            new HorizontalLineAnnotation({
                y1: TRIGGER_LEVEL,
                stroke: "#FF8A3D",
                strokeDashArray: [6, 4],
                showLabel: true,
                labelPlacement: ELabelPlacement.Axis
            })
        );
        sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));

        let sweep = 0;
        let previous: { times: number[]; volts: number[] } | undefined;
        // Each record: times (ms) and volts, longer than the screen so there's room before and after the trigger
        const unsubscribe = subscribeToYourScopeData((times: number[], volts: number[]) => {
            const trigger = findRisingEdge(volts, TRIGGER_LEVEL, Math.floor(volts.length / 4));
            if (trigger < 0) return; // normal trigger mode: keep the last sweep on screen
            const shifted = times.map((t) => t - times[trigger]); // the trigger point becomes time zero
            if (previous) {
                // The last sweep becomes the newest ghost; older ghosts fade
                const newest = sweep % GHOSTS;
                ghosts[newest].dataSeries.clear();
                ghosts[newest].dataSeries.appendRange(previous.times, previous.volts);
                ghosts.forEach((ghost, k) => (ghost.line.opacity = 0.45 * (1 - ((newest - k + GHOSTS) % GHOSTS) / GHOSTS)));
                sweep++;
            }
            previous = { times: shifted, volts };
            trace.clear();
            trace.appendRange(shifted, volts);
        });
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-software-oscilloscope",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 480px"></scichart-angular>`
    })
    export class SoftwareOscilloscopeComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- The graticule is two `NumericAxis` objects with `autoTicks: false`, a `majorDelta` of one division and fixed visible ranges of 10 and 8 divisions. Changing volts or time per division changes `majorDelta` and `visibleRange` together.
- Each sweep replaces the trace's data: `clear()`, then `appendRange()` with time values shifted so the trigger crossing is at zero. A `FastLineRenderableSeries` redraws thousands of points per sweep without slowing down.
- Persistence is a ring of extra line series under the live trace. Each sweep, the oldest is overwritten with the previous trace, and every ghost's `opacity` falls with its age.
- The trigger level is an editable `HorizontalLineAnnotation`: drag it and its `dragDelta` event updates the trigger. A `VerticalLineAnnotation` marks the trigger point.

**See it in the demo app:** [JavaScript real-time ghosted traces chart](https://www.scichart.com/demo/javascript/realtime-ghosted-traces-chart) · [React real-time ghosted traces chart](https://www.scichart.com/demo/react/realtime-ghosted-traces-chart) · [Angular real-time ghosted traces chart](https://www.scichart.com/demo/angular/realtime-ghosted-traces-chart). Related techniques: the [React audio analyzer with FFT](https://www.scichart.com/demo/react/audio-analyzer-fft-example), [React real-time chart performance](https://www.scichart.com/demo/react/chart-realtime-performance-demo), [React draggable threshold line](https://www.scichart.com/demo/react/chart-drag-horizontal-threshold) and [React real-time zoom and pan](https://www.scichart.com/demo/react/zoom-pan-realtime-javascript-chart).

**Go deeper:** [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/), [gridline and label spacing](/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval/), the [horizontal line annotation](/2d-charts/annotations-api/horizontal-line-annotation/), [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/) and the learning center guides to the [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/) and [Nyquist and aliasing](/learn/applications/signal-processing/nyquist-and-aliasing/). For the industries, see SciChart for [design, emulation and test](https://www.scichart.com/design-emulation-test/) and [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/). For ultrasonic A-scans, which look like a triggered oscilloscope trace of echoes, see [non-destructive testing](/learn/applications/non-destructive-testing/).

## Frequently asked questions

### How do you use an oscilloscope?

Connect a 10× probe to channel 1, set the channel to 10×, and compensate the probe on the scope's square-wave calibration output. Clip the probe's ground lead to the circuit's ground and touch the tip to the test point. Then set volts per division so the signal fills most of the screen, set time per division to show two or three cycles, and set an edge trigger with its level inside the signal so the trace stands still. Read values off the grid or use the scope's automatic measurements.

### How do you read an oscilloscope?

An oscilloscope shows voltage on the vertical axis and time on the horizontal axis, on a grid of divisions, usually 10 across and 8 high. Count divisions and multiply by the scale: a trace 6 divisions tall at 0.5 V per division is 3 V peak to peak, and a period of 4 divisions at 0.2 ms per division is 0.8 ms, which is a frequency of 1.25 kHz.

### What is the difference between an oscilloscope and a logic analyzer?

An oscilloscope measures the actual voltage of a few channels, usually two or four, so it shows the shape of a signal: its levels, edges, noise and ringing. A logic analyzer records many digital channels, often 16 or more, as ones and zeros against a threshold, triggers on bit patterns and decodes buses such as I2C, SPI and UART. Use a scope for signal quality and a logic analyzer for what a digital system is doing.

### What is oscilloscope software?

Oscilloscope software runs on a PC or in a browser and does the display and analysis part of an oscilloscope: it draws the waveform on a grid, triggers, measures, runs an FFT and saves data. The samples come from a USB oscilloscope, a data acquisition card, a sound card or a simulation. Bench oscilloscopes also come with PC software for remote control and for saving waveforms.

### What sample rate does an oscilloscope need?

More than twice the highest frequency in the signal, or it aliases, and in practice more. Tektronix recommends at least 2.5 times the highest frequency component when the scope reconstructs the waveform with sin(x)/x interpolation, and at least 10 times with linear interpolation. Bandwidth matters too: by the 5 times rule, the scope's bandwidth should be five times the highest frequency you need to measure accurately.

### How do I make a software oscilloscope in JavaScript?

Draw each acquisition as a line series on a chart whose axes have fixed ranges and one gridline per division. Search each record for the trigger crossing, shift the time values so the trigger is at zero, and replace the data on every update. With SciChart.js, use a `FastLineRenderableSeries` for the trace, extra series with falling opacity for persistence, and an editable `HorizontalLineAnnotation` for the trigger level. The chart code is the same in React, with `scichart-react`, and in Angular, with `scichart-angular`.

## Sources

- Tektronix (2009), [XYZs of Oscilloscopes](https://www.ece.ucdavis.edu/~spencer/195/datasheets/XYZ.pdf), primer 03W-8605-4. The vertical, horizontal and trigger systems, trigger modes and holdoff, 1× and 10× probes, probe compensation, the −3 dB definition of bandwidth and the 5 times rule, rise time = k ÷ bandwidth (k = 0.35 for most scopes under 1 GHz), and sample rates for sin(x)/x and linear interpolation.
- Tektronix (2003), [XYZs of Logic Analyzers](https://web.mit.edu/6.111/www/s2007/handouts/LA.pdf), primer 52W-14266-1 (course copy hosted by MIT 6.111). How a logic analyzer samples many channels against a threshold, its timing and state modes, and its triggers.
- Kester, W., [Taking the Mystery out of the Infamous Formula, "SNR = 6.02N + 1.76dB"](https://www.analog.com/media/en/training-seminars/tutorials/MT-001.pdf), Analog Devices tutorial MT-001, Rev. A (2008). The ideal signal-to-noise ratio of an N-bit converter, and the FFT processing gain that lowers the noise floor per bin.
- Horowitz, P. and Hill, W. (2015), *The Art of Electronics*, 3rd edition, Cambridge University Press. Oscilloscopes, probes, grounding and measurement practice.

<LearnCta position="bottom" chart="oscilloscope display" demo="realtime-ghosted-traces-chart" demoLabel="real-time ghosted traces chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />
