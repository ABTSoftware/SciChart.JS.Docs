[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [MarkerSvgAnnotation](markersvgannotation.md)

# Class: MarkerSvgAnnotation

## Hierarchy

  ↳ [SvgAnnotationBase](svgannotationbase.md)

  ↳ **MarkerSvgAnnotation**

## Implements

* [IAnnotation](../interfaces/iannotation.md)

## Index

### Constructors

* [constructor](markersvgannotation.md#constructor)

### Properties

* [invalidateParentCallback](markersvgannotation.md#invalidateparentcallback)
* [type](markersvgannotation.md#readonly-type)

### Accessors

* [annotationLayer](markersvgannotation.md#annotationlayer)
* [isEditable](markersvgannotation.md#iseditable)
* [isHidden](markersvgannotation.md#ishidden)
* [parentSurface](markersvgannotation.md#parentsurface)
* [x1](markersvgannotation.md#x1)
* [x2](markersvgannotation.md#x2)
* [xAxisId](markersvgannotation.md#xaxisid)
* [xCoordShift](markersvgannotation.md#xcoordshift)
* [xCoordinateMode](markersvgannotation.md#xcoordinatemode)
* [y1](markersvgannotation.md#y1)
* [y2](markersvgannotation.md#y2)
* [yAxisId](markersvgannotation.md#yaxisid)
* [yCoordShift](markersvgannotation.md#ycoordshift)
* [yCoordinateMode](markersvgannotation.md#ycoordinatemode)

### Methods

* [delete](markersvgannotation.md#delete)
* [onAttach](markersvgannotation.md#onattach)
* [onDetach](markersvgannotation.md#ondetach)
* [update](markersvgannotation.md#update)

## Constructors

###  constructor

\+ **new MarkerSvgAnnotation**(`renderableSeriesProps`: [RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)): *[MarkerSvgAnnotation](markersvgannotation.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/Annotations/MarkerSvgAnnotation.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/MarkerSvgAnnotation.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`renderableSeriesProps` | [RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md) |

**Returns:** *[MarkerSvgAnnotation](markersvgannotation.md)*

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IAnnotation](../interfaces/iannotation.md).[invalidateParentCallback](../interfaces/iannotation.md#invalidateparentcallback)*

*Inherited from [AnnotationBase](annotationbase.md).[invalidateParentCallback](annotationbase.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L166)*

**`description`** callback which notifies the parent [SciChartSurface](scichartsurface.md) it's time to draw

#### Type declaration:

▸ (): *void*

___

### `Readonly` type

• **type**: *[SVG](../enums/eannotationtype.md#svg)* = EAnnotationType.SVG

*Implementation of [IAnnotation](../interfaces/iannotation.md).[type](../interfaces/iannotation.md#readonly-type)*

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[type](svgannotationbase.md#readonly-type)*

*Overrides [AnnotationBase](annotationbase.md).[type](annotationbase.md#readonly-abstract-type)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L20)*

**`description`** annotation type. See [EAnnotationType](../enums/eannotationtype.md) for a list of values

## Accessors

###  annotationLayer

• **get annotationLayer**(): *[EAnnotationLayer](../enums/eannotationlayer.md)*

*Inherited from [AnnotationBase](annotationbase.md).[annotationLayer](annotationbase.md#annotationlayer)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:199](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L199)*

**`inheritdoc`** 

**Returns:** *[EAnnotationLayer](../enums/eannotationlayer.md)*

• **set annotationLayer**(`annotationCanvas`: [EAnnotationLayer](../enums/eannotationlayer.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[annotationLayer](annotationbase.md#annotationlayer)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:203](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L203)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`annotationCanvas` | [EAnnotationLayer](../enums/eannotationlayer.md) |

**Returns:** *void*

___

###  isEditable

• **get isEditable**(): *boolean*

*Inherited from [AnnotationBase](annotationbase.md).[isEditable](annotationbase.md#iseditable)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L217)*

**`inheritdoc`** 

**Returns:** *boolean*

• **set isEditable**(`isEditable`: boolean): *void*

*Inherited from [AnnotationBase](annotationbase.md).[isEditable](annotationbase.md#iseditable)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L221)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`isEditable` | boolean |

**Returns:** *void*

___

###  isHidden

• **get isHidden**(): *boolean*

*Inherited from [AnnotationBase](annotationbase.md).[isHidden](annotationbase.md#ishidden)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:226](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L226)*

**`inheritdoc`** 

**Returns:** *boolean*

• **set isHidden**(`isHidden`: boolean): *void*

*Inherited from [AnnotationBase](annotationbase.md).[isHidden](annotationbase.md#ishidden)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:230](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L230)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`isHidden` | boolean |

**Returns:** *void*

___

###  parentSurface

• **get parentSurface**(): *[SciChartSurface](scichartsurface.md)*

*Inherited from [AnnotationBase](annotationbase.md).[parentSurface](annotationbase.md#parentsurface)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:208](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L208)*

**`inheritdoc`** 

**Returns:** *[SciChartSurface](scichartsurface.md)*

• **set parentSurface**(`parentSurface`: [SciChartSurface](scichartsurface.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[parentSurface](annotationbase.md#parentsurface)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:212](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L212)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`parentSurface` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  x1

• **get x1**(): *number*

*Inherited from [AnnotationBase](annotationbase.md).[x1](annotationbase.md#x1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:253](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L253)*

**`inheritdoc`** 

**Returns:** *number*

• **set x1**(`x1`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[x1](annotationbase.md#x1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:257](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L257)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`x1` | number |

**Returns:** *void*

___

###  x2

• **get x2**(): *number*

*Inherited from [AnnotationBase](annotationbase.md).[x2](annotationbase.md#x2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:262](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L262)*

**`inheritdoc`** 

**Returns:** *number*

• **set x2**(`x2`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[x2](annotationbase.md#x2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:266](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L266)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`x2` | number |

**Returns:** *void*

___

###  xAxisId

• **get xAxisId**(): *string*

*Inherited from [AnnotationBase](annotationbase.md).[xAxisId](annotationbase.md#xaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:289](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L289)*

**`inheritdoc`** 

**Returns:** *string*

• **set xAxisId**(`xAxisId`: string): *void*

*Inherited from [AnnotationBase](annotationbase.md).[xAxisId](annotationbase.md#xaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:293](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L293)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`xAxisId` | string |

**Returns:** *void*

___

###  xCoordShift

• **get xCoordShift**(): *number*

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[xCoordShift](svgannotationbase.md#xcoordshift)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L50)*

**Returns:** *number*

• **set xCoordShift**(`value`: number): *void*

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[xCoordShift](svgannotationbase.md#xcoordshift)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  xCoordinateMode

• **get xCoordinateMode**(): *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Inherited from [AnnotationBase](annotationbase.md).[xCoordinateMode](annotationbase.md#xcoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:235](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L235)*

The X-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Returns:** *[ECoordinateMode](../enums/ecoordinatemode.md)*

• **set xCoordinateMode**(`xCoordinateMode`: [ECoordinateMode](../enums/ecoordinatemode.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[xCoordinateMode](annotationbase.md#xcoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:239](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L239)*

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

*Inherited from [AnnotationBase](annotationbase.md).[y1](annotationbase.md#y1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:271](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L271)*

**`inheritdoc`** 

**Returns:** *number*

• **set y1**(`y1`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[y1](annotationbase.md#y1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:275](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L275)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`y1` | number |

**Returns:** *void*

___

###  y2

• **get y2**(): *number*

*Inherited from [AnnotationBase](annotationbase.md).[y2](annotationbase.md#y2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:280](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L280)*

**`inheritdoc`** 

**Returns:** *number*

• **set y2**(`y2`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[y2](annotationbase.md#y2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:284](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L284)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`y2` | number |

**Returns:** *void*

___

###  yAxisId

• **get yAxisId**(): *string*

*Inherited from [AnnotationBase](annotationbase.md).[yAxisId](annotationbase.md#yaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:298](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L298)*

**`inheritdoc`** 

**Returns:** *string*

• **set yAxisId**(`yAxisId`: string): *void*

*Inherited from [AnnotationBase](annotationbase.md).[yAxisId](annotationbase.md#yaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:302](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L302)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`yAxisId` | string |

**Returns:** *void*

___

###  yCoordShift

• **get yCoordShift**(): *number*

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[yCoordShift](svgannotationbase.md#ycoordshift)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L59)*

**Returns:** *number*

• **set yCoordShift**(`value`: number): *void*

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[yCoordShift](svgannotationbase.md#ycoordshift)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:63](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  yCoordinateMode

• **get yCoordinateMode**(): *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Inherited from [AnnotationBase](annotationbase.md).[yCoordinateMode](annotationbase.md#ycoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:244](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L244)*

The Y-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Returns:** *[ECoordinateMode](../enums/ecoordinatemode.md)*

• **set yCoordinateMode**(`yCoordinateMode`: [ECoordinateMode](../enums/ecoordinatemode.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[yCoordinateMode](annotationbase.md#ycoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:248](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L248)*

The Y-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`yCoordinateMode` | [ECoordinateMode](../enums/ecoordinatemode.md) |

**Returns:** *void*

## Methods

###  delete

▸ **delete**(): *void*

*Implementation of [IAnnotation](../interfaces/iannotation.md)*

*Overrides [AnnotationBase](annotationbase.md).[delete](annotationbase.md#abstract-delete)*

*Defined in [src/Charting/Visuals/Annotations/MarkerSvgAnnotation.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/MarkerSvgAnnotation.ts#L17)*

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurfaceBase](scichartsurfacebase.md)): *void*

*Implementation of [IAnnotation](../interfaces/iannotation.md)*

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[onAttach](svgannotationbase.md#onattach)*

*Overrides [AnnotationBase](annotationbase.md).[onAttach](annotationbase.md#onattach)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L41)*

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

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[onDetach](svgannotationbase.md#ondetach)*

*Overrides [AnnotationBase](annotationbase.md).[onDetach](annotationbase.md#ondetach)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L46)*

**`description`** Called when the annotation is detached from a parent SciChartSurface.

**Returns:** *void*

___

###  update

▸ **update**(`xCalc`: [CoordinateCalculatorBase](coordinatecalculatorbase.md), `yCalc`: [CoordinateCalculatorBase](coordinatecalculatorbase.md), `isVerticalChart`: boolean): *void*

*Inherited from [SvgAnnotationBase](svgannotationbase.md).[update](svgannotationbase.md#update)*

*Defined in [src/Charting/Visuals/Annotations/SvgAnnotationBase.ts:68](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/SvgAnnotationBase.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`xCalc` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) |
`yCalc` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) |
`isVerticalChart` | boolean |

**Returns:** *void*
