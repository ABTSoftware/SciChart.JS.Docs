---
sidebar_position: 14
sidebar_label: Measure annotation
---

# MeasureAnnotation

[MeasureAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html) measures the change between two points. It renders a rectangle, horizontal and vertical arrows and a dedicated measurement label.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {19,26,27,31-35} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use [growingColor:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html#growingcolor) and [decliningColor:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html#decliningcolor) to style positive and negative moves. Customize the measurement label with [labelDataTemplate:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html#labeldatatemplate).

The inherited multi-point labels are still available for endpoint or axis callouts. Use [labelDataTemplate:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html#labeldatatemplate) only for the central measurement label.

#### See Also

- [FibonacciRetracementAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/retracement/)
- [StopLossTakeProfitAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/stop-loss-take-profit/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
