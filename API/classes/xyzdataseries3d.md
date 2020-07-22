[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [XyzDataSeries3D](xyzdataseries3d.md)

# Class: XyzDataSeries3D

## Hierarchy

* [BaseDataSeries3D](basedataseries3d.md)

  ↳ **XyzDataSeries3D**

## Implements

* [IDataSeries3D](../interfaces/idataseries3d.md)

## Index

### Constructors

* [constructor](xyzdataseries3d.md#constructor)

### Properties

* [dataChanged](xyzdataseries3d.md#readonly-datachanged)
* [type](xyzdataseries3d.md#readonly-type)

### Accessors

* [dataSeriesName](xyzdataseries3d.md#dataseriesname)
* [xRange](xyzdataseries3d.md#xrange)
* [yRange](xyzdataseries3d.md#yrange)
* [zRange](xyzdataseries3d.md#zrange)

### Methods

* [append](xyzdataseries3d.md#append)
* [appendRange](xyzdataseries3d.md#appendrange)
* [clear](xyzdataseries3d.md#clear)
* [count](xyzdataseries3d.md#count)
* [delete](xyzdataseries3d.md#delete)
* [getIsDeleted](xyzdataseries3d.md#getisdeleted)
* [getMetadataValues](xyzdataseries3d.md#getmetadatavalues)
* [getNativeXValues](xyzdataseries3d.md#getnativexvalues)
* [getNativeYValues](xyzdataseries3d.md#getnativeyvalues)
* [getNativeZValues](xyzdataseries3d.md#getnativezvalues)
* [insert](xyzdataseries3d.md#insert)
* [insertRange](xyzdataseries3d.md#insertrange)
* [notifyDataChanged](xyzdataseries3d.md#notifydatachanged)
* [removeAt](xyzdataseries3d.md#removeat)
* [removeRange](xyzdataseries3d.md#removerange)
* [update](xyzdataseries3d.md#update)

## Constructors

###  constructor

\+ **new XyzDataSeries3D**(`webAssemblyContext`: TSciChart3D, `options?`: [IXyzDataSeries3DOptions](../interfaces/ixyzdataseries3doptions.md)): *[XyzDataSeries3D](xyzdataseries3d.md)*

*Overrides [BaseDataSeries3D](basedataseries3d.md).[constructor](basedataseries3d.md#constructor)*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IXyzDataSeries3DOptions](../interfaces/ixyzdataseries3doptions.md) |

**Returns:** *[XyzDataSeries3D](xyzdataseries3d.md)*

## Properties

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›*

*Implementation of [IDataSeries3D](../interfaces/idataseries3d.md).[dataChanged](../interfaces/idataseries3d.md#datachanged)*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[dataChanged](basedataseries3d.md#readonly-datachanged)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L46)*

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

### `Readonly` type

• **type**: *[EDataSeriesType3D](../enums/edataseriestype3d.md)* = EDataSeriesType3D.Xyz3D

*Implementation of [IDataSeries3D](../interfaces/idataseries3d.md).[type](../interfaces/idataseries3d.md#readonly-type)*

*Overrides [BaseDataSeries3D](basedataseries3d.md).[type](basedataseries3d.md#readonly-abstract-type)*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L17)*

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[dataSeriesName](basedataseries3d.md#dataseriesname)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L75)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[dataSeriesName](basedataseries3d.md#dataseriesname)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L82)*

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

*Overrides [BaseDataSeries3D](basedataseries3d.md).[xRange](basedataseries3d.md#xrange)*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L53)*

**Returns:** *NumberRange*

___

###  yRange

• **get yRange**(): *NumberRange*

*Overrides [BaseDataSeries3D](basedataseries3d.md).[yRange](basedataseries3d.md#yrange)*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L60)*

**Returns:** *NumberRange*

___

###  zRange

• **get zRange**(): *NumberRange*

*Overrides [BaseDataSeries3D](basedataseries3d.md).[zRange](basedataseries3d.md#zrange)*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L67)*

**Returns:** *NumberRange*

## Methods

###  append

▸ **append**(`x`: number, `y`: number, `z`: number, `metadata?`: [IPointMetadata3D](../interfaces/ipointmetadata3d.md)): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:74](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |
`z` | number |
`metadata?` | [IPointMetadata3D](../interfaces/ipointmetadata3d.md) |

**Returns:** *void*

___

###  appendRange

▸ **appendRange**(`xValues`: number[], `yValues`: number[], `zValues`: number[], `metadatas?`: [IPointMetadata3D](../interfaces/ipointmetadata3d.md)[]): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`xValues` | number[] |
`yValues` | number[] |
`zValues` | number[] |
`metadatas?` | [IPointMetadata3D](../interfaces/ipointmetadata3d.md)[] |

**Returns:** *void*

___

###  clear

▸ **clear**(): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:183](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L183)*

**Returns:** *void*

___

###  count

▸ **count**(): *number*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:202](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L202)*

**Returns:** *number*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IDataSeries3D](../interfaces/idataseries3d.md)*

*Overrides [BaseDataSeries3D](basedataseries3d.md).[delete](basedataseries3d.md#delete)*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:193](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L193)*

**Returns:** *void*

___

###  getIsDeleted

▸ **getIsDeleted**(): *boolean*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[getIsDeleted](basedataseries3d.md#getisdeleted)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L90)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getMetadataValues

▸ **getMetadataValues**(): *[IPointMetadata3D](../interfaces/ipointmetadata3d.md)[]*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L49)*

**Returns:** *[IPointMetadata3D](../interfaces/ipointmetadata3d.md)[]*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L37)*

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L41)*

**Returns:** *DoubleVector*

___

###  getNativeZValues

▸ **getNativeZValues**(): *DoubleVector*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L45)*

**Returns:** *DoubleVector*

___

###  insert

▸ **insert**(`startIndex`: number, `x`: number, `y`: number, `z`: number, `metadata?`: [IPointMetadata3D](../interfaces/ipointmetadata3d.md)): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:119](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`startIndex` | number |
`x` | number |
`y` | number |
`z` | number |
`metadata?` | [IPointMetadata3D](../interfaces/ipointmetadata3d.md) |

**Returns:** *void*

___

###  insertRange

▸ **insertRange**(`startIndex`: number, `xValues`: number[], `yValues`: number[], `zValues`: number[], `metadatas?`: [IPointMetadata3D](../interfaces/ipointmetadata3d.md)[]): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:132](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`startIndex` | number |
`xValues` | number[] |
`yValues` | number[] |
`zValues` | number[] |
`metadatas?` | [IPointMetadata3D](../interfaces/ipointmetadata3d.md)[] |

**Returns:** *void*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Inherited from [BaseDataSeries3D](basedataseries3d.md).[notifyDataChanged](basedataseries3d.md#notifydatachanged)*

*Defined in [src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts:106](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/BaseDataSeries3D.ts#L106)*

Call this method to notify subscribers of [dataChanged](xyzdataseries3d.md#readonly-datachanged) that the data has changed
and [3D JavaScript Chart](https://www.scichart.com/javascript-chart-features)
needs redrawing

**Returns:** *void*

___

###  removeAt

▸ **removeAt**(`index`: number): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *void*

___

###  removeRange

▸ **removeRange**(`startIndex`: number, `count`: number): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:169](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`startIndex` | number |
`count` | number |

**Returns:** *void*

___

###  update

▸ **update**(`index`: number, `x`: number, `y`: number, `z`: number, `metadata?`: [IPointMetadata3D](../interfaces/ipointmetadata3d.md)): *void*

*Defined in [src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/XyzDataSeries3D.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`x` | number |
`y` | number |
`z` | number |
`metadata?` | [IPointMetadata3D](../interfaces/ipointmetadata3d.md) |

**Returns:** *void*
