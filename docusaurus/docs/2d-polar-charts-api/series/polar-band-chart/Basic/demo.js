import * as SciChart from "scichart";

export async function simpleBandChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a polar band chart using SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarBandRenderableSeries,
        EPolarAxisMode,
        NumberRange,
        XyyDataSeries,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 8),
        drawMinorGridLines: false
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        drawMinorGridLines: false,
        labelPrecision: 0,
        autoTicks: false,
        majorDelta: 1,
        innerRadius: 0.2
    });
    sciChartSurface.yAxes.add(radialYAxis);
    
    // Define the polar band series 
    const baiscBand = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 3, 4, 5, 6],
            yValues: [1, 2, 3, 4, 5, 6],
            y1Values: [6, 5, 1, 5, 4, 2]
        }),
        stroke: "rgba(200,200,30,1)",    // yellow
        fill: "rgba(200,200,30,0.3)",    // thin yellow
        strokeY1: "rgba(200,120,160,1)", // pink
        fillY1: "rgba(200,120,160,0.3)", // thin pink
        strokeThickness: 4,
        interpolateLine: false
    });
    sciChartSurface.renderableSeries.add(baiscBand);
    // #region_A_end

    return { sciChartSurface, wasmContext };
}

simpleBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, SciChartJsNavyTheme, ESciChartSurfaceType, EPolarAxisMode, NumberRange } =
        SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Polar2D,
        surface: { theme: new SciChartJsNavyTheme() },
        xAxes: [
            {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(0, 8),
                drawMinorGridLines: false,
            }
        ],
        yAxes: [
            {
                polarAxisMode: EPolarAxisMode.Radial,
                drawMinorGridLines: false,
                innerRadius: 0.2,
                labelPrecision: 0,
                autoTicks: false,
                majorDelta: 1
            }
        ],
        series: [
            {
                type: ESeriesType.PolarBandSeries,
                xyyData: {
                    xValues: [0, 1, 3, 4, 5, 6],
                    yValues: [1, 2, 4, 3, 5, 6],
                    y1Values: [6, 5, 1, 5, 4, 2]
                },
                options: {
                    stroke: "rgba(200,200,30,1)",
                    strokeY1: "rgba(200,120,160,1)",
                    fill: "rgba(200,200,30,0.3)",
                    fillY1: "rgba(200,120,160,0.3)",
                    strokeThickness: 4,
                    interpolateLine: false
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
