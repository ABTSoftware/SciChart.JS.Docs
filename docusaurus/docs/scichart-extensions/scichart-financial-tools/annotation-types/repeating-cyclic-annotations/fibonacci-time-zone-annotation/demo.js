import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle, EAxisAlignment } = SciChart;
    const { FibonacciTimeZoneAnnotation, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    sciChartSurface.annotations.add(new FibonacciTimeZoneAnnotation({
        isEditable: true,
        isSelected: true,
        points: [
            { x: 1, y: 2 },
            { x: 1.25, y: 2 }
        ],
        stroke: "#38F",
        strokeThickness: 2,
        labelColor: "#15A",
        labelFontSize: 13,
        labelPadding: 4,
        // formatTimeZoneLabel: ({ label, index }) => (index <= 1 ? label : `F${label}`), // optional formatting
        // strokeDashArray: [5, 3],
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }), new SciChart.MouseWheelZoomModifier());
}
drawExample("scichart-root");
