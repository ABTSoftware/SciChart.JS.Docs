[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IOhlcDataSeriesOptions](iohlcdataseriesoptions.md)

# Interface: IOhlcDataSeriesOptions

Options to pass to the [OhlcDataSeries](../classes/ohlcdataseries.md) constructor

## Hierarchy

* [IBaseDataSeriesOptions](ibasedataseriesoptions.md)

  ↳ **IOhlcDataSeriesOptions**

## Index

### Properties

* [closeValues](iohlcdataseriesoptions.md#closevalues)
* [dataIsSortedInX](iohlcdataseriesoptions.md#optional-dataissortedinx)
* [dataSeriesName](iohlcdataseriesoptions.md#optional-dataseriesname)
* [highValues](iohlcdataseriesoptions.md#highvalues)
* [lowValues](iohlcdataseriesoptions.md#lowvalues)
* [openValues](iohlcdataseriesoptions.md#openvalues)
* [xValues](iohlcdataseriesoptions.md#xvalues)

## Properties

###  closeValues

• **closeValues**: *number[]*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L32)*

The Close-values array to pre-populate the [OhlcDataSeries](../classes/ohlcdataseries.md)

___

### `Optional` dataIsSortedInX

• **dataIsSortedInX**? : *boolean*

*Inherited from [IBaseDataSeriesOptions](ibasedataseriesoptions.md).[dataIsSortedInX](ibasedataseriesoptions.md#optional-dataissortedinx)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L24)*

When true, the Data is sorted in X.

**`remarks`** The user must specify this parameter if the data is not sorted in X
in order to have correct rendering. This parameter is used to choose the correct
algorithms for zooming, panning and ranging and ensure best performance.

___

### `Optional` dataSeriesName

• **dataSeriesName**? : *string*

*Inherited from [IBaseDataSeriesOptions](ibasedataseriesoptions.md).[dataSeriesName](ibasedataseriesoptions.md#optional-dataseriesname)*

*Defined in [src/Charting/Model/BaseDataSeries.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/BaseDataSeries.ts#L17)*

The DataSeries name, used in legends, tooltips to identify the chart series

___

###  highValues

• **highValues**: *number[]*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L24)*

The High-values array to pre-populate the [OhlcDataSeries](../classes/ohlcdataseries.md)

___

###  lowValues

• **lowValues**: *number[]*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L28)*

The Low-values array to pre-populate the [OhlcDataSeries](../classes/ohlcdataseries.md)

___

###  openValues

• **openValues**: *number[]*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L20)*

The Open-values array to pre-populate the [OhlcDataSeries](../classes/ohlcdataseries.md)

___

###  xValues

• **xValues**: *number[]*

*Defined in [src/Charting/Model/OhlcDataSeries.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Model/OhlcDataSeries.ts#L16)*

The X-values array to pre-populate the [OhlcDataSeries](../classes/ohlcdataseries.md)
