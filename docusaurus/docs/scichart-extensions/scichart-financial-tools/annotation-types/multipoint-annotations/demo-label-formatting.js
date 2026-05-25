import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { EVerticalTextPosition, NumberRange, NumericAxis, SciChartSurface, toEngineering } = SciChart; // or import from "scichart"
    const { EAnnotationVisibilityMode, EAxisLabelDrawMode, EMultiPointLabelAnchorMode, ESegmentLabelRotationMode, PolyLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 40) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(1090, 1130) }));
    sciChartSurface.annotations.add(new PolyLineAnnotation({
        points: [
            { x: 5, y: 1101 },
            { x: 16, y: 1120 },
            { x: 24, y: 1108 },
            { x: 31, y: 1117 },
            { x: 35, y: 1109 }
        ],
        stroke: "#FF8833",
        strokeThickness: 3,
        fill: "#FF883333",
        isEditable: true,
        isSelected: true,
        labels: [
            {
                id: "entry",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Below,
                pointIndex: 0,
                yOffset: 10,
                text: "Entry"
            },
            {
                id: "breakout",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 1,
                yOffset: -12,
                text: "Breakout"
            },
            // segment labels
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
            // axis labels:
            {
                id: "first-price",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                pointIndex: 0,
                axisLabelDrawMode: EAxisLabelDrawMode.X
            },
            {
                id: "last-price",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                pointIndex: 4,
                axisLabelDrawMode: EAxisLabelDrawMode.X
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
                // @ts-ignore
                const start = valuePoints[label.segmentStartIndex];
                // @ts-ignore
                const end = valuePoints[label.segmentEndIndex];
                const delta = end.y - start.y;
                const percent = (delta / start.y) * 100;
                return `${label.id}: ${delta >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
            }
            return toEngineering(anchorValuePoint.y);
        },
        formatLabelStyle: ({ label, defaultStyle }) => {
            if (label.anchorMode === EMultiPointLabelAnchorMode.Segment) {
                return { ...defaultStyle, color: "#FF8833", fontSize: 12 };
            }
            if (label.anchorMode === EMultiPointLabelAnchorMode.Point) {
                return { ...defaultStyle, color: "#000000", fontSize: label.id === "breakout" ? 16 : 13 };
            }
            return { ...defaultStyle };
        },
        axisLabelStroke: "#FFFFFF",
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
