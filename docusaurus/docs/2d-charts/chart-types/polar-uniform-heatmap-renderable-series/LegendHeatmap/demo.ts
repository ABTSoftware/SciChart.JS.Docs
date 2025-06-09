import * as SciChart from "scichart";

export async function polarUniformHeatmapChart(divElementId, legendElementId) {
    const {
        PolarMouseWheelZoomModifier,
        SciChartJsNavyTheme,
        PolarZoomExtentsModifier,
        PolarPanModifier,
        EAxisAlignment,
        PolarNumericAxis,
        EPolarLabelMode,
        SciChartPolarSurface,
        EPolarAxisMode, 
        NumberRange, 
        HeatmapColorMap,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapLegend
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const HEATMAP_WIDTH = 20;
    const HEATMAP_HEIGHT = 100;

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, 
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(0, HEATMAP_WIDTH),

        polarLabelMode: EPolarLabelMode.Parallel,
        flippedCoordinates: true, // go clockwise
        totalAngleDegrees: 180, // half circle
        labelPrecision: 0
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Bottom,
        visibleRange: new NumberRange(0, HEATMAP_HEIGHT),
        labelPrecision: 0
    });
    sciChartSurface.yAxes.add(radialYAxis);
    
    // #region_A_start
    const COLOR_MAP = new HeatmapColorMap({
        minimum: 0,
        maximum: 100,
        gradientStops: [
            { offset: 0, color: "#000000" },
            { offset: 1, color: "#3333AAAA" },
        ]
    });

    // Add a heatmap series to the chart
    const heatmapSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: new UniformHeatmapDataSeries(wasmContext, {
            zValues: Array.from({ length: HEATMAP_HEIGHT }, () => {
                return Array.from({ length: HEATMAP_WIDTH }, () => {
                    return Math.random() * 100;
                });
            }),
            xStart: 0,
            yStart: 0,
            xStep: 1,
            yStep: 1,
        }),
        colorMap: COLOR_MAP,
    });
    sciChartSurface.renderableSeries.add(heatmapSeries);

    // also pass "scichart-legend-root" as `legendElementId` in drawExample()
    const { heatmapLegend } = await HeatmapLegend.create(legendElementId, { 
        theme: {
            ...new SciChartJsNavyTheme(),
            sciChartBackground: "darkblue",
            loadingAnimationBackground: "indigo"
        },
        yAxisOptions: {
            isInnerAxis: true,
            labelStyle: {
                fontSize: 14,
                color: "white",
            },
            axisBorder: {
                borderRight: 2,
                color: "white",
            },
            majorTickLineStyle: {
                color: "white",
                tickSize: 8,
                strokeThickness: 2,
            },
            minorTickLineStyle: {
                color: "white",
                tickSize: 4,
                strokeThickness: 1,
            },
        },
        colorMap: COLOR_MAP
    });
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext, heatmapLegend };
}

polarUniformHeatmapChart("scichart-root", "scichart-legend-root")