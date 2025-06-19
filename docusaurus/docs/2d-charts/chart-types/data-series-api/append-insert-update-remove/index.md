---
sidebar_position: 2
---

# 🔄 Append, Insert, Update, Remove

SciChart.js is designed to be a highly dynamic chart library for frequently updating data. Once you have created a chart with a RenderableSeries / DataSeries pair, you can manipulate the data in any way and the chart will redraw / update.

Data Updates are handled in a reactive way and are 'debounced' so that the chart only draws 1/60th of a second regardless of how many changes to data you make.

The DataSeries Append, Update, Insert, Remove functions
-------------------------------------------------------

Here's an table from the [TypeDoc for XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) showing functions available for updating the data.

|  |  |  |
|--|--|--|
|[append](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#append) | [getNativeYValues](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativeyvalues) | [removeRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removerange)
|[appendMetadata](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendmetadata) | [getWindowedYRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getwindowedyrange) | [setFinalAnimationVectors](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setfinalanimationvectors)
|[appendMetadataRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendmetadatarange) | [getXRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getxrange) | [setInitialAnimationVectors](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setinitialanimationvectors)
|[appendRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendrange) | [getXValues](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getxvalues) | [setMetadata](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setmetadata)
|[clear](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#clear) | [hasMetadataGenerator](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#hasmetadatagenerator) | [setMetadataAt](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setmetadataat)
|[count](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#count) | [insert](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insert) | [setMetadataGenerator](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setmetadatagenerator)
|[delete](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#delete) | [insertMetadata](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertmetadata) | [toJSON](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#tojson)
|[getIndicesRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getindicesrange) | [insertMetadataRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertmetadatarange) | [update](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#update)
|[getIsDeleted](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getisdeleted) | [insertRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertrange) | [updateAnimationProperties](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#updateanimationproperties)
|[getMetadataAt](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getmetadataat) | [notifyDataChanged](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#notifydatachanged) | [updateXy](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#updatexy)
|[getMetadataLength](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getmetadatalength) | [removeAt](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removeat) | [validateAnimationVectors](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#validateanimationvectors)
|[getNativeIndexes](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativeindexes) | [removeMetadataAt](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removemetadataat) | [validateIndex](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#validateindex)
|[getNativeXValues](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativexvalues) | [removeMetadataRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removemetadatarange) | 

:::note
All chart series updates are done via the DataSeries API using the [append()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#append), [insert()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insert), [update()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#update), [remove()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removeat) functions. There are also variations such as [appendRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendrange), [insertRange()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertrange) etc... which accept an array of data.

Note that different dataSeries such as [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html), [XyzDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries.html), [XyyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) and [OhlcDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcdataseries.html) have slightly different function signatures for append/update functions. Click the links above to the Typedoc for more info.
:::

Here are some common operations:

```ts
// Append, Update, Insert, Remove

const xyDataSeries = new XyDataSeries(wasmContext);
xyDataSeries.append(1, 10); // Appends X=1, Y=10
xyDataSeries.append(2, 20); // Appends X=2, Y=20
xyDataSeries.appendRange([3, 4, 5], [30, 40, 50]); // Appends X=3,4,5 and Y=30,40,50
xyDataSeries.removeAt(0); // removes the 0th xy point
xyDataSeries.removeRange(0, 2); // Removes 2 points from index 0 onwards
xyDataSeries.insert(0, 100, 200); // Inserts X=100, Y=200 at index 0
//xyDataSeries.insertRange(...)
xyDataSeries.update(0, 22); // Updates the Y-value at index 0
xyDataSeries.clear(); // Clears the dataseries. NOTE: Does not free memory
xyDataSeries.delete(); // Deletes WebAssembly memory. The series is no longer usable.
```

:::note
**For the best possible performance, when modifying large datasets**, use the [appendRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendrange), [insertRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertrange), [removeRange](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removerange) functions. These accept an array of values and are considerably faster than appending point-by-point.
:::

:::warning
Failing to call [IDeletable.delete()](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html#delete) on a DataSeries when it is no longer needed can result in a memory leak.

To simplify your code, if you do not change DataSeries instances, you can call delete on the parent SciChartSurface once. This will delete all child objects that hold native memory.
:::

Examples of Dynamic Updates
---------------------------

There are a number of worked examples of how to apply dynamic updates to the chart over at the page [DataSeries Realtime Updates](DataSeries_RealtimeUpdates.html).
