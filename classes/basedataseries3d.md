[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseDataSeries3D](basedataseries3d.md)

# Class: BaseDataSeries3D

The base class for DataSeries in SciChart's [JavaScript 3D Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
A DataSeries stores the data to render. This is independent from the [RenderableSeries](../interfaces/irenderableseries3d.md)
which defines how that data should be rendered.

See derived types of [BaseDataSeries3D](basedataseries3d.md) to find out what data-series are available.
See derived types of [IRenderableSeries3D](../interfaces/irenderableseries3d.md) to find out what 3D JavaScript Chart types are available.

## Hierarchy

* **BaseDataSeries3D**

  ↳ [BaseGridDataSeries3D](basegriddataseries3d.md)

  ↳ [XyzDataSeries3D](xyzdataseries3d.md)

## Implements

* [IDataSeries3D](../interfaces/idataseries3d.md)

## Index

### Constructors

* [constructor](basedataseries3d.md#constructor)

### Properties

* [dataChanged](basedataseries3d.md#readonly-datachanged)
* [type](basedataseries3d.md#readonly-abstract-type)

### Accessors

* [dataSeriesName](basedataseries3d.md#dataseriesname)
* [xRange](basedataseries3d.md#xrange)
* [yRange](basedataseries3d.md#yrange)
* [zRange](basedataseries3d.md#zrange)

### Methods

* [delete](basedataseries3d.md#delete)
* [getIsDeleted](basedataseries3d.md#getisdeleted)
* [notifyDataChanged](basedataseries3d.md#notifydatachanged)

## Constructors

###  constructor

\+ **new BaseDataSeries3D**(`webAssemblyContext`: TSciChart3D, `options?`: [IBaseDataSeries3DOptions](../interfaces/ibasedataseries3doptions.md)): *[BaseDataSeries3D](basedataseries3d.md)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IBaseDataSeries3DOptions](../interfaces/ibasedataseries3doptions.md) |

**Returns:** *[BaseDataSeries3D](basedataseries3d.md)*

## Properties

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›*

*Implementation of [IDataSeries3D](../interfaces/idataseries3d.md).[dataChanged](../interfaces/idataseries3d.md#datachanged)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L46)*

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

### `Readonly` `Abstract` type

• **type**: *[EDataSeriesType3D](../enums/edataseriestype3d.md)*

*Implementation of [IDataSeries3D](../interfaces/idataseries3d.md).[type](../interfaces/idataseries3d.md#readonly-type)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L42)*

Gets the [EDataSeriesType3D](../enums/edataseriestype3d.md) type of the DataSeries

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L75)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L82)*

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

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L60)*

Gets the total extends of the [DataSeries3D](basedataseries3d.md) in the x-range

**`inheritdoc`** 

**Returns:** *NumberRange*

___

###  yRange

• **get yRange**(): *NumberRange*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L65)*

Gets the total extends of the [DataSeries3D](basedataseries3d.md) in the y-range

**`inheritdoc`** 

**Returns:** *NumberRange*

___

###  zRange

• **get zRange**(): *NumberRange*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:70](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L70)*

Gets the total extends of the [DataSeries3D](basedataseries3d.md) in the z-range

**`inheritdoc`** 

**Returns:** *NumberRange*

## Methods

###  delete

▸ **delete**(): *void*

*Implementation of [IDataSeries3D](../interfaces/idataseries3d.md)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L97)*

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

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L90)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:106](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L106)*

Call this method to notify subscribers of [dataChanged](basedataseries3d.md#readonly-datachanged) that the data has changed
and [3D JavaScript Chart](https://www.scichart.com/javascript-chart-features)
needs redrawing

**Returns:** *void*
