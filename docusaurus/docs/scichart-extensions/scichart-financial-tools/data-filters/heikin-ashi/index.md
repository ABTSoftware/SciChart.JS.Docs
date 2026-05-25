---
sidebar_position: 1
sidebar_label: Heikin-Ashi filter
---

# OhlcHeikinAshiFilter

[OhlcHeikinAshiFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcheikinashifilter.html) converts an `OhlcDataSeries` into Heikin-Ashi candles. The filter keeps one output candle per source candle, so it can be swapped with the source series on the same candlestick or OHLC renderable series.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,33-35,51-57} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Heikin-Ashi values are recalculated from the current source OHLC candle and the previous Heikin-Ashi candle. Use this filter when you want the chart to emphasize trend direction and reduce candle-to-candle noise without changing the source data.

#### See Also

- [Renko filter](/scichart-extensions/scichart-financial-tools/data-filters/renko/)
- [Point & Figure filter](/scichart-extensions/scichart-financial-tools/data-filters/point-and-figure/)
- [Data Series API Overview](/2d-charts/chart-types/data-series-api/data-series-api-overview/)
