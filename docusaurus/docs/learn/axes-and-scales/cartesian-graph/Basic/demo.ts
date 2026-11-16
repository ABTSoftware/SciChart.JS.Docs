import * as SciChart from "scichart";

// Four example points, one in each quadrant. Drag them to read new coordinates.
function getPoints() {
    return [
        { name: "A", x: 3, y: 4 },
        { name: "B", x: -5, y: 2 },
        { name: "C", x: -4, y: -3 },
        { name: "D", x: 6, y: -5 }
    ];
}

// Writes a number the way it is written in maths: a true minus sign for negatives
function formatCoordinate(value) {
    const rounded = Math.round(value);
    return rounded < 0 ? "−" + Math.abs(rounded) : String(rounded);
}

async function cartesianGraph(divElementId) {
    // #region_A_start
    // Create a JavaScript Cartesian graph with SciChart.js: x and y axes that cross at the origin (0, 0),
    // four quadrants, and points you can drag to read their (x, y) coordinates
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        CentralAxesLayoutManager,
        EInnerAxisPlacementCoordinateMode,
        EAxisAlignment,
        CustomAnnotation,
        NativeTextAnnotation,
        TextAnnotation,
        LineAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Put the axes inside the chart, crossing at the data value (0, 0): the origin.
    // They move with the data when you zoom or pan.
    sciChartSurface.layoutManager = new CentralAxesLayoutManager({
        horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
        verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
        horizontalAxisPosition: 0,
        verticalAxisPosition: 0
    });

    const axisOptions = {
        isInnerAxis: true, // needed for axes placed inside the chart
        drawMajorBands: false,
        labelPrecision: 0,
        autoTicks: false, // we set the gridline step ourselves (below), the same on both axes
        majorGridLineStyle: { color: "#50C7E040", strokeThickness: 1 },
        minorGridLineStyle: { color: "#50C7E01A", strokeThickness: 1 },
        labelStyle: { fontSize: 13, color: "#C8D6E5" }
    };
    // The same scale on both axes (1 unit is the same length across and up), so shapes and slopes aren't distorted
    const xAxis = new NumericAxis(wasmContext, {
        ...axisOptions,
        axisAlignment: EAxisAlignment.Bottom,
        visibleRange: new NumberRange(-12, 12),
        axisBorder: { borderBottom: 2, color: "#FFFFFF" } // the line along y = 0
    });
    const yAxis = new NumericAxis(wasmContext, {
        ...axisOptions,
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(-8, 8),
        axisBorder: { borderLeft: 2, color: "#FFFFFF" } // the line along x = 0
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Gridlines at a round step (1, 2, 5, 10, 20 ...) that gives about 12 lines across, the same step on both axes.
    // Minor gridlines split each step into whole units where they can.
    const setGridStep = () => {
        const rough = xAxis.visibleRange.diff / 12;
        const power = Math.pow(10, Math.floor(Math.log10(rough)));
        const step = [1, 2, 5, 10].map((n) => n * power).find((n) => n >= rough);
        const minor = step / (step / power === 5 ? 5 : 2);
        for (const axis of [xAxis, yAxis]) {
            axis.majorDelta = step;
            axis.minorDelta = minor;
            axis.labelProvider.precision = step < 1 ? 1 : 0;
        }
    };
    setGridStep();
    xAxis.visibleRangeChanged.subscribe(setGridStep);

    // Label the four quadrants, numbered anticlockwise from the top right, with the signs of x and y in each
    const quadrants = [
        { text: "I  (+, +)", x: 8, y: 6 },
        { text: "II  (−, +)", x: -8, y: 6 },
        { text: "III  (−, −)", x: -8, y: -6 },
        { text: "IV  (+, −)", x: 8, y: -6 }
    ];
    for (const quadrant of quadrants) {
        sciChartSurface.annotations.add(
            new NativeTextAnnotation({
                text: quadrant.text,
                x1: quadrant.x,
                y1: quadrant.y,
                fontSize: 22,
                textColor: "#FFFFFF66",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        );
    }
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Origin (0, 0)",
            x1: 0,
            y1: 0,
            xCoordShift: -8,
            yCoordShift: 8,
            fontSize: 14,
            textColor: "#FFFFFF",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Top
        })
    );

    // Each point: a draggable dot, a label with its coordinates, and dashed guides down (or up) to the x-axis
    // and across to the y-axis, which is how you read a point's x and y values
    for (const point of getPoints()) {
        const guideOptions = { stroke: "#F48420", strokeThickness: 2, strokeDashArray: [5, 4] };
        const toXAxis = new LineAnnotation({ ...guideOptions, x1: point.x, y1: point.y, x2: point.x, y2: 0 });
        const toYAxis = new LineAnnotation({ ...guideOptions, x1: point.x, y1: point.y, x2: 0, y2: point.y });
        const label = new TextAnnotation({
            fontSize: 18,
            textColor: "#FFFFFF",
            xCoordShift: 12,
            yCoordShift: -12,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom
        });
        const dot = new CustomAnnotation({
            x1: point.x,
            y1: point.y,
            isEditable: true, // drag it with the mouse or a finger
            // No selection box or grips: the dot itself is the handle
            selectionBoxStroke: "transparent",
            annotationsGripsFill: "transparent",
            annotationsGripsStroke: "transparent",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            svgString:
                '<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg">' +
                '<circle cx="11" cy="11" r="8" fill="#50C7E0" stroke="#FFFFFF" stroke-width="2"/></svg>'
        });

        // Move the guides and the label to wherever the dot is
        const update = (x, y) => {
            toXAxis.x1 = x;
            toXAxis.y1 = y;
            toXAxis.x2 = x;
            toYAxis.x1 = x;
            toYAxis.y1 = y;
            toYAxis.y2 = y;
            label.x1 = x;
            label.y1 = y;
            label.text = `${point.name} (${formatCoordinate(x)}, ${formatCoordinate(y)})`;
        };
        update(point.x, point.y);
        dot.dragDelta.subscribe(() => update(dot.x1, dot.y1));
        // When you let go, snap the point to the nearest whole-number coordinates
        dot.dragEnded.subscribe(() => {
            dot.x1 = Math.round(dot.x1);
            dot.y1 = Math.round(dot.y1);
            update(dot.x1, dot.y1);
        });

        sciChartSurface.annotations.add(toXAxis, toYAxis, label, dot);
    }

    // Hover to read the coordinates of any spot on the plane; scroll to zoom, drag the background to pan,
    // double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: false, showAxisLabels: true, crosshairStroke: "#FFFFFF55", axisLabelFill: "#50C7E0" }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        // A plane has no data range to fit, so double-click goes back to the starting view
        new ZoomExtentsModifier({
            onZoomExtents: () => {
                xAxis.animateVisibleRange(new NumberRange(-12, 12), 400);
                yAxis.animateVisibleRange(new NumberRange(-8, 8), 400);
                return false;
            }
        })
    );
    // #region_A_end
}

cartesianGraph("scichart-root");
