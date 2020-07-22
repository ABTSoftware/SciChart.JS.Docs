[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [LineSeriesHitTestProvider](lineserieshittestprovider.md)

# Class: LineSeriesHitTestProvider

## Hierarchy

* [BaseHitTestProvider](basehittestprovider.md)‹[FastLineRenderableSeries](fastlinerenderableseries.md)›

  ↳ **LineSeriesHitTestProvider**

## Implements

* [IHitTestProvider](../interfaces/ihittestprovider.md)

## Index

### Constructors

* [constructor](lineserieshittestprovider.md#constructor)

### Properties

* [parentSeries](lineserieshittestprovider.md#readonly-parentseries)
* [DEFAULT_HIT_TEST_RADIUS](lineserieshittestprovider.md#static-readonly-default_hit_test_radius)

### Methods

* [getNearestHorizontalPoint](lineserieshittestprovider.md#getnearesthorizontalpoint)
* [getNearestPoint2D](lineserieshittestprovider.md#getnearestpoint2d)
* [hitTest](lineserieshittestprovider.md#hittest)
* [update](lineserieshittestprovider.md#update)

## Constructors

###  constructor

\+ **new LineSeriesHitTestProvider**(`parentSeries`: [FastLineRenderableSeries](fastlinerenderableseries.md)): *[LineSeriesHitTestProvider](lineserieshittestprovider.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[constructor](basehittestprovider.md#constructor)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`parentSeries` | [FastLineRenderableSeries](fastlinerenderableseries.md) |

**Returns:** *[LineSeriesHitTestProvider](lineserieshittestprovider.md)*

## Properties

### `Readonly` parentSeries

• **parentSeries**: *[FastLineRenderableSeries](fastlinerenderableseries.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[parentSeries](basehittestprovider.md#readonly-parentseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L14)*

___

### `Static` `Readonly` DEFAULT_HIT_TEST_RADIUS

▪ **DEFAULT_HIT_TEST_RADIUS**: *number* = 7.07

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[DEFAULT_HIT_TEST_RADIUS](basehittestprovider.md#static-readonly-default_hit_test_radius)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L13)*

## Methods

###  getNearestHorizontalPoint

▸ **getNearestHorizontalPoint**(`xHitCoord`: number): *number*

*Implementation of [IHitTestProvider](../interfaces/ihittestprovider.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[getNearestHorizontalPoint](basehittestprovider.md#getnearesthorizontalpoint)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`xHitCoord` | number |

**Returns:** *number*

___

###  getNearestPoint2D

▸ **getNearestPoint2D**(`xHitCoord`: number, `yHitCoord`: number): *number*

*Implementation of [IHitTestProvider](../interfaces/ihittestprovider.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[getNearestPoint2D](basehittestprovider.md#getnearestpoint2d)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`xHitCoord` | number |
`yHitCoord` | number |

**Returns:** *number*

___

###  hitTest

▸ **hitTest**(`point`: Point, `logic`: [ENearestPointLogic](../enums/enearestpointlogic.md), `hitTestRadius`: number, `interpolate`: boolean): *[HitTestInfo](hittestinfo.md)*

*Implementation of [IHitTestProvider](../interfaces/ihittestprovider.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[hitTest](basehittestprovider.md#hittest)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | Point |
`logic` | [ENearestPointLogic](../enums/enearestpointlogic.md) |
`hitTestRadius` | number |
`interpolate` | boolean |

**Returns:** *[HitTestInfo](hittestinfo.md)*

___

###  update

▸ **update**(`renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [IHitTestProvider](../interfaces/ihittestprovider.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[update](basehittestprovider.md#update)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L26)*

**`description`** updates the current HitTestProvider with the latest renderPassData

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`renderPassData` | [RenderPassData](renderpassdata.md) | the latest renderPassData from the parent series last draw operation  |

**Returns:** *void*
