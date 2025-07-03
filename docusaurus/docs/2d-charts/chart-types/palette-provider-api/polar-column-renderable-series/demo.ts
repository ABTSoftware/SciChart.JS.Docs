import * as SciChart from "scichart";

// #region_A_start
const {
    DefaultPaletteProvider,
    EStrokePaletteMode,
    parseColorToUIntArgb
} = SciChart;
// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for column series which colours datapoints above a threshold
class ColumnPaletteProvider extends DefaultPaletteProvider {
    public strokePaletteMode = EStrokePaletteMode.SOLID;
    public threshold: number;
    public stroke: number;
    public fillColor: number;

    constructor(threshold: number) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.threshold = threshold;
        this.stroke = parseColorToUIntArgb("#FF0000");
        this.fillColor = parseColorToUIntArgb("#FF000077");
    }

    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        return yValue > this.threshold 
            ? this.fillColor 
            : undefined;
    }

    // This function is called for every data-point
    // Return undefined to use the default color for the fill, else, return
    // a custom color as ARGB color code e.g. 0xFFFF0000 is red
    overrideFillArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        return yValue > this.threshold 
            ? this.fillColor 
            : undefined;
    }
}
// #region_A_end

async function drawColumnChartWithPalette(divElementId) {
    // Demonstrates how to create a Column chart with SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarColumnRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EPolarAxisMode,
        EAxisAlignment,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        labelPrecision: 0
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // #region_B_start
    // Create and add a column series
    const columnSeries = new PolarColumnRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 0.5)",
        stroke: "rgba(176, 196, 222, 1)",
        strokeThickness: 2,
        dataPointWidth: 0.7,
        dataSeries: new XyDataSeries(wasmContext, { 
            xValues: Array.from({ length: 20 }, (_, i) => i),
            yValues: Array.from({ length: 20 }).map((_) => Math.random() * 10 + 5)
        }),
        paletteProvider: new ColumnPaletteProvider(10)
    });

    sciChartSurface.renderableSeries.add(columnSeries);
    // #region_B_end
}

drawColumnChartWithPalette("scichart-root");

async function builderExample(divElementId) {
    // #region_C_start
    // Demonstrates how to create a polar column chart with a custom PaletteProvider, using the builder API
    const { 
        chartBuilder, 
        EBaseType, 
        ESeriesType, 
        EPaletteProviderType, 
        EThemeProviderType,
        EAxisType,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Register the custom ColumnPaletteProvider with the chartBuilder
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        "ColumnPaletteProvider",
        options => new ColumnPaletteProvider(options.threshold)
    );

    // Now use the Builder-API to build the chart
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
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
                }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarColumnSeries,
                xyData: {
                    xValues: Array.from({ length: 20 }, (_, i) => i),
                    yValues: Array.from({ length: 20 }).map((_) => Math.random() * 10 + 5),
                },
                options: {
                    fill: "rgba(176, 196, 222, 0.5)",
                    stroke: "rgba(176, 196, 222, 1)",
                    strokeThickness: 2,
                    dataPointWidth: 0.7,
                    // Now you can instantiate using parameters below
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ColumnPaletteProvider",
                        options: {
                            threshold: 10
                        }
                    }
                    // Note: Assigning an instance is also valid, e.g.
                    // paletteProvider: new ColumnPaletteProvider(10)
                }
            }
        ]
    });
    // #region_C_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
