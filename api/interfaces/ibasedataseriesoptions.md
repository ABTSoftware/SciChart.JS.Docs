[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IBaseDataSeriesOptions](ibasedataseriesoptions.md)

# Interface: IBaseDataSeriesOptions

Options to pass to the [BaseDataSeries](../classes/basedataseries.md) constructor

## Hierarchy

* **IBaseDataSeriesOptions**

  ↳ [IXyDataSeriesOptions](ixydataseriesoptions.md)

  ↳ [IOhlcDataSeriesOptions](iohlcdataseriesoptions.md)

  ↳ [IXyyDataSeriesOptions](ixyydataseriesoptions.md)

  ↳ [IXyzDataSeriesOptions](ixyzdataseriesoptions.md)

## Index

### Properties

* [dataIsSortedInX](ibasedataseriesoptions.md#optional-dataissortedinx)
* [dataSeriesName](ibasedataseriesoptions.md#optional-dataseriesname)

## Properties

### `Optional` dataIsSortedInX

• **dataIsSortedInX**? : *boolean*

*Defined in [src/Charting/Model/BaseDataSeries.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L24)*

When true, the Data is sorted in X.

**`remarks`** The user must specify this parameter if the data is not sorted in X
in order to have correct rendering. This parameter is used to choose the correct
algorithms for zooming, panning and ranging and ensure best performance.

___

### `Optional` dataSeriesName

• **dataSeriesName**? : *string*

*Defined in [src/Charting/Model/BaseDataSeries.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L17)*

The DataSeries name, used in legends, tooltips to identify the chart series
