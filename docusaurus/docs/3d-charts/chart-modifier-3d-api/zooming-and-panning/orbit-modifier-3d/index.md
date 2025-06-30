---
sidebar_position: 1
---

# ✅ Orbit Modifier 3D

Zooming and Panning a Chart in SciChart.js is achieved by moving the [SciChart3DSurface.camera:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#camera) to a new location.

The article ["The SciChart3DSurface Camera"](/docs/3d-charts/scichart-3d-basics/scichart-surface-camera/index.md) goes into detail how this camera class works and how to manipulate it programatically to achieve various views.

If you want to add simple panning of the camera to the chart then you can do so using our ChartModifiers API. The [OrbitModifier3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/orbitmodifier3d.html) performs orbital motion of the camera giving the appearance of the chart rotating.

Declaring an OrbitModifier3D
----------------------------

Declaring an [OrbitModifier3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/orbitmodifier3d.html) is as simple as adding one to the [SciChart3DSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/orbitmodifier3d.html) property. This can be done as a single modifier, or as part of a group.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end

```
```html showLineNumbers file=./Basic/demo.html
```
```css showLineNumbers file=./Basic/demo.css
```
</CodeSnippetBlock>

This results in the following behaviour added to the chart.

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" htmlPath="./Basic/demo.html" cssPath="./Basic/demo.css" />