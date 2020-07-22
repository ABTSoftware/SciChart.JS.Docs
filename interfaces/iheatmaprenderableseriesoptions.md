[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IHeatmapRenderableSeriesOptions](iheatmaprenderableseriesoptions.md)

# Interface: IHeatmapRenderableSeriesOptions

## Hierarchy

* [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md)

  ↳ **IHeatmapRenderableSeriesOptions**

## Index

### Properties

* [colorMap](iheatmaprenderableseriesoptions.md#optional-colormap)
* [dataSeries](iheatmaprenderableseriesoptions.md#optional-dataseries)
* [effect](iheatmaprenderableseriesoptions.md#optional-effect)
* [isVisible](iheatmaprenderableseriesoptions.md#optional-isvisible)
* [pointMarker](iheatmaprenderableseriesoptions.md#optional-pointmarker)
* [stroke](iheatmaprenderableseriesoptions.md#optional-stroke)
* [strokeThickness](iheatmaprenderableseriesoptions.md#optional-strokethickness)
* [xAxisId](iheatmaprenderableseriesoptions.md#optional-xaxisid)
* [yAxisId](iheatmaprenderableseriesoptions.md#optional-yaxisid)

## Properties

### `Optional` colorMap

• **colorMap**? : *[HeatmapColorMap](../classes/heatmapcolormap.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts#L12)*

___

### `Optional` dataSeries

• **dataSeries**? : *any*

*Overrides [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[dataSeries](ibaserenderableseriesoptions.md#optional-dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts#L13)*

___

### `Optional` effect

• **effect**? : *[ShaderEffect](../classes/shadereffect.md)*

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[effect](ibaserenderableseriesoptions.md#optional-effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:120](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L120)*

An optional [ShaderEffect](../classes/shadereffect.md) for modifying the render output of this [IRenderableSeries](irenderableseries.md)

**`remarks`** Options include [GlowEffect](../classes/gloweffect.md) and [ShadowEffect](../classes/shadoweffect.md). Apply an effect to see how it modifies rendering!

___

### `Optional` isVisible

• **isVisible**? : *boolean*

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[isVisible](ibaserenderableseriesoptions.md#optional-isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L115)*

When true, the series is visible and drawn

___

### `Optional` pointMarker

• **pointMarker**? : *[IPointMarker](ipointmarker.md)*

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[pointMarker](ibaserenderableseriesoptions.md#optional-pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L34)*

A [Point Marker](ipointmarker.md) which is used to draw an optional point-marker at each data-point. Applicable to some series types only

___

### `Optional` stroke

• **stroke**? : *string*

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[stroke](ibaserenderableseriesoptions.md#optional-stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L39)*

A Stroke for lines, outlines and edges of this RenderableSeries

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

### `Optional` strokeThickness

• **strokeThickness**? : *number*

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[strokeThickness](ibaserenderableseriesoptions.md#optional-strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L43)*

The Stroke Thickness for lines, outlines and edges of this RenderableSeries

___

### `Optional` xAxisId

• **xAxisId**? : *string*

*Overrides [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[xAxisId](ibaserenderableseriesoptions.md#optional-xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts#L14)*

___

### `Optional` yAxisId

• **yAxisId**? : *string*

*Overrides [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[yAxisId](ibaserenderableseriesoptions.md#optional-yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries.ts#L15)*
