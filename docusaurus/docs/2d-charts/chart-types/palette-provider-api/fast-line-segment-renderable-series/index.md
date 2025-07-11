---
sidebar_position: 11
---

# Per-Point Coloring for Line Segment Series

Line Segment series can be colored per line-segment using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (typescript) or object (javascript) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) interface. Then, apply this to the [FastLineSegmentRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#paletteprovider) property.

Let's start off with the PaletteProvider class:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {5,16-18} showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the line segment series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {33,37-38,41} showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />

In TypeScript you only need to implement an interface such as [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html), whereas in JavaScript you must extend the [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/defaultpaletteprovider.html) class.

:::note
SciChart won't bisect the line at a threshold value but only changes colour between line segments in the data you already have.  

That being said, a [EStrokePaletteMode.SOLID:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/estrokepalettemode.html#solid) transition will not work with 2 points and a line drawn in between them (as it is done within the segment) - the result will only show 1 colour, so try to stick to [EStrokePaletteMode.GRADIENT:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/estrokepalettemode.html#gradient) for line segments' PaletteProviders.
:::

#### See Also

- [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview)