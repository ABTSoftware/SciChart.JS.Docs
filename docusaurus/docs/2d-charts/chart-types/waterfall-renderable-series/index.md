---
sidebar_position: 33
---

# The Waterfall Chart Type

A Waterfall Chart visualizes how individual positive and negative values contribute to a running total. Each bar starts where the previous one ended, making it easy to see which categories drive gains or losses. Commonly used in financial analysis, budget reporting, and business performance dashboards.

In SciChart.js, Waterfall Charts are assembled from [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html) with [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html), using `EColumnYMode.TopBottom` to position each bar between its accumulated start and end values.

:::tip
The [JavaScript Waterfall Chart Example](https://www.scichart.com/demo/react/waterfall-chart) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/WaterfallChart) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/waterfall-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/waterfall-chart"
    title="Waterfall Chart"
/>

## Create a Waterfall Chart

The key idea is to **pre-process your data** into a cumulative (waterfall) format — each data point carries both the accumulated value *before* and *after* adding the period's change. These become the `yValues` (bar bottom) and `y1Values` (bar top) in the `XyxyDataSeries`.

```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

In the code above:

- **Data transformation** — `toWaterfallData()` converts raw profit/loss entries into `{ from, to }` pairs. `from` is the accumulated total *before* the entry and `to` is the total *after*. A final "Total" bar (from 0 to the overall total) is appended.
- **`XyxyDataSeries`** — stores `xValues` (sequential index), `yValues` (`from` — bar bottom), `x1Values` (same as `xValues` for `EColumnMode.Mid`), and `y1Values` (`to` — bar top).
- **`EColumnMode.Mid`** — centers each bar on its X index.
- **`EColumnYMode.TopBottom`** — interprets `yValues` / `y1Values` as the explicit bottom and top of each bar.
- **`EDataPointWidthMode.Range`** — sets bar width relative to the X data range so bars are evenly spaced.
- **PaletteProvider** — colors each bar individually: green for positive, red for negative, blue for the Total bar.
- **`RectangleSeriesDataLabelProvider`** — renders the cumulative total and the period change inside each bar.
- **`TextLabelProvider`** on the X axis — maps numeric indices back to month names.

## Data Transformation

The waterfall layout requires converting your source data into bar segments. Each bar spans from an accumulated `from` value to an accumulated `to` value:

```ts
function toWaterfallData(data: { month: string; profit: number }[]) {
    let accumulated = 0;
    const result = data.map((d) => {
        const from = accumulated;
        accumulated += d.profit;
        return { month: d.month, profit: d.profit, from, to: accumulated };
    });
    // Add a Total bar running from 0 to the final accumulated value
    result.push({ month: "Total", profit: 0, from: 0, to: accumulated });
    return result;
}
```

The `from`/`to` values are then fed directly as `yValues`/`y1Values` of `XyxyDataSeries`.

## Coloring Bars with PaletteProvider

Each bar is colored based on whether the period value is positive, negative, or the summary Total. Attach a custom `paletteProvider` to the series:

```ts
paletteProvider: {
    fillPaletteMode: EFillPaletteMode.SOLID,
    onAttached() {},
    onDetached() {},
    overrideFillArgb(_x, _y, _index, _opacity, metadata) {
        const profit = metadata?.profit;
        if (profit === 0) return parseColorToUIntArgb("#2196F3", 200); // Total
        return profit > 0
            ? parseColorToUIntArgb("#4CAF50", 220)   // Positive
            : parseColorToUIntArgb("#F44336", 220);  // Negative
    },
}
```

:::tip
For more details on per-point coloring, see the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/).
:::

## Adding Data Labels

Use `RectangleSeriesDataLabelProvider` to display values inside each bar. Override `getText()` to format the label from metadata:

```ts
dataLabelProvider: new (class extends RectangleSeriesDataLabelProvider {
    getText(metadataSelector) {
        const d = metadataSelector.getMetaData();
        const total = `${formatNumber(d.to, ENumericFormat.Engineering, 2)}$`;
        if (d.profit === 0) return total;
        const delta = `${d.profit > 0 ? "+" : ""}${formatNumber(d.profit, ENumericFormat.Engineering, 2)}$`;
        return `${total}\n${delta}`;
    }
})({ skipMode: EDataLabelSkipMode.ShowAll, color: "white", ... })
```

:::tip
For a full walkthrough of data labels, see the [Data Labels API](/2d-charts/chart-types/data-point-labels/data-labels-api-overview/).
:::

## Attaching Metadata

Pass your transformed data as `metadata` on the `XyxyDataSeries`. This makes the original objects available inside the `PaletteProvider` and `DataLabelProvider` callbacks:

```ts
const dataSeries = new XyxyDataSeries(wasmContext, {
    xValues:  ...,
    yValues:  waterfallData.map(d => d.from),
    x1Values: ...,
    y1Values: waterfallData.map(d => d.to),
    metadata: waterfallData,   // ← attached here
});
```

Inside any callback, retrieve the metadata for a data point with `metadata?.profit` (PaletteProvider) or `metadataSelector.getMetaData()` (DataLabelProvider).

:::tip
For more about attaching and using metadata, see the [Point Metadata API](/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview/).
:::

## See Also

- [The Rectangle Series Type](/2d-charts/chart-types/fast-rectangle-renderable-series/) — the underlying series that powers the Waterfall Chart
- [Start Here - RenderableSeries Overview](/2d-charts/chart-types/renderable-series-api-overview/)
- [PaletteProvider API — per-point coloring](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/)
- [Data Labels API](/2d-charts/chart-types/data-point-labels/data-labels-api-overview/)
- [Point Metadata API](/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview/)
