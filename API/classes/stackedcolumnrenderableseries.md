[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [StackedColumnRenderableSeries](stackedcolumnrenderableseries.md)

# Class: StackedColumnRenderableSeries

## Hierarchy

* [BaseStackedRenderableSeries](basestackedrenderableseries.md)

  ↳ **StackedColumnRenderableSeries**

## Implements

* [IRenderableSeries](../interfaces/irenderableseries.md)

## Index

### Constructors

* [constructor](stackedcolumnrenderableseries.md#constructor)

### Properties

* [accumulatedVector](stackedcolumnrenderableseries.md#accumulatedvector)
* [hitTestProvider](stackedcolumnrenderableseries.md#hittestprovider)
* [id](stackedcolumnrenderableseries.md#readonly-id)
* [isStacked](stackedcolumnrenderableseries.md#readonly-isstacked)
* [rolloverModifierProps](stackedcolumnrenderableseries.md#readonly-rollovermodifierprops)
* [type](stackedcolumnrenderableseries.md#readonly-type)

### Accessors

* [dataSeries](stackedcolumnrenderableseries.md#dataseries)
* [drawNaNAs](stackedcolumnrenderableseries.md#drawnanas)
* [drawingProviders](stackedcolumnrenderableseries.md#drawingproviders)
* [effect](stackedcolumnrenderableseries.md#effect)
* [fill](stackedcolumnrenderableseries.md#fill)
* [isVisible](stackedcolumnrenderableseries.md#isvisible)
* [paletteProvider](stackedcolumnrenderableseries.md#paletteprovider)
* [parentSurface](stackedcolumnrenderableseries.md#parentsurface)
* [pointMarker](stackedcolumnrenderableseries.md#pointmarker)
* [spacing](stackedcolumnrenderableseries.md#spacing)
* [stackedGroupId](stackedcolumnrenderableseries.md#stackedgroupid)
* [stroke](stackedcolumnrenderableseries.md#stroke)
* [strokeThickness](stackedcolumnrenderableseries.md#strokethickness)
* [xAxisId](stackedcolumnrenderableseries.md#xaxisid)
* [yAxisId](stackedcolumnrenderableseries.md#yaxisid)

### Methods

* [applyTheme](stackedcolumnrenderableseries.md#applytheme)
* [delete](stackedcolumnrenderableseries.md#delete)
* [draw](stackedcolumnrenderableseries.md#draw)
* [getBaseXValues](stackedcolumnrenderableseries.md#getbasexvalues)
* [getColumnWidth](stackedcolumnrenderableseries.md#getcolumnwidth)
* [getDataSeriesName](stackedcolumnrenderableseries.md#getdataseriesname)
* [getDataSeriesValuesCount](stackedcolumnrenderableseries.md#getdataseriesvaluescount)
* [getFillBrush](stackedcolumnrenderableseries.md#getfillbrush)
* [getGroupIndex](stackedcolumnrenderableseries.md#getgroupindex)
* [getGroupsCount](stackedcolumnrenderableseries.md#getgroupscount)
* [getNativeXValues](stackedcolumnrenderableseries.md#getnativexvalues)
* [getStrokePen](stackedcolumnrenderableseries.md#getstrokepen)
* [getXRange](stackedcolumnrenderableseries.md#getxrange)
* [getYRange](stackedcolumnrenderableseries.md#getyrange)
* [hasDataSeries](stackedcolumnrenderableseries.md#hasdataseries)
* [hasDataSeriesValues](stackedcolumnrenderableseries.md#hasdataseriesvalues)
* [hasStrokePaletteProvider](stackedcolumnrenderableseries.md#hasstrokepaletteprovider)
* [invalidateParentCallback](stackedcolumnrenderableseries.md#invalidateparentcallback)
* [notifyPropertyChanged](stackedcolumnrenderableseries.md#notifypropertychanged)
* [onAttach](stackedcolumnrenderableseries.md#onattach)
* [onAttachToParentCollection](stackedcolumnrenderableseries.md#onattachtoparentcollection)
* [onDetach](stackedcolumnrenderableseries.md#ondetach)
* [onDetachFromParentCollection](stackedcolumnrenderableseries.md#ondetachfromparentcollection)
* [setGroupIndex](stackedcolumnrenderableseries.md#setgroupindex)
* [setGroupsCount](stackedcolumnrenderableseries.md#setgroupscount)

## Constructors

###  constructor

\+ **new StackedColumnRenderableSeries**(`webAssemblyContext`: TSciChart): *[StackedColumnRenderableSeries](stackedcolumnrenderableseries.md)*

*Overrides [BaseStackedRenderableSeries](basestackedrenderableseries.md).[constructor](basestackedrenderableseries.md#constructor)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[StackedColumnRenderableSeries](stackedcolumnrenderableseries.md)*

## Properties

###  accumulatedVector

• **accumulatedVector**: *DoubleVector*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L15)*

___

###  hitTestProvider

• **hitTestProvider**: *[IHitTestProvider](../interfaces/ihittestprovider.md)*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[hitTestProvider](../interfaces/irenderableseries.md#hittestprovider)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[hitTestProvider](basestackedrenderableseries.md#hittestprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L25)*

___

### `Readonly` id

• **id**: *string* = generateGuid()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[id](../interfaces/irenderableseries.md#readonly-id)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[id](basestackedrenderableseries.md#readonly-id)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L21)*

___

### `Readonly` isStacked

• **isStacked**: *boolean* = true

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[isStacked](../interfaces/irenderableseries.md#readonly-isstacked)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[isStacked](basestackedrenderableseries.md#readonly-isstacked)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L22)*

___

### `Readonly` rolloverModifierProps

• **rolloverModifierProps**: *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹›* = new RolloverModifierRenderableSeriesProps()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[rolloverModifierProps](../interfaces/irenderableseries.md#readonly-rollovermodifierprops)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[rolloverModifierProps](basestackedrenderableseries.md#readonly-rollovermodifierprops)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L23)*

___

### `Readonly` type

• **type**: *ESeriesType* = ESeriesType.StackedColumnRenderableSeries

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[type](../interfaces/irenderableseries.md#readonly-type)*

*Overrides [BaseStackedRenderableSeries](basestackedrenderableseries.md).[type](basestackedrenderableseries.md#readonly-abstract-type)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L14)*

## Accessors

###  dataSeries

• **get dataSeries**(): *[IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[dataSeries](basestackedrenderableseries.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:129](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L129)*

**Returns:** *[IDataSeries](../interfaces/idataseries.md)*

• **set dataSeries**(`dataSeries`: [IDataSeries](../interfaces/idataseries.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[dataSeries](basestackedrenderableseries.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:132](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`dataSeries` | [IDataSeries](../interfaces/idataseries.md) |

**Returns:** *void*

___

###  drawNaNAs

• **get drawNaNAs**(): *[ELineDrawMode](../enums/elinedrawmode.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawNaNAs](basestackedrenderableseries.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L139)*

**Returns:** *[ELineDrawMode](../enums/elinedrawmode.md)*

• **set drawNaNAs**(`drawNaNAs`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawNaNAs](basestackedrenderableseries.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`drawNaNAs` | [ELineDrawMode](../enums/elinedrawmode.md) |

**Returns:** *void*

___

###  drawingProviders

• **get drawingProviders**(): *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawingProviders](basestackedrenderableseries.md#drawingproviders)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:200](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L200)*

**Returns:** *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]*

• **set drawingProviders**(`value`: [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[drawingProviders](basestackedrenderableseries.md#drawingproviders)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:203](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[] |

**Returns:** *void*

___

###  effect

• **get effect**(): *[ShaderEffect](shadereffect.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[effect](basestackedrenderableseries.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L221)*

**Returns:** *[ShaderEffect](shadereffect.md)*

• **set effect**(`effect`: [ShaderEffect](shadereffect.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[effect](basestackedrenderableseries.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:224](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L224)*

**Parameters:**

Name | Type |
------ | ------ |
`effect` | [ShaderEffect](shadereffect.md) |

**Returns:** *void*

___

###  fill

• **get fill**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:107](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L107)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:110](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L110)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[isVisible](basestackedrenderableseries.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L147)*

**Returns:** *boolean*

• **set isVisible**(`value`: boolean): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[isVisible](basestackedrenderableseries.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:150](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[paletteProvider](basestackedrenderableseries.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L155)*

**Returns:** *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

• **set paletteProvider**(`paletteProvider`: [IPaletteProvider](../interfaces/ipaletteprovider.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[paletteProvider](basestackedrenderableseries.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:158](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`paletteProvider` | [IPaletteProvider](../interfaces/ipaletteprovider.md) |

**Returns:** *void*

___

###  parentSurface

• **get parentSurface**(): *[SciChartSurface](scichartsurface.md)‹›*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[parentSurface](basestackedrenderableseries.md#parentsurface)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:122](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L122)*

**Returns:** *[SciChartSurface](scichartsurface.md)‹›*

• **set parentSurface**(`value`: [SciChartSurface](scichartsurface.md)‹›): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[parentSurface](basestackedrenderableseries.md#parentsurface)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:125](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [SciChartSurface](scichartsurface.md)‹› |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[IPointMarker](../interfaces/ipointmarker.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[pointMarker](basestackedrenderableseries.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L166)*

**Returns:** *[IPointMarker](../interfaces/ipointmarker.md)*

• **set pointMarker**(`pointMarker`: [IPointMarker](../interfaces/ipointmarker.md)): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[pointMarker](basestackedrenderableseries.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:169](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`pointMarker` | [IPointMarker](../interfaces/ipointmarker.md) |

**Returns:** *void*

___

###  spacing

• **get spacing**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:123](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L123)*

**Returns:** *number*

• **set spacing**(`value`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  stackedGroupId

• **get stackedGroupId**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L131)*

**Returns:** *string*

• **set stackedGroupId**(`value`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:134](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L134)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[stroke](basestackedrenderableseries.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:182](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L182)*

**Returns:** *string*

• **set stroke**(`htmlColorCode`: string): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[stroke](basestackedrenderableseries.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:185](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[strokeThickness](basestackedrenderableseries.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:190](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L190)*

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[strokeThickness](basestackedrenderableseries.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:193](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  xAxisId

• **get xAxisId**(): *string*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[xAxisId](basestackedrenderableseries.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:207](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L207)*

**Returns:** *string*

• **set xAxisId**(`value`: string): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[xAxisId](basestackedrenderableseries.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:210](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  yAxisId

• **get yAxisId**(): *string*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[yAxisId](basestackedrenderableseries.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:214](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L214)*

**Returns:** *string*

• **set yAxisId**(`value`: string): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[yAxisId](basestackedrenderableseries.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:217](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L217)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L49)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L40)*

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[draw](basestackedrenderableseries.md#draw)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L84)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L88)*

**Returns:** *number[]*

___

###  getColumnWidth

▸ **getColumnWidth**(`xCoordinateCalculator`: [CoordinateCalculatorBase](coordinatecalculatorbase.md)): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`xCoordinateCalculator` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) |

**Returns:** *number*

___

###  getDataSeriesName

▸ **getDataSeriesName**(): *string*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getDataSeriesName](basestackedrenderableseries.md#getdataseriesname)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L55)*

**Returns:** *string*

___

###  getDataSeriesValuesCount

▸ **getDataSeriesValuesCount**(): *number*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getDataSeriesValuesCount](basestackedrenderableseries.md#getdataseriesvaluescount)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L59)*

**Returns:** *number*

___

###  getFillBrush

▸ **getFillBrush**(): *SCRTBrush‹›*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L67)*

**Returns:** *SCRTBrush‹›*

___

###  getGroupIndex

▸ **getGroupIndex**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L75)*

**Returns:** *number*

___

###  getGroupsCount

▸ **getGroupsCount**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L82)*

**Returns:** *number*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getNativeXValues](basestackedrenderableseries.md#getnativexvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:63](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L63)*

**Returns:** *DoubleVector*

___

###  getStrokePen

▸ **getStrokePen**(): *SCRTPen‹›*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:71](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L71)*

**Returns:** *SCRTPen‹›*

___

###  getXRange

▸ **getXRange**(): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getXRange](basestackedrenderableseries.md#getxrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L92)*

**Returns:** *NumberRange*

___

###  getYRange

▸ **getYRange**(`xVisibleRange`: NumberRange, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[getYRange](basestackedrenderableseries.md#getyrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L96)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L100)*

**Returns:** *boolean*

___

###  hasDataSeriesValues

▸ **hasDataSeriesValues**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[hasDataSeriesValues](basestackedrenderableseries.md#hasdataseriesvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L104)*

**Returns:** *boolean*

___

###  hasStrokePaletteProvider

▸ **hasStrokePaletteProvider**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[hasStrokePaletteProvider](basestackedrenderableseries.md#hasstrokepaletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:108](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L108)*

**Returns:** *boolean*

___

###  invalidateParentCallback

▸ **invalidateParentCallback**(): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[invalidateParentCallback](basestackedrenderableseries.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:80](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L80)*

**Returns:** *void*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Overrides [BaseStackedRenderableSeries](basestackedrenderableseries.md).[notifyPropertyChanged](basestackedrenderableseries.md#notifypropertychanged)*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L93)*

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

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChartSurface](scichartsurface.md) |

**Returns:** *void*

___

###  onAttachToParentCollection

▸ **onAttachToParentCollection**(`getParentSurfaceFn`: function, `notifyPropertyChangedFn`: function, `getColumnWidthFn`: function): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L46)*

**Parameters:**

▪ **getParentSurfaceFn**: *function*

▸ (): *[SciChartSurface](scichartsurface.md)*

▪ **notifyPropertyChangedFn**: *function*

▸ (`propertyName`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

▪ **getColumnWidthFn**: *function*

▸ (`xCoordinateCalculator`: [CoordinateCalculatorBase](coordinatecalculatorbase.md)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`xCoordinateCalculator` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[onDetach](basestackedrenderableseries.md#ondetach)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L116)*

**Returns:** *void*

___

###  onDetachFromParentCollection

▸ **onDetachFromParentCollection**(): *void*

*Inherited from [BaseStackedRenderableSeries](basestackedrenderableseries.md).[onDetachFromParentCollection](basestackedrenderableseries.md#ondetachfromparentcollection)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseStackedRenderableSeries.ts#L67)*

**Returns:** *void*

___

###  setGroupIndex

▸ **setGroupIndex**(`value`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L78)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  setGroupsCount

▸ **setGroupsCount**(`value`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*
