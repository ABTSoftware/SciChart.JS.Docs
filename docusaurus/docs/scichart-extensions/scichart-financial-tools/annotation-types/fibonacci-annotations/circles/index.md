---
sidebar_position: 3
sidebar_label: Fibonacci circles
---

# FibonacciCirclesAnnotation

[FibonacciCirclesAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccicirclesannotation.html) draws concentric Fibonacci circles or ovals from two placed points. The points are opposite corners of the rectangle that contains the threshold `1` oval; every other threshold scales that oval from the same center.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ``` 
</CodeSnippetBlock>

Use this variant when the key relationship is distance around a central consolidation or swing. The shared [thresholds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccicirclesannotation.html#thresholds), [regionColors:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccicirclesannotation.html#regioncolors), [fillOpacity:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccicirclesannotation.html#fillopacity) and Fibonacci label properties are inherited from `FibonacciAnnotationBase`.

#### See Also

- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [FibonacciSpeedResistanceArcsAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/speed-resistance-arcs/)
- [FibonacciWedgeAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/wedge/)
