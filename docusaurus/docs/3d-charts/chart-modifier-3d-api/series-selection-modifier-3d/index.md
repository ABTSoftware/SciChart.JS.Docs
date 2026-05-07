---
sidebar_position: 3
---

# SeriesSelectionModifier3D

`SeriesSelectionModifier3D` adds series hover and click selection to a `SciChart3DSurface`. It works with 3D renderable series hit-testing and raises `hoverChanged` and `selectionChanged` events with the active series and hit-test information.

The example below uses a small 3D waterfall made from densely sampled `PointLineRenderableSeries3D` rows. Hovering a row highlights it, and clicking selects it. Extra points make hit-testing thin 3D lines feel less jumpy.

<LiveDocSnippet maxWidth={"100%"} name="./demo" htmlPath="./demo.html" cssPath="./demo.css" />

Use **Edit in CodePen** on the live example to open the same TS, HTML and CSS as an editable snippet.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {75-93} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
```
```html showLineNumbers file=./demo.html
```
```css showLineNumbers file=./demo.css
```
</CodeSnippetBlock>

## Key Options

| Option | Description |
| --- | --- |
| `enableSelection` | Enables click selection. Defaults to `true`. |
| `enableHover` | Enables hover state changes on mouse move. Defaults to `false` because hover requires repeated hit-tests. |
| `hitTestRadius` | Pixel radius around the pointer used for hit-testing. Larger values make thin 3D lines easier to hit. |
| `prioritizeClosestToCamera` | When multiple series are hit, choose the hit point closest to the camera. This is useful for stacked or overlapping 3D line/waterfall views. |
| `onSelectionChanged` | Callback raised after selection changes. Use `args.selectedSeries` and `args.hitTestInfo`. |
| `onHoverChanged` | Callback raised after hover changes. Use `args.hoveredSeries` and `args.hitTestInfo`. |

## Notes

- Add the modifier to `sciChart3DSurface.chartModifiers`.
- `hoverChanged` and `selectionChanged` are also available as event handlers if you prefer subscribing after construction.
- The modifier keeps `selectedSeries` and `hoveredSeries` arrays in sync with each series' `isSelected` and `isHovered` flags.
- For `XyzDataSeries3D`, cast `args.hitTestInfo` to `XyzSeriesInfo3D` when you need `dataSeriesIndex`, `xValue`, `yValue` or `zValue`.
