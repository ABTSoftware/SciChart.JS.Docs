---
sidebar_position: 100
---

# ✅ The Polar Uniform Heatmap Chart Type

## Overview

The [PolarUniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaruniformheatmaprenderableseries.html) displays "heat" values as colored cells in a polar (circular) coordinate system—perfect for visualizing intensity, density, or other matrix-like data in a circular form. Each cell is mapped from a two-dimensional array of z-values, with color gradients representing the data's magnitude.

<iframe src="http://stagingdemo2.scichart.com/demo/iframe/polar-uniform-heatmap-chart" width="100%" height="600px" frameborder="0"></iframe>

<div style={{textAlign: "center"}}> 
Above: The JavaScript [Polar Uniform Heatmap Chart](http://stagingdemo2.scichart.com/demo/react/polar-uniform-heatmap-chart) example from the [SciChart.js Demo](https://www.scichart.com/demo/react).
</div>

## Properties

Key options for [IPolarUniformHeatmapRenderableSeriesOptions:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolaruniformheatmaprenderableseriesoptions.html) include:

- [dataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmaprenderableseriesoptions.html#dataseries) — A [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/uniformheatmapdataseries.html) containing a 2D array of `zValues`, and X / Y Step and Start.
- [colorMap:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/heatmapcolormap.html) — Maps zValues to colors via [HeatmapColorMap:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmapcolormapoptions.html#gradientstops).
- [useLinearTextureFiltering:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmaprenderableseriesoptions.html#uselineartexturefiltering) — Enables smooth texture filtering (default: `false`).
- [fillValuesOutOfRange:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmaprenderableseriesoptions.html#fillvaluesoutofrange) — Fills cells outside the color map’s min/max with a defined edge color.
- [stroke:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmaprenderableseriesoptions.html#stroke) and [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmaprenderableseriesoptions.html#strokethickness) — Cell border styling.
- [dataLabels:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmaprenderableseriesoptions.html#datalabels) — Enable and style per-cell text labels.

## Examples

### Basic Polar Heatmap

```ts showLineNumbers {22-23,26,28,40,42,50-70} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

In the code above:
- A 2D array of `zValues` is generated via `Array.from`, representing value "intensity" at each polar sector.
- [PolarUniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaruniformheatmaprenderableseries.html) is constructed, passing a [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/uniformheatmapdataseries.html) and a custom [HeatmapColorMap:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/heatmapcolormap.html) with gradient stops, from 0 to 100.
- Polar axes are configured for angular and radial sweep.
- Chart modifiers such as [PolarPanModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html), [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html), and [PolarMouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html) provide interaction.

### Polar Heatmap with Legend

```ts showLineNumbers {1-8,23,27,55} file=./LegendHeatmap/demo.ts start=region_A_start end=region_A_end
```
You also need an additional HTML element for the legend:

```html showLineNumbers {3} file=./LegendHeatmap/demo.html
```

With these CSS properties:

```css showLineNumbers {10-16} file=./LegendHeatmap/demo.css
```

<LiveDocSnippet name="./LegendHeatmap/demo" />

In the code above:
- The [HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/heatmaplegend.html) component creates an interactive vertical legend, visually linking the z-value color range.
- A custom color map with **multiple gradient stops** is defined for meaningful value zones.
- Data is generated using a `generateHeatmapData` utility function (see demo source for details).
- Both the heatmap and the legend share the same [HeatmapColorMap:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/heatmapcolormap.html) instance to keep color mapping consistent.
- Axes are positioned and styled for optimal polar data presentation.

### Medical Imaging (Ultrasound Heatmap)

<iframe src="http://stagingdemo2.scichart.com/demo/iframe/polar-uniform-heatmap-ultrasound" width="100%" height="600px" frameborder="0"></iframe>

:::tip
For the full code walkthrough and live demo, see the **[Polar Ultrasound Heatmap Example](http://stagingdemo2.scichart.com/demo/react/polar-ultrasound-heatmap)**
:::


## Tips & Best Practices

- **Performance**: For large polar heatmaps, enable [useLinearTextureFiltering:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iheatmaprenderableseriesoptions.html#uselineartexturefiltering) for smoother visual transitions, or disable it for sharp, pixelated looks.
- **Legend**: Use [HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/heatmaplegend.html) for accessible, interpretable color mapping.
- **Donut charts**: Set the [innerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolaraxisoptions.html#innerradius) property of the radial axis for donut-shaped polar heatmaps.
- **Manipulate Angles**: Use [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolaraxisoptions.html#totalangle) or [totalAngleDegrees:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolaraxisoptions.html#totalangledegrees) properties of the angular axis to control the heatmap's angular range. From `0` to `2π radians` or `360 degrees`.
- **Interactivity**: 
  - [PolarPanModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html), [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html), and [PolarMouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html) can all be added for advanced user navigation.
  - Don't forget about annotations! Use [LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/linearrowannotation.html) or [TextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/textannotation.html) to highlight specific areas or values in your polar heatmap. All other annotations from SciChart.js are also supported.

## Use Cases

Polar heatmaps are widely used in:
- Physics and engineering for field visualization
- Medical imaging (e.g. **ultrasound**, see [Polar Ultrasound Demo](http://stagingdemo2.scichart.com/demo/react/polar-ultrasound-heatmap))
- Environmental mapping
- Radar and sonar data

[PolarUniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaruniformheatmaprenderableseries.html) enables powerful, visually compelling circular heatmaps in JavaScript. With SciChart.js, you can combine rich color gradients, advanced axis control, interaction, and even medical imaging overlays in a performant, interactive chart component.