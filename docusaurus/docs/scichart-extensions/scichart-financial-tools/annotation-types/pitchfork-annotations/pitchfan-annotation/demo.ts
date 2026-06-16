import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { PitchfanAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 30) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));

    // #region_A_start
    sciChartSurface.annotations.add(
        new PitchfanAnnotation({
            isEditable: true,
            points: [
                { x: 5, y: 12 },
                { x: 12, y: 8 },
                { x: 12, y: 4 }
            ],
            stroke: "#AA8C15",
            strokeThickness: 2,
            showShoulderLine: true,
            showFullWidthZone: true,
            fullWidthZoneFill: "#AA8C1526",
            showHalfWidthZone: true,
            halfWidthZoneFill: "#A55E0B33"
        }),
        new PitchfanAnnotation({
            isEditable: true,
            points: [
                { x: 17, y: 11 },
                { x: 23, y: 8 },
                { x: 23, y: 5 }
            ],
            stroke: "#38BDF8",
            strokeThickness: 2,
            showShoulderLine: false,
            showHalfWidthZone: true,
            halfWidthZoneFill: "#38BDF833"
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
