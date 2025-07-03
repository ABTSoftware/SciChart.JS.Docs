import * as SciChart from "scichart";
// #region_A_start
const { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } = SciChart;
class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
    rule;
    stroke;
    strokePaletteMode = EStrokePaletteMode.SOLID;
    constructor(stroke, rule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return this.rule(yValue, xValue)
            ? this.stroke
            : undefined;
    }
}
// #region_A_end
async function PolarLineChart(divElementId) {
    const { SciChartPolarSurface, PolarNumericAxis, PolarLineRenderableSeries, EPolarAxisMode, EAxisAlignment, NumberRange, XyDataSeries, SciChartJsNavyTheme } = SciChart;
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 12),
        labelPrecision: 0
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0.5, 8),
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // #region_B_start
    const polarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 34 }, (_, i) => i),
            yValues: Array.from({ length: 34 }, (_, i) => 1 + i / 5)
        }),
        stroke: "green",
        strokeThickness: 5,
        interpolateLine: true,
        paletteProvider: new ThresholdLinePaletteProvider("#FFFFFF", (yValue, xValue) => Math.floor(xValue / 3) % 2 === 0)
    });
    sciChartSurface.renderableSeries.add(polarLine);
    // #region_B_end
    return { sciChartSurface, wasmContext };
}
PolarLineChart("scichart-root");
async function builderExample(divElementId) {
    // #region_C_start
    // Demonstrates how to create an interpolated polar line chart with SciChart.js using the Builder API
    const { EPolarAxisMode, EAxisAlignment, EPolarLabelMode, NumberRange, ESeriesType, EThemeProviderType, chartBuilder, EAxisType, EBaseType, EPaletteProviderType } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"
    // Register the custom ThresholdLinePaletteProvider with the chartBuilder
    chartBuilder.registerType(EBaseType.PaletteProvider, "ThresholdLinePaletteProvider", options => new ThresholdLinePaletteProvider(options.stroke, options.rule));
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                    visibleRange: new NumberRange(0, 12),
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
                    visibleRange: new NumberRange(0, 8),
                    labelPrecision: 0,
                }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarLineSeries,
                xyData: {
                    xValues: Array.from({ length: 20 }, (_, i) => i),
                    yValues: Array.from({ length: 20 }, (_, i) => 1 + i / 3)
                },
                options: {
                    stroke: "pink",
                    strokeThickness: 4,
                    interpolateLine: true,
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ThresholdLinePaletteProvider",
                        options: {
                            stroke: "#FFFFFF",
                            rule: (yValue, xValue) => Math.floor(xValue / 3) % 2 === 0
                        }
                    }
                }
            }
        ]
    });
    // #region_C_end
    return { sciChartSurface, wasmContext };
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
