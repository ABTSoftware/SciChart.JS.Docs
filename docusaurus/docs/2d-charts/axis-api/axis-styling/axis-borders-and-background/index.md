---
sidebar_position: 2
---

# Axis Borders and Background

In SciChart.js we have properties to let you style the axis border and background. This is the line between the axis and the main SciChartSurface and the background area of the axis itself.

To style the axis border and background, use this code.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Basic/demo.ts start=region_B_start end=region_B_end

    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" />

_**Note:** All colors in SciChart.js are strings, which are HTML color codes. Supported values are 6-digit hex codes e.g. "#ADFF2F", 8-digit hex codes in RGBA format where the last two digits are opacity e.g. "#AAFF2F33" and rgba CSS color codes e.g. "rgba(173, 255, 47, 0.3)" as well as "Red" or "White"_

The Axis Background
-------------------

The background of the axis can also be set to a solid color using the [AxisBase2D.backgroundColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#backgroundcolor) property. This supports an HTML color code as above.

The TBorderType
---------------

Axis Borders can be set on the Left, Right, Bottom or Top of the Axis. The thickness of the border can be set individually on each side of the axis. For more information, see the [AxisBase2D.axisBorder:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#axisborder) property, which is type [TBorder:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tborder).
