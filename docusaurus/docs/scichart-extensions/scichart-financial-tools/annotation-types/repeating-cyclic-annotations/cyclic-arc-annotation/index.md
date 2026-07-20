---
sidebar_position: 13
sidebar_label: Cyclic arc
---

# CyclicArcAnnotation

[CyclicArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/cyclicarcannotation.html) draws a cyclical arc guide from two points. It is useful when a cycle needs to be visualized as a curve instead of a line.

It inherits the shared multi-point editing and label behavior from `scichart-financial-tools`.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2,14} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
- `fill` controls the arc band color, while `stroke` and `strokeThickness` control the outline.
- `isUpward` flips the arcs above or below the baseline without changing the repeated spacing logic.
- Connector lines are intentionally disabled for this variant, so the arcs stay visually clean.
:::

#### See Also

- [CyclicLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/repeating-cyclic-annotations/cyclic-line-annotation/)
- [FibonacciTimeZoneAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/repeating-cyclic-annotations/fibonacci-time-zone-annotation/)
