[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseHeatmapDataSeries](baseheatmapdataseries.md)

# Class: BaseHeatmapDataSeries

The base class for Heatmap-style DataSeries in SciChart's
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
A DataSeries stores the data to render. This is independent from the [RenderableSeries](../interfaces/irenderableseries.md)
which defines how that data should be rendered.

See derived types of [BaseHeatmapDataSeries](baseheatmapdataseries.md) to find out what Heatmap data-series are available.
See [UniformHeatmapRenderableSeries](uniformheatmaprenderableseries.md) to see the class for rendering a 2D JavaScript Heatmap Chart.

## Hierarchy

* **BaseHeatmapDataSeries**

  ↳ [UniformHeatmapDataSeries](uniformheatmapdataseries.md)

## Implements

* [IHeatmapSeries](../interfaces/iheatmapseries.md)

## Index

### Properties

* [arrayHeight](baseheatmapdataseries.md#arrayheight)
* [arrayWidth](baseheatmapdataseries.md#arraywidth)
* [dataChanged](baseheatmapdataseries.md#readonly-datachanged)
* [minXSpacing](baseheatmapdataseries.md#minxspacing)
* [type](baseheatmapdataseries.md#abstract-type)

### Accessors

* [dataSeriesName](baseheatmapdataseries.md#dataseriesname)
* [hasDataChanges](baseheatmapdataseries.md#hasdatachanges)
* [hasValues](baseheatmapdataseries.md#hasvalues)
* [isSorted](baseheatmapdataseries.md#issorted)
* [xMax](baseheatmapdataseries.md#xmax)
* [xMin](baseheatmapdataseries.md#xmin)
* [xRange](baseheatmapdataseries.md#xrange)
* [yMax](baseheatmapdataseries.md#ymax)
* [yMin](baseheatmapdataseries.md#ymin)
* [yRange](baseheatmapdataseries.md#yrange)

### Methods

* [count](baseheatmapdataseries.md#count)
* [delete](baseheatmapdataseries.md#delete)
* [getIsDeleted](baseheatmapdataseries.md#getisdeleted)
* [getNativeIndexes](baseheatmapdataseries.md#getnativeindexes)
* [getNativeXValues](baseheatmapdataseries.md#getnativexvalues)
* [getNativeYValues](baseheatmapdataseries.md#getnativeyvalues)
* [getNormalizedVector](baseheatmapdataseries.md#getnormalizedvector)
* [getWindowedYRange](baseheatmapdataseries.md#getwindowedyrange)
* [getZValue](baseheatmapdataseries.md#getzvalue)
* [getZValues](baseheatmapdataseries.md#getzvalues)
* [notifyDataChanged](baseheatmapdataseries.md#notifydatachanged)
* [recreateNormalizedVector](baseheatmapdataseries.md#recreatenormalizedvector)
* [setZValue](baseheatmapdataseries.md#setzvalue)
* [setZValues](baseheatmapdataseries.md#setzvalues)

## Properties

###  arrayHeight

• **arrayHeight**: *number* = 0

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L44)*

Gets the height of the 2-dimensional array of [Z-Values](baseheatmapdataseries.md#getzvalues) where array is ranked [width][height]

___

###  arrayWidth

• **arrayWidth**: *number* = 0

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L40)*

Gets the width of the 2-dimensional array of [Z-Values](baseheatmapdataseries.md#getzvalues) where array is ranked [width][height]

___

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›* = new EventHandler<void>()

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md).[dataChanged](../interfaces/iheatmapseries.md#datachanged)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L35)*

An {@link EventHandler} which is raised when the data changes.

**`remarks`** 
To subscribe to dataChanged, use the following code:

```ts
const dataSeries = new XyDataSeries(wasmContext);
const callback = () => {
   // Data has changed
};
dataSeries.dataChanged.subscribe(callback);
```

To unsubscribe from dataChanged, use the following code:

```ts
const dataSeries = new XyDataSeries(wasmContext);
dataSeries.dataChanged.unsubscribe(callback);
```

___

###  minXSpacing

• **minXSpacing**: *number* = 0

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md).[minXSpacing](../interfaces/iheatmapseries.md#minxspacing)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L36)*

___

### `Abstract` type

• **type**: *[EDataSeriesType](../enums/edataseriestype.md)*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md).[type](../interfaces/iheatmapseries.md#readonly-type)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L31)*

Gets the [EDataSeriesType](../enums/edataseriestype.md) type of the DataSeries

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:198](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L198)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:204](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L204)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`dataSeriesName` | string |

**Returns:** *void*

___

###  hasDataChanges

• **get hasDataChanges**(): *boolean*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L97)*

Returns true if the Heatmap DataSeries has data changes.
This flag is set to true when notifyDataChanged is called, and reset to false after

**Returns:** *boolean*

___

###  hasValues

• **get hasValues**(): *boolean*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:211](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L211)*

Gets whether this Heatmap has values to display

**Returns:** *boolean*

___

###  isSorted

• **get isSorted**(): *boolean*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L84)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](../interfaces/idataseries.md#issorted) for further information

**`inheritdoc`** 

**Returns:** *boolean*

• **set isSorted**(`value`: boolean): *void*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L90)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](../interfaces/idataseries.md#issorted) for further information

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  xMax

• **get xMax**(): *number*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:180](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L180)*

Gets the maximum X-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  xMin

• **get xMin**(): *number*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L174)*

Gets the minimum X-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  xRange

• **get xRange**(): *NumberRange*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:186](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L186)*

Gets the XRange for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *NumberRange*

___

###  yMax

• **get yMax**(): *number*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:168](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L168)*

Gets the maximum Y-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  yMin

• **get yMin**(): *number*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:162](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L162)*

Gets the minimum Y-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  yRange

• **get yRange**(): *NumberRange*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:192](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L192)*

Gets the YRange for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *NumberRange*

## Methods

###  count

▸ **count**(): *number*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L217)*

Gets the number of heatmap cells

**Returns:** *number*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:223](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L223)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  getIsDeleted

▸ **getIsDeleted**(): *boolean*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:230](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L230)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getNativeIndexes

▸ **getNativeIndexes**(): *DoubleVector*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:236](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L236)*

Gets a native / WebAssembly Vector of Indexes in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:242](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L242)*

Gets a native / WebAssembly vector of X-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:248](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L248)*

Gets a native / WebAssembly vector of Y-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNormalizedVector

▸ **getNormalizedVector**(`colorMap`: [HeatmapColorMap](heatmapcolormap.md)): *FloatVector*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:270](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L270)*

Returns a FloatVector with normalized values based on the color map passed in

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`colorMap` | [HeatmapColorMap](heatmapcolormap.md) | the [HeatmapColorMap](heatmapcolormap.md) provides properties used to map heatmap Z-values into colors for rendering in SciChart's [Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features)  |

**Returns:** *FloatVector*

___

###  getWindowedYRange

▸ **getWindowedYRange**(`xRange`: NumberRange, `getPositiveRange`: boolean, `isCategoryAxis`: boolean): *NumberRange*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:254](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L254)*

Gets the Y-range of the data within the specified X-Range: a 'windowed'
Y-range used for zooming into series on the [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xRange` | NumberRange | The [XAxis.visibleRange](axiscore.md#visiblerange) |
`getPositiveRange` | boolean | When true, return the positive part of the Y-range only |
`isCategoryAxis` | boolean | When true, treat the XAxis as a [CategoryAxis](categoryaxis.md) - an axis type which measures by x-index not x-value  |

**Returns:** *NumberRange*

___

###  getZValue

▸ **getZValue**(`yIndex`: number, `xIndex`: number): *number*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:146](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L146)*

Gets the ZValue at the specific Y,X index where Y must be within 0-arrayHeight and X must be within 0-arrayWidth

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`yIndex` | number | the y-index from 0 to arrayHeight |
`xIndex` | number | the x-index from 0 to arrayWidth  |

**Returns:** *number*

___

###  getZValues

▸ **getZValues**(): *number[][]*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:105](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L105)*

Gets a readonly collection of Z-values which can be read in the format zValues[y][x]
Note that changes or manipulation of the 2D array will not update the Heatmap. Set it back via setZValues()
to see changes to the chart

**Returns:** *number[][]*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:261](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L261)*

Notify subscribers to dataChanged that data has changed. Also sets internal flags.
This will trigger a redraw on a parent SciChartSurface

**Returns:** *void*

___

###  recreateNormalizedVector

▸ **recreateNormalizedVector**(`zMin`: number, `zMax`: number): *void*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:295](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L295)*

Recreates the normalized vector (internally used for drawing heatmap) according to zMin and zMax values

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`zMin` | number | - |
`zMax` | number |   |

**Returns:** *void*

___

###  setZValue

▸ **setZValue**(`yIndex`: number, `xIndex`: number, `zValue`: number): *void*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L155)*

Sets the ZValue at the specific Y,X index where Y must be within 0-arrayHeight and X must be within 0-arrayWidth

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`yIndex` | number | the y-index from 0 to arrayHeight |
`xIndex` | number | the x-index from 0 to arrayWidth |
`zValue` | number | the new Z-value  |

**Returns:** *void*

___

###  setZValues

▸ **setZValues**(`zValues`: number[][]): *void*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L112)*

Sets a 2D array of zValues. Input is in the format zValues[y][x] where Y is 0 to height and X is 0 to Width

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`zValues` | number[][] |   |

**Returns:** *void*
