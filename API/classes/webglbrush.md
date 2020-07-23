[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [WebGlBrush](webglbrush.md)

# Class: WebGlBrush

The WebGLBrush is a brush for polygon fills, rectangle fills, which can be passed to SciChart's WebGL / WebAssembly graphics engine

## Hierarchy

* **WebGlBrush**

## Implements

* [IBrush2D](../interfaces/ibrush2d.md)

## Index

### Constructors

* [constructor](webglbrush.md#constructor)

### Accessors

* [scrtBrush](webglbrush.md#scrtbrush)

### Methods

* [delete](webglbrush.md#delete)
* [getBrushType](webglbrush.md#getbrushtype)

## Constructors

###  constructor

\+ **new WebGlBrush**(`scrtBrush`: SCRTBrush): *[WebGlBrush](webglbrush.md)*

*Defined in [src/Charting/Drawing/WebGlBrush.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Drawing/WebGlBrush.ts#L10)*

Creates an instance of WebGlBrush

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scrtBrush` | SCRTBrush | the inner {@link SCRTBrush} which can be passed to SciChart's WebAssembly WebGL engine  |

**Returns:** *[WebGlBrush](webglbrush.md)*

## Accessors

###  scrtBrush

• **get scrtBrush**(): *SCRTBrush*

*Defined in [src/Charting/Drawing/WebGlBrush.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Drawing/WebGlBrush.ts#L21)*

Get the inner {@link SCRTBrush} which can be passed to SciChart's WebAssembly WebGL engine

**Returns:** *SCRTBrush*

## Methods

###  delete

▸ **delete**(): *void*

*Implementation of [IBrush2D](../interfaces/ibrush2d.md)*

*Defined in [src/Charting/Drawing/WebGlBrush.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Drawing/WebGlBrush.ts#L27)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  getBrushType

▸ **getBrushType**(): *EDrawingTypes*

*Implementation of [IBrush2D](../interfaces/ibrush2d.md)*

*Defined in [src/Charting/Drawing/WebGlBrush.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Drawing/WebGlBrush.ts#L34)*

Gets the type of the brush. See {@link EDrawingTypes} for list of values

**Returns:** *EDrawingTypes*
