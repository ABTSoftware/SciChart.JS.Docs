---
sidebar_position: 2
---

# ✅ Image AxisMarkerAnnotation

SciChart.js allows to create **custom axis marker annotations** on axes. This is done by creating [AxisMarkerAnnotation](../axis-marker-annotation-overview/) and passing an **image** option into the constructor.

```ts
const htmlImageElement = await createImageAsync(imageUrl);  

const customAxisMarkerAnnotation = new AxisMarkerAnnotation({  
    y1: 5,  
    isEditable: true,  
    image: htmlImageElement,  
});
```

The full example code is below:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {19-20,27} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {4-5,14} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

In this example we are using [createImageAsync():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#createimageasync) helper function to create an [htmlImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement). This is then passed to [AxisMarkerAnnotation.image:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#image) property. Optionally [AxisMarkerAnnotation.imageWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#imagewidth) and [imageHeight:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#imageheight) may be set.

Here's the output:

<LiveDocSnippet name="./demo" />

On the chart we can see a cloud-shaped custom axis label annotation. The annotation is draggable along the YAxis.

#### See Also

* [The Annotations API Overview](../../annotations-api-overview/)

* [AxisMarkerAnnotation](../axis-marker-annotation-overview/)

* [CustomAnnotation](../../custom-annotation/)