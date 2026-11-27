---
sidebar_position: 120
sidebar_label: Mass Spectrum
title: "Mass Spectrum: How to Read m/z, the Base Peak and Isotope Patterns"
description: "How to read a mass spectrum: the m/z axis, relative abundance, the molecular ion and base peak, fragments, chlorine and bromine isotope patterns, ESI charge states, resolution and ppm accuracy, with a live example."
keywords:
    [
        "mass spectrum",
        "mass spectrometry graph",
        "how to read a mass spectrum",
        "mass spectrometry",
        "what is a mass spectrum",
        "mass spec chart",
        "m/z",
        "mass to charge ratio",
        "base peak",
        "molecular ion peak",
        "m+2 peak",
        "isotope pattern",
        "fragmentation pattern",
        "charge state deconvolution",
        "mass resolution",
        "mass accuracy ppm"
    ]
image: /img/learn/mass-spectrum-og.png
related: [spectroscopy, chromatogram, lollipop-chart, heatmap]
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
                    "name": "What does a mass spectrum show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A mass spectrum shows which ions a sample produced in a mass spectrometer and how many of each. The horizontal axis is the mass-to-charge ratio (m/z) and the vertical axis is the ion count, usually scaled so the tallest peak is 100%. The peak positions give the masses of the molecule and its fragments; their heights and isotope patterns help identify it." }
                },
                {
                    "@type": "Question",
                    "name": "What is the base peak in a mass spectrum?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The base peak is the tallest peak in a mass spectrum: the most abundant ion. Every other peak is scaled relative to it, so it is set to 100% relative abundance. It is often a stable fragment rather than the whole molecule; in toluene it is the C7H7+ ion at m/z 91, one mass unit below the molecular ion." }
                },
                {
                    "@type": "Question",
                    "name": "How do you find the molecular ion peak?",
                    "acceptedAnswer": { "@type": "Answer", "text": "In an electron ionisation spectrum, look for the highest-m/z cluster that is not just an isotope peak: the molecular ion is the lightest peak of that cluster, with M+1 and M+2 isotope peaks just above it. Check it makes sense: losses to the next fragments should be chemically possible, such as 15 for a methyl group, and an odd mass means an odd number of nitrogen atoms. In electrospray, look for [M+H]+ or [M-H]- instead." }
                },
                {
                    "@type": "Question",
                    "name": "What does m/z mean in mass spectrometry?",
                    "acceptedAnswer": { "@type": "Answer", "text": "m/z is the mass-to-charge ratio: an ion's mass in unified atomic mass units (daltons) divided by the number of charges it carries. It is the quantity a mass spectrometer actually separates ions by. For a singly charged ion, m/z equals its mass; an ion with three charges appears at one third of its mass." }
                },
                {
                    "@type": "Question",
                    "name": "Why is there an M+2 peak in a mass spectrum?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An M+2 peak comes from molecules that contain a heavier isotope two mass units above the common one. Chlorine (chlorine-37 is about 24% of natural chlorine) gives an M+2 peak about a third the height of M, and bromine (bromine-81 is about 49%) gives an M+2 peak almost as tall as M. Sulfur gives a small M+2 of about 4.5% per atom." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a mass spectrum in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Put the m/z values on a numeric x-axis and the intensities, divided by the largest and multiplied by 100, on the y-axis. Draw centroided data as an impulse (stem) series, one vertical line per peak, and profile data as a line or mountain series. Label the tallest peaks with text annotations and add zoom and pan so users can inspect isotope clusters. SciChart.js does this with FastImpulseRenderableSeries, FastMountainRenderableSeries and TextAnnotation." }
                }
            ]
        })}
    </script>
</head>

# Mass Spectrum

## What is a mass spectrum?

A **mass spectrum** is the graph a mass spectrometer produces: how many ions it detected at each mass-to-charge ratio (m/z). The x-axis is m/z; the y-axis is the ion count, usually scaled so the tallest peak, the base peak, is 100%. Peak positions reveal the molecule's mass and its fragments; heights and isotope patterns help identify it.

