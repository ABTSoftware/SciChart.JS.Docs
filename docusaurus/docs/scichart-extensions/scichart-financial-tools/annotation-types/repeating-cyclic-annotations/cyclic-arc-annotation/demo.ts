import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { CyclicArcAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region_A_start
    sciChartSurface.annotations.add(
        new CyclicArcAnnotation({
            isEditable: true, 
            isSelected: true,
            points: [
                { x: 2, y: 7 },
                { x: 3, y: 7 }
            ],
            stroke: "#111",
            fill: "#1115",
            strokeThickness: 2,
            isUpward: true
        }),
        new CyclicArcAnnotation({
            isEditable: true,
            points: [
                { x: 4, y: 4 },
                { x: 6, y: 4 }
            ],
            stroke: "#F97316",
            fill: "#F9731633",
            strokeThickness: 2,
            isUpward: false
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        }),
        new SciChart.MouseWheelZoomModifier()
    );
}

drawExample("scichart-root");
