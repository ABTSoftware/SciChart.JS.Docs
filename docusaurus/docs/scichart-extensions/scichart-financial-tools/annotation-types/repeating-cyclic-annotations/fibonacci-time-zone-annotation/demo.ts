import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle, EAxisAlignment } = SciChart;
    const { FibonacciTimeZoneAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20), axisAlignment: EAxisAlignment.Top }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));

    // #region_A_start
    sciChartSurface.annotations.add(
        new FibonacciTimeZoneAnnotation({
            isEditable: true,
            points: [
                { x: 3, y: 6 },
                { x: 4, y: 6 }
            ],
            stroke: "#38F",
            strokeThickness: 2,
            labelColor: "#15A",
            labelFontSize: 13,
            labelPadding: 4,
            // formatTimeZoneLabel: ({ label, index }) => (index <= 1 ? label : `F${label}`), // optional formatting
            // strokeDashArray: [5, 3],
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
}

drawExample("scichart-root");
