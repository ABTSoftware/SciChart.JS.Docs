import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const {
        EFibonacciLabelColorMode,
        EFibonacciLabelPlacement,
        FibonacciCirclesAnnotation,
        EAnnotationVisibilityMode,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 1000) }));

    sciChartSurface.annotations.add(
        new FibonacciCirclesAnnotation({
            // The two points are opposite corners of the threshold 1 oval.
            points: [
                { x: 40, y: 390 },
                { x: 61, y: 610 },
            ],
            thresholds: [
                0, 0.236, 0.5, 0.618, 1, 1.618, 2.618, 3.618, 4.236
            ],
            regionColors: [
                "rgb(223,72,76)", // used for both strokes & fills of this annotation
                "rgb(231,147,46)",
                "rgb(68,151,130)",
                "rgb(103,173,92)",
                "rgb(85,185,209)",
                "rgb(128,128,128)",
                "rgb(214,56,101)",
                "rgb(56,97,246)",
            ],
            fillOpacity: 0.20,
            strokeThickness: 2,
            fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
            // fibonacciLabelColorMode: EFibonacciLabelColorMode.SingleColor,
            // fibonacciLabelColor: "#000000", // only important if `fibonacciLabelColorMode` is `Single`
            fibonacciLabelLinePadding: 0,
            formatFibonacciLabel: ({ thresholdLabel }) => thresholdLabel + "%",
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
