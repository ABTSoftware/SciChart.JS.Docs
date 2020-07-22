[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [RubberBandXyZoomModifier](rubberbandxyzoommodifier.md)

# Class: RubberBandXyZoomModifier

The RubberBandXyZoomModifier provides drag-rectangle to zoom behavior on a 2D [SciChartSurface](scichartsurface.md)
within SciChart - High Performance [JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 

To apply the RubberBandXyZoomModifier to a [SciChartSurface](scichartsurface.md) and add drag to zoom behavior,
use the following code:

```ts
const sciChartSurface: SciChartSurface;
sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier());
```

Animation of the zoom may be controlled via the [RubberBandXyZoomModifier.isAnimated](rubberbandxyzoommodifier.md#isanimated),
[RubberBandXyZoomModifier.animationDuration](rubberbandxyzoommodifier.md#animationduration) and [RubberBandXyZoomModifier.easingFunction](rubberbandxyzoommodifier.md#easingfunction) properties.

## Hierarchy

  ↳ [ChartModifierBase2D](chartmodifierbase2d.md)

  ↳ **RubberBandXyZoomModifier**

## Implements

* [IChartModifierBase](../interfaces/ichartmodifierbase.md)

## Index

### Constructors

* [constructor](rubberbandxyzoommodifier.md#constructor)

### Properties

* [animationDuration](rubberbandxyzoommodifier.md#animationduration)
* [easingFunction](rubberbandxyzoommodifier.md#easingfunction)
* [invalidateParentCallback](rubberbandxyzoommodifier.md#invalidateparentcallback)
* [isAnimated](rubberbandxyzoommodifier.md#isanimated)
* [modifierGroup](rubberbandxyzoommodifier.md#modifiergroup)
* [xyDirection](rubberbandxyzoommodifier.md#xydirection)

### Accessors

* [canReceiveMouseEvents](rubberbandxyzoommodifier.md#canreceivemouseevents)
* [fill](rubberbandxyzoommodifier.md#fill)
* [isAttached](rubberbandxyzoommodifier.md#isattached)
* [isEnabled](rubberbandxyzoommodifier.md#isenabled)
* [modifierType](rubberbandxyzoommodifier.md#modifiertype)
* [parentSurface](rubberbandxyzoommodifier.md#parentsurface)
* [receiveHandledEvents](rubberbandxyzoommodifier.md#receivehandledevents)
* [stroke](rubberbandxyzoommodifier.md#stroke)
* [strokeThickness](rubberbandxyzoommodifier.md#strokethickness)

### Methods

* [applyTheme](rubberbandxyzoommodifier.md#applytheme)
* [modifierDoubleClick](rubberbandxyzoommodifier.md#modifierdoubleclick)
* [modifierMouseDown](rubberbandxyzoommodifier.md#modifiermousedown)
* [modifierMouseEnter](rubberbandxyzoommodifier.md#modifiermouseenter)
* [modifierMouseLeave](rubberbandxyzoommodifier.md#modifiermouseleave)
* [modifierMouseMove](rubberbandxyzoommodifier.md#modifiermousemove)
* [modifierMouseUp](rubberbandxyzoommodifier.md#modifiermouseup)
* [modifierMouseWheel](rubberbandxyzoommodifier.md#modifiermousewheel)
* [onAttach](rubberbandxyzoommodifier.md#onattach)
* [onAttachSeries](rubberbandxyzoommodifier.md#onattachseries)
* [onDetach](rubberbandxyzoommodifier.md#ondetach)
* [onDetachSeries](rubberbandxyzoommodifier.md#ondetachseries)
* [onParentSurfaceRendered](rubberbandxyzoommodifier.md#onparentsurfacerendered)
* [setParentSurface](rubberbandxyzoommodifier.md#setparentsurface)

## Constructors

###  constructor

\+ **new RubberBandXyZoomModifier**(`options?`: [IRubberBandXyZoomModifierOptions](../interfaces/irubberbandxyzoommodifieroptions.md)): *[RubberBandXyZoomModifier](rubberbandxyzoommodifier.md)*

*Overrides [ChartModifierBase2D](chartmodifierbase2d.md).[constructor](chartmodifierbase2d.md#constructor)*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L69)*

Creates an instance of a RubberBandXyZoomModifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options?` | [IRubberBandXyZoomModifierOptions](../interfaces/irubberbandxyzoommodifieroptions.md) | Optional parameters used to configure the modifier  |

**Returns:** *[RubberBandXyZoomModifier](rubberbandxyzoommodifier.md)*

## Properties

###  animationDuration

• **animationDuration**: *number* = 400

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L55)*

Defines the duration of animations when zooming in milliseconds

___

###  easingFunction

• **easingFunction**: *TEasing* = easing.outExpo

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L59)*

Defines the easing function for animation. See {@link TEasing} for a range of functions

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md).[invalidateParentCallback](../interfaces/ichartmodifierbase.md#invalidateparentcallback)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[invalidateParentCallback](chartmodifierbase.md#invalidateparentcallback)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L126)*

A callback to invalidate the parent [SciChartSurfaceBase](scichartsurfacebase.md)

#### Type declaration:

▸ (): *void*

___

###  isAnimated

• **isAnimated**: *boolean* = true

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L51)*

When true, the Zoom operations are animated. See also [animationDuration](rubberbandxyzoommodifier.md#animationduration) and [easingFunction](rubberbandxyzoommodifier.md#easingfunction)

___

###  modifierGroup

• **modifierGroup**: *string*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md).[modifierGroup](../interfaces/ichartmodifierbase.md#modifiergroup)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[modifierGroup](chartmodifierbase.md#modifiergroup)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:122](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L122)*

Specifies a string ID to group modifiers.

**`remarks`** When one receives a mouse event, all modifiers in the same group receive the event.

___

###  xyDirection

• **xyDirection**: *EXyDirection* = EXyDirection.XyDirection

*Inherited from [ChartModifierBase2D](chartmodifierbase2d.md).[xyDirection](chartmodifierbase2d.md#xydirection)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L23)*

## Accessors

###  canReceiveMouseEvents

• **get canReceiveMouseEvents**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[canReceiveMouseEvents](chartmodifierbase.md#canreceivemouseevents)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:183](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L183)*

When true, this modifier can receive mouse events

**`inheritdoc`** 

**Returns:** *boolean*

___

###  fill

• **get fill**(): *string*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:189](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L189)*

Get the fill color for [RubberBandRect](rubberbandrect.md)

**Returns:** *string*

• **set fill**(`value`: string): *void*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:195](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L195)*

Set the fill color for [RubberBandRect](rubberbandrect.md)

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  isAttached

• **get isAttached**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[isAttached](chartmodifierbase.md#isattached)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:164](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L164)*

When true, the modifier is attached to a [SciChartSurfaceBase](scichartsurfacebase.md)

**`inheritdoc`** 

**Returns:** *boolean*

___

###  isEnabled

• **get isEnabled**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[isEnabled](chartmodifierbase.md#isenabled)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:151](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L151)*

When true, the modifier is enabled

**`inheritdoc`** 

**Returns:** *boolean*

• **set isEnabled**(`isEnabled`: boolean): *void*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[isEnabled](chartmodifierbase.md#isenabled)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L157)*

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

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L38)*

The type of Chart Modifier, see [EModifierType](../enums/emodifiertype.md) for a list of values

**`inheritdoc`** 

**Returns:** *[EModifierType](../enums/emodifiertype.md)*

___

###  parentSurface

• **get parentSurface**(): *[SciChartSurface](scichartsurface.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[parentSurface](chartmodifierbase.md#parentsurface)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:141](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L141)*

**`inheritdoc`** 

**Returns:** *[SciChartSurface](scichartsurface.md)*

___

###  receiveHandledEvents

• **get receiveHandledEvents**(): *boolean*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[receiveHandledEvents](chartmodifierbase.md#receivehandledevents)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L170)*

When true, this modifier should receive events which have been handled by modifiers
higher up in the call hierachy.

**`inheritdoc`** 

**Returns:** *boolean*

• **set receiveHandledEvents**(`receiveHandledEvents`: boolean): *void*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[receiveHandledEvents](chartmodifierbase.md#receivehandledevents)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:176](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L176)*

When true, this modifier should receive events which have been handled by modifiers
higher up in the call hierachy.

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`receiveHandledEvents` | boolean |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:176](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L176)*

Get the stroke for [RubberBandRect](rubberbandrect.md)

**Returns:** *string*

• **set stroke**(`value`: string): *void*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:182](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L182)*

Set the stroke for [RubberBandRect](rubberbandrect.md)

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:163](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L163)*

Get the stroke thickness for [RubberBandRect](rubberbandrect.md)

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:169](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L169)*

Set the stroke thickness for [RubberBandRect](rubberbandrect.md)

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[applyTheme](chartmodifierbase.md#applytheme)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:135](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L135)*

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

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:244](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L244)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[modifierMouseDown](chartmodifierbase.md#modifiermousedown)*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L103)*

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

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:250](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L250)*

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

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:256](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L256)*

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

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:119](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L119)*

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

*Overrides [ChartModifierBase](chartmodifierbase.md).[modifierMouseUp](chartmodifierbase.md#modifiermouseup)*

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:145](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L145)*

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

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:238](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L238)*

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

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L84)*

Called when the modifier is attached to a parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *void*

___

###  onAttachSeries

▸ **onAttachSeries**(`rs`: [IRenderableSeries](../interfaces/irenderableseries.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[onAttachSeries](chartmodifierbase.md#onattachseries)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:201](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L201)*

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

*Defined in [src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/RubberBandXyZoomModifier.ts#L96)*

Called when the modifier is detached from a parent [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *void*

___

###  onDetachSeries

▸ **onDetachSeries**(`rs`: [IRenderableSeries](../interfaces/irenderableseries.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[onDetachSeries](chartmodifierbase.md#ondetachseries)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:207](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L207)*

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

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:213](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L213)*

Called when the parent [SciChartSurfaceBase](scichartsurfacebase.md) is rendered

**Returns:** *void*

___

###  setParentSurface

▸ **setParentSurface**(`parentSurface`: [SciChartSurfaceBase](scichartsurfacebase.md)): *void*

*Implementation of [IChartModifierBase](../interfaces/ichartmodifierbase.md)*

*Inherited from [ChartModifierBase](chartmodifierbase.md).[setParentSurface](chartmodifierbase.md#setparentsurface)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase.ts:262](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase.ts#L262)*

Sets the parent [SciChartSurfaceBase](scichartsurfacebase.md) on this modifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentSurface` | [SciChartSurfaceBase](scichartsurfacebase.md) |   |

**Returns:** *void*
