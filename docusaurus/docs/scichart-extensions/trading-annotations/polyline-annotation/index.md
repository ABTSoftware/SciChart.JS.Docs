---
sidebar_position: 3
sidebar_label: PolyLine annotation
---

# PolyLineAnnotation

[PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html) is exported by `scichart-financial-tools`. It is the simplest concrete multi-point annotation: it renders straight segments through the [points:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html#points) array and inherits editing, snapping and labels from that package's [MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html).

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,24,26-31,74,81} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ``` 
</CodeSnippetBlock>

Set [fill:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html#fill) to draw a closed filled polygon through the same points. Point and segment labels move with their anchor indexes while the polyline is edited.

See [Multi-Point Labels Deep Dive](/scichart-extensions/trading-annotations/multipoint-annotations/) for the shared label and snapping options.

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/trading-annotations/multipoint-annotations/)
- [ChannelAnnotation](/scichart-extensions/trading-annotations/channel-annotations/)
- [FreehandDrawingAnnotation](/scichart-extensions/trading-annotations/freehand-drawing-annotation/)
- [Placement and Editing](/scichart-extensions/trading-annotations/placement-and-editing/)
