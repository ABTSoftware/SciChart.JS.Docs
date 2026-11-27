---
sidebar_position: 240
sidebar_label: SIGINT
title: "What Is SIGINT? Signals Intelligence and How to Read a SIGINT Dashboard"
description: "What SIGINT (signals intelligence) is: COMINT, ELINT and FISINT, how it relates to electronic warfare, and how to read a SIGINT dashboard, with a live example."
keywords:
    [
        "sigint",
        "signals intelligence",
        "what is sigint",
        "comint",
        "communications intelligence",
        "fisint",
        "electronic warfare",
        "electronic support measures",
        "sigint vs elint",
        "sigint vs comint",
        "sigint dashboard",
        "how to read a sigint display"
    ]
image: /img/learn/sigint-og.png
related: [rf-spectrum-analyzer, elint, direction-finding, iq-constellation-diagram]
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
                    "name": "What does SIGINT stand for?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "SIGINT stands for signals intelligence: intelligence gathered by intercepting and analysing electronic signals. It has three branches: communications intelligence (COMINT), electronic intelligence (ELINT) from non-communications emitters such as radar, and foreign instrumentation signals intelligence (FISINT) from signals such as telemetry."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between SIGINT and COMINT?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "COMINT (communications intelligence) is one branch of SIGINT. It covers signals that carry messages between people or machines, such as voice, text and data links. SIGINT is the wider term: it also includes ELINT, from radars and other emitters that carry no message, and FISINT, from telemetry and similar instrumentation signals."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between SIGINT and ELINT?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "ELINT (electronic intelligence) is the branch of SIGINT that studies non-communications emitters, mainly radars. It measures parameters such as frequency, pulse width, pulse repetition interval and scan pattern. SIGINT is the umbrella term that covers ELINT, COMINT and FISINT."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is electronic warfare?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Electronic warfare (EW) is military action that uses electromagnetic energy to control the radio spectrum or to attack an opponent. It has three parts: electronic support (ES), which detects and locates emitters; electronic attack (EA), such as jamming; and electronic protection (EP), which keeps friendly systems working under attack. Recent US doctrine calls it electromagnetic warfare."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is SIGINT legal?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "SIGINT is carried out by government agencies under specific laws, warrants and oversight. For anyone else, intercepting other people's communications without authority is an offence in most countries, and the international Radio Regulations require governments to prevent it. Measuring the radio spectrum, such as signal levels, occupancy and interference, is routine engineering work for regulators, operators and radio astronomers."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a SIGINT dashboard in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Compute a power spectrum from each block of receiver samples with an FFT. Draw the newest spectrum as a line chart, and add it as the top row of a heatmap to make the waterfall, sharing one frequency axis. Run a threshold detector on each spectrum, group detections into emitters, and show them in a table, a polar bearing plot and a timeline. With SciChart.js, use a FastLineRenderableSeries, a UniformHeatmapRenderableSeries, polar series and a FastRectangleRenderableSeries."
                    }
                }
            ]
        })}
    </script>
</head>

# SIGINT

## What is SIGINT?

**SIGINT** (signals intelligence) is intelligence gathered by intercepting and analysing electronic signals. It has three branches: communications between people (COMINT), non-communications emitters such as radar (ELINT), and instrumentation signals such as telemetry (FISINT). It is passive: a SIGINT system only listens, and in most countries only authorised government agencies may do it.

![A simulated SIGINT dashboard in a dark navy theme: a live spectrum with a max-hold trace, labelled emitters and a dashed detection threshold; below it a waterfall with a solid wideband stripe, steady carrier lines, the regular blips of a scanning pulsed emitter and the scattered dashes of a frequency hopper inside an orange selection box; an activity timeline of when each emitter was on; an emitter list table; and a compass-style direction-finding plot with an orange bearing spike for the selected hopper](/img/learn/sigint-og.png)

