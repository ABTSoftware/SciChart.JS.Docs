[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IChartModifierBaseOptions](ichartmodifierbaseoptions.md)

# Interface: IChartModifierBaseOptions

Options for passing to the constructor of [ChartModifierBase2D](../classes/chartmodifierbase2d.md) derived types

## Hierarchy

* **IChartModifierBaseOptions**

  ↳ [ILegendModifierOptions](ilegendmodifieroptions.md)

  ↳ [IRolloverModifierOptions](irollovermodifieroptions.md)

  ↳ [IRubberBandXyZoomModifierOptions](irubberbandxyzoommodifieroptions.md)

## Index

### Properties

* [modifierGroup](ichartmodifierbaseoptions.md#optional-modifiergroup)
* [xyDirection](ichartmodifierbaseoptions.md#optional-xydirection)

## Properties

### `Optional` modifierGroup

• **modifierGroup**? : *string*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L16)*

Defines the Modifier Group string - a grouping by ID for sharing mouse events across charts

___

### `Optional` xyDirection

• **xyDirection**? : *EXyDirection*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L12)*

Defines the {@link EXyDirection | Xy Direction} - whether the modifier works in X, Y or XY or neither direction
