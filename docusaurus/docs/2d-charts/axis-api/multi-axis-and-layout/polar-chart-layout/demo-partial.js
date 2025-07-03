import * as SciChart from "scichart";
async function polarChartLayout(divElementId) {
    // #region_A_start
    const { SciChartPolarSurface, PolarNumericAxis, NumberRange, RadianLabelProvider, SciChartJsNavyTheme, EPolarAxisMode, } = SciChart;
    // Create a SciChartPolarSurface
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    // Add polar axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, Math.PI * 1.5), // 0 to 1.5π radians
        labelProvider: new RadianLabelProvider({
            maxDenominator: 3, // 3 is the maximum denominator for fractions, e.g. 2π/3, but NOT π/6
            errorTolerance: 0.001, // since PI divisions are not exact, we allow a small error tolerance
        }),
        autoTicks: false, // take control over tick distance
        majorDelta: Math.PI / 4, // 45 degrees in radians
        totalAngle: Math.PI * 1.5,
        // totalAngleDegrees: 270,  // same thing as Math.PI * 1.5 radians, but in degrees
        startAngle: -Math.PI / 4, // this is the default value, but can be set to a different value if needed (e.g. Math.PI / 2 to start at 12 o'clock)
        // startAngleDegrees: -45,  // same thing as -Math.PI/4 radians, but in degrees
        isInnerAxis: false, // whether to draw labels inside or outside of the polar chart
        flippedCoordinates: false, // whether to go clockwise or counter-clockwise (default is counter-clockwise)
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10),
        labelPrecision: 0,
        drawMinorGridLines: false,
        startAngle: -Math.PI / 4, // also match the radial labels to the start of the angular axis
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // optionally add some polar arcs to showcase the functionality of startAngle and totalAngle
    const arcThresholds = [1.8, 2.9, Math.PI * 1.5];
    const innerRadius = 7.5;
    const outerRadius = 9.5;
    sciChartSurface.annotations.add(new SciChart.PolarArcAnnotation({
        isEditable: true,
        x1: 0,
        x2: arcThresholds[0],
        y1: outerRadius,
        y2: innerRadius,
        fill: "rgba(213, 76, 96, 0.5)",
        stroke: "rgba(213, 76, 96, 1)",
        strokeThickness: 3,
    }), new SciChart.PolarArcAnnotation({
        isEditable: true,
        x1: arcThresholds[0],
        x2: arcThresholds[1],
        y1: outerRadius,
        y2: innerRadius,
        fill: "rgba(250, 252, 90, 0.5)",
        stroke: "rgba(250, 252, 90, 1)",
        strokeThickness: 3,
    }), new SciChart.PolarArcAnnotation({
        isEditable: true,
        x1: arcThresholds[1],
        x2: arcThresholds[2],
        y1: outerRadius,
        y2: innerRadius,
        fill: "rgba(136, 242, 136, 0.5)",
        stroke: "rgba(136, 242, 136, 1)",
        strokeThickness: 3,
    }));
    // #region_A_end
}
polarChartLayout("scichart-root");
