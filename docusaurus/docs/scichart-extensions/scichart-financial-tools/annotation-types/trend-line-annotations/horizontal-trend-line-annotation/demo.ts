import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const {
        HorizontalTrendLineAnnotation,
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode,
        SciTraderLightTheme
    } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext,));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext,));

    // #region_A_start
    sciChartSurface.annotations.add(
        new HorizontalTrendLineAnnotation({
            isEditable: true,
            points: [{ x: 2, y: 3 }],
            stroke: "#38BDF8",
            strokeThickness: 3,
            extendStart: true,
            extendEnd: true,
            labels: [
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    pointIndex: 0,
                }
            ],
            axisLabelStroke: "#FFF",
            gripVisibility: EAnnotationVisibilityMode.Always
        }),
        new HorizontalTrendLineAnnotation({
            isEditable: true,
            points: [{ x: 6, y: 7 }],
            stroke: "#F97316",
            strokeThickness: 2,
            strokeDashArray: [6, 3],
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
