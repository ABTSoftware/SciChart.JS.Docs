---
sidebar_position: 12.5
sidebar_label: Annotation eraser
---

# AnnotationEraserModifier

[AnnotationEraserModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/annotationerasermodifier.html) turns pointer input into an erase gesture. Click once to erase at a point, or drag to sample a freehand trail and erase every annotation that lies under the trail.

The demo keeps erasing mode active, shows the temporary trail and uses a small instruction banner above the chart so the behavior is obvious without reading the code first.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {17-30,34-87} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
`keepErasingAfterComplete` is handy when the eraser should behave like a tool instead of a one-shot action. `eraseAllAtHitPoint` lets you choose whether the top-most hit annotation or every annotation at that location is removed.
:::

#### See Also

- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [FreehandDrawingModifier](/scichart-extensions/scichart-financial-tools/modifiers/freehand-drawing-modifier/)
- [Keyboard shortcuts](/scichart-extensions/scichart-financial-tools/annotation-types/keyboard-shortcuts/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
