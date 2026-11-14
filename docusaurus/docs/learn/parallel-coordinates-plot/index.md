---
sidebar_position: 8.6
sidebar_label: Parallel Coordinates Plot
title: "Parallel Coordinates Plot: What It Is & How to Read It (With Interactive Examples)"
description: "What a parallel coordinates plot is, how to read its axes and lines, when to use one instead of a scatter plot or radar chart, and the mistakes to avoid."
keywords:
    [
        "parallel coordinates plot",
        "parallel coordinates",
        "parallel coordinate chart",
        "parallel coordinate plot",
        "what is a parallel coordinates plot",
        "how to read a parallel coordinates plot",
        "multivariate data visualisation",
        "parallel coordinates vs radar chart"
    ]
image: /img/learn/parallel-coordinates-plot-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a parallel coordinates plot show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A parallel coordinates plot shows how many records compare across many variables at once. Each variable is a vertical axis and each record is a line across them, so you can see which variables rise and fall together, which records form groups, and which records are outliers. It is a way to explore data with more variables than a scatter plot can show." }
                },
                {
                    "@type": "Question",
                    "name": "What is an example of a parallel coordinates plot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A common example compares products on several specifications. For electric cars, the axes could be price, battery size, range, 0 to 100 km/h time, weight and energy use, with one line per car coloured by type. The plot then shows that price and battery size rise together, that quicker cars tend to have more range, and that SUVs stand apart from saloons on weight and energy use." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a parallel coordinates plot and a radar chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both draw each record as a line joining its values on several axes. A radar chart arranges the axes in a circle, so each record becomes a closed shape, which works for a handful of records. A parallel coordinates plot sets the axes side by side, which keeps them straight and easier to compare, and copes with hundreds or thousands of records." }
                },
                {
                    "@type": "Question",
                    "name": "How many variables can a parallel coordinates plot show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "There is no fixed limit: each variable is just one more axis. In practice the width of the screen sets the limit, because the space between axes shrinks as you add them. Only neighbouring axes can be compared directly, so with many variables it helps to reorder the axes or plot a selection of them." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a parallel coordinates plot in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Give each variable its own vertical axis, scale every value to between 0 and 1 on its axis, and draw each record as a line through its scaled values. With SciChart.js you draw each record as a FastLineRenderableSeries, add one inner NumericAxis per variable placed by a layout strategy, and add a custom modifier for hover highlighting and brushing. The same code works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Parallel Coordinates Plot

## What is a parallel coordinates plot?

A **parallel coordinates plot** (also called a parallel coordinates chart or parallel coordinate plot) is a chart for data with many variables. Each variable gets its own vertical axis, the axes stand side by side, and each record is a line that crosses every axis at its value. It shows patterns, groups and outliers across all the variables at once.

![A parallel coordinates plot of 150 electric cars across six vertical axes: price, battery size, range, 0 to 100 km/h time, weight and energy use. Each car is one line, coloured blue for city cars, orange for saloons and pink for SUVs. The three types form separate bands, and the lines cross in an X between range and acceleration time](/img/learn/parallel-coordinates-plot-og.png)

*A parallel coordinates plot of 150 electric cars of three types (sample data). [Try the interactive version](#how-to-create-a-parallel-coordinates-plot-in-javascript-react-or-angular).*

:::tip Key takeaways
- A parallel coordinates plot shows **many records across many variables**: one vertical axis per variable, one line per record.
- **Lines that run parallel** between two axes mean those variables rise together. **Lines that cross in an X** mean one falls as the other rises.
- **Colour** marks groups, and lines that leave their group's band are **outliers**.
- **Only neighbouring axes compare directly,** so the order of the axes changes what you can see.
- With many lines, use **transparency and brushing** (filtering on an axis) to keep the plot readable.
:::

## How to read a parallel coordinates plot

![The parts of a parallel coordinates plot: four vertical axes for price, battery size, range and 0 to 100 km/h time, each with its own scale, and three lines, one per car. Numbered markers show an axis, a line with its four values labelled, lines running parallel between battery and range, and lines crossing in an X between range and acceleration time](./parallel-coordinates-anatomy.svg)

1. **Read the axes first.** Each vertical axis is one variable, with its own name, unit and scale. Check where each scale starts and ends: two axes at the same height can mean very different numbers.
2. **Follow one line.** A line is one record, such as one car, one patient or one test run. Where it crosses an axis is that record's value for that variable. In the diagram, the orange saloon costs $75k, has a 75 kWh battery and 470 km of range, and reaches 100 km/h in 4.5 seconds.
3. **Look at the space between each pair of axes.** The slopes there show how the two variables relate. Lines that run roughly parallel mean the two rise and fall together. Lines that cross in an X mean that high values on one axis go with low values on the other.
4. **Look for bands and colours.** Lines that travel together form a group. When colour marks a category, check whether each colour keeps to its own band; where it does, that variable separates the groups.
5. **Spot the outliers.** A line that leaves its band, or reaches the far end of an axis on its own, is a record worth a closer look.

### Brushing and reordering axes

On an interactive plot, you can **brush** an axis: drag along it to select a range of values. Lines that pass through the range stay bright and the rest fade, so you can ask questions such as "what else do the cars with the biggest batteries have in common?" Brush two or more axes and only lines that pass through every range stay bright. Many tools also let you **drag an axis** to a new position, so that two variables you want to compare sit next to each other.

## Patterns between two axes

Each pair of neighbouring axes works like a small scatter plot, drawn in a different way. The same five records give these shapes:

![Three panels comparing a scatter plot and two parallel axes for the same five records. Positive relationship: the dots climb to the right and the lines run parallel. Negative relationship: the dots fall to the right and the lines all cross at one point. No relationship: the dots are scattered and the lines cross at random](./parallel-coordinates-patterns.svg)

| Pattern between two axes | What it means | Scatter plot equivalent |
| --- | --- | --- |
| Lines run roughly parallel | **Positive relationship:** the two variables rise and fall together | Dots climbing from bottom left to top right |
| Lines cross near one point, in an X | **Negative relationship:** one rises as the other falls | Dots falling from top left to bottom right |
| Lines cross at random | **No clear relationship** | A shapeless cloud |
| Lines split into separate bands | **Groups:** records fall into clusters on these variables | Separate clumps of dots |
| One line far from the others | **Outlier:** a record unlike the rest | A dot far from the cloud |

The "cross near one point" pattern surprises most readers: a strong negative relationship looks like an X, not like lines sloping downhill. Flipping one of the two axes (putting its highest value at the bottom) turns the X into parallel lines, which is why some tools let you flip axes.

## A worked example: comparing electric cars

The chart at the top of this page compares 150 electric cars of three types (50 city cars, 50 saloons and 50 SUVs) on six variables. The data is made up for this guide, but realistic in shape. These are the average values for each type:

| Type | Price | Battery | Range | 0–100 km/h | Weight | Energy use |
| --- | --- | --- | --- | --- | --- | --- |
| City car | $30k | 46 kWh | 326 km | 10.2 s | 1,280 kg | 141 Wh/km |
| Saloon | $74k | 73 kWh | 449 km | 4.5 s | 2,010 kg | 161 Wh/km |
| SUV | $85k | 82 kWh | 393 km | 5.7 s | 2,520 kg | 208 Wh/km |

Reading the plot from left to right:

- **Price and battery:** the lines run nearly parallel. The more a car costs, the bigger its battery.
- **Range and 0–100 km/h time:** the lines cross in an X. Cars with more range tend to be quicker, so a long range sits opposite a short acceleration time.
- **Weight and energy use:** the three colours separate into bands. SUVs are the heaviest and use the most energy per kilometre.
- **The insight that needs several axes at once:** SUVs carry bigger batteries than saloons (82 against 73 kWh on average), yet go less far (393 against 449 km). Their weight and energy use explain why. A single scatter plot of battery against range would show the gap but not the reason.

The table holds the averages; the plot holds all 150 cars, so it also shows the spread within each type and the cars that don't fit their group.

### How to describe a parallel coordinates plot

Use this template when you report a parallel coordinates plot:

> In **[data set]**, **[variable A]** and **[variable B]** rise together, while **[variable C]** falls as **[variable D]** rises. **[Group]** stands apart on **[variables]**, and **[record]** is an outlier on **[variable]**.

**Worked example:** "In this sample of 150 electric cars, price and battery size rise together, while quicker cars tend to have more range. SUVs stand apart on weight and energy use: they carry bigger batteries than saloons but go less far, because they are heavier and use more energy per kilometre."

## When to use a parallel coordinates plot

Use a parallel coordinates plot when you have **many records measured on several numeric variables** and want to see them all at once:

- **comparing products or designs** on several specifications, as in the car example;
- **finding trade-offs** in engineering and optimisation, for example which designs are both light and strong;
- **tuning machine learning models,** with one axis per setting and one for the score, to see which settings give the best results;
- **checking sensor and test data,** to find runs that behave differently from the rest;
- **profiling customers or patients** across many measurements to find groups.

| Chart | Best for |
| --- | --- |
| **Parallel coordinates plot** | Many records across many variables (roughly 4 to 15): groups, trade-offs and outliers |
| [Scatter plot](/learn/scatter-plot/) | The relationship between two variables, shown in detail |
| [Radar chart](/learn/radar-chart/) | A few records (one to five) compared on the same variables, as shapes round a circle |
| [Heatmap](/learn/heatmap/) | A grid of records and variables shown as colours, when you need the overall picture more than individual records |

A **radar chart** is the circular cousin of a parallel coordinates plot: bend the row of axes into a circle and join the ends, and each record becomes a closed shape. That works well for a few records but becomes a tangle with many. A **scatter plot matrix**, a grid of scatter plots for every pair of variables, shows each pair in full but takes much more space.

## Common parallel coordinates plot mistakes

- **Too many solid lines.** Hundreds of opaque lines merge into a block of colour. Make the lines partly transparent, highlight the line under the mouse, and let readers brush axes to filter.
- **A careless axis order.** Only neighbouring axes compare directly. Put variables you expect to be related next to each other, and try a few orders before settling on one.
- **Hiding the scales.** Each axis has its own scale, so a line at the top of one axis and the bottom of the next isn't a fall in value. Label each axis with its unit and range.
- **Stretching every axis to its own minimum and maximum without saying so.** That makes small differences look large. Choose sensible ranges, such as starting a count at zero, and keep them fixed while readers explore.
- **Mixing directions.** If "better" is up on one axis and down on the next (higher range but lower acceleration time), good records zig-zag. Flip an axis when it helps, and say so in its title.
- **Category variables as axes.** A variable with only a few values, such as car type, piles every line onto a few points. Show it with colour instead.
- **Too many colours.** Use colour for one category with a few groups, or to mark a selection. Eight or more colours become hard to tell apart.

## How to create a parallel coordinates plot in JavaScript, React or Angular

SciChart.js has no single parallel coordinates series, but its line series and inner axes combine into one. Because SciChart.js draws with WebGL and WebGPU, the plot stays smooth with many lines. Try the plot below: hover over a line to highlight it and see its values, drag up or down along an axis to filter, click the axis to clear the filter, scroll to zoom, drag between the axes to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="parallel coordinates plot" demo="parallel-coordinates-chart" docs="/2d-charts/chart-types/parallel-coordinate-plot/" />

Here is the code for this plot. The data is plain JSON: a list of dimensions (one per axis), a list of types (for colour), and a list of records, each with one value per dimension:

```json
{
    "dimensions": [{ "title": "Price ($k)", "min": 20, "max": 100 }, { "title": "Range (km)", "min": 200, "max": 600 }],
    "types": [{ "name": "City car", "color": "#50C7E0" }, { "name": "SUV", "color": "#E8336D" }],
    "records": [{ "name": "City car 1", "type": 0, "values": [31, 340] }]
}
```

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection,
        SciChartJsNavyTheme
    } from "scichart";
    // addParallelCoordinates and ParallelCoordinatesModifier from the JavaScript tab, saved as parallel-coordinates.ts
    import { addParallelCoordinates, ParallelCoordinatesModifier } from "./parallel-coordinates";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // { dimensions: [{ title, min, max }], types: [{ name, color }], records: [{ name, type, values }] }
        const plot = addParallelCoordinates(sciChartSurface, wasmContext, getYourParallelCoordinatesData());

        sciChartSurface.chartModifiers.add(
            new ParallelCoordinatesModifier(plot),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { sciChartSurface };
    };

    export const ParallelCoordinatesPlot = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection,
        SciChartJsNavyTheme
    } from "scichart";
    // addParallelCoordinates and ParallelCoordinatesModifier from the JavaScript tab, saved as parallel-coordinates.ts
    import { addParallelCoordinates, ParallelCoordinatesModifier } from "./parallel-coordinates";

    @Component({
        selector: "app-parallel-coordinates-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class ParallelCoordinatesPlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // { dimensions: [{ title, min, max }], types: [{ name, color }], records: [{ name, type, values }] }
            const plot = addParallelCoordinates(sciChartSurface, wasmContext, getYourParallelCoordinatesData());

            sciChartSurface.chartModifiers.add(
                new ParallelCoordinatesModifier(plot),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- **One line per record.** Every value is scaled to between 0 and 1 on its own axis, and each record is drawn as a [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series/) through its scaled values, against one hidden 0 to 1 axis. Its colour comes from the record's type.
- **One axis per variable.** Each variable has its own `NumericAxis` with `isInnerAxis: true` and a fixed range, so its labels show real values. `ParallelAxesLayoutStrategy` extends `LeftAlignedInnerAxisLayoutStrategy` to place axis number *i* at x = *i* and line it up with the 0 to 1 band of the hidden axis ([inner axis layout](/2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout/)).
- **Hover and brushing.** `ParallelCoordinatesModifier` extends `CustomChartModifier2D` ([custom chart modifiers](/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/)). On mouse move it finds the line nearest the mouse and draws it on top; a drag on an axis draws a `BoxAnnotation` and fades every line outside it. Setting `args.handled = true` stops the pan modifier from also acting on that drag.
- **Zoom and pan sideways only** (`EXyDirection.XDirection`), so every axis keeps the scale its labels show. Axis titles, the legend and the tooltip are [NativeTextAnnotations](/2d-charts/annotations-api/native-text-annotation/).

**See it in the demo app:** [JavaScript parallel coordinates plot](https://www.scichart.com/demo/javascript/parallel-coordinates-chart) · [React parallel coordinates plot](https://www.scichart.com/demo/react/parallel-coordinates-chart) · [Angular parallel coordinates plot](https://www.scichart.com/demo/angular/parallel-coordinates-chart)

**Go deeper:** [SciChart.js parallel coordinates plot documentation](/2d-charts/chart-types/parallel-coordinate-plot/), including axis reordering, smooth curves and drawing very large numbers of records as a single series.

## Frequently asked questions

### What does a parallel coordinates plot show?

A parallel coordinates plot shows how many records compare across many variables at once. Each variable is a vertical axis and each record is a line across them, so you can see which variables rise and fall together, which records form groups, and which records are outliers. It is a way to explore data with more variables than a scatter plot can show.

### What is an example of a parallel coordinates plot?

A common example compares products on several specifications. For electric cars, the axes could be price, battery size, range, 0 to 100 km/h time, weight and energy use, with one line per car coloured by type. The plot then shows that price and battery size rise together, that quicker cars tend to have more range, and that SUVs stand apart from saloons on weight and energy use.

### What is the difference between a parallel coordinates plot and a radar chart?

Both draw each record as a line joining its values on several axes. A radar chart arranges the axes in a circle, so each record becomes a closed shape, which works for a handful of records. A parallel coordinates plot sets the axes side by side, which keeps them straight and easier to compare, and copes with hundreds or thousands of records.

### How many variables can a parallel coordinates plot show?

There is no fixed limit: each variable is just one more axis. In practice the width of the screen sets the limit, because the space between axes shrinks as you add them. Only neighbouring axes can be compared directly, so with many variables it helps to reorder the axes or plot a selection of them.

### How do I make a parallel coordinates plot in JavaScript?

Give each variable its own vertical axis, scale every value to between 0 and 1 on its axis, and draw each record as a line through its scaled values. With SciChart.js you draw each record as a `FastLineRenderableSeries`, add one inner `NumericAxis` per variable placed by a layout strategy, and add a custom modifier for hover highlighting and brushing. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Inselberg, A. (1985), [The plane with parallel coordinates](https://doi.org/10.1007/BF01898350). *The Visual Computer*, 1(2), 69–91. The paper that set out parallel coordinates as a way to show many dimensions on a flat page.
- Wegman, E. J. (1990), [Hyperdimensional data analysis using parallel coordinates](https://doi.org/10.1080/01621459.1990.10474926). *Journal of the American Statistical Association*, 85(411), 664–675. How to use parallel coordinates to explore statistical data, including reading relationships between neighbouring axes.
- Inselberg, A. (2009), [Parallel Coordinates: Visual Multidimensional Geometry and Its Applications](https://doi.org/10.1007/978-0-387-68628-8). Springer. A book-length treatment of the method and its uses.

<LearnCta position="bottom" chart="parallel coordinates plot" demo="parallel-coordinates-chart" docs="/2d-charts/chart-types/parallel-coordinate-plot/" />
