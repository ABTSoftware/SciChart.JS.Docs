---
sidebar_position: 23
---

# The Band Series type

The Band Series type

A Band Series, or High-Low Fill between two lines can be created using the [FastBandRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) type.

The [](https://demo.scichart.com/javascript-band-chart)[](https://demo.scichart.com/javascript-band-chart)[JavaScript Band Chart Example](https://demo.scichart.com/javascript-band-chart) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/)

<iframe src="https://demo.scichart.com/iframe/javascript-band-chart" width="100%" height="600px" frameborder="0"></iframe>

<div style={{textAlign: "center"}}> 
Above: The JavaScript [Band Chart](https://demo.scichart.com/javascript-band-chart) example from the [SciChart.js Demo](https://www.scichart.com/demo/react).
</div>

## Create a Band Series

To create a [Javascript Band Chart](https://demo.scichart.com/javascript-band-chart) with SciChart.js, use the following code:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Demonstrates how to create a band chart using SciChart.js
const { SciChartSurface, NumericAxis, FastBandRenderableSeries, XyyDataSeries, SciChartJsNavyTheme } = SciChart;

// or, for npm, import { SciChartSurface, ... } from "scichart"
const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
});
sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

const xValues = \[\];
const yValues = \[\];
const y1Values = \[\];
const POINTS = 1000;
const STEP = (3 \* Math.PI) / POINTS;
for (let i = 0; i <= 1000; i++) {
    const k = 1 - i / 2000;
    xValues.push(i);
    yValues.push(Math.sin(i \* STEP) \* k \* 0.7);
    y1Values.push(Math.cos(i \* STEP) \* k);
}

const dataSeries = new XyyDataSeries(wasmContext, { xValues, yValues, y1Values });

const bandSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries,
    stroke: "#F48420",
    strokeY1: "#50C7E0",
    fill: "#F4842033",
    fillY1: "#50C7E033",
    strokeThickness: 2
});

sciChartSurface.renderableSeries.add(bandSeries);
```

```ts
// Demonstrates how to create a band chart with SciChart.js using the Builder API
const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const xValues = \[\];
const yValues = \[\];
const y1Values = \[\];
const POINTS = 1000;
const STEP = (3 \* Math.PI) / POINTS;
for (let i = 0; i <= 1000; i++) {
    const k = 1 - i / 2000;
    xValues.push(i);
    yValues.push(Math.sin(i \* STEP) \* k \* 0.7);
    y1Values.push(Math.cos(i \* STEP) \* k);
}

const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: \[
        {
            type: ESeriesType.BandSeries,
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
                strokeThickness: 2
            }
        }
    \]
});
```

In the code above:

*   A Band Series instance is created and added to the [SciChartSurface.renderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection.
*   We set the stroke, fill properties for when Y1 > Y2 and vice versa (more info over at [FastBandRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) in TypeDoc).
*   We assign a [DataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#dataseries) - in this case an [XyyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) which stores X, Y1, Y2 data.

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

async function simpleBandChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a band chart using SciChart.js
    const { SciChartSurface, NumericAxis, FastBandRenderableSeries, XyyDataSeries, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = \[\];
    const yValues = \[\];
    const y1Values = \[\];
    const POINTS = 1000;
    const STEP = (3 \* Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(Math.sin(i \* STEP) \* k \* 0.7);
        y1Values.push(Math.cos(i \* STEP) \* k);
    }

    const dataSeries = new XyyDataSeries(wasmContext, { xValues, yValues, y1Values });

    const bandSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#F48420",
        strokeY1: "#50C7E0",
        fill: "#F4842033",
        fillY1: "#50C7E033",
        strokeThickness: 2
    });

    sciChartSurface.renderableSeries.add(bandSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = \[\];
    const yValues = \[\];
    const y1Values = \[\];
    const POINTS = 1000;
    const STEP = (3 \* Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(Math.sin(i \* STEP) \* k \* 0.7);
        y1Values.push(Math.cos(i \* STEP) \* k);
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: \[
            {
                type: ESeriesType.BandSeries,
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
                    strokeThickness: 2
                }
            }
        \]
    });
    // #endregion
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Gradient Fills in Band Series
-----------------------------

New to SciChart.js v3.4, the Band Series chart type now supports gradient fills as well as solid color fills.

To use this, you need to set the [FastBandRenderableSeries.fillLinearGradient](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#filllineargradient) & [fillLinearGradientY1](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#filllineargradienty1) properties with a [GradientParams](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientparams.html) object: a type which defines gradients by a number of gradient stops, with a start and end point.

Here's a code example:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
const bandSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries,
    stroke: "#F48420",
    strokeY1: "#50C7E0",
    // use fillLinearGradient and fillLinearGradientY1 to set a gradient fill
    // instead of fill and fillY1
    fillLinearGradient: new GradientParams(new Point(0, 0.6), new Point(0, 0.9), \[
        { color: "#F48420ff", offset: 0 },
        { color: "#F4842033", offset: 1 }
    \]),
    fillLinearGradientY1: new GradientParams(new Point(0, 0.6), new Point(0, 0.9), \[
        { color: "#50C7E033", offset: 0 },
        { color: "#50C7E0ff", offset: 1 }
    \]),
    strokeThickness: 4
});

sciChartSurface.renderableSeries.add(bandSeries);
```

