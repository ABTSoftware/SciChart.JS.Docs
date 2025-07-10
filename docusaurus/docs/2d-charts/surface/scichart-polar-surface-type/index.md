---
sidebar_position: 1
---

# The SciChartPolarSurface Type

The root polar chart view is called the [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). This is the JavaScript chart control you will be adding to your applications wherever you need a **Polar Chart**. You can add more than one SciChartPolarSurface to an HTML page and combine them with [Cartesian SciChartSurface](/docs/2d-charts/surface/scichart-surface-type-overview), you can configure them independently, and you can link them together.

The [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) extends [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) and inherits the same properties and functions which allow you to configure and control the chart.

You will find information about the [parent SciChartSurface class here](/docs/2d-charts/surface/scichart-surface-type-overview).

:::tip
Info about the properties and functions available can be found at the [TypeDoc API Documentation for SciChart:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html).
:::


## Surface Type Check for Renderable Series, Annotations and Chart Modifiers

When [IRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/irenderableseries.html) is attached to [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) or to [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) a type check is performed, [renderableSeries.isPolar:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/irenderableseries.html#ispolar) property should match the surface type.

When [IChartModifierBase:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ichartmodifierbase.html) is attached to the surface a type check is also performed, [chartModifier.modifierType:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ichartmodifierbase.html#modifiertype) property should match [sciChartSurface.surfaceType:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#surfacetype).

For renderable series and annotations the surface type should be obvious from the name as the polar items have it in the name. For example, [FastLineRenderableSeries](/docs/2d-charts/chart-types/fast-line-renderable-series) and [PolarLineRenderableSeries](/docs/2d-charts/chart-types/polar-line-renderable-series), [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) and [PolarCursorModifier](/docs/2d-charts/chart-modifier-api/polar-modifiers/polar-cursor-modifier).

A similar check is implemented for annotations. When [IAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iannotation.html) is attached to [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) or to [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) a type check is performed, [annotation.surfaceTypes:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iannotation.html#surfacetypes) should contain the [ESurfaceType:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/esurfacetype.html). However, unlike the renderable series, the annotations can be compatible with normal surface type `ESurfaceType.SciChartSurfaceType`, polar surface type `ESurfaceType.SciChartPolarSurfaceType` or with both surface types at the same time.

In an annotation is only for polar surface it has "Polar" prefix. For example, [PolarPointerAnnotation](/docs/2d-charts/annotations-api/polar-pointer-annotation). If annotation has no "Polar" prefix it can be either for normal surface only or for both depending on  [annotation.surfaceTypes:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iannotation.html#surfacetypes) property.

**These are the annotations compatible with both surface types SciChartSurface and SciChartPolarSurface**:

- [CustomAnnotation](/docs/2d-charts/annotations-api/custom-annotation)
- [LineAnnotation](/docs/2d-charts/annotations-api/line-annotation)
- [TextAnnotation](/docs/2d-charts/annotations-api/text-annotation)


