---
sidebar_position: 5
---

# ✅ Per-Point Colouring of Bubble Charts

Colouring Bubble Points Individually with PaletteProvider
---------------------------------------------------------

It is possible to override the Bubble series point-marker fill & stroke colour on a per-datapoint basis in SciChart.js using the PaletteProvider API.

To use this, we must create a class which implements or confirms to the [IPointMarkerPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmarkerpaletteprovider.html) interface. Then, apply this to the [XyScatterRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

Let's start off by creating a PaletteProvider class:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>


:::warning
It is important that overridePointMarkerArgb returns an object containing both stroke and fill, even if stroke is ignored on the bubble series.
:::

Next, we can apply the PaletteProvider to a Bubble Series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end

    ```
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_C_start end=region_C_end

    ```

</CodeSnippetBlock>

This results in the following output. Values above the threshold are coloured red, while values below this threshold use the default colour.

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />


#### See Also

- [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview)
- [Per-point Colouring of Line Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series)
