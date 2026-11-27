---
sidebar_position: 320
sidebar_label: Telemetry
title: "Telemetry: What It Is, How It Works and How to Visualise the Data"
description: "What telemetry is, how a telemetry system measures, frames, sends and decodes data from aircraft, rockets, cars and remote sites, and how to read a live telemetry dashboard."
keywords:
    [
        "telemetry",
        "what is telemetry",
        "telemetry definition",
        "telemetry meaning",
        "define telemetry",
        "telemetry data",
        "telemetry system",
        "telemetry monitor",
        "telemetry dashboard",
        "telemetry visualization",
        "flight test telemetry",
        "aerospace telemetry",
        "satellite telemetry",
        "motorsport telemetry",
        "telemetry vs telecommand",
        "PCM telemetry",
        "IRIG 106"
    ]
image: /img/learn/telemetry-og.png
related: [motorsport-telemetry, hmi-scada, strip-chart, time-series-data-formats]
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
                    "name": "What is telemetry in simple terms?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Telemetry is measuring something in one place and reading the measurements somewhere else, automatically and usually as they happen. Sensors on an aircraft, a rocket, a racing car or a pipeline take readings, a transmitter sends them by radio, satellite or cable, and engineers on the ground watch them on charts and readouts and record them for later analysis."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is telemetry data?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Telemetry data is the stream of time-stamped measurements a telemetry system delivers: one channel per sensor, such as altitude, speed, acceleration, temperature or pressure, each sampled at its own rate. On the ground the raw values are converted into engineering units, displayed live and stored, so the run, flight or shift can be replayed and analysed later."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is a telemetry monitor?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "In a hospital, a telemetry monitor is a small battery-powered ECG transmitter that a patient wears while moving about. It sends the heart rhythm by radio to a central station, where nurses and technicians watch several patients at once and are alerted to arrhythmias. In engineering, the same words mean any screen or system that watches incoming telemetry."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between telemetry and telecommand?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Telemetry carries measurements from a remote vehicle or site to the people monitoring it. Telecommand goes the other way: commands sent from the ground to the vehicle, such as switching on an instrument or changing a setting. Spacecraft and flight-test systems usually have both, a telemetry downlink and a telecommand uplink, often under the same standards."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is a telemetry dashboard?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A telemetry dashboard is the screen where live telemetry is read. It usually has time-synchronised strip charts for the channels, numeric readouts or gauges for the latest values, limit lines and alarm colours, markers for events such as a stage separation, and controls to pause, zoom and replay recorded data."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a telemetry dashboard in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Give each group of channels its own chart pane with a fixed y-range, and line the panes up on a shared time axis. With SciChart.js, add a FastLineRenderableSeries per channel, append samples with appendRange as they arrive, line the panes up with SciChartVerticalGroup, and link their cursors with a shared modifierGroup. A palette provider turns a trace red above its alarm limit. React and Angular apps use the same code through scichart-react and scichart-angular."
                    }
                }
            ]
        })}
    </script>
</head>

# Telemetry

## What is telemetry?

**Telemetry** is the automatic measurement of data at a remote place and its transmission to somewhere else to be watched and recorded. Sensors on an aircraft, rocket, satellite, racing car or pipeline take readings; a transmitter sends them by radio, satellite or cable; and engineers on the ground see them live on charts and readouts.

![A simulated rocket telemetry dashboard in a dark navy theme: four time-synchronised strip charts showing altitude and speed, acceleration, vibration with a sharp separation shock, and skin temperature turning red above a dashed alarm limit, with dashed event markers for liftoff, Max-Q, burnout and separation](/img/learn/telemetry-og.png)

