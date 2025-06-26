---
sidebar_position: 3
---

# ✅ Metadata and Tooltips

Metadata and Tooltips

Using the ChartModifier API you can add tooltips and cursors to a SciChartSurface. By Combining this with Metadata you can include additional properties or data other than x,y in your tooltip labels.

:::tip
Background reading: 

*   If you haven't already, read the article [DataSeries PointMetadata API](DataSeries PointMetaData Api.html) which will show you how to setup a DataSeries with point metadata (javascript objects).
*   Also take a look at the [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier/index.md) and [CursorModifier](CursorModifier.html) docs to find out how to add tooltips to charts.
:::

Example: Metadata + RolloverModifier
------------------------------------

Maybe you want certain property from Metadata to appear in tooltips. If so, you can use some code like this:

<CodeSnippetBlock labels={["JS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./RolloverModifier/demo.js start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./RolloverModifier/demo.js start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output.

<LiveDocSnippet maxWidth={"100%"} name="./RolloverModifier/demo" />

Example: Metadata + CursorModifier
----------------------------------

The CursorModifier is very similar, however a different template is used to convert an array of SeriesInfo into tooltip lines.

Modify the above code like this to make metadata work with the CursorModifier.

<CodeSnippetBlock labels={["JS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./CursorModifier/demo.js start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./CursorModifier/demo.js start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

Here's the output from the above:

<LiveDocSnippet maxWidth={"100%"} name="./CursorModifier/demo" />
