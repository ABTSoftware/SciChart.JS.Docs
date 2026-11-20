---
sidebar_position: 10
sidebar_label: Antenna Radiation Pattern
title: "Antenna Radiation Pattern: How to Read Polar and 3D Antenna Patterns (With an Interactive Example)"
description: "What an antenna radiation pattern is, how to read E-plane and H-plane polar plots and 3D patterns, beamwidth, side lobes, front-to-back ratio, dBi vs dBd, and the patterns of common antennas."
keywords:
    [
        "antenna radiation pattern",
        "radiation pattern of antenna",
        "antenna pattern",
        "dipole antenna radiation pattern",
        "dipole antenna radiation pattern 3d",
        "monopole antenna radiation pattern",
        "patch antenna radiation pattern",
        "yagi antenna radiation pattern",
        "omnidirectional antenna radiation pattern",
        "phased array antenna radiation pattern",
        "horn antenna radiation pattern",
        "helical antenna radiation pattern",
        "loop antenna radiation pattern",
        "antenna radiation pattern measurement",
        "e-plane and h-plane",
        "half-power beamwidth",
        "front-to-back ratio",
        "dbi vs dbd"
    ]
image: /img/learn/antenna-radiation-pattern-og.png
related: [smith-chart, polar-area-chart, radar-chart, point-cloud]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is an antenna radiation pattern?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An antenna radiation pattern is a plot of how strongly an antenna radiates, or receives, in each direction, measured far from the antenna. It is usually shown as gain relative to the peak, in decibels, either as a 3D surface around the antenna or as 2D polar plots of slices through it. Because antennas are reciprocal, the same pattern describes transmitting and receiving." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between the E-plane and the H-plane?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The E-plane is the slice through the radiation pattern that contains the direction of maximum radiation and the electric field. The H-plane is the slice at right angles to it, containing the direction of maximum radiation and the magnetic field. For a vertical dipole, the E-plane is any vertical plane through the wire and the H-plane is the horizontal plane." }
                },
                {
                    "@type": "Question",
                    "name": "What does a dipole antenna radiation pattern look like in 3D?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A dipole's 3D radiation pattern is a doughnut (torus) around the wire. It radiates equally in every direction at right angles to the wire, and not at all along it. A vertical cut through the wire gives a figure of eight with nulls at the top and bottom; a horizontal cut gives a circle. A half-wave dipole has a directivity of 2.15 dBi and a half-power beamwidth of about 78 degrees in the E-plane." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between dBi and dBd?",
                    "acceptedAnswer": { "@type": "Answer", "text": "dBi gives an antenna's gain in decibels relative to an isotropic antenna, an ideal source that radiates equally in all directions. dBd gives it relative to a half-wave dipole, which has 2.15 dBi. To convert, subtract 2.15: an antenna with 9 dBi has about 6.85 dBd. Quoting dBd makes the same antenna look 2.15 dB weaker, so check which unit a datasheet uses before comparing." }
                },
                {
                    "@type": "Question",
                    "name": "What is the half-power beamwidth of an antenna?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The half-power beamwidth (HPBW) is the angle between the two directions either side of the main beam where the radiated power has fallen to half its peak value, which is 3 dB below the peak. It is measured on a cut through the main beam, so an antenna usually has one beamwidth in the E-plane and another in the H-plane. A narrower beam means higher directivity." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot an antenna radiation pattern in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute or load the gain in dB at each angle of a cut, clip it at a floor such as -40 dB, and draw it as a line series on a polar chart with an angular axis from 0 to 360 degrees and a radial axis from the floor to 0 dB. Add a dashed circle at -3 dB to read the beamwidth. SciChart.js does this with SciChartPolarSurface, PolarNumericAxis and PolarLineRenderableSeries, and can draw the full 3D pattern on a SciChart3DSurface, in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Antenna Radiation Pattern

## What is an antenna radiation pattern?

An **antenna radiation pattern** (also known as a radiation diagram or antenna pattern) is a plot of how strongly an antenna radiates in each direction, measured in the far field. It is usually drawn as gain relative to the peak, in decibels, as a 3D surface or as 2D polar slices. The same pattern applies when the antenna receives.

![A polar plot and a 3D radiation pattern of an eight-element phased array in a dark navy theme. The polar plot shows a narrow horizontal beam steered 20 degrees off centre with smaller side lobes and a broad vertical cut, with a dashed circle at minus 3 dB. The 3D chart shows the same pattern as a lit surface coloured from blue for low gain to red for the main beam](/img/learn/antenna-radiation-pattern-og.png)

*E-plane and H-plane cuts and the 3D pattern of an eight-element linear array steered 20° off broadside (computed from the array factor). [Try the interactive version](#how-to-plot-an-antenna-radiation-pattern-in-javascript-react-or-angular).*

:::tip Key takeaways
- A radiation pattern shows relative gain against direction. Polar plots are slices through the full 3D pattern, usually the E-plane and H-plane.
- Read the main lobe, the half-power (−3 dB) beamwidth, the nulls, the side lobes and the front-to-back ratio.
- Most patterns are plotted in dB, which makes side lobes 20 or 30 dB down visible; a linear plot hides them.
- dBi compares an antenna with an isotropic source and dBd with a half-wave dipole: dBd = dBi − 2.15.
- A phased array steers its beam by shifting the phase of the signal at each element, with no moving parts.
:::

## Far field, directions and the pattern

An antenna's field changes shape close to the antenna. Far enough away, in the **far field**, the shape stops changing with distance: only the strength falls, as 1/r for the field and 1/r² for the power. The radiation pattern is that far-field shape, so it depends only on direction.

Directions use spherical coordinates. The angle θ (theta) is measured down from the z-axis, usually the vertical, and the angle φ (phi) round the horizon from the x-axis. Elevation is 90° − θ, and azimuth is φ.

What gets plotted is usually the **normalised power pattern**: the power radiated per unit solid angle in each direction, divided by its maximum. In decibels the peak is 0 dB and every other direction is negative. Some datasheets plot absolute gain in dBi instead, so the peak sits at the antenna's gain figure.

Antennas are **reciprocal**: a passive antenna receives best from the directions in which it transmits best, so one pattern serves both jobs.

## E-plane and H-plane cuts

A full 3D pattern is hard to read on paper, so most datasheets show two slices through the main beam:

- The **E-plane** contains the direction of maximum radiation and the electric field. For a vertically polarised antenna it is a vertical slice.
- The **H-plane** contains the direction of maximum radiation and the magnetic field, at right angles to the E-plane. For a vertically polarised antenna it is the horizontal slice.

![On the left, a vertical half-wave dipole inside its doughnut-shaped pattern, crossed by a shaded vertical plane labelled E-plane, which contains the wire, and a shaded horizontal plane labelled H-plane. On the right, the E-plane cut drawn as a figure of eight with nulls along the wire, and the H-plane cut drawn as a circle](./e-plane-h-plane.svg)

Some datasheets label the cuts by coordinate plane instead: XY (the horizontal plane), XZ and YZ (two vertical planes). Others say azimuth and elevation pattern. Check which axis the antenna lies along before matching the labels to E and H, because the same physical slice is the E-plane for one mounting and the H-plane for another.

## How to read an antenna radiation pattern

![A polar plot in decibels of a directional antenna pointing right, with numbered callouts: 1 the main lobe at 0 dB, 2 the half-power beamwidth of 17 degrees between the minus 3 dB points, 3 the first null, 4 the first side lobe 12.9 dB below the peak, and 5 the back lobe, giving a front-to-back ratio of 20 dB](./radiation-pattern-anatomy.svg)

1. Main lobe. The lobe containing the peak, the direction the antenna is designed for. On a normalised plot its tip touches 0 dB.
2. Half-power beamwidth (HPBW). The angle between the two −3 dB points either side of the peak, where the power has halved. A datasheet gives one for each cut. The angle between the first nulls (FNBW) is wider, often a little over twice the HPBW.
3. Nulls. Directions of very low radiation between lobes. Designers can point a null at an interfering transmitter.
4. Side lobes. Smaller lobes off the main beam. The **side-lobe level** (SLL) is the highest, or the first, side lobe in dB below the peak. A uniform linear array gives about −13 dB; tapering the element amplitudes lowers it but widens the beam.
5. Back lobe and front-to-back ratio. The **front-to-back ratio** (F/B) is the peak gain divided by the gain in the opposite direction, in dB. A high F/B stops a directional antenna from hearing, or interfering with, what is behind it.

To describe a pattern in one sentence, give the gain, the beamwidth in each plane, the side-lobe level and the F/B. For the diagram: "Peak gain at 0°, 17° half-power beamwidth, first side lobe at −12.9 dB, front-to-back ratio 20 dB."

## Polar plots in dB or linear scale

The radius of a polar pattern can be the power in dB, the power on a linear scale, or the field strength on a linear scale. The same antenna looks very different on each:

| Relative to the peak | Power (linear) | Field (linear) | On a linear power plot |
| --- | --- | --- | --- |
| 0 dB | 1 | 1 | The tip of the main lobe |
| −3 dB | 0.5 | 0.707 | Halfway out: the half-power point that sets the beamwidth |
| −10 dB | 0.1 | 0.316 | A tenth of the way out: a big side lobe looks small |
| −20 dB | 0.01 | 0.1 | One per cent: a back lobe 20 dB down is barely a dot |
| −30 dB | 0.001 | 0.032 | Invisible |

A dB plot needs a floor, the level drawn at the centre, often −30 or −40 dB. Anything weaker is clipped to the centre, so a null looks like it reaches zero even when it is only 35 dB down. The dashed circle on most plots marks −3 dB for reading the beamwidth.

Switch the demo's Scale to Linear power to see the side lobes almost disappear.

## Directivity, gain, dBi and dBd

**Directivity** (D) is how much an antenna concentrates power in its best direction, compared with an isotropic antenna radiating the same total power equally in all directions:

$$
D = \frac{4\pi\, U_{\max}}{P_{\text{rad}}} = \frac{4\pi\, |F|_{\max}^2}{\displaystyle\oint |F(\theta,\phi)|^2 \, d\Omega}
$$

where U is the power per unit solid angle and F the field pattern. The demo computes D by summing the pattern over a 1° grid on the sphere.

**Gain** (G) is directivity times the radiation efficiency η, which accounts for power lost as heat in the antenna: G = ηD. A lossless antenna has G = D. Some datasheets also include the mismatch loss and call the result realised gain.

Gain is quoted in decibels against a reference antenna:

- dBi is relative to an isotropic radiator, which has 0 dBi.
- dBd is relative to a half-wave dipole, which has 2.15 dBi. So dBd = dBi − 2.15, and a 9 dBi antenna is a 6.85 dBd antenna.

Directivity is linked to the beam size. For a single main beam with small side lobes, Kraus's approximation is $D \approx 41{,}253 / (\theta_E\, \theta_H)$, with the E-plane and H-plane beamwidths in degrees (41,253 is the number of square degrees in a sphere). A beam 20° wide in both planes gives about 103, or 20 dBi.

## Radiation patterns of common antennas

| Antenna | Pattern shape | Directivity | Formula or rule |
| --- | --- | --- | --- |
| Isotropic | Sphere: the same in every direction. A theoretical reference | 1 (0 dBi) | $F = 1$ |
| Short (Hertzian) dipole | Doughnut round the wire, nulls along it. HPBW 90° | 1.5 (1.76 dBi) | $F = \sin\theta$ |
| Half-wave dipole | Slightly flatter doughnut. HPBW 78° | 1.64 (2.15 dBi) | $F = \dfrac{\cos(\frac{\pi}{2}\cos\theta)}{\sin\theta}$ |
| Quarter-wave monopole | Top half of the dipole's doughnut, above a ground plane. Omnidirectional in azimuth | 3.28 (5.16 dBi) on an infinite ground plane | Dipole pattern for θ ≤ 90°, nothing below |
| Small loop | Doughnut like the short dipole, with nulls along the loop's axis | 1.5 (1.76 dBi) | $F = \sin\theta$, with θ from the loop axis |
| Patch (microstrip) | One broad lobe away from the ground plane | About 7 dBi in the demo's model (5 dBd) | Two radiating slots: $\cos(\frac{kL}{2}\sin\theta)$ in the E-plane |
| Yagi-Uda | End-fire beam along the boom, with side lobes and a back lobe | Rises with the number of elements and the boom length | Mutual coupling between a driven element, a reflector and directors |
| Helical (axial mode) | End-fire beam along the helix axis, circularly polarised | Kraus's empirical $D \approx 15 N C^2 S / \lambda^3$ | N turns of circumference C and spacing S |
| Horn | One main lobe, low side lobes, small back lobe | From the aperture area A | $D = \dfrac{4\pi}{\lambda^2}\varepsilon_{ap} A$, with $\varepsilon_{ap}$ about 0.5 for an optimum-gain pyramidal horn |
| Phased array | A narrow beam that can be steered electronically | About $2Nd/\lambda$ for a broadside line of N isotropic elements | Element pattern × array factor |

The dipole, monopole and small loop are **omnidirectional**: their pattern is a circle in the horizontal plane, so they cover every compass direction equally. An "omnidirectional antenna radiation pattern" usually means this doughnut. The patch, Yagi, helix and horn are **directional**: one main beam and as little as possible elsewhere.

The figures above come from the textbook models in the Sources. A real antenna's mounting, cable and nearby metal change its pattern, so the measured datasheet pattern is the reference for a specific product.

## Array factor and beam steering

An array of identical elements has a pattern equal to the **element pattern** times the **array factor**, which depends only on where the elements are and how they are fed. For N equal elements spaced d apart in a line, with a phase step β from one element to the next:

$$
AF(\gamma) = \frac{\sin(N\psi/2)}{N \sin(\psi/2)}, \qquad \psi = kd\cos\gamma + \beta, \qquad k = \frac{2\pi}{\lambda}
$$

where γ is the angle from the line of elements. Feeding all elements in phase (β = 0) puts the beam at broadside, at right angles to the line. To steer the beam an angle θ₀ away from broadside, the phase step is β = −kd sin θ₀. Phase shifters or time delays behind each element set β, so a phased array moves its beam without moving the antenna.

Numbers from the demo, for 8 half-wave dipoles at d = 0.5λ in front of a reflector:

| Steering | HPBW in the scan plane | First side lobe | Directivity |
| --- | --- | --- | --- |
| 0° | 12.8° | −12.8 dB | 15.95 dBi |
| 20° | 13.5° | −12.8 dB | 15.87 dBi |
| 45° | 17.2° | −11.9 dB | 15.65 dBi |

The beam widens as it steers, roughly as 1/cos θ₀, because the array looks shorter from an angle. Spacing matters too: if d/λ ≥ 1/(1 + |sin θ₀|), a second full-size beam, a **grating lobe**, appears. At 30° steering that limit is 0.67λ, and the demo flags it when you go past it.

A line of elements with nothing behind it radiates the same beam on both sides of the line, at 180° − θ₀. Array panels put a reflector or ground plane about a quarter-wave behind the elements to remove that mirror beam, which the demo models with its "Reflector behind array" option.

## Antenna radiation pattern measurement

Patterns are measured by turning the antenna under test on a positioner while a fixed probe antenna transmits or receives, and recording the signal at each angle. The test usually takes place in an **anechoic chamber**, a room lined with radio-absorbing foam cones so that the walls don't reflect energy back. IEEE Std 149 sets out the recommended practice.

The probe has to be in the far field. The usual rule for an antenna whose largest dimension is D is

$$
r \geq \frac{2D^2}{\lambda}
$$

which keeps the phase error across the aperture below π/8 (22.5°); r should also be much larger than D and λ. A 1 m dish at 10 GHz (λ = 3 cm) needs at least 67 m. A 30 cm panel at 2.4 GHz needs 1.44 m. Large antennas are measured in a **compact range**, where a reflector makes a plane wave in a short room, or by near-field scanning, where a probe samples the field close to the antenna and a transform computes the far-field pattern.

A full measurement is a large grid: one cut every degree, at many frequencies and in both polarisations, compared against simulation cut by cut.

## Where antenna radiation patterns are used

- Radar and electronic warfare. Beamwidth sets angular resolution, side lobes set how easily clutter or jamming leaks in, and phased arrays scan beams electronically. See how SciChart is used in [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).
- Signals intelligence and direction finding. Direction-finding systems compare the signals received on antennas with known patterns to estimate where a transmitter is. See [SciChart for SIGINT](https://www.scichart.com/sigint-signals-intelligence/).
- Antenna design and test. Simulated and measured patterns are compared cut by cut, and plotted against frequency. See SciChart in [design, emulation and test](https://www.scichart.com/design-emulation-test/).
- Mobile networks and Wi-Fi. Sector antennas, beamforming arrays in 5G base stations and access points are chosen by their beamwidth and tilt.
- Satellites and radio astronomy. Dish patterns set coverage areas and how close to the Sun or another satellite an antenna can point.

The pattern is one half of an antenna's behaviour; the other is its impedance and match, which is read on a [Smith chart](/learn/chart-types/complex/smith-chart/).

## Polar plot vs 3D pattern vs rectangular plot

| Chart | Shows | Best for | Watch out for |
| --- | --- | --- | --- |
| Polar plot (E-plane and H-plane cuts) | Gain against angle in one plane, as a shape round the antenna | Datasheets; reading beamwidth, nulls and F/B at a glance | Two cuts can miss lobes that lie between them |
| 3D radiation pattern | The whole pattern as a surface coloured by gain | Seeing the shape in all directions; steered or tilted beams | Hard to read exact values; needs rotating |
| Rectangular (Cartesian) plot | Gain in dB against angle on x-y axes | Comparing side-lobe levels and narrow beams precisely | Loses the sense of direction |
| Contour or heatmap over two angles | Gain over azimuth and elevation (or u-v) as colour | Phased arrays and grating lobes over the whole scan | Needs a colour key; less familiar to non-specialists |
| [Smith chart](/learn/chart-types/complex/smith-chart/) | Impedance and reflection, not the pattern | Matching the antenna to its feed line | Says nothing about direction |

On a [radar chart](/learn/chart-types/radial/radar-chart/) or a [polar area chart](/learn/chart-types/radial/polar-area-chart/), the angle is a category, not a physical direction; a radiation pattern needs a continuous angle in degrees.

## Common radiation pattern mistakes

- **Mixing dB and linear radii.** Comparing a dB plot with a linear one, or reading a dB plot's radius as if it were linear, makes side lobes look far bigger or smaller than they are. Check the radial axis labels.
- **Treating one cut as the whole pattern.** A cut through the main beam can miss a lobe that sits between the E-plane and H-plane. Look at the 3D pattern, or at several cuts, before calling an antenna clean.
- **Confusing dBi and dBd.** The same antenna reads 2.15 dB lower in dBd. Convert to one unit before comparing datasheets.
- **Calling directivity gain.** Gain includes losses; a lossy antenna has the same pattern shape but less gain.
- **Reading the floor as a null.** A pattern clipped at −30 dB shows every weaker direction at the centre. The real null may be shallower or deeper.
- **Measuring too close.** Inside 2D²/λ the measured pattern has filled-in nulls and a wrong beamwidth.
- **Ignoring the mounting.** A mast, a vehicle roof or a hand changes the pattern; a free-space pattern doesn't describe the installed antenna.
- **Using a normalised pattern as absolute gain.** A normalised plot puts every antenna's peak at 0 dB. Add the gain figure to read absolute values.

## How to plot an antenna radiation pattern in JavaScript, React or Angular

Antenna software works with patterns sampled every degree, over many frequencies and both polarisations, and often redraws them as a beam steers. SciChart.js draws on the GPU with WebGL, so the polar cuts and the 3D surface update together while you drag a slider, and stay smooth with large measured datasets. The demo computes each pattern in the browser from textbook models.

Pick an **Antenna**: a half-wave dipole, a short dipole, a quarter-wave monopole, a patch, a Yagi-Uda (approximated as an end-fire array with the Hansen-Woodyard phase, which overstates its side lobes) or a linear phased array. For the Yagi and the array, **Elements** and **Spacing** (in wavelengths) set the size; for the array, **Steering** moves the beam and **Reflector behind array** removes the mirror beam. **Scale** switches both charts between dB and linear power. The readout gives the directivity in dBi and dBd, the beamwidth in each plane, the front-to-back ratio and the first side lobe. Hover over the polar chart for values, scroll to zoom, drag to pan, and drag the 3D chart to rotate it.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="antenna radiation pattern" demo="polar-line-chart" demoLabel="polar line chart" docs="/2d-charts/chart-types/polar-line-renderable-series/" docsLabel="SciChart.js polar line chart documentation" />

Here is the code for this chart. The pattern maths (element patterns, array factor, directivity, beamwidth and side lobes) is plain JavaScript. SciChart.js draws the cuts as polar line series and the 3D pattern as a lit triangle mesh.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarLineRenderableSeries,
        EPolarAxisMode,
        NumberRange,
        XyDataSeries,
        PolarCursorModifier,
        PolarLegendModifier,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    const FLOOR_DB = -40; // the level drawn at the centre of the plot

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(
            new PolarNumericAxis(wasmContext, { polarAxisMode: EPolarAxisMode.Angular, visibleRange: new NumberRange(0, 360), autoTicks: false, majorDelta: 30 })
        );
        sciChartSurface.yAxes.add(
            new PolarNumericAxis(wasmContext, { polarAxisMode: EPolarAxisMode.Radial, visibleRange: new NumberRange(FLOOR_DB, 0), autoTicks: false, majorDelta: 10 })
        );

        // Each cut: angles in degrees and gain in dB relative to the peak, from your simulation or measurement
        const { eCut, hCut } = getYourPatternCuts();
        const line = (name: string, angles: number[], gainDb: number[], stroke: string, dashed = false) =>
            new PolarLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: angles,
                    yValues: gainDb.map((g) => Math.max(g, FLOOR_DB)), // clip at the floor
                    dataSeriesName: name
                }),
                stroke,
                strokeThickness: dashed ? 1.5 : 2.5,
                strokeDashArray: dashed ? [6, 4] : undefined
            });
        sciChartSurface.renderableSeries.add(
            line("−3 dB", eCut.angles, eCut.angles.map(() => -3), "#FFFFFF", true),
            line("E-plane", eCut.angles, eCut.gainDb, "#F48420"),
            line("H-plane", hCut.angles, hCut.gainDb, "#50C7E0")
        );
        sciChartSurface.chartModifiers.add(
            new PolarCursorModifier({ showTooltip: true }),
            new PolarLegendModifier({ showCheckboxes: true }),
            new PolarMouseWheelZoomModifier(),
            new PolarPanModifier(),
            new PolarZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const RadiationPatternChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarLineRenderableSeries,
        EPolarAxisMode,
        NumberRange,
        XyDataSeries,
        PolarCursorModifier,
        PolarLegendModifier,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";

    const FLOOR_DB = -40; // the level drawn at the centre of the plot

    @Component({
        selector: "app-radiation-pattern-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class RadiationPatternChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(
                new PolarNumericAxis(wasmContext, { polarAxisMode: EPolarAxisMode.Angular, visibleRange: new NumberRange(0, 360), autoTicks: false, majorDelta: 30 })
            );
            sciChartSurface.yAxes.add(
                new PolarNumericAxis(wasmContext, { polarAxisMode: EPolarAxisMode.Radial, visibleRange: new NumberRange(FLOOR_DB, 0), autoTicks: false, majorDelta: 10 })
            );

            // Each cut: angles in degrees and gain in dB relative to the peak, from your simulation or measurement
            const { eCut, hCut } = getYourPatternCuts();
            const line = (name: string, angles: number[], gainDb: number[], stroke: string, dashed = false) =>
                new PolarLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: angles,
                        yValues: gainDb.map((g) => Math.max(g, FLOOR_DB)), // clip at the floor
                        dataSeriesName: name
                    }),
                    stroke,
                    strokeThickness: dashed ? 1.5 : 2.5,
                    strokeDashArray: dashed ? [6, 4] : undefined
                });
            sciChartSurface.renderableSeries.add(
                line("−3 dB", eCut.angles, eCut.angles.map(() => -3), "#FFFFFF", true),
                line("E-plane", eCut.angles, eCut.gainDb, "#F48420"),
                line("H-plane", hCut.angles, hCut.gainDb, "#50C7E0")
            );
            sciChartSurface.chartModifiers.add(
                new PolarCursorModifier({ showTooltip: true }),
                new PolarLegendModifier({ showCheckboxes: true }),
                new PolarMouseWheelZoomModifier(),
                new PolarPanModifier(),
                new PolarZoomExtentsModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The cuts are `PolarLineRenderableSeries` on a `SciChartPolarSurface`. The angular `PolarNumericAxis` runs from 0 to 360° with 0° (the beam) on the right; the radial axis runs from the −40 dB floor at the centre to 0 dB at the rim, and values below the floor are clipped.
- The −3 dB circle is an ordinary dashed polar line at a constant radius, so it appears in the legend and can be switched off.
- The 3D pattern uses a custom scene entity: a class extending `BaseSceneEntity3D` whose `Render()` emits coloured, lit triangles with `ImmediateLitMeshContext`, converted from data to world coordinates with the axis calculators. This draws a closed surface of any shape, which a grid-based surface series can't.
- `OrbitModifier3D`, `MouseWheelZoomModifier3D` and `ResetCamera3DModifier` rotate, zoom and reset the 3D view.

**See it in the demo app:** [JavaScript polar line chart](https://www.scichart.com/demo/javascript/polar-line-chart) · [React polar line chart](https://www.scichart.com/demo/react/polar-line-chart) · [Angular polar line chart](https://www.scichart.com/demo/angular/polar-line-chart), and for 3D surfaces, [JavaScript 3D surface mesh chart](https://www.scichart.com/demo/javascript/realtime-3d-surface-mesh-chart) · [React 3D surface mesh chart](https://www.scichart.com/demo/react/realtime-3d-surface-mesh-chart) · [Angular 3D surface mesh chart](https://www.scichart.com/demo/angular/realtime-3d-surface-mesh-chart).

**Go deeper:** [SciChart.js polar line chart documentation](/2d-charts/chart-types/polar-line-renderable-series/), the [immediate mesh 3D documentation](/3d-charts/chart-types/immediate-mesh-3d/) for custom 3D geometry, the [3D surface mesh documentation](/3d-charts/chart-types/surface-mesh-3d/), and the [Smith chart guide](/learn/chart-types/complex/smith-chart/). For how RF and defence software uses SciChart, see [SciChart for aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What is an antenna radiation pattern?

An antenna radiation pattern is a plot of how strongly an antenna radiates, or receives, in each direction, measured far from the antenna. It is usually shown as gain relative to the peak, in decibels, either as a 3D surface around the antenna or as 2D polar plots of slices through it. Because antennas are reciprocal, the same pattern describes transmitting and receiving.

### What is the difference between the E-plane and the H-plane?

The E-plane is the slice through the radiation pattern that contains the direction of maximum radiation and the electric field. The H-plane is the slice at right angles to it, containing the direction of maximum radiation and the magnetic field. For a vertical dipole, the E-plane is any vertical plane through the wire and the H-plane is the horizontal plane.

### What does a dipole antenna radiation pattern look like in 3D?

A dipole's 3D radiation pattern is a doughnut (torus) around the wire. It radiates equally in every direction at right angles to the wire, and not at all along it. A vertical cut through the wire gives a figure of eight with nulls at the top and bottom; a horizontal cut gives a circle. A half-wave dipole has a directivity of 2.15 dBi and a half-power beamwidth of about 78 degrees in the E-plane.

### What is the difference between dBi and dBd?

dBi gives an antenna's gain in decibels relative to an isotropic antenna, an ideal source that radiates equally in all directions. dBd gives it relative to a half-wave dipole, which has 2.15 dBi. To convert, subtract 2.15: an antenna with 9 dBi has about 6.85 dBd. Quoting dBd makes the same antenna look 2.15 dB weaker, so check which unit a datasheet uses before comparing.

### What is the half-power beamwidth of an antenna?

The half-power beamwidth (HPBW) is the angle between the two directions either side of the main beam where the radiated power has fallen to half its peak value, which is 3 dB below the peak. It is measured on a cut through the main beam, so an antenna usually has one beamwidth in the E-plane and another in the H-plane. A narrower beam means higher directivity.

### How do I plot an antenna radiation pattern in JavaScript?

Compute or load the gain in dB at each angle of a cut, clip it at a floor such as -40 dB, and draw it as a line series on a polar chart with an angular axis from 0 to 360 degrees and a radial axis from the floor to 0 dB. Add a dashed circle at -3 dB to read the beamwidth. SciChart.js does this with SciChartPolarSurface, PolarNumericAxis and PolarLineRenderableSeries, and can draw the full 3D pattern on a SciChart3DSurface, in plain JavaScript, React or Angular.

## Sources

- Balanis, C. A. (2016), *Antenna Theory: Analysis and Design*, 4th edition, Wiley. Radiation patterns, directivity, dipoles and monopoles, the cavity model of the patch, array factor and beam steering, horns.
- Kraus, J. D. and Marhefka, R. J. (2002), *Antennas for All Applications*, 3rd edition, McGraw-Hill. The beam-area approximation of directivity, helical antennas, Yagi-Uda arrays.
- [IEEE Std 145-2013, IEEE Standard for Definitions of Terms for Antennas](https://doi.org/10.1109/IEEESTD.2014.6758443). Definitions of radiation pattern, E-plane and H-plane, directivity, gain and side lobes.
- [IEEE Std 149-2021, IEEE Recommended Practice for Antenna Measurements](https://ieeexplore.ieee.org/document/9714428). Pattern measurement ranges and the far-field distance.
- Hansen, W. W. and Woodyard, J. R. (1938), A new principle in directional antenna design. *Proceedings of the IRE*, 26(3), 333–345. The end-fire phase condition used for the demo's Yagi approximation.

<LearnCta position="bottom" chart="antenna radiation pattern" demo="polar-line-chart" demoLabel="polar line chart" docs="/2d-charts/chart-types/polar-line-renderable-series/" docsLabel="SciChart.js polar line chart documentation" />
