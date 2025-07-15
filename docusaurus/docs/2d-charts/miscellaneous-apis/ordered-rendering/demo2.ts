import * as SciChart from "scichart";

const {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    XyDataSeries,
    SplineLineRenderableSeries,
    BoxAnnotation,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    ECoordinateMode
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

    const dataSeries2 = new XyDataSeries(wasmContext, {
        xValues: Array.from({ length: 20 }, (_, i) => i),
        yValues: [4.0, 6.0, 3.5, 7.0, 2.5, 6.5, 3.0, 7.5, 2.0, 8.0, 3.0, 6.5, 3.5, 7.0, 2.5, 6.0, 3.0, 7.5, 2.5, 8.0]
    });

    // region_B_start
    const lineSeries1 = new SplineLineRenderableSeries(wasmContext, {
        dataSeries: dataSeries1,
        stroke: "royalblue",
        strokeThickness: 5
    });

    const lineSeries2 = new SplineLineRenderableSeries(wasmContext, {
        dataSeries: dataSeries2,
        stroke: "orangered",
        strokeThickness: 5
    });

    sciChartSurface.renderableSeries.add(lineSeries1, lineSeries2);

    const boxAnnotation = new BoxAnnotation({
        renderNextTo: { renderable: lineSeries1.id, offset: 0 },
        fill: "mediumseagreen",
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 8,
        y1: 0,
        x2: 12,
        y2: 1
    });

    sciChartSurface.annotations.add(boxAnnotation);
    // region_B_end

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

drawHtmlAnnotationsExample("scichart-root");
