import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EVerticalTextPosition,
        NativeTextAnnotation,
        NumberRange,
        NumericAxis,
        SciChartSurface
    } = SciChart; // or import from "scichart"
    const {
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode,
        ETradingAnnotationType,
        MultiPointAnnotationPlacementModifier,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 50) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(20, 90) }));

    const placementModifier = new MultiPointAnnotationPlacementModifier({});
    sciChartSurface.chartModifiers.add(placementModifier);

    placementModifier.startPlacement({
        type: ETradingAnnotationType.ChannelAnnotation,
        options: {
            stroke: "#3388FF",
            fill: "#3388FF33",
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
    // #region_A_end

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 25,
            y1: 85,
            text: "Click 3 points to place a channel.",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 14,
            opacity: 0.75,
            textColor: "#111"
        })
    );
}

drawExample("scichart-root");
