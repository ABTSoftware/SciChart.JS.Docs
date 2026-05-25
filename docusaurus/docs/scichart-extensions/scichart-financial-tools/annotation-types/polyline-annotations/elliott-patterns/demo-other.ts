import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
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
    
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 70) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(90, 210) }));
    
    // #region_A_start
    sciChartSurface.annotations.add(
        new PolyLineAnnotation({
            points: [
                { x: 6, y: 148 },
                { x: 18, y: 178 },
                { x: 28, y: 164 },
                { x: 42, y: 192 },
                { x: 52, y: 159 },
                { x: 64, y: 196 }
            ],
            stroke: "#38F",
            strokeThickness: 2,
            fill: "#38F2",
            isEditable: true,
            
            // Loop over an array of labels and assign each to a point index:
            labels: ["", "A", "B", "C", "D", "E"].map((text, pointIndex) => ({
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex,
                text: `${text}`,

                // cheap trick to alternate label positions above and below points:
                verticalTextPosition: pointIndex % 2 === 0 ? EVerticalTextPosition.Below : EVerticalTextPosition.Above,
                // for a smarter solution, see the "formatLabelStyle" callback from the first annotation example on this page
            })),
        }),
        new PolyLineAnnotation({
            points: [
                { x: 6, y: 108 },
                { x: 18, y: 128 },
                { x: 28, y: 118 },
                { x: 42, y: 142 },
                { x: 52, y: 109 },
                { x: 64, y: 146 }
            ],
            stroke: "#F83",
            strokeThickness: 2,
            // fill: "#F832",
            isEditable: true,
            
            // Loop over an array of labels and assign each to a point index:
            labels: ["(0)", "(W)", "(X)", "(Y)", "(X)", "(Z)"].map((text, pointIndex) => ({
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex,
                text: `${text}`,
                
                // cheap trick to alternate label positions above and below points:
                verticalTextPosition: pointIndex % 2 === 0 ? EVerticalTextPosition.Below : EVerticalTextPosition.Above,
                // for a smarter solution, see the "formatLabelStyle" callback from the first annotation example on this page
            })),
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
}

drawExample("scichart-root");
