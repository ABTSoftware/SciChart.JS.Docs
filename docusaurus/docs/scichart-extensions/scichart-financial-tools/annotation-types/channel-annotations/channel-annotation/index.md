---
sidebar_position: 1
sidebar_label: ChannelAnnotation
---

# ChannelAnnotation

[ChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html) draws a parallel channel. The first two points define one channel edge; the third point controls the offset, and the fourth corner is calculated automatically to preserve parallelism.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {12,22,24-28,31-32} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Enable [showMidPointGrips:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html#showmidpointgrips) to drag midpoint grips on the channel edges. Use [showMidLine:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html#showmidline) and [midLineStrokeDashArray:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html#midlinestrokedasharray) to control the center line.

Segment labels are useful when each edge needs its own text.

#### See Also

- [Channel annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [FlatBottomChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/flat-bottom-channel/)
- [DisjointChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/disjoint-channel/)
