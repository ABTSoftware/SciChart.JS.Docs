---
sidebar_position: 60
sidebar_label: Ternary Plot
title: "Ternary Plot: What It Is & How to Read It (With Interactive Examples)"
description: "What a ternary plot is, how to read its three scales step by step, where ternary diagrams are used (soil texture, geology, phase diagrams) and the mistakes to avoid. With a live, interactive example."
keywords:
    [
        "ternary plot",
        "ternary diagram",
        "ternary graph",
        "how to read a ternary plot",
        "ternary phase diagram",
        "soil texture triangle",
        "what is a ternary plot",
        "ternary plot vs stacked bar chart"
    ]
image: /img/learn/ternary-plot-og.png
related: [scatter-plot, cartesian-graph, parallel-coordinates-plot]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a ternary plot used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A ternary plot is used to compare mixtures made of three parts. Soil scientists use it to name soil textures from their sand, silt and clay content; geologists to classify rocks by three minerals; chemists and metallurgists to map which phases form in three-component mixtures and alloys. It also works for any three shares of a whole, such as a three-way vote or how a team splits its time." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a ternary plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Read each component separately. Find its corner, where it is 100%, and the opposite side, where it is 0%. From the point, follow the gridline that runs parallel to that opposite side until it meets the scale for that component, and read the value. Do the same for the other two components, then check that the three values add up to 100%." }
                },
                {
                    "@type": "Question",
                    "name": "Why do the values on a ternary plot add up to 100%?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A ternary plot shows proportions, not amounts. Each point is a mixture whose three parts are scaled so they add up to a fixed total, usually 100% or 1. Because the third value always follows from the other two, three values fit on a flat triangle. If your values don't add up to the total, divide each by their sum before plotting." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a ternary plot and a ternary phase diagram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A ternary plot is the general chart: any data with three parts that add up to a total, plotted in a triangle. A ternary phase diagram is one use of it in chemistry and materials science. It divides the triangle into regions that show which phases (solid, liquid, or several solids) exist at each composition, usually at one fixed temperature and pressure." }
                },
                {
                    "@type": "Question",
                    "name": "Can a ternary plot show more than three components?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Not directly. A ternary plot has exactly three corners. With four or more components, either group them into three (for example, quartz, feldspar and all other rock fragments), plot three of them after removing the rest and rescaling to 100%, or use a different chart, such as a stacked bar chart." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a ternary plot in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Convert each point's three values to x and y: divide each value by the sum, then x is the right-hand component plus half the top component, and y is the top component times the square root of 3 divided by 2. Plot those points as a scatter series, and draw the triangle, gridlines and tick labels yourself. With SciChart.js you can do this with line segment series, text annotations, a scatter series, and triangle series to shade regions. The same code works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Ternary Plot

## What is a ternary plot?

A **ternary plot** (also called a ternary diagram, ternary graph or triangle plot) shows mixtures of three parts that add up to a constant, usually 100%. Each corner of an equilateral triangle stands for 100% of one part, and each point's position shows its share of all three at once.

![A ternary plot of 40 soil samples on the USDA soil texture triangle: clay rises to the top corner, sand to the bottom-left and silt to the bottom-right, with the 12 soil texture classes shaded and labelled, and the samples clustered in sandy loam, silt loam and the clay classes](/img/learn/ternary-plot-og.png)

*A ternary plot of 40 soil samples from three imaginary fields, on the USDA soil texture triangle (sample data). [Try the interactive version](#how-to-create-a-ternary-plot-in-javascript-react-or-angular).*

:::tip Key takeaways
- A ternary plot shows **three proportions that add up to 100%** as one point in a triangle.
- **Each corner is 100% of one component; the side opposite it is 0%.**
- To read a value, **follow the gridline parallel to the side opposite that component's corner** to its scale. The three readings must add up to 100%.
- Classic uses: **soil texture, rock classification, and phase diagrams** in chemistry and metallurgy.
- Only use one when the parts **really add up to a fixed whole**, and show which way each scale runs.
:::

## How to read a ternary plot

![How to read point P on a ternary plot with sand at the bottom-left corner, silt at the bottom-right and clay at the top: a horizontal line from P to the left side reads 30% clay, a line parallel to the left side up to the right side reads 20% silt, and a line parallel to the right side down to the base reads 50% sand, which add up to 100](./ternary-plot-reading.svg)

1. **Find the three corners.** Each is labelled with one component and stands for 100% of it. In the diagram, the top is 100% clay, the bottom-left 100% sand and the bottom-right 100% silt.
2. **Find each component's zero.** A component is 0% along the whole side opposite its corner. Clay is 0% along the base, so the closer a point is to the base, the less clay it has.
3. **Use that component's gridlines.** Its gridlines all run **parallel to its zero side**. Clay's gridlines are horizontal, because clay's zero side is the base.
4. **Follow the gridline from the point to the scale.** Each side carries the scale for one component. Point P sits on the 30% clay line, the 20% silt line and the 50% sand line.
5. **Check the total.** 30 + 20 + 50 = 100. If your three readings don't add up to 100, you have read at least one of them along the wrong set of lines.

**The usual confusion: which gridlines belong to which scale?** Three sets of gridlines cross at every point, and each side has numbers on it, so it is easy to follow a line to the wrong side. Two checks help:

- **Look at the tick marks.** On a well-drawn ternary plot, each tick sticks out of the triangle at the same angle as the gridline it belongs to. Follow the tick inwards and you are on the right line.
- **Look at the direction of the numbers.** Each scale reaches 100 at its own corner. If the numbers increase towards the wrong corner, you are reading the wrong scale.

Some diagrams number the scales running clockwise round the triangle and some anticlockwise, so the same point can look different on two diagrams. Check the corners and the tick direction every time; don't assume.

## A worked example: naming soil textures

Soil scientists sort soil into **12 texture classes** by how much sand, silt and clay it contains, as shares of its mineral particles: sand is 0.05 to 2 mm across, silt 0.002 to 0.05 mm, and clay smaller than 0.002 mm. The **soil texture triangle** of the US Department of Agriculture (USDA) draws those classes as regions on a ternary plot, which is what the chart at the top of this page shows.

| Sample | Sand | Silt | Clay | Where it falls | Texture class |
| --- | --- | --- | --- | --- | --- |
| A | 65% | 25% | 10% | Low on the triangle, towards the sand corner | Sandy loam |
| B | 20% | 55% | 25% | Towards the silt corner, just below the 27% clay line | Silt loam |
| C | 30% | 28% | 42% | Above the 40% clay line, near the middle | Clay |

To place sample B, start on the horizontal 25% clay line. Move along it until you reach the 55% silt line, which runs parallel to the left side. Check: that point also sits on the 20% sand line. It lies in the silt loam region.

Three things the triangle shows that a table doesn't:

- **The classes aren't equal in size.** Anything from 40% to 100% clay with little sand or silt is simply "clay", while near the sand corner a few percent more silt or clay moves a sample from sand to loamy sand to sandy loam.
- **Groups of samples stand out.** On the chart at the top, the samples form three clusters, one for each field, without any colour coding.
- **The spread within a group is visible.** The hill slope samples spread across five classes (clay, clay loam, silty clay, loam and silt loam), so one class for the whole field would hide real variation.

### How to describe a ternary plot

Use this template when you report a ternary plot:

> **[Number]** of the **[samples]** contain **[range of component 1]** and **[range of component 2]**, which places them in **[region or class]**. The other **[number]** fall in **[other region]**, because they have more **[component]**.

**Worked example:** "Eleven of the 14 valley floor samples contain 57% to 76% silt and 8% to 23% clay, which places them in the silt loam class. The other three fall in silty clay loam, because they have more than 27% clay."

## How does a ternary plot work?

A ternary plot uses **barycentric coordinates**: a point's distance from each side of the triangle is set by its share of the component at the opposite corner. Two steps turn three values into a position you can draw:

1. **Scale the values to a fixed total.** Divide each of the three values by their sum. A mixture of 6 g, 3 g and 1 g becomes 60%, 30% and 10%. This is why a ternary plot shows proportions, not amounts.
2. **Convert to x and y.** For a triangle with sides of length 1, the bottom-left corner at (0, 0), the bottom-right corner at (1, 0) and the top at (0.5, 0.866):
   - **x** = right-hand component + ½ × top component
   - **y** = top component × √3 ⁄ 2 (about 0.866)

The left-hand component doesn't appear in the formula: once the other two are known, it is whatever is left. Reading values back works the other way round: top = y ÷ 0.866, right = x − top ÷ 2, and left = 1 − top − right. The interactive example on this page runs this conversion every time you move the mouse.

The same chart has other names in other fields: a **Gibbs triangle** in thermodynamics, a **de Finetti diagram** in population genetics, where the corners are the three genotypes AA, Aa and aa, and a **simplex plot** in statistics and game theory.

## Where ternary plots are used

- **Soil science:** the soil texture triangle names a soil from its sand, silt and clay content, as in the example above.
- **Geology and petrology:** sandstones are classified by their quartz, feldspar and rock fragment content, and ultramafic igneous rocks by their olivine, orthopyroxene and clinopyroxene content.
- **Chemistry and chemical engineering:** a ternary phase diagram shows which phases form when three substances are mixed at a fixed temperature and pressure, such as when one liquid dissolves in a mix of two others. Process engineers use them to design extraction and separation steps.
- **Metallurgy and materials science:** alloys of three metals, such as the tin, silver and copper of lead-free solders, are mapped on ternary phase diagrams. Polymer blends, and membranes made from a polymer, a solvent and a non-solvent, are designed the same way.
- **Shares of a whole:** any three shares that add up to 100%, such as a three-way election, how a team splits its time between three kinds of work, or the mix of three energy sources in a country's power supply.

## When to use a ternary plot

Use a ternary plot when **each item is a mixture of exactly three parts** that add up to a fixed whole, and you want to compare many items, see clusters or place them in named regions.

| Chart | Best for |
| --- | --- |
| **Ternary plot** | Many mixtures of three parts at once, with clusters, trends and classification regions |
| [Bar chart](/learn/chart-types/cartesian/bar-chart/) (100% stacked) | A few items, or more than three parts, where exact shares matter more than patterns |
| [Pie chart](/learn/chart-types/radial/pie-chart/) or [donut chart](/learn/chart-types/radial/donut-chart/) | A single mixture, split into a few parts |
| [Scatter plot](/learn/chart-types/cartesian/scatter-plot/) | Two variables that don't have to add up to anything, or two of the three parts when the third doesn't matter |

## Common ternary plot mistakes

- **Values that don't add up.** Plotting raw values that sum to 97 or 104 puts points in the wrong place. Rescale every point so its three values add up to exactly 100%, and say that you did.
- **Reading along the wrong gridlines.** The most common mistake. Always follow the gridline parallel to the side opposite the component's corner, and check that the three readings add up to 100.
- **Unlabelled direction.** Without angled tick marks, arrows or corner labels, readers can't tell which way each scale runs. Label every corner and every side.
- **Hiding the dropped parts.** If a fourth component was removed before plotting (water, organic matter, other minerals), say so: the plotted shares are of the three parts, not of the whole sample.
- **Too few points to need a triangle.** For two or three mixtures, a 100% stacked bar chart or a table is clearer.
- **Overplotting.** Thousands of points pile up in one area. Use smaller, partly transparent markers, or shade the triangle by how many points fall in each area.
- **Stretched triangles.** If the chart stretches the triangle to fit its box, the gridlines still work but the shape no longer matches the diagram readers know. Keep it equilateral.

## How to create a ternary plot in JavaScript, React or Angular

SciChart.js has no separate ternary series, but a short helper converts each mixture to x and y, and SciChart's line segment, scatter and triangle series draw the rest. Because SciChart.js draws with WebGL and WebGPU, the chart stays smooth to zoom and pan with many points. Try the chart below: hover anywhere in the triangle to read all three values and see the three gridlines you are reading along, or hover over a sample to read its values. Scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="ternary plot" demo="scatter-chart" docs="/2d-charts/chart-types/fast-triangle-renderable-series/" />

Here is the code for this chart. The data is plain JSON: one object per point, with a value for each component:

```json
[
    { "name": "Sample 1", "sand": 65, "silt": 25, "clay": 10 },
    { "name": "Sample 2", "sand": 20, "silt": 55, "clay": 25 }
]
```

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
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";
    // createTernary, addTernaryRegions, addTernaryGrid, fitTernaryView, keepTernaryEquilateral and TernaryTooltipModifier
    // from the JavaScript tab, saved as ternary.ts
    import {
        createTernary,
        addTernaryRegions,
        addTernaryGrid,
        fitTernaryView,
        keepTernaryEquilateral,
        TernaryTooltipModifier
    } from "./ternary";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        const ternary = createTernary({
            left: { key: "sand", name: "Sand", color: "#F2C14E" },
            right: { key: "silt", name: "Silt", color: "#50C7E0" },
            top: { key: "clay", name: "Clay", color: "#F48420" }
        });
        const axisOptions = { isVisible: false, autoRange: EAutoRange.Never };
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { ...axisOptions, visibleRange: new NumberRange(-18, 118) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { ...axisOptions, visibleRange: new NumberRange(-18, 96) }));

        // Regions: [{ name, corners: [[sand, silt, clay], ...] }]. Points: [{ name, sand, silt, clay }]
        const findRegion = addTernaryRegions(sciChartSurface, wasmContext, ternary, getYourRegions());
        addTernaryGrid(sciChartSurface, wasmContext, ternary, 10);
        const samples = getYourTernaryData();
        const points = samples.map((sample) => ternary.toXY(sample));
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: points.map((p) => p.x), yValues: points.map((p) => p.y) }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 10, height: 10, fill: "#FFFFFF" })
            })
        );

        // Keep the triangle equilateral, and reset to the whole triangle on double-click
        keepTernaryEquilateral(sciChartSurface);
        sciChartSurface.chartModifiers.add(
            new TernaryTooltipModifier(ternary, samples, findRegion),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier({ onZoomExtents: () => { fitTernaryView(sciChartSurface); return false; } })
        );
        return { sciChartSurface };
    };

    export const TernaryPlot = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } from "scichart";
    // createTernary, addTernaryRegions, addTernaryGrid, fitTernaryView, keepTernaryEquilateral and TernaryTooltipModifier
    // from the JavaScript tab, saved as ternary.ts
    import {
        createTernary,
        addTernaryRegions,
        addTernaryGrid,
        fitTernaryView,
        keepTernaryEquilateral,
        TernaryTooltipModifier
    } from "./ternary";

    @Component({
        selector: "app-ternary-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class TernaryPlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            const ternary = createTernary({
                left: { key: "sand", name: "Sand", color: "#F2C14E" },
                right: { key: "silt", name: "Silt", color: "#50C7E0" },
                top: { key: "clay", name: "Clay", color: "#F48420" }
            });
            const axisOptions = { isVisible: false, autoRange: EAutoRange.Never };
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { ...axisOptions, visibleRange: new NumberRange(-18, 118) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { ...axisOptions, visibleRange: new NumberRange(-18, 96) }));

            // Regions: [{ name, corners: [[sand, silt, clay], ...] }]. Points: [{ name, sand, silt, clay }]
            const findRegion = addTernaryRegions(sciChartSurface, wasmContext, ternary, getYourRegions());
            addTernaryGrid(sciChartSurface, wasmContext, ternary, 10);
            const samples = getYourTernaryData();
            const points = samples.map((sample) => ternary.toXY(sample));
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: points.map((p) => p.x), yValues: points.map((p) => p.y) }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 10, height: 10, fill: "#FFFFFF" })
                })
            );

            // Keep the triangle equilateral, and reset to the whole triangle on double-click
            keepTernaryEquilateral(sciChartSurface);
            sciChartSurface.chartModifiers.add(
                new TernaryTooltipModifier(ternary, samples, findRegion),
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier({ onZoomExtents: () => { fitTernaryView(sciChartSurface); return false; } })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- `createTernary` is plain JavaScript with no SciChart code. Its `toXY` and `fromXY` convert between three values and a position in a triangle with sides of 100, using the formula above. You choose which component goes on which corner.
- The triangle, gridlines and tick marks are [FastLineSegmentRenderableSeries](/2d-charts/chart-types/fast-line-segment-renderable-series/), drawn as pairs of points. Each component's ticks continue its own gridlines out of the triangle, so they show which way to read. Labels and side titles are [NativeTextAnnotations](/2d-charts/annotations-api/native-text-annotation/), with `rotation` to run the titles along the sides.
- Each shaded region is a [FastTriangleRenderableSeries](/2d-charts/chart-types/fast-triangle-renderable-series/) in `ETriangleSeriesDrawMode.List` mode. The `triangulate` helper cuts any outline, including the notched sandy loam class, into triangles. The samples are an [XyScatterRenderableSeries](/2d-charts/chart-types/xy-scatter-renderable-series/).
- The two normal axes are hidden but still set the drawing area. `fitTernaryView` sets their ranges so one unit is the same number of pixels across and up, `keepTernaryEquilateral` runs it whenever the chart changes size, and `onZoomExtents` calls it on double-click instead of stretching the triangle to fill the chart. `TernaryTooltipModifier` extends `CustomChartModifier2D` ([custom chart modifiers](/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/)) to read the values under the mouse.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart), and the [JavaScript triangle series chart](https://www.scichart.com/demo/javascript/triangle-series-chart) for filled shapes.

**Go deeper:** [SciChart.js triangle series documentation](/2d-charts/chart-types/fast-triangle-renderable-series/), including the list, strip and polygon draw modes, and the [SciChart.js scatter chart documentation](/2d-charts/chart-types/xy-scatter-renderable-series/).

**Building a Windows desktop app?** [SciChart WPF has a built-in ternary chart](https://www.scichart.com/documentation/win/current/What%20is%20a%20Ternary%20Chart.html), with ternary scatter, polygon and error bar series.

## Frequently asked questions

### What is a ternary plot used for?

A ternary plot is used to compare mixtures made of three parts. Soil scientists use it to name soil textures from their sand, silt and clay content; geologists to classify rocks by three minerals; chemists and metallurgists to map which phases form in three-component mixtures and alloys. It also works for any three shares of a whole, such as a three-way vote or how a team splits its time.

### How do you read a ternary plot?

Read each component separately. Find its corner, where it is 100%, and the opposite side, where it is 0%. From the point, follow the gridline that runs parallel to that opposite side until it meets the scale for that component, and read the value. Do the same for the other two components, then check that the three values add up to 100%.

### Why do the values on a ternary plot add up to 100%?

A ternary plot shows proportions, not amounts. Each point is a mixture whose three parts are scaled so they add up to a fixed total, usually 100% or 1. Because the third value always follows from the other two, three values fit on a flat triangle. If your values don't add up to the total, divide each by their sum before plotting.

### What is the difference between a ternary plot and a ternary phase diagram?

A ternary plot is the general chart: any data with three parts that add up to a total, plotted in a triangle. A ternary phase diagram is one use of it in chemistry and materials science. It divides the triangle into regions that show which phases (solid, liquid, or several solids) exist at each composition, usually at one fixed temperature and pressure.

### Can a ternary plot show more than three components?

Not directly. A ternary plot has exactly three corners. With four or more components, either group them into three (for example, quartz, feldspar and all other rock fragments), plot three of them after removing the rest and rescaling to 100%, or use a different chart, such as a stacked bar chart.

### How do I make a ternary plot in JavaScript?

Convert each point's three values to x and y: divide each value by the sum, then x is the right-hand component plus half the top component, and y is the top component times the square root of 3 divided by 2. Plot those points as a scatter series, and draw the triangle, gridlines and tick labels yourself. With SciChart.js you can do this with line segment series, text annotations, a scatter series, and triangle series to shade regions. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Soil Science Division Staff (2017), [Soil Survey Manual](https://www.nrcs.usda.gov/resources/guides-and-instructions/soil-survey-manual). USDA Handbook 18, Natural Resources Conservation Service. Defines the sand, silt and clay size limits and the 12 soil texture classes used in the example.
- USDA Natural Resources Conservation Service, [Soil texture calculator](https://www.nrcs.usda.gov/resources/data-and-reports/soil-texture-calculator). Finds the texture class of a soil from its sand, silt and clay percentages.
- Science Education Resource Center, Carleton College, [How do I use ternary diagrams?](https://serc.carleton.edu/mathyouneed/geomajors/ternary/index.html) Ternary diagrams in the earth sciences, including soil and igneous rock classification.
- DoITPoMS, University of Cambridge, [Ternary phase diagrams](https://www.doitpoms.ac.uk/tlplib/phase3_diagrams/index.php). A teaching package on reading ternary phase diagrams for alloys, with a tin–silver–copper case study.
- Howarth, R. J. (1996), [Sources for a history of the ternary diagram](https://doi.org/10.1017/S000708740003449X). *The British Journal for the History of Science*, 29(3), 337–356.

<LearnCta position="bottom" chart="ternary plot" demo="scatter-chart" docs="/2d-charts/chart-types/fast-triangle-renderable-series/" />
