---
sidebar_position: 4
---

# Central Axis Layout

Placing Axis in the center the chart, like an oscilloscope or spectrum analyzer is possible with SciChart.js.

To do this, use the [CentralAxesLayoutManager](https://scichart.com/documentation/js/current/typedoc/classes/centralaxeslayoutmanager.html) applied to the [SciChartSurface.LayoutManager](https://scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#layoutmanager) property.

Here's a code sample:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Basic/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" />

Configure the Position of Central Axis
--------------------------------------

[CentralAxesLayoutManager](https://scichart.com/documentation/js/current/typedoc/classes/centralaxeslayoutmanager.html) has some options you can use to configure the position of the horizontal and vertical axes.

The following code places an YAxis inside the chart at X=3 and an XAxis inside the chart at Y=100 pixels.

:::tip
Options available in the [EInnerAxisPlacementCoordinateMode](https://scichart.com/documentation/js/current/typedoc/enums/einneraxisplacementcoordinatemode.html) enum include: DataValue, Pixel, or Relative, which allows placement of an axis at a fraction of the viewport from 0..1.
:::

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./Configuration/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Configuration/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./Configuration/demo" />
