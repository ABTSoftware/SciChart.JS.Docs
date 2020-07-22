[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ScatterSeriesHitTestProvider](scatterserieshittestprovider.md)

# Class: ScatterSeriesHitTestProvider

## Hierarchy

* [BaseHitTestProvider](basehittestprovider.md)‹[XyScatterRenderableSeries](xyscatterrenderableseries.md)›

  ↳ **ScatterSeriesHitTestProvider**

## Implements

* [IHitTestProvider](../interfaces/ihittestprovider.md)

## Index

### Constructors

* [constructor](scatterserieshittestprovider.md#constructor)

### Properties

* [parentSeries](scatterserieshittestprovider.md#readonly-parentseries)
* [DEFAULT_HIT_TEST_RADIUS](scatterserieshittestprovider.md#static-readonly-default_hit_test_radius)

### Methods

* [getNearestHorizontalPoint](scatterserieshittestprovider.md#getnearesthorizontalpoint)
* [getNearestPoint2D](scatterserieshittestprovider.md#getnearestpoint2d)
* [hitTest](scatterserieshittestprovider.md#hittest)
* [update](scatterserieshittestprovider.md#update)

## Constructors

###  constructor

\+ **new ScatterSeriesHitTestProvider**(`parentSeries`: [XyScatterRenderableSeries](xyscatterrenderableseries.md)): *[ScatterSeriesHitTestProvider](scatterserieshittestprovider.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[constructor](basehittestprovider.md#constructor)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`parentSeries` | [XyScatterRenderableSeries](xyscatterrenderableseries.md) |

**Returns:** *[ScatterSeriesHitTestProvider](scatterserieshittestprovider.md)*

## Properties

### `Readonly` parentSeries

• **parentSeries**: *[XyScatterRenderableSeries](xyscatterrenderableseries.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[parentSeries](basehittestprovider.md#readonly-parentseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L14)*

___

### `Static` `Readonly` DEFAULT_HIT_TEST_RADIUS

▪ **DEFAULT_HIT_TEST_RADIUS**: *number* = 7.07

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[DEFAULT_HIT_TEST_RADIUS](basehittestprovider.md#static-readonly-default_hit_test_radius)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L13)*

## Methods

###  getNearestHorizontalPoint

▸ **getNearestHorizontalPoint**(`xHitCoord`: number): *number*

*Implementation of [IHitTestProvider](../interfaces/ihittestprovider.md)*

*Inherited from [BaseHitTestProvider](basehittestprovider.md).[getNearestHorizontalPoint](basehittestprovider.md#getnearesthorizontalpoint)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L75)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L53)*

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

*Overrides [BaseHitTestProvider](basehittestprovider.md).[hitTest](basehittestprovider.md#hittest)*

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/ScatterSeriesHitTestProvider.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/ScatterSeriesHitTestProvider.ts#L8)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HitTest/BaseHitTestProvider.ts#L26)*

**`description`** updates the current HitTestProvider with the latest renderPassData

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`renderPassData` | [RenderPassData](renderpassdata.md) | the latest renderPassData from the parent series last draw operation  |

**Returns:** *void*
