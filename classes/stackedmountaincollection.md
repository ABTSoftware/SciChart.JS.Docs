[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [StackedMountainCollection](stackedmountaincollection.md)

# Class: StackedMountainCollection

## Hierarchy

  ↳ [BaseStackedCollection](basestackedcollection.md)‹[StackedMountainRenderableSeries](stackedmountainrenderableseries.md)›

  ↳ **StackedMountainCollection**

## Implements

* [IRenderableSeries](../interfaces/irenderableseries.md)

## Index

### Constructors

* [constructor](stackedmountaincollection.md#constructor)

### Properties

* [collectionChanged](stackedmountaincollection.md#readonly-collectionchanged)
* [id](stackedmountaincollection.md#readonly-id)
* [invalidateParentCallback](stackedmountaincollection.md#invalidateparentcallback)
* [isStacked](stackedmountaincollection.md#readonly-isstacked)
* [parentSurface](stackedmountaincollection.md#parentsurface)
* [type](stackedmountaincollection.md#readonly-type)

### Accessors

* [dataSeries](stackedmountaincollection.md#dataseries)
* [drawNaNAs](stackedmountaincollection.md#drawnanas)
* [drawingProviders](stackedmountaincollection.md#drawingproviders)
* [effect](stackedmountaincollection.md#effect)
* [hitTestProvider](stackedmountaincollection.md#hittestprovider)
* [isOneHundredPercent](stackedmountaincollection.md#isonehundredpercent)
* [isVisible](stackedmountaincollection.md#isvisible)
* [paletteProvider](stackedmountaincollection.md#paletteprovider)
* [pointMarker](stackedmountaincollection.md#pointmarker)
* [rolloverModifierProps](stackedmountaincollection.md#rollovermodifierprops)
* [stroke](stackedmountaincollection.md#stroke)
* [strokeThickness](stackedmountaincollection.md#strokethickness)
* [xAxisId](stackedmountaincollection.md#xaxisid)
* [yAxisId](stackedmountaincollection.md#yaxisid)

### Methods

* [add](stackedmountaincollection.md#add)
* [applyTheme](stackedmountaincollection.md#applytheme)
* [asArray](stackedmountaincollection.md#asarray)
* [clear](stackedmountaincollection.md#clear)
* [contains](stackedmountaincollection.md#contains)
* [delete](stackedmountaincollection.md#delete)
* [draw](stackedmountaincollection.md#draw)
* [get](stackedmountaincollection.md#get)
* [getBaseXValues](stackedmountaincollection.md#getbasexvalues)
* [getDataSeriesName](stackedmountaincollection.md#getdataseriesname)
* [getDataSeriesValuesCount](stackedmountaincollection.md#getdataseriesvaluescount)
* [getNativeXValues](stackedmountaincollection.md#getnativexvalues)
* [getVisibleSeries](stackedmountaincollection.md#getvisibleseries)
* [getXRange](stackedmountaincollection.md#getxrange)
* [getYRange](stackedmountaincollection.md#getyrange)
* [hasDataSeries](stackedmountaincollection.md#hasdataseries)
* [hasDataSeriesValues](stackedmountaincollection.md#hasdataseriesvalues)
* [hasStrokePaletteProvider](stackedmountaincollection.md#hasstrokepaletteprovider)
* [insert](stackedmountaincollection.md#insert)
* [notifyPropertyChanged](stackedmountaincollection.md#notifypropertychanged)
* [onAttach](stackedmountaincollection.md#onattach)
* [onDetach](stackedmountaincollection.md#ondetach)
* [remove](stackedmountaincollection.md#remove)
* [removeAt](stackedmountaincollection.md#removeat)
* [set](stackedmountaincollection.md#set)
* [size](stackedmountaincollection.md#size)
* [updateAccumulatedVectors](stackedmountaincollection.md#updateaccumulatedvectors)

## Constructors

###  constructor

\+ **new StackedMountainCollection**(`webAssemblyContext`: TSciChart): *[StackedMountainCollection](stackedmountaincollection.md)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[constructor](basestackedcollection.md#constructor)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[StackedMountainCollection](stackedmountaincollection.md)*

## Properties

### `Readonly` collectionChanged

• **collectionChanged**: *EventHandler‹ObservableArrayChangedArgs›*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[collectionChanged](basestackedcollection.md#readonly-collectionchanged)*

*Defined in [src/Core/ObservableArray.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L5)*

___

### `Readonly` id

• **id**: *string* = generateGuid()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[id](../interfaces/irenderableseries.md#readonly-id)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[id](basestackedcollection.md#readonly-id)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L25)*

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[invalidateParentCallback](../interfaces/irenderableseries.md#invalidateparentcallback)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[invalidateParentCallback](basestackedcollection.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L28)*

#### Type declaration:

▸ (): *void*

___

### `Readonly` isStacked

• **isStacked**: *true* = true

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[isStacked](../interfaces/irenderableseries.md#readonly-isstacked)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[isStacked](basestackedcollection.md#readonly-isstacked)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L26)*

___

###  parentSurface

• **parentSurface**: *[SciChartSurface](scichartsurface.md)*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[parentSurface](../interfaces/irenderableseries.md#parentsurface)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[parentSurface](basestackedcollection.md#parentsurface)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L27)*

___

### `Readonly` type

• **type**: *VerticallyStackedMountainCollection* = ESeriesType.VerticallyStackedMountainCollection

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[type](../interfaces/irenderableseries.md#readonly-type)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[type](basestackedcollection.md#readonly-abstract-type)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L16)*

## Accessors

###  dataSeries

• **get dataSeries**(): *[IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[dataSeries](basestackedcollection.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L157)*

**Returns:** *[IDataSeries](../interfaces/idataseries.md)*

• **set dataSeries**(`value`: [IDataSeries](../interfaces/idataseries.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[dataSeries](basestackedcollection.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:160](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IDataSeries](../interfaces/idataseries.md) |

**Returns:** *void*

___

###  drawNaNAs

• **get drawNaNAs**(): *[ELineDrawMode](../enums/elinedrawmode.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[drawNaNAs](basestackedcollection.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:164](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L164)*

**Returns:** *[ELineDrawMode](../enums/elinedrawmode.md)*

• **set drawNaNAs**(`value`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[drawNaNAs](basestackedcollection.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:167](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ELineDrawMode](../enums/elinedrawmode.md) |

**Returns:** *void*

___

###  drawingProviders

• **get drawingProviders**(): *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[drawingProviders](basestackedcollection.md#drawingproviders)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:171](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L171)*

**Returns:** *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

• **set drawingProviders**(`value`: [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[drawingProviders](basestackedcollection.md#drawingproviders)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L174)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[] |

**Returns:** *void*

___

###  effect

• **get effect**(): *[ShaderEffect](shadereffect.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[effect](basestackedcollection.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:220](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L220)*

**Returns:** *[ShaderEffect](shadereffect.md)*

• **set effect**(`effect`: [ShaderEffect](shadereffect.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[effect](basestackedcollection.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:223](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L223)*

**Parameters:**

Name | Type |
------ | ------ |
`effect` | [ShaderEffect](shadereffect.md) |

**Returns:** *void*

___

###  hitTestProvider

• **get hitTestProvider**(): *[IHitTestProvider](../interfaces/ihittestprovider.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[hitTestProvider](basestackedcollection.md#hittestprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:178](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L178)*

**Returns:** *[IHitTestProvider](../interfaces/ihittestprovider.md)*

• **set hitTestProvider**(`value`: [IHitTestProvider](../interfaces/ihittestprovider.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[hitTestProvider](basestackedcollection.md#hittestprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:181](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L181)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IHitTestProvider](../interfaces/ihittestprovider.md) |

**Returns:** *void*

___

###  isOneHundredPercent

• **get isOneHundredPercent**(): *boolean*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[isOneHundredPercent](basestackedcollection.md#isonehundredpercent)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L147)*

**Returns:** *boolean*

• **set isOneHundredPercent**(`value`: boolean): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[isOneHundredPercent](basestackedcollection.md#isonehundredpercent)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:150](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[isVisible](basestackedcollection.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:123](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L123)*

**Returns:** *boolean*

• **set isVisible**(`isVisible`: boolean): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[isVisible](basestackedcollection.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`isVisible` | boolean |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[paletteProvider](basestackedcollection.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:185](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L185)*

**Returns:** *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

• **set paletteProvider**(`value`: [IPaletteProvider](../interfaces/ipaletteprovider.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[paletteProvider](basestackedcollection.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:188](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IPaletteProvider](../interfaces/ipaletteprovider.md) |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[IPointMarker](../interfaces/ipointmarker.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[pointMarker](basestackedcollection.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:192](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L192)*

**Returns:** *[IPointMarker](../interfaces/ipointmarker.md)*

• **set pointMarker**(`value`: [IPointMarker](../interfaces/ipointmarker.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[pointMarker](basestackedcollection.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:195](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IPointMarker](../interfaces/ipointmarker.md) |

**Returns:** *void*

___

###  rolloverModifierProps

• **get rolloverModifierProps**(): *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[rolloverModifierProps](basestackedcollection.md#rollovermodifierprops)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:199](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L199)*

**Returns:** *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)*

• **set rolloverModifierProps**(`value`: [RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹›): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[rolloverModifierProps](basestackedcollection.md#rollovermodifierprops)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:202](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L202)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹› |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[stroke](basestackedcollection.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:206](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L206)*

**Returns:** *string*

• **set stroke**(`value`: string): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[stroke](basestackedcollection.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:209](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L209)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[strokeThickness](basestackedcollection.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:213](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L213)*

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[strokeThickness](basestackedcollection.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:216](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L216)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  xAxisId

• **get xAxisId**(): *string*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[xAxisId](basestackedcollection.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L131)*

**Returns:** *string*

• **set xAxisId**(`id`: string): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[xAxisId](basestackedcollection.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:134](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L134)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

___

###  yAxisId

• **get yAxisId**(): *string*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[yAxisId](basestackedcollection.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L139)*

**Returns:** *string*

• **set yAxisId**(`id`: string): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[yAxisId](basestackedcollection.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

## Methods

###  add

▸ **add**(...`items`: [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)[]): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[add](basestackedcollection.md#add)*

*Defined in [src/Core/ObservableArray.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`...items` | [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)[] |

**Returns:** *void*

___

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[applyTheme](basestackedcollection.md#applytheme)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  asArray

▸ **asArray**(): *T[]*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[asArray](basestackedcollection.md#asarray)*

*Defined in [src/Core/ObservableArray.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L23)*

**Returns:** *T[]*

___

###  clear

▸ **clear**(): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[clear](basestackedcollection.md#clear)*

*Defined in [src/Core/ObservableArray.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L67)*

**Returns:** *void*

___

###  contains

▸ **contains**(`item`: [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)): *boolean*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[contains](basestackedcollection.md#contains)*

*Defined in [src/Core/ObservableArray.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | [StackedMountainRenderableSeries](stackedmountainrenderableseries.md) |

**Returns:** *boolean*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[delete](basestackedcollection.md#abstract-delete)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L34)*

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[draw](basestackedcollection.md#abstract-draw)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |
`renderPassData` | [RenderPassData](renderpassdata.md) |

**Returns:** *void*

___

###  get

▸ **get**(`index`: number): *[StackedMountainRenderableSeries](stackedmountainrenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[get](basestackedcollection.md#get)*

*Defined in [src/Core/ObservableArray.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *[StackedMountainRenderableSeries](stackedmountainrenderableseries.md)*

___

###  getBaseXValues

▸ **getBaseXValues**(): *number[]*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[getBaseXValues](basestackedcollection.md#getbasexvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L59)*

**Returns:** *number[]*

___

###  getDataSeriesName

▸ **getDataSeriesName**(): *string*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[getDataSeriesName](basestackedcollection.md#getdataseriesname)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:64](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L64)*

**Returns:** *string*

___

###  getDataSeriesValuesCount

▸ **getDataSeriesValuesCount**(): *number*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[getDataSeriesValuesCount](basestackedcollection.md#getdataseriesvaluescount)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L69)*

**Returns:** *number*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[getNativeXValues](basestackedcollection.md#getnativexvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L76)*

**Returns:** *DoubleVector*

___

###  getVisibleSeries

▸ **getVisibleSeries**(): *[StackedMountainRenderableSeries](stackedmountainrenderableseries.md)‹›[]*

*Overrides [BaseStackedCollection](basestackedcollection.md).[getVisibleSeries](basestackedcollection.md#abstract-getvisibleseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L170)*

**Returns:** *[StackedMountainRenderableSeries](stackedmountainrenderableseries.md)‹›[]*

___

###  getXRange

▸ **getXRange**(): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[getXRange](basestackedcollection.md#abstract-getxrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:119](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L119)*

**Returns:** *NumberRange*

___

###  getYRange

▸ **getYRange**(`xVisibleRange`: NumberRange, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[getYRange](basestackedcollection.md#abstract-getyrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`xVisibleRange` | NumberRange |
`isXCategoryAxis` | boolean |

**Returns:** *NumberRange*

___

###  hasDataSeries

▸ **hasDataSeries**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[hasDataSeries](basestackedcollection.md#hasdataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:87](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L87)*

**Returns:** *boolean*

___

###  hasDataSeriesValues

▸ **hasDataSeriesValues**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[hasDataSeriesValues](basestackedcollection.md#abstract-hasdataseriesvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L166)*

**Returns:** *boolean*

___

###  hasStrokePaletteProvider

▸ **hasStrokePaletteProvider**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[hasStrokePaletteProvider](basestackedcollection.md#hasstrokepaletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L93)*

**Returns:** *boolean*

___

###  insert

▸ **insert**(`index`: number, `item`: [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[insert](basestackedcollection.md#insert)*

*Defined in [src/Core/ObservableArray.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`item` | [StackedMountainRenderableSeries](stackedmountainrenderableseries.md) |

**Returns:** *void*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Overrides [BaseStackedCollection](basestackedcollection.md).[notifyPropertyChanged](basestackedcollection.md#notifypropertychanged)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurface](scichartsurface.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseStackedCollection](basestackedcollection.md).[onAttach](basestackedcollection.md#onattach)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L147)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[onDetach](basestackedcollection.md#ondetach)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L109)*

**Returns:** *void*

___

###  remove

▸ **remove**(`item`: [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[remove](basestackedcollection.md#remove)*

*Defined in [src/Core/ObservableArray.ts:58](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | [StackedMountainRenderableSeries](stackedmountainrenderableseries.md) |

**Returns:** *void*

___

###  removeAt

▸ **removeAt**(`index`: number): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[removeAt](basestackedcollection.md#removeat)*

*Defined in [src/Core/ObservableArray.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *void*

___

###  set

▸ **set**(`index`: number, `item`: [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[set](basestackedcollection.md#set)*

*Defined in [src/Core/ObservableArray.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`item` | [StackedMountainRenderableSeries](stackedmountainrenderableseries.md) |

**Returns:** *void*

___

###  size

▸ **size**(): *number*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[size](basestackedcollection.md#size)*

*Defined in [src/Core/ObservableArray.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Core/ObservableArray.ts#L12)*

**Returns:** *number*

___

###  updateAccumulatedVectors

▸ **updateAccumulatedVectors**(): *void*

*Overrides [BaseStackedCollection](basestackedcollection.md).[updateAccumulatedVectors](basestackedcollection.md#abstract-updateaccumulatedvectors)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainCollection.ts#L40)*

**Returns:** *void*
