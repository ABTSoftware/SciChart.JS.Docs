---
sidebar_position: 63
---

# The Bezier (Smoothed) Stacked Mountain Series Type

A variation on the [Stacked Mountain Series](The Stacked Mountain Series Type.html) is the SmoothStackedMountainRenderableSeries. This uses a custom Bezier smoothing algorithm to create a smoothed line (spline line) to interpolate between datapoints.

Smoothed Stacked Mountain Charts can be created by a combination of the [SmoothStackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smoothstackedmountainrenderableseries.html) and [StackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html) types. 

The [](https://demo.scichart.com/javascript-stacked-mountain-chart)[](https://demo.scichart.com/javascript-stacked-mountain-chart)[JavaScript Smooth Stacked Mountain Chart Example](https://demo.scichart.com/javascript/smooth-stacked-mountain-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/)

_**Above**: The [JavaScript Smoothed Stacked Mountain Chart example](https://demo.scichart.com/javascript-stacked-mountain-chart) from the SciChart.js Demo._

Create a Bezier Smoothed Stacked Mountain Series
------------------------------------------------

To create a [JavaScript Smoothed Stacked Mountain Series](https://demo.scichart.com/javascript/smooth-stacked-mountain-chart), use the following code:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Demonstrates how to create a Column chart with SciChart.js
const {
    SciChartSurface,
    NumericAxis,
    SmoothStackedMountainRenderableSeries,
    StackedMountainCollection,
    XyDataSeries,
    SciChartJsNavyTheme
} = SciChart;

// or, for npm, import { SciChartSurface, ... } from "scichart"
const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
});
sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

// Data for the example
const xValues = \[1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003\];
const yValues1 = \[10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11\];
const yValues2 = \[12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10\];
const yValues3 = \[7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22\];
const yValues4 = \[16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17\];
const yValues5 = \[7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16\];

// Create some RenderableSeries - for each part of the stacked m mountain
// Notice the stackedGroupId. This defines if series are stacked (same), or grouped side by side (different)
const rendSeries1 = new SmoothStackedMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues: yValues1,
        dataSeriesName: "EU"
    }),
    fill: "#882B91",
    stroke: "#E4F5FC",
    strokeThickness: 2,
    opacity: 0.8
});

const rendSeries2 = new SmoothStackedMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues: yValues2,
        dataSeriesName: "Asia"
    }),
    fill: "#EC0F6C",
    stroke: "#E4F5FC",
    strokeThickness: 2,
    opacity: 0.8
});

const rendSeries3 = new SmoothStackedMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues: yValues3,
        dataSeriesName: "USA"
    }),
    fill: "#F48420",
    stroke: "#E4F5FC",
    strokeThickness: 2,
    opacity: 0.8
});

const rendSeries4 = new SmoothStackedMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues: yValues4,
        dataSeriesName: "UK"
    }),
    fill: "#50C7E0",
    stroke: "#E4F5FC",
    strokeThickness: 2,
    opacity: 0.8
});

const rendSeries5 = new SmoothStackedMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues: yValues5,
        dataSeriesName: "Latam"
    }),
    fill: "#30BC9A",
    stroke: "#E4F5FC",
    strokeThickness: 2,
    opacity: 0.8
});

// To add the series to the chart, put them in a StackedMountainCollection
const stackedMountainCollection = new StackedMountainCollection(wasmContext);
stackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);

// Add the Stacked Mountain collection to the chart
sciChartSurface.renderableSeries.add(stackedMountainCollection);
```

```ts
// Demonstrates how to create a Mountain chart with SciChart.js using the Builder API
const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
// Data for the example
const xValues = \[1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003\];
const yValues1 = \[10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11\];
const yValues2 = \[12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10\];
const yValues3 = \[7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22\];
const yValues4 = \[16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17\];
const yValues5 = \[7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16\];

const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: \[
        // Group StackedMountain into one StackedMountainCollection and pass into the series object
        {
            type: ESeriesType.StackedMountainCollection,
            series: \[
                {
                    type: ESeriesType.SmoothStackedMountainSeries,
                    options: {
                        fill: "#882B91",
                        stroke: "#E4F5FC"
                    },
                    xyData: { xValues, yValues: yValues1 }
                },
                {
                    type: ESeriesType.SmoothStackedMountainSeries,
                    options: {
                        fill: "#EC0F6C",
                        stroke: "#E4F5FC"
                    },
                    xyData: { xValues, yValues: yValues2 }
                },
                {
                    type: ESeriesType.SmoothStackedMountainSeries,
                    options: {
                        fill: "#F48420",
                        stroke: "#E4F5FC"
                    },
                    xyData: { xValues, yValues: yValues3 }
                },
                {
                    type: ESeriesType.SmoothStackedMountainSeries,
                    options: {
                        fill: "#50C7E0",
                        stroke: "#E4F5FC"
                    },
                    xyData: { xValues, yValues: yValues4 }
                },
                {
                    type: ESeriesType.SmoothStackedMountainSeries,
                    options: {
                        fill: "#30BC9A",
                        stroke: "#E4F5FC"
                    },
                    xyData: { xValues, yValues: yValues5 }
                }
            \]
        }
    \]
});
```

Above:

*   We created 3 [StackedMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountainrenderableseries.html) and added them to a [StackedMountainCollection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html)
*   The StackedMountainCollection itself is added to [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection, not the individual mountain series.

This results in the following output:

```ts
<div id="scichart-root"></div>
```
```ts
body {
  margin: 0;
}
#scichart-root {
  width: 100%;
  height: 100vh;
}
```
```ts
import \* as SciChart from "scichart";

