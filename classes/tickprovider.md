[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [TickProvider](tickprovider.md)

# Class: TickProvider

**`summary`** The TickProvider is a base class for calculating ticks (interval between major and minor gridlines, ticks and labels).

**`description`** TickProviders are responsible for calculating the interval between major and minor gridlines, ticks and labels.

The method {@getMajorTicks} returns an array of major ticks (data-values values where SciChart will place labels and major gridlines).
The method {@getMinorTicks} returns an array of minor ticks (data-values values where SciChart will place minor gridlines).
The method {@attachedToAxis} is called when the TickProvider is attached to an [Axis](axiscore.md).

Override these methods to create custom implementations of Tick intervals in SciChart or use our built-in [NumericTickProvider](numerictickprovider.md)

**`remarks`** 
TickProviders are shared between 2D & 3D Charts.
See also [NumericTickProvider](numerictickprovider.md) for a concrete implementation.

## Hierarchy

* **TickProvider**

  ↳ [NumericTickProvider](numerictickprovider.md)

## Index

### Properties

* [parentAxis](tickprovider.md#parentaxis)

### Methods

* [attachedToAxis](tickprovider.md#attachedtoaxis)
* [getMajorTicks](tickprovider.md#abstract-getmajorticks)
* [getMinorTicks](tickprovider.md#abstract-getminorticks)

## Properties

###  parentAxis

• **parentAxis**: *[AxisCore](axiscore.md)*

*Defined in [src/Charting/Numerics/TickProviders/TickProvider.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/TickProvider.ts#L21)*

Gets the parent [Axis](axiscore.md) this TickProvider is attached to

## Methods

###  attachedToAxis

▸ **attachedToAxis**(`axis`: [AxisCore](axiscore.md)): *void*

*Defined in [src/Charting/Numerics/TickProviders/TickProvider.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/TickProvider.ts#L27)*

Called when the TickProvider is attached to an [Axis](axiscore.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`axis` | [AxisCore](axiscore.md) |   |

**Returns:** *void*

___

### `Abstract` getMajorTicks

▸ **getMajorTicks**(`minorDelta`: number, `majorDelta`: number, `visibleRange`: NumberRange): *number[]*

*Defined in [src/Charting/Numerics/TickProviders/TickProvider.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/TickProvider.ts#L44)*

**`summary`** Gets an array of major ticks (data-values values where SciChart will place labels and major gridlines).

**`description`** Major ticks are data-values where we will place the major gridlines and labels. For example. if the [Axis](axiscore.md)
has a [visibleRange](axiscore.md#visiblerange) of 100..200 and we want to place gridlines at 100,120,140,160,180,200, then the
getMajorTicks() method should return an array with ```[100,120,140,160,180,200]```.

**`link`** AxisCore | Axis}

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`minorDelta` | number | The current [AxisCore.minorDelta](axiscore.md#minordelta) which is the difference between minor gridlines requested by the [Axis](axiscore.md) |
`majorDelta` | number | The current [AxisCore.majorDelta](axiscore.md#majordelta) which is the difference between major gridlines requested by the { |
`visibleRange` | NumberRange | The current [AxisCore.visibleRange](axiscore.md#visiblerange) which is the minimum / maximum range visible on the Axis. |

**Returns:** *number[]*

The array of major ticks, e.g. if we want to place gridlines at 100,120,140,160,180,200, then the
getMajorTicks() method should return an array with ```[100,120,140,160,180,200]```.

___

### `Abstract` getMinorTicks

▸ **getMinorTicks**(`minorDelta`: number, `majorDelta`: number, `visibleRange`: NumberRange): *number[]*

*Defined in [src/Charting/Numerics/TickProviders/TickProvider.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/TickProvider.ts#L60)*

**`summary`** Gets an array of minor ticks (data-values values where SciChart will place minor gridlines).

**`description`** Minor ticks are data-values where we will place the minor gridlines. For example. if the [Axis](axiscore.md)
has a [visibleRange](axiscore.md#visiblerange) of 100..200 and we want to place minor gridlines every 5, then the
getMinorTicks() method should return an array with ```[105, 110, 115]``` etc...

**`remarks`** getMinorTicks should not include locations where major ticks lie.

**`link`** AxisCore | Axis}

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`minorDelta` | number | The current [AxisCore.minorDelta](axiscore.md#minordelta) which is the difference between minor gridlines requested by the [Axis](axiscore.md) |
`majorDelta` | number | The current [AxisCore.majorDelta](axiscore.md#majordelta) which is the difference between major gridlines requested by the { |
`visibleRange` | NumberRange | The current [AxisCore.majorDelta](axiscore.md#majordelta) which is the minimum / maximum range visible on the Axis. |

**Returns:** *number[]*

The array of minor ticks, e.g. if we want to place minor gridlines every 5, then the
getMinorTicks() method should return an array with ```[105, 110, 115]``` etc...
