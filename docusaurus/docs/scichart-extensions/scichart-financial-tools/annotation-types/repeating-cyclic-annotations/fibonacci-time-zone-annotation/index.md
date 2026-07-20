---
sidebar_position: 14
sidebar_label: Fibonacci time zone
---

# FibonacciTimeZoneAnnotation

[FibonacciTimeZoneAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccitimezoneannotation.html) projects Fibonacci time zones from two points. It inherits from `RepeatedHorizontalIntervalAnnotationBase`, so the repeated spacing and connector-line behavior comes from the shared repeated-interval engine. It is used to mark potential time-based turning points.

It inherits the shared multi-point editing and label behavior from `scichart-financial-tools`.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
- `showConnectorLine`, `connectorLineStrokeDashArray` and `maxRepeatCount` let you tune the anchor interval and how many repeated time zones are rendered.
- `labelColor`, `labelFontSize` and `labelPadding` control the label presentation without changing the underlying spacing.
- `formatTimeZoneLabel` is handy when you want the Fibonacci indices to read like custom session or target names.
:::

#### See Also

- [Fibonacci annotations](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [Repeating / cyclic annotations](/scichart-extensions/scichart-financial-tools/annotation-types/repeating-cyclic-annotations/)
- [CyclicLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/repeating-cyclic-annotations/cyclic-line-annotation/)
