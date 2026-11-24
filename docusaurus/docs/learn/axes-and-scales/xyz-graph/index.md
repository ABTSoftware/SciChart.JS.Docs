---
sidebar_position: 30
sidebar_label: XYZ Graph (3D Axes)
title: "XYZ Graph: What It Is & How to Read It (Interactive Example)"
description: "What the x, y and z axes are, which one is up, right- vs left-handed axes, how to read a point on a 3D graph, perspective vs orthographic views and the mistakes to avoid."
keywords:
    [
        "xyz axis",
        "xyz graph",
        "x y z axis",
        "3d axes",
        "3d graph",
        "3d coordinate system",
        "how to read a 3d graph",
        "right-handed vs left-handed coordinate system"
    ]
image: /img/learn/xyz-graph-og.png
related: [cartesian-graph, 3d-surface-plot, bubble-chart, log-scale-graph]
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
                    "name": "What are the x, y and z axes?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The x, y and z axes are three number lines at right angles to each other that meet at the origin, (0, 0, 0). Together they describe any position in three-dimensional space. The x-axis usually runs across (width), and the other two give height and depth. Which of y and z is height depends on the convention: maths books usually draw z pointing up, while many 3D graphics and charting tools use y as up." }
                },
                {
                    "@type": "Question",
                    "name": "Is z or y up and down?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Either, depending on the tool. In maths, engineering, CAD and most scientific plotting libraries, z is up and the x-y plane is the floor. In many 3D graphics systems, game engines and 3D charting libraries, y is up (as on a 2D chart) and z is depth. Always check the axis titles before reading a 3D graph, and check the convention before importing 3D data from another tool." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a 3D graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "First read the three axis titles and find which axis points up. Then, for any point, follow a line straight down (or along the up axis) to the floor of the box and read the two floor axes there, then read its height on the up axis. Gridlines on the walls and a tooltip help. Rotate the chart, or switch to a straight-on view, to check depth, because a single angled view can hide how far back a point is." }
                },
                {
                    "@type": "Question",
                    "name": "How do you plot a point on an XYZ graph?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Start at the origin, (0, 0, 0). Move along the x-axis by the x value, then parallel to the depth axis by its value, then parallel to the up axis by its value. For the point (7, 6, 3) on a chart where y is up, move 7 across, 3 back and 6 up. Dropping a line from the point to the floor, and across to each wall, shows its shadow on each 2D plane and makes the point easier to read." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between right-handed and left-handed axes?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They are mirror images. With x pointing right and y pointing up, a right-handed system has z pointing out of the screen towards you, and a left-handed system has z pointing into the screen, away from you. Maths and physics use right-handed axes. Some 3D graphics tools use left-handed ones. Mixing them up flips data front to back." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make an XYZ graph in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, create a SciChart3DSurface, set its xAxis, yAxis and zAxis to NumericAxis3D, and add a ScatterRenderableSeries3D with an XyzDataSeries3D holding your x, y and z values. Add OrbitModifier3D and MouseWheelZoomModifier3D so users can rotate and zoom, and use the camera's projectionMode to switch between perspective and orthographic views. In React or Angular, run the same setup with scichart-react or scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# XYZ Graph

## What is an XYZ graph?

An **XYZ graph** (also called a 3D graph, XYZ axis graph or three-axis plot) is a chart with three axes at right angles to each other, x, y and z, that meet at a point called the origin. Each data point has three values, written (x, y, z), so the chart shows how three quantities relate in one view.

![An XYZ graph: a 3D scatter plot in a cube-shaped box with x, y and z axes each running from 0 to 10, the y axis pointing up. About 250 cyan points form a tilted cloud, and one larger orange point at x 7, y 6, z 3 has dashed lines to its shadows on the floor, the side wall and the back wall](/img/learn/xyz-graph-og.png)

*A cloud of points on x, y and z axes, with one point, P = (7, 6, 3), and its shadows on the floor and walls (illustrative data). [Try the interactive version](#how-to-create-an-xyz-graph-in-javascript-react-or-angular): rotate it, and switch to straight-on front, top and side views.*

:::tip Key takeaways
- The x, y and z axes are three number lines at right angles. A point's position is three numbers, (x, y, z), always in that order.
- Which axis is up depends on the tool: maths and most scientific plotting put z up; many 3D graphics and charting tools, SciChart.js among them, put y up. Read the axis titles first.
- Read a point by dropping it to the floor and reading the two floor axes, then reading its height. Its shadows on the walls give each pair of values.
- A perspective view looks natural but distorts distances; an orthographic view keeps them true, so it is better for reading values.
- One angled view can hide depth. Rotate the chart, or look straight down each axis, before drawing conclusions.
:::

## What are the x, y and z axes?

A 2D chart has two axes: x across and y up. A 3D graph adds a third, **z**, at right angles to both, so the chart has width, height and depth, like the corner of a room. The point where all three meet is the **origin**, (0, 0, 0).

| Axis | Usual direction on a 3D chart | Also called |
| --- | --- | --- |
| x | Across, left to right | The horizontal axis; abscissa |
| y | Up (graphics and charting tools) or back into the scene (maths) | The vertical axis on 2D charts; ordinate |
| z | Back into the scene (graphics and charting tools) or up (maths) | The depth axis; applicate |

Each pair of axes forms a flat **plane**: the x–y plane, the x–z plane and the z–y plane. On a 3D chart these planes are drawn as the floor and walls of a box, with gridlines, so you can read values off them.

## How to read an XYZ graph

Read an XYZ graph by finding which axis is up, then turning the chart until the pattern you care about is clear.

![An annotated XYZ axis box drawn like the corner of a room. The x axis runs across from 0 to 10, the y axis points up from 0 to 10 and the z axis runs back from 0 to 10, all starting at the origin (0, 0, 0). Point P at (7, 6, 3) is reached in three steps: 7 across along x, 3 back along z, then 6 up along y. Dashed lines run from P to its shadows: on the floor at x 7 and z 3, on the back wall at x 7 and y 6, and on the side wall at z 3 and y 6](./xyz-axis-anatomy.svg)

1. Read the axis titles first. Find which axis is up, what each axis measures and its units. Don't assume y is up: on many 3D charts it isn't.
2. Find the origin and the direction of each axis. Values grow away from the origin. Check that the numbers increase the way you expect along each edge of the box; a rotated chart can put an axis's zero on the far side.
3. Read a point's floor position. Follow a line straight down (along the up axis) to the floor, then read the two floor axes there: in the diagram, x = 7 and z = 3.
4. Read its height. Read across from the point to the up axis, or use the gridlines on a wall: y = 6. The point is (7, 6, 3).
5. Use the shadows. Where a line from the point meets a wall at right angles is its **projection** on that wall. Each wall shows two of the three values, read like an ordinary 2D chart.
6. Check depth by moving the view. From one angle, a point near the front and a point far back can look as if they're in the same place. Rotate the chart, hover for a tooltip, or switch to a straight-on view.

## How to plot and read a point (x, y, z)

To plot a point, start at the origin and move along each axis in turn: x across, then the depth axis, then the up axis. The order in which you move doesn't matter, but the order in which you write the values does: always (x, y, z).

The clearest way to check a 3D point is to look at it straight down each axis. Each view is a flat 2D chart, and each one shows two of the three values:

![The point P at (7, 6, 3) drawn four ways. In a small 3D box it is hard to tell how far back it is. In the front view, looking along z, it is at x 7 and y 6. In the top view, looking down y, it is at x 7 and z 3. In the side view, looking along x, it is at z 3 and y 6. Each 2D view loses one coordinate](./point-in-3d-and-2d.svg)

| View | Looking along | You see | P reads as | Hidden |
| --- | --- | --- | --- | --- |
| Front | z | x across, y up | (7, 6) | z: how far back |
| Top | y (down) | x across, z up the page | (7, 3) | y: how high |
| Side | x | z across, y up | (3, 6) | x: how far across |

Any two views give all three values, because each value appears in two of them. That is why engineering drawings use front, top and side views, and why a 3D chart that can snap to those views is easier to read than one fixed angle.

### Example: a pattern only one view shows

In the [live chart](#how-to-create-an-xyz-graph-in-javascript-react-or-angular), switch to Orthographic, then try each view:

- Front (x–y): the cloud of 250 points looks like a shapeless rectangle of dots. Nothing links x and y.
- Top (x–z): still a shapeless square. Nothing links x and z either.
- Side (z–y): the same points collapse into a thin, rising band. Y climbs by about 0.7 for every 1 along z, and x plays no part. The cloud is a flat, tilted sheet, which no other view shows.

### How to describe a point or pattern on an XYZ graph

When you report a 3D chart, say which axis is which, then give positions as (x, y, z):

> On axes of [x quantity], [y quantity] and [z quantity] ([which axis] up), [the point or group] sits at about ([x], [y], [z]). Seen from [the view], [the pattern]: [the relationship, with its size].

For example: "On x, y and z axes from 0 to 10 (y up), the highlighted point sits at (7, 6, 3). Seen from the side, the point cloud is a thin band: y rises by about 0.7 for each unit of z, and doesn't depend on x."

## Which axis is up: y or z?

There is no single answer. Two conventions are both common, and mixing them up is a common source of confusion with 3D axes.

- Z up: maths textbooks, engineering, surveying, CAD and most scientific plotting libraries treat the x–y plane as the ground and z as height. A 2D map gets a third dimension by adding elevation.
- Y up: many 3D graphics systems, game engines and 3D charting libraries keep y as the vertical axis, as on a 2D chart or a screen, and add z as depth into the scene.

| Convention | Up axis | Handedness | Examples |
| --- | --- | --- | --- |
| Maths and physics | z | Right-handed | Textbook 3D diagrams; the default 3D view in Matplotlib |
| Mapping and engineering | z | Right-handed (usually) | GIS: x east–west, y north–south, z height or elevation; most CAD tools |
| 3D asset exchange (glTF) | y | Right-handed | The glTF 3D file format |
| Unreal Engine | z | Left-handed | Game engine |
| SciChart.js 3D | y | Left-handed | X and Z form the floor; Y is up, as on a 2D chart |

### How to avoid mixing up y-up and z-up data

- Label every axis, including which one is up. "Height (m)" on the vertical axis settles it for the reader.
- When you move 3D data between tools, check both the up axis and the handedness. Data from a z-up tool shown in a y-up chart lies on its side unless you swap y and z.
- Swapping two axes also flips the handedness, so after swapping y and z you may need to negate one axis to stop the data appearing mirrored.

## Right-handed vs left-handed axes

Once x and y are fixed, z can point one of two ways. The two choices are mirror images, and no rotation turns one into the other.

- **Right-handed:** point the fingers of your right hand along x and curl them towards y. Your thumb points along +z. With x to the right and y up, z comes out of the screen, towards you. Maths, physics and most engineering use this.
- **Left-handed:** do the same with your left hand. With x to the right and y up, z goes into the screen, away from you. Some 3D graphics tools use this, because depth then grows the further away something is.

| | Right-handed | Left-handed |
| --- | --- | --- |
| x right, y up: z points | Towards you, out of the screen | Away from you, into the screen |
| x right, z up: y points | Away from you, into the screen | Towards you, out of the screen |
| Typical users | Maths, physics, engineering, CAD, glTF | Some game engines and 3D charting libraries |

For reading a chart, handedness only matters when you compare charts from different tools, or load data from one into another: the same numbers drawn in the other system come out mirrored, front to back.

## Perspective vs orthographic projection

A screen is flat, so a 3D chart has to project the 3D box onto 2D. There are two ways to do it:

| | Perspective | Orthographic |
| --- | --- | --- |
| What it does | Far things look smaller, like a photo | Everything stays the same size, wherever it is |
| Parallel gridlines | Converge towards the distance | Stay parallel |
| Good for | Seeing the overall shape; a natural sense of depth | Reading values, comparing sizes, straight-on views |
| Watch out for | Reading values off the axes: the front and back edges of the box have different scales | Depth is harder to judge at an angle: near and far can look alike |

In the [live chart](#how-to-create-an-xyz-graph-in-javascript-react-or-angular), choose Front (X–Y) in Perspective. The floor and back wall show as nested boxes, and the orange point no longer lines up with 7 on the front x-axis, because it sits further back than the front edge of the box, where that axis is drawn. Switch to Orthographic and it sits exactly on x = 7 and y = 6.

## When to use an XYZ graph

Use a 3D graph when three numeric values per item matter together and readers can interact with the chart: rotate it, zoom it and hover for values. If the chart will be printed or seen at a glance, a 2D chart with colour or size for the third value is usually easier to read.

| Chart | Best for |
| --- | --- |
| XYZ graph, as a 3D scatter plot (point cloud) | Separate items, each with its own x, y and z: clusters, outliers and shapes in three measured variables; LiDAR scans and 3D measurements |
| [3D surface plot](/learn/chart-types/3d/3d-surface-plot/) | A value measured over a regular grid of x and z, shown as a height: terrain, temperature across a plate, a function of two variables |
| [Heatmap](/learn/chart-types/cartesian/heatmap/) or [contour plot](/learn/chart-types/cartesian/contour-plot/) | The same grid data in 2D, with colour or contour lines for the third value: exact positions, no hidden areas |
| [Bubble chart](/learn/chart-types/cartesian/bubble-chart/) | Three values per item in 2D, with the third as bubble size: good for small numbers of items |
| [Scatter plot](/learn/chart-types/cartesian/scatter-plot/) coloured by the third value | Many points in 2D, with colour for the third variable; easy to print and to read exactly |

### How 3D charts plot data

The same three axes hold different kinds of 3D chart:

- 3D scatter plot: one marker per data point at its (x, y, z). A very large scatter from a scanner is a **point cloud**: see the [LiDAR point cloud and contour visualisation](https://www.scichart.com/blog/lidar-uav-point-cloud-and-contour-mapping-with-scichart/) post.
- 3D surface or mesh: a sheet stretched over a grid of points, with height (and often colour) showing the value. See the [3D surface plot guide](/learn/chart-types/3d/3d-surface-plot/).
- 3D line: points joined in order, for a path through space such as a trajectory, or a set of spectra in a waterfall.
- 3D columns and bubbles: a column of height y at each (x, z), or a sphere whose size is a fourth value.

## Common XYZ graph mistakes

Most XYZ graph mistakes come from assuming an axis direction, or trusting a single view of a 3D chart.

- **Assuming which axis is up.** Readers of a z-up chart who expect y-up (or the other way round) misread every value. Title every axis, and say which is vertical.
- **Occlusion.** Points and surfaces in front hide those behind them. Use smaller or partly transparent markers, let users rotate, or show the data as 2D views as well.
- **Too much rotation, or a bad default angle.** Spinning charts and steep angles make the box hard to read. Start from a view slightly above and to one side, with all three axes' labels readable, and give a reset (in the live chart, double-click).
- **Unequal axis scales without saying so.** If one unit on x is twice as long as one unit on z, shapes and slopes look different from the data. Use the same scale where the units match, and say when they don't.
- **3D for 2D data.** A 3D bar or pie chart adds depth that carries no data and makes values harder to compare. Use 3D only when the third axis is a real variable.

## How to create an XYZ graph in JavaScript, React or Angular

The demo below plots 250 points that form a tilted sheet: a blob seen from the front, a thin line seen from the side. In SciChart.js 3D, y is the up axis and x and z make the floor. Try the chart below: drag to rotate, scroll to zoom, double-click to reset, and hover a point to read its x, y and z. Use the buttons to look straight along each axis, and to switch between perspective and orthographic.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="XYZ graph" demo="3d-bubble-chart" demoLabel="3D bubble chart" docs="/3d-charts/axis-3d-api/axis-3d-api-overview/" docsLabel="SciChart.js 3D axis documentation" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { useRef } from "react";
    import { SciChartReact } from "scichart-react";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        XyzDataSeries3D,
        ScatterRenderableSeries3D,
        SpherePointMarker3D,
        ECameraProjectionMode,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            worldDimensions: new Vector3(300, 300, 300),
            cameraOptions: { position: new Vector3(330, 420, -480), target: new Vector3(0, 150, 0) }
        });

        // In SciChart.js 3D, Y is up; X and Z make the floor
        const range = new NumberRange(0, 10);
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X axis", visibleRange: range });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y axis (up)", visibleRange: range });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z axis", visibleRange: range });

        const { xValues, yValues, zValues } = getYourXyzData();
        sciChart3DSurface.renderableSeries.add(
            new ScatterRenderableSeries3D(wasmContext, {
                dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues }),
                pointMarker: new SpherePointMarker3D(wasmContext, { size: 7, fill: "#50C7E0" })
            })
        );

        sciChart3DSurface.chartModifiers.add(
            new OrbitModifier3D(),
            new MouseWheelZoomModifier3D(),
            new ResetCamera3DModifier(),
            new TooltipModifier3D({ isCrosshairVisible: true })
        );
        return { sciChartSurface: sciChart3DSurface };
    };

    export const XyzGraph = () => {
        const chart = useRef<SciChart3DSurface>();

        // Perspective looks natural; orthographic keeps distances true for reading values
        const setProjection = (orthographic: boolean) => {
            const camera = chart.current?.camera;
            if (!camera) return;
            camera.projectionMode = orthographic ? ECameraProjectionMode.Orthogonal : ECameraProjectionMode.Perspective;
            if (orthographic) {
                camera.orthoWidth = 620;
                camera.orthoHeight = 440;
            }
        };

        return (
            <>
                <button onClick={() => setProjection(false)}>Perspective</button>
                <button onClick={() => setProjection(true)}>Orthographic</button>
                <SciChartReact
                    initChart={initChart}
                    onInit={(result) => (chart.current = result.sciChartSurface)}
                    style={{ width: "100%", height: 500 }}
                />
            </>
        );
    };
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        XyzDataSeries3D,
        ScatterRenderableSeries3D,
        SpherePointMarker3D,
        ECameraProjectionMode,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } from "scichart";

    @Component({
        selector: "app-xyz-graph",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <button (click)="setProjection(false)">Perspective</button>
            <button (click)="setProjection(true)">Orthographic</button>
            <scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>
        `
    })
    export class XyzGraphComponent {
        private sciChart3DSurface?: SciChart3DSurface;

        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme(),
                worldDimensions: new Vector3(300, 300, 300),
                cameraOptions: { position: new Vector3(330, 420, -480), target: new Vector3(0, 150, 0) }
            });

            // In SciChart.js 3D, Y is up; X and Z make the floor
            const range = new NumberRange(0, 10);
            sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X axis", visibleRange: range });
            sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y axis (up)", visibleRange: range });
            sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z axis", visibleRange: range });

            const { xValues, yValues, zValues } = getYourXyzData();
            sciChart3DSurface.renderableSeries.add(
                new ScatterRenderableSeries3D(wasmContext, {
                    dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues }),
                    pointMarker: new SpherePointMarker3D(wasmContext, { size: 7, fill: "#50C7E0" })
                })
            );

            sciChart3DSurface.chartModifiers.add(
                new OrbitModifier3D(),
                new MouseWheelZoomModifier3D(),
                new ResetCamera3DModifier(),
                new TooltipModifier3D({ isCrosshairVisible: true })
            );
            this.sciChart3DSurface = sciChart3DSurface;
            return { sciChartSurface: sciChart3DSurface };
        };

        // Perspective looks natural; orthographic keeps distances true for reading values
        setProjection(orthographic: boolean) {
            const camera = this.sciChart3DSurface?.camera;
            if (!camera) return;
            camera.projectionMode = orthographic ? ECameraProjectionMode.Orthogonal : ECameraProjectionMode.Perspective;
            if (orthographic) {
                camera.orthoWidth = 620;
                camera.orthoHeight = 440;
            }
        }
    }
    ```
</CodeSnippetBlock>

Key points:

- A [SciChart3DSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html) has exactly one `xAxis`, `yAxis` and `zAxis`, each a `NumericAxis3D` (or `LogarithmicAxis3D`). Y is up, and the coordinate system is left-handed: X and Z make the floor. `worldDimensions` sets the size of the axis box; equal sizes and equal ranges give every axis the same scale.
- Your data goes in an `XyzDataSeries3D` (one x, y and z per point) and is drawn by a `ScatterRenderableSeries3D` with a 3D point marker, such as `SpherePointMarker3D`, or by a `PointLineRenderableSeries3D` for lines. `isLineStrip: false` draws each pair of points as a separate line, as the drop lines in the demo do.
- The `camera` (a `CameraController`) sets the view: `position` and `target` in world units, and `projectionMode` for perspective or orthographic, with `orthoWidth` and `orthoHeight` as the orthographic zoom. Moving the camera onto an axis gives the straight-on front, top and side views.
- `OrbitModifier3D` rotates on drag, `MouseWheelZoomModifier3D` zooms, `ResetCamera3DModifier` resets on double-click, and `TooltipModifier3D` shows a point's values, with `isCrosshairVisible` drawing lines from it to the walls.

**See it in the demo app:** [JavaScript 3D bubble chart](https://www.scichart.com/demo/javascript/3d-bubble-chart) · [React 3D bubble chart](https://www.scichart.com/demo/react/3d-bubble-chart) · [Angular 3D bubble chart](https://www.scichart.com/demo/angular/3d-bubble-chart). With logarithmic 3D axes: [JavaScript 3D log-log scatter chart](https://www.scichart.com/demo/javascript/3d-log-log-scatter-chart) · [React 3D log-log scatter chart](https://www.scichart.com/demo/react/3d-log-log-scatter-chart) · [Angular 3D log-log scatter chart](https://www.scichart.com/demo/angular/3d-log-log-scatter-chart). A large point cloud: [JavaScript LiDAR 3D point cloud](https://www.scichart.com/demo/javascript/3d-lidar-visualization) · [React LiDAR 3D point cloud](https://www.scichart.com/demo/react/3d-lidar-visualization) · [Angular LiDAR 3D point cloud](https://www.scichart.com/demo/angular/3d-lidar-visualization).

**Go deeper:** [SciChart.js 3D axis documentation](/3d-charts/axis-3d-api/axis-3d-api-overview/), [coordinates in 3D space](/3d-charts/scichart-3d-basics/coordinates-in-3d-space/) for the left-handed, y-up system and world vs data coordinates, the [3D camera](/3d-charts/scichart-3d-basics/scichart-surface-camera/) for perspective and orthographic views, and the [3D scatter chart](/3d-charts/chart-types/scatter-3d-chart/) for point markers.

## Frequently asked questions

### What are the x, y and z axes?

The x, y and z axes are three number lines at right angles to each other that meet at the origin, (0, 0, 0). Together they describe any position in three-dimensional space. The x-axis usually runs across (width), and the other two give height and depth. Which of y and z is height depends on the convention: maths books usually draw z pointing up, while many 3D graphics and charting tools use y as up.

### Is z or y up and down?

Either, depending on the tool. In maths, engineering, CAD and most scientific plotting libraries, z is up and the x-y plane is the floor. In many 3D graphics systems, game engines and 3D charting libraries, y is up (as on a 2D chart) and z is depth. Always check the axis titles before reading a 3D graph, and check the convention before importing 3D data from another tool.

### How do you read a 3D graph?

First read the three axis titles and find which axis points up. Then, for any point, follow a line straight down (or along the up axis) to the floor of the box and read the two floor axes there, then read its height on the up axis. Gridlines on the walls and a tooltip help. Rotate the chart, or switch to a straight-on view, to check depth, because a single angled view can hide how far back a point is.

### How do you plot a point on an XYZ graph?

Start at the origin, (0, 0, 0). Move along the x-axis by the x value, then parallel to the depth axis by its value, then parallel to the up axis by its value. For the point (7, 6, 3) on a chart where y is up, move 7 across, 3 back and 6 up. Dropping a line from the point to the floor, and across to each wall, shows its shadow on each 2D plane and makes the point easier to read.

### What is the difference between right-handed and left-handed axes?

They are mirror images. With x pointing right and y pointing up, a right-handed system has z pointing out of the screen towards you, and a left-handed system has z pointing into the screen, away from you. Maths and physics use right-handed axes. Some 3D graphics tools use left-handed ones. Mixing them up flips data front to back.

### How do I make an XYZ graph in JavaScript?

With SciChart.js, create a `SciChart3DSurface`, set its `xAxis`, `yAxis` and `zAxis` to `NumericAxis3D`, and add a `ScatterRenderableSeries3D` with an `XyzDataSeries3D` holding your x, y and z values. Add `OrbitModifier3D` and `MouseWheelZoomModifier3D` so users can rotate and zoom, and use the camera's `projectionMode` to switch between perspective and orthographic views. In React or Angular, run the same setup with `scichart-react` or `scichart-angular`.

## Sources

- Weisstein, E. W., [Right-Handed Coordinate System](https://mathworld.wolfram.com/Right-HandedCoordinateSystem.html), *MathWorld*, Wolfram Research. A right-handed system's axes satisfy the right-hand rule.
- Wikipedia, [Cartesian coordinate system](https://en.wikipedia.org/wiki/Cartesian_coordinate_system): three dimensions, the names abscissa, ordinate and applicate, and orientation and handedness.
- The Khronos Group, [glTF 2.0 Specification: Coordinate System and Units](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html). glTF uses a right-handed coordinate system with +Y up.
- Epic Games, [Coordinate System and Spaces in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/coordinate-system-and-spaces-in-unreal-engine). The Unreal Editor uses a left-handed, Z-up coordinate system.
- Esri, [x,y,z coordinates](https://support.esri.com/en-us/gis-dictionary/x-y-z-coordinates), *GIS Dictionary*. In GIS, x is usually east–west, y north–south and z height or elevation.
- Matplotlib, [Axes3D.view_init](https://matplotlib.org/stable/api/_as_gen/mpl_toolkits.mplot3d.axes3d.Axes3D.view_init.html). The axis drawn vertically in a 3D plot is z by default.

<LearnCta position="bottom" chart="XYZ graph" demo="3d-bubble-chart" demoLabel="3D bubble chart" docs="/3d-charts/axis-3d-api/axis-3d-api-overview/" docsLabel="SciChart.js 3D axis documentation" />
