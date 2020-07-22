[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [AnnotationBase](annotationbase.md)

# Class: AnnotationBase

Defines the base class to an Annotation - a type of marker, text label, line or custom UI overlay on a 2D Cartesian [SciChartSurface](scichartsurface.md)

## Hierarchy

* **AnnotationBase**

  ↳ [SvgAnnotationBase](svgannotationbase.md)

  ↳ [RenderContextAnnotationBase](rendercontextannotationbase.md)

## Implements

* [IAnnotation](../interfaces/iannotation.md)

## Index

### Properties

* [invalidateParentCallback](annotationbase.md#invalidateparentcallback)
* [type](annotationbase.md#readonly-abstract-type)

### Accessors

* [annotationLayer](annotationbase.md#annotationlayer)
* [isEditable](annotationbase.md#iseditable)
* [isHidden](annotationbase.md#ishidden)
* [parentSurface](annotationbase.md#parentsurface)
* [x1](annotationbase.md#x1)
* [x2](annotationbase.md#x2)
* [xAxisId](annotationbase.md#xaxisid)
* [xCoordinateMode](annotationbase.md#xcoordinatemode)
* [y1](annotationbase.md#y1)
* [y2](annotationbase.md#y2)
* [yAxisId](annotationbase.md#yaxisid)
* [yCoordinateMode](annotationbase.md#ycoordinatemode)

### Methods

* [delete](annotationbase.md#abstract-delete)
* [onAttach](annotationbase.md#onattach)
* [onDetach](annotationbase.md#ondetach)

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IAnnotation](../interfaces/iannotation.md).[invalidateParentCallback](../interfaces/iannotation.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L166)*

**`description`** callback which notifies the parent [SciChartSurface](scichartsurface.md) it's time to draw

#### Type declaration:

▸ (): *void*

___

### `Readonly` `Abstract` type

• **type**: *[EAnnotationType](../enums/eannotationtype.md)*

*Implementation of [IAnnotation](../interfaces/iannotation.md).[type](../interfaces/iannotation.md#readonly-type)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:164](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L164)*

**`description`** annotation type. See [EAnnotationType](../enums/eannotationtype.md) for a list of values

## Accessors

###  annotationLayer

• **get annotationLayer**(): *[EAnnotationLayer](../enums/eannotationlayer.md)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:199](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L199)*

**`inheritdoc`** 

**Returns:** *[EAnnotationLayer](../enums/eannotationlayer.md)*

• **set annotationLayer**(`annotationCanvas`: [EAnnotationLayer](../enums/eannotationlayer.md)): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:203](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L203)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`annotationCanvas` | [EAnnotationLayer](../enums/eannotationlayer.md) |

**Returns:** *void*

___

###  isEditable

• **get isEditable**(): *boolean*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L217)*

**`inheritdoc`** 

**Returns:** *boolean*

• **set isEditable**(`isEditable`: boolean): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L221)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`isEditable` | boolean |

**Returns:** *void*

___

###  isHidden

• **get isHidden**(): *boolean*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:226](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L226)*

**`inheritdoc`** 

**Returns:** *boolean*

• **set isHidden**(`isHidden`: boolean): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:230](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L230)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`isHidden` | boolean |

**Returns:** *void*

___

###  parentSurface

• **get parentSurface**(): *[SciChartSurface](scichartsurface.md)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:208](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L208)*

**`inheritdoc`** 

**Returns:** *[SciChartSurface](scichartsurface.md)*

• **set parentSurface**(`parentSurface`: [SciChartSurface](scichartsurface.md)): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:212](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L212)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`parentSurface` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  x1

• **get x1**(): *number*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:253](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L253)*

**`inheritdoc`** 

**Returns:** *number*

• **set x1**(`x1`: number): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:257](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L257)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`x1` | number |

**Returns:** *void*

___

###  x2

• **get x2**(): *number*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:262](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L262)*

**`inheritdoc`** 

**Returns:** *number*

• **set x2**(`x2`: number): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:266](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L266)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`x2` | number |

**Returns:** *void*

___

###  xAxisId

• **get xAxisId**(): *string*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:289](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L289)*

**`inheritdoc`** 

**Returns:** *string*

• **set xAxisId**(`xAxisId`: string): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:293](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L293)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`xAxisId` | string |

**Returns:** *void*

___

###  xCoordinateMode

• **get xCoordinateMode**(): *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:235](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L235)*

The X-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Returns:** *[ECoordinateMode](../enums/ecoordinatemode.md)*

• **set xCoordinateMode**(`xCoordinateMode`: [ECoordinateMode](../enums/ecoordinatemode.md)): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:239](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L239)*

The X-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`xCoordinateMode` | [ECoordinateMode](../enums/ecoordinatemode.md) |

**Returns:** *void*

___

###  y1

• **get y1**(): *number*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:271](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L271)*

**`inheritdoc`** 

**Returns:** *number*

• **set y1**(`y1`: number): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:275](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L275)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`y1` | number |

**Returns:** *void*

___

###  y2

• **get y2**(): *number*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:280](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L280)*

**`inheritdoc`** 

**Returns:** *number*

• **set y2**(`y2`: number): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:284](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L284)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`y2` | number |

**Returns:** *void*

___

###  yAxisId

• **get yAxisId**(): *string*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:298](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L298)*

**`inheritdoc`** 

**Returns:** *string*

• **set yAxisId**(`yAxisId`: string): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:302](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L302)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`yAxisId` | string |

**Returns:** *void*

___

###  yCoordinateMode

• **get yCoordinateMode**(): *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:244](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L244)*

The Y-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Returns:** *[ECoordinateMode](../enums/ecoordinatemode.md)*

• **set yCoordinateMode**(`yCoordinateMode`: [ECoordinateMode](../enums/ecoordinatemode.md)): *void*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:248](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L248)*

The Y-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`yCoordinateMode` | [ECoordinateMode](../enums/ecoordinatemode.md) |

**Returns:** *void*

## Methods

### `Abstract` delete

▸ **delete**(): *void*

*Implementation of [IAnnotation](../interfaces/iannotation.md)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:315](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L315)*

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

▸ **onAttach**(`scs`: [SciChartSurfaceBase](scichartsurfacebase.md)): *void*

*Implementation of [IAnnotation](../interfaces/iannotation.md)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:307](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L307)*

**`description`** Called when the annotation is attached to a parent SciChartSurface.

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartSurfaceBase](scichartsurfacebase.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IAnnotation](../interfaces/iannotation.md)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:311](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L311)*

**`description`** Called when the annotation is detached from a parent SciChartSurface.

**Returns:** *void*
