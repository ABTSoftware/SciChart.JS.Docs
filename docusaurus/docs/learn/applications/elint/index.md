---
sidebar_position: 80
sidebar_label: ELINT
title: "ELINT: Radar Pulse Analysis and PRI Explained (Interactive)"
description: "What ELINT is and how radar pulses are analysed: pulse descriptor words, PRI and PRF, PRI types, deinterleaving and scan patterns, with a live simulation."
keywords:
    [
        "elint",
        "electronic intelligence",
        "what is elint",
        "elint vs sigint",
        "pulse repetition interval",
        "pri radar",
        "pulse repetition frequency",
        "pulse descriptor word",
        "staggered pri",
        "pri jitter",
        "radar pulse deinterleaving",
        "pri histogram"
    ]
image: /img/learn/elint-og.png
related: [sigint, radar-display, direction-finding, rf-spectrum-analyzer]
datePublished: 2026-11-27
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is ELINT?",
                    "acceptedAnswer": { "@type": "Answer", "text": "ELINT, or electronic intelligence, is intelligence gathered from electronic signals that don't carry messages, mainly radar. A passive receiver measures each radar pulse it hears, and analysts use those measurements to work out what kind of radar sent them, how it pulses and how its antenna scans." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between ELINT and SIGINT?",
                    "acceptedAnswer": { "@type": "Answer", "text": "SIGINT, signals intelligence, is the whole field of intelligence from intercepted signals. ELINT is one branch of it, covering non-communications signals such as radar. COMINT, the other main branch, covers communications such as voice and data, and FISINT covers instrumentation signals such as telemetry." }
                },
                {
                    "@type": "Question",
                    "name": "What is pulse repetition interval in radar?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The pulse repetition interval (PRI) is the time from the start of one radar pulse to the start of the next. Its reciprocal is the pulse repetition frequency (PRF): a PRI of 1,000 microseconds is a PRF of 1,000 pulses per second. The PRI sets how far the radar can measure range without ambiguity." }
                },
                {
                    "@type": "Question",
                    "name": "How do you calculate maximum unambiguous range from PRI?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Multiply the PRI by the speed of light and divide by two, because the pulse travels out and back: R = c × PRI / 2. A PRI of 1,000 microseconds gives 300,000 km/s × 0.001 s / 2 = 150 km. An echo from further away arrives after the next pulse has gone out, and the radar places it at the wrong, shorter range." }
                },
                {
                    "@type": "Question",
                    "name": "What is a staggered PRI?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A staggered PRI cycles through a short, fixed sequence of intervals, such as 700, 800 and 900 microseconds, and then repeats. Radars use stagger to move the blind speeds of their moving-target filters. On a difference-of-time-of-arrival histogram, a stagger shows one peak per interval, plus a peak at the sum of the cycle, called the frame." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make an ELINT pulse display in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Plot each pulse descriptor word as a point on scatter charts: time of arrival against frequency, and pulse width against frequency. Use XyDataSeries with fifoCapacity so old pulses drop off, and append new pulses in batches with appendRange. Draw the PRI histogram as a column series. SciChart.js does this in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# ELINT

## What is ELINT?

**ELINT** (electronic intelligence) is intelligence gathered from electronic signals that don't carry messages, mainly radar. A passive receiver listens to a radar's pulses, measures each one's time of arrival, frequency, pulse width, amplitude and direction, and from those works out what kind of emitter it is, how it pulses and how its antenna scans.

![A simulated ELINT pulse analysis display in a dark navy theme with four charts. Top left, time of arrival against frequency: each pulse is a dot, and four emitters form four horizontal bands, one of them only short bursts. Top right, pulse width against frequency, where the pulses gather into four separate coloured clusters. Bottom left, amplitude against time, with a regular spike each time a scanning radar's beam passes the receiver. Bottom right, a PRI histogram of the time differences between pulses, with tall bars at each emitter's pulse repetition interval and its multiples](/img/learn/elint-og.png)

*A simulated pulse stream from four generic radars, sorted into emitters by frequency and pulse width. [Try the interactive version](#how-to-build-an-elint-pulse-display-in-javascript-react-or-angular).*

:::tip Key takeaways

- ELINT is the branch of signals intelligence that studies radars and other emitters that don't carry messages.
- A receiver turns every pulse it hears into a pulse descriptor word (PDW): time of arrival, frequency, pulse width, amplitude and angle of arrival.
- The pulse repetition interval (PRI) is the time between pulses. It sets a radar's maximum unambiguous range, R = c × PRI / 2, and its pattern (constant, staggered, jittered, sliding, dwell-and-switch) helps identify the radar.
- Deinterleaving separates the pulses of many radars mixed in one stream: first by clustering on direction, frequency and pulse width, then by finding repeating time differences in a PRI histogram.
- The amplitude of a scanning radar rises each time its beam sweeps past the receiver, which gives its scan period and beamwidth.

:::

## ELINT vs SIGINT, COMINT and electronic support

[Signals intelligence (SIGINT)](/learn/applications/sigint/) is the whole field of intelligence from intercepted signals. ELINT is one of its branches.

| Term | What it covers | Typical signals | Main question |
|---|---|---|---|
| SIGINT | All intelligence from intercepted signals | Everything below | Who is transmitting, and what can we learn? |
| COMINT (communications intelligence) | Signals that carry messages between people or machines | Voice, data links | What is being said, and by whom? |
| ELINT (electronic intelligence) | Signals that don't carry messages | Radars, navigation beacons, altimeters | What is this emitter, what can it do and where is it? |
| FISINT (foreign instrumentation signals intelligence) | Instrumentation signals, including what was once called TELINT | Telemetry from test vehicles | What is the instrumented system measuring? |
| ES (electronic support, formerly ESM) | Electronic warfare, not intelligence: recognise emitters now, for immediate action | Mostly radars | Which emitter is this, compared with a library? |

ELINT and electronic support use the same kind of receiver and the same measurements. The difference is the timescale. ELINT analysts take time to measure a new or changed emitter precisely and build up a library of emitter parameters; electronic support matches what it hears against that library in seconds. Intercepting other people's communications is regulated by law in most countries and is done only by authorised agencies. This guide is about the physics and the displays, with generic, simulated emitters.

## How a passive receiver sees radar pulses

A pulse radar transmits short bursts of radio energy, from a fraction of a microsecond to hundreds of microseconds long, and listens for echoes in between. An ELINT receiver doesn't transmit at all. It sits outside the radar and picks up the pulses directly, at the strength they arrive with after one trip, instead of the much weaker echoes the radar itself has to detect after a round trip. That's why a receiver can often hear a radar from further away than the radar can see the receiver.

Each pulse arrives as a short burst of carrier wave. The receiver detects its envelope, decides where it starts and ends, and measures it.

![Diagram of two radar pulses on a time axis, each a burst of carrier wave inside a dashed envelope. Labels mark the time of arrival at the first pulse's leading edge, the pulse width across the pulse, the amplitude as the height of the envelope, the frequency as the carrier inside the pulse, the angle of arrival as the direction the pulse comes from, and the pulse repetition interval from the start of one pulse to the start of the next, equal to one over the pulse repetition frequency](./pdw-pulse-anatomy.svg)

## The pulse descriptor word (PDW)

The receiver's output is a stream of **pulse descriptor words** (PDWs): one short record per pulse, holding the measurements below. In a busy environment the stream can reach hundreds of thousands of PDWs a second or more, so everything after this point works on PDWs, not on the raw signal.

| PDW field | What it is | What it tells you |
|---|---|---|
| Time of arrival (TOA) | When the pulse's leading edge arrived, to a fraction of a microsecond | The timing pattern: PRI, stagger, jitter and dwells come from differences between TOAs |
| Frequency (RF) | The carrier frequency inside the pulse | The radar's band and channel; a frequency-agile radar changes it from pulse to pulse |
| Pulse width (PW) | How long the pulse lasts, usually measured between its half-amplitude points | Range resolution (about c × PW / 2 for a plain pulse: 1 µs is 150 m) and the kind of radar |
| Amplitude | How strong the pulse is at the receiver, often in dBm | Changes over time show the antenna's scan; the level hints at distance and pointing |
| Angle of arrival (AOA) | The direction the pulse came from | Where the emitter is; it changes slowly, so it is the best single parameter for sorting pulses |

Many receivers add more fields, such as intrapulse modulation (a frequency chirp or a phase code inside the pulse) and polarisation. Locating an emitter from several receivers' AOA or TOA measurements is covered in [radio direction finding and TDOA](/learn/applications/direction-finding/).

## What is pulse repetition interval (PRI)?

The **pulse repetition interval** (PRI) is the time from the start of one pulse to the start of the next. Its reciprocal is the **pulse repetition frequency** (PRF): PRF = 1 / PRI. A PRI of 1,000 µs is a PRF of 1,000 pulses a second, or 1 kHz.

The PRI matters to a radar designer because the radar has to wait for each echo before it sends the next pulse. An echo that returns later than one PRI is mixed up with the next pulse's echoes. So the PRI sets the **maximum unambiguous range**:

R<sub>max</sub> = c × PRI / 2

where c is the speed of light, and the 2 is there because the pulse travels out and back. [How a radar measures range](/learn/applications/radar-display/) works the same way, one echo at a time.

### Worked example

A radar with a PRI of 1,000 µs:

- PRF = 1 / 0.001 s = 1,000 Hz.
- R<sub>max</sub> = 300,000 km/s × 0.001 s / 2 = 150 km.
- A strong target at 180 km returns its echo 1,200 µs after its pulse, which is 200 µs after the next pulse. The radar shows it at 30 km, a "second-time-around" echo.
- With a pulse width of 1.2 µs, the duty cycle (the fraction of time spent transmitting) is 1.2 / 1,000 = 0.12%.

A low PRF gives long unambiguous range but measures Doppler speed ambiguously; a high PRF does the reverse. No single PRF does both well, which is why so many radars vary their PRI. To an ELINT analyst the PRI works like a fingerprint. It limits how far the radar can usefully see, and its pattern shows how the radar handles ambiguity.

## PRI types and how they look on a chart

Radars use a handful of PRI patterns. Plot the PRI of each pulse against the pulse number, or the time differences between pulses in a histogram, and each type has its own look.

![Diagram of five PRI types. For each, a pulse train on a time line on the left and a plot of PRI against pulse number on the right. Constant: evenly spaced pulses and a flat line of dots. Staggered: a three-step cycle of intervals that repeats. Jittered: uneven spacing, dots scattered about a mean. Sliding: intervals growing steadily on a ramp, then starting again. Dwell-and-switch: one interval held for several pulses, then a jump to another](./pri-types.svg)

| PRI type | Pattern | On a PRI histogram | Why a radar uses it |
|---|---|---|---|
| Constant (stable) | The same interval every pulse | One sharp peak at the PRI, with smaller peaks at 2×, 3×… | Simple, and suits coherent Doppler processing |
| Staggered | A short cycle of 2 to about 8 intervals, repeating | One peak per interval, plus a peak at the frame (the sum of one cycle) | Moves the blind speeds of moving-target filters |
| Jittered | Random variation about a mean, often a few percent to 10% or more | A broad, low hump instead of a spike | Makes the pulse timing harder to predict |
| Sliding | The interval ramps steadily up or down, then starts again | A smear between the lowest and highest PRI | Moves blind ranges about, so no range is always blind |
| Dwell-and-switch | Holds one PRI for a burst of pulses (a dwell), then switches | A sharp peak for each PRI | Pulse-Doppler radars combine several PRFs to resolve range and speed ambiguity |

A staggered and a dwell-and-switch PRI can give the same histogram. To tell them apart, look at the order: a stagger changes interval on every pulse, while a dwell holds each interval for tens of pulses.

## How deinterleaving works

An ELINT receiver doesn't hear one radar at a time. Pulses from every radar in view arrive mixed in one stream, sorted only by time. **Deinterleaving** (also called pulse sorting) separates them back into one pulse train per emitter. It usually runs in two stages.

1. **Cluster on the parameters that don't change from pulse to pulse.** Angle of arrival comes first, because an emitter can't move its direction quickly. Frequency and pulse width come next. Pulses that land close together in angle, frequency and width probably come from the same radar.
2. **Find the PRI inside each cluster.** Take the time differences between pulses (difference of TOA) and count them in a histogram. Pulses from one emitter keep producing the same differences, so its PRI and multiples of it build up into peaks. Pairs of pulses from different emitters give random differences, which spread out into a flat floor.

Two classic methods keep the work down. The cumulative difference histogram (CDIF, Mardia 1989) counts the first-order differences (each pulse to the next), then adds the second-order ones (each pulse to the one after next), and so on, checking after each order whether a peak clears a threshold. The sequential difference histogram (SDIF, Milojević and Popović 1992) uses each order on its own, with a threshold that falls as the time difference grows. Once a candidate PRI is found, a **sequence search** steps through the stream from a pulse, looks for the next pulse one PRI later within a tolerance, and pulls out every pulse that fits. What's left goes round again.

A small example with two emitters, X with a constant PRI of 1,000 µs and Y with 1,300 µs:

| Difference of TOA | Comes from | Height on the histogram |
|---|---|---|
| 1,000 µs | X to the next X pulse | Tall: every X pulse adds one |
| 1,300 µs | Y to the next Y pulse | Tall |
| 2,000 µs, 3,000 µs | X to the X pulse two or three later | Tall: harmonics of X's PRI |
| 2,600 µs | Y to the Y pulse two later | Tall: harmonic of Y's PRI |
| Everything else | An X pulse paired with a Y pulse | Low and flat: X and Y aren't synchronised |

After the PRI search, the analyst has each emitter's PDW statistics and PRI pattern, which go into an emitter report and, over time, into the library that electronic support systems match against.

## Reading scan patterns from amplitude

Most surveillance radars turn their antenna, so their beam sweeps past the receiver once a turn. Plot pulse amplitude against time and the beam shows as a spike, with the weaker sidelobes in between. The **scan period** is the time between spikes, and the time the beam stays within 3 dB of its peak gives the beamwidth:

beamwidth ≈ 360° × (time within 3 dB) / (scan period)

For a circular scan with a period of 4 s, a 3 dB illumination of 56 ms means a beam about 360 × 0.056 / 4 = 5.0° wide.

| Amplitude over time | Scan type it suggests |
|---|---|
| Regular spikes, evenly spaced | Circular scan: the period is one turn |
| Spikes in pairs, or back-and-forth spacing | Sector scan: the beam sweeps to and fro over part of the circle |
| Steady amplitude with a small, fast ripple | Conical scan: the beam circles a little round a fixed direction |
| Steady amplitude, no pattern | The beam isn't moving relative to the receiver, or it is steered electronically |

A weak or distant radar may be heard only when its main beam passes, so its pulses arrive in bursts with silence in between. That breaks up the pulse train and makes its PRI harder to find in a mixed stream.

## Civil radars: the same physics

Nothing about pulse analysis is special to defence. Weather radars, air traffic control radars and ships' navigation radars are pulse radars with PRIs, pulse widths and scan periods, and the same charts describe them. Many [weather radars](/learn/applications/weather-radar/) switch between two PRFs to stretch the speed they can measure without ambiguity, the same trade-off as above. Radar engineers use the same measurements to test their own transmitters, and spectrum regulators use them to check that radars stay within their licensed frequencies and emissions; the [RF spectrum analyzer and waterfall display](/learn/applications/rf-spectrum-analyzer/) guide covers that side. The antenna's beam and sidelobes, which shape the amplitude-over-time chart, are explained in the [antenna radiation pattern](/learn/applications/antenna-radiation-pattern/) guide.

## How to build an ELINT pulse display in JavaScript, React or Angular

An ELINT display has to draw tens of thousands of pulses as single points and keep up with a stream that never stops. The demo below simulates four generic radars, mixed into one pulse stream of about 3,000 pulses a second: one with a constant PRI, one staggered, one jittered and one dwell-and-switch, three of them scanning. SciChart.js draws each chart's pulses as scatter points, appended in batches to data series with `fifoCapacity`, and the PRI histogram as columns. Emitter numbers are given in the order the deinterleaver finds them, and every parameter is made up for teaching.

Hover over a pulse to read its full PDW, or over the histogram to read a time difference and, with **Deinterleave** on, which emitter's PRI or harmonic it is. Untick **Deinterleave** to see the pulses as the receiver hears them, mixed in one colour. **Pause** the stream to zoom in with the mouse wheel: a few milliseconds of time of arrival show the individual pulses and their spacing.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="ELINT pulse display" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />

In the mixed histogram, the tallest bar is at 3,000 µs, where emitter 1's third harmonic (3 × 1,000 µs) lands on the same bin as emitter 3's (5 × 600 and 4 × 750 µs). Emitter 4, the weak staggered radar heard only in bursts, is lost in the floor of the mixed histogram but clear in its own, with peaks at 700, 800 and 900 µs and at its 2,400 µs frame. And emitter 2's jittered PRI is a low hump around 1,300 µs rather than a spike.

Here is the code for this chart. The pulse simulation and the deinterleaver are plain JavaScript. SciChart.js draws the four charts.

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
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    const WINDOW_S = 10; // seconds of pulses on screen

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Time of arrival (s)", autoRange: EAutoRange.Never });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Frequency (GHz)", visibleRange: new NumberRange(9.1, 9.7), autoRange: EAutoRange.Never })
        );
        // One point per pulse; fifoCapacity keeps the newest pulses and drops the oldest
        const pulses = new XyDataSeries(wasmContext, { fifoCapacity: 40000, isSorted: true, containsNaN: false });
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: pulses,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 3, height: 3, strokeThickness: 0, fill: "#50C7E0" })
            })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

        // Each frame, append the PDWs received since the last one in a single batch, then scroll
        const animate = () => {
            if (sciChartSurface.isDeleted) return;
            const { toa, rf, newest } = getYourNewPulses(); // Float64Arrays from your receiver's PDW stream
            if (toa.length > 0) pulses.appendRange(toa, rf);
            xAxis.visibleRange = new NumberRange(newest - WINDOW_S, newest);
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        return { sciChartSurface };
    };

    export const ElintPulseDisplay = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    const WINDOW_S = 10; // seconds of pulses on screen

    @Component({
        selector: "app-elint-pulse-display",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class ElintPulseDisplayComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            const xAxis = new NumericAxis(wasmContext, { axisTitle: "Time of arrival (s)", autoRange: EAutoRange.Never });
            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { axisTitle: "Frequency (GHz)", visibleRange: new NumberRange(9.1, 9.7), autoRange: EAutoRange.Never })
            );
            // One point per pulse; fifoCapacity keeps the newest pulses and drops the oldest
            const pulses = new XyDataSeries(wasmContext, { fifoCapacity: 40000, isSorted: true, containsNaN: false });
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: pulses,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 3, height: 3, strokeThickness: 0, fill: "#50C7E0" })
                })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

            // Each frame, append the PDWs received since the last one in a single batch, then scroll
            const animate = () => {
                if (sciChartSurface.isDeleted) return;
                const { toa, rf, newest } = getYourNewPulses(); // Float64Arrays from your receiver's PDW stream
                if (toa.length > 0) pulses.appendRange(toa, rf);
                xAxis.visibleRange = new NumberRange(newest - WINDOW_S, newest);
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each chart is a `SciChartSurface` with `XyScatterRenderableSeries` and a small `EllipsePointMarker`, one series per recovered emitter, so turning deinterleaving on or off only changes each point marker's `fill` and `stroke`.
- Every `XyDataSeries` has `fifoCapacity`, so it acts as a circular buffer: new pulses go in with one `appendRange` of `Float64Array`s per series per frame, and the oldest drop out, so memory stays flat however long the stream runs.
- The PRI histogram is a `FastColumnRenderableSeries` with `dataPointWidthMode: EDataPointWidthMode.Range`, so each column is exactly one 10 µs bin wide. It is redrawn ten times a second rather than every frame, because 400 bins don't change visibly faster than that.
- `SciChartVerticalGroup` lines up the y-axes of the two time charts so their time axes match, and a custom chart modifier finds the pulse nearest the mouse for the PDW readout.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart).

