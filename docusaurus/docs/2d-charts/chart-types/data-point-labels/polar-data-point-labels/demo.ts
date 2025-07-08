import * as SciChart from "scichart";

async function dataLabelsBasicExample(divElementId: string | HTMLDivElement) {
    // #region_A_start
    // Demonstrates how to add DataLabels to a Polar chart with SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EHorizontalTextPosition,
        EVerticalTextPosition,
        PolarMountainRenderableSeries,
        EDataLabelSkipMode,
        SciChartJsNavyTheme,
        XyDataSeries,
        NumberRange,
        Thickness
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    
    // Add the yAxis
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 5),
        drawLabels: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    
    // Add the xAxis
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    // Add mountain:
    const mountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 9 }, (_, i) => i),
            yValues: [ 4, 4.2, 3.5, 1.6, 3.8, 4, 1.8, 4.7, 4 ]
        }),
        stroke: "#CC7700",
        fill: "#CC770044",
        strokeThickness: 4,
        dataLabels: {
            color: "#FFFFFF",
            style: {
                fontSize: 16,
                padding: new Thickness(0, 0, 20, 0), // raise the labels by adding a bit of bottom padding
            },
            precision: 2, // 2 decimal places
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Above,
            skipMode: EDataLabelSkipMode.ShowAll
        },
    })
    sciChartSurface.renderableSeries.add(mountain);
    // #region_A_end

    return { sciChartSurface, wasmContext };
}

dataLabelsBasicExample("scichart-root");

async function builderExample(divElementId) {
    // #region region_B_start
    // Demonstrates how to add DataLabels to a Polar chart with SciChart.js using the Builder API
    const { 
        chartBuilder, 
        ESeriesType, 
        EThemeProviderType, 
        EHorizontalTextPosition,
        EVerticalTextPosition,
        EDataLabelSkipMode 
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.PolarMountainSeries,
                xyData: {
                    xValues: Array.from({ length: 9 }, (_, i) => i),
                    yValues: [4, 4.2, 3.5, 1.6, 3.8, 4, 1.8, 4.7, 4]
                },
                options: {
                    dataLabels: {
                        color: "#EEE",
                        style: {
                            fontSize: 16,
                            padding: { top: 0, right: 0, bottom: 20, left: 0 } // raise the labels by adding a bit of bottom padding
                        },
                        precision: 2, // 2 decimal places
                        horizontalTextPosition: EHorizontalTextPosition.Center,
                        verticalTextPosition: EVerticalTextPosition.Above,
                        skipMode: EDataLabelSkipMode.ShowAll
                    },
                    stroke: "#CC7700",
                    fill: "#CC770044",
                    strokeThickness: 4,
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
