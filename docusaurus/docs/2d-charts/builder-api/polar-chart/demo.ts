import * as SciChart from "scichart";

export async function basicPolarBuilderAPI(divElementId) {
    // #region_A_start
    const {
        chartBuilder,
        ESciChartSurfaceType,
        EThemeProviderType,
        EAxisType,
        EPolarAxisMode,
        EChart2DModifierType,
        ESeriesType,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Polar2D,
        options: {
            surface: {
                theme: { type: EThemeProviderType.Navy } 
            },
            xAxes: [{
                type: EAxisType.PolarNumericAxis, 
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                }
            }],
            yAxes: [{
                type: EAxisType.PolarNumericAxis, 
                options: {
                    polarAxisMode: EPolarAxisMode.Radial,
                    labelPrecision: 0,
                }
            }],
            series: [
                {
                    type: ESeriesType.PolarColumnSeries,
                    xyData: {
                        xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        yValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    },
                    options: {
                        stroke: "rgba(255, 0, 0, 1)",
                        fill: "rgba(255, 0, 0, 0.3)",
                        dataPointWidth: 0.8
                    }
                }
            ],
            modifiers: [
                { type: EChart2DModifierType.PolarMouseWheelZoom },
                { type: EChart2DModifierType.PolarZoomExtents },
                { type: EChart2DModifierType.PolarCursor }
            ]
        }
    });
    // #region_A_end

    return { sciChartSurface, wasmContext };
}

basicPolarBuilderAPI("scichart-root");

export async function basicPolarSpecificBuilderAPI(divElementId) {
    // #region_B_start
    const {
        build2DPolarChart,
        EThemeProviderType,
        EAxisType,
        EPolarAxisMode,
        EChart2DModifierType,
        ESeriesType,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await build2DPolarChart(divElementId, {
        surface: {
            theme: { type: EThemeProviderType.Navy } 
        },
        xAxes: [{
            type: EAxisType.PolarNumericAxis, 
            options: {
                polarAxisMode: EPolarAxisMode.Angular,
            }
        }],
        yAxes: [{
            type: EAxisType.PolarNumericAxis, 
            options: {
                polarAxisMode: EPolarAxisMode.Radial,
                labelPrecision: 0,
            }
        }],
        series: [
            {
                type: ESeriesType.PolarColumnSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    yValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                },
                options: {
                    stroke: "rgba(255, 0, 0, 1)",
                    fill: "rgba(255, 0, 0, 0.3)",
                    dataPointWidth: 0.8
                }
            }
        ],
        modifiers: [
            { type: EChart2DModifierType.PolarMouseWheelZoom },
            { type: EChart2DModifierType.PolarZoomExtents },
            { type: EChart2DModifierType.PolarCursor }
        ]
    });
    // #region_B_end

    return { sciChartSurface, wasmContext };
}