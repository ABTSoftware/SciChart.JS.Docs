---
sidebar_position: 3
---

# 🔄 DataSeries Get Set value at Index

Memory in SciChart.js is stored in WebAssembly (Wasm) buffers via the type **SCRTDoubleVector**. It cannot be treated like a JavaScript array, however it is possible to bulk write/read to these arrays or to get/set at index.

You can access values on a DataSeries by getting the internal WebAssembly native arrays via [getNativeXValues()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativexvalues) and [getNativeYValues()](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getnativeyvalues). These return **SCRTDoubleVector** - a webassembly buffer type which stores underlying data as Float64 array.

```ts
// Accessing Values from DataSeries

const xyDataSeries = new XyDataSeries(wasmContext);
xyDataSeries.appendRange([1,2,3], [10,20,30]);
const xValues = xyDataSeries.getNativeXValues();
const yValues = xyDataSeries.getNativeYValues();
for(let i = 0; i < xyDataSeries.count(); i++) {
    console.log(`index=${i}, xy = ${xValues.get(i)}, ${yValues.get(i)}`);
}

// Will output to console
// index=0, xy=1, 10
// index=1, xy=2, 20
// index=2, xy=3, 30
```
:::note
point by point access to the DataSeries native values is slow when you're dealing with millions of points._
:::

Examples of Dynamic Updates
---------------------------

There are a number of worked examples of how to apply dynamic updates to the chart over at the page [DataSeries Realtime Updates](/docs/2d-charts/chart-types/data-series-api/realtime-updates/index.md).
