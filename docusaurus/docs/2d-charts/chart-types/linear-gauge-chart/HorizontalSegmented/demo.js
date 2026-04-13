import * as SciChart from "scichart";
async function horizontalSegmentedGauge(divElementId) {
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme, NumberRange, FastRectangleRenderableSeries, XyxyDataSeries,
        EColumnMode, EColumnYMode, EFillPaletteMode, parseColorToUIntArgb,
        LineArrowAnnotation, EArrowHeadPosition, TextAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.05, 0.05) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(3, 3) }));

    // region_A_start
    const SEGMENT_ENDS = [33, 66, 100];
    const SEGMENT_COLORS = ["#50FA7B", "#FF9A3C", "#FF4747"];
    const SEGMENT_LABELS = ["Low", "Moderate", "High"];
    const GAUGE_HEIGHT = 10;

    const xValues = [];
    const yValues = [];
    const x1Values = [];
    const y1Values = [];

    SEGMENT_ENDS.forEach((end, i) => {
        xValues.push(i === 0 ? 0 : SEGMENT_ENDS[i - 1]);
        yValues.push(0);
        x1Values.push(end);
        y1Values.push(GAUGE_HEIGHT);
    });

    class SegmentPaletteProvider {
        constructor() {
            this.fillPaletteMode = EFillPaletteMode.SOLID;
            this.colors = SEGMENT_COLORS.map(c => parseColorToUIntArgb(c));
        }
        onAttached(parentSeries) {}
        onDetached() {}
        overrideFillArgb(xValue, yValue, index) {
            return this.colors[index % this.colors.length];
        }
    }

    const gaugeSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, { xValues, yValues, x1Values, y1Values }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        strokeThickness: 0.1,
        stroke: "#FFFFFF22",
        paletteProvider: new SegmentPaletteProvider(),
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 14 },
            color: "#FFFFFF"
        }
    });

    gaugeSeries.dataLabelProvider.getText = (state) => {
        return SEGMENT_LABELS[state.index];
    };

    sciChartSurface.renderableSeries.add(gaugeSeries);

    const value = 75;
    sciChartSurface.annotations.add(
        new LineArrowAnnotation({
            x1: value, y1: GAUGE_HEIGHT,
            x2: value, y2: GAUGE_HEIGHT + 1,
            stroke: "#FFFFFF",
            strokeThickness: 2,
            arrowHeadPosition: EArrowHeadPosition.Start,
            arrowStyle: { headLength: 10, headWidth: 7, headDepth: 1, fill: "#FFFFFF", strokeThickness: 1 }
        }),
        new TextAnnotation({
            x1: value, y1: GAUGE_HEIGHT + 1.8,
            text: `${value}`,
            fontSize: 12,
            textColor: "#FFFFFF",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom
        })
    );
    // region_A_end

    [0, ...SEGMENT_ENDS].forEach(xVal => {
        sciChartSurface.annotations.add(new TextAnnotation({
            x1: xVal, y1: -1,
            text: `${xVal}`,
            fontSize: 11,
            textColor: "#FFFFFF",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top
        }));
    });

    return { sciChartSurface };
}
horizontalSegmentedGauge("scichart-root");
