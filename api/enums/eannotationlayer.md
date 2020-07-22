[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [EAnnotationLayer](eannotationlayer.md)

# Enumeration: EAnnotationLayer

Defines the layer where [Annotations](../interfaces/iannotation.md) are drawn
when added to the [SciChartSurface.annotations](../classes/scichartsurface.md#readonly-annotations) collection

## Index

### Enumeration members

* [AboveChart](eannotationlayer.md#abovechart)
* [BelowChart](eannotationlayer.md#belowchart)

## Enumeration members

###  AboveChart

• **AboveChart**:

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L17)*

The [Annotation](../interfaces/iannotation.md) will be displayed above the chart series and grid

**`remarks`** 
This is the default value for [Annotations](../interfaces/iannotation.md)

___

###  BelowChart

• **BelowChart**:

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L25)*

The [Annotation](../interfaces/iannotation.md) will be displayed below the chart series and grid.

**`remarks`** 
Use this for watermarks, e.g. showing an image or text behind the chart.
The Grid lines and Axis Bands will show over the annotation,
so consider setting [AxisCore.axisBandsFill](../classes/axiscore.md#axisbandsfill) to a semi-transparent color to avoid this.
