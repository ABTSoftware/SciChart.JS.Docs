import { NumberRange, EColumnMode, EColumnYMode, SciChartSurface, NumericAxis, SciChartJsNavyTheme, FastRectangleRenderableSeries, XyxyDataSeries, ZoomExtentsModifier, ZoomPanModifier, EZoomState, MouseWheelZoomModifier, TextAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, ECoordinateMode } from "scichart";
async function demo(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    const xValues = [0, 6, 10, 17];
    const yValues = [0, 6, 2, 5];
    const x1Values = [5, 9, 15, 25];
    const y1Values = [5, 9, 8, 10];
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        fill: "cornflowerblue",
        stroke: "black",
        strokeThickness: 1,
        opacity: 0.5
    });
    // region_A_start
    const statusLabel = new TextAnnotation({
        x1: 0.1,
        y1: 0.1,
        opacity: 0.5,
        fontSize: 22,
        textColor: "white",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
    });
    sciChartSurface.annotations.add(statusLabel);
    setInterval(() => {
        if (sciChartSurface.zoomState === EZoomState.UserZooming) {
            statusLabel.text = "User is zooming or panning";
        }
        else {
            statusLabel.text = "User is not zooming or panning";
        }
    }, 500);
    // region_A_end
    sciChartSurface.renderableSeries.add(rectangleSeries);
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
}
demo("scichart-root");
