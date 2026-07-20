import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { ModifiedSchiffPitchforkAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 30) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));

    sciChartSurface.annotations.add(
        new ModifiedSchiffPitchforkAnnotation({
            isEditable: true,
            points: [
                { x: 5, y: 12 },
                { x: 12, y: 8 },
                { x: 12, y: 4 }
            ],
            stroke: "#F59E0B",
            strokeThickness: 2,
            showFullWidthZone: true,
            fullWidthZoneFill: "#F59E0B26",
            showHalfWidthZone: true,
            halfWidthZoneFill: "#F59E0B33"
        })
    );

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
