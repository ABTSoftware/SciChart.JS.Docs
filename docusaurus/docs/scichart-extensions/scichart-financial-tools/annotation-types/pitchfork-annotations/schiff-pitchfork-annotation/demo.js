import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { SciTraderLightTheme, SchiffPitchforkAnnotation } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 30) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));
    sciChartSurface.annotations.add(new SchiffPitchforkAnnotation({
        isEditable: true,
        points: [
            { x: 5, y: 12 },
            { x: 12, y: 8 },
            { x: 12, y: 4 }
        ],
        stroke: "#38BDF8",
        strokeThickness: 2,
        showFullWidthZone: true,
        fullWidthZoneFill: "#38BDF826",
        showHalfWidthZone: true,
        halfWidthZoneFill: "#0EA5E933"
    }));
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    // #region_A_end
}
drawExample("scichart-root");
