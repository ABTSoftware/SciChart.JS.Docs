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
| [.isAttached:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#isattached) | When true, the modifier is attached to a parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [.receiveHandledEvents:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#receivehandledevents) | When true, the modifier will receive all events even if that event is marked as handled by a previous modifier. When false (default), the modifier will not receive events if they are handled. |
| [.executeCondition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#executecondition) | The primary action execute condition that modifier should respond to (see below). |
| [.secondaryExecuteCondition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#secondaryexecutecondition) | The secondary action execute condition that modifier should respond to (see below). |
| [.modifierGroup:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiergroup) | Specifies a string ID to group modifiers. When one receives a mouse event, all modifiers in the same group receive the event. |
| [onAttach():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#onattach) | Called when the modifier is attached to a [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [onParentSurfaceRendered():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#onparentsurfacerendered) | Called when the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) is rendered. |
| [modifierMouseDown():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousedown) | Called when a mouse or touch-down event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [modifierMouseMove():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousemove) | Called when a mouse or touch-move event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [modifierMouseUp():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseup) | Called when a mouse or touch-up event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [modifierMouseWheel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermousewheel) | Called when a mouse wheel event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [modifierDoubleClick():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifierdoubleclick) | Called when a mouse or touch double-click event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [modifierMouseEnter():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseenter) | Called when a mouse-enter event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |
| [modifierMouseLeave():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#modifiermouseleave) | Called when a mouse-leave event occurs on the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). |

### Execute Conditions

Chart modifiers can be configured to respond to specific mouse and keyboard combinations using `executeCondition` and `secondaryExecuteCondition` properties. These conditions determine when the modifier should activate.

Each condition can specify:
- A mouse button (`button`) from `EExecuteOn` enum (e.g., MouseLeftButton, MouseMiddleButton)
- A keyboard modifier key (`key`) from `EModifierMouseArgKey` enum (Shift, Ctrl, Alt, or None)

Example usage:
```typescript
// This modifier will respond to:
// Primary action: Ctrl + Left Mouse Button
// Secondary action: Shift + Right Mouse Button
const modifier = new SomeModifier({
    executeCondition: { button: EExecuteOn.MouseLeftButton, key: EModifierMouseArgKey.Ctrl },
    secondaryExecuteCondition: { button: EExecuteOn.MouseRightButton, key: EModifierMouseArgKey.Shift }
});
```

### Series Interaction

Chart modifiers can interact with specific series through these methods:

| **Method** | **Description** |
|------------|-----------------|
| [onAttachSeries():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#onattachseries) | Called when a renderable series is attached to the chart |
| [onDetachSeries():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#ondetachseries) | Called when a renderable series is detached from the chart |
| [includeSeries():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html#includeseries) | Controls whether a series should be included in the modifier's behavior |

### Including/Excluding Series

The `includeSeries()` method is particularly important for modifiers that display legends or tooltips (like `CursorModifier`, `LegendModifier`, `RolloverModifier`, etc.). It allows you to control which series should be included in the modifier's behavior.

Example usage:
```typescript
// Include a specific series in the modifier
modifier.includeSeries(mySeries, true);

// Exclude a series from the modifier
modifier.includeSeries(mySeries, false);
```

When a series is included/excluded, the modifier will update its internal state (e.g., update tooltip content or legend items) if it's currently attached to a chart.

### ChartModifierBase2D Type

The [ChartModifierBase2D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html) type provides a base class for all modifiers on 2D [SciChartSurfaces](/2d-charts/surface/scichart-surface-type-overview) and 2D [SciChartPolarSurfaces](/2d-charts/surface/scichart-polar-surface-type). Use this type when creating custom modifiers for 2D Charts.

### ChartModifierBase3D Type

The [ChartModifierBase3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase3d.html) type provides a base class for all modifiers on **SciChart3DSurfaces**. Use this type when creating custom modifiers for 3D Charts. 

#### See Also

* [What is the ChartModifier API](/2d-charts/chart-modifier-api/chart-modifier-api-overview)