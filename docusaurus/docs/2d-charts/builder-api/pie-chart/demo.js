import * as SciChart from "scichart";
export async function drawSimplePieChartUsingBuilderApi(divElementId) {
    // #region_B_start
    const { buildPieChart } = SciChart;
    const pieSurface = buildPieChart(divElementId, {
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
