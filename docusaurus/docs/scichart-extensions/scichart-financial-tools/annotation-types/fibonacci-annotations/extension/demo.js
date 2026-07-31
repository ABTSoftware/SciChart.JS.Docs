import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { EFibonacciLabelColorMode, EFibonacciLabelPlacement, FibonacciExtensionAnnotation, SciTraderLightTheme, EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, EAxisLabelDrawMode } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));
    // #region_A_start
    sciChartSurface.annotations.add(new FibonacciExtensionAnnotation({
        // Points 1-2 measure the upward move. Point 3 anchors the extension start.
        points: [
            { x: 2, y: 1 },
            { x: 3, y: 3 },
            { x: 7, y: 4 }
        ],
        thresholds: [0, 0.382, 0.618, 1, 1.272, 1.618, 2.618],
        regionColors: ["#0EA5E9", "#22C55E", "#F97316"], // if more regions exist than passed here we'll interpolate extra ones for you
        fillOpacity: 0.16,
        strokeThickness: 2,
        extendStart: false, // both defaut to false
        extendEnd: true,
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Left,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.SingleColor,
        fibonacciLabelColor: "#111827",
        formatFibonacciLabel: ({ thresholdLabel, valueLabel }) => `${thresholdLabel} (${valueLabel})`,
        // strokeDashArray: [5, 2],
        // other properties
        labels: [
            {
                id: "trend-start",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.X,
                pointIndex: 1
            },
            {
                id: "trend-end",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.X,
                pointIndex: 2
            }
        ],
        isEditable: true,
        gripVisibility: EAnnotationVisibilityMode.Always, // to see the svg grips even when the annotation is not selected
        axisLabelStroke: "#FFF"
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair,
    }));
}
drawExample("scichart-root");
