[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IXyyDataSeriesOptions](ixyydataseriesoptions.md)

# Interface: IXyyDataSeriesOptions

Options to pass to the [XyDataSeries](../classes/xydataseries.md) constructor

## Hierarchy

* [IBaseDataSeriesOptions](ibasedataseriesoptions.md)

  ↳ **IXyyDataSeriesOptions**

## Index

### Properties

* [dataIsSortedInX](ixyydataseriesoptions.md#optional-dataissortedinx)
* [dataSeriesName](ixyydataseriesoptions.md#optional-dataseriesname)
* [xValues](ixyydataseriesoptions.md#optional-xvalues)
* [y1Values](ixyydataseriesoptions.md#optional-y1values)
* [yValues](ixyydataseriesoptions.md#optional-yvalues)

## Properties

### `Optional` dataIsSortedInX

• **dataIsSortedInX**? : *boolean*

*Inherited from [IBaseDataSeriesOptions](ibasedataseriesoptions.md).[dataIsSortedInX](ibasedataseriesoptions.md#optional-dataissortedinx)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L24)*

When true, the Data is sorted in X.

**`remarks`** The user must specify this parameter if the data is not sorted in X
in order to have correct rendering. This parameter is used to choose the correct
algorithms for zooming, panning and ranging and ensure best performance.

___

### `Optional` dataSeriesName

• **dataSeriesName**? : *string*

*Inherited from [IBaseDataSeriesOptions](ibasedataseriesoptions.md).[dataSeriesName](ibasedataseriesoptions.md#optional-dataseriesname)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L17)*

The DataSeries name, used in legends, tooltips to identify the chart series

___

### `Optional` xValues

• **xValues**? : *number[]*

*Defined in [src/Charting/Model/XyyDataSeries.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L16)*

The X-values array to pre-populate the [XyyDataSeries](../classes/xyydataseries.md)

___

### `Optional` y1Values

• **y1Values**? : *number[]*

*Defined in [src/Charting/Model/XyyDataSeries.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L24)*

The Y2-values array to pre-populate the [XyyDataSeries](../classes/xyydataseries.md)

___

### `Optional` yValues

• **yValues**? : *number[]*

*Defined in [src/Charting/Model/XyyDataSeries.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/XyyDataSeries.ts#L20)*

The Y1-values array to pre-populate the [XyyDataSeries](../classes/xyydataseries.md)