*A telemetry dashboard replaying a simulated sounding-rocket flight: altitude and speed, acceleration, vibration and skin temperature on one time axis, with event markers and an alarm limit (sample data). [Try the interactive version](#how-to-build-a-telemetry-dashboard-in-javascript-react-or-angular).*

:::tip Key takeaways
- Telemetry means "measuring at a distance": the word joins the Greek *tele* (far) and *metron* (measure).
- A telemetry system has eight steps around one link: sensors, signal conditioning, sampling and framing on the vehicle, then reception, conversion to engineering units, display and archiving on the ground.
- Each channel is sampled at its own rate, packed with others into frames or packets with a sync word and a time stamp, and sent over one link.
- A telemetry dashboard lines up strip charts on one time axis, adds readouts, limits and event markers, and replays recordings.
- In hospitals, telemetry means wireless heart monitoring; in software, it means logs, metrics and traces. This guide is about the engineering meaning.
:::

Flight-test programmes, launch vehicles, spacecraft, racing teams, water and gas networks, weather balloons and wildlife tags all use it.

## How does telemetry work?

Every telemetry system, from a model rocket to a deep-space probe, follows the same chain. The vehicle or remote site measures and packs the data; a link carries it; the ground unpacks, converts, shows and stores it.

![The telemetry chain in two rows. On the vehicle or remote site: 1 sensors, 2 signal conditioning, 3 sampling, 4 framing into a PCM frame or packet with a sync word and time stamp. A downlink by radio, satellite relay or cable carries the frames to the ground. On the ground: 5 receive, find the frame sync and split out each channel, 6 convert counts to engineering units, 7 display on strip charts, readouts and alarms, 8 archive every frame for playback. A dashed uplink arrow shows telecommand going back to the vehicle](./telemetry-system-chain.svg)

1. Sensors. Thermocouples, pressure transducers, strain gauges, accelerometers, GPS receivers and position sensors turn physical quantities into voltages or digital readings.
2. Signal conditioning. Amplifiers scale each signal to the range of the converter, remove offsets, and an anti-aliasing low-pass filter removes frequencies too high for the sample rate.
3. Sampling. An analogue-to-digital converter (ADC) turns each voltage into a number of counts. Each channel is sampled only as fast as it needs: more than twice the highest frequency it contains, by the [Nyquist rule](/learn/applications/signal-processing/nyquist-and-aliasing/). A tank temperature changes over seconds; a vibration sensor needs thousands of samples a second.
4. Framing. The samples from all channels are interleaved into a fixed pattern of words (a frame) or into self-describing packets, with a sync pattern so the receiver can find the start, a counter, and a time stamp.

Between steps 4 and 5 sits the link, the downlink in the diagram. A transmitter sends the bit stream over a radio link, through a satellite relay, or along a cable or fibre. On a test range, aircraft and missile telemetry uses dedicated bands; in the USA, 1435 to 1525 MHz in L-band is set aside for aeronautical telemetry.

5. Reception and decommutation. The ground station's receiver recovers the bits, a frame synchroniser locks on to the sync pattern, and a decommutator splits the frame back into channels.
6. Conversion. Raw counts become engineering units (°C, bar, g, metres) through each sensor's calibration, and every sample gets its time.
7. Display. The values feed live strip charts, readouts and alarms.
8. Archiving. Every frame is recorded, so the test can be replayed and analysed later. Storing and sending the channels as compressed binary columns keeps both fast (see [time series data formats](/learn/big-data/time-series-data-formats/)).

### Telemetry frames: PCM and IRIG 106

In aircraft and missile flight testing, most telemetry is sent as **pulse code modulation (PCM)**: a continuous stream of bits arranged in fixed frames. The Range Commanders Council's IRIG 106 standard, chapter 4, defines the format used on test ranges:

- A **minor frame** starts with a synchronisation pattern of 16 to 33 bits, followed by data words of 4 to 32 bits each in the standard (Class I) format.
- A Class I minor frame holds at most 8,192 bits or 1,024 words. A **major frame** is the set of minor frames, up to 256, needed to include every word in the format once.
- Fast channels appear several times in each minor frame (supercommutation). Slow channels share one word position, taking turns from frame to frame (subcommutation), with a subframe counter to say whose turn it is.
- Bit rates start at 10 bits per second; above 10 megabits per second, a format counts as Class II.

The format is fixed in advance and written down in a description file, so the ground station knows which word in which frame belongs to which sensor.

### Telemetry packets: CCSDS for spacecraft

Spacecraft usually send telemetry as packets instead of fixed frames. The Consultative Committee for Space Data Systems (CCSDS) Space Packet Protocol, agreed by the CCSDS member space agencies, gives each packet a 6-byte primary header that includes an 11-bit application process identifier (which instrument or subsystem sent it), a sequence count, and a flag that says whether the packet is telemetry or telecommand. A space packet carries 1 to 65,536 bytes of data, and an optional secondary header often holds the time the data was taken. Packets let each instrument send at its own pace, which suits a spacecraft whose activity changes over a mission.

### Telemetry vs telecommand

**Telecommand** is the opposite direction: commands sent from the ground to the vehicle, such as "switch on the camera" or "open valve 3". A spacecraft has a telemetry downlink and a telecommand uplink. Commands are usually checked and confirmed in the telemetry, so the operator sees the valve report that it opened.

## What is telemetry data?

**Telemetry data** is the stream of time-stamped measurements a telemetry system delivers. Each sensor is a **channel** (also called a parameter or measurand) with a name, a unit, a sample rate and a calibration.

| Kind of channel | How fast it changes | What it needs |
| --- | --- | --- |
| Temperatures, tank levels, battery voltages | Over seconds or minutes | A few samples per second |
| Position, altitude, speed, attitude | Over fractions of a second | Tens of samples per second |
| Acceleration, control-surface positions, pressures in a combustion chamber | Over tens of milliseconds | Hundreds of samples per second |
| Vibration, acoustics, shock | Within milliseconds | Thousands of samples per second, with an anti-aliasing filter |
| Discrete events: switch states, stage separation, alarms | Once, at an instant | A time-stamped event, not a sampled trace |

Three properties make telemetry data harder to chart than ordinary time series:

- Mixed sample rates. Channels arrive at different rates, so they can't share one table of rows. Each needs its own time values.
- Volume. A thousand channels at a few hundred samples per second each is hundreds of thousands of values per second, for the whole length of a test.
- Gaps and dropouts. Radio links fade when an antenna is masked or the vehicle is far away. Frames are lost, and a chart that joins the points either side of a gap draws data that was never measured.

## Where is telemetry used?

Telemetry is used wherever something must be measured live from a distance: aircraft and rockets, spacecraft, race cars, utility networks and weather and science stations.

| Field | What is measured | Typical link |
| --- | --- | --- |
| Aircraft flight test | Structural loads, flutter, engine parameters, flight controls, air data | PCM over L-, S- or C-band radio to a test range |
| Rockets and launch vehicles | Trajectory, engine pressures, temperatures, vibration, stage events | Radio to ground stations along the track, and satellite relay |
| Satellites and space probes | Health and status of every subsystem, plus science data | CCSDS packets via ground station networks |
| [Motorsport](/learn/applications/motorsport-telemetry/) | Engine, gearbox, tyres, brakes, suspension, aerodynamics | Short-range radio from car to pit, plus a full download after the session |
| Oil, gas, water and power networks | Flows, pressures, levels, valve states at remote stations | Radio, cellular or satellite into a [SCADA system](/learn/applications/hmi-scada/) |
| Weather and science | Temperature, humidity and pressure from radiosondes; animal movements from tags | Radio and satellite |

For more on how SciChart is used in these industries, see [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/) and [HMI and SCADA](https://www.scichart.com/scada-big-data/) on scichart.com.

### Telemetry in medicine

In a hospital, telemetry means remote heart monitoring. A patient wears a small battery-powered transmitter connected to ECG electrodes, and it sends the heart rhythm by radio to a central station, where staff watch many patients at once and are alerted to arrhythmias. A **telemetry unit** is a ward where patients are monitored this way, and a telemetry nurse or monitor technician watches the screens. The displays are [strip charts](/learn/real-time/strip-chart/) of ECG waveforms, the same kind of chart this guide builds.

### Telemetry in software and IT

In software, telemetry means the data a program reports about itself so that engineers can see what it is doing: **logs** (records of events), **metrics** (counts and measurements over time, such as request rates or memory use) and **traces** (the path of one request through many services). The open standard for collecting it is [OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/). The charts are similar, time series with limits and alarms, but the data comes from servers and apps instead of sensors, and it isn't the subject of this guide.

## What is a telemetry dashboard?

A **telemetry dashboard** is the screen where live telemetry is read: in a flight-test control room, a launch control centre, a race team's garage or a pipeline operator's office. Most share the same parts:

- Strip charts for the channels that change, grouped into panes by subsystem, each pane with its own y-axis and a fixed range.
- One time axis shared by every pane, so a moment in one channel lines up with the same moment in all the others.
- Readouts or gauges with each channel's latest value, for the numbers people call out.
- Limits and alarm colours. Each critical channel has limit lines; a value outside them changes colour (amber for caution, red for warning) and often sounds an alarm.
- Event markers for known moments, such as liftoff, a gear change, a stage separation or a test point starting.
- Playback. The same screens can replay a recorded run at any speed, pause on a moment and zoom in, which is how most analysis is done.

### How to read a telemetry dashboard

1. Start with the readouts and alarm colours: is anything outside its limits right now?
2. Follow any alarm back in time on its strip chart. When did it start crossing, and was it a spike or a trend?
3. Read straight down the panes at that moment. A change in one channel that coincides with a change in another (a vibration spike at separation, a temperature rise as speed peaks) usually explains it.
4. Check the event markers. Many "anomalies" are expected responses to a planned event.
5. Zoom in on the fast channels. On a long time window, a short spike can be only a few pixels wide.

To describe a moment on a telemetry dashboard, give the time, the event, the channel and its value, and what the other channels did: "At T+50 s, just after separation, vibration peaked at 16 g for about 10 ms, while acceleration and temperature stayed steady."

## Telemetry vs data logging vs SCADA vs observability

Telemetry sends measurements live, data logging stores them for later, SCADA also controls the plant it monitors, and software observability applies the same idea to computer systems.

| | Telemetry | Data logging | SCADA | Software observability |
| --- | --- | --- | --- | --- |
| What it is | Remote measurement, sent live | Measurements stored on board, read later | Monitoring and control of a plant or network | Telemetry about software: logs, metrics, traces |
| When you see the data | Live, delayed only by the link | After the vehicle returns or the logger is downloaded | Live, at the rate the remote sites are polled | Live, after collection and processing |
| Commands back? | Separate telecommand link, if any | No | Yes: operators open valves and start pumps | Sometimes, through automation |
| Use it when | People must see and react during the run | Data is needed only afterwards, or the link can't carry it all | The remote site has to be controlled, not only watched | The system you are watching is software |

Most real systems mix them. A racing car or a test aircraft sends a subset of its channels as telemetry and logs everything at full rate on board, to be downloaded later.

## Common telemetry display mistakes

Most telemetry display mistakes distort time: misaligned clocks, aliasing, hidden peaks and invented data across gaps.

- **Plotting channels on unsynchronised time bases.** If one stream is stamped when it was sampled and another when it reached the ground, the panes disagree by the link delay, and causes appear after their effects. Use the on-board time stamp for every channel.
- **Ignoring aliasing.** A vibration channel sampled too slowly, or without an anti-aliasing filter, shows a slow wobble that isn't there. The fix is upstream, in the sample rate and filter; see [Nyquist and aliasing](/learn/applications/signal-processing/nyquist-and-aliasing/).
- **Decimating fast channels for display.** Showing every 20th point of a 1,000 samples-per-second channel can make a millisecond shock vanish. Use a min-max [downsampling](/learn/big-data/downsampling/) method that keeps the extremes in each pixel, or draw every point with a renderer that can.
- **Putting too many channels on one axis.** Ten traces with different units on one y-axis makes all of them hard to read. Group related channels into panes, each with its own scale.
- **Autoscaling live axes.** A y-axis that rescales on every update makes the trace jump about and hides how far a value is from its limit. Fix each pane's range to the channel's expected span.
- **Bridging dropouts.** Drawing a straight line across a lost-signal gap invents data. Leave a gap, or mark it.
- **Alarms without hysteresis.** A value hovering at its limit makes an alarm flash on and off. Clear the alarm only once the value is back inside the limit by a margin (a deadband).

## How to build a telemetry dashboard in JavaScript, React or Angular

The demo below streams a simulated three-minute sounding-rocket flight into synchronised panes and readouts, about 224,000 samples in all from six channels recorded at 5 to 1,000 samples per second: altitude and speed, acceleration (100 samples per second), vibration (1,000 samples per second), nose-cone skin temperature and chamber pressure, with the first 70 seconds already received.

Use **Pause** and **Replay from liftoff**, and change the **Playback speed**. Move the **Skin temperature limit** slider, or drag the dashed red line, and watch the trace and its readout turn red above it. Switch **Vibration display** to every 20th sample and the 16 g separation shock at T+50 s disappears. Scroll to zoom in time, drag to pan, double-click to see the whole flight again, and hover for values on every pane.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="real-time telemetry dashboard" demo="multiple-chart-dashboard-performance-demo" demoLabel="multi-chart dashboard" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />

Here is the code for this dashboard. The flight simulation and the HTML controls are plain JavaScript; SciChart.js draws the panes, the event markers, the alarm limit and the coloured trace.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        EStrokePaletteMode,
        FastLineRenderableSeries,
        XyDataSeries,
        DefaultPaletteProvider,
        HorizontalLineAnnotation,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Channel = { name: string; unit: string; min: number; max: number; rate: number; limit?: number };

    // One pane per channel group; rate = samples per second
    const channels: Channel[] = [
        { name: "Altitude", unit: "km", min: 0, max: 110, rate: 20 },
        { name: "Acceleration", unit: "g", min: -2, max: 8, rate: 100 },
        { name: "Vibration", unit: "g", min: -20, max: 20, rate: 1000 },
        { name: "Skin temperature", unit: "°C", min: 0, max: 130, rate: 5, limit: 80 }
    ];
    const WINDOW_SECONDS = 60; // time shown on screen
    const group = new SciChartVerticalGroup(); // gives every pane the same axis widths, so the time axes line up
    const alarmRed = parseColorToUIntArgb("#FF4D4D");

    // Builds one pane: a scrolling strip chart with a fixed y-range and, if the channel has one, an alarm limit
    const makePane = (channel: Channel) => async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: `${channel.name} (${channel.unit})`,
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(channel.min, channel.max)
            })
        );
        // fifoCapacity keeps only the newest WINDOW_SECONDS of samples
        const dataSeries = new XyDataSeries(wasmContext, {
            fifoCapacity: WINDOW_SECONDS * channel.rate,
            isSorted: true,
            containsNaN: false
        });
        const line = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0", strokeThickness: 2 });
        if (channel.limit !== undefined) {
            // Red wherever the value is over the limit, and a dashed limit line
            const palette = new DefaultPaletteProvider();
            palette.strokePaletteMode = EStrokePaletteMode.SOLID;
            palette.overrideStrokeArgb = (x, y) => (y > channel.limit! ? alarmRed : undefined);
            line.paletteProvider = palette;
            sciChartSurface.annotations.add(
                new HorizontalLineAnnotation({ y1: channel.limit, stroke: "#FF4D4D", strokeDashArray: [6, 3] })
            );
        }
        sciChartSurface.renderableSeries.add(line);
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "telemetry", showTooltip: true }), // crosshair on every pane
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        group.addSurfaceToGroup(sciChartSurface);

        // Append each batch of samples as it arrives (times in seconds, values in the channel's unit)
        const unsubscribe = subscribeToYourTelemetry(channel.name, (times: number[], values: number[]) =>
            dataSeries.appendRange(times, values)
        );
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };
    const paneInits = channels.map(makePane);

    // One SciChartReact per pane; SciChartReact creates each chart, sizes it and cleans it up
    export const TelemetryDashboard = () => (
        <div>
            {paneInits.map((initChart, index) => (
                <SciChartReact key={channels[index].name} initChart={initChart} style={{ width: "100%", height: 200 }} />
            ))}
        </div>
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        EStrokePaletteMode,
        FastLineRenderableSeries,
        XyDataSeries,
        DefaultPaletteProvider,
        HorizontalLineAnnotation,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Channel = { name: string; unit: string; min: number; max: number; rate: number; limit?: number };

    // One pane per channel group; rate = samples per second
    const channels: Channel[] = [
        { name: "Altitude", unit: "km", min: 0, max: 110, rate: 20 },
        { name: "Acceleration", unit: "g", min: -2, max: 8, rate: 100 },
        { name: "Vibration", unit: "g", min: -20, max: 20, rate: 1000 },
        { name: "Skin temperature", unit: "°C", min: 0, max: 130, rate: 5, limit: 80 }
    ];
    const WINDOW_SECONDS = 60; // time shown on screen
    const group = new SciChartVerticalGroup(); // gives every pane the same axis widths, so the time axes line up
    const alarmRed = parseColorToUIntArgb("#FF4D4D");

    // Builds one pane: a scrolling strip chart with a fixed y-range and, if the channel has one, an alarm limit
    const makePane = (channel: Channel) => async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: `${channel.name} (${channel.unit})`,
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(channel.min, channel.max)
            })
        );
        // fifoCapacity keeps only the newest WINDOW_SECONDS of samples
        const dataSeries = new XyDataSeries(wasmContext, {
            fifoCapacity: WINDOW_SECONDS * channel.rate,
            isSorted: true,
            containsNaN: false
        });
        const line = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0", strokeThickness: 2 });
        if (channel.limit !== undefined) {
            // Red wherever the value is over the limit, and a dashed limit line
            const palette = new DefaultPaletteProvider();
            palette.strokePaletteMode = EStrokePaletteMode.SOLID;
            palette.overrideStrokeArgb = (x, y) => (y > channel.limit! ? alarmRed : undefined);
            line.paletteProvider = palette;
            sciChartSurface.annotations.add(
                new HorizontalLineAnnotation({ y1: channel.limit, stroke: "#FF4D4D", strokeDashArray: [6, 3] })
            );
        }
        sciChartSurface.renderableSeries.add(line);
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "telemetry", showTooltip: true }), // crosshair on every pane
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        group.addSurfaceToGroup(sciChartSurface);

        // Append each batch of samples as it arrives (times in seconds, values in the channel's unit)
        const unsubscribe = subscribeToYourTelemetry(channel.name, (times: number[], values: number[]) =>
            dataSeries.appendRange(times, values)
        );
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };
    const paneInits = channels.map(makePane);

    @Component({
        selector: "app-telemetry-dashboard",
        standalone: true,
        imports: [ScichartAngularComponent],
        // One scichart-angular per pane; it creates each chart, sizes it and cleans it up
        template: `
            @for (initChart of paneInits; track $index) {
                <scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 200px"></scichart-angular>
            }
        `
    })
    export class TelemetryDashboardComponent {
        paneInits = paneInits;
    }
    ```
</CodeSnippetBlock>

Key points:

- Each pane is its own `SciChartSurface`. `SciChartVerticalGroup` gives every pane the same y-axis width, so their time axes line up exactly, and a `CursorModifier` with a shared `modifierGroup` draws the crosshair on every pane at once.
- Every channel has its own `XyDataSeries` with its own time values, so channels at 5, 20, 100 and 1,000 samples per second sit on one time axis without resampling. New samples are added with `appendRange`.
- The alarm colour comes from a palette provider: `overrideStrokeArgb` returns red for any point above the limit. A `BoxAnnotation` shades the alarm band, and an editable `HorizontalLineAnnotation` lets you drag the limit.
- Event markers are `VerticalLineAnnotation`s, shown as playback passes each event. For a live feed, use `fifoCapacity` on each data series to keep a fixed window of the newest samples.

**See it in the demo app:** [JavaScript multi-chart dashboard](https://www.scichart.com/demo/javascript/multiple-chart-dashboard-performance-demo) · [React multi-chart dashboard](https://www.scichart.com/demo/react/multiple-chart-dashboard-performance-demo) · [Angular multi-chart dashboard](https://www.scichart.com/demo/angular/multiple-chart-dashboard-performance-demo). Related techniques: the [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart), [React real-time chart performance](https://www.scichart.com/demo/react/chart-realtime-performance-demo), [React line chart with threshold colours](https://www.scichart.com/demo/react/line-splitting-thresholds), [React draggable threshold line](https://www.scichart.com/demo/react/chart-drag-horizontal-threshold) and [React linear gauges](https://www.scichart.com/demo/react/linear-gauges).

**Go deeper:** [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/), [synchronising multiple charts](/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/), [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/), the [palette provider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/) and the [learning center guides to strip charts](/learn/real-time/strip-chart/) and [big data visualization](/learn/big-data/big-data-visualization/). For the industries, see SciChart for [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/) and [HMI and SCADA](https://www.scichart.com/scada-big-data/).

## Frequently asked questions

### What is telemetry in simple terms?

Telemetry is measuring something in one place and reading the measurements somewhere else, automatically and usually as they happen. Sensors on an aircraft, a rocket, a racing car or a pipeline take readings, a transmitter sends them by radio, satellite or cable, and engineers on the ground watch them on charts and readouts and record them for later analysis.

### What is telemetry data?

Telemetry data is the stream of time-stamped measurements a telemetry system delivers: one channel per sensor, such as altitude, speed, acceleration, temperature or pressure, each sampled at its own rate. On the ground the raw values are converted into engineering units, displayed live and stored, so the run, flight or shift can be replayed and analysed later.

### What is a telemetry monitor?

In a hospital, a telemetry monitor is a small battery-powered ECG transmitter that a patient wears while moving about. It sends the heart rhythm by radio to a central station, where nurses and technicians watch several patients at once and are alerted to arrhythmias. In engineering, the same words mean any screen or system that watches incoming telemetry.

### What is the difference between telemetry and telecommand?

Telemetry carries measurements from a remote vehicle or site to the people monitoring it. Telecommand goes the other way: commands sent from the ground to the vehicle, such as switching on an instrument or changing a setting. Spacecraft and flight-test systems usually have both, a telemetry downlink and a telecommand uplink, often under the same standards.

### What is a telemetry dashboard?

A telemetry dashboard is the screen where live telemetry is read. It usually has time-synchronised strip charts for the channels, numeric readouts or gauges for the latest values, limit lines and alarm colours, markers for events such as a stage separation, and controls to pause, zoom and replay recorded data.

### How do I make a telemetry dashboard in JavaScript?

Give each group of channels its own chart pane with a fixed y-range, and line the panes up on a shared time axis. With SciChart.js, add a `FastLineRenderableSeries` per channel, append samples with `appendRange` as they arrive, line the panes up with `SciChartVerticalGroup`, and link their cursors with a shared `modifierGroup`. A palette provider turns a trace red above its alarm limit. React and Angular apps use the same code through `scichart-react` and `scichart-angular`.

## Sources

- Range Commanders Council (2025), [IRIG 106-24R1 Telemetry Standards, chapter 4: Pulse Code Modulation Standards](https://www.irig106.org/docs/106-24R1/chapter4.pdf). Minor and major frames, sync patterns, word lengths, subcommutation and supercommutation, and the Class I and Class II limits.
- Range Commanders Council (2025), [IRIG 106-24R1 Telemetry Standards, chapter 2: Transmitter and Receiver Systems](https://www.irig106.org/docs/106-24R1/chapter2.pdf). The L-, S- and C-band allocations for aeronautical telemetry.
- CCSDS (2020), [Space Packet Protocol, CCSDS 133.0-B-2](https://ccsds.org/Pubs/133x0b2e2.pdf). Blue Book. The space packet's primary header, application process identifier and length limits.
- CCSDS (2023), [Overview of Space Communications Protocols, CCSDS 130.0-G-4](https://ccsds.org/Pubs/130x0g4e1.pdf). Green Book. How telemetry and telecommand fit into the space link protocols.
- Sandau, K. E. et al. (2017), [Update to Practice Standards for Electrocardiographic Monitoring in Hospital Settings](https://doi.org/10.1161/CIR.0000000000000527). *Circulation*, 136(19), e273–e344. American Heart Association scientific statement on hospital ECG and telemetry monitoring.
- OpenTelemetry, [Signals](https://opentelemetry.io/docs/concepts/signals/). The traces, metrics and logs of software telemetry.
- Merriam-Webster, [telemetry](https://www.merriam-webster.com/dictionary/telemetry), [tele-](https://www.merriam-webster.com/dictionary/tele-) and [-metry](https://www.merriam-webster.com/dictionary/-metry). The word's origin in the Greek for "far" and "measure".

<LearnCta position="bottom" chart="real-time telemetry dashboard" demo="multiple-chart-dashboard-performance-demo" demoLabel="multi-chart dashboard" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />
