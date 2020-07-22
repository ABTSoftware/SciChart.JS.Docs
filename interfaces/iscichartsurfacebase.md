[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ISciChartSurfaceBase](iscichartsurfacebase.md)

# Interface: ISciChartSurfaceBase

**`summary`** Defines the interface to a 2D Cartesian [SciChartSurface](../classes/scichartsurface.md) or 3D Cartesian [SciChart3DSurface](../classes/scichart3dsurface.md) within SciChart -
High Performance Realtime [JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
See derived types [SciChartSurface](../classes/scichartsurface.md) (2D Charts) and [SciChart3DSurface](../classes/scichart3dsurface.md) (3D Charts) for more specific instructions on how
to use the SciChartSurface and create a 2D or 3D [JavaScript Chart](https://www.scichart.com/javascript-chart-features)

## Hierarchy

* IDeletable

* [IThemeable](ithemeable.md)

  ↳ **ISciChartSurfaceBase**

## Implemented by

* [SciChart3DSurface](../classes/scichart3dsurface.md)
* [SciChartPieSurface](../classes/scichartpiesurface.md)
* [SciChartSurface](../classes/scichartsurface.md)
* [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

## Index

### Properties

* [domCanvas2D](iscichartsurfacebase.md#readonly-domcanvas2d)

### Methods

* [applyTheme](iscichartsurfacebase.md#applytheme)
* [changeViewportSize](iscichartsurfacebase.md#changeviewportsize)
* [delete](iscichartsurfacebase.md#delete)

## Properties

### `Readonly` domCanvas2D

• **domCanvas2D**: *HTMLCanvasElement*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L26)*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](ithemeprovider.md)): *void*

*Inherited from [IThemeable](ithemeable.md).[applyTheme](ithemeable.md#applytheme)*

*Defined in [src/Charting/Themes/IThemeable.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/IThemeable.ts#L13)*

Applies a theme (defined by [IThemeProvider](ithemeprovider.md)) to the current element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`themeProvider` | [IThemeProvider](ithemeprovider.md) | The theme data to apply  |

**Returns:** *void*

___

###  changeViewportSize

▸ **changeViewportSize**(`width`: number, `height`: number): *void*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L33)*

Changes the Viewport Size of the [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`width` | number | - |
`height` | number |   |

**Returns:** *void*

___

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
