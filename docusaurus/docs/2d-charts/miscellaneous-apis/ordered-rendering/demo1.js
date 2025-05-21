import * as SciChart from "scichart";
const { SciChartSurface, SciChartJsNavyTheme, NumericAxis, XyDataSeries, SplineLineRenderableSeries, BoxAnnotation, ZoomPanModifier, MouseWheelZoomModifier, NativeTextAnnotation, ECoordinateMode, Thickness } = SciChart;
async function drawHtmlAnnotationsExample(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // Text Annotations with customized render order
    // region_A_start
    const textAnnotation1 = new NativeTextAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        x1: 200,
        y1: 200,
        padding: Thickness.fromNumber(8),
        isEditable: true,
        fontSize: 32,
        background: "blue",
        text: "textAnnotation1",
        drawImmediate: true,
        renderOrder: 3
    });
    const textAnnotation2 = new NativeTextAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        x1: 220,
        y1: 220,
        padding: Thickness.fromNumber(8),
        isEditable: true,
        fontSize: 32,
        background: "red",
        drawImmediate: true,
        text: "textAnnotation2"
    });
    sciChartSurface.annotations.add(textAnnotation1, textAnnotation2);
    // region_A_end
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}
drawHtmlAnnotationsExample("scichart-root");
