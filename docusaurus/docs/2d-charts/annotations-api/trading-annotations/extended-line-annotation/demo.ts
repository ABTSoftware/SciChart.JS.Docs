import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        EVerticalTextPosition,
        AnnotationHoverModifier,
        ECursorStyle
    } = SciChart; // or import from "scichart"
    const {
        EAnnotationVisibilityMode,
        EMultiPointLabelAnchorMode,
        ExtendedLineAnnotation,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region_A_start
    sciChartSurface.annotations.add(
        new ExtendedLineAnnotation({
            // Two points define the trend. 
            points: [
                { x: 3, y: 3 },
                { x: 7, y: 7 }
            ],
            // The extension flags decide whether it is a finite segment, a ray or an infinite line.
            extendStart: false,
            extendEnd: true,
            stroke: "#F83",
            strokeThickness: 2,
            labels: [
                // Segment labels follow the projected trend line as points move.
                {
                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    verticalTextPosition: EVerticalTextPosition.Above,
                    segmentStartIndex: 0,
                    segmentEndIndex: 1,
                    text: "Trend",
                },
                // Point labels are fixed to the annotation points and move with them.
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
                },
                // Axis labels show the current value of the annotation points on each axis.
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    pointIndex: 0,
                },
                {
                    anchorMode: EMultiPointLabelAnchorMode.Axis,
                    pointIndex: 1,
                }
            ],
            isEditable: true,
            isSelected: true,
            // to always show the grip points, not just when the annotation is selected
            gripVisibility: EAnnotationVisibilityMode.Always, 
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
