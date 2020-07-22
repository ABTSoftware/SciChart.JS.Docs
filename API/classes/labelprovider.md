[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [LabelProvider](labelprovider.md)

# Class: LabelProvider

## Hierarchy

* **LabelProvider**

  ↳ [NumericLabelProvider](numericlabelprovider.md)

## Index

### Properties

* [numericFormat](labelprovider.md#abstract-numericformat)
* [parentAxis](labelprovider.md#parentaxis)

### Methods

* [attachedToAxis](labelprovider.md#attachedtoaxis)
* [formatCursorLabel](labelprovider.md#abstract-formatcursorlabel)
* [formatLabel](labelprovider.md#abstract-formatlabel)
* [onBeginAxisDraw](labelprovider.md#abstract-onbeginaxisdraw)

## Properties

### `Abstract` numericFormat

• **numericFormat**: *[ENumericFormat](../enums/enumericformat.md)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L5)*

___

###  parentAxis

• **parentAxis**: *[AxisCore](axiscore.md)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L7)*

## Methods

###  attachedToAxis

▸ **attachedToAxis**(`axis`: [AxisCore](axiscore.md)): *void*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:9](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`axis` | [AxisCore](axiscore.md) |

**Returns:** *void*

___

### `Abstract` formatCursorLabel

▸ **formatCursorLabel**(`dataValue`: number, `formatString`: string): *string*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`dataValue` | number |
`formatString` | string |

**Returns:** *string*

___

### `Abstract` formatLabel

▸ **formatLabel**(`dataValue`: number): *string*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`dataValue` | number |

**Returns:** *string*

___

### `Abstract` onBeginAxisDraw

▸ **onBeginAxisDraw**(): *void*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L13)*

**Returns:** *void*
