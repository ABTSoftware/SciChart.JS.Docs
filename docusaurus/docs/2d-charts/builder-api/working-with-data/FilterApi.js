import * as SciChart from "scichart";
export async function drawChartWithFilterUsingBuilderApi(divElementId) {
    // #region_A_start
    const { chartBuilder, ESeriesType, EDataFilterType } = SciChart;
    const xyData = {
        xValues: [1, 2, 3, 4, 5, 6],
        yValues: [2, 5, 7, 4, 10, 15]
    };
    chartBuilder.buildChart(divElementId, {
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData,
            },
            {
                type: ESeriesType.LineSeries,
                options: { stroke: "red" },
                xyData: {
                    ...xyData,
                    filter: { type: EDataFilterType.XyLinearTrend }
                }
            }
        ]
    });
    // #region_A_end
}
