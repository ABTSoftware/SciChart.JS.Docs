[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [WebGlPen](webglpen.md)

# Class: WebGlPen

The WebGlPen is a pen for polygon stroke, line strokes, which can be passed to SciChart's WebGL / WebAssembly graphics engine

## Hierarchy

* **WebGlPen**

## Implements

* [IPen2D](../interfaces/ipen2d.md)

## Index

### Constructors

* [constructor](webglpen.md#constructor)

### Accessors

* [scrtPen](webglpen.md#scrtpen)

### Methods

* [delete](webglpen.md#delete)
* [getPenType](webglpen.md#getpentype)

## Constructors

###  constructor

\+ **new WebGlPen**(`scrtPen`: SCRTPen): *[WebGlPen](webglpen.md)*

*Defined in [src/Charting/Drawing/WebGlPen.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlPen.ts#L10)*

Creates an instance of WebGlPen

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scrtPen` | SCRTPen | the inner {@link SCRTPen} which can be passed to SciChart's WebAssembly WebGL engine  |

**Returns:** *[WebGlPen](webglpen.md)*

## Accessors

###  scrtPen

• **get scrtPen**(): *SCRTPen*

*Defined in [src/Charting/Drawing/WebGlPen.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlPen.ts#L21)*

the inner {@link SCRTPen} which can be passed to SciChart's WebAssembly WebGL engine

**Returns:** *SCRTPen*

## Methods

###  delete

▸ **delete**(): *void*

*Implementation of [IPen2D](../interfaces/ipen2d.md)*

*Defined in [src/Charting/Drawing/WebGlPen.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlPen.ts#L27)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  getPenType

▸ **getPenType**(): *EDrawingTypes*

*Implementation of [IPen2D](../interfaces/ipen2d.md)*

*Defined in [src/Charting/Drawing/WebGlPen.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlPen.ts#L33)*

Gets the type of the pen. See {@link EDrawingTypes} for list of values

**Returns:** *EDrawingTypes*
