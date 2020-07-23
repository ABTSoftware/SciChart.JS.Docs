[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartSurfaceBase](scichartsurfacebase.md)

# Class: SciChartSurfaceBase

**`summary`** The base class for a 2D Cartesian [SciChartSurface](scichartsurface.md) or 3D Cartesian [SciChart3DSurface](scichart3dsurface.md) within SciChart -
High Performance Realtime [JavaScript Charts](https://www.scichart.com/javascript-chart-features)

**`remarks`** 
See derived types [SciChartSurface](scichartsurface.md) (2D Charts) and [SciChart3DSurface](scichart3dsurface.md) (3D Charts) for more specific instructions on how
to use the SciChartSurface and create a 2D or 3D [JavaScript Chart](https://www.scichart.com/javascript-chart-features)

## Hierarchy

* **SciChartSurfaceBase**

  ↳ [SciChart3DSurface](scichart3dsurface.md)

  ↳ [SciChartSurface](scichartsurface.md)

## Implements

* [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)

## Index

### Properties

* [chartModifiers](scichartsurfacebase.md#readonly-chartmodifiers)
* [domCanvas2D](scichartsurfacebase.md#readonly-domcanvas2d)
* [domCanvasWebGL](scichartsurfacebase.md#readonly-domcanvaswebgl)
* [domChartRoot](scichartsurfacebase.md#readonly-domchartroot)
* [domDivContainer](scichartsurfacebase.md#readonly-domdivcontainer)
* [domSvgContainer](scichartsurfacebase.md#readonly-domsvgcontainer)
* [mouseManager](scichartsurfacebase.md#readonly-mousemanager)
* [propertyChanged](scichartsurfacebase.md#readonly-propertychanged)

### Accessors

* [isCopyCanvasSurface](scichartsurfacebase.md#iscopycanvassurface)
* [otherSurfaces](scichartsurfacebase.md#othersurfaces)
* [seriesViewRect](scichartsurfacebase.md#seriesviewrect)
* [surfaceType](scichartsurfacebase.md#surfacetype)

### Methods

* [applyTheme](scichartsurfacebase.md#applytheme)
* [changeViewportSize](scichartsurfacebase.md#abstract-changeviewportsize)
* [delete](scichartsurfacebase.md#delete)
* [invalidateElement](scichartsurfacebase.md#abstract-invalidateelement)
* [setDestinations](scichartsurfacebase.md#setdestinations)
* [setSeriesViewRect](scichartsurfacebase.md#setseriesviewrect)

## Properties

### `Readonly` chartModifiers

• **chartModifiers**: *ObservableArray‹[IChartModifierBase](../interfaces/ichartmodifierbase.md)›*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L69)*

An {@link ObservableArray} of [IChartModifierBase](../interfaces/ichartmodifierbase.md) derived types. Chart Modifiers provide behavior such as zooming, panning,
tooltips, legends and more in SciChart's High Performance Realtime
[JavaScript Charts](https://www.scichart.com/javascript-chart-features).
You can use our built in modifiers (see derived types of [ChartModifierBase](chartmodifierbase.md), or create your own for custom interaction behavior.

___

### `Readonly` domCanvas2D

• **domCanvas2D**: *HTMLCanvasElement*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md).[domCanvas2D](../interfaces/iscichartsurfacebase.md#readonly-domcanvas2d)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L81)*

The {@link HTMLCanvasElement} which is the HTML5 canvas which SciChart draws overlays (cursors, tooltips) to

___

### `Readonly` domCanvasWebGL

• **domCanvasWebGL**: *HTMLCanvasElement*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L77)*

The {@link HTMLCanvasElement} which is the WebGL canvas that SciChart draws to

___

### `Readonly` domChartRoot

• **domChartRoot**: *HTMLDivElement*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L73)*

The {@link HTMLDivElement} which is the dom chart root

___

### `Readonly` domDivContainer

• **domDivContainer**: *HTMLDivElement*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L89)*

The inner {@link HTMLDivElement} div element

___

### `Readonly` domSvgContainer

• **domSvgContainer**: *SVGSVGElement*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L85)*

The {@link SVGSVGElement} which is the SVG canvas which SciChart adds elements (tooltips, annotations) to

___

### `Readonly` mouseManager

• **mouseManager**: *MouseManager*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L94)*

The {@link MouseManager} subscribes to mouse events on the [domChartRoot](scichartsurfacebase.md#readonly-domchartroot) and routes them to components within SciChart

___

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L62)*

A propertyChanged EventHandler. See {@link EventHandler} for how to subscribe to and be
notified when a property changes on the [SciChartSurfaceBase](scichartsurfacebase.md)

## Accessors

###  isCopyCanvasSurface

• **get isCopyCanvasSurface**(): *HTMLCanvasElement*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:170](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L170)*

**Returns:** *HTMLCanvasElement*

___

###  otherSurfaces

• **get otherSurfaces**(): *[SciChartSurfaceBase](scichartsurfacebase.md)[]*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:178](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L178)*

**Returns:** *[SciChartSurfaceBase](scichartsurfacebase.md)[]*

___

###  seriesViewRect

• **get seriesViewRect**(): *Rect‹›*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:188](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L188)*

Gets the Series View {@link Rect}, a rectangle relative to the entire size of the [SciChartSurfaceBase](scichartsurfacebase.md)

**Returns:** *Rect‹›*

___

###  surfaceType

• **get surfaceType**(): *[ESurfaceType](../enums/esurfacetype.md)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:168](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L168)*

Gets the Surface Type. See [ESurfaceType](../enums/esurfacetype.md) for list of values

**Returns:** *[ESurfaceType](../enums/esurfacetype.md)*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:146](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L146)*

Applies a theme (defined by [IThemeProvider](../interfaces/ithemeprovider.md)) to the current element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) | The theme data to apply  |

**Returns:** *void*

___

### `Abstract` changeViewportSize

▸ **changeViewportSize**(`width`: number, `height`: number): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:205](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L205)*

Changes the Viewport Size of the [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`width` | number | - |
`height` | number |   |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:155](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L155)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

### `Abstract` invalidateElement

▸ **invalidateElement**(): *void*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:163](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L163)*

Call invalidateElement() to trigger a redraw of the [SciChartSurfaceBase](scichartsurfacebase.md). SciChart's WebGL WebAssembly rendering
engine will schedule a redraw a the next time the renderer is free.

**Returns:** *void*

___

###  setDestinations

▸ **setDestinations**(`destinations`: [TSciChartDestination](../globals.md#tscichartdestination)[]): *void*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:174](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L174)*

**Parameters:**

Name | Type |
------ | ------ |
`destinations` | [TSciChartDestination](../globals.md#tscichartdestination)[] |

**Returns:** *void*

___

###  setSeriesViewRect

▸ **setSeriesViewRect**(`seriesViewRect`: Rect): *void*

*Defined in [src/Charting/Visuals/SciChartSurfaceBase.ts:196](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartSurfaceBase.ts#L196)*

Sets the Series View {@link Rect}, a rectangle relative to the entire size of the [SciChartSurfaceBase](scichartsurfacebase.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`seriesViewRect` | Rect | a {@link Rect} which defines the portion of the view for drawing series  |

**Returns:** *void*
