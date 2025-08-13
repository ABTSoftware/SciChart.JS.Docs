---
sidebar_position: 1
---

# DataSeries API Overview

What can you do with the DataSeries in SciChart?
------------------------------------------------

Most chart libraries are geared towards loading a chart with static data and never modifying it.

With SciChart.js, you can:

*   Create a chart initially with X, Y data and optional metadata (objects) per-point
*   Store values in floating-point 64 bit numbers
*   modify the data: appending new data, removing, inserting
*   Update values
*   Animate changes of data or new values
*   Replace all values - like in a spectrum analyzer
*   Scroll values  - real-time monitoring scenarios
*   Sweep values - wrap around as data reaches the right edge of the viewport.

DataSeries allow you to have fine-grained control over the chart data & enable dynamic updates.

DataSeries Types
----------------

The following DataSeries types exist in SciChart.js. All DataSeries types store memory in WebAssembly and implement the [IDeletable:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html) interface. You must call [IDeletable.delete():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html#delete) when discarding a DataSeries to free memory.

Internally the DataSeries wrap the [JavaScript number type, which is a double-precision 64-bit floating-point number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#:~:text=The%20JavaScript%20Number%20type%20is,arithmetic%20is%20subject%20to%20rounding.) and expect numeric values. You can also store Dates and render strings on chart axis, more on that below.

Here's the content formatted as a two-column Markdown table with headers:

| DataSeries Type | Applicable Series |
|----------------|------------------|
| **[XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html)** Stores X,Y Data | [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html), [FastMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html), [XyScatterRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html), [FastColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html) [FastLineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastlinesegmentrenderableseries.html) |
| **[XyyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html)** Stores X,Y1,Y2 data | **Required for:** FastBandRenderableSeries **Can also apply to:** [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html), [FastMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html), [XyScatterRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html), [FastColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html) (uses only X,Y1) |
| **[XyzDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries.html)** Stores X,Y,Z data | **Required for:** FastBubbleRenderableSeries **Can also apply to:** [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html), [FastMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html), [XyScatterRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html), [FastColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html) (uses only X,Y) |
| **[OhlcDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcdataseries.html)** Stores X, Open, High, Low, Close data | **Required for:** [FastCandlestickRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html) or [FastOhlcRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastohlcrenderableseries.html) **Can also apply to:** [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html), [FastMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html), [XyScatterRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyscatterrenderableseries.html), [FastColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html) (uses only X,Close) |
| **[UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html)** Stores Z-values as 2D array with positions computed from Start/Step values | **Required for:** [UniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmaprenderableseries.html) **Not applicable** to any other RenderableSeries |
| **[BoxPlotDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/boxplotdataseries.html)** Stores X, Maximum, UpperQuartile, Median, LowerQuartile and   Minimum data| **Required for:** [FastBoxPlotRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastboxplotrenderableseries.html) |
| **[XyNDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyndataseries.html)** Stores X and and an arbitrary number of Y data| **Applicable to:** [FastLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastlinerenderableseries.html) |
| **[XyTextDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xytextdataseries.html)** Stores X, Y and Text data| **Required for:** [FastTextRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fasttextrenderableseries.html) |
| **[XyxDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxdataseries.html)**  Stores X, Y and X1 data | **Applicable to:** [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) |
| **[XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxydataseries.html)**  Stores X, Y, X1 and Y1 data | **Applicable to:** [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) |
| **[NonUniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/nonuniformheatmapdataseries.html)**  Stores xStart, xStep, yStart and yStep data | **Applicable to:** [NonUniformHeatmapRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/nonuniformheatmaprenderableseries.html) |
| **[HlcDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hlcdataseries.html)**  Stores X, Y, H and L data | **Applicable to:** [FastErrorBarsRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fasterrorbarsrenderableseries.html) |


Creating, Assigning a DataSeries
--------------------------------

A DataSeries can be created with a single line of code, once you have a wasmContext (WebAssembly Context). The WebAssembly Context is created when you call the [SciChartSurface.create():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#create) function, and the context should be used for elements on that chart only.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
```ts
// import { SciChartSurface, XyDataSeries, FastLineRenderableSeries ... } from "scichart"
const xValues = [];
const yValues = [];
for (let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
}

// Create a DataSeries
const xyDataSeries = new XyDataSeries(wasmContext, {
    // Optional: pass X,Y values to DataSeries constructor for fast initialization
    // each are Arrays of numbers or Float64Array (typed array for best performance)
    xValues,
    yValues
});

// Create a renderableSeries and assign the dataSeries
const lineSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries: xyDataSeries
});

// add to the chart
sciChartSurface.renderableSeries.add(lineSeries);
```

```ts
// Demonstrates how to create and assign a dataSeries with SciChart.js using the Builder API
const { chartBuilder, ESeriesType, EThemeProviderType, XyDataSeries } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
        {
            type: ESeriesType.LineSeries,
            // This section creates a DataSeries with X,Y values
            xyData: {
                xValues,
                yValues
            },
            options: {
                stroke: "#FF6600",
                strokeThickness: 2
            }
        }
    ]
});

// However this is also valid (either xyData, or new XyDataSeries)
// sciChartSurface.renderableSeries.get(0).dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
```

</CodeSnippetBlock>

Once the DataSeries has been created, it can be assigned to a RenderableSeries by setting the [BaseRenderableSeries.dataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#dataseries) property. This is true for both the classic JavaScript API or the Builder API. More info on this in the section on [RenderableSeries](/2d-charts/chart-types/renderable-series-api-overview).

:::warning
Once you are finished with the DataSeries, don't forget to call [IDeletable.delete():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ideletable.html#delete). This frees WebAssembly native memory and releases it back to the operating system. For more info see the related article [Best Practices when Deleting DataSeries](/2d-charts/chart-types/data-series-api/deleting-memory).
:::

Setting Data Distribution Flags
-------------------------------

For optimal drawing and correct operation, SciChart.js needs to know the distribution of your data, whether sorted in the x-direction and whether the data contains NaN (Not a Number). These flags will be computed automatically, but can be specified for improved performance.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
```ts
const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
    // Data distribution flags are calculated automatically as you update data.
    // Providing them in advance can improve performance for big-data
    // Note: undefined behaviour will occur if these flags are set incorrectly
    dataIsSortedInX: true,
    dataEvenlySpacedInX: true,
    containsNaN: false
});
```

```ts
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
        {
            type: ESeriesType.LineSeries,
            // This section creates a DataSeries with X,Y values
            // IDataSeriesOptions are valid here
            xyData: {
                xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0],
                dataIsSortedInX: true,
                dataEvenlySpacedInX: true,
                containsNaN: false
            },
            options: {
                stroke: "#FF6600",
                strokeThickness: 2
            }
        }
    ]
});

// However this is also valid (either xyData, or onew XyDataSeries)
// sciChartSurface.renderableSeries.get(0).dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
```

</CodeSnippetBlock>

:::tip
When you don't specify Data Distribution Flags, SciChart.js will compute them automatically as data is updated. This adds a small performance overhead, only noticeable with very big data.

If you specify flags manually, make sure they are correct, and update them as your data updates. If you don't, undefined behaviour can occur.
:::

Getting the DataSeries XRange and YRange
----------------------------------------

All DataSeries types expose the [XRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#xrange) and YRange (via [getWindowedYRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html#getwindowedyrange)) of the underlying series. If you need to know the min and max of the DataSeries in the X or Y direction, then call one of these properties:

Example Title

<CodeSnippetBlock labels={["TS"]}>

```ts
const xyDataSeries = new XyDataSeries(webAssemblyContext);
xyDataSeries.appendRange([1, 2, 3], [10, 20, 30]);

// XRange will choose the first/last value if isSorted=true, else it will iterate over all values
const xRange = xyDataSeries.xRange; // Type NumberRange
console.log(`XRange: ${xRange.toString()}`);
// yRange requires a window of x-values. To get the entire yRange, pass in xRange
const yRange = xyDataSeries.getWindowedYRange(xRange, true, false);
console.log(`YRange: ${yRange.toString()}`);

// Outputs to console
// XRange: NumberRange (1, 3)
// YRange: NumberRange (10, 30)
```

</CodeSnippetBlock>

Storing Date & String values in DataSeries
------------------------------------------

All DataSeries store 64-bit double precision numeric values. However, if you want to display a date or a string on an axis, you need to do a small conversion first.

### Storing Dates on DataSeries in SciChart

DataSeries don't support dates, but you can store values as a unix timestamp and render them as a date on the axis. The process is:

1.  Store Dates as Unix timestamps in the DataSeries.
2.  Format the Date using our built-in [LabelProvider](/2d-charts/axis-api/axis-labels/label-provider-api-overview), or create your own

Examples can be found in the [SciChart.js examples suite](https://www.scichart.com/demo), or in our documentation on the [Label Formatting page](/2d-charts/axis-api/axis-labels/numeric-formats).

### Storing Strings in DataSeries in SciChart

Similarly, DataSeries don't support strings, but if you want to render strings, then it's advisable to use X values as sequential integers e.g. 0,1,2,3... and use the [LabelProvider feature](/2d-charts/axis-api/axis-labels/label-provider-api-overview) to format labels as strings.

#### See Also

* [Append, Insert, Update, Remove](/2d-charts/chart-types/data-series-api/append-insert-update-remove)
* [DataSeries Get Set value at Index](/2d-charts/chart-types/data-series-api/get-set-value-at-index)
