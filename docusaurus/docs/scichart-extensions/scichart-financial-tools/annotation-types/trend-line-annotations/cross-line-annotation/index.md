---
sidebar_position: 10
sidebar_label: Cross line
---

# CrossLineAnnotation

[CrossLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/crosslineannotation.html) draws a one-point cross-style guide line. It is useful for aligned visual markers across the chart.

It inherits the shared multi-point editing and label behavior from `scichart-financial-tools`.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
- `CrossLineAnnotation` always renders both horizontal and vertical guide lines through the same anchor point, so `extendStart` and `extendEnd` are intentionally fixed.
- Use `strokeDashArray` if you want the crosshair to behave like a subtle alignment aid instead of a strong visual anchor.
- Because it is still a multi-point annotation, it inherits the same selection and hover behavior as the rest of the trading tools.
:::

#### See Also

- [HorizontalTrendLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/horizontal-trend-line-annotation/)
- [VerticalTrendLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/vertical-trend-line-annotation/)
- [ExtendedLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/extended-line-annotation/)
