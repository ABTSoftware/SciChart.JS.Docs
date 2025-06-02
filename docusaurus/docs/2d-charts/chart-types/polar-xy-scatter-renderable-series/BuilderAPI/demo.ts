import * as SciChart from "scichart";

export async function serialisedPointMarker(rootElement) {
    // Demonstrates how to create a scatter chart with SciChart.js
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        XyDataSeries,
        PolarNumericAxis,
        EPolarAxisMode, 
        NumberRange, 
        EAxisAlignment, 
        EPolarLabelMode,
        PolarXyScatterRenderableSeries,
        EPointMarkerType,
        RadianLabelProvider
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        drawLabels: false,
        visibleRange: new NumberRange(0, 1),
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,

        visibleRange: new NumberRange(0, Math.PI * 2),
        autoTicks: false, // to manually set tick distance
        majorDelta: Math.PI / 4, // or any other PI fraction

        labelProvider: new RadianLabelProvider({
            maxDenominator: 6, // Show labels in radians with a maximum denominator of 6
        }),

        labelPrecision: 0,
        labelPostfix: `°`, // Degree symbol
    });
    sciChartSurface.xAxes.add(angularXAxis);
    
    // #region_A_start
    const scatterExample = new PolarXyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 36 }, (_, i) => i * Math.PI / 18),
            yValues: Array.from({ length: 36 }, () => Math.random()),
        }),
        pointMarker: {
            type: EPointMarkerType.Cross,
            options: {
                width: 20,
                height: 8,
                strokeThickness: 2,
                stroke: "#44AAFF",
            }
        }
    });
    sciChartSurface.renderableSeries.add(scatterExample);
    // #region_A_end
}

serialisedPointMarker("scichart-root");

export async function builderPointMarker(divElementId) {
    // #region_B_start
    // Demonstrates how to create a scatter with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EPointMarkerType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Navy } },
        series: [
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues: Array.from({ length: 36 }, (_, i) => i * 10),
                    yValues: Array.from({ length: 36 }, () => Math.random()),
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Cross,
                        options: {
                            width: 20,
                            height: 8,
                            strokeThickness: 2,
                            stroke: "#44AAFF",
                        }
                    }
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #region_B_end
}

if (location.search.includes("builder=1")) builderPointMarker("scichart-root");
