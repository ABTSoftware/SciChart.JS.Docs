---
sidebar_position: 10
sidebar_label: Placement and editing
---

# Placement and Editing

[MultiPointAnnotationPlacementModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationplacementmodifier.html) provides a click-to-place workflow for multi-point annotations. The active annotation grows point-by-point until the required points are committed.

### Starting Placement with startPlacement()

Create the modifier once, add it to the surface, then call `startPlacement(...)` when the user chooses a drawing tool. This is the cleanest approach for toolbar-driven apps because the same modifier can place different annotation types over time.

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {16,25-26,28} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

### Starting Placement from the Constructor

Constructor options are useful when a page should open directly into one placement mode. Set [isPlacing:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/interfaces/imultipointannotationplacementmodifieroptions.html#isplacing) to start immediately, and use [keepPlacingAfterComplete:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/interfaces/imultipointannotationplacementmodifieroptions.html#keepplacingaftercomplete) to keep creating new instances after one annotation is finished.

<LiveDocSnippet maxWidth={"100%"} name="./demo-constructor" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {116,25,26,28,58} showLineNumbers file=./demo-constructor.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

[MultiPointAnnotationEditorModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationeditormodifier.html) shows a schema-driven property editor for selected multi-point annotations. See [Annotation editor modifier](/scichart-extensions/scichart-financial-tools/modifiers/multipoint-annotation-editor-modifier/) for schema and manual definition examples.

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotation/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [FreehandDrawingModifier](/scichart-extensions/scichart-financial-tools/modifiers/freehand-drawing-modifier/)
- [Annotation editor modifier](/scichart-extensions/scichart-financial-tools/modifiers/multipoint-annotation-editor-modifier/)
