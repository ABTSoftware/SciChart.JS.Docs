---
sidebar_position: 2
---

# Metadata and PaletteProviders

Using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview) you can control the colour of data-points, line segments or columns / bars based on a programmatic rule, e.g. if Y>5 or index < 100.

By combining this with Metadata now you can control the point colour based on any javascript object. Useful if you want to host additional data in your chart such as validity of data or alarm/alert values alongside x-y points.

Background reading: 

*   If you haven't already, read the article [DataSeries PointMetadata API](/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview) which will show you how to setup a DataSeries with point metadata (javascript objects).
*   Also take a look at the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview) docs to find out how to programmatically change series-color on a per-point basis.

Example: Metadata + PaletteProviders
------------------------------------

Below is a worked example showing how to store series point colours in metadata and render them using a custom paletteprovider.

Let's start off by creating the PaletteProvider:

<CodeSnippetBlock labels={["PaletteProvider code JS"]}>
    ```ts showLineNumbers file=./MetadataPaletteProviders/demo.js start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

By inheriting [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/defaultpaletteprovider.html) we can override functions like overrideStrokeArgb, overrideFillArgb and overridePointMarkerArgb. Returning a colour code in Uint ARGB format overrides the colour for that data-point. Returning undefined uses the default series colour.

Next, we can apply the PaletteProvider and metadata to a chart like this.

<CodeSnippetBlock labels={["JS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./MetadataPaletteProviders/demo.js start=region_B_start end=region_B_end

    ```
    ```ts showLineNumbers file=./MetadataPaletteProviders/demo.js start=region_C_start end=region_C_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./MetadataPaletteProviders/demo" />

To learn more about the PaletteProvider API, see the [documentation pages here](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview).
