---
sidebar_position: 30
sidebar_label: Chromatogram
title: "Chromatogram: How to Read Retention Time, Peaks and Resolution"
description: "What a chromatogram is and how to read one: retention time, dead time, peak height and area, resolution and plate number, HPLC vs GC, and a live chromatogram you can integrate."
keywords:
    [
        "chromatogram",
        "what is a chromatogram",
        "how to read a chromatogram",
        "where is retention time on a chromatogram",
        "what does a chromatogram show",
        "chromatogram vs chromatograph",
        "hplc chromatogram",
        "hplc chromatogram interpretation",
        "gas chromatogram",
        "gc chromatogram",
        "sec chromatogram",
        "extracted ion chromatogram",
        "dna sequencing chromatogram",
        "chromatogram analysis",
        "chromatogram software"
    ]
image: /img/learn/chromatogram-og.png
related: [line-chart, area-chart, signal-to-noise-ratio, low-pass-filter]
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
                    "name": "What does a chromatogram show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A chromatogram shows the detector's signal against time after a sample is injected into a chromatography column. Each peak is a compound, or a group of compounds, leaving the column. The time of the peak's top (its retention time) helps identify the compound, and the area under the peak tells you how much of it there is." }
                },
                {
                    "@type": "Question",
                    "name": "Where is the retention time on a chromatogram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The retention time is read on the horizontal axis. It is the time from the injection (time zero) to the top of a peak. Data systems print it above each peak and list it in the peak table. Subtract the dead time, the retention time of an unretained compound, to get the adjusted retention time." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a chromatogram and a chromatograph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A chromatograph is the instrument that performs the separation, such as a gas chromatograph or an HPLC system. A chromatogram is the record it produces: a plot of detector response against time. Chromatography is the technique itself." }
                },
                {
                    "@type": "Question",
                    "name": "Should I use peak height or peak area to measure the amount?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use peak area in most cases. The area stays the same when a peak gets wider, for example later in a run or on an older column, while the height falls. Height can be better for a small peak on a noisy or sloping baseline, or a peak that overlaps its neighbour, as long as the standards and samples are run under the same conditions." }
                },
                {
                    "@type": "Question",
                    "name": "What resolution is good enough between two peaks?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A resolution of 1.5 or more is usually called baseline resolution: two equal Gaussian peaks then overlap by only about 0.1%. At a resolution of 1.0 the overlap is about 2%, which is enough for many qualitative checks but can bias the areas. Many validated methods require at least 1.5, or 2.0, for the critical pair." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a chromatogram in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Load the detector readings as time and response arrays into a line series, with time in minutes on the x-axis. Add text annotations for the retention times, shade each integrated peak between the signal and its baseline with a band series, and add zoom, pan and a cursor so analysts can inspect small peaks. SciChart.js does this with FastLineRenderableSeries, FastBandRenderableSeries and TextAnnotation." }
                }
            ]
        })}
    </script>
</head>

# Chromatogram

## What is a chromatogram?

A **chromatogram** is the graph a chromatography instrument produces: the detector's response plotted against the time since the sample was injected. Each compound in the mixture leaves the column at its own time and draws a peak. Where a peak sits identifies the compound; the area under it tells you how much is present.

![A simulated chromatogram of five compounds on a slowly rising baseline, each peak shaded down to its integration baseline and labelled with its retention time in minutes, in a dark navy theme](/img/learn/chromatogram-og.png)

