import * as SciChart from "scichart";

export async function PolarTriangleChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar triangle series chart using SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarTextRenderableSeries,
        EPolarAxisMode,
        XyTextDataSeries,
        SciChartJsNavyTheme,
        NumberRange
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10),
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 20),
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const textSeries = new PolarTextRenderableSeries(wasmContext, {
        dataSeries: new XyTextDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            yValues: [3, 5, 6, 4, 2, 5],
            textValues: ["This", "text", "is", "drawn", "using", "FastTextRenderableSeries"]
        }),
        // font and size is required for text to be drawn
        dataLabels: {
            style: {
                fontSize: 18
            },
            color: "#ffffff"
        }
    });
    sciChartSurface.renderableSeries.add(textSeries);
    // #region_A_end
}

PolarTriangleChart("scichart-root");