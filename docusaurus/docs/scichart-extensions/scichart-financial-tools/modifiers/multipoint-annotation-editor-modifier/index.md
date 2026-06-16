---
sidebar_position: 11
sidebar_label: Annotation editor modifier
---

# MultiPointAnnotationEditorModifier

[MultiPointAnnotationEditorModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationeditormodifier.html) shows a floating property editor for the selected [MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html). It listens to annotation selection changes, resolves an editor definition for the selected annotation type, and renders editable fields into a DOM container.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {19,24,41,54,138-147} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

The editor `container` can be any DOM element, including one outside the SciChart surface. In this demo the chart and editor panel are sibling elements, so selecting an annotation updates a side panel instead of overlaying controls on the chart.

## Definition Model

The modifier is driven by [IAnnotationEditorDefinition:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/interfaces/iannotationeditordefinition.html) objects. A definition can match by `annotationType`, `annotationTypes`, or a custom `matches(annotation)` predicate. Each [IAnnotationEditorField:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/interfaces/iannotationeditorfield.html) provides:

- `id`, `label`, `type`, optional `category` and `description`
- optional `min`, `max`, `step` for numeric fields
- optional `options` for enum fields
- `getValue(annotation)` and `setValue(annotation, value)` callbacks
- optional `isVisible(annotation)` for state-dependent controls

## JSON Schema Definitions

For broad editors, you can use external tooling such as `typescript-json-schema` to turn TypeScript option interfaces into JSON objects, then loop over those fields to build annotation editor definitions. 

## Manual Definitions

Manual definitions are best when a field needs custom coercion, conditional visibility, a computed title, or when one control should update multiple annotation properties. Use `renderEditor(args)` only when the built-in panel is not enough and you want to wrap or replace the default UI.

#### See Also

- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [SeriesValueModifier](/scichart-extensions/scichart-financial-tools/modifiers/series-value-modifier/)
- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [ExtendedLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/extended-line-annotation/)