*A simulated HPLC chromatogram of five compounds, with each peak integrated and labelled with its retention time (sample data). [Try the interactive version](#how-to-plot-a-chromatogram-in-javascript-react-or-angular).*

:::tip Key takeaways
- The x-axis is time after injection; the y-axis is the detector's response. Each peak is a compound leaving the column.
- Retention time, from injection to the top of a peak, identifies a compound when compared with a standard run under the same conditions.
- Peak area, not height, is normally used to measure how much is present, through a calibration with known amounts.
- Resolution $R_s$ says how well two peaks are separated; 1.5 or more is baseline resolution.
- One peak can hide two compounds. Matching retention times suggest an identity but don't prove it.
:::

## Chromatogram vs chromatograph vs chromatography

The three words are often mixed up:

| Word | What it is | Example |
| --- | --- | --- |
| Chromatography | The technique: separating the parts of a mixture by how strongly each one is held back as a fluid carries it through a column or across a surface | Reversed-phase liquid chromatography |
| Chromatograph | The instrument that does the separation | A gas chromatograph (GC), an HPLC system |
| Chromatogram | The record of one run: detector response against time | The trace on screen and in the report |

Every chromatograph works the same way. A small volume of sample is injected into a moving phase (a gas or a liquid), which carries it through a column packed or coated with a stationary phase. Compounds that cling to the stationary phase more strongly move more slowly. By the time they reach the detector at the far end, they have spread out in time. The detector measures something that rises when a compound passes, such as ultraviolet absorbance, ions formed in a flame or mass-to-charge ratio, and the data system plots it as the chromatogram.

## Parts of a chromatogram

A chromatogram has a few standard parts: the injection point, the dead time, the baseline, and the peaks with their retention times, heights, widths and areas.

![An annotated chromatogram: the injection at time zero, a small disturbance at the dead time t0, peak 1 with its retention time measured along the time axis from the injection and its height measured from the baseline, peak 2 overlapping peak 1 with a valley between them and its width marked at half height, and a tailing peak 3 whose shaded area tracks the amount of compound](./chromatogram-anatomy.svg)

- **Injection point.** Time zero, when the sample enters the column. Every time on the chromatogram is measured from here.
- **Dead time ($t_0$, also void time or hold-up time).** The time a compound that isn't held back at all takes to pass through. It often shows as a small blip or dip, the solvent front, where the injection solvent reaches the detector.
- **Baseline.** The signal when only the mobile phase is reaching the detector. In practice it is never perfectly flat: it drifts and carries noise.
- **Peak.** The detector's response as one compound (or several, if they overlap) passes. An ideal peak is a Gaussian, the bell curve.
- **Peak height.** From the baseline under the peak to its top.
- **Peak area.** The area between the peak and the baseline. For a given detector and compound, it is proportional to the amount injected.
- **Peak width.** Measured at half the peak's height ($w_{0.5}$), or at the base between tangents drawn on its sides ($w_b$, about 1.7 times the half-height width for a Gaussian).

### Where is retention time on a chromatogram?

**Retention time** ($t_R$) is read along the horizontal axis: it is the time from the injection to the top (apex) of a peak. A peak whose top is at 4.20 minutes has a retention time of 4.20 min. Data systems print it above each peak and list it in the peak table.

Two related measures remove the effect of the column's dead volume:

- **Adjusted retention time** $t'_R = t_R - t_0$: the extra time the compound spent held on the stationary phase.
- **Retention factor** $k = (t_R - t_0)/t_0$: how many times longer the compound spent in the stationary phase than in the mobile phase. A $k$ between about 1 and 10 is a comfortable range for most methods.

### Peak tailing and fronting

Real peaks are rarely perfect bell curves.

- A **tailing peak** rises quickly and falls slowly, leaving a long tail. Common causes are strong secondary interactions with the stationary phase (basic compounds on silica in HPLC, for example), a damaged column or dead volume in the fittings.
- A **fronting peak** is the mirror image, with a sloping front. It usually means the column is overloaded, or the sample solvent is much stronger than the mobile phase.

Both are measured by the symmetry factor (USP &lt;621&gt;, also called the tailing factor) $T = W_{0.05}/2f$, where $W_{0.05}$ is the peak width at 5% of its height and $f$ is the distance from the front edge to the apex at that height. A symmetric peak has $T = 1$; above 1 it tails, below 1 it fronts.

## How to read a chromatogram

Reading a chromatogram answers two questions: what is in the sample, and how much of each.

1. Check the run. Look at the baseline: is it flat, drifting or noisy? Find the injection and the solvent front at $t_0$, and ignore anything before it.
2. Count the peaks. Note any shoulders, valleys that don't reach the baseline, or peaks that look wider than their neighbours: each can be two compounds overlapping.
3. Identify each peak by retention time. Compare it with a standard (a known pure compound) run on the same method on the same day. A match within a set window, often a few hundredths of a minute, suggests the same compound. Spiking the sample with the standard and seeing one peak grow is stronger evidence; a mass spectrum or UV spectrum across the peak is stronger still.
4. Measure each peak by area. The data system integrates each peak: it decides where it starts and ends and draws a baseline under it.
5. Turn area into amount. Run standards at known concentrations, plot area against concentration (the calibration curve) and read the sample's concentration off it. The "area %" column in a report only gives relative amounts, and only if every compound gives the same response per gram, which is rarely true.
6. Check the separation. Look at the resolution between neighbouring peaks, especially the closest pair (the critical pair), and at the tailing factors, against the method's system suitability limits.

### Peak height vs peak area

Area is normally preferred. When a peak gets broader, for example as a column ages or for later-eluting peaks in an isothermal GC run, its height falls but its area stays the same. Height can be the better choice for small peaks on a noisy or sloping baseline, or for a peak partly overlapping a large neighbour, where the area depends heavily on where the integration lines are drawn. Whichever you use, use the same for standards and samples.

## Resolution and plate number: a worked example

**Resolution** ($R_s$) measures how well two neighbouring peaks are separated. With retention times $t_{R1}$ and $t_{R2}$ and base widths $w_1$ and $w_2$:

$$
R_s = \frac{2\,(t_{R2} - t_{R1})}{w_1 + w_2}
$$

Using widths at half height instead, $R_s = 1.18\,(t_{R2} - t_{R1})/(w_{0.5,1} + w_{0.5,2})$, which data systems prefer because half-height widths are easier to measure on real peaks.

**Plate number** ($N$, the column efficiency) measures how narrow the column keeps a peak relative to its retention time:

$$
N = 16\left(\frac{t_R}{w_b}\right)^2 = 5.54\left(\frac{t_R}{w_{0.5}}\right)^2
$$

Take two peaks on a column with a dead time of 1.00 min:

| | Peak 1 | Peak 2 |
| --- | --- | --- |
| Retention time $t_R$ | 4.20 min | 4.65 min |
| Base width $w_b$ | 0.20 min | 0.22 min |
| Retention factor $k = (t_R - t_0)/t_0$ | 3.20 | 3.65 |
| Plate number $N = 16 (t_R/w_b)^2$ | 7,056 | about 7,150 |

- Resolution: $R_s = 2 \times (4.65 - 4.20)/(0.20 + 0.22) = 0.90/0.42 \approx 2.14$. The pair is fully separated.
- Selectivity: $\alpha = k_2/k_1 = 3.65/3.20 \approx 1.14$.
- The Purnell equation links the three, $R_s = \tfrac{\sqrt{N}}{4}\cdot\tfrac{\alpha - 1}{\alpha}\cdot\tfrac{k_2}{1 + k_2}$, and gives about 2.0 here, close to the measured value.

The equation shows what to change when peaks overlap. Resolution grows only with the square root of $N$: four times the plates (a column four times longer, or particles a quarter the size, since the plate number scales with column length divided by particle size) only doubles it. Changing selectivity, through the mobile phase, the column chemistry or the temperature, is usually far more effective, because even a small change in $\alpha$ can move a peak right out of the way. Try both in the [interactive chromatogram](#how-to-plot-a-chromatogram-in-javascript-react-or-angular): raising the column efficiency narrows the peaks, while heating the column from 30 to 45 °C makes two compounds merge and then swap places.

| $R_s$ | What it looks like | Overlap of two equal Gaussian peaks |
| --- | --- | --- |
| below 1.0 | A shoulder or a single merged peak | More than 2% |
| 1.0 | Two tops with a valley that dips to about a quarter of the peak height | About 2% |
| 1.5 | Back to the baseline between them (baseline resolution) | About 0.1% |
| 2.0 or more | A clear gap of baseline | Negligible |

## Types of chromatogram

Chromatograms differ with the separation technique and the detector, but each one plots a detector signal against time.

### HPLC vs GC chromatogram

The two most common chromatograms come from high-performance liquid chromatography (HPLC) and gas chromatography (GC). They look alike, but the axes and the peaks mean slightly different things.

| | HPLC chromatogram | GC chromatogram |
| --- | --- | --- |
| Mobile phase | A liquid, pumped at high pressure | An inert gas (helium, hydrogen or nitrogen) |
| Best for | Compounds that are non-volatile, large or break down when heated: drugs, proteins, sugars | Compounds that vaporise without breaking down: solvents, fuels, fragrances, pesticides |
| Typical detector and y-axis | UV-visible absorbance in mAU (milli-absorbance units), or a mass spectrometer | Flame ionisation detector (FID) current in pA, or a mass spectrometer |
| What moves the peaks | Mobile phase composition (often a gradient), column chemistry, temperature | Oven temperature (often a ramp), column phase, gas flow |
| Typical peaks | Wider; early peaks are narrow and late ones broader in an isocratic run | Very narrow, especially on capillary columns; dozens to hundreds of peaks per run |
| Typical run length | A few minutes to an hour | A few minutes to over an hour |

In both, a gradient (HPLC) or temperature ramp (GC) speeds up the late peaks and keeps them sharp, so a whole chromatogram has peaks of similar width.

### Other kinds of chromatogram

- **Size-exclusion (SEC) or gel permeation (GPC) chromatogram.** Molecules are separated by size, not by how strongly they stick: the largest leave first. Used for proteins (aggregates come out before the monomer) and polymers, where a calibration with size standards turns retention time into molecular weight.
- **Ion chromatogram.** Ion chromatography separates charged species, such as chloride, nitrate and sulfate in water, usually with a conductivity detector.
- **Total ion chromatogram (TIC) and extracted ion chromatogram (EIC or XIC).** In GC-MS and LC-MS, the mass spectrometer records a full spectrum many times a second. The TIC adds up all the ions at each moment. An extracted ion chromatogram plots only the signal at one mass-to-charge ratio, which pulls a target compound out of a crowded or co-eluting background.
- **DNA sequencing chromatogram.** In Sanger sequencing by capillary electrophoresis, each of the four bases carries a different fluorescent dye, so the trace has four coloured lines, one per base. Each peak is a DNA fragment one base longer than the last, and the colour of the tallest peak at each position is the base call. Strictly, it is an electropherogram, since the separation is by electrophoresis, but "chromatogram" and "trace file" are common names for it.

## Baseline drift and noise

A real baseline has two problems, and they are handled differently.

- Drift is a slow change in the baseline over the run: a gradient changing the mobile phase's absorbance in HPLC, column bleed as a GC oven heats up, or a detector warming up. It moves the start and end of each integration line, so it changes the areas, especially of wide, low peaks.
- Noise is the fast random wobble on top. It sets the smallest peak you can see. A common rule is that a peak is detectable at a signal-to-noise ratio of about 3 and can be measured reliably at about 10 (see [signal-to-noise ratio](/learn/signal-processing/signal-to-noise-ratio/)).

Smoothing the trace with a [low-pass filter](/learn/signal-processing/low-pass-filter/), such as a moving average or a Savitzky-Golay filter, reduces noise, but a filter that is too strong widens narrow peaks and cuts their height. Keep the filter narrow compared with the narrowest peak. Data systems often smooth only to find the peaks, and integrate the raw signal.

## Common chromatogram mistakes

Most chromatogram mistakes come from treating peak heights, areas or a single clean-looking peak as more than they are.

- **Reading height as amount.** Two peaks of the same height can hold very different amounts if one is wider. Compare areas, and use a calibration, not the raw numbers.
- **Treating area % as weight %.** Detectors respond differently to different compounds. A UV detector barely sees a compound with no chromophore. Area % is only a weight % after correcting each peak by its response factor.
- **Missing co-elution.** A symmetric single peak can still hold two compounds with the same retention time. Check the peak's purity with a diode-array or mass spectrometer, or run a second method with different selectivity.
- **Identifying by retention time alone.** Retention times shift with column age, temperature, mobile phase batch and flow. Always compare with a standard run in the same sequence.
- **Careless integration baselines.** Dropping a perpendicular from the valley, skimming a small peak off a large one's tail, or drawing one baseline under a whole cluster can change a small peak's area by tens of per cent. Pick the rule the method specifies, apply it to standards and samples alike, and look at the integration lines, not just the table.
- **Over-smoothing.** Heavy smoothing makes a trace look clean but merges close peaks and lowers small ones.
- **Ignoring the solvent front and system peaks.** Peaks at $t_0$, or that appear in a blank injection too, aren't sample compounds.

## How to plot a chromatogram in JavaScript, React or Angular

Chromatography data systems record thousands of readings per run, and a GC-MS or LC-MS file holds a full spectrum at each of them. The demo below simulates a 12-minute HPLC run of five compounds, 6,000 detector readings on a drifting, noisy baseline, and every time you move a control it regenerates the run, finds the peaks, integrates them and labels each retention time.

Move the **column temperature** to shift the peaks: compounds B and C move at different rates and swap places near 45 °C, passing through complete co-elution. **Column efficiency** sets the plate number, and with it the peak widths. **Peak shape** adds tailing or fronting, **Noise** sets the detector noise, and **Integrate peaks** shades each peak's area down to its baseline and shows the peak table, with retention time, height, area, area % and the resolution to the next peak. Use the mouse wheel to zoom in on a small peak, drag to pan, double-click to see the whole run, and hover to read the signal.

<LiveDocSnippet maxWidth={'100%'} height={620} name="./Basic/demo" />

<LearnCta position="top" chart="chromatogram" demo="mountain-chart" demoLabel="mountain chart" docs="/2d-charts/chart-types/fast-band-renderable-series/" docsLabel="SciChart.js band series documentation" />

Here is the code for this chart. Peak finding and integration are plain JavaScript; SciChart.js draws the signal, shades the integrated areas with band series and labels the peaks with annotations.

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
        FastBandRenderableSeries,
        XyDataSeries,
        XyyDataSeries,
        TextAnnotation,
        EHorizontalAnchorPoint,
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
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Retention time (min)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Detector response (mAU)",
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.05, 0.15)
            })
        );

        // Detector readings, and the peaks your data system found: retention time, apex, start, end, baseline
        const { times, response } = getYourChromatogramData();
        const peaks = getYourIntegratedPeaks();

        // Shade each peak between the signal and its integration baseline
        for (const peak of peaks) {
            const shade = new XyyDataSeries(wasmContext, {
                xValues: times.slice(peak.from, peak.to + 1),
                yValues: response.slice(peak.from, peak.to + 1),
                y1Values: peak.baseline // one baseline value per reading, from peak.from to peak.to
            });
            sciChartSurface.renderableSeries.add(
                new FastBandRenderableSeries(wasmContext, {
                    dataSeries: shade,
                    fill: "#F4842077",
                    fillY1: "#00000000",
                    stroke: "#00000000",
                    strokeY1: "#FFFFFFAA"
                })
            );
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    x1: peak.retentionTime,
                    y1: peak.apexResponse,
                    text: peak.retentionTime.toFixed(2),
                    textColor: "#FFFFFF",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                    yCoordShift: -6
                })
            );
        }
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: times, yValues: response }),
                stroke: "#E8F1FF",
                strokeThickness: 1.5
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const ChromatogramChart = () => (
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
        FastBandRenderableSeries,
        XyDataSeries,
        XyyDataSeries,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-chromatogram-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class ChromatogramChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Retention time (min)" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Detector response (mAU)",
                    autoRange: EAutoRange.Always,
                    growBy: new NumberRange(0.05, 0.15)
                })
            );

            // Detector readings, and the peaks your data system found: retention time, apex, start, end, baseline
            const { times, response } = getYourChromatogramData();
            const peaks = getYourIntegratedPeaks();

            // Shade each peak between the signal and its integration baseline
            for (const peak of peaks) {
                const shade = new XyyDataSeries(wasmContext, {
                    xValues: times.slice(peak.from, peak.to + 1),
                    yValues: response.slice(peak.from, peak.to + 1),
                    y1Values: peak.baseline // one baseline value per reading, from peak.from to peak.to
                });
                sciChartSurface.renderableSeries.add(
                    new FastBandRenderableSeries(wasmContext, {
                        dataSeries: shade,
                        fill: "#F4842077",
                        fillY1: "#00000000",
                        stroke: "#00000000",
                        strokeY1: "#FFFFFFAA"
                    })
                );
                sciChartSurface.annotations.add(
                    new TextAnnotation({
                        x1: peak.retentionTime,
                        y1: peak.apexResponse,
                        text: peak.retentionTime.toFixed(2),
                        textColor: "#FFFFFF",
                        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                        yCoordShift: -6
                    })
                );
            }
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: times, yValues: response }),
                    stroke: "#E8F1FF",
                    strokeThickness: 1.5
                })
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

