import * as SciChart from "scichart";

export async function simpleScatterChart(rootElement) {
    // #region_A_start
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
        TrianglePointMarker,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        drawLabels: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,

        visibleRange: new NumberRange(0, 360),
        autoTicks: false,
        majorDelta: 30,

        labelPrecision: 0,
        labelPostfix: "°", // Degree symbol
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const scatterExample = new PolarXyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 36 }, (_, i) => i * 10),
            yValues: Array.from({ length: 36 }, (_, i) => Math.random()),
        }),
        pointMarker: new TrianglePointMarker(wasmContext, {
            width: 10,
            height: 9,
            strokeThickness: 1.5,
            fill: "#000000",
            stroke: "#FF8800",
        }),
    });
    sciChartSurface.renderableSeries.add(scatterExample);
    // #region_A_end
}

simpleScatterChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
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
                    yValues: Array.from({ length: 36 }, (_, i) => Math.random()),
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Triangle,
                        options: {
                            width: 10,
                            height: 9,
                            strokeThickness: 1.5,
                            fill: "#000000",
                            stroke: "#FF8800",
                        }
                    }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
