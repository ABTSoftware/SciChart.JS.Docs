[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IPointMarkerPaletteProvider](ipointmarkerpaletteprovider.md)

# Interface: IPointMarkerPaletteProvider

The IPointMarkerPaletteProvider interface allows you to perform per-point paletting or coloring of series or data-points
in Scatter Charts and JavaScript chart types which have a point-marker

**`remarks`** 
See type [IStrokePaletteProvider](istrokepaletteprovider.md) for per data-point coloring of strokes or outlines
See type [IFillPaletteProvider](ifillpaletteprovider.md) for per data-point coloring of fills or areas.

## Hierarchy

* [IPaletteProvider](ipaletteprovider.md)

  ↳ **IPointMarkerPaletteProvider**

## Index

### Methods

* [onAttached](ipointmarkerpaletteprovider.md#onattached)
* [onDetached](ipointmarkerpaletteprovider.md#ondetached)
* [overridePointMarkerAbgr](ipointmarkerpaletteprovider.md#overridepointmarkerabgr)

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

###  overridePointMarkerAbgr

▸ **overridePointMarkerAbgr**(`xValue`: number, `yValue`: number, `index`: number): *[TStrokeFill](../globals.md#tstrokefill)*

*Defined in [src/Charting/Model/IPaletteProvider.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L95)*

Called by SciChart and may be used to override the color of fill/stroke on pointmarkers
WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xValue` | number | the current XValue |
`yValue` | number | the current YValue |
`index` | number | the current index to the data |

**Returns:** *[TStrokeFill](../globals.md#tstrokefill)*

TStrokeFill type with ABGR stroke & fill color codes,
e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
