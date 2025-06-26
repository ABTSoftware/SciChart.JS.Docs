---
sidebar_position: 2
---

# Formatting CursorModifier Tooltip Items

:::tip
Background reading:

If you haven't already, read the article [The CursorModifier Type](CursorModifier.html) which will show you how to setup a **CursorModifier** with default options for tooltips. This article goes into further detail on customising the tooltip items (formatting, text content)
:::

Basic CursorModifier Tooltip Formatting Options
-----------------------------------------------

Tooltip and Axis Label formatting comes from the [axis.labelprovider.formatCursorLabel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html#formatcursorlabel) function and is axis-specific. You can read more about the [Axis.LabelProvider API here](../../../axis-api/axis-labels/label-provider-api-overview/), including how to specify formats from Enums and override formatting programmatically.

Below we're going to show you how to apply cursor formatting to enable four-decimal places on tooltips.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {28-29,38-39,44} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {13-14,24-25,30} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Here's a **Codepen** which shows the effect of these properties on the axis on cursor tooltips:

<LiveDocSnippet name="./demo" />

For further customisation on a per-axis basis, consider using the [LabelProvider feature](../../../axis-api/axis-labels/custom-label-providers-readable-numbers/) to create a custom labelprovider, and override formatCursorLabel.

Tooltip DataTemplates
---------------------

Further customisation of tooltip content can be achieved with the [CursorModifier.tooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltipdatatemplate) property. This defines the content inside the tooltip e.g. what values are shown (x, y, values from metadata), if the series name is shown and so on.

This property expects a function in the following format (see [TCursorTooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipdatatemplate)):

<CodeSnippetBlock labels={["tooltipDataTemplate function signature"]}>
    ```ts showLineNumbers
    tooltipDataTemplate: (
        seriesInfos: SeriesInfo[], 
        tooltipTitle: string
    ) => string[];
    ```
</CodeSnippetBlock>

The input/output parameters are:

*   **Input**: an array of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series under the mouse.
*   **Input**: a tooltipTitle (string) which comes from [renderableSeries.rolloverModifierProps.tooltipTitle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiptitle).
*   **Output**: an array of strings, each one corresponding to a line in the tooltip.

Let's create a simple example which shows you how to access properties on [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) and output to tooltips.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {16,43} showLineNumbers file=./data-template.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,15} showLineNumbers file=./data-template.ts start=#region_B_start end=#region_B_end
    ``` 
</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet name="./data-template" />

Accessing Metadata in Tooltip DataTemplates 
-------------------------------------------

In the above example we access properties of [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) to format lines in the CursorModifier tooltip.

You can also access metadata to store any custom object in your X,Y data, then read that data out in tooltips.

For a worked example see [PointMetadata API - Metadata and Tooltips](../../../chart-types/point-metadata-api/tooltips/).

See Also

[Customizing the CursorModifier Tooltip Container Appearance](CursorModifier_CustomisingContainer.html)

[Active Legends - CursorModifier output into a legend](CursorModifier_PlaceTooltipLegendExternally.html)