---
sidebar_position: 9.7
sidebar_label: 3D Surface Plot
title: "3D Surface Plot: What It Is & How to Read It (With Interactive Examples)"
description: "What a 3D surface plot is, how to read its peaks, saddles and slopes, how it compares with a heatmap, a contour plot and a 3D scatter plot, and the mistakes to avoid. With live examples."
keywords:
    [
        "3d surface plot",
        "surface plot",
        "3d surface graph",
        "surface chart",
        "what is a surface plot",
        "how to read a 3d surface plot",
        "surface plot vs contour plot",
        "3d surface plot vs 3d scatter plot"
    ]
image: /img/learn/3d-surface-plot-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a 3D surface plot used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A 3D surface plot is used to show how one value depends on two others at once, such as temperature across a plate, the height of terrain, the response of a process to two settings, or signal strength across frequency and time. Drawing the value as height makes peaks, valleys, ridges and saddles easy to see, and lets you rotate the chart to understand the overall shape." }
                },
                {
                    "@type": "Question",
                    "name": "How do you interpret a 3D surface plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "First check what the two floor axes and the height stand for, and their units. Then look for the high points (peaks), the low points (dips), the passes between peaks (saddles) and where the surface is steep or flat. Use the colour scale and the height axis to read values, and rotate the chart, or hover over it, before trusting a value read from one angle." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a surface plot and a contour plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They take the same kind of data, a grid of values over two inputs, and differ in viewpoint. A surface plot raises each value to a height and is seen from the side, which shows the shape at once but lets hills block the view and makes precise reading hard. A contour plot looks straight down and traces lines where the value is constant, so every part is visible and levels can be read off exactly." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a 3D surface plot and a 3D scatter plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A 3D surface plot joins values on a regular grid into a continuous sheet, so it suits data where every combination of x and y has a value, like a measured or calculated field. A 3D scatter plot draws each measurement as a separate point at its own x, y and z, so it suits scattered observations and clusters, with no assumption that the points form a smooth surface." }
                },
                {
                    "@type": "Question",
                    "name": "Can you make a surface plot from scattered data points?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes, but the points must first be turned into a regular grid. Interpolation, for example triangulating the points or taking a weighted average of nearby points, estimates a value at every grid position, and the surface is then drawn from that grid. Show where the real measurements are, because the surface between them is an estimate." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a 3D surface plot in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChart3DSurface with three NumericAxis3D axes, put your heights in a UniformGridDataSeries3D as a 2D array, and add a SurfaceMeshRenderableSeries3D with a GradientColorPalette to colour it by height. Add OrbitModifier3D, MouseWheelZoomModifier3D and TooltipModifier3D so readers can rotate, zoom and read values. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# 3D Surface Plot

## What is a 3D surface plot?

A **3D surface plot** (also called a **surface plot**, **surface chart** or **3D surface graph**) is a chart that draws a value as height above a flat grid of two inputs, such as two positions, or frequency and time. It looks like a landscape: high values rise as peaks, low ones sink as valleys, and colour usually repeats the height.

![A 3D surface plot of temperature across a metal plate: a dark purple sheet near room temperature with two hills, a tall one at about 81 °C and a lower one at about 64 °C, shaded dark purple where it is cool and pale yellow where it is hot, with white lines every 10 °C](/img/learn/3d-surface-plot-og.png)

*Sample data: a 40 × 30 cm plate warmed by two heaters and chilled by water along one edge, the same plate as on our [contour plot](/learn/contour-plot/) page. Height and colour both show the temperature; white rings mark every 10 °C. [Try the interactive version](#how-to-create-a-3d-surface-plot-in-javascript-react-or-angular).*

:::tip Key takeaways
- Every position on the floor has **exactly one value**, and the plot draws it as the height of a continuous sheet.
- **Colour normally repeats the height**, so high and low stand out from any angle. If colour shows a different value, the chart needs its own colour scale.
- Read it for **shape**: peaks, dips, saddles, ridges and steep slopes. For exact values, use the axes, a tooltip or a contour plot of the same data.
- **Tall features hide what is behind them.** An interactive chart that can rotate solves this; a single static view does not.
- The data must sit on a **regular grid**. Scattered measurements have to be interpolated first.
:::

## How to read a 3D surface plot

![Anatomy of a 3D surface plot: the plate temperatures drawn as a coloured mesh over a flat floor, with an x axis across the plate, a y axis up the plate and a vertical temperature axis, and numbered markers for the highest peak, the lower peak, the saddle between them, the steep cooled edge, a flat area, one grid cell, a dashed area hidden behind the tall peak, and the colour scale](./3d-surface-plot-anatomy.svg)

1. **Name the three axes.** Two run across the floor and are the inputs, such as position, time or two settings of a machine. The vertical axis is the value being measured, often called z. On the plate chart, the floor is the plate itself and the height is temperature.
2. **Check the colour scale.** On most surface plots colour simply repeats the height: dark is low, bright is high. That makes the colour a second way to read the value, useful when perspective makes the height hard to judge.
3. **Find the peaks and dips first.** They are usually the reason the chart was made: the hottest point, the best combination of two settings, the deepest point of a basin.
4. **Then look at the slopes.** A steep slope means the value changes quickly as you move across the floor; a flat area means it hardly changes at all. Ridges and valleys show directions in which the value stays high or low.
5. **Turn it before you trust it.** A single view can hide a dip behind a peak, or make a near peak look taller than a far one. Rotate the chart, look straight down, or hover over a point to read its value.

## How a 3D surface plot is built

A surface plot starts from a **grid**: rows and columns at regular steps, with one value where each row meets each column. Each point is lifted to its value's height, and every four neighbouring points are joined into a small patch, called a **cell**. Thousands of cells together form the sheet, which is why software often calls a surface plot a **surface mesh**.

Two settings change the look without changing the data:

- **Fill or wireframe.** The cells can be filled with colour, drawn as an open net of lines (a **wireframe**), or both. Wireframes show the grid and the shape clearly but get crowded on large grids.
- **Lighting.** Shading makes slopes facing the light brighter, which helps the eye see the shape, but it also changes the colours, so two patches at the same temperature can look as if they were different. Turn lighting down when colour is meant to be read as a value, and add contour lines to show the shape instead, as in the chart above.

The grid has the same two consequences as for a [contour plot](/learn/contour-plot/):

- **Scattered data must be gridded first.** Readings from sensors placed by hand, weather stations or survey points have to be **interpolated** onto a regular grid before a surface can be drawn. The surface between the readings is then an estimate, not a measurement.
- **The step between grid points limits the detail.** Widely spaced points give a faceted, blocky surface and can miss narrow peaks. A fine grid looks smooth but means more values to compute and draw.

## Shapes on a 3D surface plot and what they mean

| What you see | What it means | On the plate chart |
| --- | --- | --- |
| A hill with a single top | A **peak**: the value is highest there | Above the heater on the left, roughly 81 °C |
| A hollow | A **dip**: the value is lowest there | None on this plate |
| A pass between two hills | A **saddle**: the low point on the best route from one peak to the other | Between the heaters, at about 43 °C |
| A steep wall | The value **changes quickly** over a short distance | The water-cooled right-hand edge |
| A level plain | The value **barely changes** | The plate's left-hand strip, which stays at room temperature (24 °C) |
| A long, narrow crest | A **ridge**: a direction in which the value stays high | Not on this plate; a heated rod would make one |
| A flat, tilted sheet | A **steady slope**: the value climbs evenly in one direction | Absent here; any linear formula, z = 3x − y for instance, draws one |

### How to describe a 3D surface plot

A good description moves from the biggest feature to the smallest. Fill in this sentence pattern:

> The surface **peaks** at **[value]** at **[position]** and falls to **[value]** at **[position]**. **[Other hills, hollows or passes, with their values.]** It **drops most sharply** around **[position]** and is **nearly level** around **[position]**.

**Filled in for the plate:**

"The surface peaks at roughly 81 °C at the point 11 cm in from the left and 19 cm up, and falls to about 10 °C along the chilled right-hand edge. A second, wider hill reaches 64 °C near (27 cm, 11 cm), and a pass at around 43 °C links the two hills. It drops most sharply in the final 4 cm before the chilled edge, from roughly 32 °C to 13 °C, and is nearly level along the left-hand strip, which stays at 24 °C."

## Types of 3D surface plot

| Type | What it looks like | Good for |
| --- | --- | --- |
| **Solid surface** | A filled, coloured sheet | Seeing the overall shape at a glance |
| **Wireframe** | An open net of grid lines, with no fill | Showing the grid, and seeing a little of what is behind |
| **Solid with wireframe** | A filled sheet with the grid lines drawn on it | Smaller grids, where each cell matters |
| **Surface with contour lines** | A filled sheet with lines of equal value drawn on it, like the chart above | Shape and levels together; linking the 3D view to a [contour plot](/learn/contour-plot/) |
| **Surface with a projected map** | A [heatmap](/learn/heatmap/) or contour map drawn on the floor under the surface | Reading positions on the floor that the surface hides |
| **Spectral surface (3D waterfall)** | Frequency on one floor axis, time on the other, and signal strength as height | Sound, vibration and radio signals; the 3D form of a [spectrogram](/learn/spectrogram/) |

## When to use a 3D surface plot

Choose a 3D surface plot when two continuous inputs together decide one output, so that the data forms a **surface**, and the reader needs its **overall shape**: where the peaks and valleys are, and how they connect. It works best on screen, where the reader can rotate it.

| Chart | Best for |
| --- | --- |
| **3D surface plot** | The shape of a smooth surface at a glance; presenting results; exploring data interactively by rotating it |
| [Heatmap](/learn/heatmap/) | The same kind of grid seen from above as colour; also works for categories such as day and hour; nothing is hidden |
| [Contour plot](/learn/contour-plot/) | The same kind of grid seen from above as lines of equal value; reading exact levels and finding saddles; printing |
| [3D scatter plot](/3d-charts/chart-types/scatter-3d-chart/) | Separate measurements with their own x, y and z, such as clusters or a cloud of points, when the data isn't on a grid |

The three grid charts suit each other. A heatmap or contour plot gives exact positions and values; a surface plot of the same data gives a feel for its shape. Reports often show both.

## 3D surface plots of live and large data

Surface plots aren't only for fixed results. Engineers watch them update live: the vibration of a machine across frequency and time, the shape of a radar or sonar return, a terrain model being scanned. In the chart below, a new spectrum of 500 frequencies, from 0 to 10 kHz, arrives every 50 milliseconds and is added at the front, while the oldest is dropped at the back. The surface holds 200 spectra, 100,000 heights in all, and all of them are redrawn on every update. Drag to rotate it while it runs.

<LiveDocSnippet maxWidth={'100%'} name="./Realtime/demo" />

Three signals are easy to pick out: a steady tone at 2 kHz is a straight ridge, a tone sweeping between 4 and 8 kHz snakes from side to side, and a tone at 9 kHz that switches on and off appears as a row of separate blocks. A flat [spectrogram](/learn/spectrogram/) shows the same kind of data as colour, which is easier to read precisely; the surface makes the strongest signals stand out as height.

Charts like this are drawn on the graphics card (GPU), using WebGL or WebGPU, which is built to draw many thousands of small shapes at once.

## Common 3D surface plot mistakes

- **Showing one fixed view.** A peak can hide a dip, and the near side always looks bigger than the far side. Let readers rotate the chart, or show a top-down heatmap or contour plot beside it.
- **Reading exact values from height.** Perspective makes the same height look different at the front and the back. Use a tooltip, contour lines or a 2D chart when exact values matter.
- **Letting lighting change the colours.** Shading brightens slopes that face the light, so the same value can look different in different places. Turn lighting down when colour stands for a value.
- **Using a rainbow colour scale.** Rainbow scales jump in brightness at yellow and cyan, which paints false bands across smooth slopes. Pick a scale whose brightness rises evenly, such as viridis or inferno.
- **Colouring by a second value without a colour scale.** If colour shows something other than height, such as error or density, readers can't tell; add a colour legend and say so in the title.
- **Stretching the height.** A tall height axis turns gentle bumps into spikes; a squashed one flattens real peaks. Choose the box proportions on purpose, and keep them the same when charts are compared.
- **Drawing a wireframe on a large grid.** Thousands of lines merge into a solid block. Use a solid surface, or thin the lines.
- **Hiding where the real data is.** When a surface is interpolated from scattered points, mark the points, or readers will trust smooth shapes in areas that were never measured.

## How to create a 3D surface plot in JavaScript, React or Angular

SciChart.js renders 3D surfaces on the GPU with WebGL and WebGPU, so even large grids turn smoothly and can change live. In the plate chart below, drag to turn the box, scroll to move closer, double-click to go back to the starting view, and point at the surface to see its temperature.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="3D surface plot" demo="3d-surface-mesh-chart" docs="/3d-charts/chart-types/surface-mesh-3d/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        TooltipModifier3D,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // Y is the vertical axis in SciChart.js 3D
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X" });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Value" });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z" });

        // heights is a 2D array on a regular grid: heights[zIndex][xIndex]
        const heights = getYourGridData();
        const dataSeries = new UniformGridDataSeries3D(wasmContext, { yValues: heights, xStep: 1, zStep: 1 });

        sciChart3DSurface.renderableSeries.add(
            new SurfaceMeshRenderableSeries3D(wasmContext, {
                dataSeries,
                // Colour repeats the height: the minimum value is dark, the maximum pale yellow
                meshColorPalette: new GradientColorPalette(wasmContext, {
                    gradientStops: [
                        { offset: 0, color: "#000004" },
                        { offset: 0.5, color: "#B63679" },
                        { offset: 1, color: "#FCFDBF" }
                    ]
                }),
                minimum: 0,
                maximum: 100,
                drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
                contourInterval: 10,
                contourStroke: "#FFFFFF"
            })
        );
        sciChart3DSurface.chartModifiers.add(
            new OrbitModifier3D(),
            new MouseWheelZoomModifier3D(),
            new TooltipModifier3D()
        );
        return { sciChartSurface: sciChart3DSurface };
    };

    export const SurfacePlot = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        TooltipModifier3D,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-surface-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class SurfacePlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            // Y is the vertical axis in SciChart.js 3D
            sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X" });
            sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Value" });
            sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z" });

            // heights is a 2D array on a regular grid: heights[zIndex][xIndex]
            const heights = getYourGridData();
            const dataSeries = new UniformGridDataSeries3D(wasmContext, { yValues: heights, xStep: 1, zStep: 1 });

            sciChart3DSurface.renderableSeries.add(
                new SurfaceMeshRenderableSeries3D(wasmContext, {
                    dataSeries,
                    // Colour repeats the height: the minimum value is dark, the maximum pale yellow
                    meshColorPalette: new GradientColorPalette(wasmContext, {
                        gradientStops: [
                            { offset: 0, color: "#000004" },
                            { offset: 0.5, color: "#B63679" },
                            { offset: 1, color: "#FCFDBF" }
                        ]
                    }),
                    minimum: 0,
                    maximum: 100,
                    drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
                    contourInterval: 10,
                    contourStroke: "#FFFFFF"
                })
            );
            sciChart3DSurface.chartModifiers.add(
                new OrbitModifier3D(),
                new MouseWheelZoomModifier3D(),
                new TooltipModifier3D()
            );
            return { sciChartSurface: sciChart3DSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [UniformGridDataSeries3D](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformgriddataseries3d.html) holds the heights as a 2D array, `yValues[zIndex][xIndex]`. In SciChart.js 3D, **Y is the vertical axis**, and X and Z run across the floor. `xStart`, `xStep`, `zStart` and `zStep` place the grid on the axes.
- A [SurfaceMeshRenderableSeries3D](https://www.scichart.com/documentation/js/current/typedoc/classes/surfacemeshrenderableseries3d.html) draws the surface. `drawMeshAs` chooses solid, wireframe or both, with or without contour lines; `contourInterval` sets the spacing of the lines; `lightingFactor` sets how much shading is applied.
- A [GradientColorPalette](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientcolorpalette.html) colours the surface by height. `minimum` and `maximum` on the series set which values map to the first and last colour.
- `OrbitModifier3D` rotates the camera, `MouseWheelZoomModifier3D` zooms, `ResetCamera3DModifier` resets the view and `TooltipModifier3D` shows the value under the mouse. For live data, pass each new grid to the data series' `setYValues()`; the surface redraws itself.

**See it in the demo app:** [JavaScript 3D surface plot](https://www.scichart.com/demo/javascript/3d-surface-mesh-chart) · [React 3D surface plot](https://www.scichart.com/demo/react/3d-surface-mesh-chart) · [Angular 3D surface plot](https://www.scichart.com/demo/angular/3d-surface-mesh-chart). For live data: [JavaScript real-time 3D surface plot](https://www.scichart.com/demo/javascript/realtime-3d-surface-mesh-chart) · [React real-time 3D surface plot](https://www.scichart.com/demo/react/realtime-3d-surface-mesh-chart) · [Angular real-time 3D surface plot](https://www.scichart.com/demo/angular/realtime-3d-surface-mesh-chart).

**Go deeper:** [SciChart.js 3D surface plot documentation](/3d-charts/chart-types/surface-mesh-3d/), including colour palettes, textures, contours and wireframes. For points rather than a surface, see the [3D scatter chart documentation](/3d-charts/chart-types/scatter-3d-chart/).

## Frequently asked questions

### What is a 3D surface plot used for?

A 3D surface plot is used to show how one value depends on two others at once, such as temperature across a plate, the height of terrain, the response of a process to two settings, or signal strength across frequency and time. Drawing the value as height makes peaks, valleys, ridges and saddles easy to see, and lets you rotate the chart to understand the overall shape.

### How do you interpret a 3D surface plot?

First check what the two floor axes and the height stand for, and their units. Then look for the high points (peaks), the low points (dips), the passes between peaks (saddles) and where the surface is steep or flat. Use the colour scale and the height axis to read values, and rotate the chart, or hover over it, before trusting a value read from one angle.

### What is the difference between a surface plot and a contour plot?

They take the same kind of data, a grid of values over two inputs, and differ in viewpoint. A surface plot raises each value to a height and is seen from the side, which shows the shape at once but lets hills block the view and makes precise reading hard. A contour plot looks straight down and traces lines where the value is constant, so every part is visible and levels can be read off exactly.

### What is the difference between a 3D surface plot and a 3D scatter plot?

A 3D surface plot joins values on a regular grid into a continuous sheet, so it suits data where every combination of x and y has a value, like a measured or calculated field. A 3D scatter plot draws each measurement as a separate point at its own x, y and z, so it suits scattered observations and clusters, with no assumption that the points form a smooth surface.

### Can you make a surface plot from scattered data points?

Yes, but the points must first be turned into a regular grid. Interpolation, for example triangulating the points or taking a weighted average of nearby points, estimates a value at every grid position, and the surface is then drawn from that grid. Show where the real measurements are, because the surface between them is an estimate.

### How do I make a 3D surface plot in JavaScript?

With SciChart.js, create a `SciChart3DSurface` with three `NumericAxis3D` axes, put your heights in a `UniformGridDataSeries3D` as a 2D array, and add a `SurfaceMeshRenderableSeries3D` with a `GradientColorPalette` to colour it by height. Add `OrbitModifier3D`, `MouseWheelZoomModifier3D` and `TooltipModifier3D` so readers can rotate, zoom and read values. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- NIST/SEMATECH, [e-Handbook of Statistical Methods, section 1.3.3.10: Contour Plot](https://www.itl.nist.gov/div898/handbook/eda/section3/contour.htm). Describes the contour plot as a way to show a 3D surface in two dimensions, and an alternative to a 3D surface plot.
- Wikipedia, [Graph of a function: functions of two variables](https://en.wikipedia.org/wiki/Graph_of_a_function#Functions_of_two_variables). The mathematical idea behind a surface plot: the graph of a function of two variables is a surface.
- Borland, D. and Taylor, R. M. (2007), [Rainbow Color Map (Still) Considered Harmful](https://doi.org/10.1109/MCG.2007.323435). *IEEE Computer Graphics and Applications*, 27(2). Why rainbow colour scales mislead.

<LearnCta position="bottom" chart="3D surface plot" demo="3d-surface-mesh-chart" docs="/3d-charts/chart-types/surface-mesh-3d/" />
