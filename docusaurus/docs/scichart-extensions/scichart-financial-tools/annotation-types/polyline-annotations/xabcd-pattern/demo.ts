import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId: string) {
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
        EMultiPointLabelAnchorMode,
        PolyLineAnnotation,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 60) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(90, 130) }));

    sciChartSurface.annotations.add(
        new PolyLineAnnotation({
            points: [
                { x: 6, y: 96 },
                { x: 18, y: 124 },
                { x: 30, y: 106 },
                { x: 42, y: 119 },
                { x: 54, y: 99 }
            ],
            stroke: "#fF766E",
            fill: "#0F766E15",
            strokeThickness: 3,

            // Loop over an array of labels and assign each to a point index:
            labels: ["(X)", "(A)", "(B)", "(C)", "(D)"].map((text, pointIndex) => ({
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex,
                verticalTextPosition: EVerticalTextPosition.Below,
                yOffset: 3, // all labels not changed in the "formatLabelStyle" will have this "below" style
                text,
            })),

            isEditable: true,
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
                            yOffset: -3 
                        };
                    }
                } else {
                    if (labelIndex === 0 && nextPoint.y < currentPoint.y
                        || previousPoint.y < currentPoint.y
                    ) {
                        return { 
                            verticalTextPosition: EVerticalTextPosition.Above, 
                            yOffset: -3 
                        };
                    } 
                }
                return {}; // keep using the "Below" style defined in constructor
            },
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add( // optional - for better control of cursor styles
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
}

drawExample("scichart-root");
