import * as SciChart from "scichart";

async function polarAxisStyling(divElementId) {
    // #region_A_start
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        NumberRange,
        SciChartJsNavyTheme,
        EPolarAxisMode,
        EPolarGridlineMode,
        PolarCategoryAxis,
        EPolarLabelMode
    } = SciChart;

    // Create a SciChartPolarSurface
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // Add polar axes
    const TOTAL_ANGLE = Math.PI * 1.5; // 270 degrees in radians (3 quarters of a circle)

    sciChartSurface.xAxes.add(
        new PolarCategoryAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(0, 9),

            totalAngle: TOTAL_ANGLE, // in radians
            // totalAngleDegrees: 270, // if you want to work in degrees

            flippedCoordinates: true, // increment clockwise
            startAngle: (Math.PI - TOTAL_ANGLE) / 2, // formula to center incomplete polar surfaces like gauges ("with the missing slice at the bottom")

            autoTicks: false, // take control over tick distance
            majorDelta: 1,    // draw tick every 1 unit

            // minor gridlines turned off look better when radial axis gridlineMode is set to `Polygons`
            drawMinorGridLines: false,

            majorTickLineStyle: { // optionally style major ticks
                color: "#FFFFFF",
                tickSize: 2,
                strokeThickness: 2,
            },

            majorGridLineStyle: { // optionally style major grid lines
                color: "rgba(12,17,53,1)",
                strokeThickness: 1,
                strokeDashArray: [5, 2], // dashed lines
            },

            labels: ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"],
            labelStyle: {
                color: "#FFFFFF",
            },
            polarLabelMode: EPolarLabelMode.Parallel // can also be "Perpendicular", or (the default) "Horizontal" 
        })
    );

    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            visibleRange: new NumberRange(0, 10),
            gridlineMode: EPolarGridlineMode.Polygons, // results in a radar chart look (straight radial lines in between grid lines)

            startAngle: (Math.PI - TOTAL_ANGLE) / 2, // match the radial labels to the start of the angular axis
            labelPrecision: 0,

            majorGridLineStyle: { // optionally style major grid lines
                color: "rgba(12,17,53,1)",
                strokeThickness: 1,
                strokeDashArray: [5, 2], // dashed lines
            },
        })
    );
    // #region_A_end
}

polarAxisStyling("scichart-root");