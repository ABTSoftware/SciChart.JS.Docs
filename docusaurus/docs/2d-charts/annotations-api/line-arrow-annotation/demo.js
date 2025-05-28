import * as SciChart from "scichart";

// or for npm import { SciChartSurface, ... } from "scichart"

const { MouseWheelZoomModifier, ZoomExtentsModifier, ZoomPanModifier, NativeTextAnnotation } = SciChart;

async function drawExample(divElementId) {
    // #region_A_start
    const {
        SciChartSurface,
        SciChartJsNavyTheme,
        LineArrowAnnotation,
        NumericAxis,
        EArrowHeadPosition,
        EDraggingGripPoint,
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const arrow1 = new LineArrowAnnotation({
        x1: 1,
        x2: 6,
        y1: 1,
        y2: 9,
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
        x1: 4,
        x2: 9,
        y1: 1,
        y2: 9,
        isArrowHeadScalable: false,
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

    // append the annotations to the surface
    sciChartSurface.annotations.add(arrow1, arrow2);
    // #region_A_end

    sciChartSurface.annotations.add(
        new NativeTextAnnotation(wasmContext, {
            text: "Zoom in and out to see the arrow head scaling in action",
            x1: 0.5,
            y1: 0.5,
            fontSize: 20,
            textColor: "#FFFFFF",
            horizontalAnchorPoint: "center",
            verticalAnchorPoint: "center",
        })
    )

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new ZoomPanModifier()
    )
}

drawExample("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    const { 
        chartBuilder, 
        EAnnotationType, 
        EArrowHeadPosition,
        EDraggingGripPoint,
    } = SciChart;
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
                    id: "regular_non_editable",
                    stroke: "#FF6600",
                    strokeThickness: 3,
                    x1: 4, 
                    y1: 1, // start point (4, 1)
                    x2: 9,
                    y2: 8, // end point (9, 8)

                    arrowHeadPosition: EArrowHeadPosition.StartEnd, // show arrow heads on both ends
                    isArrowHeadScalable: false,

                    isEditable: false, // not editable
                    dragPoints: [], // no drag points

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
                    id: "custom_editable",
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
                        headLength: 40,
                        headWidth: 45,
                        headDepth: 0.8,
                        fill: "#113388",
                        stroke: "#3399FF",
                        strokeThickness: 3
                    }
                }
            },
        ],
    });
    // #region_B_end

    return { wasmContext, sciChartSurface };
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
