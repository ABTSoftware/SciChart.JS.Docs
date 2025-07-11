---
sidebar_position: 2
---

# Common ChartModifiers Features

All the ChartModifiers provided by SciChart.js implement the [IChartModifierBase interface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ichartmodifierbase.html) and derive from the [ChartModifierBase:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html) class. These provide a powerful API which gives the full access to internals of a chart, axes, series, annotations, mouse, touch events and more.

Please refer to the [What is a ChartModifier](/2d-charts/chart-modifier-api/chart-modifier-api-overview) article for the complete list of all the Chart Modifiers available out of the box in SciChart.

Common Features of Chart Modifiers
----------------------------------

### ChartModifierBase type

The [ChartModifierBase type:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html) has the following public API.

Refer to our [TypeDoc Documentation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html) for up to date and commented / annotated functions and properties available on this type.

| **Feature** | **Description** |
|-------------|-----------------|
| [.parentSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#parentsurface) | A property to get the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |
| [.isEnabled:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#isenabled) | A property which determines if the current modifier is enabled or not. |
| [.isAttached:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#isattached) | When true, the modifier is attached to a parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |. |
| [.receiveHandledEvents:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#receivehandledevents) | When true, the modifier will receive all events even if that event is marked as handled by a previous modifier. When false (default), the modifier will not receive events if they are handled. |
| [onAttach():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#onattach) | A function (which may be overridden) which is called when the modifier is attached to a [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |). |
| [onParentSurfaceRendered():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#onparentsurfacerendered) | A function (which may be overridden) which is called when the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |)is rendered. |
| [modifierMouseDown():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousedown) | A function (which may be overridden) which is called when a mouse or touch-down event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |). |
| [modifierMouseMove():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousemove) | A function (which may be overridden) which is called when a mouse or touch-move event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |). |
| [modifierMouseUp():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseup) | A function (which may be overridden) which is called when a mouse or touch-up event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |). |
| [modifierMouseWheel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousewheel) | A function (which may be overridden) which is called when a mouse wheel event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |). |
| [modifierDoubleClick():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifierdoubleclick) | A function (which may be overridden) which is called when a mouse or touch double-click event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |). |
| [modifierMouseEnter():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseenter) | A function (which may be overridden) which is called when a mouse-enter event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |). |
| [modifierMouseLeave():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseleave) | A function (which may be overridden) which is called when a mouse-leave event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) when the modifier is attached. |).

### ChartModifierBase2D Type

The [ChartModifierBase2D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html) type provides a base class for all modifiers on 2D [SciChartSurfaces](/2d-charts/surface/scichart-surface-type-overview) and 2D [SciChartPolarSurfaces](/2d-charts/surface/scichart-polar-surface-type). Use this type when creating custom modifiers for 2D Charts.

### ChartModifierBase3D Type

The [ChartModifierBase3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase3d.html) type provides a base class for all modifiers on **SciChart3DSurfaces**. Use this type when creating custom modifiers for 3D Charts. 

#### See Also

* [What is the ChartModifier API](/2d-charts/chart-modifier-api/chart-modifier-api-overview)
