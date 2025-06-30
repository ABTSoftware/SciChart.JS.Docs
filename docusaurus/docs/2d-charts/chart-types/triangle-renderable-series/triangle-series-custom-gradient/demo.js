import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    ZoomPanModifier,
    ZoomExtentsModifier,
    XyxyDataSeries,
    GradientParams,
    Point
} from "scichart";
async function gradientTriangleSeriesChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    // region_A_start
    const dataSeries = new XyxyDataSeries(wasmContext);
    dataSeries.append(200, 200, 0.5, 0.5);
    dataSeries.append(100, 100, 0, 1);
    dataSeries.append(100, 300, 0, 0);
    dataSeries.append(300, 300, 1, 0);
    dataSeries.append(300, 100, 1, 1);
    dataSeries.append(100, 100, 0, 1);
    dataSeries.append(200, 500, 0, 0);
    dataSeries.append(100, 400, 1, 1);
    dataSeries.append(100, 600, 1, 1);
    dataSeries.append(300, 600, 1, 1);
    dataSeries.append(300, 400, 1, 1);
    dataSeries.append(100, 400, 1, 1);
    dataSeries.append(500, 300, 0, 0.7);
    dataSeries.append(600, 500, 0.3, 0.2);
    dataSeries.append(700, 550, 0.5, 0);
    dataSeries.append(800, 500, 0.7, 0.2);
    dataSeries.append(900, 300, 1, 0.7);
    dataSeries.append(700, 200, 0.5, 1);
    const polygonSeries = new TriangleRenderableSeries(wasmContext, {
        dataSeries,
        isDigitalLine: false,
        fill: "cornflowerblue",
        drawMode: ETriangleSeriesDrawMode.Polygon,
        polygonVertices: 6, // Sets the number of vertices per polygon. Applies only for drawMode ETriangleSeriesDrawMode.Polygon
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#f39c12", offset: 0 },
            { color: "#8e44ad", offset: 1 }
        ])
    });
    // region_A_end
    sciChartSurface.renderableSeries.add(polygonSeries);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
}
gradientTriangleSeriesChart("scichart-root");
