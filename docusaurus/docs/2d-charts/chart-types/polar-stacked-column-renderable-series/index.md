---
sidebar_position: 100
---

# ✅ The Polar Stacked Column Chart Type

:::tip
The [JavaScript Polar Stacked Column Chart](http://stagingdemo2.scichart.com/demo/javascript/polar-stacked-column-chart) can be found in the [SciChart.Js Examples Suite > Polar Windrose Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/release_v4.0/Examples/src/components/Examples/Charts2D/PolarCharts/PolarWindroseColumnChart) on Github, or our live demo at [demo.scichart.com](http://stagingdemo2.scichart.com/demo/react/polar-windrose-column-chart).
:::

<ChartFromSciChartDemo 
    src="http://stagingdemo2.scichart.com/demo/iframe/polar-windrose-column-chart"
    title="Polar Stacked Column Series Chart"
/>

The Polar Stacked Column Chart Type is created using a [PolarStackedColumnCollection:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumncollection.html) to manage multiple series of [PolarStackedColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumnrenderableseries.html), which represent the individual stacked columns in the chart.


## Create a Basic Polar Stacked Column Series

To create a Javascript [Polar Stacked Column Series:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumnrenderableseries.html) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers {33-35,37,47,56} file=./BasicAngular/demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./BasicAngular/demo" />

In the code above:

- Set xAxis' [polarAxisMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#polarmode) to `EPolarAxisMode.Angular` to create an Angular axis - the way most Polar charts are created.
- Set yAxis' [polarAxisMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#polarmode) to `EPolarAxisMode.Radial` to create a Radial axis which represents the height of the columns.
- We create a [PolarStackedColumnCollection:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumncollection.html) to hold the renderable series.
- We add 2 [PolarStackedColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumnrenderableseries.html) to the collection, each with its own data and styling.

> This type of plot is called a **WindRose**, or **Rose** chart, as it is often used to visualize wind speed and direction data.

## Create a Basic **Radial** Polar Stacked Column Series

To create a Javascript **Radial** [Polar Stacked Column Series:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumnrenderableseries.html) with SciChart.js, use the code from above, but replace the **xAxis** and **yAxis** config with this snippet:

```ts showLineNumbers {2,9} file=./BasicRadial/demo.js start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./BasicRadial/demo" />

In the code above:

- Set xAxis' [polarAxisMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#polarmode) to `EPolarAxisMode.Radial` to create a Radial axis.
- Set yAxis' [polarAxisMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#polarmode) to `EPolarAxisMode.Angular` to create an Angular axis.
    > Both of these settings now create a `vertical` or `radial` chart, where x-axis represents the height of the columns, and y-axis represents the angle. If this is something you want to replicate, 

#### See Also

* [Stacked Column Chart](/docs/2d-charts/chart-types/stacked-column-renderable-series)
* [Polar Column Chart](/docs/2d-charts/chart-types/polar-column-renderable-series)