---
sidebar_position: 98
---

# The Linear Gauge Chart Type

Linear Gauge Charts visualize a single value against a scale — ideal for dashboards, KPI panels, and instrument displays. SciChart.js does not have a dedicated gauge series type; instead linear gauges are composed from [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html) combined with [annotations](/2d-charts/annotations-api/annotations-api-overview/) for value indicators and labels.

:::tip
The [JavaScript Linear Gauges](https://www.scichart.com/demo/react/linear-gauges) example can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src/components/Examples/Charts2D/v4Charts/LinearGauges) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/linear-gauges).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/linear-gauges"
    title="Linear Gauges"
/>

## Core Building Blocks

A linear gauge in SciChart.js is assembled from standard chart primitives:

- **[FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html)** — renders the gauge track as one or more colored rectangles
- **[XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html)** — positions each rectangle via explicit `[x, y, x1, y1]` coordinates (use [EColumnMode.StartEnd:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecolumnmode.html#startend) + [EColumnYMode.TopBottom:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecolumnymode.html#topbottom))
- **[XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyydataseries.html)** — alternative data series for dynamic/animated gauges where each segment is driven by a center X + `[y, y1]` range
- **[IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/ifillpaletteprovider.html)** — assigns a color to each rectangle by index, enabling multi-colored segment bands
- **[GradientParams:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/gradientparams.html)** — fills a single rectangle with a smooth color gradient via `fillLinearGradient`
- **[LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html)** — draws the value indicator pointer
- **[TextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/textannotation.html)** — displays the current value label and scale markings
- **[DataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datalabelprovider.html)** — renders text inside each rectangle segment (e.g. "Low / Moderate / High")

## Examples

### Vertical Segmented Gauge

A vertical gauge with discrete color bands per segment and a [LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html) value indicator. Each rectangle in [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html) represents one band; an [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/ifillpaletteprovider.html) maps a color to each by index:

```ts showLineNumbers file=./VerticalSegmented/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./VerticalSegmented/demo" />

Key points:
- Each segment is a rectangle with `x=[0, GAUGE_WIDTH]` and `y=[segmentBottom, segmentTop]` — built using [EColumnMode.StartEnd:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecolumnmode.html#startend) and [EColumnYMode.TopBottom:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecolumnymode.html#topbottom)
- `SegmentPaletteProvider` implements [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/ifillpaletteprovider.html) and returns a color keyed by `index`
- [LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html) with [EArrowHeadPosition.Start:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/earrowheadposition.html#start) places the arrowhead at the gauge edge pointing at the value

### Vertical Gradient Gauge

A single rectangle filled with a smooth [GradientParams:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/gradientparams.html) color ramp, combined with a visible [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/numericaxis.html) for automatic scale markings:

```ts showLineNumbers file=./VerticalGradient/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./VerticalGradient/demo" />

Key points:
- `fillLinearGradient` accepts a [GradientParams:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/gradientparams.html) with a start `Point(0,0)` (top) and end `Point(0,1)` (bottom), with color stops at fractional offsets
- A visible `yAxis` with `drawMajorGridLines: false` and `drawMajorBands: false` provides a clean tick-mark scale alongside the gauge, removing the need for manual [TextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/textannotation.html) labels
- `overrideOffset: 0` on the axis pins it flush to the left edge of the chart padding

### Horizontal Segmented Gauge with Data Labels

A horizontal gauge using `x` as the measure axis, with category labels rendered inside each segment via [DataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datalabelprovider.html):

```ts showLineNumbers file=./HorizontalSegmented/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./HorizontalSegmented/demo" />

Key points:
- To create a **horizontal** gauge, swap axes: `x` holds the measure range (`SEGMENT_ENDS`) and `y` holds the bar height (`GAUGE_HEIGHT`). The segment rectangles are `[xStart, 0, xEnd, GAUGE_HEIGHT]`
- `dataLabels` options on the series enable per-rectangle text; overriding `dataLabelProvider.getText` returns a custom string per index instead of the default Y value
- The [LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html) is rotated 90° by swapping `x1/y1` and `x2/y2` so the arrow points upward at the value along the x-axis

### Animated Real-Time Gauge

A segmented gauge that fills from a baseline, using [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyydataseries.html) for dynamic data and a heat-map color palette that changes as the value moves:

```ts showLineNumbers file=./Animated/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Animated/demo" />

Key points:
- [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyydataseries.html) stores `(x, y, y1)` triplets — here each triplet is one small rectangle block along the gauge
- [EDataPointWidthMode.Range:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/edatapointwidthmode.html#range) combined with `dataPointWidth` controls the pixel width of each block in data-coordinate units
- Calling `dataSeries.clear()` followed by `dataSeries.appendRange()` on a `setInterval` tick replaces only the filled portion, animating the gauge in real time
- A background [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html) with a dark fill renders the empty track behind the active segments
- `strokeThickness: 4` on the foreground series with a matching dark stroke color creates visible gaps between individual segments

## Orientation

Orientation is controlled entirely by which axis carries the gauge scale:

| Orientation | Measure axis | Bar thickness axis | Data coordinates |
|---|---|---|---|
| **Vertical** | Y | X | `x=[left, right]`, `y=[bottom, top]` |
| **Horizontal** | X | Y | `x=[left, right]`, `y=[bottom, top]` |

Both orientations use the same `EColumnMode.StartEnd` + `EColumnYMode.TopBottom` approach — only which dimension holds the gauge range changes.

## Choosing the Right Data Series

| Use case | Data series | Why |
|---|---|---|
| Static segment bands | [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html) | Full 2D bounding box control per rectangle |
| Dynamic / animated fill | [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyydataseries.html) | Efficiently update only the Y range; X (position) stays constant |
| Single gradient fill | [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html) with `fillLinearGradient` | One rectangle covers the whole gauge; gradient handles color |

#### See Also

* [Rectangle Series](/2d-charts/chart-types/fast-rectangle-renderable-series/)
* [Palette Provider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/)
* [Line Arrow Annotation](/2d-charts/annotations-api/line-arrow-annotation/)
* [The Polar Gauge Chart Type](/2d-charts/chart-types/polar-gauge-chart/)
