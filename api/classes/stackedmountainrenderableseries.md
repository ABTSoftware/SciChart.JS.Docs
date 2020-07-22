[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [StackedMountainRenderableSeries](stackedmountainrenderableseries.md)

# Class: StackedMountainRenderableSeries

## Hierarchy

* [BaseStackedRenderableSeries](basestackedrenderableseries.md)

  ↳ **StackedMountainRenderableSeries**

## Implements

* [IRenderableSeries](../interfaces/irenderableseries.md)

## Index

### Constructors

* [constructor](stackedmountainrenderableseries.md#constructor)

### Properties

* [accumulatedVector](stackedmountainrenderableseries.md#accumulatedvector)
* [hitTestProvider](stackedmountainrenderableseries.md#hittestprovider)
* [id](stackedmountainrenderableseries.md#readonly-id)
* [isStacked](stackedmountainrenderableseries.md#readonly-isstacked)
* [rolloverModifierProps](stackedmountainrenderableseries.md#readonly-rollovermodifierprops)
* [type](stackedmountainrenderableseries.md#readonly-type)

### Accessors

* [dataSeries](stackedmountainrenderableseries.md#dataseries)
* [drawNaNAs](stackedmountainrenderableseries.md#drawnanas)
* [drawingProviders](stackedmountainrenderableseries.md#drawingproviders)
* [effect](stackedmountainrenderableseries.md#effect)
* [fill](stackedmountainrenderableseries.md#fill)
* [isVisible](stackedmountainrenderableseries.md#isvisible)
* [paletteProvider](stackedmountainrenderableseries.md#paletteprovider)
* [parentSurface](stackedmountainrenderableseries.md#parentsurface)
* [pointMarker](stackedmountainrenderableseries.md#pointmarker)
* [stroke](stackedmountainrenderableseries.md#stroke)
* [strokeThickness](stackedmountainrenderableseries.md#strokethickness)
* [xAxisId](stackedmountainrenderableseries.md#xaxisid)
* [yAxisId](stackedmountainrenderableseries.md#yaxisid)

### Methods

* [applyTheme](stackedmountainrenderableseries.md#applytheme)
* [delete](stackedmountainrenderableseries.md#delete)
* [draw](stackedmountainrenderableseries.md#draw)
* [getBaseXValues](stackedmountainrenderableseries.md#getbasexvalues)
* [getDataSeriesName](stackedmountainrenderableseries.md#getdataseriesname)
* [getDataSeriesValuesCount](stackedmountainrenderableseries.md#getdataseriesvaluescount)
* [getFillBrush](stackedmountainrenderableseries.md#getfillbrush)
* [getNativeXValues](stackedmountainrenderableseries.md#getnativexvalues)
* [getStrokePen](stackedmountainrenderableseries.md#getstrokepen)
* [getXRange](stackedmountainrenderableseries.md#getxrange)
* [getYRange](stackedmountainrenderableseries.md#getyrange)
* [hasDataSeries](stackedmountainrenderableseries.md#hasdataseries)
* [hasDataSeriesValues](stackedmountainrenderableseries.md#hasdataseriesvalues)
* [hasStrokePaletteProvider](stackedmountainrenderableseries.md#hasstrokepaletteprovider)
* [invalidateParentCallback](stackedmountainrenderableseries.md#invalidateparentcallback)
* [notifyPropertyChanged](stackedmountainrenderableseries.md#notifypropertychanged)
* [onAttach](stackedmountainrenderableseries.md#onattach)
* [onAttachToParentCollection](stackedmountainrenderableseries.md#onattachtoparentcollection)
* [onDetach](stackedmountainrenderableseries.md#ondetach)
* [onDetachFromParentCollection](stackedmountainrenderableseries.md#ondetachfromparentcollection)

## Constructors

###  constructor

\+ **new StackedMountainRenderableSeries**(`webAssemblyContext`: TSciChart): *[StackedMountainRenderableSeries](stackedmountainrenderableseries.md)*

*Overrides [BaseStackedRenderableSeries](basestackedrenderableseries.md).[constructor](basestackedrenderableseries.md#constructor)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[StackedMountainRenderableSeries](stackedmountainrenderableseries.md)*

## Properties

###  accumulatedVector

• **accumulatedVector**: *DoubleVector*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L14)*

___

###  hitTestProvider

• **hitTestProvider**: *[IHitTestProvider](../interfaces/ihittestprovider.md)*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[hitTestProvider](../interfaces/irenderableseries.md#hittestprovider)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[hitTestProvider](basestackedrenderableseries.md#hittestprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L25)*

___

### `Readonly` id

• **id**: *string* = generateGuid()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[id](../interfaces/irenderableseries.md#readonly-id)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[id](basestackedrenderableseries.md#readonly-id)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L21)*

___

### `Readonly` isStacked

• **isStacked**: *boolean* = true

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[isStacked](../interfaces/irenderableseries.md#readonly-isstacked)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[isStacked](basestackedrenderableseries.md#readonly-isstacked)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L22)*

___

### `Readonly` rolloverModifierProps

• **rolloverModifierProps**: *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹›* = new RolloverModifierRenderableSeriesProps()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[rolloverModifierProps](../interfaces/irenderableseries.md#readonly-rollovermodifierprops)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[rolloverModifierProps](basestackedrenderableseries.md#readonly-rollovermodifierprops)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L23)*

___

### `Readonly` type

• **type**: *ESeriesType* = ESeriesType.StackedMountainRenderableSeries

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[type](../interfaces/irenderableseries.md#readonly-type)*

*Overrides [BaseStackedRenderableSeries](basestackedrenderableseries.md).[type](basestackedrenderableseries.md#readonly-abstract-type)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L13)*

## Accessors

###  dataSeries

• **get dataSeries**(): *[IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[dataSeries](basestackedrenderableseries.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:129](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L129)*

**Returns:** *[IDataSeries](../interfaces/idataseries.md)*

• **set dataSeries**(`dataSeries`: [IDataSeries](../interfaces/idataseries.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[dataSeries](basestackedrenderableseries.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:132](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`dataSeries` | [IDataSeries](../interfaces/idataseries.md) |

**Returns:** *void*

___

###  drawNaNAs

• **get drawNaNAs**(): *[ELineDrawMode](../enums/elinedrawmode.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawNaNAs](basestackedrenderableseries.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L139)*

**Returns:** *[ELineDrawMode](../enums/elinedrawmode.md)*

• **set drawNaNAs**(`drawNaNAs`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawNaNAs](basestackedrenderableseries.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`drawNaNAs` | [ELineDrawMode](../enums/elinedrawmode.md) |

**Returns:** *void*

___

###  drawingProviders

• **get drawingProviders**(): *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawingProviders](basestackedrenderableseries.md#drawingproviders)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:200](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L200)*

**Returns:** *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

• **set drawingProviders**(`value`: [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawingProviders](basestackedrenderableseries.md#drawingproviders)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:203](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[] |

**Returns:** *void*

___

###  effect

• **get effect**(): *[ShaderEffect](shadereffect.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[effect](basestackedrenderableseries.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L221)*

**Returns:** *[ShaderEffect](shadereffect.md)*

• **set effect**(`effect`: [ShaderEffect](shadereffect.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[effect](basestackedrenderableseries.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:224](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L224)*

**Parameters:**

Name | Type |
------ | ------ |
`effect` | [ShaderEffect](shadereffect.md) |

**Returns:** *void*

___

###  fill

• **get fill**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:72](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L72)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[isVisible](basestackedrenderableseries.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L147)*

**Returns:** *boolean*

• **set isVisible**(`value`: boolean): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[isVisible](basestackedrenderableseries.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:150](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[paletteProvider](basestackedrenderableseries.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L155)*

**Returns:** *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

• **set paletteProvider**(`paletteProvider`: [IPaletteProvider](../interfaces/ipaletteprovider.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[paletteProvider](basestackedrenderableseries.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:158](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`paletteProvider` | [IPaletteProvider](../interfaces/ipaletteprovider.md) |

**Returns:** *void*

___

###  parentSurface

• **get parentSurface**(): *[SciChartSurface](scichartsurface.md)‹›*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[parentSurface](basestackedrenderableseries.md#parentsurface)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:122](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L122)*

**Returns:** *[SciChartSurface](scichartsurface.md)‹›*

• **set parentSurface**(`value`: [SciChartSurface](scichartsurface.md)‹›): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[parentSurface](basestackedrenderableseries.md#parentsurface)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:125](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [SciChartSurface](scichartsurface.md)‹› |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[IPointMarker](../interfaces/ipointmarker.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[pointMarker](basestackedrenderableseries.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L166)*

**Returns:** *[IPointMarker](../interfaces/ipointmarker.md)*

• **set pointMarker**(`pointMarker`: [IPointMarker](../interfaces/ipointmarker.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[pointMarker](basestackedrenderableseries.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:169](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`pointMarker` | [IPointMarker](../interfaces/ipointmarker.md) |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[stroke](basestackedrenderableseries.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:182](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L182)*

**Returns:** *string*

• **set stroke**(`htmlColorCode`: string): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[stroke](basestackedrenderableseries.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:185](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[strokeThickness](basestackedrenderableseries.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:190](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L190)*

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[strokeThickness](basestackedrenderableseries.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:193](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  xAxisId

• **get xAxisId**(): *string*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[xAxisId](basestackedrenderableseries.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:207](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L207)*

**Returns:** *string*

• **set xAxisId**(`value`: string): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[xAxisId](basestackedrenderableseries.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:210](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  yAxisId

• **get yAxisId**(): *string*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[yAxisId](basestackedrenderableseries.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:214](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L214)*

**Returns:** *string*

• **set yAxisId**(`value`: string): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[yAxisId](basestackedrenderableseries.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L217)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[applyTheme](basestackedrenderableseries.md#applytheme)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseStackedRenderableSeries](basestackedrenderableseries.md).[delete](basestackedrenderableseries.md#abstract-delete)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L25)*

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[draw](basestackedrenderableseries.md#draw)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L84)*

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

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getBaseXValues](basestackedrenderableseries.md#getbasexvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L88)*

**Returns:** *number[]*

___

###  getDataSeriesName

▸ **getDataSeriesName**(): *string*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getDataSeriesName](basestackedrenderableseries.md#getdataseriesname)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L55)*

**Returns:** *string*

___

###  getDataSeriesValuesCount

▸ **getDataSeriesValuesCount**(): *number*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getDataSeriesValuesCount](basestackedrenderableseries.md#getdataseriesvaluescount)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L59)*

**Returns:** *number*

___

###  getFillBrush

▸ **getFillBrush**(): *SCRTBrush‹›*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L50)*

**Returns:** *SCRTBrush‹›*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getNativeXValues](basestackedrenderableseries.md#getnativexvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:63](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L63)*

**Returns:** *DoubleVector*

___

###  getStrokePen

▸ **getStrokePen**(): *SCRTPen‹›*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L54)*

**Returns:** *SCRTPen‹›*

___

###  getXRange

▸ **getXRange**(): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getXRange](basestackedrenderableseries.md#getxrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L92)*

**Returns:** *NumberRange*

___

###  getYRange

▸ **getYRange**(`xVisibleRange`: NumberRange, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getYRange](basestackedrenderableseries.md#getyrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L96)*

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

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[hasDataSeries](basestackedrenderableseries.md#hasdataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L100)*

**Returns:** *boolean*

___

###  hasDataSeriesValues

▸ **hasDataSeriesValues**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[hasDataSeriesValues](basestackedrenderableseries.md#hasdataseriesvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L104)*

**Returns:** *boolean*

___

###  hasStrokePaletteProvider

▸ **hasStrokePaletteProvider**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[hasStrokePaletteProvider](basestackedrenderableseries.md#hasstrokepaletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:108](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L108)*

**Returns:** *boolean*

___

###  invalidateParentCallback

▸ **invalidateParentCallback**(): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[invalidateParentCallback](basestackedrenderableseries.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:80](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L80)*

**Returns:** *void*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Overrides [BaseStackedRenderableSeries](basestackedrenderableseries.md).[notifyPropertyChanged](basestackedrenderableseries.md#notifypropertychanged)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:58](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurface](scichartsurface.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[onAttach](basestackedrenderableseries.md#onattach)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  onAttachToParentCollection

▸ **onAttachToParentCollection**(`getParentSurfaceFn`: function, `notifyPropertyChangedFn`: function): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries.ts#L31)*

**Parameters:**

▪ **getParentSurfaceFn**: *function*

▸ (): *[SciChartSurface](scichartsurface.md)*

▪ **notifyPropertyChangedFn**: *function*

▸ (`propertyName`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[onDetach](basestackedrenderableseries.md#ondetach)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L116)*

**Returns:** *void*

___

###  onDetachFromParentCollection

▸ **onDetachFromParentCollection**(): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[onDetachFromParentCollection](basestackedrenderableseries.md#ondetachfromparentcollection)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L67)*

**Returns:** *void*
