[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [XyyDataSeries](xyydataseries.md)

# Class: XyyDataSeries

XyyDataSeries is a DataSeries for holding X, Y1, Y2 data in SciChart's 2D
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
The XyyDataSeries is primarily used with our [JavaScript Band Chart](fastbandrenderableseries.md),
which draws a High-Low fill between two lines, where the fill changes color depending on whether line Y2 > Y1

A DataSeries stores the data to render. This is independent from the [RenderableSeries](../interfaces/irenderableseries.md)
which defines how that data should be rendered.

See derived types of [BaseDataSeries](basedataseries.md) to find out what data-series are available.
See derived types of [IRenderableSeries](../interfaces/irenderableseries.md) to find out what 2D JavaScript Chart types are available.

## Hierarchy

* [BaseDataSeries](basedataseries.md)

  ↳ **XyyDataSeries**

## Implements

* [IDataSeries](../interfaces/idataseries.md)

## Index

### Constructors

* [constructor](xyydataseries.md#constructor)

### Properties

* [dataChanged](xyydataseries.md#readonly-datachanged)
* [minXSpacing](xyydataseries.md#minxspacing)
* [type](xyydataseries.md#readonly-type)

### Accessors

* [dataSeriesName](xyydataseries.md#dataseriesname)
* [hasValues](xyydataseries.md#hasvalues)
* [isSorted](xyydataseries.md#issorted)
* [xRange](xyydataseries.md#xrange)

### Methods

* [append](xyydataseries.md#append)
* [appendRange](xyydataseries.md#appendrange)
* [clear](xyydataseries.md#clear)
* [count](xyydataseries.md#count)
* [delete](xyydataseries.md#delete)
* [getIndicesRange](xyydataseries.md#getindicesrange)
* [getIsDeleted](xyydataseries.md#getisdeleted)
* [getNativeIndexes](xyydataseries.md#getnativeindexes)
* [getNativeXValues](xyydataseries.md#getnativexvalues)
* [getNativeY1Values](xyydataseries.md#getnativey1values)
* [getNativeYValues](xyydataseries.md#getnativeyvalues)
* [getWindowedYRange](xyydataseries.md#getwindowedyrange)
* [insert](xyydataseries.md#insert)
* [insertRange](xyydataseries.md#insertrange)
* [notifyDataChanged](xyydataseries.md#notifydatachanged)
* [removeAt](xyydataseries.md#removeat)
* [removeRange](xyydataseries.md#removerange)
* [update](xyydataseries.md#update)

## Constructors

###  constructor

\+ **new XyyDataSeries**(`webAssemblyContext`: TSciChart, `options?`: [IXyyDataSeriesOptions](../interfaces/ixyydataseriesoptions.md)): *[XyyDataSeries](xyydataseries.md)*

*Overrides void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L45)*

Creates an instance of [XyyDataSeries](xyydataseries.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`webAssemblyContext` | TSciChart | the {@link TSciChart | SciChart WebAssembly Context} containing native methods and access to our underlying WebGL2 rendering engine |
`options?` | [IXyyDataSeriesOptions](../interfaces/ixyydataseriesoptions.md) | the [IXyyDataSeriesOptions](../interfaces/ixyydataseriesoptions.md) which can be passed to configure the DataSeries at construct time  |

**Returns:** *[XyyDataSeries](xyydataseries.md)*

## Properties

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›* = new EventHandler<void>()

*Implementation of [IDataSeries](../interfaces/idataseries.md).[dataChanged](../interfaces/idataseries.md#datachanged)*

*Inherited from [BaseDataSeries](basedataseries.md).[dataChanged](basedataseries.md#readonly-datachanged)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[minXSpacing](basedataseries.md#minxspacing)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L46)*

___

### `Readonly` type

• **type**: *[Xyy](../enums/edataseriestype.md#xyy)* = EDataSeriesType.Xyy

*Implementation of [IDataSeries](../interfaces/idataseries.md).[type](../interfaces/idataseries.md#readonly-type)*

*Overrides [BaseDataSeries](basedataseries.md).[type](basedataseries.md#readonly-abstract-type)*

*Defined in [src/Charting/Model/XyyDataSeries.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L43)*

Gets the [EDataSeriesType](../enums/edataseriestype.md) type of the DataSeries

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Inherited from [BaseDataSeries](basedataseries.md).[dataSeriesName](basedataseries.md#dataseriesname)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L91)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Inherited from [BaseDataSeries](basedataseries.md).[dataSeriesName](basedataseries.md#dataseriesname)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[hasValues](basedataseries.md#hasvalues)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:198](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L198)*

When true, the DataSeries has values, else it is empty

**`inheritdoc`** 

**Returns:** *boolean*

___

###  isSorted

• **get isSorted**(): *boolean*

*Inherited from [BaseDataSeries](basedataseries.md).[isSorted](basedataseries.md#issorted)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L78)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](../interfaces/idataseries.md#issorted) for further information

**`inheritdoc`** 

**Returns:** *boolean*

• **set isSorted**(`isSorted`: boolean): *void*

*Inherited from [BaseDataSeries](basedataseries.md).[isSorted](basedataseries.md#issorted)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[xRange](basedataseries.md#xrange)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:162](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L162)*

Gets the range in the X-direction for this DataSeries

**`inheritdoc`** 

**Returns:** *NumberRange*

## Methods

###  append

▸ **append**(`x`: number, `y`: number, `y1`: number): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L79)*

Appends a single X, Y, Y1 point to the DataSeries

**`remarks`** 
For best performance on drawing large datasets, use the [appendRange](xyydataseries.md#appendrange) method

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | number | The X-value |
`y` | number | The Y1-value |
`y1` | number | The Y2-value  |

**Returns:** *void*

___

###  appendRange

▸ **appendRange**(`xValues`: number[], `yValues`: number[], `y1Values`: number[]): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L97)*

Appends a range of X, Y, Y1 points to the DataSeries

**`remarks`** 
This method is considerably higher performance than [append](xyydataseries.md#append) which appends a single point

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xValues` | number[] | The X-values |
`yValues` | number[] | The Y-values |
`y1Values` | number[] | The Y1-values  |

**Returns:** *void*

___

###  clear

▸ **clear**(): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:236](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L236)*

Clears the entire DataSeries.

**`remarks`** 
Note this does not free memory, WebAssembly/Native memory is released by calling [delete](xyydataseries.md#delete), after which the
DataSeries is no longer usable.

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Returns:** *void*

___

###  count

▸ **count**(): *number*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[count](basedataseries.md#count)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L104)*

Gets the count of data-points in the DataSeries

**Returns:** *number*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Overrides [BaseDataSeries](basedataseries.md).[delete](basedataseries.md#delete)*

*Defined in [src/Charting/Model/XyyDataSeries.ts:288](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L288)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[getIsDeleted](basedataseries.md#getisdeleted)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L113)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getNativeIndexes

▸ **getNativeIndexes**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[getNativeIndexes](basedataseries.md#getnativeindexes)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:119](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L119)*

Gets a native / WebAssembly Vector of Indexes in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[getNativeXValues](basedataseries.md#getnativexvalues)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:134](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L134)*

Gets a native / WebAssembly vector of X-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeY1Values

▸ **getNativeY1Values**(): *DoubleVector*

*Defined in [src/Charting/Model/XyyDataSeries.ts:66](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L66)*

Gets a native / WebAssembly vector of Y2-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseDataSeries](basedataseries.md).[getNativeYValues](basedataseries.md#getnativeyvalues)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L140)*

Gets a native / WebAssembly vector of Y-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getWindowedYRange

▸ **getWindowedYRange**(`xRange`: NumberRange, `getPositiveRange`: boolean, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IDataSeries](../interfaces/idataseries.md)*

*Overrides [BaseDataSeries](basedataseries.md).[getWindowedYRange](basedataseries.md#getwindowedyrange)*

*Defined in [src/Charting/Model/XyyDataSeries.ts:248](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L248)*

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

▸ **insert**(`startIndex`: number, `x`: number, `y`: number, `y1`: number): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:149](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L149)*

Inserts a single X,Y1,Y2 value at the start index

**`remarks`** 
For best performance on drawing large datasets, use the [insertRange](xyydataseries.md#insertrange) method

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the index to insert at |
`x` | number | the Xvalue |
`y` | number | the Y1Value |
`y1` | number | the Y2Value  |

**Returns:** *void*

___

###  insertRange

▸ **insertRange**(`startIndex`: number, `xValues`: number[], `yValues`: number[], `y1Values`: number[]): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:172](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L172)*

Inserts a ragne of X,Y1,Y2 values at the startIndex

**`remarks`** 
Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the index to insert at |
`xValues` | number[] | the XValues |
`yValues` | number[] | the YValues |
`y1Values` | number[] | the Y1Values  |

**Returns:** *void*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Inherited from [BaseDataSeries](basedataseries.md).[notifyDataChanged](basedataseries.md#notifydatachanged)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L156)*

Call to notify subscribers of [dataChanged](xyydataseries.md#readonly-datachanged) that the data has changed and [SciChartSurface](scichartsurface.md) needs redrawing

**Returns:** *void*

___

###  removeAt

▸ **removeAt**(`index`: number): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:200](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L200)*

Removes a single X,Y1,Y2 value at the specified index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | the index to remove at  |

**Returns:** *void*

___

###  removeRange

▸ **removeRange**(`startIndex`: number, `count`: number): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L217)*

Removes a range of X,Y1,Y2 values at the specified index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the start index to remove at |
`count` | number | the number of points to remove  |

**Returns:** *void*

___

###  update

▸ **update**(`index`: number, `y`: number, `y1`: number): *void*

*Defined in [src/Charting/Model/XyyDataSeries.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L131)*

Updates a single Y, Y1-value by X-index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | the index to update |
`y` | number | The new Y value |
`y1` | number | The new Y1 value  |

**Returns:** *void*
