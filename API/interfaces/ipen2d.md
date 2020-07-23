[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IPen2D](ipen2d.md)

# Interface: IPen2D

Defines the interface to a Brush, used for drawing filled areas, polygons and rectangles on [IRenderContext2D](irendercontext2d.md)

## Hierarchy

* IDeletable

  ↳ **IPen2D**

## Implemented by

* [WebGlPen](../classes/webglpen.md)

## Index

### Methods

* [delete](ipen2d.md#delete)
* [getPenType](ipen2d.md#getpentype)

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

###  getPenType

▸ **getPenType**(): *EDrawingTypes*

*Defined in [src/Charting/Drawing/IPen2D.ts:11](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Drawing/IPen2D.ts#L11)*

Gets the type of the pen. See {@link EDrawingTypes} for list of values

**Returns:** *EDrawingTypes*
