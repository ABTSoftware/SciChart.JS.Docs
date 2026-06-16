import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface, toEngineering, EVerticalTextPosition } = SciChart; // or import from "scichart"
    const { ChannelAnnotation, EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, ExtendedLineAnnotation, FlatBottomChannelAnnotation, SciTraderLightTheme, StopLossTakeProfitAnnotation, ESegmentLabelRotationMode } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 50) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(20, 90) }));
    const trendLabelStyle = ({ annotation, label, defaultStyle }) => {
        const [p1, p2] = annotation.points;
        const isRising = p2.y >= p1.y;
        if (annotation instanceof StopLossTakeProfitAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Segment) {
            return { ...defaultStyle, color: isRising ? annotation.takeProfitColor : annotation.stopLossColor, fontSize: 16 };
        }
        if (annotation instanceof ExtendedLineAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Point) {
            return { ...defaultStyle, color: isRising ? "#111827" : "#DC2626", fontSize: 14 };
        }
        if (annotation instanceof ChannelAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Point) {
            const [, , , p4] = annotation.points;
            if (label.id.includes("1")) {
                return {
                    ...defaultStyle,
                    fontSize: p4.y <= p1.y ? 13 : 0,
                };
            }
            if (label.id.includes("4")) {
                return {
                    ...defaultStyle,
                    fontSize: p4.y <= p1.y ? 0 : 13,
                };
            }
        }
        return defaultStyle;
    };
    const priceLabel = ({ label, anchorValuePoint, defaultText }) => {
        const value = toEngineering(anchorValuePoint.y);
        return defaultText?.trim() ? `${defaultText}: ${value}` : `${label.id} ${value}`;
    };
    sciChartSurface.annotations.add(new StopLossTakeProfitAnnotation({
        points: [
            { x: 5, y: 32 },
            { x: 21, y: 48 }
        ],
        takeProfitColor: "#16A34A",
        stopLossColor: "#DC2626",
        annotationsGripsStroke: "#111",
        fillOpacity: 0.18,
        strokeThickness: 2,
        isEditable: true,
        labels: [
            {
                id: "entry",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Below,
                pointIndex: 0,
                text: "Entry"
            },
            {
                id: "target",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 1,
                text: "Target"
            },
            {
                id: "trade-zone",
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                segmentLabelRotationMode: ESegmentLabelRotationMode.Horizontal,
                segmentStartIndex: 0,
                segmentEndIndex: 1,
                segmentRatio: 0.5,
                text: "Risk / reward"
            }
        ],
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        segmentLabelVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always,
        formatLabel: priceLabel,
        formatLabelStyle: trendLabelStyle
    }), new ExtendedLineAnnotation({
        points: [
            { x: 28, y: 36 },
            { x: 43, y: 52 }
        ],
        extendEnd: true,
        stroke: "#F59E0B",
        isEditable: true,
        labels: [
            {
                id: "trend-start",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 0,
                text: "Start"
            },
            {
                id: "trend-end",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 1,
                text: "Break"
            }
        ],
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always,
        formatLabel: priceLabel,
        formatLabelStyle: trendLabelStyle
    }), new FlatBottomChannelAnnotation({
        points: [
            { x: 10, y: 74 },
            { x: 42, y: 83 },
            { x: 10, y: 66 }
        ],
        stroke: "#22A3BE",
        fill: "#22A3BE22",
        strokeThickness: 2,
        showMidLine: true,
        isEditable: true,
        labels: [
            {
                id: "channel-pt-1",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 0,
                text: "Sticky Label"
            },
            {
                id: "channel-pt-4",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                verticalTextPosition: EVerticalTextPosition.Above,
                pointIndex: 3,
                text: "Sticky Label"
            }
        ],
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always,
        formatLabel: priceLabel,
        formatLabelStyle: trendLabelStyle
    }));
    // #region_A_end
    sciChartSurface.annotations.add(new SciChart.NativeTextAnnotation({
        text: "Try dragging the \"Sticky Label\" below the FlatChannel's base.",
        x1: 10,
        y1: 88,
        textColor: "#555",
        fontSize: 14,
        verticalAnchorPoint: SciChart.EVerticalAnchorPoint.Top,
    }), new SciChart.NativeTextAnnotation({
        text: "Try angling the line downwards to see a change!",
        x1: 28,
        y1: 30,
        textColor: "#555",
        fontSize: 14,
        verticalAnchorPoint: SciChart.EVerticalAnchorPoint.Top,
    }), new SciChart.NativeTextAnnotation({
        text: "Observe the center segment label changes color\nwith the stoploss/takeprofit annotation!",
        x1: 3,
        y1: 56,
        textColor: "#555",
        fontSize: 14,
        verticalAnchorPoint: SciChart.EVerticalAnchorPoint.Top,
    }));
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair,
    }));
}
drawExample("scichart-root");
