[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [IRenderableSeries](irenderableseries.md)

# Interface: IRenderableSeries

**`summary`** Defines the interface to a Render Series (or Chart Type) in SciChart's High Performance Real-time
[JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
A RenderableSeries defines how data should be rendered. e.g. as a Line Chart, Mountain Chart, Candlestick Chart etc...
This is independent from the [DataSeries](../classes/basedataseries.md) which stores the data to render

See derived types of [BaseDataSeries](../classes/basedataseries.md) to find out what data-series are available.
See derived types of [IRenderableSeries](irenderableseries.md) to find out what 2D JavaScript Chart types are available.

## Hierarchy

* IDeletable

* [IThemeable](ithemeable.md)

  ↳ **IRenderableSeries**

## Implemented by

* [BaseRenderableSeries](../classes/baserenderableseries.md)
* [BaseStackedCollection](../classes/basestackedcollection.md)
* [BaseStackedRenderableSeries](../classes/basestackedrenderableseries.md)
* [FastBandRenderableSeries](../classes/fastbandrenderableseries.md)
* [FastBubbleRenderableSeries](../classes/fastbubblerenderableseries.md)
* [FastCandlestickRenderableSeries](../classes/fastcandlestickrenderableseries.md)
* [FastColumnRenderableSeries](../classes/fastcolumnrenderableseries.md)
* [FastLineRenderableSeries](../classes/fastlinerenderableseries.md)
* [FastMountainRenderableSeries](../classes/fastmountainrenderableseries.md)
* [FastOhlcRenderableSeries](../classes/fastohlcrenderableseries.md)
* [StackedColumnCollection](../classes/stackedcolumncollection.md)
* [StackedColumnRenderableSeries](../classes/stackedcolumnrenderableseries.md)
* [StackedMountainCollection](../classes/stackedmountaincollection.md)
* [StackedMountainRenderableSeries](../classes/stackedmountainrenderableseries.md)
* [UniformHeatmapRenderableSeries](../classes/uniformheatmaprenderableseries.md)
* [XyScatterRenderableSeries](../classes/xyscatterrenderableseries.md)

## Index

### Properties

* [dataSeries](irenderableseries.md#dataseries)
* [drawNaNAs](irenderableseries.md#drawnanas)
* [drawingProviders](irenderableseries.md#drawingproviders)
* [hitTestProvider](irenderableseries.md#hittestprovider)
* [id](irenderableseries.md#readonly-id)
* [invalidateParentCallback](irenderableseries.md#invalidateparentcallback)
* [isStacked](irenderableseries.md#readonly-isstacked)
* [isVisible](irenderableseries.md#isvisible)
* [paletteProvider](irenderableseries.md#paletteprovider)
* [parentSurface](irenderableseries.md#parentsurface)
* [pointMarker](irenderableseries.md#pointmarker)
* [rolloverModifierProps](irenderableseries.md#readonly-rollovermodifierprops)
* [stroke](irenderableseries.md#stroke)
* [strokeThickness](irenderableseries.md#strokethickness)
* [type](irenderableseries.md#readonly-type)
* [xAxisId](irenderableseries.md#xaxisid)
* [yAxisId](irenderableseries.md#yaxisid)

### Methods

* [applyTheme](irenderableseries.md#applytheme)
* [delete](irenderableseries.md#delete)
* [draw](irenderableseries.md#draw)
* [getBaseXValues](irenderableseries.md#getbasexvalues)
* [getDataSeriesName](irenderableseries.md#getdataseriesname)
* [getDataSeriesValuesCount](irenderableseries.md#getdataseriesvaluescount)
* [getNativeXValues](irenderableseries.md#getnativexvalues)
* [getXRange](irenderableseries.md#getxrange)
* [getYRange](irenderableseries.md#getyrange)
* [hasDataSeries](irenderableseries.md#hasdataseries)
* [hasDataSeriesValues](irenderableseries.md#hasdataseriesvalues)
* [hasStrokePaletteProvider](irenderableseries.md#hasstrokepaletteprovider)
* [onAttach](irenderableseries.md#onattach)
* [onDetach](irenderableseries.md#ondetach)

## Properties

###  dataSeries

• **dataSeries**: *[IDataSeries](idataseries.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:52](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L52)*

The [DataSeries](idataseries.md) which provides a datasource for this [IRenderableSeries](irenderableseries.md) to draw

___

###  drawNaNAs

• **drawNaNAs**: *[ELineDrawMode](../enums/elinedrawmode.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L156)*

How to treat NAN (Not a number) values in the input [dataSeries](irenderableseries.md#dataseries). See [ELineDrawMode](../enums/elinedrawmode.md) for a list of values.

___

###  drawingProviders

• **drawingProviders**: *[ISeriesDrawingProvider](iseriesdrawingprovider.md)[]*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:135](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L135)*

Gets a list of [Series Drawing Providers](iseriesdrawingprovider.md), which perform specific drawing operations in the series

___

###  hitTestProvider

• **hitTestProvider**: *[IHitTestProvider](ihittestprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L140)*

Gets the current [IHitTestProvider](ihittestprovider.md), used to call methods [IHitTestProvider.hitTest](ihittestprovider.md#hittest), [IHitTestProvider.getNearestPoint2D](ihittestprovider.md#getnearestpoint2d)
and [IHitTestProvider.getNearestHorizontalPoint](ihittestprovider.md#getnearesthorizontalpoint) and provide info about the series data-points at mouse or touch locations

___

### `Readonly` id

• **id**: *string*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L32)*

A unique, auto-generated Id for the [IRenderableSeries](irenderableseries.md)

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:148](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L148)*

A callback which tells the parent [SciChartSurface](../classes/scichartsurface.md) that it must be redrawn, e.g. when a property changes

#### Type declaration:

▸ (): *void*

___

### `Readonly` isStacked

• **isStacked**: *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L40)*

Returns true if the series is a stacked series or not

___

###  isVisible

• **isVisible**: *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:144](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L144)*

When true, the series is visible and drawn

___

###  paletteProvider

• **paletteProvider**: *[IPaletteProvider](ipaletteprovider.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:163](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L163)*

An optional [IPaletteProvider](ipaletteprovider.md) which is used to provide per data-point coloring or paletting.

**`remarks`** See [IStrokePaletteProvider](istrokepaletteprovider.md) for per data-point coloring of lines or strokes, [IFillPaletteProvider](ifillpaletteprovider.md) for
per data-point coloring of fills or series bodies, and [IPointMarkerPaletteProvider](ipointmarkerpaletteprovider.md) for per data-point coloring of
point-markers

___

###  parentSurface

• **parentSurface**: *[SciChartSurface](../classes/scichartsurface.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L48)*

The parent [SciChartSurface](../classes/scichartsurface.md) that this RenderableSeries is attached to

___

###  pointMarker

• **pointMarker**: *[IPointMarker](ipointmarker.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:152](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L152)*

A [Point Marker](ipointmarker.md) which is used to draw an optional point-marker at each data-point. Applicable to some series types only

___

### `Readonly` rolloverModifierProps

• **rolloverModifierProps**: *[RolloverModifierRenderableSeriesProps](../classes/rollovermodifierrenderableseriesprops.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L44)*

Gets or sets [RolloverModifierRenderableSeriesProps](../classes/rollovermodifierrenderableseriesprops.md) for [RolloverModifier](../classes/rollovermodifier.md) tooltips

___

###  stroke

• **stroke**: *string*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:57](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L57)*

A Stroke for lines, outlines and edges of this RenderableSeries

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  strokeThickness

• **strokeThickness**: *number*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:61](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L61)*

The Stroke Thickness for lines, outlines and edges of this RenderableSeries

___

### `Readonly` type

• **type**: *ESeriesType*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L36)*

Returns the type of the series. See {@link ESeriesType} for a list of values

___

###  xAxisId

• **xAxisId**: *string*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L96)*

**`summary`** The current XAxis Id that this [IRenderableSeries](irenderableseries.md) is bound to

**`description`** By default all series will draw on the first X,Y axis pair in SciChart.
If you want this to change, you must add a second axis to your [SciChartSurface](../classes/scichartsurface.md) and link the [BaseRenderableSeries](../classes/baserenderableseries.md) by Axis Id.

For example:
```ts
const sciChartSurface: SciChartSurface;
const primaryXAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
const primaryYAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID

const secondaryXAxis = new NumericAxis(wasmContext); // For subsequent X,Y axis set an Id
secondaryXAxis.id = "SecondaryXAxis";
const secondaryYAxis = new NumericAxis(wasmContext);
secondaryYAxis.id = "SecondaryYAxis";

// Add all Axis to the chart
sciChartSurface.xAxes.add(primaryXAxis);
sciChartSurface.yAxes.add(primaryYAxis);
sciChartSurface.xAxes.add(secondaryXAxis);
sciChartSurface.yAxes.add(secondaryYAxis);

// Add a series on the default axis
const renderSeries = new FastLineRenderableSeries(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
sciChartSurface.renderableSeries.add(renderSeries);

// Add a series on the specific axis
const renderSeries2 = new FastLineRenderableSeries(wasmContext);
renderSeries2.xAxisId = "SecondaryXAxis";
renderSeries2.yAxisId = "SecondaryYAxis";
sciChartSurface.renderableSeries.add(renderSeries2);
```

**`remarks`** The default value is set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id).

___

###  yAxisId

• **yAxisId**: *string*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L131)*

**`summary`** The current YAxis Id that this [IRenderableSeries](irenderableseries.md) is bound to

**`description`** By default all series will draw on the first X,Y axis pair in SciChart.
If you want this to change, you must add a second axis to your [SciChartSurface](../classes/scichartsurface.md) and link the [BaseRenderableSeries](../classes/baserenderableseries.md) by Axis Id.

For example:
```ts
const sciChartSurface: SciChartSurface;
const primaryXAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
const primaryYAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID

const secondaryXAxis = new NumericAxis(wasmContext); // For subsequent X,Y axis set an Id
secondaryXAxis.id = "SecondaryXAxis";
const secondaryYAxis = new NumericAxis(wasmContext);
secondaryYAxis.id = "SecondaryYAxis";

// Add all Axis to the chart
sciChartSurface.xAxes.add(primaryXAxis);
sciChartSurface.yAxes.add(primaryYAxis);
sciChartSurface.xAxes.add(secondaryXAxis);
sciChartSurface.yAxes.add(secondaryYAxis);

// Add a series on the default axis
const renderSeries = new FastLineRenderableSeries(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
sciChartSurface.renderableSeries.add(renderSeries);

// Add a series on the specific axis
const renderSeries2 = new FastLineRenderableSeries(wasmContext);
renderSeries2.xAxisId = "SecondaryXAxis";
renderSeries2.yAxisId = "SecondaryYAxis";
sciChartSurface.renderableSeries.add(renderSeries2);
```

**`remarks`** The default value is set to [AxisCore.DEFAULT_AXIS_ID](../classes/axiscore.md#static-readonly-default_axis_id).

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](ithemeprovider.md)): *void*

*Overrides [IThemeable](ithemeable.md).[applyTheme](ithemeable.md#applytheme)*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:198](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L198)*

**`inheritdoc`** 

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](ithemeprovider.md) |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

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

▸ **draw**(`renderContext`: [WebGlRenderContext2D](../classes/webglrendercontext2d.md), `renderPassData`: [RenderPassData](../classes/renderpassdata.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L170)*

Called when the [BaseRenderableSeries](../classes/baserenderableseries.md) must be drawn

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`renderContext` | [WebGlRenderContext2D](../classes/webglrendercontext2d.md) | The {@link WebGL2RenderingContext} with methods for drawing on the WebGL Canvas via our WebAssembly Rendering Engine |
`renderPassData` | [RenderPassData](../classes/renderpassdata.md) | The [RenderPassData](../classes/renderpassdata.md) containing data about the current rendering pass  |

**Returns:** *void*

___

###  getBaseXValues

▸ **getBaseXValues**(): *number[]*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:219](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L219)*

Returns the [IDataSeries.getNativeXValues](idataseries.md#getnativexvalues) as a JavaScript array for the primary / base series in the [SciChartSurface](../classes/scichartsurface.md)

**Returns:** *number[]*

___

###  getDataSeriesName

▸ **getDataSeriesName**(): *string*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:223](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L223)*

Returns the associated [IDataSeries.dataSeriesName](idataseries.md#dataseriesname)

**Returns:** *string*

___

###  getDataSeriesValuesCount

▸ **getDataSeriesValuesCount**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:215](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L215)*

Returns [IDataSeries.count](idataseries.md#count) for the linked [dataSeries](irenderableseries.md#dataseries)

**Returns:** *number*

___

###  getNativeXValues

▸ **getNativeXValues**(): *DoubleVector*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:227](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L227)*

Returns the [IDataSeries.getNativeXValues](idataseries.md#getnativexvalues) for the associated [dataSeries](irenderableseries.md#dataseries)

**Returns:** *DoubleVector*

___

###  getXRange

▸ **getXRange**(): *NumberRange*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:175](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L175)*

Gets the X-Range of the series. Override in derived classes to provide series specific implementations

**Returns:** *NumberRange*

___

###  getYRange

▸ **getYRange**(`xVisibleRange`: NumberRange, `isXCategoryAxis`: boolean): *NumberRange*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:182](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L182)*

Gets the Y-Range of the series for the current X-Range. Override in derived classes to provide series specific implementations

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xVisibleRange` | NumberRange | The [AxisCore.visibleRange](../classes/axiscore.md#visiblerange) for the current bound XAxis |
`isXCategoryAxis` | boolean | Whether the current bound [XAxis](../classes/axisbase2d.md) is a Category axis  |

**Returns:** *NumberRange*

___

###  hasDataSeries

▸ **hasDataSeries**(): *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:211](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L211)*

Returns true if the [BaseRenderableSeries](../classes/baserenderableseries.md) has a [dataSeries](irenderableseries.md#dataseries)

**Returns:** *boolean*

___

###  hasDataSeriesValues

▸ **hasDataSeriesValues**(): *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:207](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L207)*

Returns true if the [BaseRenderableSeries](../classes/baserenderableseries.md) has a [dataSeries](irenderableseries.md#dataseries) and [IDataSeries.hasValues](idataseries.md#hasvalues) is true

**Returns:** *boolean*

___

###  hasStrokePaletteProvider

▸ **hasStrokePaletteProvider**(): *boolean*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:202](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L202)*

Returns true if the [BaseRenderableSeries](../classes/baserenderableseries.md) has an IStrokePaletteProvider

**Returns:** *boolean*

___

###  onAttach

▸ **onAttach**(`scs`: [SciChartSurface](../classes/scichartsurface.md)): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:188](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L188)*

Called when the [BaseRenderableSeries](../classes/baserenderableseries.md) is attached to a parent [SciChartSurface](../classes/scichartsurface.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scs` | [SciChartSurface](../classes/scichartsurface.md) | the [SciChartSurface](../classes/scichartsurface.md) that this series has been attached to  |

**Returns:** *void*

___

###  onDetach

▸ **onDetach**(): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts:193](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/IRenderableSeries.ts#L193)*

Called when the [BaseRenderableSeries](../classes/baserenderableseries.md) is detached from a [SciChartSurface](../classes/scichartsurface.md)

**Returns:** *void*
