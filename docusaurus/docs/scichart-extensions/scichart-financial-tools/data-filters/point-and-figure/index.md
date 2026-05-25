---
sidebar_position: 3
sidebar_label: Point & Figure filter
---

# PointAndFigureFilter

[PointAndFigureFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pointandfigurefilter.html) converts OHLC close values into Point & Figure marks. It outputs an `XyDataSeries` where X is the Point & Figure column index and Y is the mark price, and it exposes the full calculation through [lastResult:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pointandfigurefilter.html#lastresult).

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {37,52-54,45-47,71,82-83,90,94} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use [boxSize:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pointandfigurefilter.html#boxsize) to control the price distance represented by one box and [reversalAmount:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pointandfigurefilter.html#reversalamount) to control how many boxes are required before a new opposite-direction column begins.

#### See Also

- [Heikin-Ashi filter](/scichart-extensions/scichart-financial-tools/data-filters/heikin-ashi/)
- [Renko filter](/scichart-extensions/scichart-financial-tools/data-filters/renko/)
- [Scatter Charts](/2d-charts/chart-types/xy-scatter-renderable-series/)
