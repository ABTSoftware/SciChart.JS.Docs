[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [CoordinateCalculatorBase](coordinatecalculatorbase.md)

# Class: CoordinateCalculatorBase

The CoordinateCalculatorBase class provides methods for converting between Pixel and Data coordinates

**`remarks`** 
SciChart's [JavaScript Charts](https://www.scichart.com/javascript-chart-features) perform conversion operations between
data-coordinates for all drawing and axis measurements.

You can fetch a CoordinateCalculator instance by calling [AxisCore.getCurrentCoordinateCalculator](axiscore.md#abstract-getcurrentcoordinatecalculator). This will return a unique calculator
for the current draw pass.

You can convert pixel to data-coordinates and back by using the following code:
```ts
const axis: AxisCore;
const calc = axis.getCurrentCoordinateCalculator();

const pixel = calc.getCoordinate(1.23); // Gets the pixel coordinate for data-value 1.23
const dataValue = cald.getDataValue(pixel); // Performs the inverse operation to get data-value
```

Use the Coordinate calculators when drawing, placing markers, annotations or if you want to place a tooltip over the chart.

## Hierarchy

* **CoordinateCalculatorBase**

  ↳ [FlippedNumericCoordinateCalculator](flippednumericcoordinatecalculator.md)

  ↳ [NumericCoordinateCalculator](numericcoordinatecalculator.md)

  ↳ [CategoryCoordinateCalculator](categorycoordinatecalculator.md)

  ↳ [FlippedCategoryCoordinateCalculator](flippedcategorycoordinatecalculator.md)

## Implements

* IDeletable

## Index

### Properties

* [hasFlippedCoordinates](coordinatecalculatorbase.md#readonly-hasflippedcoordinates)
* [isCategoryCoordinateCalculator](coordinatecalculatorbase.md#readonly-iscategorycoordinatecalculator)
* [nativeCalculator](coordinatecalculatorbase.md#nativecalculator)
* [offset](coordinatecalculatorbase.md#readonly-offset)
* [viewportDimension](coordinatecalculatorbase.md#readonly-viewportdimension)
* [visibleMax](coordinatecalculatorbase.md#readonly-visiblemax)
* [visibleMin](coordinatecalculatorbase.md#readonly-visiblemin)

### Methods

* [delete](coordinatecalculatorbase.md#delete)
* [getCoordinate](coordinatecalculatorbase.md#getcoordinate)
* [getDataValue](coordinatecalculatorbase.md#getdatavalue)
* [translateBy](coordinatecalculatorbase.md#translateby)
* [zoomTranslateBy](coordinatecalculatorbase.md#zoomtranslateby)

## Properties

### `Readonly` hasFlippedCoordinates

• **hasFlippedCoordinates**: *boolean*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L46)*

When true, this coordinate calculator has flipped coordinates

___

### `Readonly` isCategoryCoordinateCalculator

• **isCategoryCoordinateCalculator**: *boolean*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L50)*

When true, this coordinate calculator behaves as a Category coordinate calculator, using index not x-value for measuring

___

###  nativeCalculator

• **nativeCalculator**: *CoordinateCalculator*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L54)*

Gets the native (WebAssembly) {@link CoordinateCalculator} instance

___

### `Readonly` offset

• **offset**: *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L42)*

Gets or sets a constant offset in pixels for all generated coordinates

___

### `Readonly` viewportDimension

• **viewportDimension**: *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L38)*

Gets or sets the ViewportDimension, corresponding to the size of the associated [Axis](axiscore.md) at the time of drawing

___

### `Readonly` visibleMax

• **visibleMax**: *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L34)*

Gets or sets the Visible maximum value, corresponding to [AxisCore.visibleRange](axiscore.md#visiblerange).max at the time of drawing

___

### `Readonly` visibleMin

• **visibleMin**: *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L30)*

Gets or sets the Visible minimum value, corresponding to [AxisCore.visibleRange](axiscore.md#visiblerange).min at the time of drawing

## Methods

###  delete

▸ **delete**(): *void*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:135](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L135)*

**`inheritdoc`** 

**Returns:** *void*

___

###  getCoordinate

▸ **getCoordinate**(`dataValue`: number): *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L95)*

Converts the Data-value to a pixel coordinate
Performs the inverse operation to [getDataValue](coordinatecalculatorbase.md#getdatavalue)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dataValue` | number | The data-value |

**Returns:** *number*

the pixel coordinate

___

###  getDataValue

▸ **getDataValue**(`coordinate`: number): *number*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L104)*

Converts the pixel coordinate to a Data-value.
Performs the inverse operation to [getCoordinate](coordinatecalculatorbase.md#getcoordinate)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`coordinate` | number | The pixel coordiante |

**Returns:** *number*

the data value

___

###  translateBy

▸ **translateBy**(`pixels`: number, `range`: NumberRange): *NumberRange*

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
