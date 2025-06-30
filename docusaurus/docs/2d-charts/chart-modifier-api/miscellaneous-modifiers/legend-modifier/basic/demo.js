import { FastLineRenderableSeries, SciChartSurface, XyDataSeries, NumericAxis, NumberRange, LegendModifier, } from "scichart";
export async function legendModifierTs(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    const xLineValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yLine1Values = [0, 0.5, 1.3, 2.4, 3, 2.5, 2.2, 1.9, 1.2];
    const yLine2Values = [1, 1.1, 1.4, 1.3, 1.05, 0.8, 0.6, 0.5, 0.4];
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: 'red',
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: 'Red Series',
            xValues: xLineValues,
            yValues: yLine1Values
        })
    }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: 'green',
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: 'Green Series',
            xValues: xLineValues,
            yValues: yLine2Values
        })
    }));
    // Show the legend by adding a LegendModifier to the SciChartSurface.chartModifiers collection
    sciChartSurface.chartModifiers.add(new LegendModifier({
        showCheckboxes: true,
        showSeriesMarkers: true,
        showLegend: true
    }));
}
