import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, EVerticalTextPosition, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, PolyLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 70) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(90, 140) }));
    sciChartSurface.annotations.add(new PolyLineAnnotation({
        points: [
            { x: 6, y: 98 },
            { x: 18, y: 118 },
            { x: 28, y: 108 },
            { x: 42, y: 132 },
            { x: 52, y: 114 },
            { x: 64, y: 136 }
        ],
        stroke: "#7C3AED",
        strokeThickness: 3,
        // fill: "#7C3AED22", // no need for "fill"
        isEditable: true,
        // Loop over an array of labels and assign each to a point index:
        labels: ["0", "1", "2", "3", "4", "5"].map((text, pointIndex) => ({
            anchorMode: EMultiPointLabelAnchorMode.Point,
            pointIndex,
            text: `${text}`,
            // all labels not changed in the "formatLabelStyle" will have this "below" style
            verticalTextPosition: EVerticalTextPosition.Below,
            yOffset: 5,
        })),
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always,
        // optional but recommended -> Makes the label positions dynamic based on the slope of the lines between points:
        formatLabelStyle: ({ annotation, labelIndex }) => {
            const points = annotation.points;
            const currentPoint = points[labelIndex];
            const previousPoint = points[labelIndex - 1];
            const nextPoint = points[labelIndex + 1];
            if (previousPoint && nextPoint) {
                const previousSlope = (currentPoint.y - previousPoint.y) / (currentPoint.x - previousPoint.x);
                const nextSlope = (nextPoint.y - currentPoint.y) / (nextPoint.x - currentPoint.x);
                if (previousSlope > nextSlope) {
                    return {
                        verticalTextPosition: EVerticalTextPosition.Above,
                        yOffset: -5,
                    };
                }
            }
            else {
                if (labelIndex === 0 && nextPoint.y < currentPoint.y
                    || previousPoint.y < currentPoint.y) {
                    return {
                        verticalTextPosition: EVerticalTextPosition.Above,
                        yOffset: -5,
                    };
                }
            }
            return {}; // keep using the "Below" style defined in constructor
        },
    }));
    sciChartSurface.chartModifiers.add(new AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: ECursorStyle.Crosshair
    }));
    // #region_A_end
}
drawExample("scichart-root");
