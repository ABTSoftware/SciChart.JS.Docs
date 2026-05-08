---
sidebar_position: 12
sidebar_label: Freehand drawing modifier
---

# FreehandDrawingModifier

[FreehandDrawingModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingmodifier.html) is exported by `scichart-financial-tools`. It captures pointer input and creates [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) instances.

While drawing is active, pointer-down starts a stroke, pointer-move appends sampled points and pointer-up completes the annotation. The modifier temporarily bypasses normal annotation hover and selection so drawing feels direct.
The demo starts in drawing mode and includes one existing stroke so the finished annotation behavior is visible immediately.

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {20-28,32-34,36} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock> 

Drawing can be controlled from UI buttons.

```ts
import { FreehandDrawingModifier } from "scichart-financial-tools";

const modifier = new FreehandDrawingModifier();

buttonStart.onclick = () => modifier.startDrawing();
buttonStop.onclick = () => modifier.stopDrawing(false); // Pass "true" to cancel the current stroke without creating an annotation.
buttonCancel.onclick = () => modifier.stopDrawing(true); // Set `cancelCurrent=false` to keep the in-progress stroke. */
```

Use [maxPoints:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/interfaces/ifreehanddrawingmodifieroptions.html#maxpoints) to cap very long strokes. Use [simplifyTolerancePx:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/interfaces/ifreehanddrawingmodifieroptions.html#simplifytolerancepx) to reduce point count after capture while preserving the visible shape.

#### See Also

- [FreehandDrawingAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/freehand-drawing-annotation/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotation/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
