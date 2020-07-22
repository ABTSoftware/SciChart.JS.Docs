[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IPieSegment](ipiesegment.md)

# Interface: IPieSegment

## Hierarchy

* **IPieSegment**

## Implemented by

* [PieSegment](../classes/piesegment.md)

## Index

### Properties

* [color](ipiesegment.md#color)
* [colorLinearGradient](ipiesegment.md#colorlineargradient)
* [delta](ipiesegment.md#delta)
* [id](ipiesegment.md#readonly-id)
* [isSelected](ipiesegment.md#isselected)
* [text](ipiesegment.md#text)
* [value](ipiesegment.md#value)

### Methods

* [getPercentage](ipiesegment.md#getpercentage)
* [onAttach](ipiesegment.md#onattach)
* [onDetach](ipiesegment.md#ondetach)

## Properties

###  color

• **color**: *string*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L8)*

___

###  colorLinearGradient

• **colorLinearGradient**: *GradientParams*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:9](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L9)*

___

###  delta

• **delta**: *number*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:11](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L11)*

___

### `Readonly` id

• **id**: *string*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L5)*

___

###  isSelected

• **isSelected**: *boolean*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L10)*

___

###  text

• **text**: *string*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:6](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L6)*

___

###  value

• **value**: *number*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L7)*

## Methods

###  getPercentage

▸ **getPercentage**(`total`: number): *string*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`total` | number |

**Returns:** *string*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartPieSurface](../classes/scichartpiesurface.md)): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartPieSurface](../classes/scichartpiesurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment.ts#L14)*

**Returns:** *void*
