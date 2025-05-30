import {
    NumberRange,
    EColumnMode,
    EColumnYMode,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    FastRectangleRenderableSeries,
    XyxyDataSeries
} from "scichart";

async function basicRectangleSeriesChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // region_A_start
    const xValues = [0, 6, 10, 17];
    const yValues = [0, 6, 2, 5];
    const x1Values = [5, 9, 15, 25];
    const y1Values = [5, 9, 8, 10];

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        columnXMode: EColumnMode.StartEnd, // x, x1
        columnYMode: EColumnYMode.TopBottom, // y, y1
        fill: "cornflowerblue",
        stroke: "black",
        strokeThickness: 1,
        opacity: 0.5
    });

    // region_A_end

    sciChartSurface.renderableSeries.add(rectangleSeries);
}

basicRectangleSeriesChart("scichart-root");
