---
sidebar_position: 9.5
sidebar_label: Contour Plot
title: "Contour Plot: What It Is & How to Read It (With Interactive Examples)"
description: "What a contour plot is, how to read its lines of equal value, peaks, saddles and spacing, how it compares with a heatmap and a 3D surface, and the mistakes to avoid. With a live example."
keywords:
    [
        "contour plot",
        "contour map",
        "contour chart",
        "contour graph",
        "what is a contour plot",
        "how to read a contour plot",
        "filled contour plot",
        "contour plot vs surface plot"
    ]
image: /img/learn/contour-plot-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a contour plot used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A contour plot is used to show how one quantity changes across two others, such as temperature across a surface, pressure across a weather map, a model's error across two settings, or the output of a process across two inputs. It makes peaks, valleys, saddles and steep areas easy to find, and lets you read off where the value crosses a level that matters." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a contour plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Check what x, y and the line values stand for, and how far apart the levels are. Then follow the labels to see which way values rise. Closed rings mark a peak or a dip, lines bunched together mean the value changes quickly, lines spread out mean it changes slowly, and an hourglass shape between two peaks marks a saddle." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a contour plot and a surface plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both show one value for every point of x and y. A surface plot draws the values as a 3D landscape, which makes the overall shape easy to grasp but hides parts behind peaks and makes exact values hard to read. A contour plot shows the same landscape from directly above as flat lines of equal value, so nothing is hidden and levels can be read exactly." }
                },
                {
                    "@type": "Question",
                    "name": "Is a contour plot the same as a contour map?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They use the same idea. A contour map usually means a topographic map, where the lines join points of equal height above sea level. A contour plot is the general chart: the lines can join points of equal temperature, pressure, cost, error or any other value measured across two dimensions." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot contour lines correctly?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Put your values on a regular grid first, interpolating if the measurements are scattered. Choose evenly spaced levels with round numbers, label enough lines that readers can tell uphill from downhill, and use a fine enough grid that lines are smooth. Add a colour scale if you fill or shade between the lines." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a contour plot in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, put your values in a UniformHeatmapDataSeries as a 2D array, then add a UniformContoursRenderableSeries that uses it, setting zMin, zMax and zStep for the levels and dataLabels to label the lines. For colour, add a UniformHeatmapRenderableSeries with the same data series behind the lines. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Contour Plot

## What is a contour plot?

A **contour plot** (also called a **contour chart**, **contour graph** or **contour map**) is a chart that shows how a value changes across two dimensions by drawing lines through points of equal value. Each line is one level, such as 40 °C. Where lines bunch together the value changes quickly; where they spread out it changes slowly.

![A contour plot of temperature across a metal plate: white contour lines every 10 °C, labelled with their values, over a colour background from dark purple for cool areas to pale yellow for hot ones, with two hot spots and a cold right-hand edge](/img/learn/contour-plot-og.png)

*Temperature across a 40 × 30 cm metal plate with two heaters and a water-cooled edge (sample data). Lines mark every 10 °C and colour shows the temperature. [Try the interactive version](#how-to-create-a-contour-plot-in-javascript-react-or-angular).*

:::tip Key takeaways
- A contour plot shows **one value for every point of x and y**, using lines that join points where that value is the same.
- **Spacing is slope:** lines close together mean a fast change, lines far apart a slow one.
- **Closed rings** mark a peak or a dip; an **hourglass** shape between two peaks marks a saddle.
- Adding **colour** between or behind the lines (a filled contour plot, or contours over a heatmap) shows high and low at a glance. Always include a colour scale.
- A contour map of hills and valleys and a contour plot of data work the same way: only the value being mapped changes.
:::

## How to read a contour plot

![Anatomy of a contour plot: a surface with two peaks drawn as labelled lines every 10 units over shaded bands, with numbered markers for a contour line, a line label, the highest peak, a lower peak, the saddle between them, lines close together and lines far apart](./contour-plot-anatomy.svg)

1. **Check the three things being shown.** The x and y axes are two inputs or positions; the lines show a third value, often called z. In the plate chart above, x and y are distances across the plate in centimetres and the lines are temperatures.
2. **Find the interval between lines.** It is usually the same everywhere, for example every 10 °C. That interval is what makes spacing meaningful: two lines always mean the same change in value, wherever they are.
3. **Work out which way is uphill.** Follow the labels from line to line. The same shape of rings can be a hill or a hollow; only the labels, or the colour scale, tell you which.
4. **Look at the spacing.** Bunched lines mean a steep change, wide gaps mean a gentle one. The value is not shown between lines, so estimate it: halfway between the 40 and 50 lines is about 45.
5. **Look for the shapes that matter** (next section): peaks, dips, saddles, ridges and valleys. Their positions are usually the answer the chart was made for, such as the hottest spot or the best combination of two settings.

## How a contour plot works

Picture the data as a landscape, with the value as height. Slice it with flat, horizontal cuts at each level: 20, 40, 60 and so on. Seen from above, the edge of each cut is a contour line. Tall, narrow features cut into many tight rings; broad, low ones into a few wide ones.

![How contour lines are made: above, a side view of a surface with two humps, cut by dashed horizontal lines at 20, 40 and 60; below, the same surface from above, where each cut is a ring of the same colour, and dotted guides link the points where the side view crosses each level to where the matching ring crosses the middle of the top view](./contour-lines-from-slices.svg)

In practice, software doesn't slice a smooth surface. It starts from a **grid**: one value at every crossing point of evenly spaced x and y positions. For each small square of the grid, it checks which corners are above the level and which are below, and draws a short segment across the square where the value must cross the level, estimating the exact crossing point by straight-line interpolation along each edge. Joined up, the segments form the contour lines. This method is called **marching squares**, the two-dimensional version of the marching cubes algorithm used in 3D graphics.

Two things follow:

- **Your data needs to be on a grid.** If your measurements are scattered (weather stations, survey points, sensors placed by hand), they first need to be **interpolated** onto a regular grid. The chart can only be as good as that interpolation.
- **Grid spacing sets the detail.** A coarse grid gives jagged lines and can miss small features between grid points. A fine grid gives smooth lines but more data to compute.

## What contour plot shapes mean

The same handful of patterns turn up whether the value is height, temperature, pressure or a model's error.

| What you see | What it means | Example in the plate chart |
| --- | --- | --- |
| Closed rings with values rising inwards | A **peak** (local maximum) | The hotter heater, at 81 °C |
| Closed rings with values falling inwards | A **dip** or pit (local minimum) | None on this plate |
| Two sets of rings meeting in an hourglass or X shape | A **saddle**: the low point between two peaks, or the high point between two dips | Between the heaters, at about 43 °C |
| Lines bunched close together | A **steep** change in value | The water-cooled right-hand edge |
| Lines spread far apart, or no lines at all | A **gentle** change, or an almost flat area | The left side of the plate, near room temperature |
| Long, parallel, evenly spaced lines | A **steady slope**: the value changes at a constant rate in one direction | Not on this plate; a plane such as z = x + 2y looks like this |
| Lines bent into a V or U pointing one way | A **ridge** (the V points downhill) or a **valley** (it points uphill) | The warm ridge running from one heater towards the other |
| Lines that run off the edge of the chart | The feature continues beyond the data | The lines along the cooled edge |

### How to describe a contour plot

When you write about a contour plot in a report or a lab notebook, cover the same points each time:

> The value is **highest** at **[where]** (**[value]**) and **lowest** at **[where]** (**[value]**). **[Name the other peaks, dips or saddles.]** The value changes **fastest** near **[where]** and is almost **flat** near **[where]**.

**Worked example,** using the plate chart above:

"The plate is hottest above the left-hand heater, at about 81 °C, 11 cm across and 19 cm up. The second heater makes a lower peak of about 64 °C at 27 cm across and 11 cm up, and the two are joined by a saddle at about 43 °C between them. The coolest point is the water-cooled right-hand edge, at about 10 °C, where the temperature drops by about 19 °C over the last 4 cm. The left-hand side of the plate stays close to room temperature, about 24 °C, with widely spaced lines."

## Types of contour plot

| Type | What it looks like | Good for |
| --- | --- | --- |
| **Line contour plot** | Lines only, often labelled with their values | Reading exact levels; printing in black and white; overlaying on other data |
| **Filled contour plot** | The bands between lines are filled with colour from a colour scale | Seeing high and low at a glance |
| **Contours over a heatmap** | A smoothly coloured [heatmap](/learn/heatmap/) with contour lines drawn on top | Both at once: colour for the overall pattern, lines for exact levels. The chart above is this type |
| **Coloured contour lines** | Each line takes the colour of its own value, with no background | A lighter look, or lines over a map or an image |
| **Density contour plot** | Lines of equal point density, drawn from a [scatter plot](/learn/scatter-plot/) | Showing where points cluster when there are too many to see one by one |
| **Contour map (topographic)** | Lines of equal height above sea level on a map | Hills, valleys and slopes for walkers, engineers and planners |

Lines of equal value have special names in some fields. On weather maps, **isobars** join points of equal pressure and **isotherms** points of equal temperature. In general they are called **isolines**. The idea is the same in each case.

## When to use a contour plot

Use a contour plot when your data is a **surface**: one number for every combination of two continuous values, such as position across a plate, latitude and longitude, or two settings of a machine or a model. It is the right choice when the reader needs to find peaks, dips and saddles, or read off where the value crosses a particular level.

| Chart | Best for |
| --- | --- |
| **Contour plot** | Exact levels across a smooth surface; finding peaks, saddles and steep areas; comparing against a threshold |
| [Heatmap](/learn/heatmap/) | A value for every combination of two dimensions, including categories such as day and hour; the overall pattern rather than exact levels |
| [3D surface plot](/learn/3d-surface-plot/) | The overall shape of a surface as a 3D landscape. Easier to grasp at first sight, but peaks hide what's behind them and values are hard to read |
| [Scatter plot](/learn/scatter-plot/) | Individual measurements of two values, before they are gridded into a surface |

Contour plots and heatmaps are often combined. The heatmap gives a quick picture of where values are high and low; the lines add exact levels and make slopes visible.

## Common contour plot mistakes

- **Leaving out the line labels or colour scale.** Without them, a hill and a hollow look the same.
- **Uneven intervals.** If the levels are 10, 20, 50 and 100, the spacing of the lines no longer shows the slope. Keep the step constant, or say clearly that it isn't.
- **Too many lines.** A level every 1 °C on a plate that spans 70 °C draws 70 lines that merge into a solid smudge. Pick a step that gives roughly 5 to 15 lines, and make every fifth or every second line bolder.
- **Too few lines.** With only two or three levels, peaks and saddles fall between them and disappear.
- **Using a rainbow colour scale.** Its sudden changes in brightness create edges that aren't in the data. Use a perceptually uniform scale such as viridis, magma or inferno, as for any heatmap.
- **Trusting lines in areas with no data.** When scattered points are interpolated onto a grid, the lines in gaps between points are guesses. Show where the measurements were taken, or blank out areas too far from any of them.
- **Stretching one axis.** If x and y are both distances, give them the same scale, or circles look like ellipses and slopes look steeper in one direction than the other.

## How to create a contour plot in JavaScript, React or Angular

SciChart.js draws contour plots with WebGL and WebGPU, so large grids stay smooth to zoom and pan and can be updated in real time. Try the chart below: scroll to zoom, drag to pan, double-click to reset, and hover anywhere to read the temperature at that point.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="contour plot" demo="heatmap-chart-with-contours" docs="/2d-charts/chart-types/uniform-contours-renderable-series/" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
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

        // zValues is a 2D array on a regular grid: zValues[row][column]
        const zValues = getYourGridData();
        const dataSeries = new UniformHeatmapDataSeries(wasmContext, { zValues, xStart: 0, xStep: 1, yStart: 0, yStep: 1 });

        // Colour behind the lines
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries,
                colorMap: new HeatmapColorMap({
                    minimum: 0,
                    maximum: 100,
                    gradientStops: [
                        { offset: 0, color: "#000004" },
                        { offset: 0.5, color: "#B63679" },
                        { offset: 1, color: "#FCFDBF" }
                    ]
                })
            })
        );
        // Contour lines every 10, labelled with their values
        sciChartSurface.renderableSeries.add(
            new UniformContoursRenderableSeries(wasmContext, {
                dataSeries,
                zMin: 0,
                zMax: 100,
                zStep: 10,
                stroke: "#FFFFFF",
                strokeThickness: 2,
                dataLabels: { style: { fontSize: 14 }, color: "#FFFFFF", precision: 0 }
            })
        );
        return { sciChartSurface };
    };

    export const ContourPlot = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-contour-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class ContourPlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

            // zValues is a 2D array on a regular grid: zValues[row][column]
            const zValues = getYourGridData();
            const dataSeries = new UniformHeatmapDataSeries(wasmContext, { zValues, xStart: 0, xStep: 1, yStart: 0, yStep: 1 });

            // Colour behind the lines
            sciChartSurface.renderableSeries.add(
                new UniformHeatmapRenderableSeries(wasmContext, {
                    dataSeries,
                    colorMap: new HeatmapColorMap({
                        minimum: 0,
                        maximum: 100,
                        gradientStops: [
                            { offset: 0, color: "#000004" },
                            { offset: 0.5, color: "#B63679" },
                            { offset: 1, color: "#FCFDBF" }
                        ]
                    })
                })
            );
            // Contour lines every 10, labelled with their values
            sciChartSurface.renderableSeries.add(
                new UniformContoursRenderableSeries(wasmContext, {
                    dataSeries,
                    zMin: 0,
                    zMax: 100,
                    zStep: 10,
                    stroke: "#FFFFFF",
                    strokeThickness: 2,
                    dataLabels: { style: { fontSize: 14 }, color: "#FFFFFF", precision: 0 }
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html) holds the grid as a 2D array, `zValues[row][column]`. `xStart`, `xStep`, `yStart` and `yStep` place the grid points on the axes. The heatmap and the contours share one data series.
- A [UniformContoursRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformcontoursrenderableseries.html) draws the lines. `zMin`, `zMax` and `zStep` set the levels; `zLevels` takes a list of exact levels instead. `minorsPerMajor`, `majorLineStyle` and `minorLineStyle` add fainter lines between the main ones, and `dataLabels` writes each line's value on it.
- Colour comes from a [HeatmapColorMap](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html), either on a `UniformHeatmapRenderableSeries` behind the lines or on the contour series itself with `colorMapMode`, which colours each line by its own value. Add a `HeatmapLegend` so readers can turn colours back into values.
- To update the plot live, call `setZValues()` on the data series with a new 2D array; the lines are recalculated.

**See it in the demo app:** [JavaScript contour plot](https://www.scichart.com/demo/javascript/heatmap-chart-with-contours) · [React contour plot](https://www.scichart.com/demo/react/heatmap-chart-with-contours) · [Angular contour plot](https://www.scichart.com/demo/angular/heatmap-chart-with-contours)

**Go deeper:** [SciChart.js contour plot documentation](/2d-charts/chart-types/uniform-contours-renderable-series/), including contours at chosen levels, colouring each line by its value and labels that follow the lines. For the colour background, see the [heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/).

## Frequently asked questions

### What is a contour plot used for?

A contour plot is used to show how one quantity changes across two others, such as temperature across a surface, pressure across a weather map, a model's error across two settings, or the output of a process across two inputs. It makes peaks, valleys, saddles and steep areas easy to find, and lets you read off where the value crosses a level that matters.

### How do you read a contour plot?

Check what x, y and the line values stand for, and how far apart the levels are. Then follow the labels to see which way values rise. Closed rings mark a peak or a dip, lines bunched together mean the value changes quickly, lines spread out mean it changes slowly, and an hourglass shape between two peaks marks a saddle.

### What is the difference between a contour plot and a surface plot?

Both show one value for every point of x and y. A surface plot draws the values as a 3D landscape, which makes the overall shape easy to grasp but hides parts behind peaks and makes exact values hard to read. A contour plot shows the same landscape from directly above as flat lines of equal value, so nothing is hidden and levels can be read exactly.

### Is a contour plot the same as a contour map?

They use the same idea. A contour map usually means a topographic map, where the lines join points of equal height above sea level. A contour plot is the general chart: the lines can join points of equal temperature, pressure, cost, error or any other value measured across two dimensions.

### How do I plot contour lines correctly?

Put your values on a regular grid first, interpolating if the measurements are scattered. Choose evenly spaced levels with round numbers, label enough lines that readers can tell uphill from downhill, and use a fine enough grid that lines are smooth. Add a colour scale if you fill or shade between the lines.

### How do I make a contour plot in JavaScript?

With SciChart.js, put your values in a `UniformHeatmapDataSeries` as a 2D array, then add a `UniformContoursRenderableSeries` that uses it, setting `zMin`, `zMax` and `zStep` for the levels and `dataLabels` to label the lines. For colour, add a `UniformHeatmapRenderableSeries` with the same data series behind the lines. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- NIST/SEMATECH, [e-Handbook of Statistical Methods, section 1.3.3.10: Contour Plot](https://www.itl.nist.gov/div898/handbook/eda/section3/contour.htm). What a contour plot shows, and why the data must be on a regular grid or interpolated onto one.
- Lorensen, W. E. and Cline, H. E. (1987), [Marching cubes: A high resolution 3D surface construction algorithm](https://doi.org/10.1145/37402.37422). *ACM SIGGRAPH Computer Graphics*, 21(4). The algorithm whose two-dimensional form, marching squares, traces contour lines on a grid.
- Borland, D. and Taylor, R. M. (2007), [Rainbow Color Map (Still) Considered Harmful](https://doi.org/10.1109/MCG.2007.323435). *IEEE Computer Graphics and Applications*, 27(2). Why rainbow colour scales mislead.

<LearnCta position="bottom" chart="contour plot" demo="heatmap-chart-with-contours" docs="/2d-charts/chart-types/uniform-contours-renderable-series/" />
