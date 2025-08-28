// @ts-nocheck -> will be valid once a new PR is merged and released
import * as SciChart from "scichart";
async function PolarSeriesSelectionExample(divElementId) {
    const { SciChartPolarSurface, EPolarAxisMode, PolarNumericAxis, NumberRange, SciChartJsNavyTheme, TextAnnotation, ECoordinateMode, EHorizontalAnchorPoint, EVerticalAnchorPoint, } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular
    }));
    sciChartSurface.yAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 1),
        drawMinorGridLines: false,
    }));
    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "PolarSeriesSelectionModifier",
        x1: 0,
        y1: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        yCoordShift: -20,
        opacity: 0.33,
        fontSize: 36,
        fontWeight: "Bold"
    }), new TextAnnotation({
        text: "Select a region to highlight points within it",
        x1: 0,
        y1: 0,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        yCoordShift: 30,
        opacity: 0.45,
        fontSize: 17
    }));
    // #region_A_start
    const { PolarSeriesSelectionModifier, PolarLineRenderableSeries, XyDataSeries, } = SciChart;
    // or for npm: import { PolarSeriesSelectionModifier } from "scichart";
    // const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {})
    // ...
    // Add 2 series
    sciChartSurface.renderableSeries.add(new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 10 }, (_, i) => i),
            yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1))
        }),
        stroke: "#FFAA00",
        strokeThickness: 3,
        onSelectedChanged: (sourceSeries) => {
            sourceSeries.stroke = sourceSeries.isSelected ? "white" : "#FFAA00";
        },
        onHoveredChanged: (sourceSeries) => {
            sourceSeries.stroke = sourceSeries.isHovered ? "gray" : "#FFAA00";
        },
    }), new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 10 }, (_, i) => i),
            yValues: Array.from({ length: 10 }, (_, i) => Math.cos(i * 0.1))
        }),
        stroke: "#3388FF",
        strokeThickness: 3,
        onSelectedChanged: (sourceSeries) => {
            sourceSeries.stroke = sourceSeries.isSelected ? "white" : "#3388FF";
        },
        onHoveredChanged: (sourceSeries) => {
            sourceSeries.stroke = sourceSeries.isHovered ? "gray" : "#3388FF";
        },
    }));
    // Add PolarSeriesSelectionModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(new PolarSeriesSelectionModifier());
    // #region_A_end
}
PolarSeriesSelectionExample("scichart-root");
async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to configure the PolarSeriesSelection in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType, ESeriesType, EPolarAxisMode, } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.PolarNumericAxis,
            options: { polarAxisMode: EPolarAxisMode.Angular }
        },
        yAxes: {
            type: EAxisType.PolarNumericAxis,
            options: { polarAxisMode: EPolarAxisMode.Angular }
        },
        series: [
            {
                type: ESeriesType.PolarLineSeries,
                xyData: {
                    xValues: Array.from({ length: 10 }, (_, i) => i),
                    yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1))
                },
                options: {
                    stroke: "#FFAA00",
                    strokeThickness: 3,
                    onSelectedChanged: (sourceSeries) => {
                        sourceSeries.stroke = sourceSeries.isSelected ? "white" : "#FFAA00";
                    },
                    onHoveredChanged: (sourceSeries) => {
                        sourceSeries.stroke = sourceSeries.isHovered ? "gray" : "#FFAA00";
                    }
                }
            },
            {
                type: ESeriesType.PolarLineSeries,
                xyData: {
                    xValues: Array.from({ length: 10 }, (_, i) => i),
                    yValues: Array.from({ length: 10 }, (_, i) => Math.cos(i * 0.1))
                },
                options: {
                    stroke: "#3388FF",
                    strokeThickness: 3,
                    onSelectedChanged: (sourceSeries) => {
                        sourceSeries.stroke = sourceSeries.isSelected ? "white" : "#3388FF";
                    },
                    onHoveredChanged: (sourceSeries) => {
                        sourceSeries.stroke = sourceSeries.isHovered ? "gray" : "#3388FF";
                    }
                }
            },
        ],
        modifiers: [
            {
                type: EChart2DModifierType.PolarSeriesSelection
            }
        ]
    });
    // #region_B_end
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
