---
sidebar_position: 40
sidebar_label: Direction Finding and TDOA
title: "Radio Direction Finding and TDOA: How to Locate a Transmitter"
description: "How radio direction finding and TDOA locate a transmitter: DF methods, how to read a DF display, triangulation, error ellipses, hyperbolas and GDOP, with a live demo."
keywords:
    [
        "direction finding",
        "radio direction finding",
        "tdoa",
        "time difference of arrival",
        "angle of arrival",
        "triangulation",
        "df display",
        "cocked hat",
        "error ellipse",
        "gdop",
        "fdoa",
        "watson-watt direction finder",
        "doppler direction finding",
        "aoa vs tdoa"
    ]
image: /img/learn/direction-finding-og.png
related: [sigint, rf-spectrum-analyzer, antenna-radiation-pattern, autocorrelation]
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
                    "name": "What is radio direction finding?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Radio direction finding (RDF or DF) measures the direction a radio signal arrives from, using an antenna array or a turning antenna. One receiver gives a bearing: a line from the receiver towards the transmitter. Bearings from two or more receivers in different places cross at the transmitter's position, which is called a fix." }
                },
                {
                    "@type": "Question",
                    "name": "What is TDOA?",
                    "acceptedAnswer": { "@type": "Answer", "text": "TDOA (time difference of arrival) locates a transmitter from the differences in the time its signal reaches several receivers with synchronised clocks. Each microsecond of difference means the transmitter is about 300 m closer to one receiver than the other. One time difference puts the transmitter on a hyperbola; two or more, from three or more receivers, cross at its position." }
                },
                {
                    "@type": "Question",
                    "name": "How many receivers do you need to locate a transmitter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With bearings, two receivers give a fix where their lines cross, but three are better: they show whether the bearings agree and keep the fix usable when two lines cross at a shallow angle. With TDOA, two receivers give only a hyperbola, and at least three are needed for a position on a map. A fourth TDOA receiver adds a check that can expose a bad measurement." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between AOA and TDOA?",
                    "acceptedAnswer": { "@type": "Answer", "text": "AOA (angle of arrival) measures the direction of the signal at each site with a direction-finding antenna array, and the fix is where the bearing lines cross. TDOA measures arrival times at simple antennas with very accurate synchronised clocks, and the fix is where hyperbolas cross. AOA works on narrowband and unmodulated signals; TDOA needs signal bandwidth but locates wideband signals well. Many systems combine both." }
                },
                {
                    "@type": "Question",
                    "name": "What is a cocked hat in direction finding?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A cocked hat is the small triangle formed when three bearing lines don't meet at one point because each has a small error. The transmitter is not always inside it: if each line is equally likely to fall either side of the true position, the chance is only one in four. Modern systems draw an error ellipse instead, sized from the bearing errors and the geometry." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a direction finding display in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a polar chart with the angular axis running 0 to 360 degrees clockwise from the top, and draw the latest bearing as a polar line from the centre to the rim, the spread as a polar column wedge and past bearings as polar scatter points. For the fix, use an x-y chart in km with line series for the bearing lines, hyperbolas and error ellipse. SciChart.js does this in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Radio Direction Finding and TDOA

## What is radio direction finding?

**Radio direction finding** (RDF, or DF) measures the direction a radio signal comes from, using a turning antenna or an antenna array. One receiver gives a bearing, a line pointing towards the transmitter. Bearings from two or more separate receivers cross at the transmitter's position, called a fix. **TDOA** (time difference of arrival) finds a fix from arrival times instead.

![A simulated direction finding network in a dark navy theme. On the left, a compass-rose DF display for receiver B shows a bright cyan strobe at the current bearing, a shaded wedge for the spread of recent bearings and a trail of fading dots for past bearings. On the right, a map with a km grid shows three receivers, A, B and C, as triangles, their three bearing lines crossing near the middle, a white error ellipse around the fix, a cloud of past fixes and a red cross for the true simulated transmitter inside the ellipse](/img/learn/direction-finding-og.png)

*A simulated DF network: the DF display for one receiver, and three bearings crossing at a fix with its 95% error ellipse. [Try the interactive version](#how-to-build-a-direction-finding-display-in-javascript-react-or-angular).*

:::tip Key takeaways

- A direction finder measures a bearing; two or more bearings from separate sites cross at a fix. This is triangulation, or AOA (angle of arrival) location.
- On a DF display, the strobe is the latest bearing, and the spread of recent bearings shows how far to trust it.
- Bearing errors grow with distance and are magnified when lines cross at a shallow angle. The error ellipse shows the area the transmitter is probably in.
- TDOA uses arrival-time differences: about 300 m per microsecond. Each difference puts the transmitter on a hyperbola, and two hyperbolas from three receivers cross at a fix.
- Multipath, poor site geometry and, for TDOA, clock errors are the main causes of a wrong fix.

:::

## What direction finding is used for

Direction finding is older than radar. Early direction finders helped ships and aircraft navigate by taking bearings on radio stations at known positions. Today it is mostly used the other way round: to find a transmitter whose position is unknown.

- Search and rescue. Distress beacons on 406 MHz are found by the Cospas-Sarsat satellite system: ELTs (emergency locator transmitters) on aircraft, EPIRBs (emergency position-indicating radio beacons) on ships and PLBs (personal locator beacons) carried by walkers and sailors. The newest satellites in medium Earth orbit (MEOSAR) locate a beacon from the differences in the time and frequency of its signal at several satellites, from as little as a single burst. Many beacons also send a low-power 121.5 MHz signal that rescue aircraft and boats home in on with a direction finder.
- Spectrum management. National regulators run networks of fixed and mobile monitoring stations to find sources of interference and unlicensed transmitters. The International Telecommunication Union (ITU) handbook on spectrum monitoring describes how they do it, with both bearings and TDOA.
- Amateur radio direction finding (ARDF, or "fox hunting"). Competitors run through a forest with a handheld receiver and directional antenna to find hidden transmitters. International competitions use the 3.5 MHz (80 m) and 144 MHz (2 m) amateur bands.
- Wildlife tracking. Biologists fit animals with small VHF transmitters and take bearings with a handheld directional antenna from two or three spots, then cross them on a map.
- Signals intelligence. Locating an emitter is one of the core tasks of SIGINT, alongside finding signals and analysing them. See [what SIGINT is and how to read a SIGINT dashboard](/learn/applications/sigint/). Intercepting and locating other people's communications is regulated by law and done by authorised agencies.

## How a direction finder measures a bearing

Every DF method compares what the signal does at antennas in different places or orientations. The main families are below; the ITU handbook gives a fuller comparison.

| Method | What it measures | Strengths | Weaknesses |
|---|---|---|---|
| Rotating loop or directional antenna | Signal strength as the antenna turns; the bearing is at the sharp null (loop) or the peak (directional antenna) | Simple; works with any signal that lasts long enough | Slow; a loop's figure-of-eight pattern has two nulls 180° apart |
| Adcock array with Watson-Watt processing | Amplitudes on two crossed antenna pairs, plus an all-round sense antenna | Near-instant bearing from a burst of about a millisecond; classic HF direction finder | Small aperture, so reflections near the site distort it |
| Doppler and pseudo-Doppler | The frequency shift from an antenna moving in a circle, simulated by switching round a ring of antennas | Good sensitivity; less disturbed by multipath than Watson-Watt | Needs the signal for a full switching cycle |
| Phase interferometer | The phase difference between antennas a known distance apart | Accurate and fast | Ambiguous when antennas are more than half a wavelength apart, unless several spacings are combined |
| Correlative interferometer | Phases and amplitudes on all antennas, matched against a calibration table measured for every direction | Wide aperture handles distorted wavefronts; can correct site errors | Needs a calibrated array and several receiver channels |

### Loop antennas and the null

A small loop antenna receives nothing from a signal that arrives square-on to the face of the loop, along its axis, and most from one arriving edge-on. Turning the loop until the signal disappears gives a sharp null, with the loop's axis pointing along the bearing. The null is far sharper than the broad maximum, which is why the early direction finders listened for silence. A loop has two nulls 180° apart, so it can't tell whether the transmitter is in front or behind. Adding a small all-round "sense" antenna turns the figure of eight into a heart shape (a cardioid) with a single null, which settles it.

### Adcock and Watson-Watt

An Adcock array replaces the loop with pairs of vertical antennas, which ignore most of the horizontally polarised energy that bounces off the ionosphere at night and once caused large bearing errors at HF. Two pairs at right angles give one signal proportional to the sine of the bearing and one to the cosine. In 1926 Robert Watson-Watt and J. F. Herd published a direction finder that fed those two signals to the plates of a cathode ray tube. The spot drew a line at the bearing angle at once, with no turning antenna. Modern Watson-Watt direction finders compute the same angle, arctan(sine / cosine), digitally.

### Doppler direction finding

If one antenna moves round a circle, a signal arriving from one side is shifted up in frequency as the antenna moves towards the transmitter and down as it moves away. The receiver hears this as a tone at the rotation rate, and the tone's phase gives the bearing. Real Doppler direction finders don't spin an antenna; they switch quickly round a ring of fixed antennas spaced less than half a wavelength apart (pseudo-Doppler).

### Interferometry and correlative DF

A wave arriving at angle θ from the line between two antennas a distance d apart reaches one antenna slightly before the other. The phase difference is Δφ = 2π d cos θ / λ, where λ is the wavelength. Measuring Δφ gives the angle. If d is more than half a wavelength, several angles give the same phase, so practical arrays combine short and long spacings. A correlative interferometer goes one step further: it records the phases and amplitudes the array actually produces for every direction during calibration, then picks the direction whose stored pattern best matches each measurement. The ITU handbook quotes an accuracy of 1° to 2° rms for Watson-Watt systems and 1° rms or better for correlative interferometers, before the effects of the site.

The antenna's own pattern matters to all of these; see [antenna radiation patterns](/learn/applications/antenna-radiation-pattern/) for nulls, lobes and beamwidth.

## How to read a DF display

![A diagram of a DF display: a dark compass rose with six numbered parts. 1, the bearing scale with 000 degrees at the top, read clockwise. 2, an orange strobe from the centre at 063 degrees, the latest bearing. 3, a shaded wedge either side of the strobe showing two standard deviations of the recent bearings. 4, orange dots for recent bearings, the newest at the rim and older ones further in and fainter. 5, a single yellow dot at 140 degrees, a stray bearing from a reflection or another signal. 6, a readout reading 063.4 degrees, spread plus or minus 2.9 degrees, quality 87 percent and minus 92 dBm](./df-display-anatomy.svg)

Most direction finders show their result on a compass rose like this, for one receiver at a time.

1. **Bearing scale.** 000° is north at the top, and bearings run clockwise: 090° east, 180° south, 270° west. A bearing is always from the receiver towards the signal. Some displays can be switched to show bearings relative to a vehicle's heading instead; check which before you report one.
2. **Strobe.** The line from the centre is the latest bearing. On older equipment it was literally the trace on the cathode ray tube.
3. **Spread.** How widely the recent bearings scatter. A narrow spread means a steady bearing; a wide one means a weak signal, interference or reflections.
4. **History.** Past bearings, so you can see whether the bearing is steady, drifting (the transmitter or the receiver is moving) or jumping between two directions.
5. **Stray bearings.** A bearing far from the rest is usually a reflection, or another signal on the same frequency. Many direction finders give each bearing a quality value so that these "wild" bearings can be left out of the fix.
6. **Readout.** The bearing in figures, a quality or confidence value, and the signal level. Quality scales differ between makers; treat it as a ranking, not a probability.

## Triangulation: how bearings give a fix

One bearing only says which line the transmitter is on. A second receiver in a different place gives a second line, and the transmitter is where they cross. This is **triangulation**, also called AOA location.

![Two panels with the same three receivers A, B and C. Left, triangulation: three bearing lines, each a few degrees off, form a small shaded triangle (the cocked hat) near the transmitter, with a dashed 95% error ellipse around the fix. Right, TDOA: three curved hyperbolas labelled B minus A, C minus A and C minus B cross at a single point at the transmitter](./triangulation-vs-tdoa.svg)

### Why three bearings are better than two

Two bearings always cross somewhere (unless they're parallel), so a fix from two stations gives no sign of whether either bearing is wrong. With three bearings the lines rarely meet at a point. The small triangle they leave is called the **cocked hat**, a term from marine navigation. A large cocked hat warns that at least one bearing is off.

The transmitter is not necessarily inside the cocked hat. Navigators have long been taught that if each line is equally likely to pass either side of the true position, the chance that the true position is inside the triangle is only 1 in 4. Formal statements and proofs of this result, with the conditions it needs, were published in 2021. So modern systems don't use the triangle. They compute the point that best fits all the bearings, weighting each by how precise it is, and draw an **error ellipse** around it: the area that contains the transmitter with a stated probability, often 50%, 90% or 95%. The method goes back to R. G. Stansfield's 1947 paper on the statistics of DF fixing, and it is what the ITU handbook describes for monitoring networks.

### How distance and geometry set the accuracy

A bearing error is an angle, so the distance it moves the line grows with range: the sideways error is the range times the tangent of the bearing error. With a 2° error, a bearing line misses a transmitter 50 km away by 50 × tan 2° ≈ 1.75 km.

The angle at which the lines cross matters as much. If one line moves sideways by a distance e, the crossing point slides along the other line by e / sin γ, where γ is the angle between them. At 90° that is just e. At 30° it doubles (1 / sin 30° = 2), and at 10° it is almost six times as large, so the error ellipse becomes long and thin, pointing along the lines. Bearings from stations almost in line with the transmitter are nearly useless for range. That is why DF networks place their stations around the area they cover, not along one side of it.

This effect of geometry is called **dilution of precision**. For position fixing it is usually quoted as GDOP (geometric dilution of precision): the factor by which the geometry multiplies the measurement error into a position error. A GDOP close to 1 is good geometry. Both AOA and TDOA are most precise when the transmitter is inside the area surrounded by the receivers.

## What is TDOA?

**TDOA** (time difference of arrival) locates a transmitter from when its signal arrives, not from which direction. Radio waves travel at the speed of light, 299,792,458 m/s, which is about 300 m per microsecond (µs) or 30 cm per nanosecond. If the same signal reaches receiver A before receiver B, the transmitter is closer to A, by 300 m for each microsecond of difference.

### Why one time difference gives a hyperbola

All the points that are a fixed distance closer to A than to B lie on one curve: a branch of a **hyperbola** with A and B at its foci. One time difference doesn't place the transmitter at a point; it puts it somewhere on that curve. A second pair of receivers, for example A and C, gives a second hyperbola, and the transmitter is where they cross. So TDOA needs at least three receivers for a position on a map, and four for a position in three dimensions, such as an aircraft's height. The process of finding a position from range differences is called multilateration.

### A worked example

Receivers A and B are 30 km apart. A signal reaches A 20.0 µs before it reaches B.

- The range difference is 20.0 µs × 0.2998 km/µs = 6.00 km. The transmitter is 6.00 km closer to A than to B.
- Every point where the distance to B minus the distance to A equals 6 km is on one hyperbola, which curves round A. Its vertex, where it crosses the line from A to B, is 12 km from A and 18 km from B (12 + 18 = 30 and 18 − 12 = 6).
- A timing error of 1 µs moves the hyperbola by about 300 m in range difference. A timing error of 20 ns moves it by 6 m.
- A third receiver, C, gives a second time difference, C − A, and a second hyperbola. Where they cross is the fix.

With three receivers there are only two independent time differences. A third hyperbola from B and C passes through the same crossing whatever the errors (if arrival times are measured at each site), so it adds no check. A fourth receiver gives a redundant measurement that can expose a bad one.

### How the time difference is measured

The receivers usually don't know when the signal was sent, and most signals have no clear start. So each pair of receivers records the same stretch of signal, and a computer slides one recording past the other to find the delay at which they match best. That delay is the peak of the **cross-correlation** of the two recordings; see [autocorrelation and cross-correlation](/learn/applications/signal-processing/autocorrelation/) for how the peak is found and why it's sharp. A signal with more bandwidth gives a narrower peak and a more precise delay. An unmodulated carrier has almost no bandwidth, so it gives a broad peak and can be impossible to locate this way, while AOA handles it easily.

Every receiver must be time-stamped on a common clock, and a clock error turns straight into a range error. The ITU notes that the need for nanosecond-level synchronisation held TDOA back for civil use until satellite navigation (GPS, Galileo and GLONASS) made accurate timing cheap; synchronisation better than 20 ns is achievable.

### FDOA

If the transmitter or the receivers are moving, each receiver also sees a slightly different Doppler shift. **FDOA** (frequency difference of arrival) uses those frequency differences as a second set of measurements. It is often combined with TDOA on aircraft and satellites, as in the MEOSAR rescue satellites above.

## AOA vs TDOA

The ITU compares the two methods in a report (SM.2211) and concludes that they complement each other: a system using both can do better than either alone.

| | AOA (bearings, triangulation) | TDOA (time differences, multilateration) |
|---|---|---|
| What each site measures | The direction of arrival | The time of arrival, compared between sites |
| One measurement gives | A straight line of bearing from one site | A hyperbola, from a pair of sites |
| Sites needed for a 2D fix | 2 (3 to check the bearings agree) | 3 (4 to check the measurements agree) |
| Antenna | A direction-finding array, calibrated | A simple omnidirectional antenna |
| Clock synchronisation | Loose: seconds will often do | Tight: a small fraction of 1 / bandwidth, tens of nanoseconds |
| Narrowband and unmodulated signals | Works well | Hard or impossible |
| Wideband and very short signals | Works, with fast enough equipment | Works well, including weak signals |
| Accuracy and distance | Error grows with distance from each site | Set by geometry (GDOP) and timing, not directly by the distance between receivers |
| Single site | One site can home in on a transmitter by moving | Needs at least two sites and a data link |
| Data sent to the central processor | Bearings and quality values (small) | Recorded signal samples (large) |

## Common mistakes in direction finding

- **Trusting a bearing near a reflector.** Buildings, hills, vehicles and the receiver's own mast reflect signals. A direction finder near them can report the direction of the reflection, not the transmitter, and the error doesn't shrink with averaging. Choose open sites and look for bearings that jump between two directions.
- **Poor baseline geometry.** Stations that are close together, or nearly in line with the transmitter, give lines or hyperbolas that cross at shallow angles and a long, thin error ellipse. Spread the sites around the area of interest.
- **Locating from outside the network.** Outside the area surrounded by the receivers, TDOA hyperbolas become nearly parallel and act like a single line of bearing, so the error ellipse stretches along the direction to the transmitter.
- **Unsynchronised TDOA clocks.** One microsecond of clock offset at one receiver is a 300 m range error, which the geometry can multiply further. Check GNSS timing at every site.
- **Mixing two signals.** Two transmitters on the same frequency give bearings that belong to different places. A fix from them is meaningless.
- **Trusting the error ellipse to cover a bias.** The ellipse is computed from the random scatter of the measurements. A reflection or a clock offset shifts the fix consistently, so the ellipse can be small and still miss the transmitter. In the demo, tick the multipath box and watch the ellipse move away from the red cross.
- **Reading a two-line fix as certain.** Two bearings always cross somewhere. Without a third line or an error ellipse, there is no way to tell how good the fix is.
- **Mixing up true and relative bearings.** A bearing taken relative to a vehicle's heading must be converted to a true bearing (from north) before it is drawn on a map.

## How to build a direction finding display in JavaScript, React or Angular

A DF system has to show bearings from several sites as they arrive, several times a second, alongside the map they're plotted on. SciChart.js draws both the polar DF display and the map as GPU-accelerated charts that stay smooth while every line updates on every measurement. The demo below is a synthetic network of three receivers, A, B and C, a few tens of kilometres apart, listening to one simulated transmitter. Each receiver reports a noisy bearing and arrival time five times a second. The fix is a weighted least-squares fit, the ellipse contains the true position 95% of the time, and the hyperbolas are drawn from the measured time differences.

Drag the red cross (the transmitter) or a receiver on the map and watch the ellipse change: it is about 1.5 km long in TDOA mode with the transmitter inside the triangle, and about 30 km long when the transmitter is 40 km outside it. Switch **Method** between AOA, TDOA and both. Move **Bearing noise** or **Timing noise**, choose the receiver for the **DF display** (or click a receiver), and tick **Multipath at B** to block the direct path to B so it hears only an echo off a reflector. Hover over the map to read the bearings and range differences at any point. Scroll to zoom and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="direction finding display" demo="polar-line-chart" demoLabel="polar line chart" docs="/2d-charts/chart-types/polar-line-renderable-series/" docsLabel="SciChart.js polar line chart documentation" />

Here is the code for this chart. The measurements, the fix and the error ellipse are plain JavaScript. SciChart.js draws the DF display and the map.

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
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the DF display; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // Bearing: 000° at the top, clockwise like a compass
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
                visibleRange: new NumberRange(0, 1),
                autoRange: EAutoRange.Never,
                startAngle: Math.PI / 2,
                gridlineMode: EPolarGridlineMode.Circles,
                drawLabels: false
            })
        );

        // The strobe (latest bearing) and the history (past bearings, newest at the rim)
        const strobe = new XyDataSeries(wasmContext);
        const history = new XyDataSeries(wasmContext);
        sciChartSurface.renderableSeries.add(
            new PolarXyScatterRenderableSeries(wasmContext, {
                dataSeries: history,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#50C7E0", strokeThickness: 0 })
            }),
            new PolarLineRenderableSeries(wasmContext, { dataSeries: strobe, stroke: "#50C7E0", strokeThickness: 3 })
        );

        // Redraw whenever your direction finder reports a bearing
        const bearings: number[] = [];
        subscribeToYourBearings((bearing: number) => {
            if (sciChartSurface.isDeleted) return;
            bearings.unshift(bearing);
            bearings.length = Math.min(bearings.length, 24);
            strobe.clear();
            strobe.appendRange([bearing, bearing], [0, 1]);
            history.clear();
            history.appendRange(bearings, bearings.map((_, age) => 0.96 - age * 0.028));
        });
        return { sciChartSurface };
    };

    export const DfDisplay = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />;
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
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-df-display",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class DfDisplayComponent {
        // initChart builds the DF display; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            // Bearing: 000° at the top, clockwise like a compass
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
                    visibleRange: new NumberRange(0, 1),
                    autoRange: EAutoRange.Never,
                    startAngle: Math.PI / 2,
                    gridlineMode: EPolarGridlineMode.Circles,
                    drawLabels: false
                })
            );

            // The strobe (latest bearing) and the history (past bearings, newest at the rim)
            const strobe = new XyDataSeries(wasmContext);
            const history = new XyDataSeries(wasmContext);
            sciChartSurface.renderableSeries.add(
                new PolarXyScatterRenderableSeries(wasmContext, {
                    dataSeries: history,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#50C7E0", strokeThickness: 0 })
                }),
                new PolarLineRenderableSeries(wasmContext, { dataSeries: strobe, stroke: "#50C7E0", strokeThickness: 3 })
            );

            // Redraw whenever your direction finder reports a bearing
            const bearings: number[] = [];
            subscribeToYourBearings((bearing: number) => {
                if (sciChartSurface.isDeleted) return;
                bearings.unshift(bearing);
                bearings.length = Math.min(bearings.length, 24);
                strobe.clear();
                strobe.appendRange([bearing, bearing], [0, 1]);
                history.clear();
                history.appendRange(bearings, bearings.map((_, age) => 0.96 - age * 0.028));
            });
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The DF display is a `SciChartPolarSurface`. The angular `PolarNumericAxis` runs from 0 to 360° with `startAngle: Math.PI / 2` and `flippedCoordinates: true`, so 000° is at the top and bearings increase clockwise. The strobe is a `PolarLineRenderableSeries` from the centre to the rim, the spread a `PolarColumnRenderableSeries` wedge, and the history a `PolarXyScatterRenderableSeries`.
- The map is an ordinary `SciChartSurface` with two `NumericAxis` axes in km. Bearing lines, hyperbolas and the error ellipse are `FastLineRenderableSeries`, and the sites are `XyScatterRenderableSeries` with triangle and cross point markers. The visible ranges are adjusted so 1 km is the same length on both axes, so angles and ellipses aren't distorted.
- The fix is a Gauss-Newton weighted least-squares solution. Its covariance gives the ellipse axes (eigenvalues) and direction (eigenvector), scaled by 2.45 for 95%. Each hyperbola is drawn from its parametric form, a·cosh t and b·sinh t, rotated onto the line between the two receivers.
- A custom chart modifier drags the transmitter and receivers and shows the hover readout, using the axes' coordinate calculators to convert between pixels and km.

