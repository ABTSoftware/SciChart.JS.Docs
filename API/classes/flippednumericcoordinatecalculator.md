[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [FlippedNumericCoordinateCalculator](flippednumericcoordinatecalculator.md)

# Class: FlippedNumericCoordinateCalculator

Provides an implementation of Numeric [Coordinate Calculator](coordinatecalculatorbase.md) which transforms
numeric data-values to pixel coordinates and vice versa. This implementation provides flipped coordinates
relative to [NumericCoordinateCalculator](numericcoordinatecalculator.md)

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

* [CoordinateCalculatorBase](coordinatecalculatorbase.md)

  ↳ **FlippedNumericCoordinateCalculator**

## Implements

* IDeletable

## Index

### Constructors

* [constructor](flippednumericcoordinatecalculator.md#constructor)

### Properties

* [hasFlippedCoordinates](flippednumericcoordinatecalculator.md#readonly-hasflippedcoordinates)
* [isCategoryCoordinateCalculator](flippednumericcoordinatecalculator.md#readonly-iscategorycoordinatecalculator)
* [nativeCalculator](flippednumericcoordinatecalculator.md#nativecalculator)
* [offset](flippednumericcoordinatecalculator.md#readonly-offset)
* [viewportDimension](flippednumericcoordinatecalculator.md#readonly-viewportdimension)
* [visibleMax](flippednumericcoordinatecalculator.md#readonly-visiblemax)
* [visibleMin](flippednumericcoordinatecalculator.md#readonly-visiblemin)

### Methods

* [delete](flippednumericcoordinatecalculator.md#delete)
* [getCoordinate](flippednumericcoordinatecalculator.md#getcoordinate)
* [getDataValue](flippednumericcoordinatecalculator.md#getdatavalue)
* [translateBy](flippednumericcoordinatecalculator.md#translateby)
* [zoomTranslateBy](flippednumericcoordinatecalculator.md#zoomtranslateby)

## Constructors

###  constructor

\+ **new FlippedNumericCoordinateCalculator**(`webAssemblyContext`: TSciChart | TSciChart3D, `viewportDimension`: number, `visibleMin`: number, `visibleMax`: number, `offset`: number): *[FlippedNumericCoordinateCalculator](flippednumericcoordinatecalculator.md)*

*Overrides void*

*Defined in [src/Charting/Numerics/CoordinateCalculators/FlippedNumericCoordinateCalculator.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/FlippedNumericCoordinateCalculator.ts#L27)*

Creates an instance of FlippedNumericCoordinateCalculator

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`webAssemblyContext` | TSciChart &#124; TSciChart3D | - | The {@link TSciChart | SciChart 2D WebAssembly Context} or {@link TSciChart2D | SciChart 2D WebAssembly Context} containing native methods and access to our WebGL2 Engine and WebAssembly numerical methods |
`viewportDimension` | number | - | The size of the associated [Axis](axiscore.md) at the time of drawing |
`visibleMin` | number | - | The [AxisCore.visibleRange](axiscore.md#visiblerange).min at the time of drawing |
`visibleMax` | number | - | The [AxisCore.visibleRange](axiscore.md#visiblerange).max at the time of drawing |
`offset` | number | 0 | A constant pixel offset used in coordinate calculations  |

**Returns:** *[FlippedNumericCoordinateCalculator](flippednumericcoordinatecalculator.md)*

## Properties

### `Readonly` hasFlippedCoordinates

• **hasFlippedCoordinates**: *boolean*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[hasFlippedCoordinates](coordinatecalculatorbase.md#readonly-hasflippedcoordinates)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L46)*

When true, this coordinate calculator has flipped coordinates

___

### `Readonly` isCategoryCoordinateCalculator

• **isCategoryCoordinateCalculator**: *boolean*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[isCategoryCoordinateCalculator](coordinatecalculatorbase.md#readonly-iscategorycoordinatecalculator)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L50)*

When true, this coordinate calculator behaves as a Category coordinate calculator, using index not x-value for measuring

___

###  nativeCalculator

• **nativeCalculator**: *CoordinateCalculator*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[nativeCalculator](coordinatecalculatorbase.md#nativecalculator)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L54)*

Gets the native (WebAssembly) {@link CoordinateCalculator} instance

___

### `Readonly` offset

• **offset**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[offset](coordinatecalculatorbase.md#readonly-offset)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L42)*

Gets or sets a constant offset in pixels for all generated coordinates

___

### `Readonly` viewportDimension

• **viewportDimension**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[viewportDimension](coordinatecalculatorbase.md#readonly-viewportdimension)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L38)*

Gets or sets the ViewportDimension, corresponding to the size of the associated [Axis](axiscore.md) at the time of drawing

___

### `Readonly` visibleMax

• **visibleMax**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[visibleMax](coordinatecalculatorbase.md#readonly-visiblemax)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L34)*

Gets or sets the Visible maximum value, corresponding to [AxisCore.visibleRange](axiscore.md#visiblerange).max at the time of drawing

___

### `Readonly` visibleMin

• **visibleMin**: *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[visibleMin](coordinatecalculatorbase.md#readonly-visiblemin)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L30)*

Gets or sets the Visible minimum value, corresponding to [AxisCore.visibleRange](axiscore.md#visiblerange).min at the time of drawing

## Methods

###  delete

▸ **delete**(): *void*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[delete](coordinatecalculatorbase.md#delete)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:135](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L135)*

**`inheritdoc`** 

**Returns:** *void*

___

###  getCoordinate

▸ **getCoordinate**(`dataValue`: number): *number*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[getCoordinate](coordinatecalculatorbase.md#getcoordinate)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L95)*

Converts the Data-value to a pixel coordinate
Performs the inverse operation to [getDataValue](flippednumericcoordinatecalculator.md#getdatavalue)

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

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L104)*

Converts the pixel coordinate to a Data-value.
Performs the inverse operation to [getCoordinate](flippednumericcoordinatecalculator.md#getcoordinate)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`coordinate` | number | The pixel coordiante |

**Returns:** *number*

the data value

___

###  translateBy

▸ **translateBy**(`pixels`: number, `range`: NumberRange): *NumberRange*

*Inherited from [CoordinateCalculatorBase](coordinatecalculatorbase.md).[translateBy](coordinatecalculatorbase.md#translateby)*

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:114](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L114)*

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

*Defined in [src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts:129](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase.ts#L129)*

Zooms a {@link NumberRange} by a specified fractional amount

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`minFraction` | number | The fraction to zoom the {@link NumberRange.min} by. A fraction of 0.1 zooms the minimum by 10% |
`maxFraction` | number | The fraction to zoom the {@link NumberRange.max} by. A fraction of 0.1 zooms the maximum by 10% |
`inputRange` | NumberRange | The {@link NumberRange} to zoom |

**Returns:** *NumberRange‹›*

The zoomed range
