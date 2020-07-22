[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ECoordinateMode](ecoordinatemode.md)

# Enumeration: ECoordinateMode

Defines the CoordinateMode for [Annotations](../classes/annotationbase.md) within SciChart's
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

## Index

### Enumeration members

* [DataValue](ecoordinatemode.md#datavalue)
* [Pixel](ecoordinatemode.md#pixel)
* [Relative](ecoordinatemode.md#relative)

## Enumeration members

###  DataValue

• **DataValue**:

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L142)*

The [Annotation.x1](../classes/annotationbase.md#x1), [x2](../classes/annotationbase.md#x2),
[y1](../classes/annotationbase.md#y1), [y2](../classes/annotationbase.md#y2) coordinate is a data-value,
corresponding to the value on the [Axis](../classes/axisbase2d.md) or in the
[DataSeries](../interfaces/irenderableseries.md#dataseries)

___

###  Pixel

• **Pixel**:

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:149](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L149)*

The [Annotation.x1](../classes/annotationbase.md#x1), [x2](../classes/annotationbase.md#x2),
[y1](../classes/annotationbase.md#y1), [y2](../classes/annotationbase.md#y2) coordinate is a pixel coordinate,
corresponding to the distance from the top-left of the
[SciChartSurface](../classes/scichartsurface.md)

___

###  Relative

• **Relative**:

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L156)*

The [Annotation.x1](../classes/annotationbase.md#x1), [x2](../classes/annotationbase.md#x2),
[y1](../classes/annotationbase.md#y1), [y2](../classes/annotationbase.md#y2) coordinate is relative,
where 0.0 corresponds to the left (or top) of the [SciChartSurface](../classes/scichartsurface.md)
and 1.0 corresponds to the right (or bottom) of the [SciChartSurface](../classes/scichartsurface.md)
