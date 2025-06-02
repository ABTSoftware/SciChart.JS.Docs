import * as SciChart from "scichart";
export async function polarStackedMountainChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar mountain chart using SciChart.js
    const { SciChartPolarSurface, PolarNumericAxis, SciChartJsNavyTheme, PolarStackedMountainCollection, PolarStackedMountainRenderableSeries, EPolarAxisMode, NumberRange, XyDataSeries, } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // Angular == "goes around the center, drawn by arcs"
        visibleRange: new NumberRange(0, 6), // to keep mountain #1 and #10 from touching
        flippedCoordinates: true, // go clockwise
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial, // Radial == "goes from center out, drawn by straight lines"
        visibleRange: new NumberRange(0, 10), // to keep mountain #1 and #10 from touching
        drawLabels: false, // hide radial labels
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // Create the collection the stacked mountains will be added to
    const polarCollection = new PolarStackedMountainCollection(wasmContext, {
        isOneHundredPercent: false // set to true to make mountains stack to 100%
    });
    const xValues = [0, 1, 2, 3, 4, 5]; // x values for the mountains
    const yValues1 = Array.from({ length: 6 }, (_, i) => Math.random() * 6 + 2);
    const yValues2 = Array.from({ length: 6 }, (_, i) => Math.random() * 1 + 1);
    const polarMountain1 = new PolarStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [...xValues, xValues[0]], // +1 to close the loop
            yValues: [...yValues1, yValues1[0]] // connect first and last points
        }),
        fill: "#FF3344AA",
        stroke: "white",
        strokeThickness: 3,
    });
    const polarMountain2 = new PolarStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [...xValues, xValues[0]], // +1 to close the loop
            yValues: [...yValues2, yValues2[0]] // connect first and last points
        }),
        fill: "#5588FFAA",
        stroke: "white",
        strokeThickness: 3,
    });
    // Add the mountains to the collection
    polarCollection.add(polarMountain1, polarMountain2);
    // Add the mountains to the collection
    sciChartSurface.renderableSeries.add(polarCollection);
    // #region_A_end
    return { sciChartSurface, wasmContext };
}
polarStackedMountainChart("scichart-root");
async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, EAxisType, ESeriesType, EPolarAxisMode, EAxisAlignment, EPolarLabelMode, NumberRange, GradientParams, Point, SciChartJsNavyTheme } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: new SciChartJsNavyTheme() },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                    visibleRange: new NumberRange(0, 6), // to keep mountain #1 and #10 from touching
                    flippedCoordinates: true, // go clockwise
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
                    visibleRange: new NumberRange(0, 10), // to keep mountain #1 and #10 from touching
                    useNativeText: true,
                    autoTicks: false,
                    majorDelta: 1,
                    drawMajorGridLines: true,
                    drawMajorTickLines: false,
                    labelPrecision: 0,
                    innerRadius: 0.1,
                    startAngle: Math.PI / 2,
                    drawLabels: false,
                    majorGridLineStyle: { strokeThickness: 1, color: "#666666" }
                }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarMountainSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5],
                    yValues: [9, 10, 7, 5, 8, 6]
                },
                options: {
                    stroke: "#FFC72C", // Golden State Warriors gold
                    fill: "#1D428A" + "80", // Golden State Warriors blue with 50% opacity
                    strokeThickness: 4,
                }
            },
            {
                type: ESeriesType.PolarMountainSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5],
                    yValues: [6, 8, 5, 4, 7, 3]
                },
                options: {
                    stroke: "#FF5733", // Another color for the second mountain
                    fill: "#C70039" + "80", // Another color with 50% opacity
                    strokeThickness: 4,
                }
            }
        ]
    });
    return { sciChartSurface, wasmContext };
    // #endregion
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
