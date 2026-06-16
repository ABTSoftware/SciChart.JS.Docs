import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, EVerticalTextPosition, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, SciTraderLightTheme, StopLossTakeProfitAnnotation } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 35) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(95, 125) }));
    sciChartSurface.annotations.add(new StopLossTakeProfitAnnotation({
        // First point is the entry/reference level. The second point decides
        // whether the zone uses takeProfitColor or stopLossColor.
        points: [
            { x: 8, y: 105 },
            { x: 25, y: 118 }
        ],
        takeProfitColor: "#16A34A",
        stopLossColor: "#DC2626",
        fillOpacity: 0.18,
        strokeThickness: 2,
        annotationsGripsFill: "#FFFFFF",
        annotationsGripsStroke: "#111827",
        annotationsGripsRadius: 4,
        isEditable: true,
        isSelected: true,
        axisLabelStroke: "#FFF",
        labels: [
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 0,
                verticalTextPosition: EVerticalTextPosition.Below,
                text: "Entry"
            },
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 1,
                verticalTextPosition: EVerticalTextPosition.Above,
                text: "Target"
            }
        ],
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always
    }));
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    // #region_A_end
    sciChartSurface.annotations.add(new SciChart.NativeTextAnnotation({
        text: "Try dragging the grips or the annotation body to edit.\nThe color will change based on whether the second point is above (take profit) or below (stop loss) the entry.",
        x1: 17.5,
        y1: 123,
        textColor: "#000",
        fontSize: 14,
        horizontalAnchorPoint: SciChart.EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: SciChart.EVerticalAnchorPoint.Top,
    }));
}
drawExample("scichart-root");
