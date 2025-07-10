---
sidebar_position: 3
---

# Heatmap ColorMaps and Legends

## Converting Data-Values to Colors (Defining a Color Map)

Conversion of data value into color is defined by the property [UniformHeatmapRenderableSeries.colorMap:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmaprenderableseries.html#colormap). The ColorMap is [type HeatmapColorPalette:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html). You can define a custom Color Palette in JavaScript as follows:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {7-19} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

What this means:

*   The GradientStop at `Offset = 0` with `Color = "Transparent"` corresponds to the [HeatmapColorMap.minimum:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html#minimum) value of `0`
*   The GradientStop at `Offset = 1` with `Color = "#EC0F6C"` corresponds to [HeatmapColorMap.maximum:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html#maximum) value of `200`.
*   Data within this range will be blended according to the gradient stops between `0` and `1`
*   Data outside this range will be clamped to the minimum or maximum colors in the [HeatmapColorMap](https://scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html)

### Defining how Data-values outside of ColorMap range are drawn

By default, when defining a [HeatmapColorMap](https://scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html) any values that fall outside the range are clipped to the edges of the colormap. e.g. in the above example data falling outside of the range `0-200` is clipped to color `"#000000"` and `"#EC0F6C"` respectively.

There is also a [fillValuesOutOfRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baseheatmaprenderableseries.html#fillvaluesoutofrange) property which defines how the values outside the range are treated. Either clamped to the min/max color or drawn as transparent.

## Heatmap Legends

A heatmap legend may be generated with the [HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html) class. It is placed in a element just like a SciChartSurface. It will expand to fit the parent div.

<LiveDocSnippet name="./demo" />

The constructor accepts [IHeatmapLegendOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iheatmaplegendoptions.html) which lets you specify theme, colorMap and yAxisOptions. This allows configuration of the appearance of the heatmap legend. See these are the [TypeDoc documentation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iheatmaplegendoptions.html) for this type. 

Here's a full code sample below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {3,25-37} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

### Defining the ColorMap on the HeatmapLegend control 

ColorMaps obey similar rules to [Heatmap series](/docs/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type) (see above).

### Styling the Axis on the HeatmapLegend control

yAxisOptions is type [IAxisBase2dOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iaxisbase2doptions.html). This is the same type that is passed to an Axis in SciChart.

To Style the HeatmapLegend is very similar to styling an axis in SciChart. See more at the page [Axis Styling](/docs/2d-charts/axis-api/axis-styling/title-labels-gridlines-axis-band-style).

## Updating ColorMaps Dynamically

[HeatmapColorMaps](https://scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html) can be updated dynamically by changing their properties. All the properties such as minimum, maximum, gradientStops are fully reactive and when set, the chart will redraw.

Below we've created a demo to show how to update [HeatmapColorMap.gradientStops:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html#gradientstops) dynamically by adding interactivity to the [HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html).

<CodeSnippetBlock labels={["TS"]}>
    ```ts {42,45-61,65} showLineNumbers file=../dynamic-colormap-legend/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet 
    name="../dynamic-colormap-legend/demo" 
    htmlPath="../dynamic-colormap-legend/demo.html" 
    cssPath="../dynamic-colormap-legend/demo.css" 
/>

The [HeatmapLegend:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html) is implemented internally using a SciChartSurface. You can access the surface via the [innerSciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html#innerSciChartSurface) property. After that, you can configure the axis, series, annotations just like you would any other SciChartSurface.