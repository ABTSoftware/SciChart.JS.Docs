import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, ECoordinateMode, EHorizontalAnchorPoint, FastOhlcRenderableSeries, NativeTextAnnotation, NumberRange, NumericAxis, OhlcDataSeries, SciChartSurface } = SciChart; // or import { ... } from "scichart"
    const { EAnnotationVisibilityMode, ESnapMode, PolyLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // for npm: import { ... } from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 12) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(90, 125) }));
    // Add a mock series to have what to snap to
    const priceSeries = new FastOhlcRenderableSeries(wasmContext, {
        id: "priceSeries",
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            openValues: [101, 99, 103, 101, 108, 106, 112, 109, 115, 111, 117],
            highValues: [103, 105, 105, 110, 110, 114, 114, 117, 118, 119, 120],
            lowValues: [97, 98, 99, 101, 104, 106, 107, 109, 109, 111, 112],
            closeValues: [99, 103, 101, 108, 106, 112, 109, 115, 111, 117, 114]
        }),
        dataPointWidth: 0.7,
        strokeThickness: 3,
    });
    sciChartSurface.renderableSeries.add(priceSeries);
    // This annotation's `snapMode` will be changed when pressing the button
    const polyline = new PolyLineAnnotation({
        points: [
            { x: 2, y: 107 },
            { x: 5, y: 113 },
            { x: 8, y: 103 }
        ],
        stroke: "#3388FF",
        strokeThickness: 3,
        isEditable: true,
        isSelected: true,
        snapMode: ESnapMode.XSlice,
        snapToSeriesId: priceSeries.id,
        snapToDataPointRadius: 100, // the bigger this value is, the stronger the data-point "magnet" is to the svg grip!
        gripVisibility: EAnnotationVisibilityMode.Always // always show grips
    });
    sciChartSurface.annotations.add(polyline);
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    sciChartSurface.annotations.add(new NativeTextAnnotation({
        text: "Press the black button to go through all `snapMode` options!",
        textColor: "#000",
        x1: 0.5,
        y1: 0.1,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        fontSize: 18
    }), new NativeTextAnnotation({
        text: "None — vertices move freely without snapping.",
        textColor: "#000",
        x1: 0.5,
        y1: 0.92,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        fontSize: 18
    }), new NativeTextAnnotation({
        text: "XSlice — X snaps to a data point's vertical slice while Y remains free.",
        textColor: "#000",
        x1: 0.5,
        y1: 0.86,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        fontSize: 18
    }), new NativeTextAnnotation({
        text: "DataPoint — X and Y snap to a nearby point within snapToDataPointRadius.",
        textColor: "#000",
        x1: 0.5,
        y1: 0.8,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        fontSize: 18
    }));
    const snapModes = [ESnapMode.None, ESnapMode.DataPoint, ESnapMode.XSlice];
    let snapModeIndex = 2;
    const snapModeButton = document.querySelector("#snap-mode");
    snapModeButton.addEventListener("click", () => {
        snapModeIndex = (snapModeIndex + 1) % snapModes.length;
        polyline.snapMode = snapModes[snapModeIndex];
        snapModeButton.textContent = `snapMode: ESnapMode.${polyline.snapMode}`;
    });
}
drawExample("scichart-root");
