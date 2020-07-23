[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [MountainSeriesDrawingProvider](mountainseriesdrawingprovider.md)

# Class: MountainSeriesDrawingProvider

## Hierarchy

* [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md)‹[FastMountainRenderableSeries](fastmountainrenderableseries.md)›

  ↳ **MountainSeriesDrawingProvider**

## Implements

* [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)

## Index

### Constructors

* [constructor](mountainseriesdrawingprovider.md#constructor)

### Methods

* [applyStrokePaletting](mountainseriesdrawingprovider.md#applystrokepaletting)
* [createPen](mountainseriesdrawingprovider.md#createpen)
* [createSolidBrush](mountainseriesdrawingprovider.md#createsolidbrush)
* [delete](mountainseriesdrawingprovider.md#delete)
* [draw](mountainseriesdrawingprovider.md#draw)
* [onAttachSeries](mountainseriesdrawingprovider.md#onattachseries)
* [onDetachSeries](mountainseriesdrawingprovider.md#ondetachseries)
* [onSeriesPropertyChange](mountainseriesdrawingprovider.md#onseriespropertychange)

## Constructors

###  constructor

\+ **new MountainSeriesDrawingProvider**(`webAssemblyContext`: TSciChart, `parentSeries`: [FastMountainRenderableSeries](fastmountainrenderableseries.md)): *[MountainSeriesDrawingProvider](mountainseriesdrawingprovider.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`parentSeries` | [FastMountainRenderableSeries](fastmountainrenderableseries.md) |

**Returns:** *[MountainSeriesDrawingProvider](mountainseriesdrawingprovider.md)*

## Methods

###  applyStrokePaletting

▸ **applyStrokePaletting**(`linesPen`: [ISCRTPen](../interfaces/iscrtpen.md), `palettedColors`: UIntVector): *UIntVector*

*Inherited from [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[applyStrokePaletting](baseseriesdrawingprovider.md#applystrokepaletting)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`linesPen` | [ISCRTPen](../interfaces/iscrtpen.md) |
`palettedColors` | UIntVector |

**Returns:** *UIntVector*

___

###  createPen

▸ **createPen**(`htmlColorCode`: string, `strokeThickness`: number): *SCRTPen*

*Inherited from [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[createPen](baseseriesdrawingprovider.md#createpen)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |
`strokeThickness` | number |

**Returns:** *SCRTPen*

___

###  createSolidBrush

▸ **createSolidBrush**(`htmlColorCode`: string): *SCRTBrush*

*Inherited from [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[createSolidBrush](baseseriesdrawingprovider.md#createsolidbrush)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *SCRTBrush*

___

###  delete

▸ **delete**(): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[delete](baseseriesdrawingprovider.md#abstract-delete)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts#L22)*

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[draw](baseseriesdrawingprovider.md#abstract-draw)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |
`renderPassData` | [RenderPassData](renderpassdata.md) |

**Returns:** *void*

___

###  onAttachSeries

▸ **onAttachSeries**(): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onAttachSeries](baseseriesdrawingprovider.md#onattachseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts#L88)*

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onDetachSeries](baseseriesdrawingprovider.md#ondetachseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts:98](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts#L98)*

**Returns:** *void*

___

###  onSeriesPropertyChange

▸ **onSeriesPropertyChange**(`propertyName`: string): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onSeriesPropertyChange](baseseriesdrawingprovider.md#abstract-onseriespropertychange)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/MountainSeriesDrawingProvider.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*
