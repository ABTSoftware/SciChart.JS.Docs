---
sidebar_position: 3
---

# SVG Axis Marker Annotation

[AxisMarkerAnnotations](/2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview) can also be created with SVG, also using the [AxisMarkerAnnotation.image:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#image) property. This can be done as follows.

Remember to import [createImageAsync():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#createimageasync) and [AxisMarkerAnnotation](/2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview) for this to work!

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
```ts {11} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
```
```ts {7,18} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
```
</CodeSnippetBlock>

In this example we are using [createImageAsync():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#createimageasync) helper function to create an [htmlImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) from SVG. This is then passed to [AxisMarkerAnnotation.image:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#image) property. [AxisMarkerAnnotation.imageWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#imagewidth) and [imageHeight:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#imageheight) must be set to scale the SVG to the desired size.

Here's the output: 

<LiveDocSnippet name="./demo" />

On the chart we can see a custom SVG axis label annotation. The annotation is draggable along the YAxis.