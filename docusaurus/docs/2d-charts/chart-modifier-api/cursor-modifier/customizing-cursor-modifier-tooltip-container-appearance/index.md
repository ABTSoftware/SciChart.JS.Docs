---
sidebar_position: 4
---

# Customizing the CursorModifier Tooltip Container Appearance

:::tip
Background reading:

If you haven't already, read the article [The CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) type which will show you how to setup a CursorModifier with default options for tooltips. This article goes into further detail on customising the tooltip items (formatting, text content)
:::

Basic customisation of the cursor and tooltip appearance can be made through the following properties.

*   The crosshair line thickness and stroke color can be changed with the [crosshairStrokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#crosshairstrokethickness) and [crosshairStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#crosshairstroke) properties.
*   Axis labels can be turned on/off via the [showAxisLabels:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#showaxislabels) property.
*   The tooltip can be turned on/off (to have a simple cursor) with the [showTooltip:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#showtooltip) property.
*   Axis Label backgrounds and text color can be changed with the [axisLabelStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#axislabelstroke), [axisLabelFill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#axislabelfill) properties.
*   The tooltip background and text color can be changed with the [tooltipContainerBackground:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltipcontainerbackground) and [tooltipTextStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltiptextstroke) properties.

Deeper customisation of the tooltip appearance can be achieved via the [tooltipSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltipsvgtemplate) property.

This defines the actual SVG used to host the tooltip container. This property expects a function in the following format (see [TCursorTooltipSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipsvgtemplate)):


<CodeSnippetBlock labels={["cursorTooltipSvgTemplate function signature"]}>
    ```ts showLineNumbers
    cursorTooltipSvgTemplate: (
        seriesInfos: SeriesInfo[], 
        svgAnnotation: CursorTooltipSvgAnnotation
    ) => string
    ```
</CodeSnippetBlock>

Where:

The input/output parameters are:

*   **Input**: an array of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series under the mouse.
*   **Input**: svgAnnotation ([CursorTooltipSvgAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipsvgtemplate)) which is the current tooltip SVG annotation
*   **Output**: string, containing the new SVG to define the tooltip container.

Let's create a simple example which shows you how to customize the tooltip container.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {1,29} showLineNumbers file=./svg-template.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./svg-template" />