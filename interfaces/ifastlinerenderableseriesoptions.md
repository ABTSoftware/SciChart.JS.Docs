[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IFastLineRenderableSeriesOptions](ifastlinerenderableseriesoptions.md)

# Interface: IFastLineRenderableSeriesOptions

## Hierarchy

* [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md)

  ↳ **IFastLineRenderableSeriesOptions**

## Index

### Properties

* [dataSeries](ifastlinerenderableseriesoptions.md#optional-dataseries)
* [effect](ifastlinerenderableseriesoptions.md#optional-effect)
* [isVisible](ifastlinerenderableseriesoptions.md#optional-isvisible)
* [pointMarker](ifastlinerenderableseriesoptions.md#optional-pointmarker)
* [stroke](ifastlinerenderableseriesoptions.md#optional-stroke)
* [strokeThickness](ifastlinerenderableseriesoptions.md#optional-strokethickness)
* [xAxisId](ifastlinerenderableseriesoptions.md#optional-xaxisid)
* [yAxisId](ifastlinerenderableseriesoptions.md#optional-yaxisid)

## Properties

### `Optional` dataSeries

• **dataSeries**? : *[IDataSeries](idataseries.md)*

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[dataSeries](ibaserenderableseriesoptions.md#optional-dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L30)*

The [DataSeries](idataseries.md) which provides a datasource for this [IRenderableSeries](irenderableseries.md) to draw

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

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[xAxisId](ibaserenderableseriesoptions.md#optional-xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L77)*

**`summary`** The current XAxis Id that this [BaseRenderableSeries](../classes/baserenderableseries.md) is bound to

**`description`** By default all series will draw on the first X,Y axis pair in SciChart.
If you want this to change, you must add a second axis to your [SciChartSurface](../classes/scichartsurface.md) and link the [BaseRenderableSeries](../classes/baserenderableseries.md) by Axis Id.

For example:
```ts
const sciChartSurface: SciChartSurface;
const primaryXAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
const primaryYAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID

const secondaryXAxis = new NumericAxis(wasmContext); // For subsequent X,Y axis set an Id
secondaryXAxis.id = "SecondaryXAxis";
const secondaryYAxis = new NumericAxis(wasmContext);
secondaryYAxis.id = "SecondaryYAxis";

// Add all Axis to the chart
sciChartSurface.xAxes.add(primaryXAxis);
sciChartSurface.yAxes.add(primaryYAxis);
sciChartSurface.xAxes.add(secondaryXAxis);
sciChartSurface.yAxes.add(secondaryYAxis);

// Add a series on the default axis
const renderSeries = new FastLineRenderableSeries(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
sciChartSurface.renderableSeries.add(renderSeries);

// Add a series on the specific axis
const renderSeries2 = new FastLineRenderableSeries(wasmContext);
renderSeries2.xAxisId = "SecondaryXAxis";
renderSeries2.yAxisId = "SecondaryYAxis";
```

**`remarks`** The default value is set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id).

___

### `Optional` yAxisId

• **yAxisId**? : *string*

*Inherited from [IBaseRenderableSeriesOptions](ibaserenderableseriesoptions.md).[yAxisId](ibaserenderableseriesoptions.md#optional-yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:111](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L111)*

**`summary`** The current YAxis Id that this [BaseRenderableSeries](../classes/baserenderableseries.md) is bound to

**`description`** By default all series will draw on the first X,Y axis pair in SciChart.
If you want this to change, you must add a second axis to your [SciChartSurface](../classes/scichartsurface.md) and link the [BaseRenderableSeries](../classes/baserenderableseries.md) by Axis Id.

For example:
```ts
const sciChartSurface: SciChartSurface;
const primaryXAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
const primaryYAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID

const secondaryXAxis = new NumericAxis(wasmContext); // For subsequent X,Y axis set an Id
secondaryXAxis.id = "SecondaryXAxis";
const secondaryYAxis = new NumericAxis(wasmContext);
secondaryYAxis.id = "SecondaryYAxis";

// Add all Axis to the chart
sciChartSurface.xAxes.add(primaryXAxis);
sciChartSurface.yAxes.add(primaryYAxis);
sciChartSurface.xAxes.add(secondaryXAxis);
sciChartSurface.yAxes.add(secondaryYAxis);

// Add a series on the default axis
const renderSeries = new FastLineRenderableSeries(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
sciChartSurface.renderableSeries.add(renderSeries);

// Add a series on the specific axis
const renderSeries2 = new FastLineRenderableSeries(wasmContext);
renderSeries2.xAxisId = "SecondaryXAxis";
renderSeries2.yAxisId = "SecondaryYAxis";
```

**`remarks`** The default value is set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id).
