[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IGridDataSeries3D](igriddataseries3d.md)

# Interface: IGridDataSeries3D

## Hierarchy

  ↳ [IDataSeries3D](idataseries3d.md)

  ↳ **IGridDataSeries3D**

## Implemented by

* [BaseGridDataSeries3D](../classes/basegriddataseries3d.md)
* [UniformGridDataSeries3D](../classes/uniformgriddataseries3d.md)

## Index

### Properties

* [dataChanged](igriddataseries3d.md#datachanged)
* [dataSeriesName](igriddataseries3d.md#dataseriesname)
* [type](igriddataseries3d.md#readonly-type)
* [xRange](igriddataseries3d.md#readonly-xrange)
* [xSize](igriddataseries3d.md#readonly-xsize)
* [yRange](igriddataseries3d.md#readonly-yrange)
* [zRange](igriddataseries3d.md#readonly-zrange)
* [zSize](igriddataseries3d.md#readonly-zsize)

### Methods

* [delete](igriddataseries3d.md#delete)
* [getYValue](igriddataseries3d.md#getyvalue)
* [getYValues](igriddataseries3d.md#getyvalues)
* [setYValues](igriddataseries3d.md#setyvalues)

## Properties

###  dataChanged

• **dataChanged**: *EventHandler‹void›*

*Inherited from [IDataSeries3D](idataseries3d.md).[dataChanged](idataseries3d.md#datachanged)*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L32)*

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

*Inherited from [IDataSeries3D](idataseries3d.md).[dataSeriesName](idataseries3d.md#dataseriesname)*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L36)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

___

### `Readonly` type

• **type**: *[EDataSeriesType3D](../enums/edataseriestype3d.md)*

*Inherited from [IDataSeries3D](idataseries3d.md).[type](idataseries3d.md#readonly-type)*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L14)*

Gets the [EDataSeriesType3D](../enums/edataseriestype3d.md) type of the DataSeries

___

### `Readonly` xRange

• **xRange**: *NumberRange*

*Inherited from [IDataSeries3D](idataseries3d.md).[xRange](idataseries3d.md#readonly-xrange)*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L40)*

Gets the total extends of the [DataSeries3D](../classes/basedataseries3d.md) in the x-range

___

### `Readonly` xSize

• **xSize**: *number*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L21)*

The xSize is the WIDTH or number of elements in each or of the 2-dimensional array,
e.g. [[1, 2][3, 4][5, 6]] has a xSize of 2

___

### `Readonly` yRange

• **yRange**: *NumberRange*

*Inherited from [IDataSeries3D](idataseries3d.md).[yRange](idataseries3d.md#readonly-yrange)*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L45)*

Gets the total extends of the [DataSeries3D](../classes/basedataseries3d.md) in the y-range

___

### `Readonly` zRange

• **zRange**: *NumberRange*

*Inherited from [IDataSeries3D](idataseries3d.md).[zRange](idataseries3d.md#readonly-zrange)*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L50)*

Gets the total extends of the [DataSeries3D](../classes/basedataseries3d.md) in the z-range

___

### `Readonly` zSize

• **zSize**: *number*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L15)*

The zSize is the HEIGHT or number of rows of the 2-dimensional array,
e.g. [[1, 2][3, 4][5, 6]] has a height of 3

## Methods

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

###  getYValue

▸ **getYValue**(`zIndex`: number, `xIndex`: number): *number*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L28)*

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

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L34)*

Gets the Y-Values array as a two dimensional array. Output is in the format YValues[z][x]
where z is 0 to zSize and X is 0 to xSize.

**Returns:** *number[][]*

___

###  setYValues

▸ **setYValues**(`YValues`: number[][]): *void*

*Defined in [src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseGridDataSeries3D.ts#L43)*

Sets a 2D array of YValues. Input is in the format YValues[z][x]
where z is 0 to zSize and X is 0 to xSize
Note that setting the YValues involves a clone. Once the array has been set you cannot manipulate
the input array and expect changes on the chart.

**Parameters:**

Name | Type |
------ | ------ |
`YValues` | number[][] |

**Returns:** *void*
