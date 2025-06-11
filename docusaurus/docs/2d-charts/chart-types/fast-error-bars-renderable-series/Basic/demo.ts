import * as SciChart from "scichart";

export async function simpleErrorBarsChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a chart with error bars using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastErrorBarsRenderableSeries,
        HlcDataSeries,
        EErrorMode,
        EErrorDirection,
        EDataPointWidthMode,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Add X and Y axes to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a FastErrorBarsRenderableSeries with HLC data
    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0], // "Mid" points (pointMarkers are placed here)
            highValues: [3.7, 3.8, 4.0, 5.3, 5.9, 5.7, 5.0, 4.3, 3.2], // highest point of the error bars
            lowValues: [2.2, 3.4, 3.3, 3.8, 5.0, 4.8, 3.5, 3.0, 1.8] // lowest point of the error bars
        }),
        stroke: "#50C7E0",
        strokeThickness: 2,

        // Optional parameters. Defaults are Both, Vertical
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Vertical,

        // More optional parameters. Defaults are 0.5, Relative
        dataPointWidth: 0.5,
        dataPointWidthMode: EDataPointWidthMode.Relative
    });
    sciChartSurface.renderableSeries.add(errorBarsSeries);
    // #region_A_end

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleErrorBarsChart("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create a chart with error bars in SciChart.js using the Builder API
    const { 
        chartBuilder, 
        ESeriesType, 
        EThemeProviderType,
        EErrorMode,
        EErrorDirection,
        EDataPointWidthMode
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.ErrorBarsSeries,
                hlcData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0],
                    highValues: [3.7, 3.8, 4.0, 5.3, 5.9, 5.7, 5.0, 4.3, 3.2],
                    lowValues: [2.2, 3.4, 3.3, 3.8, 5.0, 4.8, 3.5, 3.0, 1.8]
                },
                options: {
                    stroke: "#50C7E0",
                    strokeThickness: 3,
                    errorMode: EErrorMode.Both,
                    errorDirection: EErrorDirection.Vertical,
                    dataPointWidth: 0.5,
                    dataPointWidthMode: EDataPointWidthMode.Relative
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
