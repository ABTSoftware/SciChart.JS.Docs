import {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    ZoomExtentsModifier,
    ZoomPanModifier,
    chartBuilder,
    EThemeProviderType,
    EAxisType,
    EChart2DModifierType
} from "scichart";

async function drawExample(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // #region_A_start
    // axes with the default layout
    const xAxis1 = new NumericAxis(wasmContext, {
        id: "xAxis1",
        axisTitle: "xAxis1",
        axisBorder: { border: 1, color: "green" }
    });
    const yAxis1 = new NumericAxis(wasmContext, {
        id: "yAxis1",
        axisTitle: "yAxis1",
        axisBorder: { border: 1, color: "yellow" }
    });

    // axes with custom thickness
    const xAxis2 = new NumericAxis(wasmContext, {
        id: "xAxis2",
        axisTitle: "xAxis2",
        axisBorder: { border: 1, color: "blue" },
        // highlight-next-line
        axisThickness: 100
    });
    const yAxis2 = new NumericAxis(wasmContext, {
        id: "yAxis2",
        axisTitle: "yAxis2",
        axisBorder: { border: 1, color: "red" },
        // highlight-next-line
        axisThickness: 100
    });
    // #region_A_end

    sciChartSurface.xAxes.add(xAxis1, xAxis2);
    sciChartSurface.yAxes.add(yAxis1, yAxis2);

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier());
}

drawExample("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to configure axis sizing in SciChart.js using the Builder API
    // import { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: { type: EThemeProviderType.Dark }
        },
        xAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "xAxis1",
                    axisTitle: "xAxis1",
                    axisBorder: { border: 1, color: "green" }
                }
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "xAxis2",
                    axisTitle: "xAxis2",
                    axisBorder: { border: 1, color: "blue" },
                    axisThickness: 100
                }
            }
        ],
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "yAxis1",
                    axisTitle: "yAxis1",
                    axisBorder: { border: 1, color: "yellow" }
                }
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "yAxis2",
                    axisTitle: "yAxis2",
                    axisBorder: { border: 1, color: "red" },
                    axisThickness: 100
                }
            }
        ],
        modifiers: [{ type: EChart2DModifierType.ZoomExtents }, { type: EChart2DModifierType.ZoomPan }]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
