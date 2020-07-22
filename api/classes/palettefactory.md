[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [PaletteFactory](palettefactory.md)

# Class: PaletteFactory

The PaletteFactory allows easy creation of palettes for some chart types

## Hierarchy

* **PaletteFactory**

## Index

### Properties

* [precision](palettefactory.md#static-readonly-precision)

### Methods

* [createColorMap](palettefactory.md#static-createcolormap)
* [createGradient](palettefactory.md#static-creategradient)

## Properties

### `Static` `Readonly` precision

▪ **precision**: *number* = 500

*Defined in [src/Charting/Model/PaletteFactory.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/PaletteFactory.ts#L12)*

## Methods

### `Static` createColorMap

▸ **createColorMap**(`webAssemblyContext`: TSciChart, `gradientStops`: TGradientStop[]): *number[]*

*Defined in [src/Charting/Model/PaletteFactory.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/PaletteFactory.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`gradientStops` | TGradientStop[] |

**Returns:** *number[]*

___

### `Static` createGradient

▸ **createGradient**(`webAssemblyContext`: TSciChart, `gradientBrush`: GradientParams): *[IStrokePaletteProvider](../interfaces/istrokepaletteprovider.md)*

*Defined in [src/Charting/Model/PaletteFactory.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/PaletteFactory.ts#L20)*

Creates a Gradient Palette for line series, returning a [IStrokePaletteProvider](../interfaces/istrokepaletteprovider.md) implementation which
colors data-points of line charts depending on the x-index of the data according to the Gradient Brush passed in

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`webAssemblyContext` | TSciChart | the {@link TSciChart | SciChart WebAssembly Context} containing native methods |
`gradientBrush` | GradientParams | the {@link GradientParams} containing information about the Gradient Brush  |

**Returns:** *[IStrokePaletteProvider](../interfaces/istrokepaletteprovider.md)*
