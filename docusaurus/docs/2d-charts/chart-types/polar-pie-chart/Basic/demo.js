import * as SciChart from "scichart";
export async function PolarPieChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar pie chart using SciChart.js
    const { SciChartPolarSurface, PolarNumericAxis, PolarColumnRenderableSeries, EPolarAxisMode, NumberRange, XyxDataSeries, Thickness, EColumnMode, MetadataPaletteProvider, SciChartJsNavyTheme, EColumnDataLabelPosition, EPolarLabelMode, EMultiLineAlignment } = SciChart;
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
        flippedCoordinates: false, // set to true if you want to go clockwise (biggest values first, starting from 12 o'clock, clockwise)
        isVisible: false
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const DATA = [
        { xValue: 60, label: "First", color: "dodgerblue" },
        { xValue: 50, label: "Second", color: "orangered" },
        { xValue: 40, label: "Third", color: "darkorchid" },
        { xValue: 30, label: "Fourth", color: "salmon" },
        { xValue: 20, label: "Fifth", color: "darkolivegreen" },
        { xValue: 10, label: "Sixth", color: "indianred" }
    ];
    const metadata = [];
    const xValues = [];
    const x1Values = [];
    const yValues = [];
    let xSum = 0;
    DATA.forEach((item, i) => {
        xValues.push(xSum);
        x1Values.push(item.xValue);
        yValues.push(1);
        xSum += item.xValue;
        metadata.push({
            isSelected: false,
            fill: item.color, // each column will have a different color, handled by the MetadataPaletteProvider
            customLabel: item.label,
            value: item.xValue // add value for optional data-labels
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
        dataLabels: {
            metaDataSelector: (metadata) => {
                // @ts-ignore
                if (metadata.xValue < 25) {
                    // @ts-ignore
                    return metadata.customLabel + ' - ' + metadata.value + '%'; // keep smaller segments' label single-line
                }
                else {
                    // @ts-ignore
                    return metadata.customLabel + '\n' + metadata.value + '%';
                }
                // you can avoid the ts-ignore's with a custom point metadata interface casting with all values you'll use.
            },
            style: {
                fontSize: 16,
                multiLineAlignment: EMultiLineAlignment.Center,
                lineSpacing: 12
            },
            color: "#EEE",
            labelYPositionMode: EColumnDataLabelPosition.Inside,
            polarLabelMode: EPolarLabelMode.Perpendicular,
        }
    });
    sciChartSurface.renderableSeries.add(polarColumn);
    // #region_A_end
}
PolarPieChart("scichart-root");
