---
sidebar_position: 106
---

# Polar Maps

A Polar Map renders geographic regions as color-coded triangle meshes on a [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartpolarsurface.html), mapping longitude to the angular axis and latitude to the radial axis. This makes it well-suited for global data visualizations such as population density, climate data, or geopolitical comparisons — any dataset where values vary across geographic regions.

The map is built from [PolarTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/polartrianglerenderableseries.html): GeoJSON polygon outlines are decomposed into triangles via Delaunay triangulation, and each country or region gets its own series with a fill color derived from a data value (e.g. population).

:::tip
The [JavaScript Polar Map Example](https://www.scichart.com/demo/javascript/polar-map-example) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/PolarCharts/PolarMapExample) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/polar-map-example).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/polar-map-example"
    title="Polar Map Example"
/>

## Creating the Surface and Axes

The surface is a standard [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartpolarsurface.html). Two [PolarNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/polarnumericaxis.html) instances map geographic coordinates: longitude on the angular axis (`-180` to `180`) and latitude on the radial axis (`-90` to `90`). Gridlines, tick marks, and major bands are all disabled to keep the visual clean — the triangle fills supply all the visual structure.

```ts
const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
});

const angularXAxis = new PolarNumericAxis(wasmContext, {
    polarAxisMode: EPolarAxisMode.Angular,
    visibleRange: new NumberRange(-180, 180),
    drawMajorGridLines: false,
    drawMajorBands: false,
    drawMajorTickLines: false,
    drawMinorTickLines: false,
    useNativeText: true,
});
sciChartSurface.xAxes.add(angularXAxis);

const radialYAxis = new PolarNumericAxis(wasmContext, {
    polarAxisMode: EPolarAxisMode.Radial,
    visibleRange: new NumberRange(-90, 90),
    drawMajorGridLines: false,
    drawMajorBands: false,
    drawMajorTickLines: false,
    drawMinorTickLines: false,
    useNativeText: true,
});
sciChartSurface.yAxes.add(radialYAxis);
```

## Loading and Triangulating Geographic Data

GeoJSON stores geographic regions as arrays of `[longitude, latitude]` polygon coordinates. To render them on a `SciChartPolarSurface`, each polygon must be converted into triangles — the GPU renders triangles, not arbitrary polygons.

The [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/PolarCharts/PolarMapExample) uses a `constrainedDelaunayTriangulation` utility to do this. The output is a flat array of `[x, y]` pairs (every three consecutive pairs form one triangle) that feeds directly into `XyDataSeries`.

```ts
// mapData is a parsed GeoJSON FeatureCollection
mapData.features.forEach((feature) => {
    const geometry = feature.geometry;
    const rings = geometry.type === "Polygon"
        ? [geometry.coordinates[0]]
        : geometry.coordinates.map((poly) => poly[0]); // MultiPolygon

    rings.forEach((ring) => {
        ring.pop(); // GeoJSON closes polygons by repeating the first point — remove it
        const triangulated = constrainedDelaunayTriangulation(ring); // [[x,y], [x,y], ...]
        const flat = [].concat(...triangulated);

        const dataSeries = new XyDataSeries(wasmContext, {
            xValues: flat.map((p) => p[0]), // longitude
            yValues: flat.map((p) => p[1]), // latitude
        });

        // store dataSeries alongside feature metadata for rendering
    });
});
```

`constrainedDelaunayTriangulation` is not part of the `scichart` package — it is a utility included in the examples suite. For a production integration, any Delaunay triangulation library (e.g. `d3-delaunay`, `earcut`) can be used to decompose polygons into triangle lists.

## Color Mapping

Each country's fill color is derived from a data value (population in the live example) using linear RGB interpolation between two endpoint colors. The function below maps any numeric value in `[min, max]` onto a gradient from white (`#ffffff`) to dark blue (`#1e3489`):

```ts
function interpolateColor(min: number, max: number, value: number): string {
    value = Math.max(min, Math.min(max, value)); // clamp
    const t = (value - min) / (max - min);       // normalize to [0, 1]

    const fromRgb = [0xff, 0xff, 0xff]; // #ffffff — white (low values)
    const toRgb   = [0x1e, 0x34, 0x89]; // #1e3489 — dark blue (high values)

    const r = Math.round(fromRgb[0] + t * (toRgb[0] - fromRgb[0]));
    const g = Math.round(fromRgb[1] + t * (toRgb[1] - fromRgb[1]));
    const b = Math.round(fromRgb[2] + t * (toRgb[2] - fromRgb[2]));

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
```

Pass the global `min` and `max` for the dataset so every country is scaled consistently. The result is passed directly to the `fill` property of each `PolarTriangleRenderableSeries`.

## Rendering Triangle Series

One [PolarTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/polartrianglerenderableseries.html) is created per geographic region. `ETriangleSeriesDrawMode.List` tells the renderer that every three consecutive `(x, y)` pairs in the data series form an independent triangle — the direct output format of Delaunay triangulation.

```ts
const triangleSeries = new PolarTriangleRenderableSeries(wasmContext, {
    dataSeries: dataSeries,
    drawMode: ETriangleSeriesDrawMode.List,
    fill: interpolateColor(minPopulation, maxPopulation, feature.properties.population),
    opacity: 0.9,
});
sciChartSurface.renderableSeries.add(triangleSeries);
```

## Switching Pole Perspective

The `flippedCoordinates` property on a [PolarNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/polarnumericaxis.html) reverses the direction of that axis. To toggle between a North Pole view and a South Pole view, the angular axis is mirrored while the radial axis uses the inverse setting. Because `flippedCoordinates` is set at construction time and cannot be changed after the fact, both axes and all renderable series must be cleared and rebuilt on each switch.

```ts
const setView = (viewFromSouthPole: boolean) => {
    sciChartSurface.xAxes.clear();
    sciChartSurface.yAxes.clear();
    sciChartSurface.renderableSeries.clear(true); // true = dispose data series

    sciChartSurface.xAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(-180, 180),
        flippedCoordinates: viewFromSouthPole,   // mirror east/west for south pole
        drawMajorGridLines: false,
        drawMajorBands: false,
        useNativeText: true,
    }));

    sciChartSurface.yAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(-90, 90),
        flippedCoordinates: !viewFromSouthPole,  // inverse of angular axis
        drawMajorGridLines: false,
        drawMajorBands: false,
        useNativeText: true,
    }));

    // Re-add all triangle series after rebuilding axes
    setMap();
};
```

## Chart Modifiers

Three polar-aware modifiers enable standard map navigation:

```ts
sciChartSurface.chartModifiers.add(
    new PolarPanModifier(),           // click-drag to pan the view
    new PolarZoomExtentsModifier(),   // double-click to reset zoom to fit all data
    new PolarMouseWheelZoomModifier() // scroll wheel to zoom in/out
);
```

- [PolarPanModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/polarpanmodifier.html) — click and drag to rotate or translate the polar view.
- [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/polarzoomextentsmodifier.html) — double-click to snap the view back to fit all data.
- [PolarMouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/polarmousewheelzoommodifier.html) — scroll to zoom in and out radially.

#### See Also

- [The Polar Triangle Series Type](/2d-charts/chart-types/polar-triangle-renderable-series/) — core API reference for `PolarTriangleRenderableSeries`
- [The Polar Radar Chart Type](/2d-charts/chart-types/polar-radar-chart/) — another polar chart example using line and mountain series
- [The Polar Uniform Heatmap Chart Type](/2d-charts/chart-types/polar-uniform-heatmap-renderable-series/) — alternative for continuous geographic data without triangulation
