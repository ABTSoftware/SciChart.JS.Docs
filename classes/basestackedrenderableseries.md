[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseStackedRenderableSeries](basestackedrenderableseries.md)

# Class: BaseStackedRenderableSeries

## Hierarchy

* **BaseStackedRenderableSeries**

  ↳ [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)

  ↳ [StackedColumnRenderableSeries](stackedcolumnrenderableseries.md)

## Implements

* [IRenderableSeries](../interfaces/irenderableseries.md)

## Index

### Constructors

* [constructor](basestackedrenderableseries.md#constructor)

### Properties

* [hitTestProvider](basestackedrenderableseries.md#hittestprovider)
* [id](basestackedrenderableseries.md#readonly-id)
* [isStacked](basestackedrenderableseries.md#readonly-isstacked)
* [rolloverModifierProps](basestackedrenderableseries.md#readonly-rollovermodifierprops)
* [type](basestackedrenderableseries.md#readonly-abstract-type)

### Accessors

* [dataSeries](basestackedrenderableseries.md#dataseries)
* [drawNaNAs](basestackedrenderableseries.md#drawnanas)
* [drawingProviders](basestackedrenderableseries.md#drawingproviders)
* [effect](basestackedrenderableseries.md#effect)
* [isVisible](basestackedrenderableseries.md#isvisible)
* [paletteProvider](basestackedrenderableseries.md#paletteprovider)
* [parentSurface](basestackedrenderableseries.md#parentsurface)
* [pointMarker](basestackedrenderableseries.md#pointmarker)
* [stroke](basestackedrenderableseries.md#stroke)
* [strokeThickness](basestackedrenderableseries.md#strokethickness)
* [xAxisId](basestackedrenderableseries.md#xaxisid)
* [yAxisId](basestackedrenderableseries.md#yaxisid)

### Methods

* [applyTheme](basestackedrenderableseries.md#applytheme)
* [delete](basestackedrenderableseries.md#abstract-delete)
* [draw](basestackedrenderableseries.md#draw)
* [getBaseXValues](basestackedrenderableseries.md#getbasexvalues)
* [getDataSeriesName](basestackedrenderableseries.md#getdataseriesname)
* [getDataSeriesValuesCount](basestackedrenderableseries.md#getdataseriesvaluescount)
* [getNativeXValues](basestackedrenderableseries.md#getnativexvalues)
* [getXRange](basestackedrenderableseries.md#getxrange)
* [getYRange](basestackedrenderableseries.md#getyrange)
* [hasDataSeries](basestackedrenderableseries.md#hasdataseries)
* [hasDataSeriesValues](basestackedrenderableseries.md#hasdataseriesvalues)
* [hasStrokePaletteProvider](basestackedrenderableseries.md#hasstrokepaletteprovider)
* [invalidateParentCallback](basestackedrenderableseries.md#invalidateparentcallback)
* [notifyPropertyChanged](basestackedrenderableseries.md#notifypropertychanged)
* [onAttach](basestackedrenderableseries.md#onattach)
* [onDetach](basestackedrenderableseries.md#ondetach)
* [onDetachFromParentCollection](basestackedrenderableseries.md#ondetachfromparentcollection)

## Constructors

###  constructor

\+ **new BaseStackedRenderableSeries**(`webAssemblyContext`: TSciChart): *[BaseStackedRenderableSeries](basestackedrenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[BaseStackedRenderableSeries](basestackedrenderableseries.md)*

## Properties

###  hitTestProvider

• **hitTestProvider**: *[IHitTestProvider](../interfaces/ihittestprovider.md)*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[hitTestProvider](../interfaces/irenderableseries.md#hittestprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L25)*

___

### `Readonly` id

• **id**: *string* = generateGuid()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[id](../interfaces/irenderableseries.md#readonly-id)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L21)*

___

### `Readonly` isStacked

• **isStacked**: *boolean* = true

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[isStacked](../interfaces/irenderableseries.md#readonly-isstacked)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L22)*

___

### `Readonly` rolloverModifierProps

• **rolloverModifierProps**: *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹›* = new RolloverModifierRenderableSeriesProps()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[rolloverModifierProps](../interfaces/irenderableseries.md#readonly-rollovermodifierprops)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L23)*

___

### `Readonly` `Abstract` type

• **type**: *ESeriesType*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[type](../interfaces/irenderableseries.md#readonly-type)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L20)*

## Accessors

###  dataSeries

• **get dataSeries**(): *[IDataSeries](../interfaces/idataseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:129](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L129)*

**Returns:** *[IDataSeries](../interfaces/idataseries.md)*

• **set dataSeries**(`dataSeries`: [IDataSeries](../interfaces/idataseries.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:132](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`dataSeries` | [IDataSeries](../interfaces/idataseries.md) |

**Returns:** *void*

___

###  drawNaNAs

• **get drawNaNAs**(): *[ELineDrawMode](../enums/elinedrawmode.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L139)*

**Returns:** *[ELineDrawMode](../enums/elinedrawmode.md)*

• **set drawNaNAs**(`drawNaNAs`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`drawNaNAs` | [ELineDrawMode](../enums/elinedrawmode.md) |

**Returns:** *void*

___

###  drawingProviders

• **get drawingProviders**(): *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:200](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L200)*

**Returns:** *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

• **set drawingProviders**(`value`: [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:203](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[] |

**Returns:** *void*

___

###  effect

• **get effect**(): *[ShaderEffect](shadereffect.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L221)*

**Returns:** *[ShaderEffect](shadereffect.md)*

• **set effect**(`effect`: [ShaderEffect](shadereffect.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:224](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L224)*

**Parameters:**

Name | Type |
------ | ------ |
`effect` | [ShaderEffect](shadereffect.md) |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L147)*

**Returns:** *boolean*

• **set isVisible**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:150](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L155)*

**Returns:** *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

• **set paletteProvider**(`paletteProvider`: [IPaletteProvider](../interfaces/ipaletteprovider.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:158](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`paletteProvider` | [IPaletteProvider](../interfaces/ipaletteprovider.md) |

**Returns:** *void*

___

###  parentSurface

• **get parentSurface**(): *[SciChartSurface](scichartsurface.md)‹›*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:122](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L122)*

**Returns:** *[SciChartSurface](scichartsurface.md)‹›*

• **set parentSurface**(`value`: [SciChartSurface](scichartsurface.md)‹›): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:125](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [SciChartSurface](scichartsurface.md)‹› |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[IPointMarker](../interfaces/ipointmarker.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L166)*

**Returns:** *[IPointMarker](../interfaces/ipointmarker.md)*

• **set pointMarker**(`pointMarker`: [IPointMarker](../interfaces/ipointmarker.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:169](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`pointMarker` | [IPointMarker](../interfaces/ipointmarker.md) |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:182](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L182)*

**Returns:** *string*

• **set stroke**(`htmlColorCode`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:185](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:190](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L190)*

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:193](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  xAxisId

• **get xAxisId**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:207](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L207)*

**Returns:** *string*

• **set xAxisId**(`value`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:210](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  yAxisId

• **get yAxisId**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:214](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L214)*

**Returns:** *string*

• **set yAxisId**(`value`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L217)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

### `Abstract` delete

▸ **delete**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L53)*

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |
`renderPassData` | [RenderPassData](renderpassdata.md) |

**Returns:** *void*

___

###  getBaseXValues

▸ **getBaseXValues**(): *number[]*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L88)*

**Returns:** *number[]*

___

###  getDataSeriesName

▸ **getDataSeriesName**(): *string*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L55)*

**Returns:** *string*

___

###  getDataSeriesValuesCount

▸ **getDataSeriesValuesCount**(): *number*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L59)*

**Returns:** *number*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:63](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L63)*

**Returns:** *DoubleVector*

___

###  getXRange

▸ **getXRange**(): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L92)*

**Returns:** *NumberRange*

___

###  getYRange

▸ **getYRange**(`xVisibleRange`: NumberRange, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L96)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L100)*

**Returns:** *boolean*

___

###  hasDataSeriesValues

▸ **hasDataSeriesValues**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L104)*

**Returns:** *boolean*

___

###  hasStrokePaletteProvider

▸ **hasStrokePaletteProvider**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:108](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L108)*

**Returns:** *boolean*

___

###  invalidateParentCallback

▸ **invalidateParentCallback**(): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:80](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L80)*

**Returns:** *void*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurface](scichartsurface.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L116)*

**Returns:** *void*

___

###  onDetachFromParentCollection

▸ **onDetachFromParentCollection**(): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L67)*

**Returns:** *void*
