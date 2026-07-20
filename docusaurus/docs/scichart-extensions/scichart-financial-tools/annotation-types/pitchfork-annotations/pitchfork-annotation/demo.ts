import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId: string) {
    const { SciChartSurface, NumericAxis, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { PitchforkAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region_A_start
    sciChartSurface.annotations.add(
        new PitchforkAnnotation({
            points: [
                { x: 1, y: 2 },
                { x: 3, y: 6 },
                { x: 4, y: 4 }
            ],
            isEditable: true,
            stroke: "#60A5FA",
            strokeThickness: 2,
            showFullWidthZone: true,
            fullWidthZoneFill: "#60A5FA22",
            showHalfWidthZone: true,
            halfWidthZoneFill: "#22C55E33"
        }),
        new PitchforkAnnotation({
            points: [
                { x: 5, y: 3 },
                { x: 6, y: 5 },
                { x: 7, y: 2 }
            ],
            isEditable: true,
            isSelected: true,
            stroke: "#F97316",
            strokeThickness: 2,
            showFullWidthZone: true,
            fullWidthZoneFill:  "#F9731622",
            showHalfWidthZone: false,
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
