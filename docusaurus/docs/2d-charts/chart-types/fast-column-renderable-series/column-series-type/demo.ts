import * as SciChart from "scichart";

async function simpleColumnChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a Column chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        GradientParams,
        EDataPointWidthMode,
        Point,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create and add a column series
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            yValues: [0.1, 0.2, 0.4, 0.8, 1.1, 1.5, 2.4, 4.6, 8.1, 11.7, 14.4, 16, 13.7, 10.1, 6.4, 3.5, 2.5, 1.4, 0.4, 0.1]
        }),
        // When solid fill required, use fill
        fill: "rgba(176, 196, 222, 0.5)", 

        // When gradient fill required, use fillGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,0.77)", offset: 0 },
            { color: "rgba(70,130,180,0.0)", offset: 1 }
        ]),
        stroke: "#FFFFFF77",
        strokeThickness: 2,
        cornerRadius: 4, // optional cornerradius

        // Defines the relative width of columns
        dataPointWidth: 0.7,
        dataPointWidthMode: EDataPointWidthMode.Relative
    });

    sciChartSurface.renderableSeries.add(columnSeries);
    // #region_A_end
}

simpleColumnChart("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create a Column chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.ColumnSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                    yValues: [0.1, 0.2, 0.4, 0.8, 1.1, 1.5, 2.4, 4.6, 8.1, 11.7, 14.4, 16, 13.7, 10.1, 6.4, 3.5, 2.5, 1.4, 0.4, 0.1]
                },
                options: {
                    fill: "rgba(176, 196, 222, 0.5)",
                    stroke: "rgba(176, 196, 222, 1)",
                    strokeThickness: 2,
                    dataPointWidth: 0.7
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
