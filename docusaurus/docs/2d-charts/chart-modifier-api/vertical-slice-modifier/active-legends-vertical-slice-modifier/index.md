---
sidebar_position: 3
---

# ✅ Active Legends - VerticalSliceModifier output to a Legend

:::tip
**Background reading:** If you haven't already, read the article [The VerticalSliceModifier Type](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview) which will show you how to setup a [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) with default options for tooltips.
:::

This article goes into further detail on customising the tooltip items (formatting, text content)

VerticalSliceModifier tooltipLegendTemplates
--------------------------------------------

The [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) supports a [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltiplegendtemplate) property which allows you to specify a function to transform [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) content into a legend which can be placed in the top left of the chart. This active legend updates with series values as you drag the vertical lines, or when a series updates.

The [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltiplegendtemplate) property expects a function in the following format (see [TRolloverLegendSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#trolloverlegendsvgtemplate)):


<CodeSnippetBlock labels={["tooltipLegendTemplate function signature"]}>
    ```ts showLineNumbers
    TRolloverLegendSvgTemplate: (
        seriesInfos: SeriesInfo[], 
        svgAnnotation: RolloverLegendSvgAnnotation
    ) => string
    ```
</CodeSnippetBlock>

The input/output parameters are:

| **In/Out** | **Parameter** | **Description** |
|------------|---------------|-----------------|
| _Input_ | seriesInfos | an array of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series that intersects the Vertical Line |
| _Input_ | svgAnnotation | The [RolloverLegendSvgAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html) that will be used to render the legend. From here you can access properties of the underlying legend container, such as [tooltipLegendOffsetX:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html#tooltiplegendoffsetx) / Y or [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html#tooltiplegendtemplate) |
| _Return_ | string[] | A string containing the result SVG to display inside the [RolloverLegendSvgAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html) |

Let's create a simple example which shows you how to access properties on [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) and output to a custom legend.

Here's a worked example below, which shows how to place the hit-test result from a vertical line into an active legend elsewhere in your application.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2,35} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>
This results in the following output:

<LiveDocSnippet name="./demo" />

Using External placementDivId with the VerticalSliceModifier
------------------------------------------------------------

Another way you can control the placement of the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) tooltip is using the [placementDivId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#placementdivid) property. This places the standard VerticalSliceModifier tooltip into a div of your choice (which can be anywhere on the app).

Note, it does not currently work with [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltiplegendtemplate), however we are working on more options for styling, placement and configuration of tooltips soon.

Try the following code in your application:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {12} showLineNumbers file=./placement-div/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>
<CodeSnippetBlock labels={["HTML"]}>
    ```html {4} showLineNumbers file=./placement-div/demo.html
    ```
</CodeSnippetBlock>
<CodeSnippetBlock labels={["CSS"]}>
    ```css showLineNumbers file=./placement-div/demo.css
    ```
</CodeSnippetBlock>

This results in the following output.

<LiveDocSnippet 
    name="./placement-div/demo" 
    htmlPath="./placement-div/demo.html" 
    cssPath="./placement-div/demo.css" 
/>