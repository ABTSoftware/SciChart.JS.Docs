import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { PitchfanAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region_A_start
    sciChartSurface.annotations.add(
        new PitchfanAnnotation({
            points: [
                { x: 2, y: 2 },
                { x: 2, y: 6 },
                { x: 4, y: 5 }
            ],
            isEditable: true,
            stroke: "#AA8C15",
            strokeThickness: 2,
            showShoulderLine: true,
            showFullWidthZone: true,
            fullWidthZoneFill: "#AA8C1526",
            showHalfWidthZone: true,
            halfWidthZoneFill: "#A55E0B33"
        }),
        new PitchfanAnnotation({
            points: [
                { x: 4, y: 3 },
                { x: 6, y: 5 },
                { x: 7, y: 2 }
            ],
            isEditable: true,
            isSelected: true,
            stroke: "#38BDF8",
            strokeThickness: 2,
            showShoulderLine: true, // set to `false` to hide the line joining the 2 shoulder points
            showHalfWidthZone: false,
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
