[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [PieSegment](piesegment.md)

# Class: PieSegment

## Hierarchy

* **PieSegment**

## Implements

* [IPieSegment](../interfaces/ipiesegment.md)

## Index

### Constructors

* [constructor](piesegment.md#constructor)

### Properties

* [id](piesegment.md#readonly-id)
* [DEFAULT_DELTA](piesegment.md#static-readonly-default_delta)

### Accessors

* [color](piesegment.md#color)
* [colorLinearGradient](piesegment.md#colorlineargradient)
* [delta](piesegment.md#delta)
* [isSelected](piesegment.md#isselected)
* [text](piesegment.md#text)
* [value](piesegment.md#value)

### Methods

* [getPercentage](piesegment.md#getpercentage)
* [onAttach](piesegment.md#onattach)
* [onDetach](piesegment.md#ondetach)

## Constructors

###  constructor

\+ **new PieSegment**(`options?`: [IPieSegmentOptions](../interfaces/ipiesegmentoptions.md)): *[PieSegment](piesegment.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [IPieSegmentOptions](../interfaces/ipiesegmentoptions.md) |

**Returns:** *[PieSegment](piesegment.md)*

## Properties

### `Readonly` id

• **id**: *string* = generateGuid()

*Implementation of [IPieSegment](../interfaces/ipiesegment.md).[id](../interfaces/ipiesegment.md#readonly-id)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L18)*

___

### `Static` `Readonly` DEFAULT_DELTA

▪ **DEFAULT_DELTA**: *15* = 15

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L17)*

## Accessors

###  color

• **get color**(): *string*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L54)*

**Returns:** *string*

• **set color**(`value`: string): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:57](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  colorLinearGradient

• **get colorLinearGradient**(): *GradientParams‹›*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L46)*

**Returns:** *GradientParams‹›*

• **set colorLinearGradient**(`value`: GradientParams‹›): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | GradientParams‹› |

**Returns:** *void*

___

###  delta

• **get delta**(): *number*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L96)*

**Returns:** *number*

• **set delta**(`value`: number): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:99](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  isSelected

• **get isSelected**(): *boolean*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L62)*

**Returns:** *boolean*

• **set isSelected**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  text

• **get text**(): *string*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L75)*

**Returns:** *string*

• **set text**(`value`: string): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L78)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  value

• **get value**(): *number*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L88)*

**Returns:** *number*

• **set value**(`value`: number): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L91)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

## Methods

###  getPercentage

▸ **getPercentage**(`total`: number): *string*

*Implementation of [IPieSegment](../interfaces/ipiesegment.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:83](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L83)*

**Parameters:**

Name | Type |
------ | ------ |
`total` | number |

**Returns:** *string*

___

###  onAttach

▸ **onAttach**(`scps`: [SciChartPieSurface](scichartpiesurface.md)): *void*

*Implementation of [IPieSegment](../interfaces/ipiesegment.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`scps` | [SciChartPieSurface](scichartpiesurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IPieSegment](../interfaces/ipiesegment.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment.ts#L40)*

**Returns:** *void*
