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
        visibleRange: new NumberRange(0, Math.PI * 2), // 0 to 2π radians
        labelProvider: new RadianLabelProvider({
            maxDenominator: 6, // 6 is the maximum denominator for fractions, e.g. π/6, 2π/3, but NOT 5π/12
            errorTolerance: 0.1, // since PI divisions are not exact, we allow a small error tolerance
        }),
        autoTicks: false, // take control over tick distance
        majorDelta: Math.PI / 6, // 30 degrees in radians
        totalAngle: Math.PI * 2, // this is the default value, but can be set to a different value if needed (e.g. Math.PI for a half-circle chart)
        startAngle: 0, // this is the default value, but can be set to a different value if needed (e.g. Math.PI / 2 to start at 12 o'clock)
        isInnerAxis: false, // whether to draw labels inside or outside of the polar chart
        flippedCoordinates: false, // whether to go clockwise or counter-clockwise (default is counter-clockwise)
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10),
        innerRadius: 0.2, // donut hole in the middle
        labelPrecision: 0,
        drawMinorGridLines: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // #region_A_end
    sciChartSurface.renderableSeries.add(new SciChart.PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new SciChart.XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 12 }, (_, i) => i * Math.PI / 6), // 0, π/6, ...,  3π/2
            yValues: [5, 6, 2, 3, 4, 7, 8, 6, 5, 9, 3, 7],
        }),
        stroke: "#FF6600",
        fill: "#FF660066",
        strokeThickness: 2,
        dataPointWidth: 0.4
    }));
}
polarChartLayout("scichart-root");
