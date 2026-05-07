---
sidebar_position: 7
sidebar_label: Pitchfork and pitchfan
---

# Pitchfork and Pitchfan

### PitchforkAnnotation

[PitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchforkannotation.html) draws Andrews' Pitchfork from three points: handle, shoulder A and shoulder B. It supports optional full-width and half-width zones.

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,24,33-34} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

### PitchfanAnnotation

[PitchfanAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html) uses the same pitchfork points and draws projected fan rays. Set [showShoulderLine:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html#showshoulderline) to control the line joining the two shoulders.

<LiveDocSnippet maxWidth={"100%"} name="./demo-pitchfan" /> 

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,24-26,35,72} showLineNumbers file=./demo-pitchfan.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Both annotations inherit multi-point labels for handle, shoulder and axis callouts.

#### See Also

- [ChannelAnnotation](/scichart-extensions/trading-annotations/channel-annotations/)
- [FibonacciRetracementAnnotation](/scichart-extensions/trading-annotations/fibonacci-retracement/)
- [ExtendedLineAnnotation](/scichart-extensions/trading-annotations/extended-line-annotation/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/trading-annotations/multipoint-annotations/)
