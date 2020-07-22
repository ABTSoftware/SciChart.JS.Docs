[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IAxisCoreOptions](iaxiscoreoptions.md)

# Interface: IAxisCoreOptions

Optional parameters passed to [AxisCore](../classes/axiscore.md) constructor to set defaults at construction time

## Hierarchy

* **IAxisCoreOptions**

  ↳ [IAxisBase3dOptions](iaxisbase3doptions.md)

  ↳ [IAxisBase2dOptions](iaxisbase2doptions.md)

## Index

### Properties

* [autoRange](iaxiscoreoptions.md#optional-autorange)
* [autoTicks](iaxiscoreoptions.md#optional-autoticks)
* [axisTitle](iaxiscoreoptions.md#optional-axistitle)
* [drawLabels](iaxiscoreoptions.md#optional-drawlabels)
* [drawMajorTickLines](iaxiscoreoptions.md#optional-drawmajorticklines)
* [drawMinorTickLines](iaxiscoreoptions.md#optional-drawminorticklines)
* [growBy](iaxiscoreoptions.md#optional-growby)
* [id](iaxiscoreoptions.md#optional-id)
* [isVisible](iaxiscoreoptions.md#optional-isvisible)
* [isXAxis](iaxiscoreoptions.md#optional-isxaxis)
* [maxAutoTicks](iaxiscoreoptions.md#optional-maxautoticks)
* [visibleRange](iaxiscoreoptions.md#optional-visiblerange)

## Properties

### `Optional` autoRange

• **autoRange**? : *EAutoRange*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:141](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L141)*

Sets the [AxisCore.autoRange](../classes/axiscore.md#autorange) mode. For a list of values, see {@link EAutoRange}

___

### `Optional` autoTicks

• **autoTicks**? : *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:172](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L172)*

When true, the [AxisCore.majorDelta](../classes/axiscore.md#majordelta) and [AxisCore.minorDelta](../classes/axiscore.md#minordelta) values will be computed automatically.
Else, the user may specify these values by setting the properties.

___

### `Optional` axisTitle

• **axisTitle**? : *string*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:161](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L161)*

Set the Axis Title string to display on this axis

___

### `Optional` drawLabels

• **drawLabels**? : *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:177](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L177)*

When true, draw labels on the chart, else labels are hidden

**`remarks`** Default value when undefined is true

___

### `Optional` drawMajorTickLines

• **drawMajorTickLines**? : *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:182](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L182)*

When true, draw major ticklines on the chart, else major ticks are hidden

**`remarks`** Default value when undefined is true

___

### `Optional` drawMinorTickLines

• **drawMinorTickLines**? : *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:187](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L187)*

When true, draw minor ticklines on the chart, else minor ticks are hidden

**`remarks`** Default value when undefined is true

___

### `Optional` growBy

• **growBy**? : *NumberRange*

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

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L157)*

When true, the axis is an XAxis

___

### `Optional` maxAutoTicks

• **maxAutoTicks**? : *number*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:167](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L167)*

The maximum number of ticks on the axis when SciChart's Axis is in [AxisCore.autoTicks](../classes/axiscore.md#autoticks) mode

**`remarks`** 
The number of ticks on the axis will never exceed this number, but may be smaller than this number when zooming or panning.

___

### `Optional` visibleRange

• **visibleRange**? : *NumberRange*

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
