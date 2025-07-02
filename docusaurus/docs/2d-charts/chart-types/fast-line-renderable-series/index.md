---
sidebar_position: 10
---

# ✅ The Line Series Type

Line Series can be created using the [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) type.

:::tip
The [JavaScript Line Chart Example](https://demo.scichart.com/javascript/line-chart) can be found in the [SciChart.Js Examples Suite > Line Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/LineChart) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript/line-chart).
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/line-chart" 
    title="Line Series Chart" 
/>

## Create a Line Series

To create a [Javascript Line Chart](https://demo.scichart.com/javascript-line-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
```ts {27-34} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```
```ts {8-18} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet name="./Basic/demo" />

In the code above:

*   A [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokeThickness properties
*   We assign an [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) as our line's `dataSeries` - which stores the Xy data to render.

## Render a Gap in a Line Series

:::tip
It is possible to have null points or gaps in a Line Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](/docs/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.
:::

## Add Point Markers onto a Line Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Line Series via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](/docs/2d-charts/chart-types/common-series-apis/drawing-point-markers).

:::tip
To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/docs/2d-charts/chart-types/common-series-apis/drawing-point-markers).

There is also a dedicated [Scatter Series](/docs/2d-charts/chart-types/xy-scatter-renderable-series) type and a [Bubble Series](/docs/2d-charts/chart-types/fast-bubble-renderable-series) type with some more options.
:::

## Painting Line Segments with Different Colors

:::tip
It is possible to define the colour of line segments individually using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Line Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-line-segment-renderable-series/index.md) documentation page.
:::

#### See Also
* [Per-point Colouring of Line Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series)

* [The PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview)
