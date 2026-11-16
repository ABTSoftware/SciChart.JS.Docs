import * as SciChart from "scichart";

async function radarChart(divElementId) {
    // #region_A_start
    // Create a JavaScript radar chart (spider chart) with SciChart.js
    const {
        SciChartPolarSurface,
        PolarCategoryAxis,
        PolarNumericAxis,
        PolarMountainRenderableSeries,
        XyDataSeries,
        NumberRange,
        EPolarAxisMode,
        EPolarGridlineMode,
        SciChartJsNavyTheme,
        PolarCursorModifier,
        PolarLegendModifier,
        PolarMouseWheelZoomModifier,
        PolarZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // The variables being compared: one spoke (angular axis category) each
    const variables = ["Battery life", "Camera", "Screen", "Performance", "Storage", "Value for money"];

    sciChartSurface.xAxes.add(
        new PolarCategoryAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            labels: variables,
            startAngle: Math.PI / 2, // first spoke at 12 o'clock
            flippedCoordinates: true, // go clockwise
            majorGridLineStyle: { color: "#88888866" },
            drawMinorGridLines: false
        })
    );

    // The value scale, from the centre (0) out to the edge (10)
    const radialAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            gridlineMode: EPolarGridlineMode.Polygons, // straight-sided rings: the radar / spider web look
            visibleRange: new NumberRange(0, 10),
            startAngle: Math.PI / 2, // rings line up with the spokes; value labels sit on the first spoke
            autoTicks: false,
            majorDelta: 2, // label every second value: 0, 2, 4 … 10
            labelPrecision: 0,
            majorGridLineStyle: { color: "#88888866" },
            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false
        });
    // Hide the "10" label: it would sit on top of the first spoke's name
    radialAxis.labelProvider.formatLabel = (value: number) => (value >= 10 ? "" : value.toFixed(0));
    sciChartSurface.yAxes.add(radialAxis);

    // Your data: one score per variable for each item you are comparing (higher is better on every spoke)
    const items = [
        { name: "Phone A", scores: [9, 6, 7, 5, 6, 8], stroke: "#50C7E0", fill: "#50C7E044" },
        { name: "Phone B", scores: [5, 9, 9, 9, 8, 3], stroke: "#F48420", fill: "#F4842044" }
    ];

    for (const item of items) {
        sciChartSurface.renderableSeries.add(
            new PolarMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    // Repeat the first point at the end to close the polygon
                    xValues: [...variables.map((_, i) => i), variables.length],
                    yValues: [...item.scores, item.scores[0]],
                    dataSeriesName: item.name
                }),
                stroke: item.stroke,
                fill: item.fill,
                strokeThickness: 3
            })
        );
    }

    // Hover for values, scroll to zoom, double-click to reset, and a legend to show or hide each item
    sciChartSurface.chartModifiers.add(
        new PolarCursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            // Show the variable's name and each item's score on it
            // seriesInfos is empty until the cursor is over a point, so check before reading it
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos.length === 0
                    ? []
                    : [
                          variables[seriesInfos[0].dataSeriesIndex % variables.length],
                          ...seriesInfos.map((info) => `${info.seriesName}: ${info.yValue}`)
                      ]
        }),
        new PolarMouseWheelZoomModifier(),
        new PolarZoomExtentsModifier(),
        new PolarLegendModifier({ showCheckboxes: true, showSeriesMarkers: true })
    );
    // #region_A_end
}

radarChart("scichart-root");
