import { chartBuilder } from "scichart/Builder/chartBuilder";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";
import { ESeriesType } from "scichart/types/SeriesType";
import { EAxisType } from "scichart/types/AxisType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { NumberRange } from "scichart/Core/NumberRange";

import * as SciChart from "scichart";

export async function drawSimpleChartUsingBuilderApi(divElementId) {
    // #region_A_start
    const {
        chartBuilder,
        ESeriesType
    } = SciChart;

    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 3, 4, 7, 9],
                yValues: [10, 6, 7, 2, 16]
            }
        }
    });
    // #region_A_end
}

export async function drawComplexChartUsingBuilderApi(divElementId) {
    // #region_B_start
    const {
        chartBuilder,
        ESeriesType,
        EAxisType,
        EChart2DModifierType
    } = SciChart;

    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        surface: {
            theme: {
                type: EThemeProviderType.Light
            }
        },
        series: {
            type: ESeriesType.LineSeries,
            options: { stroke: "blue" },
            xyData: {
                xValues: [1, 3, 4, 7, 9],
                yValues: [10, 6, 7, 2, 16]
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Number of things",
                visibleRange: new NumberRange(0, 20),
                labelPrecision: 0
            }
        },
        modifiers: [
            { type: EChart2DModifierType.Rollover },
            { type: EChart2DModifierType.ZoomPan }
        ]
    });
    // #region_B_end
}
