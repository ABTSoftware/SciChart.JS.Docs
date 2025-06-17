---
sidebar_position: 62
---

# The Spline (Smoothed) Band Series Type

Spline Band or Smoothed High/Low Fill Series can be created using the [SplineBandRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinebandrenderableseries.html) type.

The [](https://demo.scichart.com/javascript-line-chart)[](https://demo.scichart.com/javascript-line-chart)[JavaScript Spline Band Chart Example](https://demo.scichart.com/javascript-spline-band-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-line-chart)

_**Above**: The_ [_JavaScript Spline Band Chart example_](https://demo.scichart.com/javascript-spline-band-chart) _from the SciChart.js Demo._

Create a Spline Band Series
---------------------------

To create a [Javascript Spline Band Chart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinebandrenderableseries.html) with SciChart.js, use the following code:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Demonstrates how to create a Spline Band chart using SciChart.js
const {
    SciChartSurface,
    NumericAxis,
    SplineBandRenderableSeries,
    XyyDataSeries,
    SciChartJsNavyTheme,
    EllipsePointMarker
} = SciChart;

// or, for npm, import { SciChartSurface, ... } from "scichart"
const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
});
sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

const xValues = \[\];
const yValues = \[\];
const y1Values = \[\];
for (let i = 0; i < 10; i++) {
    xValues.push(i);
    yValues.push(2 + 0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
    y1Values.push(1.8 + 0.19 \* Math.sin(i \* 2) - Math.cos(i \* 0.24));
}

const dataSeries = new XyyDataSeries(wasmContext, { xValues, yValues, y1Values });

const bandSeries = new SplineBandRenderableSeries(wasmContext, {
    dataSeries,
    stroke: "#F48420",
    strokeY1: "#50C7E0",
    fill: "#F4842033",
    fillY1: "#50C7E033",
    strokeThickness: 2,
    // Add a pointmarker to show where the datapoints are
    pointMarker: new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0
    })
});

sciChartSurface.renderableSeries.add(bandSeries);
```

```ts
// Demonstrates how to create a band chart with SciChart.js using the Builder API
const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const xValues = \[\];
const yValues = \[\];
const y1Values = \[\];
for (let i = 0; i < 10; i++) {
    xValues.push(i);
    yValues.push(2 + 0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
    y1Values.push(1.8 + 0.19 \* Math.sin(i \* 2) - Math.cos(i \* 0.24));
}

const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: \[
        {
            type: ESeriesType.SplineBandSeries,
            xyyData: {
                xValues,
                yValues,
                y1Values
            },
            options: {
                stroke: "#FF1919FF",
                strokeY1: "#279B27FF",
                fill: "#279B2733",
                fillY1: "#FF191933",
                strokeThickness: 2,
                pointMarker: {
                    type: EPointMarkerType.Ellipse,
                    options: {
                        width: 7,
                        height: 7,
                        strokeThickness: 1,
                        fill: "steelblue",
                        stroke: "LightSteelBlue"
                    }
                }
            }
        }
    \]
});
```

In the code above:

*   A Spline Band Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokeY1, strokethickness properties
*   We assign an XyyDataSeries - which stores the Xyy data to render.
*   We set the number of [interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinebandrenderableseries.html#interpolationpoints) - how many points between real Xy data points will be interpolated using a Spline interpolation algorithm.

This results in the following output:

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function simpleSplineBandChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a Spline Band chart using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SplineBandRenderableSeries,
        XyyDataSeries,
        SciChartJsNavyTheme,
        EllipsePointMarker
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = \[\];
    const yValues = \[\];
    const y1Values = \[\];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(2 + 0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
        y1Values.push(1.8 + 0.19 \* Math.sin(i \* 2) - Math.cos(i \* 0.24));
    }

    const dataSeries = new XyyDataSeries(wasmContext, { xValues, yValues, y1Values });

    const bandSeries = new SplineBandRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#F48420",
        strokeY1: "#50C7E0",
        fill: "#F4842033",
        fillY1: "#50C7E033",
        strokeThickness: 2,
        // Add a pointmarker to show where the datapoints are
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: "white",
            strokeThickness: 0
        })
    });

    sciChartSurface.renderableSeries.add(bandSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleSplineBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = \[\];
    const yValues = \[\];
    const y1Values = \[\];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(2 + 0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
        y1Values.push(1.8 + 0.19 \* Math.sin(i \* 2) - Math.cos(i \* 0.24));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: \[
            {
                type: ESeriesType.SplineBandSeries,
                xyyData: {
                    xValues,
                    yValues,
                    y1Values
                },
                options: {
                    stroke: "#FF1919FF",
                    strokeY1: "#279B27FF",
                    fill: "#279B2733",
                    fillY1: "#FF191933",
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            strokeThickness: 1,
                            fill: "steelblue",
                            stroke: "LightSteelBlue"
                        }
                    }
                }
            }
        \]
    });
    // #endregion
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Performance Tips in Spline Series
---------------------------------

_When the_ [](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints)[](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html#interpolationpoints)[_SplineBandRenderableSeries.interpolationPoints_:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html#interpolationpoints) _property is set to zero, then this series renders and displays exactly like a FastLineRenderableSeries._

_When the_ [](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints)[_interpolationPoints_:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinemountainrenderableseries.html#interpolationpoints) _property is set_ _to another number, e.g. 10, then SciChart.js will calculate 10 points for each Xy datapoint you add to the XyDataSeries. This means you will be displaying 10x the number of datapoints._

_SciChart.js can handle millions of datapoints, but this is something to be aware of. You might want to adjust down the interpolationPoints depending on amount of data on the chart, or zoom level._

Render a Gap in a Spline Band Series
------------------------------------

It is possible to have null points or gaps in a Spline Band Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](DrawingGapsInSeries.html) article for more details.

Add Point Markers onto a Spline Band Series
-------------------------------------------

Every data point of a Spline Band Series can be marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). To add Point Markers to the Spline Mountain Series, see the [PointMarkers API Documentation](DrawingPointMarkersOnSeries.html).

_**Note:** PointMarkers are only applied to the original data-points, not the spline interpolated points which are for display purposes only._

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](DrawingPointMarkersOnSeries.html).

There is also a dedicated [Scatter Series type](The Scatter Series Type.html) and a [Bubble Series type](The Bubble Series Type.html) with some more options.

Painting Spline Band Segments with Different Colors
---------------------------------------------------

It is possible to define the colour of line and band segments individually using the [PaletteProvider API](The PaletteProvider API.html).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Band Charts](Per-Point Colouring of Band Segments.html) documentation page. The same technique applies to spline line charts.