[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BubbleSeriesDrawingProvider](bubbleseriesdrawingprovider.md)

# Class: BubbleSeriesDrawingProvider

## Hierarchy

* [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md)‹[FastBubbleRenderableSeries](fastbubblerenderableseries.md)›

  ↳ **BubbleSeriesDrawingProvider**

## Implements

* [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)

## Index

### Constructors

* [constructor](bubbleseriesdrawingprovider.md#constructor)

### Methods

* [applyStrokePaletting](bubbleseriesdrawingprovider.md#applystrokepaletting)
* [createPen](bubbleseriesdrawingprovider.md#createpen)
* [createSolidBrush](bubbleseriesdrawingprovider.md#createsolidbrush)
* [delete](bubbleseriesdrawingprovider.md#delete)
* [draw](bubbleseriesdrawingprovider.md#draw)
* [onAttachSeries](bubbleseriesdrawingprovider.md#onattachseries)
* [onDetachSeries](bubbleseriesdrawingprovider.md#ondetachseries)
* [onSeriesPropertyChange](bubbleseriesdrawingprovider.md#onseriespropertychange)

## Constructors

###  constructor

\+ **new BubbleSeriesDrawingProvider**(`webAssemblyContext`: TSciChart, `parentSeries`: [FastBubbleRenderableSeries](fastbubblerenderableseries.md)): *[BubbleSeriesDrawingProvider](bubbleseriesdrawingprovider.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`parentSeries` | [FastBubbleRenderableSeries](fastbubblerenderableseries.md) |

**Returns:** *[BubbleSeriesDrawingProvider](bubbleseriesdrawingprovider.md)*

## Methods

###  applyStrokePaletting

▸ **applyStrokePaletting**(`linesPen`: [ISCRTPen](../interfaces/iscrtpen.md), `palettedColors`: UIntVector): *UIntVector*

*Inherited from [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[applyStrokePaletting](baseseriesdrawingprovider.md#applystrokepaletting)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L30)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L79)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L90)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts#L59)*

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[draw](baseseriesdrawingprovider.md#abstract-draw)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts#L28)*

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

*Inherited from [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onAttachSeries](baseseriesdrawingprovider.md#onattachseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L109)*

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Inherited from [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onDetachSeries](baseseriesdrawingprovider.md#ondetachseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L113)*

**Returns:** *void*

___

###  onSeriesPropertyChange

▸ **onSeriesPropertyChange**(`propertyName`: string): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Overrides [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md).[onSeriesPropertyChange](baseseriesdrawingprovider.md#abstract-onseriespropertychange)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BubbleSeriesDrawingProvider.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*
