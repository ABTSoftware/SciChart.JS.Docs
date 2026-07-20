---
sidebar_position: 14
sidebar_label: Schiff pitchfork
---

# SchiffPitchforkAnnotation

[SchiffPitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/schiffpitchforkannotation.html) is a pitchfork variant whose virtual handle shifts halfway toward the second point on the Y axis while preserving the original X position.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14-35} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use the same pitchfork styling props as the base class, especially `showFullWidthZone`, `showHalfWidthZone`, `fullWidthZoneFill` and `halfWidthZoneFill`. The main difference is the geometry: the fork shifts inward, which makes the pitchfork feel slightly tighter around the selected swing.

:::tip
- If you already know the base `PitchforkAnnotation`, think of Schiff as the same styling surface with a shifted virtual handle.
- It is still a three-point annotation, so the same placement and editing workflow applies.
:::

#### See Also

- [Pitchfork annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/)
- [PitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/pitchfork-annotation/)
- [InsidePitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/inside-pitchfork-annotation/)
- [ModifiedSchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/modified-schiff-pitchfork-annotation/)
