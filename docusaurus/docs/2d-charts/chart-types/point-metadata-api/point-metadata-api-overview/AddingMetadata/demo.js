import { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme, EllipsePointMarker, NumberRange, RolloverModifier, TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode } from "scichart";
// #region_B_start
class MyMetadata {
    stringValue;
    customValue;
    isSelected;
    constructor(stringValue = "", customValue = 0, isSelected = false) {
        this.stringValue = stringValue;
        this.customValue = customValue;
        this.isSelected = isSelected;
    }
}
// #region_B_end
async function addingMetadata(divElementId) {
    // #region_A_start
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    // Create metadata with initial values. Metadata can be any JS object
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [4.3, 5.3, 6, 6.3, 6.4],
        metadata: [
            new MyMetadata("Here's", 7),
            undefined, // nothing at this index
            new MyMetadata("Some"),
            new MyMetadata(),
            new MyMetadata("Metadata", 99, true)
        ]
    });
    // Add a line series with the metadata
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: "#364BA0",
            stroke: "#50C7E0",
            strokeThickness: 2
        })
    }));
    // Add a RolloverModifier configured to output X,Y,Metadata.stringValue and customValue
    sciChartSurface.chartModifiers.add(new RolloverModifier({
        snapToDataPoint: true,
        tooltipDataTemplate: seriesInfo => [
            `X: ${seriesInfo.formattedXValue}`,
            `Y: ${seriesInfo.formattedYValue}`,
            `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? "null"}`,
            `Metadata.customValue: ${seriesInfo.pointMetadata?.customValue ?? "null"}`
        ]
    }));
    // #region_A_end
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.5,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Create Metadata Example",
        fontSize: 36,
        yCoordShift: -125,
        ...options
    }));
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Hover over the chart to see metadata",
        fontSize: 20,
        yCoordShift: -75,
        ...options
    }));
}
addingMetadata("scichart-root");
