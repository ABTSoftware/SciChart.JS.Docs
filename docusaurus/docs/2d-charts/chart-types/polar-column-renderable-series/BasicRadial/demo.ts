import * as SciChart from "scichart";

export async function polarRadialColumnChart(divElementId) {
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const { 
        SciChartPolarSurface, 
        SciChartJsNavyTheme,
        PolarNumericAxis, 
        PolarColumnRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        XyDataSeries, 
        EColumnDataLabelPosition
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // #region_A_start
    const radialXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial, // radial axis -> xAxis
        axisAlignment: EAxisAlignment.Right,
        innerRadius: 0.1,
        startAngle: 0,
    });
    sciChartSurface.xAxes.add(radialXAxis);

    const angularYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // angular axis -> yAxis
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 10),
        useNativeText: true,
        startAngle: 0,
        totalAngle: Math.PI, // 180 degrees
        flippedCoordinates: true, // go clockwise
    });
    sciChartSurface.yAxes.add(angularYAxis);

    // The Polar renderable series do not require extra config, only control the Angular / Radial look.
    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            yValues: [6.6, 8.7, 3.5, 5.7, 3.8, 6.8]
        }),
        stroke: "white",
        fill: "#0088FF66",
        strokeThickness: 2,
        dataPointWidth: 0.8,
        dataLabels: { // optionally - add data labels
            color: "white",
            style: {
                fontSize: 14,
            },
            polarLabelMode: EPolarLabelMode.Parallel,
            labelYPositionMode: EColumnDataLabelPosition.Outside,
        },
    });
    sciChartSurface.renderableSeries.add(polarColumn);
    // #region_A_end
    
    return { sciChartSurface, wasmContext };
}

polarRadialColumnChart("scichart-root");