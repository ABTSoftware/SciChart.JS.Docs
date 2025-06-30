---
sidebar_position: 1
---

# ✅ The VerticalSliceModifier Type

With the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html), SciChart.js provides the ability to place multiple vertical lines on the chart, which can show tooltips intersecting chart series.

This provides a similar behaviour to the [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier), except instead of a single vertical line plus tooltips which track the mouse, you can place multiple draggable vertical lines on the chart, which intersect line series and display tooltips.

The [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) allows you to:

*   Place one or more vertical lines on the chart at data-values, relative coordinates or pixel coordinates
*   Vertical lines intersect chart series
*   Tooltips may be displayed at the intersections
*   Optionally show/hide or customize the tooltip content
*   Vertical lines may be dragged or edited
*   Vertical lines may be removed from the chart.

The [Using VerticalSliceModifier Example](https://demo.scichart.com/javascript/chart-vertical-slice-modifier) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-line-chart)

Adding a VerticalSliceModifier to a Chart
-----------------------------------------

One or more [VerticalSliceModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable draggable lines with crosshair/cursor behavior. For example, this code adds a crosshair, enables default tooltips and allows dragging of the vertical lines.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {17,29} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,24} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet name="./demo" />

Many of the properties here are optional - they have been included to show the configuration possibilities for the cursor. See [IVerticalSliceOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iverticalsliceoptions.html) for more.

Removing a VerticalSliceModifier from the Chart
-----------------------------------------------

```ts showLineNumbers
sciChartSurface.chartModifiers.remove(vSlice);
```

Styling & Visibility of VerticalSliceModifier Elements
------------------------------------------------------

The following elements can be turned on or off when using the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html).


<CodeSnippetBlock labels={["VerticalSliceModifier visibility"]}>
    ```ts showLineNumbers
    verticalSliceModifier.showTooltip = true; // Show or hide the tooltip
    verticalSliceModifier.showRolloverLine = true; // Show or hide the vertical line
    verticalSliceModifier.verticalLine.showLabel = true; // Show or hide the X-Axis label
    ```
</CodeSnippetBlock>

In addition, the line may be made editable (draggable) by setting the [isDraggable:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#isdraggable) property


<CodeSnippetBlock labels={["VerticalSliceModifier editing"]}>
    ```ts showLineNumbers
    verticalSliceModifier.isDraggable = true; // Enable or disable dragging of the line
    ```
</CodeSnippetBlock>

The line colour, dash pattern, strokethickness and selection color of the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) can also be set. e.g.


| **Property** | **Description** |
|--------------|-----------------|
| [VerticalSliceModifier.rolloverLineStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestroke) | Sets the colour of the rollover line as an HTML colour code |
| [VerticalSliceModifier.rolloverLineStrokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestrokedasharray) | Sets the dash pattern (see [Dash Line Styling](/docs/2d-charts/styling-and-theming/dash-line-patterns) for guidelines) |
| [VerticalSliceModifier.rolloverLineStrokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestrokethickness) | Sets the rollover line thickness |

<CodeSnippetBlock labels={["VerticalSliceModifier styling"]}>
    ```ts
    verticalSliceModifier.rolloverLineStrokeThickness = 1; // Sets the line thickness
    verticalSliceModifier.rolloverLineStroke = "Orange"; // Sets the line colour
    verticalSliceModifier.lineSelectionColor = "Red"; // Change the highlight color when selected
    ```
</CodeSnippetBlock>

Properties of the tooltip can be controlled on a per-series basis as per the [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier) via the [RenderableSeries.rolloverModifierProps:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html) property

| **Property** | **Description** |
|--------------|-----------------|
| [series.rolloverModifierProps.tooltipTextColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiptextcolor) | The text foreground color of the tooltip, on a per-series basis |
| [series.rolloverModifierProps.tooltipColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltipcolor) | The tooltip container color on a per-series basis |
| [series.rolloverModifierProps.tooltipLabelX:blue_book:](https://www.scichart.com/documentation/js/curre§§nt/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabelx) | Prefix label in the tooltip for X values. Defaults to 'X: ' |
| [series.rolloverModifierProps.tooltipLabelY:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabely) | Prefix label in the tooltip for Y values. Defaults to 'Y: ' |


<CodeSnippetBlock labels={["VerticalSliceModifier Tooltip styling"]}>
    ```ts showLineNumbers
    // On a per series basis, you can control the tooltip background/foreground
    series.rolloverModifierProps.tooltipTextColor = "White";
    series.rolloverModifierProps.tooltipColor = "Red";
    series.rolloverModifierProps.tooltipLabelX = "X Value:";
    series.rolloverModifierProps.tooltipLabelY = "Y Value:";
    ```
</CodeSnippetBlock>

Finally, the vertical line itself is simply a [LineAnnotation](/docs/2d-charts/annotations-api/line-annotation) so all the properties there may be accessed via the [verticalSliceModifier.verticalLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#verticalline) property after instantiation.

<CodeSnippetBlock labels={["VerticalSliceModifier.verticalLine Styling"]}>
    ```ts
    // Add some vertical slices to the chart
    const vSlice1 = new VerticalSliceModifier({
        // options ...
    });
    vSlice1.verticalLine.showLabel = true; // Show axis label
    vSlice1.verticalLine.axisLabelFill = "#FF6600"; // Style axis label outline and font
    vSlice1.verticalLine.axisLabelStroke = "White";
    ```
</CodeSnippetBlock>

#### See Also

* [Formatting VerticalSlice Tooltip Items](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/formatting-vertical-slice-tooltip-items)