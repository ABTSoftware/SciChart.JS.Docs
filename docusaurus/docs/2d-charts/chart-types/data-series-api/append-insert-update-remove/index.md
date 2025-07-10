---
sidebar_position: 2
---

# Append, Insert, Update, Remove

SciChart.js is designed to be a highly dynamic chart library for frequently updating data. Once you have created a chart with a RenderableSeries / DataSeries pair, you can manipulate the data in any way and the chart will redraw / update.

Data Updates are handled in a reactive way and are 'debounced' so that the chart only draws 1/60th of a second regardless of how many changes to data you make.

The DataSeries Append, Update, Insert, Remove functions
-------------------------------------------------------

Here's an table from the [TypeDoc for XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) showing functions available for updating the data.

|  |  |  |
|--|--|--|
|[append:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#append) | [getNativeYValues:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativeyvalues) | [removeRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removerange)
|[appendMetadata:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendmetadata) | [getWindowedYRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getwindowedyrange) | [setFinalAnimationVectors:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setfinalanimationvectors)
|[appendMetadataRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendmetadatarange) | [getXRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getxrange) | [setInitialAnimationVectors:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setinitialanimationvectors)
|[appendRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendrange) | [getXValues:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getxvalues) | [setMetadata:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setmetadata)
|[clear:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#clear) | [hasMetadataGenerator:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#hasmetadatagenerator) | [setMetadataAt:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setmetadataat)
|[count:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#count) | [insert:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insert) | [setMetadataGenerator:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#setmetadatagenerator)
|[delete:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#delete) | [insertMetadata:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertmetadata) | [toJSON:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#tojson)
|[getIndicesRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getindicesrange) | [insertMetadataRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertmetadatarange) | [update:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#update)
|[getIsDeleted:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getisdeleted) | [insertRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertrange) | [updateAnimationProperties:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#updateanimationproperties)
|[getMetadataAt:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getmetadataat) | [notifyDataChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#notifydatachanged) | [updateXy:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#updatexy)
|[getMetadataLength:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getmetadatalength) | [removeAt:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removeat) | [validateAnimationVectors:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#validateanimationvectors)
|[getNativeIndexes:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativeindexes) | [removeMetadataAt:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removemetadataat) | [validateIndex:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#validateindex)
|[getNativeXValues:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativexvalues) | [removeMetadataRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removemetadatarange) | 

:::note
All chart series updates are done via the DataSeries API using the [append():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#append), [insert():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insert), [update():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#update), [remove():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removeat) functions. There are also variations such as [appendRange():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendrange), [insertRange():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertrange) etc... which accept an array of data.

Note that different dataSeries such as [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html), [XyzDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries.html), [XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) and [OhlcDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcdataseries.html) have slightly different function signatures for append/update functions. Click the links above to the Typedoc for more info.
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
**For the best possible performance, when modifying large datasets**, use the [appendRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#appendrange), [insertRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#insertrange), [removeRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#removerange) functions. These accept an array of values and are considerably faster than appending point-by-point.
:::

:::warning
Failing to call [IDeletable.delete():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html#delete) on a DataSeries when it is no longer needed can result in a memory leak.

To simplify your code, if you do not change DataSeries instances, you can call delete on the parent SciChartSurface once. This will delete all child objects that hold native memory.
:::

Examples of Dynamic Updates
---------------------------

There are a number of worked examples of how to apply dynamic updates to the chart over at the page [DataSeries Realtime Updates](/docs/2d-charts/chart-types/data-series-api/realtime-updates).
