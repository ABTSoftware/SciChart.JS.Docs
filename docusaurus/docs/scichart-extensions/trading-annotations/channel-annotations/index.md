---
sidebar_position: 4
sidebar_label: Channel annotations
---

# Channel Annotations

[ChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html) draws a parallel price channel defined by 4 points. The first two points define one channel line; the third controls the offset, the fourth is automatically calculated to maintain the channel's parallelism. 

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {12,22,24-28} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

It can have mid-points between points1-2 and points 3-4, which can be enabled with [showMidPointGrips:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html#showmidpointgrips) and dragged to adjust the channel's width. They have a "ns-resize" cursor style to indicate their function.

The middle dashed line between the 2 edges can be disabled with [showMidLine:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html#showmidline) `false` and styled with [midLineStrokeDashArray:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html#midlinestrokedasharray). 

Segment labels are useful when each edge needs its own text.

---

## Other Channel Annotation Variants:

### [FlatBottomChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/flatbottomchannelannotation.html) 

It normalizes the lower edge so both bottom points (points 3 & 4) share the same y-value. Parallelism is no longer maintained, but the bottom edge is guaranteed to be flat. This is useful for trading strategies that require a fixed support level.

<LiveDocSnippet maxWidth={"100%"} name="./demo-flatbottom" />

--- 

### [DisjointChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/disjointchannelannotation.html) 

It calculates the 4th points such that points 3-4 mirror points 1-2, allowing for disjoint channel edges.
The 3rd point is a special drag grip (square shape as opposed to circular, to indicate its special function) that only moves along the Y axis. 

Try hovering it and see the cursor style change to "ns-resize".  

<LiveDocSnippet maxWidth={"100%"} name="./demo-disjoint" />

#### See Also

- [PolyLineAnnotation](/scichart-extensions/trading-annotations/polyline-annotation/)
- [ExtendedLineAnnotation](/scichart-extensions/trading-annotations/extended-line-annotation/)
- [PitchforkAnnotation and PitchfanAnnotation](/scichart-extensions/trading-annotations/pitchfork-and-pitchfan/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/trading-annotations/multipoint-annotations/)
