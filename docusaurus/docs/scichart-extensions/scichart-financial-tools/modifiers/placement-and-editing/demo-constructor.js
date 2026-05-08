import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { EHorizontalAnchorPoint, EVerticalAnchorPoint, EVerticalTextPosition, NativeTextAnnotation, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, ETradingAnnotationType, MultiPointAnnotationPlacementModifier, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 50) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(20, 90) }));
    const placementModifier = new MultiPointAnnotationPlacementModifier({
        isPlacing: true,
        annotationType: ETradingAnnotationType.ChannelAnnotation,
        keepPlacingAfterComplete: true,
        annotationOptions: {
            stroke: "#16A34A",
            fill: "#16A34A33",
            showMidLine: true,
            showMidPointGrips: true,
            isEditable: true,
            labels: [
                {
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentStartIndex: 0,
                    segmentEndIndex: 1,
                    segmentRatio: 0.5,
                    verticalTextPosition: EVerticalTextPosition.Above,
                    text: "Resistance"
                },
                {
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentStartIndex: 2,
                    segmentEndIndex: 3,
                    segmentRatio: 0.5,
                    verticalTextPosition: EVerticalTextPosition.Below,
                    text: "Support"
                }
            ],
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            gripVisibility: EAnnotationVisibilityMode.Always
        }
    });
    sciChartSurface.chartModifiers.add(placementModifier);
    // #region_A_end
    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 25,
        y1: 85,
        text: "Constructor options start placement immediately.\nAfter completion, click again to place another channel.",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        fontSize: 14,
        opacity: 0.75
    }));
}
drawExample("scichart-root");
