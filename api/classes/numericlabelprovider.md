[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [NumericLabelProvider](numericlabelprovider.md)

# Class: NumericLabelProvider

## Hierarchy

* [LabelProvider](labelprovider.md)

  ↳ **NumericLabelProvider**

## Index

### Constructors

* [constructor](numericlabelprovider.md#constructor)

### Properties

* [numericFormat](numericlabelprovider.md#numericformat)
* [parentAxis](numericlabelprovider.md#parentaxis)

### Methods

* [attachedToAxis](numericlabelprovider.md#attachedtoaxis)
* [formatCursorLabel](numericlabelprovider.md#formatcursorlabel)
* [formatLabel](numericlabelprovider.md#formatlabel)
* [onBeginAxisDraw](numericlabelprovider.md#onbeginaxisdraw)

## Constructors

###  constructor

\+ **new NumericLabelProvider**(`format`: [ENumericFormat](../enums/enumericformat.md)): *[NumericLabelProvider](numericlabelprovider.md)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts#L15)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`format` | [ENumericFormat](../enums/enumericformat.md) | ENumericFormat.NoFormat |

**Returns:** *[NumericLabelProvider](numericlabelprovider.md)*

## Properties

###  numericFormat

• **numericFormat**: *[ENumericFormat](../enums/enumericformat.md)*

*Overrides [LabelProvider](labelprovider.md).[numericFormat](labelprovider.md#abstract-numericformat)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts#L15)*

___

###  parentAxis

• **parentAxis**: *[AxisCore](axiscore.md)*

*Inherited from [NumericLabelProvider](numericlabelprovider.md).[parentAxis](numericlabelprovider.md#parentaxis)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L7)*

## Methods

###  attachedToAxis

▸ **attachedToAxis**(`axis`: [AxisCore](axiscore.md)): *void*

*Inherited from [NumericLabelProvider](numericlabelprovider.md).[attachedToAxis](numericlabelprovider.md#attachedtoaxis)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts:9](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/LabelProvider.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`axis` | [AxisCore](axiscore.md) |

**Returns:** *void*

___

###  formatCursorLabel

▸ **formatCursorLabel**(`dataValue`: number, `formatString`: string): *string*

*Overrides [LabelProvider](labelprovider.md).[formatCursorLabel](labelprovider.md#abstract-formatcursorlabel)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`dataValue` | number |
`formatString` | string |

**Returns:** *string*

___

###  formatLabel

▸ **formatLabel**(`dataValue`: number): *string*

*Overrides [LabelProvider](labelprovider.md).[formatLabel](labelprovider.md#abstract-formatlabel)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`dataValue` | number |

**Returns:** *string*

___

###  onBeginAxisDraw

▸ **onBeginAxisDraw**(): *void*

*Overrides [LabelProvider](labelprovider.md).[onBeginAxisDraw](labelprovider.md#abstract-onbeginaxisdraw)*

*Defined in [src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider.ts#L22)*

**Returns:** *void*
