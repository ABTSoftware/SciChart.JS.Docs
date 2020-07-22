[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IPointMarker](ipointmarker.md)

# Interface: IPointMarker

## Hierarchy

* IDeletable

  ↳ **IPointMarker**

## Implemented by

* [BasePointMarker](../classes/basepointmarker.md)
* [CrossPointMarker](../classes/crosspointmarker.md)
* [EllipsePointMarker](../classes/ellipsepointmarker.md)
* [SpritePointMarker](../classes/spritepointmarker.md)
* [SquarePointMarker](../classes/squarepointmarker.md)
* [TrianglePointMarker](../classes/trianglepointmarker.md)
* [XPointMarker](../classes/xpointmarker.md)

## Index

### Properties

* [fill](ipointmarker.md#fill)
* [height](ipointmarker.md#height)
* [invalidateParentCallback](ipointmarker.md#invalidateparentcallback)
* [stroke](ipointmarker.md#stroke)
* [strokeThickness](ipointmarker.md#strokethickness)
* [width](ipointmarker.md#width)

### Methods

* [delete](ipointmarker.md#delete)
* [drawSprite](ipointmarker.md#drawsprite)
* [getSprite](ipointmarker.md#getsprite)

## Properties

###  fill

• **fill**: *string*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L7)*

___

###  height

• **height**: *number*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:9](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L9)*

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L5)*

#### Type declaration:

▸ (): *void*

___

###  stroke

• **stroke**: *string*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:6](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L6)*

___

###  strokeThickness

• **strokeThickness**: *number*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L10)*

___

###  width

• **width**: *number*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L8)*

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

###  drawSprite

▸ **drawSprite**(`canvas`: CanvasRenderingContext2D, `spriteWidth`: number, `spriteHeight`: number): *void*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | CanvasRenderingContext2D |
`spriteWidth` | number |
`spriteHeight` | number |

**Returns:** *void*

___

###  getSprite

▸ **getSprite**(): *[CanvasTexture](../classes/canvastexture.md)*

*Defined in [src/Charting/Visuals/PointMarkers/IPointMarker.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/PointMarkers/IPointMarker.ts#L14)*

**Returns:** *[CanvasTexture](../classes/canvastexture.md)*
