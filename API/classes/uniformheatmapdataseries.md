[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [UniformHeatmapDataSeries](uniformheatmapdataseries.md)

# Class: UniformHeatmapDataSeries

## Hierarchy

* [BaseHeatmapDataSeries](baseheatmapdataseries.md)

  ↳ **UniformHeatmapDataSeries**

## Implements

* [IHeatmapSeries](../interfaces/iheatmapseries.md)

## Index

### Constructors

* [constructor](uniformheatmapdataseries.md#constructor)

### Properties

* [arrayHeight](uniformheatmapdataseries.md#arrayheight)
* [arrayWidth](uniformheatmapdataseries.md#arraywidth)
* [dataChanged](uniformheatmapdataseries.md#readonly-datachanged)
* [minXSpacing](uniformheatmapdataseries.md#minxspacing)
* [type](uniformheatmapdataseries.md#readonly-type)
* [xStart](uniformheatmapdataseries.md#readonly-xstart)
* [xStep](uniformheatmapdataseries.md#readonly-xstep)
* [yStart](uniformheatmapdataseries.md#readonly-ystart)
* [yStep](uniformheatmapdataseries.md#readonly-ystep)

### Accessors

* [dataSeriesName](uniformheatmapdataseries.md#dataseriesname)
* [hasDataChanges](uniformheatmapdataseries.md#hasdatachanges)
* [hasValues](uniformheatmapdataseries.md#hasvalues)
* [isSorted](uniformheatmapdataseries.md#issorted)
* [xMax](uniformheatmapdataseries.md#xmax)
* [xMin](uniformheatmapdataseries.md#xmin)
* [xRange](uniformheatmapdataseries.md#xrange)
* [yMax](uniformheatmapdataseries.md#ymax)
* [yMin](uniformheatmapdataseries.md#ymin)
* [yRange](uniformheatmapdataseries.md#yrange)

### Methods

* [count](uniformheatmapdataseries.md#count)
* [delete](uniformheatmapdataseries.md#delete)
* [getIsDeleted](uniformheatmapdataseries.md#getisdeleted)
* [getNativeIndexes](uniformheatmapdataseries.md#getnativeindexes)
* [getNativeXValues](uniformheatmapdataseries.md#getnativexvalues)
* [getNativeYValues](uniformheatmapdataseries.md#getnativeyvalues)
* [getNormalizedVector](uniformheatmapdataseries.md#getnormalizedvector)
* [getWindowedYRange](uniformheatmapdataseries.md#getwindowedyrange)
* [getXValue](uniformheatmapdataseries.md#getxvalue)
* [getYValue](uniformheatmapdataseries.md#getyvalue)
* [getZValue](uniformheatmapdataseries.md#getzvalue)
* [getZValues](uniformheatmapdataseries.md#getzvalues)
* [notifyDataChanged](uniformheatmapdataseries.md#notifydatachanged)
* [recreateNormalizedVector](uniformheatmapdataseries.md#recreatenormalizedvector)
* [setZValue](uniformheatmapdataseries.md#setzvalue)
* [setZValues](uniformheatmapdataseries.md#setzvalues)

## Constructors

###  constructor

\+ **new UniformHeatmapDataSeries**(`webAssemblyContext`: TSciChart, `xStart`: number, `xStep`: number, `yStart`: number, `yStep`: number, `zValues?`: number[][]): *[UniformHeatmapDataSeries](uniformheatmapdataseries.md)*

*Overrides void*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L29)*

Creates an instance of [UniformHeatmapDataSeries](uniformheatmapdataseries.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`webAssemblyContext` | TSciChart | the {@link TSciChart | SciChart WebAssembly Context} containing native methods and access to our underlying WebGL2 rendering engine |
`xStart` | number | defines the Start point on the [XAxis](axisbase2d.md) where this heatmap will be drawn |
`xStep` | number | defines Step on the [XAxis](axisbase2d.md) for each cell in the heatmap |
`yStart` | number | defines the Start point on the [YAxis](axisbase2d.md) where this heatmap will be drawn |
`yStep` | number | defines Step on the [YAxis](axisbase2d.md) for each cell in the heatmap |
`zValues?` | number[][] | the 2-Dimensional array of cells which can be passed to populate the [BaseHeatmapDataSeries](baseheatmapdataseries.md) at construct time. The numeric values in these cells will be used to render the heatmap according to the [Color Map](uniformheatmaprenderableseries.md#colormap) provided  |

**Returns:** *[UniformHeatmapDataSeries](uniformheatmapdataseries.md)*

## Properties

###  arrayHeight

• **arrayHeight**: *number* = 0

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[arrayHeight](baseheatmapdataseries.md#arrayheight)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L44)*

Gets the height of the 2-dimensional array of [Z-Values](uniformheatmapdataseries.md#getzvalues) where array is ranked [width][height]

___

###  arrayWidth

• **arrayWidth**: *number* = 0

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[arrayWidth](baseheatmapdataseries.md#arraywidth)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L40)*

Gets the width of the 2-dimensional array of [Z-Values](uniformheatmapdataseries.md#getzvalues) where array is ranked [width][height]

___

### `Readonly` dataChanged

• **dataChanged**: *EventHandler‹void›* = new EventHandler<void>()

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md).[dataChanged](../interfaces/iheatmapseries.md#datachanged)*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[dataChanged](baseheatmapdataseries.md#readonly-datachanged)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L35)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[minXSpacing](baseheatmapdataseries.md#minxspacing)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L36)*

___

### `Readonly` type

• **type**: *[EDataSeriesType](../enums/edataseriestype.md)* = EDataSeriesType.HeatmapUniform

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md).[type](../interfaces/iheatmapseries.md#readonly-type)*

*Overrides [BaseHeatmapDataSeries](baseheatmapdataseries.md).[type](baseheatmapdataseries.md#abstract-type)*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L10)*

Gets the [EDataSeriesType](../enums/edataseriestype.md) type of the DataSeries

___

### `Readonly` xStart

• **xStart**: *number*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L14)*

xStart defines the Start point on the [XAxis](axisbase2d.md) where this heatmap will be drawn

___

### `Readonly` xStep

• **xStep**: *number*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L18)*

xStep defines Step on the [XAxis](axisbase2d.md) for each cell in the heatmap

___

### `Readonly` yStart

• **yStart**: *number*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L22)*

yStart defines the Start point on the [YAxis](axisbase2d.md) where this heatmap will be drawn

___

### `Readonly` yStep

• **yStep**: *number*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L26)*

yStep defines Step on the [YAxis](axisbase2d.md) for each cell in the heatmap

## Accessors

###  dataSeriesName

• **get dataSeriesName**(): *string*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[dataSeriesName](baseheatmapdataseries.md#dataseriesname)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:198](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L198)*

Gets the DataSeries name. This is used in legend controls and tooltips to identify the series

**`inheritdoc`** 

**Returns:** *string*

• **set dataSeriesName**(`dataSeriesName`: string): *void*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[dataSeriesName](baseheatmapdataseries.md#dataseriesname)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:204](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L204)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[hasDataChanges](baseheatmapdataseries.md#hasdatachanges)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L97)*

Returns true if the Heatmap DataSeries has data changes.
This flag is set to true when notifyDataChanged is called, and reset to false after

**Returns:** *boolean*

___

###  hasValues

• **get hasValues**(): *boolean*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[hasValues](baseheatmapdataseries.md#hasvalues)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:211](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L211)*

Gets whether this Heatmap has values to display

**Returns:** *boolean*

___

###  isSorted

• **get isSorted**(): *boolean*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[isSorted](baseheatmapdataseries.md#issorted)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L84)*

Gets or sets whether the X-values are sorted or not.
See remarks at [IDataSeries.isSorted](../interfaces/idataseries.md#issorted) for further information

**`inheritdoc`** 

**Returns:** *boolean*

• **set isSorted**(`value`: boolean): *void*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[isSorted](baseheatmapdataseries.md#issorted)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L90)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[xMax](baseheatmapdataseries.md#xmax)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:180](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L180)*

Gets the maximum X-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  xMin

• **get xMin**(): *number*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[xMin](baseheatmapdataseries.md#xmin)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L174)*

Gets the minimum X-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  xRange

• **get xRange**(): *NumberRange*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[xRange](baseheatmapdataseries.md#xrange)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:186](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L186)*

Gets the XRange for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *NumberRange*

___

###  yMax

• **get yMax**(): *number*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[yMax](baseheatmapdataseries.md#ymax)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:168](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L168)*

Gets the maximum Y-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  yMin

• **get yMin**(): *number*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[yMin](baseheatmapdataseries.md#ymin)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:162](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L162)*

Gets the minimum Y-value for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *number*

___

###  yRange

• **get yRange**(): *NumberRange*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[yRange](baseheatmapdataseries.md#yrange)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:192](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L192)*

Gets the YRange for this heatmap, which controls where it is displayed on a cartesian chart

**Returns:** *NumberRange*

## Methods

###  count

▸ **count**(): *number*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[count](baseheatmapdataseries.md#count)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L217)*

Gets the number of heatmap cells

**Returns:** *number*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[delete](baseheatmapdataseries.md#delete)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:223](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L223)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getIsDeleted](baseheatmapdataseries.md#getisdeleted)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:230](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L230)*

Returns true if this DataSeries has been deleted and native memory destroyed

**Returns:** *boolean*

___

###  getNativeIndexes

▸ **getNativeIndexes**(): *DoubleVector*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getNativeIndexes](baseheatmapdataseries.md#getnativeindexes)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:236](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L236)*

Gets a native / WebAssembly Vector of Indexes in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getNativeXValues](baseheatmapdataseries.md#getnativexvalues)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:242](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L242)*

Gets a native / WebAssembly vector of X-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Implementation of [IHeatmapSeries](../interfaces/iheatmapseries.md)*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getNativeYValues](baseheatmapdataseries.md#getnativeyvalues)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:248](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L248)*

Gets a native / WebAssembly vector of Y-values in the DataSeries

**Returns:** *DoubleVector*

___

###  getNormalizedVector

▸ **getNormalizedVector**(`colorMap`: [HeatmapColorMap](heatmapcolormap.md)): *FloatVector*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getNormalizedVector](baseheatmapdataseries.md#getnormalizedvector)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:270](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L270)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getWindowedYRange](baseheatmapdataseries.md#getwindowedyrange)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:254](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L254)*

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

###  getXValue

▸ **getXValue**(`xIndex`: number): *number*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:66](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L66)*

Gets the X-value at the specified index. This will be computed from constructor parameters xStep and xStart

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xIndex` | number |   |

**Returns:** *number*

___

###  getYValue

▸ **getYValue**(`yIndex`: number): *number*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L75)*

Gets the Y-value at the specified index. This will be computed from constructor parameters yStep and yxStart

**Parameters:**

Name | Type |
------ | ------ |
`yIndex` | number |

**Returns:** *number*

___

###  getZValue

▸ **getZValue**(`yIndex`: number, `xIndex`: number): *number*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getZValue](baseheatmapdataseries.md#getzvalue)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:146](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L146)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[getZValues](baseheatmapdataseries.md#getzvalues)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:105](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L105)*

Gets a readonly collection of Z-values which can be read in the format zValues[y][x]
Note that changes or manipulation of the 2D array will not update the Heatmap. Set it back via setZValues()
to see changes to the chart

**Returns:** *number[][]*

___

###  notifyDataChanged

▸ **notifyDataChanged**(): *void*

*Overrides [BaseHeatmapDataSeries](baseheatmapdataseries.md).[notifyDataChanged](baseheatmapdataseries.md#notifydatachanged)*

*Defined in [src/Charting/Model/UniformHeatmapDataSeries.ts:83](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/UniformHeatmapDataSeries.ts#L83)*

**`inheritdoc`** 

**Returns:** *void*

___

###  recreateNormalizedVector

▸ **recreateNormalizedVector**(`zMin`: number, `zMax`: number): *void*

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[recreateNormalizedVector](baseheatmapdataseries.md#recreatenormalizedvector)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:295](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L295)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[setZValue](baseheatmapdataseries.md#setzvalue)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L155)*

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

*Inherited from [BaseHeatmapDataSeries](baseheatmapdataseries.md).[setZValues](baseheatmapdataseries.md#setzvalues)*

*Defined in [src/Charting/Model/BaseHeatmapDataSeries.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Model/BaseHeatmapDataSeries.ts#L112)*

Sets a 2D array of zValues. Input is in the format zValues[y][x] where Y is 0 to height and X is 0 to Width

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`zValues` | number[][] |   |

**Returns:** *void*
