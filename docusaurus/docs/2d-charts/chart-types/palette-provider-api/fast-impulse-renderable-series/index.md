---
sidebar_position: 9
---

# ✅ Per-Point Colouring of Impulse Charts

Impulse series can be colored per-point or per data-point using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/index.md). To use this, we must create a class (typescript) or object (javascript) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [FastImpulseRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastimpulserenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

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
 

The code above results in a [JavaScript Column Chart](https://demo.scichart.com/javascript-column-chart) with the following output. YValues > 10 are colored red, and YValues < 10 are the default series stroke and fill colors.

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />