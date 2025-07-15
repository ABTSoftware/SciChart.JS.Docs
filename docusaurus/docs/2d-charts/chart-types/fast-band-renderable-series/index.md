---
sidebar_position: 23
---

# The Band Series type

A Band Series, or High-Low Fill between two lines can be created using the [FastBandRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) type.

:::tip
The [JavaScript Band Chart Example](https://scichart.com/demo/javascript-band-chart) can be found in the [SciChart.Js Examples Suite > Band Series](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/BandSeriesChart) on Github, or our live demo at [demo.scichart.com](https://scichart.com/demo/javascript/band-chart).
:::

<ChartFromSciChartDemo
    src="https://scichart.com/demo/iframe/javascript-band-chart"
    title="Band Series Chart"
/>

## Create a Band Series 

To create a [Javascript Band Chart](https://scichart.com/demo/javascript-band-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {26-37} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {20-34} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

In the code above:

*   A Band Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, fill properties for when Y1 > Y2 and vice versa (more info over at [FastBandRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) in TypeDoc).
*   We assign a [DataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#dataseries) - in this case an [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) which stores X, Y1, Y2 data.

## Gradient Fills in Band Series

New to SciChart.js v3.4, the Band Series chart type now supports gradient fills as well as solid color fills.

To use this, you need to set the [FastBandRenderableSeries.fillLinearGradient:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#filllineargradient) & [fillLinearGradientY1:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#filllineargradienty1) properties with a [GradientParams:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientparams.html) object: a type which defines gradients by a number of gradient stops, with a start and end point.

Here's a code example:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {7-10,12-15} showLineNumbers file=./GradientFill/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {15-18,20-23} showLineNumbers file=./GradientFill/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={'100%'} name="./GradientFill/demo" />

Try adjusting the CodePen above with the code to set a fillLinearGradient and see the result!

## Render a Gap in a Band Series

:::tip
It is possible to have null points or gaps in a Band Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](/2d-charts/chart-types/common-series-apis/drawing-gaps) article for more details.
:::

## Add Point Markers onto a Band Series

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Band Series via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

:::tip
To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](/2d-charts/chart-types/common-series-apis/drawing-point-markers).

There is also a dedicated [Scatter Series](/2d-charts/chart-types/xy-scatter-renderable-series) type and a [Bubble Series](/2d-charts/chart-types/fast-bubble-renderable-series) type with some more options.
:::

## Painting Band Segments with Different Colors

:::tip
It is possible to define the colour of line segments individually using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/fast-line-segment-renderable-series/index.md)

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Band Charts](/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series) documentation page.
:::

## Use Cases

### Displaying horizontal thresholds

The Band Series Chart can be used to display a mountain or area with a horizontal threshold. For example, if you want to see a series which has a green mountain above zero and red below, to track PnL or profit and loss, you can also use a band series.

For instance, the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {6,11,19-20} showLineNumbers file=./Threshold/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {10,15,32-33} showLineNumbers file=./Threshold/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Resulting in this:

<LiveDocSnippet maxWidth={'100%'} name="./Threshold/demo" />

### Bollinger Bands & MACD Indicators

The Band Series chart primary use is in financial markets, when you want to display things like Bollinger Bands, MACD. For example, our Create Multi Pane Stock Charts demo has a band series for the MACD indicator, which you can see below.

<CenteredImageWrapper
    src="https://www.scichart.com/documentation/js/current/images/RenderSeries_BandSeries_UseCase.png"
    title="Bollinger Bands & MACD Indicators"
/>

<CenteredImageWrapper
    src="https://www.scichart.com/documentation/js/current/images/RenderSeries_BandSeries_UseCase2.png"
    title="A complex visualisation using Band Series"
/>

_**Above**: a complex visualisation using Band Series. This image is taken from a SciChart WPF sample but all the features are available in SciChart.js as well._

#### See Also

* [Start Here - RenderableSeries Overview](/2d-charts/chart-types/renderable-series-api-overview)

* [Common RenderableSeries Properties](/2d-charts/chart-types/common-series-apis/is-visible)
