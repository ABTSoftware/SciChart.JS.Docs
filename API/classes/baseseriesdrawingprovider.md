[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseSeriesDrawingProvider](baseseriesdrawingprovider.md)

# Class: BaseSeriesDrawingProvider ‹**T**›

## Type parameters

▪ **T**: *[IRenderableSeries](../interfaces/irenderableseries.md)*

## Hierarchy

* **BaseSeriesDrawingProvider**

  ↳ [LineSeriesDrawingProvider](lineseriesdrawingprovider.md)

  ↳ [PointMarkerDrawingProvider](pointmarkerdrawingprovider.md)

  ↳ [BandSeriesDrawingProvider](bandseriesdrawingprovider.md)

  ↳ [BubbleSeriesDrawingProvider](bubbleseriesdrawingprovider.md)

  ↳ [ColumnSeriesDrawingProvider](columnseriesdrawingprovider.md)

  ↳ [MountainSeriesDrawingProvider](mountainseriesdrawingprovider.md)

  ↳ [OhlcSeriesDrawingProvider](ohlcseriesdrawingprovider.md)

  ↳ [UniformHeatmapDrawingProvider](uniformheatmapdrawingprovider.md)

## Implements

* [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)

## Index

### Methods

* [applyStrokePaletting](baseseriesdrawingprovider.md#applystrokepaletting)
* [createPen](baseseriesdrawingprovider.md#createpen)
* [createSolidBrush](baseseriesdrawingprovider.md#createsolidbrush)
* [delete](baseseriesdrawingprovider.md#abstract-delete)
* [draw](baseseriesdrawingprovider.md#abstract-draw)
* [onAttachSeries](baseseriesdrawingprovider.md#onattachseries)
* [onDetachSeries](baseseriesdrawingprovider.md#ondetachseries)
* [onSeriesPropertyChange](baseseriesdrawingprovider.md#abstract-onseriespropertychange)

## Methods

###  applyStrokePaletting

▸ **applyStrokePaletting**(`linesPen`: [ISCRTPen](../interfaces/iscrtpen.md), `palettedColors`: UIntVector): *UIntVector*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`linesPen` | [ISCRTPen](../interfaces/iscrtpen.md) |
`palettedColors` | UIntVector |

**Returns:** *UIntVector*

___

###  createPen

▸ **createPen**(`htmlColorCode`: string, `strokeThickness`: number): *SCRTPen*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |
`strokeThickness` | number |

**Returns:** *SCRTPen*

___

###  createSolidBrush

▸ **createSolidBrush**(`htmlColorCode`: string): *SCRTBrush*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *SCRTBrush*

___

### `Abstract` delete

▸ **delete**(): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L103)*

**Returns:** *void*

___

### `Abstract` draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:105](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L105)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L109)*

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L113)*

**Returns:** *void*

___

### `Abstract` onSeriesPropertyChange

▸ **onSeriesPropertyChange**(`propertyName`: string): *void*

*Implementation of [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts:107](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/BaseSeriesDrawingProvider.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*
