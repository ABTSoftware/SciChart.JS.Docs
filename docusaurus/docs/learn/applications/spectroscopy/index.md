---
sidebar_position: 230
sidebar_label: Spectroscopy
title: "Spectroscopy Plots: How to Read IR, Raman and UV-Vis Spectra"
description: "What a spectrum shows and how to read IR, Raman and UV-Vis spectra: wavenumber axes, transmittance vs absorbance, the fingerprint region, Beer–Lambert, baseline correction and a live example."
keywords:
    [
        "spectroscopy",
        "ir spectroscopy",
        "ir spectrum",
        "how to read an ir spectrum",
        "ir spectrum table",
        "fingerprint region",
        "raman spectroscopy",
        "raman spectrum",
        "raman shift",
        "uv vis spectroscopy",
        "uv vis spectrum",
        "absorbance spectrum",
        "beer lambert law",
        "transmittance vs absorbance",
        "ir vs raman",
        "nmr spectrum",
        "spectral baseline correction"
    ]
image: /img/learn/spectroscopy-og.png
related: [mass-spectrum, chromatogram, low-pass-filter, heatmap]
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
                    "name": "What is the difference between IR and Raman spectroscopy?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both measure molecular vibrations, but in different ways. IR spectroscopy measures the infrared light a sample absorbs, and sees vibrations that change the molecule's dipole moment, such as O–H and C=O stretches. Raman spectroscopy shines a laser on the sample and measures the small shift in energy of the scattered light, and sees vibrations that change how easily the electron cloud is distorted, such as C=C, C–C and S–S stretches. Water absorbs strongly in the IR but scatters weakly in Raman, so Raman suits watery samples." }
                },
                {
                    "@type": "Question",
                    "name": "Why does an IR spectrum go from 4000 to 400 cm⁻¹?",
                    "acceptedAnswer": { "@type": "Answer", "text": "By convention, IR spectra are plotted with wavenumber falling from left to right, from 4000 cm⁻¹ down to about 400 cm⁻¹, the mid-infrared range most instruments cover. Wavenumber is the number of waves per centimetre, so it rises with energy: the left side holds the high-energy stretches of light atoms (O–H, N–H, C–H) and the right side the lower-energy bends and skeletal vibrations." }
                },
                {
                    "@type": "Question",
                    "name": "What is the fingerprint region of an IR spectrum?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The fingerprint region is the part of an IR spectrum below about 1500 cm⁻¹. It holds many overlapping bands from bending and whole-skeleton vibrations, so individual bands are hard to assign, but the overall pattern is unique to each compound. Matching it against a reference spectrum is how IR confirms a compound's identity." }
                },
                {
                    "@type": "Question",
                    "name": "What does a UV-Vis spectrum tell you?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A UV-Vis spectrum shows how much ultraviolet and visible light a sample absorbs at each wavelength, usually from about 190 to 800 nm. The wavelength of the highest band (λmax) points to the kind of light-absorbing group present, and the absorbance at that wavelength gives the concentration through the Beer–Lambert law, A = εlc. It is mostly used to measure how much of a known compound is present." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between absorbance and transmittance?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Transmittance is the fraction of light that passes through the sample, often given as a percentage. Absorbance is the negative base-10 logarithm of transmittance, A = −log10(T), so 10% transmittance is an absorbance of 1 and 1% is an absorbance of 2. Absorbance is proportional to concentration; transmittance is not, which is why quantitative work uses absorbance." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a spectrum in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Load the spectrum as two arrays, the x-axis values (wavenumber, Raman shift or wavelength) and the intensities, into a line series. For IR, flip the x-axis so wavenumber falls from left to right, and label peaks with text annotations. Add zoom, pan and a cursor so readers can inspect small bands. SciChart.js does this with FastLineRenderableSeries, a NumericAxis with flippedCoordinates and TextAnnotation, in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Spectroscopy Plots

## What is spectroscopy?

**Spectroscopy** is the measurement of how matter absorbs, emits or scatters light (or other radiation) as a function of its energy. The result is a **spectrum**: a plot of intensity against wavelength, wavenumber or energy. Each peak or dip marks an energy the sample responds to, which reveals what it contains and how much.

![A simulated infrared spectrum of ethanol in transmittance, plotted from 4000 to 400 wavenumbers, with downward bands labelled O–H stretch, C–H stretch, C–H bend and C–O stretch and the fingerprint region below 1500 shaded, in a dark navy theme](/img/learn/spectroscopy-og.png)

*A simulated IR spectrum of ethanol, with its bands picked and labelled by functional group (sample data). [Try the interactive version](#how-to-plot-a-spectrum-in-javascript-react-or-angular), which also switches to Raman and UV-Vis.*

:::tip Key takeaways
- A spectrum plots a response (absorbance, transmittance or scattered intensity) against an energy scale (wavelength in nm, or wavenumber in cm⁻¹).
- IR spectra run backwards, from 4000 to 400 cm⁻¹, and are often drawn in transmittance, so bands point down.
- IR and Raman both measure vibrations but see different ones; UV-Vis measures electronic transitions and is the workhorse for concentration.
- Absorbance, not transmittance, is proportional to concentration (the Beer–Lambert law).
- Baseline correction, smoothing and peak picking change what you read, so apply them consistently and with care.
:::

## What a spectrum shows

Every spectrum has the same two ingredients.

The horizontal axis is an energy scale, written in whichever unit suits the technique:

| Unit | Symbol | Used for | Relation to energy |
| --- | --- | --- | --- |
| Wavelength | nm (nanometres) | UV-Vis, fluorescence | Energy falls as wavelength rises |
| Wavenumber | cm⁻¹ (waves per centimetre) | IR, Raman | Proportional to energy |
| Raman shift | cm⁻¹ | Raman | The energy lost by scattered light, as a wavenumber difference |
| Mass-to-charge ratio | m/z | Mass spectrometry | Not an energy scale: a mass spectrum sorts ions by mass |
| Chemical shift | ppm | NMR | Resonance frequency relative to a reference |

Wavenumber is the reciprocal of wavelength in centimetres, $\tilde{\nu} = 10^7 / \lambda$ with $\lambda$ in nm. So 4000 cm⁻¹ is a wavelength of 2.5 µm and 400 cm⁻¹ is 25 µm, which together bound the mid-infrared.

The vertical axis is the response:

- **Absorbance** ($A$): how much light the sample takes out, on a logarithmic scale. Bands point up.
- **Transmittance** ($T$, or %T): the fraction of light that gets through. Bands point down, from a baseline near 100%.
- **Intensity or counts**: how much light reaches the detector, used for emission and Raman spectra.

Absorbance and transmittance carry the same information, linked by $A = -\log_{10} T = 2 - \log_{10}(\%T)$. An absorbance of 1 means 10% of the light gets through; an absorbance of 2 means 1%.

A peak has three things to read: its position (which energy, so which bond or transition), its height or area (how much), and its width and shape (the sample's environment, such as hydrogen bonding).

## IR spectroscopy

**Infrared (IR) spectroscopy** shines infrared light through or onto a sample and records which wavenumbers it absorbs. A bond absorbs when the light matches the frequency at which it stretches or bends, and only if that vibration changes the molecule's dipole moment. Polar bonds such as O–H, N–H and C=O therefore give strong bands.

Most modern instruments are FTIR spectrometers: they record an interferogram and turn it into a spectrum with a [Fourier transform](/learn/applications/signal-processing/fourier-transform/). Many measure by attenuated total reflectance (ATR), pressing the sample against a crystal, so liquids and solids need almost no preparation.

### How to read an IR spectrum

![An annotated infrared spectrum in percent transmittance from 4000 to 400 wavenumbers. Shaded bands mark the O–H and N–H region from 3200 to 3600, C–H stretches either side of a dashed line at 3000, triple bonds from 2100 to 2260, C=O from 1650 to 1800, C=C and aromatic bands, and the fingerprint region below 1500. A broad rounded dip near 3360 is labelled hydrogen-bonded O–H and a strong sharp dip near 1712 is labelled C=O](./ir-spectrum-regions.svg)

IR spectra are drawn with the x-axis reversed: wavenumber falls from 4000 cm⁻¹ on the left to 400 cm⁻¹ on the right. Work from left to right, and look for what is missing as well as what is there.

1. Check the axes and the baseline. Is the y-axis transmittance (bands down) or absorbance (bands up)? A sloping or curved baseline points to scattering or a poor background scan.
2. Look at 3200 to 3600 cm⁻¹. A broad, rounded band is a hydrogen-bonded O–H (an alcohol or water). One or two narrower bands are N–H (an amine or amide).
3. Find 3000 cm⁻¹. C–H stretches just below it mean sp³ carbon (alkyl groups); bands just above it mean C–H on a double bond or an aromatic ring. A sharp band near 3300 is a C–H on a triple bond.
4. Check 2100 to 2260 cm⁻¹. A band here, in an otherwise empty stretch of spectrum, means a triple bond: C≡N or C≡C.
5. Look at 1650 to 1800 cm⁻¹ for a strong, sharp C=O band, usually the tallest in the spectrum. Its position narrows down the type (table below).
6. Check 1450 to 1680 cm⁻¹ for C=C bonds and aromatic rings, which are usually weaker.
7. Treat the region below 1500 cm⁻¹ as a fingerprint. Strong bands between 1000 and 1300 cm⁻¹ often come from C–O bonds, but most bands here can't be assigned one by one. Compare the whole pattern with a reference spectrum, for example from the NIST Chemistry WebBook.
8. Put it together. A broad band from 2500 to 3300 cm⁻¹ that swallows the C–H stretches, plus C=O near 1710 cm⁻¹, is the signature of a carboxylic acid. C=O alone, with no O–H, points to a ketone, aldehyde or ester.

### IR spectrum table: functional group frequencies

Typical ranges from standard correlation tables (see Sources):

| Bond and group | Wavenumber (cm⁻¹) | What the band looks like |
| --- | --- | --- |
| O–H, alcohol, hydrogen-bonded | 3200–3550 | Strong, broad, rounded |
| O–H, carboxylic acid | 2500–3300 | Very broad, centred near 3000, overlapping the C–H bands |
| N–H, amine or amide | 3300–3500 | Medium; two bands for a primary amine, one for a secondary |
| C–H, sp³ (alkane) | 2840–3000 | Medium to strong, just below 3000 |
| C–H, sp² (alkene, aromatic) | 3000–3100 | Weaker, just above 3000 |
| C–H, alkyne | about 3300 | Strong, sharp |
| C≡N, nitrile | 2220–2260 | Medium to weak, sharp |
| C≡C, alkyne | 2100–2260 | Weak, sometimes absent |
| C=O, ester | 1735–1750 | Strong |
| C=O, aldehyde | 1720–1740 | Strong, with two weak C–H bands near 2720 and 2820 |
| C=O, ketone | 1705–1725 | Strong |
| C=O, carboxylic acid | 1706–1720 | Strong, with the broad O–H band |
| C=O, amide | 1650–1690 | Strong |
| C=C, alkene | 1620–1680 | Weak to medium |
| C=C, aromatic ring | 1450–1600 | Several medium bands |
| C–O, alcohols, ethers, esters | 1000–1300 | Strong |

Conjugation with a C=C or an aromatic ring lowers a C=O band by about 20 to 40 cm⁻¹, so an aromatic ketone sits nearer 1685 cm⁻¹.

### Transmittance vs absorbance in IR

Older instruments and many teaching labs plot %T, so a strong band is a deep dip. Absorbance is better for anything quantitative, because only absorbance grows in proportion to concentration. It also suits subtraction and comparison: a spectrum of a mixture is the sum of its components' absorbance spectra, but not of their transmittance spectra. Switch between the two in the [live demo](#how-to-plot-a-spectrum-in-javascript-react-or-angular) to see the same data both ways.

## Raman spectroscopy

**Raman spectroscopy** shines a single-wavelength laser on a sample and measures the light it scatters. Almost all scattered light leaves at the laser's wavelength, but a tiny fraction, of the order of one photon in a million or fewer, gives up some energy to a molecular vibration and comes back at a slightly longer wavelength. The difference, written as a wavenumber, is the **Raman shift**:

$$
\Delta\tilde{\nu} = \frac{10^7}{\lambda_\text{laser}} - \frac{10^7}{\lambda_\text{scattered}} \quad (\text{cm}^{-1},\ \lambda \text{ in nm})
$$

A Raman spectrum plots scattered intensity against Raman shift, usually from about 200 to 3500 cm⁻¹ and normally left to right in increasing shift. Because it is a shift, the same band sits at the same position whichever laser you use.

### A worked example: the same band with two lasers

Take a band at a Raman shift of 1000 cm⁻¹.

| Laser | Laser wavenumber | Scattered wavenumber | Scattered wavelength |
| --- | --- | --- | --- |
| 532 nm (green) | 18,797 cm⁻¹ | 17,797 cm⁻¹ | 561.9 nm |
| 785 nm (near-infrared) | 12,739 cm⁻¹ | 11,739 cm⁻¹ | 851.9 nm |

The spectrum reads 1000 cm⁻¹ either way, but the detector sees light at very different wavelengths. Scattering strength rises with the fourth power of the light's frequency, so the 532 nm laser gives roughly $(785/532)^4 \approx 4.7$ times more Raman signal. The longer wavelength is often chosen anyway, because it excites far less fluorescence.

### Fluorescence background

Fluorescence is Raman's biggest practical problem. Many samples, especially biological ones, fluoresce when hit by a visible laser, and the fluorescence can be far stronger than the Raman signal. It shows up as a broad, smooth hump under the sharp Raman bands. Analysts reduce it with a longer laser wavelength (785 or 1064 nm), by bleaching the sample with the laser before measuring, and in software, by fitting and subtracting a smooth baseline. In the demo's Raman mode, untick Correct baseline and turn up Baseline drift to see a fluorescence hump under the bands.

### IR vs Raman: complementary techniques

IR sees vibrations that change a molecule's dipole moment; Raman sees vibrations that change its polarisability, how easily its electron cloud is distorted. Polar bonds give strong IR bands; symmetric, non-polar bonds such as C=C, C–C, S–S and the rings of aromatic compounds give strong Raman bands. In molecules with a centre of symmetry, the two are mutually exclusive: carbon dioxide's symmetric stretch is Raman-active but invisible in the IR, while its asymmetric stretch near 2349 cm⁻¹ is IR-active and absent from the Raman spectrum.

Compare the three compounds in the demo between IR and Raman. Acetone's C=O band dominates its IR spectrum near 1715 cm⁻¹, but in Raman its strongest band is the C–C stretch near 787 cm⁻¹. Ethanol's O–H band is broad and strong in IR and barely visible in Raman.

Water absorbs infrared light strongly, around 3400 and 1640 cm⁻¹, but is a weak Raman scatterer, so Raman suits watery samples such as cells and tissue. Glass is fairly transparent to visible and near-infrared lasers, so Raman can measure through a vial or a blister pack.

## UV-Vis spectroscopy

**UV-Vis spectroscopy** measures the absorbance of ultraviolet and visible light, usually from about 190 to 800 nm. Light in this range has enough energy to move electrons into higher orbitals, so it is absorbed by double bonds, conjugated systems, aromatic rings and metal complexes. A UV-Vis spectrum is an absorbance spectrum: absorbance against wavelength, with wavelength increasing from left to right.

The bands are broad and few, so a UV-Vis spectrum says less about structure than IR or Raman. Its strengths are speed, sensitivity and quantitation. The wavelength of maximum absorbance, **λmax**, is where a measurement is most sensitive and least affected by small wavelength errors. Coloured compounds absorb the complementary colour: a solution that absorbs near 520 nm (green) looks purple-red.

UV-Vis is routine in life-science labs. Nucleic acids absorb strongly near 260 nm, proteins near 280 nm (from their tryptophan and tyrosine side chains), and many enzyme assays follow the coenzyme NADH, which absorbs at 340 nm while its oxidised form NAD⁺ doesn't.

### The Beer–Lambert law: a worked example

The **Beer–Lambert law** links absorbance to concentration:

$$
A = \varepsilon\, l\, c
$$

where $\varepsilon$ is the molar absorptivity (how strongly the compound absorbs at that wavelength, in L mol⁻¹ cm⁻¹), $l$ is the path length through the sample (usually a 1 cm cuvette) and $c$ is the concentration in mol/L.

NADH has a molar absorptivity at 340 nm of 6,220 L mol⁻¹ cm⁻¹.

- A 0.10 mM solution ($1.0 \times 10^{-4}$ mol/L) in a 1 cm cuvette reads $A = 6220 \times 1 \times 1.0 \times 10^{-4} = 0.622$, so about 24% of the light gets through.
- Going the other way, a sample reading $A_{340} = 0.50$ contains $c = A / (\varepsilon l) = 0.50 / 6220 = 8.0 \times 10^{-5}$ mol/L, or 80 µM.
- In a dehydrogenase assay, a fall in $A_{340}$ of 0.311 over a minute means 50 µM of NADH was oxidised in that minute.

The law holds best at low absorbance. Above an absorbance of about 1.5 to 2, so little light gets through that stray light inside the instrument becomes a large part of what the detector sees, and the reading falls below the true value. High concentrations can also change the absorbing molecules themselves, through association or changes in refractive index. Dilute strongly absorbing samples rather than trusting a reading of 3. Slide Concentration in the demo's UV-Vis mode past 0.25 mM to watch the 340 nm reading bend away from the Beer–Lambert line.

## IR vs Raman vs UV-Vis vs NMR

IR and Raman both probe molecular vibrations, UV-Vis probes electronic transitions, and NMR probes atomic nuclei, so each answers a different question about a sample.

| | IR | Raman | UV-Vis | NMR |
| --- | --- | --- | --- | --- |
| What it measures | Absorption by vibrations that change the dipole | Scattering by vibrations that change the polarisability | Absorption by electronic transitions | Absorption of radio waves by atomic nuclei in a magnetic field |
| x-axis | Wavenumber, 4000 → 400 cm⁻¹ (reversed) | Raman shift, about 200 → 3500 cm⁻¹ | Wavelength, about 190 → 800 nm | Chemical shift in ppm, reversed (about 12 → 0 for ¹H) |
| y-axis | %T or absorbance | Intensity (counts) | Absorbance | Intensity |
| Best for | Functional groups; identifying compounds by fingerprint | Watery samples, measuring through glass, symmetric bonds, carbon materials | Concentration, conjugated and coloured compounds, nucleic acids and proteins | Full molecular structure: which atoms connect to which |
| Main limits | Water absorbs strongly; sample contact for ATR | Weak signal; fluorescence background | Broad bands with little structural detail | Expensive instruments; needs more sample |

An **NMR spectrum** (nuclear magnetic resonance) also runs from right to left, like IR: chemical shift in parts per million increases leftwards, from the reference compound at 0 ppm. Each peak is a set of equivalent nuclei, its splitting shows the neighbouring nuclei, and in a ¹H spectrum the area under each peak is proportional to the number of hydrogens it represents.

## Processing a spectrum

A spectrum from an instrument is rarely ready to read. Four steps are common, in this order:

1. Baseline correction. Remove the slow background under the bands: scattering in IR and UV-Vis, fluorescence in Raman, a drifting lamp or detector. The usual methods fit a smooth curve to the points between the bands: an iterated polynomial that is pushed down under the bands, an asymmetric least-squares curve, or a "rubber band" stretched under the spectrum. For turbid UV-Vis samples, scattering rises steeply towards short wavelengths, roughly as $1/\lambda^4$, and can be fitted in a region where the sample doesn't absorb.
2. Smoothing. Reduce noise without blunting the bands. The **Savitzky–Golay filter** fits a short polynomial in a moving window, and keeps peak heights and positions better than a moving average of the same width. It is a [low-pass filter](/learn/applications/signal-processing/low-pass-filter/), so a window wider than the narrowest band widens it and lowers its peak. See [signal-to-noise ratio](/learn/applications/signal-processing/signal-to-noise-ratio/) for how to measure the noise you are removing.
3. Peak picking. Find band positions automatically: local maxima that stand out from their surroundings by a minimum prominence, or zero crossings of the first derivative. Second-derivative spectra help separate overlapping bands.
4. Normalisation. Put spectra on the same scale before comparing them: divide by the largest band, by the total area, or by an internal standard band that shouldn't change. Standard normal variate (SNV) scaling is common before chemometrics such as principal component analysis.

Each step can change the answer. A polynomial baseline that is too flexible eats broad bands such as an O–H stretch. Heavy smoothing merges close bands. Record the settings, and apply the same ones to every spectrum you compare.

## Hyperspectral imaging

A **hyperspectral image** stores a whole spectrum at every pixel, so the data is a cube: two spatial dimensions and one spectral dimension. Raman and IR microscopes build one by scanning a sample point by point, and hyperspectral cameras record hundreds of narrow wavelength bands at once. To show it, software picks a band, measures its height or area at every pixel, and draws the result as a [heatmap](/learn/chart-types/cartesian/heatmap/): a map of where one chemical is in a tablet, a tissue section or a leaf. Clicking a pixel then shows its full spectrum as a line chart beside the map. A single map of 500 × 500 pixels with 1,000 spectral points each holds 250 million values.

## Common spectroscopy mistakes

Most spectroscopy mistakes come from the axes, the baseline or over-reading the fingerprint region.

- **Reading or averaging %T as if it were linear.** Twice the concentration doesn't halve the transmittance. Convert to absorbance before measuring band heights, subtracting spectra or averaging.
- **Comparing spectra drawn on opposite axes.** One IR spectrum plotted 4000 → 400 and another plotted 400 → 4000 look like different compounds. Check the axis direction and units before matching patterns.
- **Trying to assign every band.** Bands below 1500 cm⁻¹ come from coupled vibrations of the whole molecule. Use the functional-group region to propose a structure, and the fingerprint only to confirm it against a reference.
- **Mistaking the atmosphere for the sample.** Bands from carbon dioxide near 2350 cm⁻¹ and sharp water-vapour lines around 1400 to 1900 and 3500 to 3900 cm⁻¹ come from a background scan taken under different conditions.
- **Measuring at too high an absorbance.** Readings above about 1.5 to 2 bend away from Beer–Lambert. Dilute, or use a shorter path length.
- **Over-correcting the baseline.** A flexible baseline fitted under a broad band removes part of the band, and every number measured from it.
- **Over-smoothing.** A wide smoothing window makes a noisy spectrum look clean while it merges neighbouring bands and lowers sharp ones.
- **Normalising before correcting the baseline.** A background left in place distorts the normalisation factor, so the spectra won't line up.
- **Not calibrating the Raman shift axis.** Small errors in the laser wavelength move every band. Check the axis with a reference material of known shifts, as ASTM E1840 describes.

## How to plot a spectrum in JavaScript, React or Angular

Spectrometers produce thousands of points per spectrum, and a hyperspectral map or a reaction monitored every second produces thousands of spectra. The demo below simulates IR, Raman and UV-Vis spectra from typical band positions, 3,601 points from 4000 to 400 cm⁻¹ for IR, and reruns the baseline correction, smoothing and peak picking in plain JavaScript every time you change a setting.

Choose a **Technique** and a **Compound**: an alcohol, a ketone and a carboxylic acid for IR and Raman, or the coenzyme NADH and NAD⁺ for UV-Vis. **IR y-axis** switches between transmittance and absorbance. **Concentration** sets the UV-Vis sample and shows the Beer–Lambert reading. **Baseline drift** adds a background (scattering in IR and UV-Vis, fluorescence in Raman), and **Correct baseline** subtracts the estimated one; untick it to see the raw spectrum with the estimate as a dashed line. **Noise** and **Smoothing** let you compare Savitzky–Golay windows, and **Peak labels** shows the picked peaks with their assignments. Zoom with the mouse wheel to inspect a shoulder on a band, drag to pan, double-click to reset, and hover to read the wavenumber or wavelength and intensity.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="spectrum chart" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. Smoothing, baseline correction and peak picking are plain JavaScript; SciChart.js draws the spectrum, flips the axis for IR and labels the peaks with annotations.

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
        // IR convention: wavenumber falls from left to right
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Wavenumber (cm⁻¹)",
                flippedCoordinates: true,
                visibleRange: new NumberRange(400, 4000)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Absorbance",
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.05, 0.15)
            })
        );

        // Your spectrum, and the peaks you picked: position, height and assignment
        const { wavenumbers, absorbance } = getYourSpectrumData();
        const peaks = getYourPeaks();

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: wavenumbers, yValues: absorbance }),
                stroke: "#50C7E0",
                strokeThickness: 1.5
            })
        );
        for (const peak of peaks) {
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    x1: peak.position,
                    y1: peak.height,
                    text: `${peak.position.toFixed(0)} ${peak.label}`,
                    textColor: "#FFFFFF",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                    yCoordShift: -6
                })
            );
        }
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const SpectrumChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
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
        selector: "app-spectrum-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class SpectrumChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            // IR convention: wavenumber falls from left to right
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Wavenumber (cm⁻¹)",
                    flippedCoordinates: true,
                    visibleRange: new NumberRange(400, 4000)
                })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Absorbance",
                    autoRange: EAutoRange.Always,
                    growBy: new NumberRange(0.05, 0.15)
                })
            );

            // Your spectrum, and the peaks you picked: position, height and assignment
            const { wavenumbers, absorbance } = getYourSpectrumData();
            const peaks = getYourPeaks();

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: wavenumbers, yValues: absorbance }),
                    stroke: "#50C7E0",
                    strokeThickness: 1.5
                })
            );
            for (const peak of peaks) {
                sciChartSurface.annotations.add(
                    new TextAnnotation({
                        x1: peak.position,
                        y1: peak.height,
                        text: `${peak.position.toFixed(0)} ${peak.label}`,
                        textColor: "#FFFFFF",
                        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                        yCoordShift: -6
                    })
                );
            }
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

