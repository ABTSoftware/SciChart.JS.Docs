[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IXyzDataSeriesOptions](ixyzdataseriesoptions.md)

# Interface: IXyzDataSeriesOptions

Options to pass to the [XyzDataSeries](../classes/xyzdataseries.md) constructor

## Hierarchy

* [IBaseDataSeriesOptions](ibasedataseriesoptions.md)

  ↳ **IXyzDataSeriesOptions**

## Index

### Properties

* [dataIsSortedInX](ixyzdataseriesoptions.md#optional-dataissortedinx)
* [dataSeriesName](ixyzdataseriesoptions.md#optional-dataseriesname)
* [xValues](ixyzdataseriesoptions.md#optional-xvalues)
* [yValues](ixyzdataseriesoptions.md#optional-yvalues)
* [zValues](ixyzdataseriesoptions.md#optional-zvalues)

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

*Defined in [src/Charting/Model/XyzDataSeries.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/XyzDataSeries.ts#L15)*

The X-values array to pre-populate the [XyzDataSeries](../classes/xyzdataseries.md)

___

### `Optional` yValues

• **yValues**? : *number[]*

*Defined in [src/Charting/Model/XyzDataSeries.ts:19](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/XyzDataSeries.ts#L19)*

The Y-values array to pre-populate the [XyzDataSeries](../classes/xyzdataseries.md)

___

### `Optional` zValues

• **zValues**? : *number[]*

*Defined in [src/Charting/Model/XyzDataSeries.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Model/XyzDataSeries.ts#L23)*

The Z-values array to pre-populate the [XyzDataSeries](../classes/xyzdataseries.md)
