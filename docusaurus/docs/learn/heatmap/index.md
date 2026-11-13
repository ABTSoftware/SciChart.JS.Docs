---
sidebar_position: 9
sidebar_label: Heatmap
title: "Heatmap (Heat Map): What It Is & How to Read It (With Interactive Examples)"
description: "What a heatmap is, how to read its grid of coloured cells and colour scale, how to choose a colour map, and when to use a heat map instead of a scatter or contour plot. With a live, interactive example."
keywords:
    [
        "heatmap",
        "heat map",
        "heatmap chart",
        "what is a heat map",
        "how to read a heat map",
        "heat map examples",
        "heatmap color scale"
    ]
image: /img/learn/heatmap-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a heat map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A heat map is a chart that shows a table of numbers as a grid of coloured cells. Each row and column is a category or a range of values, and each cell's colour shows the value where they meet, so high and low areas stand out at a glance." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a heat map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Find the colour scale (legend) first, so you know which colour means high and which means low. Then look for clusters of similar colour, read along a row to compare its columns, and read down a column to compare rows. Hover over or look up a cell when you need its exact value." }
                },
                {
                    "@type": "Question",
                    "name": "Is it heatmap or heat map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both spellings are used and mean the same chart. Heatmap (one word) is common in software and data science; heat map (two words) is common in general writing." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a data heatmap and a website heatmap?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A data heatmap is a chart of a grid of values, such as a correlation matrix or a time-by-frequency plot. A website heatmap is an analytics tool that overlays colour on a screenshot of a web page to show where visitors clicked, moved or scrolled. They share the idea of colour for intensity but are different products." }
                },
                {
                    "@type": "Question",
                    "name": "Which colour scale should I use for a heat map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a sequential scale, light to dark or dark to bright, when values run from low to high. Use a diverging scale, with a neutral colour in the middle, when values sit either side of a meaningful midpoint such as zero. Perceptually uniform maps such as viridis are easier to read accurately than rainbow maps." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a heatmap in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with two NumericAxis axes, then add a UniformHeatmapRenderableSeries with a UniformHeatmapDataSeries holding a 2D array of values and a HeatmapColorMap that turns values into colours. Add a HeatmapLegend to show the colour scale. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Heatmap

:::info Looking for the SciChart.js API?
See the [SciChart.js heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) for `UniformHeatmapRenderableSeries`, colour maps, legends and real-time updates.
:::

A **heatmap** (or **heat map**) shows a table of numbers as a grid of coloured **cells**. Each **row** and **column** stands for a category or a range of values, and the **colour** of each cell shows the value where they meet. A **colour scale** turns colours back into numbers, so high and low areas, patterns and outliers stand out at a glance.

Try the interactive heatmap below. It shows made-up hourly energy use for one week. Scroll to zoom, drag to pan, double-click to reset, and hover over a cell to see its value.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="heatmap" demo="heatmap-chart" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" />

## How to read a heatmap

![Anatomy of a heatmap: a grid of coloured cells with labelled rows and columns, one cell highlighted, and a colour scale from low (dark purple) to high (yellow)](./heatmap-anatomy.svg)

- **Start with the colour scale** (the legend). It tells you which colour means a high value and which means a low one. Without it, a heatmap shows only where values are higher or lower, not by how much.
- **Each cell is one value.** Its position tells you what it is (for example Thursday, 19:00); its colour tells you how big it is.
- **Look for clusters and bands.** In the demo, the bright band on the right shows that weekday evenings use the most energy, and the weekend rows show a different, broader pattern.
- **Read along a row or down a column** to compare one category across the other: one day across 24 hours, or one hour across seven days.
- **Use it for patterns, not precise values.** People compare colours less accurately than lengths or positions, so hover, add cell labels or link to a table when exact numbers matter.

### Choosing a colour scale

The colour scale (also called a **colour map** or palette) decides what the reader sees, so choose it to match your data.

| Colour scale | What it looks like | Use it when |
| --- | --- | --- |
| **Sequential** | One direction, dark to bright or light to dark (e.g. viridis, as in the demo) | Values run from low to high: counts, temperatures, energy, intensity |
| **Diverging** | Two colours meeting at a neutral middle (e.g. blue, white, red) | Values sit either side of a meaningful midpoint: correlation (-1 to +1), change from a baseline, profit and loss |
| **Categorical** | Distinct, unrelated colours | Each cell holds a category, not a quantity; use sparingly |
| **Rainbow** (jet) | Many hues | Avoid for most data: its uneven brightness can create edges that aren't in the data. Perceptually uniform maps such as viridis are designed to avoid this and stay readable for most people with colour-vision deficiencies |

Also decide the **range** the scale covers. Setting it from the data's minimum to maximum uses every colour; fixing it (for example 0 to 100%) keeps colours comparable across several heatmaps.

## Types of heatmap and heat map examples

| Type | What the grid shows | Example |
| --- | --- | --- |
| **Matrix heatmap** | Rows and columns are categories | A **correlation matrix**: each cell is the correlation between two variables, on a diverging scale |
| **Time heatmap** (calendar heatmap) | Time on one or both axes | Hour of day by day of week, as in the demo; daily activity across a year |
| **Spatial heatmap** | A regular grid over space | Temperature or rainfall over a map, a sensor array, a scientific image |
| **Spectrogram** | Time by frequency | Sound, vibration or radio signals; see our [spectrogram guide](/learn/spectrogram/) |
| **Non-uniform heatmap** | Cells of different widths or heights | Measurements taken at uneven intervals |
| **Heatmap with contours** | Coloured cells plus lines of equal value | Elevation, pressure or field strength |

Two things share the name but are not data charts in this sense. **Website heatmaps** are analytics tools that overlay colour on a screenshot of a web page to show where visitors clicked, moved or scrolled. **Geographic density maps** blur points into a smooth glow over a map. Both use colour for intensity; this guide is about heatmaps of a grid of values.

## When to use a heatmap

Use a heatmap when your data is a **grid of values**: two dimensions, such as rows and columns, x and y, or time and frequency, and one number for each combination. Heatmaps scale well: a grid with thousands of rows and columns still reads as one picture.

| Chart | Best for |
| --- | --- |
| **Heatmap** | A value for every combination of two dimensions; spotting patterns, clusters and outliers across a whole grid |
| [Scatter plot](/learn/scatter-plot/) | Individual points with two numeric values each; relationships and correlation between two variables |
| [Contour plot](/2d-charts/chart-types/uniform-contours-renderable-series/) | A smooth surface drawn as lines of equal value; reading exact levels, like a map's elevation lines |
| [3D surface plot](/3d-charts/chart-types/surface-mesh-3d/) | The same grid drawn as a 3D landscape; shape is clearer, but values hidden behind peaks are harder to read |

If one of your dimensions is a few categories and you care about exact values, a grouped [bar chart](/learn/bar-chart/) or a table is often clearer.

## How to create a heatmap in JavaScript, React or Angular

SciChart.js draws heatmaps with WebGL and WebGPU, so large grids stay smooth to zoom and pan and can update in real time. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        // zValues is a 2D array: zValues[row][column]
        const zValues = getYourGridData();
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries: new UniformHeatmapDataSeries(wasmContext, { zValues, xStart: 0, xStep: 1, yStart: 0, yStep: 1 }),
                colorMap: new HeatmapColorMap({
                    minimum: 0,
                    maximum: 3,
                    gradientStops: [
                        { offset: 0, color: "#440154" },
                        { offset: 0.5, color: "#21918C" },
                        { offset: 1, color: "#FDE725" }
                    ]
                })
            })
        );
        return { sciChartSurface };
    };

    export const HeatmapChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-heatmap-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class HeatmapChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

            // zValues is a 2D array: zValues[row][column]
            const zValues = getYourGridData();
            sciChartSurface.renderableSeries.add(
                new UniformHeatmapRenderableSeries(wasmContext, {
                    dataSeries: new UniformHeatmapDataSeries(wasmContext, { zValues, xStart: 0, xStep: 1, yStart: 0, yStep: 1 }),
                    colorMap: new HeatmapColorMap({
                        minimum: 0,
                        maximum: 3,
                        gradientStops: [
                            { offset: 0, color: "#440154" },
                            { offset: 0.5, color: "#21918C" },
                            { offset: 1, color: "#FDE725" }
                        ]
                    })
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html) holds your grid as a 2D array, `zValues[row][column]`. `xStart`, `xStep`, `yStart` and `yStep` place the cells on the axes; every cell is the same size.
- A [HeatmapColorMap](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html) is the colour scale: `minimum` and `maximum` set the range, and `gradientStops` set the colours along it.
- A [HeatmapLegend](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html) draws the colour scale in its own div. Pass it the same colour map as the series.
- To update the heatmap live, call `setZValues()` on the data series with a new 2D array. For cells of different sizes, use a `NonUniformHeatmapRenderableSeries`; to add lines of equal value, add a `UniformContoursRenderableSeries`.

**See it in the demo app:** [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart)

**More heatmap examples:** [JavaScript heatmap chart with contours](https://www.scichart.com/demo/javascript/heatmap-chart-with-contours) · [JavaScript non-uniform heatmap chart](https://www.scichart.com/demo/javascript/non-uniform-heatmap-chart)

**Go deeper:** [SciChart.js heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), including [colour maps and legends](/2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/), [real-time updates](/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/), [non-uniform heatmaps](/2d-charts/chart-types/non-uniform-heatmap-renderable-series/) and [contours](/2d-charts/chart-types/uniform-contours-renderable-series/).

## Frequently asked questions

### What is a heat map?

A heat map is a chart that shows a table of numbers as a grid of coloured cells. Each row and column is a category or a range of values, and each cell's colour shows the value where they meet, so high and low areas stand out at a glance.

### How do you read a heat map?

Find the colour scale (legend) first, so you know which colour means high and which means low. Then look for clusters of similar colour, read along a row to compare its columns, and read down a column to compare rows. Hover over or look up a cell when you need its exact value.

### Is it heatmap or heat map?

Both spellings are used and mean the same chart. Heatmap (one word) is common in software and data science; heat map (two words) is common in general writing.

### What is the difference between a data heatmap and a website heatmap?

A data heatmap is a chart of a grid of values, such as a correlation matrix or a time-by-frequency plot. A website heatmap is an analytics tool that overlays colour on a screenshot of a web page to show where visitors clicked, moved or scrolled. They share the idea of colour for intensity but are different products.

### Which colour scale should I use for a heat map?

Use a sequential scale, light to dark or dark to bright, when values run from low to high. Use a diverging scale, with a neutral colour in the middle, when values sit either side of a meaningful midpoint such as zero. Perceptually uniform maps such as viridis are easier to read accurately than rainbow maps.

### How do I make a heatmap in JavaScript?

With SciChart.js, create a `SciChartSurface` with two `NumericAxis` axes, then add a `UniformHeatmapRenderableSeries` with a `UniformHeatmapDataSeries` holding a 2D array of values and a `HeatmapColorMap` that turns values into colours. Add a `HeatmapLegend` to show the colour scale. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

<LearnCta position="bottom" chart="heatmap" demo="heatmap-chart" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" />
