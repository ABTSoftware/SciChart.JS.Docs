---
sidebar_position: 1
---

# ✅ PointMetadata API

The PointMetadata API in SciChart.js allows you to:

*   **Tag any X,Y point in a DataSeries with a custom JavaScript object**
*   It can be used with the [DataPoint Selection Modifier](/docs/2d-charts/chart-modifier-api/selection/data-point-selection/index.md) to enable per-point **selection**
*   It can be used with the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/index.md) to provide **custom colouring** of data-points in a series.
*   It can be used with **tooltips** such as [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview/index.md) and [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier/index.md) to display extra data or info inside a tooltip
*   Finally, it can be used in the result of any [Hit-Test operation](/docs/2d-charts/chart-types/hit-test-api/hit-test-api-overview/index.md) where X,Y,Metadata can be queried on click

Adding Metadata to Charts
-------------------------

Metadata is optional and can be set when a dataseries is first created, or whenever data is added or updated. Metadata is just a JavaScript object and can contain any properties, objects, even functions.

See the example below for how to create metadata when constructing an [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) and how to consume it in a [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier/index.md).

<CodeSnippetBlock labels={["TS", "Builder API (Config)", "MyMetadata class"]}>
    ```ts showLineNumbers file=./AddingMetadata/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./AddingMetadata/demoBuilder.js start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./AddingMetadata/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./AddingMetadata/demo" />

:::tip
Note: You do not have to set metadata on every point. The structure of the metadata does not have to be the same for every point.
:::

:::warning
In TypeScript, all metadata must implement the [IPointMetadata:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata.html) interface, ie  ```{ isSelected: boolean }```. For JavaScript, this property can be omitted.
:::

Metadata Templates
------------------

If you just need to set the same metadata on every point, you can supply a single metadata object and it will be used as a template and be cloned onto each datapoint. For example:

<CodeSnippetBlock labels={["JS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./MetadataTemplates/demo.js start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./MetadataTemplates/demo.js start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./MetadataTemplates/demo" />

Metadata Generators
-------------------

If you want to set complex metadata using the [Builder Api](/docs/2d-charts/builder-api/builder-api-overview/index.md) you have the option to take control of how the metadata is deserialized and serialized by passing a **MetadataGenerator**. This is a class that should accept raw data in its constructor and have a **getMetadata** method that returns a metadata array.

<CodeSnippetBlock labels={["JS"]}>
    ```ts showLineNumbers file=./MetadataGenerators/demo.js start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>


Before this class can be used with the builder api it must be registered. Then, it can be used like this:

<CodeSnippetBlock labels={["JS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./MetadataGenerators/demo.js start=region_B_start end=region_B_end

    ```
    ```ts showLineNumbers file=./MetadataGenerators/demo.js start=region_C_start end=region_C_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./MetadataGenerators/demo" />

:::tip
Note: for more info about the Builder API, please see the section in [our documentation here](Intro to the Builder API.html).
:::