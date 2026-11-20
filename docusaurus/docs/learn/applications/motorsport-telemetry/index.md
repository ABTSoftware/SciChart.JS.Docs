---
sidebar_position: 90
sidebar_label: Motorsport Telemetry
title: "Motorsport Telemetry: How to Read Lap Traces and Compare Laps (With an Interactive Example)"
description: "What motorsport and sim racing telemetry records, why lap traces are plotted against distance, how to read braking, throttle and the time-delta trace, and how to compare two laps."
keywords:
    [
        "motorsport telemetry",
        "racing telemetry",
        "sim racing telemetry",
        "car telemetry",
        "race car telemetry",
        "how to read racing telemetry",
        "telemetry data analysis racing",
        "racing data analysis",
        "motorsport data acquisition",
        "lap comparison",
        "lap trace",
        "time delta trace",
        "g-g diagram"
    ]
image: /img/learn/motorsport-telemetry-og.png
related: [telemetry, strip-chart, time-series-graph, downsampling]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is racing telemetry?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Racing telemetry is the data a race car or racing simulator records about every moment of a lap: speed, throttle and brake pedal positions, steering, gear, engine speed, g-forces and position on the track. Engineers and drivers chart it against lap distance to see exactly where, and why, one lap is faster than another." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read racing telemetry?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Overlay your lap on a faster reference lap, both plotted against lap distance. Start with the time-delta trace to find the corners where most time is lost, then read the speed, brake and throttle traces at those corners: where each lap starts braking, how much speed it carries through the slowest point, and how soon it gets back to full throttle." }
                },
                {
                    "@type": "Question",
                    "name": "What does delta mean in racing telemetry?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Delta is the running time gap between two laps at the same point on the track: the time one lap took to reach that distance minus the time the reference lap took. Its value is the gap so far; its slope shows where the gap is changing. Where the line climbs, the lap is losing time to the reference; where it falls, it is gaining." }
                },
                {
                    "@type": "Question",
                    "name": "Why is racing telemetry plotted against distance instead of time?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Because two laps are only comparable at the same place on the track. A slower lap reaches every corner later, so on a time axis its braking points drift further to the right of the faster lap's with every corner. Plotting against lap distance keeps each corner at the same x position for every lap." }
                },
                {
                    "@type": "Question",
                    "name": "How does sim racing telemetry work?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Most racing simulators can send telemetry from the game as UDP network packets, several dozen times a second, or write it to a file at the end of a session. A separate program on the same computer or network receives the packets, decodes the channels, and charts and stores the laps, just as a data logger does on a real race car." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a lap comparison chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Interpolate each lap's channels onto lap distance, compute the time delta at each distance, and draw one chart pane per channel with both laps as overlaid line series. With SciChart.js, use FastLineRenderableSeries for the traces, SciChartVerticalGroup to line the panes up, a CursorModifier with a shared modifierGroup for one crosshair across all panes, and synchronised x-axes for zooming. The same code works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Motorsport Telemetry

## What is motorsport telemetry?

**Motorsport telemetry** is the data a race car, or a racing simulator, records about every moment of a lap: speed, pedal positions, steering, gear, engine speed, g-forces and position on the track. Drivers and engineers chart it as lap traces against distance and compare laps, to find where and why one lap is faster.

![Two real laps of the same circuit compared in a dark navy theme: stacked speed, throttle, brake, gear and time-delta traces against lap distance on the left, with the faster lap in blue and the slower lap in orange; on the right, a track map coloured by where the slower lap loses time, a polar g-g diagram and a polar speed gauge](/img/learn/motorsport-telemetry-og.png)

*Two laps of the same circuit from a racing simulator, recorded at a SciChart demo and anonymised: speed, throttle, brake, gear and the time delta against distance, with a track map and two polar charts. [Try the interactive version](#how-to-build-a-lap-comparison-dashboard-in-javascript-react-or-angular).*

:::tip Key takeaways
- Telemetry channels are logged against time, then plotted against lap distance, so every lap's corners line up.
- Each corner reads as a pattern: braking point, peak brake pressure, release, minimum speed, throttle pickup, full throttle.
- The time-delta trace is the gap to a reference lap at each point on the track. A rising line means time lost.
- A slow corner exit costs time all the way down the next straight, so the delta keeps climbing after the corner.
- In the example on this page, two corners account for 1.7 of the 2.7 seconds between the laps.
:::

The same methods apply to a club car with a data logger, a professional team's car, a kart and a racing simulator. Racing teams call the whole discipline **data acquisition**: the sensors, the logger that records them, and the analysis afterwards. Telemetry, strictly, is the subset sent live to the pit wall by radio; most analysis is done on the full logged data once the car is back in the garage. For the wider engineering meaning, see [telemetry](/learn/applications/telemetry/).

## What does motorsport telemetry record?

Every sensor becomes a **channel**: a series of values with a unit and its own sample rate. These are the channels most lap analysis uses.

| Channel | Unit | What it tells you | Minimum suggested logging rate |
| --- | --- | --- | --- |
| Speed (GPS or wheel speed) | km/h or mph | How fast the car is at each point; corners show as dips | 10 Hz (GPS), 20 Hz (wheel speed) |
| Throttle position | % | How far the accelerator pedal is pressed | 20 Hz |
| Brake pressure | bar or % | When braking starts, how hard, and how it is released | 20 Hz |
| Steering angle | degrees | How much lock the driver uses; corrections show as saw-tooth wiggles | 20 Hz |
| Gear | 1, 2, 3… | Gear changes and the gear used through each corner | 10 Hz |
| Engine speed | rpm | Shift points, and wheelspin as a sudden rise | 20 Hz |
| Lateral and longitudinal g | g | Cornering, braking and acceleration forces | 20 Hz |
| Position (GPS or the game's world coordinates) | metres | The racing line, for a track map | 10 Hz |
| Lap distance | metres | Where on the lap each sample was taken | Derived from speed or position |

The rates in the last column are the minimums suggested by High Performance Academy's data-logging guide; suspension movement needs much more, at least 250 Hz. The laps on this page were logged by the simulator at roughly 30 samples a second, about one sample every 2.5 m at 300 km/h.

## Why are lap traces plotted against distance, not time?

A logger records each sample with a time stamp. For comparing laps, though, the x-axis is almost always **lap distance**: metres from the start line.

Two laps are only comparable at the same place on the track. A lap that is 0.2 seconds slower into the first corner reaches the second corner 0.2 seconds later, the third later still, and so on. On a time axis, the slower lap's braking points drift further right with every corner, and by mid-lap you are comparing one car's braking with the other car's straight. On a distance axis, corner 4 is at the same x position for every lap, so the traces overlay and any difference is a real difference in driving.

To plot by distance, each lap's samples are matched to distance: integrate speed over time, or use the distance channel the logger or game provides. Lap distance has its own error, especially from wheel-speed integration over a long lap. Mitchell's SAE paper on data alignment shows laps lined up to within about a metre by matching patterns in the data, such as suspension movement over bumps, instead of trusting distance alone.

The time-delta trace then turns the difference between two laps back into seconds at each point on the track.

## How to read a corner in lap traces

Every corner leaves the same pattern in the speed, brake and throttle traces.

![Speed, brake and throttle traces through one corner, against distance: speed falls from the braking point to the minimum corner speed at the apex and rises on the exit; brake pressure jumps to its peak at the braking point and is released gradually into the corner; the throttle drops to zero, stays at zero through a short coast, then rises from the throttle pickup to full throttle](./corner-trace-anatomy.svg)

- Braking point. The throttle trace drops and the brake trace jumps, usually within a few metres of each other. A later braking point means more time at full speed; the limit is whether the car can still make the corner.
- Peak pressure and release. A sharp rise to peak pressure uses the tyres' grip while the car is fastest and most stable. Easing off the brake gradually as the steering goes in is **trail braking**: it keeps weight on the front tyres and helps the car turn.
- Minimum corner speed. The bottom of the dip in the speed trace, usually near the apex, the point where the car comes closest to the inside of the corner. A V-shaped dip means the driver braked late and turned sharply; a wider, rounder dip means more speed carried through a longer arc.
- Coasting. A gap where neither pedal is pressed. The car is slowing on drag alone, which is slower than braking and slower than accelerating, so a long coast usually marks hesitation.
- Throttle pickup and full throttle. How soon the throttle goes back down, and how quickly it reaches 100%. A stepped or wavering rise suggests the car is sliding or the driver is unsure of the grip.
- Gear changes. Downshifts appear as steps during braking; the lowest gear sits at the minimum speed. Using a gear lower or higher than the reference lap often explains a different exit speed.

Read the traces together, never one at a time: a lower minimum speed might come from braking too early, braking too late and running wide, or a mistake at the apex. The brake and throttle traces say which.

## What is the time-delta trace?

The **time-delta trace** (also called delta, time slip or variance) shows the running time gap between two laps at each point on the track. At distance *d*, it is the time the comparison lap took to reach *d* minus the time the reference lap took to reach the same *d*.

To compute it, you need each lap's elapsed time against distance. For each sample of the reference lap at distance *d*, find the comparison lap's time at the same *d* by interpolating between its two nearest samples, and subtract. The two laps never have samples at exactly the same distances, so this interpolation is the step that aligns them.

How to read it:

- The value is the gap so far. At the finish line it equals the difference in lap times.
- The slope shows where the gap changes. A rising line means the comparison lap is losing time there; a falling line means it is gaining. A flat line means both laps are equally fast through that stretch.
- Steep rises usually start at a corner and keep going down the following straight, because a slower exit speed costs time all the way to the next braking point.

### Worked example: where Lap B loses 2.7 seconds

The two laps in this guide's demo were driven by two different drivers on the same circuit in a racing simulator. Lap A took 82.010 s and Lap B 84.738 s, so Lap B finishes 2.728 s behind. Lap B was slower in every sector: by 0.583 s, 0.691 s and 1.454 s.

At 1,800 m, just before corner 4, Lap A has taken 29.18 s and Lap B 29.90 s: a delta of 0.72 s. At 2,400 m, after the straight that follows, the times are 38.27 s and 39.65 s: a delta of 1.38 s. Lap B lost 0.67 s in those 600 m, most of it on the straight, after the corner itself.

The table splits the lap into zones, each running from halfway after the previous corner to halfway after this one, and gives the change in delta across each. The zones add up to the 2.73 s gap, give or take rounding.

| Corner (distance) | Minimum speed, Lap A / Lap B | Time Lap B loses | What the traces show |
| --- | --- | --- | --- |
| 1 (356 m) | 155 / 155 km/h | 0.05 s | Lap B brakes slightly later and lighter, carries up to 29 km/h more into the corner and is 0.19 s ahead by 380 m, but reaches full throttle 40 m later and gives it all back on the exit |
| 2 and 3 (1,110–1,265 m) | 107 / 98 and 139 / 142 km/h | 0.52 s | A slower first apex in the chicane |
| 4 (1,884 m) | 168 / 153 km/h | 0.83 s | Braking within 6 m of Lap A, but 15 km/h less at the apex and full throttle 40 m later; Lap B's lateral g spikes to over 9 g there, most likely a kerb strike |
| 5 and 6 (3,309–3,454 m) | 204 / 207 and 216 / 210 km/h | 0.08 s | Almost identical |
| 7 (4,148 m) | 112 / 89 km/h | 0.38 s | 23 km/h slower at the apex |
| 8 (4,409 m) | 199 / 198 km/h | 0.06 s | Almost identical |
| 9 (4,675 m) | 90 / 61 km/h | 0.83 s | Same braking point, but Lap B stays on the brake past Lap A's release and slows to 61 km/h |

Corners 4 and 9 cost Lap B 1.66 s, about 60% of the gap. In both, Lap B starts braking where Lap A does; the time goes at the apex and on the exit. A coach would work on those two corners first. At corner 1, Lap B's later, deeper entry gains time for a moment and loses it again on the exit.

These figures come from the demo's data. The delta uses elapsed times derived from each lap's logged speed and distance, scaled to the official lap times. Corner numbers are this guide's own, for the slower corners only.

## Track maps and the g-g diagram

A **track map** draws the racing line from the car's position channels (GPS on a real car, world coordinates in a simulator). Coloured by speed, it shows the braking zones and slow corners at a glance. Coloured by the slope of the time delta, it shows where on the circuit the comparison lap gains or loses time, which is often easier to discuss with a driver than a trace. A marker that follows the cursor on the traces links the two: hover over a dip in the speed trace and the map shows which corner it is.

A **g-g diagram**, also called a friction circle, plots each sample's lateral g against its longitudinal g. Every point is one moment of the lap. The edge of the cloud is the car's grip limit: braking at the bottom, acceleration at the top (limited by engine power as well as grip), cornering at the sides. A driver who uses the tyres fully traces the outline of that envelope, blending braking into cornering; gaps in the edge, especially at the diagonals, show where grip was left unused. Drawn as a polar chart, the angle is the direction of the force and the distance from the centre is its size.

## How to compare laps

- Pick a reference lap. Usually your own best lap, a team-mate's best, or a coach's lap in the same car and conditions. A reference from a different car, tyre or fuel load tells you about the car, not the driving.
- Find the biggest losses first. Read the delta trace for its steepest rises, then go to those corners in the speed, brake and throttle traces. Fixing the two corners that cost the most is worth more than polishing all of them.
- Change one thing at a time. Brake 5 m later in one corner, then compare again.
- Check consistency over many laps. Overlay ten laps from one session: where the traces spread apart, the driver isn't repeating the corner the same way, and the best lap there may be luck. A consistent corner that is still slow is a technique or set-up question.
- Watch the exits. Minimum speed and throttle pickup set the speed for the whole of the next straight.

## Sim racing telemetry vs real car data acquisition

| | Racing simulator | Real race car |
| --- | --- | --- |
| Where the data comes from | The game's physics engine, sent as UDP packets over the network or written to a file | Sensors wired to a data logger in the car |
| Channels | Everything the physics model knows, including tyre temperatures and positions in world coordinates | Only the sensors fitted; more sensors mean more cost and weight |
| Sample rate | Fixed by the game, often a few dozen packets a second | Set per channel, from 1 Hz for temperatures to hundreds of hertz for suspension |
| Noise and errors | Clean values, no sensor faults | Sensor noise, drift, dropouts and calibration errors |
| Live link | The whole stream, on the same computer or network | Usually a subset sent by radio; the full log is downloaded after the session |
| Typical use | Learning a track, coaching, comparing with other drivers' laps | Engineering the car and coaching the driver |

The traces read the same way, so sim racing is a cheap way to learn telemetry analysis. Whichever the source, the data is a set of [time series](/learn/real-time/time-series-graph/), displayed live as [strip charts](/learn/real-time/strip-chart/) and analysed afterwards lap by lap. For storing and sending it efficiently, see [time series data formats](/learn/big-data/time-series-data-formats/).

## Common lap comparison mistakes

- **Using time as the x-axis.** The laps drift apart corner by corner, and by mid-lap you are comparing different parts of the track. Plot against lap distance.
- **Comparing laps that aren't aligned.** If one lap's distance channel starts from a different line or has drifted, braking points appear tens of metres apart when they aren't. Line laps up at the start line and check that a known feature, such as a hard braking point, sits at the same distance in both.
- **Reading the delta's height instead of its slope.** A delta of 1.4 s at 3,000 m doesn't mean the driver is losing time there; on the example lap it was lost at corner 4 and the line is flat after it. Look for where the line rises.
- **Blaming the braking point for every lost corner.** In the example, Lap B brakes where Lap A does in its two worst corners. The loss is at the apex and on the exit.
- **Comparing against one lap only.** A single reference lap can contain a lucky corner, and a single lap of yours can contain a one-off mistake. Compare several laps before changing anything.
- **Trusting single-sample spikes.** A kerb strike can show as a 9 g spike that the car never sustained. Zoom in before believing an extreme value.
- **Downsampling the traces naively.** Drawing every 10th sample of a long session can hide a short lock-up or a gear change. Use a [downsampling](/learn/big-data/downsampling/) method that keeps peaks, or a renderer fast enough to draw every point.

## How to build a lap comparison dashboard in JavaScript, React or Angular

SciChart.js draws charts with WebGL and WebGPU, so a lap comparison can show several laps of thousands of samples in many synchronised panes and still follow the cursor, zoom and pan without lag. SciChart built a full racing telemetry dashboard this way, with more than 30 live charts, replay and lap analysis, and showed it at a developer conference in 2026:

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/U9xYKn16nhA" title="SciChart's real-time racing telemetry dashboard: 30+ live charts and post-race lap analysis" />

That dashboard receives the simulator's telemetry as a plain JSON stream, which is fine at these data rates. A Web Worker turns each message into one `Float64Array` per channel before it reaches the charts. For higher rates or longer recordings, binary, columnar and compressed formats load faster: see [time series data formats](/learn/big-data/time-series-data-formats/).

The demo below is a small subset of that dashboard, with the two real laps from the worked example embedded in the page. Hover over any trace: the crosshair, the track map marker, the g-g diagram and the speed gauge all follow. Use **Zoom to** to jump to a corner, and **Colour the track map by** to switch between where Lap B gains or loses time and Lap A's speed. Press **Replay both laps** to watch both cars at the same moment of their laps, with the gap in metres. Scroll to zoom, drag to pan, and double-click to see the whole lap again.

<LiveDocSnippet maxWidth={'100%'} height={900} name="./Basic/demo" />

<LearnCta position="top" chart="racing telemetry dashboard" demo="sync-multi-chart" demoLabel="synchronised multi-chart" docs="/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/" docsLabel="SciChart.js chart synchronisation documentation" />

Here is the code. The lap data is stored as compact binary columns in base64 (about 53 KB for both laps) and decoded into typed arrays; SciChart.js draws the panes, the map and the polar charts.

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
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Each lap: columns of equal length, with lap distance (m) and elapsed time (s) for every sample
    type Lap = { name: string; colour: string; distance: Float64Array; time: Float64Array; [channel: string]: any };
    const laps: Lap[] = getYourLaps(); // e.g. [referenceLap, yourLap]

    // Linear interpolation of ys at x, over xs sorted ascending
    const interpolate = (xs: Float64Array, ys: Float64Array, x: number) => {
        let lo = 0;
        let hi = xs.length - 1;
        if (x <= xs[lo]) return ys[lo];
        if (x >= xs[hi]) return ys[hi];
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (xs[mid] <= x) lo = mid;
            else hi = mid;
        }
        return ys[lo] + ((x - xs[lo]) / (xs[hi] - xs[lo])) * (ys[hi] - ys[lo]);
    };
    // Time delta: the second lap's time minus the reference lap's time, at the reference lap's distances
    const [reference, comparison] = laps;
    const delta = reference.distance.map((d, i) => interpolate(comparison.distance, comparison.time, d) - reference.time[i]);

    const panes = [
        { title: "Speed (km/h)", channel: "speed", range: new NumberRange(0, 350) },
        { title: "Throttle (%)", channel: "throttle", range: new NumberRange(-5, 105) },
        { title: "Brake (%)", channel: "brake", range: new NumberRange(-5, 105) },
        { title: "Delta (s)", channel: "delta", range: new NumberRange(-1, 3) }
    ];
    const group = new SciChartVerticalGroup(); // lines up the panes' y-axes, so their distance axes match
    const xAxes: NumericAxis[] = [];

    const makePane = (pane: (typeof panes)[number]) => async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Lap distance (m)", autoRange: EAutoRange.Once });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: pane.title, autoRange: EAutoRange.Never, visibleRange: pane.range }));
        // One line per lap, or the delta
        const series =
            pane.channel === "delta"
                ? [{ name: "Delta", colour: "#F6E05E", x: reference.distance, y: delta }]
                : laps.map((lap) => ({ name: lap.name, colour: lap.colour, x: lap.distance, y: lap[pane.channel] }));
        for (const s of series) {
            const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: s.name, xValues: s.x, yValues: s.y, isSorted: true });
            sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: s.colour, strokeThickness: 2 }));
        }
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "laps", showTooltip: true }), // one crosshair on every pane
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        group.addSurfaceToGroup(sciChartSurface);
        // Zooming or panning one pane moves the others
        xAxes.push(xAxis);
        xAxis.visibleRangeChanged.subscribe(({ visibleRange }) =>
            xAxes.forEach((other) => {
                if (other !== xAxis && !other.visibleRange.equals(visibleRange)) other.visibleRange = visibleRange;
            })
        );
        return { sciChartSurface };
    };
    const paneInits = panes.map(makePane);

    // One SciChartReact per pane; SciChartReact creates each chart, sizes it and cleans it up
    export const LapComparison = () => (
        <div>
            {paneInits.map((initChart, index) => (
                <SciChartReact key={panes[index].channel} initChart={initChart} style={{ width: "100%", height: 180 }} />
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
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Each lap: columns of equal length, with lap distance (m) and elapsed time (s) for every sample
    type Lap = { name: string; colour: string; distance: Float64Array; time: Float64Array; [channel: string]: any };
    const laps: Lap[] = getYourLaps(); // e.g. [referenceLap, yourLap]

    // Linear interpolation of ys at x, over xs sorted ascending
    const interpolate = (xs: Float64Array, ys: Float64Array, x: number) => {
        let lo = 0;
        let hi = xs.length - 1;
        if (x <= xs[lo]) return ys[lo];
        if (x >= xs[hi]) return ys[hi];
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (xs[mid] <= x) lo = mid;
            else hi = mid;
        }
        return ys[lo] + ((x - xs[lo]) / (xs[hi] - xs[lo])) * (ys[hi] - ys[lo]);
    };
    // Time delta: the second lap's time minus the reference lap's time, at the reference lap's distances
    const [reference, comparison] = laps;
    const delta = reference.distance.map((d, i) => interpolate(comparison.distance, comparison.time, d) - reference.time[i]);

    const panes = [
        { title: "Speed (km/h)", channel: "speed", range: new NumberRange(0, 350) },
        { title: "Throttle (%)", channel: "throttle", range: new NumberRange(-5, 105) },
        { title: "Brake (%)", channel: "brake", range: new NumberRange(-5, 105) },
        { title: "Delta (s)", channel: "delta", range: new NumberRange(-1, 3) }
    ];
    const group = new SciChartVerticalGroup(); // lines up the panes' y-axes, so their distance axes match
    const xAxes: NumericAxis[] = [];

    const makePane = (pane: (typeof panes)[number]) => async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Lap distance (m)", autoRange: EAutoRange.Once });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: pane.title, autoRange: EAutoRange.Never, visibleRange: pane.range }));
        // One line per lap, or the delta
        const series =
            pane.channel === "delta"
                ? [{ name: "Delta", colour: "#F6E05E", x: reference.distance, y: delta }]
                : laps.map((lap) => ({ name: lap.name, colour: lap.colour, x: lap.distance, y: lap[pane.channel] }));
        for (const s of series) {
            const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: s.name, xValues: s.x, yValues: s.y, isSorted: true });
            sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: s.colour, strokeThickness: 2 }));
        }
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "laps", showTooltip: true }), // one crosshair on every pane
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        group.addSurfaceToGroup(sciChartSurface);
        // Zooming or panning one pane moves the others
        xAxes.push(xAxis);
        xAxis.visibleRangeChanged.subscribe(({ visibleRange }) =>
            xAxes.forEach((other) => {
                if (other !== xAxis && !other.visibleRange.equals(visibleRange)) other.visibleRange = visibleRange;
            })
        );
        return { sciChartSurface };
    };

    @Component({
        selector: "app-lap-comparison",
        standalone: true,
        imports: [ScichartAngularComponent],
        // One scichart-angular per pane; it creates each chart, sizes it and cleans it up
        template: `
            @for (initChart of paneInits; track $index) {
                <scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 180px"></scichart-angular>
            }
        `
    })
    export class LapComparisonComponent {
        paneInits = panes.map(makePane);
    }
    ```
</CodeSnippetBlock>

Key points:

- Each lap trace pane is its own `SciChartSurface` with a `FastLineRenderableSeries` per lap. `SciChartVerticalGroup` gives every pane the same y-axis width so the distance axes line up, and a `CursorModifier` with a shared `modifierGroup` draws one crosshair across all of them.
- The time delta is plain JavaScript: interpolate one lap's elapsed time at the other lap's distances and subtract. Any two laps work, whatever their sample rates.
- A small `CustomChartModifier2D` turns the mouse position into a lap distance, which moves the markers on the track map and the polar charts. The track map is a line series with a palette provider that colours each point.
- The g-g diagram is a `SciChartPolarSurface` with a `PolarXyScatterRenderableSeries`; the speed gauge uses `PolarArcAnnotation` arcs on a 270° angular axis.

**See it in the demo app:** [JavaScript synchronised multi-chart](https://www.scichart.com/demo/javascript/sync-multi-chart) · [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart) · [Angular synchronised multi-chart](https://www.scichart.com/demo/angular/sync-multi-chart). Related techniques: the [React multi-chart dashboard](https://www.scichart.com/demo/react/multiple-chart-dashboard-performance-demo), [React polar gauge dashboard](https://www.scichart.com/demo/react/polar-gauge-fifo-dashboard), [React polar line chart](https://www.scichart.com/demo/react/polar-line-chart) and [React real-time chart performance](https://www.scichart.com/demo/react/chart-realtime-performance-demo).

**Go deeper:** [SciChart.js chart synchronisation documentation](/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/), the [line chart](/2d-charts/chart-types/fast-line-renderable-series/), [polar scatter](/2d-charts/chart-types/polar-xy-scatter-renderable-series/), [polar arc annotation](/2d-charts/annotations-api/polar-arc-annotation/), [custom modifiers](/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/) and [palette provider](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/) pages, and the learning center guides to [telemetry](/learn/applications/telemetry/) and [time series data formats](/learn/big-data/time-series-data-formats/). For test and measurement work in industry, see SciChart for [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/) and [design, emulation and test](https://www.scichart.com/design-emulation-test/).

## Frequently asked questions

### What is racing telemetry?

Racing telemetry is the data a race car or racing simulator records about every moment of a lap: speed, throttle and brake pedal positions, steering, gear, engine speed, g-forces and position on the track. Engineers and drivers chart it against lap distance to see exactly where, and why, one lap is faster than another.

### How do you read racing telemetry?

Overlay your lap on a faster reference lap, both plotted against lap distance. Start with the time-delta trace to find the corners where most time is lost, then read the speed, brake and throttle traces at those corners: where each lap starts braking, how much speed it carries through the slowest point, and how soon it gets back to full throttle.

### What does delta mean in racing telemetry?

Delta is the running time gap between two laps at the same point on the track: the time one lap took to reach that distance minus the time the reference lap took. Its value is the gap so far; its slope shows where the gap is changing. Where the line climbs, the lap is losing time to the reference; where it falls, it is gaining.

### Why is racing telemetry plotted against distance instead of time?

Because two laps are only comparable at the same place on the track. A slower lap reaches every corner later, so on a time axis its braking points drift further to the right of the faster lap's with every corner. Plotting against lap distance keeps each corner at the same x position for every lap.

### How does sim racing telemetry work?

Most racing simulators can send telemetry from the game as UDP network packets, several dozen times a second, or write it to a file at the end of a session. A separate program on the same computer or network receives the packets, decodes the channels, and charts and stores the laps, just as a data logger does on a real race car.

### How do I make a lap comparison chart in JavaScript?

Interpolate each lap's channels onto lap distance, compute the time delta at each distance, and draw one chart pane per channel with both laps as overlaid line series. With SciChart.js, use `FastLineRenderableSeries` for the traces, `SciChartVerticalGroup` to line the panes up, a `CursorModifier` with a shared `modifierGroup` for one crosshair across all panes, and synchronised x-axes for zooming. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- High Performance Academy, [Data Logging Frequencies](https://www.hpacademy.com/assets/Course-Content/Professional-Data-Course/24af8b0f4e/HPA_Data-Logging-Rates.pdf). Minimum suggested logging rates for driver, chassis and powertrain channels.
- Mitchell, W. C. (1998), [A Method for Data Alignment](https://saemobilus.sae.org/papers/a-method-data-alignment-983087). SAE Technical Paper 983087. Aligning laps by matching patterns in the data rather than by distance alone.
- Segers, J. (2014), [Analysis Techniques for Racecar Data Acquisition](https://saemobilus.sae.org/content/R-408), 2nd edition. SAE International. Lap comparison, time slip and the analysis of driver and vehicle channels.
- Milliken, W. F. and Milliken, D. L., [Race Car Vehicle Dynamics](https://saemobilus.sae.org/content/R-146). SAE International. The g-g diagram and the friction circle.
- Postel, J. (1980), [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768). The UDP packets racing simulators use to send telemetry.

<LearnCta position="bottom" chart="racing telemetry dashboard" demo="sync-multi-chart" demoLabel="synchronised multi-chart" docs="/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/" docsLabel="SciChart.js chart synchronisation documentation" />
