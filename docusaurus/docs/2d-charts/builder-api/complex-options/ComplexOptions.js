import { chartBuilder, ESeriesType, EChart2DModifierType, EPointMarkerType, EBaseType, EFillPaletteMode, EStrokePaletteMode, parseColorToUIntArgb, EPaletteProviderType, XyDataSeries, EllipsePointMarker } from "scichart";
export async function drawWithComplexOptionsUsingBuilderApi(divElementId) {
    // #region_A_start
    return chartBuilder.buildChart(divElementId, {
        series: {
            type: ESeriesType.ScatterSeries,
            xyData: {
                xValues: [1, 3, 4, 7, 9],
                yValues: [10, 6, 7, 2, 16]
            },
            options: {
                pointMarker: {
                    type: EPointMarkerType.Ellipse,
                    options: {
                        stroke: "red",
                        fill: "white",
                    }
                }
            }
        }
    });
    // #region_A_end
}
export async function drawWithComplexOptionsAlternativeUsingBuilderApi(divElementId) {
    // #region_B_start
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {});
    const pointMarker = new EllipsePointMarker(wasmContext, {
        stroke: "red",
        fill: "white",
    });
    const seriesArray = await chartBuilder.buildSeries(wasmContext, {
        type: ESeriesType.ScatterSeries,
        xyData: {
            xValues: [1, 3, 4, 7, 9],
            yValues: [10, 6, 7, 2, 16]
        },
        options: {
            pointMarker: pointMarker // you can use the pointMarker instance created above
        }
    });
    sciChartSurface.renderableSeries.add(...seriesArray);
    // #region_B_end
}
export async function drawChartWithRegisteredFunctionUsingBuilderApi(divElementId) {
    // #region_C_start
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 3, 4, 7, 9],
                yValues: [10, 6, 7, 2, 16]
            }
        }
    });
    const logOnSelectionChanged = (args) => {
        console.log(args);
    };
    chartBuilder.registerFunction(EBaseType.OptionFunction, "logOnSelectionChanged", logOnSelectionChanged);
    const [chartModifier] = chartBuilder.buildModifiers({
        type: EChart2DModifierType.SeriesSelection,
        options: { onSelectionChanged: "logOnSelectionChanged" }
    });
    sciChartSurface.chartModifiers.add(chartModifier);
    // #region_C_end
}
export async function drawChartWithCustomSubtypeUsingBuilderApi(divElementId) {
    // #region_D_start
    class ExampleMountainPaletteProvider {
        static Name;
        strokePaletteMode = EStrokePaletteMode.SOLID;
        fillPaletteMode = EFillPaletteMode.SOLID;
        palettedStroke;
        palettedFill;
        options;
        constructor(options) {
            this.options = options;
            this.palettedStroke = parseColorToUIntArgb(options.stroke);
            this.palettedFill = parseColorToUIntArgb(options.fill);
        }
        onAttached(parentSeries) { }
        onDetached() { }
        overrideFillArgb(xValue, yValue, index) {
            if (yValue > 0.5 && yValue < 0.75) {
                return this.palettedFill;
            }
            else {
                return undefined;
            }
        }
        overrideStrokeArgb(xValue, yValue, index) {
            if (yValue > 0.5 && yValue < 0.75) {
                return this.palettedStroke;
            }
            else {
                return undefined;
            }
        }
        // Add a toJSON method so this can be serialized.
        toJSON() {
            return {
                type: EPaletteProviderType.Custom,
                customType: ExampleMountainPaletteProvider.Name,
                options: this.options
            };
        }
    }
    // Register it for use by the builder api
    chartBuilder.registerType(EBaseType.PaletteProvider, ExampleMountainPaletteProvider.Name, (options) => new ExampleMountainPaletteProvider(options));
    // Build the surface
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        series: {
            type: ESeriesType.MountainSeries,
            options: {
                paletteProvider: {
                    type: EPaletteProviderType.Custom,
                    customType: ExampleMountainPaletteProvider.Name,
                    options: { stroke: "lime", fill: "yellow" }
                },
            }
        }
    });
    // Create a dataSeries the normal way
    const dataSeries = new XyDataSeries(wasmContext);
    // Generate data
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        let y = Math.abs(Math.sin(i * STEP));
        if (y < 0.2) {
            y = NaN;
        }
        dataSeries.append(i, y);
    }
    sciChartSurface.renderableSeries.get(0).dataSeries = dataSeries;
    // #region_D_end
}
;
