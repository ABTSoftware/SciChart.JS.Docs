---
sidebar_position: 17
---

# PaletteProvider for Stacked Columns

[StackedColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/stackedcolumnrenderableseries.html) series can be colored using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/). To use this, we must create a class (TS) or object (JS) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [StackedColumnRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/stackedcolumnrenderableseries.html) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/istrokepaletteprovider.html) class like this:

<CodeSnippetBlock labels={["Creating the PaletteProvider"]}>
    ```ts {5} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {11,19,32}, showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

The code above results in a [StackedColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/stackedcolumnrenderableseries.html) with the following rule: **if (yValue >= 50) coror is red, else if (yValue >= 30) color is orange else color is skyblue**. The result is shown below:

<LiveDocSnippet name="./demo" />

#### See Also

* [Xy Scatter Series PaletteProvider API](/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series/) - check out the 2D version of this article for more info
