[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IChartModifierBase](ichartmodifierbase.md)

# Interface: IChartModifierBase

Defines the interface to a [Chart Modifier](../classes/chartmodifierbase.md) - a class which provides Zoom, Pan, Tooltip or interaction behavior
to SciChart - High Performance Realtime [JavaScript Charts](https://www.scichart.com/javascript-chart-features)

## Hierarchy

* [IThemeable](ithemeable.md)

  ↳ **IChartModifierBase**

## Implemented by

* [ChartModifierBase](../classes/chartmodifierbase.md)
* [ChartModifierBase2D](../classes/chartmodifierbase2d.md)
* [ChartModifierBase3D](../classes/chartmodifierbase3d.md)
* [LegendModifier](../classes/legendmodifier.md)
* [MouseWheelZoomModifier](../classes/mousewheelzoommodifier.md)
* [MouseWheelZoomModifier3D](../classes/mousewheelzoommodifier3d.md)
* [OrbitModifier3D](../classes/orbitmodifier3d.md)
* [RolloverModifier](../classes/rollovermodifier.md)
* [RubberBandXyZoomModifier](../classes/rubberbandxyzoommodifier.md)
* [ZoomExtentsModifier](../classes/zoomextentsmodifier.md)
* [ZoomPanModifier](../classes/zoompanmodifier.md)

## Index

### Properties

* [canReceiveMouseEvents](ichartmodifierbase.md#canreceivemouseevents)
* [invalidateParentCallback](ichartmodifierbase.md#invalidateparentcallback)
* [isAttached](ichartmodifierbase.md#isattached)
* [isEnabled](ichartmodifierbase.md#isenabled)
* [modifierGroup](ichartmodifierbase.md#modifiergroup)
* [modifierType](ichartmodifierbase.md#modifiertype)
* [receiveHandledEvents](ichartmodifierbase.md#receivehandledevents)

### Methods

* [applyTheme](ichartmodifierbase.md#applytheme)
* [modifierDoubleClick](ichartmodifierbase.md#modifierdoubleclick)
* [modifierMouseDown](ichartmodifierbase.md#modifiermousedown)
* [modifierMouseEnter](ichartmodifierbase.md#modifiermouseenter)
* [modifierMouseLeave](ichartmodifierbase.md#modifiermouseleave)
* [modifierMouseMove](ichartmodifierbase.md#modifiermousemove)
* [modifierMouseUp](ichartmodifierbase.md#modifiermouseup)
* [modifierMouseWheel](ichartmodifierbase.md#modifiermousewheel)
* [onAttach](ichartmodifierbase.md#onattach)
* [onAttachSeries](ichartmodifierbase.md#onattachseries)
* [onDetach](ichartmodifierbase.md#ondetach)
* [onDetachSeries](ichartmodifierbase.md#ondetachseries)
* [onParentSurfaceRendered](ichartmodifierbase.md#onparentsurfacerendered)
* [setParentSurface](ichartmodifierbase.md#setparentsurface)

## Properties

###  canReceiveMouseEvents

• **canReceiveMouseEvents**: *boolean*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L45)*

When true, this modifier can receive mouse events

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L22)*

A callback to invalidate the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

#### Type declaration:

▸ (): *void*

___

###  isAttached

• **isAttached**: *boolean*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L35)*

When true, the modifier is attached to a [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**`remarks`** Set internally by SciChart on attaching to a parent surface

___

###  isEnabled

• **isEnabled**: *boolean*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L30)*

When true, the modifier is enabled

___

###  modifierGroup

• **modifierGroup**: *string*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L50)*

Specifies a string ID to group modifiers.

**`remarks`** When one receives a mouse event, all modifiers in the same group receive the event.

___

###  modifierType

• **modifierType**: *[EModifierType](../enums/emodifiertype.md)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L26)*

The type of Chart Modifier, see [EModifierType](../enums/emodifiertype.md) for a list of values

___

###  receiveHandledEvents

• **receiveHandledEvents**: *boolean*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L41)*

When true, this modifier should receive events which have been handled by modifiers
higher up in the call hierachy.

**`remarks`** Use this property to solve issues related to events being consumed by modifiers and not passed down

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

###  modifierDoubleClick

▸ **modifierDoubleClick**(`args`: [ModifierMouseArgs](../classes/modifiermouseargs.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L96)*

Method called when mouse double-click or touch double-tap occurs on the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](../classes/modifiermouseargs.md) | the [ModifierMouseArgs](../classes/modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseDown

▸ **modifierMouseDown**(`args`: [ModifierMouseArgs](../classes/modifiermouseargs.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L76)*

Method called when mouse-down or touch-down occurs on the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](../classes/modifiermouseargs.md) | the [ModifierMouseArgs](../classes/modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseEnter

▸ **modifierMouseEnter**(`args`: [ModifierMouseArgs](../classes/modifiermouseargs.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:106](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L106)*

Method called when mouse enters the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](../classes/modifiermouseargs.md) | the [ModifierMouseArgs](../classes/modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseLeave

▸ **modifierMouseLeave**(`args`: [ModifierMouseArgs](../classes/modifiermouseargs.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:101](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L101)*

Method called when mouse leaves the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](../classes/modifiermouseargs.md) | the [ModifierMouseArgs](../classes/modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseMove

▸ **modifierMouseMove**(`args`: [ModifierMouseArgs](../classes/modifiermouseargs.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L81)*

Method called when mouse-move or touch-move occurs on the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](../classes/modifiermouseargs.md) | the [ModifierMouseArgs](../classes/modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseUp

▸ **modifierMouseUp**(`args`: [ModifierMouseArgs](../classes/modifiermouseargs.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:86](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L86)*

Method called when mouse-up or touch-up occurs on the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](../classes/modifiermouseargs.md) | the [ModifierMouseArgs](../classes/modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseWheel

▸ **modifierMouseWheel**(`args`: [ModifierMouseArgs](../classes/modifiermouseargs.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L91)*

Method called when mouse-wheel scroll occurs on the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](../classes/modifiermouseargs.md) | the [ModifierMouseArgs](../classes/modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L54)*

Called when the modifier is attached to a parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Returns:** *void*

___

###  onAttachSeries

▸ **onAttachSeries**(`rs`: [IRenderableSeries](irenderableseries.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L62)*

Called when a [RenderableSeries](irenderableseries.md) is attached to this modifier

**Parameters:**

Name | Type |
------ | ------ |
`rs` | [IRenderableSeries](irenderableseries.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:58](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L58)*

Called when the modifier is detached from a parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md)

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(`rs`: [IRenderableSeries](irenderableseries.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:66](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L66)*

Called when a [RenderableSeries](irenderableseries.md) is detached from this modifier

**Parameters:**

Name | Type |
------ | ------ |
`rs` | [IRenderableSeries](irenderableseries.md) |

**Returns:** *void*

___

###  onParentSurfaceRendered

▸ **onParentSurfaceRendered**(): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:70](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L70)*

Called when the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md) is rendered

**Returns:** *void*

___

###  setParentSurface

▸ **setParentSurface**(`parentSurface`: [SciChartSurfaceBase](../classes/scichartsurfacebase.md)): *void*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:111](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L111)*

Sets the parent [SciChartSurfaceBase](../classes/scichartsurfacebase.md) on this modifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentSurface` | [SciChartSurfaceBase](../classes/scichartsurfacebase.md) |   |

**Returns:** *void*
