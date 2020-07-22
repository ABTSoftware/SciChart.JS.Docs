[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [CrossPointMarker](crosspointmarker.md)

# Class: CrossPointMarker

## Hierarchy

* [BasePointMarker](basepointmarker.md)

  ↳ **CrossPointMarker**

## Implements

* [IPointMarker](../interfaces/ipointmarker.md)

## Index

### Constructors

* [constructor](crosspointmarker.md#constructor)

### Properties

* [invalidateParentCallback](crosspointmarker.md#invalidateparentcallback)

### Accessors

* [fill](crosspointmarker.md#fill)
* [height](crosspointmarker.md#height)
* [stroke](crosspointmarker.md#stroke)
* [strokeThickness](crosspointmarker.md#strokethickness)
* [width](crosspointmarker.md#width)

### Methods

* [createCanvasTexture](crosspointmarker.md#createcanvastexture)
* [delete](crosspointmarker.md#delete)
* [drawSprite](crosspointmarker.md#drawsprite)
* [getSprite](crosspointmarker.md#getsprite)

## Constructors

###  constructor

\+ **new CrossPointMarker**(`webAssemblyContext`: TSciChart, `options?`: [IPointMarkerOptions](../interfaces/ipointmarkeroptions.md)): *[CrossPointMarker](crosspointmarker.md)*

*Overrides [BasePointMarker](basepointmarker.md).[constructor](basepointmarker.md#constructor)*

*Defined in [src/Charting/Visuals/PointMarkers/CrossPointMarker.ts:4](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/CrossPointMarker.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`options?` | [IPointMarkerOptions](../interfaces/ipointmarkeroptions.md) |

**Returns:** *[CrossPointMarker](crosspointmarker.md)*

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md).[invalidateParentCallback](../interfaces/ipointmarker.md#invalidateparentcallback)*

*Inherited from [BasePointMarker](basepointmarker.md).[invalidateParentCallback](basepointmarker.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L15)*

#### Type declaration:

▸ (): *void*

## Accessors

###  fill

• **get fill**(): *string*

*Inherited from [BasePointMarker](basepointmarker.md).[fill](basepointmarker.md#fill)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L37)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Inherited from [BasePointMarker](basepointmarker.md).[fill](basepointmarker.md#fill)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

___

###  height

• **get height**(): *number*

*Inherited from [BasePointMarker](basepointmarker.md).[height](basepointmarker.md#height)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:64](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L64)*

**Returns:** *number*

• **set height**(`height`: number): *void*

*Inherited from [BasePointMarker](basepointmarker.md).[height](basepointmarker.md#height)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:68](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`height` | number |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Inherited from [BasePointMarker](basepointmarker.md).[stroke](basepointmarker.md#stroke)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L46)*

**Returns:** *string*

• **set stroke**(`stroke`: string): *void*

*Inherited from [BasePointMarker](basepointmarker.md).[stroke](basepointmarker.md#stroke)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`stroke` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Inherited from [BasePointMarker](basepointmarker.md).[strokeThickness](basepointmarker.md#strokethickness)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L73)*

**Returns:** *number*

• **set strokeThickness**(`strokeThickness`: number): *void*

*Inherited from [BasePointMarker](basepointmarker.md).[strokeThickness](basepointmarker.md#strokethickness)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`strokeThickness` | number |

**Returns:** *void*

___

###  width

• **get width**(): *number*

*Inherited from [BasePointMarker](basepointmarker.md).[width](basepointmarker.md#width)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L55)*

**Returns:** *number*

• **set width**(`width`: number): *void*

*Inherited from [BasePointMarker](basepointmarker.md).[width](basepointmarker.md#width)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *void*

## Methods

###  createCanvasTexture

▸ **createCanvasTexture**(): *[CanvasTexture](canvastexture.md)*

*Inherited from [BasePointMarker](basepointmarker.md).[createCanvasTexture](basepointmarker.md#createcanvastexture)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L96)*

**Returns:** *[CanvasTexture](canvastexture.md)*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md)*

*Inherited from [BasePointMarker](basepointmarker.md).[delete](basepointmarker.md#delete)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L91)*

**Returns:** *void*

___

###  drawSprite

▸ **drawSprite**(`context`: CanvasRenderingContext2D, `spriteWidth`: number, `spriteHeight`: number): *void*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md)*

*Overrides [BasePointMarker](basepointmarker.md).[drawSprite](basepointmarker.md#abstract-drawsprite)*

*Defined in [src/Charting/Visuals/PointMarkers/CrossPointMarker.ts:9](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/CrossPointMarker.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | CanvasRenderingContext2D |
`spriteWidth` | number |
`spriteHeight` | number |

**Returns:** *void*

___

###  getSprite

▸ **getSprite**(): *[CanvasTexture](canvastexture.md)*

*Implementation of [IPointMarker](../interfaces/ipointmarker.md)*

*Inherited from [BasePointMarker](basepointmarker.md).[getSprite](basepointmarker.md#getsprite)*

*Defined in [src/Charting/Visuals/PointMarkers/BasePointMarker.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/PointMarkers/BasePointMarker.ts#L82)*

**Returns:** *[CanvasTexture](canvastexture.md)*
