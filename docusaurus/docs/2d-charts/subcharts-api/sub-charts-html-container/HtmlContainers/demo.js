import * as SciChart from "scichart";
const xValues = [];
const yValues = [];
for (let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
}
async function simpleSubChart(divElementId) {
    // Demonstrates how to use the Sub-Charts API to create child charts in a parent chart
    const { SciChartSurface, SciChartSubSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme, Rect, ESubSurfacePositionCoordinateMode } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    // Create a parent (regular) SciChartSurface which will contain the sub-chart
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    // Create X,Y axis on the parent chart and programmatically zoom into part of the data
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    // Add a Sub-Charts to the main surface. This will display a rectangle showing the current zoomed in area on the parent chart
    const subChart1 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0.1, 0.1, 0.6, 0.4),
        isTransparent: false,
        isVisible: true,
        coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        title: "SubChart with HTML Elements",
        titleStyle: { fontSize: 16, color: "#eeeeee77" },
        // Specify the subChartContainer for extra HTML elements
        // These will be positioned by SciChartSubSurface
        // This property accepts a string or an HTMLDivElement
        subChartContainerId: "sub-chart-container-id-1"
    });
    // specify class names of section elements within the sub-chart container
    subChart1.topSectionClass = "top-section";
    subChart1.leftSectionClass = "left-section";
    subChart1.bottomSectionClass = "bottom-section";
    subChart1.rightSectionClass = "right-section";
    // #region_A_end
    // Add x,y axis to the subchart
    subChart1.xAxes.add(new NumericAxis(wasmContext));
    subChart1.yAxes.add(new NumericAxis(wasmContext));
    // Add a series to the subchart
    subChart1.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: "#47bde6",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        })
    }));
}
simpleSubChart("scichart-root");
async function builderExample(divElementId) {
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EAxisType, EThemeProviderType, Rect, ESubSurfacePositionCoordinateMode } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"
    // #region_B_start
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        // Main chart definition is here
        xAxes: { type: EAxisType.NumericAxis },
        yAxes: { type: EAxisType.NumericAxis },
        // Subchart definition is here
        subCharts: [
            {
                surface: {
                    position: new Rect(0.1, 0.1, 0.6, 0.4),
                    isTransparent: false,
                    isVisible: true,
                    coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
                    title: "SubChart with HTML Elements",
                    titleStyle: { fontSize: 16, color: "#eeeeee77" },
                    // Specify the subChartContainer for extra HTML elements
                    // These will be positioned by SciChartSubSurface
                    // This property accepts a string or an HTMLDivElement
                    subChartContainerId: "sub-chart-container-id-1"
                },
                // Define the x,y axis on Subchart
                xAxes: { type: EAxisType.NumericAxis },
                yAxes: { type: EAxisType.NumericAxis },
                // Define the series on Subchart
                series: [
                    {
                        type: ESeriesType.LineSeries,
                        xyData: {
                            xValues,
                            yValues: yValues
                        },
                        options: {
                            stroke: "#0066FF",
                            strokeThickness: 5
                        }
                    }
                ]
            }
        ]
    });
    // #region_B_end
}
