---
sidebar_position: 1
---

# The CursorModifier Type

SciChart.js provides a cursors / crosshairs behavior via the [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html), available out of the box. Besides common features which are inherited from the [ChartModifierBase](/2d-charts/chart-modifier-api/common-features/) class, the [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) allows to you to:

*   **Place a crosshair (cursor) on the chart which tracks the mouse**
*   **Place a single aggregated tooltip for all series at the crosshair site**
*   Optionally show/hide and style vertical/horizontal line in the crosshair
*   Optionally show/hide axis labels on the X,Y axis
*   Format the axis labels
*   Allow customisation of the tooltip style and contents
*   Place a legend at an external `<div>` with tooltip info
*   Configure when the tooltip is shown (always, only on hover of a point)
*   Configure which series react to the Tooltip (all, some, or specific series)

The [Using CursorModifier Example](https://scichart.com/demo/javascript-chart-cursormodifier-crosshairs) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://scichart.com/demo/javascript-line-chart)

Adding a CursorModifier to a Chart
----------------------------------

A CursorModifier can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable crosshair/cursor behavior. For example, this code adds a crosshair, enables default tooltips and axis labels.
 
<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {38,55} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet name="./demo" />

Many of the properties here are optional - they have been included to show the configuration possibilities for the cursor. See [ICursorModifierOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/icursormodifieroptions.html) for more.

#### See Also

* [Formatting CursorModifier Tooltip Items](/2d-charts/chart-modifier-api/cursor-modifier/formatting-cursor-modifier-tooltip-items)
* [Customizing the CursorModifier Tooltip Container Appearance](/2d-charts/chart-modifier-api/cursor-modifier/customizing-cursor-modifier-tooltip-container-appearance)