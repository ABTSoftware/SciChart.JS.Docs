---
sidebar_position: 60
sidebar_label: HR Diagram
title: "Hertzsprung–Russell (HR) Diagram: How to Read It, With an Example"
description: "What a Hertzsprung–Russell diagram plots, why temperature runs backwards, the main sequence, giants and white dwarfs, spectral classes, cluster ages from the turn-off, and a live HR diagram."
keywords:
    [
        "hr diagram",
        "hertzsprung russell diagram",
        "h-r diagram",
        "what is an hr diagram",
        "how to read an hr diagram",
        "hr diagram main sequence",
        "hr diagram labeled",
        "hr diagram spectral classes",
        "color magnitude diagram",
        "colour-magnitude diagram",
        "hr diagram turn off point",
        "hr diagram star life cycle"
    ]
image: /img/learn/hr-diagram-og.png
related: [scatter-plot, heatmap, bubble-chart, density-plot, log-scale-graph]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does an HR diagram show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An HR diagram shows how bright stars really are against how hot their surfaces are. Each star is one point: luminosity or absolute magnitude on the vertical axis, and surface temperature, colour index or spectral class on the horizontal axis. Stars fall into groups rather than scattering at random, and each group is a stage of a star's life: the main sequence, giants, supergiants and white dwarfs." }
                },
                {
                    "@type": "Question",
                    "name": "Why does temperature decrease to the right on an HR diagram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The first HR diagrams plotted spectral class, and the classes were ordered O, B, A, F, G, K, M from left to right. That order turned out to run from hottest to coolest, so when temperature replaced spectral class the axis kept the same direction. Hot blue stars sit on the left and cool red stars on the right." }
                },
                {
                    "@type": "Question",
                    "name": "Where is the Sun on the HR diagram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Sun is on the main sequence, near its middle: a surface temperature of 5,772 K and a luminosity of 1 in solar units, by definition. On the observer's version it has a colour index B-V of about 0.65 and an absolute visual magnitude of 4.83. Its spectral type is G2V, where V means a main-sequence star." }
                },
                {
                    "@type": "Question",
                    "name": "What is the main sequence on an HR diagram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The main sequence is the diagonal band from hot, bright stars at the top left to cool, dim stars at the bottom right. Its stars fuse hydrogen into helium in their cores, the longest stage of a star's life, so most stars are found there. A star's place along the band is set mainly by its mass: the most massive are at the top left." }
                },
                {
                    "@type": "Question",
                    "name": "How do you find the age of a star cluster from its HR diagram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Find the turn-off, the point where the cluster's main sequence stops and bends towards the giants. All the stars formed at about the same time, and the most massive ones leave the main sequence first. The mass of the stars at the turn-off gives the age: a main-sequence lifetime of roughly 10 billion years times mass to the power of minus 2.5, with mass in solar masses. Astronomers fit model isochrones for a precise age." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot an HR diagram in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Put the stars in a scatter series with temperature on the x-axis and luminosity on the y-axis, both on logarithmic axes, and flip the x-axis so temperature falls from left to right. Colour each point by temperature with a per-point palette, and add zoom, pan and a hover readout. For hundreds of thousands of stars, use a charting library that draws with WebGL and WebGPU, such as SciChart.js, or show the density as a heatmap." }
                }
            ]
        })}
    </script>
</head>

# Hertzsprung–Russell (HR) Diagram

## What is an HR diagram?

A **Hertzsprung–Russell diagram** (HR diagram, or H-R diagram) is a scatter plot of stars: each star's luminosity, or absolute magnitude, against its surface temperature, colour index or spectral class. Temperature runs backwards, with the hottest stars on the left, and luminosity is on a log scale. Most stars fall on one diagonal band, the main sequence.

