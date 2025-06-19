---
sidebar_position: 105
---

# ✅ The Polar Pie Chart Type

The Polar Pie Chart type is achieved using SciChart's `PolarColumnRenderableSeries` and some data manipulation to mimic pie segments while using the [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) class.
It is the native way to create pie charts in SciChart.js, as opposed to using the [SciChartPieSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpiesurface.html)

<ChartFromSciChartDemo 
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-pie-chart"
    title="Polar Pie Chart"
/>

## Create a Basic Polar Pie Chart

To create a Javascript Polar Pie Chart with SciChart.js, use the following code:

```ts showLineNumbers {52-55,68} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

In the code above:

- We prepare the data from an array of values to 2 arrays: `xValues` and `x1Values`, showing the start and end angles of each "segment", while the `yValues` array is just filled with 1s.
- The `X` and `X1` value arrays along with [columnXMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#columnxmode): [EColumnMode.StartWidth:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/eperformancemarktype.html#setupstart), are used to create different-width columns, mimicking pie segments.
- The coloring for each segment must be different, we cannot set "fill", and have columns be the same color. Instead, we use the [MetadataPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html) so that each segment may have its own color.


---

# The Polar Pie Chart Type

The **Polar Pie Chart** uses SciChart’s flexible polar rendering system to elegantly mimic a classic pie chart using the [`PolarColumnRenderableSeries`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) on a [`SciChartPolarSurface`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html).

This approach gives you:
- The power of full polar coordinate customization (startAngle, totalAngle, innerRadius, etc)
- Segment-by-segment color control, including dynamic metadata-based per-column coloring
- The ability to combine a “pie chart” style with other polar data series on the same chart

> **Note:** This is the “native” way to build pie charts in the polar coordinate system. For classic SVG-based pies, see [`SciChartPieSurface`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpiesurface.html).

<iframe src="http://stagingdemo2.scichart.com/demo/iframe/polar-pie-chart" width="100%" height="600px" frameborder="0"></iframe>

<div style={{textAlign: "center"}}>
    Above: The JavaScript [Polar Pie Chart](http://stagingdemo2.scichart.com/demo/react/polar-pie-chart) example from the [SciChart.js Demo](https://www.scichart.com/demo/react).
</div>

## Features & Advantages

- Segments are rendered as *columns* with custom angular width representing their value, positioned around the circle
- Supports all the polar chart axes features (angle, inner radius, donut style, start angle, etc)
- Segment coloring can be set **independently** using a [`MetadataPaletteProvider`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html)
- Pie/donut effects are achieved by setting `innerRadius` on the radial axis

---

## How Does It Work?

- Data is preprocessed into arrays of:
  - `xValues` — start angle of each segment (in degrees or radians)
  - `x1Values` — end angle of each segment
  - `yValues` — (typically all 1) for equal segment radius
  - A metadata array for coloring  
- The [`PolarColumnRenderableSeries`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) is set to [`columnXMode: EColumnXMode.StartWidth`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startwidth), which means each column gets its own custom angular width (i.e., pie slice).
- A [`MetadataPaletteProvider`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html) is used to apply a unique color to each pie segment.

## Create a Basic Polar Pie Chart

To create a pie chart in SciChart.js using the polar coordinate system:

```ts showLineNumbers {52-55,68} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

In the example above:

- Data array values are converted into angular segments. For each pie slice:
  - `xValues[i]` is the starting angle
  - `x1Values[i]` is the ending angle (so, segment spans from `xValues[i]` to `x1Values[i]`)
  - `yValues` controls the radius; all 1s give a full pie (use less than 1 for a ring).
- The series’ [columnXMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#columnxmode) is set to [StartWidth:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startwidth), so each segment has its own width.
- A palette provider is attached, coloring each segment differently.
- To create a donut instead of a classic pie, simply set the polar axis’ `innerRadius` property.

## Tips & Best Practices

- Use the **metadata** array to assign tooltip data, custom colors, or selection state to each segment
- Adjust the **radial axis**’ [innerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html#innerradius) for donut/ring-style pie charts
- Set the **start angle** to rotate your entire pie as needed
- Add annotations or labels for segment values or percentage displays if needed
- Combine with other polar series (lines, scatter) for hybrid visualizations!

## Related API and Demos

- [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html)
- [MetadataPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html)
- [Polar Column & Pie Demo](https://www.scichart.com/demo/react/polar-pie-chart)
- [SciChartPieSurface for Classic Pie:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpiesurface.html)

The **Polar Pie Chart** is a powerful hybrid, bringing all the flexibility of scientific polar charts to the familiar and insightful pie chart format!