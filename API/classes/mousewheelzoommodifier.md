[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [MouseWheelZoomModifier](mousewheelzoommodifier.md)

# Class: MouseWheelZoomModifier

The MouseWheelZoomModifier provides Mouse wheel zooming behavior on a 2D [SciChartSurface](scichartsurface.md)
within SciChart - High Performance [JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 

To apply the MouseWheelZoomModifier to a [SciChartSurface](scichartsurface.md) and add Mouse-wheel zoom behavior,
use the following code:

```ts
const sciChartSurface: SciChartSurface;
sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
```

The speed of mouse-wheel zoom can be modified via the [MouseWheelZoomModifier.growFactor](mousewheelzoommodifier.md#growfactor) property.

## Hierarchy

  ↳ [ChartModifierBase2D](chartmodifierbase2d.md)

  ↳ **MouseWheelZoomModifier**

## Implements

* [IChartModifierBase](../interfaces/ichartmodifierbase.md)

## Index

### Constructors

* [constructor](mousewheelzoommodifier.md#constructor)

### Properties

* [growFactor](mousewheelzoommodifier.md#growfactor)
* [invalidateParentCallback](mousewheelzoommodifier.md#invalidateparentcallback)
* [modifierGroup](mousewheelzoommodifier.md#modifiergroup)
* [xyDirection](mousewheelzoommodifier.md#xydirection)

### Accessors

* [canReceiveMouseEvents](mousewheelzoommodifier.md#canreceivemouseevents)
* [isAttached](mousewheelzoommodifier.md#isattached)
* [isEnabled](mousewheelzoommodifier.md#isenabled)
* [modifierType](mousewheelzoommodifier.md#modifiertype)
* [parentSurface](mousewheelzoommodifier.md#parentsurface)
* [receiveHandledEvents](mousewheelzoommodifier.md#receivehandledevents)

### Methods

* [applyTheme](mousewheelzoommodifier.md#applytheme)
* [modifierDoubleClick](mousewheelzoommodifier.md#modifierdoubleclick)
* [modifierMouseDown](mousewheelzoommodifier.md#modifiermousedown)
* [modifierMouseEnter](mousewheelzoommodifier.md#modifiermouseenter)
* [modifierMouseLeave](mousewheelzoommodifier.md#modifiermouseleave)
* [modifierMouseMove](mousewheelzoommodifier.md#modifiermousemove)
* [modifierMouseUp](mousewheelzoommodifier.md#modifiermouseup)
* [modifierMouseWheel](mousewheelzoommodifier.md#modifiermousewheel)
* [onAttach](mousewheelzoommodifier.md#onattach)
* [onAttachSeries](mousewheelzoommodifier.md#onattachseries)
* [onDetach](mousewheelzoommodifier.md#ondetach)
* [onDetachSeries](mousewheelzoommodifier.md#ondetachseries)
* [onParentSurfaceRendered](mousewheelzoommodifier.md#onparentsurfacerendered)
* [setParentSurface](mousewheelzoommodifier.md#setparentsurface)

## Constructors

###  constructor

\+ **new MouseWheelZoomModifier**(`options?`: [IChartModifierBaseOptions](../interfaces/ichartmodifierbaseoptions.md)): *[MouseWheelZoomModifier](mousewheelzoommodifier.md)*

*Overrides [ChartModifierBase2D](chartmodifierbase2d.md).[constructor](chartmodifierbase2d.md#constructor)*

*Defined in [src/Charting/ChartModifiers/MouseWheelZoomModifier.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/MouseWheelZoomModifier.ts#L28)*

Creates an instance of MouseWheelZoomModifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options?` | [IChartModifierBaseOptions](../interfaces/ichartmodifierbaseoptions.md) | Optional parameters to configure the modifier via [IChartModifierBaseOptions](../interfaces/ichartmodifierbaseoptions.md)  |

**Returns:** *[MouseWheelZoomModifier](mousewheelzoommodifier.md)*

## Properties

###  growFactor

• **growFactor**: *number* = 0.001

*Defined in [src/Charting/ChartModifiers/MouseWheelZoomModifier.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/MouseWheelZoomModifier.ts#L28)*

Modifies the speed of mousewheel zoom, for example growFactor = 0.001 means each mousewheel 'click'
zooms the chart 0.1%

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md).[invalidateParentCallback](../interfaces/ichartmodifierbase.md#invalidateparentcallback)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[invalidateParentCallback](chartmodifierbase.md#invalidateparentcallback)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L126)*

A callback to invalidate the parent [SciChartSurfaceBase](scichartsurfacebase.md)

#### Type declaration:

▸ (): *void*

___

###  modifierGroup

• **modifierGroup**: *string*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md).[modifierGroup](../interfaces/ichartmodifierbase.md#modifiergroup)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierGroup](chartmodifierbase.md#modifiergroup)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:122](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L122)*

Specifies a string ID to group modifiers.

**`remarks`** When one receives a mouse event, all modifiers in the same group receive the event.

___

###  xyDirection

• **xyDirection**: *EXyDirection* = EXyDirection.XyDirection

*Inherited from [ChartModifierBase2D](chartmodifierbase2d.md).[xyDirection](chartmodifierbase2d.md#xydirection)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L23)*

## Accessors

###  canReceiveMouseEvents

• **get canReceiveMouseEvents**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[canReceiveMouseEvents](chartmodifierbase.md#canreceivemouseevents)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:183](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L183)*

When true, this modifier can receive mouse events

**`inheritdoc`** 

**Returns:** *boolean*

___

###  isAttached

• **get isAttached**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[isAttached](chartmodifierbase.md#isattached)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:164](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L164)*

When true, the modifier is attached to a [SciChartSurfaceBase](scichartsurfacebase.md)

**`inheritdoc`** 

**Returns:** *boolean*

___

###  isEnabled

• **get isEnabled**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[isEnabled](chartmodifierbase.md#isenabled)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:151](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L151)*

When true, the modifier is enabled

**`inheritdoc`** 

**Returns:** *boolean*

• **set isEnabled**(`isEnabled`: boolean): *void*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[isEnabled](chartmodifierbase.md#isenabled)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L157)*

When true, the modifier is enabled

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`isEnabled` | boolean |

**Returns:** *void*

___

###  modifierType

• **get modifierType**(): *[EModifierType](../enums/emodifiertype.md)*

*Inherited from [ChartModifierBase2D](chartmodifierbase2d.md).[modifierType](chartmodifierbase2d.md#modifiertype)*

*Overrides [ChartModifierBase](chartmodifierbase.md).[modifierType](chartmodifierbase.md#modifiertype)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L38)*

The type of Chart Modifier, see [EModifierType](../enums/emodifiertype.md) for a list of values

**`inheritdoc`** 

**Returns:** *[EModifierType](../enums/emodifiertype.md)*

___

###  parentSurface

• **get parentSurface**(): *[SciChartSurface](scichartsurface.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[parentSurface](chartmodifierbase.md#parentsurface)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:141](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L141)*

**`inheritdoc`** 

**Returns:** *[SciChartSurface](scichartsurface.md)*

___

###  receiveHandledEvents

• **get receiveHandledEvents**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[receiveHandledEvents](chartmodifierbase.md#receivehandledevents)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L170)*

When true, this modifier should receive events which have been handled by modifiers
higher up in the call hierachy.

**`inheritdoc`** 

**Returns:** *boolean*

• **set receiveHandledEvents**(`receiveHandledEvents`: boolean): *void*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[receiveHandledEvents](chartmodifierbase.md#receivehandledevents)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:176](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L176)*

When true, this modifier should receive events which have been handled by modifiers
higher up in the call hierachy.

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`receiveHandledEvents` | boolean |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[applyTheme](chartmodifierbase.md#applytheme)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:135](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L135)*

Applies a theme (defined by [IThemeProvider](../interfaces/ithemeprovider.md)) to the current element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) | The theme data to apply  |

**Returns:** *void*

___

###  modifierDoubleClick

▸ **modifierDoubleClick**(`args`: [ModifierMouseArgs](modifiermouseargs.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierDoubleClick](chartmodifierbase.md#modifierdoubleclick)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:244](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L244)*

Method called when mouse double-click or touch double-tap occurs on the parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseDown

▸ **modifierMouseDown**(`args`: [ModifierMouseArgs](modifiermouseargs.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierMouseDown](chartmodifierbase.md#modifiermousedown)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:219](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L219)*

Method called when mouse-down or touch-down occurs on the parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseEnter

▸ **modifierMouseEnter**(`args`: [ModifierMouseArgs](modifiermouseargs.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierMouseEnter](chartmodifierbase.md#modifiermouseenter)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:250](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L250)*

Method called when mouse enters the parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseLeave

▸ **modifierMouseLeave**(`args`: [ModifierMouseArgs](modifiermouseargs.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierMouseLeave](chartmodifierbase.md#modifiermouseleave)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:256](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L256)*

Method called when mouse leaves the parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseMove

▸ **modifierMouseMove**(`args`: [ModifierMouseArgs](modifiermouseargs.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierMouseMove](chartmodifierbase.md#modifiermousemove)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:225](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L225)*

Method called when mouse-move or touch-move occurs on the parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseUp

▸ **modifierMouseUp**(`args`: [ModifierMouseArgs](modifiermouseargs.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierMouseUp](chartmodifierbase.md#modifiermouseup)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:232](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L232)*

Method called when mouse-up or touch-up occurs on the parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  modifierMouseWheel

▸ **modifierMouseWheel**(`args`: [ModifierMouseArgs](modifiermouseargs.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Overrides [ChartModifierBase](chartmodifierbase.md).[modifierMouseWheel](chartmodifierbase.md#modifiermousewheel)*

*Defined in [src/Charting/ChartModifiers/MouseWheelZoomModifier.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/MouseWheelZoomModifier.ts#L41)*

Method called when mouse-wheel scroll occurs on the parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) containing data about the mouse event  |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[onAttach](chartmodifierbase.md#onattach)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:189](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L189)*

Called when the modifier is attached to a parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *void*

___

###  onAttachSeries

▸ **onAttachSeries**(`rs`: [IRenderableSeries](../interfaces/irenderableseries.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[onAttachSeries](chartmodifierbase.md#onattachseries)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:201](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L201)*

Called when a [RenderableSeries](../interfaces/irenderableseries.md) is attached to this modifier

**Parameters:**

Name | Type |
------ | ------ |
`rs` | [IRenderableSeries](../interfaces/irenderableseries.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[onDetach](chartmodifierbase.md#ondetach)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:195](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L195)*

Called when the modifier is detached from a parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(`rs`: [IRenderableSeries](../interfaces/irenderableseries.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[onDetachSeries](chartmodifierbase.md#ondetachseries)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:207](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L207)*

Called when a [RenderableSeries](../interfaces/irenderableseries.md) is detached from this modifier

**Parameters:**

Name | Type |
------ | ------ |
`rs` | [IRenderableSeries](../interfaces/irenderableseries.md) |

**Returns:** *void*

___

###  onParentSurfaceRendered

▸ **onParentSurfaceRendered**(): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[onParentSurfaceRendered](chartmodifierbase.md#onparentsurfacerendered)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:213](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L213)*

Called when the parent [SciChartSurfaceBase](scichartsurfacebase.md) is rendered

**Returns:** *void*

___

###  setParentSurface

▸ **setParentSurface**(`parentSurface`: [SciChartSurfaceBase](scichartsurfacebase.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[setParentSurface](chartmodifierbase.md#setparentsurface)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:262](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L262)*

Sets the parent [SciChartSurfaceBase](scichartsurfacebase.md) on this modifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentSurface` | [SciChartSurfaceBase](scichartsurfacebase.md) |   |

**Returns:** *void*
