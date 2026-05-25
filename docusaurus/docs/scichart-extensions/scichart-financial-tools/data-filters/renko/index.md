---
sidebar_position: 2
sidebar_label: Renko filter
---

# OhlcRenkoFilter

[OhlcRenkoFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcrenkofilter.html) converts an `OhlcDataSeries` into Renko bricks represented as OHLC values. Set [brickSize:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcrenkofilter.html#bricksize) for the price move per brick and [reversalAmount:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcrenkofilter.html#reversalamount) for the number of bricks required to reverse direction.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,33-37,,54-60} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Renko filters usually output fewer points than the source OHLC series. The source / filtered toggle is useful when choosing a brick size because it shows how aggressively the filter is compressing the original data.

#### See Also

- [Heikin-Ashi filter](/scichart-extensions/scichart-financial-tools/data-filters/heikin-ashi/)
- [Point & Figure filter](/scichart-extensions/scichart-financial-tools/data-filters/point-and-figure/)
- [Candlestick Charts](/2d-charts/chart-types/fast-candlestick-renderable-series/)
