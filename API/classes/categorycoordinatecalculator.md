[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [CategoryCoordinateCalculator](categorycoordinatecalculator.md)

# Class: CategoryCoordinateCalculator

Provides an implementation of Numeric [Coordinate Calculator](coordinatecalculatorbase.md) which transforms
numeric data indexes for [CategoryAxis](categoryaxis.md) to pixel coordinates and vice versa.

**`remarks`** 
SciChart's [JavaScript Charts](https://www.scichart.com/javascript-chart-features) perform conversion operations between
data-coordinates for all drawing and axis measurements.

You can fetch a {link CategoryCoordinateCalculator} instance by calling [AxisCore.getCurrentCoordinateCalculator](axiscore.md#abstract-getcurrentcoordinatecalculator) on a [CategoryAxis](categoryaxis.md).
This will return a unique calculator for the current draw pass.

You can convert pixel to data-indexes and back by using the following code.
An additional method for Category calculators transforms between data-value and index:
```ts
const axis: AxisCore;
const calc = axis.getCurrentCoordinateCalculator();

const pixel = calc.getCoordinate(11); // Gets the pixel coordinate for data at index 11
const dataIndex = calc.getDataValue(pixel); // Performs the inverse operation to get data-value
const dataValue = calc.transformIndexToData(dataIndex); // Converts index to data-value
```
Use the Coordinate calculators when drawing, placing markers, annotations or if you want to place a tooltip over the chart.

## Hierarchy

* [CoordinateCalculatorBase](coordinatecalculatorbase.md)

  ↳ **CategoryCoordinateCalculator**

## Implements

* IDeletable

## Index

### Constructors

* [constructor](categorycoordinatecalculator.md#constructor)

### Properties

* [baseXValues](categorycoordinatecalculator.md#basexvalues)
* [hasFlippedCoordinates](categorycoordinatecalculator.md#readonly-hasflippedcoordinates)
* [indexMax](categorycoordinatecalculator.md#readonly-indexmax)
* [indexMin](categorycoordinatecalculator.md#readonly-indexmin)
* [isCategoryCoordinateCalculator](categorycoordinatecalculator.md#readonly-iscategorycoordinatecalculator)
* [nativeCalculator](categorycoordinatecalculator.md#nativecalculator)
* [offset](categorycoordinatecalculator.md#readonly-offset)
* [viewportDimension](categorycoordinatecalculator.md#readonly-viewportdimension)
* [visibleMax](categorycoordinatecalculator.md#readonly-visiblemax)
* [visibleMin](categorycoordinatecalculator.md#readonly-visiblemin)

### Methods

* [delete](categorycoordinatecalculator.md#delete)
* [getCoordinate](categorycoordinatecalculator.md#getcoordinate)
* [getDataValue](categorycoordinatecalculator.md#getdatavalue)
* [transformIndexToData](categorycoordinatecalculator.md#transformindextodata)
* [translateBy](categorycoordinatecalculator.md#translateby)
* [zoomTranslateBy](categorycoordinatecalculator.md#zoomtranslateby)

## Constructors

###  constructor

\+ **new CategoryCoordinateCalculator**(`webAssemblyContext`: TSciChart, `viewportDimension`: number, `visibleMin`: number, `visibleMax`: number, `indexMin`: number, `indexMax`: number, `offset`: number): *[CategoryCoordinateCalculator](categorycoordinatecalculator.md)*

*Overrides void*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts#L39)*

Creates an instance of CategoryCoordinateCalculator

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`webAssemblyContext` | TSciChart | - | The {@link TSciChart | SciChart 2D WebAssembly Context} or {@link TSciChart2D | SciChart 2D WebAssembly Context} containing native methods and access to our WebGL2 Engine and WebAssembly numerical methods |
`viewportDimension` | number | - | The size of the associated [Axis](axiscore.md) at the time of drawing |
`visibleMin` | number | - | The minimum data-value visible on the Axis at the time of drawing |
`visibleMax` | number | - | The maximum data-value visible on the Axis at the time of drawing |
`indexMin` | number | - | The [CategoryAxis.visibleRange](categoryaxis.md#visiblerange).min at the time of drawing, corresponding to the minimum data-index visible |
`indexMax` | number | - | The [CategoryAxis.visibleRange](categoryaxis.md#visiblerange).max at the time of drawing, corresponding to the maximum data-index visible |
`offset` | number | 0 | A constant pixel offset used in coordinate calculations  |

**Returns:** *[CategoryCoordinateCalculator](categorycoordinatecalculator.md)*

## Properties

###  baseXValues

• **baseXValues**: *number[]*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts#L39)*

The primary chart series X-values, required for category calculations and interpolation / extrapolation

___

### `Readonly` hasFlippedCoordinates

• **hasFlippedCoordinates**: *boolean*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[hasFlippedCoordinates](coordinatecalculatorbase.md#readonly-hasflippedcoordinates)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L46)*

When true, this coordinate calculator has flipped coordinates

___

### `Readonly` indexMax

• **indexMax**: *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts#L34)*

The indexMax is the [CategoryAxis.visibleRange](categoryaxis.md#visiblerange).max at the time of drawing, corresponding to the maximum data-index visible

___

### `Readonly` indexMin

• **indexMin**: *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts#L30)*

The indexMin is the [CategoryAxis.visibleRange](categoryaxis.md#visiblerange).min at the time of drawing, corresponding to the minimum data-index visible

___

### `Readonly` isCategoryCoordinateCalculator

• **isCategoryCoordinateCalculator**: *boolean*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[isCategoryCoordinateCalculator](coordinatecalculatorbase.md#readonly-iscategorycoordinatecalculator)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L50)*

When true, this coordinate calculator behaves as a Category coordinate calculator, using index not x-value for measuring

___

###  nativeCalculator

• **nativeCalculator**: *CoordinateCalculator*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[nativeCalculator](coordinatecalculatorbase.md#nativecalculator)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L54)*

Gets the native (WebAssembly) {@link CoordinateCalculator} instance

___

### `Readonly` offset

• **offset**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[offset](coordinatecalculatorbase.md#readonly-offset)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L42)*

Gets or sets a constant offset in pixels for all generated coordinates

___

### `Readonly` viewportDimension

• **viewportDimension**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[viewportDimension](coordinatecalculatorbase.md#readonly-viewportdimension)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L38)*

Gets or sets the ViewportDimension, corresponding to the size of the associated [Axis](axiscore.md) at the time of drawing

___

### `Readonly` visibleMax

• **visibleMax**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[visibleMax](coordinatecalculatorbase.md#readonly-visiblemax)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L34)*

Gets or sets the Visible maximum value, corresponding to [AxisCore.visibleRange](axiscore.md#visiblerange).max at the time of drawing

___

### `Readonly` visibleMin

• **visibleMin**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[visibleMin](coordinatecalculatorbase.md#readonly-visiblemin)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L30)*

Gets or sets the Visible minimum value, corresponding to [AxisCore.visibleRange](axiscore.md#visiblerange).min at the time of drawing

## Methods

###  delete

▸ **delete**(): *void*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[delete](coordinatecalculatorbase.md#delete)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:135](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L135)*

**`inheritdoc`** 

**Returns:** *void*

___

###  getCoordinate

▸ **getCoordinate**(`dataValue`: number): *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[getCoordinate](coordinatecalculatorbase.md#getcoordinate)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L95)*

Converts the Data-value to a pixel coordinate
Performs the inverse operation to [getDataValue](categorycoordinatecalculator.md#getdatavalue)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dataValue` | number | The data-value |

**Returns:** *number*

the pixel coordinate

___

###  getDataValue

▸ **getDataValue**(`coordinate`: number): *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[getDataValue](coordinatecalculatorbase.md#getdatavalue)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L104)*

Converts the pixel coordinate to a Data-value.
Performs the inverse operation to [getCoordinate](categorycoordinatecalculator.md#getcoordinate)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`coordinate` | number | The pixel coordiante |

**Returns:** *number*

the data value

___

###  transformIndexToData

▸ **transformIndexToData**(`index`: number): *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CategoryCoordinateCalculator.ts#L82)*

Transforms an Index to a Data-value, with extrapolation and interpolation for values found outside of
[the Primary Chart series X-Values](categorycoordinatecalculator.md#basexvalues)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | the index to transform |

**Returns:** *number*

the Data-value

___

###  translateBy

▸ **translateBy**(`pixels`: number, `range`: NumberRange): *NumberRange*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[translateBy](coordinatecalculatorbase.md#translateby)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:114](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L114)*

Translates a {@link NumberRange} in Data-coordinates by a specified number of pixels,
performing intermediate calculations from data-value to pixel and back to perform the translation

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pixels` | number | The pixels to translate |
`range` | NumberRange | The {@link NumberRange} to translate. For example this could be an [Axis.visibleRange](axiscore.md#visiblerange) |

**Returns:** *NumberRange*

The translated range

___

###  zoomTranslateBy

▸ **zoomTranslateBy**(`minFraction`: number, `maxFraction`: number, `inputRange`: NumberRange): *NumberRange‹›*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[zoomTranslateBy](coordinatecalculatorbase.md#zoomtranslateby)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:129](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L129)*

Zooms a {@link NumberRange} by a specified fractional amount

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`minFraction` | number | The fraction to zoom the {@link NumberRange.min} by. A fraction of 0.1 zooms the minimum by 10% |
`maxFraction` | number | The fraction to zoom the {@link NumberRange.max} by. A fraction of 0.1 zooms the maximum by 10% |
`inputRange` | NumberRange | The {@link NumberRange} to zoom |

**Returns:** *NumberRange‹›*

The zoomed range
