[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartSurface](scichartsurface.md)

# Class: SciChartSurface

## Hierarchy

* [SciChartSurfaceBase](scichartsurfacebase.md)

  ↳ **SciChartSurface**

## Implements

* [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)

## Index

### Constructors

* [constructor](scichartsurface.md#constructor)

### Properties

* [annotationOverlaySurfaceViewRect](scichartsurface.md#annotationoverlaysurfaceviewrect)
* [annotationUnderlaySurfaceViewRect](scichartsurface.md#annotationunderlaysurfaceviewrect)
* [annotations](scichartsurface.md#readonly-annotations)
* [chartModifierSurfaceViewRect](scichartsurface.md#chartmodifiersurfaceviewrect)
* [chartModifiers](scichartsurface.md#readonly-chartmodifiers)
* [domCanvas2D](scichartsurface.md#readonly-domcanvas2d)
* [domCanvasWebGL](scichartsurface.md#readonly-domcanvaswebgl)
* [domChartRoot](scichartsurface.md#readonly-domchartroot)
* [domDivContainer](scichartsurface.md#readonly-domdivcontainer)
* [domSvgContainer](scichartsurface.md#readonly-domsvgcontainer)
* [mouseManager](scichartsurface.md#readonly-mousemanager)
* [propertyChanged](scichartsurface.md#readonly-propertychanged)
* [renderContext2D](scichartsurface.md#rendercontext2d)
* [renderSurface](scichartsurface.md#readonly-rendersurface)
* [renderableSeries](scichartsurface.md#readonly-renderableseries)
* [rendered](scichartsurface.md#rendered)
* [test](scichartsurface.md#test)
* [xAxes](scichartsurface.md#readonly-xaxes)
* [yAxes](scichartsurface.md#readonly-yaxes)

### Accessors

* [isCopyCanvasSurface](scichartsurface.md#iscopycanvassurface)
* [layoutManager](scichartsurface.md#layoutmanager)
* [otherSurfaces](scichartsurface.md#othersurfaces)
* [seriesViewRect](scichartsurface.md#seriesviewrect)
* [surfaceType](scichartsurface.md#surfacetype)

### Methods

* [applyTheme](scichartsurface.md#applytheme)
* [changeViewportSize](scichartsurface.md#changeviewportsize)
* [delete](scichartsurface.md#delete)
* [doDrawingLoop](scichartsurface.md#dodrawingloop)
* [getXAxisById](scichartsurface.md#getxaxisbyid)
* [getYAxisById](scichartsurface.md#getyaxisbyid)
* [invalidateElement](scichartsurface.md#invalidateelement)
* [setDestinations](scichartsurface.md#setdestinations)
* [setLayoutManager](scichartsurface.md#setlayoutmanager)
* [setSeriesViewRect](scichartsurface.md#setseriesviewrect)
* [zoomExtents](scichartsurface.md#zoomextents)
* [zoomExtentsX](scichartsurface.md#zoomextentsx)
* [zoomExtentsY](scichartsurface.md#zoomextentsy)
* [create](scichartsurface.md#static-create)
* [createSingle](scichartsurface.md#static-createsingle)

## Constructors

###  constructor

\+ **new SciChartSurface**(`webAssemblyContext`: TSciChart, `options?`: [ISciChartSurfaceOptions](../interfaces/iscichartsurfaceoptions.md)): *[SciChartSurface](scichartsurface.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:111](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L111)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`options?` | [ISciChartSurfaceOptions](../interfaces/iscichartsurfaceoptions.md) |

**Returns:** *[SciChartSurface](scichartsurface.md)*

## Properties

###  annotationOverlaySurfaceViewRect

• **annotationOverlaySurfaceViewRect**: *Rect*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:102](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L102)*

___

###  annotationUnderlaySurfaceViewRect

• **annotationUnderlaySurfaceViewRect**: *Rect*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:101](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L101)*

___

### `Readonly` annotations

• **annotations**: *ObservableArray‹[IAnnotation](../interfaces/iannotation.md)›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L97)*

___

###  chartModifierSurfaceViewRect

• **chartModifierSurfaceViewRect**: *Rect*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L103)*

___

### `Readonly` chartModifiers

• **chartModifiers**: *ObservableArray‹[IChartModifierBase](../interfaces/ichartmodifierbase.md)›*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[chartModifiers](scichartsurfacebase.md#readonly-chartmodifiers)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L69)*

An {@link ObservableArray} of [IChartModifierBase](../interfaces/ichartmodifierbase.md) derived types. Chart Modifiers provide behavior such as zooming, panning,
tooltips, legends and more in SciChart's High Performance Realtime
[JavaScript Charts](https://www.scichart.com/javascript-chart-features).
You can use our built in modifiers (see derived types of [ChartModifierBase](chartmodifierbase.md), or create your own for custom interaction behavior.

___

### `Readonly` domCanvas2D

• **domCanvas2D**: *HTMLCanvasElement*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md).[domCanvas2D](../interfaces/iscichartsurfacebase.md#readonly-domcanvas2d)*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domCanvas2D](scichartsurfacebase.md#readonly-domcanvas2d)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L81)*

The {@link HTMLCanvasElement} which is the HTML5 canvas which SciChart draws overlays (cursors, tooltips) to

___

### `Readonly` domCanvasWebGL

• **domCanvasWebGL**: *HTMLCanvasElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domCanvasWebGL](scichartsurfacebase.md#readonly-domcanvaswebgl)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L77)*

The {@link HTMLCanvasElement} which is the WebGL canvas that SciChart draws to

___

### `Readonly` domChartRoot

• **domChartRoot**: *HTMLDivElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domChartRoot](scichartsurfacebase.md#readonly-domchartroot)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L73)*

The {@link HTMLDivElement} which is the dom chart root

___

### `Readonly` domDivContainer

• **domDivContainer**: *HTMLDivElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domDivContainer](scichartsurfacebase.md#readonly-domdivcontainer)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L89)*

The inner {@link HTMLDivElement} div element

___

### `Readonly` domSvgContainer

• **domSvgContainer**: *SVGSVGElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domSvgContainer](scichartsurfacebase.md#readonly-domsvgcontainer)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L85)*

The {@link SVGSVGElement} which is the SVG canvas which SciChart adds elements (tooltips, annotations) to

___

### `Readonly` mouseManager

• **mouseManager**: *MouseManager*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[mouseManager](scichartsurfacebase.md#readonly-mousemanager)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L94)*

The {@link MouseManager} subscribes to mouse events on the [domChartRoot](scichartsurface.md#readonly-domchartroot) and routes them to components within SciChart

___

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[propertyChanged](scichartsurfacebase.md#readonly-propertychanged)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L62)*

A propertyChanged EventHandler. See {@link EventHandler} for how to subscribe to and be
notified when a property changes on the [SciChartSurfaceBase](scichartsurfacebase.md)

___

###  renderContext2D

• **renderContext2D**: *[RenderContext2D](rendercontext2d.md)*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L104)*

___

### `Readonly` renderSurface

• **renderSurface**: *RenderSurface*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L95)*

___

### `Readonly` renderableSeries

• **renderableSeries**: *ObservableArray‹[IRenderableSeries](../interfaces/irenderableseries.md)›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L96)*

___

###  rendered

• **rendered**: *EventHandler‹void›* = new EventHandler<void>()

*Defined in [src/Charting/Visuals/SciChartSurface.ts:106](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L106)*

___

###  test

• **test**: *string*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L100)*

___

### `Readonly` xAxes

• **xAxes**: *ObservableArray‹[AxisBase2D](axisbase2d.md)›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:98](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L98)*

___

### `Readonly` yAxes

• **yAxes**: *ObservableArray‹[AxisBase2D](axisbase2d.md)›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:99](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L99)*

## Accessors

###  isCopyCanvasSurface

• **get isCopyCanvasSurface**(): *HTMLCanvasElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[isCopyCanvasSurface](scichartsurfacebase.md#iscopycanvassurface)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L170)*

**Returns:** *HTMLCanvasElement*

___

###  layoutManager

• **get layoutManager**(): *LayoutManager‹›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:237](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L237)*

**Returns:** *LayoutManager‹›*

___

###  otherSurfaces

• **get otherSurfaces**(): *[SciChartSurfaceBase](scichartsurfacebase.md)[]*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[otherSurfaces](scichartsurfacebase.md#othersurfaces)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:178](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L178)*

**Returns:** *[SciChartSurfaceBase](scichartsurfacebase.md)[]*

___

###  seriesViewRect

• **get seriesViewRect**(): *Rect‹›*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[seriesViewRect](scichartsurfacebase.md#seriesviewrect)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:188](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L188)*

Gets the Series View {@link Rect}, a rectangle relative to the entire size of the [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *Rect‹›*

___

###  surfaceType

• **get surfaceType**(): *[ESurfaceType](../enums/esurfacetype.md)*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[surfaceType](scichartsurfacebase.md#surfacetype)*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:179](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L179)*

**Returns:** *[ESurfaceType](../enums/esurfacetype.md)*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[applyTheme](scichartsurfacebase.md#applytheme)*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:163](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L163)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  changeViewportSize

▸ **changeViewportSize**(`width`: number, `height`: number): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[changeViewportSize](scichartsurfacebase.md#abstract-changeviewportsize)*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L170)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`height` | number |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[delete](scichartsurfacebase.md#delete)*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:195](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L195)*

**Returns:** *void*

___

###  doDrawingLoop

▸ **doDrawingLoop**(): *void*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:190](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L190)*

**Returns:** *void*

___

###  getXAxisById

▸ **getXAxisById**(`axisId`: string): *[AxisBase2D](axisbase2d.md)‹›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:200](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L200)*

**Parameters:**

Name | Type |
------ | ------ |
`axisId` | string |

**Returns:** *[AxisBase2D](axisbase2d.md)‹›*

___

###  getYAxisById

▸ **getYAxisById**(`axisId`: string): *[AxisBase2D](axisbase2d.md)‹›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:204](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`axisId` | string |

**Returns:** *[AxisBase2D](axisbase2d.md)‹›*

___

###  invalidateElement

▸ **invalidateElement**(): *void*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[invalidateElement](scichartsurfacebase.md#abstract-invalidateelement)*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:184](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L184)*

**Returns:** *void*

___

###  setDestinations

▸ **setDestinations**(`destinations`: [TSciChartDestination](../globals.md#tscichartdestination)[]): *void*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[setDestinations](scichartsurfacebase.md#setdestinations)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L174)*

**Parameters:**

Name | Type |
------ | ------ |
`destinations` | [TSciChartDestination](../globals.md#tscichartdestination)[] |

**Returns:** *void*

___

###  setLayoutManager

▸ **setLayoutManager**(`layoutManager`: LayoutManager): *void*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:241](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L241)*

**Parameters:**

Name | Type |
------ | ------ |
`layoutManager` | LayoutManager |

**Returns:** *void*

___

###  setSeriesViewRect

▸ **setSeriesViewRect**(`seriesViewRect`: Rect): *void*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[setSeriesViewRect](scichartsurfacebase.md#setseriesviewrect)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:196](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L196)*

Sets the Series View {@link Rect}, a rectangle relative to the entire size of the [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`seriesViewRect` | Rect | a {@link Rect} which defines the portion of the view for drawing series  |

**Returns:** *void*

___

###  zoomExtents

▸ **zoomExtents**(`animationDurationMs`: number, `easingFunction`: TEasing): *void*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:208](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L208)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`animationDurationMs` | number | 0 |
`easingFunction` | TEasing | easing.outExpo |

**Returns:** *void*

___

###  zoomExtentsX

▸ **zoomExtentsX**(`animationDurationMs`: number, `easingFunction`: TEasing): *void*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:229](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L229)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`animationDurationMs` | number | 0 |
`easingFunction` | TEasing | easing.outExpo |

**Returns:** *void*

___

###  zoomExtentsY

▸ **zoomExtentsY**(`animationDurationMs`: number, `easingFunction`: TEasing): *void*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:233](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L233)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`animationDurationMs` | number | 0 |
`easingFunction` | TEasing | easing.outExpo |

**Returns:** *void*

___

### `Static` create

▸ **create**(`divElementId`: string, `width`: number, `height`: number, `clearChildren`: boolean): *Promise‹[TWebAssemblyChart](../globals.md#twebassemblychart)›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:86](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L86)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`divElementId` | string | - |
`width` | number | 0 |
`height` | number | 0 |
`clearChildren` | boolean | true |

**Returns:** *Promise‹[TWebAssemblyChart](../globals.md#twebassemblychart)›*

___

### `Static` createSingle

▸ **createSingle**(`divElementId`: string, `width`: number, `height`: number): *Promise‹[TWebAssemblyChart](../globals.md#twebassemblychart)›*

*Defined in [src/Charting/Visuals/SciChartSurface.ts:64](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/SciChartSurface.ts#L64)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`divElementId` | string | - |
`width` | number | 0 |
`height` | number | 0 |

**Returns:** *Promise‹[TWebAssemblyChart](../globals.md#twebassemblychart)›*
