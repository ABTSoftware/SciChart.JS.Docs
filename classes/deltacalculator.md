[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [DeltaCalculator](deltacalculator.md)

# Class: DeltaCalculator

## Hierarchy

* **DeltaCalculator**

  ↳ [NumericDeltaCalculator](numericdeltacalculator.md)

## Index

### Properties

* [parentAxis](deltacalculator.md#parentaxis)

### Methods

* [attachedToAxis](deltacalculator.md#attachedtoaxis)
* [getDeltaFromRange](deltacalculator.md#abstract-getdeltafromrange)

## Properties

###  parentAxis

• **parentAxis**: *[AxisCore](axiscore.md)*

*Defined in [src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts#L5)*

## Methods

###  attachedToAxis

▸ **attachedToAxis**(`axis`: [AxisCore](axiscore.md)): *void*

*Defined in [src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`axis` | [AxisCore](axiscore.md) |

**Returns:** *void*

___

### `Abstract` getDeltaFromRange

▸ **getDeltaFromRange**(`min`: number, `max`: number, `minorsPerMajor`: number, `maxTicks`: number): *NumberRange*

*Defined in [src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts:11](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Axis/DeltaCalculator/DeltaCalculator.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |
`max` | number |
`minorsPerMajor` | number |
`maxTicks` | number |

**Returns:** *NumberRange*
