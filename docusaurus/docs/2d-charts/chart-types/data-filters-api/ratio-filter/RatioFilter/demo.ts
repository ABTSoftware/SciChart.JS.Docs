import * as SciChart from "scichart";

export async function ratioFilter(divElementId) {
    // #region_A_start
    const {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        FastLineRenderableSeries,
        NumberRange,
        XyRatioFilter,
        LegendModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // The original series
    const originalSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [4, 3, 2, 4, 6],
        dataSeriesName: "Original"
    });
    // The divisor series. It must have the same number of points as the original series
    const divisorSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [1, 2, 0.5, 3, 5],
        dataSeriesName: "Divisor"
    });

    // Create the ratio filter, passing in the original series and the divisorSeries.
    // Each point in the result is originalSeries / divisorSeries
    const ratioSeries = new XyRatioFilter(originalSeries, {
        divisorSeries,
        dataSeriesName: "Ratio"
    });

    // Add the original, divisor and ratio series to the chart
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: originalSeries,
            stroke: "#5555ff",
            strokeThickness: 3
        }),
        new FastLineRenderableSeries(wasmContext, { dataSeries: divisorSeries, stroke: "#55dd55", strokeThickness: 3 }),
        new FastLineRenderableSeries(wasmContext, { dataSeries: ratioSeries, stroke: "#cc6600", strokeThickness: 3 })
    );

    // Add a LegendModifier to make it clear which line is which
    sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: false }));
    // #region_A_end
}

ratioFilter("scichart-root");
