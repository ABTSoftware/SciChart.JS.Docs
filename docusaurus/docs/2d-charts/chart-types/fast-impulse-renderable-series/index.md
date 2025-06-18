---
sidebar_position: 21
---

# ✅ The Lollipop (Impulse or Stem) Chart Type

Lollipop Charts, otherwise known as Impulse or Stem charts, can be created using the [FastImpulseRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastimpulserenderableseries.html) type.

:::tip
The [JavaScript Impulse Series Example](https://demo.scichart.com/javascript/impulse-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript/impulse-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/impulse-chart"
    title="JavaScript Impulse Chart example"
/>

## Create an Impulse Series 

To create a [Javascript Impulse Chart](https://demo.scichart.com/javascript/impulse-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {28-36} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {17-28} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

In the code above:

*   A Impulse Series instance is created and added to the `SciChartSurface.renderableSeries` collection.
*   We set the [fill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastimpulserenderableseries.html#fill) property that controls the color of connector and point of each dataset
*   We can update the size of each point by updating [size:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastimpulserenderableseries.html#size) property (default value is `10.0`)
*   We assign a [FastImpulseRenderableSeries.dataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastimpulserenderableseries.html#dataseries) - which stores the Xy data to render.

## Setting the PointMarker on an Impulse Series

Every data point of an Impulse Series is marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). To change the pointmarker type, or size, use the following code. Note that the fill, size property on `FastImpulseRenderableSeries` overrides the width, height, fill, stroke on the `TrianglePointMarker`.

```ts {5} showLineNumbers
const impulseSeries = new FastImpulseRenderableSeries(wasmContext, {
    fill: "#26c6da",
    strokeThickness: 1,
    dataSeries,
    pointMarker: new TrianglePointMarker(wasmContext),
    size: 10,
});
```

:::tip
Different pointmarkers are supported including Ellipse, Box, Triangle, Cross or custom markers. See the [Scatter Chart documentation](../xy-scatter-renderable-series/) for more information on supported pointmarkers.
:::

## Render a Gap in an Impulse Series

:::tip
It is possible to have null points or gaps in a Impulse Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](../common-series-apis/drawing-gaps/) article for more details.
:::

## Painting Impulse Series Points with Different Colors

:::tip
It is possible to define the colour individual datapoints differently using the [PaletteProvider API](../palette-provider-api/palette-provider-api-overview/).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Impulse Charts](../palette-provider-api/fast-impulse-renderable-series/) documentation page.
:::