---
sidebar_position: 1
---

# What is the ChartModifier API

Within the SciChart.js JavaScript Chart SDK, ChartModifiers are the classes which can be added to a [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) to give it a **certain** **behavior**. For instance, all **zooming, panning operations**, **tooltips**, **legends** and even **selection** of points or lines are handled by [ChartModifierBase:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase.html) derived classes in the SciChart codebase.

There are many different ChartModifiers provided by SciChart and each one deserves an article by itself! This article is concerned with simply giving an overview of the modifiers and where you can find the examples in our Examples Suite which demonstrate them.

There are also several individual articles on the ChartModifiers and how to configure them in the SciChart.js Documentation. Please find them at the bottom of this page.

Zoom, Pan Modifiers
-------------------

The following modifiers can be used if you want to add scrolling or zooming behavior to a chart:

| Modifier Name | Description |
|--------------|-------------|
| **[ZoomPanModifier](/2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier)** | **Pans** the chart in X, Y or both directions with inertia via finger sliding. |
| **[MouseWheelZoomPanModifier](/2d-charts/chart-modifier-api/zooming-and-panning/mouse-wheel-zoom-modifier)** | **Zooms** the chart in or out on mouse-wheel (or two finger scroll). |
| **[XAxisDragModifier](/2d-charts/chart-modifier-api/zooming-and-panning/x-axis-drag-modifier)** | **Scales** or pans an X Axis via mouse-drag. |
| **[YAxisDragModifier](/2d-charts/chart-modifier-api/zooming-and-panning/y-axis-drag-modifier)** | **Scales** or pans a Y Axis via mouse-drag. |
| **[RubberBandXyZoomModifier](/2d-charts/chart-modifier-api/zooming-and-panning/rubber-band-xy-zoom-modifier)** | **Zooms** a chart inside a rectangle or horizontal section that is drawn on the chart with a finger. |
| **[ZoomExtentsModifier](/2d-charts/chart-modifier-api/zooming-and-panning/zoom-extents-modifier)** | **Resets the zoom** to the data extents via double-tapping. |
| **[SciChartOverview](/2d-charts/chart-modifier-api/zooming-and-panning/overview)** | Creates an **overview chart** that allows you to **zoom and pan** the main chart. |

Interactivity, Tooltips, Cursor Modifiers
-----------------------------------------

These modifiers allow to interact with chart series or inspect them:

| **Modifier Name** | **Description** |
|-------------------|-----------------|
|**[RolloverModifier](/2d-charts/chart-modifier-api/rollover-modifier)**|Provides a **vertical slice cursor with tooltips** and markers rolling over a series.|
|**[CursorModifier](/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview)**|Provides a **crosshairs** with a tooltip and axis labels.|

Miscellaneous Modifiers
-----------------------

Modifiers below are used as helpers and can be a useful addition to a chart:

| **Modifier Name** | **Description** |
|-------------------|-----------------|
| **[LegendModifier](/2d-charts/chart-modifier-api/miscellaneous-modifiers/legend-modifier)** | Allows creation and configuration a **Legend** for a chart. |

To learn more about ChartModifiers API, please read the [Common ChartModifiers Features](/2d-charts/chart-modifier-api/common-features) article. To find out about a specific ChartModifier type, please refer to a corresponding article about this Modifier type.

Polar Modifiers
---------------

Below it the list of chart modifiers for [Polar Charts](/2d-charts/surface/scichart-polar-surface-type).

| **Modifier Name** | **Description** |
|-------------------|-----------------|
| **[PolarArcZoomModifier](/2d-charts/chart-modifier-api/polar-modifiers/polar-arc-zoom-modifier)** | Allows zooming to a selected arc on Polar surface. |
| **[PolarCursorModifier](/2d-charts/chart-modifier-api/polar-modifiers/polar-cursor-modifier)** | Displays a tooltip for closest data point when hovering over the polar chart |
| **[PolarDataPointSelectionModifier](/2d-charts/chart-modifier-api/polar-modifiers/polar-data-point-selection-modifier)** | Allows for data point selection for polar charts |
| **[PolarLegendModifier](/2d-charts/chart-modifier-api/polar-modifiers/polar-legend-modifier)** | Allows creation and configuration a **Legend** for a Polar chart. |
| **[PolarMouseWheelZoomModifier](/2d-charts/chart-modifier-api/polar-modifiers/polar-mouse-wheel-zoom-modifier)** | Allows users to rotate or zoom in and out of a polar chart using the mouse wheel |
| **[PolarPanModifier](/2d-charts/chart-modifier-api/polar-modifiers/polar-pan-modifier)** | Allows users to pan, rotate and zoom in/out a polar chart using the mouse |
| **[PolarZoomExtends](/2d-charts/chart-modifier-api/polar-modifiers/polar-zoom-extents-modifier)** | Allows users to reset chart to initial state |
