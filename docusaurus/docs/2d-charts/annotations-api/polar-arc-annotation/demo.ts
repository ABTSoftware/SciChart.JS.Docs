import * as SciChart from "scichart";

async function addAnnotationToChart(divElementId) {
    // #region_A_start
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        NumberRange,
        PolarArcAnnotation,
        SciChartJsNavyTheme,
        EPolarAxisMode,
    } = SciChart;

    // Create a SciChartPolarSurface
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // Add polar axes
    sciChartSurface.xAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(0, 360) 
        })
    );
    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            visibleRange: new NumberRange(0, 10)
        })
    );

    // Add a selection of PolarArcAnnotations to the chart
    sciChartSurface.annotations.add(
        // Filled Sector Annotation from 45 to 135 degrees
        new PolarArcAnnotation({
            isEditable: true,
            x1: 45, // Start Angle
            x2: 135, // End Angle
            y1: 8, // Outer Radius
            y2: 4, // Inner Radius
            fill: "rgba(255, 165, 0, 0.3)",
            stroke: "#FFA500",
            strokeThickness: 2,
        }),
        // Arc Line Annotation from 225 to 315 degrees
        new PolarArcAnnotation({
            isEditable: true,
            isLineMode: true,
            x1: 225, // Start Angle
            x2: 315, // End Angle
            y1: 9, // Radius
            // No need for y2 when `isLineMode` is true
            stroke: "#3388FF",
            strokeThickness: 3,
        })
    );
    // #region_A_end
}

addAnnotationToChart("scichart-root");