import * as SciChart from "scichart";
// #region_A_start
// Demonstrates how to create an interpolated polar line chart using SciChart.js
import { SciChartPolarSurface, DefaultPaletteProvider, PolarNumericAxis, PolarLineRenderableSeries, EPolarAxisMode, EAxisAlignment, SciChartJsNavyTheme, NumberRange, XyDataSeries, Thickness, EStrokePaletteMode, parseColorToUIntArgb } from "scichart";
export async function PolarLinePaletteProvider(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(30),
        theme: new SciChartJsNavyTheme(),
    });
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 12),
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 8),
    });
    sciChartSurface.yAxes.add(radialYAxis);
    class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
        rule;
        stroke2;
        constructor(rule, stroke2) {
            super();
            this.rule = rule;
            this.stroke2 = parseColorToUIntArgb(stroke2);
            this.strokePaletteMode = EStrokePaletteMode.SOLID;
        }
        overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
            return this.rule(yValue, xValue) // when rule is met, return the stroke color
                ? this.stroke2
                : undefined;
        }
    }
    const polarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 34 }, (_, i) => i),
            yValues: Array.from({ length: 34 }, (_, i) => 1 + i / 5)
        }),
        stroke: "#00AA00", // Stroke color used when overrideStrokeArgb returns `undefined`
        strokeThickness: 5,
        interpolateLine: true,
        paletteProvider: new ThresholdLinePaletteProvider((yValue, xValue) => (Math.floor(xValue / 3) % 2 === 0), // set the rule for threshold
        "#FFFFFF"),
    });
    sciChartSurface.renderableSeries.add(polarLine);
    // #region_A_end
    return { sciChartSurface, wasmContext };
}
PolarLinePaletteProvider("scichart-root");
async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create an interpolated polar line chart with SciChart.js using the Builder API
    const { chartBuilder, EPolarAxisMode, EAxisAlignment, EAxisType, NumberRange, ESeriesType, DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb, SciChartJsNavyTheme, } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"
    class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
        rule;
        stroke2;
        constructor(rule, stroke2) {
            super();
            this.rule = rule;
            this.stroke2 = parseColorToUIntArgb(stroke2);
            this.strokePaletteMode = EStrokePaletteMode.SOLID;
        }
        overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
            return this.rule(yValue, xValue) // when rule is met, return the stroke color
                ? this.stroke2
                : undefined;
        }
    }
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: new SciChartJsNavyTheme() },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                    visibleRange: new NumberRange(0, 12),
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
                    labelPrecision: 0
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
                    stroke: "#00AA00", // Stroke color used when overrideStrokeArgb returns `undefined`
                    strokeThickness: 4,
                    interpolateLine: true,
                    paletteProvider: new ThresholdLinePaletteProvider((yValue, xValue) => (Math.floor(xValue / 3) % 2 === 0), // set the rule for threshold
                    "#FFFFFF")
                }
            }
        ]
    });
    return { sciChartSurface, wasmContext };
    // #region_B_end
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
