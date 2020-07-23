[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IAnnotation](iannotation.md)

# Interface: IAnnotation

Defines the interface to an Annotation - a type of marker, text label, line or custom UI overlay on a 2D Cartesian [SciChartSurface](../classes/scichartsurface.md)

## Hierarchy

* IDeletable

  ↳ **IAnnotation**

## Implemented by

* [AnnotationBase](../classes/annotationbase.md)
* [BoxAnnotation](../classes/boxannotation.md)
* [LineAnnotation](../classes/lineannotation.md)
* [MarkerSvgAnnotation](../classes/markersvgannotation.md)
* [RenderContextAnnotationBase](../classes/rendercontextannotationbase.md)
* [SvgAnnotation](../classes/svgannotation.md)
* [SvgAnnotationBase](../classes/svgannotationbase.md)
* [TooltipSvgAnnotation](../classes/tooltipsvgannotation.md)

## Index

### Properties

* [annotationLayer](iannotation.md#annotationlayer)
* [invalidateParentCallback](iannotation.md#invalidateparentcallback)
* [isEditable](iannotation.md#iseditable)
* [isHidden](iannotation.md#ishidden)
* [parentSurface](iannotation.md#parentsurface)
* [type](iannotation.md#readonly-type)
* [x1](iannotation.md#x1)
* [x2](iannotation.md#x2)
* [xAxisId](iannotation.md#xaxisid)
* [xCoordinateMode](iannotation.md#xcoordinatemode)
* [y1](iannotation.md#y1)
* [y2](iannotation.md#y2)
* [yAxisId](iannotation.md#yaxisid)
* [yCoordinateMode](iannotation.md#ycoordinatemode)

### Methods

* [delete](iannotation.md#delete)
* [onAttach](iannotation.md#onattach)
* [onDetach](iannotation.md#ondetach)

## Properties

###  annotationLayer

• **annotationLayer**: *[EAnnotationLayer](../enums/eannotationlayer.md)*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L65)*

**`description`** The layer to place the annotation on. See [EAnnotationLayer](../enums/eannotationlayer.md) for a list of values

**`remarks`** applicable only to WebGL annotations

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L69)*

**`description`** callback which notifies the parent [SciChartSurface](../classes/scichartsurface.md) it's time to draw

#### Type declaration:

▸ (): *void*

___

###  isEditable

• **isEditable**: *boolean*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:177](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L177)*

**`description`** if true, the annotation is editable (can be dragged and manipulated by the user)

___

###  isHidden

• **isHidden**: *boolean*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:181](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L181)*

**`description`** if true, the annotation is hidden

___

###  parentSurface

• **parentSurface**: *[SciChartSurface](../classes/scichartsurface.md)*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:185](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L185)*

**`description`** the parent SciChartSurface for this annotation

___

### `Readonly` type

• **type**: *[EAnnotationType](../enums/eannotationtype.md)*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L60)*

**`description`** annotation type. See [EAnnotationType](../enums/eannotationtype.md) for a list of values

___

###  x1

• **x1**: *number*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:144](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L144)*

**`description`** the X1 coordinate of the annotation

**`remarks`** The X1 coordinate obeys [xCoordinateMode](iannotation.md#xcoordinatemode) which defines whether the X1 coordinate is a pixel, data-value or relative coordinate

___

###  x2

• **x2**: *number*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:149](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L149)*

**`description`** the X2 coordinate of the annotation

**`remarks`** The X1 coordinate obeys [xCoordinateMode](iannotation.md#xcoordinatemode) which defines whether the X2 coordinate is a pixel, data-value or relative coordinate

___

###  xAxisId

• **xAxisId**: *string*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L104)*

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

###  xCoordinateMode

• **xCoordinateMode**: *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L166)*

The X-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`remarks`** Want to display an annotation stretching across the entire width (or height) or the [SciChartSurface](../classes/scichartsurface.md)?
The [ECoordinateMode](../enums/ecoordinatemode.md) enum has options which allow for relative, absolute or pixel coordinates which define annotation
placement.

___

###  y1

• **y1**: *number*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:154](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L154)*

**`description`** the Y1 coordinate of the annotation

**`remarks`** The Y1 coordinate obeys [xCoordinateMode](iannotation.md#xcoordinatemode) which defines whether the Y1 coordinate is a pixel, data-value or relative coordinate

___

###  y2

• **y2**: *number*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:159](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L159)*

**`description`** the Y2 coordinate of the annotation

**`remarks`** The Y2 coordinate obeys [xCoordinateMode](iannotation.md#xcoordinatemode) which defines whether the Y2 coordinate is a pixel, data-value or relative coordinate

___

###  yAxisId

• **yAxisId**: *string*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L139)*

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

###  yCoordinateMode

• **yCoordinateMode**: *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:173](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L173)*

The Y-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`remarks`** Want to display an annotation stretching across the entire width (or height) or the [SciChartSurface](../classes/scichartsurface.md)?
The [ECoordinateMode](../enums/ecoordinatemode.md) enum has options which allow for relative, absolute or pixel coordinates which define annotation
placement.

## Methods

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurfaceBase](../classes/scichartsurfacebase.md)): *void*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:189](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L189)*

**`description`** Called when the annotation is attached to a parent SciChartSurface.

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartSurfaceBase](../classes/scichartsurfacebase.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:193](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L193)*

**`description`** Called when the annotation is detached from a parent SciChartSurface.

**Returns:** *void*
