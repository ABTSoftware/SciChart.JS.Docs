---
sidebar_position: 35
---

# Choropleth Maps

Choropleth Maps visualize geographic regions colored by a data metric — population, density, area, or any continuous value — making spatial patterns immediately visible. SciChart.js has no dedicated map series; instead, choropleth maps are composed from [FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html) for filled regions, [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinerenderableseries.html) for boundary outlines, and [FastBubbleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastbubblerenderableseries.html) for point-of-interest markers.

:::tip
The [JavaScript Choropleth Map Example](https://www.scichart.com/demo/react/map-example) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/map-example).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/map-example"
    title="Choropleth Map"
/>

## Core Building Blocks

A choropleth map in SciChart.js is assembled from standard chart primitives:

- **[FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html)** — renders each geographic region as a set of filled triangles using [ETriangleSeriesDrawMode.List:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/etriangleseriesdrawmode.html#list)
- **[XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xydataseries.html)** — stores the flat list of triangle vertex coordinates (longitude/latitude pairs) produced by triangulation
- **[FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinerenderableseries.html)** — draws region boundary outlines over the filled triangles
- **[FastBubbleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastbubblerenderableseries.html)** — places city or point-of-interest markers using [EllipsePointMarker:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/ellipsepointmarker.html)
- **[XyzDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyzdataseries.html)** — stores marker positions with a Z value controlling marker size
- **[NumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/numericaxis.html)** — maps longitude (X) and latitude (Y) coordinates to screen space; typically hidden via `isVisible: false` and padded with `growBy`

## From GeoJSON to Triangle Vertices

[FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html) renders triangles, not arbitrary polygons. Geographic region boundaries (typically sourced from GeoJSON) must be converted to a flat list of triangles before they can be passed to [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xydataseries.html).

The standard approach is **constrained Delaunay triangulation**, which fills the interior of any polygon with non-overlapping triangles that respect the boundary edges:

1. **Load boundary outlines** from GeoJSON (array of `[longitude, latitude]` coordinate pairs per region)
2. **Triangulate** each polygon outline using a library such as [poly2tri](https://github.com/r3mi/poly2tri.js) or a custom Bowyer-Watson / sweep-line implementation
3. **Flatten** the resulting triangle list: each triangle produces three `[x, y]` pairs appended in sequence
4. **Store** the flat `xValues` / `yValues` arrays in [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xydataseries.html) and pass to [FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html) with `drawMode: ETriangleSeriesDrawMode.List`

Pre-computing triangulation offline and bundling the result as JSON (e.g. `australiaConverted.json`) is strongly recommended — triangulation can be expensive at runtime for regions with many vertices. Each region object in the bundle typically has the shape:

```ts
type RegionData = {
    name: string;         // region identifier
    outline: number[][];  // boundary coordinate pairs for the outline series
    areaData: number[][]  // flat triangle vertices for the fill series
};
```

## Color Mapping

Each region gets its own [FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html) instance, and the `fill` property drives the choropleth coloring. A helper function linearly interpolates between two colors based on where a region's value falls in the dataset range:

```ts
function interpolateColor(
    value: number,
    min: number,
    max: number,
    colorLow: string,
    colorHigh: string
): string {
    const t = (value - min) / (max - min);
    // parse RGB components of colorLow and colorHigh, blend by t
    // return a CSS color string
}

// Per-region usage:
triangleSeries.fill = interpolateColor(region.population, minPop, maxPop, "#1a237e", "#e53935");
triangleSeries.opacity = 0.9;
```

To switch between metrics (e.g. population vs. area vs. density), recalculate the `min`/`max` for the new metric, iterate over all series, and update `fill` on each.

## Boundary Outlines

A separate [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinerenderableseries.html) per region renders the boundary outline on top of the filled triangles. The outline `xValues`/`yValues` come directly from the region's `outline` coordinate array — no triangulation needed:

```ts
import { FastLineRenderableSeries, XyDataSeries } from "scichart";

const outlineSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues: region.outline.map(p => p[0]),
        yValues: region.outline.map(p => p[1]),
    }),
    stroke: "white",
    strokeThickness: 1,
});
sciChartSurface.renderableSeries.add(outlineSeries);
```

## City Markers

[FastBubbleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastbubblerenderableseries.html) with an [EllipsePointMarker:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/ellipsepointmarker.html) places labelled city dots over the map. City names are rendered via the `dataLabels` API using [DataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datalabelprovider.html):

```ts
import {
    FastBubbleRenderableSeries,
    XyzDataSeries,
    EllipsePointMarker,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
} from "scichart";

const citySeries = new FastBubbleRenderableSeries(wasmContext, {
    dataSeries: new XyzDataSeries(wasmContext, {
        xValues: cities.map(c => c.lon),
        yValues: cities.map(c => c.lat),
        zValues: cities.map(() => 1),     // uniform size
        metadata: cities.map(c => ({ isSelected: false, label: c.name })),
    }),
    pointMarker: new EllipsePointMarker(wasmContext, {
        width: 12,
        height: 12,
        fill: "white",
        stroke: "white",
    }),
    dataLabels: {
        style: { fontFamily: "Arial", fontSize: 12, color: "white" },
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    },
});
sciChartSurface.renderableSeries.add(citySeries);
```

## Chart Setup

The axes use `isVisible: false` since geographic coordinates need no tick marks, and `growBy` adds margin so regions are not clipped at the chart edge:

```ts
import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
} from "scichart";

const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

const growBy = new NumberRange(0.05, 0.05);
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy }));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy }));

sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new ZoomExtentsModifier(),
    new MouseWheelZoomModifier()
);
```

## Preserving Aspect Ratio

Geographic data uses longitude/latitude, which only looks correct at a 1:1 scale ratio. To keep the map undistorted, adjust the visible range of one axis whenever the chart container resizes:

```ts
sciChartSurface.addDirtied(() => {
    const { width, height } = sciChartSurface.domCanvas2D;
    const xRange = sciChartSurface.xAxes.get(0).visibleRange;
    const xSpan = xRange.max - xRange.min;
    const ySpan = xSpan * (height / width);
    const yCentre = (sciChartSurface.yAxes.get(0).visibleRange.min +
                     sciChartSurface.yAxes.get(0).visibleRange.max) / 2;
    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(
        yCentre - ySpan / 2,
        yCentre + ySpan / 2
    );
});
```

## Series Layering

Render order determines which series appear on top. Add series to `sciChartSurface.renderableSeries` in this order so fills, outlines, and markers stack correctly:

| Layer | Series type | Purpose |
|---|---|---|
| 1 (bottom) | `FastTriangleRenderableSeries` × N | Filled region polygons |
| 2 | `FastLineRenderableSeries` × N | Region boundary outlines |
| 3 (top) | `FastBubbleRenderableSeries` | City / POI markers |

#### See Also

* [The Triangle Series Type](/2d-charts/chart-types/fast-triangle-renderable-series/)
* [The Bubble Series Type](/2d-charts/chart-types/fast-bubble-renderable-series/)
* [The Line Series Type](/2d-charts/chart-types/fast-line-renderable-series/)
* [The Treemap Chart Type](/2d-charts/chart-types/tree-map-type/)
