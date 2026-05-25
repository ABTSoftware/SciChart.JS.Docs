import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const {
        EFibonacciLabelColorMode,
        EFibonacciLabelPlacement,
        FibonacciExtensionAnnotation,
        SciTraderLightTheme,
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode,
        EAxisLabelDrawMode
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 1200) }));

    sciChartSurface.annotations.add(
        new FibonacciExtensionAnnotation({
            // Points 1-2 measure the upward move. Point 3 anchors the extension start.
            points: [
                { x: 15, y: 140 },
                { x: 38, y: 380 },
                { x: 75, y: 480 }
            ],
            thresholds: [0, 0.382, 0.618, 1, 1.272, 1.618, 2.618],
            regionColors: ["#0EA5E9", "#22C55E", "#F97316"], // if more regions exist than passed here we'll interpolate extra ones for you
            fillOpacity: 0.16,
            strokeThickness: 2,
            fibonacciLabelPlacement: EFibonacciLabelPlacement.Left,
            fibonacciLabelColorMode: EFibonacciLabelColorMode.SingleColor,
            fibonacciLabelColor: "#111827",
            formatFibonacciLabel: ({ thresholdLabel, valueLabel }) => `${thresholdLabel} (${valueLabel})`,

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
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new SciChart.AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: SciChart.ECursorStyle.Crosshair,
        })
    )
}

drawExample("scichart-root");
