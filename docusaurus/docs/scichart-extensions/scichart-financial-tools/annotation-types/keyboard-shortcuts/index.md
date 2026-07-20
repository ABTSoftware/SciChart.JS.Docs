---
sidebar_position: 2.2
sidebar_label: Keyboard shortcuts
---

# Keyboard shortcuts

Trading annotation editors often need a small keyboard layer on top of the placement and hover modifiers. A common pattern is:

- `Backspace` or `Delete` removes the currently selected annotation.
- `Ctrl` / `Cmd` + `C` copies the selected annotation options.
- `Ctrl` / `Cmd` + `V` pastes a clone with a small offset.
- `Ctrl` / `Cmd` + `D` duplicates the selected annotation immediately.

This example keeps the logic deliberately small and uses `toJSON()` as the bridge between the chart and the clipboard state.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {31-90,94-170} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

:::tip
The exact same shortcut pattern can be generalized to `ChannelAnnotation`, `PitchforkAnnotation`, `FibonacciRetracementAnnotation` and the other multi-point tools. The only thing that changes is which annotation class you recreate from the stored options.
:::

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [SVG drag points](/scichart-extensions/scichart-financial-tools/annotation-types/svg-drag-points/)
- [Adorner properties](/scichart-extensions/scichart-financial-tools/annotation-types/adorner-properties/)
- [Annotation eraser](/scichart-extensions/scichart-financial-tools/modifiers/annotation-eraser-modifier/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)

