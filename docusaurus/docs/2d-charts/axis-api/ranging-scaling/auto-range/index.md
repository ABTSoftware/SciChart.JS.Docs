---
sidebar_position: 1
---

# Axis Ranging - AutoRange

At the outset, the [Axis.visibleRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerange) is adjusted to be equal to the data range of an axis. However, an axis won't adjust its VisibleRange automatically when data changes, unless it is configured to do this. The default behavior can be changed using different [AutoRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#autorange) modes.

AutoRange Once
--------------

This is the **default setting**. The axis will attempt to autorange once to fit the data as you start the chart. This is an one-time action - the VisibleRange won't adjust to any data changes in future.

Note: Specifying [axis.visibleRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerange) at startup will set that as the first default range. AutoRange.Once is ignored when a visibleRange is set

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./Once/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Once/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet name="./Once/demo" />

AutoRange Always
----------------

In this mode, the axis will attempt to autorange always to fit the data every time the chart is drawn. The **VisibleRange** **will adjust** to data changes correspondingly.

Please be aware that this **setting will override any other ranging**, including zooming and panning by modifiers, but is useful in situations where you always want to view the extents of the data.

To combine AutoRanging and user-zooming you need to use **ZoomState** - a special technique we will talk about later.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./Always/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Always/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet name="./Always/demo" />

AutoRange Never
---------------

The **axis will never autorange**. With this option, you would need to set the VisibleRange manually. The **VisibleRange** **won't adjust** to any data changes.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./Never/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Never/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet name="./Never/demo" />

Adding Padding or Spacing with GrowBy
-------------------------------------

Also, it is possible to **add spacing** or padding to the visibleRange when the chart autoranges via the [GrowBy:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#growby) property. It allows to specify two fractions which will be always applied to the Min, Max values of visibleRange :

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./GrowBy/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./GrowBy/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet name="./GrowBy/demo" />

Programmatically Ranging an Axis
-------------------------------

See the section on [Setting and Getting VisibleRange](/2d-charts/axis-api/ranging-scaling/set-range-zoom-to-fit) for more details.
