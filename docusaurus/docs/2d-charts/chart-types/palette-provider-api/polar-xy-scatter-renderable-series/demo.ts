import * as SciChart from "scichart";
import { IPointMetadata } from "scichart";

// #region_A_start
const { 
    DefaultPaletteProvider, 
    EStrokePaletteMode, 
    parseColorToUIntArgb 
} = SciChart;
// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

type TRule = (yValue: number) => boolean;

// Custom PaletteProvider for scatter points which colours datapoints above a threshold
class ScatterPaletteProvider extends DefaultPaletteProvider {
    public rule: TRule;
    public overrideStroke: number;
    public overrideFill: number;
    public strokePaletteMode = EStrokePaletteMode.SOLID;

    constructor(stroke: string, fill: string, rule: TRule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.rule = rule;
        // Use the helper function parseColorToUIntArgb to convert a hex string
        // e.g. #FF00FF77 into ARGB numeric format 0xFF00FF77 expected by scichart
        this.overrideStroke = parseColorToUIntArgb(stroke);
        this.overrideFill = parseColorToUIntArgb(fill);
    }

    // This function is called for every data-point.
    // Return undefined to use the default color for the pointmarker,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overridePointMarkerArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: IPointMetadata) {
        // Draw points outside the range a different color
        if (this.rule(yValue)) {
            return { stroke: this.overrideStroke, fill: this.overrideFill };
        }
        // Undefined means use default colors
        return undefined;
    }
}
// #region_A_end

async function drawScatterChartWithPalette(divElementId) {
    // Demonstrates how to create a line chart with PaletteProvider using SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarXyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        HorizontalLineAnnotation,
        EPolarAxisMode,
        EAxisAlignment,
        NumberRange,
        ELabelPlacement
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // #region_B_start
    // The ScatterPaletteProvider we created before is applied to a PolarXyScatterRenderableSeries
    const scatterSeries = new PolarXyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { 
            xValues: Array.from({ length: 100 }, (_, i) => i),
            yValues: Array.from({ length: 100 }, (_, i) => Math.random() * 2 - 1), // Random values between -1 and 1
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 1,
            fill: "green",
            stroke: "lightgreen"
        }),
        // PaletteProvider feature allows coloring per-point based on a rule
        paletteProvider: new ScatterPaletteProvider("Red", "Purple", (yValue) => yValue > 0.0)
    });
    // #region_B_end

    sciChartSurface.renderableSeries.add(scatterSeries);

    // Add this label & annotation to the chart
    sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({
            y1: 0,
            stroke: "#EC0F6C",
            axisLabelFill: "White",
            labelPlacement: ELabelPlacement.BottomRight,
            labelValue: "Values above this line are red",
            showLabel: true
        })
    );
}

drawScatterChartWithPalette("scichart-root");

async function builderExample(divElementId) {
    // #region_C_start
    // Demonstrates how to create an interpolated polar line chart with SciChart.js using the Builder API
    const {
        EPolarAxisMode,
        EAxisAlignment,
        ESeriesType,
        EThemeProviderType,
        chartBuilder,
        EAxisType,
        EPointMarkerType,
        EBaseType,
        EPaletteProviderType
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Register the custom ScatterPaletteProvider with the chartBuilder
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        "ScatterPaletteProvider",
        options => new ScatterPaletteProvider(
            options.stroke,
            options.fill,
            options.rule
        )
    );

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
                type: EAxisType.PolarNumericAxis,
                    options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Top,
                }
            }
        ],
        yAxes: [
            {
                type: SciChart.EAxisType.PolarNumericAxis,
                options: {
                    axisAlignment: EAxisAlignment.Right,
                    polarAxisMode: EPolarAxisMode.Radial,
                }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarScatterSeries,
                xyData: {
                    xValues: Array.from({ length: 100 }, (_, i) => i),
                    yValues: Array.from({ length: 100 }, (_, i) => Math.random() * 2 - 1), // Random values between -1 and 1
                },
                options: {
                    stroke: "pink",
                    strokeThickness: 4,
                    pointMarker: {
                        type: EPointMarkerType.Triangle,
                        options: {
                            width: 10,
                            height: 10,
                            fill: "green",
                            stroke: "lightgreen"
                        }
                    },
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ScatterPaletteProvider",
                        options: {
                            stroke: "Red",
                            fill: "Purple",
                            rule: (yValue: number) => yValue > 0.0
                        }
                    }
                }
            }
        ]
    });
    // #region_C_end

    return { sciChartSurface, wasmContext };
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
