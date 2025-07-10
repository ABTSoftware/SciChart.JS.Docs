---
sidebar_position: 13
---

# Per-Point Coloring for Polar Line Series

Polar Line series can be colored per-point or per line-segment using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (TS) or object (JS) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [PolarLineRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) class like this:

<CodeSnippetBlock labels={["Creating the PaletteProvider"]}>
    ```ts {8,10,23} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {9-12} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
    ```ts {17-21,58-65} showLineNumbers file=./demo.ts start=#region_C_start end=#region_C_end
    ```
</CodeSnippetBlock>

The code above results in a [Polar Line Series](/docs/2d-charts/chart-types/polar-line-renderable-series) with the following rule: **change color on every 3rd point**. The result is shown below:

<LiveDocSnippet name="./demo" />

- We create a `ThresholdLinePaletteProvider` class that extends [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html)
- The [strokePaletteMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#strokepalettemode) is set to [SOLID:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/estrokepalettemode.html#solid) since we want abrupt color changes based on a condition, not a [GRADIENT:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/estrokepalettemode.html#gradient)
- We override [overrideStrokeArgb:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#overridestrokeargb) to return another stroke color when our rule is met: `Math.floor(xValue / 3) % 2 === 0`
- When the method returns `undefined`, the default stroke color is used; otherwise, the custom color is applied
- The [interpolateLine:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html#interpolateline) is set to `true` to create smooth curved segments that follow the polar coordinate system

#### See Also

* [Line Series PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series) - check out the 2D version of this article for more info