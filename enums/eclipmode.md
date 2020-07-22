[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [EClipMode](eclipmode.md)

# Enumeration: EClipMode

Defines the clipping mode for scrolling operations found on [AxisBase2D.scroll](../classes/axisbase2d.md#scroll)

## Index

### Enumeration members

* [ClipAtExtents](eclipmode.md#clipatextents)
* [ClipAtMax](eclipmode.md#clipatmax)
* [ClipAtMin](eclipmode.md#clipatmin)
* [None](eclipmode.md#none)
* [StretchAtExtents](eclipmode.md#stretchatextents)

## Enumeration members

###  ClipAtExtents

• **ClipAtExtents**:

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L50)*

Clips the [AxisBase2D.visibleRange](../classes/axisbase2d.md#visiblerange) to not allow scrolling past the minimum or maximum of the Axis range

___

###  ClipAtMax

• **ClipAtMax**:

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L46)*

Clips the [AxisBase2D.visibleRange](../classes/axisbase2d.md#visiblerange) to not allow scrolling past the maximum of the Axis range

___

###  ClipAtMin

• **ClipAtMin**:

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L42)*

Clips the [AxisBase2D.visibleRange](../classes/axisbase2d.md#visiblerange) to not allow scrolling past the minimum of the Axis range

___

###  None

• **None**:

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L34)*

Do not clip when scrolling the Axis

**`remarks`** 
Use this to resolve issues such as scaling or stretching
when the user pans or scrolls outside of the range of the data.

___

###  StretchAtExtents

• **StretchAtExtents**:

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L38)*

Stretch the [AxisBase2D.visibleRange](../classes/axisbase2d.md#visiblerange) when scrolling past the extents of the data.
