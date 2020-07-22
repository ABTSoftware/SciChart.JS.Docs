[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseRenderableSeries3D](baserenderableseries3d.md)

# Class: BaseRenderableSeries3D

## Hierarchy

* **BaseRenderableSeries3D**

  ↳ [ScatterRenderableSeries3D](scatterrenderableseries3d.md)

  ↳ [SurfaceMeshRenderableSeries3D](surfacemeshrenderableseries3d.md)

## Implements

* [IRenderableSeries3D](../interfaces/irenderableseries3d.md)

## Index

### Properties

* [invalidateParentCallback](baserenderableseries3d.md#invalidateparentcallback)
* [type](baserenderableseries3d.md#abstract-type)

### Accessors

* [dataSeries](baserenderableseries3d.md#dataseries)
* [isVisible](baserenderableseries3d.md#isvisible)
* [opacity](baserenderableseries3d.md#opacity)
* [paletteProvider](baserenderableseries3d.md#paletteprovider)
* [parentSurface](baserenderableseries3d.md#parentsurface)
* [pointMarker](baserenderableseries3d.md#pointmarker)
* [sceneEntity](baserenderableseries3d.md#sceneentity)
* [shininess](baserenderableseries3d.md#shininess)
* [stroke](baserenderableseries3d.md#stroke)

### Methods

* [applyTheme](baserenderableseries3d.md#applytheme)
* [delete](baserenderableseries3d.md#delete)
* [onAttach](baserenderableseries3d.md#onattach)
* [onDetach](baserenderableseries3d.md#ondetach)

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md).[invalidateParentCallback](../interfaces/irenderableseries3d.md#invalidateparentcallback)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L38)*

#### Type declaration:

▸ (): *void*

___

### `Abstract` type

• **type**: *[ESeriesType3D](../enums/eseriestype3d.md)*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md).[type](../interfaces/irenderableseries3d.md#readonly-type)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L37)*

## Accessors

###  dataSeries

• **get dataSeries**(): *[BaseDataSeries3D](basedataseries3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:105](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L105)*

**Returns:** *[BaseDataSeries3D](basedataseries3d.md)*

• **set dataSeries**(`dataSeries`: [BaseDataSeries3D](basedataseries3d.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`dataSeries` | [BaseDataSeries3D](basedataseries3d.md) |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:133](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L133)*

**Returns:** *boolean*

• **set isVisible**(`isVisible`: boolean): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:137](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`isVisible` | boolean |

**Returns:** *void*

___

###  opacity

• **get opacity**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L69)*

**Returns:** *number*

• **set opacity**(`opacity`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:72](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`opacity` | number |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider3D](../interfaces/ipaletteprovider3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L89)*

**Returns:** *[IPaletteProvider3D](../interfaces/ipaletteprovider3d.md)*

• **set paletteProvider**(`paletteProvider`: [IPaletteProvider3D](../interfaces/ipaletteprovider3d.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`paletteProvider` | [IPaletteProvider3D](../interfaces/ipaletteprovider3d.md) |

**Returns:** *void*

___

###  parentSurface

• **get parentSurface**(): *[SciChart3DSurface](scichart3dsurface.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:124](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L124)*

**Returns:** *[SciChart3DSurface](scichart3dsurface.md)*

• **set parentSurface**(`parentSurface`: [SciChart3DSurface](scichart3dsurface.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:128](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`parentSurface` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[BasePointMarker3D](basepointmarker3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:114](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L114)*

**Returns:** *[BasePointMarker3D](basepointmarker3d.md)*

• **set pointMarker**(`pointMarker`: [BasePointMarker3D](basepointmarker3d.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:117](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`pointMarker` | [BasePointMarker3D](basepointmarker3d.md) |

**Returns:** *void*

___

###  sceneEntity

• **get sceneEntity**(): *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L77)*

**Returns:** *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

___

###  shininess

• **get shininess**(): *number*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L81)*

**Returns:** *number*

• **set shininess**(`shininess`: number): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`shininess` | number |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L97)*

**Returns:** *string*

• **set stroke**(`stroke`: string): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L100)*

**Parameters:**

Name | Type |
------ | ------ |
`stroke` | string |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:161](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L161)*

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChart3DSurface](scichart3dsurface.md)): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:145](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L156)*

**Returns:** *void*
