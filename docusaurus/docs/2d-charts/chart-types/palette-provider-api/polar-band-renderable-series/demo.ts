import * as SciChart from "scichart";

// #region_A_start
const {
    DefaultPaletteProvider,
    EStrokePaletteMode,
    EFillPaletteMode,
    parseColorToUIntArgb
} = SciChart;
// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line series which colours datapoints above a threshold
class PolarBandPaletteProvider extends DefaultPaletteProvider {
    strokePaletteMode = EStrokePaletteMode.SOLID;
    fillPaletteMode = EFillPaletteMode.SOLID;

    orange = parseColorToUIntArgb("#DD8800");
    lightOrange = parseColorToUIntArgb("#DD880044");

    overrideFillArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        if ((xValue >= 3 && xValue < 6) || (xValue >= 9 && xValue < 12)) {
            return this.lightOrange;
        } else {
            return undefined;
        }
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        if ((xValue > 3 && xValue <= 6) || (xValue > 9 && xValue <= 12)) {
            return this.orange;
        } else {
            return undefined; // use the default stroke color
        }
    }
}
// #region_A_end

async function paletteProviderBandChart(divElementId) {
    // Demonstrates how to create a polar band chart using SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarBandRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        XyyDataSeries,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        labelPrecision: 0,
        innerRadius: 0.1,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // #region_B_start
    const polarBand1 = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1],
            y1Values: [2, 5, 6, 2, 5, 6, 2, 5, 6, 2, 5, 6, 2]
        }),
        stroke: "#FF0000",
        fill: "#FF000044",
        strokeThickness: 3,
        paletteProvider: new PolarBandPaletteProvider()
    });
    // #region_B_end
    sciChartSurface.renderableSeries.add(polarBand1);

    return { sciChartSurface, wasmContext };
}

paletteProviderBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region_C_start
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const {
        EThemeProviderType,
        chartBuilder,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        EAxisType,
        ESeriesType,
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                    options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                    polarLabelMode: EPolarLabelMode.Parallel
                }
            }
        ],
        yAxes: [
            {
                type: SciChart.EAxisType.PolarNumericAxis,
                options: {
                    axisAlignment: EAxisAlignment.Right,
                    polarAxisMode: EPolarAxisMode.Radial,
                    labelPrecision: 0,
                    innerRadius: 0.1
                }
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
                    paletteProvider: new PolarBandPaletteProvider()
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #region_C_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