```ts
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: \[
        {
            type: ESeriesType.BandSeries,
            xyyData: {
                xValues,
                yValues,
                y1Values
            },
            options: {
                stroke: "#FF1919FF",
                strokeY1: "#279B27FF",
                // use fillLinearGradient and fillLinearGradientY1 to set a gradient fill
                // instead of fill and fillY1
                fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), \[
                    { color: "#F48420ff", offset: 0 },
                    { color: "#F4842033", offset: 1 }
                \]),
                fillLinearGradientY1: new GradientParams(new Point(0, 0), new Point(0, 1), \[
                    { color: "#50C7E033", offset: 0 },
                    { color: "#50C7E0ff", offset: 1 }
                \]),
                strokeThickness: 4
            }
        }
    \]
});
```

Try adjusting the CodePen above with the code to set a fillLinearGradient and see the result!

Render a Gap in a Band Series
-----------------------------

It is possible to have null points or gaps in a Band Series by passing a data point with a **NaN** value as the **Y** value. Please refer to the [Common Series Features - Draw Gaps in Series](DrawingGapsInSeries.html) article for more details.

Add Point Markers onto a Band Series
------------------------------------

It is possible to put scatter point markers of varying type (Ellipse, Square, Triangle, Cross, Custom) onto a Band Series via the PointMarker API. To learn more, see the documentation page [Drawing PointMarkers on Series](DrawingPointMarkersOnSeries.html).

To learn more about the types of Point Marker in SciChart.js, see the [Point Markers API documentation](DrawingPointMarkersOnSeries.html).

There is also a dedicated [Scatter Series type](The Scatter Series Type.html) and a [Bubble Series type](The Bubble Series Type.html) with some more options.

Painting Band Segments with Different Colors
--------------------------------------------

It is possible to define the colour of line segments individually using the [PaletteProvider API](The PaletteProvider API.html).

For more info on how to do this, see the [PaletteProvider - Per-point colouring of Band Charts](Per-Point Colouring of Band Segments.html) documentation page.

Use Cases
---------

### Displaying horizontal thresholds

The Band Series Chart can be used to display a mountain or area with a horizontal threshold. For example, if you want to see a series which has a green mountain above zero and red below, to track PnL or profit and loss, you can also use a band series.

For instance, the following code:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Use a Band series to render a mountain chart with horizontal threshold.
const xValues = \[\];
const yValues = \[\];
const y1Values = \[\];
const POINTS = 1000;
const threshold = 0.4;
const STEP = (3 \* Math.PI) / POINTS;
for (let i = 0; i <= 1000; i++) {
    const k = 1 - i / 2000;
    xValues.push(i);
    yValues.push(threshold); // constant value for Y
    y1Values.push(Math.cos(i \* STEP) \* k);
}

const bandSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
    stroke: "Transparent", // render Y stroke as transparent
    strokeY1: "#50C7E0", // render Y1 transparent as blue
    fill: "#FF191933", // have different fills above/below the threshold. This is fill above
    fillY1: "#50C7E033", // fill below
    strokeThickness: 2
});

