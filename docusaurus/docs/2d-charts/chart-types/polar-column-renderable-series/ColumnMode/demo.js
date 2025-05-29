import * as SciChart from "scichart";

async function PolarColumnChart(divElementId) {
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarColumnRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        SciChartJsNavyTheme,
        NumberRange,
        XyxDataSeries,
        Thickness,
        EColumnMode,
        EColumnYMode
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(30),
        theme: new SciChartJsNavyTheme(),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 10),
    });
    sciChartSurface.yAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        drawLabels: false, // don't draw labels
        innerRadius: 0.1,
    });
    sciChartSurface.xAxes.add(radialYAxis);
    
    // #region_A_start
    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxDataSeries(wasmContext, {
            xValues:  [  1,   2,   3, 5, 6.5, 9.5], 
            x1Values: [1.5, 2.5, 4.5, 6,   9, 10 ], // columns go from 1 -> 1.5 // 2 -> 2.5, etc
            yValues: [6.6, 8.7, 3.5, 5.7, 3.8, 6.8], // dictates the height of the column
        }),
        columnXMode: EColumnMode.StartEnd, // go from start to end (x to x1)
        stroke: "white",
        fill: "#0088FF66",
        strokeThickness: 2,
    });
    sciChartSurface.renderableSeries.add(polarColumn);
    // #region_A_end
    return { sciChartSurface, wasmContext };
}

PolarColumnChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { EPolarAxisMode, EAxisAlignment, EPolarLabelMode, NumberRange, GradientParams, Point } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: SciChart.ESciChartSurfaceType.Polar2D,
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
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
                polarLabelMode: EPolarLabelMode.Parallel
            }
        ],
        yAxes: [
            {
                axisAlignment: EAxisAlignment.Right,
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, 6),
                useNativeText: true,
                autoTicks: false,
                majorDelta: 1,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMajorTickLines: false,
                labelPrecision: 0,
                innerRadius: 0.1,
                startAngle: Math.PI / 2,
                drawLabels: false,
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarColumnRenderableSeries,
                xyyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2.6, 5.3, 3.5, 2.7, 4.8, 3.8, 5, 4.5, 3.5]
                },
                options: {
                    stroke: "red",
                    strokeY1: "blue",
                    strokeThickness: 3,
                    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: "transparent", offset: 0 },
                        { color: "red", offset: 1 }
                    ]),
                    // This one is for gradient where Y1 values are greater than Y2 values
                    fillLinearGradientY1: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: "blue", offset: 0 },
                        { color: "transparent", offset: 1 }
                    ]),
                    interpolateLine: true,
                    scaleGradientToYRange: true
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
