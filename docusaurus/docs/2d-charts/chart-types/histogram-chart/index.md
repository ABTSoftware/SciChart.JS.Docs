---
sidebar_position: 38
---

# Histogram Charts

A histogram visualizes the distribution of a dataset by grouping values into contiguous bins and displaying each bin as a bar whose height represents the count (or frequency) within that range. Typical use cases include frequency distributions, population statistics, and scientific data analysis.

SciChart.js has no dedicated histogram series type. Histograms are assembled from [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html) with [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html), using [EColumnMode.StartEnd:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecolumnmode.html#startend) to place each bar between explicit bin boundaries on the X axis.

:::tip
The [JavaScript Histogram Chart Example](https://www.scichart.com/demo/react/histogram-chart) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/histogram-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/histogram-chart"
    title="Histogram Chart"
/>

## Create a Histogram

```ts showLineNumbers file=./demo/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./demo/demo" />

In the code above:

- Each bin is defined as `{ x, x1, y }` — bin start, bin end, and count.
- `XyxyDataSeries` stores `xValues` (bin starts), `x1Values` (bin ends), and `yValues` (counts). `y1Values` is omitted; `defaultY1: 0` sets the baseline for all bars.
- `columnXMode: EColumnMode.StartEnd` tells the series that `x` and `x1` are explicit start/end positions on the X axis — each bar fills exactly its bin range with no gaps.
- `columnYMode: EColumnYMode.TopBottom` tells the series that `y` is the bar top and `defaultY1` (0) is the bottom.
- `fillLinearGradient` applies a vertical blue gradient from the bar top to bottom.
- `topCornerRadius: 4` rounds the top corners; `strokeThickness: 0` removes the border.
- `dataLabels` renders the count above each bar using the default Y value formatter.

## Data Aggregation

The demo above uses pre-aggregated data. In practice, you start from raw measurements and bin them using breakpoints:

```ts
function aggregateToBins(
    values: number[],
    breakpoints: number[]
): { xValues: number[]; x1Values: number[]; yValues: number[] } {
    const xValues:  number[] = [];
    const x1Values: number[] = [];
    const yValues:  number[] = [];

    for (let i = 0; i < breakpoints.length - 1; i++) {
        const lo = breakpoints[i];
        const hi = breakpoints[i + 1];
        xValues.push(lo);
        x1Values.push(hi);
        yValues.push(values.filter(v => v >= lo && v < hi).length);
    }
    return { xValues, x1Values, yValues };
}

// Example: bin 1000 random ages into ranges
const rawAges = Array.from({ length: 1000 }, () => Math.random() * 80);
const { xValues, x1Values, yValues } = aggregateToBins(rawAges, [0, 20, 30, 45, 65, 80]);
```

Pass the result directly into `XyxyDataSeries`:

```ts
new XyxyDataSeries(wasmContext, { xValues, yValues, x1Values })
```

## Axes

### X Axis

A standard [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/numericaxis.html) with `axisTitle` and a small `growBy` padding so the outermost bars don't clip against the chart edge:

```ts
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "Age (years)",
    growBy: new NumberRange(0.05, 0.05)
}));
```

### Y Axis

Use `labelFormat: ENumericFormat.Engineering` to display large population counts compactly (e.g. `150M` instead of `150000000`):

```ts
sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "Population",
    labelFormat: ENumericFormat.Engineering,
    growBy: new NumberRange(0, 0.2)  // headroom above the tallest bar for data labels
}));
```

## Styling

Key styling properties on [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html):

| Property | Purpose |
|---|---|
| `fillLinearGradient` | Vertical gradient fill using [GradientParams:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/gradientparams.html) |
| `fill` | Solid fill color (alternative to gradient) |
| `opacity` | Bar transparency (0–1) |
| `topCornerRadius` | Rounds top corners of each bar |
| `strokeThickness` | Set to `0` to remove bar outlines |

## Data Labels

`dataLabels` on the series renders the Y value above each bar. Override `dataLabelProvider.getText` to format the displayed value:

```ts
dataLabels: {
    style: { fontSize: 13, fontFamily: "Arial" },
    color: "white",
}
```

To show custom formatted text, override the label provider after construction:

```ts
histogramSeries.dataLabelProvider.getText = (state) =>
    (state.yVal() / 1_000_000).toFixed(0) + "M";
```

## Chart Modifiers

Standard zoom and pan modifiers work unchanged with histogram series:

```ts
sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new ZoomExtentsModifier(),
    new MouseWheelZoomModifier()
);
```

## Custom Texture Fills

[FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html) supports a `customTextureOptions` property that accepts an [ICustomTextureOptions:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/icustomtextureoptions.html) implementation. This enables pictograph-style (isotype) histograms where bars are filled with a repeating icon pattern — as seen in the live showcase above, which uses a custom `StickFigureTextureOptions` class to render proportionally-scaled stick figures inside each bar. For an introduction to custom texture fills see the [Custom Texture styling example](https://www.scichart.com/demo/react/custom-texture).

#### See Also

- [The Rectangle Series Type](/2d-charts/chart-types/fast-rectangle-renderable-series/)
- [The Column Series Type](/2d-charts/chart-types/fast-column-renderable-series/column-series-type/)
- [Data Labels API](/2d-charts/chart-types/data-point-labels/data-labels-api-overview/)
- [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/)
- [The Gantt Chart](/2d-charts/chart-types/gantt-chart/)
