---
sidebar_position: 1
sidebar_label: Fibonacci retracement
---

# FibonacciRetracementAnnotation

[FibonacciRetracementAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html) draws Fibonacci retracement levels after two placed points by default. Point 1 and point 2 define the price move, and horizontal levels are calculated between those values. Dragging from a high to a low gives a downward retracement; dragging from a low to a high gives an upward retracement.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" htmlPath="./demo.html" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2,13} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::note
The default [verticalOnly:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#verticalonly) mode uses 2 placement points and draws non-skewed horizontal levels. Set `verticalOnly: false` to use three points: points 1 and 2 define the baseline, and point 3 defines the retracement direction for parallel skewed levels.
:::

Use [thresholds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#thresholds) to control the levels, [regionColors:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#regioncolors) and [fillOpacity:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#fillopacity) to style the bands, and [formatFibonacciLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#formatfibonaccilabel) for custom level text.

The demo uses `extendStart: false` and `extendEnd: true`, so each level stroke and colored band continues past its second calculated point to the chart boundary. The labels remain anchored to the original calculated levels.

#### See Also

- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [Fibonacci channel](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/fibonacci-channel/)
- [FibonacciExtensionAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/extension/)
- [FibonacciSpeedResistanceArcsAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/speed-resistance-arcs/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
