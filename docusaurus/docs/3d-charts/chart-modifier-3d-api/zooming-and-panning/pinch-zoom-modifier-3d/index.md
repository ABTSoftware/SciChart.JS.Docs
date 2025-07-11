---
sidebar_position: 2
---

# Pinch Zoom Modifier 3D

Zooming and Panning a Chart in SciChart.js is achieved by moving the [SciChart3DSurface.camera:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#camera) to a new location.

The article ["The SciChart3DSurface Camera"](/3d-charts/scichart-3d-basics/scichart-surface-camera/index.md) goes into detail how this camera class works and how to manipulate it programatically to achieve various views.

If you want to add simple Pinch Zooming via Touch to the chart then you can do so using our ChartModifiers API. The [PinchZoomModifier3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pinchzoommodifier3d.html) was added to SciChart.js v3.2 and performs adjustment of the camera radius giving the appearance of the chart zooming.

Declaring an PinchZoomModifier3D
--------------------------------

Declaring a [PinchZoomModifier3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/pinchzoommodifier3d.html)  is as simple as adding one to the [SciChart3DSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/orbitmodifier3d.html) property. This can be done as a single modifier, or as part of a group.

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