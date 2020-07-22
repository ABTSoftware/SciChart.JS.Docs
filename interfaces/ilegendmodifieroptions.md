[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ILegendModifierOptions](ilegendmodifieroptions.md)

# Interface: ILegendModifierOptions

Optional parameters used to configure a [LegendModifier](../classes/legendmodifier.md) at construct time

## Hierarchy

* [IChartModifierBaseOptions](ichartmodifierbaseoptions.md)

  ↳ **ILegendModifierOptions**

## Index

### Properties

* [margin](ilegendmodifieroptions.md#optional-margin)
* [modifierGroup](ilegendmodifieroptions.md#optional-modifiergroup)
* [orientation](ilegendmodifieroptions.md#optional-orientation)
* [placement](ilegendmodifieroptions.md#optional-placement)
* [showCheckboxes](ilegendmodifieroptions.md#optional-showcheckboxes)
* [showLegend](ilegendmodifieroptions.md#optional-showlegend)
* [showSeriesMarkers](ilegendmodifieroptions.md#optional-showseriesmarkers)
* [xyDirection](ilegendmodifieroptions.md#optional-xydirection)

## Properties

### `Optional` margin

• **margin**? : *number*

*Defined in [src/Charting/ChartModifiers/LegendModifier.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/LegendModifier.ts#L34)*

Sets the margin for the legend control

___

### `Optional` modifierGroup

• **modifierGroup**? : *string*

*Inherited from [IChartModifierBaseOptions](ichartmodifierbaseoptions.md).[modifierGroup](ichartmodifierbaseoptions.md#optional-modifiergroup)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L16)*

Defines the Modifier Group string - a grouping by ID for sharing mouse events across charts

___

### `Optional` orientation

• **orientation**? : *[ELegendOrientation](../enums/elegendorientation.md)*

*Defined in [src/Charting/ChartModifiers/LegendModifier.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/LegendModifier.ts#L14)*

Sets the initial orientation of the legend. See [ELegendOrientation](../enums/elegendorientation.md) for a list of values

___

### `Optional` placement

• **placement**? : *[ELegendPlacement](../enums/elegendplacement.md)*

*Defined in [src/Charting/ChartModifiers/LegendModifier.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/LegendModifier.ts#L30)*

Sets the initial legend placement in the parent chart surface. See [ELegendPlacement](../enums/elegendplacement.md) for a list of values

___

### `Optional` showCheckboxes

• **showCheckboxes**? : *boolean*

*Defined in [src/Charting/ChartModifiers/LegendModifier.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/LegendModifier.ts#L22)*

Sets whether the legend has visibility checkboxes in it or not

___

### `Optional` showLegend

• **showLegend**? : *boolean*

*Defined in [src/Charting/ChartModifiers/LegendModifier.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/LegendModifier.ts#L18)*

Sets whether the legend is initially visible or not

___

### `Optional` showSeriesMarkers

• **showSeriesMarkers**? : *boolean*

*Defined in [src/Charting/ChartModifiers/LegendModifier.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/LegendModifier.ts#L26)*

Sets whether Series markers are visible or not

___

### `Optional` xyDirection

• **xyDirection**? : *EXyDirection*

*Inherited from [IChartModifierBaseOptions](ichartmodifierbaseoptions.md).[xyDirection](ichartmodifierbaseoptions.md#optional-xydirection)*

*Defined in [src/Charting/ChartModifiers/ChartModifierBase2D.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/ChartModifiers/ChartModifierBase2D.ts#L12)*

Defines the {@link EXyDirection | Xy Direction} - whether the modifier works in X, Y or XY or neither direction
