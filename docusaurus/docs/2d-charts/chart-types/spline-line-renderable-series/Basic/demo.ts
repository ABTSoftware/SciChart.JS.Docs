import * as SciChart from "scichart";

async function simpleSplineLineChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a line chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SplineLineRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a spline line series
    const splineLineSeries = new SplineLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({length: 10}, (_, i) => i), // [0, 1, 2, ..., 9]
            yValues: Array.from({length: 10}, (_, i) => 0.2 * Math.sin(i) - Math.cos(i * 0.12))
        }),
        stroke: "#FF6600",
        strokeThickness: 5,
        // Set interpolation points to decide the amount of smoothing - the larger the number, the smoother the line
        interpolationPoints: 20,
        // Add a pointmarker to show where the datapoints are
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: "white",
            strokeThickness: 0
        })
    });

    sciChartSurface.renderableSeries.add(splineLineSeries);
    // #region_A_end

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleSplineLineChart("scichart-root");

async function builderExample(divElementId) {
    // #region_B_start
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.SplineLineSeries,
                xyData: {
                    xValues: Array.from({length: 10}, (_, i) => i), // [0, 1, 2, ..., 9]
                    yValues: Array.from({length: 10}, (_, i) => 0.2 * Math.sin(i) - Math.cos(i * 0.12))
                },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 5,
                    interpolationPoints: 20, // the larger the number, the smoother the line
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            fill: "white",
                            strokeThickness: 0
                        }
                    }
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
