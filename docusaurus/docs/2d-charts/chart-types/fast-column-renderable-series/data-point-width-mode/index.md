---
sidebar_position: 2
---

# ✅ Column Series Data Point Width Mode

### Overview

Not just applicable to [Column Series](/docs/2d-charts/chart-types/fast-column-renderable-series/column-series-type), but also [Error Bars Series](/docs/2d-charts/chart-types/fast-error-bars-renderable-series), [Candlestick](/docs/2d-charts/chart-types/fast-candlestick-renderable-series), [Rectangle Series](/docs/2d-charts/chart-types/fast-rectangle-renderable-series) and [OHLC Series](/docs/2d-charts/chart-types/fast-ohlc-renderable-series), the [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#datapointwidth) and [dataPointWidthMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#datapointwidthmode) properties allow controlling of spacing of bars on a 2D JavaScript Chart.

In previous articles we've shown how [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#datapointwidth) can be used to change the width of bar-style series, for example Columns, Error Bars and Candlesticks/OHLC.

By default, [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#datapointwidth) sets the width of columns/bars as a fraction of available space, with valid values from 0.0 - 1.0.

New to SciChart.js v3.4 and above, a new property [dataPointWidthMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#datapointwidthmode) has been added. This has values of **Absolute**, **Range** and **Relative**. These define how the [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html#datapointwidth) is interpreted on these series types:

### [EDataPointWidthMode.Absolute:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html)

Interprets Data Point Width as an absolute pixel value

### [EDataPointWidthMode.Range:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html)

Interprets Data Point Width as the x data range per column. This is useful if you are plotting sparse columns on a NumericAxis

### [EDataPointWidthMode.Relative:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html)

Interprets Data Point Width as a relative to the full width which is axis length / number of columns. This assumes that there are no gaps in the data. If you are plotting sparse columns on a NumericAxis, consider Range mode

### Example

Here's an example of their use below. They can be very useful to change how sparsely populated column series behave.

Given a dataset with sparse values like this:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

And 3 column series with different dataPointWidthModes:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

The result is the following output:

<LiveDocSnippet name="./demo" />

### Breakdown:

[**EDataPointWidthMode.Relative**:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html) was the previous default (and only) value prior to v3.4. This would calculate the available space for a column and render each bar as a fraction of that availble space (from 0.0 - 1.0). The problem with this mode was that when x-values were unevenly spaced or the dataset was sparse, then

[**EDataPointWidthMode.Absolute**:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html) has been added post v3.4 which renders each bar as a pixel width. This is perfect for handling sparse datasets, except the bar will not scale as the chart is zoomed in or out.

[**EDataPointWidthMode.Relative**:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html) has also been added post v3.4. This mode renders each bar as a x-Range, so if the xAxis has a range of 0-200 and you specify a value of 8, then a bar will occupy exactly 8 data units. Using this mode, bars or columns will never overlap.