---
sidebar_position: 2
---

# ✅ Formatting VerticalSlice Tooltip Items 

:::tip
**Background reading:** If you haven't already, read the article [The VerticalSliceModifier Type](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview) which will show you how to setup a [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) with default options for tooltips.
:::

This article goes into further detail on customising the tooltip items (formatting, text content)

Basic VerticalSliceModifier Tooltip Formatting Options
------------------------------------------------------

The [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) obeys similar rules to the [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) and [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier) for customizing the tooltip content and appearance.

Tooltip and Axis Label formatting comes from the [axis.labelprovider.formatCursorLabel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html#formatcursorlabel) function and is axis-specific. You can read more about the [Axis.LabelProvider API here](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview), including how to specify formats from Enums and override formatting programmatically.

Below we're going to show you how to apply tooltip formatting to enable four-decimal places on [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) tooltips.


<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {33,48} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {42,57} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Here's a **Codepen** which shows the effect of these properties on the axis on cursor tooltips.

<LiveDocSnippet name="./demo" />

For further customisation on a per-axis basis, consider using the [LabelProvider feature](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview) to create a custom labelprovider, and override formatCursorLabel.

Tooltip DataTemplates
---------------------

Further customisation of [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) tooltip content can be achieved with the [VerticalSliceModifier.tooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltipdatatemplate) property. This defines the content inside the tooltip e.g. what values are shown (x, y, values from metadata), if the series name is shown and so on.

This property expects a function in the following format (see [TRolloverTooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#trollovertooltipdatatemplate)):

<CodeSnippetBlock labels={["tooltipDataTemplateFunction"]}>
    ```ts showLineNumbers
    TRolloverTooltipDataTemplate: (
        seriesInfo: SeriesInfo, 
        tooltipTitle: string, 
        tooltipLabelX: string, 
        tooltipLabelY: string
    ) => string[]
    ```
</CodeSnippetBlock>

The input/output parameters are:

| **In/Out** | **Parameter** | **Description** |
|------------|---------------|-----------------|
| _Input_ | seriesInfo | an instance of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series that intersects the Vertical Line |
| _Input_ | tooltipTitle | a tooltipTitle (string) which comes from [renderableSeries.rolloverModifierProps.tooltipTitle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiptitle). |
| _Input_ | tooltipLabelX | A prefix (string) which comes from [renderableSeries.rolloverModifierProps.tooltipLabelX:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabelx) |
| _Input_ | tooltipLabelY | A prefix (string) which comes from [renderableSeries.rolloverModifierProps.tooltipLabelY:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabely) |
| _Return_ | string[] | An array of strings, each one corresponding to a line in the tooltip |

Let's create a simple example which shows you how to access properties on [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) and output to tooltips.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {2,39,53} showLineNumbers file=./demo-data.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,15} showLineNumbers file=./demo-data.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet name="./demo-data" />
import * as SciChart from "scichart";