![An HR diagram of 9,000 simulated stars on a dark navy background, coloured from blue for the hottest to orange-red for the coolest. Surface temperature runs from 40,000 K on the left to 2,500 K on the right, and luminosity from 0.0001 to a million times the Sun's on a log scale. A diagonal main sequence, a giant branch rising to the upper right, a scatter of supergiants along the top and a white dwarf sequence at the lower left are labelled, with the Sun marked and the spectral classes O to M along the top](/img/learn/hr-diagram-og.png)

*An HR diagram of 9,000 simulated stars, coloured by temperature, with the main regions and spectral classes labelled. [Try the interactive version](#how-to-plot-an-hr-diagram-in-javascript-react-or-angular).*

:::tip Key takeaways
- Up means more luminous; left means hotter. Both axes are usually logarithmic.
- The main sequence is where stars spend most of their lives, fusing hydrogen in their cores. Mass sets a star's place along it.
- Giants and supergiants sit above it to the right (cool but huge); white dwarfs sit below it to the left (hot but tiny).
- In a star cluster, the point where the main sequence ends, the turn-off, tells you the cluster's age.
- A colour-magnitude diagram is the same chart built from measured colour and absolute magnitude instead of temperature and luminosity.
:::

The diagram is named after Ejnar Hertzsprung, who compared the brightness and colour of stars in 1911, and Henry Norris Russell, who plotted their luminosity against spectral class in 1913. Each found, independently, that stars don't scatter at random: a star's temperature and its power output are linked, and the few groups they form are stages of a star's life.

## The axes of an HR diagram

An HR diagram is drawn in two equivalent ways, from theory or from measurements, and the axis labels tell you which one you're looking at.

| | Theorist's HR diagram | Observer's HR diagram (colour-magnitude diagram) |
| --- | --- | --- |
| Horizontal axis | Surface (effective) temperature in kelvin, log scale, hotter to the left | Colour index, such as B-V or Gaia's BP-RP; bluer (hotter) to the left |
| Vertical axis | Luminosity in solar units ($L_\odot$), log scale | Absolute magnitude, such as $M_V$; brighter is up, so the numbers fall upwards |
| Comes from | Models, or measurements converted to physical units | Two brightness measurements and a distance |
| Used for | Stellar evolution tracks, comparing with theory | Star clusters, survey data, Gaia and Hipparcos plots |

Older diagrams, and many school versions, use spectral class (O, B, A, F, G, K, M) across the bottom instead of temperature. All three run hot to cool from left to right.

### Why is temperature backwards on an HR diagram?

The first diagrams plotted spectral class, written in the order O, B, A, F, G, K, M. That order was later found to run from hottest to coolest, and the axis kept its direction when temperature replaced class. The colour index axis goes the same way naturally: a small or negative B-V means a blue, hot star, and it sits at the left.

### Why are the axes logarithmic?

The brightest stars put out about a million times the Sun's power, and the faintest white dwarfs less than a ten-thousandth of it: more than ten powers of ten. On a linear axis every star except the brightest few would sit squashed against zero. A log scale gives each power of ten the same height, so a white dwarf and a supergiant fit on one chart (see [log scale graph](/learn/axes-and-scales/log-scale-graph/)). Temperature spans less, about 2,500 K to 50,000 K, but it is logged too, so equal distances mean equal ratios.

### Absolute magnitude and colour index

**Absolute magnitude** ($M$) is how bright a star would look from a standard distance of 10 parsecs (32.6 light years). It is worked out from the **apparent magnitude** ($m$), how bright the star looks from Earth, and its distance $d$:

$$
M = m - 5\log_{10}\left(\frac{d}{10\ \text{pc}}\right)
$$

ignoring the dimming by interstellar dust. The magnitude scale runs backwards and is logarithmic: 5 magnitudes is a factor of 100 in brightness, and a smaller number is a brighter star. That's why the magnitude axis has its most negative values at the top.

A **colour index** is the difference between a star's magnitudes through two filters. B-V uses a blue (B) and a visual, yellow-green (V) filter. A hot star is brighter in blue, so its B-V is small or negative; a cool red star has a B-V of 1.5 or more. It stands in for temperature, and a telescope can measure it directly.

## Regions of the HR diagram

Stars on the HR diagram fall into five main regions, the main sequence, subgiants, red giants, supergiants and white dwarfs, and each marks a different stage of a star's life.

![A labelled HR diagram: surface temperature from 40,000 K on the left to 2,500 K on the right, luminosity from 0.0001 to a million Suns on a log scale. Coloured bands at the top mark spectral classes O, B, A, F, G, K and M. A blue diagonal band is the main sequence, labelled hydrogen burning in the core, with the Sun on it at 5,772 K and luminosity 1. An orange area above it on the right is the giants, with subgiants between them, a purple band across the top is the supergiants, and a grey area at the lower left is the white dwarfs. Dashed lines mark stars of 0.01, 1 and 100 times the Sun's radius](./hr-diagram-regions.svg)

| Region | Where on the diagram | Typical temperature | Typical luminosity (Sun = 1) | What the stars are doing |
| --- | --- | --- | --- | --- |
| Main sequence | Diagonal band, top left to bottom right | About 2,500 K to over 40,000 K | About 0.001 to 1,000,000 | Fusing hydrogen into helium in the core |
| Subgiants | Just above the main sequence, between it and the giants | About 5,000 K to 6,500 K | About 2 to 10 | Core hydrogen used up; the star starts to swell |
| Red giants | Upper right | About 3,500 K to 5,200 K | About 10 to 3,000 | Hydrogen burning in a shell round a helium core, or helium burning in the core (the red clump) |
| Supergiants | Across the top | Any, from red (3,500 K) to blue (30,000 K) | About 10,000 to 1,000,000 | Massive stars in their late stages |
| White dwarfs | Lower left | About 5,000 K to over 30,000 K | About 0.0001 to 0.1 | Burnt-out cores, about the size of the Earth, cooling |

Because a star's power depends on both its temperature and its size, every point also gives a radius. The Stefan-Boltzmann law in solar units is

$$
\frac{L}{L_\odot} = \left(\frac{R}{R_\odot}\right)^2 \left(\frac{T}{5772\ \text{K}}\right)^4
$$

so stars of equal radius lie on straight diagonal lines on a log-log HR diagram (the dashed lines above). Moving up at a fixed temperature means a bigger star; moving left at a fixed luminosity means a smaller, hotter one. Giants, cool and yet luminous, must therefore be enormous, and white dwarfs, hot and yet faint, must be tiny.

About 90% of the stars near the Sun are on the main sequence, according to the OpenStax *Astronomy* textbook. Red dwarfs are by far the most common. Giants are rare nearby, but they are so luminous that they are over-represented in any catalogue limited by brightness.

## Spectral classes: O B A F G K M

Astronomers sort stars by the absorption lines in their spectra, and the classes follow temperature. Each class is split into ten subclasses, 0 (hottest) to 9; the Sun is G2.

| Class | Colour | Approximate surface temperature | Strongest lines |
| --- | --- | --- | --- |
| O | Blue | Above 30,000 K | Ionised helium |
| B | Blue-white | 10,000 to 30,000 K | Neutral helium, hydrogen growing |
| A | White | 7,500 to 10,000 K | Hydrogen at its strongest |
| F | Yellow-white | 6,000 to 7,500 K | Hydrogen weaker, ionised calcium |
| G | Yellow | 5,200 to 6,000 K | Ionised calcium, metals |
| K | Orange | 3,700 to 5,200 K | Neutral metals |
| M | Red | 2,400 to 3,700 K | Molecules, mainly titanium oxide |

Below M come L, T and Y, mostly brown dwarfs, too small to sustain hydrogen fusion. A second label, the **luminosity class**, says which region a star is in: I for supergiants, II for bright giants, III for giants, IV for subgiants and V for main-sequence stars. The Sun's full type, G2V, reads as a yellow main-sequence star, a little cooler than the hottest G stars.

## How to read an HR diagram

Read an HR diagram by checking the axes first, then finding the main sequence and placing each star relative to it.

1. Read the axis labels. Is the horizontal axis temperature, colour index or spectral class? Is the vertical axis luminosity or absolute magnitude? Check which way each one runs: magnitude axes are brightest at the top, with the most negative numbers there.
2. Check the scales. On a log luminosity axis, each gridline is usually ten times the one below. On a magnitude axis, 5 magnitudes is a factor of 100.
3. Find the main sequence, the densest diagonal band. A star on it is in the hydrogen-burning stage, and its position along the band gives its mass: higher and further left means more massive.
4. Place the star you're interested in. Above the main sequence at the same temperature means larger and more evolved: a subgiant, giant or supergiant. Below and to the left means a white dwarf.
5. Read off its temperature and luminosity, and work out its radius from the Stefan-Boltzmann law if you need it.
6. For a star cluster, find where the main sequence ends at the top (the turn-off), and use it to estimate the age (see below).

### Worked example: the radius of a white dwarf

The white dwarf 40 Eridani B has a surface temperature of about 12,000 K and a luminosity of about 1/275 of the Sun's. On an HR diagram it sits well below the main sequence, at the left. Its radius is

$$
\frac{R}{R_\odot} = \sqrt{\frac{L}{L_\odot}}\left(\frac{5772\ \text{K}}{T}\right)^2 = \sqrt{0.00364}\times\left(\frac{5772}{12000}\right)^2 \approx 0.060 \times 0.231 \approx 0.014
$$

That is about 1.4% of the Sun's radius, or roughly 1.5 times the Earth's. By the same formula, a cool star at 3,600 K with 50,000 times the Sun's luminosity has a radius of about 570 Suns: a red supergiant that, in place of the Sun, would reach beyond the orbit of Mars.

## How a star moves across the HR diagram

A star stays at nearly the same spot on the main sequence for most of its life, then leaves it. The main stages for a star like the Sun are:

- Main sequence: hydrogen fuses into helium in the core. The star brightens slowly: the Sun roughly doubles in brightness over its main-sequence life of about 10 billion years.
- Subgiant and red giant: when the core runs out of hydrogen, fusion moves to a shell around it. The envelope swells and cools, and the star moves right and then up the red giant branch.
- Helium burning: helium ignites in the core and the star settles, for a time, into the red clump (for stars like the Sun) or a horizontal branch.
- White dwarf: the outer layers drift off as a planetary nebula, and the exposed core drops to the lower left and cools for billions of years.

Stars above about 8 solar masses run through the same stages far faster, cross the top of the diagram as supergiants, and end as supernovae, leaving neutron stars or black holes that don't appear on the diagram. Before the main sequence, young stars contract onto it from the right.

## Colour-magnitude diagrams of star clusters

A **colour-magnitude diagram** (CMD) is an HR diagram in observed units: colour index against magnitude. It is the standard way to plot a star cluster. All the cluster's stars are at about the same distance, so their apparent magnitudes can be compared directly, without knowing each star's distance; and they formed at about the same time from the same gas.

The massive stars use up their hydrogen first, so a cluster's main sequence is eaten away from the top as it ages. The point where the remaining main sequence bends off towards the giants is the **main-sequence turn-off**, and the lower it is, the older the cluster. A rough rule, from main-sequence lifetimes, gives the turn-off mass for an age:

$$
t_\text{MS} \approx 10\ \text{billion years} \times \left(\frac{M}{M_\odot}\right)^{-2.5}
$$

| Cluster age | Turn-off mass (rough rule) | Turn-off spectral type, roughly | What the CMD looks like |
| --- | --- | --- | --- |
| 10 million years | About 16 solar masses | Early B | Almost the whole main sequence, a few red supergiants |
| 100 million years | About 6 solar masses | Mid B | Upper main sequence gone, a handful of giants |
| 1 billion years | About 2.5 solar masses | Late B to early A | Turn-off near A stars, a clump of red giants |
| 5 billion years | About 1.3 solar masses | F | Turn-off just above the Sun, subgiant and giant branches |
| 10 billion years | About 1 solar mass | G | Turn-off at the Sun's position, as in globular clusters |

In practice astronomers fit **isochrones**, model curves for stars of one age and composition, to the whole CMD, and the turn-off is the part that fixes the age most tightly. Globular clusters come out at about 11 billion years or older. Distance shifts the whole diagram up or down, and dust makes stars both fainter and redder, so both are fitted at the same time.

## HR diagram vs colour-magnitude diagram vs spectral-class diagram

The theoretical HR diagram, the colour-magnitude diagram and the spectral-class diagram show the same pattern of stars with different quantities on the axes.

| Version | Axes | Choose it when |
| --- | --- | --- |
| Theoretical HR diagram | $\log T$ against $\log L/L_\odot$ | You're comparing with models or evolution tracks, or showing radius lines |
| Colour-magnitude diagram | Colour index against absolute or apparent magnitude | You're plotting survey or cluster photometry as measured |
| Spectral-class diagram | Spectral class against absolute magnitude or luminosity | You're teaching, or the stars were classified from spectra rather than photometry |
| Density HR diagram (heatmap) | Either of the above, coloured by star count per cell | You have hundreds of thousands of stars and the points overlap, as in Gaia plots |

Large surveys now use the CMD. ESA's Hipparcos satellite, launched in 1989, measured precise positions and parallaxes (distances) for 118,218 stars, giving the first HR diagram with accurate distances for a large sample. ESA's Gaia mission has since measured hundreds of millions, plotted as colour BP-RP against absolute magnitude $M_G$, and its HR diagram is thin enough to show features such as two separate white dwarf sequences.

## Common HR diagram mistakes

The commonest HR diagram mistakes come from its unusual axes: temperature that falls to the right and magnitudes that are smaller for brighter stars.

- **Reading the temperature axis as rising to the right.** Temperature falls from left to right, with the hottest stars on the left. Label the axis, or add an arrow, when you draw one.
- **Reading the magnitude scale the wrong way up.** On a magnitude axis smaller numbers are brighter, and the top of the axis carries the most negative values. A star at $M_V = -5$ is about 10,000 times more luminous than one at $M_V = +5$.
- **Mixing apparent and absolute magnitude.** Apparent magnitude depends on distance: the Sun's is -26.74, its absolute magnitude +4.83. Field stars at different distances only make an HR diagram after converting to absolute magnitude; a cluster CMD can use apparent magnitude because all its stars are at about the same distance.
- **Treating the main sequence as an evolutionary track.** Stars don't slide down it as they age. Their place on it is set by mass.
- **Ignoring dust.** Interstellar dust dims and reddens starlight, moving stars down and to the right. Correct for it before comparing a distant cluster with nearby stars.
- **Drawing it on linear axes.** Without log scales almost every star is crushed against the bottom.
- **Overplotting.** With tens of thousands of stars, points hide each other and the densest parts look no busier than the rest. Use smaller, semi-transparent points or a density heatmap.

## How to plot an HR diagram in JavaScript, React or Angular

Star catalogues are large: Gaia's holds over a billion sources, and even a cleaned sample for an HR diagram runs to hundreds of thousands of stars. The demo below plots 9,000 simulated field stars or an 8,000-star cluster, placed with textbook relations rather than taken from a real catalogue, and switches the same data between a scatter series and a density heatmap. For catalogue-sized data, the [one-million-point performance demo](https://www.scichart.com/demo/react/chart-performance-load-one-million-points) shows how SciChart.js handles a million points on your own device.

Use **Stars** to switch between stars near the Sun and a star cluster, then drag **Cluster age** from 10 million to over 12 billion years and watch the turn-off slide down the main sequence. **Axes** switches between temperature and luminosity and colour index and absolute magnitude, and **View** between points and a density heatmap. **Regions and classes** labels the regions and spectral classes, **Radius lines** draws stars of equal radius, and **The Sun** marks it. Hover over a star for its temperature, luminosity, colour, magnitude, radius and spectral type; scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="HR diagram" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter series documentation" />

Here is the code for this chart. The star simulation and unit conversions are plain JavaScript; SciChart.js draws the stars, the heatmap, the radius lines and the labels. The React and Angular versions show a plain HR diagram on logarithmic axes.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        LogarithmicAxis,
        NumberRange,
        ENumericFormat,
        EAxisAlignment,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MetadataPaletteProvider,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // Temperature on a log axis, flipped so the hottest stars are on the left
        sciChartSurface.xAxes.add(
            new LogarithmicAxis(wasmContext, {
                axisTitle: "Surface temperature (K)",
                logBase: 10,
                flippedCoordinates: true,
                visibleRange: new NumberRange(2500, 40000),
                labelFormat: ENumericFormat.SignificantFigures,
                labelPrecision: 2
            })
        );
        // Luminosity in solar units on a log axis
        sciChartSurface.yAxes.add(
            new LogarithmicAxis(wasmContext, {
                axisTitle: "Luminosity (Sun = 1)",
                axisAlignment: EAxisAlignment.Left,
                logBase: 10,
                visibleRange: new NumberRange(1e-4, 1e6),
                labelFormat: ENumericFormat.SignificantFigures,
                labelPrecision: 1
            })
        );

        // Your stars: temperature (K), luminosity (Sun = 1) and a colour for each, e.g. from its temperature
        const { temperatures, luminosities, colours } = getYourStarData();
        const metadata = colours.map((colour) => ({ isSelected: false, fill: colour, stroke: colour }));
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: temperatures, yValues: luminosities, metadata }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 4, height: 4, strokeThickness: 0 }),
                paletteProvider: new MetadataPaletteProvider() // each point takes its colour from its metadata
            })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const HrDiagram = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        LogarithmicAxis,
        NumberRange,
        ENumericFormat,
        EAxisAlignment,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MetadataPaletteProvider,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-hr-diagram",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class HrDiagramComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            // Temperature on a log axis, flipped so the hottest stars are on the left
            sciChartSurface.xAxes.add(
                new LogarithmicAxis(wasmContext, {
                    axisTitle: "Surface temperature (K)",
                    logBase: 10,
                    flippedCoordinates: true,
                    visibleRange: new NumberRange(2500, 40000),
                    labelFormat: ENumericFormat.SignificantFigures,
                    labelPrecision: 2
                })
            );
            // Luminosity in solar units on a log axis
            sciChartSurface.yAxes.add(
                new LogarithmicAxis(wasmContext, {
                    axisTitle: "Luminosity (Sun = 1)",
                    axisAlignment: EAxisAlignment.Left,
                    logBase: 10,
                    visibleRange: new NumberRange(1e-4, 1e6),
                    labelFormat: ENumericFormat.SignificantFigures,
                    labelPrecision: 1
                })
            );

            // Your stars: temperature (K), luminosity (Sun = 1) and a colour for each, e.g. from its temperature
            const { temperatures, luminosities, colours } = getYourStarData();
            const metadata = colours.map((colour) => ({ isSelected: false, fill: colour, stroke: colour }));
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: temperatures, yValues: luminosities, metadata }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 4, height: 4, strokeThickness: 0 }),
                    paletteProvider: new MetadataPaletteProvider() // each point takes its colour from its metadata
                })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The stars are one `XyScatterRenderableSeries`. A `MetadataPaletteProvider` colours each point from the `fill` and `stroke` in its metadata, here the approximate blackbody colour of the star's temperature.
