---
sidebar_position: 16
sidebar_label: Modified Schiff pitchfork
---

# ModifiedSchiffPitchforkAnnotation

[ModifiedSchiffPitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/modifiedschiffpitchforkannotation.html) shifts the virtual handle to the midpoint of the first two selected points. It is the closest of the pitchfork variants to the classic Schiff pitchfork while still keeping the fork projection centered between the first two points.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14-35} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Tip: use this variant when you want the pitchfork to react to the swing a little more smoothly, but do not want to abandon the same three-point editing flow and the same `showFullWidthZone` / `showHalfWidthZone` styling model.

:::tip
- This is the closest thing to a "softer" Schiff pitchfork if you want the geometry to pivot from the midpoint of the initial swing.
- All of the base pitchfork zone and line styling props still apply.
:::

#### See Also

- [Pitchfork annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/)
- [PitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/pitchfork-annotation/)
- [SchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/schiff-pitchfork-annotation/)
- [InsidePitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/inside-pitchfork-annotation/)
