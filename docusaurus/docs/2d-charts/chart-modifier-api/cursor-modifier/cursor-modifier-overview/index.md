---
sidebar_position: 1
---

# The CursorModifier Type

SciChart.js provides a cursors / crosshairs behavior via the [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html), available out of the box. Besides common features which are inherited from the [ChartModifierBase](Common ChartModifiers Features.html) class, the [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) allows to you to:

*   **Place a crosshair (cursor) on the chart which tracks the mouse**
*   **Place a single aggregated tooltip for all series at the crosshair site**
*   Optionally show/hide and style vertical/horizontal line in the crosshair
*   Optionally show/hide axis labels on the X,Y axis
*   Format the axis labels
*   Allow customisation of the tooltip style and contents
*   Place a legend at an external `<div>` with tooltip info
*   Configure when the tooltip is shown (always, only on hover of a point)
*   Configure which series react to the Tooltip (all, some, or specific series)

The [](https://demo.scichart.com/javascript-line-chart)[](https://demo.scichart.com/javascript-line-chart)[Using CursorModifier Example](https://demo.scichart.com/javascript-chart-cursormodifier-crosshairs) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-line-chart)

_**Above**: The [](https://demo.scichart.com/javascript-line-chart)[](https://demo.scichart.com/javascript-line-chart)[Using CursorModifier Example](https://demo.scichart.com/javascript-chart-cursormodifier-crosshairs)_ _from the SciChart.js Demo, showing various options of the CursorModifier in SciChart.js._

Adding a CursorModifier to a Chart
----------------------------------

A CursorModifier can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable crosshair/cursor behavior. For example, this code adds a crosshair, enables default tooltips and axis labels.

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Create a chart surface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
});

// For the example to work, axis must have EAutoRange.Always
sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        axisTitle: "X Axis"
    })
);
sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-2, 0.5),
        axisTitle: "Y Axis"
    })
);

// Add a CursorModifier to the chart
const cursorModifier = new CursorModifier({
    // Optional properties to configure what parts are shown
    showTooltip: true,
    showAxisLabels: true,
    showXLine: true,
    showYLine: true,
    // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
    hitTestRadius: 10,
    // Optional properties to configure the axis labels
    axisLabelFill: "#b36200",
    axisLabelStroke: "#fff",
    // Optional properties to configure line and tooltip style
    crosshairStroke: "#ff6600",
    crosshairStrokeThickness: 1,
    tooltipContainerBackground: "#000",
    tooltipTextStroke: "#ff6600"
});
sciChartSurface.chartModifiers.add(cursorModifier);
```

```ts
// Demonstrates how to configure the CursorModifier in SciChart.js using the Builder API
const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    modifiers: \[
        {
            type: EChart2DModifierType.Cursor,
            options: {
                // Optional properties to configure what parts are shown
                showTooltip: true,
                showAxisLabels: true,
                showXLine: true,
                showYLine: true,
                // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
                hitTestRadius: 10,
                // Optional properties to configure the axis labels
                axisLabelFill: "#b36200",
                axisLabelStroke: "#fff",
                // Optional properties to configure line and tooltip style
                crosshairStroke: "#ff6600",
                crosshairStrokeThickness: 1,
                tooltipContainerBackground: "#000",
                tooltipTextStroke: "#ff6600"
            }
        }
    \]
});
```

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

async function basicCursorModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EAutoRange,
        NumberRange,
        CursorModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            axisTitle: "X Axis"
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis"
        })
    );

    // Add a CursorModifier to the chart
    const cursorModifier = new CursorModifier({
        // Optional properties to configure what parts are shown
        showTooltip: true,
        showAxisLabels: true,
        showXLine: true,
        showYLine: true,
        // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
        hitTestRadius: 10,
        // Optional properties to configure the axis labels
        axisLabelFill: "#b36200",
        axisLabelStroke: "#fff",
        // Optional properties to configure line and tooltip style
        crosshairStroke: "#ff6600",
        crosshairStrokeThickness: 1,
        tooltipContainerBackground: "#000",
        tooltipTextStroke: "#ff6600"
    });
    sciChartSurface.chartModifiers.add(cursorModifier);

    // #endregion

    // Add some series to inspect
    const xValues = \[\];
    const yValues = \[\];
    const yValues2 = \[\];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 \* Math.sin(i \* 0.25) - Math.cos(i \* 0.02));
        yValues2.push(0.5 \* Math.cos(i \* 0.18) - Math.sin(i \* 0.025));
    }

    const pointMarker = new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues,
                dataSeriesName: "Sinewave 1"
            }),
            pointMarker
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2,
                dataSeriesName: "Sinewave 2"
            }),
            pointMarker
        })
    );

    // Add some instructions to the user
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "CursorModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Move the mouse over the chart to see cursor & tooltip",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

basicCursorModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the CursorModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        modifiers: \[
            {
                type: EChart2DModifierType.Cursor,
                options: {
                    // Optional properties to configure what parts are shown
                    showTooltip: true,
                    showAxisLabels: true,
                    showXLine: true,
                    showYLine: true,
                    // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
                    hitTestRadius: 10,
                    // Optional properties to configure the axis labels
                    axisLabelFill: "#b36200",
                    axisLabelStroke: "#fff",
                    // Optional properties to configure line and tooltip style
                    crosshairStroke: "#ff6600",
                    crosshairStrokeThickness: 1,
                    tooltipContainerBackground: "#000",
                    tooltipTextStroke: "#ff6600"
                }
            }
        \]
    });
    // #endregion

    const xValues = \[\];
    const yValues = \[\];
    const yValues2 = \[\];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 \* Math.sin(i \* 0.25) - Math.cos(i \* 0.02));
        yValues2.push(0.5 \* Math.cos(i \* 0.18) - Math.sin(i \* 0.025));
    }

    const { EllipsePointMarker, FastLineRenderableSeries, XyDataSeries } = SciChart;
    const pointMarker = new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            }),
            pointMarker
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2
            }),
            pointMarker
        })
    );
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Many of the properties here are optional - they have been included to show the configuration possibilities for the cursor. See [ICursorModifierOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/icursormodifieroptions.html) for more.

See Also

[Formatting CursorModifier Tooltip Items](CursorModifier_Formatting.html)

[Customizing the CursorModifier Tooltip Container Appearance](CursorModifier_CustomisingContainer.html)