import * as SciChart from "scichart";
export async function complexArc(divElementId) {
    // Demonstrates how to create a gauge chart using ArcAnnotation & PolarPointerAnnotation using SciChart.js
    const { SciChartPolarSurface, SciChartJsNavyTheme, NumberRange, PolarArcAnnotation, PolarNumericAxis, EPolarAxisMode, PolarPointerAnnotation, ECoordinateMode, TextAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    // The gauge angle
    const gaugeTotalAngle = Math.PI * 1.4;
    const gaugeRange = new NumberRange(0, 100); // the range of the gauge
    // Add the axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: gaugeRange, // 0 - 100
        flippedCoordinates: true, // go clockwise
        totalAngle: gaugeTotalAngle,
        startAngle: (Math.PI - gaugeTotalAngle) / 2, // to center the bottom gap
        isVisible: false,
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10),
        isVisible: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // #region_A_start
    const GAUGE_THRESHOLDS = [50, 75, 100];
    const GAUGE_COLORS = ["#DD2222", "#FFCC22", "#22AA22"];
    const GAUGE_VALUE = 50 + Math.random() * 30; // random val for the gauge
    // add thin arcs, outlining the thresholds of the gauge
    GAUGE_THRESHOLDS.forEach((threshold, i) => {
        sciChartSurface.annotations.add(new PolarArcAnnotation({
            y1: 10, // outer radius
            y2: 9.7, // inner radius
            x1: GAUGE_THRESHOLDS[i - 1] || gaugeRange.min, // start angle -> 0 or previous threshold
            x2: threshold, // end angle -> current threshold
            fill: GAUGE_COLORS[i],
            strokeThickness: 0
        }));
    });
    // (optional) gray background Arc
    const backgroundArc = new PolarArcAnnotation({
        y1: 9.6, // outer radius
        y2: 7, // inner radius
        x1: gaugeRange.min, // start angle -> 0
        x2: gaugeRange.max, // end angle -> 100
        fill: "#88888822",
        strokeThickness: 0
    });
    // The Value Arc
    const valueArc = new PolarArcAnnotation({
        y1: 9.3, // outer radius
        y2: 7, // inner radius
        x1: gaugeRange.min, // start angle -> 0
        x2: GAUGE_VALUE, // current value (end of arc)
        strokeThickness: 0,
        // smart fill color based on the threshold it's in
        fill: GAUGE_COLORS.find((_, i) => GAUGE_VALUE <= GAUGE_THRESHOLDS[i])
    });
    sciChartSurface.annotations.add(backgroundArc, valueArc);
    // For more details, you can use either:
    // 1. PolarPointerAnnotation to show the current value
    const arrowPointer = new PolarPointerAnnotation({
        x1: GAUGE_VALUE, // pointer angle
        y1: 7, // pointer length
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        pointerStyle: {
            baseSize: 0.03,
            stroke: "#F00",
            fill: "#F00",
            backExtensionSize: 0.3, // how much the pointer extends back
        },
        pointerCenterStyle: {
            size: 0.2, // relative to the pointer length
            fill: "#111",
        }
    });
    sciChartSurface.annotations.add(arrowPointer);
    // 2. TextAnnotation to show the value in the center of the gauge
    const centeredText = new TextAnnotation({
        x1: 0,
        y1: 0, // centered at (0, 0)
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        text: `${GAUGE_VALUE.toFixed(2)}%`,
        fontSize: 50,
        textColor: GAUGE_COLORS.find((_, i) => GAUGE_VALUE <= GAUGE_THRESHOLDS[i]),
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
    });
    // sciChartSurface.annotations.add(centeredText); // uncomment to see it
    // #region_A_end
}
complexArc("scichart-root");
