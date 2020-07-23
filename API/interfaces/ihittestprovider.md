[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IHitTestProvider](ihittestprovider.md)

# Interface: IHitTestProvider

## Hierarchy

* **IHitTestProvider**

## Implemented by

* [BandSeriesHitTestProvider](../classes/bandserieshittestprovider.md)
* [BaseHitTestProvider](../classes/basehittestprovider.md)
* [BubbleSeriesHitTestProvider](../classes/bubbleserieshittestprovider.md)
* [ColumnSeriesHitTestProvider](../classes/columnserieshittestprovider.md)
* [LineSeriesHitTestProvider](../classes/lineserieshittestprovider.md)
* [MountainSeriesHitTestProvider](../classes/mountainserieshittestprovider.md)
* [OhlcSeriesHitTestProvider](../classes/ohlcserieshittestprovider.md)
* [ScatterSeriesHitTestProvider](../classes/scatterserieshittestprovider.md)
* [StackedColumnSeriesHitTestProvider](../classes/stackedcolumnserieshittestprovider.md)
* [StackedMountainSeriesHitTestProvider](../classes/stackedmountainserieshittestprovider.md)

## Index

### Methods

* [getNearestHorizontalPoint](ihittestprovider.md#getnearesthorizontalpoint)
* [getNearestPoint2D](ihittestprovider.md#getnearestpoint2d)
* [hitTest](ihittestprovider.md#hittest)
* [update](ihittestprovider.md#update)

## Methods

###  getNearestHorizontalPoint

▸ **getNearestHorizontalPoint**(`xHitCoord`: number): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts#L44)*

**`description`** Performs search of nearest point in x direction only.
X and Y coordinates provided for Vertical Chart

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xHitCoord` | number | The x coordinate of hit test in pixels |

**Returns:** *number*

The nearest point index

___

###  getNearestPoint2D

▸ **getNearestPoint2D**(`xHitCoord`: number, `yHitCoord`: number): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts#L35)*

**`description`** Performs search of the nearest point in 2D

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xHitCoord` | number | The x coordinate of hit test in pixels |
`yHitCoord` | number | The y coordinate of hit test in pixel |

**Returns:** *number*

The nearest point index

___

###  hitTest

▸ **hitTest**(`point`: Point, `logic`: [ENearestPointLogic](../enums/enearestpointlogic.md), `hitTestRadius`: number, `interpolate`: boolean): *[HitTestInfo](../classes/hittestinfo.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts#L26)*

**`description`** Performs a hit-test at the specific mouse point (X,Y coordinate on the parent SciChartSurface),
returning a HitTestInfo type with the results

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`point` | Point | The mouse point on the parent SciChartSurface |
`logic` | [ENearestPointLogic](../enums/enearestpointlogic.md) | Logic to find nearest point |
`hitTestRadius` | number | The radius in pixels to determine whether a mouse is over a data-point |
`interpolate` | boolean | If true, use interpolation to perform a hit-test between data-points, or on the area if a FastMountainRenderableSeries, FastColumnRenderableSeries or FastCandlestickRenderableSeries  |

**Returns:** *[HitTestInfo](../classes/hittestinfo.md)*

___

###  update

▸ **update**(`renderPassData`: [RenderPassData](../classes/renderpassdata.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider.ts#L15)*

**`description`** updates the current HitTestProvider with the latest renderPassData

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`renderPassData` | [RenderPassData](../classes/renderpassdata.md) | the latest renderPassData from the parent series last draw operation  |

**Returns:** *void*
