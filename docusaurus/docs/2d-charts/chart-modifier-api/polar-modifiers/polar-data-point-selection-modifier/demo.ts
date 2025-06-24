import * as SciChart from "scichart";

async function PolarArcZoom(divElementId) {
    const {
        SciChartPolarSurface,
        EPolarAxisMode,
        PolarNumericAxis,
        NumberRange,
        SciChartJsNavyTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
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
            visibleRange: new NumberRange(0, 1),
            drawMinorGridLines: false,
        })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "PolarDataPointSelectionModifier",
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
        })
    );

    // #region_A_start
    const { 
        PolarDataPointSelectionModifier, 
        DataPointSelectionPaletteProvider,
        PolarLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
    } = SciChart;
    // or for npm: import { PolarDataPointSelectionModifier } from "scichart";

    // const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {})
    // ...

    // Add a series with point markers & a DataPointSelectionPaletteProvider to see the selection effect
    sciChartSurface.renderableSeries.add(
        new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 10 }, (_, i) => i),
                yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1))
            }),
            stroke: "#FFAA00",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 12,
                height: 12,
                fill: "#000000",
                stroke: "#FFAA00",
                strokeThickness: 2,
            }),
            paletteProvider: new DataPointSelectionPaletteProvider({
                fill: "#FFFFFF",
                stroke: "#FFAA00", // keep the same
            })
        })
    );

    // Add PolarDataPointSelectionModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(
        new PolarDataPointSelectionModifier({
            allowDragSelect: true,
            allowClickSelect: true,
            selectionStroke: "#3388FF",
            selectionFill: "#3388FF44",
            onSelectionChanged: (args) => {
                console.log("seriesSelectionModifier onSelectionChanged", args);
            },
        }),
    );
    // #region_A_end
}

PolarArcZoom("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
    const { 
        chartBuilder, 
        EThemeProviderType, 
        EAxisType, 
        EChart2DModifierType, 
        easing, 
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
            options: { polarAxisMode: EPolarAxisMode.Angular } 
        },
        modifiers: [
            {
                type: EChart2DModifierType.PolarArcZoom, // TODO
                options: {
                    isAnimated: true,
                    fill: "#00ffff33",
                    strokeThickness: 5,
                    stroke: "red",
                    animationDuration: 2000,
                    easingFunction: easing.outCubic
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
