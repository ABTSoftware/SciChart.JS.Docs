[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IPaletteProvider](ipaletteprovider.md)

# Interface: IPaletteProvider

The PaletteProvider interface allows you to perform per-point paletting or coloring of series or data-points
in SciChart's [High Performance Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
See derived type [IStrokePaletteProvider](istrokepaletteprovider.md) for coloring line series or strokes.
See derived type [IFillPaletteProvider](ifillpaletteprovider.md) for coloring fills or areas.

## Hierarchy

* **IPaletteProvider**

  ↳ [IStrokePaletteProvider](istrokepaletteprovider.md)

  ↳ [IFillPaletteProvider](ifillpaletteprovider.md)

  ↳ [IPointMarkerPaletteProvider](ipointmarkerpaletteprovider.md)

## Index

### Methods

* [onAttached](ipaletteprovider.md#onattached)
* [onDetached](ipaletteprovider.md#ondetached)

## Methods

###  onAttached

▸ **onAttached**(`parentSeries`: [IRenderableSeries](irenderableseries.md)): *void*

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

*Defined in [src/Charting/Model/IPaletteProvider.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L21)*

Called when the PaletteProvider instance is detached from a [RenderableSeries](../classes/baserenderableseries.md).

**Returns:** *void*
