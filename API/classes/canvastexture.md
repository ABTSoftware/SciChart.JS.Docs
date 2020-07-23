[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [CanvasTexture](canvastexture.md)

# Class: CanvasTexture

## Hierarchy

* **CanvasTexture**

## Implements

* IDeletable

## Index

### Constructors

* [constructor](canvastexture.md#constructor)

### Properties

* [canvas](canvastexture.md#canvas)
* [height](canvastexture.md#readonly-height)
* [width](canvastexture.md#readonly-width)

### Methods

* [clear](canvastexture.md#clear)
* [copyTexture](canvastexture.md#copytexture)
* [delete](canvastexture.md#delete)
* [getContext](canvastexture.md#getcontext)
* [getTexture](canvastexture.md#gettexture)

## Constructors

###  constructor

\+ **new CanvasTexture**(`webAssemblyContext`: TSciChart | TSciChart3D, `textureWidth`: number, `textureHeight`: number): *[CanvasTexture](canvastexture.md)*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart &#124; TSciChart3D |
`textureWidth` | number |
`textureHeight` | number |

**Returns:** *[CanvasTexture](canvastexture.md)*

## Properties

###  canvas

• **canvas**: *HTMLCanvasElement*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L10)*

___

### `Readonly` height

• **height**: *number*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L8)*

___

### `Readonly` width

• **width**: *number*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L7)*

## Methods

###  clear

▸ **clear**(): *void*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L50)*

**Returns:** *void*

___

###  copyTexture

▸ **copyTexture**(): *void*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L69)*

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:57](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L57)*

**Returns:** *void*

___

###  getContext

▸ **getContext**(): *CanvasRenderingContext2D*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L42)*

**Returns:** *CanvasRenderingContext2D*

___

###  getTexture

▸ **getTexture**(): *TSRTexture*

*Defined in [src/Charting/Visuals/TextureManager/CanvasTexture.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/TextureManager/CanvasTexture.ts#L46)*

**Returns:** *TSRTexture*
