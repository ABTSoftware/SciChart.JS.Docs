import { SciChartSurface, NumericAxis, SciChartJsNavyTheme, TextAnnotation, ZoomPanModifier, MouseWheelZoomModifier, ECoordinateMode, EHorizontalAnchorPoint, EVerticalAnchorPoint, } from "scichart";
async function visibleRangeChanged(divElementId) {
    const options = {
        x1: 0.5,
        y1: 0.5,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        opacity: 0.77,
        fontSize: 28,
        fontWeight: "Bold",
        textColor: "White"
    };
    // #region_A_start
    // Create a chart with X,Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // Add a label showing the status
    const textAnnotation = new TextAnnotation({
        text: "Drag to pan the chart",
        ...options
    });
    sciChartSurface.annotations.add(textAnnotation);
    // subscribe to visibleRangeChanged on yAxis
    sciChartSurface.yAxes.get(0).visibleRangeChanged.subscribe(args => {
        const message = `yAxis range: ${args.visibleRange.min.toFixed(2)}, ${args.visibleRange.max.toFixed(2)}`;
        console.log(message);
        textAnnotation.text = message;
    });
    // #region_A_end
    // add pan and zoom behaviour
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}
visibleRangeChanged("scichart-root");
