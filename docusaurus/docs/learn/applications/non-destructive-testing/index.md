---
sidebar_position: 100
sidebar_label: Non-Destructive Testing (NDT)
title: "Non-Destructive Testing (NDT): Ultrasonic A-, B- and C-Scans Explained"
description: "What non-destructive testing is, how the main NDT methods compare, and how ultrasonic testing works: A-scans, B-scans, C-scans, thickness gauging, phased array (PAUT) and TOFD."
keywords:
    [
        "non destructive testing",
        "ndt",
        "ndt testing",
        "what is non destructive testing",
        "ndt methods",
        "non destructive testing methods",
        "ultrasonic testing",
        "ultrasonic flaw detection",
        "ultrasonic flaw detector",
        "ultrasonic thickness gauge",
        "phased array ultrasonic testing",
        "paut",
        "tofd",
        "time of flight diffraction",
        "eddy current testing",
        "a scan b scan c scan",
        "a-scan",
        "c-scan"
    ]
image: /img/learn/non-destructive-testing-og.png
related: [oscilloscope, vibration-analysis, hilbert-transform, heatmap]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is non-destructive testing?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Non-destructive testing (NDT) is the inspection of a material, part or structure for flaws, or for properties such as wall thickness, without damaging it, so it can go back into service. Welds, pipelines, aircraft, pressure vessels and rails are checked this way, with methods such as visual inspection, liquid penetrant, magnetic particle, eddy current, radiography and ultrasonic testing."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What are the main NDT methods?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The methods used most are visual testing, liquid penetrant testing and magnetic particle testing for surface flaws, eddy current testing for surface and near-surface flaws in conductive metals, and radiography and ultrasonic testing for flaws inside the material. Acoustic emission and infrared thermography are used for monitoring structures and for composites."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between an A-scan, B-scan and C-scan?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An A-scan is a single trace of echo amplitude against time at one probe position. A B-scan lines up many A-scans taken along a line, giving a side-view cross-section with probe position across and depth down. A C-scan is a plan view of the part from above, where each point's colour shows the echo amplitude, or its depth, inside a chosen depth window called a gate."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is phased array ultrasonic testing (PAUT)?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Phased array ultrasonic testing uses a probe made of many small elements, each pulsed with its own time delay. Changing the delays steers the beam to different angles and focuses it at different depths without moving the probe. A sweep of angles gives a fan-shaped sector scan (S-scan), which shows a cross-section of a weld in a single image."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How does an ultrasonic thickness gauge work?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An ultrasonic thickness gauge sends a pulse into the wall and times the echo from the far surface. The pulse travels down and back, so the thickness is the sound velocity times the time divided by two. In steel, at 5,920 m/s, an echo after 8.45 microseconds means a wall 25.0 mm thick. The gauge must be calibrated for the material's sound velocity."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot an ultrasonic A-scan or C-scan in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Plot the A-scan as a line chart of amplitude against time of flight, and add a second x-axis for depth (velocity times time over two). Draw B-scans and C-scans as heatmaps: a 2D array of envelope amplitudes, with probe position and depth, or x and y over the part, on the axes. With SciChart.js, use a FastLineRenderableSeries for the A-scan, a UniformHeatmapRenderableSeries for B- and C-scans, and a PolarUniformHeatmapRenderableSeries for a phased-array sector scan."
                    }
                }
            ]
        })}
    </script>
</head>

# Non-Destructive Testing (NDT)

## What is non-destructive testing (NDT)?

**Non-destructive testing (NDT)** (also called non-destructive examination, NDE, or inspection, NDI) is the inspection of a material, part or structure for flaws or for properties such as wall thickness, without damaging it, so the part can go back into service. Common methods use light, liquids, magnetism, eddy currents, X-rays or ultrasound to reveal cracks, voids and corrosion.

![A simulated ultrasonic inspection of a 25 mm steel plate in a dark navy theme: an A-scan with the initial pulse, a crack echo and a gate, a fan-shaped phased-array sector scan, a B-scan cross-section showing the crack and the back wall, and a C-scan plan view of the plate](/img/learn/non-destructive-testing-og.png)

