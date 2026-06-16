import * as SciChart from "scichart";
import { IMultiPointLabelFormatParams } from "scichart-financial-tools";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        AnnotationHoverModifier,
        ECursorStyle,
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
                { x: 5, y: 103 },
                { x: 18, y: 116 },
                { x: 27, y: 105 },
                { x: 34, y: 112 }
            ],
            stroke: "#3388FF",
            strokeThickness: 3,
            selectionBoxStroke: "#3388FF55",
            selectionBoxThickness: 10,
            isEditable: true,
            isSelected: true,

            axisLabelStroke: "#FFF",
            axisSpanFillOpacity: 0.2,
            // axisLabelFill defaults to the annotation stroke color when not set.

            labels: [
                // 1. Point labels attach to a single point index.
                {
                    text: "P1",
                    pointIndex: 0,
                    anchorMode: EMultiPointLabelAnchorMode.Point,
                    verticalTextPosition: EVerticalTextPosition.Below
                },
                {
                    text: "P2",
                    pointIndex: 1,
                    anchorMode: EMultiPointLabelAnchorMode.Point,
                    verticalTextPosition: EVerticalTextPosition.Above
                },
                {
                    text: "P4",
                    pointIndex: 3,
                    anchorMode: EMultiPointLabelAnchorMode.Point,
                    verticalTextPosition: EVerticalTextPosition.Above
                },
                // 2. Segment labels interpolate between two point indexes.
                {
                    text: "Segment P1-P2",
                    segmentStartIndex: 0,
                    segmentEndIndex: 1,
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentRatio: 0.5,
                    segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
                    verticalTextPosition: EVerticalTextPosition.Above
                },
                {
                    text: "Segment P3-P4",
                    segmentStartIndex: 2,
                    segmentEndIndex: 3,
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentRatio: 0.5,
                    verticalTextPosition: EVerticalTextPosition.Below
                },
                // 3. Axis labels can draw on the X axis, Y axis or both.
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    pointIndex: 0,
                    axisLabelDrawMode: EAxisLabelDrawMode.X
                },
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    pointIndex: 2,
                    axisLabelDrawMode: EAxisLabelDrawMode.Both
                },
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    pointIndex: 3,
                    axisLabelDrawMode: EAxisLabelDrawMode.Y
                }
            ],
            pointLabelVisibility: EAnnotationVisibilityMode.Always,
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            axisLabelVisibility: EAnnotationVisibilityMode.Always,

            // Style callbacks can tune each resolved label before it is drawn.
            formatLabelStyle: (params) => ({
                fontSize: params.label.anchorMode === EMultiPointLabelAnchorMode.Segment ? 12 : 16,
                color: params.label.anchorMode === EMultiPointLabelAnchorMode.Segment ? "gray" : "black"
            }),

            // Text callbacks can combine the label definition with live anchor values.
            formatLabel: (params: IMultiPointLabelFormatParams): string => {
                if (params.anchorMode === EMultiPointLabelAnchorMode.Point) {
                    return `${params.label.text} - ${toEngineering(params.anchorValuePoint.y)}`;
                }
                return params.label.text ?? "";
            },

            gripVisibility: EAnnotationVisibilityMode.Always,
            adornerVisibility: EAnnotationVisibilityMode.OnInteraction
        })
    );

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({ // To enable nicer cursor styles
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