- For a plain HR diagram, as in the React and Angular code, use two `LogarithmicAxis` objects and set `flippedCoordinates: true` on the temperature axis. The live demo plots log values on `NumericAxis` objects instead, with a custom tick provider and `labelProvider.formatLabel`, so it can switch the same axes to colour index and magnitude.
- Absolute magnitude gets smaller as stars get brighter, so the magnitude view flips the y-axis with `flippedCoordinates`.
- The density view counts stars on a grid and draws the counts with a `UniformHeatmapRenderableSeries` on the same axes. Radius lines are `FastLineRenderableSeries`, and labels are `TextAnnotation`s.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart); for density, [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart); and for very large point counts, [JavaScript chart with one million points](https://www.scichart.com/demo/javascript/chart-performance-load-one-million-points) · [React chart with one million points](https://www.scichart.com/demo/react/chart-performance-load-one-million-points) · [Angular chart with one million points](https://www.scichart.com/demo/angular/chart-performance-load-one-million-points).

**Go deeper:** [SciChart.js scatter series documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), the [uniform heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) and the guides to the [scatter plot](/learn/chart-types/cartesian/scatter-plot/) and [density plot](/learn/chart-types/cartesian/density-plot/). For how instrument makers and research teams use SciChart for scientific data, see [SciChart for instrumentation software](https://www.scichart.com/best-instrumentation-engineering-software/).

## Frequently asked questions

### What does an HR diagram show?

An HR diagram shows how bright stars really are against how hot their surfaces are. Each star is one point: luminosity or absolute magnitude on the vertical axis, and surface temperature, colour index or spectral class on the horizontal axis. Stars fall into groups rather than scattering at random, and each group is a stage of a star's life: the main sequence, giants, supergiants and white dwarfs.

### Why does temperature decrease to the right on an HR diagram?

The first HR diagrams plotted spectral class, and the classes were ordered O, B, A, F, G, K, M from left to right. That order turned out to run from hottest to coolest, so when temperature replaced spectral class the axis kept the same direction. Hot blue stars sit on the left and cool red stars on the right.

### Where is the Sun on the HR diagram?

The Sun is on the main sequence, near its middle: a surface temperature of 5,772 K and a luminosity of 1 in solar units, by definition. On the observer's version it has a colour index B-V of about 0.65 and an absolute visual magnitude of 4.83. Its spectral type is G2V, where V means a main-sequence star.

### What is the main sequence on an HR diagram?

The main sequence is the diagonal band from hot, bright stars at the top left to cool, dim stars at the bottom right. Its stars fuse hydrogen into helium in their cores, the longest stage of a star's life, so most stars are found there. A star's place along the band is set mainly by its mass: the most massive are at the top left.

### How do you find the age of a star cluster from its HR diagram?

Find the turn-off, the point where the cluster's main sequence stops and bends towards the giants. All the stars formed at about the same time, and the most massive ones leave the main sequence first. The mass of the stars at the turn-off gives the age: a main-sequence lifetime of roughly 10 billion years times mass to the power of minus 2.5, with mass in solar masses. Astronomers fit model isochrones for a precise age.

### How do I plot an HR diagram in JavaScript?

Put the stars in a scatter series with temperature on the x-axis and luminosity on the y-axis, both on logarithmic axes, and flip the x-axis so temperature falls from left to right. Colour each point by temperature with a per-point palette, and add zoom, pan and a hover readout. For hundreds of thousands of stars, use a charting library that draws with WebGL and WebGPU, such as SciChart.js, or show the density as a heatmap.

## Sources

- Fraknoi, A., Morrison, D. and Wolff, S. C., *Astronomy 2e*, OpenStax (2022, CC BY 4.0): [17.3 The spectra of stars (and brown dwarfs)](https://openstax.org/books/astronomy-2e/pages/17-3-the-spectra-of-stars-and-brown-dwarfs) for the spectral classes and temperatures; [18.4 The H–R diagram](https://openstax.org/books/astronomy-2e/pages/18-4-the-h-r-diagram) for its history, regions, the share of main-sequence stars and 40 Eridani B; [22.1 Evolution from the main sequence to red giants](https://openstax.org/books/astronomy-2e/pages/22-1-evolution-from-the-main-sequence-to-red-giants) and [22.3 Checking out the theory](https://openstax.org/books/astronomy-2e/pages/22-3-checking-out-the-theory) for stellar evolution and cluster turn-offs.
- NASA Goddard Space Flight Center, [Sun fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html): the Sun's effective temperature, luminosity, apparent and absolute visual magnitude and spectral type.
- International Astronomical Union (2015), [Resolution B3 on nominal solar values](https://arxiv.org/abs/1510.07674) (5,772 K, 3.828 × 10²⁶ W) and [Resolution B2 on the bolometric magnitude scale](https://arxiv.org/abs/1510.06262) (the Sun's absolute bolometric magnitude, 4.74).
- European Space Agency, [Hipparcos](https://www.cosmos.esa.int/web/hipparcos) (118,218 stars) and [Gaia Data Release 2 HR diagrams](https://www.cosmos.esa.int/web/gaia/gaiadr2_hrd); Gaia Collaboration, Babusiaux, C. et al. (2018), [Gaia Data Release 2: Observational Hertzsprung-Russell diagrams](https://doi.org/10.1051/0004-6361/201832843), *Astronomy & Astrophysics*, 616, A10.
- Pecaut, M. J. and Mamajek, E. E. (2013), [Intrinsic colors, temperatures, and bolometric corrections of pre-main-sequence stars](https://doi.org/10.1088/0067-0049/208/1/9), *Astrophysical Journal Supplement*, 208, 9, and its online table of main-sequence colours and temperatures: the colour-temperature relation in the demo. Torres, G. (2010), [On the use of empirical bolometric corrections for stars](https://doi.org/10.1088/0004-6256/140/5/1158), *Astronomical Journal*, 140, 1158: the bolometric corrections in the demo.

<LearnCta position="bottom" chart="HR diagram" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter series documentation" />
