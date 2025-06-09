import * as SciChart from "scichart";
export async function polarCategoryAxisDemo(rootElement) {
    // #region_A_start
    const { SciChartPolarSurface, SciChartJsNavyTheme, PolarCategoryAxis, PolarLineRenderableSeries, XyDataSeries, EPolarAxisMode, NumberRange, EPolarGridlineMode, EAxisAlignment, EPolarLabelMode } = SciChart;
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });
    // Angular axis: goes around the circle, from 0 to 360 degrees
    const angularAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // Lines around the center
        axisAlignment: EAxisAlignment.Top,
        drawMinorGridLines: false,
        startAngle: Math.PI / 2, // Start chart at 12 o'clock
        labels: ["Bandwidth", "Latency", "Throughput", "Capacity", "Efficiency", "Scalability", "Reliability"],
    });
    sciChartSurface.xAxes.add(angularAxis);
    // Radial axis: from center outward, with circular gridlines
    const radialAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        polarLabelMode: EPolarLabelMode.Perpendicular,
        innerRadius: 0.1,
        gridlineMode: EPolarGridlineMode.Polygons, // radar chart look
        flippedCoordinates: true, // from "Low" to "Excellent"
        labels: ["Low", "Medium", "High", "Very High", "Excellent"],
        visibleRange: new NumberRange(0, 4),
        startAngle: Math.PI / 2, // draw radial labels at 12 o'clock
    });
    sciChartSurface.yAxes.add(radialAxis);
    sciChartSurface.renderableSeries.add(new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 8 }, (_, i) => i),
            yValues: [1, 2, 3, 4, 0, 4, 3, 1] // Example values for each category
        }),
        stroke: "#FF6600",
        strokeThickness: 3,
    }));
    // #region_A_end
}
polarCategoryAxisDemo("scichart-root");
