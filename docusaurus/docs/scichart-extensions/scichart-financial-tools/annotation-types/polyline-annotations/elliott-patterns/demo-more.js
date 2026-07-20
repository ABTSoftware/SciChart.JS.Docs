import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, EHorizontalAnchorPoint, EVerticalAnchorPoint, EVerticalTextPosition, NativeTextAnnotation, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, PolyLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 70) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(92, 220) }));
    const buildWave = (points, stroke, fill, labels) => new PolyLineAnnotation({
        points,
        stroke,
        strokeThickness: 2.5,
        fill,
        isEditable: true,
        gripVisibility: EAnnotationVisibilityMode.Always,
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        labels: labels.map((text, pointIndex) => ({
            anchorMode: EMultiPointLabelAnchorMode.Point,
            pointIndex,
            text,
            verticalTextPosition: pointIndex % 2 === 0 ? EVerticalTextPosition.Below : EVerticalTextPosition.Above,
            yOffset: pointIndex % 2 === 0 ? 5 : -5
        }))
    });
    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 5,
        y1: 214,
        text: "The same PolyLineAnnotation class can show an impulse wave and a correction wave side by side.",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        fontSize: 13,
        textColor: "#111827"
    }), buildWave([
        { x: 6, y: 138 },
        { x: 16, y: 164 },
        { x: 28, y: 152 },
        { x: 40, y: 182 },
        { x: 50, y: 162 },
        { x: 62, y: 196 }
    ], "#7C3AED", "#7C3AED22", ["0", "1", "2", "3", "4", "5"]), buildWave([
        { x: 8, y: 100 },
        { x: 18, y: 122 },
        { x: 30, y: 112 },
        { x: 42, y: 136 },
        { x: 54, y: 118 },
        { x: 64, y: 146 }
    ], "#F97316", "#F9731620", ["A", "B", "C", "D", "E", "F"]));
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    // #region_A_end
}
drawExample("scichart-root");
