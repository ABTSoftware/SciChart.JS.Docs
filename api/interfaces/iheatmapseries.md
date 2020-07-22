[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IHeatmapSeries](iheatmapseries.md)

# Interface: IHeatmapSeries

Defines the interface to a Heatmap DataSeries in SciChart's High Performance Real-time
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

## Hierarchy

  ↳ [IDataSeries](idataseries.md)

  ↳ **IHeatmapSeries**

## Implemented by

* [BaseHeatmapDataSeries](../classes/baseheatmapdataseries.md)
* [UniformHeatmapDataSeries](../classes/uniformheatmapdataseries.md)

## Index

### Properties

* [dataChanged](iheatmapseries.md#datachanged)
* [dataSeriesName](iheatmapseries.md#dataseriesname)
* [hasValues](iheatmapseries.md#hasvalues)
* [isSorted](iheatmapseries.md#issorted)
* [minXSpacing](iheatmapseries.md#minxspacing)
* [type](iheatmapseries.md#readonly-type)
* [xRange](iheatmapseries.md#xrange)

### Methods

* [count](iheatmapseries.md#count)
* [delete](iheatmapseries.md#delete)
* [getIsDeleted](iheatmapseries.md#getisdeleted)
* [getNativeIndexes](iheatmapseries.md#getnativeindexes)
* [getNativeXValues](iheatmapseries.md#getnativexvalues)
* [getNativeYValues](iheatmapseries.md#getnativeyvalues)
* [getWindowedYRange](iheatmapseries.md#getwindowedyrange)

## Properties

###  dataChanged

• **dataChanged**: *EventHandler‹void›*

*Inherited from [IDataSeries](idataseries.md).[dataChanged](idataseries.md#datachanged)*

*Defined in [src/Charting/Model/IDataSeries.ts:70](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L70)*

An {@link EventHandler} which is raised when the data changes.

**`remarks`** 
To subscribe to dataChanged, use the following code:

```ts
const dataSeries = new XyDataSeries(wasmContext);
const callback = () => {
   // Data has changed
};
dataSeries.dataChanged.subscribe(callback);
```

To unsubscribe from dataChanged, use the following code:

```ts
const dataSeries = new XyDataSeries(wasmContext);
dataSeries.dataChanged.unsubscribe(callback);
```

___

###  dataSeriesName

• **dataSeriesName**: *string*

*Inherited from [IDataSeries](idataseries.md).[dataSeriesName](idataseries.md#dataseriesname)*

*Defined in [src/Charting/Model/IDataSeries.ts:83](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L83)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

___

###  hasValues

• **hasValues**: *boolean*

*Inherited from [IDataSeries](idataseries.md).[hasValues](idataseries.md#hasvalues)*

*Defined in [src/Charting/Model/IDataSeries.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L78)*

When true, the DataSeries has values, else it is empty

___

###  isSorted

• **isSorted**: *boolean*

*Inherited from [IDataSeries](idataseries.md).[isSorted](idataseries.md#issorted)*

*Defined in [src/Charting/Model/IDataSeries.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L92)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](idataseries.md#issorted) for further information

**`remarks`** 
The user must specify this flag (defaults to true) in order to choose the correct, and
fastest algorithms for drawing, indexing and ranging. If you experience glitches or
strange drawing, it may be because you have set unsorted data but not set this flag.

___

###  minXSpacing

• **minXSpacing**: *number*

*Inherited from [IDataSeries](idataseries.md).[minXSpacing](idataseries.md#minxspacing)*

*Defined in [src/Charting/Model/IDataSeries.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L79)*

___

### `Readonly` type

• **type**: *[EDataSeriesType](../enums/edataseriestype.md)*

*Inherited from [IDataSeries](idataseries.md).[type](idataseries.md#readonly-type)*

*Defined in [src/Charting/Model/IDataSeries.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L49)*

Gets the [EDataSeriesType](../enums/edataseriestype.md) type of the DataSeries

___

###  xRange

• **xRange**: *NumberRange*

*Inherited from [IDataSeries](idataseries.md).[xRange](idataseries.md#xrange)*

*Defined in [src/Charting/Model/IDataSeries.ts:74](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L74)*

Gets the range in the X-direction for this DataSeries

## Methods

###  count

▸ **count**(): *number*

*Inherited from [IDataSeries](idataseries.md).[count](idataseries.md#count)*

*Defined in [src/Charting/Model/IDataSeries.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L97)*

Gets the count of data-points in the DataSeries

**Returns:** *number*

___

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  getIsDeleted

▸ **getIsDeleted**(): *boolean*

*Inherited from [IDataSeries](idataseries.md).[getIsDeleted](idataseries.md#getisdeleted)*

*Defined in [src/Charting/Model/IDataSeries.ts:117](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L117)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getNativeIndexes

▸ **getNativeIndexes**(): *DoubleVector*

*Inherited from [IDataSeries](idataseries.md).[getNativeIndexes](idataseries.md#getnativeindexes)*

*Defined in [src/Charting/Model/IDataSeries.ts:102](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L102)*

Gets a native / WebAssembly Vector of Indexes in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Inherited from [IDataSeries](idataseries.md).[getNativeXValues](idataseries.md#getnativexvalues)*

*Defined in [src/Charting/Model/IDataSeries.ts:107](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L107)*

Gets a native / WebAssembly vector of X-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Inherited from [IDataSeries](idataseries.md).[getNativeYValues](idataseries.md#getnativeyvalues)*

*Defined in [src/Charting/Model/IDataSeries.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L112)*

Gets a native / WebAssembly vector of Y-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getWindowedYRange

▸ **getWindowedYRange**(`xRange`: NumberRange, `getPositiveRange`: boolean, `isCategoryAxis`: boolean): *NumberRange*

*Inherited from [IDataSeries](idataseries.md).[getWindowedYRange](idataseries.md#getwindowedyrange)*

*Defined in [src/Charting/Model/IDataSeries.ts:127](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/IDataSeries.ts#L127)*

Gets the Y-range of the data within the specified X-Range: a 'windowed'
Y-range used for zooming into series on the [SciChartSurface](../classes/scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xRange` | NumberRange | The [XAxis.visibleRange](../classes/axiscore.md#visiblerange) |
`getPositiveRange` | boolean | When true, return the positive part of the Y-range only |
`isCategoryAxis` | boolean | When true, treat the XAxis as a [CategoryAxis](../classes/categoryaxis.md) - an axis type which measures by x-index not x-value  |

**Returns:** *NumberRange*
