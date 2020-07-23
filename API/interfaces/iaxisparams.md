[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IAxisParams](iaxisparams.md)

# Interface: IAxisParams

Interface to minimal set of parameters which define an [Axis](../classes/axiscore.md) in SciChart

## Hierarchy

* **IAxisParams**

## Implemented by

* [AxisBase2D](../classes/axisbase2d.md)
* [AxisBase3D](../classes/axisbase3d.md)
* [AxisCore](../classes/axiscore.md)
* [CategoryAxis](../classes/categoryaxis.md)
* [NumericAxis](../classes/numericaxis.md)
* [NumericAxis3D](../classes/numericaxis3d.md)

## Index

### Properties

* [majorDelta](iaxisparams.md#majordelta)
* [minorDelta](iaxisparams.md#minordelta)
* [visibleRange](iaxisparams.md#visiblerange)

## Properties

###  majorDelta

• **majorDelta**: *number*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:86](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L86)*

The MajorDelta is the spacing between major gridlines and axis labels.

**`remarks`** 
This is internally computed via the [Delta Calculator](../classes/axiscore.md#deltacalculator), however it can be explicitly set here
in which case you should also set [AxisCore.minorDelta](../classes/axiscore.md#minordelta) and [AxisCore.autoTicks](../classes/axiscore.md#autoticks) = false.

It is also possible to override and create custom implementations of the [DeltaCalculator](../classes/deltacalculator.md) for full control over axis gridline
spacing.

___

###  minorDelta

• **minorDelta**: *number*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L96)*

The MinorDelta is the spacing between minor gridlines.

**`remarks`** 
This is internally computed via the [Delta Calculator](../classes/axiscore.md#deltacalculator), however it can be explicitly set here
in which case you should also set [AxisCore.majorDelta](../classes/axiscore.md#majordelta) and [AxisCore.autoTicks](../classes/axiscore.md#autoticks) = false.

It is also possible to override and create custom implementations of the [DeltaCalculator](../classes/deltacalculator.md) for full control over axis gridline
spacing.

___

###  visibleRange

• **visibleRange**: *NumberRange*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L76)*

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
