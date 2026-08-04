---
sidebar_position: 2
sidebar_label: Fibonacci extension
---

# FibonacciExtensionAnnotation

[FibonacciExtensionAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciextensionannotation.html) draws projected Fibonacci levels after three placed points. Points 1 and 2 guide the trend height; point 3 sets the start offset for the projection. After the first two points define an upward move, the third point anchors where the extension begins.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2,13-14} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ``` 
</CodeSnippetBlock> 

Fibonacci extensions always use horizontal levels. The inherited [verticalOnly:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciextensionannotation.html#verticalonly) property returns `true` for this annotation because the third point controls the projection offset instead of switching to skewed mode.

The shared Fibonacci properties work the same as retracements: [thresholds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciextensionannotation.html#thresholds) choose the projected ratios, [regionColors:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciextensionannotation.html#regioncolors) style the bands, and [formatFibonacciLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciextensionannotation.html#formatfibonaccilabel) formats each level label.

Before projection, each extension level runs from point 2's X value to point 3's X value. The demo uses `extendStart: true` and `extendEnd: false` to continue the levels and colored bands backwards from point 2.

#### See Also

- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [FibonacciRetracementAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/retracement/)
- [FibonacciCirclesAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/circles/)
