import { NumberRange, EColumnMode, EColumnYMode, SciChartSurface, NumericAxis, SciChartJsNavyTheme, FastRectangleRenderableSeries, XyxyDataSeries, EFillPaletteMode, parseColorToUIntArgb, LineArrowAnnotation, EArrowHeadPosition, TextAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart";
async function verticalSegmentedGauge(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(2, 2) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.05, 0.05) }));
    // region_A_start
    // Each segment top value and matching color
    const SEGMENT_TOPS = [20, 40, 60, 80, 100];
    const SEGMENT_COLORS = ["#FF4F81", "#FF9A3C", "#50C7E0", "#264B93", "#1B2A4A"];
    const GAUGE_WIDTH = 10;
    // Build XyxyDataSeries: each rectangle spans x=[0, GAUGE_WIDTH], y=[segmentBottom, segmentTop]
    const xValues = [];
    const yValues = [];
    const x1Values = [];
    const y1Values = [];
    SEGMENT_TOPS.forEach((top, i) => {
        xValues.push(0);
        yValues.push(i === 0 ? 0 : SEGMENT_TOPS[i - 1]);
        x1Values.push(GAUGE_WIDTH);
        y1Values.push(top);
    });
    // Implement IFillPaletteProvider to color each segment individually
    class SegmentPaletteProvider {
        fillPaletteMode = EFillPaletteMode.SOLID;
        colors = SEGMENT_COLORS.map(c => parseColorToUIntArgb(c));
        onAttached(parentSeries) { }
        onDetached() { }
        overrideFillArgb(xValue, yValue, index) {
            return this.colors[index % this.colors.length];
        }
    }
    const gaugeSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, { xValues, yValues, x1Values, y1Values }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        strokeThickness: 0.5,
        stroke: "#FFFFFF22",
        paletteProvider: new SegmentPaletteProvider()
    });
    sciChartSurface.renderableSeries.add(gaugeSeries);
    // Arrow annotation pointing at the current value
    const value = 65;
    sciChartSurface.annotations.add(new LineArrowAnnotation({
        x1: GAUGE_WIDTH, y1: value,
        x2: GAUGE_WIDTH + 1, y2: value,
        stroke: "#FFFFFF",
        strokeThickness: 2,
        arrowHeadPosition: EArrowHeadPosition.Start,
        arrowStyle: { headLength: 10, headWidth: 7, headDepth: 1, fill: "#FFFFFF", strokeThickness: 1 }
    }), new TextAnnotation({
        x1: GAUGE_WIDTH + 1.3, y1: value,
        text: `${value}`,
        fontSize: 12,
        textColor: "#FFFFFF",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    }));
    // region_A_end
    // Scale labels at each segment boundary
    [0, ...SEGMENT_TOPS].forEach(yVal => {
        sciChartSurface.annotations.add(new TextAnnotation({
            x1: -0.5, y1: yVal,
            text: `${yVal}`,
            fontSize: 11,
            textColor: "#FFFFFF",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Center
        }));
    });
    return { sciChartSurface };
}
verticalSegmentedGauge("scichart-root");
