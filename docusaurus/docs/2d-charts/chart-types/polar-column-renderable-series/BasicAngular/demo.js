import * as SciChart from "scichart";
export async function polarColumnChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const { SciChartPolarSurface, PolarNumericAxis, SciChartJsNavyTheme, PolarColumnRenderableSeries, EPolarAxisMode, EAxisAlignment, EPolarLabelMode, NumberRange, XyDataSeries, } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // Angular == "goes around the center, drawn by arcs"
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 20),
        flippedCoordinates: true, // go clockwise
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial, // Radial == "goes from center out, drawn by straight lines"
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        drawLabels: false, // don't draw labels
        innerRadius: 0.1, // donut hole
    });
    sciChartSurface.yAxes.add(radialYAxis);
    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 20 }, (_, i) => i),
            yValues: Array.from({ length: 20 }, (_, i) => Math.random() * 5 + 1),
        }),
        stroke: "white",
        fill: "#0088FF66",
        strokeThickness: 2,
        dataPointWidth: 1,
        dataLabels: {
            color: "white",
            style: {
                fontSize: 14,
                fontFamily: "Default",
            },
            polarLabelMode: EPolarLabelMode.Parallel,
        },
    });
    sciChartSurface.renderableSeries.add(polarColumn);
    // #region_A_end
    return { sciChartSurface, wasmContext };
}
polarColumnChart("scichart-root");
import { chartBuilder, EPolarAxisMode, EAxisAlignment, EPolarLabelMode, NumberRange, EAxisType, ESeriesType, SciChartJsNavyTheme } from "scichart";
async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    // or, for npm, import { chartBuilder, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: new SciChartJsNavyTheme() },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                    visibleRange: new NumberRange(0, 9),
                    useNativeText: true,
                    drawMajorGridLines: true,
                    drawMajorTickLines: false,
                    drawMinorTickLines: false,
                    drawMinorGridLines: false,
                    autoTicks: false,
                    majorDelta: 1,
                    startAngle: Math.PI / 2,
                    flippedCoordinates: true,
                    polarLabelMode: EPolarLabelMode.Parallel,
                }
            }
        ],
        yAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    axisAlignment: EAxisAlignment.Right,
                    polarAxisMode: EPolarAxisMode.Radial,
                    visibleRange: new NumberRange(0, 6),
                    useNativeText: true,
                    autoTicks: false,
                    majorDelta: 1,
                    drawMajorGridLines: true,
                    drawMajorTickLines: false,
                    labelPrecision: 0,
                    innerRadius: 0.1,
                    startAngle: Math.PI / 2,
                    drawLabels: false,
                    majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
                }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarColumnSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2.6, 5.3, 3.5, 2.7, 4.8, 3.8, 5, 4.5, 3.5],
                },
                options: {
                    stroke: "red",
                    strokeThickness: 3,
                }
            }
        ]
    });
    return { sciChartSurface, wasmContext };
    // #endregion
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
