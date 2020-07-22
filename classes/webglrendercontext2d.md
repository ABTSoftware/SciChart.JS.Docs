[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [WebGlRenderContext2D](webglrendercontext2d.md)

# Class: WebGlRenderContext2D

The WebGlRenderContext2D provides methods for drawing to a WebGL2 / WebAssembly canvas powered by SciChart's Visual Xccelerator engine.
This context class is used in SciChart's High Performance Realtime [JavaScript Charts](https://www.scichart.com/javascript-chart-features)
to draw shapes, lines, fills, images and more

## Hierarchy

* **WebGlRenderContext2D**

## Implements

* [IRenderContext2D](../interfaces/irendercontext2d.md)

## Index

### Constructors

* [constructor](webglrendercontext2d.md#constructor)

### Properties

* [viewportSize](webglrendercontext2d.md#readonly-viewportsize)

### Methods

* [createPen](webglrendercontext2d.md#createpen)
* [createSolidBrush](webglrendercontext2d.md#createsolidbrush)
* [delete](webglrendercontext2d.md#delete)
* [drawLayers](webglrendercontext2d.md#drawlayers)
* [drawLine](webglrendercontext2d.md#drawline)
* [drawLines](webglrendercontext2d.md#drawlines)
* [drawLinesNative](webglrendercontext2d.md#drawlinesnative)
* [drawRect](webglrendercontext2d.md#drawrect)
* [drawRects](webglrendercontext2d.md#drawrects)
* [enqueueLayeredDraw](webglrendercontext2d.md#enqueuelayereddraw)
* [getNativeContext](webglrendercontext2d.md#getnativecontext)
* [popShaderEffect](webglrendercontext2d.md#popshadereffect)
* [pushShaderEffect](webglrendercontext2d.md#pushshadereffect)

## Constructors

###  constructor

\+ **new WebGlRenderContext2D**(`webAssemblyContext`: TSciChart, `viewportSize`: Size): *[WebGlRenderContext2D](webglrendercontext2d.md)*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L62)*

Creates an instance of the WebGlRenderContext2D

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`webAssemblyContext` | TSciChart | The {@link TSciChart | SciChart WebAssembly Context} containing native methods and access to our WebGL2 Engine |
`viewportSize` | Size | The Viewport {@link Size}  |

**Returns:** *[WebGlRenderContext2D](webglrendercontext2d.md)*

## Properties

### `Readonly` viewportSize

• **viewportSize**: *Size*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:58](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L58)*

Gets the current viewport {@link Size}

## Methods

###  createPen

▸ **createPen**(`stroke`: string, `strokeThickness`: number, `antiAliased`: boolean): *[IPen2D](../interfaces/ipen2d.md)*

*Implementation of [IRenderContext2D](../interfaces/irendercontext2d.md)*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:179](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L179)*

**`description`** creates a pen (which you should cache) from the provided stroke and strokeThickness

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`stroke` | string | - | in hex format e.g. #FF6600 or CSS rgba format rgb(255,70,30,0.8) |
`strokeThickness` | number | - | in pixels |
`antiAliased` | boolean | true | true if the pen draws an Anti-Aliased linez  |

**Returns:** *[IPen2D](../interfaces/ipen2d.md)*

___

###  createSolidBrush

▸ **createSolidBrush**(`fill`: string, `opacity?`: number): *[IBrush2D](../interfaces/ibrush2d.md)*

*Implementation of [IRenderContext2D](../interfaces/irendercontext2d.md)*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:192](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L192)*

**`description`** creates a solid color brush (which you should cache) from the provided fillColor and opacity

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fill` | string | color in hex format, e.g. #FF6600 or CSS rgba format rgb(255,70,30,0.8) |
`opacity?` | number | from 0.0 to 1.0  |

**Returns:** *[IBrush2D](../interfaces/ibrush2d.md)*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IRenderContext2D](../interfaces/irendercontext2d.md)*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:206](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L206)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  drawLayers

▸ **drawLayers**(): *void*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:148](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L148)*

Flushes the {@link layers} which have been enqueued with drawing operations in order.
Use this in combination with [enqueueLayeredDraw](webglrendercontext2d.md#enqueuelayereddraw) to draw in layers

**Returns:** *void*

___

###  drawLine

▸ **drawLine**(`x1`: number, `y1`: number, `x2`: number, `y2`: number, `pen`: [IPen2D](../interfaces/ipen2d.md), `viewRect`: Rect): *void*

*Implementation of [IRenderContext2D](../interfaces/irendercontext2d.md)*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:212](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L212)*

**`description`** Draws a single line from (x1,y1) to (x2,y2) with the specified Pen

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x1` | number | The X1 coordinate in pixels |
`y1` | number | The Y1 coordinate in pixels |
`x2` | number | The X2 coordinate in pixels |
`y2` | number | The Y2 coordinate in pixels |
`pen` | [IPen2D](../interfaces/ipen2d.md) | the pen to draw with |
`viewRect` | Rect | the series viewRect, used for translate and clipping  |

**Returns:** *void*

___

###  drawLines

▸ **drawLines**(`xyValues`: number[], `strokePen`: [IPen2D](../interfaces/ipen2d.md), `viewRect`: Rect, `lineDrawMode`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Implementation of [IRenderContext2D](../interfaces/irendercontext2d.md)*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:254](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L254)*

**`description`** Draws a polyline with the specified Pen

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`xyValues` | number[] | - | An array of x,y points arranged as x0y0 x1y1 ... xnyn |
`strokePen` | [IPen2D](../interfaces/ipen2d.md) | - | the pen to draw with |
`viewRect` | Rect | - | the series viewRect, used for translate and clipping |
`lineDrawMode` | [ELineDrawMode](../enums/elinedrawmode.md) | ELineDrawMode.PolyLine | whether to draw lines as a polyline, or disconnected lines  |

**Returns:** *void*

___

###  drawLinesNative

▸ **drawLinesNative**(`vertices`: VectorColorVertex, `pen`: SCRTPen, `lineDrawMode`: [ELineDrawMode](../enums/elinedrawmode.md), `left`: number, `top`: number): *void*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L89)*

Draw lines: grid lines, etc.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`vertices` | VectorColorVertex | - | - |
`pen` | SCRTPen | - | - |
`lineDrawMode` | [ELineDrawMode](../enums/elinedrawmode.md) | - | - |
`left` | number | 0 | offset in pixels from left, typically used for axes |
`top` | number | 0 | offset in pixels from top, typically used for axes  |

**Returns:** *void*

___

###  drawRect

▸ **drawRect**(`rect`: Rect, `viewRect`: Rect, `strokePen?`: [IPen2D](../interfaces/ipen2d.md), `fillBrush?`: [IBrush2D](../interfaces/ibrush2d.md)): *void*

*Implementation of [IRenderContext2D](../interfaces/irendercontext2d.md)*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:297](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L297)*

**`description`** Draws a Rect with optional fill and stroke

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rect` | Rect | the Rect dimensions to draw |
`viewRect` | Rect | the series viewRect, used for translate and clipping |
`strokePen?` | [IPen2D](../interfaces/ipen2d.md) | the stroke pen to draw the outline with |
`fillBrush?` | [IBrush2D](../interfaces/ibrush2d.md) | the fill brush to draw the fill with  |

**Returns:** *void*

___

###  drawRects

▸ **drawRects**(`vertices`: VectorRectVertex, `brush`: SCRTBrush, `left`: number, `top`: number): *void*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:111](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L111)*

Draw rectangles: grid bands, etc.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`vertices` | VectorRectVertex | - | - |
`brush` | SCRTBrush | - | - |
`left` | number | 0 | offset in pixels from left, typically used for axes |
`top` | number | 0 | offset in pixels from top, typically used for axes  |

**Returns:** *void*

___

###  enqueueLayeredDraw

▸ **enqueueLayeredDraw**(`drawFunction`: [TDrawFunction](../globals.md#tdrawfunction), `layer?`: RenderLayer): *void*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:128](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L128)*

Enqueues a draw operation to the specified layer. Use in combination with [drawLayers](webglrendercontext2d.md#drawlayers) to flush layered draws

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`drawFunction` | [TDrawFunction](../globals.md#tdrawfunction) | the [Draw Function](../globals.md#tdrawfunction) to enqueue |
`layer?` | RenderLayer | the {@link RenderLayer | Layer} to draw to  |

**Returns:** *void*

___

###  getNativeContext

▸ **getNativeContext**(): *SCRTRenderContext*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L77)*

Get the native {@link SCRTRenderContext} for direct access to SciChart's WebAssembly Visual Xccelerator engine

**Returns:** *SCRTRenderContext*

___

###  popShaderEffect

▸ **popShaderEffect**(): *void*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L170)*

Pops a [ShaderEffect](shadereffect.md) from the rendering pipeline. Call {@link WebGL2RenderingContext.pushShaderEffect} to apply an effect

**Returns:** *void*

___

###  pushShaderEffect

▸ **pushShaderEffect**(`effect`: [ShaderEffect](shadereffect.md)): *void*

*Defined in [src/Charting/Drawing/WebGlRenderContext2D.ts:159](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Drawing/WebGlRenderContext2D.ts#L159)*

Applies a [ShaderEffect](shadereffect.md) to the rendering pipeline. Calling {@link WebGL2RenderingContext.popShaderEffect} pops the effect from the stack
reverting to normal drawing

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`effect` | [ShaderEffect](shadereffect.md) | the [ShaderEffect](shadereffect.md) to apply to subsequent draw operations  |

**Returns:** *void*
