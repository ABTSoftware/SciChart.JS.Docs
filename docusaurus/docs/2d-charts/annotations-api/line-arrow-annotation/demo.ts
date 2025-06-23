import * as SciChart from "scichart";
// or for npm import { SciChartSurface, ... } from "scichart"

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
        // theme: new SciChartJsNavyTheme(),
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const arrow1 = new LineArrowAnnotation({
        x1: 1,
        x2: 6,
        y1: 2,
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
        y1: 2,
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

    const { 
        MouseWheelZoomModifier, 
        ZoomExtentsModifier, 
        ZoomPanModifier, 
        NativeTextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ECoordinateMode,
        NumberRange
    } = SciChart;

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            text: "Zoom in and out to see\nthe arrowhead scaling in action",
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            x1: 5,
            y1: 1,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 22,
            lineSpacing: 10,
            textColor: "gray",
            drawImmediate: true,
            renderOrder: 1
        }),
    )
    
    // need to fix the visible range since annotations alone do not set the visible range depending on their x and y range
    sciChartSurface.xAxes.get(0).zoomExtentsRange = new NumberRange(0, 10);
    sciChartSurface.yAxes.get(0).zoomExtentsRange = new NumberRange(0, 10); 

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
                type: EAnnotationType.RenderContextLineArrowAnnotation,
                options: {
                    stroke: "#3399FF",
                    strokeThickness: 3,
                    x1: 1,
                    y1: 2, // start point (1, 2)
                    x2: 6,
                    y2: 9, // end point (6, 9)

                    arrowHeadPosition: EArrowHeadPosition.End, // show arrow head at the end
                    isArrowHeadScalable: true, // the arrow head will scale with the visibleRange

                    isEditable: true,
                    dragPoints: [ EDraggingGripPoint.x2y2 ], // allow drag editing by the end point

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
            {
                type: EAnnotationType.RenderContextLineArrowAnnotation,
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 3,
                    x1: 4,
                    y1: 1, // start point (4, 1)
                    x2: 9,
                    y2: 8, // end point (9, 8)

                    arrowHeadPosition: EArrowHeadPosition.StartEnd, // show arrow heads on both ends
                    isArrowHeadScalable: false,

                    isEditable: true,
                    dragPoints: [
                        EDraggingGripPoint.x1y1,
                        EDraggingGripPoint.x2y2
                    ], // allow drag editing by both end points

                    arrowStyle: {
                        headLength: 40,
                        headWidth: 45,
                        headDepth: 0.8,
                        fill: "#883300",
                        stroke: "#FF6600",
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
