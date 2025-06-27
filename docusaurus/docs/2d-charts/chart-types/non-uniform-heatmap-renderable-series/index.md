---
sidebar_position: 17
---

# ✅ The Non-Uniform Heatmap Chart Type

A complementary type to the Uniform Heatmap is the Non-Uniform Heatmap, new to SciChart.js v2.3.

Non-Uniform Heatmaps can be created using the [NonUniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmaprenderableseries.html) type.

:::tip
The [JavaScript Non-Uniform Heatmap Chart Example](https://demo.scichart.com/javascript-non-uniform-heatmap-chart) can be found in the [SciChart.Js Examples Suite > Non-Uniform Heatmap Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/NonUniformHeatmapChart) on Github
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/non-uniform-heatmap-chart"
    title="Digital Mountain Series Chart"
/>

## Create a Non-Uniform Heatmap

Non-Uniform heatmaps are a variation on Uniform heatmaps, where you can specify independent sizes for heatmap rows and columns.

The cell sizes are specified either by an array of X,Y cell coordinates or a mapping function passed to the constructor options of [NonUniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmapdataseries.html).

For example, you can create a Non-uniform Heatmap with the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {29,31-36,40-52,56} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {8,10-22,28-32} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

**Above:** The Non-Uniform Heatmap allows you to have uneven sizes for columns & rows in a javascript heatmap. In the case where you have equal cell sizes, use the [Uniform Heatmap](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type) for faster performance.

In the code above:

*   We create a 2D array (type `number[][]`). This is filled with heat values of the heatmap.
*   A [NonUniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmapdataseries.html) instance is created with `xCellOffsets = []` and `yCellOffsets = []`. This defines the position of the heatmap in X,Y space as well as the position of each column/row.
*   We set the Colormap, which maps colors to heat values in the dataseries.
*   [NonUniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmaprenderableseries.html) instance is created with [INonUniformHeatmapRenderableSeriesOptions.dataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/inonuniformheatmaprenderableseriesoptions.html#dataseries) and [INonUniformHeatmapRenderableSeriesOptions.colorMap:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/inonuniformheatmaprenderableseriesoptions.html#colormap) options and added to the [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   Alternatively we can assign a [NonUniformHeatmapRenderableSeries.dataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmaprenderableseries.html#dataseries) property separately.

### Updating Heatmap Values

The [Uniform Heatmap documentation - Updating Heatmaps](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime) shows how you can update a heatmap dynamically, by using the [setZValues():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmapdataseries.html#setzvalues) function. The mechanism for the Non-uniform heatmap is the same.

### Heatmap Color Maps 

The [Uniform Heatmap documentation - ColorMaps and Legends](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type) shows how you can modify a heatmaps color mapping, which maps zValues to cell colors, by using the [colorMap:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmaprenderableseries.html#colormap) property. The mechanism for the Non-uniform heatmap is the same.

### Adding Text in Cell to a Non-Uniform Heatmap

The [Uniform Heatmap documentation](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type) shows how you can add text-in cell to a heatmap via the [dataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmaprenderableseries.html#dataLabelProvider) property. The mechanism for the Non-uniform heatmap is the same.

### Adding a Heatmap Legend to a Non-Uniform Heatmap

The [Uniform Heatmap documentation - ColorMaps and Legends](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type) shows how you can a [HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html) with colorMap to the heatmap chart. The mechanism for the Non-uniform heatmap is the same. 

## Defining the x,y cell positions

As well as passing an array of x/yCellOffsets as a mapping function, it is possible to pass just arrays via  [INonUniformHeatmapSeriesOptions.xCellOffsets:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/inonuniformheatmapseriesoptions.html#xcelloffsets) and [INonUniformHeatmapSeriesOptions.yCellOffsets:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/inonuniformheatmapseriesoptions.html#ycelloffsets).

The function should generate cell offsets based on the index. This feature is useful when dataSeries are updated dynamically with [NonUniformHeatmapDataSeries.setZValues:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/nonuniformheatmapdataseries.html#setZValues), which will trigger recalculation of the offsets.

### Both the following two code examples are valid:

```ts {7-8} showLineNumbers
// Passing just cell Offset Arrays
const xRangeOffsetsSource = [0, 10, 20, 26, 36, 60, 72, 84];
const yRangeOffsetsSource = [100, 250, 390, 410, 600]; 

const dataSeries = new NonUniformHeatmapDataSeries(wasmContext, {
    zValues,
    xCellOffsets: xRangeOffsetsSource,
    yCellOffsets: yRangeOffsetsSource
});
```

as well as this:

```ts {7-8} showLineNumbers
// Passing just cell Offset Arrays
const xRangeOffsetsSource = [0, 10, 20, 26, 36, 60, 72, 84];
const yRangeOffsetsSource = [100, 250, 390, 410, 600]; 

const dataSeries = new NonUniformHeatmapDataSeries(wasmContext, {
    zValues,
    xCellOffsets: i => xRangeOffsetsSource[i],
    yCellOffsets: i => yRangeOffsetsSource[i]
});
```

#### See Also

* [The Uniform Heatmap Chart Type](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type)