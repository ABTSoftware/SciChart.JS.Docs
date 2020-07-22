[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IRenderContext2D](irendercontext2d.md)

# Interface: IRenderContext2D

The RenderContext provides methods for drawing to a WebGL WebAssembly Canvas or standard HTML5 Canvas.
This interface is used in SciChart's High Performance Realtime [JavaScript Charts](https://www.scichart.com/javascript-chart-features)
to draw shapes, lines, fills, images and more

## Hierarchy

* IDeletable

  ↳ **IRenderContext2D**

## Implemented by

* [WebGlRenderContext2D](../classes/webglrendercontext2d.md)

## Index

### Methods

* [createPen](irendercontext2d.md#createpen)
* [createSolidBrush](irendercontext2d.md#createsolidbrush)
* [delete](irendercontext2d.md#delete)
* [drawLine](irendercontext2d.md#drawline)
* [drawLines](irendercontext2d.md#drawlines)
* [drawRect](irendercontext2d.md#drawrect)

## Methods

###  createPen

▸ **createPen**(`stroke`: string, `strokeThickness`: number, `antiAliased?`: boolean): *[IPen2D](ipen2d.md)*

*Defined in [src/Charting/Drawing/IRenderContext2D.ts:19](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Drawing/IRenderContext2D.ts#L19)*

**`description`** creates a pen (which you should cache) from the provided stroke and strokeThickness

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`stroke` | string | in hex format e.g. #FF6600 or CSS rgba format rgb(255,70,30,0.8) |
`strokeThickness` | number | in pixels |
`antiAliased?` | boolean | true if the pen draws an Anti-Aliased linez  |

**Returns:** *[IPen2D](ipen2d.md)*

___

###  createSolidBrush

▸ **createSolidBrush**(`fill`: string, `opacity?`: number): *[IBrush2D](ibrush2d.md)*

*Defined in [src/Charting/Drawing/IRenderContext2D.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Drawing/IRenderContext2D.ts#L25)*

**`description`** creates a solid color brush (which you should cache) from the provided fillColor and opacity

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fill` | string | color in hex format, e.g. #FF6600 or CSS rgba format rgb(255,70,30,0.8) |
`opacity?` | number | from 0.0 to 1.0  |

**Returns:** *[IBrush2D](ibrush2d.md)*

___

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  drawLine

▸ **drawLine**(`x1`: number, `y1`: number, `x2`: number, `y2`: number, `strokePen`: [IPen2D](ipen2d.md), `viewRect`: Rect): *void*

*Defined in [src/Charting/Drawing/IRenderContext2D.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Drawing/IRenderContext2D.ts#L35)*

**`description`** Draws a single line from (x1,y1) to (x2,y2) with the specified Pen

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x1` | number | The X1 coordinate in pixels |
`y1` | number | The Y1 coordinate in pixels |
`x2` | number | The X2 coordinate in pixels |
`y2` | number | The Y2 coordinate in pixels |
`strokePen` | [IPen2D](ipen2d.md) | the pen to draw with |
`viewRect` | Rect | the series viewRect, used for translate and clipping  |

**Returns:** *void*

___

###  drawLines

▸ **drawLines**(`xyValues`: number[], `strokePen`: [IPen2D](ipen2d.md), `viewRect`: Rect, `lineDrawMode?`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Defined in [src/Charting/Drawing/IRenderContext2D.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Drawing/IRenderContext2D.ts#L43)*

**`description`** Draws a polyline with the specified Pen

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xyValues` | number[] | An array of x,y points arranged as x0y0 x1y1 ... xnyn |
`strokePen` | [IPen2D](ipen2d.md) | the pen to draw with |
`viewRect` | Rect | the series viewRect, used for translate and clipping |
`lineDrawMode?` | [ELineDrawMode](../enums/elinedrawmode.md) | whether to draw lines as a polyline, or disconnected lines  |

**Returns:** *void*

___

###  drawRect

▸ **drawRect**(`rect`: Rect, `viewRect`: Rect, `strokePen?`: [IPen2D](ipen2d.md), `fillBrush?`: [IBrush2D](ibrush2d.md)): *void*

*Defined in [src/Charting/Drawing/IRenderContext2D.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Drawing/IRenderContext2D.ts#L51)*

**`description`** Draws a Rect with optional fill and stroke

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rect` | Rect | the Rect dimensions to draw |
`viewRect` | Rect | the series viewRect, used for translate and clipping |
`strokePen?` | [IPen2D](ipen2d.md) | the stroke pen to draw the outline with |
`fillBrush?` | [IBrush2D](ibrush2d.md) | the fill brush to draw the fill with  |

**Returns:** *void*
