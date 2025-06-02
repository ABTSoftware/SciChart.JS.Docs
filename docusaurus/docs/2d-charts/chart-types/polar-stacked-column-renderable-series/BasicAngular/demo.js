import * as SciChart from "scichart";
export async function polarStackedColumnChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const { SciChartPolarSurface, PolarNumericAxis, SciChartJsNavyTheme, PolarStackedColumnCollection, PolarStackedColumnRenderableSeries, EPolarAxisMode, NumberRange, XyDataSeries, } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // Angular == "goes around the center, drawn by arcs"
        visibleRange: new NumberRange(0, 10), // to keep column #1 and #10 from touching
        flippedCoordinates: true, // go clockwise
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial, // Radial == "goes from center out, drawn by straight lines"
        innerRadius: 0.1, // donut hole
        labelPrecision: 0, // no decimals
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // Create the collection the stacked columns will be added to
    const polarCollection = new PolarStackedColumnCollection(wasmContext, {
        isOneHundredPercent: false // set to true to make columns stack to 100%
    });
    const polarColumn1 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            yValues: Array.from({ length: 10 }, (_, i) => Math.random() * 11 + 1)
        }),
        fill: "#FF3344AA",
        stroke: "white",
        strokeThickness: 2,
    });
    const polarColumn2 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            yValues: Array.from({ length: 10 }, (_, i) => Math.random() * 2 + 1)
        }),
        fill: "#5588FFAA",
    });
    // Add the columns to the collection
    polarCollection.add(polarColumn1, polarColumn2);
    // Add the columns to the collection
    sciChartSurface.renderableSeries.add(polarCollection);
    // #region_A_end
    return { sciChartSurface, wasmContext };
}
polarStackedColumnChart("scichart-root");