**Go deeper:** [SciChart.js scatter chart documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), the [column chart documentation](/2d-charts/chart-types/fast-column-renderable-series/column-series-type/) for the histogram, and [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/) for `fifoCapacity`. For the signal processing behind ELINT receivers, see the [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/) and [autocorrelation](/learn/applications/signal-processing/autocorrelation/) guides; autocorrelation of a pulse train finds its PRI in the same way the histogram does. For how aerospace and defence software uses SciChart, see [SciChart for aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Common mistakes in pulse analysis

- **Reading a harmonic as a new emitter.** A difference histogram has peaks at 2×, 3× and more times every PRI. A peak at 2,000 µs next to one at 1,000 µs is usually the same radar. Check whether a peak is a multiple of a smaller one before calling it a PRI; the PRI transform (Nishiguchi and Kobayashi 2000) was designed to suppress these multiples.
- **Missing the PRI because of missed pulses.** If the receiver misses one pulse in a train, the first-order difference that spans it is 2 × PRI. With many missed pulses, as in a radar heard only through its sidelobes, the true PRI peak can be smaller than its harmonics.
- **Choosing bins too wide or too narrow.** Wide bins merge stagger positions that are close together. Narrow bins split a jittered PRI into a flat spread that never clears the threshold.
- **Calling a stagger's frame a separate PRI.** The peak at the sum of a stagger cycle (2,400 µs for 700, 800 and 900 µs) belongs to the same emitter.
- **Ignoring coincident harmonics.** Two radars whose PRIs share a common multiple, such as 1,000 µs and 600 µs at 3,000 µs, stack their harmonics in one bin. A tall bar isn't always one emitter.
- **A histogram window shorter than the PRI.** If the histogram stops at 4,000 µs, a radar with a 5,000 µs PRI appears only as cross-terms. Set the window from the longest PRI you expect to meet.
- **Clustering on frequency alone.** Two radars on nearly the same frequency look like one band on a TOA vs frequency chart. Pulse width or angle of arrival usually splits them; in the demo, emitters 1 and 3 are only 40 MHz apart.
- **Putting the PRF into the range formula.** R = c × PRI / 2 needs the PRI in seconds. For a PRF of 1 kHz, convert first: PRI = 1 / 1,000 Hz = 0.001 s, which gives 150 km.

## Frequently asked questions

### What is ELINT?

ELINT, or electronic intelligence, is intelligence gathered from electronic signals that don't carry messages, mainly radar. A passive receiver measures each radar pulse it hears, and analysts use those measurements to work out what kind of radar sent them, how it pulses and how its antenna scans.

### What is the difference between ELINT and SIGINT?

SIGINT, signals intelligence, is the whole field of intelligence from intercepted signals. ELINT is one branch of it, covering non-communications signals such as radar. COMINT, the other main branch, covers communications such as voice and data, and FISINT covers instrumentation signals such as telemetry.

### What is pulse repetition interval in radar?

The pulse repetition interval (PRI) is the time from the start of one radar pulse to the start of the next. Its reciprocal is the pulse repetition frequency (PRF): a PRI of 1,000 microseconds is a PRF of 1,000 pulses per second. The PRI sets how far the radar can measure range without ambiguity.

### How do you calculate maximum unambiguous range from PRI?

Multiply the PRI by the speed of light and divide by two, because the pulse travels out and back: R = c × PRI / 2. A PRI of 1,000 microseconds gives 300,000 km/s × 0.001 s / 2 = 150 km. An echo from further away arrives after the next pulse has gone out, and the radar places it at the wrong, shorter range.

### What is a staggered PRI?

A staggered PRI cycles through a short, fixed sequence of intervals, such as 700, 800 and 900 microseconds, and then repeats. Radars use stagger to move the blind speeds of their moving-target filters. On a difference-of-time-of-arrival histogram, a stagger shows one peak per interval, plus a peak at the sum of the cycle, called the frame.

### How do I make an ELINT pulse display in JavaScript?

Plot each pulse descriptor word as a point on scatter charts: time of arrival against frequency, and pulse width against frequency. Use XyDataSeries with fifoCapacity so old pulses drop off, and append new pulses in batches with appendRange. Draw the PRI histogram as a column series. SciChart.js does this in plain JavaScript, React or Angular.

## Sources

- Wiley, R. G. (2006), *ELINT: The Interception and Analysis of Radar Signals*, Artech House, ISBN 978-1-58053-925-8. Pulse descriptor words, PRI types, scan analysis and pulse sorting.
- Skolnik, M. I. (2001), *Introduction to Radar Systems*, 3rd edition, McGraw-Hill. PRF, maximum unambiguous range, and staggered PRF against blind speeds.
- Mardia, H. K. (1989), [New techniques for the deinterleaving of repetitive sequences](https://doi.org/10.1049/ip-f-2.1989.0025), *IEE Proceedings F*, 136(4), 149–154; Milojević, D. J. and Popović, B. M. (1992), [Improved algorithm for the deinterleaving of radar pulses](https://doi.org/10.1049/ip-f-2.1992.0012), *IEE Proceedings F*, 139(1), 98–104. The CDIF and SDIF histograms.
- Nishiguchi, K. and Kobayashi, M. (2000), [Improved algorithm for estimating pulse repetition intervals](https://doi.org/10.1109/7.845217), *IEEE Transactions on Aerospace and Electronic Systems*, 36(2), 407–421. The PRI transform, which suppresses peaks at multiples of the PRI.
- US Army, [FM 34-60, *Counterintelligence*, glossary](https://irp.fas.org/doddir/army/fm34-60/fm34-60g.htm). Definitions of SIGINT, COMINT and ELINT.

<LearnCta position="bottom" chart="ELINT pulse display" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />
