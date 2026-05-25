---
sidebar_position: 4
sidebar_label: Fibonacci speed resistance arcs
---

# FibonacciSpeedResistanceArcsAnnotation

[FibonacciSpeedResistanceArcsAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccispeedresistancearcsannotation.html) draws concentric Fibonacci arcs from two placed points. Point 1 is the arc center. Point 2 defines the threshold `1` radius and chooses whether the arcs open above or below the center.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {8,18,24,25,32} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This annotation is arc-based, so it inherits the shared Fibonacci threshold, region and label properties from [FibonacciArcAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciarcannotationbase.html). Regions are drawn between neighboring arcs. The connector line is often useful because it shows the reference radius used for threshold `1`.

#### See Also

- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [FibonacciCirclesAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/circles/)
- [FibonacciWedgeAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/wedge/)
