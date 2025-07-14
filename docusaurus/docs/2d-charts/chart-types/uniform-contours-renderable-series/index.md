---
sidebar_position: 18
---

# The Contours Series Type

Contour maps or Contour-plots can be created using the [UniformContoursRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformcontoursrenderableseries.html) type.

:::tip
The [JavaScript Heatmap Chart Example](https://scichart.com/demo/javascript/heatmap-chart) can be found in the [SciChart.Js Examples Suite > Contours Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/ContoursChart) on Github, or our live demo at [demo.scichart.com](https://scichart.com/demo/javascript/heatmap-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/heatmap-chart-with-contours"
    title="Uniform Contours Series Chart"
/>

## Create a Contours Plot

SciChart's Contour series is an extremely fast, lightweight chart types for rendering two dimensional data as a contour plot. The [UniformContoursRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformcontoursrenderableseries.html) type should be used in conjunction with a [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html) when you simply want to specify a Step in the X,Y direction (each cell is the same size).

To create a [Javascript Contours Chart](https://scichart.com/demo/javascript-heatmap-chart-with-contours) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {20-22,26,29,40-45} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {5-7,16-30} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

In the code above:

*   We create an empty 2D array `number[][]` using the helper function `zeroArray2D`. This is filled with values in the generateData function
*   A [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html) instance is created with `xStart`, `xStep`, `yStart`, `yStep` values = `0`, `1`, `0`, `1`. This means the heatmap starts at `(X, Y)` = `(0, 0)` and each cell is `1` on the axis.
*   We set the contour `stroke` and `strokeThickness`.
*   A [UniformContoursRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformcontoursrenderableseries.html) instance is created and added to the [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

## Updating Data in a Contour map

The contour map is supposed to be fully dynamic, enabling real-time graphics. The [Contours Series:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformcontoursrenderableseries.html) however does not support append, insert, update, remove functions like other DataSeries do. You can however update the data and force a refresh simply by updating the data passed in. To do this, use the following code:

```ts {19-20,23-24} showLineNumbers
import { UniformHeatmapDataSeries, zeroArray2D  } from "scichart";

const height = 10; // Set the height of the heatmap
const width = 20; // Set the width of the heatmap

// Create an empty 2D array of size height & width
const initialZValues: number[][] = zeroArray2D([height, width]);
// Create a Heatmap Data-series. Pass the heatValues as a number[][] to the UniformHeatmapDataSeries
const heatmapDataSeries = new UniformHeatmapDataSeries({
    xStart: 0,
    xStep: 1,
    yStart: 0,
    yStep: 1,
    zValues: initialZValues
});
 
// ...
// Later, update the data
initialZValues[5][6] = 123.4;
heatmapDataSeries.notifyDataChanged() // Notify SciChart that the data has changed

// You can also load an entirely new array with the function UniformHeatmapDataSeries.setZValues
const newZValues; // type number[][]
heatmapDataSeries.setZValues(newZValues);
```

For more details, including a live example of how to update 2D array data for heatmaps and contours, see the [Uniform Heatmap documentation - Updating Heatmaps](/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime) documentation page. The mechanism for contour plots is the same.

#### See Also

* [The Uniform Heatmap Chart Type](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type)
* [The Non-Uniform Heatmap Chart Type](/2d-charts/chart-types/non-uniform-heatmap-renderable-series)