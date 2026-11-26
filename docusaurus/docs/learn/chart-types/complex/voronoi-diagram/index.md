---
sidebar_position: 100
sidebar_label: Voronoi Diagram
title: "Voronoi Diagram: What It Is, How It's Built and Where It's Used"
description: "What a Voronoi diagram is, its cells, edges and vertices, how it relates to the Delaunay triangulation, how to make one, Euclidean vs Manhattan cells, and real uses. With a live example."
keywords:
    [
        "voronoi diagram",
        "voronoi",
        "voronoi tessellation",
        "voronoi cell",
        "what is a voronoi diagram",
        "how to make a voronoi diagram",
        "voronoi diagram examples",
        "delaunay triangulation",
        "voronoi diagram vs delaunay triangulation",
        "thiessen polygons",
        "fortune's algorithm",
        "manhattan voronoi diagram",
        "voronoi diagram applications"
    ]
image: /img/learn/voronoi-diagram-og.png
related: [k-means-clustering, decision-boundary, heatmap, choropleth-map]
datePublished: 2026-11-21
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a Voronoi diagram used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Voronoi diagram answers \"which of these places is nearest?\" for every point on a map at once. It is used to draw the catchment area of each shop, school, hospital or rain gauge, to model mobile phone coverage, to find nearest neighbours in machine learning, to model grains in metals and cells in tissue, to make cellular textures in computer graphics, and to plan robot paths that stay as far as possible from obstacles." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a Voronoi diagram and a Delaunay triangulation?",
                    "acceptedAnswer": { "@type": "Answer", "text": "They are two views of the same structure. The Voronoi diagram splits the plane into one cell per site. The Delaunay triangulation joins two sites with a line whenever their cells share an edge, which divides the space between the sites into triangles. Each Voronoi vertex is the centre of the circle through the three corners of one Delaunay triangle, and that circle has no other site inside it. Build either one and you can read the other off it." }
                },
                {
                    "@type": "Question",
                    "name": "What are Thiessen polygons?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Thiessen polygons are Voronoi cells under another name, used in geography, hydrology and GIS software. They are named after the meteorologist Alfred Thiessen, who in 1911 drew one around each rain gauge and weighted each gauge's rainfall by its polygon's area to estimate the average rainfall over a region." }
                },
                {
                    "@type": "Question",
                    "name": "How do you draw a Voronoi diagram by hand?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Join each site to its nearby sites with light lines, then draw the perpendicular bisector of each of those lines: the line through its midpoint at a right angle. Around each site, keep only the parts of the bisectors that are closer to that site than to any other. The bisectors meet in threes at the Voronoi vertices, and the pieces between the vertices are the cell edges. Starting from the Delaunay triangles makes it easier, because each vertex is the centre of a triangle's circumcircle." }
                },
                {
                    "@type": "Question",
                    "name": "Are Voronoi cells always convex?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With ordinary straight-line (Euclidean) distance, yes. Each cell is the overlap of half-planes, one per other site, and an overlap of half-planes is always convex. With other distances the cells change shape: Manhattan cells are not always convex, and cells measured along a road network follow the streets." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a Voronoi diagram in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For a few hundred sites, compute each cell by half-plane clipping: start with a large rectangle and, for every other site, cut away the half beyond the perpendicular bisector. Then cut each cell into triangles from its first corner and draw them, with the cell outlines as a line series and the sites as scatter markers. For other distance measures, colour a grid by its nearest site and draw it as a heatmap. SciChart.js does both with FastTriangleRenderableSeries and UniformHeatmapRenderableSeries, in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Voronoi Diagram

## What is a Voronoi diagram?

A **Voronoi diagram** (also called a Voronoi tessellation, Dirichlet tessellation or Thiessen polygons) divides a plane into one region per point, called a site. Each region, or **Voronoi cell**, holds every location that is closer to its own site than to any other. The boundaries are where two sites are equally close.

![A Voronoi diagram in a dark navy theme: two dozen white site markers on a square map from 0 to 100 km on each axis, each surrounded by a coloured polygon cell, with neighbouring cells in different colours and dark outlines along the cell edges](/img/learn/voronoi-diagram-og.png)

*Voronoi cells around 24 randomly placed sites on a 100 × 100 km map (sample data). [Try the interactive version](#how-to-make-a-voronoi-diagram-in-javascript-react-or-angular).*

:::tip Key takeaways
- A Voronoi cell is the set of points nearer to its site than to any other site, so the diagram is a map of "which one is nearest?".
- With straight-line distance, every edge lies on the perpendicular bisector of two sites, and every vertex is equally far from three sites.
- The Delaunay triangulation joins the sites whose cells touch, so it carries the same information as the Voronoi diagram.
- Change the distance measure and the cells change shape. City-block (Manhattan) cells have only horizontal, vertical and 45° edges.
- Cells at the edge of the data are open-ended; their size depends on where you crop the map, not on the data.
:::

## How a Voronoi diagram works

Start with a set of sites, such as fire stations, phone masts or the centres of clusters. For any location on the map, find the nearest site. Do that for every location and colour each one by its nearest site, and the colours form the cells.

![A Voronoi diagram of nine sites with numbered callouts: 1 a site, 2 the highlighted cell around the central site, 3 an edge crossed at a right angle by the dashed line joining its two sites, 4 a vertex with the dashed circle through its three sites, and 5 an open cell at the edge of the frame](./voronoi-diagram-anatomy.svg)

1. Site. The point each cell is built around, also called a seed or generator.
2. Cell. Everything nearer to that site than to any other. A location on the boundary is equally near two sites; at a vertex, three.
3. Edge. With ordinary straight-line distance, each edge is part of the perpendicular bisector of two sites: the line through the midpoint between them, at right angles to the line joining them. The two sites are mirror images across it.
4. Vertex. Where three cells meet, the vertex is the same distance from all three sites. A circle centred there passes through the three sites and has no other site inside it (if it did, that site would be nearer, and the vertex would belong to its cell).
5. Open cell. Sites on the outside of the group (on its convex hull, the shape a rubber band stretched around all the sites would take) have cells that run off to infinity. A chart has to cut them at a frame.

In symbols, with sites $s_1, \dots, s_n$ and a distance $d$, the cell of site $s_i$ is

$$
V(s_i) = \{\, p \;:\; d(p, s_i) \le d(p, s_j) \text{ for every } j \ne i \,\}
$$

Some properties follow from that definition and are useful when you check a diagram:

- With straight-line distance, every cell is a convex polygon: a line between two points in a cell never leaves it. Each cell is the overlap of half-planes, one for each other site.
- For $n \ge 3$ sites that don't all lie on one line, there are at most $2n - 5$ vertices and $3n - 6$ edges. On average a cell has fewer than six neighbours; for many randomly scattered sites the average approaches six.
- A site's nearest other site is always one of its neighbours across a cell edge.
- Moving one site only changes its own cell and the cells of its neighbours, before and after the move. The rest of the diagram stays put.

## A worked example: three fire stations

Three fire stations stand at A (0, 0), B (6, 0) and C (0, 4), in kilometres. Each station should cover the area it can reach first, which, as a first approximation, is the area nearest to it in a straight line.

- The A–B boundary is the perpendicular bisector of A and B: the vertical line $x = 3$.
- The A–C boundary is the horizontal line $y = 2$.
- The B–C boundary is the set of points equally far from B and C: $(x - 6)^2 + y^2 = x^2 + (y - 4)^2$, which simplifies to $3x - 2y = 5$.

The three lines meet at (3, 2), the Voronoi vertex. It is $\sqrt{3^2 + 2^2} = \sqrt{13} \approx 3.61$ km from all three stations. Triangle ABC has a right angle at A, so its circumcentre is the midpoint of the long side BC, which is (3, 2) again.

Station A covers the lower-left quarter, $x \le 3$ and $y \le 2$. B covers everything to the right of $x = 3$ and below the B–C line, and C covers the rest. A call from (4, 3.2) is 5.12 km from A, 3.77 km from B and 4.08 km from C, so B is nearest. Measured along a street grid instead (the Manhattan distance, below), the same call is 7.2 km from A, 5.2 km from B and 4.8 km from C, and C is nearest.

## Voronoi diagram and Delaunay triangulation

Draw a line between every pair of sites whose cells share an edge. The lines divide the area between the sites into triangles, and that set of triangles is the **Delaunay triangulation**, described by Boris Delaunay in 1934. The two structures are duals: each cell matches a site, each Voronoi edge matches a Delaunay edge (crossing it at a right angle where they meet), and each Voronoi vertex matches a Delaunay triangle.

![Sixteen sites with Voronoi cell edges as solid dark lines and the Delaunay triangulation as dashed orange lines between sites whose cells touch. One Delaunay triangle is shaded, and its dashed purple circumcircle, which holds no other site, is centred on a Voronoi vertex](./voronoi-delaunay-dual.svg)

The defining test is the **empty circle** property: the circle through the three corners of a Delaunay triangle (its circumcircle) has no other site inside it. Its centre is the Voronoi vertex where the three sites' cells meet. Of all the ways to triangulate a set of points, the Delaunay triangulation makes the smallest angle as large as possible, so it avoids long, thin triangles, which makes it the usual choice for finite-element meshes, terrain models and interpolating scattered measurements.

In practice you build one and read the other off it. Many libraries compute the Delaunay triangulation and return the Voronoi diagram as its dual, by joining the circumcentres of neighbouring triangles. The demo on this page does the reverse: it computes the cells, then takes the Delaunay edges from which cells touch.

## How to make a Voronoi diagram

There are five common ways, from pencil and paper to graphics hardware.

| Method | How it works | Cost for n sites | Good for |
| --- | --- | --- | --- |
| By hand, with bisectors | Draw the perpendicular bisector of each pair of nearby sites and keep the parts nearest each site | Practical up to a dozen or so sites | Teaching, sketches, checking a result |
| Half-plane clipping | Start each cell as a large rectangle and cut away the far side of the bisector with every other site | About $n^2$ clips; fast for hundreds of sites | Small interactive diagrams; the demo on this page |
| Delaunay first, then the dual | Triangulate the sites (for example by adding points one at a time and fixing triangles whose circumcircle holds the new point), then join circumcentres | $O(n \log n)$ expected with randomised insertion | General use; what most geometry libraries do |
| Fortune's sweep line | Sweep a line across the plane, keeping a "beach line" of parabolic arcs, and record a vertex each time an arc shrinks to nothing | $O(n \log n)$, which is optimal | Large point sets |
| Nearest-site grid (rasterising) | Test every pixel or grid square for its nearest site and colour it | Grid squares × sites; graphics cards do it in parallel | Any distance measure, weighted sites, heatmaps |

**Fortune's algorithm** (Steven Fortune, 1987) is the classic fast method. A horizontal line sweeps down over the sites. The points already settled are those closer to some site above the line than to the line itself, and the boundary of that region is made of parabolic arcs, one per site. Two kinds of event change it: a new site reaching the line adds an arc, and an arc shrinking to nothing marks a Voronoi vertex. Kept in a balanced tree and a priority queue, the arcs and events give the whole diagram in $O(n \log n)$ time.

The grid method is the simplest to write and the most flexible. Each square knows its nearest site, but the edges are only as sharp as the grid. Hoff and colleagues showed in 1999 that graphics hardware can draw it by rendering a cone under each site and letting the depth test keep the nearest. The heatmap modes in the demo use this method on a 200 × 200 grid, which is how they handle Manhattan distance.

## Euclidean vs Manhattan Voronoi diagrams

Everything above assumes straight-line, or **Euclidean**, distance. A Voronoi diagram can use any distance, and the cells reflect it.

![The same seven sites divided into cells twice. Left, Euclidean distance: convex polygons with straight edges at any angle. Right, Manhattan distance: cells whose edges run only horizontally, vertically or diagonally at 45 degrees, with noticeably different shapes](./voronoi-euclidean-vs-manhattan.svg)

| Distance | Formula | What the cells look like | When it fits |
| --- | --- | --- | --- |
| Euclidean | $\sqrt{\Delta x^2 + \Delta y^2}$ | Convex polygons; edges at any angle | Travel in a straight line: radio signals, open ground, most data sets |
| Manhattan (city block, L1) | $\lvert \Delta x \rvert + \lvert \Delta y \rvert$ | Edges only horizontal, vertical or at 45°; cells can be non-convex | Travel on a grid of streets, chip and circuit layout |
| Chebyshev (L∞) | $\max(\lvert \Delta x \rvert, \lvert \Delta y \rvert)$ | Also horizontal, vertical and 45° edges, but in different places from the Manhattan ones | Moves where a diagonal step costs the same as a straight one |
| Weighted: power | Squared distance minus a weight for each site | Straight edges; a weak site can lose its cell entirely | Masts of different power, shops of different appeal |
| Weighted: multiplicative | Distance divided by a weight for each site | Edges are circular arcs; a weak site keeps only a small cell | Masts of different power, shops of different appeal |
| Along a network | Shortest path on roads or pipes | Cells follow the network | Real travel times, service areas |

Manhattan cells have one quirk. When two sites are diagonal to each other, with equal horizontal and vertical offsets, a whole region can be the same distance from both, so the boundary is not a line but an area. Software has to break the tie. The demo on this page gives such points to the first site in the list.

## Voronoi diagram examples and uses

Voronoi diagrams answer one question, "which of these is nearest?", for every point at once. That makes them useful far beyond geometry:

- Service areas and catchments. The area each school, hospital, shop or depot is nearest to is a first estimate of who it serves. In hydrology, the meteorologist Alfred Thiessen used the same construction in 1911 to weight rain gauges by the area each one represents, which is why GIS tools still call the cells Thiessen polygons.
- Mobile phone coverage. A phone usually connects to the strongest signal, which, for masts of similar power on open ground, is roughly the nearest one. A Voronoi diagram of the masts is a common first model of each cell's coverage.
- The 1854 cholera outbreak in London. In a map published in 1855, John Snow drew a dotted line around the area that was closer, by walking distance along the streets, to the Broad Street pump than to any other pump. Deaths fell away sharply, or stopped, outside it. That boundary is a Voronoi cell measured along a street network.
- Machine learning. A 1-nearest-neighbour classifier gives each point the label of its nearest training example, so its decision boundary is made of Voronoi edges between examples of different classes. In [k-means clustering](/learn/applications/machine-learning/k-means-clustering/), each point is assigned to its nearest centre, so the clusters at each step are the Voronoi cells of the centres. See the [decision boundary guide](/learn/applications/machine-learning/decision-boundary/) for how other classifiers divide the plane.
- Materials and biology. If crystals start growing at random points at the same moment and at the same speed, the grains they form when they meet are Voronoi cells. Real metals deviate from this, but it is a standard starting model for grain structure, and similar models describe packed cells in plant and animal tissue.
- Computer graphics. Worley noise, a texture function published in 1996, shades each pixel by its distance to the nearest of a set of random points. It is behind many stone, scale and cell textures in games and films.
- Robotics. The edges of a Voronoi diagram built from obstacles are the paths that stay as far from the obstacles as possible, so they are used for safe route planning.
- Even spacing. Lloyd's algorithm moves each site to the centre of its own cell and repeats. The sites spread out evenly, giving a centroidal Voronoi tessellation, used for stippling images, placing sensors and meshing.

## Voronoi diagram vs heatmap vs choropleth map

A Voronoi diagram, a heatmap and a choropleth map can all look like a patchwork of coloured regions. They answer different questions.

| Chart | Regions come from | Colour shows | Use it when |
| --- | --- | --- | --- |
| Voronoi diagram | The positions of the sites: each region is the area nearest one site | Which site, or a property of the site or cell (area, load, class) | You want to see who serves what, nearest neighbours, or how evenly points are spread |
| [Heatmap](/learn/chart-types/cartesian/heatmap/) | A regular grid of equal squares | A value measured or computed at each square | You have a value at every point of a grid, such as density or temperature |
| [Choropleth map](/learn/chart-types/complex/choropleth-map/) | Fixed boundaries: countries, states, postcodes | A rate or class for each area | Your data is already grouped by named areas |
| [Scatter plot](/learn/chart-types/cartesian/scatter-plot/) | No regions; each point is drawn on its own | Category or value of each point | The points matter more than the space between them |

A nearest-site heatmap sits between the first two: a grid coloured by the Voronoi cell each square falls in.

## Common Voronoi diagram mistakes

Most Voronoi diagram mistakes come from trusting the cells more than the sites, distances and scales behind them.

- **Unequal axis scales.** If one unit on the x axis is drawn longer than one unit on the y axis, the bisectors no longer look perpendicular and the cells look wrong, even though the maths is right. Lock the aspect ratio.
- **Reading the edge cells as real areas.** Open cells are cut wherever the frame happens to be. With randomly placed sites, the largest cell is usually one at the edge for that reason. Compare only closed cells, or clip to a meaningful boundary such as a coastline or a city limit.
- **Using straight-line distance for travel that isn't straight.** Customers, ambulances and pipes follow networks. A straight-line catchment can put a house in the wrong area when a river or motorway lies between it and the nearest site.
- **Mixing units.** When the axes are different quantities, such as age and income in a nearest-neighbour model, the cells depend entirely on how each axis is scaled. Standardise the features first.
- **Ignoring duplicates and ties.** Two sites in the same place share one cell, and four or more sites on a circle make a vertex where four cells meet. Code that draws Voronoi diagrams should check for both.
- **Giving neighbouring cells the same colour.** Colour by site with a palette where touching cells always differ; a greedy colouring over the Delaunay neighbours does this.
- **Treating cell area as importance.** A small cell means the sites are crowded there, not that the site matters less. Colour by area to show spacing, not value.

## How to make a Voronoi diagram in JavaScript, React or Angular

In the demo below, the cells, the outlines, the Delaunay overlay and a 200 by 200 nearest-site heatmap (40,000 squares) are recomputed and redrawn as you drag a site, with up to 200 sites. The demo computes every cell in the browser by half-plane clipping, with no geometry library.

Click an empty spot to add a site, drag a site to move it, and Shift+click a site to remove it. **Draw cells as** switches between exact polygons and a nearest-site heatmap with Euclidean or Manhattan distance; **Colour** shows each site in its own colour or shades each cell by its area. **Delaunay triangulation** overlays the dual, and **Euclidean cell edges** draws the polygon outlines, which on the Manhattan heatmap shows how far the two diagrams differ. **Sites**, **New random sites** and **Clear** start again. The readout gives the number of cells, the largest and smallest cell, the Delaunay counts and the nearest site to the pointer. Scroll to zoom, right-drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="Voronoi diagram" demo="heatmap-chart" demoLabel="heatmap chart" docs="/2d-charts/chart-types/fast-triangle-renderable-series/" docsLabel="SciChart.js triangle series documentation" />

Here is the code for this chart. The Voronoi cells, the Delaunay edges and the nearest-site grid are plain JavaScript; SciChart.js draws the cells as triangle series, the heatmap as a uniform heatmap, the outlines as line series and the sites as scatter markers.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastTriangleRenderableSeries,
        ETriangleSeriesDrawMode,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Point = { x: number; y: number };

    // Cut a convex polygon to the side of a line where side(p) <= 0
    const clip = (polygon: Point[], side: (p: Point) => number) => {
        const out: Point[] = [];
        polygon.forEach((p, i) => {
            const q = polygon[(i + 1) % polygon.length];
            const sp = side(p), sq = side(q);
            if (sp <= 0) out.push(p);
            if ((sp <= 0) !== (sq <= 0)) {
                const t = sp / (sp - sq);
                out.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) });
            }
        });
        return out;
    };

    // Each site's cell: the box, cut by the perpendicular bisector with every other site
    const voronoiCells = (sites: Point[], size: number) =>
        sites.map((a, i) => {
            let cell: Point[] = [{ x: 0, y: 0 }, { x: size, y: 0 }, { x: size, y: size }, { x: 0, y: size }];
            sites.forEach((b, j) => {
                if (j === i) return;
                const nx = b.x - a.x, ny = b.y - a.y;
                const c = (nx * (a.x + b.x) + ny * (a.y + b.y)) / 2;
                cell = clip(cell, (p) => nx * p.x + ny * p.y - c);
            });
            return cell;
        });

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "x (km)", visibleRange: new NumberRange(0, 100) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "y (km)", visibleRange: new NumberRange(0, 100) }));

        const sites: Point[] = getYourSites(); // e.g. [{ x: 12, y: 40 }, ...] inside the 100 x 100 box
        const cells = voronoiCells(sites, 100);
        const colours = ["#3D7DC4", "#D9772E", "#3BA56A", "#8E66C9", "#C9A227", "#2AA7A7"];
        cells.forEach((cell, i) => {
            const xs: number[] = [], ys: number[] = [];
            for (let v = 1; v + 1 < cell.length; v++) {
                for (const p of [cell[0], cell[v], cell[v + 1]]) { xs.push(p.x); ys.push(p.y); } // a fan of triangles
            }
            sciChartSurface.renderableSeries.add(
                new FastTriangleRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: xs, yValues: ys, isSorted: false }),
                    drawMode: ETriangleSeriesDrawMode.List,
                    fill: colours[i % colours.length],
                    opacity: 0.8
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: [...cell, cell[0]].map((p) => p.x),
                        yValues: [...cell, cell[0]].map((p) => p.y),
                        isSorted: false
                    }),
                    stroke: "#0B1424",
                    strokeThickness: 2
                })
            );
        });
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: sites.map((s) => s.x), yValues: sites.map((s) => s.y), isSorted: false }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#0B1424" })
            })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface };
    };

    export const VoronoiDiagram = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", aspectRatio: "1 / 1", maxWidth: 600 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastTriangleRenderableSeries,
        ETriangleSeriesDrawMode,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    type Point = { x: number; y: number };

    // Cut a convex polygon to the side of a line where side(p) <= 0
    const clip = (polygon: Point[], side: (p: Point) => number) => {
        const out: Point[] = [];
        polygon.forEach((p, i) => {
            const q = polygon[(i + 1) % polygon.length];
            const sp = side(p), sq = side(q);
            if (sp <= 0) out.push(p);
            if ((sp <= 0) !== (sq <= 0)) {
                const t = sp / (sp - sq);
                out.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) });
            }
        });
        return out;
    };

    // Each site's cell: the box, cut by the perpendicular bisector with every other site
    const voronoiCells = (sites: Point[], size: number) =>
        sites.map((a, i) => {
            let cell: Point[] = [{ x: 0, y: 0 }, { x: size, y: 0 }, { x: size, y: size }, { x: 0, y: size }];
            sites.forEach((b, j) => {
                if (j === i) return;
                const nx = b.x - a.x, ny = b.y - a.y;
                const c = (nx * (a.x + b.x) + ny * (a.y + b.y)) / 2;
                cell = clip(cell, (p) => nx * p.x + ny * p.y - c);
            });
            return cell;
        });

    @Component({
        selector: "app-voronoi-diagram",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; max-width: 600px; aspect-ratio: 1 / 1"></scichart-angular>`
    })
    export class VoronoiDiagramComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "x (km)", visibleRange: new NumberRange(0, 100) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "y (km)", visibleRange: new NumberRange(0, 100) }));

            const sites: Point[] = getYourSites(); // e.g. [{ x: 12, y: 40 }, ...] inside the 100 x 100 box
            const cells = voronoiCells(sites, 100);
            const colours = ["#3D7DC4", "#D9772E", "#3BA56A", "#8E66C9", "#C9A227", "#2AA7A7"];
            cells.forEach((cell, i) => {
                const xs: number[] = [], ys: number[] = [];
                for (let v = 1; v + 1 < cell.length; v++) {
                    for (const p of [cell[0], cell[v], cell[v + 1]]) { xs.push(p.x); ys.push(p.y); } // a fan of triangles
                }
                sciChartSurface.renderableSeries.add(
                    new FastTriangleRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, { xValues: xs, yValues: ys, isSorted: false }),
                        drawMode: ETriangleSeriesDrawMode.List,
                        fill: colours[i % colours.length],
                        opacity: 0.8
                    }),
                    new FastLineRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, {
                            xValues: [...cell, cell[0]].map((p) => p.x),
                            yValues: [...cell, cell[0]].map((p) => p.y),
                            isSorted: false
                        }),
                        stroke: "#0B1424",
                        strokeThickness: 2
                    })
                );
            });
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: sites.map((s) => s.x), yValues: sites.map((s) => s.y), isSorted: false }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#0B1424" })
                })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- `FastTriangleRenderableSeries` with `ETriangleSeriesDrawMode.List` draws every three points as one triangle. A convex cell becomes a fan of triangles from its first corner, and one series per colour holds all the cells of that colour.
