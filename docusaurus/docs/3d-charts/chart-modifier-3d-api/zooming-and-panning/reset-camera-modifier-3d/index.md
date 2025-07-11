---
sidebar_position: 4
---

# Reset Camera Modifier 3D

Zooming and Panning a Chart in SciChart.js is achieved by moving the [SciChart3DSurface.camera:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#camera) to a new location.

The article ["The SciChart3DSurface Camera"](/3d-charts/scichart-3d-basics/scichart-surface-camera/index.md) goes into detail how this camera class works and how to manipulate it programatically to achieve various views.

If you add any zooming or panning to the chart you might want to reset the viewport to it's original state. You can do this with the [ResetCamera3DModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/resetcamera3dmodifier.html).

How this modifier works:

*   When the [ResetCamera3DModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/resetcamera3dmodifier.html) is attached to the chart, it saves the current [camera:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html#camera) state.
*   An optional destination object of type [TCameraState:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcamerastate) may be set to override this state.
*   When you double click on the chart, the [ResetCamera3DModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/resetcamera3dmodifier.html) animates the camera position to the initial camera state.

Declaring an ResetCameraModifier3D
----------------------------------

Declaring a [ResetCamera3DModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/resetcamera3dmodifier.html) is as simple as adding one to the [SciChart3DSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/orbitmodifier3d.html) property. This can be done as a single modifier, or as part of a group.

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

If you double click by the left mouse button you will notice how the camera resets.