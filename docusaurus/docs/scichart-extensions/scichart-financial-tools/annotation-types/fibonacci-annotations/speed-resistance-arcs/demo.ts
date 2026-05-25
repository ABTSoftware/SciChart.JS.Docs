import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const {
        EFibonacciLabelColorMode,
        EFibonacciLabelPlacement,
        FibonacciSpeedResistanceArcsAnnotation,
        SciTraderLightTheme,
        EAnnotationVisibilityMode
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(150, 900) }));

    sciChartSurface.annotations.add(
        new FibonacciSpeedResistanceArcsAnnotation({
            // Point 2 is above point 1, so the arcs open upward.
            points: [
                { x: 50, y: 260 },
                { x: 63, y: 550 } // does not NEED to be on the same x as first point
            ],
            thresholds: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618],
            regionColors: ["#6366F1", "#F97316"],
            fillOpacity: 0.30,
            strokeThickness: 2,
            connectorLineStroke: "#6366F1",
            connectorLineStrokeDashArray: [10, 3],
            fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
            fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
            formatFibonacciLabel: ({ thresholdLabel }) => ("ratio: " + thresholdLabel),

            isEditable: true,
            gripVisibility: EAnnotationVisibilityMode.Always
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new SciChart.AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: SciChart.ECursorStyle.Crosshair,
        })
    );
}

drawExample("scichart-root");
