---
sidebar_position: 1.5
sidebar_label: Fibonacci channel
---

# Fibonacci channel

There is no separate `FibonacciChannelAnnotation` class in `scichart-financial-tools`. The channel-like Fibonacci tool is the existing [FibonacciRetracementAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html) configured with `verticalOnly: false`.

In that skewed mode, points 1 and 2 define the baseline, while point 3 defines the parallel channel direction. The result is both Fibonacci and channel-like: the levels remain Fibonacci levels, but the geometry can lean with the move instead of staying vertical.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {15-18,24-30,34-38} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
If you want a skewed Fibonacci channel, keep using `FibonacciRetracementAnnotation` and switch `verticalOnly` off. The same class becomes a 3-point channel-like retracement without needing a new annotation type.
:::

#### See Also

- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [FibonacciRetracementAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/retracement/)
- [Channel annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)

