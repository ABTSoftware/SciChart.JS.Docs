---
sidebar_position: 2.2
sidebar_label: SVG drag points
---

# SVG drag points

`MultiPointAnnotationBase` supports a `gripSvgTemplate` callback, so you can replace the default vertex grips with your own SVG. The template receives the annotation plus a small state object, which makes it easy to react to default, hovered, selected and dragging states.

The built-in `annotationsGripsRadius`, `annotationsGripsFill` and `annotationsGripsStroke` values are still useful as a fallback. The custom template can either draw its own SVG completely or reuse helpers such as `getSquareGripSvg(...)` for boxier handles.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {24,42,84,97} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
The state object passed to `gripSvgTemplate` exposes `isHovered`, `isSelected` and `isDragging`. That is usually enough to make drag handles expand on hover, snap into a selected state, or switch to a stronger fill while a vertex is moving.
:::

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [Keyboard shortcuts](/scichart-extensions/scichart-financial-tools/annotation-types/keyboard-shortcuts/)
- [Adorner properties](/scichart-extensions/scichart-financial-tools/annotation-types/adorner-properties/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
