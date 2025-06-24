import * as SciChart from "scichart";

export async function PolarZoomExtents(divElementId) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        XyDataSeries,
        SciChartJsNavyTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        PolarColumnRenderableSeries,
        PolarPanModifier,
        PolarMouseWheelZoomModifier,
        EAxisAlignment
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Left,
            innerRadius: 0.1,
            startAngleDegrees: 90,
            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            autoTicks: false,
            majorDelta: 1,
        })
    );
    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Bottom,
            startAngleDegrees: 90,
        })
    );

    sciChartSurface.renderableSeries.add(
        new PolarColumnRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            fill: "#50C7E044",
            strokeThickness: 2,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 5 }, (_, i) => i),
                yValues: Array.from({ length: 5 }, (_, i) => 1 + Math.sin(i * 0.3))
            }),
            dataPointWidth: 0.8
        })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "PolarZoomExtentsModifier",
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
        }),
        new TextAnnotation({
            text: "Double-click to reset chart scale / rotation / zoom",
            x1: 0,
            y1: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            yCoordShift: 30,
            opacity: 0.45,
            fontSize: 17
        })
    );

    // #region_A_start
    const { PolarZoomExtentsModifier, Point } = SciChart;
    // or for npm: import { PolarZoomExtentsModifier } from "scichart";

    sciChartSurface.chartModifiers.add(
        // Zoom Extents Modifier:
        new PolarZoomExtentsModifier({
            centerPoint: new Point(0, 0),
            animationDuration: 1000,
            innerRadius: 0.2,
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        // needed to be able to change pan level & see effect of zoom extents
        new PolarPanModifier(),
        new PolarMouseWheelZoomModifier(),
    );
}

PolarZoomExtents("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to configure the PolarZoomExtentsModifier in SciChart.js using the Builder API
    const { 
        chartBuilder, 
        EAxisAlignment, 
        EThemeProviderType, 
        EAxisType, 
        EChart2DModifierType, 
        EPolarAxisMode,
        Point,
        ESeriesType
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Radial,
                    axisAlignment: EAxisAlignment.Left,
                    innerRadius: 0.1,
                    startAngleDegrees: 90
                }
            }
        ],
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    polarAxisMode: EPolarAxisMode.Angular,
                    axisAlignment: EAxisAlignment.Bottom,
                    startAngleDegrees: 90
                }
            }
        ],
        series: {
            type: ESeriesType.PolarColumnSeries,
            options: {
                stroke: "#50C7E0",
                fill: "#50C7E044",
                strokeThickness: 2,
            },
            xyData: {
                xValues: Array.from({ length: 5 }, (_, i) => i),
                yValues: Array.from({ length: 5 }, (_, i) => 1 + Math.sin(i * 0.3))
            }
        },
        modifiers: [
            {
                type: EChart2DModifierType.PolarZoomExtents,
                options: {
                    xStartAngle: Math.PI / 4,
                    yStartAngle: 0,
                    totalAngle: Math.PI * 2,
                    centerPoint: new Point(0, 0),
                    animationDuration: 1000
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
