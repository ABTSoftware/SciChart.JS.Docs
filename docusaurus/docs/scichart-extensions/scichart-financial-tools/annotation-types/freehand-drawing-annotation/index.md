---
sidebar_position: 15
sidebar_label: Freehand drawing annotation
---

# FreehandDrawingAnnotation

[FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) is exported by `scichart-financial-tools`. It stores a drawn stroke as a polyline with many points. It inherits serialization and multi-point labels from [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html), then adds editing behavior that is better suited to drawn shapes: body moving, corner resize handles, optional aspect-ratio locking and an optional bounding box outline.

Most applications create this annotation through [FreehandDrawingModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingmodifier.html).

:::tip
In order to select the annotation click on the drawn line. Clicking not on the line does not select.
:::

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {10,20,23,48,50-51,53-54} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

For interactive pointer capture, see [FreehandDrawingModifier](/scichart-extensions/scichart-financial-tools/modifiers/freehand-drawing-modifier/).

#### See Also

- [FreehandDrawingModifier](/scichart-extensions/scichart-financial-tools/modifiers/freehand-drawing-modifier/)
- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/polyline-annotation/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
