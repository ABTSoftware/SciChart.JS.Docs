[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IFillPaletteProvider](ifillpaletteprovider.md)

# Interface: IFillPaletteProvider

The IFillPaletteProvider interface allows you to perform per-point paletting or coloring of series or data-points
in Mountain, Column, Candlestick Charts and JavaScript chart types which have a fill or body

**`remarks`** 
See type [IStrokePaletteProvider](istrokepaletteprovider.md) for per data-point coloring of strokes or outlines

## Hierarchy

* [IPaletteProvider](ipaletteprovider.md)

  ↳ **IFillPaletteProvider**

## Index

### Methods

* [onAttached](ifillpaletteprovider.md#onattached)
* [onDetached](ifillpaletteprovider.md#ondetached)
* [overrideFillAbgr](ifillpaletteprovider.md#overridefillabgr)

## Methods

###  onAttached

▸ **onAttached**(`parentSeries`: [IRenderableSeries](irenderableseries.md)): *void*

*Inherited from [IPaletteProvider](ipaletteprovider.md).[onAttached](ipaletteprovider.md#onattached)*

*Defined in [src/Charting/Model/IPaletteProvider.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L16)*

Called when the PaletteProvider instance is attached to a [RenderableSeries](../classes/baserenderableseries.md).
Use this to be notified when attached and keep a reference to the parent series

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentSeries` | [IRenderableSeries](irenderableseries.md) |   |

**Returns:** *void*

___

###  onDetached

▸ **onDetached**(): *void*

*Inherited from [IPaletteProvider](ipaletteprovider.md).[onDetached](ipaletteprovider.md#ondetached)*

*Defined in [src/Charting/Model/IPaletteProvider.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L21)*

Called when the PaletteProvider instance is detached from a [RenderableSeries](../classes/baserenderableseries.md).

**Returns:** *void*

___

###  overrideFillAbgr

▸ **overrideFillAbgr**(`xValue`: number, `yValue`: number, `index`: number): *number*

*Defined in [src/Charting/Model/IPaletteProvider.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L69)*

Called by SciChart and may be used to override the color of filled polygon in various chart types.

**`remarks`** WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xValue` | number | the current XValue |
`yValue` | number | the current YValue |
`index` | number | the current index to the data |

**Returns:** *number*

an ABGR color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