**See it in the demo app:** [JavaScript polar line chart](https://www.scichart.com/demo/javascript/polar-line-chart) · [React polar line chart](https://www.scichart.com/demo/react/polar-line-chart) · [Angular polar line chart](https://www.scichart.com/demo/angular/polar-line-chart).

**Go deeper:** [SciChart.js polar line chart documentation](/2d-charts/chart-types/polar-line-renderable-series/), the [polar column documentation](/2d-charts/chart-types/polar-column-renderable-series/) for the spread wedge, the [line series documentation](/2d-charts/chart-types/fast-line-renderable-series/) for the map, and [custom chart modifiers](/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/) for dragging. For a display that also measures range, see [how to read a radar screen](/learn/applications/radar-display/); for passive bearings underwater, see [sonar displays](/learn/applications/sonar/). For how aerospace and defence software uses SciChart, see [SciChart for aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What is radio direction finding?

Radio direction finding (RDF or DF) measures the direction a radio signal arrives from, using an antenna array or a turning antenna. One receiver gives a bearing: a line from the receiver towards the transmitter. Bearings from two or more receivers in different places cross at the transmitter's position, which is called a fix.

### What is TDOA?

TDOA (time difference of arrival) locates a transmitter from the differences in the time its signal reaches several receivers with synchronised clocks. Each microsecond of difference means the transmitter is about 300 m closer to one receiver than the other. One time difference puts the transmitter on a hyperbola; two or more, from three or more receivers, cross at its position.

### How many receivers do you need to locate a transmitter?

With bearings, two receivers give a fix where their lines cross, but three are better: they show whether the bearings agree and keep the fix usable when two lines cross at a shallow angle. With TDOA, two receivers give only a hyperbola, and at least three are needed for a position on a map. A fourth TDOA receiver adds a check that can expose a bad measurement.

### What is the difference between AOA and TDOA?

AOA (angle of arrival) measures the direction of the signal at each site with a direction-finding antenna array, and the fix is where the bearing lines cross. TDOA measures arrival times at simple antennas with very accurate synchronised clocks, and the fix is where hyperbolas cross. AOA works on narrowband and unmodulated signals; TDOA needs signal bandwidth but locates wideband signals well. Many systems combine both.

### What is a cocked hat in direction finding?

A cocked hat is the small triangle formed when three bearing lines don't meet at one point because each has a small error. The transmitter is not always inside it: if each line is equally likely to fall either side of the true position, the chance is only one in four. Modern systems draw an error ellipse instead, sized from the bearing errors and the geometry.

### How do I make a direction finding display in JavaScript?

Use a polar chart with the angular axis running 0 to 360 degrees clockwise from the top, and draw the latest bearing as a polar line from the centre to the rim, the spread as a polar column wedge and past bearings as polar scatter points. For the fix, use an x-y chart in km with line series for the bearing lines, hyperbolas and error ellipse. SciChart.js does this in plain JavaScript, React or Angular.

## Sources

- International Telecommunication Union (2011), [*Handbook on Spectrum Monitoring*](https://www.itu.int/pub/R-HDB-23-2011), ITU-R, chapters 3.4 and 4.7. Direction finding methods and their accuracy, bearing quality values, triangulation, the least-squares fix and the uncertainty ellipse, and TDOA.
- International Telecommunication Union (2018), [Report ITU-R SM.2211-2, *Comparison of time-difference-of-arrival and angle-of-arrival methods of signal geolocation*](https://www.itu.int/pub/R-REP-SM.2211). Strengths and weaknesses of AOA and TDOA, synchronisation, bandwidth, geometry and FDOA.
- Torrieri, D. J. (1984), [Statistical theory of passive location systems](https://doi.org/10.1109/TAES.1984.310439), *IEEE Transactions on Aerospace and Electronic Systems*, AES-20(2), 183–198. Least-squares location from bearings and time differences, error ellipses and dilution of precision.
- Stansfield, R. G. (1947), [Statistical theory of d.f. fixing](https://doi.org/10.1049/ji-3a-2.1947.0096), *Journal of the IEE, Part IIIA*, 94(15), 762–770; and Watson Watt, R. A. and Herd, J. F. (1926), [An instantaneous direct-reading radiogoniometer](https://doi.org/10.1049/jiee-1.1926.0051), *Journal of the IEE*, 64(353), 611–617.
- Bárány, I., Steiger, W. and Toledo, S. (2021), [The cocked hat: formal statements and proofs of the theorems](https://doi.org/10.1017/S0373463321000011), *The Journal of Navigation*, 74(3), 713–722.
- US National Oceanic and Atmospheric Administration, [Cospas-Sarsat system overview](https://www.sarsat.noaa.gov/cospas-sarsat-system-overview/) and [search and rescue satellites](https://www.sarsat.noaa.gov/search-and-rescue-satellites/); International Amateur Radio Union Region 1, [ARDF rules](https://www.iaru-r1.org/about-us/committees-and-working-groups/ardf/ardf-rules/).

<LearnCta position="bottom" chart="direction finding display" demo="polar-line-chart" demoLabel="polar line chart" docs="/2d-charts/chart-types/polar-line-renderable-series/" docsLabel="SciChart.js polar line chart documentation" />
