---
sidebar_position: 13
---

# Per-Point Coloring for Polar Scatter Series

Polar Scatter series can be colored per-point using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (TS) or object (JS) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [PolarXyRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarxyrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) class like this:

<CodeSnippetBlock labels={["Creating the PaletteProvider"]}>
    ```ts {8,11,30} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {11,12,15} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
    ```ts {16-24,61,62,65-73} showLineNumbers file=./demo.ts start=#region_C_start end=#region_C_end
    ```
</CodeSnippetBlock>

The code above results in a [Polar Xy Scatter Series](/docs/2d-charts/chart-types/polar-xy-scatter-renderable-series) with the following rule: **change color if value is greater than 0**. The result is shown below:

<LiveDocSnippet name="./demo" />

#### See Also

* [Xy Scatter Series PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series) - check out the 2D version of this article for more info