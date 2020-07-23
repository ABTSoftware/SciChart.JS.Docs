[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseStackedCollection](basestackedcollection.md)

# Class: BaseStackedCollection ‹**T**›

## Type parameters

▪ **T**: *[BaseStackedRenderableSeries](basestackedrenderableseries.md)*

## Hierarchy

* ObservableArray‹T›

  ↳ **BaseStackedCollection**

  ↳ [StackedMountainCollection](stackedmountaincollection.md)

  ↳ [StackedColumnCollection](stackedcolumncollection.md)

## Implements

* [IRenderableSeries](../interfaces/irenderableseries.md)

## Index

### Constructors

* [constructor](basestackedcollection.md#constructor)

### Properties

* [collectionChanged](basestackedcollection.md#readonly-collectionchanged)
* [id](basestackedcollection.md#readonly-id)
* [invalidateParentCallback](basestackedcollection.md#invalidateparentcallback)
* [isStacked](basestackedcollection.md#readonly-isstacked)
* [parentSurface](basestackedcollection.md#parentsurface)
* [type](basestackedcollection.md#readonly-abstract-type)

### Accessors

* [dataSeries](basestackedcollection.md#dataseries)
* [drawNaNAs](basestackedcollection.md#drawnanas)
* [drawingProviders](basestackedcollection.md#drawingproviders)
* [effect](basestackedcollection.md#effect)
* [hitTestProvider](basestackedcollection.md#hittestprovider)
* [isOneHundredPercent](basestackedcollection.md#isonehundredpercent)
* [isVisible](basestackedcollection.md#isvisible)
* [paletteProvider](basestackedcollection.md#paletteprovider)
* [pointMarker](basestackedcollection.md#pointmarker)
* [rolloverModifierProps](basestackedcollection.md#rollovermodifierprops)
* [stroke](basestackedcollection.md#stroke)
* [strokeThickness](basestackedcollection.md#strokethickness)
* [xAxisId](basestackedcollection.md#xaxisid)
* [yAxisId](basestackedcollection.md#yaxisid)

### Methods

* [add](basestackedcollection.md#add)
* [applyTheme](basestackedcollection.md#applytheme)
* [asArray](basestackedcollection.md#asarray)
* [clear](basestackedcollection.md#clear)
* [contains](basestackedcollection.md#contains)
* [delete](basestackedcollection.md#abstract-delete)
* [draw](basestackedcollection.md#abstract-draw)
* [get](basestackedcollection.md#get)
* [getBaseXValues](basestackedcollection.md#getbasexvalues)
* [getDataSeriesName](basestackedcollection.md#getdataseriesname)
* [getDataSeriesValuesCount](basestackedcollection.md#getdataseriesvaluescount)
* [getNativeXValues](basestackedcollection.md#getnativexvalues)
* [getVisibleSeries](basestackedcollection.md#abstract-getvisibleseries)
* [getXRange](basestackedcollection.md#abstract-getxrange)
* [getYRange](basestackedcollection.md#abstract-getyrange)
* [hasDataSeries](basestackedcollection.md#hasdataseries)
* [hasDataSeriesValues](basestackedcollection.md#abstract-hasdataseriesvalues)
* [hasStrokePaletteProvider](basestackedcollection.md#hasstrokepaletteprovider)
* [insert](basestackedcollection.md#insert)
* [notifyPropertyChanged](basestackedcollection.md#notifypropertychanged)
* [onAttach](basestackedcollection.md#onattach)
* [onDetach](basestackedcollection.md#ondetach)
* [remove](basestackedcollection.md#remove)
* [removeAt](basestackedcollection.md#removeat)
* [set](basestackedcollection.md#set)
* [size](basestackedcollection.md#size)
* [updateAccumulatedVectors](basestackedcollection.md#abstract-updateaccumulatedvectors)

## Constructors

###  constructor

\+ **new BaseStackedCollection**(`webAssemblyContext`: TSciChart): *[BaseStackedCollection](basestackedcollection.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[BaseStackedCollection](basestackedcollection.md)*

## Properties

### `Readonly` collectionChanged

• **collectionChanged**: *EventHandler‹ObservableArrayChangedArgs›*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[collectionChanged](basestackedcollection.md#readonly-collectionchanged)*

*Defined in [src/Core/ObservableArray.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L5)*

___

### `Readonly` id

• **id**: *string* = generateGuid()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[id](../interfaces/irenderableseries.md#readonly-id)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L25)*

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[invalidateParentCallback](../interfaces/irenderableseries.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L28)*

#### Type declaration:

▸ (): *void*

___

### `Readonly` isStacked

• **isStacked**: *true* = true

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[isStacked](../interfaces/irenderableseries.md#readonly-isstacked)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L26)*

___

###  parentSurface

• **parentSurface**: *[SciChartSurface](scichartsurface.md)*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[parentSurface](../interfaces/irenderableseries.md#parentsurface)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L27)*

___

### `Readonly` `Abstract` type

• **type**: *ESeriesType*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[type](../interfaces/irenderableseries.md#readonly-type)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L24)*

## Accessors

###  dataSeries

• **get dataSeries**(): *[IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L157)*

**Returns:** *[IDataSeries](../interfaces/idataseries.md)*

• **set dataSeries**(`value`: [IDataSeries](../interfaces/idataseries.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:160](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IDataSeries](../interfaces/idataseries.md) |

**Returns:** *void*

___

###  drawNaNAs

• **get drawNaNAs**(): *[ELineDrawMode](../enums/elinedrawmode.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:164](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L164)*

**Returns:** *[ELineDrawMode](../enums/elinedrawmode.md)*

• **set drawNaNAs**(`value`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:167](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ELineDrawMode](../enums/elinedrawmode.md) |

**Returns:** *void*

___

###  drawingProviders

• **get drawingProviders**(): *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:171](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L171)*

**Returns:** *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

• **set drawingProviders**(`value`: [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L174)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[] |

**Returns:** *void*

___

###  effect

• **get effect**(): *[ShaderEffect](shadereffect.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:220](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L220)*

**Returns:** *[ShaderEffect](shadereffect.md)*

• **set effect**(`effect`: [ShaderEffect](shadereffect.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:223](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L223)*

**Parameters:**

Name | Type |
------ | ------ |
`effect` | [ShaderEffect](shadereffect.md) |

**Returns:** *void*

___

###  hitTestProvider

• **get hitTestProvider**(): *[IHitTestProvider](../interfaces/ihittestprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:178](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L178)*

**Returns:** *[IHitTestProvider](../interfaces/ihittestprovider.md)*

• **set hitTestProvider**(`value`: [IHitTestProvider](../interfaces/ihittestprovider.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:181](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L181)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IHitTestProvider](../interfaces/ihittestprovider.md) |

**Returns:** *void*

___

###  isOneHundredPercent

• **get isOneHundredPercent**(): *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L147)*

**Returns:** *boolean*

• **set isOneHundredPercent**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:150](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:123](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L123)*

**Returns:** *boolean*

• **set isVisible**(`isVisible`: boolean): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`isVisible` | boolean |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:185](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L185)*

**Returns:** *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

• **set paletteProvider**(`value`: [IPaletteProvider](../interfaces/ipaletteprovider.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:188](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IPaletteProvider](../interfaces/ipaletteprovider.md) |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[IPointMarker](../interfaces/ipointmarker.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:192](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L192)*

**Returns:** *[IPointMarker](../interfaces/ipointmarker.md)*

• **set pointMarker**(`value`: [IPointMarker](../interfaces/ipointmarker.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:195](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [IPointMarker](../interfaces/ipointmarker.md) |

**Returns:** *void*

___

###  rolloverModifierProps

• **get rolloverModifierProps**(): *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:199](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L199)*

**Returns:** *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)*

• **set rolloverModifierProps**(`value`: [RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹›): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:202](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L202)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹› |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:206](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L206)*

**Returns:** *string*

• **set stroke**(`value`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:209](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L209)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:213](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L213)*

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:216](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L216)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  xAxisId

• **get xAxisId**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L131)*

**Returns:** *string*

• **set xAxisId**(`id`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:134](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L134)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

___

###  yAxisId

• **get yAxisId**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L139)*

**Returns:** *string*

• **set yAxisId**(`id`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

## Methods

###  add

▸ **add**(...`items`: T[]): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[add](basestackedcollection.md#add)*

*Defined in [src/Core/ObservableArray.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`...items` | T[] |

**Returns:** *void*

___

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  asArray

▸ **asArray**(): *T[]*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[asArray](basestackedcollection.md#asarray)*

*Defined in [src/Core/ObservableArray.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L23)*

**Returns:** *T[]*

___

###  clear

▸ **clear**(): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[clear](basestackedcollection.md#clear)*

*Defined in [src/Core/ObservableArray.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L67)*

**Returns:** *void*

___

###  contains

▸ **contains**(`item`: T): *boolean*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[contains](basestackedcollection.md#contains)*

*Defined in [src/Core/ObservableArray.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | T |

**Returns:** *boolean*

___

### `Abstract` delete

▸ **delete**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L51)*

**Returns:** *void*

___

### `Abstract` draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |
`renderPassData` | [RenderPassData](renderpassdata.md) |

**Returns:** *void*

___

###  get

▸ **get**(`index`: number): *T*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[get](basestackedcollection.md#get)*

*Defined in [src/Core/ObservableArray.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *T*

___

###  getBaseXValues

▸ **getBaseXValues**(): *number[]*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L59)*

**Returns:** *number[]*

___

###  getDataSeriesName

▸ **getDataSeriesName**(): *string*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:64](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L64)*

**Returns:** *string*

___

###  getDataSeriesValuesCount

▸ **getDataSeriesValuesCount**(): *number*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L69)*

**Returns:** *number*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L76)*

**Returns:** *DoubleVector*

___

### `Abstract` getVisibleSeries

▸ **getVisibleSeries**(): *T[]*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:117](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L117)*

**Returns:** *T[]*

___

### `Abstract` getXRange

▸ **getXRange**(): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:83](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L83)*

**Returns:** *NumberRange*

___

### `Abstract` getYRange

▸ **getYRange**(`xVisibleRange`: NumberRange, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L85)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:87](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L87)*

**Returns:** *boolean*

___

### `Abstract` hasDataSeriesValues

▸ **hasDataSeriesValues**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L91)*

**Returns:** *boolean*

___

###  hasStrokePaletteProvider

▸ **hasStrokePaletteProvider**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L93)*

**Returns:** *boolean*

___

###  insert

▸ **insert**(`index`: number, `item`: T): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[insert](basestackedcollection.md#insert)*

*Defined in [src/Core/ObservableArray.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`item` | T |

**Returns:** *void*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurface](scichartsurface.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:98](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L109)*

**Returns:** *void*

___

###  remove

▸ **remove**(`item`: T): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[remove](basestackedcollection.md#remove)*

*Defined in [src/Core/ObservableArray.ts:58](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | T |

**Returns:** *void*

___

###  removeAt

▸ **removeAt**(`index`: number): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[removeAt](basestackedcollection.md#removeat)*

*Defined in [src/Core/ObservableArray.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *void*

___

###  set

▸ **set**(`index`: number, `item`: T): *void*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[set](basestackedcollection.md#set)*

*Defined in [src/Core/ObservableArray.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`item` | T |

**Returns:** *void*

___

###  size

▸ **size**(): *number*

*Inherited from [BaseStackedCollection](basestackedcollection.md).[size](basestackedcollection.md#size)*

*Defined in [src/Core/ObservableArray.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Core/ObservableArray.ts#L12)*

**Returns:** *number*

___

### `Abstract` updateAccumulatedVectors

▸ **updateAccumulatedVectors**(): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedCollection.ts#L115)*

**Returns:** *void*
