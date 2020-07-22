[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ISeriesDrawingProvider](iseriesdrawingprovider.md)

# Interface: ISeriesDrawingProvider

## Hierarchy

* IDeletable

  ↳ **ISeriesDrawingProvider**

## Implemented by

* [BandSeriesDrawingProvider](../classes/bandseriesdrawingprovider.md)
* [BaseSeriesDrawingProvider](../classes/baseseriesdrawingprovider.md)
* [BubbleSeriesDrawingProvider](../classes/bubbleseriesdrawingprovider.md)
* [ColumnSeriesDrawingProvider](../classes/columnseriesdrawingprovider.md)
* [LineSeriesDrawingProvider](../classes/lineseriesdrawingprovider.md)
* [MountainSeriesDrawingProvider](../classes/mountainseriesdrawingprovider.md)
* [OhlcSeriesDrawingProvider](../classes/ohlcseriesdrawingprovider.md)
* [PointMarkerDrawingProvider](../classes/pointmarkerdrawingprovider.md)
* [UniformHeatmapDrawingProvider](../classes/uniformheatmapdrawingprovider.md)

## Index

### Methods

* [delete](iseriesdrawingprovider.md#delete)
* [draw](iseriesdrawingprovider.md#draw)
* [onAttachSeries](iseriesdrawingprovider.md#onattachseries)
* [onDetachSeries](iseriesdrawingprovider.md#ondetachseries)
* [onSeriesPropertyChange](iseriesdrawingprovider.md#onseriespropertychange)

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

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](../classes/webglrendercontext2d.md), `renderPassData`: [RenderPassData](../classes/renderpassdata.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts:6](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](../classes/webglrendercontext2d.md) |
`renderPassData` | [RenderPassData](../classes/renderpassdata.md) |

**Returns:** *void*

___

###  onAttachSeries

▸ **onAttachSeries**(): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts#L7)*

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts#L8)*

**Returns:** *void*

___

###  onSeriesPropertyChange

▸ **onSeriesPropertyChange**(`propertyName`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts:9](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/DrawingProviders/ISeriesDrawingProvider.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*
