[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [NumericTickProvider](numerictickprovider.md)

# Class: NumericTickProvider

**`summary`** The NumericTickProvider is a [TickProvider](tickprovider.md) implementation for Numeric 2D or 3D Axis.

**`description`** TickProviders are responsible for calculating the interval between major and minor gridlines, ticks and labels.

The method {@getMajorTicks} returns an array of major ticks (data-values values where SciChart will place labels and major gridlines.
The method {@getMinorTicks} returns an array of minor ticks (data-values values where SciChart will place minor gridlines.
The method {@isParamsValid} performs some sanity checks.
The method {@calculateTicks} performs the actual calculation

Override these methods to create custom implementations of Tick intervals in SciChart

**`remarks`** 
See also [TickProvider](tickprovider.md) for the base implementation.

## Hierarchy

* [TickProvider](tickprovider.md)

  ↳ **NumericTickProvider**

## Index

### Constructors

* [constructor](numerictickprovider.md#constructor)

### Properties

* [parentAxis](numerictickprovider.md#parentaxis)

### Methods

* [attachedToAxis](numerictickprovider.md#attachedtoaxis)
* [getMajorTicks](numerictickprovider.md#getmajorticks)
* [getMinorTicks](numerictickprovider.md#getminorticks)

## Constructors

###  constructor

\+ **new NumericTickProvider**(`webAssemblyContext`: TSciChart | TSciChart3D): *[NumericTickProvider](numerictickprovider.md)*

*Defined in [src/Charting/Numerics/TickProviders/NumericTickProvider.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/NumericTickProvider.ts#L23)*

Creates an instance of a NumericTickProvider

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`webAssemblyContext` | TSciChart &#124; TSciChart3D | The {@link TSciChart | SciChart 2D WebAssembly Context} or {@link TSciChart | SciChart 3D WebAssembly Context} containing native methods and access to our WebGL2 WebAssembly Rendering Engine  |

**Returns:** *[NumericTickProvider](numerictickprovider.md)*

## Properties

###  parentAxis

• **parentAxis**: *[AxisCore](axiscore.md)*

*Inherited from [TickProvider](tickprovider.md).[parentAxis](tickprovider.md#parentaxis)*

*Defined in [src/Charting/Numerics/TickProviders/TickProvider.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/TickProvider.ts#L21)*

Gets the parent [Axis](axiscore.md) this TickProvider is attached to

## Methods

###  attachedToAxis

▸ **attachedToAxis**(`axis`: [AxisCore](axiscore.md)): *void*

*Inherited from [TickProvider](tickprovider.md).[attachedToAxis](tickprovider.md#attachedtoaxis)*

*Defined in [src/Charting/Numerics/TickProviders/TickProvider.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/TickProvider.ts#L27)*

Called when the TickProvider is attached to an [Axis](axiscore.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`axis` | [AxisCore](axiscore.md) |   |

**Returns:** *void*

___

###  getMajorTicks

▸ **getMajorTicks**(`minorDelta`: number, `majorDelta`: number, `visibleRange`: NumberRange): *number[]*

*Overrides [TickProvider](tickprovider.md).[getMajorTicks](tickprovider.md#abstract-getmajorticks)*

*Defined in [src/Charting/Numerics/TickProviders/NumericTickProvider.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/NumericTickProvider.ts#L50)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`minorDelta` | number |
`majorDelta` | number |
`visibleRange` | NumberRange |

**Returns:** *number[]*

___

###  getMinorTicks

▸ **getMinorTicks**(`minorDelta`: number, `majorDelta`: number, `visibleRange`: NumberRange): *number[]*

*Overrides [TickProvider](tickprovider.md).[getMinorTicks](tickprovider.md#abstract-getminorticks)*

*Defined in [src/Charting/Numerics/TickProviders/NumericTickProvider.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Numerics/TickProviders/NumericTickProvider.ts#L38)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`minorDelta` | number |
`majorDelta` | number |
`visibleRange` | NumberRange |

**Returns:** *number[]*
