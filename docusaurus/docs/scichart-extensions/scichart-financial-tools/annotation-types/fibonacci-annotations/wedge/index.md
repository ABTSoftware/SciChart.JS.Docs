---
sidebar_position: 5
sidebar_label: Fibonacci wedge
---

# FibonacciWedgeAnnotation

[FibonacciWedgeAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciwedgeannotation.html) draws Fibonacci arcs inside a wedge from three placed points. Point 1 is the center. Points 2 and 3 define the angular span and are constrained to the same pixel radius from the center.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock> 

The equal-radius constraint keeps the threshold `1` wedge boundary circular while you drag. Thresholds then scale that radius inside the same angle range. Use [fibonacciLabelPlacement:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciwedgeannotation.html#fibonaccilabelplacement) to move labels around the arcs and [showConnectorLine:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciwedgeannotation.html#showconnectorline) if you want to show placement guidance during editing.

#### See Also

- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [FibonacciCirclesAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/circles/)
- [FibonacciSpeedResistanceArcsAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/speed-resistance-arcs/)