async function simpleStackedMountainChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a Column chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SmoothStackedMountainRenderableSeries,
        StackedMountainCollection,
        XyDataSeries,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Data for the example
    const xValues = \[1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003\];
    const yValues1 = \[10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11\];
    const yValues2 = \[12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10\];
    const yValues3 = \[7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22\];
    const yValues4 = \[16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17\];
    const yValues5 = \[7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16\];

    // Create some RenderableSeries - for each part of the stacked m mountain
    // Notice the stackedGroupId. This defines if series are stacked (same), or grouped side by side (different)
    const rendSeries1 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues1,
            dataSeriesName: "EU"
        }),
        fill: "#882B91",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    const rendSeries2 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues2,
            dataSeriesName: "Asia"
        }),
        fill: "#EC0F6C",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    const rendSeries3 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues3,
            dataSeriesName: "USA"
        }),
        fill: "#F48420",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    const rendSeries4 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues4,
            dataSeriesName: "UK"
        }),
        fill: "#50C7E0",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    const rendSeries5 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues5,
            dataSeriesName: "Latam"
        }),
        fill: "#30BC9A",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    // To add the series to the chart, put them in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    stackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);

    // Add the Stacked Mountain collection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleStackedMountainChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a Mountain chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Data for the example
    const xValues = \[1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003\];
    const yValues1 = \[10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11\];
    const yValues2 = \[12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10\];
    const yValues3 = \[7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22\];
    const yValues4 = \[16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17\];
    const yValues5 = \[7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16\];

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: \[
            // Group StackedMountain into one StackedMountainCollection and pass into the series object
            {
                type: ESeriesType.StackedMountainCollection,
                series: \[
                    {
                        type: ESeriesType.SmoothStackedMountainSeries,
                        options: {
                            fill: "#882B91",
                            stroke: "#E4F5FC"
                        },
                        xyData: { xValues, yValues: yValues1 }
                    },
                    {
                        type: ESeriesType.SmoothStackedMountainSeries,
                        options: {
                            fill: "#EC0F6C",
                            stroke: "#E4F5FC"
                        },
                        xyData: { xValues, yValues: yValues2 }
                    },
                    {
                        type: ESeriesType.SmoothStackedMountainSeries,
                        options: {
                            fill: "#F48420",
                            stroke: "#E4F5FC"
                        },
                        xyData: { xValues, yValues: yValues3 }
                    },
                    {
                        type: ESeriesType.SmoothStackedMountainSeries,
                        options: {
                            fill: "#50C7E0",
                            stroke: "#E4F5FC"
                        },
                        xyData: { xValues, yValues: yValues4 }
                    },
                    {
                        type: ESeriesType.SmoothStackedMountainSeries,
                        options: {
                            fill: "#30BC9A",
                            stroke: "#E4F5FC"
                        },
                        xyData: { xValues, yValues: yValues5 }
                    }
                \]
            }
        \]
    });
    // #endregion
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Creating 100% Stacked Mountain Charts
-------------------------------------

SciChart.js also supports a JavaScript 100% Smoothed Stacked Mountain chart, which can be enabled by setting a single flag: [StackedMountainCollection.isOneHundredPercent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html#isonehundredpercent)**.**

*   [Javascript](#i-tab-content-JS)

```ts
// ...
const rendSeries5 = new SmoothStackedMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues: yValues5,
        dataSeriesName: "Latam"
    }),
    fill: "#30BC9A",
    stroke: "#E4F5FC",
    strokeThickness: 2,
    opacity: 0.8
});

// To add the series to the chart, put them in a StackedMountainCollection
const stackedMountainCollection = new StackedMountainCollection(wasmContext);
// Set the isOneHundredPercent option to enable 100% stacking
stackedMountainCollection.isOneHundredPercent = true;
stackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);

// Add the Stacked Mountain collection to the chart
sciChartSurface.renderableSeries.add(stackedMountainCollection);
// ...
```

Setting this flag results in the following output.

```ts
<div id="scichart-root"></div>
```
```ts
body {
  margin: 0;
}
#scichart-root {
  width: 100%;
  height: 100vh;
}
```
```ts
import \* as SciChart from "scichart";

async function percent100StackedMountainChart(divElementId) {
    // Demonstrates how to create a Column chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SmoothStackedMountainRenderableSeries,
        StackedMountainCollection,
        XyDataSeries,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Data for the example
    const xValues = \[1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003\];
    const yValues1 = \[10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11\];
    const yValues2 = \[12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10\];
    const yValues3 = \[7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22\];
    const yValues4 = \[16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17\];
    const yValues5 = \[7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16\];

    // Create some RenderableSeries - for each part of the stacked m mountain
    // Notice the stackedGroupId. This defines if series are stacked (same), or grouped side by side (different)
    const rendSeries1 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues1,
            dataSeriesName: "EU"
        }),
        fill: "#882B91",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    const rendSeries2 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues2,
            dataSeriesName: "Asia"
        }),
        fill: "#EC0F6C",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    const rendSeries3 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues3,
            dataSeriesName: "USA"
        }),
        fill: "#F48420",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    const rendSeries4 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues4,
            dataSeriesName: "UK"
        }),
        fill: "#50C7E0",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    // #region ExampleA
    // ...
    const rendSeries5 = new SmoothStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues5,
            dataSeriesName: "Latam"
        }),
        fill: "#30BC9A",
        stroke: "#E4F5FC",
        strokeThickness: 2,
        opacity: 0.8
    });

    // To add the series to the chart, put them in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    // Set the isOneHundredPercent option to enable 100% stacking
    stackedMountainCollection.isOneHundredPercent = true;
    stackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);

    // Add the Stacked Mountain collection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);
    // ...
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

percent100StackedMountainChart("scichart-root");
```

_**Above:** a JavaScript 100% Smoothed Stacked Mountain chart when [StackedMountainCollection.isOneHundredPercent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html#isonehundredpercent) is true_