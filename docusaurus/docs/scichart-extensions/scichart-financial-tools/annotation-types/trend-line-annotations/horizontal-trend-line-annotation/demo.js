import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { HorizontalTrendLineAnnotation, EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));
    // #region_A_start
    sciChartSurface.annotations.add(new HorizontalTrendLineAnnotation({
        isEditable: true,
        points: [{ x: 4, y: 6 }],
        stroke: "#38BDF8",
        strokeThickness: 3,
        extendStart: true,
        extendEnd: true,
        labels: [
            {
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                pointIndex: 0,
            }
        ],
        axisLabelStroke: "#FFF",
        gripVisibility: EAnnotationVisibilityMode.Always
    }), new HorizontalTrendLineAnnotation({
        isEditable: true,
        points: [{ x: 12, y: 13 }],
        stroke: "#F97316",
        strokeThickness: 2,
        strokeDashArray: [6, 3],
        extendStart: false,
        extendEnd: true
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
}
drawExample("scichart-root");
