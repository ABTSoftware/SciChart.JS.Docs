import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle, EAxisLabelDrawMode } = SciChart;
    const {
        VerticalTrendLineAnnotation,
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode,
        SciTraderLightTheme
    } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));

    // #region_A_start
    sciChartSurface.annotations.add(
        new VerticalTrendLineAnnotation({
            isEditable: true,
            points: [{ x: 8, y: 5 }],
            stroke: "#A78BFA",
            strokeThickness: 3,
            extendStart: true,
            extendEnd: true,
            labels: [
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    axisLabelDrawMode: EAxisLabelDrawMode.X,
                    pointIndex: 0,
                    text: "Event"
                }
            ],
            axisLabelStroke: "#FFF",
            gripVisibility: EAnnotationVisibilityMode.Always
        }),
        new VerticalTrendLineAnnotation({
            isEditable: true,
            points: [{ x: 12, y: 11 }],
            stroke: "#22C55E",
            strokeThickness: 2,
            strokeDashArray: [16, 4],
            extendStart: false,
            extendEnd: true
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
