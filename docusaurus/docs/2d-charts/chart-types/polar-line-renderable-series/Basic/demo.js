import * as SciChart from "scichart";
export async function PolarLineChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar line chart using SciChart.js
    const { SciChartPolarSurface, SciChartJsNavyTheme, PolarNumericAxis, PolarLineRenderableSeries, EPolarAxisMode, EAxisAlignment, NumberRange, XyDataSeries, EPolarLabelMode } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 12),
        polarLabelMode: EPolarLabelMode.Parallel,
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 8),
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    const polarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 20 }, (_, i) => i),
            yValues: Array.from({ length: 20 }, (_, i) => 1 + i / 3)
        }),
        stroke: "pink",
        strokeThickness: 4,
        interpolateLine: false, // set to true for rounded lines
        clipToTotalAngle: false // set to true to clip anything outside the total angle
    });
    sciChartSurface.renderableSeries.add(polarLine);
    // #region_A_end
    return { sciChartSurface, wasmContext };
}
PolarLineChart("scichart-root");
async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create a polar line chart with SciChart.js using the Builder API
    const { build2DPolarChart, EAxisType, EPolarAxisMode, EAxisAlignment, NumberRange, SciChartJsNavyTheme, ESeriesType } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await build2DPolarChart(divElementId, {
        surface: { theme: new SciChartJsNavyTheme() },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                    visibleRange: new NumberRange(0, 12),
                }
            }
        ],
        yAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    axisAlignment: EAxisAlignment.Right,
                    polarAxisMode: EPolarAxisMode.Radial,
                    visibleRange: new NumberRange(0, 8),
                    labelPrecision: 0
                }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarBandSeries,
                xyyData: {
                    xValues: Array.from({ length: 20 }, (_, i) => i),
                    yValues: Array.from({ length: 20 }, (_, i) => 1 + i / 3)
                },
                options: {
                    stroke: "pink",
                    strokeThickness: 4,
                }
            }
        ]
    });
    return { sciChartSurface, wasmContext };
    // #region_B_end
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
