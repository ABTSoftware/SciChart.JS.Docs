import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        NumberRange,
        NumericAxis,
        SciChartJsNavyTheme,
        SciChartSurface
    } = SciChart; // or import from "scichart"
    const { MeasureAnnotation } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 40) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(95, 125) }));

    sciChartSurface.annotations.add(
        new MeasureAnnotation({
            // MeasureAnnotation compares the values at two points.
            points: [
                { x: 8, y: 100 },
                { x: 28, y: 118 }
            ],
            strokeThickness: 2,
            growingColor: "#16A34A",
            decliningColor: "#DC2626",
            // Scale the delta into basis points for this financial example.
            yValueScaleFactor: 100,
            // Return one string per line for the central measurement label.
            labelDataTemplate: ({ percentChange, bars, scaledDeltaY }) => [
                `${percentChange.toFixed(2)}%`,
                `${bars} bars`,
                `${scaledDeltaY.toFixed(1)} bps`
            ],
            isEditable: true
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
