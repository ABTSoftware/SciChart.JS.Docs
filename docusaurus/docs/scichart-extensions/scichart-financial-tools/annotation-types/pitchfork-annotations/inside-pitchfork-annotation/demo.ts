import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { InsidePitchforkAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 30) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));

    sciChartSurface.annotations.add(
        new InsidePitchforkAnnotation({
            isEditable: true,
            points: [
                { x: 5, y: 12 },
                { x: 12, y: 8 },
                { x: 12, y: 4 }
            ],
            stroke: "#A855F7",
            strokeThickness: 2,
            showFullWidthZone: true,
            fullWidthZoneFill: "#A855F726",
            showHalfWidthZone: true,
            halfWidthZoneFill: "#A855F733"
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
