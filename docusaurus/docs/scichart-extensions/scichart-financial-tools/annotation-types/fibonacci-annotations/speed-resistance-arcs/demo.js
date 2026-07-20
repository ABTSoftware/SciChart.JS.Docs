import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { EFibonacciLabelColorMode, EFibonacciLabelPlacement, FibonacciSpeedResistanceArcsAnnotation, SciTraderLightTheme, EAnnotationVisibilityMode } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    sciChartSurface.annotations.add(new FibonacciSpeedResistanceArcsAnnotation({
        // Point 2 is above point 1, so the arcs open upward.
        points: [
            { x: 5, y: 2 },
            { x: 7, y: 5 } // does NOT need to be on the same x as first point
        ],
        thresholds: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618],
        regionColors: ["#0871B2", "darkgreen", "#D56E0B"], // if there are more `thresholds` than colors, we'll interpolate them for you!
        fillOpacity: 0.25,
        strokeThickness: 2,
        // connectorLineStroke: "#242424",
        connectorLineStrokeDashArray: [10, 3],
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
        formatFibonacciLabel: ({ thresholdLabel }) => ("ratio: " + thresholdLabel),
        isEditable: true,
        gripVisibility: EAnnotationVisibilityMode.Always
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair,
    }));
}
drawExample("scichart-root");
