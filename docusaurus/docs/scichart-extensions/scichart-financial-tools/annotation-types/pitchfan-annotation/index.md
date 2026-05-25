---
sidebar_position: 13
sidebar_label: Pitchfan
---

# PitchfanAnnotation

[PitchfanAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html) extends [PitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchforkannotation.html) and uses the same three placement points: handle, shoulder A and shoulder B. Instead of drawing Andrews' Pitchfork, it projects fan rays from those points.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,24,33,34-35} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Set [showShoulderLine:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html#showshoulderline) to control the line joining the two shoulder points. Pitchfan annotations also inherit multi-point labels for handle, shoulder, segment and axis callouts.

#### See Also

- [PitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotation/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
