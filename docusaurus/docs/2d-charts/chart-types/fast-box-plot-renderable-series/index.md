---
sidebar_position: 65
---

# The Box Plot Series Type

A box plot (also called a box-and-whisker plot) is a statistical visualization that displays the distribution of a dataset through five key statistical measures. It's one of the most effective ways to show data distribution, identify outliers, and compare multiple datasets. The Box Plot Series Type is a powerful visualization tool that displays the distribution of data based on a five-number summary: minimum, first quartile (Q1), median (Q2), third quartile (Q3), and maximum. It is particularly useful for identifying outliers and understanding the spread of data.

## Key Configuration Options

### Data Point Width Modes
Sets the mode which determines how dataPointWidth is interpreted. Available values are [EDataPointWidthMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/edatapointwidthmode.html). Default is Relative.

- EDataPointWidthMode.Relative: Interprets Data Point Width as a relative to the full width which is axis length / number of columns. This assumes that there are no gaps in the data. If you are plotting sparse columns on a NumericAxis, consider Range mode
- EDataPointWidthMode.Absolute: Interprets Data Point Width as an absolute pixel value
- EDataPointWidthMode.Range: Interprets Data Point Width as the x data range per column. This is useful if you are plotting sparse columns on a NumericAxis

### Styling Components

- Main Box: Defined by stroke, fill, opacity, and strokeThickness
- Whiskers: Vertical lines extending from box to min/max values
- Caps: Horizontal lines at whisker ends
- Median Line: Horizontal line inside the box


## Create a Box Plot Chart

To create a Box Plot Chart with SciChart.js we need to use [FastBoxPlotRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastboxplotrenderableseries.html) and [BoxPlotDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/boxplotdataseries.html). Start with the following code:

<CodeSnippetBlock labels={["TS", "JS"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end
 
    ```
    ```ts showLineNumbers file=./Basic/demo.js start=region_A_start end=region_A_end
 
    ```
 
</CodeSnippetBlock>

This results in the following output: 

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" />

## Box Plot Complex Example

:::tip
The [JavaScript Box Plot Chart Example](https://stagingdemo2.scichart.com/demo/iframe/box-plot-chart) can be found in the [SciChart.Js Examples Suite > Box Plot Series](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/release_v4.0/Examples/src/components/Examples/Charts2D/BasicChartTypes/BoxPlotChart) on Github, or our live demo at [scichart.com/demo](https://stagingdemo2.scichart.com/demo).
:::

<ChartFromSciChartDemo
    src="https://stagingdemo2.scichart.com/demo/iframe/box-plot-chart"
    title="Box Plot Series Chart"
/>


