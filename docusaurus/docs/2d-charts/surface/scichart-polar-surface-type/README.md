---
sidebar_position: 1
---

# ✅ The SciChartPolarSurface Type

The root polar chart view is called the [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). This is the JavaScript chart control you will be adding to your applications wherever you need a polar chart. You can add more than one SciChartPolarSurface to an HTML page and combine them with [Cartesian SciChartSurface](/docs/2d-charts/surface/scichart-surface-type-overview/README.md), you can configure them independently, and you can link them together.

The [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) extends [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) and inherits the same properties and functions which allow you to configure and control the chart.

You will find information about the [parent SciChartSurface class here](/docs/2d-charts/surface/scichart-surface-type-overview/README.md).

:::tip
Info about the properties and functions available can be found at the [TypeDoc API Documentation for SciChart:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html).
:::


## Surface Type Check for Renderable Series, Annotations and Chart Modifiers

When [IRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/irenderableseries.html) is attached to [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) or to [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) a type check is performed, [renderableSeries.isPolar:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/irenderableseries.html#ispolar) property should match the surface type.

A similar check is implemented for annotations. When [IAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iannotation.html) is attached to [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) or to [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) a type check is performed, [annotation.surfaceTypes:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iannotation.html#surfacetypes) should contain the [ESurfaceType:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/esurfacetype.html). However, unlike the renderable series annotations can be compatible with both surface types `ESurfaceType.SciChartSurfaceType` and `ESurfaceType.SciChartPolarSurfaceType`.

When [IChartModifierBase:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ichartmodifierbase.html) is attached to the surface a type check is also performed, [chartModifier.modifierType:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ichartmodifierbase.html#modifiertype) property should match [sciChartSurface.surfaceType:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#surfacetype).
