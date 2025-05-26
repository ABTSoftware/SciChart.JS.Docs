import * as SciChart from "scichart";

export async function PolarLinePaletteProvider(divElementId) {
    // Demonstrates how to create an interpolated polar line chart using SciChart.js
    const { 
        SciChartPolarSurface, 
        DefaultPaletteProvider,
        PolarNumericAxis, 
        PolarLineRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        SciChartJsNavyTheme,
        NumberRange,
        XyDataSeries, 
        Thickness,
        EStrokePaletteMode,
        parseColorToUIntArgb,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

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

    // #region_A_start
    class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
        constructor(stroke2, rule) {
            super();
            this.strokePaletteMode = EStrokePaletteMode.SOLID;
            this.rule = rule;
            this.stroke2 = parseColorToUIntArgb(stroke2);
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
        paletteProvider: new ThresholdLinePaletteProvider(
            "#FFFFFF", 
            (yValue, xValue) => (Math.floor(xValue / 3) % 2 === 0) // set the rule for threshold
        ),
    });
    sciChartSurface.renderableSeries.add(polarLine);
    // #region_A_end
    
    return { sciChartSurface, wasmContext };
}

PolarLinePaletteProvider("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create an interpolated polar line chart with SciChart.js using the Builder API
    const { 
        ESciChartSurfaceType,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        ESeriesType,
        DefaultPaletteProvider,
        EStrokePaletteMode,
        parseColorToUIntArgb,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
        constructor(stroke2, rule) {
            super();
            this.strokePaletteMode = EStrokePaletteMode.SOLID;
            this.rule = rule;
            this.stroke2 = parseColorToUIntArgb(stroke2);
        }
    
        overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
            return this.rule(yValue, xValue) 
                ? this.stroke2 
                : undefined;
        }
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Polar2D,
        surface: { theme: new SciChartJsNavyTheme() },
        xAxes: [
            {
                polarAxisMode: EPolarAxisMode.Angular,
                axisAlignment: EAxisAlignment.Top,
                visibleRange: new NumberRange(0, 12),
                polarLabelMode: EPolarLabelMode.Parallel
            }
        ],
        yAxes: [
            {
                axisAlignment: EAxisAlignment.Right,
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, 8),
                labelPrecision: 0
            }
        ],
        series: [
            {
                type: ESeriesType.PolarLineRenderableSeries,
                xyyData: {
                    xValues: Array.from({ length: 20 }, (_, i) => i),
                    yValues: Array.from({ length: 20 }, (_, i) => 1 + i / 3)
                },
                options: {
                    stroke: "#00AA00", // Stroke color used when overrideStrokeArgb returns `undefined`
                    strokeThickness: 4,
                    interpolateLine: true,
                    paletteProvider: new ThresholdLinePaletteProvider(
                        "#FFFFFF", 
                        (yValue, xValue) => (Math.floor(xValue / 3) % 2 === 0) // set the rule for threshold
                    )
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");