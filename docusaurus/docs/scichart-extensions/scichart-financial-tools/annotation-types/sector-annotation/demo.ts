import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { SectorAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region_A_start
    sciChartSurface.annotations.add(
        new SectorAnnotation({
            isEditable: true,
            points: [
                { x: 2, y: 3 },
                { x: 7, y: 8 },
                { x: 8, y: 2 }
            ],
            strokeThickness: 2,
            fillOpacity: 0.25,
            thresholds: [0, 1],
            regionColors: [ "#38BDF8" ],
            selectionBoxStroke: "none"
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