- The spectrum is a `FastLineRenderableSeries` over an `XyDataSeries`. For IR, `flippedCoordinates: true` on the x-axis makes wavenumber fall from left to right; Raman and UV-Vis keep the normal direction.
- Transmittance is computed from absorbance as $\%T = 100 \times 10^{-A}$ before the data is appended, so one processing pipeline serves both views. The y-axis uses `EAutoRange.Always` to rescale as the data changes.
- Peak labels are `TextAnnotation`s anchored above a peak in absorbance and below it in transmittance; the fingerprint region is a `BoxAnnotation` in relative y coordinates, so it always fills the chart's height.
- The baseline is an iterated polynomial (degree 2 for IR, 5 for Raman) that is lowered under the bands at each pass, or a $1/\lambda^4$ scattering curve fitted above 420 nm for UV-Vis. Smoothing is a quadratic Savitzky–Golay filter.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart), and for labelled peaks, [JavaScript chart annotations](https://www.scichart.com/demo/javascript/chart-annotations) · [React chart annotations](https://www.scichart.com/demo/react/chart-annotations) · [Angular chart annotations](https://www.scichart.com/demo/angular/chart-annotations). For maps built from spectra, see the [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [text annotation documentation](/2d-charts/annotations-api/text-annotation/) and the [box annotation documentation](/2d-charts/annotations-api/box-annotation/). For a related lab trace, see the [chromatogram guide](/learn/applications/chromatogram/). For how laboratories use SciChart in instrument and analysis software, see [SciChart for diagnostics and life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/).

## Frequently asked questions

### What is the difference between IR and Raman spectroscopy?

Both measure molecular vibrations, but in different ways. IR spectroscopy measures the infrared light a sample absorbs, and sees vibrations that change the molecule's dipole moment, such as O–H and C=O stretches. Raman spectroscopy shines a laser on the sample and measures the small shift in energy of the scattered light, and sees vibrations that change how easily the electron cloud is distorted, such as C=C, C–C and S–S stretches. Water absorbs strongly in the IR but scatters weakly in Raman, so Raman suits watery samples.

### Why does an IR spectrum go from 4000 to 400 cm⁻¹?

By convention, IR spectra are plotted with wavenumber falling from left to right, from 4000 cm⁻¹ down to about 400 cm⁻¹, the mid-infrared range most instruments cover. Wavenumber is the number of waves per centimetre, so it rises with energy: the left side holds the high-energy stretches of light atoms (O–H, N–H, C–H) and the right side the lower-energy bends and skeletal vibrations.

### What is the fingerprint region of an IR spectrum?

The fingerprint region is the part of an IR spectrum below about 1500 cm⁻¹. It holds many overlapping bands from bending and whole-skeleton vibrations, so individual bands are hard to assign, but the overall pattern is unique to each compound. Matching it against a reference spectrum is how IR confirms a compound's identity.

### What does a UV-Vis spectrum tell you?

A UV-Vis spectrum shows how much ultraviolet and visible light a sample absorbs at each wavelength, usually from about 190 to 800 nm. The wavelength of the highest band (λmax) points to the kind of light-absorbing group present, and the absorbance at that wavelength gives the concentration through the Beer–Lambert law, A = εlc. It is mostly used to measure how much of a known compound is present.

### What is the difference between absorbance and transmittance?

Transmittance is the fraction of light that passes through the sample, often given as a percentage. Absorbance is the negative base-10 logarithm of transmittance, A = −log10(T), so 10% transmittance is an absorbance of 1 and 1% is an absorbance of 2. Absorbance is proportional to concentration; transmittance is not, which is why quantitative work uses absorbance.

### How do I plot a spectrum in JavaScript?

Load the spectrum as two arrays, the x-axis values (wavenumber, Raman shift or wavelength) and the intensities, into a line series. For IR, flip the x-axis so wavenumber falls from left to right, and label peaks with text annotations. Add zoom, pan and a cursor so readers can inspect small bands. SciChart.js does this with FastLineRenderableSeries, a NumericAxis with flippedCoordinates and TextAnnotation, in plain JavaScript, React or Angular.

## Sources

- Harvey, D., *Analytical Chemistry 2.1*, LibreTexts: [Spectroscopic methods](https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Analytical_Chemistry_2.1_(Harvey)/10%3A_Spectroscopic_Methods), including absorbance, transmittance, the Beer–Lambert law and its limits (stray light), and IR, UV-Vis and Raman instruments.
- LibreTexts, [Infrared spectroscopy absorption table](https://chem.libretexts.org/Ancillary_Materials/Reference/Reference_Tables/Spectroscopic_Reference_Tables/Infrared_Spectroscopy_Absorption_Table). Functional group ranges used in the IR table.
- Pavia, D. L., Lampman, G. M., Kriz, G. S. and Vyvyan, J. R. (2015), *Introduction to Spectroscopy*, 5th edition, Cengage. Reading IR spectra, conjugation shifts, UV-Vis and NMR.
- Smith, E. and Dent, G. (2019), *Modern Raman Spectroscopy: A Practical Approach*, 2nd edition, Wiley. Raman shift, laser choice, fluorescence and IR–Raman selection rules.
- National Institute of Standards and Technology, [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/). Reference IR and UV-Vis spectra for comparing fingerprints.
- IUPAC Compendium of Chemical Terminology (the Gold Book), [absorbance](https://goldbook.iupac.org/terms/view/A00028).
- Horecker, B. L. and Kornberg, A. (1948), The extinction coefficients of the reduced band of pyridine nucleotides. *Journal of Biological Chemistry*, 175, 385–390. The molar absorptivity of NADH at 340 nm, 6.22 × 10³ L mol⁻¹ cm⁻¹.
- Savitzky, A. and Golay, M. J. E. (1964), [Smoothing and differentiation of data by simplified least squares procedures](https://doi.org/10.1021/ac60214a047). *Analytical Chemistry*, 36(8).
- Lieber, C. A. and Mahadevan-Jansen, A. (2003), [Automated method for subtraction of fluorescence from biological Raman spectra](https://doi.org/10.1366/000370203322554518). *Applied Spectroscopy*, 57(11). The iterated polynomial baseline used in the demo.
- ASTM E1840-96 (reapproved 2022), *Standard Guide for Raman Shift Standards for Spectrometer Calibration*, ASTM International.

<LearnCta position="bottom" chart="spectrum chart" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
