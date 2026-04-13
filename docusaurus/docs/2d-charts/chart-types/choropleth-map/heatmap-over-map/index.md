---
sidebar_position: 1
---

# Heatmap over Map

A geographic heatmap overlays a [UniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformheatmaprenderableseries.html) on top of world map outlines rendered with [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinerenderableseries.html). Both share the same longitude/latitude axis ranges, so heatmap cells align precisely with the underlying geography.

:::tip
The [JavaScript Heatmap over Map Example](https://www.scichart.com/demo/react/heatmap-over-map) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/heatmap-over-map).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/heatmap-over-map"
    title="Heatmap over Map"
/>

## Core Building Blocks

| Layer | Class | Purpose |
|---|---|---|
| Base (bottom) | [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinerenderableseries.html) | Country and continent boundary outlines |
| Overlay (top) | [UniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformheatmaprenderableseries.html) | Color-graded data grid at 50% opacity |

The heatmap legend is provided by [HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/heatmaplegend.html), and color mapping by [HeatmapColorMap:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/heatmapcolormap.html).

## Data Pipeline

The demo visualizes ~23,000 earthquake records from a CSV file. The pipeline converts raw event data into a smoothed 2D magnitude grid:

1. **Parse CSV** — extract latitude, longitude, and magnitude for each record
2. **Map to grid cells** — normalize coordinates into a 600×400 cell grid covering the full world extent (`[-180, 180]` × `[-90, 90]`)
3. **Aggregate** — when multiple earthquakes fall in the same cell, keep the maximum magnitude
4. **Smooth** — apply a 3×3 averaging kernel across neighbouring cells for a continuous visual appearance
5. **Pass to** [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformheatmapdataseries.html) — the resulting `zValues` 2D array, with `xStart`, `xStep`, `yStart`, `yStep` derived from the world coordinate bounds

```ts
import {
    SciChartSurface,
    NumericAxis,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    HeatmapColorMap,
    FastLineRenderableSeries,
    XyDataSeries,
    NumberRange,
} from "scichart";

const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

// Axes span full world coordinates; hidden for a clean map look
const xRange = new NumberRange(-180, 180);
const yRange = new NumberRange(-90, 90);
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
    isVisible: false,
    visibleRange: xRange,
}));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    isVisible: false,
    visibleRange: yRange,
    isYAxis: true,
    flippedCoordinates: true,   // north-up orientation
}));
```

## Coordinate Alignment

The key to correct overlay is that the heatmap grid and the map outlines use **identical axis ranges**. The `xStart / xStep / yStart / yStep` parameters of [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformheatmapdataseries.html) must map each grid cell to its world coordinate:

```ts
const COLS = 600;
const ROWS = 400;
const xStart = -180;
const xStep = 360 / COLS;   // degrees per cell
const yStart = -90;
const yStep = 180 / ROWS;   // degrees per cell

const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
    zValues: smoothedGrid,   // number[][] of size ROWS × COLS
    xStart,
    xStep,
    yStart,
    yStep,
});
```

The Y axis uses `flippedCoordinates: true` so that increasing latitude values appear at the top of the chart (north-up), matching conventional map orientation.

## Color Map

[HeatmapColorMap:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/heatmapcolormap.html) maps Z values (0–10 Richter scale) to a continuous color gradient. Values at or near zero are transparent black so ocean areas without seismic activity remain invisible:

```ts
import { HeatmapColorMap } from "scichart";

const colorMap = new HeatmapColorMap({
    minimum: 0,
    maximum: 10,
    gradientStops: [
        { offset: 0,   color: "#00000000" },  // transparent — no activity
        { offset: 0.2, color: "#00ff00" },    // green — low magnitude
        { offset: 0.4, color: "#ffff00" },    // yellow
        { offset: 0.6, color: "#ff8000" },    // orange
        { offset: 0.8, color: "#ff4000" },    // orange-red
        { offset: 1.0, color: "#ff0000" },    // red — highest magnitude
    ],
});

const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
    dataSeries: heatmapDataSeries,
    colorMap,
    opacity: 0.5,
});
sciChartSurface.renderableSeries.add(heatmapSeries);
```

Setting `opacity: 0.5` on the series lets the map outline layer show through the heatmap overlay.

## Map Outlines

Country and continent boundaries are stored in a JSON file as arrays of `[longitude, latitude]` coordinate pairs. Each boundary polyline becomes a [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinerenderableseries.html) added **before** the heatmap series so it renders underneath:

```ts
import { FastLineRenderableSeries, XyDataSeries } from "scichart";

for (const boundary of worldBoundaries) {
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: boundary.map(p => p[0]),
                yValues: boundary.map(p => p[1]),
            }),
            stroke: "white",
            strokeThickness: 1,
        })
    );
}

// Heatmap added last — renders on top
sciChartSurface.renderableSeries.add(heatmapSeries);
```

## Heatmap Legend

[HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/heatmaplegend.html) is a companion component that renders the color scale in a separate DOM element. It must reference the same [HeatmapColorMap:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/heatmapcolormap.html) instance:

```ts
import { HeatmapLegend } from "scichart";

const legend = await HeatmapLegend.create("legend-div-id", {
    colorMap,
    axis: {
        axisTitle: "Magnitude (Richter)",
        labelPrecision: 1,
    },
});
```

#### See Also

* [Uniform Heatmap Series](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/)
* [Heatmap Color Maps and Legends](/2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/)
* [Choropleth Maps](/2d-charts/chart-types/choropleth-map/)