- The signal is a `FastLineRenderableSeries` over an `XyDataSeries`, with time in minutes on the x-axis. The y-axis uses `EAutoRange.Always`, so it rescales as the controls change the peak heights.
- Each integrated peak is a `FastBandRenderableSeries`: an `XyyDataSeries` holds the signal as `y` and the integration baseline as `y1`, and the band fills the area between them. The `strokeY1` line shows where the baseline was drawn.
- Retention times are `TextAnnotation`s anchored at the bottom centre, just above each apex; the injection and dead time are `VerticalLineAnnotation`s with labels.
- The peak finder smooths the signal, estimates the noise and a baseline, finds peaks that rise clearly above the noise, splits overlapping ones at the valley between them, and sums the area above a straight baseline drawn under each group.

**See it in the demo app:** [JavaScript mountain chart](https://www.scichart.com/demo/javascript/mountain-chart) · [React mountain chart](https://www.scichart.com/demo/react/mountain-chart) · [Angular mountain chart](https://www.scichart.com/demo/angular/mountain-chart), and for labelled peaks, [JavaScript chart annotations](https://www.scichart.com/demo/javascript/chart-annotations) · [React chart annotations](https://www.scichart.com/demo/react/chart-annotations) · [Angular chart annotations](https://www.scichart.com/demo/angular/chart-annotations).

**Go deeper:** [SciChart.js band series documentation](/2d-charts/chart-types/fast-band-renderable-series/), the [mountain (area) series documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/) and the [line series documentation](/2d-charts/chart-types/fast-line-renderable-series/). For how laboratories use SciChart for instrument and analysis software, see [SciChart for diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/).

## Frequently asked questions

### What does a chromatogram show?

A chromatogram shows the detector's signal against time after a sample is injected into a chromatography column. Each peak is a compound, or a group of compounds, leaving the column. The time of the peak's top (its retention time) helps identify the compound, and the area under the peak tells you how much of it there is.

### Where is the retention time on a chromatogram?

The retention time is read on the horizontal axis. It is the time from the injection (time zero) to the top of a peak. Data systems print it above each peak and list it in the peak table. Subtract the dead time, the retention time of an unretained compound, to get the adjusted retention time.

### What is the difference between a chromatogram and a chromatograph?

A chromatograph is the instrument that performs the separation, such as a gas chromatograph or an HPLC system. A chromatogram is the record it produces: a plot of detector response against time. Chromatography is the technique itself.

### Should I use peak height or peak area to measure the amount?

Use peak area in most cases. The area stays the same when a peak gets wider, for example later in a run or on an older column, while the height falls. Height can be better for a small peak on a noisy or sloping baseline, or a peak that overlaps its neighbour, as long as the standards and samples are run under the same conditions.

### What resolution is good enough between two peaks?

A resolution of 1.5 or more is usually called baseline resolution: two equal Gaussian peaks then overlap by only about 0.1%. At a resolution of 1.0 the overlap is about 2%, which is enough for many qualitative checks but can bias the areas. Many validated methods require at least 1.5, or 2.0, for the critical pair.

### How do I plot a chromatogram in JavaScript?

Load the detector readings as time and response arrays into a line series, with time in minutes on the x-axis. Add text annotations for the retention times, shade each integrated peak between the signal and its baseline with a band series, and add zoom, pan and a cursor so analysts can inspect small peaks. SciChart.js does this with FastLineRenderableSeries, FastBandRenderableSeries and TextAnnotation.

## Sources

- United States Pharmacopeia, General Chapter &lt;621&gt; *Chromatography* (harmonised with the European Pharmacopoeia 2.2.46 and the Japanese Pharmacopoeia). Definitions of retention time, dead time, resolution, plate number, the symmetry (tailing) factor and system suitability.
- Harvey, D., *Analytical Chemistry 2.1*, LibreTexts: [General theory of column chromatography](https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Analytical_Chemistry_2.1_(Harvey)/12:_Chromatographic_and_Electrophoretic_Methods/12.02:_General_Theory_of_Column_Chromatography), [optimising chromatographic separations](https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Analytical_Chemistry_2.1_(Harvey)/12:_Chromatographic_and_Electrophoretic_Methods/12.03:_Optimizing_Chromatographic_Separations), [gas chromatography](https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Analytical_Chemistry_2.1_(Harvey)/12:_Chromatographic_and_Electrophoretic_Methods/12.04:_Gas_Chromatography) and [high-performance liquid chromatography](https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Analytical_Chemistry_2.1_(Harvey)/12:_Chromatographic_and_Electrophoretic_Methods/12.05:_High-Performance_Liquid_Chromatography).
- Snyder, L. R., Kirkland, J. J. and Dolan, J. W. (2010), *Introduction to Modern Liquid Chromatography*, 3rd edition, Wiley. Resolution, the Purnell equation, peak tailing and integration.
- Skoog, D. A., Holler, F. J. and Crouch, S. R. (2018), *Principles of Instrumental Analysis*, 7th edition, Cengage. Chromatographic theory, detectors, GC and HPLC.
- Sanger, F., Nicklen, S. and Coulson, A. R. (1977), [DNA sequencing with chain-terminating inhibitors](https://doi.org/10.1073/pnas.74.12.5463). *Proceedings of the National Academy of Sciences*, 74(12). The chain-termination method behind sequencing traces.
- Smith, L. M. et al. (1986), [Fluorescence detection in automated DNA sequence analysis](https://doi.org/10.1038/321674a0). *Nature*, 321(6071). Four fluorescent dyes, one per base: the four-colour trace.
- International Council for Harmonisation (2023), *ICH Q2(R2): Validation of Analytical Procedures*. Signal-to-noise ratios of about 3 for detection and 10 for quantitation.
- Lieber, C. A. and Mahadevan-Jansen, A. (2003), [Automated method for subtraction of fluorescence from biological Raman spectra](https://doi.org/10.1366/000370203322554518). *Applied Spectroscopy*, 57(11). The iterative polynomial baseline used by the demo's peak finder.

<LearnCta position="bottom" chart="chromatogram" demo="mountain-chart" demoLabel="mountain chart" docs="/2d-charts/chart-types/fast-band-renderable-series/" docsLabel="SciChart.js band series documentation" />
