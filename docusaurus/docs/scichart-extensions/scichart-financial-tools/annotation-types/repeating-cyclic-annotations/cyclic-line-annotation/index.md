---
sidebar_position: 12
sidebar_label: Cyclic line
---

# CyclicLineAnnotation

[CyclicLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/cycliclineannotation.html) draws a cyclical projection line from two points. It is useful for repeating timing or cycle-based analysis.

It inherits the shared multi-point editing and label behavior from `scichart-financial-tools`.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
- `showConnectorLine` and `connectorLineStrokeDashArray` let you decide whether the base interval line should be visible and how strong it should look.
- `maxRepeatCount` limits how many repeated cycle markers are drawn, which is useful when a chart would otherwise get too busy.
- `extendStart` and `extendEnd` control whether the cycle pattern repeats before the first point or after the second point.
:::

#### See Also

- [CyclicArcAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/repeating-cyclic-annotations/cyclic-arc-annotation/)
- [FibonacciTimeZoneAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/repeating-cyclic-annotations/fibonacci-time-zone-annotation/)
