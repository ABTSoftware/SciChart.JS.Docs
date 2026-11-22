---
sidebar_position: 10
sidebar_label: Cartesian Graph
title: "Cartesian Graph: What It Is & How to Read It (Interactive Example)"
description: "What a Cartesian graph is: the x and y axes, the origin, ordered pairs, the four quadrants and scale. How to read and plot points, and how it compares with polar coordinates."
keywords:
    [
        "cartesian graph",
        "cartesian plane",
        "cartesian coordinates",
        "x and y axis",
        "quadrants",
        "coordinate plane",
        "how to read a cartesian graph",
        "cartesian vs polar coordinates"
    ]
image: /img/learn/cartesian-graph-og.png
related: [xyz-graph, log-scale-graph, scatter-plot, line-chart]
datePublished: 2026-11-16
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How many quadrants are on a Cartesian plane?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Four. The x-axis and y-axis cross at the origin and split the plane into four quadrants, numbered I to IV anticlockwise starting from the top right. In quadrant I both coordinates are positive; in II, x is negative and y positive; in III, both are negative; in IV, x is positive and y negative. Points that lie on an axis belong to no quadrant." }
                },
                {
                    "@type": "Question",
                    "name": "What is an ordered pair?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An ordered pair is the two numbers that give a point's position on a Cartesian graph, written in brackets as (x, y). The first number is the x-coordinate: how far to move left or right from the origin. The second is the y-coordinate: how far to move up or down. The order matters, because (2, 5) and (5, 2) are different points." }
                },
                {
                    "@type": "Question",
                    "name": "How do you convert Cartesian coordinates to polar coordinates?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For a point (x, y), the polar distance is r = √(x² + y²) and the angle is θ = arctan(y ÷ x), adjusted for the quadrant the point is in (a calculator's atan2 function does this for you). For example, (3, 4) becomes r = 5 and θ ≈ 53.1°. To go back, use x = r cos θ and y = r sin θ." }
                },
                {
                    "@type": "Question",
                    "name": "Who invented the Cartesian coordinate system?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It is named after the French philosopher and mathematician René Descartes. In La Géométrie, published in 1637, he described geometric shapes with algebra, which is the idea behind placing points and curves on a grid with numbered axes." }
                },
                {
                    "@type": "Question",
                    "name": "Are Cartesian coordinates just x, y and z?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Mostly, yes. A flat Cartesian graph uses two coordinates, x and y. Add a third axis at right angles to both, usually called z, and every point in space has three coordinates (x, y, z). The idea extends to any number of dimensions, but you can only draw two or three at once." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a Cartesian graph in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChartSurface with a NumericAxis for x and one for y. To make the axes cross at the origin, as on a maths graph, set the surface's layoutManager to a CentralAxesLayoutManager in DataValue mode at position 0, and set isInnerAxis: true on both axes. Then add your points as a scatter or line series, or as annotations. For React, pass the same setup to scichart-react; for Angular, to scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Cartesian Graph

## What is a Cartesian graph?

A **Cartesian graph** (also called a Cartesian plane, coordinate plane or x-y graph) is a flat grid with two number lines at right angles: a horizontal **x-axis** and a vertical **y-axis**, which cross at the **origin** (0, 0). Every point has an address of two numbers, (x, y): how far across and how far up it is.

![A Cartesian plane drawn in a dark theme, with a white x-axis from minus 12 to 12 and a y-axis from minus 8 to 8 crossing at the origin. Four labelled quadrants (I top right, II top left, III bottom left, IV bottom right, each with its signs) and four cyan points, A (3, 4), B (−5, 2), C (−4, −3) and D (6, −5), each with orange dashed guide lines to both axes](/img/learn/cartesian-graph-og.png)

*Four points, one in each quadrant, with dashed guides showing how each one's x and y are read off the axes. [Try the interactive version](#how-to-create-a-cartesian-graph-in-javascript-react-or-angular) and drag the points.*

:::tip Key takeaways
- A Cartesian graph locates every point with two numbers, (x, y): the distance across from the origin, then the distance up.
- The x value always comes first, so (2, 5) and (5, 2) are different points.
- The axes split the plane into four quadrants, numbered I to IV anticlockwise from the top right. The signs of x and y tell you which one a point is in.
- Almost every data chart is a Cartesian graph. Line charts, scatter plots, bar charts and heatmaps all place values on an x-axis and a y-axis. Usually only the top-right quadrant is shown.
- The main alternative is polar coordinates (a distance and an angle), used by radar and polar area charts.
:::

## How to read a Cartesian graph

To read a point on a Cartesian graph, go across to its x value, then up or down to its y value, starting from the origin.

![An annotated Cartesian plane with an x-axis from minus 8 to 8 and a y-axis from minus 6 to 6, crossing at the origin O (0, 0). The four quadrants are shaded and labelled with their signs: I (+, +) top right, II (−, +) top left, III (−, −) bottom left, IV (+, −) bottom right. Point P (−3, 2) is reached by two orange arrows, first 3 left along the x-axis, then 2 up. Point Q (4, −2) is in quadrant IV, with dashed lines to both axes. A note says one grid square is one unit across and up](./cartesian-plane-anatomy.svg)

A Cartesian graph has four parts.

| Part | What it is | Good to know |
| --- | --- | --- |
| x-axis | The horizontal number line | Values grow to the right. Left of the origin they're negative |
| y-axis | The vertical number line | Values grow upwards. Below the origin they're negative |
| Origin | Where the axes cross, at (0, 0) | Every position is measured from here |
| Ordered pair (x, y) | A point's two coordinates | The x-coordinate is also called the abscissa, the y-coordinate the ordinate |

To plot a point, such as P (−3, 2):

1. Start at the origin.
2. Move along the x-axis by the first number. Positive means right, negative means left. For −3, go 3 units left.
3. Then move parallel to the y-axis by the second number. Positive means up, negative means down. For 2, go 2 units up.
4. Mark the point and label it with its name and coordinates: P (−3, 2).

To read a point that's already plotted, do it in reverse: drop a line straight down (or up) from the point to the x-axis and read the x value, then go straight across to the y-axis and read the y value. The dashed guides in the diagram and the live demo do exactly this.

### How to describe a point on a Cartesian graph

When you write or say where a point is, give its name, its coordinates and the moves from the origin:

> Point [name] is at ([x], [y]): [x] units [left / right] of the origin and [y] units [up / down], in quadrant [I / II / III / IV].

For example: "Point P is at (−3, 2): 3 units left of the origin and 2 units up, in quadrant II."

## The four quadrants

The two axes cut the plane into four regions called **quadrants**. They're numbered with Roman numerals, anticlockwise, starting at the top right. A point's signs tell you its quadrant without drawing anything.

| Quadrant | Position | Sign of x | Sign of y | Example | In a data chart, this could be… |
| --- | --- | --- | --- | --- | --- |
| I | Top right | + | + | (3, 4) | Sales over time, height against weight: most charts live here |
| II | Top left | − | + | (−5, 2) | A value before a reference time, such as a sensor reading 5 seconds before a trigger |
| III | Bottom left | − | − | (−4, −3) | Two changes that both fell, such as a stock's return against the market's on a bad day |
| IV | Bottom right | + | − | (6, −5) | A loss or a temperature below zero, plotted against time |

A point that sits on an axis is in no quadrant. (0, 3) is on the y-axis, (−2, 0) is on the x-axis, and the origin is on both.

Quadrants matter in data charts too. On a scatter plot of two changes, such as this year's growth against last year's, each quadrant is a different story: up both years, down both years, or a reversal. That's why some charts draw their axes through the middle of the data, or through its averages, instead of along the edges.

## Scale and units: what one step on an axis means

The **scale** of an axis is the value of each step between gridlines. The **units** are what is being measured: seconds, metres, euros, °C.

- On an ordinary (linear) axis, every step is the same size. The jump from 2 to 4 is as wide as from 8 to 10.
- The two axes can use different scales, and in data charts they almost always do: an x-axis in days and a y-axis in thousands of visitors. On a maths graph, both axes usually use the same scale, so that shapes keep their true proportions.
- Read the labels before the shape. A line that looks steep may rise only a little if the y-axis steps are small. Check the step size and units on both axes before you compare slopes.
- The axes don't have to start at zero, or cross at it. Data charts usually put the axes along the bottom and left edges and zoom to the range of the data, so the origin may be off the chart altogether. That's fine for lines and points, but not for bars (see the mistakes below).
- Not every axis is linear. On a [log scale graph](/learn/axes-and-scales/log-scale-graph/), each step multiplies the value (1, 10, 100, 1,000) instead of adding to it, which fits data that spans many orders of magnitude.

## From the Cartesian plane to data charts

Most of the charts you meet are Cartesian graphs with the maths taken out: the axes stand for real quantities, and only the part of the plane that holds the data is drawn, usually the top-right quadrant. What changes from chart to chart is what x and y stand for and how each data point is drawn.

| Chart | x-axis | y-axis | Each data point is drawn as |
| --- | --- | --- | --- |
| [Line chart](/learn/chart-types/cartesian/line-chart/) | Time or another ordered value | A measured value | A point joined to the next by a line |
| [Scatter plot](/learn/chart-types/cartesian/scatter-plot/) | One measured variable | A second measured variable | A dot at (x, y) |
| [Bar chart](/learn/chart-types/cartesian/bar-chart/) | Categories (on a column chart) | An amount | A bar from zero up to the value |
| [Candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) | Time | Price | A candle showing the open, high, low and close |
| [Heatmap](/learn/chart-types/cartesian/heatmap/) | One position or category | Another | A coloured cell, with a third value shown as colour |

So "x and y" on a data chart mean the same as on a maths graph: x is the **independent** variable (what you choose or what time it is), and y is the **dependent** one (what you measure). A few charts aren't Cartesian, such as pie, radar and Sankey charts. All the others are listed in the [types of charts and graphs](/learn/chart-types/) guide.

Add a third axis, z, at right angles to x and y, and each point needs three coordinates (x, y, z). That's how 3D charts such as a [3D surface plot](/learn/chart-types/3d/3d-surface-plot/) place their data.

## Cartesian vs polar coordinates

Cartesian coordinates aren't the only way to describe a position. **Polar coordinates** give a point as a distance from the centre, r, and an angle, θ (theta), measured anticlockwise from the horizontal axis. Both describe the same point.

![Two panels show the same point. Left, on a Cartesian grid, the point (3, 4) is reached with x = 3 across and y = 4 up. Right, on a polar grid of quarter circles and spokes every 15 degrees, the same point is reached with a line of length r = 5 at an angle of about 53.1 degrees. A note gives r = √(3² + 4²) = 5 and θ = arctan(4 ÷ 3) ≈ 53.1°](./cartesian-vs-polar.svg)

To convert (the [Sources](#sources) give the formulas):

| From | To | Formula | Example |
| --- | --- | --- | --- |
| Cartesian (x, y) | Polar (r, θ) | r = √(x² + y²), θ = arctan(y ÷ x), adjusted for the quadrant | (3, 4) → r = 5, θ ≈ 53.1° |
| Polar (r, θ) | Cartesian (x, y) | x = r cos θ, y = r sin θ | r = 2, θ = 90° → (0, 2) |

On its own, arctan can't tell opposite quadrants apart: arctan(4 ÷ 3) and arctan(−4 ÷ −3) both give about 53.1°, but (3, 4) is in quadrant I and (−3, −4) is in quadrant III, so the second angle is 180° larger (about 233.1°). Most programming languages have an `atan2(y, x)` function that does this for you.

### When to use a Cartesian chart or a polar chart

| Use a Cartesian chart when… | Use a polar chart when… |
| --- | --- |
| Both values are amounts on open-ended scales | One value is an angle, a direction or a position in a cycle (hours of the day, months, compass bearings) |
| You compare heights, lengths or slopes | You compare a handful of measures around a circle |
| The data is a time series or a relationship between two measurements | The pattern repeats, so the end should join up with the start |
| Examples: line, scatter, bar, candlestick | Examples: [radar chart](/learn/chart-types/radial/radar-chart/), [polar area chart](/learn/chart-types/radial/polar-area-chart/), wind rose |

Cartesian charts are easier to read precisely, because people judge positions along a straight, common scale better than angles or areas. Choose a polar chart only when the circle itself means something.

## Common mistakes with Cartesian graphs

Most mistakes with Cartesian graphs come from mixing up the axes, their signs or their scales.

- **Swapping x and y.** (2, 5) is not (5, 2). Across first, then up: x comes before y, as in the alphabet.
- **Numbering the quadrants the wrong way.** They go anticlockwise from the top right: I, II, III, IV. Counting clockwise puts II and IV in the wrong places.
- **Uneven steps on an axis.** Gridlines at 0, 5, 10, 20, 50 look tidy but bend every line drawn through them. Keep steps equal, or use a [log scale](/learn/axes-and-scales/log-scale-graph/) on purpose and label it.
- **Different scales on the two axes when shape matters.** If one unit across is longer than one unit up, a circle looks like an oval and a 45° line looks flatter. For maths graphs, maps and anything geometric, use equal scales.
- **Bars on an axis that doesn't start at zero.** A bar's length stands for its value, so cutting off the bottom of the axis exaggerates the differences. Lines and points don't have this problem.
- **Missing axis titles or units.** "y" tells the reader nothing. Write what each axis measures and in what units: "Temperature (°C)".
- **Forgetting that screen y runs downwards.** In most graphics systems, including HTML, pixel coordinates start at the top-left corner and y grows downwards, the opposite of a maths graph. If you draw your own chart, flip y when converting values to pixels, or use a charting library that does it for you.

## How to create a Cartesian graph in JavaScript, React or Angular

Every 2D chart in SciChart.js is a Cartesian graph: a `SciChartSurface` with an x-axis and a y-axis. Charts usually put the axes on the edges, but the demo below places them inside the chart, crossing at the origin like a maths graph, with four points, one in each quadrant. In it, **drag the cyan points** to new positions and watch their coordinates and quadrant signs change; they snap to whole numbers when you let go. Hover anywhere to read the coordinates under the cursor, scroll to zoom, drag the background to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="Cartesian graph" demo="central-axes" demoLabel="chart with central axes" docs="/2d-charts/axis-api/multi-axis-and-layout/central-axis-layout/" docsLabel="SciChart.js central axis layout documentation" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        CentralAxesLayoutManager,
        EInnerAxisPlacementCoordinateMode,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // Axes inside the chart, crossing at the data value (0, 0)
        sciChartSurface.layoutManager = new CentralAxesLayoutManager({
            horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
            verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
            horizontalAxisPosition: 0,
            verticalAxisPosition: 0
        });
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, { isInnerAxis: true, visibleRange: new NumberRange(-12, 12) })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { isInnerAxis: true, visibleRange: new NumberRange(-8, 8) })
        );

        // Plot the points, and label each one with its (x, y) coordinates
        const points = getYourPoints(); // e.g. [{ x: 3, y: 4 }, { x: -5, y: 2 }]
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: points.map((p) => p.x),
                    yValues: points.map((p) => p.y)
                }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 14, height: 14, fill: "#50C7E0" })
            })
        );
        for (const p of points) {
            sciChartSurface.annotations.add(
                new TextAnnotation({ x1: p.x, y1: p.y, text: `(${p.x}, ${p.y})`, fontSize: 16, xCoordShift: 10 })
            );
        }

        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: false, showAxisLabels: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier()
        );
        return { sciChartSurface };
    };

    export const CartesianGraph = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        CentralAxesLayoutManager,
        EInnerAxisPlacementCoordinateMode,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier
    } from "scichart";

    @Component({
        selector: "app-cartesian-graph",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class CartesianGraphComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // Axes inside the chart, crossing at the data value (0, 0)
            sciChartSurface.layoutManager = new CentralAxesLayoutManager({
                horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
                verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
                horizontalAxisPosition: 0,
                verticalAxisPosition: 0
            });
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, { isInnerAxis: true, visibleRange: new NumberRange(-12, 12) })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { isInnerAxis: true, visibleRange: new NumberRange(-8, 8) })
            );

            // Plot the points, and label each one with its (x, y) coordinates
            const points = getYourPoints(); // e.g. [{ x: 3, y: 4 }, { x: -5, y: 2 }]
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: points.map((p) => p.x),
                        yValues: points.map((p) => p.y)
                    }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 14, height: 14, fill: "#50C7E0" })
                })
            );
            for (const p of points) {
                sciChartSurface.annotations.add(
                    new TextAnnotation({ x1: p.x, y1: p.y, text: `(${p.x}, ${p.y})`, fontSize: 16, xCoordShift: 10 })
                );
            }

            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: false, showAxisLabels: true }),
                new MouseWheelZoomModifier(),
                new ZoomPanModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Every 2D `SciChartSurface` is Cartesian: add a [NumericAxis](/2d-charts/axis-api/axis-types/numeric-axis/) to `xAxes` and to `yAxes`, and each series is drawn at its (x, y) values. Set `visibleRange` on each axis to choose which part of the plane is shown; keep the ranges in proportion to the chart's width and height for equal scales.
