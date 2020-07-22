[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ISvgAnnotationBaseOptions](isvgannotationbaseoptions.md)

# Interface: ISvgAnnotationBaseOptions

Options passed to the constructor of a [SvgAnnotationBase](../classes/svgannotationbase.md), used to configure it at instantiation time

## Hierarchy

* [IAnnotationBaseOptions](iannotationbaseoptions.md)

  ↳ **ISvgAnnotationBaseOptions**

  ↳ [ITooltipSvgAnnotationOptions](itooltipsvgannotationoptions.md)

  ↳ [ISvgAnnotationOptions](isvgannotationoptions.md)

## Index

### Properties

* [annotationLayer](isvgannotationbaseoptions.md#optional-annotationlayer)
* [isEditable](isvgannotationbaseoptions.md#optional-iseditable)
* [isHidden](isvgannotationbaseoptions.md#optional-ishidden)
* [x1](isvgannotationbaseoptions.md#optional-x1)
* [x2](isvgannotationbaseoptions.md#optional-x2)
* [xAxisId](isvgannotationbaseoptions.md#optional-xaxisid)
* [xCoordShift](isvgannotationbaseoptions.md#optional-xcoordshift)
* [xCoordinateMode](isvgannotationbaseoptions.md#optional-xcoordinatemode)
* [y1](isvgannotationbaseoptions.md#optional-y1)
* [y2](isvgannotationbaseoptions.md#optional-y2)
* [yAxisId](isvgannotationbaseoptions.md#optional-yaxisid)
* [yCoordShift](isvgannotationbaseoptions.md#optional-ycoordshift)
* [yCoordinateMode](isvgannotationbaseoptions.md#optional-ycoordinatemode)

## Properties

### `Optional` annotationLayer

• **annotationLayer**? : *[EAnnotationLayer](../enums/eannotationlayer.md)*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[annotationLayer](iannotationbaseoptions.md#optional-annotationlayer)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L16)*

**`description`** The layer to place the annotation on. See [EAnnotationLayer](../enums/eannotationlayer.md) for a list of values

**`remarks`** applicable only to WebGL annotations

___

### `Optional` isEditable

• **isEditable**? : *boolean*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[isEditable](iannotationbaseoptions.md#optional-iseditable)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L24)*

**`description`** if true, the annotation is editable (can be dragged and manipulated by the user)

___

### `Optional` isHidden

• **isHidden**? : *boolean*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[isHidden](iannotationbaseoptions.md#optional-ishidden)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L20)*

**`description`** if true, the annotation is hidden

___

### `Optional` x1

• **x1**? : *number*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[x1](iannotationbaseoptions.md#optional-x1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L29)*

**`description`** the X1 coordinate of the annotation

**`remarks`** The X1 coordinate obeys [xCoordinateMode](isvgannotationbaseoptions.md#optional-xcoordinatemode) which defines whether the X1 coordinate is a pixel, data-value or relative coordinate

___

### `Optional` x2

• **x2**? : *number*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[x2](iannotationbaseoptions.md#optional-x2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L34)*

**`description`** the X2 coordinate of the annotation

**`remarks`** The X1 coordinate obeys [xCoordinateMode](isvgannotationbaseoptions.md#optional-xcoordinatemode) which defines whether the X2 coordinate is a pixel, data-value or relative coordinate

___

### `Optional` xAxisId

• **xAxisId**? : *string*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[xAxisId](iannotationbaseoptions.md#optional-xaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L79)*

**`summary`** The current XAxis Id that this [IAnnotation](iannotation.md) is bound to

**`description`** By default all Annotations will draw on the first X,Y axis pair in SciChart.
If you want this to change, you must add a second axis to your [SciChartSurface](../classes/scichartsurface.md) and link the [IAnnotation](iannotation.md) by Axis Id.

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

// Add an Annotation on the default axis
const annotation = new LineAnnotation(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
sciChartSurface.renderableSeries.add(annotation);

// Add an Annotation on the specific axis
const annotation2 = new LineAnnotation(wasmContext);
annotation2.xAxisId = "SecondaryXAxis";
annotation2.yAxisId = "SecondaryYAxis";
sciChartSurface.renderableSeries.add(annotation2);
```

**`remarks`** The default value is set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id).

___

### `Optional` xCoordShift

• **xCoordShift**? : *number*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:11](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L11)*

___

### `Optional` xCoordinateMode

• **xCoordinateMode**? : *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[xCoordinateMode](iannotationbaseoptions.md#optional-xcoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:86](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L86)*

The X-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`remarks`** Want to display an annotation stretching across the entire width (or height) or the [SciChartSurface](../classes/scichartsurface.md)?
The [ECoordinateMode](../enums/ecoordinatemode.md) enum has options which allow for relative, absolute or pixel coordinates which define annotation
placement.

___

### `Optional` y1

• **y1**? : *number*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[y1](iannotationbaseoptions.md#optional-y1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L39)*

**`description`** the Y1 coordinate of the annotation

**`remarks`** The Y1 coordinate obeys [xCoordinateMode](isvgannotationbaseoptions.md#optional-xcoordinatemode) which defines whether the Y1 coordinate is a pixel, data-value or relative coordinate

___

### `Optional` y2

• **y2**? : *number*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[y2](iannotationbaseoptions.md#optional-y2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L44)*

**`description`** the Y2 coordinate of the annotation

**`remarks`** The Y2 coordinate obeys [xCoordinateMode](isvgannotationbaseoptions.md#optional-xcoordinatemode) which defines whether the Y2 coordinate is a pixel, data-value or relative coordinate

___

### `Optional` yAxisId

• **yAxisId**? : *string*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[yAxisId](iannotationbaseoptions.md#optional-yaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:121](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L121)*

**`summary`** The current YAxis Id that this [IAnnotation](iannotation.md) is bound to

**`description`** By default all Annotations will draw on the first X,Y axis pair in SciChart.
If you want this to change, you must add a second axis to your [SciChartSurface](../classes/scichartsurface.md) and link the [IAnnotation](iannotation.md) by Axis Id.

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

// Add an Annotation on the default axis
const annotation = new LineAnnotation(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
sciChartSurface.renderableSeries.add(annotation);

// Add an Annotation on the specific axis
const annotation2 = new LineAnnotation(wasmContext);
annotation2.xAxisId = "SecondaryXAxis";
annotation2.yAxisId = "SecondaryYAxis";
sciChartSurface.renderableSeries.add(annotation2);
```

**`remarks`** The default value is set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id).

___

### `Optional` yCoordShift

• **yCoordShift**? : *number*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L12)*

___

### `Optional` yCoordinateMode

• **yCoordinateMode**? : *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Inherited from [IAnnotationBaseOptions](iannotationbaseoptions.md).[yCoordinateMode](iannotationbaseoptions.md#optional-ycoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:128](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L128)*

The Y-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`remarks`** Want to display an annotation stretching across the entire width (or height) or the [SciChartSurface](../classes/scichartsurface.md)?
The [ECoordinateMode](../enums/ecoordinatemode.md) enum has options which allow for relative, absolute or pixel coordinates which define annotation
placement.
