import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        AnnotationHoverModifier,
        ECursorStyle,
        EVerticalTextPosition,
        NumberRange,
        NumericAxis,
        SciChartSurface
    } = SciChart; // or import from "scichart"
    const {
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode, EAxisLabelDrawMode,
        PolyLineAnnotation,
        SciTraderLightTheme,
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 40) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(95, 125) }));

    sciChartSurface.annotations.add(
        new PolyLineAnnotation({
            // The ordered points array is the geometry. Each point becomes an editable vertex.
            points: [
                { x: 5, y: 103 },
                { x: 18, y: 116 },
                { x: 27, y: 105 },
                { x: 34, y: 112 }
            ],
            stroke: "#3388FF",
            strokeThickness: 3,
            // Optional fill closes the path and draws a polygon through the same points.
            fill: "#3388FF22",
            isEditable: true,
            labels: [
                // Point labels stay attached to a specific point index while the shape is edited.
                {
                    anchorMode: EMultiPointLabelAnchorMode.Point,
                    pointIndex: 0,
                    verticalTextPosition: EVerticalTextPosition.Below,
                    text: "Start"
                },
                {
                    anchorMode: EMultiPointLabelAnchorMode.Point,
                    pointIndex: 3,
                    verticalTextPosition: EVerticalTextPosition.Above,
                    text: "End"
                },
                // Segment labels are useful for naming a line section between two vertices.
                {
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    segmentStartIndex: 1,
                    segmentEndIndex: 2,
                    segmentRatio: 0.5,
                    verticalTextPosition: EVerticalTextPosition.Above,
                    text: "Pullback"
                },
                // Axis labels to first and last points (these will only show on hover/selection in this example because of "axisLabelVisibility on line 74")
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    axisLabelDrawMode: EAxisLabelDrawMode.Both,
                    pointIndex: 0,
                },
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    axisLabelDrawMode: EAxisLabelDrawMode.Both,
                    pointIndex: 3,
                }
            ],
            pointLabelVisibility: EAnnotationVisibilityMode.Always,
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction, // will show on select/hover
            gripVisibility: EAnnotationVisibilityMode.Always,
            axisLabelStroke: "#FFF",
        })
    );

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({ // not needed, but makes the annotation Grips hover/drag Cursor style match actions
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
