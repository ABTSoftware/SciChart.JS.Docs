---
sidebar_position: 10
---

# Per-Point Coloring for Rectangle Series

Rectangle series can be colored per-point using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (typescript) or object (javascript) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [FastRectangleRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a PaletteProvider class like this:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14} showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />

:::tip
For a more detailed example of [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html), see the [Javascript Treemap Chart Example](https://stagingdemo2.scichart.com/demo/iframe/treemap-chart). Each rectangle is coloured based on its value, the larger the value, the darker the green, while negative values are coloured red in the same fashion.
:::

#### See Also

- [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview)