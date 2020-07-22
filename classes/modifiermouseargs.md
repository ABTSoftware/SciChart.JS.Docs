[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ModifierMouseArgs](modifiermouseargs.md)

# Class: ModifierMouseArgs

Mouse arguments passed to [ChartModifierBase](chartmodifierbase.md) methods

## Hierarchy

* [ModifierArgsBase](modifierargsbase.md)

  ↳ **ModifierMouseArgs**

## Index

### Constructors

* [constructor](modifiermouseargs.md#constructor)

### Properties

* [handled](modifiermouseargs.md#handled)
* [isMaster](modifiermouseargs.md#readonly-ismaster)
* [modifierGroup](modifiermouseargs.md#readonly-modifiergroup)
* [mousePoint](modifiermouseargs.md#readonly-mousepoint)
* [mouseWheelDelta](modifiermouseargs.md#readonly-mousewheeldelta)
* [pointerId](modifiermouseargs.md#pointerid)
* [pointerType](modifiermouseargs.md#pointertype)
* [target](modifiermouseargs.md#target)

### Methods

* [copy](modifiermouseargs.md#static-copy)
* [fromMouseEvent](modifiermouseargs.md#static-frommouseevent)
* [fromPointerEvent](modifiermouseargs.md#static-frompointerevent)
* [fromWheelEvent](modifiermouseargs.md#static-fromwheelevent)

## Constructors

###  constructor

\+ **new ModifierMouseArgs**(`mousePoint`: Point, `options?`: [TModifierMouseArgsParams](../globals.md#tmodifiermouseargsparams)): *[ModifierMouseArgs](modifiermouseargs.md)*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:121](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L121)*

Creates an instance of [ModifierMouseArgs](modifiermouseargs.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mousePoint` | Point | the mouse point as an X,Y location |
`options?` | [TModifierMouseArgsParams](../globals.md#tmodifiermouseargsparams) | optional parameters to configure the args  |

**Returns:** *[ModifierMouseArgs](modifiermouseargs.md)*

## Properties

###  handled

• **handled**: *boolean* = false

*Inherited from [ModifierArgsBase](modifierargsbase.md).[handled](modifierargsbase.md#handled)*

*Defined in [src/Charting/ChartModifiers/ModifierArgsBase.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierArgsBase.ts#L13)*

Gets or sets whether the event is handled

**`remarks`** 
Set handled to true if you want to prevent the event from propagating to subsequent modifiers in the
parent [SciChartSurfaceBase.chartModifiers](scichartsurfacebase.md#readonly-chartmodifiers) collection

If handled is true, the events no longer propagate. To override this behaviour set [ChartModifierBase.receiveHandledEvents](chartmodifierbase.md#receivehandledevents) to true

___

### `Readonly` isMaster

• **isMaster**: *boolean*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L116)*

When true, the event was raised from the master or parent [SciChartSurfaceBase](scichartsurfacebase.md), else
it came from the child [SciChartSurfaceBase](scichartsurfacebase.md)

**`remarks`** This is relevant in the case of linking together multiple charts

___

### `Readonly` modifierGroup

• **modifierGroup**: *string*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:121](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L121)*

The Modifier Group string is an ID which is used to group together [Chart Modifiers](chartmodifierbase.md)
when used in a multi-chart scenario

___

### `Readonly` mousePoint

• **mousePoint**: *Point*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L94)*

The MousePoint as an X,Y coordinate where the event occurred

___

### `Readonly` mouseWheelDelta

• **mouseWheelDelta**: *number*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:98](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L98)*

The mouse wheel delta as a positive or negative value depending on mouse wheel direction

___

###  pointerId

• **pointerId**: *number*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:102](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L102)*

The PointerId associated with the current pointer or stylus device

___

###  pointerType

• **pointerType**: *string*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:106](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L106)*

The type of the current Pointer or stylus

___

###  target

• **target**: *Element*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:110](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L110)*

The target {@link Element} which raised the event

## Methods

### `Static` copy

▸ **copy**(`args`: [ModifierMouseArgs](modifiermouseargs.md), `modifierGroup`: string, `masterViewport`: Size, `slaveViewport`: Size): *[ModifierMouseArgs](modifiermouseargs.md)*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:70](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L70)*

Copies or clones a [ModifierMouseArgs](modifiermouseargs.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`args` | [ModifierMouseArgs](modifiermouseargs.md) | the [ModifierMouseArgs](modifiermouseargs.md) instance |
`modifierGroup` | string | the Modifier Group / string ID for sharing mouse events |
`masterViewport` | Size | the master viewport or parent chart issuing mouse events |
`slaveViewport` | Size | the slave viewport or child chart receiving mouse events  |

**Returns:** *[ModifierMouseArgs](modifiermouseargs.md)*

___

### `Static` fromMouseEvent

▸ **fromMouseEvent**(`mouseEvent`: MouseEvent): *[ModifierMouseArgs](modifiermouseargs.md)*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L24)*

Creates a [ModifierMouseArgs](modifiermouseargs.md) instance from Javascript {@link MouseEvent}

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mouseEvent` | MouseEvent | the Javascript {@link MouseEvent}  |

**Returns:** *[ModifierMouseArgs](modifiermouseargs.md)*

___

### `Static` fromPointerEvent

▸ **fromPointerEvent**(`pointerEvent`: PointerEvent): *[ModifierMouseArgs](modifiermouseargs.md)*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L51)*

Creates a [ModifierMouseArgs](modifiermouseargs.md) instance from Javascript {@link PointerEvent}

**Parameters:**

Name | Type |
------ | ------ |
`pointerEvent` | PointerEvent |

**Returns:** *[ModifierMouseArgs](modifiermouseargs.md)*

___

### `Static` fromWheelEvent

▸ **fromWheelEvent**(`wheelEvent`: WheelEvent): *[ModifierMouseArgs](modifiermouseargs.md)*

*Defined in [src/Charting/ChartModifiers/ModifierMouseArgs.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ModifierMouseArgs.ts#L37)*

Creates a [ModifierMouseArgs](modifiermouseargs.md) instance from Javascript {@link WheelEvent}

**Parameters:**

Name | Type |
------ | ------ |
`wheelEvent` | WheelEvent |

**Returns:** *[ModifierMouseArgs](modifiermouseargs.md)*
