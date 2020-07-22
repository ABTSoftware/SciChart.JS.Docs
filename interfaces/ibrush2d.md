[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IBrush2D](ibrush2d.md)

# Interface: IBrush2D

Defines the interface to a Brush, used for drawing filled areas, polygons and rectangles on [IRenderContext2D](irendercontext2d.md)

## Hierarchy

* IDeletable

  ↳ **IBrush2D**

## Implemented by

* [WebGlBrush](../classes/webglbrush.md)

## Index

### Methods

* [delete](ibrush2d.md#delete)
* [getBrushType](ibrush2d.md#getbrushtype)

## Methods

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

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

*Defined in [src/Charting/Drawing/IBrush2D.ts:11](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/IBrush2D.ts#L11)*

Gets the type of the brush. See {@link EDrawingTypes} for list of values

**Returns:** *EDrawingTypes*
