import * as SciChart from "scichart";

async function drawExample(divElementId) {
    // #region_A_start
    // Demonstrates how to configure PinchZoomModifier SciChart.js
    const { SciChartSurface, NumericAxis, PinchZoomModifier } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Create an X and Y Axis
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));

    const pinchZoomModifier = new PinchZoomModifier({
        horizontalGrowFactor: 0.001,
        verticalGrowFactor: 0.001,
        excludedXAxisIds: ["xAxis2"],
        includedYAxisIds: ["yAxis1"]
    });
    sciChartSurface.chartModifiers.add(pinchZoomModifier);
    // #region_A_end

    sciChartSurface.annotations.add(new SciChart.NativeTextAnnotation({
        text: "Pinch to Zoom if you are using a touch device",
        x1: 5,
        y1: 5,
        fontSize: 18,
        verticalAnchorPoint: SciChart.EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: SciChart.EHorizontalAnchorPoint.Center
    }));
    sciChartSurface.applyTheme(new SciChart.SciChartJsNavyTheme());
}

drawExample("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to configure a PinchZoom Modifier in SciChart.js using the Builder API
    const { chartBuilder, EChart2DModifierType } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        modifiers: [
            {
                type: EChart2DModifierType.PinchZoom,
                options: {
                    horizontalGrowFactor: 0.001,
                    verticalGrowFactor: 0.001,
                    excludedXAxisIds: ["xAxis2"],
                    includedYAxisIds: ["yAxis1"]
                }
            }
        ]
    });
    // #region_B_end

    return { wasmContext, sciChartSurface };
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
