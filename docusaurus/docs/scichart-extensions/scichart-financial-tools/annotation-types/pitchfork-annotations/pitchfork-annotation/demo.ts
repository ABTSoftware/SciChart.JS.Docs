import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { PitchforkAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 30) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));

    // #region_A_start
    sciChartSurface.annotations.add(
        new PitchforkAnnotation({
            isEditable: true,
            points: [
                { x: 5, y: 12 },
                { x: 12, y: 8 },
                { x: 12, y: 4 }
            ],
            stroke: "#60A5FA",
            strokeThickness: 2,
            showFullWidthZone: true,
            fullWidthZoneFill: "#60A5FA33",
            showHalfWidthZone: true,
            halfWidthZoneFill: "#22C55E33"
        }),
        new PitchforkAnnotation({
            isEditable: true,
            points: [
                { x: 17, y: 11 },
                { x: 23, y: 8 },
                { x: 23, y: 5 }
            ],
            stroke: "#F97316",
            strokeThickness: 2,
            showFullWidthZone: false,
            showHalfWidthZone: true,
            halfWidthZoneFill: "#F9731633"
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
