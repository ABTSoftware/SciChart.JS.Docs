import * as SciChart from "scichart";
export async function PolarPieChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar pie chart using SciChart.js
    const { SciChartPolarSurface, PolarNumericAxis, PolarColumnRenderableSeries, EPolarAxisMode, NumberRange, XyxDataSeries, Thickness, EColumnMode, MetadataPaletteProvider, SciChartJsNavyTheme } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(20),
        theme: new SciChartJsNavyTheme(),
    });
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        visibleRangeLimit: new NumberRange(0, 1),
        polarAxisMode: EPolarAxisMode.Radial,
        startAngleDegrees: 90, // start at 12 o'clock
        isVisible: false
    });
    sciChartSurface.yAxes.add(radialYAxis);
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        startAngleDegrees: 90, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise (biggest values first, starting from 12 o'clock, clockwise)
        isVisible: false
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const COLORS = ["#CC0000", "#00CC00", "#0000CC", "#CCCC00", "#CC00CC", "#00CCCC"];
    const xWidthValues = [60, 50, 40, 30, 20, 10];
    const metadata = [];
    const xValues = [];
    const x1Values = [];
    const yValues = [];
    let xSum = 0;
    xWidthValues.forEach((v, i) => {
        xValues.push(xSum);
        x1Values.push(v);
        yValues.push(1);
        xSum += v;
        metadata.push({
            isSelected: false,
            fill: COLORS[i] // each column will have a different color, handled by the MetadataPaletteProvider
        });
    });
    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxDataSeries(wasmContext, {
            xValues,
            x1Values,
            yValues,
            metadata
        }),
        stroke: "#110533",
        strokeThickness: 2,
        columnXMode: EColumnMode.StartWidth, // makes columns span from x to x1 value
        paletteProvider: new MetadataPaletteProvider(), // use colors from the metadata for each column value
    });
    sciChartSurface.renderableSeries.add(polarColumn);
    // #region_A_end
}
PolarPieChart("scichart-root");
