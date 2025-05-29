import * as SciChart from "scichart";

export async function polarStackedColumnChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const { 
        SciChartPolarSurface, 
        PolarNumericAxis, 
        SciChartJsNavyTheme,
        PolarStackedColumnCollection,
        PolarStackedColumnRenderableSeries,
        EPolarAxisMode,
        NumberRange,
        XyDataSeries, 
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // Angular == "goes around the center, drawn by arcs"
        visibleRange: new NumberRange(0, 10), // to keep column #1 and #10 from touching
        flippedCoordinates: true, // go clockwise
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial, // Radial == "goes from center out, drawn by straight lines"
        innerRadius: 0.1, // donut hole
        labelPrecision: 0, // no decimals
    });
    sciChartSurface.yAxes.add(radialYAxis);
    
    // Create the collection the stacked columns will be added to
    const polarCollection = new PolarStackedColumnCollection(wasmContext, {
        stroke: "#FFFFFF",
        strokeThickness: 2,
        isOneHundredPercent: false // set to true to make columns stack to 100%
    });

    const polarColumn1 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            yValues: Array.from({ length: 10 }, (_, i) => Math.random() * 11 + 1)
        }),
        fill: "#FF3344AA",
    });

    const polarColumn2 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            yValues: Array.from({ length: 10 }, (_, i) => Math.random() * 2 + 1)
        }),
        fill: "#5588FFAA",
    });

    // Add the columns to the collection
    polarCollection.add(polarColumn1, polarColumn2);

    // Add the columns to the collection
    sciChartSurface.renderableSeries.add(polarCollection);
    // #region_A_end
    
    return { sciChartSurface, wasmContext };
}

polarStackedColumnChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { 
        ESciChartSurfaceType,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        GradientParams,
        Point,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Polar2D,
        surface: { theme: new SciChartJsNavyTheme() },
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
                polarLabelMode: EPolarLabelMode.Parallel,
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
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
            }
        ],
        series: [
            {
                type: ESeriesType.PolarColumnRenderableSeries,
                xyyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2.6, 5.3, 3.5, 2.7, 4.8, 3.8, 5, 4.5, 3.5],
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
                    scaleGradientToYRange: true,  
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");