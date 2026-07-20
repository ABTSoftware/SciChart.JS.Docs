import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { EFibonacciLabelPlacement, FibonacciRetracementAnnotation, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 60) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(82, 136) }));
    sciChartSurface.annotations.add(new FibonacciRetracementAnnotation({
        points: [
            { x: 10, y: 108 },
            { x: 24, y: 121 },
            { x: 44, y: 100 }
        ],
        verticalOnly: false,
        strokeThickness: 2,
        thresholds: [0, 0.382, 0.5, 0.618, 1, 1.618, 2.618],
        regionColors: ["#F59E0B", "#F97316", "#FB7185", "#60A5FA", "#34D399", "#A78BFA"],
        fillOpacity: 0.18,
        connectorLineStrokeDashArray: [6, 4],
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Left,
        isEditable: true,
        isSelected: true
    }));
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    // #region_A_end
}
drawExample("scichart-root");
