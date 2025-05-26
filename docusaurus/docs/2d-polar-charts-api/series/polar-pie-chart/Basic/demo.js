import * as SciChart from "scichart";

async function PolarPieChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a basic polar pie chart using SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarColumnRenderableSeries,
        EPolarAxisMode,
        NumberRange,
        XyxDataSeries,
        Thickness,
        EColumnMode,
        MetadataPaletteProvider,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(20),
        theme: new SciChartJsNavyTheme(),
    });

    const COLORS = ["#CC0000", "#00CC00", "#0000CC", "#CCCC00", "#CC00CC", "#00CCCC"];
    const metadata = [];
    const xWidthValues = [10, 20, 30, 40, 50, 60];
    const xValues = [];
    const x1Values = [];
    const yValues = [];
    let xSum = 0;

    xWidthValues.forEach(v => {
        xValues.push(xSum);
        x1Values.push(v);
        yValues.push(1);
        xSum += v;
    });

    for (let i = 0; i < 6; i++) {
        metadata.push({
            isSelected: false,
            fill: COLORS[i]
        });
    }

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        visibleRangeLimit: new NumberRange(0, 1),
        polarAxisMode: EPolarAxisMode.Radial,
        startAngleDegrees: 90,
        isVisible: false
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        startAngleDegrees: 90,
        flippedCoordinates: true,
        isVisible: false
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxDataSeries(wasmContext, {
            xValues,
            x1Values,
            yValues,
            metadata
        }),
        stroke: "black",
        strokeThickness: 2,
        columnXMode: EColumnMode.StartWidth,
        paletteProvider: new MetadataPaletteProvider(), // use colors from the metadata for each column value
    });

    polarColumn.getXRange = () => {
        return new NumberRange(0, xWidthValues.reduce((a, b) => a + b, 0));
    };

    sciChartSurface.renderableSeries.add(polarColumn);
}

PolarPieChart("scichart-root");

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
