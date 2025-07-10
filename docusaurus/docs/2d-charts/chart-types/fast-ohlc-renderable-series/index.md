---
sidebar_position: 20
---

# The OHLC Series Type

Ohlc Series or JavaScript Stock Charts can be created using the **FastOhlcRenderableSeries** type.

:::tip
The [JavaScript Ohlc Chart Example](https://demo.scichart.com/javascript/candlestick-chart) can be found in the [SciChart.Js Examples Suite > OHLC Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/OhlcChart) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript/ohlc-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/candlestick-chart"
    title="JavaScript Candlestick Chart example"
    description=", which allows switching between candle & OHLC"
/>

## Create an Ohlc Series

To create a [Javascript Ohlc Chart](https://demo.scichart.com/javascript-ohlc-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {19-23,26,35-41} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {6-10,17-32} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

In the code above:

*   A Ohlc Series instance is created and added to the **SciChartSurface.renderableSeries** collection.
*   This requires a special dataseries type: OhlcDataSeries, which accepts `X`, `Open`, `High`, `Low`, `Close` values
*   We set the up/down stroke color via properties [strokeUp:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastohlcrenderableseries.html#strokeup), [strokeDown:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastohlcrenderableseries.html#strokedown).
*   We set [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastohlcrenderableseries.html#datapointwidth) - which defines the fraction of width to occupy
*   We use a special axis type called the CategoryAxis which removes gaps in stock market data.

:::tip
A [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) is necessary if you have Forex or Stock market data which includes weekend or overnight gaps, as this axis type measures by x-index, not by x-value. For CryptoCurrency data the [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html) can be used as these are 24/7 markets.

You can format the date labels on the xAxis by following the instructions on the [Axis Label Formatting](/docs/2d-charts/axis-api/axis-labels/numeric-formats) page.
:::

## Adding Volume Bars to an OHLC Chart

The [Candlestick Chart example](https://www.scichart.com/demo/react/candlestick-chart) shows a technique to add volume bars docked to the bottom of the chart. The technique is the same for OHLC series so please see the [candlestick docs](/docs/2d-charts/chart-types/fast-candlestick-renderable-series).

## Painting Ohlc bars with Different Colors

:::tip
It is possible to define the colour of specific OHLC Bars using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Candlestick/Ohlc Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-candlestick-ohlc-renderable-series) documentation page.
:::

#### See Also

* [Start Here - RenderableSeries Overview](/docs/2d-charts/chart-types/renderable-series-api-overview)
* [Common RenderableSeries Properties](/docs/2d-charts/chart-types/common-series-apis/drawing-point-markers)