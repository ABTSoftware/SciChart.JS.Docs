[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IDataSeries3D](idataseries3d.md)

# Interface: IDataSeries3D

Defines the interface to a DataSeries in SciChart's High Performance Real-time
[JavaScript 3D Charts](https://www.scichart.com/javascript-chart-features)

## Hierarchy

* IDeletable

  ↳ **IDataSeries3D**

  ↳ [IGridDataSeries3D](igriddataseries3d.md)

## Implemented by

* [BaseDataSeries3D](../classes/basedataseries3d.md)
* [BaseGridDataSeries3D](../classes/basegriddataseries3d.md)
* [UniformGridDataSeries3D](../classes/uniformgriddataseries3d.md)
* [XyzDataSeries3D](../classes/xyzdataseries3d.md)

## Index

### Properties

* [dataChanged](idataseries3d.md#datachanged)
* [dataSeriesName](idataseries3d.md#dataseriesname)
* [type](idataseries3d.md#readonly-type)
* [xRange](idataseries3d.md#readonly-xrange)
* [yRange](idataseries3d.md#readonly-yrange)
* [zRange](idataseries3d.md#readonly-zrange)

### Methods

* [delete](idataseries3d.md#delete)

## Properties

###  dataChanged

• **dataChanged**: *EventHandler‹void›*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L32)*

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

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L36)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

___

### `Readonly` type

• **type**: *[EDataSeriesType3D](../enums/edataseriestype3d.md)*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L14)*

Gets the [EDataSeriesType3D](../enums/edataseriestype3d.md) type of the DataSeries

___

### `Readonly` xRange

• **xRange**: *NumberRange*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L40)*

Gets the total extends of the [DataSeries3D](../classes/basedataseries3d.md) in the x-range

___

### `Readonly` yRange

• **yRange**: *NumberRange*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L45)*

Gets the total extends of the [DataSeries3D](../classes/basedataseries3d.md) in the y-range

___

### `Readonly` zRange

• **zRange**: *NumberRange*

*Defined in [src/Charting3D/Model/DataSeries/IDataSeries3D.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Model/DataSeries/IDataSeries3D.ts#L50)*

Gets the total extends of the [DataSeries3D](../classes/basedataseries3d.md) in the z-range

## Methods

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*
