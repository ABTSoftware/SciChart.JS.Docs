[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IPointMarkerPaletteProvider3D](ipointmarkerpaletteprovider3d.md)

# Interface: IPointMarkerPaletteProvider3D

## Hierarchy

* [IPaletteProvider3D](ipaletteprovider3d.md)

  ↳ **IPointMarkerPaletteProvider3D**

## Index

### Methods

* [onAttached](ipointmarkerpaletteprovider3d.md#onattached)
* [onDetached](ipointmarkerpaletteprovider3d.md#ondetached)
* [overrideColorAbgr](ipointmarkerpaletteprovider3d.md#overridecolorabgr)

## Methods

###  onAttached

▸ **onAttached**(`parentSeries`: [IRenderableSeries3D](irenderableseries3d.md)): *void*

*Inherited from [IPaletteProvider3D](ipaletteprovider3d.md).[onAttached](ipaletteprovider3d.md#onattached)*

*Defined in [src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts#L10)*

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

*Inherited from [IPaletteProvider3D](ipaletteprovider3d.md).[onDetached](ipaletteprovider3d.md#ondetached)*

*Defined in [src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts#L15)*

Called when the PaletteProvider3D instance is detached from a 3D RenderableSeries

**Returns:** *void*

___

###  overrideColorAbgr

▸ **overrideColorAbgr**(`xValue`: number, `yValue`: number, `zValue`: number, `index`: number, `metadata?`: [IPointMetadata3D](ipointmetadata3d.md)): *number*

*Defined in [src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Model/DataSeries/IPaletteProvider3D.ts#L29)*

Called by SciChart and may be used to override a 3D Point-marker in Scatter or
Bubble 3D Charts on a per-point basis

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xValue` | number | the current XValue |
`yValue` | number | the current YValue |
`zValue` | number | the current ZValue |
`index` | number | the current index to the data |
`metadata?` | [IPointMetadata3D](ipointmetadata3d.md) | the current metadata |

**Returns:** *number*

an ABGR color code, e.g. e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
