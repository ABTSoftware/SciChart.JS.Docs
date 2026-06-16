---
sidebar_position: 2
---

# Multi-Region Maps

The Multi-Region Map demo demonstrates switching the displayed geographic region at runtime — between world, Europe, Australia, and Africa — while reusing the same [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartsurface.html). Each region's pre-triangulated polygon data is swapped in by clearing existing series and adding new ones, keeping memory and initialization overhead low.

:::tip
The [JavaScript Multi-Region Map Example](https://www.scichart.com/demo/react/multi-map-example) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/multi-map-example).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/multi-map-example"
    title="Multi-Region Map"
/>

## Core Building Blocks

The same series types used for [choropleth maps](/2d-charts/chart-types/choropleth-map) are used here — one [FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html) per region for filled polygons, and a paired [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinerenderableseries.html) per region for outlines.

## Switching Regions at Runtime

When the user selects a different map region, all existing renderable series are removed and a new set is built from that region's pre-triangulated data:

```ts
import {
    FastTriangleRenderableSeries,
    FastLineRenderableSeries,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    NumberRange,
} from "scichart";

// 11-color palette for distinct region fills
const COLORS = [
    "#543005", "#8c510a", "#bf812d", "#dfc27d",
    "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f",
    "#01665e", "#003c30", "#004c45",
];

function loadRegion(sciChartSurface, wasmContext, regionData) {
    // Remove all existing fill and outline series
    sciChartSurface.renderableSeries.clear();

    regionData.forEach((region, i) => {
        // Filled polygon triangles
        sciChartSurface.renderableSeries.add(
            new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: region.areaData.map(p => p[0]),
                    yValues: region.areaData.map(p => p[1]),
                }),
                drawMode: ETriangleSeriesDrawMode.List,
                fill: COLORS[(i % COLORS.length) + 1],
                opacity: 0.5,
            })
        );

        // Boundary outline on top
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: region.outline.map(p => p[0]),
                    yValues: region.outline.map(p => p[1]),
                }),
                stroke: "#000000",
                strokeThickness: 1,
            })
        );
    });

    // Fit view to the new region's data extents
    sciChartSurface.zoomExtents();
}
```

Calling `renderableSeries.clear()` disposes all existing series before the new ones are added. `zoomExtents()` then fits the view to the incoming data bounds, so each region fills the chart regardless of its geographic extent.

## Aspect Ratio Preservation

Geographic coordinates are distorted if the chart container changes shape. A resize handler recalculates visible ranges to maintain a 1:1 coordinate scale ratio whenever the chart dimensions change:

```ts
function preserveAspectRatio(sciChartSurface) {
    const { width, height } = sciChartSurface.domCanvas2D;
    const xAxis = sciChartSurface.xAxes.get(0);
    const yAxis = sciChartSurface.yAxes.get(0);

    const xSpan = xAxis.visibleRange.max - xAxis.visibleRange.min;
    const ySpan = xSpan * (height / width);
    const yCentre = (yAxis.visibleRange.min + yAxis.visibleRange.max) / 2;

    yAxis.visibleRange = new NumberRange(
        yCentre - ySpan / 2,
        yCentre + ySpan / 2
    );
}

// Wire up on each render or on window resize
sciChartSurface.addDirtied(preserveAspectRatio);
```

This is the same technique described in the [Choropleth Maps](/2d-charts/chart-types/choropleth-map) parent page.

## Pre-Triangulated Data Format

Each map region ships as a pre-computed JSON bundle to avoid expensive triangulation at runtime. The per-region object shape is identical to the choropleth format:

```ts
type RegionData = {
    name: string;        // region label, e.g. "Germany"
    outline: number[][]; // boundary coordinate pairs for the line series
    areaData: number[][] // flat triangle vertex list for the triangle series
};
```

Separate JSON files are maintained per geographic scope (world, Europe, Australia, Africa), loaded on demand when the user switches region.

## Color Palette

Regions are colored from an 11-stop diverging palette. The palette cycles when the number of regions exceeds the number of colors:

```ts
const fill = COLORS[(regionIndex % COLORS.length) + 1];
```

Unlike a choropleth map, fill color here encodes **identity** (distinguish adjacent regions) rather than a continuous metric. No color interpolation or data-driven mapping is needed.

#### See Also

* [Choropleth Maps](/2d-charts/chart-types/choropleth-map/)
* [Heatmap over Map](/2d-charts/chart-types/choropleth-map/heatmap-over-map/)
* [The Triangle Series Type](/2d-charts/chart-types/fast-triangle-renderable-series/)
