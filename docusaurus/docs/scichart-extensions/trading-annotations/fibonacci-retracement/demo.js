import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartJsNavyTheme, SciChartSurface, EVerticalTextPosition, AnnotationHoverModifier, ECursorStyle } = SciChart; // or import from "scichart"
    const { EFibonacciLabelColorMode, EFibonacciLabelPlacement, EMultiPointLabelAnchorMode, FibonacciRetracementAnnotation } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 1000) }));
    sciChartSurface.annotations.add(new FibonacciRetracementAnnotation({
        // Points 1-2 define the baseline. Point 3 defines the retracement level and extension direction.
        points: [
            { x: 30, y: 100 },
            { x: 70, y: 100 },
            { x: 75, y: 600 }
        ],
        strokeThickness: 2,
        // Kept the list short for docs.
        thresholds: [0, 0.236, 0.382, 0.5, 0.618, 1, 1.618],
        regionColors: [
            "#FFF",
            "#999", // if there are more regions than colors, we'll interpolate the rest based on these for you!
        ],
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
        fibonacciLabelFontSize: 12,
        fibonacciLabelLinePadding: 3,
        // Level labels are separate from inherited point/segment labels.
        formatFibonacciLabel: ({ thresholdLabel, valueLabel }) => {
            return `${thresholdLabel} (Y: ${valueLabel})`;
        },
        isEditable: true,
        labels: [
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 0,
                verticalTextPosition: EVerticalTextPosition.Below,
                text: "Low", color: "#FFF"
            },
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 2,
                verticalTextPosition: EVerticalTextPosition.Above,
                text: "High", color: "#FFF"
            }
        ],
    }));
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair,
    }));
    // #region_A_end
}
drawExample("scichart-root");
