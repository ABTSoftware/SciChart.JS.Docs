import {
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
    DefaultPaletteProvider,
    EStrokePaletteMode,
    EFillPaletteMode,
    parseColorToUIntArgb,
} from "scichart";

async function paletteProviderBandChart(divElementId: string) {
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
        labelPrecision: 0
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
        labelPrecision: 0
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // #region_A_start
    // Custom PaletteProvider for changing fill & stroke of band segments that are in the range of 3-6 and 9-12
    class CustomBandPaletteProvider extends DefaultPaletteProvider {
        strokePaletteMode = EStrokePaletteMode.SOLID;
        fillPaletteMode = EFillPaletteMode.GRADIENT;

        orange = parseColorToUIntArgb("#DD8800");
        lightOrange = parseColorToUIntArgb("#DD880044");

        overrideFillArgb(xValue, yValue, index, opacity, metadata) {
            if ((xValue >= 3 && xValue < 6) || (xValue >= 9 && xValue < 12)) {
                return this.lightOrange;
            } else {
                return undefined;
            }
        }

        overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
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
