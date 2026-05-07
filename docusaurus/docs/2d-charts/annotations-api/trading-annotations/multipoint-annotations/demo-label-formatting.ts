import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        EVerticalTextPosition,
        NumberRange,
        NumericAxis,
        SciChartSurface,
        toEngineering
    } = SciChart; // or import from "scichart"
    const {
        EAnnotationVisibilityMode,
        EAxisLabelDrawMode,
        EMultiPointLabelAnchorMode,
        ESegmentLabelRotationMode,
        PolyLineAnnotation,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 40) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(95, 125) }));

    sciChartSurface.annotations.add(
        new PolyLineAnnotation({
            points: [
                { x: 5, y: 101 },
                { x: 14, y: 117 },
                { x: 26, y: 108 },
                { x: 35, y: 121 }
            ],
            stroke: "#3388FF",
            strokeThickness: 3,
            isEditable: true,
            isSelected: true,
            labels: [
                { id: "entry", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 0, text: "Entry" },
                { id: "breakout", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 1, text: "Breakout" },
                {
                    id: "leg-1",
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentStartIndex: 0,
                    segmentEndIndex: 1,
                    segmentRatio: 0.5,
                    segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
                    verticalTextPosition: EVerticalTextPosition.Above
                },
                {
                    id: "leg-2",
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentStartIndex: 1,
                    segmentEndIndex: 2,
                    segmentRatio: 0.5,
                    verticalTextPosition: EVerticalTextPosition.Below
                },
                {
                    id: "last-price",
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    pointIndex: 3,
                    axisLabelDrawMode: EAxisLabelDrawMode.Y
                }
            ],
            pointLabelVisibility: EAnnotationVisibilityMode.Always,
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            axisLabelVisibility: EAnnotationVisibilityMode.Always,

            formatLabel: ({ label, anchorMode, anchorValuePoint, valuePoints, defaultText }) => {
                if (anchorMode === EMultiPointLabelAnchorMode.Point) {
                    const value = toEngineering(anchorValuePoint.y);
                    return defaultText?.trim() ? `${defaultText}\n${value}` : value;
                }

                if (anchorMode === EMultiPointLabelAnchorMode.Segment) {
                    const start = valuePoints[label.segmentStartIndex];
                    const end = valuePoints[label.segmentEndIndex];
                    const delta = end.y - start.y;
                    const percent = (delta / start.y) * 100;
                    return `${label.id}: ${delta >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
                }

                return toEngineering(anchorValuePoint.y);
            },

            formatLabelStyle: ({ label, defaultStyle }) => {
                if (label.anchorMode === EMultiPointLabelAnchorMode.Segment) {
                    return { ...defaultStyle, color: "#475569", fontSize: 12 };
                }
                if (label.anchorMode === EMultiPointLabelAnchorMode.Axis) {
                    return { ...defaultStyle, color: "#FFFFFF", fontSize: 13 };
                }
                return { ...defaultStyle, color: "#111827", fontSize: label.id === "breakout" ? 16 : 13 };
            },

            gripVisibility: EAnnotationVisibilityMode.Always
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
