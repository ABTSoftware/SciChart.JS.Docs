---
sidebar_position: 9
sidebar_label: Vertical trend line
---

# VerticalTrendLineAnnotation

[VerticalTrendLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/verticaltrendlineannotation.html) is a one-point annotation that keeps the line vertical, making it useful for time markers and event boundaries.

It inherits the shared multi-point editing and label behavior from `scichart-financial-tools`.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
- `extendStart` and `extendEnd` let you choose whether the marker runs through the full chart height or behaves like a shorter vertical cue.
- `strokeDashArray` is useful when you want the marker to sit in the background while still remaining easy to align against.
- If you need a clean axis-aligned guide, you can keep the point label visibility on and let the grip stay visible during interaction.
:::

#### See Also

- [HorizontalTrendLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/horizontal-trend-line-annotation/)
- [ExtendedLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/extended-line-annotation/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
