[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseDataSeries](basedataseries.md)

# Class: BaseDataSeries

The base class for DataSeries in SciChart's
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
A DataSeries stores the data to render. This is independent from the [RenderableSeries](../interfaces/irenderableseries.md)
which defines how that data should be rendered.

See derived types of [BaseDataSeries](basedataseries.md) to find out what data-series are available.
See derived types of [IRenderableSeries](../interfaces/irenderableseries.md) to find out what 2D JavaScript Chart types are available.

## Hierarchy

* **BaseDataSeries**

  ↳ [XyDataSeries](xydataseries.md)

  ↳ [OhlcDataSeries](ohlcdataseries.md)

  ↳ [XyyDataSeries](xyydataseries.md)

  ↳ [XyzDataSeries](xyzdataseries.md)

## Implements

* [IDataSeries](../interfaces/idataseries.md)

## Index

### Properties

* [dataChanged](basedataseries.md#readonly-datachanged)
* [minXSpacing](basedataseries.md#minxspacing)
* [type](basedataseries.md#readonly-abstract-type)

### Accessors

* [dataSeriesName](basedataseries.md#dataseriesname)
* [hasValues](basedataseries.md#hasvalues)
* [isSorted](basedataseries.md#issorted)
* [xRange](basedataseries.md#xrange)

### Methods

* [count](basedataseries.md#count)
* [delete](basedataseries.md#delete)
* [getIndicesRange](basedataseries.md#getindicesrange)
* [getIsDeleted](basedataseries.md#getisdeleted)
* [getNativeIndexes](basedataseries.md#getnativeindexes)
* [getNativeXValues](basedataseries.md#getnativexvalues)
* [getNativeYValues](basedataseries.md#getnativeyvalues)
* [getWindowedYRange](basedataseries.md#getwindowedyrange)
* [notifyDataChanged](basedataseries.md#notifydatachanged)

## Properties

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›* = new EventHandler<void>()

*Implementation of [IDataSeries](../interfaces/idataseries.md).[dataChanged](../interfaces/idataseries.md#datachanged)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L45)*

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

###  minXSpacing

• **minXSpacing**: *number* = 0

*Implementation of [IDataSeries](../interfaces/idataseries.md).[minXSpacing](../interfaces/idataseries.md#minxspacing)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L46)*

___

### `Readonly` `Abstract` type

• **type**: *[EDataSeriesType](../enums/edataseriestype.md)*

*Implementation of [IDataSeries](../interfaces/idataseries.md).[type](../interfaces/idataseries.md#readonly-type)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L41)*

Gets the [EDataSeriesType](../enums/edataseriestype.md) type of the DataSeries

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Defined in [src/Charting/Model/BaseDataSeries.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L91)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Defined in [src/Charting/Model/BaseDataSeries.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L97)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`dataSeriesName` | string |

**Returns:** *void*

___

###  hasValues

• **get hasValues**(): *boolean*

*Defined in [src/Charting/Model/BaseDataSeries.ts:198](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L198)*

When true, the DataSeries has values, else it is empty

**`inheritdoc`** 

**Returns:** *boolean*

___

###  isSorted

• **get isSorted**(): *boolean*

*Defined in [src/Charting/Model/BaseDataSeries.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L78)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](../interfaces/idataseries.md#issorted) for further information

**`inheritdoc`** 

**Returns:** *boolean*

• **set isSorted**(`isSorted`: boolean): *void*

*Defined in [src/Charting/Model/BaseDataSeries.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L84)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](../interfaces/idataseries.md#issorted) for further information

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`isSorted` | boolean |

**Returns:** *void*

___

###  xRange

• **get xRange**(): *NumberRange*

*Defined in [src/Charting/Model/BaseDataSeries.ts:162](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L162)*

Gets the range in the X-direction for this DataSeries

**`inheritdoc`** 

**Returns:** *NumberRange*

## Methods

###  count

▸ **count**(): *number*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L104)*

Gets the count of data-points in the DataSeries

**Returns:** *number*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:146](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L146)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  getIndicesRange

▸ **getIndicesRange**(`xRange`: NumberRange): *NumberRange*

*Defined in [src/Charting/Model/BaseDataSeries.ts:191](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`xRange` | NumberRange |

**Returns:** *NumberRange*

___

###  getIsDeleted

▸ **getIsDeleted**(): *boolean*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L113)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getNativeIndexes

▸ **getNativeIndexes**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:119](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L119)*

Gets a native / WebAssembly Vector of Indexes in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:134](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L134)*

Gets a native / WebAssembly vector of X-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L140)*

Gets a native / WebAssembly vector of Y-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getWindowedYRange

▸ **getWindowedYRange**(`xRange`: NumberRange, `getPositiveRange`: boolean, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:179](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L179)*

Gets the Y-range of the data within the specified X-Range: a 'windowed'
Y-range used for zooming into series on the [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`xRange` | NumberRange | - | The [XAxis.visibleRange](axiscore.md#visiblerange) |
`getPositiveRange` | boolean | - | When true, return the positive part of the Y-range only |
`isXCategoryAxis` | boolean | false | When true, treat the XAxis as a [CategoryAxis](categoryaxis.md) - an axis type which measures by x-index not x-value  |

**Returns:** *NumberRange*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Defined in [src/Charting/Model/BaseDataSeries.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L156)*

Call to notify subscribers of [dataChanged](basedataseries.md#readonly-datachanged) that the data has changed and [SciChartSurface](scichartsurface.md) needs redrawing

**Returns:** *void*
