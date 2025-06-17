---
sidebar_position: 60
---

# The Spline (Smoothed) Line Series Type

Spline Line or Smoothed Series can be created using the [SplineLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html) type.

The [](https://demo.scichart.com/javascript-line-chart)[](https://demo.scichart.com/javascript-line-chart)[JavaScript Spline Line Chart Example](https://demo.scichart.com/javascript-spline-line-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-line-chart)

_**Above**: The_ [_JavaScript Spline Line Chart example_](https://demo.scichart.com/javascript-spline-line-chart) _from the SciChart.js Demo._

Create a Spline Line Series
---------------------------

To create a [Javascript Spline Line Chart](https://demo.scichart.com/javascript-spline-line-chart) with SciChart.js, use the following code:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Demonstrates how to create a line chart with SciChart.js
const {
    SciChartSurface,
    NumericAxis,
    SplineLineRenderableSeries,
    EllipsePointMarker,
    XyDataSeries,
    SciChartJsNavyTheme,
    NumberRange
} = SciChart;

// or, for npm, import { SciChartSurface, ... } from "scichart"
const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
});
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

const xValues = \[\];
const yValues = \[\];
for (let i = 0; i < 10; i++) {
    xValues.push(i);
    yValues.push(0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
}

const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues
});

// Create a spline line series
const splineLineSeries = new SplineLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    // Set interpolation points to decide the amount of smoothing
    interpolationPoints: 10,
    // Add a pointmarker to show where the datapoints are
    pointMarker: new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0
    })
});

sciChartSurface.renderableSeries.add(splineLineSeries);
```

```ts
// Demonstrates how to create a line chart with SciChart.js using the Builder API
const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const xValues = \[\];
const yValues = \[\];
for (let i = 0; i < 10; i++) {
    xValues.push(i);
    yValues.push(0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
}

const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: \[
        {
            type: ESeriesType.SplineLineSeries,
            xyData: { xValues, yValues },
            options: {
                stroke: "#FF6600",
                strokeThickness: 5,
                pointMarker: {
                    type: EPointMarkerType.Ellipse,
                    options: {
                        width: 7,
                        height: 7,
                        fill: "white",
                        strokeThickness: 0
                    }
                }
            }
        }
    \]
});
```

In the code above:

*   A Spline Line Series instance is created and added to the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, strokethickness properties
*   We assign a [DataSeries](The DataSeries API.html) - which stores the Xy data to render.
*   We set the number of [interpolationPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints) - how many points between real Xy data points will be interpolated using a Spline interpolation algorithm.

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

async function simpleSplineLineChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a line chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SplineLineRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const xValues = \[\];
    const yValues = \[\];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues
    });

    // Create a spline line series
    const splineLineSeries = new SplineLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 5,
        dataSeries: xyDataSeries,
        // Set interpolation points to decide the amount of smoothing
        interpolationPoints: 10,
        // Add a pointmarker to show where the datapoints are
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: "white",
            strokeThickness: 0
        })
    });

    sciChartSurface.renderableSeries.add(splineLineSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleSplineLineChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = \[\];
    const yValues = \[\];
    for (let i = 0; i < 10; i++) {
        xValues.push(i);
        yValues.push(0.2 \* Math.sin(i) - Math.cos(i \* 0.12));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: \[
            {
                type: ESeriesType.SplineLineSeries,
                xyData: { xValues, yValues },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 5,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            fill: "white",
                            strokeThickness: 0
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

Performance Tips in Spline Lines
--------------------------------

_When the_ [_SplineLineRenderableSeries.interpolationPoints_:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints) _property is set to zero, then this series renders and displays exactly like a FastLineRenderableSeries._

_When the_ [_interpolationPoints_:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/splinelinerenderableseries.html#interpolationpoints) _property is set to another number, e.g. 10, then SciChart.js will calculate 10 points for each Xy datapoint you add to the XyDataSeries. This means you will be displaying 10x the number of datapoints._

_SciChart.js can handle millions of datapoints, but this is something to be aware of. You might want to adjust down the interpolationPoints depending on amount of data on the chart, or zoom level._

Render a Gap in a Spline Line Series
------------------------------------

It is possible to have null points or gaps in a Line Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](DrawingGapsInSeries.html) article for more details.

Add Point Markers onto a Line Series
------------------------------------

Every data point of a Spline Line Series can be marked with a [PointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#pointmarker). To add Point Markers to the Spline Line Series, see the [PointMarkers API Documentation](DrawingPointMarkersOnSeries.html).

_**Note:** PointMarkers are only applied to the original data-points, not the spline interpolated points which are for display purposes only._

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](DrawingPointMarkersOnSeries.html).

There is also a dedicated [Scatter Series type](The Scatter Series Type.html) and a [Bubble Series type](The Bubble Series Type.html) with some more options.

Painting Spline Line Segments with Different Colors
---------------------------------------------------

It is possible to define the colour of line segments individually using the [PaletteProvider API](The PaletteProvider API.html).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Line Charts](Per-point Colouring of Line Segments.html) documentation page. The same technique applies to spline line charts.

See Also

[The Line Series Type](The Line Series Type.html)