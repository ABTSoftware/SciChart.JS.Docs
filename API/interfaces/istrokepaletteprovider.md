[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IStrokePaletteProvider](istrokepaletteprovider.md)

# Interface: IStrokePaletteProvider

The IStrokePaletteProvider interface allows you to perform per-point paletting or coloring of series or data-points
in Line Charts and JavaScript chart types which have a stroke line or outline

**`remarks`** 
See type [IFillPaletteProvider](ifillpaletteprovider.md) for per data-point coloring of fills or areas.

## Hierarchy

* [IPaletteProvider](ipaletteprovider.md)

  ↳ **IStrokePaletteProvider**

## Index

### Properties

* [strokePaletteMode](istrokepaletteprovider.md#readonly-strokepalettemode)

### Methods

* [onAttached](istrokepaletteprovider.md#onattached)
* [onDetached](istrokepaletteprovider.md#ondetached)
* [overrideStrokeAbgr](istrokepaletteprovider.md#overridestrokeabgr)

## Properties

### `Readonly` strokePaletteMode

• **strokePaletteMode**: *[EStrokePaletteMode](../enums/estrokepalettemode.md)*

*Defined in [src/Charting/Model/IPaletteProvider.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L39)*

Gets the stroke palette mode

## Methods

###  onAttached

▸ **onAttached**(`parentSeries`: [IRenderableSeries](irenderableseries.md)): *void*

*Inherited from [IPaletteProvider](ipaletteprovider.md).[onAttached](ipaletteprovider.md#onattached)*

*Defined in [src/Charting/Model/IPaletteProvider.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L16)*

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

*Defined in [src/Charting/Model/IPaletteProvider.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L21)*

Called when the PaletteProvider instance is detached from a [RenderableSeries](../classes/baserenderableseries.md).

**Returns:** *void*

___

###  overrideStrokeAbgr

▸ **overrideStrokeAbgr**(`xValue`: number, `yValue`: number, `index`: number): *number*

*Defined in [src/Charting/Model/IPaletteProvider.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/IPaletteProvider.ts#L50)*

Called by SciChart and may be used to override the color of a line segment or
stroke outline in various chart types.

**`remarks`** WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xValue` | number | the current XValue |
`yValue` | number | the current YValue |
`index` | number | the current index to the data |

**Returns:** *number*

an ABGR color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
