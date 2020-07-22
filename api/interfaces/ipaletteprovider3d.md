[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IPaletteProvider3D](ipaletteprovider3d.md)

# Interface: IPaletteProvider3D

## Hierarchy

* **IPaletteProvider3D**

  ↳ [IPointMarkerPaletteProvider3D](ipointmarkerpaletteprovider3d.md)

## Index

### Methods

* [onAttached](ipaletteprovider3d.md#onattached)
* [onDetached](ipaletteprovider3d.md#ondetached)

## Methods

###  onAttached

▸ **onAttached**(`parentSeries`: [IRenderableSeries3D](irenderableseries3d.md)): *void*

*Defined in [src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts#L10)*

Called when the PaletteProvider3D instance is attached to a 3D RenderableSeries.
Use this to be notified when attached and keep a reference to the parent series

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentSeries` | [IRenderableSeries3D](irenderableseries3d.md) |   |

**Returns:** *void*

___

###  onDetached

▸ **onDetached**(): *void*

*Defined in [src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts#L15)*

Called when the PaletteProvider3D instance is detached from a 3D RenderableSeries

**Returns:** *void*
