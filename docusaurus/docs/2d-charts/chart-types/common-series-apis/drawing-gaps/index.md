---
sidebar_position: 3
---

# Drawing Gaps in Series (null data)

It is possible to have null points or gaps in multiple series types by passing a data point with Y = NaN (Not a Number). The following chart (series) types support NaN gaps.

*   Line Series - with gaps or closed-lines where NaN is found
*   Scatter Series
*   Mountain Series - with gaps or closed-lines
*   Column Series
*   Candlestick/Ohlc Series
*   Bubble Series

Drawing Null points with NaN
----------------------------

The following example shows you how to draw null points by setting Y=NaN.

Setting Y=NaN is considered a 'null point' in SciChart.js and will allow you to hide areas of the data.

:::tip
Note Line-based series such as Line, Mountain, Band and Spline may also be drawn as a closed-line when Y=NaN by setting [BaseRenderableSeries.drawNaNAs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#drawnanas) = [ELineDrawMode.PolyLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/elinedrawmode.html). This property will be ignored for certain series types like Scatter.
:::

Here's an example below:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} />

Closing Lines with NaN
----------------------

Lines may also be closed when Y=NaN by setting [BaseRenderableSeries.drawNaNAs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#drawnanas) = [ELineDrawMode.PolyLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/elinedrawmode.html). This property will be ignored for certain series types like Scatter.

Having Different Styles in the Same Series
------------------------------------------

Sometimes it is asked 'can we have a different line-color, or dashed line style when Y=NaN'.

Not using the above API, but a workaround can be achieved by simply using two series, e.g. with the following data.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./demoGapDifferentStyle.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./demoGapDifferentStyle.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This approach results in some nice visualisations to represent null data (or inaccurate data) like this.

<LiveDocSnippet maxWidth={"100%"} name="demoGapDifferentStyle" />
