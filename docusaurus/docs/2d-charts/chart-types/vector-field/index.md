---
sidebar_position: 36
---

# Vector Field Charts

A Vector Field Chart visualizes a 2D field of vectors — each arrow shows direction and optionally magnitude at a point in space. Common applications include fluid dynamics, electromagnetic field visualization, gradient plots in mathematics, and wind/current maps in geoscience.

SciChart.js has no dedicated vector field series; instead, vector fields are composed from [FastLineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinesegmentrenderableseries.html) for the vector lines, an [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/istrokepaletteprovider.html) for gradient coloring, and optionally [FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html) for arrowheads.

:::tip
The [JavaScript Vector Field Example](https://www.scichart.com/demo/react/vector-field) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/vector-field).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/vector-field"
    title="Vector Field Chart"
/>

## Core Building Blocks

A vector field in SciChart.js is assembled from:

- **[FastLineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinesegmentrenderableseries.html)** — renders each vector as a line segment between a start and end point
- **[XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xydataseries.html)** — stores alternating start/end coordinate pairs; pairs `[x₀, y₀]` and `[x₁, y₁]` define one segment
- **[XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html)** — alternative data series with explicit `x, y, x1, y1` per segment; cleaner for pre-computed data
- **[IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/istrokepaletteprovider.html)** with `EStrokePaletteMode.GRADIENT` — applies distinct colors to each end of a segment, producing a per-vector gradient
- **[FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html)** — renders arrowheads as filled triangles positioned at each vector tip *(optional)*
- **[CentralAxesLayoutManager:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/centralaxeslayoutmanager.html)** — positions axes at the center of the chart instead of the borders, useful when the field spans negative and positive coordinates *(optional)*

## Data Format

[FastLineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastlinesegmentrenderableseries.html) draws one independent line segment per consecutive pair of data points. The two data series options offer different ergonomics:

### Using XyDataSeries (alternating pairs)

Points are appended in `start, end, start, end, …` order. The palette provider receives the index of each point and uses `index % 2` to distinguish segment start from segment end — even indices are start points, odd indices are end points.

```ts
const dataSeries = new XyDataSeries(wasmContext);

for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
        // start point
        dataSeries.append(x, y);
        // end point — displaced by the vector at (x, y)
        dataSeries.append(x + dx(x, y), y + dy(x, y));
    }
}

lineSegmentSeries.dataSeries = dataSeries;
```

### Using XyxyDataSeries (explicit start/end)

Each element in the series stores both endpoints. This avoids the alternating-index convention:

```ts
const lineSegmentPoints = [
    { x: 1, y: 1, x1: 1.4, y1: 1.3 },
    { x: 2, y: 1, x1: 2.3, y1: 1.5 },
    // ...
];

const lineSegmentSeries = new FastLineSegmentRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
        xValues:  lineSegmentPoints.map(p => p.x),
        yValues:  lineSegmentPoints.map(p => p.y),
        x1Values: lineSegmentPoints.map(p => p.x1),
        y1Values: lineSegmentPoints.map(p => p.y1),
    }),
    strokeThickness: 2,
    stroke: "cornflowerblue"
});
```

:::tip
`XyxyDataSeries` cannot be used with a `paletteProvider` — gradient coloring per segment endpoint requires `XyDataSeries` with `EStrokePaletteMode.GRADIENT`.
:::

## Gradient Coloring

To color each vector with a gradient that runs from its tail to its tip, implement [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/istrokepaletteprovider.html) and set `strokePaletteMode` to `EStrokePaletteMode.GRADIENT`.

`overrideStrokeArgb` is called once per data point. Since points alternate `start / end`, even indices receive the tail color and odd indices receive the tip color:

```ts
import {
    IStrokePaletteProvider,
    EStrokePaletteMode,
    EPaletteProviderType,
    parseColorToUIntArgb,
    IRenderableSeries,
    TPaletteProviderDefinition
} from "scichart";

class VectorFieldPaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.GRADIENT;
    private readonly tailColor = parseColorToUIntArgb("blue");
    private readonly tipColor  = parseColorToUIntArgb("orange");

    public onAttached(parentSeries: IRenderableSeries): void {}
    public onDetached(): void {}

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return index % 2 === 0 ? this.tailColor : this.tipColor;
    }

    public toJSON(): TPaletteProviderDefinition {
        return { type: EPaletteProviderType.Custom, customType: "VectorFieldPaletteProvider" };
    }
}
```

Attach it to the series:

```ts
const lineSegmentSeries = new FastLineSegmentRenderableSeries(wasmContext, {
    strokeThickness: 3,
    paletteProvider: new VectorFieldPaletteProvider()
});
```

## Generating Vector Data from a Mathematical Field

A typical vector field is defined by a function `F(x, y) = (dx, dy)` that gives the displacement vector at each grid point. The demo uses the complex quadratic `f(z) = z² − 4`:

```ts
const multiplier = 0.01; // scales vector length
const dataSeries = new XyDataSeries(wasmContext);

for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
        // tail
        dataSeries.append(x, y);
        // tip — real and imaginary parts of z² - 4 = (x² - y² - 4) + 2xyi
        dataSeries.append(
            x + (x * x - y * y - 4) * multiplier,
            y + (2 * x * y)         * multiplier
        );
    }
}

lineSegmentSeries.dataSeries = dataSeries;
```

For a simpler trigonometric field (sine/cosine):

```ts
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const x = i * spacing;
        const y = j * spacing;

        const angle = Math.sin(x) + Math.cos(y);
        const dx = Math.cos(angle) * scale;
        const dy = Math.sin(angle) * scale;

        dataSeries.append(x,      y);       // tail
        dataSeries.append(x + dx, y + dy);  // tip
    }
}
```

## Centering the Axes

When a vector field spans both negative and positive coordinates, [CentralAxesLayoutManager:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/centralaxeslayoutmanager.html) positions the axes through the origin:

```ts
import { CentralAxesLayoutManager, EAutoRange, NumberRange } from "scichart";

sciChartSurface.layoutManager = new CentralAxesLayoutManager();

sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
    visibleRange: new NumberRange(-15, 15),
    autoRange: EAutoRange.Never,
    drawMajorBands: false,
    drawMajorGridLines: false,
    drawMinorGridLines: false,
    axisBorder: { color: "white", borderBottom: 1 },
    zoomExtentsToInitialRange: true
}));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    visibleRange: new NumberRange(-10, 10),
    autoRange: EAutoRange.Never,
    drawMajorBands: false,
    drawMajorGridLines: false,
    drawMinorGridLines: false,
    axisBorder: { color: "white", borderRight: 1 },
    zoomExtentsToInitialRange: true
}));
```

## Adding Arrowheads

Arrowheads make direction unambiguous and are rendered using a separate [FastTriangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fasttrianglerenderableseries.html). Each arrowhead is a small filled triangle placed at the tip of each vector and rotated to match its direction:

```ts
import {
    FastTriangleRenderableSeries,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    parseColorToUIntArgb
} from "scichart";

// Compute arrowhead triangle vertices for each vector tip
function buildArrowheads(vectors: { x: number; y: number; dx: number; dy: number }[]) {
    const xValues: number[] = [];
    const yValues: number[] = [];
    const size = 0.15; // arrowhead half-size

    for (const { x, y, dx, dy } of vectors) {
        const tipX = x + dx;
        const tipY = y + dy;
        const len  = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux   = dx / len;
        const uy   = dy / len;

        // Triangle: apex at tip, base perpendicular to vector
        xValues.push(tipX,               tipX - ux * size - uy * size, tipX - ux * size + uy * size);
        yValues.push(tipY,               tipY - uy * size + ux * size, tipY - uy * size - ux * size);
    }
    return { xValues, yValues };
}

const { xValues, yValues } = buildArrowheads(vectors);

const arrowSeries = new FastTriangleRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    fill: "orange",
    drawMode: ETriangleSeriesDrawMode.List
});
sciChartSurface.renderableSeries.add(arrowSeries);
```

## Complete Example

<LiveDocSnippet name="../fast-line-segment-renderable-series/gradient-field/demo" />

```ts showLineNumbers file=../fast-line-segment-renderable-series/gradient-field/demo.ts start=region_A_start end=region_A_end
```

## Chart Modifiers

The standard interaction modifiers work with vector field charts:

```ts
import {
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    CursorModifier
} from "scichart";

sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new ZoomExtentsModifier(),
    new MouseWheelZoomModifier()
);
```

[CursorModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/cursormodifier.html) can display tooltips showing the start and end coordinates of a hovered vector. When using `XyxyDataSeries`, the tooltip data includes `xValue`, `yValue`, `point2xValue`, and `point2yValue`:

```ts
const tooltipDataTemplate = seriesInfos => {
    return seriesInfos
        .filter(si => si.isHit && si.isWithinDataBounds && !isNaN(si.yValue))
        .map(si => `start (${si.xValue.toFixed(2)}, ${si.yValue.toFixed(2)}) → end (${si.point2xValue.toFixed(2)}, ${si.point2yValue.toFixed(2)})`);
};

sciChartSurface.chartModifiers.add(
    new CursorModifier({ showTooltip: true, tooltipDataTemplate })
);
```

## Data Series Comparison

| | `XyDataSeries` | `XyxyDataSeries` |
|---|---|---|
| Data format | Alternating `start, end` pairs | One element per segment with `x, y, x1, y1` |
| PaletteProvider support | Yes — enables gradient coloring | No |
| Tooltip coordinates | `xValue`, `yValue` per point | `xValue`, `yValue`, `point2xValue`, `point2yValue` |
| Best for | Dynamic fields with gradient coloring | Pre-computed discrete segments |

#### See Also

- [The Line Segment Series Type](/2d-charts/chart-types/fast-line-segment-renderable-series/)
- [The Triangle Series Type](/2d-charts/chart-types/fast-triangle-renderable-series/)
- [PaletteProvider API — Line Segment](/2d-charts/chart-types/palette-provider-api/fast-line-segment-renderable-series/)
- [Choropleth Maps](/2d-charts/chart-types/choropleth-map/)
