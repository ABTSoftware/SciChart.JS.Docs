---
sidebar_position: 12
---

# The Scatter Series Type

Scatter Series can be created using the [XyScatterRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html) type.

:::tip
The [JavaScript Scatter Chart Example](https://demo.scichart.com/javascript/scatter-chart) can be found in the [SciChart.Js Examples Suite > Scatter Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/ScatterChart) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript/scatter-chart).
:::

<ChartFromSciChartDemo  
    src="https://www.scichart.com/demo/iframe/scatter-chart" 
    title="Scatter Series Chart" 
/>

## Create a Scatter Series

To create a [Javascript Scatter Chart](https://demo.scichart.com/javascript-scatter-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {26,31-37} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {16,22-31} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet name="./Basic/demo" />

In the code above:

*   A Scatter Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). Several types such as Ellipse, Triangle, Cross and Custom are available ([see here for more info](/2d-charts/chart-types/common-series-apis/drawing-point-markers))
*   We assign a [DataSeries](/2d-charts/chart-types/data-series-api/data-series-api-overview) - which stores the Xy data to render.

## Render a Gap in a Scatter Series

:::tip
It is possible to have null points or gaps in a Scatter Series by passing a data point with a **NaN** value as the **Y** value. Or, by simply skipping a point if using a value-axis. Please refer to the [Common Series Features - Draw Gaps in Series](/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.
:::

## Drawing Last Point only in a Scatter Series

:::tip
New to SciChart.js v3.2! The PointMarker type has a property [isLastPointOnly:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointmarker.html#lastpointonly). When true, only the last point of a scatter series is drawn. This can be useful to highlight a point in say a sweeping ECG chart.
:::

## Different Point-Markers on a Scatter Series

Every data point of a Scatter Series is marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). Several different types of PointMarker are available in SciChart.js.

:::tip
To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

There is also a TypeScript example of custom pointmarkers in the [SciChart.js Demo.](https://demo.scichart.com/javascript-chart-custom-pointmarkers)

Finally, there is a dedicated [Bubble Series](/2d-charts/chart-types/fast-bubble-renderable-series) type with some more options such as per-point sizing.
:::

## Painting Scatter Points with Different Colors

:::tip
It is possible to define the colour of PointMarkers individually using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Scatter Charts](/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series) documentation page.
:::

#### See Also

* [Start Here - RenderableSeries Overview](/2d-charts/chart-types/renderable-series-api-overview)