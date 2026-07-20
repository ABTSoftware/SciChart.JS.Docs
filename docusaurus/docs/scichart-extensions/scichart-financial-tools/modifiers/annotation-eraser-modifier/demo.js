import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { AnnotationEraserModifier, ChannelAnnotation, PitchforkAnnotation, PolyLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools;
    const host = document.getElementById(divElementId);
    if (host) {
        host.innerHTML = `
            <div style="
                margin: 0 0 12px 0;
                padding: 12px 16px;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.92));
                color: #E2E8F0;
                font-weight: 600;
                letter-spacing: 0.01em;
                box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
            ">
                Click and move over annotations to delete them
            </div>
            <div id="${divElementId}-chart" style="height: 420px; min-height: 420px;"></div>
        `;
    }
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(`${divElementId}-chart`, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 60) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(70, 130) }));
    sciChartSurface.annotations.add(new PolyLineAnnotation({
        points: [
            { x: 8, y: 118 },
            { x: 20, y: 124 },
            { x: 31, y: 116 }
        ],
        stroke: "#3B82F6",
        strokeThickness: 3,
        isEditable: true,
        isSelected: true
    }), new ChannelAnnotation({
        points: [
            { x: 14, y: 108 },
            { x: 30, y: 118 },
            { x: 30, y: 96 }
        ],
        stroke: "#F97316",
        fill: "#F9731622",
        showMidLine: true,
        showMidPointGrips: true,
        isEditable: true
    }), new PitchforkAnnotation({
        points: [
            { x: 34, y: 112 },
            { x: 42, y: 100 },
            { x: 48, y: 94 }
        ],
        stroke: "#10B981",
        strokeThickness: 2,
        showFullWidthZone: true,
        fullWidthZoneFill: "#10B98122",
        showHalfWidthZone: true,
        halfWidthZoneFill: "#10B98133",
        isEditable: true
    }));
    sciChartSurface.chartModifiers.add(new AnnotationEraserModifier({
        isErasing: true,
        keepErasingAfterComplete: true,
        showEraserTrail: true,
        eraserTrailColor: "#94A3B8",
        eraserTrailOpacity: 0.45,
        eraserTrailStrokeThickness: 16,
        eraserTrailWindowPx: 480,
        eraserTrailDisappearDelayMs: 1000,
        dragStartThresholdPx: 2,
        pointSamplingDistancePx: 2
    }), new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    // #region_A_end
}
drawExample("scichart-root");
