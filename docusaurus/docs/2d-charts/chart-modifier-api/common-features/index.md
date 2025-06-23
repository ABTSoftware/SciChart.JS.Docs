---
sidebar_position: 2
---

# ✅ Common ChartModifiers Features

All the ChartModifiers provided by SciChart.js implement the [IChartModifierBase interface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ichartmodifierbase.html) and derive from the [ChartModifierBase:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html) class. These provide a powerful API which gives the full access to internals of a chart, axes, series, annotations, mouse, touch events and more.

Please refer to the [What is a ChartModifier](../chart-modifier-api-overview/) article for the complete list of all the Chart Modifiers available out of the box in SciChart.

Common Features of Chart Modifiers
----------------------------------

### ChartModifierBase type

The [ChartModifierBase type:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html) has the following public API.

Refer to our [TypeDoc Documentation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html) for up to date and commented / annotated functions and properties available on this type.

| **Feature** | **Description** |
|-------------|-----------------|
| [.parentSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#parentsurface) | A property to get the parent [SciChartSurface](SciChartSurface.html) when the modifier is attached. |
| [.isEnabled:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#isenabled) | A property which determines if the current modifier is enabled or not. |
| [.isAttached:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#isattached) | When true, the modifier is attached to a parent [SciChartSurface](SciChartSurface.html). |
| [.receiveHandledEvents:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#receivehandledevents) | When true, the modifier will receive all events even if that event is marked as handled by a previous modifier. When false (default), the modifier will not receive events if they are handled. |
| [onAttach():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#onattach) | A function (which may be overridden) which is called when the modifier is attached to a [SciChartSurface](SciChartSurface.html). |
| [onParentSurfaceRendered():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#onparentsurfacerendered) | A function (which may be overridden) which is called when the parent [SciChartSurface](SciChartSurface.html)is rendered. |
| [modifierMouseDown():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousedown) | A function (which may be overridden) which is called when a mouse or touch-down event occurs on the parent [SciChartSurface](SciChartSurface.html). |
| [modifierMouseMove():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousemove) | A function (which may be overridden) which is called when a mouse or touch-move event occurs on the parent [SciChartSurface](SciChartSurface.html). |
| [modifierMouseUp():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseup) | A function (which may be overridden) which is called when a mouse or touch-up event occurs on the parent [SciChartSurface](SciChartSurface.html). |
| [modifierMouseWheel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousewheel) | A function (which may be overridden) which is called when a mouse wheel event occurs on the parent [SciChartSurface](SciChartSurface.html). |
| [modifierDoubleClick():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifierdoubleclick) | A function (which may be overridden) which is called when a mouse or touch double-click event occurs on the parent [SciChartSurface](SciChartSurface.html). |
| [modifierMouseEnter():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseenter) | A function (which may be overridden) which is called when a mouse-enter event occurs on the parent [SciChartSurface](SciChartSurface.html). |
| [modifierMouseLeave():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseleave) | A function (which may be overridden) which is called when a mouse-leave event occurs on the parent [SciChartSurface](SciChartSurface.html).

### ChartModifierBase2D Type

The [ChartModifierBase2D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html) type provides a base class for all modifiers on 2D [SciChartSurfaces](../../surface/scichart-surface-type-overview/) and 2D [SciChartPolarSurfaces](../../surface/scichart-polar-surface-type/). Use this type when creating custom modifiers for 2D Charts.

### ChartModifierBase3D Type

The [ChartModifierBase3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase3d.html) type provides a base class for all modifiers on **SciChart3DSurfaces**. Use this type when creating custom modifiers for 3D Charts. 

#### See Also

* [What is the ChartModifier API](../chart-modifier-api-overview/)
