---
sidebar_position: 6
sidebar_label: Fibonacci retracement
---

# FibonacciRetracementAnnotation

[FibonacciRetracementAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html) draws Fibonacci retracement levels from three editable points. Use [verticalOnly:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#verticalonly) for horizontal levels and a vertical connector.

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,24,26-30,33,36,41-44,46-48,68} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Fibonacci has two label systems. Generic multi-point labels describe the editable anchors. Fibonacci level labels describe each retracement level.

Use [thresholds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#thresholds) to control the levels, [regionColors:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#regioncolors) and [fillOpacity:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#fillopacity) to style the bands, and [formatFibonacciLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#formatfibonaccilabel) for custom level text.

#### See Also

- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [PitchforkAnnotation and PitchfanAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-and-pitchfan/)
- [MeasureAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/measure-annotation/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
