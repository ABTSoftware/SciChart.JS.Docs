import * as SciChart from "scichart";
export async function drawSimplePieChartUsingGenericBuilderApi(divElementId) {
    // #region_A_start
    const { chartBuilder, ESciChartSurfaceType } = SciChart;
    const pieSurface = chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Pie2D,
        options: {
            segments: [
                { text: "This", value: 10, color: "red" },
                { text: "That", value: 5, color: "blue" },
                { text: "Other", value: 7, color: "green" }
            ]
        }
    });
    // #region_A_end
    return pieSurface;
}
export async function drawSimplePieChartUsingBuilderApi(divElementId) {
    // #region_B_start
    const { chartBuilder } = SciChart;
    const pieSurface = chartBuilder.buildPieChart(divElementId, {
        segments: [
            { text: "This", value: 10, color: "red" },
            { text: "That", value: 5, color: "blue" },
            { text: "Other", value: 7, color: "green" }
        ]
    });
    // #region_B_end
    return pieSurface;
}
drawSimplePieChartUsingBuilderApi("scichart-root");
