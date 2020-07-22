[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [INumericAxis3dOptions](inumericaxis3doptions.md)

# Interface: INumericAxis3dOptions

## Hierarchy

  ↳ [IAxisBase3dOptions](iaxisbase3doptions.md)

  ↳ **INumericAxis3dOptions**

## Index

### Properties

* [autoRange](inumericaxis3doptions.md#optional-autorange)
* [autoTicks](inumericaxis3doptions.md#optional-autoticks)
* [axisTitle](inumericaxis3doptions.md#optional-axistitle)
* [drawLabels](inumericaxis3doptions.md#optional-drawlabels)
* [drawMajorTickLines](inumericaxis3doptions.md#optional-drawmajorticklines)
* [drawMinorTickLines](inumericaxis3doptions.md#optional-drawminorticklines)
* [growBy](inumericaxis3doptions.md#optional-growby)
* [id](inumericaxis3doptions.md#optional-id)
* [isVisible](inumericaxis3doptions.md#optional-isvisible)
* [isXAxis](inumericaxis3doptions.md#optional-isxaxis)
* [labelFormat](inumericaxis3doptions.md#optional-labelformat)
* [maxAutoTicks](inumericaxis3doptions.md#optional-maxautoticks)
* [visibleRange](inumericaxis3doptions.md#optional-visiblerange)

## Properties

### `Optional` autoRange

• **autoRange**? : *EAutoRange*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[autoRange](iaxiscoreoptions.md#optional-autorange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:141](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L141)*

Sets the [AxisCore.autoRange](../classes/axiscore.md#autorange) mode. For a list of values, see {@link EAutoRange}

___

### `Optional` autoTicks

• **autoTicks**? : *boolean*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[autoTicks](iaxiscoreoptions.md#optional-autoticks)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:172](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L172)*

When true, the [AxisCore.majorDelta](../classes/axiscore.md#majordelta) and [AxisCore.minorDelta](../classes/axiscore.md#minordelta) values will be computed automatically.
Else, the user may specify these values by setting the properties.

___

### `Optional` axisTitle

• **axisTitle**? : *string*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[axisTitle](iaxiscoreoptions.md#optional-axistitle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:161](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L161)*

Set the Axis Title string to display on this axis

___

### `Optional` drawLabels

• **drawLabels**? : *boolean*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[drawLabels](iaxiscoreoptions.md#optional-drawlabels)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:177](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L177)*

When true, draw labels on the chart, else labels are hidden

**`remarks`** Default value when undefined is true

___

### `Optional` drawMajorTickLines

• **drawMajorTickLines**? : *boolean*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[drawMajorTickLines](iaxiscoreoptions.md#optional-drawmajorticklines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:182](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L182)*

When true, draw major ticklines on the chart, else major ticks are hidden

**`remarks`** Default value when undefined is true

___

### `Optional` drawMinorTickLines

• **drawMinorTickLines**? : *boolean*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[drawMinorTickLines](iaxiscoreoptions.md#optional-drawminorticklines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:187](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L187)*

When true, draw minor ticklines on the chart, else minor ticks are hidden

**`remarks`** Default value when undefined is true

___

### `Optional` growBy

• **growBy**? : *NumberRange*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[growBy](iaxiscoreoptions.md#optional-growby)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:137](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L137)*

Sets GrowBy: a padding factor on the axis

**`description`** 
Growby factor is a padding factor set on the axis. For example if you want to have a constant padding above and below the axis,
the following code will result in a 10% (min) and 20% (max) padding outside of the datarange.
```ts
axis.growBy = new NumberRange(0.1, 0.2);
```

___

### `Optional` id

• **id**? : *string*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[id](iaxiscoreoptions.md#optional-id)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:127](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L127)*

The Axis Id - a unique string ID for this axis

**`description`** 
By default all axis in SciChart have Id=[AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id). Also, all [RenderableSeries](../classes/baserenderableseries.md)
have an xAxisId and yAxisId property set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id). [Annotations](../classes/annotationbase.md) also have an xAxisId and
yAxisId also set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id). Some [Chart Modifiers](../classes/chartmodifierbase.md) have an x,yAxisId property to filter
their operations to an axis.

In multi-axis scenarios you will need to set the xAxisId/yAxisId properties of series, annotations, modifiers to match that of the axis
you want them to be registered on.

___

### `Optional` isVisible

• **isVisible**? : *boolean*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[isVisible](iaxiscoreoptions.md#optional-isvisible)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:153](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L153)*

When true, the axis is visible. Default value is also true for the axis

**`remarks`** 
An invisible axis can be used to scale series to the viewport. For example:

 - have a chart with two-YAxis
 - have one series on the first axis and another series on the second axis
 - set second [AxisCore.isVisible](../classes/axiscore.md#isvisible) = false, and [AxisCore.autoRange](../classes/axiscore.md#autorange) = {@link EAutoRange.Always}

 This will scale the series on the second axis to the viewport, on an invisible, auto-ranged axis

___

### `Optional` isXAxis

• **isXAxis**? : *boolean*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[isXAxis](iaxiscoreoptions.md#optional-isxaxis)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L157)*

When true, the axis is an XAxis

___

### `Optional` labelFormat

• **labelFormat**? : *[ENumericFormat](../enums/enumericformat.md)*

*Defined in [src/Charting3D/Visuals/Axis/NumericAxis3D.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/Axis/NumericAxis3D.ts#L14)*

___

### `Optional` maxAutoTicks

• **maxAutoTicks**? : *number*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[maxAutoTicks](iaxiscoreoptions.md#optional-maxautoticks)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:167](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L167)*

The maximum number of ticks on the axis when SciChart's Axis is in [AxisCore.autoTicks](../classes/axiscore.md#autoticks) mode

**`remarks`** 
The number of ticks on the axis will never exceed this number, but may be smaller than this number when zooming or panning.

___

### `Optional` visibleRange

• **visibleRange**? : *NumberRange*

*Inherited from [IAxisCoreOptions](iaxiscoreoptions.md).[visibleRange](iaxiscoreoptions.md#optional-visiblerange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L115)*

The VisibleRange is the range of the Axis (min to max).

**`description`** 
For example, if you have data-values from 0 to 100 in your [DataSeries](../classes/xydataseries.md), but you only want to show
values from 15-25 on the axis, then set the visibleRange as follows:
```ts
axis.visibleRange = new NumberRange(15, 25);
```

**`remarks`** 
The visibleRange is a data-value for [NumericAxis](../classes/numericaxis.md), @{link NumericAxis3D} but refers to an **index** to the data
for [CategoryAxis](../classes/categoryaxis.md) types.
