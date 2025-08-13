---
sidebar_position: 19
---

# The Candlestick Series type

Candlestick Series or JavaScript Stock Charts can be created using the [FastCandlestickRenderableSeries type:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html).

:::tip
The [JavaScript Candlestick Chart Example](https://www.scichart.com/demo/react/candlestick-chart) can be found in the [SciChart.Js Examples Suite > Candlestick Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/CandlestickChart) on Github, or our live demo at [scichart.com/demo](https://www.scichart.com/demo/javascript/candlestick-chart).
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/candlestick-chart" 
    title="Candlestick Series Chart"
/>

## Create a Candlestick Series

To create a [Javascript Candlestick Chart](https://www.scichart.com/demo/react/candlestick-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)", "JS", "JS"]}>
    ```ts {25-29,32,34-38} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {19,21-25} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

> The above example makes a web call to Binance to fetch Bitcoin/USD prices. If you see a blank chart, check the Js console as this web call may be blocked. You can always edit the Codepen to substitute your own data!

In the example above:

*   A Candlestick Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   This requires a special dataseries type: [OhlcDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcdataseries.html), which accepts X, Open, High, Low, Close values as arrays of values.
*   We set the up/down stroke and fill colors via properties [brushUp:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html#brushup), [brushDown:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html#brushdown), [strokeUp:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html#strokeup), [strokeDown:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html#strokedown) properties.
*   We set [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html#datapointwidth) - which defines the fraction of width to occupy
*   We use a special axis type called the [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) which removes gaps in stock market data.

A [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) is necessary if you have Forex or Stock market data which includes weekend or overnight gaps, as this axis type measures by x-index, not by x-value. For CryptoCurrency data the [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) can be used as these are 24/7 markets.

You can format the date labels on the XAxis by following the instructions on the [Axis Label Formatting](/2d-charts/axis-api/axis-labels/numeric-formats) page.

## Adding Volume Bars to a Candlestick Chart

In the [SciChart.js demo - Candlestick Charts](https://www.scichart.com/demo/react/candlestick-chart) - volume bars are docked to the bottom of the chart. Here's how to do this with SciChart.js.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {19,21-22,24} showLineNumbers file=./VolumeBars/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {33,25-26,39} showLineNumbers file=./VolumeBars/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Here's how the example looks now:

<LiveDocSnippet name="./VolumeBars/demo" />

## Painting Candles with Different Colors

:::tip
It is possible to define the colour of specific OHLC Bars using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Candlestick/Ohlc Charts](/2d-charts/chart-types/palette-provider-api/fast-candlestick-ohlc-renderable-series) documentation page.
:::

#### See Also

* [Start Here - RenderableSeries Overview](/2d-charts/chart-types/renderable-series-api-overview)

* [Common RenderableSeries Properties](/2d-charts/chart-types/common-series-apis/is-visible)
