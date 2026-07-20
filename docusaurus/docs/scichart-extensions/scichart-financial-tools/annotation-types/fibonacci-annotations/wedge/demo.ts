import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId: string) {
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const {
        EFibonacciLabelColorMode,
        EFibonacciLabelPlacement,
        FibonacciWedgeAnnotation,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    
    // #region_A_start
    sciChartSurface.annotations.add(
        new FibonacciWedgeAnnotation({
            // Point 1 is the center. Points 2 and 3 set the wedge angle.
            points: [
                { x: 1.8, y: 2 },
                { x: 7, y: 8 },
                { x: 8, y: 1 }
                // if 3rd point is NOT correctly placed equally distant 
                // from point1 as point2, it will correct itself on first interaction
            ],
            thresholds: [0, 0.236, 0.382, 0.5, 0.618, 1],
            regionColors: ["#0891B2", "green", "#84CC16", "#D56E0B", "red"],
            fillOpacity: 0.10,
            strokeThickness: 2,
            showConnectorLine: false,
            fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
            fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
            // formatFibonacciLabel: ({ thresholdLabel }) => ("level: " + thresholdLabel),
            isEditable: true
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
