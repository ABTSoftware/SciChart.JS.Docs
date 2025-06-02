import * as SciChart from "scichart";

export async function simpleRadarChart (rootElement) {
    // #region_A_start
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        PolarNumericAxis,
        NumberRange,
        PolarCategoryAxis,
        PolarMountainRenderableSeries,
        EPolarAxisMode,
        EPolarGridlineMode,
        XyDataSeries,
    } = SciChart;
    // or for npm import { SciChartPolarSurface, ... } from "scichart"
    
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });

    const angularXAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        labels: [ "Offense", "Shooting", "Defense", "Rebounds", "Passing", "Bench" ], // categories
        startAngle: Math.PI / 2, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise

        majorGridLineStyle: { color: "#88888844" },
        drawMinorGridLines: false,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        gridlineMode: EPolarGridlineMode.Polygons, // this creates the radar chart look
        visibleRange: new NumberRange(0, 10), 
        startAngle: Math.PI / 2, // start at 12 o'clock
        
        labelPrecision: 0,
        majorGridLineStyle: { color: "#88888844" },
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const xValues = [0, 1, 2, 3, 4, 5];
    const yValues = [9, 10, 7, 5, 8, 6]; // values for: "Offense", "Shooting", "Defense", "Rebounds", "Passing", "Bench"
    
    // Radar / Spider Charts may also work with `PolarLineRenderableSeries`
    const polarMountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [...xValues, xValues[xValues.length] + 1], // + 1 to close the loop
            yValues: [...yValues, yValues[0]], // re-plot first point to close the loop
            dataSeriesName: "Golden State Warriors",
        }),
        stroke: "#FFC72C", // Golden State Warriors gold
        fill: "#1D428A80", // Golden State Warriors blue with 50% opacity
        strokeThickness: 4,
    });
    sciChartSurface.renderableSeries.add(polarMountain);
    // #region_A_end
};

simpleRadarChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a Column chart with SciChart.js using the Builder API
    const { chartBuilder, EAxisType, EPolarAxisMode, NumberRange, EAxisAlignment, ESeriesType, EPolarLabelMode, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"
    await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                    visibleRange: new NumberRange(0, 12),
                    useNativeText: true,
                    drawMajorGridLines: true,
                    drawMajorTickLines: false,
                    drawMinorTickLines: false,
                    drawMinorGridLines: false,
                    autoTicks: false,
                    majorDelta: 1,
                    polarLabelMode: EPolarLabelMode.Parallel
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
                    useNativeText: true,
                    autoTicks: false,
                    majorDelta: 1,
                    drawMajorGridLines: true,
                    drawMajorTickLines: false,
                    labelPrecision: 0,
                    majorGridLineStyle: { strokeThickness: 1, color: "#666666" }
                }
            }
        ],
        series: [
            {
                type: ESeriesType.MountainSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5],
                    yValues: [9, 10, 7, 5, 8, 6]
                },
                options: {
                    stroke: "#FFC72C", // Golden State Warriors gold
                    fill: "#1D428A" + "80", // Golden State Warriors blue with 50% opacity
                    strokeThickness: 4,
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
