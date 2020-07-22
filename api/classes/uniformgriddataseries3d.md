[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [UniformGridDataSeries3D](uniformgriddataseries3d.md)

# Class: UniformGridDataSeries3D

## Hierarchy

  ↳ [BaseGridDataSeries3D](basegriddataseries3d.md)

  ↳ **UniformGridDataSeries3D**

## Implements

* [IDataSeries3D](../interfaces/idataseries3d.md)
* [IGridDataSeries3D](../interfaces/igriddataseries3d.md)

## Index

### Constructors

* [constructor](uniformgriddataseries3d.md#constructor)

### Properties

* [dataChanged](uniformgriddataseries3d.md#readonly-datachanged)
* [type](uniformgriddataseries3d.md#type)

### Accessors

* [dataSeriesName](uniformgriddataseries3d.md#dataseriesname)
* [xRange](uniformgriddataseries3d.md#xrange)
* [xSize](uniformgriddataseries3d.md#xsize)
* [xStart](uniformgriddataseries3d.md#xstart)
* [xStep](uniformgriddataseries3d.md#xstep)
* [yRange](uniformgriddataseries3d.md#yrange)
* [zRange](uniformgriddataseries3d.md#zrange)
* [zSize](uniformgriddataseries3d.md#zsize)
* [zStart](uniformgriddataseries3d.md#zstart)
* [zStep](uniformgriddataseries3d.md#zstep)

### Methods

* [delete](uniformgriddataseries3d.md#delete)
* [getIsDeleted](uniformgriddataseries3d.md#getisdeleted)
* [getYValue](uniformgriddataseries3d.md#getyvalue)
* [getYValues](uniformgriddataseries3d.md#getyvalues)
* [notifyDataChanged](uniformgriddataseries3d.md#notifydatachanged)
* [setYValue](uniformgriddataseries3d.md#setyvalue)
* [setYValues](uniformgriddataseries3d.md#setyvalues)

## Constructors

###  constructor

\+ **new UniformGridDataSeries3D**(`webAssemblyContext`: TSciChart3D, `options?`: [IUniformGridDataSeries3DOptions](../interfaces/iuniformgriddataseries3doptions.md)): *[UniformGridDataSeries3D](uniformgriddataseries3d.md)*

*Overrides void*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IUniformGridDataSeries3DOptions](../interfaces/iuniformgriddataseries3doptions.md) |

**Returns:** *[UniformGridDataSeries3D](uniformgriddataseries3d.md)*

## Properties

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›*

*Implementation of [IGridDataSeries3D](../interfaces/igriddataseries3d.md).[dataChanged](../interfaces/igriddataseries3d.md#datachanged)*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[dataChanged](basedataseries3d.md#readonly-datachanged)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L46)*

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

###  type

• **type**: *[EDataSeriesType3D](../enums/edataseriestype3d.md)* = EDataSeriesType3D.UniformGrid3D

*Implementation of [IGridDataSeries3D](../interfaces/igriddataseries3d.md).[type](../interfaces/igriddataseries3d.md#readonly-type)*

*Overrides [BaseGridDataSeries3D](basegriddataseries3d.md).[type](basegriddataseries3d.md#readonly-abstract-type)*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L14)*

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[dataSeriesName](basedataseries3d.md#dataseriesname)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L75)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[dataSeriesName](basedataseries3d.md#dataseriesname)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L82)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`dataSeriesName` | string |

**Returns:** *void*

___

###  xRange

• **get xRange**(): *NumberRange*

*Overrides [BaseGridDataSeries3D](basegriddataseries3d.md).[xRange](basegriddataseries3d.md#xrange)*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:61](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L61)*

**Returns:** *NumberRange*

___

###  xSize

• **get xSize**(): *number*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[xSize](basegriddataseries3d.md#xsize)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:102](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L102)*

The xSize is the WIDTH or number of elements in each or of the 2-dimensional array,
e.g. [[1, 2][3, 4][5, 6]] has a xSize of 2

**Returns:** *number*

___

###  xStart

• **get xStart**(): *number*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L29)*

**Returns:** *number*

• **set xStart**(`xStart`: number): *void*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`xStart` | number |

**Returns:** *void*

___

###  xStep

• **get xStep**(): *number*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L37)*

**Returns:** *number*

• **set xStep**(`xStep`: number): *void*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`xStep` | number |

**Returns:** *void*

___

###  yRange

• **get yRange**(): *NumberRange*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[yRange](basegriddataseries3d.md#yrange)*

*Overrides [BaseDataSeries3D](basedataseries3d.md).[yRange](basedataseries3d.md#yrange)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:74](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L74)*

Gets the total extends of the GridDataSeries3D in the y-range

**Returns:** *NumberRange*

___

###  zRange

• **get zRange**(): *NumberRange*

*Overrides [BaseGridDataSeries3D](basegriddataseries3d.md).[zRange](basegriddataseries3d.md#zrange)*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L65)*

**Returns:** *NumberRange*

___

###  zSize

• **get zSize**(): *number*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[zSize](basegriddataseries3d.md#zsize)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L94)*

The zSize is the HEIGHT or number of rows of the 2-dimensional array,
e.g. [[1, 2][3, 4][5, 6]] has a height of 3

**Returns:** *number*

___

###  zStart

• **get zStart**(): *number*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L45)*

**Returns:** *number*

• **set zStart**(`zStart`: number): *void*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`zStart` | number |

**Returns:** *void*

___

###  zStep

• **get zStep**(): *number*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L53)*

**Returns:** *number*

• **set zStep**(`zStep`: number): *void*

*Defined in [src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/UniformGridDataSeries3D.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`zStep` | number |

**Returns:** *void*

## Methods

###  delete

▸ **delete**(): *void*

*Implementation of [IGridDataSeries3D](../interfaces/igriddataseries3d.md)*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[delete](basedataseries3d.md#delete)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L97)*

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

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[getIsDeleted](basedataseries3d.md#getisdeleted)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L90)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getYValue

▸ **getYValue**(`zIndex`: number, `xIndex`: number): *number*

*Implementation of [IGridDataSeries3D](../interfaces/igriddataseries3d.md)*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[getYValue](basegriddataseries3d.md#getyvalue)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:154](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L154)*

Gets the YValue at the specific Z,X index where Z must be within 0-zSize and X must be within 0-xSize

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`zIndex` | number | the z-index from 0 to zSize |
`xIndex` | number | the x-index from 0 to xSize  |

**Returns:** *number*

___

###  getYValues

▸ **getYValues**(): *number[][]*

*Implementation of [IGridDataSeries3D](../interfaces/igriddataseries3d.md)*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[getYValues](basegriddataseries3d.md#getyvalues)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:145](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L145)*

Gets the Y-Values array as a two dimensional array. Output is in the format YValues[z][x]
where z is 0 to zSize and X is 0 to xSize.

**Returns:** *number[][]*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[notifyDataChanged](basegriddataseries3d.md#notifydatachanged)*

*Overrides [BaseDataSeries3D](basedataseries3d.md).[notifyDataChanged](basedataseries3d.md#notifydatachanged)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L174)*

**Returns:** *void*

___

###  setYValue

▸ **setYValue**(`yIndex`: number, `xIndex`: number, `zValue`: number): *void*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[setYValue](basegriddataseries3d.md#setyvalue)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:169](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L169)*

Sets the YValue at the specific Z,X index where Z must be within 0-zSize and X must be within 0-xSize

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`yIndex` | number | - |
`xIndex` | number | the x-index from 0 to xSize |
`zValue` | number | - |

**Returns:** *void*

___

###  setYValues

▸ **setYValues**(`YValues`: number[][]): *void*

*Implementation of [IGridDataSeries3D](../interfaces/igriddataseries3d.md)*

*Inherited from [BaseGridDataSeries3D](basegriddataseries3d.md).[setYValues](basegriddataseries3d.md#setyvalues)*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L113)*

Sets a 2D array of YValues. Input is in the format YValues[z][x]
where z is 0 to zSize and X is 0 to xSize
Note that setting the YValues involves a clone. Once the array has been set you cannot manipulate
the input array and expect changes on the chart.

**Parameters:**

Name | Type |
------ | ------ |
`YValues` | number[][] |

**Returns:** *void*
