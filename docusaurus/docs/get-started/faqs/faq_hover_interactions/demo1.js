import { NumberRange, EColumnMode, EColumnYMode, SciChartSurface, NumericAxis, SciChartJsNavyTheme, FastRectangleRenderableSeries, XyxyDataSeries, ZoomExtentsModifier, ZoomPanModifier, MouseWheelZoomModifier, TextAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, ECoordinateMode, SeriesSelectionModifier } from "scichart";
async function demo(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    const xValues = [-1, 0, 1, 6, 8, 13, 15, 14];
    const yValues = [0, 1, 6, 0, 1, 0, 0, 9];
    const x1Values = [0, 5, 6, 7, 13, 14, 16, 15];
    const y1Values = [11, 5, 10, 11, 10, 11, 11, 10];
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values,
            dataSeriesName: "Rectangle Data Series"
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        fill: "cornflowerblue",
        stroke: "cornflowerblue",
        strokeThickness: 0,
        opacity: 0.5,
        id: "Blue Rectangle Series",
        seriesName: "Series Name"
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);
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
        text: ""
    });
    sciChartSurface.annotations.add(statusLabel);
    // region_A_start
    const seriesSelectionModifier = new SeriesSelectionModifier({
        enableSelection: true,
        onSelectionChanged: args => {
            console.log("Series selected:", args.selectedSeries[0]);
        }
    });
    sciChartSurface.chartModifiers.add(seriesSelectionModifier);
    // region_A_end
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}
demo("scichart-root");
