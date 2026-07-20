---
sidebar_position: 13
sidebar_label: Pitchfan
---

# PitchfanAnnotation

[PitchfanAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html) extends [PitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchforkannotation.html) and uses the same three placement points: handle, shoulder A and shoulder B. Instead of drawing Andrews' Pitchfork, it projects fan rays from those points.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2,17} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Set [showShoulderLine:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html#showshoulderline) to control the line joining the two shoulder points. Pitchfan annotations also inherit multi-point labels for handle, shoulder, segment and axis callouts.

:::tip
- `showShoulderLine` only hides the shoulder connector; the fan rays and pitchfork zones still render.
- Because it extends `PitchforkAnnotation`, you can keep the same zone fills and line styling while changing only the projection style.
:::

#### See Also

- [PitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/pitchfork-annotation/)
- [SchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/schiff-pitchfork-annotation/)
- [ModifiedSchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/modified-schiff-pitchfork-annotation/)
- [InsidePitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/inside-pitchfork-annotation/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [Fibonacci annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
