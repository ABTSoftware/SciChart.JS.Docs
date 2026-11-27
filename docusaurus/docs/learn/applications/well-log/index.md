---
sidebar_position: 360
sidebar_label: Well Log
title: "Well Log Interpretation: How to Read a Well Log (Interactive Example)"
description: "What a well log is and how to read one: gamma ray, resistivity, neutron, density and sonic curves, the gas crossover, LAS files and correlating wells, with a live log."
keywords:
    [
        "well log",
        "well log interpretation",
        "how to read a well log",
        "what is a well log",
        "well log analysis",
        "well log data",
        "wireline log",
        "logging while drilling",
        "gamma ray log",
        "resistivity log",
        "neutron density crossover",
        "las file",
        "well log correlation",
        "well log viewer"
    ]
image: /img/learn/well-log-og.png
related: [log-scale-graph, contour-plot, downsampling, hmi-scada]
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
                    "name": "What is a well log?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A well log is a record of measurements made down a borehole and plotted against depth. In oil, gas and geothermal work it means curves such as gamma ray, resistivity, neutron porosity, bulk density and sonic, recorded by tools lowered on a cable (wireline) or carried in the drill string (logging while drilling). In water-well records, a well log usually means the driller's report of the materials drilled, the casing and the water level."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a well log?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Check the header and scales first: depth units, curve mnemonics, and whether resistivity is on a logarithmic scale. Then use the gamma ray to split shale (high readings) from clean sand or carbonate (low readings), the caliper to find bad hole, and the neutron and density curves to find porous beds. In a porous bed, high deep resistivity suggests oil or gas and low resistivity suggests salt water; a density-neutron crossover points to gas. Confirm with the sonic and with nearby wells."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What does density-neutron crossover mean?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "On a compatible scale, the neutron porosity and bulk density curves lie on top of each other in a clean, water-filled rock of the scale's matrix. Gas makes the rock lighter, so the density curve reads more porosity, and it holds less hydrogen, so the neutron curve reads less. The two curves cross, with density to the left of neutron. A crossover can also come from lithology, for example sandstone plotted on a limestone-compatible scale, so check the scale before calling gas."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is a LAS file?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A LAS (Log ASCII Standard) file is a plain-text file of well log data, defined and maintained by the Canadian Well Logging Society. It has sections that start with a tilde: ~V for the version, ~W for well information such as the start and stop depth, step and null value, ~C for the curve names and units, optional ~P and ~O sections, and ~A for the data, one row per depth. LAS 2.0 is the most widely used version."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a water well log?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A water well log, or well report, is filed by the driller. Read it from the top down: the depth intervals and the material drilled in each (clay, sand, gravel, rock), where water was found, the casing and screen depths, the static water level, and the yield from the pump or air test. Some water wells also have geophysical logs such as gamma ray, resistivity and caliper, which are read the same way as oil and gas logs."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a well log in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Make each track a vertical chart: put depth on the x-axis and align it to the left or right edge so it runs down the screen, and give each curve its own y-axis along the top with its standard scale, using a logarithmic axis for resistivity. Place the tracks side by side and synchronise their depth ranges, zooming and cursor. SciChart.js does this with EAxisAlignment, LogarithmicAxis, FastBandRenderableSeries for shading and SciChartHorizontalGroup."
                    }
                }
            ]
        })}
    </script>
</head>

# Well Log Interpretation: How to Read a Well Log

## What is a well log?

A **well log** (also called a borehole log or wireline log) is a record of measurements made down a borehole and plotted against depth. Each curve shows one property of the rock or the fluid in it, such as natural radioactivity, electrical resistivity, density or the speed of sound. Read side by side, the curves show rock types, porosity, and whether the pores hold oil, gas or water.

![A synthetic well log from 5,000 to 5,600 feet in four side-by-side tracks with depth increasing downwards, in a dark navy theme. Track 1: gamma ray in green, shaded yellow on the sand side and grey on the shale side of a 75 API cutoff, with a dashed caliper curve. Track 2: deep and shallow resistivity on a logarithmic scale from 0.2 to 2,000 ohm-metres. Track 3: neutron porosity and bulk density, with an orange crossover in the gas sand near 5,200 feet. Track 4: sonic transit time](/img/learn/well-log-og.png)

