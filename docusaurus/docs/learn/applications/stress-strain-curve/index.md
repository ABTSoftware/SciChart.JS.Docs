---
sidebar_position: 120
sidebar_label: Stress-Strain Curve
title: "Stress-Strain Curve: How to Read It (Yield Strength, Modulus and UTS, With an Interactive Example)"
description: "How to read a stress-strain curve: Young's modulus, 0.2% offset yield strength, UTS, necking, ductile vs brittle, true stress and S-N curves, with a live tensile test."
keywords:
    [
        "stress strain curve",
        "stress strain graph",
        "stress strain diagram",
        "stress vs strain curve",
        "how to read a stress strain curve",
        "yield strength",
        "ultimate tensile strength",
        "young's modulus from stress strain curve",
        "0.2% offset method",
        "engineering vs true stress strain",
        "ductile vs brittle stress strain curve",
        "tensile test",
        "s-n curve",
        "fatigue curve"
    ]
image: /img/learn/stress-strain-curve-og.png
related: [line-chart, scatter-plot, error-bars, log-scale-graph]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a stress-strain curve tell you?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A stress-strain curve tells you how a material responds as it is stretched until it breaks. From it you read the stiffness (Young's modulus, the slope of the first straight part), the stress at which permanent deformation starts (yield strength), the highest stress it can carry (ultimate tensile strength), how far it stretches before breaking (elongation, a measure of ductility) and the energy it absorbs (toughness, the area under the curve)." }
                },
                {
                    "@type": "Question",
                    "name": "How do you find Young's modulus from a stress-strain curve?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Young's modulus is the slope of the straight, elastic part at the start of the curve: the change in stress divided by the change in strain between two points on it. Fit a straight line through the readings in that region rather than using two single points, because the first few readings are often affected by the grips settling. Steels come out at about 200 GPa and aluminium alloys at about 70 GPa." }
                },
                {
                    "@type": "Question",
                    "name": "How do you find the yield strength with the 0.2% offset method?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Draw a straight line with the same slope as the elastic part of the curve (Young's modulus), starting at 0.2% strain (0.002) on the strain axis instead of at the origin. The stress where this line crosses the curve is the 0.2% offset yield strength, also called the 0.2% proof stress or Rp0.2. It is the stress that leaves a permanent strain of 0.2% when the load is removed." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between engineering and true stress-strain curves?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Engineering stress divides the force by the specimen's original cross-section, and engineering strain divides the extension by the original length. True stress uses the actual, shrinking cross-section, and true strain adds up each small extension relative to the current length. Up to the start of necking, true stress = engineering stress × (1 + engineering strain) and true strain = ln(1 + engineering strain). The true curve keeps rising after the ultimate tensile strength, while the engineering curve falls." }
                },
                {
                    "@type": "Question",
                    "name": "Why does the stress drop after the ultimate tensile strength?",
                    "acceptedAnswer": { "@type": "Answer", "text": "After the ultimate tensile strength, the deformation concentrates in one short section of the specimen, which thins into a neck. The neck's cross-section shrinks faster than the metal there hardens, so the force needed to keep stretching it falls. Engineering stress is that force divided by the original area, so it falls too, even though the true stress in the neck is still rising." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a stress-strain curve in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Convert the test machine's force and extension readings to stress (force over original area, in MPa) and strain (extension over gauge length, often in %), and draw them as a line series with strain on the x-axis. Fit the modulus over the elastic region, find the 0.2% offset yield and the maximum stress in plain JavaScript, and mark them with a scatter series and text annotations. SciChart.js does this with FastLineRenderableSeries, XyScatterRenderableSeries and TextAnnotation, in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Stress-Strain Curve

## What is a stress-strain curve?

A **stress-strain curve** (also called a stress-strain graph or diagram) plots the stress in a material against its strain as it is stretched, usually in a tensile test until it breaks. Stress is force per unit area; strain is the stretch as a fraction of the original length. Its shape gives a material's stiffness, yield strength, ultimate tensile strength and ductility.

![A simulated tensile test of mild steel: engineering stress in MPa against strain in per cent, rising steeply, levelling off at the yield point, climbing through strain hardening to the ultimate tensile strength at 381 MPa and falling to fracture at 25% strain, with a second chart zoomed in on the first 1% of strain showing the dashed 0.2% offset line meeting the curve at the yield strength, in a dark navy theme](/img/learn/stress-strain-curve-og.png)

*A simulated tensile test on mild steel, with the start of the curve enlarged on the right to show the 0.2% offset construction (sample data). [Try the interactive version](#how-to-plot-a-stress-strain-curve-in-javascript-react-or-angular).*

:::tip Key takeaways
- Strain goes on the x-axis and stress on the y-axis. The curve is measured in a tensile test to standards such as ASTM E8/E8M or ISO 6892-1.
- The first straight part is elastic: its slope is Young's modulus, and the material springs back when unloaded.
- Most metals have no sharp yield point, so yield strength is read with the 0.2% offset method.
- The peak is the ultimate tensile strength (UTS). After it the specimen necks, and the engineering stress falls until fracture.
- Ductile materials stretch a long way before breaking; brittle ones, such as cast iron, break with almost no plastic strain.
:::

## How a tensile test produces the curve

In a **tensile test**, a specimen of standard shape is gripped at both ends in a test machine and pulled apart at a controlled rate until it breaks. Metals are tested to ASTM E8/E8M or ISO 6892-1, plastics to ISO 527 or ASTM D638. The machine records two things many times a second:

- the force, from a load cell;
- the extension of a marked length in the middle of the specimen, the **gauge length** $L_0$, from an extensometer clipped to it.

Neither raw reading can be compared between specimens of different sizes, so both are normalised by the specimen's original dimensions:

$$
\sigma = \frac{F}{A_0} \qquad \varepsilon = \frac{\Delta L}{L_0}
$$

where $\sigma$ is the engineering stress (in MPa, which is N/mm²), $F$ the force, $A_0$ the original cross-sectional area, $\varepsilon$ the engineering strain and $\Delta L$ the extension. Strain has no units; it is usually shown in per cent.

As an example, take a round aluminium alloy bar 12.5 mm in diameter with a 62.5 mm gauge length (five diameters, the proportional specimen in ASTM E8M and ISO 6892-1). Its area is $\pi \times 6.25^2 \approx 122.7$ mm². A force of 20 kN gives a stress of $20{,}000 / 122.7 \approx 163$ MPa, and an extension of 0.148 mm gives a strain of $0.148 / 62.5 = 0.00236$, or 0.236%. Plotting every pair of readings this way traces the stress-strain curve.

## How to read a stress-strain curve

![An annotated stress-strain curve of a ductile metal, not to scale: a straight elastic region whose slope is Young's modulus up to the proportional limit, a dashed line parallel to it starting at 0.2% strain that meets the curve at the yield strength, a strain hardening region rising to the ultimate tensile strength, and a necking region falling to fracture, with the uniform elongation and the elongation at fracture marked on the strain axis](./stress-strain-curve-anatomy.svg)

Read the curve from the origin outwards, one region at a time.

### Elastic region and Young's modulus

At first, stress rises in proportion to strain. This is **Hooke's law**:

$$
\sigma = E\,\varepsilon
$$

The constant $E$ is **Young's modulus** (the modulus of elasticity), the slope of this straight part. It measures stiffness: a steel at about 200 GPa stretches a third as much as an aluminium alloy at about 70 GPa under the same stress. In the elastic region, the atoms are pulled slightly apart but not rearranged, so the specimen returns to its original length when the load is removed.

To find Young's modulus from a stress-strain curve, take the slope of the straight part: $E = \Delta\sigma / \Delta\varepsilon$. For the aluminium bar above, 10 kN gives 81.5 MPa at 0.118% strain and 20 kN gives 163.0 MPa at 0.236%, so

$$
E = \frac{163.0 - 81.5}{0.00236 - 0.00118} \approx 69{,}000 \text{ MPa} = 69 \text{ GPa}
$$

Test software fits a least-squares line through many readings in this range rather than using two points. ASTM E111 covers measuring the modulus itself, which needs a more precise extensometer than an ordinary tensile test.

### Proportional limit and elastic limit

The **proportional limit** is the highest stress at which the curve is still a straight line. The **elastic limit** is the highest stress the material can take and still return fully to its original length. For most metals the two are close together and hard to pin down, because the curve bends away from the line gradually. Neither is used as a design figure; the yield strength is.

### Yield strength and the 0.2% offset method

**Yield strength** is the stress at which the material starts to deform permanently (plastically). Some low-carbon steels show a clear **yield point**: the stress peaks (the upper yield point), drops slightly (the lower yield point) and runs flat for a while as bands of yielded metal, called Lüders bands, spread along the specimen. Most other metals, such as aluminium alloys, copper and stainless steel, bend smoothly from elastic to plastic with no sharp point.

For those, the **0.2% offset method** gives a repeatable value:

1. Draw a line with slope $E$, parallel to the elastic part, starting at a strain of 0.2% (0.002) instead of at the origin.
2. Find where this line crosses the curve.
3. The stress there is the 0.2% offset yield strength, written $R_{p0.2}$ in ISO 6892-1 and called the proof stress.

It means the stress that leaves 0.2% of permanent strain after the load is taken off. For the aluminium bar, the offset line is $\sigma = 69{,}000\,(\varepsilon - 0.002)$. At a force of 33.9 kN the curve reads 276 MPa at 0.600% strain, and the line gives $69{,}000 \times (0.006 - 0.002) = 276$ MPa: they cross, so the yield strength is 276 MPa. At 30 kN (244.5 MPa, 0.359%) the curve is still above the line; by 36 kN it has passed below it.

For plastics, ISO 527 defines the yield point differently: it is the first point where the strain increases without the stress increasing, the top of the first peak.

### Strain hardening and ultimate tensile strength

After yielding, the stress keeps rising, but more slowly. This is **strain hardening** (work hardening): the plastic deformation multiplies and tangles the dislocations in the metal's crystals, so each further increment of strain takes more stress. The specimen stretches evenly along its whole gauge length in this region.

The highest point on the curve is the **ultimate tensile strength** (UTS), also called the tensile strength $R_m$: the maximum force divided by the original area. For the aluminium bar, a maximum force of 38.0 kN gives a UTS of 310 MPa. The strain at that point is the uniform elongation.

### Necking and fracture

At the UTS, the deformation stops being even. One short section starts to thin faster than the rest and forms a **neck**. The neck's cross-section shrinks faster than the metal hardens, so the force needed to keep stretching it falls, and the engineering stress, still divided by the original area, falls with it. The specimen breaks in the neck.

The **elongation after fracture** is the permanent increase in gauge length after the break, in per cent of $L_0$. It is the usual measure of ductility, together with the **reduction of area**, the change in cross-section at the break.

## Ductile vs brittle stress-strain curves

The shape of the curve sorts materials into ductile and brittle ones. A ductile material yields and stretches well beyond its elastic limit before breaking; a brittle one breaks at or soon after the end of its elastic region, with little warning.

| Material | Young's modulus (GPa) | Yield strength (MPa) | Tensile strength (MPa) | Elongation (%) | Shape of the curve |
| --- | --- | --- | --- | --- | --- |
| Low-carbon steel, 1020 hot rolled | 207 | 210 | 380 | 25 | Ductile: sharp yield point and plateau, long strain hardening, necking |
| Aluminium alloy 6061-T6 | 69 | 276 | 310 | 12 | Ductile: smooth bend into yield, short strain hardening, necking |
| Grey cast iron, grade G3000 | 66 to 97 | Not defined | 207 (minimum) | Below 1 | Brittle: curved from the start, breaks at the top of the curve |
| Polycarbonate | 2.38 | 62 | 63 to 72 | 110 to 150 | Ductile polymer: yield peak, drop as a neck forms, long flat cold drawing, then a rise to break |

Typical room-temperature values, from Callister and Rethwisch's tables. Real values depend on the grade, heat treatment, specimen and test speed, so use the supplier's certified figures for design.

What the table shows:

- Stiffness and strength are different properties. Polycarbonate is about 90 times less stiff than the steel (2.38 against 207 GPa), but its yield strength is only about 3.4 times lower (62 against 210 MPa).
- Grey cast iron has no yield strength: the graphite flakes in it act as small cracks, so it breaks before any useful plastic flow. Its curve is not even straight at the start, so its modulus depends on where the slope is taken.
- Polycarbonate necks right at its yield peak, then the neck spreads along the whole specimen at an almost constant stress (cold drawing) as the polymer chains line up, so it can stretch to more than twice its length.
- Temperature and loading rate change the shape. Steels can turn brittle in cold conditions, and plastics become stiffer and more brittle when pulled faster.

## Engineering vs true stress-strain curves

Engineering stress and strain use the specimen's original area and length. As the specimen stretches, its cross-section shrinks, so the real stress in the material is higher than the engineering stress. **True stress** divides the force by the actual area $A$, and **true strain** adds up each small extension relative to the current length:

$$
\sigma_T = \frac{F}{A} \qquad \varepsilon_T = \int_{L_0}^{L}\frac{dL}{L} = \ln\frac{L}{L_0}
$$

Metals keep their volume when they deform plastically ($A L = A_0 L_0$), so while the specimen stretches evenly, both can be worked out from the engineering values:

$$
\sigma_T = \sigma\,(1 + \varepsilon) \qquad \varepsilon_T = \ln(1 + \varepsilon)
$$

At the aluminium bar's UTS (310 MPa at 8% engineering strain), the true stress is $310 \times 1.08 \approx 335$ MPa and the true strain is $\ln 1.08 \approx 0.077$. At small strains the two curves are almost the same; they draw apart as the strain grows.

These two formulas only hold up to the start of necking. After that, the strain is concentrated in the neck, and the true stress has to be found by measuring the neck's diameter. Drawn that way, the true stress keeps rising until fracture, because the metal in the neck is still hardening.

Necking starts when the hardening can no longer make up for the shrinking area. In true terms, that is when the slope of the true curve falls to the true stress itself, $d\sigma_T / d\varepsilon_T = \sigma_T$ (Considère's criterion). Use the engineering curve for design limits and material specifications, and the true curve for modelling plastic forming and crash behaviour, where finite element programs expect true stress against true plastic strain.

| | Engineering curve | True curve |
| --- | --- | --- |
| Stress | Force over original area, $F/A_0$ | Force over actual area, $F/A$ |
| Strain | $\Delta L / L_0$ | $\ln(L/L_0)$ |
| After the UTS | Falls until fracture | Keeps rising until fracture |
| Used for | Specifications, data sheets, design allowables | Metal forming, plasticity models, simulation input |

## Toughness and resilience: the area under the curve

The area under a stress-strain curve is the energy absorbed per unit volume of material. Stress in MPa times strain gives MJ/m³.

- The **modulus of resilience** is the area under the elastic part, up to yield: the energy a material can store and give back without permanent damage. For a straight elastic line it is a triangle, $U_r = \sigma_y^2 / 2E$. For the aluminium alloy, $276^2 / (2 \times 69{,}000) \approx 0.55$ MJ/m³; for the 1020 steel, $210^2 / (2 \times 207{,}000) \approx 0.11$ MJ/m³. Springs are made from materials with a high yield strength and a modest modulus for this reason.
- **Toughness** (tensile toughness) is the area under the whole curve to fracture: the energy needed to break the material. A rough estimate for a ductile metal is the average of yield strength and UTS times the strain at fracture, $(210 + 380)/2 \times 0.25 \approx 74$ MJ/m³ for the steel. Grey cast iron, with a similar tensile strength but under 1% strain, absorbs less than a hundredth of that.

Tensile toughness is not the same as fracture toughness, which measures resistance to a crack that is already there and comes from a different test.

## S-N curves: stress-strain's fatigue counterpart

A stress-strain curve describes one pull to failure. Parts that are loaded and unloaded millions of times, such as shafts, springs, aircraft skins and bridges, can fail by **fatigue** at stresses well below the yield strength. The curve for that is the **S-N curve** (or Wöhler curve): the stress amplitude $S$ against the number of cycles to failure $N$, from tests in which specimens are loaded back and forth at a fixed stress until they break (ASTM E466, ISO 1099).

![S-N curves on logarithmic axes from a thousand to a billion cycles: a steel line falls from about 342 MPa at 1,000 cycles to a knee at about 190 MPa near one million cycles and then runs flat, the endurance limit; a dashed aluminium alloy line keeps falling with no knee, with its fatigue strength marked at 500 million cycles; scattered test points sit around the steel line](./s-n-curve.svg)

Both axes are almost always on a [log scale](/learn/axes-and-scales/log-scale-graph/), because the lives span several powers of ten. On log-log axes much of the curve is close to a straight line, Basquin's relation $S = a N^b$, with $b$ typically around −0.05 to −0.12 for metals.

- Steels and titanium alloys usually show a knee and then a flat line, the **endurance limit**. Below it, a smooth specimen survives indefinitely. A common first estimate for steels with a UTS up to about 1,400 MPa is an endurance limit of half the UTS, and a fatigue strength at 1,000 cycles of about 0.8 to 0.9 × UTS in bending, depending on strength. The steel line in the diagram uses 0.9.
- Aluminium and copper alloys have no knee: the line keeps falling. Their fatigue strength is quoted at a stated life, often $10^7$ or $5 \times 10^8$ cycles.
- Fatigue lives scatter widely, and can differ by a factor of ten or more at the same stress, so curves are fitted statistically (ASTM E739) and design curves sit well below the average. Surface finish, notches, size and mean stress all lower them further.

## Common stress-strain curve mistakes

- **Reading the yield at the end of the straight line.** The proportional limit is subjective and depends on the resolution of the plot. Use the 0.2% offset, or the lower yield point for steels with a plateau, so results can be compared.
- **Taking the modulus from the crosshead.** Without an extensometer, the strain includes the stretch of the grips and the machine, and the slope comes out well below the real modulus. The yield and UTS are still usable; the modulus is not.
- **Using the wrong offset line.** The offset line must have the modulus's slope and start at 0.2% strain. If the curve has a toe at the start, from the grips settling, shift the origin to where the straight part extended meets zero stress (toe compensation, described in ASTM D638 for plastics).
- **Mixing engineering and true values.** Data sheets give engineering values; simulation programs usually want true stress against true plastic strain. Converting past the UTS with $\sigma(1+\varepsilon)$ is wrong, because the strain is no longer even.
- **Comparing elongations from different gauge lengths.** Most of the strain at fracture is in the neck, so a short gauge length gives a higher elongation than a long one for the same material. Quote the gauge length with the elongation, as ISO 6892-1 does with $A$ and $A_{50\text{mm}}$.
- **Ignoring strain rate and temperature.** A polymer or a mild steel tested faster or colder shows a higher yield and less elongation. Compare curves only from the same test conditions.
- **Plotting strain on a squashed axis.** Over the whole curve of a ductile metal, the elastic region takes up less than 1% of the strain axis and looks vertical. Show an enlarged view of the start of the curve when the modulus or yield matters.

## How to plot a stress-strain curve in JavaScript, React or Angular

Test machines sample force and extension hundreds of times a second, and a materials lab compares curves from many specimens and batches. SciChart.js draws with WebGL and WebGPU, so it redraws curves with thousands of points each instantly as you zoom into the elastic region or switch between engineering and true stress, and it draws a test live as the data arrives. The demo below simulates a tensile test on four materials with typical published properties, then works out the modulus, yield strength, UTS and elongation from the data as test software does.

Choose a **Material**, and switch the **Curve** between engineering stress, true stress (drawn up to the start of necking) and both. **0.2% offset construction** draws the offset line and marks where it meets the curve; the right-hand chart enlarges the start of the curve, where the modulus and yield are read. **Shade resilience and toughness** fills the areas under the curve, and **Run test** replays the test as a machine would draw it, slowly through the elastic region and faster after it. Scroll to zoom, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="stress-strain curve" demo="line-chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The test analysis (modulus fit, offset yield, true stress and areas) is plain JavaScript; SciChart.js draws the curves, the offset line, the shaded areas and the labelled points.

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
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        TextAnnotation,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Strain (%)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Stress (MPa)",
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0, 0.12)
            })
        );

        // Stress (MPa) and strain (%) from your test machine, and the results your analysis found
        const { strainPercent, stressMPa } = getYourTensileTestData();
        const { yieldPoint, uts, modulusMPa } = getYourTestResults();

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: strainPercent, yValues: stressMPa }),
                stroke: "#50C7E0",
                strokeThickness: 2.5
            }),
            // The 0.2% offset line: slope E, starting at 0.2% strain, drawn just past the yield point
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: [0.2, yieldPoint.strain * 1.2],
                    yValues: [0, (modulusMPa * (yieldPoint.strain * 1.2 - 0.2)) / 100]
                }),
                stroke: "#EC0F6C",
                strokeDashArray: [6, 4]
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: [yieldPoint.strain, uts.strain],
                    yValues: [yieldPoint.stress, uts.stress]
                }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#EC0F6C" })
            })
        );
        sciChartSurface.annotations.add(
            new TextAnnotation({ x1: uts.strain, y1: uts.stress, text: `UTS ${uts.stress.toFixed(0)} MPa`, textColor: "#FFFFFF", verticalAnchorPoint: EVerticalAnchorPoint.Bottom, yCoordShift: -8 })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const StressStrainChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
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
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        TextAnnotation,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-stress-strain-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class StressStrainChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Strain (%)" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Stress (MPa)",
                    autoRange: EAutoRange.Always,
                    growBy: new NumberRange(0, 0.12)
                })
            );

            // Stress (MPa) and strain (%) from your test machine, and the results your analysis found
            const { strainPercent, stressMPa } = getYourTensileTestData();
            const { yieldPoint, uts, modulusMPa } = getYourTestResults();

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: strainPercent, yValues: stressMPa }),
                    stroke: "#50C7E0",
                    strokeThickness: 2.5
                }),
                // The 0.2% offset line: slope E, starting at 0.2% strain, drawn just past the yield point
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: [0.2, yieldPoint.strain * 1.2],
                        yValues: [0, (modulusMPa * (yieldPoint.strain * 1.2 - 0.2)) / 100]
                    }),
                    stroke: "#EC0F6C",
                    strokeDashArray: [6, 4]
                }),
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: [yieldPoint.strain, uts.strain],
                        yValues: [yieldPoint.stress, uts.stress]
                    }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#EC0F6C" })
                })
            );
            sciChartSurface.annotations.add(
                new TextAnnotation({ x1: uts.strain, y1: uts.stress, text: `UTS ${uts.stress.toFixed(0)} MPa`, textColor: "#FFFFFF", verticalAnchorPoint: EVerticalAnchorPoint.Bottom, yCoordShift: -8 })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
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

- Each curve is a `FastLineRenderableSeries` over an `XyDataSeries`, with strain in per cent on the x-axis. The 0.2% offset line is a second line series with `strokeDashArray`, and the yield, UTS and fracture points are an `XyScatterRenderableSeries` with an `EllipsePointMarker`, labelled with `TextAnnotation`s.
- The resilience and toughness areas are `FastMountainRenderableSeries`, which fill down to zero stress. The controls add and remove series from `renderableSeries` in a fixed order, so the legend lists only what is shown and the areas stay behind the lines.
- Two `SciChartSurface`s show the same test: the whole curve, and the start of the curve on a fixed range, so the modulus and offset construction stay readable next to a strain axis that runs to 25% or 110%.
- Run test appends points frame by frame with `requestAnimationFrame`, which is how you would stream readings from a live test machine; the chart redraws on each update.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart), and for labelled points and lines, [JavaScript chart annotations](https://www.scichart.com/demo/javascript/chart-annotations) · [React chart annotations](https://www.scichart.com/demo/react/chart-annotations) · [Angular chart annotations](https://www.scichart.com/demo/angular/chart-annotations).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [mountain (area) series documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/) and the [scatter series documentation](/2d-charts/chart-types/xy-scatter-renderable-series/). For how test and measurement teams use SciChart in their software, see [SciChart for design, emulation and test](https://www.scichart.com/design-emulation-test/) and [SciChart for instrumentation engineering](https://www.scichart.com/best-instrumentation-engineering-software/).

## Frequently asked questions

### What does a stress-strain curve tell you?

A stress-strain curve tells you how a material responds as it is stretched until it breaks. From it you read the stiffness (Young's modulus, the slope of the first straight part), the stress at which permanent deformation starts (yield strength), the highest stress it can carry (ultimate tensile strength), how far it stretches before breaking (elongation, a measure of ductility) and the energy it absorbs (toughness, the area under the curve).

### How do you find Young's modulus from a stress-strain curve?

Young's modulus is the slope of the straight, elastic part at the start of the curve: the change in stress divided by the change in strain between two points on it. Fit a straight line through the readings in that region rather than using two single points, because the first few readings are often affected by the grips settling. Steels come out at about 200 GPa and aluminium alloys at about 70 GPa.

### How do you find the yield strength with the 0.2% offset method?

Draw a straight line with the same slope as the elastic part of the curve (Young's modulus), starting at 0.2% strain (0.002) on the strain axis instead of at the origin. The stress where this line crosses the curve is the 0.2% offset yield strength, also called the 0.2% proof stress or Rp0.2. It is the stress that leaves a permanent strain of 0.2% when the load is removed.

### What is the difference between engineering and true stress-strain curves?

Engineering stress divides the force by the specimen's original cross-section, and engineering strain divides the extension by the original length. True stress uses the actual, shrinking cross-section, and true strain adds up each small extension relative to the current length. Up to the start of necking, true stress = engineering stress × (1 + engineering strain) and true strain = ln(1 + engineering strain). The true curve keeps rising after the ultimate tensile strength, while the engineering curve falls.

### Why does the stress drop after the ultimate tensile strength?

After the ultimate tensile strength, the deformation concentrates in one short section of the specimen, which thins into a neck. The neck's cross-section shrinks faster than the metal there hardens, so the force needed to keep stretching it falls. Engineering stress is that force divided by the original area, so it falls too, even though the true stress in the neck is still rising.

### How do I plot a stress-strain curve in JavaScript?

Convert the test machine's force and extension readings to stress (force over original area, in MPa) and strain (extension over gauge length, often in %), and draw them as a line series with strain on the x-axis. Fit the modulus over the elastic region, find the 0.2% offset yield and the maximum stress in plain JavaScript, and mark them with a scatter series and text annotations. SciChart.js does this with FastLineRenderableSeries, XyScatterRenderableSeries and TextAnnotation, in plain JavaScript, React or Angular.

## Sources

- ASTM E8/E8M, *Standard Test Methods for Tension Testing of Metallic Materials*, and ISO 6892-1, *Metallic materials: Tensile testing, Part 1: Method of test at room temperature*. Specimens, gauge lengths, the offset method, yield point, tensile strength and elongation after fracture.
- ASTM E111, *Standard Test Method for Young's Modulus, Tangent Modulus, and Chord Modulus*; ISO 527-1, *Plastics: Determination of tensile properties*, for the yield point and modulus of plastics.
- Callister, W. D. and Rethwisch, D. G. (2018), *Materials Science and Engineering: An Introduction*, 10th edition, Wiley. Chapter 6 (mechanical properties of metals) and the property tables in Appendix B, the source of the typical values above.
- Roylance, D., *Mechanics of Materials*, MIT, on LibreTexts: [Stress-strain curves](https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)/01%3A_Tensile_Response_of_Materials/1.04%3A_Stress-Strain_Curves). Engineering and true stress, Considère's construction and strain energy.
- Budynas, R. G. and Nisbett, J. K. (2020), *Shigley's Mechanical Engineering Design*, 11th edition, McGraw-Hill. Chapter 6: S-N curves, the endurance limit estimate and the fatigue strength fraction at 1,000 cycles. ASTM E466 and E739 cover fatigue testing and the statistical analysis of S-N data.

<LearnCta position="bottom" chart="stress-strain curve" demo="line-chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
