import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, EVerticalTextPosition, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, PitchfanAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 50) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(20, 90) }));
    sciChartSurface.annotations.add(new PitchfanAnnotation({
        // Pitchfan uses the same three-point model but renders projected fan rays.
        points: [
            { x: 10, y: 42 },
            { x: 24, y: 70 },
            { x: 36, y: 48 }
        ],
        stroke: "#15A",
        strokeThickness: 2,
        showShoulderLine: true,
        fullWidthZoneFill: "#36ff3322",
        halfWidthZoneFill: "#3388FF22",
        isEditable: true,
        isSelected: true,
        labels: [
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 0,
                verticalTextPosition: EVerticalTextPosition.Below,
                text: "Handle"
            },
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 1,
                verticalTextPosition: EVerticalTextPosition.Above,
                text: "P1"
            },
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 2,
                verticalTextPosition: EVerticalTextPosition.Below,
                text: "P2"
            },
            {
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                segmentStartIndex: 0,
                segmentEndIndex: 1,
                segmentRatio: 0.5,
                verticalTextPosition: EVerticalTextPosition.Above,
                text: "Fan Segment Line 1"
            },
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
}
drawExample("scichart-root");