sciChartSurface.renderableSeries.add(bandSeries);
```

```ts
// Demonstrates how to create a band chart with SciChart.js using the Builder API
const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const xValues = \[\];
const yValues = \[\];
const y1Values = \[\];
const POINTS = 1000;
const threshold = 0.4;
const STEP = (3 \* Math.PI) / POINTS;
for (let i = 0; i <= 1000; i++) {
    const k = 1 - i / 2000;
    xValues.push(i);
    yValues.push(threshold); // constant value for Y
    y1Values.push(Math.cos(i \* STEP) \* k);
}

const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: \[
        {
            type: ESeriesType.BandSeries,
            xyyData: {
                xValues,
                yValues,
                y1Values
            },
            options: {
                stroke: "Transparent", // render Y stroke as transparent
                strokeY1: "#50C7E0", // render Y1 transparent as blue
                fill: "#FF191933", // have different fills above/below the threshold. This is fill above
                fillY1: "#50C7E033", // fill below
                strokeThickness: 2
            }
        }
    \]
});
```

Results in this

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function bandChartThresholds(divElementId) {
    // Demonstrates how to create a band chart using SciChart.js
    const { SciChartSurface, NumericAxis, FastBandRenderableSeries, XyyDataSeries, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region ExampleA
    // Use a Band series to render a mountain chart with horizontal threshold.
    const xValues = \[\];
    const yValues = \[\];
    const y1Values = \[\];
    const POINTS = 1000;
    const threshold = 0.4;
    const STEP = (3 \* Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(threshold); // constant value for Y
        y1Values.push(Math.cos(i \* STEP) \* k);
    }

    const bandSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
        stroke: "Transparent", // render Y stroke as transparent
        strokeY1: "#50C7E0", // render Y1 transparent as blue
        fill: "#FF191933", // have different fills above/below the threshold. This is fill above
        fillY1: "#50C7E033", // fill below
        strokeThickness: 2
    });

    sciChartSurface.renderableSeries.add(bandSeries);
    // #endregion

    // Add this label & annotation to the chart
    const { HorizontalLineAnnotation, ELabelPlacement } = SciChart;
    sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({
            y1: threshold,
            stroke: "#FF1919",
            axisLabelFill: "White",
            strokeThickness: 1,
            strokeDashArray: \[5, 5\],
            opacity: 0.6,
            labelPlacement: ELabelPlacement.BottomRight,
            labelValue: "Values above this line are red",
            showLabel: true
        })
    );

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

bandChartThresholds("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = \[\];
    const yValues = \[\];
    const y1Values = \[\];
    const POINTS = 1000;
    const threshold = 0.4;
    const STEP = (3 \* Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(threshold); // constant value for Y
        y1Values.push(Math.cos(i \* STEP) \* k);
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: \[
            {
                type: ESeriesType.BandSeries,
                xyyData: {
                    xValues,
                    yValues,
                    y1Values
                },
                options: {
                    stroke: "Transparent", // render Y stroke as transparent
                    strokeY1: "#50C7E0", // render Y1 transparent as blue
                    fill: "#FF191933", // have different fills above/below the threshold. This is fill above
                    fillY1: "#50C7E033", // fill below
                    strokeThickness: 2
                }
            }
        \]
    });
    // #endregion
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

### Bollinger Bands & MACD Indicators

The Band Series chart primary use is in financial markets, when you want to display things like Bollinger Bands, MACD. For example, our Create Multi Pane Stock Charts demo has a band series for the MACD indicator, which you can see below.

<CenteredImageWrapper
    src="https://www.scichart.com/documentation/js/current/images/RenderSeries_BandSeries_UseCase.png"
    title="Bollinger Bands & MACD Indicators"
/>

<CenteredImageWrapper
    src="https://www.scichart.com/documentation/js/current/images/RenderSeries_BandSeries_UseCase2.png"
    title="A complex visualisation using Band Series"
/>

_**Above**: a complex visualisation using Band Series. This image is taken from a SciChart WPF sample but all the features are available in SciChart.js as well._

See Also

#### Renderable Series APIs

[Start Here - RenderableSeries Overview](What is a RenderableSeries.html)

[Common RenderableSeries Properties](Common RenderableSeries Features.html)
