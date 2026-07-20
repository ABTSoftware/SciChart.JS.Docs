import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { AnnotationHoverModifier, ECursorStyle, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart";
    const { SciTraderLightTheme, SchiffPitchforkAnnotation } = SciChartFinancialTools; // or import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    sciChartSurface.annotations.add(new SchiffPitchforkAnnotation({
        points: [
            { x: 2, y: 7 },
            { x: 4, y: 3 },
            { x: 5, y: 6 }
        ],
        isEditable: true,
        isSelected: true,
        stroke: "#38BDF8",
        strokeThickness: 2,
        showFullWidthZone: true,
        fullWidthZoneFill: "#38BDF826",
        showHalfWidthZone: true,
        halfWidthZoneFill: "#0EA5E933"
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
}
drawExample("scichart-root");
