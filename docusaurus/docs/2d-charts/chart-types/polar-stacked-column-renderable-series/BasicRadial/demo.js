import * as SciChart from "scichart";
export async function polarStackedRadialColumnChart(divElementId) {
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const { SciChartPolarSurface, SciChartJsNavyTheme, PolarNumericAxis, EPolarAxisMode, EAxisAlignment, NumberRange, XyDataSeries, PolarStackedColumnRenderableSeries, PolarStackedColumnCollection, } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    // #region_A_start
    const radialXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial, // radial axis -> xAxis
        axisAlignment: EAxisAlignment.Right,
        innerRadius: 0.1, // donut hole
        labelPrecision: 0, // no decimals
    });
    sciChartSurface.xAxes.add(radialXAxis);
    const angularYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // angular axis -> yAxis
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 15),
        useNativeText: true,
        flippedCoordinates: true, // go clockwise
    });
    sciChartSurface.yAxes.add(angularYAxis);
    // #region_A_end
    // Create the collection the stacked columns will be added to
    const polarCollection = new PolarStackedColumnCollection(wasmContext);
    const polarColumn1 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            yValues: Array.from({ length: 10 }, (_, i) => Math.random() * 11 + 1)
        }),
        fill: "#FF3344AA",
        stroke: "white",
    });
    const polarColumn2 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            yValues: Array.from({ length: 10 }, (_, i) => Math.random() * 2 + 1)
        }),
        fill: "#5588FFAA",
        stroke: "white",
    });
    // Add the columns to the collection
    polarCollection.add(polarColumn1, polarColumn2);
    // Append the collection to the SciChartSurface renderableSeries
    sciChartSurface.renderableSeries.add(polarCollection);
    return { sciChartSurface, wasmContext };
}
polarStackedRadialColumnChart("scichart-root");
async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, EPolarAxisMode, EAxisType, ESeriesType, EAxisAlignment, EPolarLabelMode, NumberRange, GradientParams, Point, SciChartJsNavyTheme } = SciChart;
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
                    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: "transparent", offset: 0 },
                        { color: "red", offset: 1 }
                    ])
                }
            }
        ]
    });
    return { sciChartSurface, wasmContext };
    // #endregion
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
