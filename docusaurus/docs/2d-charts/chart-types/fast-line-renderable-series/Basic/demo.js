import * as SciChart from "scichart";
export async function simpleLineChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a line chart with SciChart.js
    const { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    // Add X and Y axes to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
    }
    // Create a line series with the XY data we generated
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        }),
        stroke: "#FF6600",
        strokeThickness: 5,
    });
    sciChartSurface.renderableSeries.add(lineSeries);
    // #region_A_end
    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}
simpleLineChart("scichart-root");
async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
                },
                options: {
                    stroke: "#0066FF",
                    strokeThickness: 5
                }
            }
        ]
    });
    // #region_B_end
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
