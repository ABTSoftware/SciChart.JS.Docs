import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { CyclicLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    sciChartSurface.annotations.add(new CyclicLineAnnotation({
        isEditable: true,
        isSelected: true,
        points: [
            { x: 2, y: 4 },
            { x: 3, y: 4 }
        ],
        stroke: "#38BDF8",
        strokeThickness: 2,
        // strokeDashArray: [5, 3], // optional
        extendStart: true,
        extendEnd: true
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }), new SciChart.MouseWheelZoomModifier());
}
drawExample("scichart-root");
