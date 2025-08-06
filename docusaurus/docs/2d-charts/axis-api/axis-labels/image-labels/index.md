---
sidebar_position: 7
---

# Image Labels

In additional to all the label formatting options by SciChart.js, it is possible to go further and override the [LabelProvider.getLabelTexture():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html#getlabeltexture) function which converts the label text that is produced by [LabelProvider.formatLabel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html#formatlabel) into a texture that can be drawn by WebGL. This gives you total control over the appearance of your labels so that you can use images, complex text, or a combination.

The code below is taken from our online [Image Labels example](http://scichart.com/demo/javascript-image-labels). The key part is to pass an HtmlImageElement to [TextureManager.createTextureFromImage():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/texturemanager.html#createtexturefromimage). Everything else here is about mapping the data to the images.

:::warning
    Setting ```useNativeText: false``` on axis is needed for images to appear. 
:::

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./ImageLabels/demo.ts start=region_A_start end=region_A_end
 
    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./ImageLabels/demo" />

Textures created this way are automatically cached for performance, and disposed of (deleted) when the chart is deleted.

Normally, the size of the texture returned is used as the width and height for layout purposes.  Depending on the shape of your images, you may also want to override the **getLabelWidth** and **getLabelHeight** methods on [LabelProviderBase2D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html).

:::tip
For an example of how to do this with TypeScript, React and npm / webpack to import images, see our [Image Labels example](http://scichart.com/demo/javascript-image-labels), part of the SciChart Demo.
:::