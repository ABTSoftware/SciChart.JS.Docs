import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EFibonacciLabelColorMode, EFibonacciLabelPlacement, FibonacciRetracementAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(200, 1200) }));
    sciChartSurface.annotations.add(new FibonacciRetracementAnnotation({
        // Default verticalOnly mode uses 2 points.
        // This starts at a swing high and ends at a swing low, so the levels move downward.
        points: [
            { x: 24, y: 820 },
            { x: 78, y: 360 }
        ],
        verticalOnly: true, // default is true, but if false, it is skewed and thus needs 3 points to define.
        strokeThickness: 2,
        thresholds: [0, 0.236, 0.382, 0.5, 0.618, 1, 1.618],
        regionColors: [
            "#2563EB",
            "#F97316" // Missing intermediate colors are interpolated.
        ],
        fillOpacity: 0.2,
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
        fibonacciLabelFontSize: 12,
        fibonacciLabelLinePadding: 3,
        formatFibonacciLabel: ({ thresholdLabel, valueLabel }) => `${thresholdLabel} (${valueLabel})`,
        isEditable: true
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair,
    }));
}
drawExample("scichart-root");
