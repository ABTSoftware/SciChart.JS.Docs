[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChart3DRenderer](scichart3drenderer.md)

# Class: SciChart3DRenderer

## Hierarchy

* **SciChart3DRenderer**

## Index

### Constructors

* [constructor](scichart3drenderer.md#constructor)

### Methods

* [render](scichart3drenderer.md#render)
* [getSceneDescriptor](scichart3drenderer.md#static-getscenedescriptor)
* [prepareRenderData](scichart3drenderer.md#static-preparerenderdata)
* [tryPerformAutoRangeOn](scichart3drenderer.md#static-tryperformautorangeon)

## Constructors

###  constructor

\+ **new SciChart3DRenderer**(`scs`: [SciChart3DSurface](scichart3dsurface.md), `wasmContext`: TSciChart3D): *[SciChart3DRenderer](scichart3drenderer.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DRenderer.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DRenderer.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChart3DSurface](scichart3dsurface.md) |
`wasmContext` | TSciChart3D |

**Returns:** *[SciChart3DRenderer](scichart3drenderer.md)*

## Methods

###  render

▸ **render**(): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DRenderer.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DRenderer.ts#L62)*

**Returns:** *void*

___

### `Static` getSceneDescriptor

▸ **getSceneDescriptor**(`scs`: [SciChart3DSurface](scichart3dsurface.md)): *[SceneDescriptor](scenedescriptor.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DRenderer.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DRenderer.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *[SceneDescriptor](scenedescriptor.md)*

___

### `Static` prepareRenderData

▸ **prepareRenderData**(`scs`: [SciChart3DSurface](scichart3dsurface.md)): *[RenderPassInfo3D](renderpassinfo3d.md)‹›*

*Defined in [src/Charting3D/Visuals/SciChart3DRenderer.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DRenderer.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *[RenderPassInfo3D](renderpassinfo3d.md)‹›*

___

### `Static` tryPerformAutoRangeOn

▸ **tryPerformAutoRangeOn**(`axis`: [AxisBase3D](axisbase3d.md), `scs`: [SciChart3DSurface](scichart3dsurface.md)): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DRenderer.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DRenderer.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`axis` | [AxisBase3D](axisbase3d.md) |
`scs` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *void*
