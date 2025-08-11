---
sidebar_position: 4
---

# PolarPanModifier

The [PolarPanModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html) is a modifier that allows users to pan (drag) the polar chart. This modifier is useful for enhancing the user experience by providing an intuitive way to navigate through the chart data.

:::tip
You can set the [primaryPanMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html#primarypanmode) to `EPolarPanModifierPanMode.Cartesian` to pan the chart in Cartesian coordinates, or keep it to either `EPolarPanModifierPanMode.PolarStartAngle` or `EPolarPanModifierPanMode.PolarVisibleRange` to pan the chart in polar coordinates.
:::

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {6} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
    ```ts {24} showLineNumbers file=./demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

This results in the following behavior:

<LiveDocSnippet name="./demo" />

#### See Also:

* [What is the ChartModifier API?](/2d-charts/chart-modifier-api/chart-modifier-api-overview)