![A stick mass spectrum of dichloromethane in a dark navy theme: relative abundance against m/z, with the base peak at m/z 49 and its chlorine-37 partner at 51, and the molecular-ion cluster at m/z 84, 86 and 88 highlighted in orange, the tallest peaks labelled with their m/z](/img/learn/mass-spectrum-og.png)

*A simulated electron ionisation mass spectrum of dichloromethane, with isotope peaks calculated from natural abundances (sample data). [Try the interactive version](#how-to-plot-a-mass-spectrum-in-javascript-react-or-angular).*

:::tip Key takeaways
- The x-axis is m/z (mass divided by charge) and the y-axis is relative abundance, with the base peak set to 100%.
- The molecular ion gives the molecule's mass; the base peak is simply the most abundant ion and is often a fragment.
- Isotope peaks above the molecular ion reveal elements: M+1 counts carbons, and M+2 flags chlorine, bromine or sulfur.
- Soft ionisation (electrospray) gives intact, often multiply charged ions; hard ionisation (EI) gives a fingerprint of fragments.
- Resolving power decides whether neighbouring peaks separate; mass accuracy, in ppm, decides which formulas fit.
:::

## What mass spectrometry measures

**Mass spectrometry** (MS) is the technique of turning molecules into gas-phase ions, sorting the ions by mass-to-charge ratio and counting them. The instrument is a mass spectrometer and its output, one scan at a time, is a mass spectrum. Every mass spectrometer has three parts:

1. Ion source: gives the molecules a charge. Neutral molecules can't be steered by electric or magnetic fields; ions can.
2. Mass analyser: separates the ions by m/z. Quadrupoles let one m/z through at a time, time-of-flight (TOF) analysers time how long ions take to fly down a tube (lighter ions arrive first), and Orbitrap and FT-ICR analysers measure how fast ions oscillate in a trap.
3. Detector: counts the ions arriving at each m/z, and the data system draws the counts as the spectrum.

The analyser measures m/z, not mass. An ion of mass 1,000 Da carrying two charges lands at m/z 500, which is why large molecules can show up at low m/z.

### EI vs ESI: hard and soft ionisation

How the molecules are ionised decides what the spectrum looks like, so check it first.

| | Electron ionisation (EI) | Electrospray ionisation (ESI) |
| --- | --- | --- |
| How it works | A beam of 70 eV electrons knocks an electron out of each gas-phase molecule, leaving a radical cation M<sup>+•</sup> | A charged spray of the sample solution dries into droplets that release ions such as [M+H]<sup>+</sup> or [M−H]<sup>−</sup> |
| Hard or soft | Hard: the ion carries spare energy and breaks apart | Soft: the molecule usually stays intact |
| What you see | A weak or missing molecular ion and many fragment peaks, a reproducible fingerprint | One or a few peaks for the intact molecule, plus adducts such as [M+Na]<sup>+</sup> |
| Charges | One per ion | Often several on large molecules: [M+nH]<sup>n+</sup> |
| Typical use | GC-MS of small, volatile compounds, matched against spectral libraries | LC-MS of drugs, metabolites, peptides and proteins |

Other soft sources include chemical ionisation (CI), atmospheric pressure chemical ionisation (APCI) and matrix-assisted laser desorption/ionisation (MALDI). Spectral libraries such as the NIST library hold EI spectra recorded at 70 eV, so a spectrum taken under those conditions can be matched against hundreds of thousands of references.

## How to read a mass spectrum

Read a mass spectrum by finding the molecular ion first, then working down through the fragments and isotope peaks to piece the molecule together.

![An annotated stick mass spectrum of chlorobenzene: the molecular ion at m/z 112 is also the base peak, set to 100%, with a small M+1 peak at 113 from carbon-13 and an M+2 peak at 114, about a third of M, from chlorine-37; a dashed arrow from 112 to the C6H5+ fragment at m/z 77, about 45%, marking the loss of 35, a chlorine atom; and a fragment at m/z 51 from the loss of 26, acetylene](./mass-spectrum-anatomy.svg)

- The x-axis is the **mass-to-charge ratio** (m/z): the ion's mass in daltons (Da, also unified atomic mass units, u) divided by its number of charges. Most EI ions carry one charge, so m/z reads as the ion's mass.
- The y-axis is the relative abundance: the ion count at each m/z, divided by the count of the tallest peak and multiplied by 100. Some software shows raw counts ("intensity") instead; the shape is the same.
- The **base peak** is the tallest peak, set to 100%. It is the most abundant ion. In chlorobenzene it is the molecular ion itself, but in many molecules, such as toluene, it is a stable fragment.
- The **molecular ion** (M) is the intact molecule with one electron removed, M<sup>+•</sup>. Its m/z is the molecular mass. In EI it is usually at the top end of the spectrum, but can be small or missing for molecules that break up easily, such as many alcohols.
- Fragment peaks are pieces of the molecular ion. The gap between the molecular ion and a fragment is the mass of the neutral piece that was lost.
- Isotope peaks (M+1, M+2) are small peaks one and two units above each ion, from molecules containing heavier isotopes such as carbon-13 and chlorine-37.

Reading a spectrum is then a sequence of questions:

1. Which ionisation was used? EI expects fragments; ESI expects intact ions and adducts.
2. Where is the molecular ion? Take the highest-m/z cluster that isn't just isotope peaks of something lower. Its lightest member is M.
3. What do the isotope peaks say? Use M+1 for the number of carbons, and M+2 for chlorine, bromine or sulfur (next section).
4. Is the mass odd or even? By the nitrogen rule, a molecular ion with an odd nominal mass contains an odd number of nitrogen atoms; an even mass means none, or an even number.
5. What was lost? Subtract each major fragment from M and match the difference against common neutral losses.
6. Does it match a reference? Compare with a library spectrum, or for an unknown, with the formula the accurate mass allows.

### Worked example: toluene

Toluene, C<sub>7</sub>H<sub>8</sub>, has a nominal mass of 7 × 12 + 8 × 1 = 92. Its EI spectrum shows:

| m/z | Ion | What happened |
| --- | --- | --- |
| 92 | C<sub>7</sub>H<sub>8</sub><sup>+•</sup>, the molecular ion | One electron removed. Strong, because the aromatic ring holds the charge well |
| 93 | M+1 | About 7.7% of M: seven carbons, each with a 1.07% chance of being carbon-13 |
| 91 | C<sub>7</sub>H<sub>7</sub><sup>+</sup>, the base peak | Loss of one hydrogen atom (92 − 91 = 1). The ion rearranges into the very stable seven-membered tropylium ring |
| 65 | C<sub>5</sub>H<sub>5</sub><sup>+</sup> | 91 − 65 = 26: the tropylium ion loses acetylene, C<sub>2</sub>H<sub>2</sub> |

The exact masses, using the electron's mass as well, are 92.0621 for M<sup>+•</sup> and 91.0542 for C<sub>7</sub>H<sub>7</sub><sup>+</sup>. An even molecular mass with no nitrogen agrees with the nitrogen rule.

### Common neutral losses

| Loss (Da) | Usually | Hints at |
| --- | --- | --- |
| 1 | H• | Aromatics, aldehydes |
| 15 | CH<sub>3</sub>• | A methyl group |
| 17 | OH• | Carboxylic acids |
| 18 | H<sub>2</sub>O | Alcohols |
| 26 | C<sub>2</sub>H<sub>2</sub> | Aromatic rings |
| 28 | CO or C<sub>2</sub>H<sub>4</sub> | Ketones, phenols; ethyl groups |
| 29 | C<sub>2</sub>H<sub>5</sub>• or CHO• | Ethyl groups; aldehydes |
| 31 | OCH<sub>3</sub>• | Methyl esters, methyl ethers |
| 35 and 37 | Cl• | Chlorine compounds (the two peaks keep the 3 : 1 ratio) |
| 43 | C<sub>3</sub>H<sub>7</sub>• or CH<sub>3</sub>CO• | Propyl groups; methyl ketones |
| 79 and 81 | Br• | Bromine compounds |

Losses of 3 to 14, or 21 to 25, are almost never seen. If the gap between the supposed molecular ion and the next big peak is one of those, the "molecular ion" is probably a fragment or an impurity.

## Isotope patterns: M+1 and M+2 peaks

Most elements have more than one stable isotope, so a sample's molecules don't all weigh the same. Each ion appears as a small cluster: M from molecules with only the lightest isotopes, then M+1, M+2 and so on. The heights follow from the natural abundances, which makes the **isotope pattern** a check on the formula.

![Six small stick spectra of molecular-ion clusters: one chlorine gives M and M+2 in the ratio 100 to 32; two chlorines 100 to 64 to 10; three chlorines 100 to 96 to 31 to 3; one bromine 100 to 97; two bromines 51 to 100 to 49; and one bromine with one chlorine 77 to 100 to 24](./isotope-patterns.svg)

| Element | Isotopes and natural abundance | Effect on the cluster |
| --- | --- | --- |
| Carbon | <sup>12</sup>C 98.93%, <sup>13</sup>C 1.07% | M+1 of about 1.1% of M per carbon atom |
| Hydrogen | <sup>1</sup>H 99.99%, <sup>2</sup>H 0.01% | Negligible |
| Nitrogen | <sup>14</sup>N 99.64%, <sup>15</sup>N 0.36% | M+1 of about 0.37% per nitrogen |
| Oxygen | <sup>16</sup>O 99.76%, <sup>18</sup>O 0.21% | Small M+2, about 0.2% per oxygen |
| Sulfur | <sup>32</sup>S 94.99%, <sup>34</sup>S 4.25% | M+2 of about 4.5% per sulfur |
| Chlorine | <sup>35</sup>Cl 75.76%, <sup>37</sup>Cl 24.24% | M+2 about 32% of M per chlorine (roughly 3 : 1) |
| Bromine | <sup>79</sup>Br 50.69%, <sup>81</sup>Br 49.31% | M+2 about 97% of M per bromine (roughly 1 : 1) |

Two quick rules come out of the table:

- Counting carbons: the number of carbon atoms is roughly the M+1 height as a percentage of M, divided by 1.1. Toluene's M+1 of 7.7% gives 7. Nitrogen adds a little, so for caffeine (C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>, M+1 = 10.3%) the rule gives 9: treat it as an upper limit.
- Spotting halogens: peaks two units apart in a 3 : 1 ratio mean one chlorine; about 1 : 1 means one bromine. More halogens multiply out. For two chlorines, the chance of 35 + 35, 35 + 37 and 37 + 37 is $0.7576^2$, $2 \times 0.7576 \times 0.2424$ and $0.2424^2$, giving M : M+2 : M+4 = 100 : 64 : 10, the familiar 9 : 6 : 1.

Dichloromethane shows both rules at work. Its molecular ion cluster sits at m/z 84, 86 and 88 in the ratio 100 : 64 : 10. The base peak, at m/z 49, is CH<sub>2</sub>Cl<sup>+</sup> after losing one chlorine, and it carries a single chlorine's 3 : 1 partner at m/z 51.

For large molecules the M peak shrinks. A molecule with 100 carbons has more molecules with one carbon-13 than with none, so M+1 is taller than M. In a protein of 8,500 Da the monoisotopic peak is barely visible, and the tallest isotope peak sits about five units higher.

## Charge states in electrospray mass spectra

Electrospray adds protons (in positive mode) to every basic site a molecule has. A peptide or protein picks up several, so the same molecule appears as a series of peaks, one per **charge state**, each at

$$
m/z = \frac{M + n \times 1.00728}{n}
$$

where $M$ is the neutral mass, $n$ the number of protons and 1.00728 Da the mass of a proton. More charge means lower m/z, so a protein's spectrum is a bell-shaped envelope of peaks, with the highest charge state at the left.

Two features give the charge away:

- Isotope spacing: isotope peaks are 1 Da apart in mass, so on the m/z axis they are $1/n$ apart: 0.5 for 2+, 0.33 for 3+, 0.1 for 10+. Measure the spacing and you have the charge, if the resolving power is high enough to separate them.
- Neighbouring charge states: two adjacent peaks of the same molecule, $m_1$ (charge $z$) and $m_2$ (charge $z+1$, at lower m/z), give the charge directly: $z = (m_2 - 1.00728)/(m_1 - m_2)$. Then $M = z\,(m_1 - 1.00728)$.

The peptide angiotensin I, for example, shows [M+2H]<sup>2+</sup> at m/z 648.846 and [M+3H]<sup>3+</sup> at 432.900. Then $z = (432.900 - 1.007)/(648.846 - 432.900) = 2.00$, and $M = 2 \times (648.846 - 1.007) = 1{,}295.677$ Da, its monoisotopic mass. When the isotope peaks are not resolved, use the centre of each charge-state peak instead; the result is then the average mass, 1,296.48 Da, rather than the monoisotopic mass. **Deconvolution** software does this across the whole envelope and redraws the spectrum on a neutral-mass axis, with one peak per molecule instead of one per charge state. Look for its artefacts, such as ghost peaks at half or double the true mass.

## Stick vs profile spectra

The detector records a continuous signal, and each ion produces a peak with a width. A **profile spectrum** keeps that shape. A **centroided** or **stick spectrum** reduces each peak to one m/z (its centre) and one intensity, drawn as a vertical line.

| | Profile spectrum | Stick (centroided) spectrum |
| --- | --- | --- |
| Drawn as | A continuous line | Vertical lines from zero |
| Shows | Peak shape and width, overlap, shoulders | Peak positions and heights only |
| Use it to | Judge resolution, spot overlapping ions, check centroiding | Read and compare spectra, search libraries |
| File size | Large: many points per peak | Small: one point per peak |

Library spectra and textbooks almost always use sticks, which is why a mass spectrum looks like a bar chart with very thin bars. When peaks are closer than the instrument can resolve, a profile spectrum shows one wide peak with a shoulder, and centroiding reports a single, averaged m/z that matches neither ion.

## Mass resolution and mass accuracy

Two numbers describe how good a spectrum is, and they are often confused.

**Resolving power** $R$ is how well the instrument separates neighbouring peaks. With $\Delta m$ the peak's full width at half its height (FWHM):

$$
R = \frac{m}{\Delta m}
$$

Carbon monoxide (27.9949) and nitrogen (28.0061) both have a nominal mass of 28 and differ by 0.0112. To separate them you need $R$ of about $28/0.0112 = 2{,}500$. A quadrupole working at unit resolution shows one peak; a high-resolution instrument shows two. Quadrupoles typically give unit resolution, time-of-flight instruments tens of thousands, and Orbitrap and FT-ICR instruments 100,000 or more.

**Mass accuracy** is how close the measured m/z is to the true value, in parts per million:

$$
\text{error (ppm)} = \frac{m_{\text{measured}} - m_{\text{theoretical}}}{m_{\text{theoretical}}} \times 10^6
$$

Protonated caffeine, [C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub> + H]<sup>+</sup>, has a theoretical m/z of 195.0877. A reading of 195.0882 is 2.6 ppm high. Accurate mass narrows the possible formulas: at a few ppm, only a handful of formulas fit a small molecule, and the isotope pattern usually settles which.

High resolving power without calibration still gives wrong masses, and good accuracy is impossible on peaks that overlap.

## Mass spectrum vs chromatogram: GC-MS and LC-MS

A mass spectrometer is usually fed by a chromatograph. Gas chromatography (GC-MS) or liquid chromatography (LC-MS) separates the mixture first, and the mass spectrometer records a full spectrum several times a second as compounds leave the column. That produces several graphs from one run.

| Graph | x-axis | y-axis | Answers |
| --- | --- | --- | --- |
| Mass spectrum | m/z | Relative abundance | What is this compound? |
| [Chromatogram](/learn/applications/chromatogram/), total ion (TIC) | Retention time | Sum of all ions in each scan | When did compounds elute, and how much? |
| [Extracted ion chromatogram](/learn/applications/chromatogram/) (EIC or XIC) | Retention time | Signal at one chosen m/z | Where is my target compound, even if it overlaps another? |
| Heatmap (LC-MS map) | Retention time | m/z, with intensity as [colour](/learn/chart-types/cartesian/heatmap/) | The whole run at once: every ion at every time |

To get the mass spectrum of one compound, pick its peak in the chromatogram and average the scans across it, subtracting a background scan from just before the peak. A spectrum taken on the side of a peak, or across two co-eluting compounds, mixes their ions.

## Common mass spectrum mistakes

Most mass spectrum misreadings mix up which peak is which: the base peak, the molecular ion and its isotope partners.

- **Calling the base peak the molecular ion.** The tallest peak is only the most abundant ion. In toluene it is M − 1; in many alcohols and branched alkanes the molecular ion is tiny or absent.
- **Taking an isotope peak as M.** The highest m/z in a chlorine or bromine compound is M+2 or M+4, not M. Find the lightest peak of the cluster.
- **Reading m/z as mass in electrospray.** A peak at m/z 857 may be a 10+ ion of an 8,560 Da protein. Check the isotope spacing before assuming a single charge.
- **Ignoring adducts.** In ESI, [M+Na]<sup>+</sup> sits 21.98 above [M+H]<sup>+</sup> and [M+K]<sup>+</sup> 37.96 above it. Misread, they suggest a heavier molecule.
- **Comparing raw intensities between runs.** Relative abundance is normalised within one spectrum. Ion counts depend on concentration, source conditions and suppression by other compounds, so quantify with calibration standards, ideally isotope-labelled ones.
- **Trusting a library match on score alone.** Isomers can give near-identical EI spectra. Confirm with retention time, or accurate mass and isotope pattern.
- **Over-reading small peaks.** Background ions, column bleed and solvent clusters are in every spectrum. Subtract a blank before interpreting peaks of a few per cent.

## How to plot a mass spectrum in JavaScript, React or Angular

A modern mass spectrometer writes thousands of spectra per run, and a profile spectrum can hold hundreds of thousands of points. The demo calculates each spectrum live from the ions' formulas and natural isotope abundances, for six compounds from dichloromethane to the ubiquitin protein, and rebuilds the stick or profile spectrum every time you change a setting; the fragment and charge-state intensities are illustrative.

Pick a **Compound** and an **Ionisation**: EI shows fragments for the small molecules, and ESI shows the peptide's and protein's charge states (each compound offers only the realistic option). **Peaks** switches between a stick and a profile spectrum, and **Resolving power** sets the profile peak width: watch the protein's isotope peaks merge into one envelope below about 10,000. **Zoom to molecular ion** jumps to the molecular-ion cluster, and **Label peaks** marks the tallest peaks in view with their m/z. The line above the chart reads the base peak, the molecular ion, its M+1 and M+2 ratios and what they suggest, or for multiply charged ions, the charge and average mass from the centres of two neighbouring charge states. Scroll to zoom the m/z axis, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={600} name="./Basic/demo" />

<LearnCta position="top" chart="mass spectrum" demo="impulse-chart" demoLabel="impulse chart" docs="/2d-charts/chart-types/fast-impulse-renderable-series/" docsLabel="SciChart.js impulse (stem) series documentation" />

Here is the code for this chart. The isotope maths is plain JavaScript; SciChart.js draws the sticks with impulse series, the profile with a mountain series and the peak labels with annotations.

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
        EXyDirection,
        FastImpulseRenderableSeries,
        XyDataSeries,
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
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "m/z" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Relative abundance (%)",
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0, 0.15)
            })
        );

        // Centroided peaks from your instrument or file (e.g. mzML): m/z values and intensities, sorted by m/z
        const { mz, intensity } = getYourSpectrumData();
        const basePeak = Math.max(...intensity);
        const relative = intensity.map((v) => (100 * v) / basePeak); // the base peak becomes 100%

        sciChartSurface.renderableSeries.add(
            new FastImpulseRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: mz, yValues: relative, dataIsSortedInX: true }),
                fill: "#50C7E0",
                strokeThickness: 2
            })
        );

        // Label the ten tallest peaks with their m/z
        mz.map((x, i) => ({ x, y: relative[i] }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 10)
            .forEach((peak) =>
                sciChartSurface.annotations.add(
                    new TextAnnotation({
                        x1: peak.x,
                        y1: peak.y,
                        text: peak.x.toFixed(1),
                        textColor: "#FFFFFF",
                        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                        yCoordShift: -4
                    })
                )
            );

        // Zoom and pan the m/z axis only; the y-axis rescales to the peaks in view
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const MassSpectrumChart = () => (
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
        EXyDirection,
        FastImpulseRenderableSeries,
        XyDataSeries,
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
        selector: "app-mass-spectrum-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class MassSpectrumChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "m/z" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Relative abundance (%)",
                    autoRange: EAutoRange.Always,
                    growBy: new NumberRange(0, 0.15)
                })
            );

            // Centroided peaks from your instrument or file (e.g. mzML): m/z values and intensities, sorted by m/z
            const { mz, intensity } = getYourSpectrumData();
            const basePeak = Math.max(...intensity);
            const relative = intensity.map((v) => (100 * v) / basePeak); // the base peak becomes 100%

            sciChartSurface.renderableSeries.add(
                new FastImpulseRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: mz, yValues: relative, dataIsSortedInX: true }),
                    fill: "#50C7E0",
                    strokeThickness: 2
                })
            );

            // Label the ten tallest peaks with their m/z
            mz.map((x, i) => ({ x, y: relative[i] }))
                .sort((a, b) => b.y - a.y)
                .slice(0, 10)
                .forEach((peak) =>
                    sciChartSurface.annotations.add(
                        new TextAnnotation({
                            x1: peak.x,
                            y1: peak.y,
                            text: peak.x.toFixed(1),
                            textColor: "#FFFFFF",
                            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                            yCoordShift: -4
                        })
                    )
                );

            // Zoom and pan the m/z axis only; the y-axis rescales to the peaks in view
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Centroided peaks are a `FastImpulseRenderableSeries`: one vertical line from zero to each intensity. The demo uses two, so the molecular-ion peaks can be drawn in a second colour.
- The profile spectrum is a `FastMountainRenderableSeries`, sampled only near the peaks with zeros between them, which keeps a high-resolution profile to a few thousand points.
- Zoom and pan act on the m/z axis only (`xyDirection: EXyDirection.XDirection`), and the y-axis uses `EAutoRange.Always`, so a small isotope cluster fills the chart when you zoom in on it.
- The labels are `TextAnnotation`s, rebuilt from the `xAxis.visibleRangeChanged` event so they always mark the tallest peaks in view without overlapping.

