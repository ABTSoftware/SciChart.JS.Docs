[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [RenderPassData](renderpassdata.md)

# Class: RenderPassData

**`summary`** RenderPassData contains properties which are passed to [BaseRenderableSeries](baserenderableseries.md) at the time of drawing

## Hierarchy

* **RenderPassData**

## Index

### Constructors

* [constructor](renderpassdata.md#constructor)

### Properties

* [indexRange](renderpassdata.md#readonly-indexrange)
* [isVerticalChart](renderpassdata.md#readonly-isverticalchart)
* [xCoordinateCalculator](renderpassdata.md#readonly-xcoordinatecalculator)
* [yCoordinateCalculator](renderpassdata.md#readonly-ycoordinatecalculator)

## Constructors

###  constructor

\+ **new RenderPassData**(`indexRange`: NumberRange, `xCoordinateCalculator`: [CoordinateCalculatorBase](coordinatecalculatorbase.md), `yCoordinateCalculator`: [CoordinateCalculatorBase](coordinatecalculatorbase.md), `isVerticalChart`: boolean): *[RenderPassData](renderpassdata.md)*

*Defined in [src/Charting/Services/RenderPassData.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Services/RenderPassData.ts#L7)*

Creates an instance of RenderPassData

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`indexRange` | NumberRange | The min and max index to data-range currently visible on the [SciChartSurface](scichartsurface.md) |
`xCoordinateCalculator` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) | The XAxis [Coordinate Calculator](coordinatecalculatorbase.md), used to transform between pixel and data-coordinates |
`yCoordinateCalculator` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) | The YAxis [Coordinate Calculator](coordinatecalculatorbase.md), used to transform between pixel and data-coordinates |
`isVerticalChart` | boolean | A flag indicating if the chart is currently vertically arranged (XAxis on the left, YAxis on the top/bottom)  |

**Returns:** *[RenderPassData](renderpassdata.md)*

## Properties

### `Readonly` indexRange

• **indexRange**: *NumberRange*

*Defined in [src/Charting/Services/RenderPassData.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Services/RenderPassData.ts#L18)*

The min and max index to data-range currently visible on the [SciChartSurface](scichartsurface.md)

___

### `Readonly` isVerticalChart

• **isVerticalChart**: *boolean*

*Defined in [src/Charting/Services/RenderPassData.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Services/RenderPassData.ts#L21)*

A flag indicating if the chart is currently vertically arranged (XAxis on the left, YAxis on the top/bottom)

___

### `Readonly` xCoordinateCalculator

• **xCoordinateCalculator**: *[CoordinateCalculatorBase](coordinatecalculatorbase.md)*

*Defined in [src/Charting/Services/RenderPassData.ts:19](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Services/RenderPassData.ts#L19)*

The XAxis [Coordinate Calculator](coordinatecalculatorbase.md),
used to transform between pixel and data-coordinates

___

### `Readonly` yCoordinateCalculator

• **yCoordinateCalculator**: *[CoordinateCalculatorBase](coordinatecalculatorbase.md)*

*Defined in [src/Charting/Services/RenderPassData.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Services/RenderPassData.ts#L20)*

The YAxis [Coordinate Calculator](coordinatecalculatorbase.md),
used to transform between pixel and data-coordinates
