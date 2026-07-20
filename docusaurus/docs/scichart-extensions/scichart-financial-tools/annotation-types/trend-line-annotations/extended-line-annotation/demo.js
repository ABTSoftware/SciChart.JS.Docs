import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, EVerticalTextPosition } = SciChart;
    const { ExtendedLineAnnotation, EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    sciChartSurface.annotations.add(new ExtendedLineAnnotation({
        isEditable: true,
        points: [
            { x: 2, y: 2 },
            { x: 4, y: 3 }
        ],
        extendStart: false,
        extendEnd: true,
        stroke: "#F83",
        strokeThickness: 2,
        labels: [
            {
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                verticalTextPosition: EVerticalTextPosition.Above,
                segmentStartIndex: 0,
                segmentEndIndex: 1,
                text: "Trend"
            },
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 0,
                text: "P1"
            },
            {
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 1,
                text: "P2"
            }
        ],
        gripVisibility: EAnnotationVisibilityMode.Always
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair,
    }));
}
drawExample("scichart-root");