**See it in the demo app:** [JavaScript impulse chart](https://www.scichart.com/demo/javascript/impulse-chart) · [React impulse chart](https://www.scichart.com/demo/react/impulse-chart) · [Angular impulse chart](https://www.scichart.com/demo/angular/impulse-chart), and for labelled peaks, [JavaScript chart annotations](https://www.scichart.com/demo/javascript/chart-annotations) · [React chart annotations](https://www.scichart.com/demo/react/chart-annotations) · [Angular chart annotations](https://www.scichart.com/demo/angular/chart-annotations).

**Go deeper:** [SciChart.js impulse (stem) series documentation](/2d-charts/chart-types/fast-impulse-renderable-series/), the [mountain (area) series documentation](/2d-charts/chart-types/fast-mountain-area-renderable-series/) and the [text annotation documentation](/2d-charts/annotations-api/text-annotation/). For how laboratories use SciChart in instrument and analysis software, see [SciChart for diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/).

## Frequently asked questions

### What does a mass spectrum show?

A mass spectrum shows which ions a sample produced in a mass spectrometer and how many of each. The horizontal axis is the mass-to-charge ratio (m/z) and the vertical axis is the ion count, usually scaled so the tallest peak is 100%. The peak positions give the masses of the molecule and its fragments; their heights and isotope patterns help identify it.

### What is the base peak in a mass spectrum?

The base peak is the tallest peak in a mass spectrum: the most abundant ion. Every other peak is scaled relative to it, so it is set to 100% relative abundance. It is often a stable fragment rather than the whole molecule; in toluene it is the C7H7+ ion at m/z 91, one mass unit below the molecular ion.

### How do you find the molecular ion peak?

In an electron ionisation spectrum, look for the highest-m/z cluster that is not just an isotope peak: the molecular ion is the lightest peak of that cluster, with M+1 and M+2 isotope peaks just above it. Check it makes sense: losses to the next fragments should be chemically possible, such as 15 for a methyl group, and an odd mass means an odd number of nitrogen atoms. In electrospray, look for [M+H]+ or [M-H]- instead.

### What does m/z mean in mass spectrometry?

m/z is the mass-to-charge ratio: an ion's mass in unified atomic mass units (daltons) divided by the number of charges it carries. It is the quantity a mass spectrometer actually separates ions by. For a singly charged ion, m/z equals its mass; an ion with three charges appears at one third of its mass.

### Why is there an M+2 peak in a mass spectrum?

An M+2 peak comes from molecules that contain a heavier isotope two mass units above the common one. Chlorine (chlorine-37 is about 24% of natural chlorine) gives an M+2 peak about a third the height of M, and bromine (bromine-81 is about 49%) gives an M+2 peak almost as tall as M. Sulfur gives a small M+2 of about 4.5% per atom.

### How do I plot a mass spectrum in JavaScript?

Put the m/z values on a numeric x-axis and the intensities, divided by the largest and multiplied by 100, on the y-axis. Draw centroided data as an impulse (stem) series, one vertical line per peak, and profile data as a line or mountain series. Label the tallest peaks with text annotations and add zoom and pan so users can inspect isotope clusters. SciChart.js does this with FastImpulseRenderableSeries, FastMountainRenderableSeries and TextAnnotation.

## Sources

- Murray, K. K. et al. (2013), [Definitions of terms relating to mass spectrometry (IUPAC Recommendations 2013)](https://doi.org/10.1351/PAC-REC-06-04-06). *Pure and Applied Chemistry*, 85(7). Mass-to-charge ratio, base peak, molecular ion, resolving power and mass accuracy.
- National Institute of Standards and Technology, [Atomic Weights and Isotopic Compositions](https://www.nist.gov/pml/atomic-weights-and-isotopic-compositions-relative-atomic-masses). Isotope masses and natural abundances used for the isotope patterns and the demo.
- National Institute of Standards and Technology, [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/). Reference electron ionisation spectra, including toluene, dichloromethane and chlorobenzene.
- McLafferty, F. W. and Tureček, F. (1993), *Interpretation of Mass Spectra*, 4th edition, University Science Books. The nitrogen rule, isotope clusters and common neutral losses.
- Gross, J. H. (2017), *Mass Spectrometry: A Textbook*, 3rd edition, Springer. Ionisation methods, mass analysers, resolution and accurate mass.
- Fenn, J. B. et al. (1989), [Electrospray ionization for mass spectrometry of large biomolecules](https://doi.org/10.1126/science.2675315). *Science*, 246(4926). Multiply charged ions and the charge-state calculation.

<LearnCta position="bottom" chart="mass spectrum" demo="impulse-chart" demoLabel="impulse chart" docs="/2d-charts/chart-types/fast-impulse-renderable-series/" docsLabel="SciChart.js impulse (stem) series documentation" />
