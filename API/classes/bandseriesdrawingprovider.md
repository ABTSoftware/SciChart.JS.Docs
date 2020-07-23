[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [BandSeriesDrawingProvider](bandseriesdrawingprovider.md)

# Class: BandSeriesDrawingProvider

## Hierarchy

* [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md)‹[FastBandRenderableSeries](fastbandrenderableseries.md)›

  ↳ **BandSeriesDrawingProvider**

## Implements

* [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)

## Index

### Constructors

* [constructor](bandseriesdrawingprovider.md#constructor)

### Methods

* [applyStrokePaletting](bandseriesdrawingprovider.md#applystrokepaletting)
* [createPen](bandseriesdrawingprovider.md#createpen)
* [createSolidBrush](bandseriesdrawingprovider.md#createsolidbrush)
* [delete](bandseriesdrawingprovider.md#delete)
* [draw](bandseriesdrawingprovider.md#draw)
* [onAttachSeries](bandseriesdrawingprovider.md#onattachseries)
* [onDetachSeries](bandseriesdrawingprovider.md#ondetachseries)
* [onSeriesPropertyChange](bandseriesdrawingprovider.md#onseriespropertychange)

## Constructors

###  constructor

\+ **new BandSeriesDrawingProvider**(`webAssemblyContext`: TSciChart, `parentSeries`: [FastBandRenderableSeries](fastbandrenderableseries.md)): *[BandSeriesDrawingProvider](bandseriesdrawingprovider.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`parentSeries` | [FastBandRenderableSeries](fastbandrenderableseries.md) |

**Returns:** *[BandSeriesDrawingProvider](bandseriesdrawingprovider.md)*

## Methods

###  applyStrokePaletting

▸ **applyStrokePaletting**(`linesPen`: [ISCRTPen](../interfaces/iscrtpen.md), `palettedColors`: UIntVector): *UIntVector*

*Inherited from [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[applyStrokePaletting](baseseriesdrawingprovider.md#applystrokepaletting)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L30)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L79)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L90)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts#L38)*

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[draw](baseseriesdrawingprovider.md#abstract-draw)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts#L46)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts#L21)*

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onDetachSeries](baseseriesdrawingprovider.md#ondetachseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts#L33)*

**Returns:** *void*

___

###  onSeriesPropertyChange

▸ **onSeriesPropertyChange**(`propertyName`: string): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onSeriesPropertyChange](baseseriesdrawingprovider.md#abstract-onseriespropertychange)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BandSeriesDrawingProvider.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*