*A simulated SIGINT dashboard: spectrum, waterfall, activity timeline, emitter list and direction finding, all from one synthetic radio scene. [Try the interactive version](#how-to-build-a-sigint-dashboard-in-javascript-react-or-angular).*

:::tip Key takeaways
- SIGINT is intelligence from signals. It splits into COMINT (communications), ELINT (radars and other emitters) and FISINT (telemetry and other instrumentation signals).
- Much of the value comes from the signal's externals: its frequency, bandwidth, timing and direction, even when the content can't be read.
- The processing chain runs antenna, receiver, IQ samples, FFT, detection, measurement, direction finding, then classification and logging.
- A SIGINT dashboard links five views: spectrum, waterfall, emitter list, direction-finding bearings and an activity timeline.
- The same techniques are used openly by spectrum regulators, radio astronomers and search and rescue services.
:::

## Types of SIGINT: COMINT, ELINT and FISINT

US doctrine defines SIGINT as COMINT, ELINT and FISINT, together or separately, however the signals are sent. Each branch looks at different signals and asks different questions.

| Branch | Stands for | Signals | What analysts want to know |
| --- | --- | --- | --- |
| COMINT | Communications intelligence | Voice, text, data links, networks: anything carrying a message | Who is talking to whom, when, from where, and, if it can be read, what is said |
| ELINT | Electronic intelligence | Radars, navigation aids and other emitters that send no message | What the emitter is, from its frequency, pulse and scan parameters, and where it is |
| FISINT | Foreign instrumentation signals intelligence | Telemetry, tracking and video links from missiles, rockets, aircraft and other systems under test | How the system being tested performs, from the measurements it sends home |

ELINT has its own guide, [ELINT: radar pulse analysis and PRI](/learn/applications/elint/). FISINT is the intelligence counterpart of the measurement links described in the [telemetry](/learn/applications/telemetry/) guide.

### What is COMINT?

**COMINT** (communications intelligence) is the branch of SIGINT that intercepts communications meant for someone else. Much modern traffic is encrypted, so COMINT relies heavily on **externals**, the facts about a transmission that encryption doesn't hide: frequency, time, duration, bandwidth, modulation and direction. Studying the pattern of who transmits, when and how often, without reading the content, is called **traffic analysis**. Where content can be recovered, decrypting it is the separate field of cryptanalysis.

## SIGINT vs other intelligence disciplines

Intelligence agencies group their collection into a few disciplines, named by source. SIGINT is the one that works from signals.

| Discipline | Source |
| --- | --- |
| SIGINT (signals intelligence) | Intercepted electronic signals: communications, radars, telemetry |
| HUMINT (human intelligence) | People: interviews, informants, diplomats' reporting |
| IMINT and GEOINT (imagery and geospatial intelligence) | Satellite and aerial images, maps and location data |
| MASINT (measurement and signature intelligence) | Technical signatures other than imagery and SIGINT, such as acoustic, seismic, nuclear or unintended radio emissions |
| OSINT (open-source intelligence) | Public information: media, publications, websites, commercial data |

SIGINT and MASINT overlap at the edges. Reading what a signal says or does is SIGINT; measuring a signal's unintended physical traits, for example to fingerprint one particular transmitter, is sometimes counted as MASINT instead.

## How SIGINT works: from antenna to emitter list

Every SIGINT system, from a laboratory spectrum monitor to a national network, follows the same chain. Each stage passes less data to the next: millions of samples a second go in, and a short list of emitters comes out.

![The SIGINT processing chain in eight stages: antenna, receiver, digitiser producing IQ samples, FFT producing the spectrum and waterfall, detection against a threshold, measurement of frequency, bandwidth and timing, direction finding, then classification and logging into the emitter list and timeline](./sigint-processing-chain.svg)

1. Antenna. Picks up every signal in its frequency range. Wideband antennas cover many bands; directional or multi-element antennas also give direction.
2. Receiver. Tunes to a band, filters out everything else and amplifies what's left.
3. Digitiser. Samples the band as **IQ data**, pairs of in-phase and quadrature values that keep both the amplitude and the phase of the signal. See [IQ data and constellation diagrams](/learn/applications/iq-constellation-diagram/).
4. FFT. A [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/) turns each block of samples into a spectrum: power in each frequency bin. Stacking the spectra over time gives the waterfall. The [RF spectrum analyzer and waterfall display](/learn/applications/rf-spectrum-analyzer/) guide covers resolution bandwidth, averaging and colour scales in detail.
5. Detect. Mark the bins that rise a set amount above the noise floor. The threshold trades missed weak signals against false alarms from noise; the [signal-to-noise ratio](/learn/applications/signal-processing/signal-to-noise-ratio/) sets what can be found.
6. Measure. For each detection, measure its centre frequency, bandwidth, level, and when it starts and stops. For pulsed emitters, ELINT adds pulse width, pulse repetition interval and scan period.
7. Direction-find. Measure the bearing the signal arrives from, by comparing what several antennas receive. Bearings from two or more stations cross at the transmitter. See [radio direction finding and TDOA](/learn/applications/direction-finding/).
8. Classify and log. Group detections into emitters, guess what each is from its behaviour, and record everything with a time stamp for analysts.

## Electronic warfare and SIGINT

**Electronic warfare** (EW) is military action that uses electromagnetic energy to control the radio spectrum or to attack an opponent. Recent US joint doctrine calls it electromagnetic warfare; NATO and most textbooks still say electronic warfare. It has three parts.

| Part | Older name | What it does |
| --- | --- | --- |
| Electronic support (ES) | Electronic support measures (ESM) | Searches for, intercepts, identifies and locates emitters, for immediate use: threat warning, avoiding or targeting threats |
| Electronic attack (EA) | Electronic countermeasures (ECM) | Uses electromagnetic energy against an opponent's systems, for example jamming a radar or a radio link |
| Electronic protection (EP) | Electronic counter-countermeasures (ECCM) | Keeps friendly systems working despite attack and interference, for example by frequency hopping or emission control |

### SIGINT vs ESM

Electronic support and SIGINT use the same receivers, the same displays and often the same people. The difference is purpose and timescale.

| | SIGINT | Electronic support (ESM) |
| --- | --- | --- |
| Who tasks it | Intelligence agencies | An operational commander |
| Purpose | Build long-term knowledge: what emitters exist, where, and how they behave | Act now: warn of a threat, avoid it, jam it or target it |
| Timescale | Days to years | Seconds to minutes |
| Output | Intelligence reports and databases, such as an electronic order of battle | Alerts on a display, a radar warning receiver tone, a track on a tactical picture |

The two feed each other. SIGINT builds the libraries of known emitter parameters, and ES systems compare what they hear against those libraries in real time.

## A short history of SIGINT

Signals intelligence is as old as radio. In the First World War, the British Admiralty's Room 40 decrypted German naval and diplomatic messages, including the Zimmermann telegram of 1917. Both sides also used direction finding to plot the positions of ships and units from their transmissions.

In the Second World War, codebreakers at Bletchley Park in Britain read messages enciphered on the German Enigma and Lorenz machines, producing intelligence codenamed Ultra; the Colossus computers built for the Lorenz work were among the first electronic computers. At sea, high-frequency direction finding ("huff-duff") on shore stations and escort ships took bearings on U-boat radio transmissions, so convoys could be routed away from submarines and escorts could hunt them. Radar arrived in the same war, and with it the first ELINT: aircraft fitted with receivers to find and measure enemy radars.

## Is SIGINT legal?

SIGINT is carried out by government agencies under specific laws, warrants and oversight bodies, which set what they may collect and on whom. For anyone else, intercepting communications not meant for you is an offence in most countries, and the international Radio Regulations, which almost every country has signed, require governments to prevent the unauthorised interception of radio communications and the disclosure of what was intercepted. Measuring the spectrum itself, such as signal levels, occupancy, interference and direction, without decoding anyone's messages, is everyday engineering for regulators, network operators and scientists.

## Civil uses of SIGINT techniques

The receivers, spectrum and waterfall displays, detectors and direction finders of SIGINT are also everyday civil tools:

- Spectrum regulators. National regulators run fixed and mobile monitoring stations to check that licensed transmitters stay in their channels, measure how busy each band is, and direction-find the source of harmful interference, such as a faulty transmitter blocking an airport or mobile network.
- Spectrum monitoring and planning. Network operators and event organisers scan bands for clear channels and for interference before they deploy.
- Radio astronomy. Observatories monitor radio frequency interference (RFI) around their telescopes, flag and remove polluted data, and locate interfering sources.
- Search and rescue. Satellites in the international Cospas-Sarsat system detect distress beacons from ships, aircraft and walkers, measure them and locate them, so rescuers know where to go.
- Engineering and test. Electromagnetic compatibility (EMC) labs and radio developers use the same displays to find unwanted emissions from their own products.

## How to read a SIGINT dashboard

A SIGINT dashboard puts the stages of the processing chain side by side, linked by one selected emitter. Read it in this order.

1. Start with the spectrum. It shows power against frequency right now. The flat, grassy floor is receiver noise; anything standing clear of it is a signal. Note the dashed detection threshold, and compare the live trace with the max-hold trace, which keeps the highest level each bin has reached since it was reset. A max-hold block with no live signal under it is a signal that comes and goes, or one that moves.
2. Read the waterfall for behaviour over time. Frequency runs across and time runs down, newest at the top, with colour for power. A steady signal draws a vertical line, a burst draws a dash, a hopper scatters dashes across a band, and a periodic emitter draws evenly spaced blips. Check the colour scale before judging strength.
3. Check the emitter list. Each row is one emitter the detector and tracker have found, with its centre frequency, bandwidth, a type guess, its bearing, and when it was first and last seen. Treat the type as a starting point: it comes from behaviour alone.
4. Look at the direction-finding plot. The selected emitter's bearings, measured many times, form a spike on a compass rose. A narrow spike means a consistent bearing; a wide one means a weak signal, reflections or two transmitters on one frequency. One station gives a line of bearing, not a position: it takes bearings from two or more stations, crossing, to fix a location.
5. Read the timeline for patterns. Each emitter has a row, with a bar for every time it was on. Look for regular schedules, emitters that always transmit together or in turn, and new emitters appearing. This is traffic analysis in its simplest form.
6. Put it together. An emitter is a set of consistent clues: one frequency or band, one bearing, one behaviour. If two of the three change at once, it is probably a different emitter.

### What different emitters look like

| Emitter | Spectrum | Waterfall | Timeline |
| --- | --- | --- | --- |
| Continuous carrier | A narrow, steady peak | An unbroken vertical line | One solid bar |
| Push-to-talk (burst) | A narrow peak that comes and goes | A dashed vertical line, dashes seconds long | Separate bars, irregular gaps |
| Frequency hopper | A narrow peak that jumps; max hold fills a flat band | Short dashes scattered across a band | One solid bar, once the hops are grouped by bearing |
| Scanning pulsed emitter (radar-like) | A wide hump with side lobes, appearing briefly | Wide blips at a regular spacing: the scan period | Short bars at even intervals |
| Wideband data signal | A flat-topped block | A wide, solid stripe | One solid bar |
| Weak signal near the noise | Barely above the floor, flickering across the threshold | A faint line | A broken bar |

## Common mistakes when reading a SIGINT display

- **Counting every peak as a separate emitter.** Side lobes of a pulsed signal, harmonics, mixing products between strong signals and spurious signals made inside your own receiver all look like extra emitters. Check whether they share a bearing and switch on and off together.
- **Setting the threshold by eye once.** The noise floor changes with the band, the antenna and the time of day. A fixed threshold too low floods the list with noise; too high, it misses weak emitters. Set it relative to a measured noise floor.
- **Reading max hold as the present.** Max hold shows the highest level ever reached since it was reset, not what is on the air now.
- **Treating a bearing as a position.** One bearing is a line. Reflections from buildings and terrain can also bend it, so confirm with a second station.
- **Splitting one hopper into many emitters.** A frequency hopper looks like dozens of short, unrelated signals. Group detections by bearing, bandwidth and timing before counting emitters.
- **Choosing the wrong resolution.** Wide FFT bins merge close signals and bury weak ones in noise; very narrow bins update slowly and smear short bursts. See [window functions](/learn/applications/signal-processing/window-functions/) and the [power spectral density](/learn/applications/signal-processing/power-spectral-density/) guide.
- **Trusting the type guess.** Automatic classification is a hint, not an identification. Two very different transmitters can share a bandwidth and a duty cycle.

## How to build a SIGINT dashboard in JavaScript, React or Angular

A SIGINT dashboard asks a lot of a charting library, with a waterfall of thousands of frequency bins scrolling many times a second and several linked views updating at once. SciChart.js draws all of them with WebGL, so the views stay smooth together. The example below simulates one wideband receiver watching a 20 MHz span, with six generic emitters: a steady carrier, a push-to-talk transmitter, a frequency hopper, a scanning pulsed emitter, a wideband data signal and a weak carrier near the noise. The spectrum has 4,096 bins and the waterfall holds the last 200 spectra, 10 seconds at 20 spectra a second. A threshold detector and a simple tracker build the emitter list from the spectra and simulated DF bearings alone.

All the data is simulated: frequencies are offsets from an unnamed tuned centre, and no real systems are modelled. Hover over the spectrum, waterfall or timeline for values. Click a signal, a timeline row or a list row to select an emitter and highlight it in every view. Scroll to zoom the frequency axis, drag to pan, double-click to reset, and use **Pause** and **Reset max hold**.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="SIGINT dashboard" demo="audio-analyzer-fft-example" demoLabel="audio analyzer" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />

Here is the code for this example. The receiver simulation, detector and tracker are plain JavaScript; SciChart.js draws the spectrum, the waterfall, the timeline and the direction-finding plot. The React and Angular versions below draw a spectrum waterfall from your own data.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        EAxisAlignment,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // A waterfall: one spectrum per row (power in dB per frequency bin), newest row first
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // rows[0] is the newest spectrum; startMHz and binMHz place the bins, rowSeconds is the time per row
        const { rows, startMHz, binMHz, rowSeconds } = await getYourSpectra();

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (MHz)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Seconds ago",
                axisAlignment: EAxisAlignment.Left,
                flippedCoordinates: true // newest at the top
            })
        );
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, {
                    xStart: startMHz,
                    xStep: binMHz,
                    yStart: 0,
                    yStep: rowSeconds,
                    zValues: rows
                }),
                colorMap: new HeatmapColorMap({
                    minimum: -100,
                    maximum: -50,
                    gradientStops: [
                        { offset: 0, color: "#0B1533" },
                        { offset: 0.4, color: "#1FA3B8" },
                        { offset: 0.8, color: "#F2D24B" },
                        { offset: 1, color: "#FFF4E6" }
                    ]
                })
            })
        );
        sciChartSurface.chartModifiers.add(
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    // SciChartReact creates the chart, sizes it to its parent and cleans it up
    export const Waterfall = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        EAxisAlignment,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // A waterfall: one spectrum per row (power in dB per frequency bin), newest row first
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // rows[0] is the newest spectrum; startMHz and binMHz place the bins, rowSeconds is the time per row
        const { rows, startMHz, binMHz, rowSeconds } = await getYourSpectra();

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (MHz)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Seconds ago",
                axisAlignment: EAxisAlignment.Left,
                flippedCoordinates: true // newest at the top
            })
        );
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, {
                    xStart: startMHz,
                    xStep: binMHz,
                    yStart: 0,
                    yStep: rowSeconds,
                    zValues: rows
                }),
                colorMap: new HeatmapColorMap({
                    minimum: -100,
                    maximum: -50,
                    gradientStops: [
                        { offset: 0, color: "#0B1533" },
                        { offset: 0.4, color: "#1FA3B8" },
                        { offset: 0.8, color: "#F2D24B" },
                        { offset: 1, color: "#FFF4E6" }
                    ]
                })
            })
        );
        sciChartSurface.chartModifiers.add(
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    @Component({
        selector: "app-waterfall",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class WaterfallComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- The waterfall is a `UniformHeatmapRenderableSeries` with a flipped y-axis, so the newest row is at the top. Each new spectrum reuses the oldest row's `Float64Array`, moves to the front, and the grid is sent with one `setZValues` call, at most 20 times a second.
- The spectrum's live and max-hold traces are `FastLineRenderableSeries`, refilled with `appendRange` from typed arrays. The spectrum and waterfall frequency axes follow each other's `visibleRangeChanged`, and a `SciChartVerticalGroup` lines up the left axes of the stacked charts.
- The activity timeline is a `FastRectangleRenderableSeries` with an `XyxyDataSeries`: each bar runs from start time to stop time on the emitter's row. The selected emitter's bars are a second series in the highlight colour.
- The direction-finding plot is a `SciChartPolarSurface` with a compass-style angular axis, a `PolarColumnRenderableSeries` histogram of bearing cuts, and a `PolarXyScatterRenderableSeries` for the other emitters. A `CustomChartModifier2D` turns mouse positions into frequency and time for the readouts and for click-to-select.

**See it in the demo app:** [JavaScript audio analyzer](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio analyzer](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio analyzer](https://www.scichart.com/demo/angular/audio-analyzer-fft-example). Related techniques: the [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) and [React polar line chart](https://www.scichart.com/demo/react/polar-line-chart).

**Go deeper:** [SciChart.js heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), and the learning center guides to the [spectrogram](/learn/chart-types/cartesian/spectrogram/), the [audio spectrum analyzer](/learn/applications/signal-processing/audio-spectrum-analyzer/), [radar displays](/learn/applications/radar-display/), which show what an active radar sees rather than what a passive receiver hears, and [sonar](/learn/applications/sonar/), whose passive bearing-time waterfall is the underwater cousin of the DF timeline. For the industry, see SciChart for [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What does SIGINT stand for?

SIGINT stands for signals intelligence: intelligence gathered by intercepting and analysing electronic signals. It has three branches: communications intelligence (COMINT), electronic intelligence (ELINT) from non-communications emitters such as radar, and foreign instrumentation signals intelligence (FISINT) from signals such as telemetry.

### What is the difference between SIGINT and COMINT?

COMINT (communications intelligence) is one branch of SIGINT. It covers signals that carry messages between people or machines, such as voice, text and data links. SIGINT is the wider term: it also includes ELINT, from radars and other emitters that carry no message, and FISINT, from telemetry and similar instrumentation signals.

### What is the difference between SIGINT and ELINT?

ELINT (electronic intelligence) is the branch of SIGINT that studies non-communications emitters, mainly radars. It measures parameters such as frequency, pulse width, pulse repetition interval and scan pattern. SIGINT is the umbrella term that covers ELINT, COMINT and FISINT.

### What is electronic warfare?

Electronic warfare (EW) is military action that uses electromagnetic energy to control the radio spectrum or to attack an opponent. It has three parts: electronic support (ES), which detects and locates emitters; electronic attack (EA), such as jamming; and electronic protection (EP), which keeps friendly systems working under attack. Recent US doctrine calls it electromagnetic warfare.

### Is SIGINT legal?

SIGINT is carried out by government agencies under specific laws, warrants and oversight. For anyone else, intercepting other people's communications without authority is an offence in most countries, and the international Radio Regulations require governments to prevent it. Measuring the radio spectrum, such as signal levels, occupancy and interference, is routine engineering work for regulators, operators and radio astronomers.

### How do I make a SIGINT dashboard in JavaScript?

Compute a power spectrum from each block of receiver samples with an FFT. Draw the newest spectrum as a line chart, and add it as the top row of a heatmap to make the waterfall, sharing one frequency axis. Run a threshold detector on each spectrum, group detections into emitters, and show them in a table, a polar bearing plot and a timeline. With SciChart.js, use a FastLineRenderableSeries, a UniformHeatmapRenderableSeries, polar series and a FastRectangleRenderableSeries.

## Sources

- National Security Agency, [Signals Intelligence (SIGINT) overview](https://www.nsa.gov/Signals-Intelligence/Overview/). What SIGINT is and the legal authorities it works under.
- US Joint Chiefs of Staff, [DOD Dictionary of Military and Associated Terms](https://www.jcs.mil/Portals/36/Documents/Doctrine/pubs/dictionary.pdf). Definitions of SIGINT, COMINT, ELINT, FISINT and electronic warfare.
- Office of the Director of National Intelligence, [What is intelligence?](https://www.dni.gov/index.php/what-we-do/what-is-intelligence) The intelligence collection disciplines.
- US Joint Chiefs of Staff (2020), [JP 3-85, Joint Electromagnetic Spectrum Operations](https://irp.fas.org/doddir/dod/jp3_85.pdf). Current US joint doctrine for electromagnetic warfare, which replaced JP 3-13.1, *Electronic Warfare*.
- Congressional Research Service, [Defense Primer: Electronic Warfare](https://crsreports.congress.gov/product/pdf/IF/IF11118) (IF11118). Electronic attack, protection and support.
- Adamy, D. (2001), *EW 101: A First Course in Electronic Warfare*. Artech House. Receivers, emitter location, and the relationship between ESM and SIGINT.
- Poisel, R. A. (2008), *Introduction to Communication Electronic Warfare Systems*, 2nd edition. Artech House. Communications intercept and direction-finding systems.
- GCHQ, [Bletchley Park and WWII](https://www.gchq.gov.uk/section/history/bletchley-park-and-wwii). Second World War codebreaking.
- Williams, K. B. (1996), *Secret Weapon: U.S. High-Frequency Direction Finding in the Battle of the Atlantic*. Naval Institute Press. Direction finding against U-boats.
- International Telecommunication Union, [Handbook on Spectrum Monitoring](https://www.itu.int/pub/R-HDB-23-2011) (2011 edition), and the [Radio Regulations](https://www.itu.int/pub/R-REG-RR-2024) (2024 edition), Article 17 on the secrecy of radio communications.
- Cospas-Sarsat, [the international satellite system for search and rescue](https://www.cospas-sarsat.int/en/). Detecting and locating distress beacons.

<LearnCta position="bottom" chart="SIGINT dashboard" demo="audio-analyzer-fft-example" demoLabel="audio analyzer" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" docsLabel="SciChart.js heatmap documentation" />
