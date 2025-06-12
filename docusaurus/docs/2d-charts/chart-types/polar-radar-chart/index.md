---
sidebar_position: 105
---

# ✅ The Polar Radar Chart Type

The Radar chart (or Spider chart) type displays data in a circular layout, where each axis represents a different variable, most often a category. The axes are connected drawn to form a polygon, allowing for easy comparison of multiple variables.

The data is usually plotted using the [PolarLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) or [PolarMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html) classes, which are specialized for polar coordinates.

<ChartFromSciChartDemo 
    src="http://stagingdemo2.scichart.com/demoiframe/polar-radar-chart"
    title="Polar Radar Chart"
/>

## Create a Basic Polar Radar Series

To create a Javascript Polar Radar Series with SciChart.js, use the following code:

```ts showLineNumbers {20,49-50} file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

Key aspects of the code above:
- This **radar** / **spider** / **cobweb** chart look is achieved by using `gridlineMode`: [EPolarGridlineMode.Polygons:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolargridlinemode.html) on the radial axis (yAxis), which draws straight lines in between gridlines instead of arcs.
- We set `labels: [ "Offense", "Shooting", ... ]` on the angular axis (xAxis) to display the categories.
- While defining the [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) for the [PolarMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html), we use this trick on the `xValues` array to reach the 1st point from the end of the series, so that the polygon closes correctly:
```js
xValues: [...xValues, xValues[xValues.length] + 1], // assuming step = 1
```

- For the `yValues` array we do this by re-using the 1st value:
```js
yValues: [...yValues, yValues[0]]
```