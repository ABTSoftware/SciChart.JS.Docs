import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        NumberRange,
        NumericAxis,
        SciChartSurface,
        EVerticalTextPosition
    } = SciChart; // or import from "scichart"
    const {
        FlatBottomChannelAnnotation,
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 50) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(20, 90) }));
    
    sciChartSurface.annotations.add(
        new FlatBottomChannelAnnotation({
            // First two points define one channel edge; the third point defines the offset.
            points: [
                { x: 8, y: 60 },
                { x: 42, y: 80 },
                { x: 42, y: 50 },
            ],
            stroke: "#3388FF",
            fill: "#3388FF33",
            showMidLine: true,
            showMidPointGrips: true,
            isEditable: true,
            isSelected: true,
            labels: [
                // Segment labels can name each edge independently.
                {
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    verticalTextPosition: EVerticalTextPosition.Above,
                    segmentStartIndex: 0,
                    segmentEndIndex: 1,
                    segmentRatio: 0.5,
                    text: "Resistance"
                },
                {
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    verticalTextPosition: EVerticalTextPosition.Below,
                    segmentStartIndex: 2,
                    segmentEndIndex: 3,
                    segmentRatio: 0.5,
                    text: "Support"
                }
            ],
            segmentLabelVisibility: EAnnotationVisibilityMode.Always
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new SciChart.AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: SciChart.ECursorStyle.Crosshair,
        })
    );
}

drawExample("scichart-root");
