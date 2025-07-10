---
sidebar_position: 3
---

# Axis Ranging - How to Listen to VisibleRange Changes

How to listen to VisibleRange changes
-------------------------------------

It is possible to subscribe to listening to the [AxisCore.visibleRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerange) changes using the [AxisCore.visibleRangeChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerangechanged) event.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./VisibleRangeChanged/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./VisibleRangeChanged/builderDemo.js start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./VisibleRangeChanged/demo" cssPath="./VisibleRangeChanged/demo.css" />

The most typical use for this callback is to perform some kind of operation when the [AxisCore.visibleRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerange) changes, such as updating UI.

It is also possible to use this callback to restrict the VisibleRange in some way, e.g set a bounded or clipped range onto [AxisCore.visibleRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerange) when the range changes outside of a desired area.
