---
sidebar_position: 2.3
sidebar_label: Adorner properties
---

# Adorner properties

Multi-point trading annotations share one adorner system for their selection outline and drag grips. The same properties work across `FibonacciExtensionAnnotation`, `PitchforkAnnotation`, `FibonacciSpeedResistanceArcsAnnotation`, `PolyLineAnnotation` and the other multi-point tools that inherit from `MultiPointAnnotationBase`.

This page focuses on the properties that most strongly affect how those adorners feel on screen: thickness, stroke, line caps, line joins and grip styling.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {18,39,61} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

## What the properties do

- `selectionBoxThickness` controls how bold the selection outline is. A value like `16` makes the adorner easy to read even on dense charts.
- `selectionBoxStroke` controls the color of that selection outline.
- `annotationsGripsRadius`, `annotationsGripsFill` and `annotationsGripsStroke` control the default drag handles when you do not supply a custom SVG template.
- `gripSvgTemplate` replaces the default grip drawing entirely, which is useful when you want different default, hover, selected or dragging states.
- `adornerStrokeLineCap` and `adornerStrokeLineJoin` control how the selection outline path renders at joins and segment ends.
- `adornerVisibility` and `gripVisibility` decide when the adorners are shown.

:::tip
The fastest way to make a selected trading annotation feel deliberate is usually a bigger `selectionBoxThickness` plus a stronger `selectionBoxStroke`. If you also want the outline to sit farther away from the geometry itself, combine that with the broader annotation-selection styling options in the main 2D annotation docs.
:::

## Demo Notes

The demo places three selected annotations side by side:

- `FibonacciExtensionAnnotation`
- `PitchforkAnnotation`
- `FibonacciSpeedResistanceArcsAnnotation`

Each one uses a `selectionBoxThickness` of `16px`, so the effect is obvious on load.

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [SVG drag points](/scichart-extensions/scichart-financial-tools/annotation-types/svg-drag-points/)
- [Keyboard shortcuts](/scichart-extensions/scichart-financial-tools/annotation-types/keyboard-shortcuts/)
- [Fibonacci annotations](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/)
- [Pitchfork annotations](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/)
- [Styling Annotation Selection](/2d-charts/annotations-api/styling-annotation-selection/)
