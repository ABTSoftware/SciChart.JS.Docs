---
sidebar_position: 3
title: "Accessing DataSeries xValues, yValues and count"
---

# Accessing DataSeries xValues, yValues and count (size)

## How to access DataSeries xValues, yValues

You can access `xValues`, `yValues` on a `DataSeries` by getting the internal WebAssembly native arrays via [dataSeries.getNativeXValues():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#getnativexvalues) and [dataSeries.getNativeYValues():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#getnativeyvalues) functions.

These functions return the x & y values as `SCRTDoubleVector`: a webassembly buffer type which stores underlying data as `Float64` array in the wasm heap.

```ts
// Accessing X, Y Values from DataSeries
//
const xyDataSeries = new XyDataSeries(wasmContext);
xyDataSeries.appendRange([1,2,3], [10,20,30]);

// Get xValues from the dataSeries
const xValues = xyDataSeries.getNativeXValues();
// Get yValues from the dataSeries
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
Accessing dataSeries xValues, yValues can be done via the `getNativeXValues()`, `getNativeYValues()` functions.
These return an `SCRTDoubleVector` type which allows you to get a value at index via `dataSeries.getNativeXValues().get(i)`.

point by point access to the DataSeries via this method is slow when you're dealing with millions of points.
If you need to do bulk operations, its better to read the entire vector out to JavaScript array first ([see how](#converting-the-dataseries-xvalues-yvalues-scrtdoublevector-to-javascript-arrays))
:::


### What is the SCRTDoubleVector type returned by getNativeXValues()?

[dataSeries.getNativeXValues():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#getnativexvalues) and [dataSeries.getNativeYValues():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#getnativeyvalues) allow you to access the dataSeries xValues, yValues.

These both return type `SCRTDoubleVector`. This is a type declared in webassembly which maps to a `Float64` array on the wasm heap.

The example above shows how you can access data point by point using the `SCRTDoubleVector.get(i)` function:

```ts
export declare class SCRTDoubleVector {
    push_back(_dNewValue: number): void;
    resize(_iNewSize: number, _dInitialValue: number): void;
    resizeFast(_iNewSize: number): void;
    reserve(_iCount: number): void;
    clear(): void;
    size(): number;
    capacity(): number;
    get(_iIndex: number): number; // Access value at index (i)
    set(_iIndex: number, _dValue: number): void;
    insertAt(_iIndex: number, _dValue: number): void;
    removeAt(_iIndex: number): void;
    removeRange(_iIndex: number, _iCount: number): void;
    dataPtr(_iOffset: number): number; // returns a pointer to the wasm heap for this vector
    delete(): void;
}
```

:::warning
The above type declaration for `SCRTDoubleVector` is included for information purposes only.

It's not recommended to use `SCRTDoubleVector.push_back`, `resize`, `clear`, `insertAt`, `removeAt` or `delete`.
Instead, use the `append` `update` `insert` `remove` `clear` and `delete` functions directly on [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) and related dataSeries types,
as this will manage internal state as well as memory.
:::

## Accessing DataSeries Count (length) and Capacity

The length, size or count or a `dataSeries` can be accessed via its `count()` function. Here is an example:

```ts
const count = 1_000_000;
const xValues: number[] = Array.from(Array(count).keys());
const yValues: number[] = Array.from(Array(count).keys());

const series = new XyDataSeries(webAssemblyContext, {
    xValues,
    yValues
});
console.log(`dataSeries count: ${series.count()}`);
// Outputs: "dataSeries count: 1,000,000"
```

The capacity of a `dataSeries` can be get/set via the `capacity` property. This sets the size of the underlying memory buffers allowing you to pre-allocate memory in demanding applications.

For example, if you plan to call `dataSeries.append()` or `.appendRange()` many times up to a capacity of 1,000,000, you can pre-allocate the memory now by setting the `capacity`:

```ts
const series = new XyDataSeries(webAssemblyContext);
series.capacity = 1000000; // pre-allocates 1,000,000 values for X,Y
```


## Converting the DataSeries xValues, yValues to Float64Array

As the `dataSeries.getNativeXValues()`, `dataSeries.getNativeYValues()` functions return a webassembly Float64 memory buffer (`SCRTDoubleVector`), you can't operate on this like a normal JavaScript array.

However, it is possible to create a view on the dataSeries x, y values as a JS array (`Float64Array`) for further manipulation, read-back of dataSeries values or otherwise.

The following helper function will convert a `SCRTDoubleVector` (Float64 webassembly memory buffer) into a `Float64Array` (JavaScript array). This operation is super-fast and will allow you to read back values from a dataSeries into JavaScript with little overhead.

:::info
Note, the returned `Float64Array` is a **view** onto the wasm memory, not a copy. Create a new view every time you want to read-back data from a `dataSeries`.
:::

```ts
import { TSciChart, TSciChart3D } from "../../src";
import { FloatVector, SCRTDoubleVector } from "../../src/types/TSciChart";
import { DoubleVector as DoubleVector3D, FloatVector as FloatVector3D } from "../../src/types/TSciChart3D";

export function vectorToF64Array(vector: SCRTDoubleVector | DoubleVector3D | FloatVector | FloatVector3D, wasmContext: TSciChart | TSciChart3D): Float64Array {
    // Access the memory pointer for the SCRTDoubleVector in webassembly
    const ptr = vector.dataPtr(0);
    // Get the SCRTDoubleVector size
    const size = vector.size();

    // Create a Float64Array view on the Webassembly memory
    // @ts-ignore
    return new Float64Array(wasmContext.HEAPF64.buffer, ptr, size);
}
```

Now, to use it:

```ts
const count = 1_000_000;
const xValues: number[] = Array.from(Array(count).keys());
const yValues: number[] = Array.from(Array(count).keys());

// Create an XyDataSeries with 1,000,000 xValues, yValues
const dataSeries = new XyDataSeries(webAssemblyContext, {
    xValues,
    yValues
});

// Create a view into the data (maps dataSeries xValues, yValues onto a JavaScript Float64Array)
console.time("vectorToF64Array get");
const f64XValues = vectorToF64Array(dataSeries.getNativeXValues(), webAssemblyContext);
const f64YValues = vectorToF64Array(dataSeries.getNativeYValues(), webAssemblyContext);
console.timeEnd("vectorToF64Array get");

// Operate on these as normal JS arrays
console.time("vectorToF64Array iterate");
// Check values
let test = 0;
for (let i = 0; i < count; i++) {
    test += f64XValues[i];
}
console.timeEnd("vectorToF64Array iterate");

// Output to console:
// vectorToF64Array get: 0.072ms
// vectorToF64Array iterate: 2.747ms
```

:::info
This method of creating a `Float64Array` view onto the webassembly data is **much faster** than `getNativeXValues().get(i)` `getNativeYValues().get(i)` and can be used to read back dataSeries `xValues` `yValues` into JavaScript efficiently.
:::
:::warning
Since the `Float64Array` is a **view** onto the webassembly memory, note that you should re-map this view every time you use it. If the underlying wasm memory is moved (`.dataPtr(0)` changes), then the
view will no longer work as expected.

It's best to use this operation to **read** values from a dataSeries but not write. For write operations, use the `append` `update` `insert` `remove` `clear` and `delete` functions directly on [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) and related dataSeries types
:::

## Converting DataSeries xValues, yValues to JavaScript number[] array

If you want to go a step further, you can convert a `Float64Array` to a JavaScript array (e.g. `number[]`). This operation involves a copy and is slower, but you can also be assured that the underlying data won't change. It's also the most compatible with JavaScript frameworks and other parts of your code.

```ts
const count = 1_000_000;
const xValues: number[] = Array.from(Array(count).keys());
const yValues: number[] = Array.from(Array(count).keys());

// Create an XyDataSeries with 1,000,000 xValues, yValues
const dataSeries = new XyDataSeries(webAssemblyContext, {
    xValues,
    yValues
});

// Create a Float64Array view onto dataSeries xValues, yValues and copy to JS Array
const jsXValues = Array.from(vectorToF64Array(dataSeries.getNativeXValues(), webAssemblyContext));
const jsYValues = Array.from(vectorToF64Array(dataSeries.getNativeYValues(), webAssemblyContext));

// operate on jsXValues, jsYValues as normal javascript arrays
```

:::info
This operation involves a copy and is safer, but will introduce some extra latency depending on the size of the dataSeries data.
:::

## Fast copy one XyDataSeries to another

Using the utility function `vectorToF64Array()` we declared above, it's possible to fast copy an entire `XyDataSeries` to another.
Use this in the case where you want to duplicate (copy) data from one DataSeries to another.

1. Given a source `dataSeries` with `count()`
2. Create a destination `dataSeries`, set `dest.capacity = source.count()`
3. Use the `vectorToF64Array` helper function declared above to get `Float64Array` views into the source x, yValues
4. call `dest.appendRange()` using these arrays

```ts
const count = 1_000_000;
const xValues: number[] = Array.from(Array(count).keys());
const yValues: number[] = Array.from(Array(count).keys());

// Create a src series and fill with values
console.time("Time to fill a dataSeries");
const seriesSrc = new XyDataSeries(webAssemblyContext, {
    xValues,
    yValues
});
console.timeEnd("Time to fill a dataSeries");

// Create a dest series and ensure the capacity (memory size) matches the soruce series
const seriesDest = new XyDataSeries(webAssemblyContext);
seriesDest.capacity = seriesSrc.count();

// Fast copy xValues, yValues from one dataSeries to another
console.time("Time to copy an entire dataSeries");
seriesDest.appendRange(
    vectorToF64Array(seriesSrc.getNativeXValues(), webAssemblyContext),
    vectorToF64Array(seriesSrc.getNativeYValues(), webAssemblyContext),
);
console.timeEnd("Time to copy an entire dataSeries");

// Console output
// Time to fill a dataSeries: 11.762ms
// Time to copy an entire dataSeries: 13.861ms
```

:::info
The time to copy a `dataSeries` using the above method is comparable to the time to create the `dataSeries` in the first place.

This method can be used if you need to create copies (clones) of dataSeries in your js application.
:::


Examples of Dynamic Updates
---------------------------

There are a number of worked examples of how to apply dynamic updates to the chart over at the page [DataSeries Realtime Updates](/2d-charts/chart-types/data-series-api/realtime-updates).
