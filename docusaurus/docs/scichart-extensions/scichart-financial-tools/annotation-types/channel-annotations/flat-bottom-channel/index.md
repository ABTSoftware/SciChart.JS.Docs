---
sidebar_position: 2
sidebar_label: Flat-bottom channel
---

# FlatBottomChannelAnnotation

[FlatBottomChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/flatbottomchannelannotation.html) normalizes the lower edge so both bottom points share the same y-value. Parallelism is no longer maintained, but the bottom edge is guaranteed to be flat.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo-flatbottom" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {12,22,31-32} showLineNumbers file=./demo-flatbottom.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use this variant when the channel needs a fixed support level and a sloped upper boundary.

#### See Also

- [Channel annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/channel-annotation/)
- [DisjointChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/disjoint-channel/)
