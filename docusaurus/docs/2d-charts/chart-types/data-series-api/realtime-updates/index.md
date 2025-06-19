---
sidebar_position: 4
---

# 🔄 DataSeries Realtime Updates

As previously covered any modification to the DataSeries e.g. via calling [append()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#append), [insert()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insert), [update()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#update), [remove()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removeat) or [clear()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#clear) will trigger a redraw on the chart.

Redraws are throttled so that a redraw only occurs every 1/60th of a second, no matter how often you update data.

Below we're going to talk about the four modes of DataSeries Realtime updates and how to achieve them in SciChart.js.

Appending Data
--------------

Appending data is a dynamic chart scenario where you start off with 0..N X,Y values then append a new batch of X,Y values via [dataSeries.appendRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendRange). With the correct flags on the axis the chart will grow to fit all data. Memory grows until you stop appending or you reset the chart via calling [dataSeries.clear()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#clear).

Here's an example:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./Appending/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./Appending/demo" />

Replacing Data
--------------

Replacing data is a real-time scenario which would allow you to make a spectral-analyzer type chart, where all data is replaced every time the chart is updated.

In SciChart.js, we achieve this by using [dataSeries.clear()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#clear) followed by [dataSeries.appendRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendRange).

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./Replacing/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./Replacing/demo" />

Scrolling Data
--------------

Scrolling data can be achieved by appending then removing data so that a fixed number of points remains in the dataSeries. This can be achieved via [dataSeries.removeRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removeRange) then [dataSeries.appendRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendRange) but also you can use the new fifoCapacity flag available in SciChart.js v3.2.

Below we have an example of each:

### Scrolling using appendRange() removeRange()

Here's an example of how to use [dataSeries.removeRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removeRange) then [dataSeries.appendRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendRange)  to scroll a chart.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./ScrollingAppendRemove/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./ScrollingAppendRemove/demo" />

### Scrolling using fifoCapacity

Since SciChart.js v3.2, we've introduced a much more efficient way to auto-discard old points. By setting **dataSeries.fifoCapacity** = N, when the capacity is exceeded, old points are discarded. FIFO series are a special case and are internally handled as a circular buffer. They cannot be resized.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./ScrollingFifo/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./ScrollingFifo/demo" />

Sweeping Data
-------------

Another mode that we've added in SciChart.js v3.2, and the last real-time update mode is Fifo Sweeping.

With **dataSeries.fifoCapacity** set, also setting **dataSeries.fifoSweeping** = true, setting an optional **dataSeries.fifoSweepingGap** and having the correct type of xAxis or modulation of x-data, you can achieve allowing the chart to wrap-around once the trace reaches the right edge of the viewport.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./SweepingFifo/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output

<LiveDocSnippet maxWidth={"100%"} name="./SweepingFifo/demo" />

Note: Sweeping requires a few special conditions. **fifoCapacity** must be set and **fifoSweeping** = true. Next, you must either use a **CategoryAxis** on the xAxis, or, modulate your data.

You can use **NumericAxis** but you must modulate your data. X must range from 0...fifoCapacity. In the example above we set **xValue\[i\] = i % fifoCapacity**

See a worked example at the [ECG/Vital Signs monitor demo](https://demo.scichart.com/javascript-vital-signs-ecg-medical-chart-example).
