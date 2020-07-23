[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [BasePointMarker](basepointmarker.md)

# Class: BasePointMarker

## Hierarchy

* **BasePointMarker**

  ↳ [CrossPointMarker](crosspointmarker.md)

  ↳ [EllipsePointMarker](ellipsepointmarker.md)

  ↳ [SpritePointMarker](spritepointmarker.md)

  ↳ [SquarePointMarker](squarepointmarker.md)

  ↳ [TrianglePointMarker](trianglepointmarker.md)

  ↳ [XPointMarker](xpointmarker.md)

## Implements

* [IPointMarker](../interfaces/ipointmarker.md)

## Index

### Constructors

* [constructor](basepointmarker.md#constructor)

### Properties

* [invalidateParentCallback](basepointmarker.md#invalidateparentcallback)

### Accessors

* [fill](basepointmarker.md#fill)
* [height](basepointmarker.md#height)
* [stroke](basepointmarker.md#stroke)
* [strokeThickness](basepointmarker.md#strokethickness)
* [width](basepointmarker.md#width)

### Methods

* [createCanvasTexture](basepointmarker.md#createcanvastexture)
* [delete](basepointmarker.md#delete)
* [drawSprite](basepointmarker.md#abstract-drawsprite)
* [getSprite](basepointmarker.md#getsprite)

## Constructors

###  constructor

\+ **new BasePointMarker**(`webAssemblyContext`: TSciChart, `options?`: [IPointMarkerOptions](../interfaces/ipointmarkeroptions.md)): *[BasePointMarker](basepointmarker.md)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`options?` | [IPointMarkerOptions](../interfaces/ipointmarkeroptions.md) |

**Returns:** *[BasePointMarker](basepointmarker.md)*

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md).[invalidateParentCallback](../interfaces/ipointmarker.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L15)*

#### Type declaration:

▸ (): *void*

## Accessors

###  fill

• **get fill**(): *string*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L37)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

___

###  height

• **get height**(): *number*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:64](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L64)*

**Returns:** *number*

• **set height**(`height`: number): *void*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:68](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`height` | number |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L46)*

**Returns:** *string*

• **set stroke**(`stroke`: string): *void*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`stroke` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L73)*

**Returns:** *number*

• **set strokeThickness**(`strokeThickness`: number): *void*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`strokeThickness` | number |

**Returns:** *void*

___

###  width

• **get width**(): *number*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L55)*

**Returns:** *number*

• **set width**(`width`: number): *void*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *void*

## Methods

###  createCanvasTexture

▸ **createCanvasTexture**(): *[CanvasTexture](canvastexture.md)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L96)*

**Returns:** *[CanvasTexture](canvastexture.md)*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L91)*

**Returns:** *void*

___

### `Abstract` drawSprite

▸ **drawSprite**(`canvas`: CanvasRenderingContext2D, `spriteWidth`: number, `spriteHeight`: number): *void*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | CanvasRenderingContext2D |
`spriteWidth` | number |
`spriteHeight` | number |

**Returns:** *void*

___

###  getSprite

▸ **getSprite**(): *[CanvasTexture](canvastexture.md)*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L82)*

**Returns:** *[CanvasTexture](canvastexture.md)*
