---
sidebar_position: 13
---

# Per-Point Coloring for Polar Band Series

[Polar Band series](/2d-charts/chart-types/polar-band-renderable-series) can be colored per-point or per line-segment using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (TS) or object (JS) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [PolarBandRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarbandrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a [PaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) class like this:

<CodeSnippetBlock labels={["Creating the PaletteProvider"]}>
    ```ts {10,17,25} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {10} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
    ```ts {48} showLineNumbers file=./demo.ts start=#region_C_start end=#region_C_end
    ```
</CodeSnippetBlock>

The code above results in a [Polar Band Series](/2d-charts/chart-types/polar-band-renderable-series) with the following rule: **change color once every 3 points**. The result is shown below:

<LiveDocSnippet name="./demo" />

In the code above:
- We create a class that extends [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html) to override [overrideFillArgb:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#overridefillargb) and [overrideStrokeArgb:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/defaultpaletteprovider.html#overridestrokeargb) methods by `xValue`, more specifically, the orange fill & stroke when this custom rule is met:

```ts
((xValue > 3 && xValue <= 6) || (xValue > 9 && xValue <= 12))
```

#### See Also

* [Band Series PaletteProvider API](/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series) - check out the 2D version of this article for more info