[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [RenderContext2D](rendercontext2d.md)

# Class: RenderContext2D

The RenderContext2D provides methods for drawing to an {@link HTMLCanvasElement | Html5 Canvas}
This context class is used in SciChart's High Performance Realtime [JavaScript Charts](https://www.scichart.com/javascript-chart-features)
to draw shapes, lines, fills, images and more

## Hierarchy

* **RenderContext2D**

## Index

### Constructors

* [constructor](rendercontext2d.md#constructor)

### Methods

* [clear](rendercontext2d.md#clear)
* [drawCircle](rendercontext2d.md#drawcircle)
* [drawRect](rendercontext2d.md#drawrect)

## Constructors

###  constructor

\+ **new RenderContext2D**(`canvas2D`: HTMLCanvasElement): *[RenderContext2D](rendercontext2d.md)*

*Defined in [src/Charting/Drawing/RenderContext2D.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Drawing/RenderContext2D.ts#L8)*

Creates an instance of the RenderContext2D

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`canvas2D` | HTMLCanvasElement | the {@link HTMLCanvasElement} we are drawing to  |

**Returns:** *[RenderContext2D](rendercontext2d.md)*

## Methods

###  clear

▸ **clear**(): *void*

*Defined in [src/Charting/Drawing/RenderContext2D.ts:57](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Drawing/RenderContext2D.ts#L57)*

Clears the backing canvas element

**Returns:** *void*

___

###  drawCircle

▸ **drawCircle**(`x`: number, `y`: number, `radius`: number, `fillHtmlColor`: string): *void*

*Defined in [src/Charting/Drawing/RenderContext2D.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Drawing/RenderContext2D.ts#L40)*

Draws a circle to the specified location and with provided Htmlcolor string

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | number | the X-location of the rectangle |
`y` | number | the Y-location of the rectangle |
`radius` | number | the radius of the circle |
`fillHtmlColor` | string | the Html color code to fill the circle  |

**Returns:** *void*

___

###  drawRect

▸ **drawRect**(`x`: number, `y`: number, `width`: number, `height`: number, `htmlColor`: string): *void*

*Defined in [src/Charting/Drawing/RenderContext2D.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Drawing/RenderContext2D.ts#L27)*

Draws a rectangle to the specified location and with provided Htmlcolor string

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`x` | number | - | the X-location of the rectangle |
`y` | number | - | the Y-location of the rectangle |
`width` | number | - | the width of the rectangle |
`height` | number | - | the height of the rectangle |
`htmlColor` | string | "rgba(211,211,211,0.5)" | the Html color code to fill the rectangle  |

**Returns:** *void*
