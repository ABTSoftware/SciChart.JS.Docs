---
sidebar_position: 3
title: "Accessing DataSeries xValues, yValues and count"
---

# Accessing DataSeries xValues, yValues and count (size)

## How to access DataSeries xValues, yValues

You can access `xValues`, `yValues` on a `DataSeries` by getting the internal WebAssembly native arrays via [dataSeries.getNativeXValues():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#getnativexvalues) and [dataSeries.getNativeYValues():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#getnativeyvalues) functions.

These functions return the x & y values as `SCRTDoubleVector`: a webassembly buffer type which stores underlying data as `Float64` array in the wasm heap.

### Accessing DataSeries data via getNativeXValues() / getNativeYValues().get(i)

Accessing dataSeries xValues, yValues can be done via the `dataSeries.getNativeXValues()`, `dataSeries.getNativeYValues()` functions.
These return an `SCRTDoubleVector` type which allows you to get a value at index via `dataSeries.getNativeXValues().get(i)`.

Below find a simple example of accessing dataSeries x/y values point by point:

<CodeSnippetBlock labels={["Ts"]}>
```ts showLineNumbers file=./VectorToArraySandbox/demo.ts start=Example1-Start end=Example1-End
```
</CodeSnippetBlock>

:::info
point by point access to the DataSeries via this method is slow when you're dealing with millions of points.
If you need to do bulk operations, it's better to read the entire vector out to JavaScript array first ([see how](#reading-dataseries-xvalues-yvalues-as-a-float64array-view))
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

The length, size or count or a `dataSeries` can be accessed via the [dataSeries.count():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#count) function. Here is an example:

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./VectorToArraySandbox/demo.ts start=Example3-Start end=Example3-End
```
</CodeSnippetBlock>

The capacity of a `dataSeries` can be get/set via the [dataSeries.capacity:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html#capacity) property. This sets the size of the underlying memory buffers allowing you to pre-allocate memory in demanding applications.

For example, if you plan to call `dataSeries.append()` or `.appendRange()` many times up to a capacity of 1,000,000, you can pre-allocate the memory now by setting the `capacity`:

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./VectorToArraySandbox/demo.ts start=Example4-Start end=Example4-End
```
</CodeSnippetBlock>

## Reading DataSeries xValues, yValues as a Float64Array View

As the `dataSeries.getNativeXValues()`, `dataSeries.getNativeYValues()` functions return the xValues and yValues as webassembly Float64 memory buffers (type `SCRTDoubleVector`), you can't operate on these like normal JavaScript arrays.

However, it is possible to create a view on the dataSeries xValues, yValues as a JS array (`Float64Array`) for further manipulation, read-back of dataSeries values or otherwise.

The following helper function `vectorToArrayViewF64()` (added in [version 4.0.873](https://www.scichart.com/changelog/scichart-js/)) will convert a `SCRTDoubleVector` (Float64 webassembly memory buffer)
into a `Float64Array` (JavaScript typed 64-bit array). This operation is super-fast and will allow you to read back values from a `dataSeries`
into JavaScript arrays with little overhead.

Here's an example of how to use it to get a JavaScript array view of  `dataSeries` x,y values:

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./VectorToArraySandbox/demo.ts start=Example5-Start end=Example5-End
```
</CodeSnippetBlock>

:::info
Note, the returned `Float64Array` is a **view** onto the wasm memory, **not a copy**. Updating this `Float64Array` view will update the dataSeries data and vice-versa.

This method of creating a `Float64Array` view onto the webassembly data is **much faster** than `getNativeXValues().get(i)` `getNativeYValues().get(i)` and can be used to read back dataSeries `xValues` `yValues` into JavaScript efficiently.
:::
:::warning
Since the `Float64Array` is a **view** onto the webassembly memory, note that you should re-map this view every time you use it. If the underlying dataSeries size is changed, the wasm memory may be moved (`.dataPtr(0)` will change), then you run
the risk of getting strange errors like `TypeError: Cannot perform %TypedArray%.prototype.set on a detached ArrayBuffer`.

It's best to use this operation to **read/write** values from a dataSeries where you need fast access, but don't keep the `Float64Array` view instance for longer than needed (use once for an operation then discard). For passing JS array copies around your app, use `vectorToArray()` which provides a safer deep-copy.

For write operations, it's recommended to use the `append` `update` `insert` `remove` `clear` and `delete` functions directly on [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) and related dataSeries types
unless you absolutely know what you're doing!
:::

## Copying DataSeries xValues, yValues to JavaScript number[] array

If you want to go a step further, you can convert a `Float64Array` to a JavaScript array (e.g. `number[]`) and perform a deep-copy of dataSeries data into JavaScript Arrays.
This operation involves a copy and is slower, but you can also be assured that the underlying data won't change.
It's also the most compatible with JavaScript frameworks and other parts of your code.

The `vectorToArray()` helper function (added in [version 4.0.873](https://www.scichart.com/changelog/scichart-js/)) can be used to perform a deep-copy of dataSeries data (xValues, yValues).

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./VectorToArraySandbox/demo.ts start=Example6-Start end=Example6-End
```
</CodeSnippetBlock>

:::info
This operation involves a deep copy of dataSeries data and is safer, but will introduce some extra latency depending on the size of the dataSeries data.
:::

## Fast copy one XyDataSeries to another

Using the utility function `vectorToArrayViewF64()` we discussed above, it's possible to fast copy an entire `XyDataSeries` to another.
Use this in the case where you want to duplicate (copy) data from one DataSeries to another.

1. Given a source `dataSeries` with `count()`
2. Create a destination `dataSeries`
3. set `destination.capacity = source.count()` _**important** to avoid detached ArrayBuffer errors_
3. Use the `vectorToArrayViewF64()` helper function declared above to get `Float64Array` views into the source xValues, yValues
4. call `destination.appendRange()` using these array views

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./VectorToArraySandbox/demo.ts start=Example7-Start end=Example7-End
```
</CodeSnippetBlock>

:::info
The time to deep copy `dataSeries` data from one series to another using `vectorToArrayViewF64()` is comparable to the time to create the `dataSeries` in the first place.

This method can be used if you need to create copies (clones) of dataSeries in your js application.
:::

## Performance Table of different dataSeries readback methods

Here's a performance table of the various methods to get, set, read, copy dataSeries xValues yValues into JS Arrays.
Performance will vary from system to system, but the following can be used as a guide to assess the impact of using different 

| Method                                                       | Time (ms) | Note                                                                          |
|--------------------------------------------------------------|-----------|-------------------------------------------------------------------------------|
| Read 1M points with `getNativeXValues().get(i)`              | 400ms     | point-by-point iteration is slow and should be avoided                        |
| Read 1M points with `vectorToArray()`                        | 62ms      | performs a deep-copy of xValues, yValues into number[] array                  |
| Read 1M points with `vectorToArrayViewF64()`                 | 4ms       | returns an unsafe array view. Used for v. fast read/write access with caveats |
| create new 1M point dataSeries                               | 11ms      | creation of a new dataSeries with pre-allocated arrays                        |
| deep copy 1M point dataSeries using `vectorToArrayViewF64()` | 13ms      | fast deep-copy of dataSeries data to another dataSeries                       |

Examples of Dynamic Updates
---------------------------

There are a number of worked examples of how to apply dynamic updates to the chart over at the page [DataSeries Realtime Updates](/2d-charts/chart-types/data-series-api/realtime-updates/).
