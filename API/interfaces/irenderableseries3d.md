[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IRenderableSeries3D](irenderableseries3d.md)

# Interface: IRenderableSeries3D

## Hierarchy

* IDeletable

* [IThemeable](ithemeable.md)

  ↳ **IRenderableSeries3D**

## Implemented by

* [BaseRenderableSeries3D](../classes/baserenderableseries3d.md)
* [ScatterRenderableSeries3D](../classes/scatterrenderableseries3d.md)
* [SurfaceMeshRenderableSeries3D](../classes/surfacemeshrenderableseries3d.md)

## Index

### Properties

* [dataSeries](irenderableseries3d.md#dataseries)
* [invalidateParentCallback](irenderableseries3d.md#invalidateparentcallback)
* [isVisible](irenderableseries3d.md#isvisible)
* [parentSurface](irenderableseries3d.md#parentsurface)
* [pointMarker](irenderableseries3d.md#pointmarker)
* [sceneEntity](irenderableseries3d.md#readonly-sceneentity)
* [type](irenderableseries3d.md#readonly-type)

### Methods

* [applyTheme](irenderableseries3d.md#applytheme)
* [delete](irenderableseries3d.md#delete)
* [onAttach](irenderableseries3d.md#onattach)
* [onDetach](irenderableseries3d.md#ondetach)

## Properties

###  dataSeries

• **dataSeries**: *[BaseDataSeries3D](../classes/basedataseries3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:19](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L19)*

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L21)*

#### Type declaration:

▸ (): *void*

___

###  isVisible

• **isVisible**: *boolean*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L20)*

___

###  parentSurface

• **parentSurface**: *[SciChart3DSurface](../classes/scichart3dsurface.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L18)*

___

###  pointMarker

• **pointMarker**: *[BasePointMarker3D](../classes/basepointmarker3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L22)*

___

### `Readonly` sceneEntity

• **sceneEntity**: *[IBaseSceneEntity](ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L17)*

___

### `Readonly` type

• **type**: *[ESeriesType3D](../enums/eseriestype3d.md)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L16)*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](ithemeprovider.md)): *void*

*Inherited from [IThemeable](ithemeable.md).[applyTheme](ithemeable.md#applytheme)*

*Defined in [src/Charting/Themes/IThemeable.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/IThemeable.ts#L13)*

Applies a theme (defined by [IThemeProvider](ithemeprovider.md)) to the current element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`themeProvider` | [IThemeProvider](ithemeprovider.md) | The theme data to apply  |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChart3DSurface](../classes/scichart3dsurface.md)): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChart3DSurface](../classes/scichart3dsurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/BaseRenderableSeries3D.ts#L25)*

**Returns:** *void*
