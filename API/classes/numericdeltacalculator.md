[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [NumericDeltaCalculator](numericdeltacalculator.md)

# Class: NumericDeltaCalculator

## Hierarchy

* [DeltaCalculator](deltacalculator.md)

  ↳ **NumericDeltaCalculator**

## Index

### Constructors

* [constructor](numericdeltacalculator.md#constructor)

### Properties

* [parentAxis](numericdeltacalculator.md#parentaxis)

### Methods

* [attachedToAxis](numericdeltacalculator.md#attachedtoaxis)
* [getDeltaFromRange](numericdeltacalculator.md#getdeltafromrange)

## Constructors

###  constructor

\+ **new NumericDeltaCalculator**(`webAssemblyContext`: TSciChart | TSciChart3D): *[NumericDeltaCalculator](numericdeltacalculator.md)*

*Defined in [src/Charting/Visuals/Axis/DeltaCalculator/NumericDeltaCalculator.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/DeltaCalculator/NumericDeltaCalculator.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart &#124; TSciChart3D |

**Returns:** *[NumericDeltaCalculator](numericdeltacalculator.md)*

## Properties

###  parentAxis

• **parentAxis**: *[AxisCore](axiscore.md)*

*Inherited from [DeltaCalculator](deltacalculator.md).[parentAxis](deltacalculator.md#parentaxis)*

*Defined in [src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts#L5)*

## Methods

###  attachedToAxis

▸ **attachedToAxis**(`axis`: [AxisCore](axiscore.md)): *void*

*Inherited from [DeltaCalculator](deltacalculator.md).[attachedToAxis](deltacalculator.md#attachedtoaxis)*

*Defined in [src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`axis` | [AxisCore](axiscore.md) |

**Returns:** *void*

___

###  getDeltaFromRange

▸ **getDeltaFromRange**(`min`: number, `max`: number, `minorsPerMajor`: number, `maxTicks`: number): *NumberRange*

*Overrides [DeltaCalculator](deltacalculator.md).[getDeltaFromRange](deltacalculator.md#abstract-getdeltafromrange)*

*Defined in [src/Charting/Visuals/Axis/DeltaCalculator/NumericDeltaCalculator.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/DeltaCalculator/NumericDeltaCalculator.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |
`max` | number |
`minorsPerMajor` | number |
`maxTicks` | number |

**Returns:** *NumberRange*
