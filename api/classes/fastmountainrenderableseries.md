[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [FastMountainRenderableSeries](fastmountainrenderableseries.md)

# Class: FastMountainRenderableSeries

## Hierarchy

* [BaseRenderableSeries](baserenderableseries.md)

  ↳ **FastMountainRenderableSeries**

## Implements

* [IRenderableSeries](../interfaces/irenderableseries.md)

## Index

### Constructors

* [constructor](fastmountainrenderableseries.md#constructor)

### Properties

* [drawingProviders](fastmountainrenderableseries.md#drawingproviders)
* [hitTestProvider](fastmountainrenderableseries.md#hittestprovider)
* [id](fastmountainrenderableseries.md#readonly-id)
* [invalidateParentCallback](fastmountainrenderableseries.md#invalidateparentcallback)
* [isStacked](fastmountainrenderableseries.md#readonly-isstacked)
* [parentSurface](fastmountainrenderableseries.md#parentsurface)
* [rolloverModifierProps](fastmountainrenderableseries.md#readonly-rollovermodifierprops)
* [type](fastmountainrenderableseries.md#readonly-type)

### Accessors

* [dataSeries](fastmountainrenderableseries.md#dataseries)
* [drawNaNAs](fastmountainrenderableseries.md#drawnanas)
* [effect](fastmountainrenderableseries.md#effect)
* [fill](fastmountainrenderableseries.md#fill)
* [fillLinearGradient](fastmountainrenderableseries.md#filllineargradient)
* [isVisible](fastmountainrenderableseries.md#isvisible)
* [paletteProvider](fastmountainrenderableseries.md#paletteprovider)
* [pointMarker](fastmountainrenderableseries.md#pointmarker)
* [stroke](fastmountainrenderableseries.md#stroke)
* [strokeThickness](fastmountainrenderableseries.md#strokethickness)
* [xAxis](fastmountainrenderableseries.md#xaxis)
* [xAxisId](fastmountainrenderableseries.md#xaxisid)
* [yAxis](fastmountainrenderableseries.md#yaxis)
* [yAxisId](fastmountainrenderableseries.md#yaxisid)
* [zeroLineY](fastmountainrenderableseries.md#zeroliney)

### Methods

* [applyTheme](fastmountainrenderableseries.md#applytheme)
* [delete](fastmountainrenderableseries.md#delete)
* [draw](fastmountainrenderableseries.md#draw)
* [getBaseXValues](fastmountainrenderableseries.md#getbasexvalues)
* [getDataPointWidth](fastmountainrenderableseries.md#getdatapointwidth)
* [getDataSeriesName](fastmountainrenderableseries.md#getdataseriesname)
* [getDataSeriesValuesCount](fastmountainrenderableseries.md#getdataseriesvaluescount)
* [getNativeXValues](fastmountainrenderableseries.md#getnativexvalues)
* [getNativeYValues](fastmountainrenderableseries.md#getnativeyvalues)
* [getXRange](fastmountainrenderableseries.md#getxrange)
* [getYRange](fastmountainrenderableseries.md#getyrange)
* [hasDataSeries](fastmountainrenderableseries.md#hasdataseries)
* [hasDataSeriesValues](fastmountainrenderableseries.md#hasdataseriesvalues)
* [hasStrokePaletteProvider](fastmountainrenderableseries.md#hasstrokepaletteprovider)
* [notifyPropertyChanged](fastmountainrenderableseries.md#notifypropertychanged)
* [onAttach](fastmountainrenderableseries.md#onattach)
* [onDetach](fastmountainrenderableseries.md#ondetach)

## Constructors

###  constructor

\+ **new FastMountainRenderableSeries**(`webAssemblyContext`: TSciChart, `options?`: [IMountainRenderableSeriesOptions](../interfaces/imountainrenderableseriesoptions.md)): *[FastMountainRenderableSeries](fastmountainrenderableseries.md)*

*Overrides [BaseRenderableSeries](baserenderableseries.md).[constructor](baserenderableseries.md#constructor)*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`options?` | [IMountainRenderableSeriesOptions](../interfaces/imountainrenderableseriesoptions.md) |

**Returns:** *[FastMountainRenderableSeries](fastmountainrenderableseries.md)*

## Properties

###  drawingProviders

• **drawingProviders**: *[ISeriesDrawingProvider](../interfaces/iseriesdrawingprovider.md)[]* = []

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[drawingProviders](../interfaces/irenderableseries.md#drawingproviders)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[drawingProviders](baserenderableseries.md#drawingproviders)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L147)*

Gets a list of [Series Drawing Providers](../interfaces/iseriesdrawingprovider.md), which perform specific drawing operations in the series

___

###  hitTestProvider

• **hitTestProvider**: *[IHitTestProvider](../interfaces/ihittestprovider.md)*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[hitTestProvider](../interfaces/irenderableseries.md#hittestprovider)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[hitTestProvider](baserenderableseries.md#hittestprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:149](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L149)*

Gets the current [IHitTestProvider](../interfaces/ihittestprovider.md), used to call methods [IHitTestProvider.hitTest](../interfaces/ihittestprovider.md#hittest), [IHitTestProvider.getNearestPoint2D](../interfaces/ihittestprovider.md#getnearestpoint2d)
and [IHitTestProvider.getNearestHorizontalPoint](../interfaces/ihittestprovider.md#getnearesthorizontalpoint) and provide info about the series data-points at mouse or touch locations

___

### `Readonly` id

• **id**: *string* = generateGuid()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[id](../interfaces/irenderableseries.md#readonly-id)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[id](baserenderableseries.md#readonly-id)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:137](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L137)*

A unique, auto-generated Id for the [IRenderableSeries](../interfaces/irenderableseries.md)

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[invalidateParentCallback](../interfaces/irenderableseries.md#invalidateparentcallback)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[invalidateParentCallback](baserenderableseries.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:145](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L145)*

A callback which tells the parent [SciChartSurface](scichartsurface.md) that it must be redrawn, e.g. when a property changes

#### Type declaration:

▸ (): *void*

___

### `Readonly` isStacked

• **isStacked**: *false* = false

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[isStacked](../interfaces/irenderableseries.md#readonly-isstacked)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[isStacked](baserenderableseries.md#readonly-isstacked)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L139)*

Returns true if the series is a stacked series or not

___

###  parentSurface

• **parentSurface**: *[SciChartSurface](scichartsurface.md)*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[parentSurface](../interfaces/irenderableseries.md#parentsurface)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[parentSurface](baserenderableseries.md#parentsurface)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:143](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L143)*

The parent [SciChartSurface](scichartsurface.md) that this RenderableSeries is attached to

___

### `Readonly` rolloverModifierProps

• **rolloverModifierProps**: *[RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md)‹›* = new RolloverModifierRenderableSeriesProps()

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[rolloverModifierProps](../interfaces/irenderableseries.md#readonly-rollovermodifierprops)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[rolloverModifierProps](baserenderableseries.md#readonly-rollovermodifierprops)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:141](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L141)*

Gets or sets [RolloverModifierRenderableSeriesProps](rollovermodifierrenderableseriesprops.md) for [RolloverModifier](rollovermodifier.md) tooltips

___

### `Readonly` type

• **type**: *FastMountainRenderableSeries* = ESeriesType.FastMountainRenderableSeries

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md).[type](../interfaces/irenderableseries.md#readonly-type)*

*Overrides [BaseRenderableSeries](baserenderableseries.md).[type](baserenderableseries.md#readonly-abstract-type)*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:19](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L19)*

## Accessors

###  dataSeries

• **get dataSeries**(): *[IDataSeries](../interfaces/idataseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[dataSeries](baserenderableseries.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:296](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L296)*

The [DataSeries](../interfaces/idataseries.md) which provides a datasource for this [IRenderableSeries](../interfaces/irenderableseries.md) to draw

**`inheritdoc`** 

**Returns:** *[IDataSeries](../interfaces/idataseries.md)*

• **set dataSeries**(`dataSeries`: [IDataSeries](../interfaces/idataseries.md)): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[dataSeries](baserenderableseries.md#dataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:300](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L300)*

The [DataSeries](../interfaces/idataseries.md) which provides a datasource for this [IRenderableSeries](../interfaces/irenderableseries.md) to draw

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`dataSeries` | [IDataSeries](../interfaces/idataseries.md) |

**Returns:** *void*

___

###  drawNaNAs

• **get drawNaNAs**(): *[ELineDrawMode](../enums/elinedrawmode.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[drawNaNAs](baserenderableseries.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:235](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L235)*

How to treat NAN (Not a number) values in the input [dataSeries](fastmountainrenderableseries.md#dataseries). See [ELineDrawMode](../enums/elinedrawmode.md) for a list of values.

**`inheritdoc`** 

**Returns:** *[ELineDrawMode](../enums/elinedrawmode.md)*

• **set drawNaNAs**(`drawNaNAs`: [ELineDrawMode](../enums/elinedrawmode.md)): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[drawNaNAs](baserenderableseries.md#drawnanas)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:239](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L239)*

How to treat NAN (Not a number) values in the input [dataSeries](fastmountainrenderableseries.md#dataseries). See [ELineDrawMode](../enums/elinedrawmode.md) for a list of values.

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`drawNaNAs` | [ELineDrawMode](../enums/elinedrawmode.md) |

**Returns:** *void*

___

###  effect

• **get effect**(): *[ShaderEffect](shadereffect.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[effect](baserenderableseries.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:310](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L310)*

Gets an optional [ShaderEffect](shadereffect.md) for modifying the render output of this [IRenderableSeries](../interfaces/irenderableseries.md)

**`remarks`** Options include [GlowEffect](gloweffect.md) and [ShadowEffect](shadoweffect.md). Apply an effect to see how it modifies rendering!

**Returns:** *[ShaderEffect](shadereffect.md)*

• **set effect**(`effect`: [ShaderEffect](shadereffect.md)): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[effect](baserenderableseries.md#effect)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:317](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L317)*

Sets an optional [ShaderEffect](shadereffect.md) for modifying the render output of this [IRenderableSeries](../interfaces/irenderableseries.md)

**`remarks`** Options include [GlowEffect](gloweffect.md) and [ShadowEffect](shadoweffect.md). Apply an effect to see how it modifies rendering!

**Parameters:**

Name | Type |
------ | ------ |
`effect` | [ShaderEffect](shadereffect.md) |

**Returns:** *void*

___

###  fill

• **get fill**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L43)*

**Returns:** *string*

• **set fill**(`htmlColorCode`: string): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *void*

___

###  fillLinearGradient

• **get fillLinearGradient**(): *GradientParams‹›*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:61](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L61)*

**Returns:** *GradientParams‹›*

• **set fillLinearGradient**(`gradientBrushParams`: GradientParams): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`gradientBrushParams` | GradientParams |

**Returns:** *void*

___

###  isVisible

• **get isVisible**(): *boolean*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[isVisible](baserenderableseries.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:209](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L209)*

When true, the series is visible and drawn

**`inheritdoc`** 

**Returns:** *boolean*

• **set isVisible**(`isVisible`: boolean): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[isVisible](baserenderableseries.md#isvisible)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:213](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L213)*

When true, the series is visible and drawn

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`isVisible` | boolean |

**Returns:** *void*

___

###  paletteProvider

• **get paletteProvider**(): *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[paletteProvider](baserenderableseries.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:198](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L198)*

An optional [IPaletteProvider](../interfaces/ipaletteprovider.md) which is used to provide per data-point coloring or paletting.

**`inheritdoc`** 

**Returns:** *[IPaletteProvider](../interfaces/ipaletteprovider.md)*

• **set paletteProvider**(`paletteProvider`: [IPaletteProvider](../interfaces/ipaletteprovider.md)): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[paletteProvider](baserenderableseries.md#paletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:202](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L202)*

An optional [IPaletteProvider](../interfaces/ipaletteprovider.md) which is used to provide per data-point coloring or paletting.

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`paletteProvider` | [IPaletteProvider](../interfaces/ipaletteprovider.md) |

**Returns:** *void*

___

###  pointMarker

• **get pointMarker**(): *[IPointMarker](../interfaces/ipointmarker.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[pointMarker](baserenderableseries.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:218](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L218)*

A [Point Marker](../interfaces/ipointmarker.md) which is used to draw an optional point-marker at each data-point. Applicable to some series types only

**`inheritdoc`** 

**Returns:** *[IPointMarker](../interfaces/ipointmarker.md)*

• **set pointMarker**(`pointMarker`: [IPointMarker](../interfaces/ipointmarker.md)): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[pointMarker](baserenderableseries.md#pointmarker)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:222](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L222)*

A [Point Marker](../interfaces/ipointmarker.md) which is used to draw an optional point-marker at each data-point. Applicable to some series types only

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`pointMarker` | [IPointMarker](../interfaces/ipointmarker.md) |

**Returns:** *void*

___

###  stroke

• **get stroke**(): *string*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[stroke](baserenderableseries.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:244](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L244)*

A Stroke for lines, outlines and edges of this RenderableSeries

**`inheritdoc`** 

**Returns:** *string*

• **set stroke**(`htmlColorCode`: string): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[stroke](baserenderableseries.md#stroke)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:248](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L248)*

A Stroke for lines, outlines and edges of this RenderableSeries

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`htmlColorCode` | string |

**Returns:** *void*

___

###  strokeThickness

• **get strokeThickness**(): *number*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[strokeThickness](baserenderableseries.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:253](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L253)*

The Stroke Thickness for lines, outlines and edges of this RenderableSeries

**`inheritdoc`** 

**Returns:** *number*

• **set strokeThickness**(`value`: number): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[strokeThickness](baserenderableseries.md#strokethickness)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:257](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L257)*

The Stroke Thickness for lines, outlines and edges of this RenderableSeries

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  xAxis

• **get xAxis**(): *[AxisCore](axiscore.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[xAxis](baserenderableseries.md#xaxis)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:275](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L275)*

Gets the bound [XAxis](axiscore.md) for this [BaseRenderableSeries](baserenderableseries.md).

**`remarks`** Does a lookup search on [SciChartSurface.xAxes](scichartsurface.md#readonly-xaxes) collection by Id matching [this.xAxisId](fastmountainrenderableseries.md#xaxisid)

**Returns:** *[AxisCore](axiscore.md)*

___

###  xAxisId

• **get xAxisId**(): *string*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[xAxisId](baserenderableseries.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:262](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L262)*

**`inheritdoc`** 

**Returns:** *string*

• **set xAxisId**(`id`: string): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[xAxisId](baserenderableseries.md#xaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:266](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L266)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

___

###  yAxis

• **get yAxis**(): *[AxisCore](axiscore.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[yAxis](baserenderableseries.md#yaxis)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:283](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L283)*

Gets the bound [XAxis](axiscore.md) for this [BaseRenderableSeries](baserenderableseries.md).

**`remarks`** Does a lookup search on [SciChartSurface.yAxes](scichartsurface.md#readonly-yaxes) collection by Id matching [this.yAxisId](fastmountainrenderableseries.md#yaxisid)

**Returns:** *[AxisCore](axiscore.md)*

___

###  yAxisId

• **get yAxisId**(): *string*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[yAxisId](baserenderableseries.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:287](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L287)*

**`inheritdoc`** 

**Returns:** *string*

• **set yAxisId**(`id`: string): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[yAxisId](baserenderableseries.md#yaxisid)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:291](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L291)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

___

###  zeroLineY

• **get zeroLineY**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:52](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L52)*

**Returns:** *number*

• **set zeroLineY**(`zeroLineY`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`zeroLineY` | number |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Overrides [BaseRenderableSeries](baserenderableseries.md).[applyTheme](baserenderableseries.md#applytheme)*

*Defined in [src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[delete](baserenderableseries.md#delete)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:335](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L335)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `renderPassData`: [RenderPassData](renderpassdata.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[draw](baserenderableseries.md#draw)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:324](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L324)*

Called when the [BaseRenderableSeries](baserenderableseries.md) must be drawn

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) | The {@link WebGL2RenderingContext} with methods for drawing on the WebGL Canvas via our WebAssembly Rendering Engine |
`renderPassData` | [RenderPassData](renderpassdata.md) | The [RenderPassData](renderpassdata.md) containing data about the current rendering pass  |

**Returns:** *void*

___

###  getBaseXValues

▸ **getBaseXValues**(): *number[]*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getBaseXValues](baserenderableseries.md#getbasexvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:403](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L403)*

Returns the [IDataSeries.getNativeXValues](../interfaces/idataseries.md#getnativexvalues) as a JavaScript array for the primary / base series in the [SciChartSurface](scichartsurface.md)

**Returns:** *number[]*

___

###  getDataPointWidth

▸ **getDataPointWidth**(`xCoordCalc`: [CoordinateCalculatorBase](coordinatecalculatorbase.md), `widthFraction`: number): *number*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getDataPointWidth](baserenderableseries.md#getdatapointwidth)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:358](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L358)*

**`description`** Calculates data point width in pixels

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xCoordCalc` | [CoordinateCalculatorBase](coordinatecalculatorbase.md) | - |
`widthFraction` | number |   |

**Returns:** *number*

___

###  getDataSeriesName

▸ **getDataSeriesName**(): *string*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getDataSeriesName](baserenderableseries.md#getdataseriesname)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:412](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L412)*

Returns the associated [IDataSeries.dataSeriesName](../interfaces/idataseries.md#dataseriesname)

**Returns:** *string*

___

###  getDataSeriesValuesCount

▸ **getDataSeriesValuesCount**(): *number*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getDataSeriesValuesCount](baserenderableseries.md#getdataseriesvaluescount)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:399](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L399)*

Returns [IDataSeries.count](../interfaces/idataseries.md#count) for the linked [dataSeries](fastmountainrenderableseries.md#dataseries)

**Returns:** *number*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getNativeXValues](baserenderableseries.md#getnativexvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:416](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L416)*

Returns the [IDataSeries.getNativeXValues](../interfaces/idataseries.md#getnativexvalues) for the associated [dataSeries](fastmountainrenderableseries.md#dataseries)

**Returns:** *DoubleVector*

___

###  getNativeYValues

▸ **getNativeYValues**(): *DoubleVector*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getNativeYValues](baserenderableseries.md#getnativeyvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:420](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L420)*

**Returns:** *DoubleVector*

___

###  getXRange

▸ **getXRange**(): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getXRange](baserenderableseries.md#getxrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:340](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L340)*

Gets the X-Range of the series. Override in derived classes to provide series specific implementations

**Returns:** *NumberRange*

___

###  getYRange

▸ **getYRange**(`xVisibleRange`: NumberRange, `isXCategoryAxis`: boolean): *NumberRange*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[getYRange](baserenderableseries.md#getyrange)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:344](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L344)*

Gets the Y-Range of the series for the current X-Range. Override in derived classes to provide series specific implementations

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`xVisibleRange` | NumberRange | - | The [AxisCore.visibleRange](axiscore.md#visiblerange) for the current bound XAxis |
`isXCategoryAxis` | boolean | false | Whether the current bound [XAxis](axisbase2d.md) is a Category axis  |

**Returns:** *NumberRange*

___

###  hasDataSeries

▸ **hasDataSeries**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[hasDataSeries](baserenderableseries.md#hasdataseries)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:395](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L395)*

Returns true if the [BaseRenderableSeries](baserenderableseries.md) has a [dataSeries](fastmountainrenderableseries.md#dataseries)

**Returns:** *boolean*

___

###  hasDataSeriesValues

▸ **hasDataSeriesValues**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[hasDataSeriesValues](baserenderableseries.md#hasdataseriesvalues)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:391](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L391)*

Returns true if the [BaseRenderableSeries](baserenderableseries.md) has a [dataSeries](fastmountainrenderableseries.md#dataseries) and [IDataSeries.hasValues](../interfaces/idataseries.md#hasvalues) is true

**Returns:** *boolean*

___

###  hasStrokePaletteProvider

▸ **hasStrokePaletteProvider**(): *boolean*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[hasStrokePaletteProvider](baserenderableseries.md#hasstrokepaletteprovider)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:386](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L386)*

Returns true if the [BaseRenderableSeries](baserenderableseries.md) has an IStrokePaletteProvider

**Returns:** *boolean*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[notifyPropertyChanged](baserenderableseries.md#notifypropertychanged)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:348](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L348)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurface](scichartsurface.md)): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[onAttach](baserenderableseries.md#onattach)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:372](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L372)*

Called when the [BaseRenderableSeries](baserenderableseries.md) is attached to a parent [SciChartSurface](scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scs` | [SciChartSurface](scichartsurface.md) | the [SciChartSurface](scichartsurface.md) that this series has been attached to  |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Implementation of [IRenderableSeries](../interfaces/irenderableseries.md)*

*Inherited from [BaseRenderableSeries](baserenderableseries.md).[onDetach](baserenderableseries.md#ondetach)*

*Defined in [src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts:365](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/BaseRenderableSeries.ts#L365)*

Called when the [BaseRenderableSeries](baserenderableseries.md) is detached from a [SciChartSurface](scichartsurface.md)

**Returns:** *void*
