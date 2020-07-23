[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SurfaceMeshRenderableSeries3D](surfacemeshrenderableseries3d.md)

# Class: SurfaceMeshRenderableSeries3D

## Hierarchy

* [BaseRenderableSeries3D](baserenderableseries3d.md)

  ↳ **SurfaceMeshRenderableSeries3D**

## Implements

* [IRenderableSeries3D](../interfaces/irenderableseries3d.md)

## Index

### Constructors

* [constructor](surfacemeshrenderableseries3d.md#constructor)

### Properties

* [invalidateParentCallback](surfacemeshrenderableseries3d.md#invalidateparentcallback)

### Accessors

* [cellHardnessFactor](surfacemeshrenderableseries3d.md#cellhardnessfactor)
* [colorMapTextureSize](surfacemeshrenderableseries3d.md#colormaptexturesize)
* [contourInterval](surfacemeshrenderableseries3d.md#contourinterval)
* [contourOffset](surfacemeshrenderableseries3d.md#contouroffset)
* [contourStroke](surfacemeshrenderableseries3d.md#contourstroke)
* [contourStrokeThickness](surfacemeshrenderableseries3d.md#contourstrokethickness)
* [dataSeries](surfacemeshrenderableseries3d.md#dataseries)
* [drawMeshAs](surfacemeshrenderableseries3d.md#drawmeshas)
* [drawSkirt](surfacemeshrenderableseries3d.md#drawskirt)
* [heightScaleFactor](surfacemeshrenderableseries3d.md#heightscalefactor)
* [highlight](surfacemeshrenderableseries3d.md#highlight)
* [isVisible](surfacemeshrenderableseries3d.md#isvisible)
* [lightingFactor](surfacemeshrenderableseries3d.md#lightingfactor)
* [maximum](surfacemeshrenderableseries3d.md#maximum)
* [meshColorPalette](surfacemeshrenderableseries3d.md#meshcolorpalette)
* [meshPaletteMode](surfacemeshrenderableseries3d.md#meshpalettemode)
* [meshResolution](surfacemeshrenderableseries3d.md#meshresolution)
* [minimum](surfacemeshrenderableseries3d.md#minimum)
* [opacity](surfacemeshrenderableseries3d.md#opacity)
* [paletteProvider](surfacemeshrenderableseries3d.md#paletteprovider)
* [parentSurface](surfacemeshrenderableseries3d.md#parentsurface)
* [pointMarker](surfacemeshrenderableseries3d.md#pointmarker)
* [sceneEntity](surfacemeshrenderableseries3d.md#sceneentity)
* [shininess](surfacemeshrenderableseries3d.md#shininess)
* [stroke](surfacemeshrenderableseries3d.md#stroke)
* [strokeThickness](surfacemeshrenderableseries3d.md#strokethickness)
* [type](surfacemeshrenderableseries3d.md#type)
* [yOffset](surfacemeshrenderableseries3d.md#yoffset)

### Methods

* [applyTheme](surfacemeshrenderableseries3d.md#applytheme)
* [delete](surfacemeshrenderableseries3d.md#delete)
* [onAttach](surfacemeshrenderableseries3d.md#onattach)
* [onDetach](surfacemeshrenderableseries3d.md#ondetach)

## Constructors

###  constructor

\+ **new SurfaceMeshRenderableSeries3D**(`webAssemblyContext`: TSciChart3D, `options?`: [ISurfaceMeshRenderableSeries3DOptions](../interfaces/isurfacemeshrenderableseries3doptions.md)): *[SurfaceMeshRenderableSeries3D](surfacemeshrenderableseries3d.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:107](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [ISurfaceMeshRenderableSeries3DOptions](../interfaces/isurfacemeshrenderableseries3doptions.md) |

**Returns:** *[SurfaceMeshRenderableSeries3D](surfacemeshrenderableseries3d.md)*

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md).[invalidateParentCallback](../interfaces/irenderableseries3d.md#invalidateparentcallback)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[invalidateParentCallback](baserenderableseries3d.md#invalidateparentcallback)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L38)*

#### Type declaration:

▸ (): *void*

## Accessors

###  cellHardnessFactor

• **get cellHardnessFactor**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:226](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L226)*

**Returns:** *number*

• **set cellHardnessFactor**(`cellHardnessFactor`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:229](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`cellHardnessFactor` | number |

**Returns:** *void*

___

###  colorMapTextureSize

• **get colorMapTextureSize**(): *Size*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:138](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L138)*

**Returns:** *Size*

• **set colorMapTextureSize**(`colorMapTextureSize`: Size): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:141](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`colorMapTextureSize` | Size |

**Returns:** *void*

___

###  contourInterval

• **get contourInterval**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:250](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L250)*

**Returns:** *number*

• **set contourInterval**(`contourInterval`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:253](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L253)*

**Parameters:**

Name | Type |
------ | ------ |
`contourInterval` | number |

**Returns:** *void*

___

###  contourOffset

• **get contourOffset**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:258](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L258)*

**Returns:** *number*

• **set contourOffset**(`contourOffset`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:261](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L261)*

**Parameters:**

Name | Type |
------ | ------ |
`contourOffset` | number |

**Returns:** *void*

___

###  contourStroke

• **get contourStroke**(): *string*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:266](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L266)*

**Returns:** *string*

• **set contourStroke**(`contourStroke`: string): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:269](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L269)*

**Parameters:**

Name | Type |
------ | ------ |
`contourStroke` | string |

**Returns:** *void*

___

###  contourStrokeThickness

• **get contourStrokeThickness**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:242](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L242)*

**Returns:** *number*

• **set contourStrokeThickness**(`contourStrokeThickness`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:245](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L245)*

**Parameters:**

Name | Type |
------ | ------ |
`contourStrokeThickness` | number |

**Returns:** *void*

___

###  dataSeries

• **get dataSeries**(): *[BaseDataSeries3D](basedataseries3d.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[dataSeries](baserenderableseries3d.md#dataseries)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:105](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L105)*

**Returns:** *[BaseDataSeries3D](basedataseries3d.md)*

• **set dataSeries**(`dataSeries`: [BaseDataSeries3D](basedataseries3d.md)): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[dataSeries](baserenderableseries3d.md#dataseries)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`dataSeries` | [BaseDataSeries3D](basedataseries3d.md) |

**Returns:** *void*

___

###  drawMeshAs

• **get drawMeshAs**(): *[EDrawMeshAs](../enums/edrawmeshas.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:146](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L146)*

**Returns:** *[EDrawMeshAs](../enums/edrawmeshas.md)*

• **set drawMeshAs**(`drawMeshAs`: [EDrawMeshAs](../enums/edrawmeshas.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:149](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`drawMeshAs` | [EDrawMeshAs](../enums/edrawmeshas.md) |

**Returns:** *void*

___

###  drawSkirt

• **get drawSkirt**(): *boolean*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:162](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L162)*

**Returns:** *boolean*

• **set drawSkirt**(`drawSkirt`: boolean): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:165](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L165)*

**Parameters:**

Name | Type |
------ | ------ |
`drawSkirt` | boolean |

**Returns:** *void*

___

###  heightScaleFactor

• **get heightScaleFactor**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:202](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L202)*

**Returns:** *number*

• **set heightScaleFactor**(`heightScaleFactor`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:205](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L205)*

**Parameters:**

Name | Type |
------ | ------ |
`heightScaleFactor` | number |

**Returns:** *void*

___

###  highlight

• **get highlight**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:274](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L274)*

**Returns:** *number*

• **set highlight**(`highlight`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:277](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L277)*

**Parameters:**

Name | Type |
------ | ------ |
`highlight` | number |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[isVisible](baserenderableseries3d.md#isvisible)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:133](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L133)*

**Returns:** *boolean*

• **set isVisible**(`isVisible`: boolean): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[isVisible](baserenderableseries3d.md#isvisible)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:137](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`isVisible` | boolean |

**Returns:** *void*

___

###  lightingFactor

• **get lightingFactor**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:234](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L234)*

**Returns:** *number*

• **set lightingFactor**(`lightingFactor`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:237](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L237)*

**Parameters:**

Name | Type |
------ | ------ |
`lightingFactor` | number |

**Returns:** *void*

___

###  maximum

• **get maximum**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:186](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L186)*

**Returns:** *number*

• **set maximum**(`maximum`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:189](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L189)*

**Parameters:**

Name | Type |
------ | ------ |
`maximum` | number |

**Returns:** *void*

___

###  meshColorPalette

• **get meshColorPalette**(): *[MeshColorPalette](meshcolorpalette.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L170)*

**Returns:** *[MeshColorPalette](meshcolorpalette.md)*

• **set meshColorPalette**(`meshColorPalette`: [MeshColorPalette](meshcolorpalette.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:173](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L173)*

**Parameters:**

Name | Type |
------ | ------ |
`meshColorPalette` | [MeshColorPalette](meshcolorpalette.md) |

**Returns:** *void*

___

###  meshPaletteMode

• **get meshPaletteMode**(): *[EMeshPaletteMode](../enums/emeshpalettemode.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:194](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L194)*

**Returns:** *[EMeshPaletteMode](../enums/emeshpalettemode.md)*

• **set meshPaletteMode**(`meshPaletteMode`: [EMeshPaletteMode](../enums/emeshpalettemode.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:197](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L197)*

**Parameters:**

Name | Type |
------ | ------ |
`meshPaletteMode` | [EMeshPaletteMode](../enums/emeshpalettemode.md) |

**Returns:** *void*

___

###  meshResolution

• **get meshResolution**(): *[EMeshResolution](../enums/emeshresolution.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:210](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L210)*

**Returns:** *[EMeshResolution](../enums/emeshresolution.md)*

• **set meshResolution**(`meshResolution`: [EMeshResolution](../enums/emeshresolution.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:213](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L213)*

**Parameters:**

Name | Type |
------ | ------ |
`meshResolution` | [EMeshResolution](../enums/emeshresolution.md) |

**Returns:** *void*

___

###  minimum

• **get minimum**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:178](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L178)*

**Returns:** *number*

• **set minimum**(`minimum`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:181](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L181)*

**Parameters:**

Name | Type |
------ | ------ |
`minimum` | number |

**Returns:** *void*

___

###  opacity

• **get opacity**(): *number*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[opacity](baserenderableseries3d.md#opacity)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L69)*

**Returns:** *number*

• **set opacity**(`opacity`: number): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[opacity](baserenderableseries3d.md#opacity)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:72](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`opacity` | number |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider3D](../interfaces/ipaletteprovider3d.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[paletteProvider](baserenderableseries3d.md#paletteprovider)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L89)*

**Returns:** *[IPaletteProvider3D](../interfaces/ipaletteprovider3d.md)*

• **set paletteProvider**(`paletteProvider`: [IPaletteProvider3D](../interfaces/ipaletteprovider3d.md)): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[paletteProvider](baserenderableseries3d.md#paletteprovider)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`paletteProvider` | [IPaletteProvider3D](../interfaces/ipaletteprovider3d.md) |

**Returns:** *void*

___

###  parentSurface

• **get parentSurface**(): *[SciChart3DSurface](scichart3dsurface.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[parentSurface](baserenderableseries3d.md#parentsurface)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:124](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L124)*

**Returns:** *[SciChart3DSurface](scichart3dsurface.md)*

• **set parentSurface**(`parentSurface`: [SciChart3DSurface](scichart3dsurface.md)): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[parentSurface](baserenderableseries3d.md#parentsurface)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:128](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`parentSurface` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[BasePointMarker3D](basepointmarker3d.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[pointMarker](baserenderableseries3d.md#pointmarker)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:114](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L114)*

**Returns:** *[BasePointMarker3D](basepointmarker3d.md)*

• **set pointMarker**(`pointMarker`: [BasePointMarker3D](basepointmarker3d.md)): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[pointMarker](baserenderableseries3d.md#pointmarker)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:117](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`pointMarker` | [BasePointMarker3D](basepointmarker3d.md) |

**Returns:** *void*

___

###  sceneEntity

• **get sceneEntity**(): *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[sceneEntity](baserenderableseries3d.md#sceneentity)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L77)*

**Returns:** *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

___

###  shininess

• **get shininess**(): *number*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[shininess](baserenderableseries3d.md#shininess)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L81)*

**Returns:** *number*

• **set shininess**(`shininess`: number): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[shininess](baserenderableseries3d.md#shininess)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`shininess` | number |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[stroke](baserenderableseries3d.md#stroke)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L97)*

**Returns:** *string*

• **set stroke**(`stroke`: string): *void*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[stroke](baserenderableseries3d.md#stroke)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L100)*

**Parameters:**

Name | Type |
------ | ------ |
`stroke` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:154](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L154)*

**Returns:** *number*

• **set strokeThickness**(`strokeThickness`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`strokeThickness` | number |

**Returns:** *void*

___

###  type

• **get type**(): *[ESeriesType3D](../enums/eseriestype3d.md)*

*Overrides [BaseRenderableSeries3D](baserenderableseries3d.md).[type](baserenderableseries3d.md#abstract-type)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:134](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L134)*

**Returns:** *[ESeriesType3D](../enums/eseriestype3d.md)*

___

###  yOffset

• **get yOffset**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:218](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L218)*

**Returns:** *number*

• **set yOffset**(`yOffset`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D.ts#L221)*

**Parameters:**

Name | Type |
------ | ------ |
`yOffset` | number |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[applyTheme](baserenderableseries3d.md#applytheme)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[delete](baserenderableseries3d.md#delete)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:161](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L161)*

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChart3DSurface](scichart3dsurface.md)): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[onAttach](baserenderableseries3d.md#onattach)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:145](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[onDetach](baserenderableseries3d.md#ondetach)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L156)*

**Returns:** *void*
