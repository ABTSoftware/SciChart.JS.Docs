import * as SciChart from "scichart";
export async function polarUniformHeatmapChart(divElementId) {
    // #region_A_start
    const { PolarMouseWheelZoomModifier, SciChartJsNavyTheme, PolarZoomExtentsModifier, PolarPanModifier, EAxisAlignment, PolarNumericAxis, EPolarLabelMode, SciChartPolarSurface, EPolarAxisMode, NumberRange, HeatmapColorMap, UniformHeatmapDataSeries, PolarUniformHeatmapRenderableSeries, } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    const HEATMAP_WIDTH = 48;
    const HEATMAP_HEIGHT = 10;
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(0, HEATMAP_WIDTH),
        autoTicks: false,
        majorDelta: 1,
        polarLabelMode: EPolarLabelMode.Perpendicular,
        flippedCoordinates: true, // go clockwise
        totalAngle: Math.PI * 2,
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Bottom,
        visibleRange: new NumberRange(0, HEATMAP_HEIGHT),
        drawLabels: false, // hide radial labels
        innerRadius: 0.1,
    });
    sciChartSurface.yAxes.add(radialYAxis);
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
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 100,
            gradientStops: [
                { offset: 0, color: "lightblue" },
                { offset: 1, color: "indigo" },
            ]
        }),
    });
    sciChartSurface.renderableSeries.add(heatmapSeries);
    // #region_A_end
    sciChartSurface.chartModifiers.add(new PolarPanModifier(), new PolarZoomExtentsModifier(), new PolarMouseWheelZoomModifier());
    return { sciChartSurface, wasmContext };
}
polarUniformHeatmapChart("scichart-root");
