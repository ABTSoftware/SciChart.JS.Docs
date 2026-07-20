---
sidebar_position: 3
sidebar_label: Disjoint channel
---

# DisjointChannelAnnotation

[DisjointChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/disjointchannelannotation.html) calculates the fourth point so points 3 and 4 mirror points 1 and 2. This allows disjoint channel edges while preserving a clear relationship between the two sides.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo-disjoint" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {12,22,31-32} showLineNumbers file=./demo-disjoint.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

The third point uses a special square drag grip and moves along the Y axis, making the offset role visible while editing.

:::tip
- `showMidPointGrips` defaults to `false` on this variant, because the third point is already a dedicated vertical-only offset control.
- `showMidLine` and `fill` still work normally, so you can keep the disjoint geometry while changing the visual emphasis.
:::

#### See Also

- [Channel annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/channel-annotation/)
- [FlatBottomChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/flat-bottom-channel/)
