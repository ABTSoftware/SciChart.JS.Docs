import * as SciChart from "scichart";

export async function PolarPanModifier(divElementId) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        PolarZoomExtentsModifier,
        EPolarAxisMode,
        PolarMountainRenderableSeries
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular
        })
    );
    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            drawMinorGridLines: false,
            autoTicks: false,
            majorDelta: 0.5,
            visibleRange: new NumberRange(-1, 1)
        })
    );

    sciChartSurface.renderableSeries.add(
        new PolarMountainRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 10 }, (_, i) => i),
                yValues: Array.from({ length: 10 }, (_, i) => Math.cos(i * 0.3))
            }),
            interpolateLine: true,
        })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "PolarPanModifier",
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
            text: "Click & drag to see results.",
            x1: 0,
            y1: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            yCoordShift: 30,
            opacity: 0.45,
            fontSize: 17
        }),
        new TextAnnotation({
            text: "Also try Ctrl + Click & drag for the Cartesian pan mode.",
            x1: 0,
            y1: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            yCoordShift: 50,
            opacity: 0.45,
            fontSize: 17
        })
    );

    // #region_A_start
    const { PolarPanModifier, EPolarPanModifierPanMode } = SciChart;
    // or for npm: import { PolarPanModifier } from "scichart";

    // Add PolarPanModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(
        new PolarPanModifier({
            primaryPanMode: EPolarPanModifierPanMode.PolarStartAngle,

            secondaryPanMode: EPolarPanModifierPanMode.Cartesian,
            
            secondaryExecuteCondition: {
                key: SciChart.EModifierMouseArgKey.Ctrl
            }
        }),
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new PolarZoomExtentsModifier() // optional - double click to reset
    );
}

PolarPanModifier("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to configure the PolarPanModifier in SciChart.js using the Builder API
    const { 
        chartBuilder, 
        EThemeProviderType, 
        EAxisType, 
        EChart2DModifierType, 
        EActionType, 
        EPolarAxisMode 
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: { 
            type: EAxisType.PolarNumericAxis, 
            options: { polarAxisMode: EPolarAxisMode.Angular } 
        },
        yAxes: { 
            type: EAxisType.PolarNumericAxis, 
            options: { polarAxisMode: EPolarAxisMode.Radial } 
        },
        modifiers: [
            {
                type: EChart2DModifierType.PolarPan,
                options: {
                    growFactor: 0.002,
                    zoomSize: false,
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
