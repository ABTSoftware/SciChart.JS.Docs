---
sidebar_position: 100
---

# ✅ The PaletteFactory Helper Class

We've created a helper class called [PaletteFactory](https://www.scichart.com/documentation/js/current/typedoc/classes/palettefactory.html) to create some commonly used PaletteProviders. These work with all series types in SciChart.js that support the PaletteProvider API.

PaletteFactory.createYGradient
------------------------------

The function [PaletteFactory.createYGradient](https://www.scichart.com/documentation/js/current/typedoc/classes/palettefactory.html#createygradient) generates a [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/index.md) for use in renderable series which applies a gradient fill dependent on Y-value.

Below find an example of usage:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./CreateYGradient/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>

This creates a Y-Gradient from blue, to green to red for Y-values ranging from 0 to +1.5. Values outside that range are clamped to the colours at the start/end of the list of gradient stops.

Here's an example output & codepen you can edit to try this out: 

<LiveDocSnippet maxWidth={"100%"} name="./CreateYGradient/demo" />

To separately control the output of the generated [PaletteProvider](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/index.md), check the [IGradientPaletteOptions](https://www.scichart.com/documentation/js/current/typedoc/interfaces/igradientpaletteoptions.html) parameter passed in. Using this, you can enable fill, stroke, pointmarkers and opacity for different elements of the series.

PaletteFactory.createGradient
-----------------------------

Another helper function [PaletteFactory.createGradient](https://www.scichart.com/documentation/js/current/typedoc/classes/palettefactory.html#creategradient) allows you to create gradient fills in the X-Direction. The parameters for this are largely the same.

Below find an example of usage:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./CreateGradient/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>

This creates a X-Gradient from Red, to Yellow, Purple to Green for X-values ranging from the start of the series to the end. Values outside that range are clamped to the colours at the start/end of the list of gradient stops.

Here's an example output & codepen you can edit to try this out: 

<LiveDocSnippet maxWidth={"100%"} name="./CreateGradient/demo" />
