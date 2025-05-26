import * as SciChart from "scichart";

async function paletteProviderBandChart(divElementId) {
    // Demonstrates how to create a polar band chart using SciChart.js
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        PolarNumericAxis,
        PolarBandRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        XyyDataSeries,
        Thickness,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(20),
        theme: new SciChartJsNavyTheme()
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 12),
        useNativeText: true,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        autoTicks: false,
        majorDelta: 1,
        labelPrecision: 0,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 8),
        useNativeText: true,
        autoTicks: false,
        majorDelta: 1,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    
    // #region_A_start
    const {
        DefaultPaletteProvider,
        EStrokePaletteMode,
        EFillPaletteMode,
        parseColorToUIntArgb
    } = SciChart;

    // Custom PaletteProvider for changing fill & stroke of band segments that are in the range of 3-6 and 9-12
    class CustomBandPaletteProvider extends DefaultPaletteProvider {
        strokePaletteMode = EStrokePaletteMode.SOLID;
        fillPaletteMode = EFillPaletteMode.GRADIENT;

        orange = parseColorToUIntArgb("#DD8800");
        lightOrange = parseColorToUIntArgb("#DD880044");

        overrideFillArgb(xValue, yValue, index) {
            if ((xValue >= 3 && xValue < 6) || (xValue >= 9 && xValue < 12)) {
                return this.lightOrange;
            } else {
                return undefined;
            }
        }

        overrideStrokeArgb(xValue, yValue, index) {
            if ((xValue > 3 && xValue <= 6) || (xValue > 9 && xValue <= 12)) {
                return this.orange;
            } else {
                return undefined; // use the default stroke color
            }
        }
    }

    const palettedBand = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [1, 3, 3, 1, 3, 3, 1, 3, 3, 1, 3, 3, 1],
            y1Values: [2, 5, 5, 2, 5, 5, 2, 5, 5, 2, 5, 5, 2]
        }),
        stroke: "#FF0000",
        fill: "#FF000044", // default values to use when `overrideStroke/FillArgb` return undefined
        strokeThickness: 3,
        interpolateLine: true,
        paletteProvider: new CustomBandPaletteProvider() // use the custom palette provider
    });
    sciChartSurface.renderableSeries.add(palettedBand);
    // #region_A_end

    return { sciChartSurface, wasmContext };
}

paletteProviderBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create a polar band chart with SciChart.js using the Builder API
    const { 
        EPolarAxisMode, 
        EAxisAlignment, 
        EPolarLabelMode,
        DefaultPaletteProvider, 
        EStrokePaletteMode, 
        EFillPaletteMode,
        parseColorToUIntArgb
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Custom PaletteProvider for changing fill & stroke of band segments that are in the range of 3-6 and 9-12
    class CustomBandPaletteProvider extends DefaultPaletteProvider {
        strokePaletteMode = EStrokePaletteMode.SOLID;
        fillPaletteMode = EFillPaletteMode.SOLID;

        orange = parseColorToUIntArgb("#DD8800");
        lightOrange = parseColorToUIntArgb("#DD880044");

        overrideFillArgb(xValue, yValue, index) {
            if ((xValue >= 3 && xValue < 6) || (xValue >= 9 && xValue < 12)) {
                return this.lightOrange;
            } else {
                return undefined;
            }
        }

        overrideStrokeArgb(xValue, yValue, index) {
            if ((xValue > 3 && xValue <= 6) || (xValue > 9 && xValue <= 12)) {
                return this.orange;
            } else {
                return undefined; // use the default stroke color
            }
        }
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: SciChart.ESciChartSurfaceType.Polar2D,
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
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
        ],
        yAxes: [
            {
                axisAlignment: EAxisAlignment.Right,
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, 8),
                useNativeText: true,
                autoTicks: false,
                majorDelta: 1,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMajorTickLines: false,
                labelPrecision: 0,
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarBandSeries,
                xyyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    yValues: [1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1],
                    y1Values: [2, 5, 6, 2, 5, 6, 2, 5, 6, 2, 5, 6, 2]
                },
                options: {
                    stroke: "#FF0000",
                    fill: "#FF000044",
                    strokeThickness: 3,
                    paletteProvider: new CustomBandPaletteProvider()
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