*A synthetic well log with gamma ray and caliper, resistivity, neutron-density and sonic tracks (made-up data, not a real well). [Try the interactive version](#how-to-build-a-well-log-viewer-in-javascript-react-or-angular).*

In water-well records the same words mean something simpler: the driller's report of the materials drilled, the casing and the water level. This guide is about the geophysical log used in oil, gas, geothermal and groundwater work, with a short section on [water well logs](#water-well-logs-and-geothermal-wells) at the end.

:::tip Key takeaways
- A well log plots several measurements against one depth axis that increases downwards, in side-by-side tracks.
- Gamma ray separates shale from clean sand or carbonate; resistivity, on a logarithmic scale, separates salt water from oil and gas.
- Neutron porosity and bulk density together give porosity, and where the density curve crosses to the left of the neutron curve, gas is the usual cause.
- Logs are exchanged as LAS text files and compared between wells by matching distinctive curve shapes.
:::

## Wireline logging and logging while drilling

There are two ways to get the measurements.

- **Wireline logging.** After a section of hole is drilled, the drill string is pulled out and a string of tools (a sonde) is lowered on an armoured cable. The logs are recorded as the tools are pulled back up at a steady speed, and the data travel up the cable to a truck or cabin at the surface. The first electrical log was run this way at Pechelbronn, in Alsace, France, in 1927.
- **Logging while drilling (LWD).** The sensors sit in the drill string just above the bit and measure the rock minutes or hours after it is drilled. A small part of the data is sent to the surface in real time as pressure pulses in the drilling mud, which is slow; the full-resolution data are stored in the tool's memory and read out when it comes back to the surface. Real-time LWD lets drillers steer a horizontal well along a thin reservoir.

Because LWD measures before much drilling fluid has soaked into the rock, its readings are less affected by invasion (explained under resistivity below). Wireline tools usually give a wider choice of measurements. Many wells get both.

## The layout of a well log: tracks, scales and depth

A printed or on-screen log is a set of vertical strips called tracks, all sharing one depth scale. Depth increases downwards, as in the well. In the classic layout the depth column sits between track 1 on the left and tracks 2 and 3 on the right, and that is the layout the [live log](#how-to-build-a-well-log-viewer-in-javascript-react-or-angular) on this page uses.

| Curve | Common mnemonic | What it measures | Units | Usual scale | Usual track |
| --- | --- | --- | --- | --- | --- |
| Gamma ray | GR | Natural radioactivity of the rock | API units | 0 to 150 | 1 |
| Spontaneous potential | SP | Natural voltage between the mud and the formation | mV | Relative, no fixed zero | 1 |
| Caliper | CALI | Diameter of the hole | inches | 6 to 16 | 1 |
| Deep resistivity | RT, RD, ILD | Resistivity of the formation beyond the invaded zone | ohm·m | 0.2 to 2,000, logarithmic | 2 |
| Shallow resistivity | RXO, MSFL | Resistivity of the zone flushed by mud filtrate | ohm·m | Same as deep | 2 |
| Neutron porosity | NPHI | Hydrogen content, read as porosity | v/v or porosity units | 0.45 to −0.15 | 3 |
| Bulk density | RHOB | Density of rock plus pore fluid | g/cm³ | 1.95 to 2.95 on a limestone-compatible scale | 3 |
| Sonic | DT | Time for sound to travel one foot of rock | µs/ft | 140 to 40 | 3 or its own |

Mnemonics vary between service companies and tool generations, so always read them from the log header or the file. Three habits of the layout catch out newcomers:

- Some scales run backwards. Neutron porosity and sonic transit time increase to the left, so that high porosity plots on the same side for every porosity curve.
- Resistivity is logarithmic. Readings range from below 1 ohm·m in salty, water-filled rock to thousands in tight or hydrocarbon-bearing rock, so each decade of resistivity gets the same width.
- Depth is measured along the hole. The depth on a log is measured depth (MD), the length of hole from a reference point such as the rig floor. In a deviated or horizontal well it is longer than the true vertical depth (TVD).

The combination of gamma ray, resistivity and neutron-density is called a triple combo, and it is the minimum log suite on many wells.

## How to read a well log, curve by curve

![An idealised well log with depth increasing downwards. A rock column on the left, then three tracks. Gamma ray from 0 to 150 API, with the clean side of a 75 API cutoff shaded yellow and the shale side grey. Deep resistivity on a logarithmic scale from 0.2 to 2,000 ohm-metres. Neutron porosity (dashed) and bulk density (solid) on compatible sandstone scales, with the crossover shaded orange. From the top: shale with high gamma ray, low resistivity and neutron well left of density; a gas sand with low gamma ray, high resistivity and density crossing to the left of neutron; a gas-water contact where resistivity drops and the crossover ends; a water sand with low resistivity and the curves overlaid; shale; an oil sand with high resistivity and little crossover; shale; a tight limestone with high resistivity but almost no porosity; shale](./well-log-signatures.svg)

*How common rocks and fluids look on the three main tracks. The curves are idealised: real logs are noisy and bed boundaries are gradual.*

### Gamma ray: shale or clean rock

The gamma ray tool counts natural gamma rays from potassium, thorium and uranium. Clay minerals hold most of these elements, so shales read high, often 100 API or more, while clean sandstones, limestones and dolomites usually read low, around 20 to 40 API. Interpreters draw a cutoff between the two and shade each side, as the live log does.

The rule has well-known exceptions. Sandstones rich in potassium feldspar or mica read high although they are clean, and uranium can make a clean limestone look shaly. A spectral gamma ray tool, which splits the count into potassium, thorium and uranium, separates those cases.

The shape of the gamma ray curve through a sand body also says how it was laid down. A curve that gets cleaner upwards (a funnel) suggests the sand coarsens upwards, as in a prograding delta front. One that gets shalier upwards (a bell) suggests it fines upwards, as in a river channel fill. A blocky curve suggests a uniform sand.

### Spontaneous potential

The SP curve records a small natural voltage that develops where the drilling mud and the formation water have different salinities. Shales give a fairly straight baseline, and permeable beds deflect away from it, to the left when the mud is fresher than the formation water. SP needs a water-based mud to work, and it can't be read in quantitative terms without the mud and water resistivities, so the gamma ray is the more common shale indicator on modern logs.

### Caliper: is the hole in good shape?

The caliper measures the hole diameter. Compare it with the bit size from the header:

- a larger hole than the bit is a washout, common in weak shales, and it spoils the pad tools such as density, which then read too low;
- a slightly smaller hole than the bit, in a sand, usually means mudcake: the mud's solids have built a skin on the wall of a permeable bed, which is a useful sign of permeability.

### Resistivity: what is in the pores

Rock grains barely conduct electricity, so a rock's resistivity depends mostly on the water in its pores. Salty formation water conducts well and gives low resistivity. Oil and gas don't conduct, so a porous bed full of hydrocarbon reads high.

Archie's equation turns this into a number, the water saturation $S_w$, the fraction of the pore space filled with water:

$$
S_w = \left( \frac{a \, R_w}{\phi^m \, R_t} \right)^{1/n}
$$

where $R_t$ is the deep resistivity, $R_w$ the resistivity of the formation water, $\phi$ the porosity, and $a$, $m$ and $n$ are constants of the rock, often taken as 1, 2 and 2 for a clean sand. It holds for clean rock; shaly sands need modified versions.

Drilling mud filtrate soaks into permeable beds near the hole and pushes the original fluid back. This is invasion. Shallow-reading tools see the flushed zone ($R_{xo}$) and deep-reading tools see the undisturbed rock ($R_t$), so separation between the shallow and deep curves shows that fluid has moved, which means the bed is permeable.

### Neutron and density: porosity and the gas crossover

The density tool fires gamma rays into the wall of the hole and counts how many scatter back, which gives the bulk density of rock plus fluid. If you know the grain density of the rock (2.65 g/cm³ for quartz sandstone, 2.71 for limestone, 2.87 for dolomite) and the fluid density, porosity follows from a simple mass balance:

$$
\phi_D = \frac{\rho_{ma} - \rho_b}{\rho_{ma} - \rho_f}
$$

The neutron tool measures how much hydrogen is in the rock, which in clean rock is mostly the water or oil in the pores, and reports it as porosity. It is usually calibrated in limestone units: correct for limestone full of water, and slightly off for other rocks.

The two curves are plotted together on compatible scales, so that in a clean, water-filled rock of the scale's matrix they lie on top of each other. The separations then mean something:

- Shale: the neutron reads much higher porosity than the density, because clays hold water bound in their structure. The neutron plots well to the left of the density.
- Gas: gas is light, so the density reads too much porosity, and it holds little hydrogen, so the neutron reads too little. The density curve crosses to the left of the neutron. This crossover is the classic gas signature. Invasion can push the gas away from the hole and weaken it.
- Oil: oil has about as much hydrogen as water and is only a little lighter, so an oil sand shows little or no crossover, and the resistivity has to identify it.
- Lithology: a rock with a different grain density from the scale's matrix also separates the curves. Clean sandstone on a limestone-compatible scale shows density to the left of neutron by several porosity units with no gas at all, and dolomite shows the opposite.

In a gas zone, a quick porosity estimate is the root mean square of the two: $\phi \approx \sqrt{(\phi_N^2 + \phi_D^2)/2}$.

### Sonic

The sonic tool measures the time a sound wave takes to travel through the rock, as slowness in microseconds per foot. Porous rock is slower than tight rock, and the Wyllie time-average equation turns the reading into porosity:

$$
\Delta t = \phi \, \Delta t_f + (1 - \phi) \, \Delta t_{ma}
$$

where $\Delta t_f$ is the fluid's transit time (about 189 µs/ft for water) and $\Delta t_{ma}$ the rock matrix's (about 55.5 µs/ft for sandstone). Sonic logs also tie the well to seismic data, since together with density they give the rock's acoustic impedance.

## A worked example: reading one depth

Hover over the gas sand in the live log at about 5,226 ft and the readout gives, among other values:

| Curve | Reading | What it says |
| --- | --- | --- |
| GR | 28 API | Well below the 75 API cutoff: clean sand |
| CALI | 8.3 in | Just under the 8.5 in bit size: mudcake, so the sand is permeable |
| RHOB | 2.20 g/cm³ | Density porosity (2.65 − 2.20) / (2.65 − 1.00) = 27% |
| NPHI | 0.19 | Neutron porosity 19%, lower than density: crossover, so gas |
| RT | 62 ohm·m | High for a porous sand |

The root mean square porosity is √((0.27² + 0.19²) / 2) ≈ 0.235, or about 24%. With the synthetic log's formation water resistivity of 0.05 ohm·m and Archie's constants of 1, 2 and 2:

$S_w = \sqrt{0.05 / (0.235^2 \times 62)} \approx 0.12$

So about 12% of the pore space holds water and the rest holds gas. As a check, the same sand full of water would read $R_w / \phi^2 \approx 0.9$ ohm·m, and 62 ohm·m is about 68 times that. Since $S_w = \sqrt{0.9 / 62}$, the same 12% falls out.

Move down to about 5,240 ft, below the gas-water contact, and the same sand reads about 0.8 ohm·m with no crossover: it is full of water.

## Well log signatures at a glance

A quick-look reading combines the curves in this order: shale or not, porous or not, then what fluid.

| Bed | Gamma ray | Deep resistivity | Neutron-density | Reading |
| --- | --- | --- | --- | --- |
| Shale | High | Low, a few ohm·m | Neutron well left of density | Seal or source rock, not reservoir |
| Water sand | Low | Low | Curves overlay (compatible scale) | Porous, water-bearing |
| Oil sand | Low | High | Little or no crossover | Porous, oil-bearing |
| Gas sand | Low | High | Density crosses left of neutron | Porous, gas-bearing |
| Tight limestone | Low | Very high | Both read low porosity | High resistivity from lack of pores, not hydrocarbon |

## The LAS file format

Most well log data is exchanged as LAS (Log ASCII Standard) files, a plain-text format defined and maintained by the Canadian Well Logging Society. Version 2.0 is the most widely used; version 3.0 adds other data such as formation tops, core data and deviation surveys. A shortened LAS 2.0 file looks like this:

```text
~VERSION INFORMATION
 VERS.                 2.0 : CWLS LOG ASCII STANDARD - VERSION 2.0
 WRAP.                  NO : ONE LINE PER DEPTH STEP
~WELL INFORMATION
 STRT.FT           5000.00 : START DEPTH
 STOP.FT           5600.00 : STOP DEPTH
 STEP.FT              0.50 : STEP
 NULL.             -999.25 : NULL VALUE
 WELL.      SYNTHETIC WELL : WELL
~CURVE INFORMATION
 DEPT.FT                   : DEPTH
 GR  .GAPI                 : GAMMA RAY
 RT  .OHMM                 : DEEP RESISTIVITY
 NPHI.V/V                  : NEUTRON POROSITY, SANDSTONE UNITS
 RHOB.G/C3                 : BULK DENSITY
~A  DEPT      GR      RT    NPHI    RHOB
 5000.00   107.9    2.31   0.362   2.476
 5000.50   111.4    2.29   0.358   2.481
 5001.00  -999.25   2.27   0.355   2.479
```

Each section starts with a tilde: ~V (version), ~W (well information, including the depth range, the step and the null value), ~C (one line per curve, with its mnemonic and unit), the optional ~P (parameters such as mud properties) and ~O (other notes), and finally ~A, the data, one row per depth. US logs are usually sampled twice per foot, so the step is 0.5 ft.

When you load a LAS file into a chart, replace the null value with a gap rather than plotting it, read the units from the ~C section rather than assuming them, and check the sign of STEP, because some files list depths from the bottom up. Full-resolution data from the logging company often comes in binary formats such as DLIS, with LAS made from it for exchange.

## Correlating well logs between wells

Correlation means matching the same rock layers from one well to the next, so a geologist can map a reservoir between wells. The usual approach:

1. Display the wells side by side at the same vertical scale, with the gamma ray (or SP) and resistivity curves.
2. Find marker beds that are easy to recognise and widespread, such as a thin limestone with very low gamma ray and very high resistivity, or a highly radioactive shale.
3. Hang the wells on one marker (align them at that depth) to see how layers thicken, thin or pinch out below it, or on a sea-level datum to see the structure.
4. Match the shapes of the curves between markers, such as funnel and bell gamma ray patterns, allowing for beds that thin or change character between wells.
5. Watch for missing or repeated sections, which mark faults.

In deviated wells, convert measured depth to true vertical depth below a common datum before comparing thicknesses or depths, or the beds will appear thicker and deeper than they are.

## Water well logs and geothermal wells

In the United States and elsewhere, a "well log" for a water well usually means the well report the driller files with the state. It records who owns the well, the depth, the materials drilled in each interval, the casing and screen, the static water level and the yield from a pump or air test. These reports are public in many states and are searched by address or location.

Water wells are also logged with the same geophysical tools, most often gamma ray, resistivity, caliper and temperature, to find aquifers and the depths where water flows into the hole. The reading rules on this page apply, with one change: fresh groundwater has a high resistivity, so a high-resistivity sand in a shallow aquifer is fresh water, not oil.

Geothermal wells use the same measurements, but the targets are usually hot, fractured rock rather than porous sand. Temperature logs and logs that image fractures in the borehole wall carry more weight there than porosity curves.

## Common well log interpretation mistakes

- **Treating every high resistivity as pay.** Tight rock with almost no porosity, fresh water and coal all read high. Check porosity on the neutron and density first.
- **Calling a lithology effect gas.** On a limestone-compatible scale, clean sandstone shows the density to the left of the neutron with no gas. Check which matrix the neutron and density scales assume before reading the crossover.
- **Trusting pad tools in a washout.** Where the caliper shows an enlarged hole, the density reads too low and the neutron too high. Flag those intervals instead of computing porosity there.
- **Using one gamma ray cutoff everywhere.** Feldspar-rich or micaceous sands read high and can be logged as shale. Pick the cutoff from clean and shale beds in the same well, and use spectral gamma ray where it is available.
- **Mixing measured and true vertical depth.** Comparing a deviated well's measured depths with a vertical well's depths shifts every bed. Correlate in true vertical depth.
- **Plotting resistivity on a linear scale.** Everything below about 10 ohm·m collapses against the axis, and that is where the water-oil contrast usually sits.
- **Plotting null values as data.** A −999.25 plotted as a reading draws spikes off the chart. Turn nulls into gaps when you load the file.
- **Ignoring depth mismatches between runs.** Logs from separate runs or from LWD and wireline can be a few feet apart. Depth-match them on the gamma ray, which most runs record, before comparing curves.

## How to build a well log viewer in JavaScript, React or Angular

Well log viewers need tall charts with tens of thousands of depth samples per curve, several curves per track and every track zooming together, which is the kind of large, interactive data SciChart.js draws with WebGL.

The live log below is synthetic: a seeded, made-up well from 5,000 to 5,600 ft, sampled every half foot. Its sand and shale layers follow the textbook rules on this page, including Archie's equation and the Wyllie equation, with a gas sand over a water sand, an oil sand, a tight limestone and a washout in one shale. Hover to read every curve at the cursor depth, with a quick-look reading of porosity, water saturation and fluid. Scroll to zoom in depth, drag to pan, and double-click to reset; all four tracks move together. Move the **Gamma ray sand/shale cutoff** slider to change where the gamma ray track switches from sand to shale shading.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="well log" demo="oil-and-gas-dashboard-showcase" demoLabel="oil and gas dashboard" docs="/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/" docsLabel="SciChart.js vertical chart synchronisation documentation" />

Here is the code for the four tracks. The synthetic log and the readout are plain JavaScript; SciChart.js draws the tracks, the shading and the depth cursor. The React and Angular versions show the core of it: side-by-side tracks of your own curves, with depth running downwards and synchronised zooming.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { useRef } from "react";
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        SciChartHorizontalGroup,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Curve = { name: string; values: number[]; colour: string; min: number; max: number; log?: boolean; reversed?: boolean };
    type Sync = { group: SciChartHorizontalGroup; surfaces: SciChartSurface[] };

    // One track: a vertical chart with depth down the side and one top axis per curve
    const createTrack = (depth: number[], curves: Curve[], showDepth: boolean, sync: Sync) => async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Right, // depth runs down the side of the track
                visibleRange: new NumberRange(depth[0], depth[depth.length - 1]),
                autoRange: EAutoRange.Never,
                isVisible: showDepth,
                axisTitle: showDepth ? "Depth (ft)" : undefined
            })
        );
        for (const curve of curves) {
            const options = {
                id: curve.name,
                axisAlignment: EAxisAlignment.Top,
                flippedCoordinates: !curve.reversed, // low values on the left, except for neutron and sonic
                axisTitle: curve.name,
                axisTitleStyle: { color: curve.colour },
                visibleRange: new NumberRange(curve.min, curve.max),
                autoRange: EAutoRange.Never
            };
            sciChartSurface.yAxes.add(curve.log ? new LogarithmicAxis(wasmContext, { ...options, logBase: 10 }) : new NumericAxis(wasmContext, options));
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    yAxisId: curve.name,
                    stroke: curve.colour,
                    dataSeries: new XyDataSeries(wasmContext, { xValues: depth, yValues: curve.values, isSorted: true })
                })
            );
        }
        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
            new CursorModifier({ modifierGroup: "depth", showYLine: false, showAxisLabels: true })
        );
        // Same header height in every track, and one depth range for all of them
        sync.group.addSurfaceToGroup(sciChartSurface);
        sync.surfaces.push(sciChartSurface);
        sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe(({ visibleRange }) => {
            for (const other of sync.surfaces) {
                const axis = other.xAxes.get(0);
                if (!axis.visibleRange.equals(visibleRange)) axis.visibleRange = visibleRange;
            }
        });
        return { sciChartSurface };
    };

    export const WellLogViewer = () => {
        const sync = useRef<Sync>({ group: new SciChartHorizontalGroup(), surfaces: [] }).current;
        const { depth, gr, rt, nphi, rhob, dt } = getYourWellLogData(); // e.g. the curves from a LAS file
        const tracks: Curve[][] = [
            [{ name: "GR (API)", values: gr, colour: "#3BD16F", min: 0, max: 150 }],
            [{ name: "RT (ohm.m)", values: rt, colour: "#EF5350", min: 0.2, max: 2000, log: true }],
            [
                { name: "NPHI (v/v)", values: nphi, colour: "#50C7E0", min: -0.15, max: 0.45, reversed: true },
                { name: "RHOB (g/cc)", values: rhob, colour: "#EF5350", min: 1.9, max: 2.9 }
            ],
            [{ name: "DT (us/ft)", values: dt, colour: "#C3B4F0", min: 40, max: 140, reversed: true }]
        ];
        return (
            <div style={{ display: "flex", height: 700 }}>
                {tracks.map((curves, i) => (
                    <SciChartReact key={i} style={{ flex: 1 }} initChart={createTrack(depth, curves, i === 0, sync)} />
                ))}
            </div>
        );
    };
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        SciChartHorizontalGroup,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Curve = { name: string; values: number[]; colour: string; min: number; max: number; log?: boolean; reversed?: boolean };
    type Sync = { group: SciChartHorizontalGroup; surfaces: SciChartSurface[] };

    // One track: a vertical chart with depth down the side and one top axis per curve
    const createTrack = (depth: number[], curves: Curve[], showDepth: boolean, sync: Sync) => async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Right, // depth runs down the side of the track
                visibleRange: new NumberRange(depth[0], depth[depth.length - 1]),
                autoRange: EAutoRange.Never,
                isVisible: showDepth,
                axisTitle: showDepth ? "Depth (ft)" : undefined
            })
        );
        for (const curve of curves) {
            const options = {
                id: curve.name,
                axisAlignment: EAxisAlignment.Top,
                flippedCoordinates: !curve.reversed, // low values on the left, except for neutron and sonic
                axisTitle: curve.name,
                axisTitleStyle: { color: curve.colour },
                visibleRange: new NumberRange(curve.min, curve.max),
                autoRange: EAutoRange.Never
            };
            sciChartSurface.yAxes.add(curve.log ? new LogarithmicAxis(wasmContext, { ...options, logBase: 10 }) : new NumericAxis(wasmContext, options));
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    yAxisId: curve.name,
                    stroke: curve.colour,
                    dataSeries: new XyDataSeries(wasmContext, { xValues: depth, yValues: curve.values, isSorted: true })
                })
            );
        }
        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
            new CursorModifier({ modifierGroup: "depth", showYLine: false, showAxisLabels: true })
        );
        // Same header height in every track, and one depth range for all of them
        sync.group.addSurfaceToGroup(sciChartSurface);
        sync.surfaces.push(sciChartSurface);
        sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe(({ visibleRange }) => {
            for (const other of sync.surfaces) {
                const axis = other.xAxes.get(0);
                if (!axis.visibleRange.equals(visibleRange)) axis.visibleRange = visibleRange;
            }
        });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-well-log-viewer",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates each track, sizes it and cleans it up
        template: `<div style="display: flex; height: 700px">
            @for (initTrack of tracks; track $index) {
                <scichart-angular [initChart]="initTrack" style="display: block; flex: 1"></scichart-angular>
            }
        </div>`
    })
    export class WellLogViewerComponent {
        private sync: Sync = { group: new SciChartHorizontalGroup(), surfaces: [] };
        private log = getYourWellLogData(); // e.g. the curves from a LAS file
        tracks = [
            [{ name: "GR (API)", values: this.log.gr, colour: "#3BD16F", min: 0, max: 150 }],
            [{ name: "RT (ohm.m)", values: this.log.rt, colour: "#EF5350", min: 0.2, max: 2000, log: true }],
            [
                { name: "NPHI (v/v)", values: this.log.nphi, colour: "#50C7E0", min: -0.15, max: 0.45, reversed: true },
                { name: "RHOB (g/cc)", values: this.log.rhob, colour: "#EF5350", min: 1.9, max: 2.9 }
            ],
            [{ name: "DT (us/ft)", values: this.log.dt, colour: "#C3B4F0", min: 40, max: 140, reversed: true }]
        ].map((curves: Curve[], i) => createTrack(this.log.depth, curves, i === 0, this.sync));
    }
    ```
</CodeSnippetBlock>

Key points:

- A vertical chart comes from the axis alignment: the depth x-axis is aligned left or right, so it runs down the screen, and each curve's y-axis is aligned to the top. `flippedCoordinates` sets which way each curve scale runs.
- Resistivity uses a `LogarithmicAxis` from 0.2 to 2,000 ohm·m, with `majorDelta: 1` and `minorDelta: 1` giving a label at each power of ten and minor gridlines in between.
- The shading is `FastBandRenderableSeries`: between the gamma ray and a cutoff line in track 1, and between neutron and density, with the density drawn on the neutron scale, in track 3. The band picks its fill colour by which line is on top, so the crossover gets its own colour.
- The tracks are separate surfaces. A `SciChartHorizontalGroup` gives them the same header height so depths line up, `visibleRangeChanged` copies the depth range from one to the others, and a shared `modifierGroup` moves the cursor line across all of them.

**See it in the demo app:** [JavaScript oil and gas dashboard](https://www.scichart.com/demo/javascript/oil-and-gas-dashboard-showcase) · [React oil and gas dashboard](https://www.scichart.com/demo/react/oil-and-gas-dashboard-showcase) · [Angular oil and gas dashboard](https://www.scichart.com/demo/angular/oil-and-gas-dashboard-showcase).

**Go deeper:** [SciChart.js vertical chart synchronisation documentation](/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/), [vertical charts](/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis/), the [logarithmic axis documentation](/2d-charts/axis-api/axis-types/logarithmic-axis/) and the [band series documentation](/2d-charts/chart-types/fast-band-renderable-series/). For more on log scales, see the [log scale graph guide](/learn/axes-and-scales/log-scale-graph/).

## Frequently asked questions

### What is a well log?

A well log is a record of measurements made down a borehole and plotted against depth. In oil, gas and geothermal work it means curves such as gamma ray, resistivity, neutron porosity, bulk density and sonic, recorded by tools lowered on a cable (wireline) or carried in the drill string (logging while drilling). In water-well records, a well log usually means the driller's report of the materials drilled, the casing and the water level.

### How do you read a well log?

Check the header and scales first: depth units, curve mnemonics, and whether resistivity is on a logarithmic scale. Then use the gamma ray to split shale (high readings) from clean sand or carbonate (low readings), the caliper to find bad hole, and the neutron and density curves to find porous beds. In a porous bed, high deep resistivity suggests oil or gas and low resistivity suggests salt water; a density-neutron crossover points to gas. Confirm with the sonic and with nearby wells.

### What does density-neutron crossover mean?

On a compatible scale, the neutron porosity and bulk density curves lie on top of each other in a clean, water-filled rock of the scale's matrix. Gas makes the rock lighter, so the density curve reads more porosity, and it holds less hydrogen, so the neutron curve reads less. The two curves cross, with density to the left of neutron. A crossover can also come from lithology, for example sandstone plotted on a limestone-compatible scale, so check the scale before calling gas.

### What is a LAS file?

A LAS (Log ASCII Standard) file is a plain-text file of well log data, defined and maintained by the Canadian Well Logging Society. It has sections that start with a tilde: ~V for the version, ~W for well information such as the start and stop depth, step and null value, ~C for the curve names and units, optional ~P and ~O sections, and ~A for the data, one row per depth. LAS 2.0 is the most widely used version.

### How do you read a water well log?

A water well log, or well report, is filed by the driller. Read it from the top down: the depth intervals and the material drilled in each (clay, sand, gravel, rock), where water was found, the casing and screen depths, the static water level, and the yield from the pump or air test. Some water wells also have geophysical logs such as gamma ray, resistivity and caliper, which are read the same way as oil and gas logs.

### How do I plot a well log in JavaScript?

Make each track a vertical chart: put depth on the x-axis and align it to the left or right edge so it runs down the screen, and give each curve its own y-axis along the top with its standard scale, using a logarithmic axis for resistivity. Place the tracks side by side and synchronise their depth ranges, zooming and cursor. SciChart.js does this with EAxisAlignment, LogarithmicAxis, FastBandRenderableSeries for shading and SciChartHorizontalGroup.

## Sources

- Archie, G. E. (1942), [The electrical resistivity log as an aid in determining some reservoir characteristics](https://doi.org/10.2118/942054-G). *Transactions of the AIME*, 146(1), 54–62. The relation between resistivity, porosity and water saturation.
- Wyllie, M. R. J., Gregory, A. R. and Gardner, L. W. (1956), [Elastic wave velocities in heterogeneous and porous media](https://doi.org/10.1190/1.1438217). *Geophysics*, 21(1), 41–70. The time-average equation for sonic porosity.
- Doveton, J. H., [Geological Log Analysis](https://www.kgs.ku.edu/Publications/Bulletins/LA/index.html), Kansas Geological Survey (online course, updated 2017). Log layout and tracks, the 1927 first log, the gamma ray log, density and neutron porosity, the neutron-density overlay and the gas effect, and LAS files.
- Expedition 308 Scientists (2006), [Methods: downhole measurements](https://doi.org/10.2204/iodp.proc.308.102.2006). *Proceedings of the Integrated Ocean Drilling Program*, 308. Logging while drilling, mud-pulse telemetry and memory data.
- U.S. Geological Survey, [LAS format](https://www.usgs.gov/programs/national-geological-and-geophysical-data-preservation-program/las-format). The LAS sections, LAS 2.0 and 3.0, and the Canadian Well Logging Society's role.
- Keys, W. S. (1990), [Borehole geophysics applied to ground-water investigations](https://doi.org/10.3133/twri02E2). U.S. Geological Survey Techniques of Water-Resources Investigations, book 2, chapter E2. Geophysical logging in water wells.
- Oregon Water Resources Department, [About well reports](https://www.oregon.gov/owrd/programs/gwwl/wcc/pages/aboutwellreports.aspx). What a water well report records.

<LearnCta position="bottom" chart="well log" demo="oil-and-gas-dashboard-showcase" demoLabel="oil and gas dashboard" docs="/2d-charts/chart-synchronization-api/synchronizing-vertical-charts/" docsLabel="SciChart.js vertical chart synchronisation documentation" />
