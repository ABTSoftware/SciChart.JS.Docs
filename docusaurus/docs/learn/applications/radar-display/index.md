---
sidebar_position: 210
sidebar_label: Radar Display
title: "Radar Screen: How to Read a Radar Display (Interactive)"
description: "How to read a radar screen (PPI scope): range rings, bearing, the sweep, blips, tracks and trails, transponder labels, clutter and identity symbols, with a live simulation."
keywords:
    [
        "radar screen",
        "radar display",
        "how to read a radar screen",
        "plan position indicator",
        "ppi scope",
        "radar blip",
        "radar sweep",
        "air traffic control radar",
        "primary and secondary radar",
        "radar clutter",
        "radar tracks",
        "radar range rings"
    ]
image: /img/learn/radar-display-og.png
related: [weather-radar, sonar, elint, antenna-radiation-pattern]
datePublished: 2026-11-26
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a radar screen?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A radar screen, or radar display, shows what a radar has detected around it as a map seen from above. The radar is at the centre, the angle around the circle is the bearing from north, and the distance from the centre is the range. A sweep line turns with the antenna and refreshes each direction as it passes, and the echoes fade until the next sweep." }
                },
                {
                    "@type": "Question",
                    "name": "What is a spot on a radar screen called?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A spot of light on a radar screen is called a blip. It is the echo of the radar's pulse from an object such as an aircraft, a ship, a hill or a rain shower. On a modern display, the computer also turns the blips from several sweeps into a track, shown as a symbol with a trail and a label." }
                },
                {
                    "@type": "Question",
                    "name": "What do the circles on a radar screen mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The circles on a radar screen are range rings. Each one marks a fixed distance from the radar, such as every 10 nautical miles, so you can estimate how far away an echo is by counting rings. The scale around the edge gives the bearing, with 000 degrees at north on a north-up display." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between primary and secondary radar?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Primary radar detects the echo of its own pulse from any object, so it sees aircraft, ships, birds and weather without their cooperation, but measures only range and bearing. Secondary radar interrogates aircraft transponders, which reply with an identity code and pressure altitude. Air traffic control uses both: primary for everything that reflects, secondary for identity and altitude." }
                },
                {
                    "@type": "Question",
                    "name": "Why does a radar screen have a sweeping line?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The sweeping line shows where the radar's antenna is pointing. A surveillance antenna has a narrow beam and turns continuously, so it sees one direction at a time. The display paints the echoes for each direction as the beam passes and lets them fade, so the picture is rebuilt once per rotation, every few seconds." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a radar display in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a polar chart with an angular axis from 0 to 360 degrees, starting at the top and running clockwise, and a radial axis for range with circular gridlines as range rings. Draw the sweep as a polar line, the radar video as a polar heatmap that fades each frame, and tracks as polar scatter points updated when the sweep passes them. SciChart.js does this with SciChartPolarSurface in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Radar Display

## What is a radar display?

A **radar display** (also called a radar screen, or a PPI scope from plan position indicator) is a map-like picture of what a radar has detected around it. The radar sits at the centre, the angle around the circle shows bearing, the distance from the centre shows range, and a rotating sweep line repaints each direction as the antenna turns.

![A simulated surveillance radar display in a dark navy theme. A bright sweep line rotates from the centre, leaving a fading green afterglow. Range rings every 10 nautical miles and a bearing scale from 000 to 330 degrees surround the radar. Six tracks carry identity symbols, trails of past positions and short velocity lines: green squares for two airliners and a ship, a blue circle for a friendly patrol aircraft, a yellow quatrefoil for an unknown light aircraft, and a red diamond for a fast hostile contact closing on the radar. Labels next to the aircraft show their transponder code, flight level and speed](/img/learn/radar-display-og.png)

*A simulated surveillance radar display: a 60 NM north-up PPI with a coastline map, tracks, trails and data blocks. [Try the interactive version](#how-to-build-a-radar-display-in-javascript-react-or-angular).*

:::tip Key takeaways

- The centre is the radar, the angle is bearing (000° is north) and the distance from the centre is range, read against the range rings.
- A blip is one raw echo; a track is the radar computer's estimate of one object's position, course and speed, built from echoes over several sweeps.
- Primary radar sees anything that reflects; secondary radar adds the transponder code and altitude that aircraft send back, which become the labels next to each track.
- Clutter from waves, rain and the ground can hide real targets. Gain, sea and rain controls and Doppler filters remove it, and can remove weak targets with it.
- Air traffic control, ships and air defence all use the same picture, with different symbols, labels and ranges.

:::

## How a radar measures range and bearing

A pulse radar sends out a short burst of radio energy and listens for echoes. Two measurements place every echo on the screen.

- **Range** comes from the time the echo takes to come back. The pulse travels out and back at the speed of light, so the range is the speed of light times the delay, divided by two: R = c·t/2. An echo that returns 247 microseconds after the pulse is 37.0 km away, which is 20.0 nautical miles (NM).
- **Bearing** comes from where the antenna is pointing when the echo arrives. A surveillance antenna has a narrow beam in the horizontal plane, typically a degree or two wide, and turns steadily, so the radar knows the direction of each echo from the antenna's angle at that moment.

Radar people sometimes quote the **radar mile**: about 12.36 microseconds, the round-trip time to a target 1 NM away. Because the beam has a width, a point target shows as a short arc rather than a dot. A 1.4° beam at 40 NM is about 1 NM wide, so two aircraft side by side at that range can merge into one blip, while two at the same bearing but different ranges stay separate.

How often the radar sends pulses (its pulse repetition interval, PRI) sets the longest range it can measure without ambiguity; a passive receiver measures the same PRI to identify a radar, as described in [ELINT: radar pulse analysis](/learn/applications/elint/).

## How to read a radar screen

![Diagram of a radar display with eight numbered parts: 1 the radar at the centre, 2 the range rings every 10 nautical miles, 3 the bearing scale with 000 degrees at the top, 4 the sweep line at bearing 060, 5 the fading afterglow behind it, 6 a raw echo or blip one beam wide, 7 a track symbol with a trail of past plots and a line showing its heading, and 8 a data block with the transponder code 3421, flight level 310 and a ground speed of 440 knots](./ppi-scope-anatomy.svg)

Read a radar screen from the centre outwards, in this order:

1. **Own position.** The radar, or your own ship or aircraft, is at the centre. Everything else is placed relative to it.
2. **Range.** Count the range rings out to the echo. On a 40 NM display with rings every 10 NM, an echo just past the third ring is a little over 30 NM away. Marine radars add a variable range marker, an adjustable ring for an exact reading.
3. **Bearing.** Read the angle on the scale round the edge: 000° is north, 090° east, 180° south and 270° west. A bearing is always from the radar to the target. Marine radars add an electronic bearing line, a movable spoke for exact readings.
4. **The sweep.** The bright spoke is where the antenna is pointing now. Each echo is refreshed only when the sweep passes it, so everything you see is between zero and one rotation old. An airport approach radar turns about once every 4.8 seconds; a long-range en route radar about once every 12 seconds.
5. **Afterglow.** Old radar tubes used a long-persistence phosphor (such as P7), so echoes kept glowing and faded as the sweep moved on. Digital displays copy this in software: the brightest echoes are the newest.
6. **Blips.** A blip is a raw echo. Its brightness depends on how much energy came back, not on how big or dangerous the object is.
7. **Tracks.** A symbol marks each tracked object. Dots behind it show where it was on earlier sweeps (its trail), and a line ahead of it shows where it will be in a set time if it keeps its course and speed.
8. **Labels.** On air traffic control and military displays, a data block next to each track gives its identity, altitude and speed.

### North-up, head-up and course-up

The display can be turned three ways. Ship radars must offer north-up and course-up, and many also offer head-up; surveillance radars on land use north-up.

| Mode | Top of the screen | Good for | Watch out for |
|---|---|---|---|
| North-up | True north | Comparing with a chart; the picture stays still when you turn | Your heading is shown by a line, not by "up" |
| Head-up | Your own ship's or aircraft's heading | Matching the view out of the window: left on screen is to port | The whole picture rotates every time you turn, and trails smear |
| Course-up | The course you set | A steady picture that still roughly matches the view ahead | Must be reset after a big change of course |

Marine radars also show motion in two ways: relative motion, where your own ship stays at the centre and other targets move relative to you, and true motion, where your own ship moves across a fixed picture. In relative motion, a target whose bearing stays the same while its range closes is on a collision course.

## Blips, plots and tracks

On a modern radar, a computer also turns the echoes into tracks, in three steps.

1. **Detection.** For every cell of range and bearing, the processor decides whether an echo stands out from the noise around it. Many radars use a threshold that rises and falls with the local noise and clutter, called constant false alarm rate (CFAR) detection, so a patch of rain doesn't fill the screen with false detections.
2. **Plot extraction.** The detections from one object on one sweep, which span a few beam positions and range cells, are merged into a single plot with one range, one bearing and a time.
3. **Tracking.** Each new plot is matched to an existing track, and a filter (often an alpha-beta or Kalman filter) smooths the positions and estimates course and speed. A new track starts tentative and is confirmed only after it has been seen on several sweeps.

A track behaves differently from a blip in three ways.

- Tracks lag. The course and speed are estimated from past plots, so after a sharp turn the velocity line points the old way for a few sweeps.
- Tracks coast. If one sweep gets no echo, the tracker carries the track forward on its last course and speed.
- Trails show history. The trail is the record of past plots, so its spacing shows speed (wide gaps are fast) and its shape shows turns. A slow ship's trail is a short line of dots close together; an airliner's is long.

## Primary and secondary radar

Air traffic control uses two radars together, and they show different things.

| | Primary surveillance radar (PSR) | Secondary surveillance radar (SSR) |
|---|---|---|
| How it works | Detects echoes of its own pulses reflected by any object | Sends an interrogation; the aircraft's transponder transmits a coded reply |
| What it sees | Aircraft, ships, birds, weather, terrain: anything that reflects | Only aircraft with a working transponder |
| What it measures | Range and bearing | Range and bearing, plus the reply's identity code and pressure altitude |
| On the screen | A blip or a primary-only track symbol | A track with a data block |

SSR interrogates on 1030 MHz and aircraft reply on 1090 MHz. The main reply modes are:

- **Mode A:** a four-digit identity code, the **squawk**, set by the pilot as the controller instructs. Each digit is 0 to 7, giving 4,096 codes. Three are reserved for emergencies: 7500 for unlawful interference (hijacking), 7600 for radio failure and 7700 for a general emergency.
- **Mode C:** the aircraft's pressure altitude, in 100 ft steps. It's displayed as a flight level: FL350 is 35,000 ft on the standard pressure setting.
- **Mode S:** selective interrogation of each aircraft by its unique 24-bit address, with room for more data such as the callsign.

The controller's data block shows the callsign or squawk and the flight level, and often the ground speed. Many control centres now also receive ADS-B, in which aircraft broadcast their own satellite navigation (GNSS) position, and merge it with the radar tracks into one track per aircraft.

A track with no transponder reply is primary-only. To a controller, that can be a light aircraft without a transponder, a flock of birds or a weather echo. To an air defence operator, it is an object whose identity is still to be established.

## Radar clutter and how to reduce it

**Clutter** is any unwanted echo. It can hide a real target that is on the screen.

| Clutter | What it looks like | Where | How operators reduce it |
|---|---|---|---|
| Sea clutter | A bright, speckled area round the centre that changes every sweep | Close to the radar, out to a few miles, stronger upwind and in rough seas | Sensitivity time control (STC, the "sea" control), which lowers the gain at short range |
| Rain clutter | A broad, grainy patch with soft edges, moving with the wind | Wherever there is rain, snow or hail | Fast time constant (FTC, the "rain" control), which keeps the edges of echoes and suppresses broad ones; circular polarisation; a lower frequency (S-band) radar |
| Ground clutter | Fixed, strong echoes from hills, buildings and coastlines | Over land, strongest close in | Moving target indication (MTI) and Doppler filters, which remove echoes that don't move; clutter maps |

Too much sea control removes a small boat inside the clutter along with the waves. Too much rain control can thin a real target to its edges. Moving target filters see only motion towards or away from the radar, so an aircraft flying at right angles to the beam can fade along with the ground clutter; this is called tangential fade. Modern radars reduce it by keeping a separate zero-velocity channel with a clutter map, so a strong crossing target can still be seen.

Weather radar is the opposite case: there the rain is the signal. For what the colours on a weather radar mean, see [how to read weather radar](/learn/applications/weather-radar/).

## Radar displays in air traffic control, at sea and in air defence

The PPI is the same idea everywhere, but each field adds its own layers.

| Setting | Typical range | What's added to the picture | Main question for the operator |
|---|---|---|---|
| Air traffic control | About 60 NM for an approach radar, 200 to 250 NM for a long-range en route radar | Video maps of airways, airports and boundaries; SSR data blocks; ADS-B tracks; conflict alerts | Are aircraft keeping the required separation? |
| Marine navigation | Chosen by the navigator: under a mile in harbour, tens of miles at sea | Range markers and bearing lines; target tracking with closest point of approach (CPA) and time to it (TCPA); AIS targets; charts | Will any vessel pass too close? |
| Air defence surveillance | Out to the radar horizon, often combining several radars | Identity symbols and colours; tracks from other sensors | What is each contact, and is any of them a threat? |

### Identity symbols and colours

Military displays show each track's identity with a frame shape and colour. The public symbol standards used by NATO forces (APP-6) and the US (MIL-STD-2525) define four basic identities. The colours are pale tints, and air tracks use the top half of each frame, open at the bottom:

| Identity | Colour | Frame on land | Frame for air tracks |
|---|---|---|---|
| Friend | Light blue | Rectangle | Dome |
| Neutral | Light green | Square | Top half of a square |
| Unknown | Light yellow | Quatrefoil (four-leaf clover) | Top half of a quatrefoil |
| Hostile | Light red | Diamond | Pointed top half of a diamond |

Identity is assigned by people and rules, not by the radar. An echo that hasn't been identified starts as unknown; the operator or the system changes it as information comes in.

## Common mistakes reading a radar display

- **Reading blip size as target size.** A blip's size comes from the beamwidth and the pulse length, and its brightness from how well the object reflects. A small boat with a metal mast can outshine a larger wooden one.
- **Forgetting the radar horizon.** The radar beam travels in a nearly straight line, so the curve of the Earth hides low targets. A radar 30 m above the sea and an aircraft 150 m above it can see each other only out to about 73 km (39 NM). No echo doesn't mean nothing is there.
- **Confusing bearing with heading.** Bearing is the direction from the radar to the target. Heading is where the target is pointing, shown by the velocity line or the trail, not by its position on the screen.
- **Trusting a track after a turn.** The velocity line is an estimate from past plots and lags a manoeuvre by a few sweeps.
- **Reading a head-up display as north-up.** On a head-up screen, 000° on the bezel is your bow, not north. Check the mode before reporting a bearing.
- **Turning the clutter controls up to clear the screen.** A clean picture can mean that weak targets have been removed with the clutter.
- **Assuming a missing label means a hostile.** A primary-only track can be a light aircraft without a transponder, birds or weather.

## How to build a radar display in JavaScript, React or Angular

Radar software has to redraw thousands of range and bearing cells and dozens of tracks every time the sweep moves, many times a second. The demo below is a simulated coastal surveillance radar: a 60 NM north-up PPI where the antenna turns once every 4 seconds and each turn stands for 12 seconds of real time. SciChart.js draws the radar video as a polar heatmap that fades like phosphor, with the sweep, coastline, trails and velocity lines as polar line and scatter series, and the data blocks as a polar text series. All the contacts, clutter and noise are synthetic and generic. The light aircraft is a weak echo that the radar sometimes misses, so its track coasts. The fast contact with no transponder reply starts as unknown and is declared hostile after eight sweeps, so you can see its symbol change. The symbols are simplified closed shapes in brighter colours than the standards use, so they read well on a dark screen.

Hover over a track to read its range, bearing, speed, heading and transponder reply, or anywhere else for the cursor's range and bearing. Untick **Trails** or **Labels** to declutter, tick **Clutter (filters off)** to see sea, rain and ground clutter, scroll to change the range scale and double-click to reset it.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="radar display" demo="polar-scatter-chart" demoLabel="polar scatter chart" docs="/2d-charts/chart-types/polar-xy-scatter-renderable-series/" docsLabel="SciChart.js polar scatter chart documentation" />

Here is the code for this chart. The scenario, the clutter and the simple tracker are plain JavaScript. SciChart.js draws the radar picture.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarGridlineMode,
        NumberRange,
        EAutoRange,
        PolarLineRenderableSeries,
        PolarXyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        PolarMouseWheelZoomModifier,
        PolarZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    const MAX_RANGE_NM = 60;
    const SWEEP_SECONDS = 4;

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // Bearing: 0° at the top, clockwise. Range: circular gridlines are the range rings
        sciChartSurface.xAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(0, 360),
                autoRange: EAutoRange.Never,
                startAngle: Math.PI / 2,
                flippedCoordinates: true,
                autoTicks: false,
                majorDelta: 30,
                labelPostfix: "°"
            })
        );
        sciChartSurface.yAxes.add(
            new PolarNumericAxis(wasmContext, {
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, MAX_RANGE_NM),
                autoRange: EAutoRange.Never,
                startAngle: Math.PI / 2,
                gridlineMode: EPolarGridlineMode.Circles,
                autoTicks: false,
                majorDelta: 10,
                labelPostfix: " NM"
            })
        );

        // The sweep line, and the tracks as bearing (x) and range (y) from your radar's track feed
        const sweep = new XyDataSeries(wasmContext, { xValues: [0, 0], yValues: [0, MAX_RANGE_NM] });
        const tracks = new XyDataSeries(wasmContext);
        sciChartSurface.renderableSeries.add(
            new PolarLineRenderableSeries(wasmContext, { dataSeries: sweep, stroke: "#D8FFE8", strokeThickness: 2 }),
            new PolarXyScatterRenderableSeries(wasmContext, {
                dataSeries: tracks,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 12, height: 12, fill: "#6CE07A40", stroke: "#6CE07A" })
            })
        );
        sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier(), new PolarZoomExtentsModifier());

        // Turn the sweep, and refresh the tracks the sweep has just passed
        const start = performance.now();
        let lastAngle = 0;
        const animate = (now: number) => {
            if (sciChartSurface.isDeleted) return;
            const angle = (((now - start) / 1000 / SWEEP_SECONDS) * 360) % 360;
            sweep.clear();
            sweep.appendRange([angle, angle], [0, MAX_RANGE_NM]);
            const { bearings, ranges } = getYourTracksBetween(lastAngle, angle);
            if (bearings.length > 0) {
                tracks.clear();
                tracks.appendRange(bearings, ranges);
            }
            lastAngle = angle;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        return { sciChartSurface };
    };

    export const RadarDisplay = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 600 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarGridlineMode,
        NumberRange,
        EAutoRange,
        PolarLineRenderableSeries,
        PolarXyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        PolarMouseWheelZoomModifier,
        PolarZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    const MAX_RANGE_NM = 60;
    const SWEEP_SECONDS = 4;

    @Component({
        selector: "app-radar-display",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 600px"></scichart-angular>`
    })
    export class RadarDisplayComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            // Bearing: 0° at the top, clockwise. Range: circular gridlines are the range rings
            sciChartSurface.xAxes.add(
                new PolarNumericAxis(wasmContext, {
                    polarAxisMode: EPolarAxisMode.Angular,
                    visibleRange: new NumberRange(0, 360),
                    autoRange: EAutoRange.Never,
                    startAngle: Math.PI / 2,
                    flippedCoordinates: true,
                    autoTicks: false,
                    majorDelta: 30,
                    labelPostfix: "°"
                })
            );
            sciChartSurface.yAxes.add(
                new PolarNumericAxis(wasmContext, {
                    polarAxisMode: EPolarAxisMode.Radial,
                    visibleRange: new NumberRange(0, MAX_RANGE_NM),
                    autoRange: EAutoRange.Never,
                    startAngle: Math.PI / 2,
                    gridlineMode: EPolarGridlineMode.Circles,
                    autoTicks: false,
                    majorDelta: 10,
                    labelPostfix: " NM"
                })
            );

            // The sweep line, and the tracks as bearing (x) and range (y) from your radar's track feed
            const sweep = new XyDataSeries(wasmContext, { xValues: [0, 0], yValues: [0, MAX_RANGE_NM] });
            const tracks = new XyDataSeries(wasmContext);
            sciChartSurface.renderableSeries.add(
                new PolarLineRenderableSeries(wasmContext, { dataSeries: sweep, stroke: "#D8FFE8", strokeThickness: 2 }),
                new PolarXyScatterRenderableSeries(wasmContext, {
                    dataSeries: tracks,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 12, height: 12, fill: "#6CE07A40", stroke: "#6CE07A" })
                })
            );
            sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier(), new PolarZoomExtentsModifier());

            // Turn the sweep, and refresh the tracks the sweep has just passed
            const start = performance.now();
            let lastAngle = 0;
            const animate = (now: number) => {
                if (sciChartSurface.isDeleted) return;
                const angle = (((now - start) / 1000 / SWEEP_SECONDS) * 360) % 360;
                sweep.clear();
                sweep.appendRange([angle, angle], [0, MAX_RANGE_NM]);
                const { bearings, ranges } = getYourTracksBetween(lastAngle, angle);
                if (bearings.length > 0) {
                    tracks.clear();
                    tracks.appendRange(bearings, ranges);
                }
                lastAngle = angle;
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The display is a `SciChartPolarSurface`. The angular `PolarNumericAxis` runs from 0 to 360° with `startAngle: Math.PI / 2` and `flippedCoordinates: true`, so 000° is at the top and bearings increase clockwise like a compass. The radial axis uses `EPolarGridlineMode.Circles`, so its gridlines are the range rings.
- The radar video is a `PolarUniformHeatmapRenderableSeries` with one cell per degree and half mile. Each frame multiplies every cell by a decay factor and the sweep writes fresh echoes into the cells it passes, which gives the afterglow. A colour map from transparent to bright green shows only the cells that are glowing.
- Tracks are `PolarXyScatterRenderableSeries` with a `SpritePointMarker` per identity, trails are a second scatter series, velocity lines and the coastline are `PolarLineRenderableSeries`, and data blocks are a `PolarTextRenderableSeries`.
- The animation runs on `requestAnimationFrame` and stops when `sciChartSurface.isDeleted` is true, so it ends cleanly when the chart is removed. A custom chart modifier converts the mouse position to bearing and range with the polar axes' own transforms for the readout.

**See it in the demo app:** [JavaScript polar scatter chart](https://www.scichart.com/demo/javascript/polar-scatter-chart) · [React polar scatter chart](https://www.scichart.com/demo/react/polar-scatter-chart) · [Angular polar scatter chart](https://www.scichart.com/demo/angular/polar-scatter-chart), and for the radar video, [JavaScript polar heatmap chart](https://www.scichart.com/demo/javascript/polar-uniform-heatmap-chart) · [React polar heatmap chart](https://www.scichart.com/demo/react/polar-uniform-heatmap-chart) · [Angular polar heatmap chart](https://www.scichart.com/demo/angular/polar-uniform-heatmap-chart).

**Go deeper:** [SciChart.js polar scatter chart documentation](/2d-charts/chart-types/polar-xy-scatter-renderable-series/), the [polar heatmap documentation](/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/), the [polar text series documentation](/2d-charts/chart-types/polar-text-renderable-series/), and the [antenna radiation pattern guide](/learn/applications/antenna-radiation-pattern/) for the beam that sets a radar's bearing resolution. For how aerospace and defence software uses SciChart, see [SciChart for aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What is a radar screen?

A radar screen, or radar display, shows what a radar has detected around it as a map seen from above. The radar is at the centre, the angle around the circle is the bearing from north, and the distance from the centre is the range. A sweep line turns with the antenna and refreshes each direction as it passes, and the echoes fade until the next sweep.

### What is a spot on a radar screen called?

A spot of light on a radar screen is called a blip. It is the echo of the radar's pulse from an object such as an aircraft, a ship, a hill or a rain shower. On a modern display, the computer also turns the blips from several sweeps into a track, shown as a symbol with a trail and a label.

### What do the circles on a radar screen mean?

The circles on a radar screen are range rings. Each one marks a fixed distance from the radar, such as every 10 nautical miles, so you can estimate how far away an echo is by counting rings. The scale around the edge gives the bearing, with 000 degrees at north on a north-up display.

### What is the difference between primary and secondary radar?

Primary radar detects the echo of its own pulse from any object, so it sees aircraft, ships, birds and weather without their cooperation, but measures only range and bearing. Secondary radar interrogates aircraft transponders, which reply with an identity code and pressure altitude. Air traffic control uses both: primary for everything that reflects, secondary for identity and altitude.

### Why does a radar screen have a sweeping line?

The sweeping line shows where the radar's antenna is pointing. A surveillance antenna has a narrow beam and turns continuously, so it sees one direction at a time. The display paints the echoes for each direction as the beam passes and lets them fade, so the picture is rebuilt once per rotation, every few seconds.

### How do I make a radar display in JavaScript?

Use a polar chart with an angular axis from 0 to 360 degrees, starting at the top and running clockwise, and a radial axis for range with circular gridlines as range rings. Draw the sweep as a polar line, the radar video as a polar heatmap that fades each frame, and tracks as polar scatter points updated when the sweep passes them. SciChart.js does this with SciChartPolarSurface in plain JavaScript, React or Angular.

## Sources

- [Radar Basics: PPI-Scope, the radar mile, CFAR, tracking and sensitivity time control](https://www.radartutorial.eu/12.scopes/en/sc11.en.html), C. Wolff, radartutorial.eu.
- [Aeronautical Information Manual, chapter 4, section 5: Surveillance Systems](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_5.html) and [section 1: transponder operation and emergency codes](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_1.html), US Federal Aviation Administration. Primary and secondary radar, ADS-B and squawk codes. Also [FAA Order 1812.8](https://www.faa.gov/documentLibrary/media/Order/1812.8.pdf) for a long-range radar's 250 NM coverage and 12 s scan.
- [Resolution MSC.192(79), Revised Performance Standards for Radar Equipment](https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/MSCResolutions/MSC.192(79).pdf), International Maritime Organization (2004). Display orientation and motion modes, trails, target tracking, CPA and TCPA on ship radars.
- Stone, M. L. et al. (1989), [Advances in primary-radar technology](https://www.ll.mit.edu/sites/default/files/publication/doc/advances-primary-radar-technology-stone-ja-6398.pdf), *The Lincoln Laboratory Journal*, 2(3). An airport surveillance radar's 60 NM range and 4.8 s update, clutter maps, CFAR, moving target detection and circular polarisation against rain.
- US Department of Defense (2022), MIL-STD-2525E, *Joint Military Symbology*; NATO (2023), APP-6(E), *NATO Joint Military Symbology*. Standard identity frames and colours.

<LearnCta position="bottom" chart="radar display" demo="polar-scatter-chart" demoLabel="polar scatter chart" docs="/2d-charts/chart-types/polar-xy-scatter-renderable-series/" docsLabel="SciChart.js polar scatter chart documentation" />
