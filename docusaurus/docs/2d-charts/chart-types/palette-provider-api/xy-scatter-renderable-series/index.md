---
sidebar_position: 8
---

# ✅ Per-Point Colouring of Scatter Charts (or PointMarkers)

Colouring Scatter Points Individually with PaletteProvider
----------------------------------------------------------

It is possible to override the Scatter series point-marker fill & stroke colour on a per-datapoint basis in SciChart.js using the PaletteProvider API.

To use this, we must create a class which implements or confirms to the [IPointMarkerPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmarkerpaletteprovider.html) interface. Then, apply this to the [XyScatterRenderableSeries.paletteProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

Let's start off by creating a PaletteProvider class:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
 
    ```
</CodeSnippetBlock>

:::warning
It is important that overridePointMarkerArgb returns an object containing both stroke and fill.
:::

Next, we can apply the PaletteProvider to a Scatter Series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end
 
    ```
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_C_start end=region_C_end
 
    ```
</CodeSnippetBlock>

This results in the following output. Values above 0.0 are coloured red, while values below this threshold use the default colour.

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />