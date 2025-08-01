---
sidebar_position: 4
---

# Customizing VerticalSliceModifier Tooltip Containers

:::tip
**Background reading:** If you haven't already, read the article [The VerticalSliceModifier Type](/2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview) which will show you how to setup a [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) with default options for tooltips.
:::

This article goes into further detail on customising the tooltip items (formatting, text content)

Basic Customization of VerticalSliceModifier Tooltips via properties
--------------------------------------------------------------------

Basic customisation of the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) appearance can be made through the following properties.

*   The vertical line thickness, dash and stroke color can be changed with the [VerticalSliceModifier.rolloverLineStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestroke), [VerticalSliceModifier.rolloverLineStrokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestrokethickness) and [VerticalSliceModifier.rolloverLineStrokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestrokedasharray) properties.
*   The line selection color can be set via the [VerticalSliceModifier.lineSelectionColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#lineselectioncolor) property.
*   The tooltip can be turned on/off (to have a simple cursor) with the [VerticalSliceModifier.showTooltip:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#showtooltip) property.
*   The tooltip background and text color can be changed with [tooltipColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltipcolor) and [tooltipTextColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiptextcolor) properties, found on [RenderableSeries.rolloverModifierProps:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#rollovermodifierprops) on a per-series basis.
*   Axis labels can be turned on/off via the [VerticalSliceModifier.verticalLine.showLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html#showlabel) property, (where [VerticalSliceModifier.verticalLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#verticalline) is simply a [LineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html)).
*   Axis Label backgrounds and text color can be changed with the properties found on [VerticalSliceModifier.verticalLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#verticalline), such as [](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#axislabelstroke)[axisLabelStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html#axislabelstroke), [](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#axislabelfill)[axisLabelFill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html#axislabelfill).   

Deep Customization of VerticalSliceModifier Tooltips via SVG Templates
----------------------------------------------------------------------

Deeper customisation of the tooltip appearance can be achieved via the [tooltipSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltipsvgtemplate) property.

This defines the actual SVG used to host the tooltip container. This property expects a function in the following format (see [TCursorTooltipSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipsvgtemplate)):


<CodeSnippetBlock labels={["cursotTooltipSvgTemplate function signature"]}>
    ```ts showLineNumbers
    tooltipSvgTemplate: (
        seriesInfos: SeriesInfo[], 
        svgAnnotation: CursorTooltipSvgAnnotation
    ) => string
    ```
</CodeSnippetBlock>

The input/output parameters are:

*   **Input**: an array of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series under the mouse.
*   **Input**: svgAnnotation ([CursorTooltipSvgAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipsvgtemplate)) which is the current tooltip SVG annotation
*   **Output**: string, containing the new SVG to define the tooltip container.

Let's create a simple example which shows you how to customize the tooltip container.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./demo" />