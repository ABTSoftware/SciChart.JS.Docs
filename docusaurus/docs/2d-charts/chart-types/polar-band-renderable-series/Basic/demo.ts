import {
    SciChartPolarSurface,
    PolarNumericAxis,
    PolarBandRenderableSeries,
    EPolarAxisMode,
    NumberRange,
    XyyDataSeries,
    SciChartJsNavyTheme
} from "scichart";

export async function simpleBandChart(divElementId) {
    // #region_A_start
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 8),
        drawMinorGridLines: false
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        drawMinorGridLines: false,
        labelPrecision: 0,
        autoTicks: false,
        majorDelta: 1,
        innerRadius: 0.2
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // Define the polar band series
    const baiscBand = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 3, 4, 5, 6],
            yValues: [1, 2, 3, 4, 5, 6],
            y1Values: [6, 5, 1, 5, 4, 2]
        }),
        stroke: "rgba(200,200,30,1)", // yellow
        fill: "rgba(200,200,30,0.3)", // thin yellow
        strokeY1: "rgba(200,120,160,1)", // pink
        fillY1: "rgba(200,120,160,0.3)", // thin pink
        strokeThickness: 4,
        interpolateLine: false
    });
    sciChartSurface.renderableSeries.add(baiscBand);
    // #region_A_end

    return { sciChartSurface, wasmContext };
}

simpleBandChart("scichart-root");
