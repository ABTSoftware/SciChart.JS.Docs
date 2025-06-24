---
sidebar_position: 1
---

# ✅ PolarArcZoomModifier

The [PolarArcZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararczoommodifier.html) is a modifier that allows users to zoom in on a specific arc of a polar chart. It provides a visual feedback mechanism for selecting the area to zoom in on, enhancing the user experience by allowing for focused analysis of specific data ranges.

## Adding a PolarArcZoomModifier to a Chart

A [PolarArcZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararczoommodifier.html) can be added to the `sciChartSurface.chartModifiers` collection to enable zoom to fit behavior using a user-drawn arc selection. It is the polar counterpart of the [XyRubberBandZoomModifier](../../zooming-and-panning/rubber-band-xy-zoom-modifier/) - used on the Cartesian 2D charts.

For example:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {9} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
    ```ts {42} showLineNumbers file=./demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

This results in the following behavior:

<LiveDocSnippet name="./demo" />

#### See Also:

* [What is the ChartModifier API?](../../chart-modifier-api-overview/)
* [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html)