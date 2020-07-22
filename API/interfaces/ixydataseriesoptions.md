[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IXyDataSeriesOptions](ixydataseriesoptions.md)

# Interface: IXyDataSeriesOptions

Options to pass to the [XyDataSeries](../classes/xydataseries.md) constructor

## Hierarchy

* [IBaseDataSeriesOptions](ibasedataseriesoptions.md)

  ↳ **IXyDataSeriesOptions**

## Index

### Properties

* [dataIsSortedInX](ixydataseriesoptions.md#optional-dataissortedinx)
* [dataSeriesName](ixydataseriesoptions.md#optional-dataseriesname)
* [xValues](ixydataseriesoptions.md#optional-xvalues)
* [yValues](ixydataseriesoptions.md#optional-yvalues)

## Properties

### `Optional` dataIsSortedInX

• **dataIsSortedInX**? : *boolean*

*Inherited from [IBaseDataSeriesOptions](ibasedataseriesoptions.md).[dataIsSortedInX](ibasedataseriesoptions.md#optional-dataissortedinx)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L24)*

When true, the Data is sorted in X.

**`remarks`** The user must specify this parameter if the data is not sorted in X
in order to have correct rendering. This parameter is used to choose the correct
algorithms for zooming, panning and ranging and ensure best performance.

___

### `Optional` dataSeriesName

• **dataSeriesName**? : *string*

*Inherited from [IBaseDataSeriesOptions](ibasedataseriesoptions.md).[dataSeriesName](ibasedataseriesoptions.md#optional-dataseriesname)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L17)*

The DataSeries name, used in legends, tooltips to identify the chart series

___

### `Optional` xValues

• **xValues**? : *number[]*

*Defined in [src/Charting/Model/XyDataSeries.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L14)*

The X-values array to pre-populate the [XyDataSeries](../classes/xydataseries.md)

___

### `Optional` yValues

• **yValues**? : *number[]*

*Defined in [src/Charting/Model/XyDataSeries.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Model/XyDataSeries.ts#L18)*

The Y-values array to pre-populate the [XyDataSeries](../classes/xydataseries.md)
