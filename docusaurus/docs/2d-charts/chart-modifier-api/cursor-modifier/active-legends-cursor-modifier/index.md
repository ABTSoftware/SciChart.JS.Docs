---
sidebar_position: 3
---

# ✅ Active Legends - CursorModifier output into a legend

:::tip
Background reading:

If you haven't already, read the article [The CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) type which will show you how to setup a [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) with default options for tooltips. This article goes into further detail on customising the tooltip items (formatting, text content).
:::

CursorModifier tooltipLegendTemplates
-------------------------------------

The [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) supports a tooltipLegendTemplate property which allows you to specify a function to transform CursorModifier content into a legend which can be placed in the top left of the chart. This active legend updates with series values as you move the mouse.

Perhaps the best example of this is in financial charts, which require placing a legend in the top left of the chart to show the current hovered candle or series.

Here's a worked example below, which extends our [Candlestick Chart - Volume Bars](/docs/2d-charts/chart-types/fast-candlestick-renderable-series) example with an active legend provided by [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html).

<CodeSnippetBlock labels={["TS"]}>
    ```ts {7} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./demo" />

Using External placementDivId with the CursorModifier
-----------------------------------------------------

Another way you can control the placement of the [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) tooltip is using the [placementDivId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#placementdivid) property. This places the standard CursorModifier tooltip into a div of your choice (which can be anywhere on the app).

Note, it does not currently work with [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltiplegendtemplate), however we are working on more options for styling, placement and configuration of tooltips soon.

Try the following code in your application:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {4} showLineNumbers file=./external-placement/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

<CodeSnippetBlock labels={["html"]}>
    ```html {4} showLineNumbers file=./external-placement/demo.html
    ```
</CodeSnippetBlock>

<CodeSnippetBlock labels={["css"]}>
    ```css {4} showLineNumbers file=./external-placement/demo.css
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./external-placement/demo" htmlPath="./external-placement/demo.html" cssPath="./external-placement/demo.css" />

#### See Also

* [Formatting CursorModifier Tooltip Items](/docs/2d-charts/chart-modifier-api/cursor-modifier/formatting-cursor-modifier-tooltip-items)
* [Customizing the CursorModifier Tooltip Container Appearance](/docs/2d-charts/chart-modifier-api/cursor-modifier/customizing-cursor-modifier-tooltip-container-appearance)