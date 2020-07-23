[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IThemeable](ithemeable.md)

# Interface: IThemeable

The interface for types which are Themeable in SciChart - High Performance Realtime
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

## Hierarchy

* **IThemeable**

  ↳ [IRenderableSeries](irenderableseries.md)

  ↳ [IChartModifierBase](ichartmodifierbase.md)

  ↳ [ISciChartSurfaceBase](iscichartsurfacebase.md)

  ↳ [IRenderableSeries3D](irenderableseries3d.md)

## Implemented by

* [AxisBase2D](../classes/axisbase2d.md)
* [CategoryAxis](../classes/categoryaxis.md)
* [NumericAxis](../classes/numericaxis.md)

## Index

### Methods

* [applyTheme](ithemeable.md#applytheme)

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](ithemeprovider.md)): *void*

*Defined in [src/Charting/Themes/IThemeable.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/IThemeable.ts#L13)*

Applies a theme (defined by [IThemeProvider](ithemeprovider.md)) to the current element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`themeProvider` | [IThemeProvider](ithemeprovider.md) | The theme data to apply  |

**Returns:** *void*
