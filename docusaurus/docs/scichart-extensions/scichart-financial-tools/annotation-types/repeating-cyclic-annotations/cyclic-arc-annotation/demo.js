import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { CyclicArcAnnotation, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));
    // #region_A_start
    sciChartSurface.annotations.add(new CyclicArcAnnotation({
        isEditable: true,
        points: [
            { x: 4, y: 13 },
            { x: 5.5, y: 13 }
        ],
        stroke: "#111",
        fill: "#1115",
        strokeThickness: 2,
        isUpward: true
    }), new CyclicArcAnnotation({
        isEditable: true,
        points: [
            { x: 12, y: 8 },
            { x: 16, y: 8 }
        ],
        stroke: "#F97316",
        fill: "#F9731633",
        strokeThickness: 2,
        isUpward: false
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
}
drawExample("scichart-root");