- The cell outlines and the Delaunay edges are each a single `FastLineRenderableSeries`, with `NaN` between segments (`containsNaN: true`) so one series draws many separate lines.
- The heatmap modes use `UniformHeatmapRenderableSeries`: each grid square holds the colour index of its nearest site, and a `HeatmapColorMap` with a sharp step at each whole number turns the indexes into flat colours.
- A `CustomChartModifier2D` turns clicks and drags into site edits, and a `preRender` handler keeps one kilometre the same length on both axes, so the bisectors stay at right angles on screen.

**See it in the demo app:** [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart).

**Go deeper:** [SciChart.js triangle series documentation](/2d-charts/chart-types/fast-triangle-renderable-series/), the [uniform heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), the [scatter series documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), and the learning center guides to the [heatmap](/learn/chart-types/cartesian/heatmap/), [choropleth map](/learn/chart-types/complex/choropleth-map/) and [network graph](/learn/chart-types/complex/network-graph/).

## Frequently asked questions

### What is a Voronoi diagram used for?

A Voronoi diagram answers "which of these places is nearest?" for every point on a map at once. It is used to draw the catchment area of each shop, school, hospital or rain gauge, to model mobile phone coverage, to find nearest neighbours in machine learning, to model grains in metals and cells in tissue, to make cellular textures in computer graphics, and to plan robot paths that stay as far as possible from obstacles.