*A simulated ultrasonic test of a steel plate with a crack and a drilled hole: the A-scan at the probe, a phased-array sector scan, the B-scan cross-section and the C-scan plan view (sample data). [Try the interactive version](#how-to-plot-ultrasonic-a-scans-b-scans-and-c-scans-in-javascript-react-or-angular).*

:::tip Key takeaways
- NDT finds flaws without harming the part. Surface methods (visual, penetrant, magnetic particle, eddy current) and volumetric methods (radiography, ultrasound) answer different questions.
- Ultrasonic testing times echoes. Depth is velocity × time ÷ 2, so 5.92 mm/µs in steel turns 4.05 µs into 12.0 mm.
- An A-scan is one trace; B-scans, C-scans and S-scans arrange thousands of A-scans into images.
- Phased array probes steer and focus the beam electronically; TOFD sizes cracks from the signals diffracted at their tips.
- Common mistakes include a wrong velocity setting, too much gain and poor couplant.
:::

## Where NDT is used

NDT is used wherever a hidden flaw could cause a failure, and wherever cutting a part open to check it isn't an option:

- Welds, in pipelines, pressure vessels, storage tanks, ships and steel structures, checked after welding and during service.
- Aircraft, for fatigue cracks around fastener holes, corrosion under paint and damage inside composite panels.
- Pipelines and process plant, where wall thickness is measured on a schedule to track corrosion and erosion.
- Railways, where rails and wheelsets are scanned for internal cracks.
- Castings, forgings and composites, inspected in the factory before they ship.
- Power stations, including boiler tubes, turbine parts and nuclear plant.

Inspectors work to written procedures and standards, and the person doing the test is usually certified for that method and level (see [NDT standards and certification](#ndt-standards-and-certification)).

## NDT methods compared

Each NDT method suits different flaws and materials: surface methods are quick and cheap, while radiography and ultrasound look through the whole thickness.

| Method | What it finds | Works on | Strengths | Limitations |
| --- | --- | --- | --- | --- |
| Visual testing (VT) | Surface cracks, corrosion, misalignment, weld shape | Anything you can see, directly or with a borescope | Cheapest and quickest; always done first | Surface only; depends on access, lighting and the inspector |
| Liquid penetrant testing (PT) | Cracks and pores open to the surface | Non-porous materials, metal or not | Simple, portable, shows flaw length clearly | Flaws must break the surface; needs clean parts and chemicals |
| Magnetic particle testing (MT) | Surface and slightly sub-surface cracks | Ferromagnetic steels and irons | Fast, sensitive to fine cracks | Ferromagnetic parts only; flaw direction matters |
| Eddy current testing (ET) | Surface and near-surface cracks, corrosion, coating thickness | Electrically conductive materials | No couplant or contact needed; fast scans of tubes and aircraft skins | Shallow depth; geometry and material changes affect the signal |
| Radiographic testing (RT) | Voids, porosity, inclusions, lack of fusion | Most materials, through their thickness | Permanent image; good for volumetric flaws | Radiation safety; needs access to both sides; poor at cracks lying across the beam |
| Ultrasonic testing (UT) | Internal cracks, lack of fusion, laminations, wall thickness | Metals, plastics, composites, ceramics | Finds and sizes deep flaws from one side; gives depth directly | Needs couplant and a trained operator; coarse-grained materials scatter the sound |
| Acoustic emission (AE) | Cracks growing or leaking under load | Pressure vessels, tanks, bridges | Monitors a whole structure while it's loaded | Only active flaws; needs a load and good noise control |
| Infrared thermography (IRT) | Delaminations, disbonds, moisture, hot spots | Composites, coatings, electrical equipment | Non-contact, covers large areas quickly | Near-surface only; affected by surface emissivity |

Visual, penetrant and magnetic particle testing check the surface; eddy current reaches a little below it. Radiography and ultrasound look inside the part.

### Eddy current testing

**Eddy current testing** passes an alternating current through a coil held near a conductive part. The coil's field induces circulating currents in the metal, and a crack, a thinner wall or a change in conductivity alters those currents, which changes the coil's impedance. The instrument shows that change as a trace on an impedance plane. Higher frequencies concentrate the currents near the surface, and lower ones reach further in, so the frequency is chosen for the depth of interest. It's widely used on heat-exchanger tubes, aircraft skins around fasteners and wheel bores.

## How ultrasonic testing works

**Ultrasonic testing (UT)** sends short pulses of high-frequency sound, usually between about 0.5 and 20 MHz, into a part and listens for echoes. Sound reflects wherever the material changes, at a crack, a void or the far wall, and the time each echo takes to come back gives the depth of whatever reflected it.

A piezoelectric probe turns an electrical pulse into a pulse of sound and turns returning echoes back into a voltage. Air reflects almost all of the sound, so a thin layer of couplant (gel, oil or water) fills the gap between probe and surface.

- A straight-beam probe sends longitudinal waves straight down; it suits plates, forgings, laminations and thickness readings.
- An angle-beam probe sits on a plastic wedge and sends shear waves into the part at an angle, typically 45°, 60° or 70°. It's the usual choice for welds, where the flaws that matter often lie at an angle to the surface.

### Pulse-echo and through-transmission

In pulse-echo testing, one probe sends the pulse and receives the echoes from the same side. It's the common method, because it needs access to only one surface and it gives the depth of each reflector.

In through-transmission, one probe sends from one side and a second probe receives on the other. A flaw shows up as a drop in the received signal rather than as an echo. It suits thin, attenuating materials such as composite panels, where echoes are weak, but it can't say how deep the flaw is.

### How to read an A-scan

![An annotated A-scan beside a cross-section of a 25 mm steel plate with a flaw 12 mm deep. The A-scan shows the initial pulse at 0, a flaw echo at 4.05 microseconds, a gate over the flaw echo, noise, and the back-wall echo at 8.45 microseconds, with depth equals 5.92 times 4.05 over 2 equals 12.0 mm](./a-scan-reading.svg)

An **A-scan** is the basic ultrasonic display: received amplitude, as a percentage of full screen height (% FSH), against time of flight. Reading it from left to right:

- The initial pulse (or main bang) at time zero is the transmitted pulse and the probe's ringing. Nothing can be seen while it lasts.
- A flaw echo appears between the initial pulse and the back wall. Its position gives the flaw's depth; its height says how strongly it reflects, which depends on its size, shape and angle.
- The back-wall echo comes from the far surface. If a flaw shadows part of the beam, the back-wall echo drops, which is a clue in its own right.
- Small, random echoes along the baseline, called "grass", are noise from the grains of the metal and the electronics.

A gate is a window in time (or depth) with a threshold height. The instrument reports the highest echo in the gate, its time and its depth, and can sound an alarm when an echo crosses the threshold. Gates are also how B-scan and C-scan images are built from raw A-scans.

Flaw detectors usually show the rectified signal or its envelope rather than the raw radio-frequency (RF) waveform; the demo below draws both.

### Time of flight and depth

The pulse travels down to a reflector and back, so the depth $d$ of the reflector is

$$
d = \frac{v \, t}{2}
$$

where $v$ is the sound velocity in the material and $t$ is the time of flight. Longitudinal waves travel at about 5,920 m/s (5.92 mm/µs) in low-alloy steel, the reference velocity that EN 12223 specifies for steel calibration block No. 1, and close to what NIST measured on IIW-type blocks. Shear waves travel at a little over half that, about 3,200 m/s.

A worked example: in a 25 mm steel plate, an echo at 4.05 µs is a reflector 5.92 × 4.05 ÷ 2 = 12.0 mm deep, and the back wall returns at 2 × 25 ÷ 5.92 = 8.45 µs. Each millimetre of steel adds 0.338 µs to the round trip.

### Ultrasonic thickness gauge: measuring wall thickness

An **ultrasonic thickness gauge** applies the same formula to the back-wall echo. It times the echo from the far wall and shows the thickness directly: in steel, an echo at 8.45 µs reads 5.92 × 8.45 ÷ 2 = 25.0 mm. It's the standard way to check pipes, tanks and ship hulls for corrosion from the outside, without draining or opening them.

For a reliable reading:

- The velocity must match the material. The gauge only measures time, so a velocity set 5% too high reads 5% too thick: 26.25 mm instead of 25 mm. Calibrate on a sample of known thickness in the same material.
- Dual-element probes, with separate transmit and receive crystals, read thin and corroded walls better than a single crystal, because the receiver isn't blinded by the transmitted pulse.
- In echo-to-echo mode, the gauge times the gap between two successive back-wall echoes. A 10 mm wall gives echoes 3.38 µs apart. This cancels the coating's thickness, so the reading is the steel under the paint.

### Gain, decibels and distance-amplitude correction

Echo heights are compared in decibels. The difference between two amplitudes $A_1$ and $A_2$ is

$$
\Delta\,\mathrm{dB} = 20 \log_{10}\!\left(\frac{A_1}{A_2}\right)
$$

so adding 6 dB of gain doubles an echo's height, and 20 dB multiplies it by 10. An echo at 40% FSH is 6.0 dB below one at 80%. Inspectors report flaw echoes in dB relative to a reference, such as the back wall in a sound area or a reference hole of known size.

The same flaw gives a smaller echo the deeper it is, because the beam spreads and the material absorbs energy. A **distance-amplitude correction (DAC)** curve, drawn through the echoes from identical reference holes at several depths in a calibration block, shows how big a reference-sized echo is at each depth. Time-corrected gain (TCG) does the same job the other way round: it raises the gain with time, so that identical reflectors show at the same height at any depth.

## A-scan, B-scan, C-scan and S-scan: ultrasonic data displays

Ultrasonic instruments show the same echoes in four standard views: the A-scan as one trace, and the B-, C- and S-scans as images built from many A-scans.

![Four panels of the same steel plate. A-scan: one trace of amplitude against time. B-scan: a side-view cross-section with position across and depth down, showing the crack as a short bright line and a gap in the back wall below it. C-scan: a plan view from above with the crack as a bright square and the drilled hole as a vertical stripe. S-scan: a fan-shaped phased-array sector with the back wall as an arc](./ultrasonic-scan-views.svg)

A scanner, encoder or phased array records thousands of A-scans, and each display arranges them differently:

| View | What the axes show | Colour or height | Best for |
| --- | --- | --- | --- |
| A-scan | Time (or depth) across, amplitude up | Height of the trace | Reading one position: depth and echo height |
| B-scan | Probe position across, depth down | Echo amplitude (envelope) | A cross-section along one scan line: flaw depth and length |
| C-scan | Position x and y over the part, seen from above | Peak echo amplitude in a gate, or its depth | Mapping where flaws, corrosion or disbonds are, as with an X-ray image |
| D-scan | Position along the weld, depth | Echo amplitude | A side view at right angles to the B-scan, as in TOFD and weld scans |
| S-scan (sector scan) | Beam angle and sound path, drawn as a fan | Echo amplitude | Phased array inspection of welds from one probe position |

A C-scan is in effect a heatmap of the part. When it shows amplitude, a bright patch is a strong reflector; when it shows depth (time of flight), it maps remaining wall thickness, which is how corrosion maps are made. Medical ultrasound images ("B-mode" scans) use the same principle as the industrial B-scan and S-scan, drawing a fan of echo envelopes as a grey-scale image; SciChart's [polar ultrasound heatmap](https://www.scichart.com/demo/javascript/polar-uniform-heatmap-ultrasound) draws one of those sector images.

## Phased array ultrasonic testing (PAUT), TOFD and other advanced techniques

Phased array and TOFD go beyond a single-element probe: phased array steers and focuses the beam electronically, and TOFD times the waves diffracted from a crack's tips.

### Phased array ultrasonic testing (PAUT)

**Phased array ultrasonic testing (PAUT)** uses a probe made of many small elements in a row, each fired with its own time delay. The waves from the elements add up into one beam, and the set of delays (the focal law) decides its direction and focus. To steer a beam by an angle $\theta$, each element fires later than its neighbour by

$$
\Delta t = \frac{p \sin\theta}{v}
$$

where $p$ is the element pitch. For a 0.6 mm pitch steering 30° in steel, that's about 51 ns per element. It's the same delay-and-sum idea that steers the beam of a [phased array antenna](/learn/applications/antenna-radiation-pattern/).

Because the focal laws are switched electronically, one probe can do several kinds of scan:

- A sector scan (S-scan) sweeps the angle, say from 40° to 70°, and draws the result as a fan. One probe position covers a whole weld cross-section.
- A linear (electronic) scan fires groups of elements in turn at a fixed angle, moving the beam along the probe without moving the probe.
- Focusing at a chosen depth gives a narrower beam and better sizing there.

The **total focusing method (TFM)** records every transmit-receive pair of elements (full matrix capture) and focuses at every point of an image grid in software.

### Time of flight diffraction (TOFD)

**Time of flight diffraction (TOFD)** uses two probes facing each other across a weld, one sending and one receiving. Instead of waiting for a reflection, it picks up the weak signals diffracted from the top and bottom tips of a crack. The receiver sees, in order: a lateral wave along the surface, the upper tip, the lower tip, then the back-wall echo.

With the probes $2S$ apart, a tip at depth $d$ is found from its arrival time $t$ by

$$
d = \sqrt{\left(\frac{v \, t}{2}\right)^2 - S^2}
$$

For probes 60 mm apart in steel ($S$ = 30 mm), the lateral wave arrives at 10.14 µs, and a tip signal at 11.33 µs puts the tip 15.0 mm deep. Because the depths come from times rather than echo heights, TOFD measures crack height well. Its results are shown as a grey-scale D-scan along the weld.

## Signal processing for ultrasonic flaw detection

Ultrasonic flaw detection relies on a few signal-processing steps, done in hardware or software, between the raw RF signal and the picture an inspector reads:

- Filtering. A [band-pass filter](/learn/signal-processing/band-pass-filter/) around the probe's frequency (for example 2 to 8 MHz for a 5 MHz probe) removes low-frequency drift and high-frequency electronic noise.
- Envelope detection. The echo's outline, computed by rectifying and smoothing or with the [Hilbert transform](/learn/signal-processing/hilbert-transform/), gives one amplitude per sample regardless of the wave's phase. B-scans, C-scans and S-scans are built from envelopes.
- Averaging. Averaging several pulses at the same position reduces random electronic noise by the square root of the number of pulses, improving the [signal-to-noise ratio](/learn/signal-processing/signal-to-noise-ratio/). Grain noise doesn't average away, because it's the same at each position.
- Gating and peak detection. The gated peak and its time are what a C-scan stores at each point.

An A-scan is a fast transient, sampled at 100 MHz or more, so the tools for reading it are close to those of an [oscilloscope](/learn/applications/oscilloscope/).

## NDT standards and certification

Ultrasonic and other NDT work is governed by written standards and certified personnel. The main references include:

- ISO 16810, the general principles of ultrasonic testing.
- ISO 17640, ultrasonic testing of welds: techniques, testing levels and assessment.
- ISO 16809, ultrasonic thickness measurement, and ISO 10863, TOFD for welds.
- ASME Boiler and Pressure Vessel Code, Section V: the nondestructive examination methods referenced by the rest of the code.
- ISO 9712, the qualification and certification of NDT personnel, at levels 1, 2 and 3 for each method.

Product and acceptance standards (for pipelines, pressure vessels or aircraft) then set what must be tested and which flaws are acceptable.

## NDT vs destructive testing

Non-destructive testing checks parts that stay in service, while destructive testing breaks samples to measure properties such as strength.

| | Non-destructive testing | Destructive testing |
| --- | --- | --- |
| What happens to the part | Stays in service | Cut, broken, bent or loaded to failure |
| What it tells you | Whether this part has flaws, and where; its thickness | The material's properties: strength, ductility, toughness, hardness |
| How much is tested | Every part, or every weld, can be checked | Samples taken from a batch or a test coupon |
| Typical tests | Visual, penetrant, magnetic particle, eddy current, radiography, ultrasound | Tensile test ([stress–strain curve](/learn/applications/stress-strain-curve/)), bend test, impact (Charpy) test, macro sections |

Destructive tests qualify a material or a welding procedure; NDT then checks that each production part or weld made that way is free of unacceptable flaws.

## Common ultrasonic testing mistakes

Most ultrasonic testing errors come from calibration, coupling and the near field, not from the instrument.

- **Wrong velocity calibration.** Depth and thickness are only as accurate as the velocity. Calibrate on a block of the same material, and recalibrate when the temperature changes a lot.
- **Ignoring the near field and the dead zone.** Close to the probe, the beam is uneven: for a 10 mm, 5 MHz probe in steel the near field reaches about $D^2 f / 4v$ = 21 mm, and echo heights there don't follow the usual rules. The ringing of the initial pulse also hides the first few millimetres. Use a dual-element or delay-line probe for near-surface work.
- **Poor or uneven couplant.** A dry patch or a rough surface lowers every echo, which can look like a flaw (a lost back wall) or hide one. Watch the back-wall echo as a check that sound is getting in.
- **Gain set too high.** A saturated echo stops at the top of the screen, so its true height is lost, and grass starts to cross the gate. Set the gain against a reference, then add scanning gain separately.
- **Reading a geometric echo as a flaw.** Edges, holes, weld caps and roots, and mode-converted waves all give real echoes from sound metal. Work out where each echo comes from before calling it a flaw.
- **Missing flaws lying the wrong way.** A crack parallel to the beam returns almost nothing. Use more than one angle, or TOFD, for welds.

## How to plot ultrasonic A-scans, B-scans and C-scans in JavaScript, React or Angular

The demo below recomputes all four views, the A-scan trace and the B-scan, C-scan and sector images, every time you move the probe or change a setting, and SciChart.js redraws the trace and the three heatmaps. It simulates a 5 MHz, 10 mm contact probe on a steel plate with a planar crack and a 3 mm side-drilled hole, all in the browser. The physics is simplified: a Gaussian-windowed tone burst, a beam that widens with depth, a small material loss, and grain and electronic noise.

Drag the **Probe position** across the crack (x = 35 mm) and the hole (x = 70 mm), or press **Scan** to sweep the plate and watch the B-scan and C-scan fill in. Change the **Plate thickness**, **Crack depth**, **Crack size** and **Hole depth**, then move the **Gate start** and **Gate width** to choose what the C-scan maps, and switch **C-scan shows** between amplitude and depth. Turn up the **Gain** until the crack echo saturates, and raise the **Noise** to see grass cross the gate. The readout converts the gated echo's time to depth with d = v·t/2 and gives its height in dB relative to a sound back wall. Scroll to zoom, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={940} name="./Basic/demo" />

<LearnCta position="top" chart="ultrasonic scan display" demo="polar-uniform-heatmap-ultrasound" demoLabel="polar ultrasound heatmap" docs="/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/" docsLabel="SciChart.js polar heatmap documentation" />

Here is the code for this demo. The ultrasound simulation, the envelope and the gating are plain JavaScript; SciChart.js draws the A-scan, the two heatmaps and the polar sector. The React and Angular versions below draw a B-scan from your own data.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // A B-scan: envelope amplitude (% screen height) by probe position (columns) and depth (rows)
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            title: "B-scan"
        });
        // zValues[depthIndex][positionIndex], with the position and depth step in mm
        const { zValues, positionStep, depthStep, probePosition } = await getYourBScanData();

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Probe position (mm)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Depth (mm)",
                flippedCoordinates: true, // depth increases downwards
                visibleRange: new NumberRange(0, zValues.length * depthStep)
            })
        );
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, {
                    xStart: 0,
                    xStep: positionStep,
                    yStart: 0,
                    yStep: depthStep,
                    zValues
                }),
                colorMap: new HeatmapColorMap({
                    minimum: 0,
                    maximum: 100,
                    gradientStops: [
                        { offset: 0, color: "#0B1A3A" },
                        { offset: 0.25, color: "#1F4FA8" },
                        { offset: 0.5, color: "#2FB8D9" },
                        { offset: 0.75, color: "#F5E663" },
                        { offset: 1, color: "#FF4D4D" }
                    ]
                })
            })
        );
        sciChartSurface.annotations.add(
            new VerticalLineAnnotation({ x1: probePosition, stroke: "#FFFFFF", strokeDashArray: [4, 4] })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    // SciChartReact creates the chart, sizes it to its parent and cleans it up
    export const BScan = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // A B-scan: envelope amplitude (% screen height) by probe position (columns) and depth (rows)
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            title: "B-scan"
        });
        // zValues[depthIndex][positionIndex], with the position and depth step in mm
        const { zValues, positionStep, depthStep, probePosition } = await getYourBScanData();

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Probe position (mm)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Depth (mm)",
                flippedCoordinates: true, // depth increases downwards
                visibleRange: new NumberRange(0, zValues.length * depthStep)
            })
        );
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, {
                    xStart: 0,
                    xStep: positionStep,
                    yStart: 0,
                    yStep: depthStep,
                    zValues
                }),
                colorMap: new HeatmapColorMap({
                    minimum: 0,
                    maximum: 100,
                    gradientStops: [
                        { offset: 0, color: "#0B1A3A" },
                        { offset: 0.25, color: "#1F4FA8" },
                        { offset: 0.5, color: "#2FB8D9" },
                        { offset: 0.75, color: "#F5E663" },
                        { offset: 1, color: "#FF4D4D" }
                    ]
                })
            })
        );
        sciChartSurface.annotations.add(
            new VerticalLineAnnotation({ x1: probePosition, stroke: "#FFFFFF", strokeDashArray: [4, 4] })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    @Component({
        selector: "app-b-scan",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class BScanComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- The A-scan is two `FastLineRenderableSeries` (RF and envelope) over the time axis. A second `NumericAxis` on top shows depth; a `visibleRangeChanged` handler keeps it at v·t/2 of the time axis as you zoom.
- B-scans and C-scans are `UniformHeatmapRenderableSeries` over a `UniformHeatmapDataSeries`. Calling `setZValues` replaces the image; `flippedCoordinates` on the depth axis puts the surface at the top. Setting `fillValuesOutOfRange: false` leaves cells with no gated echo empty.
- The phased-array sector is a `PolarUniformHeatmapRenderableSeries` on a `SciChartPolarSurface`, with the angular axis limited to a 60° sector centred on six o'clock with `startAngle` and `totalAngle`.
- The gate, probe and scan-line markers are `LineAnnotation`, `VerticalLineAnnotation` and `HorizontalLineAnnotation`s, moved by setting their coordinates; nothing is rebuilt when the probe moves.

**See it in the demo app:** [JavaScript polar ultrasound heatmap](https://www.scichart.com/demo/javascript/polar-uniform-heatmap-ultrasound) · [React polar ultrasound heatmap](https://www.scichart.com/demo/react/polar-uniform-heatmap-ultrasound) · [Angular polar ultrasound heatmap](https://www.scichart.com/demo/angular/polar-uniform-heatmap-ultrasound). Related techniques: the [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart), [React line chart](https://www.scichart.com/demo/react/line-chart), [React chart annotations](https://www.scichart.com/demo/react/chart-annotations) and [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart).

**Go deeper:** [SciChart.js polar heatmap documentation](/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/), the [uniform heatmap](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), the [line chart](/2d-charts/chart-types/fast-line-renderable-series/), and the learning center guides to the [heatmap](/learn/chart-types/cartesian/heatmap/), the [Hilbert transform](/learn/signal-processing/hilbert-transform/) and [vibration analysis](/learn/applications/vibration-analysis/). For the industries, see SciChart for [design, emulation and test](https://www.scichart.com/design-emulation-test/), [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/) and [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What is non-destructive testing?

Non-destructive testing (NDT) is the inspection of a material, part or structure for flaws, or for properties such as wall thickness, without damaging it, so it can go back into service. Welds, pipelines, aircraft, pressure vessels and rails are checked this way, with methods such as visual inspection, liquid penetrant, magnetic particle, eddy current, radiography and ultrasonic testing.

### What are the main NDT methods?

The methods used most are visual testing, liquid penetrant testing and magnetic particle testing for surface flaws, eddy current testing for surface and near-surface flaws in conductive metals, and radiography and ultrasonic testing for flaws inside the material. Acoustic emission and infrared thermography are used for monitoring structures and for composites.

### What is the difference between an A-scan, B-scan and C-scan?

An A-scan is a single trace of echo amplitude against time at one probe position. A B-scan lines up many A-scans taken along a line, giving a side-view cross-section with probe position across and depth down. A C-scan is a plan view of the part from above, where each point's colour shows the echo amplitude, or its depth, inside a chosen depth window called a gate.

### What is phased array ultrasonic testing (PAUT)?

Phased array ultrasonic testing uses a probe made of many small elements, each pulsed with its own time delay. Changing the delays steers the beam to different angles and focuses it at different depths without moving the probe. A sweep of angles gives a fan-shaped sector scan (S-scan), which shows a cross-section of a weld in a single image.

### How does an ultrasonic thickness gauge work?

An ultrasonic thickness gauge sends a pulse into the wall and times the echo from the far surface. The pulse travels down and back, so the thickness is the sound velocity times the time divided by two. In steel, at 5,920 m/s, an echo after 8.45 microseconds means a wall 25.0 mm thick. The gauge must be calibrated for the material's sound velocity.

### How do I plot an ultrasonic A-scan or C-scan in JavaScript?

Plot the A-scan as a line chart of amplitude against time of flight, and add a second x-axis for depth (velocity times time over two). Draw B-scans and C-scans as heatmaps: a 2D array of envelope amplitudes, with probe position and depth, or x and y over the part, on the axes. With SciChart.js, use a FastLineRenderableSeries for the A-scan, a UniformHeatmapRenderableSeries for B- and C-scans, and a PolarUniformHeatmapRenderableSeries for a phased-array sector scan.

## Sources

- Krautkrämer, J. and Krautkrämer, H. (1990), [Ultrasonic Testing of Materials](https://doi.org/10.1007/978-3-662-10680-8), 4th edition. Springer. Wave types and velocities, near field and beam spread, pulse-echo and through-transmission, displays, DAC and DGS evaluation, TOFD.
- Lerch, T., Renken, M. C. and Fortunko, C. M. (2008), [Accurate measurements of longitudinal-wave velocity in IIW-type calibration blocks](https://www.nist.gov/node/713321). NIST. The 5,920 m/s reference velocity for low-alloy steel.
- ISO (2024), [ISO 16810:2024 Non-destructive testing — Ultrasonic testing — General principles](https://www.iso.org/standard/86362.html). General requirements for ultrasonic testing; personnel qualified to ISO 9712.
- ASME (2025), [Boiler and Pressure Vessel Code, Section V: Nondestructive Examination](https://www.asme.org/codes-standards/find-codes-standards/bpvc-v-bpvc-section-v-nondestructive-examination). Methods and requirements for UT, phased array, TOFD, radiography and the other methods.
- ASNT, [Nondestructive testing methods](https://www.asnt.org/what-is-nondestructive-testing/methods). Overview of the main NDT methods, including visual, penetrant, magnetic particle, electromagnetic (eddy current), radiographic and ultrasonic testing.
- ISO 17640, *Non-destructive testing of welds — Ultrasonic testing — Techniques, testing levels, and assessment*; ISO 16809, *Non-destructive testing — Ultrasonic thickness measurement*; ISO 10863, *Non-destructive testing of welds — Ultrasonic testing — Use of time-of-flight diffraction technique (TOFD)*; ISO 9712, *Non-destructive testing — Qualification and certification of NDT personnel*.
- EN 12223, *Non-destructive testing — Ultrasonic examination — Specification for calibration block No. 1*. The 5,920 m/s reference velocity for steel.
- ASNT, [Ultrasonic Testing](https://www.asnt.org/what-is-nondestructive-testing/methods/ultrasonic-testing). Overview of ultrasonic testing, its displays, techniques and applications.

<LearnCta position="bottom" chart="ultrasonic scan display" demo="polar-uniform-heatmap-ultrasound" demoLabel="polar ultrasound heatmap" docs="/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/" docsLabel="SciChart.js polar heatmap documentation" />
