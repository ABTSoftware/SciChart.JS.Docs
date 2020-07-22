[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [LineAnnotation](lineannotation.md)

# Class: LineAnnotation

**`summary`** The [LineAnnotation](lineannotation.md) provides an [Annotation](annotationbase.md) which draws a line at
specific x1x2 y1y2 over the [SciChartSurface](scichartsurface.md)

**`description`** 
To add a [LineAnnotation](lineannotation.md) to a [SciChartSurface](scichartsurface.md), use the following code:
```ts
const sciChartSurface: SciChartSurface;
const lineAnnotation = new LineAnnotation( { x1: 1, x2: 2, y1: 3, y2: 4, fill: "#FF000077", stroke: "#FF0000"});
sciChartSurface.annotations.add(lineAnnotation);
```

**`remarks`** Uses the fast WebGL/WebAssembly {@link WebGL2RenderingContext} for rendering

## Hierarchy

  ↳ [RenderContextAnnotationBase](rendercontextannotationbase.md)

  ↳ **LineAnnotation**

## Implements

* [IAnnotation](../interfaces/iannotation.md)

## Index

### Constructors

* [constructor](lineannotation.md#constructor)

### Properties

* [invalidateParentCallback](lineannotation.md#invalidateparentcallback)
* [type](lineannotation.md#readonly-type)

### Accessors

* [annotationLayer](lineannotation.md#annotationlayer)
* [isEditable](lineannotation.md#iseditable)
* [isHidden](lineannotation.md#ishidden)
* [parentSurface](lineannotation.md#parentsurface)
* [stroke](lineannotation.md#stroke)
* [strokeThickness](lineannotation.md#strokethickness)
* [x1](lineannotation.md#x1)
* [x2](lineannotation.md#x2)
* [xAxisId](lineannotation.md#xaxisid)
* [xCoordinateMode](lineannotation.md#xcoordinatemode)
* [y1](lineannotation.md#y1)
* [y2](lineannotation.md#y2)
* [yAxisId](lineannotation.md#yaxisid)
* [yCoordinateMode](lineannotation.md#ycoordinatemode)

### Methods

* [delete](lineannotation.md#delete)
* [drawWithContext](lineannotation.md#drawwithcontext)
* [onAttach](lineannotation.md#onattach)
* [onDetach](lineannotation.md#ondetach)

## Constructors

###  constructor

\+ **new LineAnnotation**(`options?`: [ILineAnnotationOptions](../interfaces/ilineannotationoptions.md)): *[LineAnnotation](lineannotation.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/Annotations/LineAnnotation.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/LineAnnotation.ts#L42)*

Create an instance of a LineAnnotation

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options?` | [ILineAnnotationOptions](../interfaces/ilineannotationoptions.md) | Optional parameters of type [ILineAnnotationOptions](../interfaces/ilineannotationoptions.md) which configure the annotation upon construction  |

**Returns:** *[LineAnnotation](lineannotation.md)*

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IAnnotation](../interfaces/iannotation.md).[invalidateParentCallback](../interfaces/iannotation.md#invalidateparentcallback)*

*Inherited from [AnnotationBase](annotationbase.md).[invalidateParentCallback](annotationbase.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L166)*

**`description`** callback which notifies the parent [SciChartSurface](scichartsurface.md) it's time to draw

#### Type declaration:

▸ (): *void*

___

### `Readonly` type

• **type**: *[RenderContext](../enums/eannotationtype.md#rendercontext)* = EAnnotationType.RenderContext

*Implementation of [IAnnotation](../interfaces/iannotation.md).[type](../interfaces/iannotation.md#readonly-type)*

*Inherited from [RenderContextAnnotationBase](rendercontextannotationbase.md).[type](rendercontextannotationbase.md#readonly-type)*

*Overrides [AnnotationBase](annotationbase.md).[type](annotationbase.md#readonly-abstract-type)*

*Defined in [src/Charting/Visuals/Annotations/RenderContextAnnotationBase.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/RenderContextAnnotationBase.ts#L14)*

**`description`** annotation type. See [EAnnotationType](../enums/eannotationtype.md) for a list of values

## Accessors

###  annotationLayer

• **get annotationLayer**(): *[EAnnotationLayer](../enums/eannotationlayer.md)*

*Inherited from [AnnotationBase](annotationbase.md).[annotationLayer](annotationbase.md#annotationlayer)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:199](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L199)*

**`inheritdoc`** 

**Returns:** *[EAnnotationLayer](../enums/eannotationlayer.md)*

• **set annotationLayer**(`annotationCanvas`: [EAnnotationLayer](../enums/eannotationlayer.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[annotationLayer](annotationbase.md#annotationlayer)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:203](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L203)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L217)*

**`inheritdoc`** 

**Returns:** *boolean*

• **set isEditable**(`isEditable`: boolean): *void*

*Inherited from [AnnotationBase](annotationbase.md).[isEditable](annotationbase.md#iseditable)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L221)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:226](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L226)*

**`inheritdoc`** 

**Returns:** *boolean*

• **set isHidden**(`isHidden`: boolean): *void*

*Inherited from [AnnotationBase](annotationbase.md).[isHidden](annotationbase.md#ishidden)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:230](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L230)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:208](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L208)*

**`inheritdoc`** 

**Returns:** *[SciChartSurface](scichartsurface.md)*

• **set parentSurface**(`parentSurface`: [SciChartSurface](scichartsurface.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[parentSurface](annotationbase.md#parentsurface)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:212](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L212)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`parentSurface` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Defined in [src/Charting/Visuals/Annotations/LineAnnotation.ts:57](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/LineAnnotation.ts#L57)*

Gets the stroke for the [LineAnnotation](lineannotation.md)

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

**Returns:** *string*

• **set stroke**(`htmlColorCode`: string): *void*

*Defined in [src/Charting/Visuals/Annotations/LineAnnotation.ts:64](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/LineAnnotation.ts#L64)*

Sets the stroke for the [LineAnnotation](lineannotation.md)

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Defined in [src/Charting/Visuals/Annotations/LineAnnotation.ts:72](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/LineAnnotation.ts#L72)*

Gets the strokeThickness for the [LineAnnotation](lineannotation.md)

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Defined in [src/Charting/Visuals/Annotations/LineAnnotation.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/LineAnnotation.ts#L78)*

Sets the strokeThickness for the [LineAnnotation](lineannotation.md)

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  x1

• **get x1**(): *number*

*Inherited from [AnnotationBase](annotationbase.md).[x1](annotationbase.md#x1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:253](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L253)*

**`inheritdoc`** 

**Returns:** *number*

• **set x1**(`x1`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[x1](annotationbase.md#x1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:257](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L257)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:262](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L262)*

**`inheritdoc`** 

**Returns:** *number*

• **set x2**(`x2`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[x2](annotationbase.md#x2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:266](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L266)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:289](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L289)*

**`inheritdoc`** 

**Returns:** *string*

• **set xAxisId**(`xAxisId`: string): *void*

*Inherited from [AnnotationBase](annotationbase.md).[xAxisId](annotationbase.md#xaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:293](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L293)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`xAxisId` | string |

**Returns:** *void*

___

###  xCoordinateMode

• **get xCoordinateMode**(): *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Inherited from [AnnotationBase](annotationbase.md).[xCoordinateMode](annotationbase.md#xcoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:235](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L235)*

The X-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Returns:** *[ECoordinateMode](../enums/ecoordinatemode.md)*

• **set xCoordinateMode**(`xCoordinateMode`: [ECoordinateMode](../enums/ecoordinatemode.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[xCoordinateMode](annotationbase.md#xcoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:239](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L239)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:271](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L271)*

**`inheritdoc`** 

**Returns:** *number*

• **set y1**(`y1`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[y1](annotationbase.md#y1)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:275](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L275)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:280](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L280)*

**`inheritdoc`** 

**Returns:** *number*

• **set y2**(`y2`: number): *void*

*Inherited from [AnnotationBase](annotationbase.md).[y2](annotationbase.md#y2)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:284](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L284)*

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

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:298](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L298)*

**`inheritdoc`** 

**Returns:** *string*

• **set yAxisId**(`yAxisId`: string): *void*

*Inherited from [AnnotationBase](annotationbase.md).[yAxisId](annotationbase.md#yaxisid)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:302](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L302)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`yAxisId` | string |

**Returns:** *void*

___

###  yCoordinateMode

• **get yCoordinateMode**(): *[ECoordinateMode](../enums/ecoordinatemode.md)*

*Inherited from [AnnotationBase](annotationbase.md).[yCoordinateMode](annotationbase.md#ycoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:244](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L244)*

The Y-Coordinate mode. See [ECoordinateMode](../enums/ecoordinatemode.md) for a list of values

**`inheritdoc`** 

**Returns:** *[ECoordinateMode](../enums/ecoordinatemode.md)*

• **set yCoordinateMode**(`yCoordinateMode`: [ECoordinateMode](../enums/ecoordinatemode.md)): *void*

*Inherited from [AnnotationBase](annotationbase.md).[yCoordinateMode](annotationbase.md#ycoordinatemode)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:248](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L248)*

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

*Defined in [src/Charting/Visuals/Annotations/LineAnnotation.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/LineAnnotation.ts#L84)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  drawWithContext

▸ **drawWithContext**(`renderContext`: [IRenderContext2D](../interfaces/irendercontext2d.md), `xCalc`: [CoordinateCalculatorBase](coordinatecalculatorbase.md), `yCalc`: [CoordinateCalculatorBase](coordinatecalculatorbase.md), `viewRect`: Rect): *void*

*Overrides [RenderContextAnnotationBase](rendercontextannotationbase.md).[drawWithContext](rendercontextannotationbase.md#abstract-drawwithcontext)*

*Defined in [src/Charting/Visuals/Annotations/LineAnnotation.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/LineAnnotation.ts#L88)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [IRenderContext2D](../interfaces/irendercontext2d.md) |
`xCalc` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) |
`yCalc` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) |
`viewRect` | Rect |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurfaceBase](scichartsurfacebase.md)): *void*

*Implementation of [IAnnotation](../interfaces/iannotation.md)*

*Inherited from [AnnotationBase](annotationbase.md).[onAttach](annotationbase.md#onattach)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:307](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L307)*

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

*Inherited from [AnnotationBase](annotationbase.md).[onDetach](annotationbase.md#ondetach)*

*Defined in [src/Charting/Visuals/Annotations/AnnotationBase.ts:311](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Annotations/AnnotationBase.ts#L311)*

**`description`** Called when the annotation is detached from a parent SciChartSurface.

**Returns:** *void*
