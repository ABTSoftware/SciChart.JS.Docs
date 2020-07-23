[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [RolloverModifier](rollovermodifier.md)

# Class: RolloverModifier

The RolloverModifier provides tooltip and cursor behavior on a 2D [SciChartSurface](scichartsurface.md)
within SciChart - High Performance [JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 

To apply the RolloverModifier to a [SciChartSurface](scichartsurface.md) and add tooltip behavior,
use the following code:

```ts
const sciChartSurface: SciChartSurface;
sciChartSurface.chartModifiers.add(new RolloverModifier());
```

## Hierarchy

  ↳ [ChartModifierBase2D](chartmodifierbase2d.md)

  ↳ **RolloverModifier**

## Implements

* [IChartModifierBase](../interfaces/ichartmodifierbase.md)

## Index

### Constructors

* [constructor](rollovermodifier.md#constructor)

### Properties

* [invalidateParentCallback](rollovermodifier.md#invalidateparentcallback)
* [modifierGroup](rollovermodifier.md#modifiergroup)
* [xyDirection](rollovermodifier.md#xydirection)

### Accessors

* [canReceiveMouseEvents](rollovermodifier.md#canreceivemouseevents)
* [isAttached](rollovermodifier.md#isattached)
* [isEnabled](rollovermodifier.md#isenabled)
* [modifierType](rollovermodifier.md#modifiertype)
* [parentSurface](rollovermodifier.md#parentsurface)
* [receiveHandledEvents](rollovermodifier.md#receivehandledevents)

### Methods

* [applyTheme](rollovermodifier.md#applytheme)
* [modifierDoubleClick](rollovermodifier.md#modifierdoubleclick)
* [modifierMouseDown](rollovermodifier.md#modifiermousedown)
* [modifierMouseEnter](rollovermodifier.md#modifiermouseenter)
* [modifierMouseLeave](rollovermodifier.md#modifiermouseleave)
* [modifierMouseMove](rollovermodifier.md#modifiermousemove)
* [modifierMouseUp](rollovermodifier.md#modifiermouseup)
* [modifierMouseWheel](rollovermodifier.md#modifiermousewheel)
* [onAttach](rollovermodifier.md#onattach)
* [onAttachSeries](rollovermodifier.md#onattachseries)
* [onDetach](rollovermodifier.md#ondetach)
* [onDetachSeries](rollovermodifier.md#ondetachseries)
* [onParentSurfaceRendered](rollovermodifier.md#onparentsurfacerendered)
* [setParentSurface](rollovermodifier.md#setparentsurface)

## Constructors

###  constructor

\+ **new RolloverModifier**(`options?`: [IRolloverModifierOptions](../interfaces/irollovermodifieroptions.md)): *[RolloverModifier](rollovermodifier.md)*

*Overrides [ChartModifierBase2D](chartmodifierbase2d.md).[constructor](chartmodifierbase2d.md#constructor)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L94)*

Creates an instance of the RolloverModifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options?` | [IRolloverModifierOptions](../interfaces/irollovermodifieroptions.md) | Optional parameters [IRolloverModifierOptions](../interfaces/irollovermodifieroptions.md) used to configure the modifier  |

**Returns:** *[RolloverModifier](rollovermodifier.md)*

## Properties

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[applyTheme](chartmodifierbase.md#applytheme)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:114](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L114)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[modifierMouseEnter](chartmodifierbase.md#modifiermouseenter)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:184](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L184)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[modifierMouseLeave](chartmodifierbase.md#modifiermouseleave)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:176](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L176)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[modifierMouseMove](chartmodifierbase.md#modifiermousemove)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L155)*

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

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierMouseWheel](chartmodifierbase.md#modifiermousewheel)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:238](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L238)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[onAttach](chartmodifierbase.md#onattach)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:120](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L120)*

Called when the modifier is attached to a parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *void*

___

###  onAttachSeries

▸ **onAttachSeries**(`rs`: [IRenderableSeries](../interfaces/irenderableseries.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Overrides [ChartModifierBase](chartmodifierbase.md).[onAttachSeries](chartmodifierbase.md#onattachseries)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L140)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[onDetach](chartmodifierbase.md#ondetach)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:130](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L130)*

Called when the modifier is detached from a parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(`rs`: [IRenderableSeries](../interfaces/irenderableseries.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Overrides [ChartModifierBase](chartmodifierbase.md).[onDetachSeries](chartmodifierbase.md#ondetachseries)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:148](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L148)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[onParentSurfaceRendered](chartmodifierbase.md#onparentsurfacerendered)*

*Defined in [src/Charting/ChartModifiers/RolloverModifier.ts:190](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/ChartModifiers/RolloverModifier.ts#L190)*

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
