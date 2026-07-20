import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { AnnotationHoverModifier, ECursorStyle, NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { ModifiedSchiffPitchforkAnnotation, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    sciChartSurface.annotations.add(new ModifiedSchiffPitchforkAnnotation({
        points: [
            { x: 2, y: 7 },
            { x: 5, y: 3 },
            { x: 5, y: 6 },
        ],
        isEditable: true,
        isSelected: true,
        stroke: "#f56200",
        strokeThickness: 2,
        showFullWidthZone: true,
        fullWidthZoneFill: "#f5620026",
        showHalfWidthZone: true,
        halfWidthZoneFill: "#f5620033"
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
}
drawExample("scichart-root");
