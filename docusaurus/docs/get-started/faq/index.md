---
sidebar_position: 100
---

# FAQ

## How set transparent cells on Heatmap using NaNs?

**28 July 2025**

In order to make some items transparent on [UniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/uniformheatmaprenderableseries.html) or [NonUniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/nonuniformheatmaprenderableseries.html) you must set NaN zValues on the data series. For the [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/uniformheatmapdataseries.html) this can be done by passing [zValue options:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iuniformheatmapseriesoptions.html#zvalues) in the constructor. Find an example on [The Uniform Heatmap Chart Type](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/#how-to-insert-gaps-transparent-cells-in-heatmap-using-nan) page.

```typescript
const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
    xStart: 0, xStep: 1, yStart: 3, yStep: 3,
    zValues: [
        [NaN, NaN, 1, 2],
        [2, 1, 2, 3]
    ]
});
```
