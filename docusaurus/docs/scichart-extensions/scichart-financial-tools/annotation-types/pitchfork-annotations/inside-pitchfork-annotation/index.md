---
sidebar_position: 15
sidebar_label: Inside pitchfork
---

# InsidePitchforkAnnotation

[InsidePitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/insidepitchforkannotation.html) keeps the shoulder zone between the same two shoulder points as the base pitchfork, but the projected guide ray starts from the midpoint of the handle-to-shoulderA segment.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use this variation when the fork should feel a little more "inside" the swing structure. It still inherits the same pitchfork styling properties as the base class, so you can keep the same zone fills and line styling while changing only the geometry.

:::tip
- The visual difference is in the guide geometry, not in the styling surface, so any pitchfork styling recipe can be reused here.
- It remains a three-point annotation, which makes it a drop-in alternative to the base pitchfork when you want an inward feel.
:::

#### See Also

- [Pitchfork annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/)
- [PitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/pitchfork-annotation/)
- [SchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/schiff-pitchfork-annotation/)
- [ModifiedSchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/modified-schiff-pitchfork-annotation/)
