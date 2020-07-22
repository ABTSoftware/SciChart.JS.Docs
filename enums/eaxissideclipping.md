[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [EAxisSideClipping](eaxissideclipping.md)

# Enumeration: EAxisSideClipping

Defines the Clipping rule for [Javascript 3D Chart](https://www.scichart.com/javascript-chart-features) Axis

**`remarks`** 
Set Clipping rule on the [AxisBase3D.negativeSideClipping](../classes/axisbase3d.md#negativesideclipping) and [AxisBase3D.positiveSideClipping](../classes/axisbase3d.md#positivesideclipping)

## Index

### Enumeration members

* [Default](eaxissideclipping.md#default)
* [None](eaxissideclipping.md#none)
* [VisibleRange](eaxissideclipping.md#visiblerange)

## Enumeration members

###  Default

• **Default**:

*Defined in [src/Charting3D/Visuals/Axis/EAxisSideClipping.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/Axis/EAxisSideClipping.ts#L15)*

Default [Javascript 3D Chart](https://www.scichart.com/javascript-chart-features) Axis clipping is
[AxisCore.visibleRange](../classes/axiscore.md#visiblerange) for X and Z Axis, and None for Y Axis

**`remarks`** 
Data from [3D Javascript Chart](https://www.scichart.com/javascript-chart-features) types can spill
out beyond the confines of the Axis for the YAxis (up/down)
but be clipped to the [AxisCore.visibleRange](../classes/axiscore.md#visiblerange) for the Z/X Axis

___

###  None

• **None**:

*Defined in [src/Charting3D/Visuals/Axis/EAxisSideClipping.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/Axis/EAxisSideClipping.ts#L22)*

3D Axis Clipping is disabled

**`remarks`** 
Data from [3D Javascript Chart](https://www.scichart.com/javascript-chart-features)
types can spill out beyond the confines of the Axis.

___

###  VisibleRange

• **VisibleRange**:

*Defined in [src/Charting3D/Visuals/Axis/EAxisSideClipping.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/Axis/EAxisSideClipping.ts#L30)*

RenderableSeries are clipped by [AxisCore.visibleRange](../classes/axiscore.md#visiblerange)

**`remarks`** 
If a [Javascript Chart](https://www.scichart.com/javascript-chart-features) type such as a
3D Scatter or 3D Surface mesh plot are plotted on this axis,
the data will be clipped to be invisible outside the [AxisCore.visibleRange](../classes/axiscore.md#visiblerange)
