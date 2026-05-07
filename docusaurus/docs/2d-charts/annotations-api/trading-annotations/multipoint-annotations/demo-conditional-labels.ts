import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        NumberRange,
        NumericAxis,
        SciChartSurface,
        toEngineering
    } = SciChart; // or import from "scichart"
    const {
        ChannelAnnotation,
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode,
        ExtendedLineAnnotation,
        SciTraderLightTheme,
        StopLossTakeProfitAnnotation
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 50) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(20, 90) }));

    const trendLabelStyle = ({ annotation, label, defaultStyle }) => {
        const [p1, p2, p3] = annotation.points;
        const isRising = p2.y >= p1.y;

        if (annotation instanceof StopLossTakeProfitAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Segment) {
            return { ...defaultStyle, color: isRising ? annotation.takeProfitColor : annotation.stopLossColor, fontSize: 18 };
        }

        if (annotation instanceof ExtendedLineAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Point) {
            return { ...defaultStyle, color: isRising ? "#111827" : "#DC2626", fontSize: 14 };
        }

        if (annotation instanceof ChannelAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Point) {
            const offsetAbove = p3.y >= p1.y;
            if (label.id === "channel-upper") return { ...defaultStyle, fontSize: offsetAbove ? 13 : 0 };
            if (label.id === "channel-lower") return { ...defaultStyle, fontSize: offsetAbove ? 0 : 13 };
        }

        return defaultStyle;
    };

    const priceLabel = ({ label, anchorValuePoint, defaultText }) => {
        const value = toEngineering(anchorValuePoint.y);
        return defaultText?.trim() ? `${defaultText}: ${value}` : `${label.id} ${value}`;
    };

    sciChartSurface.annotations.add(
        new StopLossTakeProfitAnnotation({
            points: [{ x: 5, y: 42 }, { x: 21, y: 58 }],
            takeProfitColor: "#16A34A",
            stopLossColor: "#DC2626",
            fillOpacity: 0.18,
            strokeThickness: 2,
            isEditable: true,
            labels: [
                { id: "entry", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 0, text: "Entry" },
                { id: "target", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 1, text: "Target" },
                {
                    id: "trade-zone",
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentStartIndex: 0,
                    segmentEndIndex: 1,
                    segmentRatio: 0.5,
                    text: "Risk / reward"
                }
            ],
            pointLabelVisibility: EAnnotationVisibilityMode.Always,
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            formatLabel: priceLabel,
            formatLabelStyle: trendLabelStyle
        }),
        new ExtendedLineAnnotation({
            points: [{ x: 26, y: 36 }, { x: 43, y: 52 }],
            extendEnd: true,
            stroke: "#F59E0B",
            isEditable: true,
            labels: [
                { id: "trend-start", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 0, text: "Start" },
                { id: "trend-end", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 1, text: "Break" }
            ],
            pointLabelVisibility: EAnnotationVisibilityMode.Always,
            formatLabel: priceLabel,
            formatLabelStyle: trendLabelStyle
        }),
        new ChannelAnnotation({
            points: [{ x: 8, y: 70 }, { x: 38, y: 78 }, { x: 38, y: 61 }],
            stroke: "#3388FF",
            fill: "#3388FF22",
            isEditable: true,
            labels: [
                { id: "channel-upper", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 1, text: "Upper" },
                { id: "channel-lower", anchorMode: EMultiPointLabelAnchorMode.Point, pointIndex: 2, text: "Lower" }
            ],
            pointLabelVisibility: EAnnotationVisibilityMode.Always,
            formatLabel: priceLabel,
            formatLabelStyle: trendLabelStyle
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
