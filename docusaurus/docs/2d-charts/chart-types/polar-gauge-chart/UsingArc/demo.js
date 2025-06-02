import * as SciChart from "scichart";
async function drawGaugeChartArc(divElementId) {
    // #region_A_start
    // Demonstrates how to create a gauge chart using ArcAnnotation & PolarPointerAnnotation using SciChart.js
    const { SciChartPolarSurface, SciChartJsNavyTheme, NumberRange, PolarArcAnnotation, PolarNumericAxis, EPolarAxisMode, } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    // The gauge angle
    const gaugeTotalAngle = Math.PI * 1.2;
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
        visibleRange: new NumberRange(0, 10), // 0 - 10
        isVisible: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // (optional) add a gray background Arc
    const backgroundArc = new PolarArcAnnotation({
        y1: 10, // outer radius of the arc relative to the center of the gauge
        y2: 8, // inner radius of the arc
        x1: gaugeRange.min, // start angle -> 0
        x2: gaugeRange.max, // end angle -> 100
        fill: "#88888822",
        strokeThickness: 0
    });
    // The Value Arc
    const valueArc = new PolarArcAnnotation({
        y1: 10, // outer radius
        y2: 8, // inner radius
        x1: gaugeRange.min, // start angle -> 0
        x2: 50 + Math.random() * 30, // current value (end of arc)
        fill: "#3388FF",
        stroke: "#FFFFFF",
        strokeThickness: 3
    });
    sciChartSurface.annotations.add(backgroundArc, valueArc);
    // #region_A_end
}
drawGaugeChartArc("scichart-root");
