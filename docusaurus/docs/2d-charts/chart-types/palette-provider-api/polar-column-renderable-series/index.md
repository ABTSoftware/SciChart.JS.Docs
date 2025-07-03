---
sidebar_position: 13
---

# ✅ Per-Point Coloring for Polar Column Series 
Polar Column series can be colored per-point or per line-segment using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (TS) or object (JS) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [PolarColumnRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) class like this:

<CodeSnippetBlock labels={["Creating the PaletteProvider"]}>
    ```ts {9,26,35} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {11} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
    ```ts {17-21,61-67} showLineNumbers file=./demo.ts start=#region_C_start end=#region_C_end
    ```
</CodeSnippetBlock>

The code above results in a [Polar Column Series](/docs/2d-charts/chart-types/polar-column-renderable-series) with the following rule: **change color if point is above yValue 10**. The result is shown below:

<LiveDocSnippet name="./demo" />

#### See Also

* [Column Series PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series) - check out the 2D version of this article for more info