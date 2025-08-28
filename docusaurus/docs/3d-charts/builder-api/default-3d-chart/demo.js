import * as SciChart from "scichart";
export async function basic3DBuilderAPI(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic 3D chart using the Builder API in SciChart.js
    const { chartBuilder, EThemeProviderType, ESciChartSurfaceType, EAxisType, ESeriesType3D, EChart3DModifierType, EPointMarker3DType, Vector3 } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChart3DSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Default3D,
        options: {
            surface: {
                theme: { type: EThemeProviderType.Navy },
                cameraOptions: {
                    position: new Vector3(300, 300, 300),
                }
            },
            zAxis: {
                type: EAxisType.NumericAxis3D,
                options: {
                    axisTitle: "Z Axis",
                    labelPrecision: 0
                }
            },
            series: [
                {
                    type: ESeriesType3D.ScatterRenderableSeries3D,
                    xyzData: {
                        xValues: Array.from({ length: 10 }, (_, i) => Math.round(Math.random() * 10)),
                        yValues: Array.from({ length: 10 }, (_, i) => Math.round(Math.random() * 10)),
                        zValues: Array.from({ length: 10 }, (_, i) => Math.round(Math.random() * 10)),
                    },
                    options: {
                        pointMarker: {
                            type: EPointMarker3DType.Sphere,
                            options: {
                                size: 20,
                                fill: "#3388FF",
                            }
                        }
                    }
                }
            ],
            modifiers: [
                { type: EChart3DModifierType.MouseWheelZoom },
                { type: EChart3DModifierType.Orbit },
                { type: EChart3DModifierType.ZoomExtents }
            ]
        }
    });
    // #region_A_end
    return { sciChart3DSurface, wasmContext };
}
basic3DBuilderAPI("scichart-root");
async function direct3DBuilderAPI(divElementId) {
    // #region_B_start
    // Demonstrates how to create a basic 3D chart using the Builder API in SciChart.js
    const { build3DChart, EThemeProviderType, EAxisType, ESeriesType3D, EChart3DModifierType, EPointMarker3DType, Vector3 } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChart3DSurface, wasmContext } = await build3DChart(divElementId, {
        // no need to specify `type` here, as build3DChart always returns a 3D surface
        surface: {
            theme: { type: EThemeProviderType.Navy },
            cameraOptions: {
                position: new Vector3(300, 300, 300),
            }
        },
        zAxis: {
            type: EAxisType.NumericAxis3D,
            options: {
                axisTitle: "Z Axis",
                labelPrecision: 0
            }
        },
        series: [
            {
                type: ESeriesType3D.ScatterRenderableSeries3D,
                xyzData: {
                    xValues: Array.from({ length: 10 }, (_, i) => Math.round(Math.random() * 10)),
                    yValues: Array.from({ length: 10 }, (_, i) => Math.round(Math.random() * 10)),
                    zValues: Array.from({ length: 10 }, (_, i) => Math.round(Math.random() * 10)),
                },
                options: {
                    pointMarker: {
                        type: EPointMarker3DType.Sphere,
                        options: {
                            size: 20,
                            fill: "#3388FF",
                        }
                    }
                }
            }
        ],
        modifiers: [
            { type: EChart3DModifierType.MouseWheelZoom },
            { type: EChart3DModifierType.Orbit },
            { type: EChart3DModifierType.ZoomExtents }
        ]
    });
    // #region_B_end
    return { sciChart3DSurface, wasmContext };
}
