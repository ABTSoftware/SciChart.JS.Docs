import * as SciChart from "scichart";

export async function polarAxisDemo(rootElement) {
    // #region_A_start
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        PolarNumericAxis,
        PolarLineRenderableSeries,
        XyDataSeries,
        EPolarAxisMode,
        NumberRange,
        EAxisAlignment,
        EPolarLabelMode
    } = SciChart;

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });

    // Angular axis: goes around the circle, from 0 to 360 degrees
    const angularAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // Lines around the center
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Perpendicular,

        visibleRange: new NumberRange(0, 270),

        startAngleDegrees: 90,  // Start at 12 o'clock
        totalAngleDegrees: 270, // Sweep 270 degrees (3/4 circle)
        flippedCoordinates: true, // Clockwise

        labelPrecision: 0,
        autoTicks: false, // Take control over tick management
        majorDelta: 30,   // set Major ticks at every 30 units (degrees)

        majorGridLineStyle: {
            strokeThickness: 1,
        },
        minorGridLineStyle: {
            strokeThickness: 1,
            color: "rgba(50, 100, 255, 0.2)",
            strokeDashArray: [5, 3]
        }
    });
    sciChartSurface.xAxes.add(angularAxis);

    // Radial axis: from center outward, with circular gridlines
    const radialAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        gridlineMode: SciChart.EPolarGridlineMode.Circles, // Or Polygons for spider/radar

        innerRadius: 0.1, // 10% donut hole
        visibleRange: new NumberRange(0, 5),
        drawLabels: true,

        drawMinorGridLines: false,
    });
    sciChartSurface.yAxes.add(radialAxis);

    sciChartSurface.renderableSeries.add(
        new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 28 }, (_, i) => i * 10), // 0, 10, ..., 270
                yValues: Array.from({ length: 28 }, (_, i) => 1 + 3 * Math.abs(Math.sin((i * 10 * Math.PI) / 180)))
            }),
            stroke: "#FF6600",
            strokeThickness: 3,
        })
    );
    // #region_A_end
}

polarAxisDemo("scichart-root");