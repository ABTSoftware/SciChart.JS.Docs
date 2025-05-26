import * as SciChart from "scichart";

// #region_A_start
const {
    SciChartSurface,
    LineArrowAnnotation,
    NumericAxis,
    EArrowHeadPosition,
    EDraggingGripPoint,
    MouseWheelZoomModifier,
} = SciChart;
// or for npm import { SciChartSurface, ... } from "scichart"

async function drawExample(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: { type: "Navy" }
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const arrow1 = new LineArrowAnnotation({
        x1: 1,
        x2: 5,
        y1: 1,
        y2: 8,
        isArrowHeadScalable: true, // the arrow head will scale with the visibleRange
        arrowStyle: {
            headLength: 40,
            headWidth: 45,
            headDepth: 0.8,
            fill: "#113388",
            stroke: "#3399FF",
            strokeThickness: 3
        },
        stroke: "#3399FF",
        strokeThickness: 3,
        isEditable: true,
        isSelected: true,
        arrowHeadPosition: EArrowHeadPosition.End, // only show arrow head at the end
        dragPoints: [ EDraggingGripPoint.x2y2 ], // only allow dragging by the end point
    });

    const arrow2 = new LineArrowAnnotation({
        x1: 3,
        x2: 7,
        y1: 1,
        y2: 8,
        arrowStyle: {
            headLength: 25,
            headWidth: 25,
            headDepth: 1,
            fill: "#883300",
            stroke: "#FF6600",
            strokeThickness: 3
        },
        stroke: "#FF6600",
        strokeThickness: 3,
        arrowHeadPosition: EArrowHeadPosition.StartEnd, // show arrow heads on both ends
        isEditable: true,
        dragPoints: [
            EDraggingGripPoint.x1y1, 
            EDraggingGripPoint.x2y2
        ], // allow dragging by both end points
    });

    const arrow3 = new LineArrowAnnotation({
        stroke: "#FF0077",
        strokeThickness: 3,
        x1: 5,
        x2: 9,
        y1: 1,
        y2: 8,
        strokeDashArray: [5, 5], // dashed line
        arrowStyle: {
            headLength: 20,
            headWidth: 25,
            headDepth: 2,
            fill: "#880044",
            stroke: "#FF0077",
            strokeThickness: 3
        },
        onArrowHeadSizeChanged: (args) => {
            console.log("ArrowHead args: ", args);
            
            return {
                headLength: args.headLength, // unchanged
                headDepth: args.headDepth, // unchanged
                headWidth: Math.cos(args.x1 * 0.1) * args.headWidth + 10 // Silly example
            };
        }
    })

    // append the annotations to the surface
    sciChartSurface.annotations.add(arrow1, arrow2, arrow3);

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(), // add zoom to see scalable arrow option behaviour
    )
}

drawExample("scichart-root");
    // #region_A_end

async function builderExample(divElementId) {
    // #region_B_start
    const { chartBuilder, EAnnotationType } = SciChart;
    // or for npm import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: { type: "Navy" },
        },
        annotations: [
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "regular_editable",
                    stroke: "#3399FF",
                    strokeThickness: 3,
                    x1: 1, 
                    y1: 1, // start point (1, 1)
                    x2: 6,
                    y2: 8, // end point (6, 8)

                    arrowHeadPosition: EArrowHeadPosition.End, // only show arrow head at the end
                    isArrowHeadScalable: true,

                    isEditable: true,
                    dragPoints: [EDraggingGripPoint.x2y2], // only allow drag editing by the end point
                    
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 0.7,
                        fill: "#113388",
                        stroke: "#3399FF",
                        strokeThickness: 3
                    }
                }
            },
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "double_ended",
                    stroke: "#FF6600",
                    strokeThickness: 3,
                    x1: 2,
                    x2: 7,
                    y1: 1,
                    y2: 8,
                    arrowHeadPosition: EArrowHeadPosition.StartEnd, // show arrow heads on both ends
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 1,
                        fill: "#883300",
                        stroke: "#FF6600",
                        strokeThickness: 3
                    }
                }
            },
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "reverse_arrow",
                    stroke: "#66FF00",
                    strokeThickness: 3,
                    x1: 3,
                    x2: 8,
                    y1: 1,
                    y2: 8,
                    arrowHeadPosition: EArrowHeadPosition.Start,
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 0,
                        stroke: "#66FF00",
                        strokeThickness: 3
                    }
                }
            },
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "double_ended_dashed_rhombus",
                    stroke: "#FF0077",
                    strokeThickness: 3,
                    x1: 4,
                    x2: 9,
                    y1: 1,
                    y2: 8,
                    strokeDashArray: [5, 5],
                    arrowHeadPosition: EArrowHeadPosition.StartEnd, // show arrow heads on both ends
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 3,
                        fill: "#880044",
                        stroke: "#FF0077",
                        strokeThickness: 3
                    }
                }
            }
        ],
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
