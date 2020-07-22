[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [OhlcDataSeries](ohlcdataseries.md)

# Class: OhlcDataSeries

OhlcDataSeries is a DataSeries for holding Open, High, Low, Close data in SciChart's
[JavaScript Stock Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
The OhlcDataSeries is primarily used with the [JavaScript Candlestick Chart](fastcandlestickrenderableseries.md)
but can also be used with our [JavaScript Ohlc Chart](fastohlcrenderableseries.md),
used for drawing [JavaScript Stock Charts](https://www.scichart.com/javascript-chart-features) and Candlestick or OHLC charts.

A DataSeries stores the data to render. This is independent from the [RenderableSeries](../interfaces/irenderableseries.md)
which defines how that data should be rendered.

See derived types of [BaseDataSeries](basedataseries.md) to find out what data-series are available.
See derived types of [IRenderableSeries](../interfaces/irenderableseries.md) to find out what 2D JavaScript Chart types are available.

## Hierarchy

* [BaseDataSeries](basedataseries.md)

  ↳ **OhlcDataSeries**

## Implements

* [IDataSeries](../interfaces/idataseries.md)

## Index

### Constructors

* [constructor](ohlcdataseries.md#constructor)

### Properties

* [dataChanged](ohlcdataseries.md#readonly-datachanged)
* [minXSpacing](ohlcdataseries.md#minxspacing)
* [type](ohlcdataseries.md#readonly-type)

### Accessors

* [dataSeriesName](ohlcdataseries.md#dataseriesname)
* [hasValues](ohlcdataseries.md#hasvalues)
* [isSorted](ohlcdataseries.md#issorted)
* [xRange](ohlcdataseries.md#xrange)

### Methods

* [append](ohlcdataseries.md#append)
* [appendRange](ohlcdataseries.md#appendrange)
* [clear](ohlcdataseries.md#clear)
* [count](ohlcdataseries.md#count)
* [delete](ohlcdataseries.md#delete)
* [getIndicesRange](ohlcdataseries.md#getindicesrange)
* [getIsDeleted](ohlcdataseries.md#getisdeleted)
* [getNativeCloseValues](ohlcdataseries.md#getnativeclosevalues)
* [getNativeHighValues](ohlcdataseries.md#getnativehighvalues)
* [getNativeIndexes](ohlcdataseries.md#getnativeindexes)
* [getNativeLowValues](ohlcdataseries.md#getnativelowvalues)
* [getNativeOpenValues](ohlcdataseries.md#getnativeopenvalues)
* [getNativeXValues](ohlcdataseries.md#getnativexvalues)
* [getNativeYValues](ohlcdataseries.md#getnativeyvalues)
* [getWindowedYRange](ohlcdataseries.md#getwindowedyrange)
* [insert](ohlcdataseries.md#insert)
* [insertRange](ohlcdataseries.md#insertrange)
* [notifyDataChanged](ohlcdataseries.md#notifydatachanged)
* [removeAt](ohlcdataseries.md#removeat)
* [removeRange](ohlcdataseries.md#removerange)
* [update](ohlcdataseries.md#update)

## Constructors

###  constructor

\+ **new OhlcDataSeries**(`webAssemblyContext`: TSciChart, `options?`: [IOhlcDataSeriesOptions](../interfaces/iohlcdataseriesoptions.md)): *[OhlcDataSeries](ohlcdataseries.md)*

*Overrides void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L56)*

Creates an instance of [OhlcDataSeries](ohlcdataseries.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`webAssemblyContext` | TSciChart | the {@link TSciChart | SciChart WebAssembly Context} containing native methods and access to our underlying WebGL2 rendering engine |
`options?` | [IOhlcDataSeriesOptions](../interfaces/iohlcdataseriesoptions.md) | the [IOhlcDataSeriesOptions](../interfaces/iohlcdataseriesoptions.md) which can be passed to configure the DataSeries at construct time  |

**Returns:** *[OhlcDataSeries](ohlcdataseries.md)*

## Properties

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›* = new EventHandler<void>()

*Implementation of [IDataSeries](../interfaces/idataseries.md).[dataChanged](../interfaces/idataseries.md#datachanged)*

*Inherited from [BaseDataSeries](basedataseries.md).[dataChanged](basedataseries.md#readonly-datachanged)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L45)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[minXSpacing](basedataseries.md#minxspacing)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L46)*

___

### `Readonly` type

• **type**: *[Ohlc](../enums/edataseriestype.md#ohlc)* = EDataSeriesType.Ohlc

*Implementation of [IDataSeries](../interfaces/idataseries.md).[type](../interfaces/idataseries.md#readonly-type)*

*Overrides [BaseDataSeries](basedataseries.md).[type](basedataseries.md#readonly-abstract-type)*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L53)*

Gets the [EDataSeriesType](../enums/edataseriestype.md) type of the DataSeries

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Inherited from [BaseDataSeries](basedataseries.md).[dataSeriesName](basedataseries.md#dataseriesname)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L91)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Inherited from [BaseDataSeries](basedataseries.md).[dataSeriesName](basedataseries.md#dataseriesname)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L97)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[hasValues](basedataseries.md#hasvalues)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:198](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L198)*

When true, the DataSeries has values, else it is empty

**`inheritdoc`** 

**Returns:** *boolean*

___

###  isSorted

• **get isSorted**(): *boolean*

*Inherited from [BaseDataSeries](basedataseries.md).[isSorted](basedataseries.md#issorted)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L78)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](../interfaces/idataseries.md#issorted) for further information

**`inheritdoc`** 

**Returns:** *boolean*

• **set isSorted**(`isSorted`: boolean): *void*

*Inherited from [BaseDataSeries](basedataseries.md).[isSorted](basedataseries.md#issorted)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L84)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[xRange](basedataseries.md#xrange)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:162](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L162)*

Gets the range in the X-direction for this DataSeries

**`inheritdoc`** 

**Returns:** *NumberRange*

## Methods

###  append

▸ **append**(`x`: number, `open`: number, `high`: number, `low`: number, `close`: number): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L116)*

Appends a single X (Date), Open, High, Low, Close point to the DataSeries

**`remarks`** 
For best performance on drawing large datasets, use the [appendRange](ohlcdataseries.md#appendrange) method
X-value is a Date, encoded as a Unix Timestamp.

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | number | X-value is a Date, encoded as a Unix Timestamp. |
`open` | number | The Open value for this OHLC bar |
`high` | number | The High value for this OHLC bar |
`low` | number | The Low value for this OHLC bar |
`close` | number | The Close value for this OHLC bar  |

**Returns:** *void*

___

###  appendRange

▸ **appendRange**(`xValues`: number[], `openValues`: number[], `highValues`: number[], `lowValues`: number[], `closeValues`: number[]): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L139)*

Appends arrays of X (Date), Open, High, Low, Close point to the DataSeries

**`remarks`** 
This method is considerably higher performance than [append](ohlcdataseries.md#append) which appends a single point
X-value is a Date, encoded as a Unix Timestamp.

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type |
------ | ------ |
`xValues` | number[] |
`openValues` | number[] |
`highValues` | number[] |
`lowValues` | number[] |
`closeValues` | number[] |

**Returns:** *void*

___

###  clear

▸ **clear**(): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:310](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L310)*

Clears the entire DataSeries.

**`remarks`** 
Note this does not free memory, WebAssembly/Native memory is released by calling [delete](ohlcdataseries.md#delete), after which the
DataSeries is no longer usable.

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Returns:** *void*

___

###  count

▸ **count**(): *number*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[count](basedataseries.md#count)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L104)*

Gets the count of data-points in the DataSeries

**Returns:** *number*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Overrides [BaseDataSeries](basedataseries.md).[delete](basedataseries.md#delete)*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:324](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L324)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[getIndicesRange](basedataseries.md#getindicesrange)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:191](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`xRange` | NumberRange |

**Returns:** *NumberRange*

___

###  getIsDeleted

▸ **getIsDeleted**(): *boolean*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[getIsDeleted](basedataseries.md#getisdeleted)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L113)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getNativeCloseValues

▸ **getNativeCloseValues**(): *DoubleVector*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L100)*

Gets a native / WebAssembly vector of Close-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeHighValues

▸ **getNativeHighValues**(): *DoubleVector*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L88)*

Gets a native / WebAssembly vector of High-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeIndexes

▸ **getNativeIndexes**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[getNativeIndexes](basedataseries.md#getnativeindexes)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:119](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L119)*

Gets a native / WebAssembly Vector of Indexes in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeLowValues

▸ **getNativeLowValues**(): *DoubleVector*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L94)*

Gets a native / WebAssembly vector of Low-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeOpenValues

▸ **getNativeOpenValues**(): *DoubleVector*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L82)*

Gets a native / WebAssembly vector of Open-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[getNativeXValues](basedataseries.md#getnativexvalues)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:134](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L134)*

Gets a native / WebAssembly vector of X-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[getNativeYValues](basedataseries.md#getnativeyvalues)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L140)*

Gets a native / WebAssembly vector of Y-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getWindowedYRange

▸ **getWindowedYRange**(`xRange`: NumberRange, `getPositiveRange`: boolean, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Overrides [BaseDataSeries](basedataseries.md).[getWindowedYRange](basedataseries.md#getwindowedyrange)*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:336](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L336)*

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

###  insert

▸ **insert**(`startIndex`: number, `x`: number, `open`: number, `high`: number, `low`: number, `close`: number): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:200](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L200)*

Inserts a single Date, Open, High, Low, Close value at the X-index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the index to insert at |
`x` | number | the X-value (date) encoded as a Unix Timestamp |
`open` | number | The Open value |
`high` | number | The High value |
`low` | number | The Low value |
`close` | number | The Close value  |

**Returns:** *void*

___

###  insertRange

▸ **insertRange**(`startIndex`: number, `xValues`: number[], `openValues`: number[], `highValues`: number[], `lowValues`: number[], `closeValues`: number[]): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:225](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L225)*

Inserts a range of Date, Open, High, Low, Close value at the X-index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the index to insert at |
`xValues` | number[] | the X-values (dates) encoded as a Unix Timestamp |
`openValues` | number[] | The Open values |
`highValues` | number[] | The High values |
`lowValues` | number[] | The Low values |
`closeValues` | number[] | The Close values  |

**Returns:** *void*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Inherited from [BaseDataSeries](basedataseries.md).[notifyDataChanged](basedataseries.md#notifydatachanged)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L156)*

Call to notify subscribers of [dataChanged](ohlcdataseries.md#readonly-datachanged) that the data has changed and [SciChartSurface](scichartsurface.md) needs redrawing

**Returns:** *void*

___

###  removeAt

▸ **removeAt**(`index`: number): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:269](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L269)*

Removes a Date,Open,High,Low,Close value at the specified index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | the index to remove at  |

**Returns:** *void*

___

###  removeRange

▸ **removeRange**(`startIndex`: number, `count`: number): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:289](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L289)*

Removes a range of Date,Open,High,Low,Close values at the specified index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the start index to remove at |
`count` | number | the number of points to remove  |

**Returns:** *void*

___

###  update

▸ **update**(`index`: number, `open`: number, `high`: number, `low`: number, `close`: number): *void*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:181](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L181)*

Updates a single Open, High, Low, Close value by X-index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | the index to update |
`open` | number | The new Open value |
`high` | number | The new High value |
`low` | number | The new Low value |
`close` | number | The new Close value  |

**Returns:** *void*
