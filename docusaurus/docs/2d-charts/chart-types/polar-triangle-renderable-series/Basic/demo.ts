import * as SciChart from "scichart";

export async function PolarTriangleChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a basic polar triangle series chart using SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarTriangleRenderableSeries,
        EPolarAxisMode,
        XyDataSeries,
        EFillPaletteMode,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        ETriangleSeriesDrawMode,
        NumberRange
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 5),
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const triangle = new PolarTriangleRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { 
            xValues: [0, 2, 3, 4], 
            yValues: [0, 1, 2, 3] 
        }),
        fill: "green",
        drawMode: ETriangleSeriesDrawMode.Polygon,
    });
    sciChartSurface.renderableSeries.add(triangle);
    // #region_A_end
}

PolarTriangleChart("scichart-root");