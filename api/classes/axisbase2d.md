[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [AxisBase2D](axisbase2d.md)

# Class: AxisBase2D

## Hierarchy

* [AxisCore](axiscore.md)

  ↳ **AxisBase2D**

  ↳ [NumericAxis](numericaxis.md)

  ↳ [CategoryAxis](categoryaxis.md)

## Implements

* [IAxisParams](../interfaces/iaxisparams.md)
* [IThemeable](../interfaces/ithemeable.md)

## Index

### Properties

* [axisLayoutState](axisbase2d.md#readonly-axislayoutstate)
* [axisRenderer](axisbase2d.md#readonly-axisrenderer)
* [axisTitleRenderer](axisbase2d.md#readonly-axistitlerenderer)
* [invalidateParentCallback](axisbase2d.md#invalidateparentcallback)
* [parentSurface](axisbase2d.md#parentsurface)
* [type](axisbase2d.md#readonly-abstract-type)
* [viewRect](axisbase2d.md#viewrect)
* [visibleRangeChanged](axisbase2d.md#visiblerangechanged)
* [DEFAULT_AXIS_ID](axisbase2d.md#static-readonly-default_axis_id)

### Accessors

* [autoRange](axisbase2d.md#autorange)
* [autoTicks](axisbase2d.md#autoticks)
* [axisAlignment](axisbase2d.md#axisalignment)
* [axisBandsFill](axisbase2d.md#axisbandsfill)
* [axisTitle](axisbase2d.md#axistitle)
* [cursorTextFormatting](axisbase2d.md#cursortextformatting)
* [deltaCalculator](axisbase2d.md#deltacalculator)
* [drawLabels](axisbase2d.md#drawlabels)
* [drawMajorBands](axisbase2d.md#drawmajorbands)
* [drawMajorGridLines](axisbase2d.md#drawmajorgridlines)
* [drawMajorTickLines](axisbase2d.md#drawmajorticklines)
* [drawMinorGridLines](axisbase2d.md#drawminorgridlines)
* [drawMinorTickLines](axisbase2d.md#drawminorticklines)
* [flippedCoordinates](axisbase2d.md#flippedcoordinates)
* [growBy](axisbase2d.md#growby)
* [hasDefaultVisibleRange](axisbase2d.md#hasdefaultvisiblerange)
* [hasValidVisibleRange](axisbase2d.md#hasvalidvisiblerange)
* [id](axisbase2d.md#id)
* [isAxisFlipped](axisbase2d.md#isaxisflipped)
* [isHorizontalAxis](axisbase2d.md#ishorizontalaxis)
* [isPrimaryAxis](axisbase2d.md#isprimaryaxis)
* [isVerticalChart](axisbase2d.md#isverticalchart)
* [isVisible](axisbase2d.md#isvisible)
* [isXAxis](axisbase2d.md#isxaxis)
* [labelProvider](axisbase2d.md#labelprovider)
* [labelStyle](axisbase2d.md#labelstyle)
* [majorDelta](axisbase2d.md#majordelta)
* [majorGridLineStyle](axisbase2d.md#majorgridlinestyle)
* [majorTickLineStyle](axisbase2d.md#majorticklinestyle)
* [maxAutoTicks](axisbase2d.md#maxautoticks)
* [minorDelta](axisbase2d.md#minordelta)
* [minorGridLineStyle](axisbase2d.md#minorgridlinestyle)
* [minorTickLineStyle](axisbase2d.md#minorticklinestyle)
* [minorsPerMajor](axisbase2d.md#minorspermajor)
* [textFormatting](axisbase2d.md#textformatting)
* [tickProvider](axisbase2d.md#tickprovider)
* [tickTextBrush](axisbase2d.md#ticktextbrush)
* [titleStyle](axisbase2d.md#titlestyle)
* [visibleRange](axisbase2d.md#visiblerange)
* [visibleRangeLimit](axisbase2d.md#visiblerangelimit)

### Methods

* [animateVisibleRange](axisbase2d.md#animatevisiblerange)
* [applyTheme](axisbase2d.md#applytheme)
* [draw](axisbase2d.md#draw)
* [drawDebug](axisbase2d.md#drawdebug)
* [getCurrentCoordinateCalculator](axisbase2d.md#abstract-getcurrentcoordinatecalculator)
* [getDefaultNonZeroRange](axisbase2d.md#getdefaultnonzerorange)
* [getMaximumRange](axisbase2d.md#getmaximumrange)
* [getWindowedYRange](axisbase2d.md#getwindowedyrange)
* [isValidRange](axisbase2d.md#isvalidrange)
* [measure](axisbase2d.md#measure)
* [prepareRenderData](axisbase2d.md#preparerenderdata)
* [scroll](axisbase2d.md#scroll)
* [zoom](axisbase2d.md#zoom)
* [zoomBy](axisbase2d.md#zoomby)

## Properties

### `Readonly` axisLayoutState

• **axisLayoutState**: *[AxisLayoutState](axislayoutstate.md)* = new AxisLayoutState()

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:70](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L70)*

___

### `Readonly` axisRenderer

• **axisRenderer**: *[AxisRenderer](axisrenderer.md)*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:68](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L68)*

___

### `Readonly` axisTitleRenderer

• **axisTitleRenderer**: *[AxisTitleRenderer](axistitlerenderer.md)*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L69)*

___

###  invalidateParentCallback

• **invalidateParentCallback**: *function*

*Inherited from [AxisCore](axiscore.md).[invalidateParentCallback](axiscore.md#invalidateparentcallback)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:224](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L224)*

Callback to invalidate the parent 2D [SciChartSurface](scichartsurface.md) or 3D [SciChart3DSurface](scichart3dsurface.md)

#### Type declaration:

▸ (): *void*

___

###  parentSurface

• **parentSurface**: *[SciChartSurface](scichartsurface.md)*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L67)*

___

### `Readonly` `Abstract` type

• **type**: *EAxisType*

*Inherited from [AxisCore](axiscore.md).[type](axiscore.md#readonly-abstract-type)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:220](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L220)*

The type of axis. See {@link EAxisType} for a list of values

___

###  viewRect

• **viewRect**: *Rect*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:71](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L71)*

___

###  visibleRangeChanged

• **visibleRangeChanged**: *EventHandler‹[VisibleRangeChangedArgs](visiblerangechangedargs.md)›* = new EventHandler<VisibleRangeChangedArgs>()

*Inherited from [AxisCore](axiscore.md).[visibleRangeChanged](axiscore.md#visiblerangechanged)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:229](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L229)*

An {@link EventHandler} which fires a callback when the [AxisCore.visibleRange](axiscore.md#visiblerange) property changes.

**`desc`** 

___

### `Static` `Readonly` DEFAULT_AXIS_ID

▪ **DEFAULT_AXIS_ID**: *"DefaultAxisId"* = "DefaultAxisId"

*Inherited from [AxisCore](axiscore.md).[DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:216](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L216)*

The Default [AxisCore.id](axiscore.md#id)

**`description`** 
By default all axis in SciChart have Id=[AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). Also, all [RenderableSeries](baserenderableseries.md)
have an xAxisId and yAxisId property set to [AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). [Annotations](annotationbase.md) also have an xAxisId and
yAxisId also set to [AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). Some [Chart Modifiers](chartmodifierbase.md) have an x,yAxisId property to filter
their operations to an axis.

In multi-axis scenarios you will need to set the xAxisId/yAxisId properties of series, annotations, modifiers to match that of the axis
you want them to be registered on.

## Accessors

###  autoRange

• **get autoRange**(): *EAutoRange*

*Inherited from [AxisCore](axiscore.md).[autoRange](axiscore.md#autorange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:884](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L884)*

**Returns:** *EAutoRange*

• **set autoRange**(`autoRange`: EAutoRange): *void*

*Inherited from [AxisCore](axiscore.md).[autoRange](axiscore.md#autorange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:888](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L888)*

**Parameters:**

Name | Type |
------ | ------ |
`autoRange` | EAutoRange |

**Returns:** *void*

___

###  autoTicks

• **get autoTicks**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[autoTicks](axiscore.md#autoticks)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:982](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L982)*

**Returns:** *boolean*

• **set autoTicks**(`value`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[autoTicks](axiscore.md#autoticks)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:986](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L986)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  axisAlignment

• **get axisAlignment**(): *EAxisAlignment*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:124](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L124)*

**Returns:** *EAxisAlignment*

• **set axisAlignment**(`axisAlignment`: EAxisAlignment): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:128](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`axisAlignment` | EAxisAlignment |

**Returns:** *void*

___

###  axisBandsFill

• **get axisBandsFill**(): *string*

*Inherited from [AxisCore](axiscore.md).[axisBandsFill](axiscore.md#axisbandsfill)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:875](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L875)*

**Returns:** *string*

• **set axisBandsFill**(`axisBandsFill`: string): *void*

*Inherited from [AxisCore](axiscore.md).[axisBandsFill](axiscore.md#axisbandsfill)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:879](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L879)*

**Parameters:**

Name | Type |
------ | ------ |
`axisBandsFill` | string |

**Returns:** *void*

___

###  axisTitle

• **get axisTitle**(): *string*

*Inherited from [AxisCore](axiscore.md).[axisTitle](axiscore.md#axistitle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:938](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L938)*

**Returns:** *string*

• **set axisTitle**(`axisTitle`: string): *void*

*Inherited from [AxisCore](axiscore.md).[axisTitle](axiscore.md#axistitle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:941](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L941)*

**Parameters:**

Name | Type |
------ | ------ |
`axisTitle` | string |

**Returns:** *void*

___

###  cursorTextFormatting

• **get cursorTextFormatting**(): *string*

*Inherited from [AxisCore](axiscore.md).[cursorTextFormatting](axiscore.md#cursortextformatting)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:680](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L680)*

**Returns:** *string*

• **set cursorTextFormatting**(`cursorTextFormatting`: string): *void*

*Inherited from [AxisCore](axiscore.md).[cursorTextFormatting](axiscore.md#cursortextformatting)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:684](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L684)*

**Parameters:**

Name | Type |
------ | ------ |
`cursorTextFormatting` | string |

**Returns:** *void*

___

###  deltaCalculator

• **get deltaCalculator**(): *[DeltaCalculator](deltacalculator.md)*

*Inherited from [AxisCore](axiscore.md).[deltaCalculator](axiscore.md#deltacalculator)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:964](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L964)*

**Returns:** *[DeltaCalculator](deltacalculator.md)*

• **set deltaCalculator**(`deltaCalculator`: [DeltaCalculator](deltacalculator.md)): *void*

*Inherited from [AxisCore](axiscore.md).[deltaCalculator](axiscore.md#deltacalculator)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:968](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L968)*

**Parameters:**

Name | Type |
------ | ------ |
`deltaCalculator` | [DeltaCalculator](deltacalculator.md) |

**Returns:** *void*

___

###  drawLabels

• **get drawLabels**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[drawLabels](axiscore.md#drawlabels)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:836](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L836)*

When true, draws labels on the axis, else they are not drawn

**Returns:** *boolean*

• **set drawLabels**(`drawLabels`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[drawLabels](axiscore.md#drawlabels)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:844](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L844)*

When true, draws labels on the axis, else they are not drawn

**Parameters:**

Name | Type |
------ | ------ |
`drawLabels` | boolean |

**Returns:** *void*

___

###  drawMajorBands

• **get drawMajorBands**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[drawMajorBands](axiscore.md#drawmajorbands)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:818](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L818)*

When true, draws bands, a solid color fill between alternative major gridlines, else they are not drawn

**`remarks`** 
See also the [AxisCore.axisBandsFill](axiscore.md#axisbandsfill) property to style this element

**Returns:** *boolean*

• **set drawMajorBands**(`drawMajorBands`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[drawMajorBands](axiscore.md#drawmajorbands)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:827](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L827)*

When true, draws bands, a solid color fill between alternative major gridlines, else they are not drawn

**`remarks`** 
See also the [AxisCore.axisBandsFill](axiscore.md#axisbandsfill) property to style this element

**Parameters:**

Name | Type |
------ | ------ |
`drawMajorBands` | boolean |

**Returns:** *void*

___

###  drawMajorGridLines

• **get drawMajorGridLines**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[drawMajorGridLines](axiscore.md#drawmajorgridlines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:700](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L700)*

When true, major gridlines (lines inside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own gridlines, for example a YAxis, which is vertical in a 2D Chart, draws gridlines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws gridlines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.majorGridLineStyle](axiscore.md#majorgridlinestyle) to style the major gridlines

**Returns:** *boolean*

• **set drawMajorGridLines**(`drawMajorGridLines`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[drawMajorGridLines](axiscore.md#drawmajorgridlines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:715](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L715)*

When true, major gridlines (lines inside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own gridlines, for example a YAxis, which is vertical in a 2D Chart, draws gridlines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws gridlines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.majorGridLineStyle](axiscore.md#majorgridlinestyle) to style the major gridlines

**Parameters:**

Name | Type |
------ | ------ |
`drawMajorGridLines` | boolean |

**Returns:** *void*

___

###  drawMajorTickLines

• **get drawMajorTickLines**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[drawMajorTickLines](axiscore.md#drawmajorticklines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:762](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L762)*

When true, major gridlines (small lines outside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own ticklines, for example a YAxis, which is vertical in a 2D Chart, draws ticklines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws ticklines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.majorTickLineStyle](axiscore.md#majorticklinestyle) to style the major tick lines

**Returns:** *boolean*

• **set drawMajorTickLines**(`drawMajorTickLines`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[drawMajorTickLines](axiscore.md#drawmajorticklines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:777](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L777)*

When true, major gridlines (small lines outside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own ticklines, for example a YAxis, which is vertical in a 2D Chart, draws ticklines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws ticklines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.majorTickLineStyle](axiscore.md#majorticklinestyle) to style the major tick lines

**Parameters:**

Name | Type |
------ | ------ |
`drawMajorTickLines` | boolean |

**Returns:** *void*

___

###  drawMinorGridLines

• **get drawMinorGridLines**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[drawMinorGridLines](axiscore.md#drawminorgridlines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:731](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L731)*

When true, minor gridlines (lines inside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own gridlines, for example a YAxis, which is vertical in a 2D Chart, draws gridlines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws gridlines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.minorGridLineStyle](axiscore.md#minorgridlinestyle) to style the minor gridlines

**Returns:** *boolean*

• **set drawMinorGridLines**(`drawMinorGridLines`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[drawMinorGridLines](axiscore.md#drawminorgridlines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:746](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L746)*

When true, minor gridlines (lines inside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own gridlines, for example a YAxis, which is vertical in a 2D Chart, draws gridlines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws gridlines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.minorGridLineStyle](axiscore.md#minorgridlinestyle) to style the minor gridlines

**Parameters:**

Name | Type |
------ | ------ |
`drawMinorGridLines` | boolean |

**Returns:** *void*

___

###  drawMinorTickLines

• **get drawMinorTickLines**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[drawMinorTickLines](axiscore.md#drawminorticklines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:793](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L793)*

When true, minor gridlines (small lines outside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own ticklines, for example a YAxis, which is vertical in a 2D Chart, draws ticklines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws ticklines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.minorTickLineStyle](axiscore.md#minorticklinestyle) to style the minor tick lines

**Returns:** *boolean*

• **set drawMinorTickLines**(`drawMinorTickLines`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[drawMinorTickLines](axiscore.md#drawminorticklines)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:808](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L808)*

When true, minor gridlines (small lines outside the chart viewport area) are drawn, else they are not drawn

**`description`** 
SciChart makes a distinction between axis Gridlines (drawn inside the chart) and axis ticks (small marks drawn outside the chart).

Also, an Axis draws its own ticklines, for example a YAxis, which is vertical in a 2D Chart, draws ticklines horizontally at y-spacings.

Similarly, an XAxis, which is horizontal in a 2D chart, draws ticklines vertically at X-spacings.

**`remarks`** 
See also [AxisCore.minorTickLineStyle](axiscore.md#minorticklinestyle) to style the minor tick lines

**Parameters:**

Name | Type |
------ | ------ |
`drawMinorTickLines` | boolean |

**Returns:** *void*

___

###  flippedCoordinates

• **get flippedCoordinates**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[flippedCoordinates](axiscore.md#flippedcoordinates)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:853](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L853)*

When true, axis coordinates are flipped, e.g. a [NumericAxis](numericaxis.md) with @{link AxisCore.visibleRange | VisibleRange}
0..10 will render from 10 to 0

**Returns:** *boolean*

• **set flippedCoordinates**(`flippedCoordinates`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[flippedCoordinates](axiscore.md#flippedcoordinates)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:861](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L861)*

When true, axis coordinates are flipped, e.g. a [NumericAxis](numericaxis.md) with @{link AxisCore.visibleRange | VisibleRange}
0..10 will render from 10 to 0

**Parameters:**

Name | Type |
------ | ------ |
`flippedCoordinates` | boolean |

**Returns:** *void*

___

###  growBy

• **get growBy**(): *NumberRange*

*Inherited from [AxisCore](axiscore.md).[growBy](axiscore.md#growby)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:519](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L519)*

Gets or sets the GrowBy: a padding factor on the axis

**`description`** 
Growby factor is a padding factor set on the axis. For example if you want to have a constant padding above and below the axis,
the following code will result in a 10% (min) and 20% (max) padding outside of the datarange.
```ts
axis.growBy = new NumberRange(0.1, 0.2);
```

**Returns:** *NumberRange*

• **set growBy**(`growBy`: NumberRange): *void*

*Inherited from [AxisCore](axiscore.md).[growBy](axiscore.md#growby)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:532](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L532)*

Gets or sets the GrowBy: a padding factor on the axis

**`description`** 
Growby factor is a padding factor set on the axis. For example if you want to have a constant padding above and below the axis,
the following code will result in a 10% (min) and 20% (max) padding outside of the datarange.
```ts
axis.growBy = new NumberRange(0.1, 0.2);
```

**Parameters:**

Name | Type |
------ | ------ |
`growBy` | NumberRange |

**Returns:** *void*

___

###  hasDefaultVisibleRange

• **get hasDefaultVisibleRange**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[hasDefaultVisibleRange](axiscore.md#hasdefaultvisiblerange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:444](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L444)*

When true, the axis has the default [AxisCore.visibleRange](axiscore.md#visiblerange).

**`remarks`** 
This property is used internally when autoranging. If the range is default and [AxisCore.autoRange](axiscore.md#autorange) is {@link EAutoRange.Once}
then the axis will autorange once.

**Returns:** *boolean*

___

###  hasValidVisibleRange

• **get hasValidVisibleRange**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[hasValidVisibleRange](axiscore.md#hasvalidvisiblerange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:428](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L428)*

When true, the axis has a valid [AxisCore.visibleRange](axiscore.md#visiblerange) which can be drawn

**`remarks`** 
[AxisCore.visibleRange](axiscore.md#visiblerange) undefined, or NAN, or infinite, or [AxisCore.visibleRange](axiscore.md#visiblerange) min greater than max
will result in this property being false.

**Returns:** *boolean*

___

###  id

• **get id**(): *string*

*Inherited from [AxisCore](axiscore.md).[id](axiscore.md#id)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:459](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L459)*

Gets or sets the unique Axis Id

**`description`** 
By default all axis in SciChart have Id=[AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). Also, all [RenderableSeries](baserenderableseries.md)
have an xAxisId and yAxisId property set to [AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). [Annotations](annotationbase.md) also have an xAxisId and
yAxisId also set to [AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). Some [Chart Modifiers](chartmodifierbase.md) have an x,yAxisId property to filter
their operations to an axis.

In multi-axis scenarios you will need to set the xAxisId/yAxisId properties of series, annotations, modifiers to match that of the axis
you want them to be registered on.

**Returns:** *string*

• **set id**(`id`: string): *void*

*Inherited from [AxisCore](axiscore.md).[id](axiscore.md#id)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:474](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L474)*

Gets or sets the unique Axis Id

**`description`** 
By default all axis in SciChart have Id=[AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). Also, all [RenderableSeries](baserenderableseries.md)
have an xAxisId and yAxisId property set to [AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). [Annotations](annotationbase.md) also have an xAxisId and
yAxisId also set to [AxisCore.DEFAULT_AXIS_ID](axiscore.md#static-readonly-default_axis_id). Some [Chart Modifiers](chartmodifierbase.md) have an x,yAxisId property to filter
their operations to an axis.

In multi-axis scenarios you will need to set the xAxisId/yAxisId properties of series, annotations, modifiers to match that of the axis
you want them to be registered on.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

___

###  isAxisFlipped

• **get isAxisFlipped**(): *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L116)*

**Returns:** *boolean*

___

###  isHorizontalAxis

• **get isHorizontalAxis**(): *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L112)*

**Returns:** *boolean*

___

###  isPrimaryAxis

• **get isPrimaryAxis**(): *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L142)*

**Returns:** *boolean*

• **set isPrimaryAxis**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:146](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L146)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  isVerticalChart

• **get isVerticalChart**(): *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:159](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L159)*

**Returns:** *boolean*

___

###  isVisible

• **get isVisible**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[isVisible](axiscore.md#isvisible)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:490](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L490)*

When true, the axis is visible. Default value is also true for the axis

**`remarks`** 
An invisible axis can be used to scale series to the viewport. For example:

 - have a chart with two-YAxis
 - have one series on the first axis and another series on the second axis
 - set second [AxisCore.isVisible](axiscore.md#isvisible) = false, and [AxisCore.autoRange](axiscore.md#autorange) = {@link EAutoRange.Always}

 This will scale the series on the second axis to the viewport, on an invisible, auto-ranged axis

**Returns:** *boolean*

• **set isVisible**(`isVisible`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[isVisible](axiscore.md#isvisible)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:505](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L505)*

When true, the axis is visible. Default value is also true for the axis

**`remarks`** 
An invisible axis can be used to scale series to the viewport. For example:

 - have a chart with two-YAxis
 - have one series on the first axis and another series on the second axis
 - set second [AxisCore.isVisible](axiscore.md#isvisible) = false, and [AxisCore.autoRange](axiscore.md#autorange) = {@link EAutoRange.Always}

 This will scale the series on the second axis to the viewport, on an invisible, auto-ranged axis

**Parameters:**

Name | Type |
------ | ------ |
`isVisible` | boolean |

**Returns:** *void*

___

###  isXAxis

• **get isXAxis**(): *boolean*

*Inherited from [AxisCore](axiscore.md).[isXAxis](axiscore.md#isxaxis)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:408](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L408)*

SET INTERNALLY. Gets or sets whether this axis is an XAxis or not

**`remarks`** 
See [AxisBase2D.axisAlignment](axisbase2d.md#axisalignment) if you want to set a 2D Axis alignment to the left, right, top or bottom

**Returns:** *boolean*

• **set isXAxis**(`isXAxis`: boolean): *void*

*Inherited from [AxisCore](axiscore.md).[isXAxis](axiscore.md#isxaxis)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:417](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L417)*

SET INTERNALLY. Gets or sets whether this axis is an XAxis or not

**`remarks`** 
See [AxisBase2D.axisAlignment](axisbase2d.md#axisalignment) if you want to set a 2D Axis alignment to the left, right, top or bottom

**Parameters:**

Name | Type |
------ | ------ |
`isXAxis` | boolean |

**Returns:** *void*

___

###  labelProvider

• **get labelProvider**(): *[LabelProvider](labelprovider.md)*

*Inherited from [AxisCore](axiscore.md).[labelProvider](axiscore.md#labelprovider)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:955](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L955)*

**Returns:** *[LabelProvider](labelprovider.md)*

• **set labelProvider**(`labelProvider`: [LabelProvider](labelprovider.md)): *void*

*Inherited from [AxisCore](axiscore.md).[labelProvider](axiscore.md#labelprovider)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:959](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L959)*

**Parameters:**

Name | Type |
------ | ------ |
`labelProvider` | [LabelProvider](labelprovider.md) |

**Returns:** *void*

___

###  labelStyle

• **get labelStyle**(): *[TTextStyle](../globals.md#ttextstyle)*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:167](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L167)*

**Returns:** *[TTextStyle](../globals.md#ttextstyle)*

• **set labelStyle**(`textStyle`: [TTextStyle](../globals.md#ttextstyle)): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:171](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L171)*

**Parameters:**

Name | Type |
------ | ------ |
`textStyle` | [TTextStyle](../globals.md#ttextstyle) |

**Returns:** *void*

___

###  majorDelta

• **get majorDelta**(): *number*

*Inherited from [AxisCore](axiscore.md).[majorDelta](axiscore.md#majordelta)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:613](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L613)*

The MajorDelta is the spacing between major gridlines and axis labels.

**`remarks`** 
This is internally computed via the [Delta Calculator](axiscore.md#deltacalculator), however it can be explicitly set here
in which case you should also set [AxisCore.minorDelta](axiscore.md#minordelta) and [AxisCore.autoTicks](axiscore.md#autoticks) = false.

It is also possible to override and create custom implementations of the [DeltaCalculator](deltacalculator.md) for full control over axis gridline
spacing.

**Returns:** *number*

• **set majorDelta**(`majorDelta`: number): *void*

*Inherited from [AxisCore](axiscore.md).[majorDelta](axiscore.md#majordelta)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:625](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L625)*

The MajorDelta is the spacing between major gridlines and axis labels.

**`remarks`** 
This is internally computed via the [Delta Calculator](axiscore.md#deltacalculator), however it can be explicitly set here
in which case you should also set [AxisCore.minorDelta](axiscore.md#minordelta) and [AxisCore.autoTicks](axiscore.md#autoticks) = false.

It is also possible to override and create custom implementations of the [DeltaCalculator](deltacalculator.md) for full control over axis gridline
spacing.

**Parameters:**

Name | Type |
------ | ------ |
`majorDelta` | number |

**Returns:** *void*

___

###  majorGridLineStyle

• **get majorGridLineStyle**(): *[TGridLineStyle](../globals.md#tgridlinestyle)*

*Inherited from [AxisCore](axiscore.md).[majorGridLineStyle](axiscore.md#majorgridlinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:911](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L911)*

**Returns:** *[TGridLineStyle](../globals.md#tgridlinestyle)*

• **set majorGridLineStyle**(`majorGridLineStyle`: [TGridLineStyle](../globals.md#tgridlinestyle)): *void*

*Inherited from [AxisCore](axiscore.md).[majorGridLineStyle](axiscore.md#majorgridlinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:915](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L915)*

**Parameters:**

Name | Type |
------ | ------ |
`majorGridLineStyle` | [TGridLineStyle](../globals.md#tgridlinestyle) |

**Returns:** *void*

___

###  majorTickLineStyle

• **get majorTickLineStyle**(): *[TTickLineStyle](../globals.md#tticklinestyle)*

*Inherited from [AxisCore](axiscore.md).[majorTickLineStyle](axiscore.md#majorticklinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:893](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L893)*

**Returns:** *[TTickLineStyle](../globals.md#tticklinestyle)*

• **set majorTickLineStyle**(`majorTickLineStyle`: [TTickLineStyle](../globals.md#tticklinestyle)): *void*

*Inherited from [AxisCore](axiscore.md).[majorTickLineStyle](axiscore.md#majorticklinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:897](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L897)*

**Parameters:**

Name | Type |
------ | ------ |
`majorTickLineStyle` | [TTickLineStyle](../globals.md#tticklinestyle) |

**Returns:** *void*

___

###  maxAutoTicks

• **get maxAutoTicks**(): *number*

*Inherited from [AxisCore](axiscore.md).[maxAutoTicks](axiscore.md#maxautoticks)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:973](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L973)*

**Returns:** *number*

• **set maxAutoTicks**(`value`: number): *void*

*Inherited from [AxisCore](axiscore.md).[maxAutoTicks](axiscore.md#maxautoticks)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:977](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L977)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  minorDelta

• **get minorDelta**(): *number*

*Inherited from [AxisCore](axiscore.md).[minorDelta](axiscore.md#minordelta)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:638](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L638)*

The MinorDelta is the spacing between minor gridlines.

**`remarks`** 
This is internally computed via the [Delta Calculator](axiscore.md#deltacalculator), however it can be explicitly set here
in which case you should also set [AxisCore.majorDelta](axiscore.md#majordelta) and [AxisCore.autoTicks](axiscore.md#autoticks) = false.

It is also possible to override and create custom implementations of the [DeltaCalculator](deltacalculator.md) for full control over axis gridline
spacing.

**Returns:** *number*

• **set minorDelta**(`minorDelta`: number): *void*

*Inherited from [AxisCore](axiscore.md).[minorDelta](axiscore.md#minordelta)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:650](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L650)*

The MinorDelta is the spacing between minor gridlines.

**`remarks`** 
This is internally computed via the [Delta Calculator](axiscore.md#deltacalculator), however it can be explicitly set here
in which case you should also set [AxisCore.majorDelta](axiscore.md#majordelta) and [AxisCore.autoTicks](axiscore.md#autoticks) = false.

It is also possible to override and create custom implementations of the [DeltaCalculator](deltacalculator.md) for full control over axis gridline
spacing.

**Parameters:**

Name | Type |
------ | ------ |
`minorDelta` | number |

**Returns:** *void*

___

###  minorGridLineStyle

• **get minorGridLineStyle**(): *[TGridLineStyle](../globals.md#tgridlinestyle)*

*Inherited from [AxisCore](axiscore.md).[minorGridLineStyle](axiscore.md#minorgridlinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:920](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L920)*

**Returns:** *[TGridLineStyle](../globals.md#tgridlinestyle)*

• **set minorGridLineStyle**(`minorGridLineStyle`: [TGridLineStyle](../globals.md#tgridlinestyle)): *void*

*Inherited from [AxisCore](axiscore.md).[minorGridLineStyle](axiscore.md#minorgridlinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:924](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L924)*

**Parameters:**

Name | Type |
------ | ------ |
`minorGridLineStyle` | [TGridLineStyle](../globals.md#tgridlinestyle) |

**Returns:** *void*

___

###  minorTickLineStyle

• **get minorTickLineStyle**(): *[TTickLineStyle](../globals.md#tticklinestyle)*

*Inherited from [AxisCore](axiscore.md).[minorTickLineStyle](axiscore.md#minorticklinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:902](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L902)*

**Returns:** *[TTickLineStyle](../globals.md#tticklinestyle)*

• **set minorTickLineStyle**(`minorTickLineStyle`: [TTickLineStyle](../globals.md#tticklinestyle)): *void*

*Inherited from [AxisCore](axiscore.md).[minorTickLineStyle](axiscore.md#minorticklinestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:906](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L906)*

**Parameters:**

Name | Type |
------ | ------ |
`minorTickLineStyle` | [TTickLineStyle](../globals.md#tticklinestyle) |

**Returns:** *void*

___

###  minorsPerMajor

• **get minorsPerMajor**(): *number*

*Inherited from [AxisCore](axiscore.md).[minorsPerMajor](axiscore.md#minorspermajor)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:658](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L658)*

When [AxisCore.autoTicks](axiscore.md#autoticks) is true, minorsPerMajor is a hint of how many minor gridlines should be drawn between each major gridline

**Returns:** *number*

• **set minorsPerMajor**(`minorDelta`: number): *void*

*Inherited from [AxisCore](axiscore.md).[minorsPerMajor](axiscore.md#minorspermajor)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:665](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L665)*

When [AxisCore.autoTicks](axiscore.md#autoticks) is true, minorsPerMajor is a hint of how many minor gridlines should be drawn between each major gridline

**Parameters:**

Name | Type |
------ | ------ |
`minorDelta` | number |

**Returns:** *void*

___

###  textFormatting

• **get textFormatting**(): *string*

*Inherited from [AxisCore](axiscore.md).[textFormatting](axiscore.md#textformatting)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:671](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L671)*

**Returns:** *string*

• **set textFormatting**(`textFormatting`: string): *void*

*Inherited from [AxisCore](axiscore.md).[textFormatting](axiscore.md#textformatting)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:675](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L675)*

**Parameters:**

Name | Type |
------ | ------ |
`textFormatting` | string |

**Returns:** *void*

___

###  tickProvider

• **get tickProvider**(): *[TickProvider](tickprovider.md)*

*Inherited from [AxisCore](axiscore.md).[tickProvider](axiscore.md#tickprovider)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:946](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L946)*

**Returns:** *[TickProvider](tickprovider.md)*

• **set tickProvider**(`tickProvider`: [TickProvider](tickprovider.md)): *void*

*Inherited from [AxisCore](axiscore.md).[tickProvider](axiscore.md#tickprovider)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:950](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L950)*

**Parameters:**

Name | Type |
------ | ------ |
`tickProvider` | [TickProvider](tickprovider.md) |

**Returns:** *void*

___

###  tickTextBrush

• **get tickTextBrush**(): *string*

*Inherited from [AxisCore](axiscore.md).[tickTextBrush](axiscore.md#ticktextbrush)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:866](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L866)*

**Returns:** *string*

• **set tickTextBrush**(`tickTextBrush`: string): *void*

*Inherited from [AxisCore](axiscore.md).[tickTextBrush](axiscore.md#ticktextbrush)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:870](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L870)*

**Parameters:**

Name | Type |
------ | ------ |
`tickTextBrush` | string |

**Returns:** *void*

___

###  titleStyle

• **get titleStyle**(): *[TTextStyle](../globals.md#ttextstyle)*

*Inherited from [AxisCore](axiscore.md).[titleStyle](axiscore.md#titlestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:929](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L929)*

**Returns:** *[TTextStyle](../globals.md#ttextstyle)*

• **set titleStyle**(`textStyle`: [TTextStyle](../globals.md#ttextstyle)): *void*

*Inherited from [AxisCore](axiscore.md).[titleStyle](axiscore.md#titlestyle)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:933](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L933)*

**Parameters:**

Name | Type |
------ | ------ |
`textStyle` | [TTextStyle](../globals.md#ttextstyle) |

**Returns:** *void*

___

###  visibleRange

• **get visibleRange**(): *NumberRange*

*Inherited from [AxisCore](axiscore.md).[visibleRange](axiscore.md#visiblerange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:549](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L549)*

The VisibleRange is the range of the Axis (min to max).

**`description`** 
For example, if you have data-values from 0 to 100 in your [DataSeries](xydataseries.md), but you only want to show
values from 15-25 on the axis, then set the visibleRange as follows:
```ts
axis.visibleRange = new NumberRange(15, 25);
```

**`remarks`** 
The visibleRange is a data-value for [NumericAxis](numericaxis.md), @{link NumericAxis3D} but refers to an **index** to the data
for [CategoryAxis](categoryaxis.md) types.

**Returns:** *NumberRange*

• **set visibleRange**(`visibleRange`: NumberRange): *void*

*Inherited from [AxisCore](axiscore.md).[visibleRange](axiscore.md#visiblerange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:565](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L565)*

The VisibleRange is the range of the Axis (min to max).

**`description`** 
For example, if you have data-values from 0 to 100 in your [DataSeries](xydataseries.md), but you only want to show
values from 15-25 on the axis, then set the visibleRange as follows:
```ts
axis.visibleRange = new NumberRange(15, 25);
```

**`remarks`** 
The visibleRange is a data-value for [NumericAxis](numericaxis.md), @{link NumericAxis3D} but refers to an **index** to the data
for [CategoryAxis](categoryaxis.md) types.

**Parameters:**

Name | Type |
------ | ------ |
`visibleRange` | NumberRange |

**Returns:** *void*

___

###  visibleRangeLimit

• **get visibleRangeLimit**(): *NumberRange‹›*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:133](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L133)*

**Returns:** *NumberRange‹›*

• **set visibleRangeLimit**(`visibleRangeLimit`: NumberRange): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:137](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`visibleRangeLimit` | NumberRange |

**Returns:** *void*

## Methods

###  animateVisibleRange

▸ **animateVisibleRange**(`visibleRange`: NumberRange, `durationMs`: number, `easingFunction`: TEasing): *AnimationToken*

*Inherited from [AxisCore](axiscore.md).[animateVisibleRange](axiscore.md#animatevisiblerange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:580](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L580)*

Sets and animates the visibleRange of the axis from the current value to the provided value over the duration and with
{@link TEasing | Easing Function} provided

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`visibleRange` | NumberRange | - | the {@link NumberRange} which we wish to animate [AxisCore.visibleRange](axiscore.md#visiblerange) to |
`durationMs` | number | - | the duration of the animation in milliseconds |
`easingFunction` | TEasing | easing.outCubic | the {@link TEasing | Easing Function to use}. Default value is outCubic  |

**Returns:** *AnimationToken*

___

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [IThemeable](../interfaces/ithemeable.md)*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md)): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:203](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |

**Returns:** *void*

___

###  drawDebug

▸ **drawDebug**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md)): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:266](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L266)*

Function to draw axis areas with red color

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |   |

**Returns:** *void*

___

### `Abstract` getCurrentCoordinateCalculator

▸ **getCurrentCoordinateCalculator**(): *[CoordinateCalculatorBase](coordinatecalculatorbase.md)*

*Inherited from [AxisCore](axiscore.md).[getCurrentCoordinateCalculator](axiscore.md#abstract-getcurrentcoordinatecalculator)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:991](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L991)*

**Returns:** *[CoordinateCalculatorBase](coordinatecalculatorbase.md)*

___

###  getDefaultNonZeroRange

▸ **getDefaultNonZeroRange**(): *NumberRange*

*Overrides [AxisCore](axiscore.md).[getDefaultNonZeroRange](axiscore.md#abstract-getdefaultnonzerorange)*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:296](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L296)*

**Returns:** *NumberRange*

___

###  getMaximumRange

▸ **getMaximumRange**(): *NumberRange*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:300](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L300)*

**Returns:** *NumberRange*

___

###  getWindowedYRange

▸ **getWindowedYRange**(`xRanges`: Dictionary‹NumberRange›): *NumberRange*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:326](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L326)*

**`description`** Returns the max range only for that axis (by the data-series on it),
based on associated XAxis visible range of series on the same axis

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`xRanges` | Dictionary‹NumberRange› | (optional) if provided, we use previously calculated XAxis ranges keyed by AxisId rather than calculate them again  |

**Returns:** *NumberRange*

___

###  isValidRange

▸ **isValidRange**(`range`: NumberRange): *boolean*

*Inherited from [AxisCore](axiscore.md).[isValidRange](axiscore.md#isvalidrange)*

*Defined in [src/Charting/Visuals/Axis/AxisCore.ts:995](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisCore.ts#L995)*

**Parameters:**

Name | Type |
------ | ------ |
`range` | NumberRange |

**Returns:** *boolean*

___

###  measure

▸ **measure**(): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:176](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L176)*

**Returns:** *void*

___

###  prepareRenderData

▸ **prepareRenderData**(): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:199](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L199)*

**Returns:** *void*

___

###  scroll

▸ **scroll**(`pixelsToScroll`: number, `clipMode`: [EClipMode](../enums/eclipmode.md)): *boolean*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:309](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L309)*

**Parameters:**

Name | Type |
------ | ------ |
`pixelsToScroll` | number |
`clipMode` | [EClipMode](../enums/eclipmode.md) |

**Returns:** *boolean*

___

###  zoom

▸ **zoom**(`fromCoord`: number, `toCoord`: number, `duration`: number, `easingFunction`: TEasing): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:365](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L365)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`fromCoord` | number | - |
`toCoord` | number | - |
`duration` | number | 0 |
`easingFunction` | TEasing | easing.outExpo |

**Returns:** *void*

___

###  zoomBy

▸ **zoomBy**(`minFraction`: number, `maxFraction`: number): *void*

*Defined in [src/Charting/Visuals/Axis/AxisBase2D.ts:355](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisBase2D.ts#L355)*

**Parameters:**

Name | Type |
------ | ------ |
`minFraction` | number |
`maxFraction` | number |

**Returns:** *void*
