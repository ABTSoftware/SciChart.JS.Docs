[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [ScatterRenderableSeries3D](scatterrenderableseries3d.md)

# Class: ScatterRenderableSeries3D

## Hierarchy

* [BaseRenderableSeries3D](baserenderableseries3d.md)

  ↳ **ScatterRenderableSeries3D**

## Implements

* [IRenderableSeries3D](../interfaces/irenderableseries3d.md)

## Index

### Constructors

* [constructor](scatterrenderableseries3d.md#constructor)

### Properties

* [invalidateParentCallback](scatterrenderableseries3d.md#invalidateparentcallback)
* [type](scatterrenderableseries3d.md#readonly-type)

### Accessors

* [dataSeries](scatterrenderableseries3d.md#dataseries)
* [isVisible](scatterrenderableseries3d.md#isvisible)
* [opacity](scatterrenderableseries3d.md#opacity)
* [paletteProvider](scatterrenderableseries3d.md#paletteprovider)
* [parentSurface](scatterrenderableseries3d.md#parentsurface)
* [pointMarker](scatterrenderableseries3d.md#pointmarker)
* [sceneEntity](scatterrenderableseries3d.md#sceneentity)
* [shininess](scatterrenderableseries3d.md#shininess)
* [stroke](scatterrenderableseries3d.md#stroke)

### Methods

* [applyTheme](scatterrenderableseries3d.md#applytheme)
* [delete](scatterrenderableseries3d.md#delete)
* [onAttach](scatterrenderableseries3d.md#onattach)
* [onDetach](scatterrenderableseries3d.md#ondetach)

## Constructors

###  constructor

\+ **new ScatterRenderableSeries3D**(`webAssemblyContext`: TSciChart3D, `options?`: [IBaseRenderableSeries3DOptions](../interfaces/ibaserenderableseries3doptions.md)): *[ScatterRenderableSeries3D](scatterrenderableseries3d.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IBaseRenderableSeries3DOptions](../interfaces/ibaserenderableseries3doptions.md) |

**Returns:** *[ScatterRenderableSeries3D](scatterrenderableseries3d.md)*

## Properties

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md).[invalidateParentCallback](../interfaces/irenderableseries3d.md#invalidateparentcallback)*

*Inherited from [BaseRenderableSeries3D](baserenderableseries3d.md).[invalidateParentCallback](baserenderableseries3d.md#invalidateparentcallback)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L38)*

#### Type declaration:

▸ (): *void*

___

### `Readonly` type

• **type**: *[ESeriesType3D](../enums/eseriestype3d.md)* = ESeriesType3D.ScatterRenderableSeries3D

*Implementation of [IRenderableSeries3D](../interfaces/irenderableseries3d.md).[type](../interfaces/irenderableseries3d.md#readonly-type)*

*Overrides [BaseRenderableSeries3D](baserenderableseries3d.md).[type](baserenderableseries3d.md#abstract-type)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D.ts#L7)*

## Accessors

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
