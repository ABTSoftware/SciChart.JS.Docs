---
sidebar_position: 11
sidebar_label: Freehand drawing annotation
---

# FreehandDrawingAnnotation

[FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) is exported by `scichart-financial-tools`. It stores a drawn stroke as a polyline with many points. It inherits serialization and multi-point labels from [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html), then adds editing behavior that is better suited to drawn shapes: body moving, corner resize handles, optional aspect-ratio locking and an optional bounding box outline.

Most applications create this annotation through [FreehandDrawingModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingmodifier.html).

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {18,21,35,37,38,40,41} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

For interactive pointer capture, see [FreehandDrawingModifier](/2d-charts/annotations-api/trading-annotations/freehand-drawing-modifier/).

#### See Also

- [FreehandDrawingModifier](/2d-charts/annotations-api/trading-annotations/freehand-drawing-modifier/)
- [PolyLineAnnotation](/2d-charts/annotations-api/trading-annotations/polyline-annotation/)
- [Multi-Point Labels Deep Dive](/2d-charts/annotations-api/trading-annotations/multipoint-annotations/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