- To make the axes cross at the origin, set `sciChartSurface.layoutManager` to a `CentralAxesLayoutManager` with `EInnerAxisPlacementCoordinateMode.DataValue` and positions of 0, and give both axes `isInnerAxis: true`. With `Relative` mode and 0.5 instead, the axes stay in the middle of the chart as you pan.
- Annotations with `isEditable: true` can be dragged. Their `dragDelta` and `dragEnded` events report the new `x1` and `y1` in data coordinates, which is how the demo updates each label and snaps it to whole numbers.
- `CursorModifier` with `showAxisLabels: true` shows the coordinates under the mouse on each axis. To convert between pixels and data values yourself, use the axis' coordinate calculator, which also handles the flip from screen y (down) to chart y (up).

**See it in the demo app:** [JavaScript chart with central axes](https://www.scichart.com/demo/javascript/central-axes) · [React chart with central axes](https://www.scichart.com/demo/react/central-axes) · [Angular chart with central axes](https://www.scichart.com/demo/angular/central-axes)

**Go deeper:** [SciChart.js central axis layout documentation](/2d-charts/axis-api/multi-axis-and-layout/central-axis-layout/), [inner axis layout](/2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout/) and [converting between pixel and data coordinates](/2d-charts/axis-api/misc/pixel-and-data-coordinates/).

## Frequently asked questions

### How many quadrants are on a Cartesian plane?

Four. The x-axis and y-axis cross at the origin and split the plane into four quadrants, numbered I to IV anticlockwise starting from the top right. In quadrant I both coordinates are positive; in II, x is negative and y positive; in III, both are negative; in IV, x is positive and y negative. Points that lie on an axis belong to no quadrant.

### What is an ordered pair?

An ordered pair is the two numbers that give a point's position on a Cartesian graph, written in brackets as (x, y). The first number is the x-coordinate: how far to move left or right from the origin. The second is the y-coordinate: how far to move up or down. The order matters, because (2, 5) and (5, 2) are different points.

### How do you convert Cartesian coordinates to polar coordinates?

For a point (x, y), the polar distance is r = √(x² + y²) and the angle is θ = arctan(y ÷ x), adjusted for the quadrant the point is in (a calculator's atan2 function does this for you). For example, (3, 4) becomes r = 5 and θ ≈ 53.1°. To go back, use x = r cos θ and y = r sin θ.

### Who invented the Cartesian coordinate system?

It is named after the French philosopher and mathematician René Descartes. In *La Géométrie*, published in 1637, he described geometric shapes with algebra, which is the idea behind placing points and curves on a grid with numbered axes.

### Are Cartesian coordinates just x, y and z?

Mostly, yes. A flat Cartesian graph uses two coordinates, x and y. Add a third axis at right angles to both, usually called z, and every point in space has three coordinates (x, y, z). The idea extends to any number of dimensions, but you can only draw two or three at once.

### How do I make a Cartesian graph in JavaScript?

With SciChart.js, create a `SciChartSurface` with a `NumericAxis` for x and one for y. To make the axes cross at the origin, as on a maths graph, set the surface's `layoutManager` to a `CentralAxesLayoutManager` in `DataValue` mode at position 0, and set `isInnerAxis: true` on both axes. Then add your points as a scatter or line series, or as annotations. For React, pass the same setup to `scichart-react`; for Angular, to `scichart-angular`.

## Sources

- O'Connor, J. J. and Robertson, E. F., [René Descartes](https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/), MacTutor History of Mathematics, University of St Andrews. *La Géométrie*, his application of algebra to geometry, was published in 1637.
- Weisstein, E. W., [Cartesian Coordinates](https://mathworld.wolfram.com/CartesianCoordinates.html), MathWorld (Wolfram Research). The x- and y-axes are linear and perpendicular, with notation due to Descartes.
- Weisstein, E. W., [Quadrant](https://mathworld.wolfram.com/Quadrant.html), MathWorld. The four regions of the plane set by the signs of x and y.
- Weisstein, E. W., [Polar Coordinates](https://mathworld.wolfram.com/PolarCoordinates.html), MathWorld. Converting between Cartesian and polar coordinates, and the two-argument arctangent.
- Cleveland, W. S. and McGill, R. (1984), [Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods](https://doi.org/10.1080/01621459.1984.10478080). *Journal of the American Statistical Association*, 79(387), 531–554. People judge position along a common scale more accurately than angle or area.

<LearnCta position="bottom" chart="Cartesian graph" demo="central-axes" demoLabel="chart with central axes" docs="/2d-charts/axis-api/multi-axis-and-layout/central-axis-layout/" docsLabel="SciChart.js central axis layout documentation" />