### What is the difference between a Voronoi diagram and a Delaunay triangulation?

They are two views of the same structure. The Voronoi diagram splits the plane into one cell per site. The Delaunay triangulation joins two sites with a line whenever their cells share an edge, which divides the space between the sites into triangles. Each Voronoi vertex is the centre of the circle through the three corners of one Delaunay triangle, and that circle has no other site inside it. Build either one and you can read the other off it.

### What are Thiessen polygons?

Thiessen polygons are Voronoi cells under another name, used in geography, hydrology and GIS software. They are named after the meteorologist Alfred Thiessen, who in 1911 drew one around each rain gauge and weighted each gauge's rainfall by its polygon's area to estimate the average rainfall over a region.

### How do you draw a Voronoi diagram by hand?

Join each site to its nearby sites with light lines, then draw the perpendicular bisector of each of those lines: the line through its midpoint at a right angle. Around each site, keep only the parts of the bisectors that are closer to that site than to any other. The bisectors meet in threes at the Voronoi vertices, and the pieces between the vertices are the cell edges. Starting from the Delaunay triangles makes it easier, because each vertex is the centre of a triangle's circumcircle.

### Are Voronoi cells always convex?

With ordinary straight-line (Euclidean) distance, yes. Each cell is the overlap of half-planes, one per other site, and an overlap of half-planes is always convex. With other distances the cells change shape: Manhattan cells are not always convex, and cells measured along a road network follow the streets.

