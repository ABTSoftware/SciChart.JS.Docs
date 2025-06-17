---
sidebar_position: 2
---

# ✅ Updating (Realtime) Heatmaps

The heatmap is supposed to be fully dynamic, enabling real-time graphics. The [UniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmaprenderableseries.html) however does not support append, insert, update, remove functions like other DataSeries do.

You can however update the data and force a refresh simply by updating the data passed in by calling [heatmapDataSeries.setZValues():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html#setzvalues) with a new 2-dimensional array, or by modifying part of the existing the 2d array and calling [heatmapDataSeries.notifyDataChanged():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html#notifydatachanged).

Update part of a heatmap:

<CodeSnippetBlock labels={["TS"]}>
```ts {13-14,17-18} showLineNumbers 
// Create an empty 2D array of size height & width
const initialZValues = zeroArray2D([height, width]);
// Create a Heatmap Data-series. Pass the heatValues as a number[][] to the UniformHeatmapDataSeries
const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
    xStart: 100,
    xStep: 1,
    yStart: 100,
    yStep: 1,
    zValues: initialZValues
});
// ...
// Later, update the data
initialZValues[5][6] = 123.4;
heatmapDataSeries.notifyDataChanged(); // Tell SciChart the data has changed

// You can also load an entirely new array with the function UniformHeatmapDataSeries.setZValues
const newZValues // type number[][]
heatmapDataSeries.setZValues(newZValues);
```
</CodeSnippetBlock>

Here's a full working example below:

<LiveDocSnippet name="./demo" />

The full source-code for that example can be found below:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {19-22,25,88} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

### Updating the XStep, XStart, YStep, YStart or changing the size of heatmap

:::tip
At the time of writing we have no way to update the xStep, xStart, yStep, yStart properties of a UniformHeatmapDataSeries once it has been created, but a [workaround was posted at the SciChart Forum](https://www.scichart.com/questions/js/how-to-change-the-startx-on-a-uniformheatmapdataseries).
:::