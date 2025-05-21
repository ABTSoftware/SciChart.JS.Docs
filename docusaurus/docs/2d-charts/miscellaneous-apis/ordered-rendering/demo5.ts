import * as SciChart from "scichart";

const {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    XyDataSeries,
    SplineMountainRenderableSeries,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    EDefaultRenderLayer,
} = SciChart;

async function drawHtmlAnnotationsExample(divElementId: string | HTMLDivElement) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // An annotation placed between series using custom render order
    const dataSeries1 = new XyDataSeries(wasmContext, {
        xValues: Array.from({ length: 20 }, (_, i) => i),
        yValues: [5.0, 5.8, 6.5, 7.0, 6.5, 5.8, 5.0, 4.2, 3.5, 3.0, 3.5, 4.2, 5.0, 5.8, 6.5, 7.0, 6.5, 5.8, 5.0, 4.2]
    });

    // region_B_start
    const lineSeries1 = new SplineMountainRenderableSeries(wasmContext, {
        renderLayer: EDefaultRenderLayer.Background,
        dataSeries: dataSeries1,
        stroke: "royalblue",
        strokeThickness: 5
    });

    sciChartSurface.renderableSeries.add(lineSeries1);
    // region_B_end

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

drawHtmlAnnotationsExample("scichart-root");
