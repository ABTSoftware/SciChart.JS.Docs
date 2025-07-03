import * as SciChart from "scichart";

async function polarChartLayout(divElementId) {
    // #region_A_start
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        NumberRange,
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
            visibleRange: new NumberRange(0, 360),

            drawMinorGridLines: false, // Disable minor grid lines for clarity
        })
    );
    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            visibleRange: new NumberRange(0, 10),

            labelPrecision: 0,
            drawMinorGridLines: false, // Disable minor grid lines for clarity
        })
    );
    // #region_A_end

    sciChartSurface.renderableSeries.add(
        new SciChart.PolarLineRenderableSeries(wasmContext, {
            dataSeries: new SciChart.XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 360 }, (_, i) => i), // 0 to 359 degrees
                yValues: Array.from({ length: 360 }, (_, i) => Math.sin(i / 6) * 4 + 5), // Sin wave with radius 4
            })
        })
    )
}

polarChartLayout("scichart-root");