import * as SciChart from "scichart";
export async function drawChartWithSharedDataSeries(divElementId) {
    // #region_A_start
    const { chartBuilder, ESeriesType } = SciChart;
    const DATA = {
        x: [1, 2, 3, 4, 5],
        col: [8, 2, 3, 7, 10],
        line: [10, 6, 7, 2, 16]
    };
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        series: [
            { type: ESeriesType.ColumnSeries, xyData: { xDataId: "x", yDataId: "col" } },
            { type: ESeriesType.LineSeries, xyData: { xDataId: "x", yDataId: "line" } },
        ],
        sharedData: DATA // pass the shared data object
    });
    // #region_A_end
}
export async function drawChartWithManuallyCreatedDataSeries(divElementId) {
    // #region_B_start
    const { chartBuilder, XyDataSeries, ESeriesType } = SciChart;
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            {
                type: ESeriesType.ColumnSeries,
                options: {
                    id: "columnSeries1",
                    stroke: "blue",
                    fill: "rgba(0, 0, 255, 0.3)"
                }
                // no "xyData" provided just yet, we will add it later
            }
        ]
    });
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [8, 2, 3, 7, 10]
    });
    // assign the dataSeries to the renderable series
    sciChartSurface.renderableSeries.get(0).dataSeries = dataSeries;
    // Alternatively, you can set the dataSeries by ID:
    // sciChartSurface.renderableSeries.getById("columnSeries1").dataSeries = dataSeries;
    // #region_B_end
}
export async function drawChartWithBuiltRenderableSeries(divElementId) {
    // #region_C_start
    const { chartBuilder, XyDataSeries, ESeriesType } = SciChart;
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            { type: ESeriesType.ColumnSeries, xyData: { xDataId: "x", yDataId: "col" } },
        ]
    });
    const seriesArray = chartBuilder.buildSeries(wasmContext, {
        type: ESeriesType.LineSeries,
        options: {
            stroke: "red",
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4, 5],
                yValues: [8, 2, 3, 7, 10]
            })
        }
    });
    sciChartSurface.renderableSeries.add(...seriesArray);
    // #region_C_end
}
