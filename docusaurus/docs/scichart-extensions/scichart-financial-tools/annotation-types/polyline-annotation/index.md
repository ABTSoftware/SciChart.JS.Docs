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

::note
When using a [MultiPointAnnotationPlacementModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationplacementmodifier.html), pass in the line annotation's options `placementPointCount: 5` for example, to allow the user to place 5 points on the chart when creating a new annotation. The PolyLineAnnotation will then render segments between those 5 points, and the user can edit the annotation to add more points if desired.
::

See [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/) for the shared label and snapping options.

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [FreehandDrawingAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/freehand-drawing-annotation/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
