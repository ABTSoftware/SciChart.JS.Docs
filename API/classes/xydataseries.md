[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [XyDataSeries](xydataseries.md)

# Class: XyDataSeries

**`summary`** XyDataSeries is a DataSeries for holding X, Y data in SciChart's 2D
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`description`** 
The XyDataSeries is primarily used with our [JavaScript Line Chart](fastlinerenderableseries.md),
but can also be used by the [JavaScript Scatter Chart](xyscatterrenderableseries.md) or
[JavaScript Mountain/Area Chart](fastmountainrenderableseries.md) and [JavaScript Column Chart](fastmountainrenderableseries.md).

To instantiate an [XyDataSeries](xydataseries.md), use the following code:
```ts
const xyDataSeries = new XyDataSeries(wasmContext);
xyDataSeries.append(1, 2); // Append a single x,y point
xyDataSeries.appendRange([3, 4], [3, 4]); // Append multiple x,y points (faster)
xyDataSeries.insert(0, 9, 10); // Insert a point at index 0
xyDataSeries.update(0, 11, 12); // Update a point at index 0
xyDataSeries.removeAt(0); // Remove a point at index 0
xyDataSeries.clear(); // Clear the dataseries
xyDataSeries.delete(); // Delete the dataseries and native (WebAssembly) memory
```

**`remarks`** 
A DataSeries stores the data to render. This is independent from the [RenderableSeries](../interfaces/irenderableseries.md)
which defines how that data should be rendered.

See derived types of [BaseDataSeries](basedataseries.md) to find out what data-series are available.
See derived types of [IRenderableSeries](../interfaces/irenderableseries.md) to find out what 2D JavaScript Chart types are available.

## Hierarchy

* [BaseDataSeries](basedataseries.md)

  ↳ **XyDataSeries**

## Implements

* [IDataSeries](../interfaces/idataseries.md)

## Index

### Constructors

* [constructor](xydataseries.md#constructor)

### Properties

* [dataChanged](xydataseries.md#readonly-datachanged)
* [minXSpacing](xydataseries.md#minxspacing)
* [type](xydataseries.md#readonly-type)

### Accessors

* [dataSeriesName](xydataseries.md#dataseriesname)
* [hasValues](xydataseries.md#hasvalues)
* [isSorted](xydataseries.md#issorted)
* [xRange](xydataseries.md#xrange)

### Methods

* [append](xydataseries.md#append)
* [appendRange](xydataseries.md#appendrange)
* [clear](xydataseries.md#clear)
* [count](xydataseries.md#count)
* [delete](xydataseries.md#delete)
* [getIndicesRange](xydataseries.md#getindicesrange)
* [getIsDeleted](xydataseries.md#getisdeleted)
* [getNativeIndexes](xydataseries.md#getnativeindexes)
* [getNativeXValues](xydataseries.md#getnativexvalues)
* [getNativeYValues](xydataseries.md#getnativeyvalues)
* [getWindowedYRange](xydataseries.md#getwindowedyrange)
* [insert](xydataseries.md#insert)
* [insertRange](xydataseries.md#insertrange)
* [notifyDataChanged](xydataseries.md#notifydatachanged)
* [removeAt](xydataseries.md#removeat)
* [removeRange](xydataseries.md#removerange)
* [update](xydataseries.md#update)

## Constructors

###  constructor

\+ **new XyDataSeries**(`webAssemblyContext`: TSciChart, `options?`: [IXyDataSeriesOptions](../interfaces/ixydataseriesoptions.md)): *[XyDataSeries](xydataseries.md)*

*Overrides void*

*Defined in [src/Charting/Model/XyDataSeries.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L51)*

Creates an instance of [XyDataSeries](xydataseries.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`webAssemblyContext` | TSciChart | the {@link TSciChart | SciChart WebAssembly Context} containing native methods and access to our underlying WebGL2 WebAssembly rendering engine |
`options?` | [IXyDataSeriesOptions](../interfaces/ixydataseriesoptions.md) | the [IXyDataSeriesOptions](../interfaces/ixydataseriesoptions.md) which can be passed to configure the DataSeries at construct time  |

**Returns:** *[XyDataSeries](xydataseries.md)*

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

• **type**: *[Xy](../enums/edataseriestype.md#xy)* = EDataSeriesType.Xy

*Implementation of [IDataSeries](../interfaces/idataseries.md).[type](../interfaces/idataseries.md#readonly-type)*

*Overrides [BaseDataSeries](basedataseries.md).[type](basedataseries.md#readonly-abstract-type)*

*Defined in [src/Charting/Model/XyDataSeries.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L51)*

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

▸ **append**(`x`: number, `y`: number): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L75)*

Appends a single X, Y point to the DataSeries

**`remarks`** 
For best performance on drawing large datasets, use the [appendRange](xydataseries.md#appendrange) method

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | number | The X-value |
`y` | number | The Y-value  |

**Returns:** *void*

___

###  appendRange

▸ **appendRange**(`xValues`: number[], `yValues`: number[]): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L91)*

Appends a range of X, Y points to the DataSeries

**`remarks`** 
This method is considerably higher performance than [append](xydataseries.md#append) which appends a single point

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xValues` | number[] | The X-values |
`yValues` | number[] | The Y-values  |

**Returns:** *void*

___

###  clear

▸ **clear**(): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:208](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L208)*

Clears the entire DataSeries.

**`remarks`** 
Note this does not free memory, WebAssembly/Native memory is released by calling [delete](xydataseries.md#delete), after which the
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

*Inherited from [BaseDataSeries](basedataseries.md).[delete](basedataseries.md#delete)*

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

*Inherited from [BaseDataSeries](basedataseries.md).[getWindowedYRange](basedataseries.md#getwindowedyrange)*

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

###  insert

▸ **insert**(`startIndex`: number, `x`: number, `y`: number): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:133](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L133)*

**`summary`** Inserts a single X,Y value at the start index

**`remarks`** 
For best performance on drawing large datasets, use the [insertRange](xydataseries.md#insertrange) method

Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the index to insert at |
`x` | number | the Xvalue |
`y` | number | the Yvalue  |

**Returns:** *void*

___

###  insertRange

▸ **insertRange**(`startIndex`: number, `xValues`: number[], `yValues`: number[]): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:153](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L153)*

**`summary`** Inserts a range of X,Y values at the startIndex

**`remarks`** 
Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the index to insert at |
`xValues` | number[] | the XValues |
`yValues` | number[] | the YValues  |

**Returns:** *void*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Inherited from [BaseDataSeries](basedataseries.md).[notifyDataChanged](basedataseries.md#notifydatachanged)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L156)*

Call to notify subscribers of [dataChanged](xydataseries.md#readonly-datachanged) that the data has changed and [SciChartSurface](scichartsurface.md) needs redrawing

**Returns:** *void*

___

###  removeAt

▸ **removeAt**(`index`: number): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L174)*

Removes an X,Y value at the specified index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | the index to remove at  |

**Returns:** *void*

___

###  removeRange

▸ **removeRange**(`startIndex`: number, `count`: number): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:190](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L190)*

**`summary`** Removes a range of X,Y values at the specified index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`startIndex` | number | the start index to remove at |
`count` | number | the number of points to remove  |

**Returns:** *void*

___

###  update

▸ **update**(`index`: number, `y`: number): *void*

*Defined in [src/Charting/Model/XyDataSeries.ts:117](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L117)*

Updates a single Y-value by X-index

**`remarks`** Any changes of the DataSeries will trigger a redraw on the parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | the index to update |
`y` | number | The new Y value  |

**Returns:** *void*