### How do I make a Voronoi diagram in JavaScript?

For a few hundred sites, compute each cell by half-plane clipping: start with a large rectangle and, for every other site, cut away the half beyond the perpendicular bisector. Then cut each cell into triangles from its first corner and draw them, with the cell outlines as a line series and the sites as scatter markers. For other distance measures, colour a grid by its nearest site and draw it as a heatmap. SciChart.js does both with FastTriangleRenderableSeries and UniformHeatmapRenderableSeries, in plain JavaScript, React or Angular.

## Sources

- Aurenhammer, F. (1991), [Voronoi diagrams: a survey of a fundamental geometric data structure](https://doi.org/10.1145/116873.116880). *ACM Computing Surveys*, 23(3), 345–405. Properties, the Delaunay dual, algorithms and history.
- de Berg, M., Cheong, O., van Kreveld, M. and Overmars, M. (2008), *Computational Geometry: Algorithms and Applications*, 3rd edition, Springer. Chapter 7 (Voronoi diagrams, Fortune's algorithm, the $2n - 5$ and $3n - 6$ bounds) and chapter 9 (Delaunay triangulations and the angle property).
- Fortune, S. (1987), [A sweepline algorithm for Voronoi diagrams](https://doi.org/10.1007/BF01840357). *Algorithmica*, 2, 153–174.
- Okabe, A., Boots, B., Sugihara, K. and Chiu, S. N. (2000), *Spatial Tessellations: Concepts and Applications of Voronoi Diagrams*, 2nd edition, Wiley. Applications in geography, biology and materials, and generalised distances.
- Thiessen, A. H. (1911), [Precipitation averages for large areas](https://journals.ametsoc.org/view/journals/mwre/39/7/1520-0493_1911_39_1082b_pafla_2_0_co_2.xml). *Monthly Weather Review*, 39(7), 1082–1089.
- Snow, J. (1855), [map of the Broad Street outbreak with the boundary of equal walking distance to the pump](https://johnsnow.matrix.msu.edu/documentUploads/15-78-298/15-78-298-22-1855-08-Snow-CICmap-Beem02.pdf), from the *Report on the Cholera Outbreak in the Parish of St. James, Westminster* (Cholera Inquiry Committee). John Snow Archive, Michigan State University.
- Hoff, K. E., Keyser, J., Lin, M., Manocha, D. and Culver, T. (1999), [Fast computation of generalized Voronoi diagrams using graphics hardware](https://doi.org/10.1145/311535.311567). *Proceedings of SIGGRAPH 99*, 277–286.
- Worley, S. (1996), [A cellular texture basis function](https://doi.org/10.1145/237170.237267). *Proceedings of SIGGRAPH 96*, 291–294.
- Du, Q., Faber, V. and Gunzburger, M. (1999), [Centroidal Voronoi tessellations: applications and algorithms](https://doi.org/10.1137/S0036144599352836). *SIAM Review*, 41(4), 637–676.

<LearnCta position="bottom" chart="Voronoi diagram" demo="heatmap-chart" demoLabel="heatmap chart" docs="/2d-charts/chart-types/fast-triangle-renderable-series/" docsLabel="SciChart.js triangle series documentation" />
