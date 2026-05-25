import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { AnnotationHoverModifier, ECursorStyle, EHorizontalAnchorPoint, EVerticalAnchorPoint, EVerticalTextPosition, NativeTextAnnotation, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, ETradingAnnotationType, MultiPointAnnotationPlacementModifier, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 60) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(90, 130) }));
    // #region_A_start
    const placementModifier = new MultiPointAnnotationPlacementModifier();
    sciChartSurface.chartModifiers.add(placementModifier);
    placementModifier.startPlacement({
        type: ETradingAnnotationType.PolyLineAnnotation,
        options: {
            placementPointCount: 5,
            stroke: "#FF8833",
            fill: "#FF883315",
            strokeThickness: 2,
            isEditable: true,
            labels: ["X", "A", "B", "C", "D"].map((text, pointIndex) => ({
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex,
                text,
                // cheap trick to alternate label positions above and below points:
                verticalTextPosition: pointIndex % 2 === 0 ? EVerticalTextPosition.Below : EVerticalTextPosition.Above,
                yOffset: pointIndex % 2 === 0 ? 5 : -5,
                // for a smarter solution, see the "formatLabelStyle" callback from the first annotation example on this page
            })),
            pointLabelVisibility: EAnnotationVisibilityMode.Always,
            gripVisibility: EAnnotationVisibilityMode.Always
        }
    });
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 30,
        y1: 128,
        text: "Click five points to place an XABCD pattern.",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        fontSize: 14,
        opacity: 0.75,
        textColor: "#111"
    }));
}
drawExample("scichart-root");
