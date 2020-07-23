[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChart3DSurface](scichart3dsurface.md)

# Class: SciChart3DSurface

## Hierarchy

* [SciChartSurfaceBase](scichartsurfacebase.md)

  ↳ **SciChart3DSurface**

## Implements

* [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)

## Index

### Constructors

* [constructor](scichart3dsurface.md#constructor)

### Properties

* [axisCubeEntity](scichart3dsurface.md#readonly-axiscubeentity)
* [chartModifiers](scichart3dsurface.md#readonly-chartmodifiers)
* [domCanvas2D](scichart3dsurface.md#readonly-domcanvas2d)
* [domCanvasWebGL](scichart3dsurface.md#readonly-domcanvaswebgl)
* [domChartRoot](scichart3dsurface.md#readonly-domchartroot)
* [domDivContainer](scichart3dsurface.md#readonly-domdivcontainer)
* [domSvgContainer](scichart3dsurface.md#readonly-domsvgcontainer)
* [mouseManager](scichart3dsurface.md#readonly-mousemanager)
* [propertyChanged](scichart3dsurface.md#readonly-propertychanged)
* [renderableSeries](scichart3dsurface.md#readonly-renderableseries)
* [rootEntity](scichart3dsurface.md#readonly-rootentity)

### Accessors

* [camera](scichart3dsurface.md#camera)
* [enableGizmo](scichart3dsurface.md#enablegizmo)
* [isCopyCanvasSurface](scichart3dsurface.md#iscopycanvassurface)
* [otherSurfaces](scichart3dsurface.md#othersurfaces)
* [seriesViewRect](scichart3dsurface.md#seriesviewrect)
* [surfaceType](scichart3dsurface.md#surfacetype)
* [viewportManager](scichart3dsurface.md#viewportmanager)
* [worldDimensions](scichart3dsurface.md#worlddimensions)
* [xAxis](scichart3dsurface.md#xaxis)
* [yAxis](scichart3dsurface.md#yaxis)
* [zAxis](scichart3dsurface.md#zaxis)

### Methods

* [applyTheme](scichart3dsurface.md#applytheme)
* [changeViewportSize](scichart3dsurface.md#changeviewportsize)
* [delete](scichart3dsurface.md#delete)
* [doDrawingLoop](scichart3dsurface.md#dodrawingloop)
* [invalidateElement](scichart3dsurface.md#invalidateelement)
* [onSciChartRendered](scichart3dsurface.md#onscichartrendered)
* [setDestinations](scichart3dsurface.md#setdestinations)
* [setSeriesViewRect](scichart3dsurface.md#setseriesviewrect)

## Constructors

###  constructor

\+ **new SciChart3DSurface**(`webAssemblyContext`: TSciChart3D, `options?`: [ISciChart3DSurfaceOptions](../interfaces/iscichart3dsurfaceoptions.md)): *[SciChart3DSurface](scichart3dsurface.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [ISciChart3DSurfaceOptions](../interfaces/iscichart3dsurfaceoptions.md) |

**Returns:** *[SciChart3DSurface](scichart3dsurface.md)*

## Properties

### `Readonly` axisCubeEntity

• **axisCubeEntity**: *[AxisCubeEntity](axiscubeentity.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L31)*

___

### `Readonly` chartModifiers

• **chartModifiers**: *ObservableArray‹[IChartModifierBase](../interfaces/ichartmodifierbase.md)›*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[chartModifiers](scichartsurfacebase.md#readonly-chartmodifiers)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L69)*

An {@link ObservableArray} of [IChartModifierBase](../interfaces/ichartmodifierbase.md) derived types. Chart Modifiers provide behavior such as zooming, panning,
tooltips, legends and more in SciChart's High Performance Realtime
[JavaScript Charts](https://www.scichart.com/javascript-chart-features).
You can use our built in modifiers (see derived types of [ChartModifierBase](chartmodifierbase.md), or create your own for custom interaction behavior.

___

### `Readonly` domCanvas2D

• **domCanvas2D**: *HTMLCanvasElement*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md).[domCanvas2D](../interfaces/iscichartsurfacebase.md#readonly-domcanvas2d)*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domCanvas2D](scichartsurfacebase.md#readonly-domcanvas2d)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L81)*

The {@link HTMLCanvasElement} which is the HTML5 canvas which SciChart draws overlays (cursors, tooltips) to

___

### `Readonly` domCanvasWebGL

• **domCanvasWebGL**: *HTMLCanvasElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domCanvasWebGL](scichartsurfacebase.md#readonly-domcanvaswebgl)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L77)*

The {@link HTMLCanvasElement} which is the WebGL canvas that SciChart draws to

___

### `Readonly` domChartRoot

• **domChartRoot**: *HTMLDivElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domChartRoot](scichartsurfacebase.md#readonly-domchartroot)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L73)*

The {@link HTMLDivElement} which is the dom chart root

___

### `Readonly` domDivContainer

• **domDivContainer**: *HTMLDivElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domDivContainer](scichartsurfacebase.md#readonly-domdivcontainer)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L89)*

The inner {@link HTMLDivElement} div element

___

### `Readonly` domSvgContainer

• **domSvgContainer**: *SVGSVGElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[domSvgContainer](scichartsurfacebase.md#readonly-domsvgcontainer)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L85)*

The {@link SVGSVGElement} which is the SVG canvas which SciChart adds elements (tooltips, annotations) to

___

### `Readonly` mouseManager

• **mouseManager**: *MouseManager*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[mouseManager](scichartsurfacebase.md#readonly-mousemanager)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L94)*

The {@link MouseManager} subscribes to mouse events on the [domChartRoot](scichart3dsurface.md#readonly-domchartroot) and routes them to components within SciChart

___

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[propertyChanged](scichartsurfacebase.md#readonly-propertychanged)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L62)*

A propertyChanged EventHandler. See {@link EventHandler} for how to subscribe to and be
notified when a property changes on the [SciChartSurfaceBase](scichartsurfacebase.md)

___

### `Readonly` renderableSeries

• **renderableSeries**: *ObservableArray‹[IRenderableSeries3D](../interfaces/irenderableseries3d.md)›*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L29)*

___

### `Readonly` rootEntity

• **rootEntity**: *[RootSceneEntity](rootsceneentity.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L30)*

## Accessors

###  camera

• **get camera**(): *[ICameraController](../interfaces/icameracontroller.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L104)*

**Returns:** *[ICameraController](../interfaces/icameracontroller.md)*

• **set camera**(`value`: [ICameraController](../interfaces/icameracontroller.md)): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:108](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICameraController](../interfaces/icameracontroller.md) |

**Returns:** *void*

___

###  enableGizmo

• **get enableGizmo**(): *boolean*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:78](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L78)*

**Returns:** *boolean*

• **set enableGizmo**(`isEnabled`: boolean): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:82](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`isEnabled` | boolean |

**Returns:** *void*

___

###  isCopyCanvasSurface

• **get isCopyCanvasSurface**(): *HTMLCanvasElement*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[isCopyCanvasSurface](scichartsurfacebase.md#iscopycanvassurface)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L170)*

**Returns:** *HTMLCanvasElement*

___

###  otherSurfaces

• **get otherSurfaces**(): *[SciChartSurfaceBase](scichartsurfacebase.md)[]*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[otherSurfaces](scichartsurfacebase.md#othersurfaces)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:178](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L178)*

**Returns:** *[SciChartSurfaceBase](scichartsurfacebase.md)[]*

___

###  seriesViewRect

• **get seriesViewRect**(): *Rect‹›*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[seriesViewRect](scichartsurfacebase.md#seriesviewrect)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:188](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L188)*

Gets the Series View {@link Rect}, a rectangle relative to the entire size of the [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *Rect‹›*

___

###  surfaceType

• **get surfaceType**(): *[ESurfaceType](../enums/esurfacetype.md)*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[surfaceType](scichartsurfacebase.md#surfacetype)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:149](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L149)*

**Returns:** *[ESurfaceType](../enums/esurfacetype.md)*

___

###  viewportManager

• **get viewportManager**(): *[ViewportManager3DBase](viewportmanager3dbase.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:86](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L86)*

**Returns:** *[ViewportManager3DBase](viewportmanager3dbase.md)*

• **set viewportManager**(`viewportManager`: [ViewportManager3DBase](viewportmanager3dbase.md)): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`viewportManager` | [ViewportManager3DBase](viewportmanager3dbase.md) |

**Returns:** *void*

___

###  worldDimensions

• **get worldDimensions**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L96)*

**Returns:** *[Vector3](vector3.md)*

• **set worldDimensions**(`worldDimensions`: [Vector3](vector3.md)): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:99](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`worldDimensions` | [Vector3](vector3.md) |

**Returns:** *void*

___

###  xAxis

• **get xAxis**(): *[AxisBase3D](axisbase3d.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L115)*

**Returns:** *[AxisBase3D](axisbase3d.md)*

• **set xAxis**(`xAxis`: [AxisBase3D](axisbase3d.md)): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:118](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L118)*

**Parameters:**

Name | Type |
------ | ------ |
`xAxis` | [AxisBase3D](axisbase3d.md) |

**Returns:** *void*

___

###  yAxis

• **get yAxis**(): *[AxisBase3D](axisbase3d.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:125](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L125)*

**Returns:** *[AxisBase3D](axisbase3d.md)*

• **set yAxis**(`yAxis`: [AxisBase3D](axisbase3d.md)): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:128](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`yAxis` | [AxisBase3D](axisbase3d.md) |

**Returns:** *void*

___

###  zAxis

• **get zAxis**(): *[AxisBase3D](axisbase3d.md)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:135](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L135)*

**Returns:** *[AxisBase3D](axisbase3d.md)*

• **set zAxis**(`zAxis`: [AxisBase3D](axisbase3d.md)): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:138](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L138)*

**Parameters:**

Name | Type |
------ | ------ |
`zAxis` | [AxisBase3D](axisbase3d.md) |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[applyTheme](scichartsurfacebase.md#applytheme)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:161](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L161)*

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

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:169](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L169)*

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

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[delete](scichartsurfacebase.md#delete)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L155)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  doDrawingLoop

▸ **doDrawingLoop**(): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:157](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L157)*

**Returns:** *void*

___

###  invalidateElement

▸ **invalidateElement**(): *void*

*Overrides [SciChartSurfaceBase](scichartsurfacebase.md).[invalidateElement](scichartsurfacebase.md#abstract-invalidateelement)*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:145](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L145)*

**Returns:** *void*

___

###  onSciChartRendered

▸ **onSciChartRendered**(): *void*

*Defined in [src/Charting3D/Visuals/SciChart3DSurface.ts:153](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/SciChart3DSurface.ts#L153)*

**Returns:** *void*

___

###  setDestinations

▸ **setDestinations**(`destinations`: [TSciChartDestination](../globals.md#tscichartdestination)[]): *void*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[setDestinations](scichartsurfacebase.md#setdestinations)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L174)*

**Parameters:**

Name | Type |
------ | ------ |
`destinations` | [TSciChartDestination](../globals.md#tscichartdestination)[] |

**Returns:** *void*

___

###  setSeriesViewRect

▸ **setSeriesViewRect**(`seriesViewRect`: Rect): *void*

*Inherited from [SciChartSurfaceBase](scichartsurfacebase.md).[setSeriesViewRect](scichartsurfacebase.md#setseriesviewrect)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:196](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L196)*

Sets the Series View {@link Rect}, a rectangle relative to the entire size of the [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`seriesViewRect` | Rect | a {@link Rect} which defines the portion of the view for drawing series  |

**Returns:** *void*
