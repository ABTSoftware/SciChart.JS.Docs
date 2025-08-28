---
sidebar_position: 105
---

# The Pie Chart (using Polar Columns)

The Polar Pie Chart type is achieved using SciChart's `PolarColumnRenderableSeries` and some data manipulation to mimic pie segments while using the [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) class.
It is the native way to create pie charts in SciChart.js, as opposed to using the [SciChartPieSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpiesurface.html)

:::note
The Polar Pie Chart is not yet able to support all features a regular pie chart would have, such as certain animation effects or selection behaviors, but it is a useful way to visualize data in a pie format using polar coordinates.
:::

<ChartFromSciChartDemo 
    src="https://stagingdemo2.scichart.com/demo/iframe/polar-pie-chart"
    title="Polar Pie Chart"
/>

## Create a Basic Polar Pie Chart

To create a Javascript Polar Pie Chart with SciChart.js, use the following code:

```ts showLineNumbers {62-67,79,80,82-92,95,99,100} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

In the code above:

- We prepare the data from an array of values to 2 arrays: `xValues` and `x1Values`, showing the start and end angles of each "segment", while the `yValues` array is just filled with 1s.
- The `X` and `X1` value arrays along with [columnXMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html#columnxmode): [EColumnMode.StartWidth:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/eperformancemarktype.html#setupstart), are used to create different-width columns, mimicking pie segments.
- The coloring for each segment must be different, we cannot set "fill", and have columns be the same color. Instead, we use the [MetadataPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html) so that each segment may have its own color.

---

## How Does It Work?

- Data is preprocessed into arrays of:
  - `xValues` — start angle of each segment (in degrees or radians)
  - `x1Values` — end angle of each segment
  - `yValues` — (typically all 1) for equal segment radius
  - A metadata array for coloring  
- The [`PolarColumnRenderableSeries`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) is set to [`columnXMode: EColumnXMode.StartWidth`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startwidth), which means each column gets its own custom angular width (i.e., pie slice).
- A [`MetadataPaletteProvider`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html) is used to apply a unique color to each pie segment.
- Using the metadata, you can als

## Tips & Best Practices

- Use the **metadata** array to assign tooltip data, custom colors, labels, or selection state to each segment
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