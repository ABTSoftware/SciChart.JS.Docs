---
sidebar_position: 3
---

# ✅ Per-point Colouring of Mountain Segments

Mountain series can be colored per-point using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (typescript) or object (javascript) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [FastMountainRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a PaletteProvider class like this:

<CodeSnippetBlock labels={["TS"]}>

    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
 
    ```
 
</CodeSnippetBlock>
 

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end
 
    ```
 
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_C_start end=region_C_end
 
    ```    

</CodeSnippetBlock>
 

The code above results in a [JavaScript Mountain Chart](https://demo.scichart.com/javascript-mountain-chart) with the following output. XValues > 200 are colored red, and XValues < 200 are the default series colors.

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />

:::note
SciChart won't bisect the line at a threshold value but only changes colour between line segments in the data you already have. If you want to have a perfect transistion from one colour to another at a specific Y-value, you will need to include data-points
:::

Colouring Mountain Series Point-Markers with PaletteProvider
------------------------------------------------------------

If applying PointMarkers to the FastMountainRenderableSeries, and you want to adjust per-point coloring of the markers, then you need to implement overridePointMarkerArgb in your paletteprovider.

Find out how in the documentation page [Per-Point Colouring of Scatter Charts (or PointMarkers)](/docs/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series).

#### See Also

- [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview)
- [Per-point Colouring of Line Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series)
- [Per-Point Colouring of Band Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series)
- [Per-Point Colouring of Bubble Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-bubble-renderable-series)
- [Per-Point Colouring of Candlestick / OHLC Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-candlestick-ohlc-renderable-series)
- [Per-Point Colouring of Scatter Charts (or PointMarkers)](/docs/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series)
- [Per-Point Colouring of Column Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series)