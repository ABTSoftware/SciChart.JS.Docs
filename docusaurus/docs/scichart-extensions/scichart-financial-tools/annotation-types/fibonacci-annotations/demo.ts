import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const {
        EFibonacciLabelColorMode,
        EFibonacciLabelPlacement,
        FibonacciRetracementAnnotation,
        FibonacciSpeedResistanceArcsAnnotation,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 1000) }));

    const sharedFibonacciOptions = {
        thresholds: [0, 0.382, 0.5, 0.618, 1, 1.618],
        regionColors: ["#2563EB", "#F97316", "#16A34A"],
        fillOpacity: 0.18,
        strokeThickness: 2,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
        // formatFibonacciLabel: ({ thresholdLabel }) => ("label_" + thresholdLabel), // custom label formatting
        isEditable: true
    };

    sciChartSurface.annotations.add(
        new FibonacciRetracementAnnotation({
            ...sharedFibonacciOptions,
            points: [
                { x: 10, y: 580 }, 
                { x: 58, y: 110 }
            ],
            fibonacciLabelPlacement: EFibonacciLabelPlacement.Left,
        }),
        new FibonacciSpeedResistanceArcsAnnotation({
            ...sharedFibonacciOptions,
            points: [
                { x: 72, y: 200 }, 
                { x: 63, y: 500 }
            ],
            showConnectorLine: true,
            fibonacciLabelPlacement: EFibonacciLabelPlacement.Inside,
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
