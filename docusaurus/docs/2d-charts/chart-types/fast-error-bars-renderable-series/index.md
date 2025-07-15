---
sidebar_position: 22
---

# The Error Bars Chart Type

Error Bars can be added to a SciChart.js chart using the [FastErrorBarsRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html) type.

:::tip
The [JavaScript Error Bars Chart Example](https://scichart.com/demo/javascript-error-bars-chart) can be found in the [SciChart.Js Examples Suite > Error Bars Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/ErrorBarsChart) on Github, or our live demo at [scichart.com/demo](https://scichart.com/demo/javascript/error-bars-chart).
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/error-bars-chart"
    title="Error Bars Series Chart"
/>

## Creating Error Bars Series

To create a [Javascript Error Bars Chart](https://scichart.com/demo/javascript-error-bars-chart) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {23,26-28} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```ts {16,19-21} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

In the code above:

*   We define [HlcDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/hlcdataseries.html), passing arrays with X, Y, High, and Low values
*   A [FastErrorBarsRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html) is created with dataSeries option and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   Alternatively we can assign a [FastErrorBarsRenderableSeries.dataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#dataseries) property, which stores the HLC data to render.

## Error Mode

[FastErrorBarsRenderableSeries.errorMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#errormode) property defines whether high and low caps should be displayed on error bars. Available values are defined by enum [EErrorMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/eerrormode.html). We can set this property either via the series itself, or passing in to constructor options (see type [IFastErrorBarsRenderableSeriesOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifasterrorbarsrenderableseriesoptions.html)).

The following example shows how to use only **high** error on bars.

```ts {3} showLineNumbers
const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
    dataSeries: hlcDataSeries,
    errorMode: EErrorMode.High,
});
```

This results in the following output:

<CenteredImageWrapper 
    src="https://www.scichart.com/documentation/js/current/images/RenderableSeries_ErrorBars_HighBars.png" 
    title="Error Bars Series with High Error Segments Only"
/>

## Horizontal Error Bars

It is possible to change the direction of Error Bars to horizontal using [FastErrorBarsRenderableSeries.errorDirection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#errordirection) property. In this case the High & Low values in [HlcDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/hlcdataseries.html) are applied in the X-direction.

```ts {9-10,12} showLineNumbers
import { EErrorDirection } from "scichart";
// ...

const horizontalBars = new FastErrorBarsRenderableSeries(wasmContext, {
    dataSeries: new HlcDataSeries(wasmContext, {
        xValues: [0, 1, 2, 2.5, 4.5, 5, 6, 7, 8],
        yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0],
        // High, Low becomes left-right as absolute values
        highValues: [-0.5, 0.6, 1.1, 2.3, 4.0, 4.9, 5.8, 6.8, 7.5],
        lowValues: [0.4, 1.2, 2.1, 3.0, 4.7, 5.7, 6.5, 7.3, 8.9],
    }),
    errorDirection: EErrorDirection.Horizontal,
});
```

This results in the following output

<CenteredImageWrapper 
    src="https://www.scichart.com/documentation/js/current/images/RenderableSeries_HorizontalErrorBars.png" 
    title="Horizontal ErrorBars"
/>

## Advanced Properties

### Setting Stroke, StrokeThickness and StrokeDash

Error Bars in SciChart.js support setting [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#stroke), [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#strokethickness) and [strokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#strokeddasharray) to set a dashed line style.

For example, this code:

```ts showLineNumbers
const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
    dataSeries: hlcDataSeries,
    stroke: "Aqua",
    strokeDashArray: [4, 2],
    strokeThickness: 4,
});
```

Results in this:

<CenteredImageWrapper 
    src="https://www.scichart.com/documentation/js/current/images/RenderableSeries_ErrorBars_DashedLines.png"
    title="Advanced properties on Error Bars - stroke, strokeThickness, strokeDashArray"
/>

:::tip
Learn more about Dashed Line Styling at this [documentation page](/2d-charts/styling-and-theming/style-chart-parts-in-code).
:::

### Drawing a Line and PointMarker through Error Bars

You can add a PointMarker to highlight the Y-value of an [HlcDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/hlcdataseries.html). The data can also be used twice to display both lines / scatter points and error bars.

Try this code out:

```ts {3,7,13,17-22} showLineNumbers
import { FastLineRenderableSeries, FastErrorBarsRenderableSeries, HlcDataSeries, EllipsePointMarker  } from "scichart";

// Many RenderableSeries can share one DataSeries in SciChart

// Use the HlcDataSeries on a FastLineRenderableSeries
const lineSeries = new FastLineRenderableSeries(wasmContext, { 
    dataSeries: hlcDataSeries, // will render XY values, and ignore high/low values
    stroke: "SteelBlue" 
});

// Use the same HlcDataSeries on a FastErrorBarsRenderableSeries. It will render high/lows for error bars
const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
    dataSeries: hlcDataSeries,
    stroke: "SteelBlue",
    strokeThickness: 3,
    opacity: 0.77,
    pointMarker: new EllipsePointMarker(wasmContext, {
        width: 10,
        height: 10,
        fill: "SteelBlue",
        stroke: "#333"
    })
});

sciChartSurface.renderableSeries.add(lineSeries);
sciChartSurface.renderableSeries.add(errorBarsSeries);
```

This results in the folllowing output:

<CenteredImageWrapper 
    src="https://www.scichart.com/documentation/js/current/images/RenderableSeries_ErrorBars_andLines_PointMarker.png"
    title="Drawing a Line and PointMarkers through Error Bars"
/>

### Setting the Width of Error Bars Whiskers

You can define the width of Error Bars using [dataPointWidth:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#datapointwidth) and [dataPointWidthMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#datapointwidthmode) which supports values from [EDataPointMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html).

For example. setting dataPointWidthMode to Absolute and dataPointWidth to 50 ensures 50 pixels always.

```ts {6} showLineNumbers
const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
    dataSeries: hlcDataSeries,
    stroke: "LightSteelBlue",
    strokeThickness: 3,
    dataPointWidth: 50,
    dataPointWidthMode: EDataPointWidthMode.Absolute,
});
sciChartSurface.renderableSeries.add(errorBarsSeries);
```

<CenteredImageWrapper 
    src="https://www.scichart.com/documentation/js/current/images/RenderableSeries_ErrorBars_ContantWidth.png" 
    title="Setting the Width of Error Bars Whiskers"
/>

The alternative mode is [EDataPointWidthMode.Relative:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatapointwidthmode.html). 

In this mode a dataPointWidth value of `0.0` - `1.0` occupies 0% to 100% of the available space as calculated by SciChart.js.

```ts {6} showLineNumbers
const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
    dataSeries: hlcDataSeries,
    stroke: "LightSteelBlue",
    strokeThickness: 3,
    dataPointWidth: 0.2,
    dataPointWidthMode: EDataPointWidthMode.Relative,
});
sciChartSurface.renderableSeries.add(errorBarsSeries);
```

<CenteredImageWrapper 
    src="https://www.scichart.com/documentation/js/current/images/RenderableSeries_ErrorBars_RelativeWidth.png"
    title="The Relative Width of Error Bars Whiskers"
/>

### Showing/Hiding Error Bars Connector or Whiskers 

You can specify which parts of an Error Bar should be visible using [drawConnector:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#drawconnector) and [drawWhiskers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fasterrorbarsrenderableseries.html#drawwhiskers) and finally;

```ts {5-6} showLineNumbers
const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
    dataSeries: hlcDataSeries,
    stroke: "LightSteelBlue",
    strokeThickness: 3,
    drawConnector: false, // Draw the horizontal connector
    drawWhiskers: true,   // Draw the top/bottom whiskers
});
sciChartSurface.renderableSeries.add(errorBarsSeries);
```

Results in this:

<CenteredImageWrapper 
    src="https://www.scichart.com/documentation/js/current/images/RenderableSeries_ErrorBars_HidingParts.png" 
    title="Hiding Parts of Error Bars - Connector / Whiskers"
/>